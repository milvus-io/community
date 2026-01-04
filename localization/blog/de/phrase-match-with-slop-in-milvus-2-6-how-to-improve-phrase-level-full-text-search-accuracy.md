---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Phrase Match mit Slop in Milvus 2.6: Wie man die Genauigkeit der Volltextsuche
  auf Phrase-Ebene verbessert
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Erfahren Sie, wie Phrase Match in Milvus 2.6 die Volltextsuche auf
  Phrasenebene mit Slop unterstützt und damit eine tolerantere
  Schlüsselwortfilterung für die reale Produktion ermöglicht.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>Da unstrukturierte Daten weiterhin explodieren und KI-Modelle immer intelligenter werden, ist die Vektorsuche zur Standardabrufebene für viele KI-Systeme geworden - RAG-Pipelines, KI-Suche, Agenten, Empfehlungsmaschinen und mehr. Sie funktioniert, weil sie die Bedeutung erfasst: nicht nur die Wörter, die Benutzer eingeben, sondern auch die Absicht dahinter.</p>
<p>Sobald diese Anwendungen jedoch in Produktion gehen, stellen die Teams oft fest, dass das semantische Verständnis nur eine Seite des Abrufproblems ist. Viele Arbeitsabläufe hängen auch von strengen Textregeln ab, wie z. B. der exakten Terminologie, der Einhaltung der Wortreihenfolge oder der Identifizierung von Phrasen, die eine technische, rechtliche oder betriebliche Bedeutung haben.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> hebt diese Trennung auf, indem es eine native Volltextsuche direkt in die Vektordatenbank einführt. Mit Token- und Positionsindizes, die in die Kern-Engine integriert sind, kann Milvus die semantische Absicht einer Anfrage interpretieren und gleichzeitig präzise Einschränkungen auf Schlüsselwort- und Phrasenebene durchsetzen. Das Ergebnis ist eine einheitliche Retrieval-Pipeline, in der sich Bedeutung und Struktur gegenseitig verstärken, anstatt in getrennten Systemen zu leben.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> ist ein wichtiger Bestandteil dieser Volltextfunktion. Es identifiziert Sequenzen von Begriffen, die zusammen und in der richtigen Reihenfolge auftreten - wichtig für die Erkennung von Protokollmustern, Fehlersignaturen, Produktnamen und jedem Text, in dem die Wortreihenfolge die Bedeutung definiert. In diesem Beitrag erklären wir, wie <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> in <a href="https://milvus.io/">Milvus</a> funktioniert, wie <code translate="no">slop</code> die für realen Text erforderliche Flexibilität hinzufügt und warum diese Funktionen eine hybride Vektor-Volltextsuche innerhalb einer einzigen Datenbank nicht nur möglich, sondern praktisch machen.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">Was ist Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match ist ein Volltext-Abfragetyp in Milvus, der sich auf die <em>Struktur</em>konzentriert <em>, d. h.</em>darauf, ob eine Folge von Wörtern in einem Dokument in der gleichen Reihenfolge erscheint. Wenn keine Flexibilität erlaubt ist, verhält sich die Abfrage streng: die Begriffe müssen nebeneinander und in der richtigen Reihenfolge erscheinen. Eine Abfrage wie <strong>"Robotik, maschinelles Lernen"</strong> passt daher nur, wenn diese drei Wörter als zusammenhängende Phrase vorkommen.</p>
<p>Die Herausforderung besteht darin, dass sich echter Text selten so sauber verhält. Natürliche Sprache führt zu Rauschen: Zusätzliche Adjektive schleichen sich ein, Protokolle ordnen Felder neu an, Produktnamen erhalten Modifikatoren, und menschliche Autoren schreiben nicht mit Blick auf Abfragemaschinen. Eine strenge Phrasenübereinstimmung wird leicht gebrochen - ein eingefügtes Wort, eine Umformulierung oder ein vertauschter Begriff kann einen Fehler verursachen. Und in vielen KI-Systemen, insbesondere in produktionsnahen Systemen, ist das Fehlen einer relevanten Protokollzeile oder eines die Regel auslösenden Satzes nicht akzeptabel.</p>
<p>Milvus 2.6 begegnet dieser Reibung mit einem einfachen Mechanismus: <strong>Slop</strong>. Slop definiert <em>den Spielraum, der zwischen den Abfragebegriffen erlaubt ist</em>. Anstatt eine Phrase als spröde und unflexibel zu behandeln, können Sie mit Slop entscheiden, ob ein zusätzliches Wort toleriert werden kann, oder zwei, oder sogar, ob eine geringfügige Umordnung noch als Übereinstimmung zählen soll. Damit wird die Phrasensuche von einem binären Test (bestanden/nicht bestanden) zu einem kontrollierten, einstellbaren Suchwerkzeug.</p>
<p>Um zu verstehen, warum dies wichtig ist, stellen Sie sich vor, Sie suchen in den Protokollen nach allen Varianten des bekannten Netzwerkfehlers <strong>"connection reset by peer".</strong> In der Praxis könnten Ihre Protokolle wie folgt aussehen:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>Auf den ersten Blick handelt es sich bei allen um dasselbe Ereignis. Aber die üblichen Suchmethoden haben Schwierigkeiten:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 kämpft mit der Struktur.</h3><p>Es betrachtet die Abfrage als eine Ansammlung von Schlüsselwörtern und ignoriert die Reihenfolge, in der sie erscheinen. Solange "connection" und "peer" irgendwo auftauchen, kann BM25 das Dokument hoch einstufen - selbst wenn die Phrase invertiert ist oder nichts mit dem Konzept zu tun hat, nach dem Sie eigentlich suchen.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">Die Vektorsuche hat mit Einschränkungen zu kämpfen.</h3><p>Einbettungen eignen sich hervorragend zum Erfassen von Bedeutung und semantischen Beziehungen, aber sie können keine Regel wie "diese Wörter müssen in dieser Reihenfolge erscheinen" durchsetzen. Sie können zwar semantisch verwandte Nachrichten abrufen, aber dennoch das genaue Strukturmuster vermissen, das für die Fehlersuche oder die Einhaltung von Vorschriften erforderlich ist.</p>
<p>Phrase Match füllt die Lücke zwischen diesen beiden Ansätzen. Durch die Verwendung von <strong>Slop</strong> können Sie genau angeben, wie viel Abweichung akzeptabel ist:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Exakte Übereinstimmung (Alle Begriffe müssen zusammenhängend und in der richtigen Reihenfolge vorkommen.)</p></li>
<li><p><code translate="no">slop = 1</code> - Ein zusätzliches Wort zulassen (Deckt häufige Variationen in der natürlichen Sprache mit einem einzigen eingefügten Begriff ab).</p></li>
<li><p><code translate="no">slop = 2</code> - Mehrere eingefügte Wörter zulassen (für beschreibendere oder ausführlichere Formulierungen).</p></li>
<li><p><code translate="no">slop = 3</code> - Umordnung zulassen (Unterstützt umgekehrte oder lose geordnete Sätze, was in der Praxis oft der schwierigste Fall ist).</p></li>
</ul>
<p>Anstatt zu hoffen, dass der Bewertungsalgorithmus "alles richtig macht", geben Sie explizit die strukturelle Toleranz an, die Ihre Anwendung erfordert.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Wie Phrase Match in Milvus funktioniert<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match in Milvus basiert auf der <a href="https://github.com/quickwit-oss/tantivy">Tantivy-Suchmaschinenbibliothek</a> und ist auf der Grundlage eines invertierten Index mit Positionsinformationen implementiert. Anstatt nur zu prüfen, ob Begriffe in einem Dokument vorkommen, wird überprüft, ob sie in der richtigen Reihenfolge und innerhalb eines kontrollierbaren Abstands erscheinen.</p>
<p>Das folgende Diagramm veranschaulicht den Prozess:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokenisierung von Dokumenten (mit Positionen)</strong></p>
<p>Wenn Dokumente in Milvus eingefügt werden, werden die Textfelder von einem <a href="https://milvus.io/docs/analyzer-overview.md">Analysator</a> verarbeitet, der den Text in Token (Wörter oder Begriffe) zerlegt und die Position jedes Tokens innerhalb des Dokuments aufzeichnet. Zum Beispiel wird <code translate="no">doc_1</code> in Token zerlegt als: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Erstellung eines invertierten Index</strong></p>
<p>Als nächstes erstellt Milvus einen invertierten Index. Anstatt Dokumente ihrem Inhalt zuzuordnen, ordnet der invertierte Index jedes Token den Dokumenten zu, in denen es vorkommt, zusammen mit allen aufgezeichneten Positionen dieses Tokens innerhalb jedes Dokuments.</p>
<p><strong>3. Phrase Matching</strong></p>
<p>Wenn eine Phrasenabfrage ausgeführt wird, verwendet Milvus zunächst den invertierten Index, um Dokumente zu identifizieren, die alle Token der Abfrage enthalten. Anschließend wird jeder Kandidat durch einen Vergleich der Tokenpositionen validiert, um sicherzustellen, dass die Begriffe in der richtigen Reihenfolge und innerhalb des zulässigen Abstands <code translate="no">slop</code> erscheinen. Nur Dokumente, die beide Bedingungen erfüllen, werden als Treffer zurückgegeben.</p>
<p>Das folgende Diagramm fasst zusammen, wie Phrase Match durchgängig funktioniert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">So aktivieren Sie Phrase Match in Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match funktioniert mit Feldern des Typs <strong><code translate="no">VARCHAR</code></strong>ist der String-Typ in Milvus. Um es zu verwenden, müssen Sie Ihr Sammlungsschema so konfigurieren, dass Milvus eine Textanalyse durchführt und Positionsinformationen für das Feld speichert. Dies geschieht durch die Aktivierung von zwei Parametern: <code translate="no">enable_analyzer</code> und <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Aktivieren Sie enable_analyzer und enable_match</h3><p>Um Phrase Match für ein bestimmtes VARCHAR-Feld zu aktivieren, setzen Sie beide Parameter bei der Definition des Feldschemas auf <code translate="no">True</code>. Zusammen weisen sie Milvus an,:</p>
<ul>
<li><p>den Text<strong>zu tokenisieren</strong> (über <code translate="no">enable_analyzer</code>), und</p></li>
<li><p><strong>einen invertierten Index mit Positionsoffsets zu erstellen</strong> (über <code translate="no">enable_match</code>).</p></li>
</ul>
<p>Phrase Match stützt sich auf beide Schritte: Der Analysator zerlegt den Text in Token, und der Match-Index speichert, wo diese Token erscheinen, was effiziente phrasen- und slop-basierte Abfragen ermöglicht.</p>
<p>Nachfolgend ein Beispiel für eine Schemakonfiguration, die Phrase Match für ein Feld <code translate="no">text</code> aktiviert:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Suche mit Phrase Match: Wie Slop den Kandidatensatz beeinflusst<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald Sie den Abgleich für ein VARCHAR-Feld in Ihrem Auflistungsschema aktiviert haben, können Sie Phrasenabgleiche mit dem Ausdruck <code translate="no">PHRASE_MATCH</code> durchführen.</p>
<p>Hinweis: Beim <code translate="no">PHRASE_MATCH</code> -Ausdruck wird die Groß-/Kleinschreibung nicht berücksichtigt. Sie können entweder <code translate="no">PHRASE_MATCH</code> oder <code translate="no">phrase_match</code> verwenden.</p>
<p>Bei Suchvorgängen wird die Phrasenübereinstimmung in der Regel vor der Vektorähnlichkeitsbewertung angewendet. Zunächst werden die Dokumente auf der Grundlage expliziter textlicher Einschränkungen gefiltert, wodurch die Kandidatengruppe eingegrenzt wird. Die verbleibenden Dokumente werden dann mithilfe von Vektoreinbettungen neu eingestuft.</p>
<p>Das folgende Beispiel zeigt, wie verschiedene <code translate="no">slop</code> Werte diesen Prozess beeinflussen. Durch die Anpassung des Parameters <code translate="no">slop</code> können Sie direkt steuern, welche Dokumente den Phrasenfilter passieren und mit der Vektor-Ranking-Phase fortfahren.</p>
<p>Angenommen, Sie haben eine Sammlung mit dem Namen <code translate="no">tech_articles</code>, die die folgenden fünf Entitäten enthält:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Maschinelles Lernen steigert die Effizienz bei der Analyse großer Datenmengen</td></tr>
<tr><td>2</td><td>Das Erlernen eines maschinenbasierten Ansatzes ist für den Fortschritt der modernen KI unerlässlich</td></tr>
<tr><td>3</td><td>Maschinenarchitekturen für maschinelles Lernen optimieren die Rechenlast</td></tr>
<tr><td>4</td><td>Maschinen verbessern schnell die Modellleistung für kontinuierliches Lernen</td></tr>
<tr><td>5</td><td>Das Erlernen fortschrittlicher Maschinenalgorithmen erweitert die KI-Fähigkeiten</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Hier erlauben wir einen Slop von 1. Der Filter wird auf Dokumente angewandt, die den Ausdruck "Lernmaschine" enthalten, wobei eine leichte Flexibilität besteht.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Ergebnisse der Übereinstimmung:</p>
<table>
<thead>
<tr><th>doc_id</th><th>Text</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Das Erlernen eines maschinenbasierten Ansatzes ist für den Fortschritt der modernen KI unerlässlich</td></tr>
<tr><td>3</td><td>Deep Learning-Maschinenarchitekturen optimieren die Rechenlast</td></tr>
<tr><td>5</td><td>Das Erlernen fortgeschrittener maschineller Algorithmen erweitert die Fähigkeiten der KI</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>In diesem Beispiel ist ein Slop von 2 erlaubt, was bedeutet, dass bis zu zwei zusätzliche Token (oder umgekehrte Begriffe) zwischen den Wörtern "Maschine" und "Lernen" erlaubt sind.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Übereinstimmungsergebnisse:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>Text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Maschinelles Lernen steigert die Effizienz bei der Analyse großer Datenmengen</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Maschinenarchitekturen für maschinelles Lernen optimieren die Rechenlast</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>In diesem Beispiel sorgt ein Slop von 3 für noch mehr Flexibilität. Der Filter sucht nach "maschinellem Lernen", wobei bis zu drei Tokenpositionen zwischen den Wörtern zulässig sind.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Ergebnisse der Suche:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>Text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Maschinelles Lernen steigert die Effizienz bei der Analyse großer Datenmengen</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">Das Erlernen eines maschinenbasierten Ansatzes ist für den Fortschritt der modernen KI unerlässlich</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Maschinenarchitekturen für maschinelles Lernen optimieren die Rechenlast</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">Das Erlernen fortgeschrittener maschineller Algorithmen erweitert die KI-Fähigkeiten</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Schnelle Tipps: Was Sie vor dem Aktivieren von Phrase Match in Milvus wissen müssen<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match bietet Unterstützung für Filterung auf Phrasenebene, aber die Aktivierung erfordert mehr als nur die Konfiguration zur Abfragezeit. Es ist hilfreich, sich über die damit verbundenen Überlegungen im Klaren zu sein, bevor man sie in einer Produktionsumgebung anwendet.</p>
<ul>
<li><p>Durch die Aktivierung von Phrase Match für ein Feld wird ein invertierter Index erstellt, der die Speichernutzung erhöht. Die genauen Kosten hängen von Faktoren wie der Textlänge, der Anzahl der eindeutigen Token und der Konfiguration des Analysators ab. Bei der Arbeit mit großen Textfeldern oder Daten mit hoher Kardinalität sollte dieser Mehraufwand im Voraus berücksichtigt werden.</p></li>
<li><p>Die Konfiguration des Analysators ist eine weitere wichtige Designentscheidung. Sobald ein Analysator im Sammlungsschema definiert ist, kann er nicht mehr geändert werden. Um später zu einem anderen Analysator zu wechseln, muss die vorhandene Sammlung gelöscht und mit einem neuen Schema neu erstellt werden. Aus diesem Grund sollte die Auswahl des Analysators als langfristige Entscheidung und nicht als Experiment betrachtet werden.</p></li>
<li><p>Das Verhalten von Phrase Match ist eng mit der Tokenisierung des Textes verbunden. Bevor Sie einen Analyzer auf eine ganze Sammlung anwenden, empfiehlt es sich, die Methode <code translate="no">run_analyzer</code> zu verwenden, um die Tokenisierungsausgabe zu prüfen und zu bestätigen, dass sie Ihren Erwartungen entspricht. Dieser Schritt kann dazu beitragen, subtile Unstimmigkeiten und unerwartete Abfrageergebnisse zu vermeiden. Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Analyzer-Übersicht</a>.</p></li>
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
    </button></h2><p>Phrase Match ist ein zentraler Volltext-Suchtyp, der über den einfachen Abgleich von Schlüsselwörtern hinaus Einschränkungen auf Satz- und Positionsebene ermöglicht. Durch die Verwendung von Tokenreihenfolge und -nähe bietet er eine vorhersehbare und präzise Möglichkeit, Dokumente auf der Grundlage des tatsächlichen Vorkommens von Begriffen im Text zu filtern.</p>
