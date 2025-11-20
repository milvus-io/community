---
id: >-
  tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
title: >-
  Intelligenter tokenisieren, besser abrufen: Ein tiefer Einblick in Milvus
  Analyzer für die Volltextsuche
author: Jack Li
date: 2025-10-16T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Milvus Analyzer die hybride KI-Suche mit effizienter
  Tokenisierung und Filterung unterstützt und so eine schnellere und
  intelligentere Volltextsuche ermöglicht.
cover: assets.zilliz.com/Milvus_Analyzer_2_ccde10876e.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_title: |
  A Deep Dive into Milvus Analyzer for Full-Text Search
meta_keywords: 'Milvus Analyzer, RAG, full-text search, vector database, tokenization'
origin: >-
  https://milvus.io/blog/tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
---
<p>Moderne KI-Anwendungen sind komplex und selten eindimensional. In vielen Fällen kann eine einzelne Suchmethode reale Probleme nicht allein lösen. Nehmen Sie zum Beispiel ein Empfehlungssystem. Es benötigt eine <strong>Vektorsuche</strong>, um die Bedeutung hinter Text oder Bildern zu verstehen, eine <strong>Metadatenfilterung</strong>, um die Ergebnisse nach Preis, Kategorie oder Ort zu verfeinern, und eine<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md"> <strong>Volltextsuche</strong></a>, um direkte Anfragen wie "Nike Air Max" zu bearbeiten. Jede Methode löst einen anderen Teil des Puzzles - und praktische Systeme hängen davon ab, dass sie alle nahtlos zusammenarbeiten.</p>
<p>Milvus zeichnet sich durch Vektorsuche und Metadatenfilterung aus und hat mit Version 2.5 eine Volltextsuche eingeführt, die auf dem optimierten BM25-Algorithmus basiert. Dieses Upgrade macht die KI-Suche sowohl intelligenter als auch präziser, indem es semantisches Verständnis mit präziser Keyword-Intention kombiniert. Mit<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Milvus 2.6</a> wird die Volltextsuche noch schneller - bis zu<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> viermal so schnell wie Elasticsearch</a>.</p>
<p>Das Herzstück dieser Fähigkeit ist der <strong>Milvus Analyzer</strong>, die Komponente, die Rohtext in durchsuchbare Token umwandelt. Sie ermöglicht es Milvus, Sprache effizient zu interpretieren und Schlüsselwortabgleiche in großem Umfang durchzuführen. Im weiteren Verlauf dieses Beitrags erfahren Sie, wie der Milvus Analyzer funktioniert - und warum er der Schlüssel ist, um das volle Potenzial der hybriden Suche in Milvus zu erschließen.</p>
<h2 id="What-is-Milvus-Analyzer" class="common-anchor-header">Was ist Milvus Analyzer？?<button data-href="#What-is-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>Um eine effiziente Volltextsuche zu ermöglichen - sei es für den Abgleich von Schlüsselwörtern oder die semantische Suche - ist der erste Schritt immer derselbe: die Umwandlung von Rohtext in Token, die das System verstehen, indizieren und vergleichen kann.</p>
<p>Der <strong>Milvus Analyzer</strong> übernimmt diesen Schritt. Dabei handelt es sich um eine integrierte Komponente zur Textvorverarbeitung und Tokenisierung, die den eingegebenen Text in einzelne Token zerlegt und diese dann normalisiert, bereinigt und standardisiert, um einen konsistenten Abgleich über Abfragen und Dokumente hinweg sicherzustellen. Dieser Prozess bildet die Grundlage für eine präzise, leistungsstarke Volltextsuche und ein hybrides Retrieval.</p>
<p>Hier finden Sie einen Überblick über die Architektur von Milvus Analyzer:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_5_8e0ec1dbdf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wie das Diagramm zeigt, besteht der Analyzer aus zwei Kernkomponenten: dem <strong>Tokenizer</strong> und dem <strong>Filter</strong>. Gemeinsam wandeln sie den Eingabetext in Token um und optimieren sie für eine effiziente Indizierung und Abfrage.</p>
<ul>
<li><p><strong>Tokenisierer</strong>: Zerlegt den Text in einfache Token, indem er Methoden wie Whitespace-Splitting (Whitespace), chinesische Wortsegmentierung (Jieba) oder mehrsprachige Segmentierung (ICU) verwendet.</p></li>
<li><p><strong>Filtern</strong>: Verarbeitet Token durch spezifische Transformationen. Milvus enthält eine Vielzahl integrierter Filter für Operationen wie Groß- und Kleinschreibung (Lowercase), Entfernen von Satzzeichen (Removepunct), Filterung von Stoppwörtern (Stop), Stemming (Stemmer) und Mustervergleich (Regex). Sie können mehrere Filter verketten, um komplexe Verarbeitungsanforderungen zu erfüllen.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tokenizer_70a57e893c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus bietet mehrere Analyzer-Typen: drei eingebaute Optionen (Standard, Englisch und Chinesisch), benutzerdefinierte Analyzer, bei denen Sie Ihre eigenen Tokenizer- und Filterkombinationen definieren, und den Multisprachen-Analyzer für die Verarbeitung mehrsprachiger Dokumente. Der Verarbeitungsablauf ist einfach: Rohtext → Tokenizer → Filter → Tokens.</p>
<h3 id="Tokenizer" class="common-anchor-header">Tokenisierer</h3><p>Der Tokenizer ist der erste Verarbeitungsschritt. Er zerlegt den Rohtext in kleinere Token (Wörter oder Unterwörter), und die richtige Wahl hängt von Ihrer Sprache und Ihrem Anwendungsfall ab.</p>
<p>Milvus unterstützt derzeit die folgenden Arten von Tokenizern:</p>
<table>
<thead>
<tr><th><strong>Tokenisierer</strong></th><th><strong>Anwendungsfall</strong></th><th><strong>Beschreibung</strong></th></tr>
</thead>
<tbody>
<tr><td>Standard</td><td>Englisch und durch Leerzeichen getrennte Sprachen</td><td>Der gebräuchlichste Allzweck-Tokenisierer; erkennt Wortgrenzen und trennt entsprechend auf.</td></tr>
<tr><td>Leerzeichen</td><td>Einfacher Text mit minimaler Vorverarbeitung</td><td>Trennt nur nach Leerzeichen; behandelt keine Interpunktion oder Groß-/Kleinschreibung.</td></tr>
<tr><td>Jieba（Chinesisch）</td><td>Chinesischer Text</td><td>Wörterbuch- und wahrscheinlichkeitsbasierter Tokenizer, der fortlaufende chinesische Zeichen in sinnvolle Wörter zerlegt.</td></tr>
<tr><td>Lindera（JP/KR）</td><td>Japanischer und koreanischer Text</td><td>Verwendet die morphologische Analyse von Lindera für eine effektive Segmentierung.</td></tr>
<tr><td>ICU（Mehrsprachig）</td><td>Komplexe Sprachen wie Arabisch, und mehrsprachige Szenarien</td><td>Basiert auf der ICU-Bibliothek mit Unterstützung für mehrsprachige Tokenisierung über Unicode.</td></tr>
</tbody>
</table>
<p>Sie können den Tokenizer bei der Erstellung des Schemas Ihrer Sammlung konfigurieren, insbesondere bei der Definition von <code translate="no">VARCHAR</code> Feldern über den Parameter <code translate="no">analyzer_params</code>. Mit anderen Worten, der Tokenizer ist kein eigenständiges Objekt, sondern eine Konfiguration auf Feldebene. Milvus führt beim Einfügen von Daten automatisch eine Tokenisierung und Vorverarbeitung durch.</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
       <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>   <span class="hljs-comment"># Configure Tokenizer here</span>
    }
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Filter" class="common-anchor-header">Filter</h3><p>Wenn der Tokenizer den Text zerschneidet, verfeinert der Filter das, was übrig bleibt. Filter standardisieren, bereinigen oder transformieren Ihre Token, um sie suchfähig zu machen.</p>
<p>Zu den üblichen Filteroperationen gehören die Normalisierung der Groß- und Kleinschreibung, das Entfernen von Stoppwörtern (wie "der" und "und"), das Entfernen von Satzzeichen und die Anwendung von Stemming (Reduzierung von "laufen" auf "laufen").</p>
<p>Milvus enthält viele integrierte Filter für die meisten Sprachverarbeitungsanforderungen:</p>
<table>
<thead>
<tr><th><strong>Filter Name</strong></th><th><strong>Funktion</strong></th><th><strong>Verwendung Fall</strong></th></tr>
</thead>
<tbody>
<tr><td>Kleinbuchstaben</td><td>Konvertiert alle Token in Kleinbuchstaben</td><td>Unverzichtbar für die englische Suche, um Groß-/Kleinschreibungsfehler zu vermeiden</td></tr>
<tr><td>Asciifolding</td><td>Konvertiert akzentuierte Zeichen in ASCII</td><td>Mehrsprachige Szenarien (z. B. "café" → "cafe")</td></tr>
<tr><td>Nur Alphanum</td><td>Behält nur Buchstaben und Zahlen bei</td><td>Entfernt gemischte Symbole aus Text wie Logs</td></tr>
<tr><td>Cncharonly</td><td>Behält nur chinesische Zeichen bei</td><td>Reinigung des chinesischen Korpus</td></tr>
<tr><td>Cnalphanumonly</td><td>Behält nur Chinesisch, Englisch und Zahlen bei</td><td>Gemischter chinesisch-englischer Text</td></tr>
<tr><td>Länge</td><td>Filtert Token nach Länge</td><td>Entfernt übermäßig kurze oder lange Zeichen</td></tr>
<tr><td>Stopp</td><td>Filterung von Stoppwörtern</td><td>Entfernt hochfrequente bedeutungslose Wörter wie "ist" und "der".</td></tr>
<tr><td>Dekomponierer</td><td>Zerlegt zusammengesetzte Wörter</td><td>Sprachen mit häufigen Zusammensetzungen wie Deutsch und Niederländisch</td></tr>
<tr><td>Stemmer</td><td>Stämmen von Wörtern</td><td>Englische Szenarien (z. B. &quot;studies&quot; und &quot;studying&quot; → &quot;study&quot;)</td></tr>
<tr><td>Satzzeichen entfernen</td><td>Entfernt Interpunktionszeichen</td><td>Allgemeine Textbereinigung</td></tr>
<tr><td>Regex</td><td>Filtert oder ersetzt mit einem Regex-Muster</td><td>Benutzerdefinierte Anforderungen, z. B. nur E-Mail-Adressen extrahieren</td></tr>
</tbody>
</table>
<p>Die Stärke von Filtern liegt in ihrer Flexibilität: Sie können die Bereinigungsregeln je nach Bedarf mischen und anpassen. Für die englische Suche ist eine typische Kombination Kleinbuchstaben + Stopp + Stemmer, die die Einheitlichkeit der Groß- und Kleinschreibung gewährleistet, Füllwörter entfernt und Wortformen auf ihren Stamm normalisiert.</p>
<p>Für die chinesische Suche kombinieren Sie in der Regel Kleinbuchstaben + Stopp für sauberere, präzisere Ergebnisse. Konfigurieren Sie Filter auf die gleiche Weise wie Tokenizer, über <code translate="no">analyzer_params</code> in Ihrem FieldSchema:</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
        <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
               <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
               <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
    }
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Analyzer-Types" class="common-anchor-header">Analyzer-Typen<button data-href="#Analyzer-Types" class="anchor-icon" translate="no">
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
    </button></h2><p>Der richtige Analyzer macht Ihre Suche sowohl schneller als auch kostengünstiger. Um den unterschiedlichen Anforderungen gerecht zu werden, bietet Milvus drei Typen an: Eingebaute, mehrsprachige und benutzerdefinierte Analyzer.</p>
