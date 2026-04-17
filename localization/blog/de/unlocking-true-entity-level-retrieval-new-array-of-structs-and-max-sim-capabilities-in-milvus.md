---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Echte Abfrage auf Entity-Ebene: Neue Array-of-Structs und MAX_SIM-Fähigkeiten
  in Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Erfahren Sie, wie Array of Structs und MAX_SIM in Milvus eine echte Suche auf
  Entity-Ebene für Multivektordaten ermöglichen, wodurch Deduping vermieden und
  die Abfragegenauigkeit verbessert wird.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Wenn Sie KI-Anwendungen auf der Grundlage von Vektordatenbanken entwickelt haben, sind Sie wahrscheinlich auf denselben Schmerzpunkt gestoßen: Die Datenbank ruft die Einbettungen einzelner Chunks ab, aber Ihre Anwendung interessiert sich für <strong><em>Entitäten</em>.</strong> Diese Diskrepanz macht den gesamten Abruf-Workflow komplex.</p>
<p>Sie haben dies wahrscheinlich schon oft erlebt:</p>
<ul>
<li><p><strong>RAG-Wissensdatenbanken:</strong> Artikel sind in Absatzeinbettungen unterteilt, so dass die Suchmaschine verstreute Fragmente anstelle des vollständigen Dokuments liefert.</p></li>
<li><p><strong>E-Commerce-Empfehlung:</strong> Ein Produkt hat mehrere Bildeinbettungen, und Ihr System gibt fünf Ansichten desselben Artikels zurück, anstatt fünf einzigartige Produkte.</p></li>
<li><p><strong>Video-Plattformen:</strong> Videos sind in Clip-Einbettungen aufgeteilt, aber die Suchergebnisse zeigen eher Ausschnitte desselben Videos als einen einzigen konsolidierten Eintrag.</p></li>
<li><p><strong>ColBERT-/ColPali-ähnliche Abfrage:</strong> Dokumente werden in Hunderte von Token- oder Patch-Ebenen aufgeteilt, und die Ergebnisse werden in winzigen Stücken angezeigt, die noch zusammengeführt werden müssen.</p></li>
</ul>
<p>Alle diese Probleme sind auf <em>dieselbe architektonische Lücke</em> zurückzuführen: Die meisten Vektordatenbanken behandeln jede Einbettung als isolierte Zeile, während reale Anwendungen mit Entitäten auf höherer Ebene arbeiten - Dokumente, Produkte, Videos, Objekte, Szenen. Infolgedessen sind Entwicklungsteams gezwungen, Entitäten manuell zu rekonstruieren, indem sie Deduplizierungs-, Gruppierungs-, Bucketing- und Reranking-Logik verwenden. Das funktioniert zwar, ist aber anfällig und langsam und bläht die Anwendungsschicht mit Logik auf, die dort gar nicht erst hätte untergebracht werden sollen.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> schließt diese Lücke mit einer neuen Funktion: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> mit dem metrischen Typ <strong>MAX_SIM</strong>. Zusammen erlauben sie es, alle Einbettungen für eine einzelne Entität in einem einzigen Datensatz zu speichern und ermöglichen es Milvus, die Entität ganzheitlich zu bewerten und zurückzugeben. Keine doppelt gefüllten Ergebnismengen mehr. Kein komplexes Post-Processing wie Reranking und Merging mehr</p>
<p>In diesem Artikel werden wir die Funktionsweise von Array of Structs und MAX_SIM erläutern und anhand von zwei realen Beispielen demonstrieren: Die Suche nach Wikipedia-Dokumenten und die bildbasierte ColPali-Dokumentensuche.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Was ist ein Array of Structs?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus ermöglicht ein <strong>Array of Structs</strong> Feld, dass ein einzelner Datensatz eine <em>geordnete Liste</em> von Struct-Elementen enthält, die alle dem gleichen vordefinierten Schema folgen. Eine Struct kann sowohl mehrere Vektoren als auch skalare Felder, Strings oder andere unterstützte Typen enthalten. Mit anderen Worten: Sie können damit alle Teile, die zu einer Entität gehören - Absatzeinbettungen, Bildansichten, Token-Vektoren, Metadaten - direkt in einer Zeile bündeln.</p>
<p>Hier ist ein Beispiel für eine Entität aus einer Sammlung, die ein Array of Structs-Feld enthält.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Im obigen Beispiel ist das Feld <code translate="no">chunks</code> ein Array of Structs-Feld, und jedes Struct-Element enthält seine eigenen Felder, nämlich <code translate="no">text</code>, <code translate="no">text_vector</code> und <code translate="no">chapter</code>.</p>
<p>Mit diesem Ansatz wird ein seit langem bestehendes Modellierungsproblem in Vektordatenbanken gelöst. Traditionell muss jede Einbettung oder jedes Attribut eine eigene Zeile werden, was dazu führt, dass <strong>Multi-Vektor-Entitäten (Dokumente, Produkte, Videos)</strong> in Dutzende, Hunderte oder sogar Tausende von Datensätzen aufgeteilt werden müssen. Mit Array of Structs können Sie mit Milvus die gesamte Multi-Vektor-Entität in einem einzigen Feld speichern, was es zu einer natürlichen Lösung für Absatzlisten, Token-Einbettungen, Clip-Sequenzen, Multi-View-Bilder oder jedes Szenario macht, in dem ein logisches Element aus vielen Vektoren besteht.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Wie funktioniert ein Array von Structs mit MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Über dieser neuen Array of Structs-Struktur liegt <strong>MAX_SIM</strong>, eine neue Bewertungsstrategie, die das semantische Retrieval entitätenorientiert macht. Wenn eine Anfrage eingeht, vergleicht Milvus sie mit <em>jedem</em> Vektor in jedem Array of Structs und nimmt die <strong>maximale Ähnlichkeit</strong> als endgültige Punktzahl für die Entität. Die Entität wird dann auf der Grundlage dieser einzelnen Punktzahl eingestuft und zurückgegeben. Auf diese Weise wird das klassische Vektor-Datenbankproblem des Abrufs verstreuter Fragmente vermieden und die Last des Gruppierens, Dedupierens und Neueinordnens in die Anwendungsschicht verlagert. Mit MAX_SIM wird der Abruf auf Entitätsebene integriert, konsistent und effizient.</p>
<p>Um zu verstehen, wie MAX_SIM in der Praxis funktioniert, lassen Sie uns ein konkretes Beispiel durchgehen.</p>
<p><strong>Hinweis:</strong> Alle Vektoren in diesem Beispiel werden mit demselben Einbettungsmodell erzeugt, und die Ähnlichkeit wird mit der Kosinusähnlichkeit im Bereich [0,1] gemessen.</p>
<p>Angenommen, ein Benutzer sucht nach <strong>"Machine Learning Beginner Course".</strong></p>
<p>Die Abfrage wird in drei <strong>Token</strong> unterteilt:</p>
<ul>
<li><p><em>Maschinelles Lernen</em></p></li>
<li><p><em>Anfänger</em></p></li>
<li><p><em>Kurs</em></p></li>
</ul>
<p>Jedes dieser Token wird dann mit demselben <strong>Einbettungsmodell</strong>, das für die Dokumente verwendet wurde <strong>, in einen Einbettungsvektor umgewandelt</strong>.</p>
<p>Stellen Sie sich nun vor, die Vektordatenbank enthält zwei Dokumente:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>An Introduction Guide to Deep Neural Networks with Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>Ein Leitfaden für Fortgeschrittene zum Lesen von LLM-Papieren</em></p></li>
</ul>
<p>Beide Dokumente wurden in Vektoren eingebettet und in einem Array of Structs gespeichert.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Schritt 1: Berechnen von MAX_SIM für doc_1</strong></h3><p>Für jeden Abfragevektor berechnet Milvus seine Kosinusähnlichkeit mit jedem Vektor in doc_1:</p>
<table>
<thead>
<tr><th></th><th>Einführung</th><th>Leitfaden</th><th>tiefe neuronale Netze</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>maschinelles lernen</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>Anfänger</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>Kurs</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Für jeden Abfragevektor wählt MAX_SIM die <strong>höchste</strong> Ähnlichkeit aus seiner Zeile aus:</p>
<ul>
<li><p>Maschinelles Lernen → Tiefe neuronale Netze (0.9)</p></li>
<li><p>Einsteiger → Einführung (0.8)</p></li>
<li><p>Kurs → Leitfaden (0,7)</p></li>
</ul>
<p>Die Summierung der besten Übereinstimmungen ergibt für doc_1 einen <strong>MAX_SIM-Wert von 2,4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Schritt 2: Berechnen von MAX_SIM für doc_2</h3><p>Nun wiederholen wir den Vorgang für doc_2:</p>
<table>
<thead>
<tr><th></th><th>advanced</th><th>Leitfaden</th><th>LLM</th><th>Papier</th><th>Lesen</th></tr>
</thead>
<tbody>
<tr><td>Maschinelles Lernen</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>Anfänger</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>Kurs</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Die besten Übereinstimmungen für doc_2 sind:</p>
<ul>
<li><p>"Maschinelles Lernen" → "LLM" (0,9)</p></li>
<li><p>"Anfänger" → "Anleitung" (0.6)</p></li>
<li><p>"Kurs" → "Leitfaden" (0,8)</p></li>
</ul>
<p>Summiert man sie, erhält doc_2 eine <strong>MAX_SIM-Punktzahl von 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Schritt 3: Vergleichen Sie die Punktzahlen</h3><p>Da <strong>2,4 &gt; 2,3</strong>, <strong>rangiert doc_1 höher als doc_2</strong>, was intuitiv Sinn macht, da doc_1 näher an einem Einführungshandbuch für maschinelles Lernen ist.</p>
<p>Anhand dieses Beispiels können wir drei Hauptmerkmale von MAX_SIM hervorheben:</p>
<ul>
<li><p><strong>Semantisch zuerst, nicht schlagwortbasiert:</strong> MAX_SIM vergleicht Einbettungen, nicht Textliterale. Obwohl <em>"maschinelles Lernen"</em> und <em>"tiefe neuronale Netze"</em> null überlappende Wörter haben, beträgt ihre semantische Ähnlichkeit 0,9. Das macht MAX_SIM robust gegenüber Synonymen, Paraphrasen, konzeptionellen Überschneidungen und modernen, einbettungsreichen Arbeitslasten.</p></li>
<li><p><strong>Unempfindlich gegenüber Länge und Reihenfolge:</strong> MAX_SIM setzt nicht voraus, dass die Anfrage und das Dokument die gleiche Anzahl von Vektoren haben (z.B. doc_1 hat 4 Vektoren, doc_2 hat 5, und beide funktionieren gut). Auch die Reihenfolge der Vektoren spielt keine Rolle - wenn "Anfänger" am Anfang der Abfrage und "Einführung" am Ende des Dokuments steht, hat das keine Auswirkungen auf die Bewertung.</p></li>
<li><p><strong>Jeder Abfragevektor ist wichtig:</strong> MAX_SIM nimmt die beste Übereinstimmung für jeden Abfragevektor und summiert diese besten Ergebnisse. Dadurch wird verhindert, dass nicht übereinstimmende Vektoren das Ergebnis verzerren, und es wird sichergestellt, dass jedes wichtige Abfrage-Token zum Endergebnis beiträgt. Zum Beispiel reduziert die minderwertige Übereinstimmung für "Anfänger" in doc_2 direkt die Gesamtpunktzahl.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Warum MAX_SIM + Array of Structs in der Vektordatenbank wichtig sind<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> ist eine hochleistungsfähige Open-Source-Vektordatenbank und unterstützt jetzt MAX_SIM zusammen mit Array of Structs, was eine vektor-native Multi-Vektor-Suche auf Entity-Ebene ermöglicht:</p>
<ul>
<li><p><strong>Speichern Sie Multi-Vektor-Entitäten nativ:</strong> Mit Array of Structs können Sie Gruppen verwandter Vektoren in einem einzigen Feld speichern, ohne sie in separate Zeilen oder Hilfstabellen aufzuteilen.</p></li>
<li><p><strong>Effiziente Best-Match-Berechnung:</strong> In Kombination mit Vektorindizes wie IVF und HNSW kann MAX_SIM die besten Übereinstimmungen berechnen, ohne jeden Vektor zu scannen, und so die Leistung auch bei großen Dokumenten hoch halten.</p></li>
<li><p><strong>Speziell für semantiklastige Arbeitslasten entwickelt:</strong> Dieser Ansatz eignet sich hervorragend für die Suche nach langen Texten, das semantische Matching mit mehreren Facetten, den Abgleich von Dokumenten und Zusammenfassungen, Abfragen mit mehreren Schlüsselwörtern und andere KI-Szenarien, die flexible, feinkörnige semantische Schlussfolgerungen erfordern.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Wann sollte man ein Array of Structs verwenden?<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Wert von <strong>Array of Structs</strong> wird deutlich, wenn man sich ansieht, was es ermöglicht. Im Kern bietet diese Funktion drei grundlegende Fähigkeiten:</p>
<ul>
<li><p><strong>Es bündelt heterogene Daten - Vektoren</strong>, Skalare, Strings, Metadaten - zu einem einzigen strukturierten Objekt.</p></li>
<li><p><strong>Es gleicht die Speicherung an reale Entitäten</strong> an, so dass jede Datenbankzeile sauber auf ein tatsächliches Element wie einen Artikel, ein Produkt oder ein Video abgebildet wird.</p></li>
<li><p><strong>In Kombination mit Aggregatfunktionen wie MAX_SIM</strong> ermöglicht es eine echte Multi-Vektor-Abfrage auf Entity-Ebene direkt aus der Datenbank, wodurch Deduplizierung, Gruppierung oder Neuordnung in der Anwendungsschicht vermieden werden.</p></li>
</ul>
<p>Aufgrund dieser Eigenschaften eignet sich Array of Structs immer dann, wenn eine <em>einzelne logische Entität durch mehrere Vektoren dargestellt wird</em>. Gängige Beispiele sind Artikel, die in Absätze aufgeteilt sind, Dokumente, die in Token-Einbettungen zerlegt sind, oder Produkte, die durch mehrere Bilder dargestellt werden. Wenn Ihre Suchergebnisse unter doppelten Treffern, verstreuten Fragmenten oder dem mehrfachen Auftauchen derselben Entität in den Top-Ergebnissen leiden, löst Array of Structs diese Probleme in der Speicher- und Abrufschicht - und nicht durch nachträgliche Anpassungen im Anwendungscode.</p>
<p>Dieses Muster ist besonders leistungsfähig für moderne KI-Systeme, die auf die <strong>Abfrage mehrerer Vektoren</strong> angewiesen sind, z. B:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> stellt ein einzelnes Dokument als 100-500 Token-Einbettungen dar, um einen feinkörnigen semantischen Abgleich in Bereichen wie Rechtstexten und akademischer Forschung zu ermöglichen.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> konvertiert </a>jede PDF-Seite in 256-1024 Bildfelder für die cross-modale Suche in Finanzberichten, Verträgen, Rechnungen und anderen gescannten Dokumenten.</p></li>
</ul>
<p>Mit einem Array von Structs kann Milvus all diese Vektoren unter einer einzigen Entität speichern und die aggregierte Ähnlichkeit (z. B. MAX_SIM) effizient und nativ berechnen. Um dies zu verdeutlichen, sind hier zwei konkrete Beispiele.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Beispiel 1: E-Commerce-Produktsuche</h3><p>Bisher wurden Produkte mit mehreren Bildern in einem flachen Schema gespeichert - ein Bild pro Zeile. Ein Produkt mit Front-, Seiten- und Schrägaufnahmen ergab drei Zeilen. Die Suchergebnisse lieferten oft mehrere Bilder desselben Produkts, was eine manuelle Deduplizierung und Neuordnung erforderte.</p>
<p>Mit einem Array of Structs wird jedes Produkt zu <strong>einer Zeile</strong>. Alle Bildeinbettungen und Metadaten (Winkel, is_primary, etc.) befinden sich in einem <code translate="no">images</code> Feld als Array of Structs. Milvus versteht, dass sie zum selben Produkt gehören und gibt das Produkt als Ganzes zurück - nicht die einzelnen Bilder.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Beispiel 2: Wissensdatenbank oder Wikipedia-Suche</h3><p>Zuvor war ein einzelner Wikipedia-Artikel in <em>N</em> Absatzzeilen aufgeteilt. Die Suchergebnisse lieferten verstreute Absätze, so dass das System gezwungen war, sie zu gruppieren und zu erraten, zu welchem Artikel sie gehörten.</p>
<p>Mit einem Array of Structs wird der gesamte Artikel zu <strong>einer einzigen Zeile</strong>. Alle Absätze und ihre Einbettungen werden unter einem Absatzfeld gruppiert, und die Datenbank gibt den gesamten Artikel zurück, nicht nur fragmentierte Teile.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Praktische Tutorials: Retrieval auf Dokumentenebene mit dem Array of Structs<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Abrufen von Wikipedia-Dokumenten</h3><p>In diesem Tutorial wird gezeigt, wie ein <strong>Array of Structs</strong> verwendet wird, um Daten auf Absatzebene in vollständige Dokumentendatensätze umzuwandeln - so dass Milvus eine <strong>echte Abfrage auf Dokumentebene</strong> durchführen kann, anstatt isolierte Fragmente zurückzugeben.</p>
<p>Viele Wissensdatenbank-Pipelines speichern Wikipedia-Artikel als Absatzabschnitte. Dies eignet sich gut für die Einbettung und Indizierung, beeinträchtigt aber die Abfrage: Eine Benutzerabfrage liefert in der Regel verstreute Absätze, so dass Sie gezwungen sind, den Artikel manuell zu gruppieren und zu rekonstruieren. Mit einem Array of Structs und MAX_SIM können wir das Speicherschema so umgestalten, dass <strong>jeder Artikel zu einer Zeile wird</strong>, und Milvus kann das gesamte Dokument nativ einordnen und zurückgeben.</p>
<p>In den nächsten Schritten werden wir zeigen, wie man:</p>
<ol>
<li><p>Laden und Vorverarbeiten von Wikipedia-Absatzdaten</p></li>
<li><p>Bündeln aller Absätze, die zum selben Artikel gehören, in ein Array von Structs</p></li>
<li><p>Einfügen dieser strukturierten Dokumente in Milvus</p></li>
<li><p>MAX_SIM-Abfragen ausführen, um vollständige Artikel abzurufen - sauber, ohne Deduplizierung oder Reranking</p></li>
</ol>
<p>Am Ende dieses Tutorials werden Sie eine funktionierende Pipeline haben, in der Milvus die Abfrage auf Entity-Ebene direkt durchführt, genau so, wie es die Benutzer erwarten.</p>
<p><strong>Datenmodell:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 1: Gruppieren und Transformieren der Daten</strong></p>
<p>Für diese Demo verwenden wir den Datensatz <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 2: Erstellen der Milvus-Sammlung</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 3: Daten einfügen und Index erstellen</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 4: Dokumente suchen</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Vergleich der Ergebnisse: Traditionelles Retrieval vs. Array of Structs</strong></p>
<p>Die Auswirkungen von Array of Structs werden deutlich, wenn wir uns ansehen, was die Datenbank tatsächlich zurückgibt:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimension</strong></th><th style="text-align:center"><strong>Traditioneller Ansatz</strong></th><th style="text-align:center"><strong>Array von Strukturen</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Datenbank-Ausgabe</strong></td><td style="text-align:center">Liefert die <strong>100 besten Absätze</strong> (hohe Redundanz)</td><td style="text-align:center">Gibt die <em>10 besten vollständigen Dokumente</em> zurück - sauber und genau</td></tr>
<tr><td style="text-align:center"><strong>Anwendungslogik</strong></td><td style="text-align:center">Erfordert <strong>Gruppierung, Deduplizierung und Reranking</strong> (komplex)</td><td style="text-align:center">Keine Nachbearbeitung erforderlich - Ergebnisse auf Entity-Ebene kommen direkt von Milvus</td></tr>
</tbody>
</table>
<p>Im Wikipedia-Beispiel haben wir nur den einfachsten Fall demonstriert: die Kombination von Absatzvektoren zu einer einheitlichen Dokumentendarstellung. Die eigentliche Stärke von Array of Structs ist jedoch die Verallgemeinerbarkeit für <strong>jedes</strong> Multi-Vektor-Datenmodell - sowohl für klassische Retrieval-Pipelines als auch für moderne KI-Architekturen.</p>
<p><strong>Traditionelle Multi-Vektor-Retrieval-Szenarien</strong></p>
<p>Viele etablierte Such- und Empfehlungssysteme arbeiten natürlich mit Entitäten, die mehrere Vektoren enthalten. Array of Structs lässt sich sauber auf diese Anwendungsfälle abbilden:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Szenario</strong></th><th style="text-align:center"><strong>Datenmodell</strong></th><th style="text-align:center"><strong>Vektoren pro Entität</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Produkte im elektronischen Handel</strong></td><td style="text-align:center">Ein Produkt → mehrere Bilder</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Videosuche</strong></td><td style="text-align:center">Ein Video → mehrere Clips</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Papierrecherche</strong></td><td style="text-align:center">Ein Papier → mehrere Abschnitte</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Arbeitslasten von KI-Modellen (wichtige Anwendungsfälle mit mehreren Vektoren)</strong></p>
<p>Array of Structs wird in modernen KI-Modellen, die absichtlich große Mengen von Vektoren pro Entität für feinkörnige semantische Schlussfolgerungen erzeugen, noch wichtiger.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modell</strong></th><th style="text-align:center"><strong>Datenmodell</strong></th><th style="text-align:center"><strong>Vektoren pro Entität</strong></th><th style="text-align:center"><strong>Anwendung</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Ein Dokument → viele Token-Einbettungen</td><td style="text-align:center">100-500</td><td style="text-align:center">Juristische Texte, akademische Arbeiten, feinkörnige Dokumentensuche</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Eine PDF-Seite → viele Patch-Einbettungen</td><td style="text-align:center">256-1024</td><td style="text-align:center">Finanzberichte, Verträge, Rechnungen, multimodale Dokumentensuche</td></tr>
</tbody>
</table>
<p>Diese Modelle <em>erfordern</em> ein Multi-Vektor-Speicherschema. Vor Array of Structs mussten die Entwickler die Vektoren auf verschiedene Zeilen aufteilen und die Ergebnisse manuell wieder zusammenfügen. Mit Milvus können diese Entitäten nun nativ gespeichert und abgerufen werden, wobei MAX_SIM die Bewertung auf Dokumentenebene automatisch vornimmt.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. ColPali Bildgestützte Dokumentensuche</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> ist ein leistungsstarkes Modell für die cross-modale PDF-Suche. Anstatt sich auf Text zu verlassen, verarbeitet es jede PDF-Seite als Bild und zerlegt es in bis zu 1024 visuelle Felder, wobei pro Feld eine Einbettung erzeugt wird. In einem herkömmlichen Datenbankschema würde dies bedeuten, dass eine einzelne Seite in Hunderten oder Tausenden von separaten Zeilen gespeichert werden müsste, was es der Datenbank unmöglich machen würde, zu erkennen, dass diese Zeilen zur selben Seite gehören. Infolgedessen wird die Suche auf Entitätsebene fragmentiert und unpraktisch.</p>
<p>Array of Structs löst dieses Problem sauber, indem es alle Patch-Einbettungen <em>in einem einzigen Feld</em> speichert, wodurch Milvus die Seite als eine zusammenhängende Multi-Vektor-Entität behandeln kann.</p>
<p>Die herkömmliche PDF-Suche hängt oft von <strong>OCR</strong> ab, die Seitenbilder in Text umwandelt. Dies funktioniert bei einfachem Text, aber es gehen Diagramme, Tabellen, Layout und andere visuelle Hinweise verloren. ColPali umgeht diese Einschränkung, indem es direkt mit den Seitenbildern arbeitet und alle visuellen und textlichen Informationen beibehält. Der Nachteil ist die Skalierung: Jede Seite enthält nun Hunderte von Vektoren, was eine Datenbank erfordert, die viele Einbettungen in einer Einheit zusammenfassen kann - genau das, was Array of Structs + MAX_SIM bietet.</p>
<p>Der häufigste Anwendungsfall ist <strong>Vision RAG</strong>, wo jede PDF-Seite zu einer Multi-Vektor-Entität wird. Typische Szenarien sind:</p>
<ul>
<li><p><strong>Finanzberichte:</strong> Durchsuchen von Tausenden von PDFs nach Seiten mit bestimmten Diagrammen oder Tabellen.</p></li>
<li><p><strong>Verträge:</strong> Abrufen von Klauseln aus gescannten oder abfotografierten Rechtsdokumenten.</p></li>
<li><p><strong>Rechnungen:</strong> Auffinden von Rechnungen nach Lieferant, Betrag oder Layout.</p></li>
<li><p><strong>Präsentationen:</strong> Auffinden von Folien, die eine bestimmte Abbildung oder ein bestimmtes Diagramm enthalten.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Datenmodell:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 1: Vorbereiten der Daten</strong>Wie ColPali Bilder oder Texte in Multivektordarstellungen umwandelt, können Sie in der Dokumentation nachlesen.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 2: Erstellen der Milvus-Sammlung</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 3: Daten einfügen und Index erstellen</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 4: Modalübergreifende Suche: Textabfrage → Bildergebnisse</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Beispielhafte Ausgabe:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Hier geben die Ergebnisse direkt vollständige PDF-Seiten zurück. Wir müssen uns nicht um die zugrundeliegenden 1024 Patch-Einbettungen kümmern - Milvus erledigt die gesamte Aggregation automatisch.</p>
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
    </button></h2><p>Die meisten Vektordatenbanken speichern jedes Fragment als unabhängigen Datensatz, was bedeutet, dass Anwendungen diese Fragmente neu zusammensetzen müssen, wenn sie ein vollständiges Dokument, ein Produkt oder eine Seite benötigen. Ein Array von Structs ändert dies. Durch die Kombination von Skalaren, Vektoren, Text und anderen Feldern in einem einzigen strukturierten Objekt kann eine Datenbankzeile eine vollständige Entität von Anfang bis Ende darstellen.</p>
<p>Das Ergebnis ist einfach, aber wirkungsvoll: Arbeiten, die früher komplexe Gruppierung, Deduplizierung und Neuordnung in der Anwendungsschicht erforderten, werden zu einer nativen Datenbankfunktion. Und genau das ist die Zukunft der Vektordatenbanken - komplexere Strukturen, intelligentere Abfragen und einfachere Pipelines.</p>
<p>Weitere Informationen über Array of Structs und MAX_SIM finden Sie in der unten stehenden Dokumentation:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Milvus Dokumentation</a></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie einen tieferen Einblick in eine Funktion des neuesten Milvus? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige persönliche Sitzung buchen, um Einblicke, Anleitungen und Antworten auf Ihre Fragen über<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
