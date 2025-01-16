---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Einführung von Milvus 2.5: Volltextsuche, leistungsfähigere Metadatenfilterung
  und Verbesserungen der Benutzerfreundlichkeit!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Überblick<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir freuen uns, die neueste Version von Milvus, 2.5, vorstellen zu können, die eine leistungsstarke neue Funktion einführt: die <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Volltextsuche</a>, auch bekannt als lexikalische Suche oder Stichwortsuche. Die Volltextsuche ermöglicht es Ihnen, Dokumente zu finden, indem Sie nach bestimmten Wörtern oder Phrasen darin suchen, ähnlich wie bei der Suche in Google. Dies ergänzt unsere bestehenden semantischen Suchfunktionen, die die Bedeutung hinter Ihrer Suche verstehen und nicht nur exakte Wörter abgleichen.</p>
<p>Wir verwenden die branchenübliche BM25-Metrik für die Ähnlichkeit von Dokumenten, und unsere Implementierung basiert auf spärlichen Vektoren, die eine effizientere Speicherung und Abfrage ermöglichen. Für diejenigen, die mit dem Begriff nicht vertraut sind: Sparse Vectors sind eine Möglichkeit, Text darzustellen, bei dem die meisten Werte Null sind, wodurch sie sehr effizient gespeichert und verarbeitet werden können - stellen Sie sich eine riesige Tabellenkalkulation vor, bei der nur wenige Zellen Zahlen enthalten und der Rest leer ist. Dieser Ansatz passt gut in die Produktphilosophie von Milvus, bei der der Vektor die zentrale Sucheinheit ist.</p>
<p>Ein weiterer bemerkenswerter Aspekt unserer Implementierung ist die Möglichkeit, Text <em>direkt</em> einzufügen und abzufragen, anstatt dass der Benutzer den Text erst manuell in spärliche Vektoren umwandeln muss. Dies bringt Milvus einen Schritt näher an die vollständige Verarbeitung unstrukturierter Daten.</p>
<p>Aber das ist erst der Anfang. Mit der Veröffentlichung von 2.5 haben wir die <a href="https://milvus.io/docs/roadmap.md">Produkt-Roadmap von Milvus</a> aktualisiert. In zukünftigen Produktgenerationen von Milvus werden wir uns darauf konzentrieren, die Fähigkeiten von Milvus in vier Hauptrichtungen weiterzuentwickeln:</p>
<ul>
<li>Optimierte Verarbeitung unstrukturierter Daten;</li>
<li>Bessere Suchqualität und -effizienz;</li>
<li>Vereinfachtes Datenmanagement;</li>
<li>Senkung der Kosten durch algorithmische und gestalterische Fortschritte</li>
</ul>
<p>Unser Ziel ist es, eine Dateninfrastruktur aufzubauen, die im Zeitalter der KI sowohl Informationen effizient speichern als auch effektiv abrufen kann.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Volltextsuche über Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Obwohl die semantische Suche in der Regel ein besseres Bewusstsein für den Kontext und ein besseres Verständnis für die Absicht hat, liefert die Volltextsuche mit Schlüsselwortabgleich oft genauere Ergebnisse, wenn ein Benutzer nach bestimmten Eigennamen, Seriennummern oder einem vollständig übereinstimmenden Satz suchen muss.</p>
<p>Um dies anhand eines Beispiels zu verdeutlichen:</p>
<ul>
<li>Die semantische Suche eignet sich hervorragend für die Frage: "Finde Dokumente über Lösungen für erneuerbare Energien".</li>
<li>Die Volltextsuche ist besser, wenn Sie Folgendes benötigen: &quot;Finde Dokumente, in denen das <em>Tesla Model 3 2024</em> erwähnt wird&quot;.</li>
</ul>
<p>In unserer vorherigen Version (Milvus 2.4) mussten die Benutzer ihren Text mit einem separaten Tool (dem BM25EmbeddingFunction-Modul von PyMilvus) auf ihren eigenen Rechnern vorverarbeiten, bevor sie ihn durchsuchen konnten. Dieser Ansatz hatte mehrere Einschränkungen: Er konnte wachsende Datenmengen nicht gut verarbeiten, erforderte zusätzliche Einrichtungsschritte und machte den gesamten Prozess komplizierter als nötig. Für technisch Interessierte waren die wichtigsten Einschränkungen, dass es nur auf einem einzigen Rechner funktioniert, dass das Vokabular und andere Korpusstatistiken, die für die BM25-Bewertung verwendet werden, nicht aktualisiert werden können, wenn sich der Korpus ändert, und dass die Konvertierung von Text in Vektoren auf der Client-Seite weniger intuitiv ist als die direkte Arbeit mit Text.</p>
<p>Milvus 2.5 vereinfacht alles. Jetzt können Sie direkt mit Ihrem Text arbeiten:</p>
<ul>
<li>Speichern Sie Ihre ursprünglichen Textdokumente so, wie sie sind</li>
<li>Suchen Sie mit natürlichsprachlichen Abfragen</li>
<li>Erhalten Sie die Ergebnisse in lesbarer Form zurück</li>
</ul>
<p>Hinter den Kulissen wickelt Milvus alle komplexen Vektorumwandlungen automatisch ab und erleichtert so die Arbeit mit Textdaten. Dies nennen wir unseren "Doc in, Doc out"-Ansatz - Sie arbeiten mit lesbarem Text, und wir erledigen den Rest.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Technische Umsetzung</h3><p>Für diejenigen, die an den technischen Details interessiert sind, fügt Milvus 2.5 die Fähigkeit zur Volltextsuche durch seine eingebaute Sparse-BM25-Implementierung hinzu, einschließlich:</p>
<ul>
<li><strong>Ein Tokenizer auf Basis von tantivy</strong>: Milvus integriert sich jetzt in das florierende tantivy-Ökosystem</li>
<li><strong>Fähigkeit zum Einlesen und Abrufen von Rohdokumenten</strong>: Unterstützung für die direkte Aufnahme und Abfrage von Textdaten</li>
<li><strong>BM25 Relevanz-Scoring</strong>: Internalisierung der BM25-Bewertung, implementiert auf der Basis von Sparse Vectors</li>
</ul>
<p>Wir haben uns entschieden, mit dem gut entwickelten tantivy-Ökosystem zu arbeiten und den Milvus-Text-Tokenizer auf tantivy aufzubauen. In Zukunft wird Milvus weitere Tokenizer unterstützen und den Tokenisierungsprozess offenlegen, um den Nutzern ein besseres Verständnis der Retrievalqualität zu ermöglichen. Wir werden auch auf Deep Learning basierende Tokenizer und Stemmer-Strategien untersuchen, um die Leistung der Volltextsuche weiter zu optimieren. Im Folgenden finden Sie einen Beispielcode für die Verwendung und Konfiguration des Tokenizers:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Nach der Konfiguration des Tokenizers im Sammlungsschema können Benutzer den Text über die add_function-Methode in der bm25-Funktion registrieren. Diese wird intern auf dem Milvus-Server ausgeführt. Alle nachfolgenden Datenflüsse, wie z. B. Hinzufügungen, Löschungen, Änderungen und Abfragen, können abgeschlossen werden, indem der rohe Textstring im Gegensatz zur Vektordarstellung bearbeitet wird. Im folgenden Codebeispiel wird gezeigt, wie man mit der neuen API Text einliest und eine Volltextsuche durchführt:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Wir haben eine Implementierung der BM25-Relevanzbewertung eingeführt, die Abfragen und Dokumente als Sparse-Vektoren darstellt, genannt <strong>Sparse-BM25</strong>. Dies ermöglicht viele Optimierungen, die auf Sparse-Vektoren basieren, wie zum Beispiel:</p>
<p>Milvus erreicht hybride Suchfunktionen durch seine innovative <strong>Sparse-BM25-Implementierung</strong>, die die Volltextsuche in die Vektor-Datenbankarchitektur integriert. Durch die Darstellung von Termhäufigkeiten als Sparse-Vektoren anstelle von traditionellen invertierten Indizes ermöglicht Sparse-BM25 fortschrittliche Optimierungen wie <strong>Graph-Indizierung</strong>, <strong>Produktquantisierung (PQ)</strong> und <strong>Skalarquantisierung (SQ)</strong>. Diese Optimierungen minimieren die Speichernutzung und beschleunigen die Suchleistung. Ähnlich wie beim invertierten Indexansatz unterstützt Milvus die Eingabe von Rohtext und die interne Generierung spärlicher Vektoren. Dadurch ist es in der Lage, mit jedem Tokenizer zu arbeiten und jedes beliebige Wort im sich dynamisch verändernden Korpus zu erfassen.</p>
<p>Darüber hinaus werden durch heuristisches Pruning Sparse-Vektoren mit geringem Wert aussortiert, was die Effizienz weiter steigert, ohne die Genauigkeit zu beeinträchtigen. Im Gegensatz zu früheren Ansätzen, die spärliche Vektoren verwenden, kann er sich an einen wachsenden Korpus anpassen, nicht an die Genauigkeit der BM25-Bewertung.</p>
<ol>
<li>Aufbau von Graph-Indizes auf dem Sparse-Vektor, der bei Abfragen mit langem Text besser abschneidet als ein invertierter Index, da ein invertierter Index mehr Schritte benötigt, um die Token in der Abfrage zu finden;</li>
<li>Nutzung von Annäherungstechniken zur Beschleunigung der Suche mit nur geringen Auswirkungen auf die Abfragequalität, wie z. B. Vektorquantisierung und heuristisches Pruning;</li>
<li>Vereinheitlichung der Schnittstelle und des Datenmodells für die Durchführung der semantischen Suche und der Volltextsuche, wodurch die Benutzerfreundlichkeit verbessert wird.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Zusammenfassend lässt sich sagen, dass Milvus 2.5 seine Suchfunktionalität über die semantische Suche hinaus durch die Einführung der Volltextsuche erweitert hat, was es den Nutzern erleichtert, qualitativ hochwertige KI-Anwendungen zu erstellen. Dies sind nur erste Schritte im Bereich der Sparse-BM25-Suche und wir gehen davon aus, dass es in Zukunft weitere Optimierungsmaßnahmen geben wird.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Textübereinstimmende Suchfilter<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine zweite Textsuchfunktion, die mit Milvus 2.5 eingeführt wurde, ist <strong>Text Match</strong>, die es dem Benutzer ermöglicht, die Suche auf Einträge zu filtern, die eine bestimmte Textzeichenfolge enthalten. Diese Funktion basiert ebenfalls auf der Tokenisierung und wird mit <code translate="no">enable_match=True</code> aktiviert.</p>
<p>Es ist erwähnenswert, dass bei Text Match die Verarbeitung des Abfragetextes auf der Logik von OR nach der Tokenisierung basiert. Im nachstehenden Beispiel wird das Ergebnis alle Dokumente zurückgeben (unter Verwendung des Feldes "Text"), die entweder "vector" oder "database" enthalten.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Ihr Szenario sowohl einen Abgleich mit 'vector' als auch mit 'database' erfordert, müssen Sie zwei separate Textabgleiche schreiben und diese mit AND überlagern, um Ihr Ziel zu erreichen.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Signifikante Verbesserung der skalaren Filterleistung<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Unsere Betonung der skalaren Filterleistung geht auf unsere Entdeckung zurück, dass die Kombination von Vektorabfrage und Metadatenfilterung die Abfrageleistung und Genauigkeit in verschiedenen Szenarien erheblich verbessern kann. Diese Szenarien reichen von Bildsuchanwendungen wie z. B. der Identifizierung von Kurven beim autonomen Fahren bis hin zu komplexen RAG-Szenarien in Wissensdatenbanken von Unternehmen. Daher ist es für Unternehmensanwender sehr gut geeignet, um es in groß angelegten Datenanwendungsszenarien zu implementieren.</p>
<p>In der Praxis können viele Faktoren wie die Menge der zu filternden Daten, die Organisation der Daten und die Art der Suche die Leistung beeinflussen. Um dies zu berücksichtigen, führt Milvus 2.5 drei neue Arten von Indizes ein: BitMap Index, Array Inverted Index und den Inverted Index nach der Tokenisierung des Varchar Textfeldes. Diese neuen Indizes können die Leistung in realen Anwendungsfällen erheblich verbessern.</p>
<p>Im Einzelnen:</p>
<ol>
<li><strong>BitMap Index</strong> kann verwendet werden, um die Tag-Filterung zu beschleunigen (gängige Operatoren sind include in, array_contains usw.), und eignet sich für Szenarien mit weniger Feldkategoriedaten (Datenkardinalität). Das Prinzip besteht darin, festzustellen, ob eine Datenzeile einen bestimmten Wert in einer Spalte hat, wobei 1 für ja und 0 für nein steht, und dann eine BitMap-Liste zu führen. Das folgende Diagramm zeigt den Vergleich der Leistungstests, die wir auf der Grundlage des Geschäftsszenarios eines Kunden durchgeführt haben. In diesem Szenario beträgt das Datenvolumen 500 Millionen, die Datenkategorie 20, die verschiedenen Werte haben unterschiedliche Verteilungsanteile (1 %, 5 %, 10 %, 50 %), und die Leistung bei unterschiedlichen Filterungsmengen variiert ebenfalls. Bei einer Filterung von 50 % können wir durch BitMap Index einen 6,8-fachen Leistungsgewinn erzielen. Es ist erwähnenswert, dass mit zunehmender Kardinalität Inverted Index im Vergleich zu BitMap Index eine ausgeglichenere Leistung aufweist.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Match</strong> basiert auf dem Inverted Index, nachdem das Textfeld tokenisiert wurde. Seine Leistung übertrifft bei weitem die der Funktion Wildcard Match (d. h. wie + %), die wir in 2.4 bereitgestellt haben. Unseren internen Testergebnissen zufolge liegen die Vorteile von Text Match klar auf der Hand, insbesondere in Szenarien mit gleichzeitigen Abfragen, bei denen eine bis zu 400-fache QPS-Steigerung erzielt werden kann.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Im Hinblick auf die Verarbeitung von JSON-Daten planen wir, in den nachfolgenden Versionen von 2.5.x die Erstellung von invertierten Indizes für benutzerdefinierte Schlüssel und die standardmäßige Aufzeichnung von Standortinformationen für alle Schlüssel einzuführen, um das Parsing zu beschleunigen. Wir erwarten, dass diese beiden Bereiche die Abfrageleistung von JSON und Dynamic Field erheblich verbessern werden. Wir planen, weitere Informationen in zukünftigen Versionshinweisen und technischen Blogs zu veröffentlichen, also bleiben Sie dran!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Neue Verwaltungsschnittstelle<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Für die Verwaltung einer Datenbank sollte man kein Informatikstudium absolvieren müssen, aber wir wissen, dass Datenbankadministratoren leistungsstarke Tools benötigen. Aus diesem Grund haben wir die <strong>Cluster Management WebUI</strong> eingeführt, eine neue webbasierte Schnittstelle, die über die Adresse Ihres Clusters auf Port 9091/webui zugänglich ist. Dieses Beobachtungstool bietet:</p>
<ul>
<li>Echtzeit-Überwachungs-Dashboards mit clusterweiten Metriken</li>
<li>Detaillierte Speicher- und Leistungsanalysen pro Knoten</li>
<li>Segmentinformationen und Verfolgung langsamer Abfragen</li>
<li>Systemzustandsindikatoren und Knotenstatus</li>
<li>Einfach zu verwendende Tools zur Fehlerbehebung bei komplexen Systemproblemen</li>
</ul>
<p>Diese Schnittstelle befindet sich zwar noch in der Betaphase, wird aber auf der Grundlage des Benutzerfeedbacks von Datenbankadministratoren aktiv weiterentwickelt. Zukünftige Updates werden KI-unterstützte Diagnosen, interaktivere Verwaltungsfunktionen und verbesserte Funktionen zur Überwachung von Clustern umfassen.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Dokumentation und Entwicklererfahrung<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben unsere <strong>Dokumentation</strong> und <strong>SDK/API</strong> komplett überarbeitet, um Milvus zugänglicher zu machen und gleichzeitig die Tiefe für erfahrene Benutzer zu erhalten. Die Verbesserungen umfassen:</p>
<ul>
<li>Ein neu strukturiertes Dokumentationssystem mit einer klareren Progression von grundlegenden zu fortgeschrittenen Konzepten</li>
<li>Interaktive Tutorien und Beispiele aus der Praxis, die praktische Implementierungen veranschaulichen</li>
<li>Umfassende API-Referenzen mit praktischen Codebeispielen</li>
<li>Ein benutzerfreundlicheres SDK-Design, das gängige Operationen vereinfacht</li>
<li>Illustrierte Anleitungen, die komplexe Konzepte leichter verständlich machen</li>
<li>Ein KI-gestützter Dokumentationsassistent (ASK AI) für schnelle Antworten</li>
</ul>
<p>Das aktualisierte SDK/API konzentriert sich auf die Verbesserung der Entwicklererfahrung durch intuitivere Schnittstellen und eine bessere Integration in die Dokumentation. Wir sind überzeugt, dass Sie diese Verbesserungen bei der Arbeit mit der 2.5.x-Serie bemerken werden.</p>
<p>Wir wissen jedoch, dass die Entwicklung von Dokumentation und SDK ein fortlaufender Prozess ist. Wir werden sowohl die Inhaltsstruktur als auch das SDK-Design auf der Grundlage des Feedbacks der Community weiter optimieren. Treten Sie unserem Discord-Kanal bei, um Ihre Vorschläge mitzuteilen und uns bei der weiteren Verbesserung zu helfen.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Zusammenfassung</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 enthält 13 neue Funktionen und mehrere Optimierungen auf Systemebene, die nicht nur von Zilliz, sondern auch von der Open-Source-Community beigesteuert wurden. Wir haben in diesem Beitrag nur ein paar davon angesprochen und empfehlen Ihnen, unsere <a href="https://milvus.io/docs/release_notes.md">Release Note</a> und die <a href="https://milvus.io/docs">offiziellen Dokumente</a> für weitere Informationen zu besuchen!</p>