<h3 id="Built-in-Analyzer" class="common-anchor-header">Eingebauter Analyzer</h3><p>Eingebaute Analyzer sind sofort einsatzbereit - Standardkonfigurationen, die für die meisten gängigen Szenarien funktionieren. Sie werden mit vordefinierten Tokenizer- und Filterkombinationen geliefert:</p>
<table>
<thead>
<tr><th><strong>Name .</strong></th><th><strong>Komponenten（Tokenizer+Filter）</strong></th><th><strong>Anwendungsfall</strong></th></tr>
</thead>
<tbody>
<tr><td>Standard</td><td>Standard Tokenizer + Kleinbuchstaben</td><td>Allgemeine Verwendung für Englisch oder durch Leerzeichen getrennte Sprachen</td></tr>
<tr><td>Englisch</td><td>Standard Tokenizer + Kleinbuchstaben + Stop + Stemmer</td><td>Englische Suche mit höherer Präzision</td></tr>
<tr><td>Chinesisch</td><td>Jieba Tokenisierer + Nur Kleinbuchstaben</td><td>Chinesische Textsuche mit natürlicher Wortsegmentierung</td></tr>
</tbody>
</table>
<p>Für eine einfache englische oder chinesische Suche funktionieren diese integrierten Analyzer ohne zusätzliche Einstellungen.</p>
<p>Ein wichtiger Hinweis: Der Standard-Analyzer ist standardmäßig für Englisch ausgelegt. Wenn er auf chinesischen Text angewendet wird, liefert die Volltextsuche möglicherweise keine Ergebnisse.</p>
<h3 id="Multi-language-Analyzer" class="common-anchor-header">Mehrsprachiger Analyzer</h3><p>Wenn Sie mit mehreren Sprachen arbeiten, kann ein einziger Tokenizer oft nicht alles bewältigen. Hier kommt der Multi-Language Analyzer ins Spiel - er wählt automatisch den richtigen Tokenizer auf der Grundlage der Sprache des jeweiligen Textes aus. Hier sehen Sie, wie die Sprachen den Tokenizern zugeordnet werden:</p>
<table>
<thead>
<tr><th><strong>Sprachcode</strong></th><th><strong>Verwendeter Tokenizer</strong></th></tr>
</thead>
<tbody>
<tr><td>en</td><td>Englischer Analyzer</td></tr>
<tr><td>zh</td><td>Jieba</td></tr>
<tr><td>ja / ko</td><td>Lindera</td></tr>
<tr><td>ar</td><td>ICU</td></tr>
</tbody>
</table>
<p>Wenn Ihr Datensatz eine Mischung aus Englisch, Chinesisch, Japanisch, Koreanisch und sogar Arabisch enthält, kann Milvus sie alle im selben Feld verarbeiten. Dadurch wird die manuelle Vorverarbeitung drastisch reduziert.</p>
<h3 id="Custom-Analyzer" class="common-anchor-header">Benutzerdefinierter Analyzer</h3><p>Wenn die eingebauten oder mehrsprachigen Analyzer nicht ganz passen, können Sie mit Milvus benutzerdefinierte Analyzer erstellen. Kombinieren Sie Tokenizer und Filter, um etwas zu erstellen, das auf Ihre Bedürfnisse zugeschnitten ist. Hier ist ein Beispiel:</p>
<pre><code translate="no">FieldSchema(
        name=<span class="hljs-string">&quot;text&quot;</span>,
        dtype=DataType.VARCHAR,
        max_length=<span class="hljs-number">512</span>,
        analyzer_params={
           <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;jieba&quot;</span>,  
            <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;cncharonly&quot;</span>, <span class="hljs-string">&quot;stop&quot;</span>]  <span class="hljs-comment"># Custom combination for mixed Chinese-English text</span>
        }
    )
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hands-on-Coding-with-Milvus-Analyzer" class="common-anchor-header">Praktische Kodierung mit Milvus Analyzer<button data-href="#Hands-on-Coding-with-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>Theorie hilft, aber nichts geht über ein vollständiges Code-Beispiel. Lassen Sie uns durchgehen, wie man Analyzer in Milvus mit dem Python SDK verwendet, wobei sowohl eingebaute Analyzer als auch mehrsprachige Analyzer abgedeckt werden. Diese Beispiele verwenden Milvus v2.6.1 und Pymilvus v2.6.1.</p>
<h3 id="How-to-Use-Built-in-Analyzer" class="common-anchor-header">Wie man den eingebauten Analyzer verwendet</h3><p>Angenommen, Sie möchten eine Sammlung für die englische Textsuche erstellen, die automatisch die Tokenisierung und Vorverarbeitung beim Einfügen der Daten übernimmt. Wir verwenden den eingebauten English Analyzer (äquivalent zu <code translate="no">standard + lowercase + stop + stemmer</code> ).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