<p>In modernen Retrievalsystemen wird Phrase Match in der Regel vor einem vektorbasierten Ranking angewendet. Dabei wird die Kandidatenmenge zunächst auf Dokumente eingeschränkt, die explizit den erforderlichen Phrasen oder Strukturen entsprechen. Die Vektorsuche wird dann verwendet, um diese Ergebnisse nach semantischer Relevanz zu ordnen. Dieses Muster ist besonders effektiv in Szenarien wie der Protokollanalyse, der Suche nach technischer Dokumentation und RAG-Pipelines, wo textuelle Einschränkungen durchgesetzt werden müssen, bevor die semantische Ähnlichkeit berücksichtigt wird.</p>
<p>Mit der Einführung des <code translate="no">slop</code> Parameters in Milvus 2.6 wird Phrase Match toleranter gegenüber Variationen in der natürlichen Sprache und behält gleichzeitig seine Rolle als Volltext-Filtermechanismus. Dies erleichtert die Anwendung von Beschränkungen auf Phrasenebene in produktiven Retrieval-Workflows.</p>
<p>Probieren Sie es mit den <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">Demo-Skripten</a> aus, und erkunden Sie <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>, um zu sehen, wie phrase-aware Retrieval in Ihren Stack passt.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion des neuesten Milvus näher kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige persönliche Sitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
