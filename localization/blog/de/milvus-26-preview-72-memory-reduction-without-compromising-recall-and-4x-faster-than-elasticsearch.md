---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Milvus 2.6 Vorschau: 72% Speicherreduzierung ohne Kompromisse beim Abruf und
  4x schneller als Elasticsearch
author: Ken Zhang
date: 2025-05-16T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Erhalten Sie einen exklusiven ersten Blick auf die Neuerungen im kommenden
  Milvus 2.6, das die Leistung und Effizienz von Vektordatenbanken neu
  definieren wird.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Im Laufe dieser Woche haben wir eine Reihe von spannenden Innovationen in Milvus vorgestellt, die die Grenzen der Vektordatenbanktechnologie erweitern:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vektorsuche in der realen Welt: Wie man effizient filtert, ohne den Rückruf zu zerstören </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten </a></p></li>
</ul>
<p>Zum Abschluss unserer Milvus-Wochenreihe freue ich mich, Ihnen einen kleinen Einblick in Milvus 2.6 zu geben - einen entscheidenden Meilenstein in unserer Produkt-Roadmap für 2025, die sich derzeit in der Entwicklung befindet - und Ihnen zu zeigen, wie diese Verbesserungen die KI-gestützte Suche verändern werden. Die kommende Version vereint all diese Innovationen und mehr in drei entscheidenden Bereichen: <strong>Optimierung der Kosteneffizienz</strong>, <strong>erweiterte Suchfunktionen</strong> und <strong>eine neue Architektur</strong>, die die Vektorsuche über die 10-Milliarden-Vektorskala hinaus erweitert.</p>
<p>Lassen Sie uns in einige der wichtigsten Verbesserungen eintauchen, die Sie erwarten können, wenn Milvus 2.6 im Juni dieses Jahres erscheint. Wir beginnen mit dem, was sich am unmittelbarsten auswirkt: drastische Reduzierung der Speichernutzung und der Kosten sowie ultraschnelle Leistung.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Kosten-Reduzierung: Geringere Speichernutzung bei höherer Leistung<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Abhängigkeit von teurem Speicher stellt eines der größten Hindernisse bei der Skalierung der Vektorsuche auf Milliarden von Datensätzen dar. Mit Milvus 2.6 werden mehrere wichtige Optimierungen eingeführt, die Ihre Infrastrukturkosten drastisch senken und gleichzeitig die Leistung verbessern.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1-Bit-Quantisierung: 72% Speicherreduzierung mit 4× QPS und ohne Recall-Verlust</h3><p>Der Speicherverbrauch ist seit langem die Achillesferse von großen Vektordatenbanken. Die Vektorquantisierung ist zwar nicht neu, aber die meisten bestehenden Ansätze opfern zu viel Suchqualität für Speichereinsparungen. Milvus 2.6 wird diese Herausforderung durch die Einführung der<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQ 1-Bit-Quantisierung</a> in Produktionsumgebungen frontal angehen.</p>
<p>Was unsere Implementierung besonders macht, ist die anpassbare Refine-Optimierungsfunktion, die wir aufbauen. Durch die Implementierung eines Primärindexes mit RaBitQ-Quantisierung plus SQ4/SQ6/SQ8 Refine-Optionen haben wir ein optimales Gleichgewicht zwischen Speicherverbrauch und Suchqualität (~95% Recall) erreicht.</p>
<p>Unsere ersten Benchmarks zeigen vielversprechende Ergebnisse:</p>
<table>
<thead>
<tr><th><strong>Leistungsmetrik</strong></th><th><strong>Traditionell IVF_FLAT</strong></th><th><strong>Nur RaBitQ (1-Bit)</strong></th><th><strong>RaBitQ (1-Bit) + SQ8 Verfeinern</strong></th></tr>
</thead>
<tbody>
<tr><td>Speicher-Footprint</td><td>100% (Grundlinie)</td><td>3% (97% Reduktion)</td><td>28% (72% Verringerung)</td></tr>
<tr><td>Qualität des Abrufs</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Abfragedurchsatz (QPS)</td><td>236</td><td>648 (2,7× schneller)</td><td>946 (4× schneller)</td></tr>
</tbody>
</table>
<p><em>Tabelle: VectorDBBench-Bewertung mit 1M Vektoren mit 768 Dimensionen, getestet auf AWS m6id.2xlarge</em></p>
<p>Der wirkliche Durchbruch liegt hier nicht nur in der Speicherreduzierung, sondern auch in der gleichzeitigen Verbesserung des Durchsatzes um das Vierfache ohne Beeinträchtigung der Genauigkeit. Das bedeutet, dass Sie die gleiche Arbeitslast mit 75 % weniger Servern bedienen oder 4 x mehr Datenverkehr auf Ihrer bestehenden Infrastruktur verarbeiten können.</p>
<p>Für Unternehmensanwender, die Milvus auf der<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> vollständig verwalten, entwickeln wir automatisierte Konfigurationsprofile, die RaBitQ-Parameter dynamisch an Ihre spezifischen Workload-Merkmale und Präzisionsanforderungen anpassen.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">400% schnellere Volltextsuche als Elasticsearch</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">Volltextsuchfunktionen</a> in Vektordatenbanken sind für den Aufbau hybrider Retrievalsysteme unerlässlich geworden. Seit der Einführung von BM25 in <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> haben wir begeisterte Rückmeldungen erhalten - zusammen mit dem Wunsch nach besserer Leistung im großen Maßstab.</p>
<p>Milvus 2.6 wird erhebliche Leistungssteigerungen auf BM25 liefern. Unsere Tests mit dem BEIR-Datensatz zeigen einen 3-4-fach höheren Durchsatz als Elasticsearch bei vergleichbaren Abrufraten. Bei einigen Workloads erreicht die Verbesserung bis zu 7× höhere QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Milvus vs. Elasticsearch beim Durchsatz JSON Path Index: 99 % geringere Latenz bei komplexer Filterung</p>
<p>Moderne KI-Anwendungen verlassen sich selten allein auf die Vektorähnlichkeit - sie kombinieren fast immer die Vektorsuche mit der Filterung von Metadaten. Wenn diese Filterbedingungen komplexer werden (insbesondere bei verschachtelten JSON-Objekten), kann sich die Abfrageleistung schnell verschlechtern.</p>
<p>Milvus 2.6 wird einen gezielten Indizierungsmechanismus für verschachtelte JSON-Pfade einführen, der es Ihnen ermöglicht, Indizes auf bestimmten Pfaden (z. B. $meta. <code translate="no">user_info.location</code>) innerhalb von JSON-Feldern zu erstellen. Anstatt ganze Objekte zu scannen, sucht Milvus direkt nach Werten aus vordefinierten Indizes.</p>
<p>In unserer Evaluierung mit mehr als 100 Millionen Datensätzen reduzierte JSON Path Index die Filterlatenz von <strong>140 ms</strong> (P99: 480 ms) auf nur <strong>1,5 ms</strong> (P99: 10 ms) - eine Reduzierung um 99 %, die bisher unpraktische Abfragen in sofortige Antworten verwandelt.</p>
<p>Diese Funktion ist besonders wertvoll für:</p>
<ul>
<li><p>Empfehlungssysteme mit komplexer Filterung von Benutzerattributen</p></li>
<li><p>RAG-Anwendungen, die Dokumente nach verschiedenen Bezeichnungen filtern</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Suche der nächsten Generation: Von der einfachen Vektorähnlichkeit zum produktionsgerechten Retrieval<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Vektorsuche allein reicht für moderne KI-Anwendungen nicht aus. Die Benutzer verlangen die Präzision des traditionellen Information Retrieval kombiniert mit dem semantischen Verständnis von Vektoreinbettungen. Milvus 2.6 wird mehrere erweiterte Suchfunktionen einführen, die diese Lücke schließen.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Bessere Volltextsuche mit Multi-Language Analyzer</h3><p>Die Volltextsuche ist stark sprachabhängig... Milvus 2.6 wird eine komplett überarbeitete Textanalyse-Pipeline mit mehrsprachiger Unterstützung einführen:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> Syntaxunterstützung für die Beobachtung der Analysator-/Tokenisierungskonfiguration</p></li>
<li><p>Lindera-Tokenizer für asiatische Sprachen wie Japanisch und Koreanisch</p></li>
<li><p>ICU-Tokenizer für umfassende mehrsprachige Unterstützung</p></li>
<li><p>Granulare Sprachkonfiguration zur Definition sprachspezifischer Tokenisierungsregeln</p></li>
<li><p>Verbessertes Jieba mit Unterstützung für die Integration benutzerdefinierter Wörterbücher</p></li>
<li><p>Erweiterte Filteroptionen für eine präzisere Textverarbeitung</p></li>
</ul>
<p>Für globale Anwendungen bedeutet dies eine bessere mehrsprachige Suche ohne spezielle Indexierung pro Sprache oder komplexe Workarounds.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Phrase Match: Erfassen der semantischen Nuance in der Wortfolge</h3><p>Die Wortreihenfolge vermittelt entscheidende Bedeutungsunterschiede, die bei der Suche nach Schlüsselwörtern oft übersehen werden. Vergleichen Sie einmal &quot;maschinelle Lerntechniken&quot; mit &quot;maschinelle Lerntechniken&quot; - dieselben Wörter, völlig unterschiedliche Bedeutung.</p>
<p>Milvus 2.6 wird <strong>Phrase Match</strong> hinzufügen, was den Nutzern mehr Kontrolle über die Wortreihenfolge und die Nähe zueinander gibt als die Volltextsuche oder die exakte Übereinstimmung von Zeichenfolgen:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>Der Parameter <code translate="no">slop</code> bietet eine flexible Kontrolle über die Wortnähe - 0 erfordert exakte, aufeinanderfolgende Übereinstimmungen, während höhere Werte geringfügige Variationen in der Formulierung zulassen.</p>
<p>Diese Funktion ist besonders nützlich für:</p>
<ul>
<li><p>Suche nach juristischen Dokumenten, bei denen exakte Formulierungen von rechtlicher Bedeutung sind</p></li>
<li><p>Suche nach technischen Inhalten, bei denen die Reihenfolge der Begriffe verschiedene Konzepte unterscheidet</p></li>
<li><p>Patentdatenbanken, bei denen bestimmte technische Ausdrücke genau übereinstimmen müssen</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Zeitabhängige Abklingfunktionen: Frische Inhalte automatisch priorisieren</h3><p>Der Wert von Informationen nimmt oft mit der Zeit ab. Nachrichtenartikel, Produktveröffentlichungen und Beiträge in sozialen Netzwerken verlieren mit zunehmendem Alter an Relevanz, doch herkömmliche Suchalgorithmen behandeln alle Inhalte gleich, unabhängig vom Zeitstempel.</p>
<p>Mit Milvus 2.6 werden <strong>Decay-Funktionen</strong> für ein zeitbewusstes Ranking eingeführt, die die Relevanzbewertung automatisch auf der Grundlage des Dokumentenalters anpassen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sie werden in der Lage sein zu konfigurieren:</p>
<ul>
<li><p><strong>Funktionstyp</strong>: Exponential (schneller Verfall), Gauß (allmählicher Verfall) oder Linear (konstanter Verfall)</p></li>
<li><p><strong>Abklingrate</strong>: Wie schnell die Relevanz im Laufe der Zeit abnimmt</p></li>
<li><p><strong>Ursprungspunkt</strong>: Der Referenzzeitstempel für die Messung der Zeitunterschiede</p></li>
</ul>
<p>Durch diese zeitabhängige Neueinstufung wird sichergestellt, dass die aktuellsten und kontextrelevanten Ergebnisse zuerst angezeigt werden, was für Empfehlungssysteme für Nachrichten, E-Commerce-Plattformen und Social-Media-Feeds entscheidend ist.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Daten rein, Daten raus: In einem Schritt vom Rohtext zur Vektorsuche</h3><p>Eines der größten Probleme für Entwickler bei Vektordatenbanken war die Trennung zwischen Rohdaten und Vektoreinbettungen. Milvus 2.6 wird diesen Arbeitsablauf mit einer neuen <strong>Funktionsschnittstelle</strong>, die Einbettungsmodelle von Drittanbietern direkt in Ihre Datenpipeline integriert, drastisch vereinfachen. Dies rationalisiert Ihre Vektorsuch-Pipeline mit einem einzigen Aufruf.</p>
<p>Anstatt Einbettungen im Voraus zu berechnen, können Sie nun:</p>
<ol>
<li><p><strong>Rohdaten direkt einfügen</strong>: Übermittlung von Text, Bildern oder anderen Inhalten an Milvus</p></li>
<li><p><strong>Einbettungsanbieter für die Vektorisierung zu konfigurieren</strong>: Milvus kann sich mit Einbettungsmodelldiensten wie OpenAI, AWS Bedrock, Google Vertex AI und Hugging Face verbinden.</p></li>
<li><p><strong>Abfrage mit natürlicher Sprache</strong>: Suche über Textabfragen, nicht über Vektoreinbettungen</p></li>
</ol>
<p>Dadurch wird eine optimierte "Data-In, Data-Out"-Erfahrung geschaffen, bei der Milvus die Vektorgenerierung intern abwickelt, wodurch Ihr Anwendungscode unkomplizierter wird.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Architektonische Entwicklung: Skalierung auf Hunderte von Milliarden von Vektoren<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine gute Datenbank hat nicht nur großartige Funktionen, sie muss diese Funktionen auch in großem Umfang und in der Produktion erprobt bereitstellen.</p>
<p>Milvus 2.6 wird eine grundlegende architektonische Änderung einführen, die eine kosteneffiziente Skalierung auf Hunderte von Milliarden Vektoren ermöglicht. Das Highlight ist eine neue Hot-Cold-Tiered-Storage-Architektur, die die Datenplatzierung auf der Grundlage von Zugriffsmustern intelligent verwaltet und heiße Daten automatisch in den Hochleistungsspeicher/SSD verschiebt, während kalte Daten im kostengünstigeren Objektspeicher abgelegt werden. Dieser Ansatz kann die Kosten drastisch senken und gleichzeitig die Abfrageleistung dort aufrechterhalten, wo sie am wichtigsten ist.</p>
<p>Darüber hinaus ermöglicht ein neuer <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">Streaming-Knoten</a> die Vektorverarbeitung in Echtzeit mit direkter Integration in Streaming-Plattformen wie Kafka und Pulsar sowie in den neu geschaffenen <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>, so dass neue Daten sofort und ohne Batch-Verzögerungen durchsuchbar sind.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Bleiben Sie dran für Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 befindet sich derzeit in aktiver Entwicklung und wird im Juni dieses Jahres verfügbar sein. Wir freuen uns, Ihnen diese bahnbrechenden Leistungsoptimierungen, erweiterte Suchfunktionen und eine neue Architektur anbieten zu können, mit der Sie skalierbare KI-Anwendungen zu geringeren Kosten erstellen können.</p>
<p>In der Zwischenzeit freuen wir uns über Ihr Feedback zu diesen neuen Funktionen. Was reizt Sie am meisten? Welche Funktionen würden sich am meisten auf Ihre Anwendungen auswirken? Beteiligen Sie sich an der Diskussion in unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> oder verfolgen Sie unsere Fortschritte auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Möchten Sie als Erster erfahren, wenn Milvus 2.6 veröffentlicht wird? Folgen Sie uns auf<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> oder<a href="https://twitter.com/milvusio"> X</a> für die neuesten Updates.</p>