schema = client.create_schema()

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,                  <span class="hljs-comment"># Field name</span>
    datatype=DataType.INT64,          <span class="hljs-comment"># Integer data type</span>
    is_primary=<span class="hljs-literal">True</span>,                  <span class="hljs-comment"># Designate as primary key</span>
    auto_id=<span class="hljs-literal">True</span>                      <span class="hljs-comment"># Auto-generate IDs (recommended)</span>
)

schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">1000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    analyzer_params={
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
            <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
            <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
        },
    enable_match=<span class="hljs-literal">True</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,                   <span class="hljs-comment"># Field name</span>
    datatype=DataType.SPARSE_FLOAT_VECTOR  <span class="hljs-comment"># Sparse vector data type</span>
)

bm25_function = Function(
    name=<span class="hljs-string">&quot;text_to_vector&quot;</span>,            <span class="hljs-comment"># Descriptive function name</span>
    function_type=FunctionType.BM25,  <span class="hljs-comment"># Use BM25 algorithm</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],       <span class="hljs-comment"># Process text from this field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>]     <span class="hljs-comment"># Store vectors in this field</span>
)

schema.add_function(bm25_function)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,        <span class="hljs-comment"># Field to index (our vector field)</span>
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,     <span class="hljs-comment"># Let Milvus choose optimal index type</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>          <span class="hljs-comment"># Must be BM25 for this feature</span>
)

COLLECTION_NAME = <span class="hljs-string">&quot;english_demo&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)  
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

client.create_collection(
    collection_name=COLLECTION_NAME,       <span class="hljs-comment"># Collection name</span>
    schema=schema,                         <span class="hljs-comment"># Our schema</span>
    index_params=index_params              <span class="hljs-comment"># Our search index configuration</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully created collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Prepare sample data</span>
sample_texts = [
    <span class="hljs-string">&quot;The quick brown fox jumps over the lazy dog&quot;</span>,
    <span class="hljs-string">&quot;Machine learning algorithms are revolutionizing artificial intelligence&quot;</span>,  
    <span class="hljs-string">&quot;Python programming language is widely used for data science projects&quot;</span>,
    <span class="hljs-string">&quot;Natural language processing helps computers understand human languages&quot;</span>,
    <span class="hljs-string">&quot;Deep learning models require large amounts of training data&quot;</span>,
    <span class="hljs-string">&quot;Search engines use complex algorithms to rank web pages&quot;</span>,
    <span class="hljs-string">&quot;Text analysis and information retrieval are important NLP tasks&quot;</span>,
    <span class="hljs-string">&quot;Vector databases enable efficient similarity searches&quot;</span>,
    <span class="hljs-string">&quot;Stemming reduces words to their root forms for better searching&quot;</span>,
    <span class="hljs-string">&quot;Stop words like &#x27;the&#x27;, &#x27;and&#x27;, &#x27;of&#x27; are often filtered out&quot;</span>
]

<span class="hljs-comment"># Insert data</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nInserting data...&quot;</span>)
data = [{<span class="hljs-string">&quot;text&quot;</span>: text} <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> sample_texts]

client.insert(
    collection_name=COLLECTION_NAME,
    data=data
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_texts)}</span> records&quot;</span>)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Tokenizer Analysis Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

test_text = <span class="hljs-string">&quot;The running dogs are jumping over the lazy cats&quot;</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nOriginal text: &#x27;<span class="hljs-subst">{test_text}</span>&#x27;&quot;</span>)

<span class="hljs-comment"># Use run_analyzer to show tokenization results</span>
analyzer_result = client.run_analyzer(
    texts=test_text,
    collection_name=COLLECTION_NAME,
    field_name=<span class="hljs-string">&quot;text&quot;</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Tokenization result: <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nBreakdown:&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- lowercase: Converts all letters to lowercase&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stop words: Filtered out [&#x27;of&#x27;, &#x27;to&#x27;] and common English stop words&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)&quot;</span>)

<span class="hljs-comment"># Full-text search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Full-Text Search Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

<span class="hljs-comment"># Wait for indexing to complete</span>
<span class="hljs-keyword">import</span> time
time.sleep(<span class="hljs-number">2</span>)

<span class="hljs-comment"># Search query examples</span>
search_queries = [
    <span class="hljs-string">&quot;jump&quot;</span>,           <span class="hljs-comment"># Test stem matching (should match &quot;jumps&quot;)</span>
    <span class="hljs-string">&quot;algorithm&quot;</span>,      <span class="hljs-comment"># Test exact matching</span>
    <span class="hljs-string">&quot;python program&quot;</span>, <span class="hljs-comment"># Test multi-word query</span>
    <span class="hljs-string">&quot;learn&quot;</span>          <span class="hljs-comment"># Test stem matching (should match &quot;learning&quot;)</span>
]

<span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_queries, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery <span class="hljs-subst">{i}</span>: &#x27;<span class="hljs-subst">{query}</span>&#x27;&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
    
    <span class="hljs-comment"># Execute full-text search</span>
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        data=[query],                    <span class="hljs-comment"># Query text</span>
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>],         <span class="hljs-comment"># Return original text</span>
        limit=<span class="hljs-number">3</span>                         <span class="hljs-comment"># Return top 3 results</span>
    )
    
    <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
        <span class="hljs-keyword">for</span> j, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[<span class="hljs-number">0</span>], <span class="hljs-number">1</span>):
            score = result[<span class="hljs-string">&quot;distance&quot;</span>]
            text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Result <span class="hljs-subst">{j}</span> (relevance: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>): <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No relevant results found&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search complete！&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe：</p>
<pre><code translate="no">Dropped existing collection: english_demo
Successfully created collection: english_demo

Inserting data...
Successfully inserted <span class="hljs-number">10</span> records

============================================================
Tokenizer Analysis Demo
============================================================

Original text: <span class="hljs-string">&#x27;The running dogs are jumping over the lazy cats&#x27;</span>
Tokenization result: [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;dog&#x27;</span>, <span class="hljs-string">&#x27;jump&#x27;</span>, <span class="hljs-string">&#x27;over&#x27;</span>, <span class="hljs-string">&#x27;lazi&#x27;</span>, <span class="hljs-string">&#x27;cat&#x27;</span>]

Breakdown:
- lowercase: Converts <span class="hljs-built_in">all</span> letters to lowercase
- stop words: Filtered out [<span class="hljs-string">&#x27;of&#x27;</span>, <span class="hljs-string">&#x27;to&#x27;</span>] <span class="hljs-keyword">and</span> common English stop words
- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)

============================================================
Full-Text Search Demo
============================================================

Query <span class="hljs-number">1</span>: <span class="hljs-string">&#x27;jump&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">2.0040</span>): The quick brown fox jumps over the lazy dog

Query <span class="hljs-number">2</span>: <span class="hljs-string">&#x27;algorithm&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Search engines use <span class="hljs-built_in">complex</span> algorithms to rank web pages

Query <span class="hljs-number">3</span>: <span class="hljs-string">&#x27;python program&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">3.7884</span>): Python programming language <span class="hljs-keyword">is</span> widely used <span class="hljs-keyword">for</span> data science projects

Query <span class="hljs-number">4</span>: <span class="hljs-string">&#x27;learn&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Deep learning models require large amounts of training data

============================================================
Search complete！
============================================================
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Use-Multi-language-Analyzer" class="common-anchor-header">Wie man den mehrsprachigen Analyzer verwendet</h3><p>Wenn Ihr Datensatz mehrere Sprachen enthält, z. B. Englisch, Chinesisch und Japanisch, können Sie den Multi-Language Analyzer aktivieren. Milvus wählt dann automatisch den richtigen Tokenizer auf der Grundlage der Sprache des jeweiligen Textes.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-keyword">import</span> time

<span class="hljs-comment"># Configure connection</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_demo&quot;</span>

<span class="hljs-comment"># Drop existing collection if present</span>
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

<span class="hljs-comment"># Create schema</span>
schema = client.create_schema()

<span class="hljs-comment"># Add primary key field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Add language identifier field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;language&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">50</span>
)

<span class="hljs-comment"># Add text field with multi-language analyzer configuration</span>
multi_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,  <span class="hljs-comment"># Select analyzer based on language field</span>
    <span class="hljs-string">&quot;analyzers&quot;</span>: {
        <span class="hljs-string">&quot;en&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>  <span class="hljs-comment"># English analyzer</span>
        },
        <span class="hljs-string">&quot;zh&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;chinese&quot;</span>  <span class="hljs-comment"># Chinese analyzer</span>
        },
        <span class="hljs-string">&quot;jp&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,  <span class="hljs-comment"># Use ICU tokenizer for Japanese</span>
            <span class="hljs-string">&quot;filter&quot;</span>: [
                <span class="hljs-string">&quot;lowercase&quot;</span>,
                {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>,
                    <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;は&quot;</span>, <span class="hljs-string">&quot;が&quot;</span>, <span class="hljs-string">&quot;の&quot;</span>, <span class="hljs-string">&quot;に&quot;</span>, <span class="hljs-string">&quot;を&quot;</span>, <span class="hljs-string">&quot;で&quot;</span>, <span class="hljs-string">&quot;と&quot;</span>]
                }
            ]
        },
        <span class="hljs-string">&quot;default&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>  <span class="hljs-comment"># Default to ICU general tokenizer</span>
        }
    },
    <span class="hljs-string">&quot;alias&quot;</span>: {
        <span class="hljs-string">&quot;english&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;chinese&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, 
        <span class="hljs-string">&quot;japanese&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>,
        <span class="hljs-string">&quot;中文&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>,
        <span class="hljs-string">&quot;英文&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;日文&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>
    }
}

schema.add_field(
    field_name=<span class="hljs-string">&quot;text&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">2000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    multi_analyzer_params=multi_analyzer_params
)

<span class="hljs-comment"># Add sparse vector field for BM25</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    datatype=DataType.SPARSE_FLOAT_VECTOR
)

<span class="hljs-comment"># Define BM25 function</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>]
)

schema.add_function(bm25_function)

<span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Prepare multilingual test data</span>
multilingual_data = [
    <span class="hljs-comment"># English data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Artificial intelligence is revolutionizing technology industries worldwide&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Machine learning algorithms process large datasets efficiently&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Vector databases provide fast similarity search capabilities&quot;</span>},
    
    <span class="hljs-comment"># Chinese data  </span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工智能正在改变世界各行各业&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;机器学习算法能够高效处理大规模数据集&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;向量数据库提供快速的相似性搜索功能&quot;</span>},
    
    <span class="hljs-comment"># Japanese data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工知能は世界中の技術産業に革命をもたらしています&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;機械学習アルゴリズムは大量のデータセットを効率的に処理します&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;ベクトルデータベースは高速な類似性検索機能を提供します&quot;</span>},
]

client.insert(
    collection_name=COLLECTION_NAME,
    data=multilingual_data
)

<span class="hljs-comment"># Wait for BM25 function to generate vectors</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Waiting for BM25 vector generation...&quot;</span>)
client.flush(COLLECTION_NAME)
time.sleep(<span class="hljs-number">5</span>)
client.load_collection(COLLECTION_NAME)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nTokenizer Analysis:&quot;</span>)

test_texts = {
    <span class="hljs-string">&quot;en&quot;</span>: <span class="hljs-string">&quot;The running algorithms are processing data efficiently&quot;</span>,
    <span class="hljs-string">&quot;zh&quot;</span>: <span class="hljs-string">&quot;这些运行中的算法正在高效地处理数据&quot;</span>, 
    <span class="hljs-string">&quot;jp&quot;</span>: <span class="hljs-string">&quot;これらの実行中のアルゴリズムは効率的にデータを処理しています&quot;</span>
}

<span class="hljs-keyword">for</span> lang, text <span class="hljs-keyword">in</span> test_texts.items():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{lang}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">try</span>:
        analyzer_result = client.run_analyzer(
            texts=text,
            collection_name=COLLECTION_NAME,
            field_name=<span class="hljs-string">&quot;text&quot;</span>,
            analyzer_names=[lang]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → Analysis failed: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-comment"># Multi-language search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch Test:&quot;</span>)

search_cases = [
    (<span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;人工智能&quot;</span>),
    (<span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;機械学習&quot;</span>),
    (<span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;algorithm&quot;</span>),
]

<span class="hljs-keyword">for</span> lang, query <span class="hljs-keyword">in</span> search_cases:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{lang}</span> &#x27;<span class="hljs-subst">{query}</span>&#x27;:&quot;</span>)
    <span class="hljs-keyword">try</span>:
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query],
            search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
            output_fields=[<span class="hljs-string">&quot;language&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>],
            limit=<span class="hljs-number">3</span>,
            <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;language == &quot;<span class="hljs-subst">{lang}</span>&quot;&#x27;</span>
        )
        
        <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
            <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> search_results[<span class="hljs-number">0</span>]:
                score = result[<span class="hljs-string">&quot;distance&quot;</span>]
                text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No results&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Error: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nComplete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe：</p>
<pre><code translate="no"><span class="hljs-title class_">Waiting</span> <span class="hljs-keyword">for</span> <span class="hljs-title class_">BM25</span> vector generation...

<span class="hljs-title class_">Tokenizer</span> <span class="hljs-title class_">Analysis</span>:
<span class="hljs-attr">en</span>: <span class="hljs-title class_">The</span> running algorithms are processing data efficiently
  → [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;algorithm&#x27;</span>, <span class="hljs-string">&#x27;process&#x27;</span>, <span class="hljs-string">&#x27;data&#x27;</span>, <span class="hljs-string">&#x27;effici&#x27;</span>]
<span class="hljs-attr">zh</span>: 这些运行中的算法正在高效地处理数据
  → [<span class="hljs-string">&#x27;这些&#x27;</span>, <span class="hljs-string">&#x27;运行&#x27;</span>, <span class="hljs-string">&#x27;中&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;算法&#x27;</span>, <span class="hljs-string">&#x27;正在&#x27;</span>, <span class="hljs-string">&#x27;高效&#x27;</span>, <span class="hljs-string">&#x27;地&#x27;</span>, <span class="hljs-string">&#x27;处理&#x27;</span>, <span class="hljs-string">&#x27;数据&#x27;</span>]
<span class="hljs-attr">jp</span>: これらの実行中のアルゴリズムは効率的にデータを処理しています
  → [<span class="hljs-string">&#x27;これらの&#x27;</span>, <span class="hljs-string">&#x27;実行&#x27;</span>, <span class="hljs-string">&#x27;中の&#x27;</span>, <span class="hljs-string">&#x27;アルゴリズム&#x27;</span>, <span class="hljs-string">&#x27;効率&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;データ&#x27;</span>, <span class="hljs-string">&#x27;処理&#x27;</span>, <span class="hljs-string">&#x27;し&#x27;</span>, <span class="hljs-string">&#x27;てい&#x27;</span>, <span class="hljs-string">&#x27;ます&#x27;</span>]

<span class="hljs-title class_">Search</span> <span class="hljs-title class_">Test</span>:

zh <span class="hljs-string">&#x27;人工智能&#x27;</span>:
  <span class="hljs-number">3.300</span>: 人工智能正在改变世界各行各业

jp <span class="hljs-string">&#x27;機械学習&#x27;</span>:
  <span class="hljs-number">3.649</span>: 機械学習アルゴリズムは大量のデータセットを効率的に処理します

en <span class="hljs-string">&#x27;algorithm&#x27;</span>:
  <span class="hljs-number">2.096</span>: <span class="hljs-title class_">Machine</span> learning algorithms process large datasets efficiently

<span class="hljs-title class_">Complete</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus unterstützt auch den language_identifier-Tokenizer für die Suche. Er erkennt automatisch die Sprachen eines gegebenen Textes, was bedeutet, dass das Sprachfeld optional ist. Weitere Einzelheiten finden Sie unter<a href="https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md"> Wie Milvus 2.6 die mehrsprachige Volltextsuche in großem Maßstab aufwertet</a>.</p>
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
    </button></h2><p>Der Milvus Analyzer macht aus einem einfachen Vorverarbeitungsschritt ein wohldefiniertes, modulares System für die Textverarbeitung. Sein Design, das auf Tokenisierung und Filterung aufbaut, gibt Entwicklern eine fein abgestufte Kontrolle darüber, wie Sprache interpretiert, bereinigt und indiziert wird. Unabhängig davon, ob Sie eine einsprachige Anwendung oder ein globales, mehrsprachiges RAG-System entwickeln, bietet der Analyzer eine konsistente Grundlage für die Volltextsuche. Es ist der Teil von Milvus, der im Stillen dafür sorgt, dass alles andere besser funktioniert.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunde</a> zu erhalten.</p>
