---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: >-
  Von der Abfrage zu strukturierten Ergebnissen: Aggregation und ORDER BY in
  Milvus 3.0
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Erfahren Sie, wie Milvus 3.0 Abfrageaggregation, Search Aggregation und
  serverseitiges ORDER BY für strukturierte, effiziente Vektorsuchergebnisse
  hinzufügt.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Betrachten wir einen vertrauten Produktsuchablauf. Ein Käufer lädt ein Foto eines Kleides hoch, und die Vektorsuche ruft eine relevante Kandidatenmenge aus einem Katalog mit mehreren zehn Millionen Produkten ab.</p>
<p>Die Seite benötigt jedoch mehr als eine Rangliste. Sie braucht Markenfacetten. Sie braucht eine Preissortierung. Das Merchandising-Team möchte wissen, welche Marken diese Ergebnismenge dominieren, welche Preisspanne innerhalb jeder Marke liegt und einige repräsentative Produkte aus jeder Gruppe.</p>
<p>Vor Milvus 3.0 übernahmen Anwendungen diesen zweiten Schritt häufig selbst: Zeilen aus Milvus abrufen, sie in pandas oder einer Service-Schicht gruppieren und sortieren und anschließend die Antwort zusammensetzen. Einige Teams pflegten eine separate Analytics-Pipeline nur, um Zählungen und Verteilungen über Daten zu berechnen, die sich bereits in der Vektordatenbank befanden.</p>
<p>Die Vektordatenbank fand die Kandidaten; die Anwendung musste daraus ein strukturiertes Ergebnis machen.</p>
<p>Milvus 3.0 verlagert mehr von dieser Arbeit in die Retrieval-Engine. Es fügt drei verwandte, aber unterschiedliche Funktionen hinzu:</p>
<ul>
<li><strong>Query-Aggregation</strong> berechnet <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> und <code translate="no">max</code> über gefilterte, sichtbare Zeilen, mit optionalen <code translate="no">GROUP BY</code>-Feldern.</li>
<li><strong>Search Aggregation</strong> organisiert beibehaltene Approximate-Nearest-Neighbor-(ANN-)Kandidaten in Buckets, berechnet Metriken pro Bucket, erstellt verschachtelte Buckets und gibt repräsentative Treffer zurück.</li>
<li><strong>Serverseitiges</strong> <code translate="no">**ORDER BY**</code> sortiert Query-Ergebnisse oder ANN-Kandidaten nach einem oder mehreren Skalarfeldern, bevor die Anwendung sie erhält.</li>
</ul>
<p>Der Unterschied zwischen Query und Search ist wichtig:</p>
<table>
<thead>
<tr><th>Funktion</th><th>Zusammengefasste oder geordnete Daten</th><th>Primäre Ergebnisform</th><th>Exaktheitsgrenze</th></tr>
</thead>
<tbody>
<tr><td>Query-Aggregation</td><td>Alle sichtbaren Zeilen, die dem Filter entsprechen</td><td>Eine Zeile pro Gruppe, mit Aggregatwerten</td><td>Exakt über die sichtbare Zeilenmenge der Query</td></tr>
<tr><td>Search Aggregation</td><td>Kandidaten, die von der ANN-Suche und der Gruppierungsstufe beibehalten werden</td><td>Buckets, Metriken, repräsentative Treffer und optionale untergeordnete Buckets</td><td>Entwurfsbedingt approximativ</td></tr>
<tr><td>Query <code translate="no">ORDER BY</code></td><td>Sichtbare Zeilen, die dem Filter entsprechen</td><td>Sortierte Zeilen</td><td>Exakt über das gefilterte Query-Ergebnis</td></tr>
<tr><td>Search <code translate="no">ORDER BY</code></td><td>ANN-Kandidaten</td><td>Sortierte Suchtreffer oder Gruppen</td><td>Erweitert die ANN-Recall-Grenze nicht</td></tr>
</tbody>
</table>
<p>Dieser Artikel erklärt, warum diese Operationen in die Datenbank gehören, wie verteilte Aggregation funktioniert, wie sich Search Aggregation von Grouping Search unterscheidet und wo die neue Semantik endet.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Warum anwendungsseitige Nachverarbeitung an Grenzen stößt<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Aggregation und Sortierung in die Anwendung zu verlagern, kann wie eine kleine Implementierungsentscheidung wirken. Im großen Maßstab entstehen daraus drei größere Probleme.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">Die Anwendung bewegt weit mehr Daten, als die Antwort enthält</h3><p>Angenommen, ein Operations-Dashboard benötigt die Produktanzahl und den Durchschnittspreis für jede Kategorie unter zwei Millionen vorrätigen Zeilen. Selbst bei einer groben Nutzlast von nur 100 Byte pro Zeile für Kategorie, Preis, Primärschlüssel und Serialisierungs-Overhead muss die Anwendung etwa 200 MB Daten empfangen, bevor sie das Ergebnis berechnen kann.</p>
<p>Wenn der Katalog 200 Kategorien hat, besteht die Antwort nur aus einigen hundert Schlüsseln und Zahlen – in der Größenordnung von Kilobytes. Die Anwendung bewegt mehrere Größenordnungen mehr Daten, als sie zurückgibt, zahlt bei jeder Aktualisierung dieselben Kosten und benötigt genügend Client-Speicher, um die Zwischenzeilen zu halten oder zu streamen.</p>
<p>Eine In-Engine-Aggregation verändert die Einheit der Datenbewegung. Rohzeilen bleiben dort, wo sie sind. Was Knoten überquert und Milvus schließlich verlässt, ist die deutlich kleinere Menge partieller und finaler Gruppenzustände.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">Seitenlokales Sortieren ist kein globales Sortieren</h3><p>Sortieren nach der Paginierung ist ein Korrektheitsfehler, nicht nur eine ineffiziente Implementierung.</p>
<p>Wenn eine Anwendung die Zeilen 11 bis 20 abruft und nur diese Zeilen nach Preis sortiert, hat sie die Preisreihenfolge innerhalb dieser Seite erzeugt – nicht die Zeilen 11 bis 20 des global nach Preis sortierten Ergebnisses. Eine spätere Seite kann Produkte enthalten, die günstiger sind als jedes Produkt auf der ersten Seite.</p>
<p>Dieselbe Grenze ist bei der Vektorsuche wichtig. Das Abrufen einer kleinen Top-K-Menge und deren Sortierung in der Anwendung kann nur diese Kandidaten neu anordnen. Es kann keine relevanten Kandidaten wiederherstellen, die die ANN-Stufe nicht zurückgegeben hat, und führt häufig dazu, dass Anwendungen zu viel abrufen, nur um die clientseitige Sortierung nützlich zu machen.</p>
<p>Serverseitige Sortierung gibt Milvus die Kontrolle über die Reihenfolge und die Paginierungssequenz. Für Query-Workloads sortiert die Engine die gefilterte Zeilenmenge, bevor sie das Seitenfenster anwendet. Für Search-Workloads sortiert sie innerhalb der ANN-Kandidatengrenze und macht diese Einschränkung explizit.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">Der Client kann die Datenbanksichtbarkeit nicht reproduzieren</h3><p>Aggregation hängt auch davon ab, welche Zeilen zum Query-Zeitstempel sichtbar sind. Löschungen, abgelaufene Entitäten und gleichzeitige Schreibvorgänge werden durch Milvus’ Multiversion Concurrency Control (MVCC) und Konsistenzsemantik geregelt.</p>
<p>Sobald Rohzeilen die Datenbank verlassen, geht die Anwendung normalerweise davon aus, dass der empfangene Batch den korrekten Snapshot repräsentiert. Dieselben Sichtbarkeitsregeln in einem Client nachzubilden, ist unpraktikabel, insbesondere während die Collection Schreib- und Löschvorgänge erhält.</p>
<p>Der übliche Workaround – eine zweite Analytics-Engine, die per Export und ETL gespeist wird – fügt eine weitere Kopie der Daten, eine weitere Konsistenzgrenze und eine weitere zu betreibende Pipeline hinzu. Zählungen, Metriken und Sortierungen sollten dort ausgeführt werden, wo sowohl die Daten als auch ihre Sichtbarkeitsregeln bereits existieren.</p>
<p>Schauen wir uns nun an, was Milvus 3.0 bietet.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Query-Aggregation: exakte Statistiken über sichtbare Zeilen<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>Query-Aggregation beantwortet Fragen wie:</p>
<ul>
<li>Wie viele vorrätige Produkte gibt es in jeder Kategorie?</li>
<li>Wie hoch ist der Durchschnittspreis pro Marke?</li>
<li>Was sind die minimalen und maximalen Ereigniszeitstempel für jeden Host?</li>
<li>Wie viele Datensätze bleiben übrig, nachdem ein Filter und TTL-Sichtbarkeit angewendet wurden?</li>
</ul>
<p>Die API wirkt vertraut für alle, die SQL verwendet haben: Übergeben Sie ein oder mehrere Felder in <code translate="no">group_by_fields</code> und platzieren Sie anschließend Aggregationsausdrücke in <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die Syntax ist der einfache Teil. Das Ausführungsmodell macht das Ergebnis in einer verteilten Vektordatenbank nützlich.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Segmentlokale Zustände ersetzen die Bewegung von Rohzeilen</h3><p>Eine Milvus-Collection kann sich über Hunderte oder Tausende von Segmenten erstrecken, die über mehrere Query Nodes verteilt sind, wobei kürzlich geschriebene Daten noch auf dem Streaming-Pfad liegen. Kein einzelner Ausführungsknoten beginnt mit jeder sichtbaren Zeile.</p>
<p>Milvus schiebt Aggregation daher bis zu den Segmenten hinunter:</p>
<ol>
<li>Jedes Segment wendet den Filter und die MVCC-Sichtbarkeitsregeln lokal an.</li>
<li>Das Segment gibt einen partiellen Zustand pro Gruppe aus statt seiner passenden Zeilen.</li>
<li>Partielle Zustände werden innerhalb eines Query Nodes zusammengeführt.</li>
<li>Der Proxy führt die finale knotenübergreifende Zusammenführung durch und gibt die vollständigen Gruppen zurück.</li>
</ol>
<p>Die Menge der Zwischendaten skaliert nun mit der Anzahl der Gruppen und Aggregatzustände, statt direkt mit der Anzahl der passenden Zeilen.</p>
<p>Die Merge-Operation hängt vom Aggregat ab:</p>
<table>
<thead>
<tr><th>Aggregat</th><th>Partieller Zustand</th><th>Merge-Regel</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Partielle Zählung</td><td>Zählungen addieren</td></tr>
<tr><td><code translate="no">sum</code></td><td>Partielle Summe</td><td>Summen addieren</td></tr>
<tr><td><code translate="no">min</code></td><td>Partielles Minimum</td><td>Das Minimum nehmen</td></tr>
<tr><td><code translate="no">max</code></td><td>Partielles Maximum</td><td>Das Maximum nehmen</td></tr>
<tr><td><code translate="no">avg</code></td><td>Partielle Summe und Zählung</td><td>Beide Zustände addieren, dann erst in der finalen Stufe dividieren</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> ist der anschauliche Fall. Zwei partielle Durchschnitte zu mitteln ist falsch, wenn die Partitionen unterschiedliche Zeilenzahlen enthalten. Milvus führt <code translate="no">sum</code> und <code translate="no">count</code> unabhängig voneinander mit und berechnet den finalen Durchschnitt erst, nachdem beide global zusammengeführt wurden.</p>
<p>Dies ist ein Grund, warum Aggregation in die Datenbank gehört: Die Operation ist nicht einfach „dieselbe Funktion auf mehreren Batches ausführen“. Die Engine muss die Algebra jedes Aggregats über Segment- und Knotengrenzen hinweg bewahren.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">Sichtbarkeit wird vor der Aggregation angewendet</h3><p>Gelöschte und abgelaufene Zeilen werden gemäß der Sichtbarkeitsgrenze der Query auf Segmentebene aus den partiellen Zuständen entfernt. Sie wandern nicht nach oben, um dann in der Anwendung korrigiert zu werden.</p>
<p>Das Ergebnis beschreibt daher die Zeilen, die Milvus für diese Anfrage als sichtbar betrachtet, nicht eine beliebige Sammlung von Batches, die zu leicht unterschiedlichen Zeiten abgerufen wurden.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> zählt jetzt Gruppen</h3><p>In einer normalen Query steuert <code translate="no">limit</code>, wie viele Entitätszeilen zurückgegeben werden. In einer gruppierten Query steuert es, wie viele Gruppen zurückgegeben werden. Da die Ergebniskardinalität durch Gruppen statt durch passende Zeilen bestimmt wird, kann eine Query-Aggregation <code translate="no">limit</code> auch weglassen, wenn sie jede Gruppe benötigt.</p>
<p>Das klingt nach einem kleinen API-Detail, spiegelt aber ein anderes Ergebnismodell wider: Die Ausgabe ist nicht länger eine Seite von Entitäten. Sie ist eine Relation, deren Zeilen Gruppen repräsentieren.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: eine Bucket-Ansicht von ANN-Kandidaten<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>Query-Aggregation beantwortet: „Wie sehen die sichtbaren Zeilen aus, die diesem Filter entsprechen?“ Search Aggregation stellt eine andere Frage: „Wie sieht die für diesen Vektor abgerufene Kandidatenmenge aus?“</p>
<p>Diese Operation hat kein exaktes SQL-Äquivalent. Die ANN-Suche legt zunächst eine ähnlichkeitsgetriebene Kandidatengrenze fest. Milvus organisiert die beibehaltenen Kandidaten dann nach Skalar-Schlüsseln und gibt einen Bucket-Baum statt einer gewöhnlichen flachen Trefferliste zurück.</p>
<p>Ein Bucket kann enthalten:</p>
<ul>
<li>einen Schlüssel wie <code translate="no">brand</code> oder einen zusammengesetzten Schlüssel wie <code translate="no">(brand, color)</code>;</li>
<li>eine Anzahl beibehaltener Kandidaten;</li>
<li>Metriken einschließlich <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> und <code translate="no">max</code>;</li>
<li>repräsentative Entitäten, ausgewählt mit <code translate="no">top_hits</code>; und</li>
<li>eine verschachtelte <code translate="no">sub_aggregation</code>, die untergeordnete Buckets erstellt.</li>
</ul>
<p>Für die Produktsuchseite kann eine Anfrage Marken-Buckets, den Durchschnittspreis innerhalb jedes Buckets und drei repräsentative Produkte pro Marke zurückgeben:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Wenn <code translate="no">search_aggregation</code> gesetzt ist, ist die gewöhnliche Trefferliste leer. Die Anwendung liest die Bucket-Antwort aus <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">Die Aggregationsspezifikation setzt zwei unterschiedliche Grenzen</h3><p>Search Aggregation führt kein <code translate="no">GROUP BY</code> über jede Entität in der Collection aus, und sie nimmt auch nicht einfach eine gewöhnliche Top-K-Antwort und aggregiert diese flache Liste.</p>
<p>Ihre Ausführung hat drei Stufen:</p>
<ol>
<li>Milvus führt eine ANN-Suche aus, um Kandidaten in der Nähe des Query-Vektors abzurufen.</li>
<li>Die Gruppierungsstufe behält eine begrenzte Anzahl von Kandidaten für jeden vollständigen Bucket-Schlüssel bei.</li>
<li>Milvus erstellt Buckets, berechnet Metriken über die beibehaltenen Kandidaten, ordnet die Buckets und hängt repräsentative Treffer oder untergeordnete Buckets an.</li>
</ol>
<p>Zwei Parameter steuern unterschiedliche Teile des Ergebnisses:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> begrenzt, wie viele Buckets auf dieser Aggregationsebene zurückgegeben werden.</li>
<li>Die größte <code translate="no">TopHits.size</code> irgendwo im Aggregationsbaum legt das Budget beibehaltener Kandidaten für jeden vollständigen zusammengesetzten Schlüssel fest. Wenn die Anfrage kein <code translate="no">top_hits</code> enthält, ist das Standardbudget pro Schlüssel eins.</li>
</ul>
<p>Das <code translate="no">limit</code> der Top-Level-Suche steuert diesen Modus nicht und wird ignoriert, wenn <code translate="no">search_aggregation</code> vorhanden ist.</p>
<p>Diese Unterscheidung ist wesentlich, wenn man <code translate="no">count</code> oder Metriken eines Buckets liest. Mit <code translate="no">TopHits(size=3)</code> kann ein Marken-Bucket höchstens drei beibehaltene Kandidaten für seinen vollständigen Schlüssel zusammenfassen, selbst wenn die Collection Tausende relevanter Produkte dieser Marke enthält. Eine Erhöhung von <code translate="no">TopHits.size</code> erweitert das Metrikfenster pro Schlüssel, verwandelt die ANN-Suche aber nicht in einen exakten Scan.</p>
<p>Wenn die Anwendung exakte Statistiken über jede sichtbare Zeile benötigt, die einem Filter entspricht, sollte sie Query-Aggregation verwenden. Search Aggregation dient dazu, die von der Ähnlichkeitsabfrage erzeugten Kandidaten zu beschreiben und zu vergleichen.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation und Grouping Search lösen unterschiedliche Probleme<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt Grouping Search (<code translate="no">group_by</code>)seit Milvus 2.4. Es ist leicht, das Wort „Grouping“ in beiden Funktionen zu sehen und anzunehmen, sie seien zwei Schnittstellen für dieselbe Operation. Ihre Ausgabeverträge sind unterschiedlich.</p>
<p><strong>Grouping Search</strong> ändert, welche Entitäten in einer gerankten Ergebnisliste erscheinen. Ein gängiges RAG-Muster speichert Chunks als einzelne Entitäten, gruppiert sie nach <code translate="no">doc_id</code> und gibt einen oder wenige Chunks aus jedem Dokument zurück. Die primäre Ausgabe bleiben gewöhnliche Suchtreffer, jedoch mit weniger wiederholten Werten aus dem Gruppierungsfeld.</p>
<p><strong>Search Aggregation</strong> gibt eine statistische Ansicht zurück. Die primäre Ausgabe ist ein Bucket-Baum mit Schlüsseln, Zählungen, Metriken, repräsentativen Treffern und optionalen untergeordneten Buckets.</p>
<table>
<thead>
<tr><th>Anwendungsbedarf</th><th>Bevorzugt</th><th>Konsumieren</th></tr>
</thead>
<tbody>
<tr><td>Eine gerankte Entitätenliste mit größerer Vielfalt über ein Feld hinweg</td><td>Grouping Search</td><td>Gewöhnliche Suchtreffer</td></tr>
<tr><td>Facettenzählungen, Metriken pro Gruppe, repräsentative Treffer oder verschachtelte Verteilungen</td><td>Search Aggregation</td><td><code translate="no">AggregationBucket</code>-Objekte in <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Eine praktische Regel ist, von der UI- oder API-Antwortform auszugehen. Wenn die Anwendung eine Liste rendert, ist Grouping Search normalerweise das richtige Primitiv. Wenn sie Facetten, Verteilungskarten oder eine Gruppenhierarchie rendert, verwenden Sie Search Aggregation.</p>
<p>Die beiden Modi schließen sich in einer Anfrage gegenseitig aus, da sie unterschiedliche primäre Ergebnisformen definieren.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: Sortierung vor die Anwendungsgrenze verlagern<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>Sortierung ist die am wenigsten exotische Funktion in diesem Release und eine der am leichtesten falsch außerhalb der Engine zu implementierenden.</p>
<p>Milvus 3.0 stellt Sortierung sowohl für Query als auch für Search bereit, aber die beiden Pfade verwenden unterschiedliche SDK-Parameter und arbeiten über unterschiedliche Eingabemengen.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">Query-Sortierung ordnet die gefilterte Zeilenmenge</h3><p>PyMilvus Query verwendet <code translate="no">order_by</code>, ausgedrückt als Liste von <code translate="no">&quot;field:direction&quot;</code>-Strings. Die Engine wendet den Filter an, ordnet die sichtbaren Zeilen und wendet anschließend <code translate="no">limit</code> und <code translate="no">offset</code> an.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Das macht Query nützlich für geschäftlich sortiertes Browsing: neueste ingestierte Datensätze, höchstpreisige Produkte innerhalb eines Filters, niedrigster Bestand oder Extremwerte zur Dateninspektion. Ohne serverseitige Sortierung mussten Anwendungen zuerst Zeilen abrufen und konnten keine verlässliche Geschäftsreihenfolge über Seiten hinweg definieren.</p>
<p>Bei nullable Query-Feldern platziert aufsteigende Sortierung Nullwerte zuletzt und absteigende Sortierung zuerst. Ein Sortierfeld muss nicht in <code translate="no">output_fields</code> erscheinen; nehmen Sie es nur auf, wenn die Anwendung den Wert in der Antwort benötigt.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">Search-Sortierung ordnet die ANN-Kandidatenmenge neu</h3><p>PyMilvus Search verwendet <code translate="no">order_by_fields</code>, wobei jeder Eintrag ein Skalarfeld und eine Richtung benennt:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN bestimmt weiterhin, welche Entitäten zu Kandidaten werden. <code translate="no">order_by_fields</code> ändert, wie diese Kandidaten zurückgegeben werden; es bewirkt nicht, dass die Suche die Collection global nach den günstigsten Produkten scannt.</p>
<p>Diese Grenze gibt den beiden APIs unterschiedliche Aufgaben:</p>
<ul>
<li>Verwenden Sie Query plus <code translate="no">order_by</code>, wenn die Skalarreihenfolge selbst das Ergebnis definiert, etwa die zehn günstigsten vorrätigen Produkte.</li>
<li>Verwenden Sie Search plus <code translate="no">order_by_fields</code>, wenn semantische oder Vektorrelevanz die Kandidatenmenge definiert und ein Skalarfeld bestimmt, wie diese Kandidaten präsentiert werden sollen.</li>
</ul>
<p>Mehrfeldsortierung wendet Schlüssel in Listenreihenfolge an. Wenn Suchkandidaten für jeden angegebenen Skalar-Schlüssel dieselben Werte haben, behält Milvus ihre ursprüngliche Ähnlichkeits-Score-Reihenfolge bei.</p>
<p>Sortierung lässt sich auch mit Grouping Search kombinieren. Milvus ordnet Gruppen nach dem konfigurierten Skalarwert aus der Top-Entität jeder Gruppe, während die gruppierte Ergebnisform erhalten bleibt. Das ist nützlich, wenn die Anwendung sowohl Vielfalt über ein Feld hinweg als auch eine geschäftlich relevante Gruppenreihenfolge möchte.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Was diese Funktionen ermöglichen<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>Die APIs sind allgemeine Datenbankprimitive, aber mehrere Retrieval-Workloads profitieren unmittelbar.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG und Agents: Retrieval-Konzentration prüfen</h3><p>Ein RAG- oder agentisches System kann abgerufene Chunks nach Quelldokument, Produktlinie, Tenant oder Inhaltstyp in Buckets einteilen. Ein Ergebnis, das sich auf zwei Dokumente konzentriert, trägt ein anderes Abdeckungssignal als eines, das über Dutzende von Quellen verteilt ist.</p>
<p>Diese Verteilung ist keine Garantie für Antwortqualität. Sie ist jedoch eine nützliche Retrieval-Diagnose, die eine Anwendung oder ein Agent mit Scores, Zitaten und anderen Prüfungen kombinieren kann, wenn entschieden wird, ob die Query erweitert, erneut abgerufen oder um Klärung gebeten werden soll.</p>
<p>Grouping Search bleibt die richtige Wahl, wenn das Ziel lediglich darin besteht, die zurückgegebenen Chunks zu diversifizieren. Search Aggregation ist nützlich, wenn das System die Verteilung selbst benötigt.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-Commerce und Content-Empfehlung: Facetten mit der Suche zurückgeben</h3><p>Die eingangs beschriebene Produktsuchseite kann Marken-Buckets, Preismetriken, repräsentative Artikel und eine skalar sortierte Kandidatenliste von Milvus erhalten. Die Anwendung steuert weiterhin Darstellung und Geschäftslogik, muss aber grundlegende Bucket-Semantik nicht mehr aus exportierten Treffern rekonstruieren.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Logs und Sicherheit: Ähnlichkeit mit Incident-Verteilung kombinieren</h3><p>Ähnlichkeitssuche kann Ereignisse finden, die mit einer verdächtigen Log-Zeile zusammenhängen. Search Aggregation kann dann zeigen, welche Hosts diese Kandidaten dominieren, welche minimalen und maximalen Zeitstempel in jedem Host-Bucket liegen oder wie sich die Kandidaten über Schweregrad und Service verteilen.</p>
<p>Das Ergebnis bleibt eine Ansicht abgerufener Kandidaten statt einer exakten globalen Incident-Zählung. Wenn die Untersuchung exakte Zählungen über jedes Ereignis benötigt, das einem Filter entspricht, bietet Query-Aggregation diesen zweiten Pfad.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operations und Datenerkundung: berechnen statt exportieren</h3><p>Dashboards und Verwaltungstools können exakte Zählungen und Durchschnitte über gefilterte Zeilen ausführen und anschließend die zugrunde liegenden Entitäten in einer definierten Skalarreihenfolge durchsuchen. Das entfernt viele einmalige „exportieren, berechnen und sortieren“-Utilities, ohne vorzugeben, Milvus sei zu einer vollständigen analytischen Datenbank geworden.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Grenzen: was Aggregation und <code translate="no">ORDER BY</code> nicht ersetzen<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Funktionen erweitern die Retrieval-Engine; sie verwandeln Milvus nicht in ein Online Analytical Processing-(OLAP-)System.</p>
<ul>
<li>Query-Aggregation unterstützt Gruppierung plus <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> und <code translate="no">max</code>. Sie fügt keine Joins, Window Functions oder komplexen Subqueries hinzu. Große Offline-Analytics-Jobs gehören weiterhin in Systeme wie Spark, die mit Milvus-3.0-Snapshots und gemeinsamen Speicherpfaden arbeiten können.</li>
<li>Query-Gruppenschlüssel unterstützen Integer-, <code translate="no">VARCHAR</code>- und <code translate="no">TIMESTAMPTZ</code>-Felder. Search-Aggregation-Bucket-Schlüssel unterstützen zusätzlich Boolean-Felder. Gleitkomma-, Vektor-, JSON- und Array-Werte sind keine Bucket-Schlüssel.</li>
<li>Für Search Aggregation akzeptiert <code translate="no">count</code> <code translate="no">&quot;*&quot;</code> oder eine Nicht-JSON-, nicht dynamische Quelle; <code translate="no">sum</code> und <code translate="no">avg</code> erfordern numerische Quellen; und <code translate="no">min</code> und <code translate="no">max</code> unterstützen auch String- und <code translate="no">TIMESTAMPTZ</code>-Quellen. Query-Aggregation folgt denselben arithmetischen Typgrenzen. Konsultieren Sie den API-Leitfaden, bevor Sie ein Aggregat auf einen komplexen Feldtyp anwenden.</li>
<li>Query-Aggregation kann gruppierte Ausgabe nach Gruppenschlüsseln ordnen, während die Ordnung nach einem berechneten Aggregat wie <code translate="no">count(*)</code> eine aktuelle Grenze bleibt. Ohne explizite Ordnung ist die Gruppenreihenfolge nicht garantiert.</li>
<li>Search Aggregation kann derzeit nicht mit Hybrid Search, Grouping Search, Search Iterators, einem Offset ungleich null oder Highlighting in derselben Anfrage kombiniert werden.</li>
<li>Zählungen und Metriken von Search Aggregation beschreiben beibehaltene ANN-Kandidaten, nicht die vollständige Collection und nicht jede Entität, die semantisch relevant sein könnte.</li>
<li>Search <code translate="no">ORDER BY</code> ändert die Kandidatenpräsentation. Es repariert keine verfehlten ANN-Kandidaten und wandelt Ähnlichkeits-Retrieval nicht in eine exakte skalare Top-N-Query um.</li>
</ul>
<p>Der sauberste Weg, zwischen den neuen Primitiven zu wählen, ist, mit der Frage zu beginnen:</p>
<ul>
<li>Für exakte Statistiken über gefilterte sichtbare Zeilen verwenden Sie Query-Aggregation.</li>
<li>Für eine Verteilung über Ähnlichkeits-Retrieval-Kandidaten verwenden Sie Search Aggregation.</li>
<li>Für eine vielfältige Rangliste verwenden Sie Grouping Search.</li>
<li>Für eine definierte Skalarreihenfolge verwenden Sie Query oder Search <code translate="no">ORDER BY</code>, je nachdem, welcher Pfad die Ergebnismenge festgelegt hat.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">Von Kandidatenlisten zu strukturierten Ergebnissen<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Vektordatenbanken haben traditionell eine Frage optimiert: Welche K Entitäten liegen diesem Vektor am nächsten?</strong></p>
<p>Produktions-Retrieval-Systeme stellen unmittelbar Anschlussfragen. Welche Gruppen dominieren das Ergebnis? Wie lauten ihre Zählungen und Bereiche? Welche Beispiele repräsentieren jede Gruppe? In welcher Geschäftsreihenfolge sollte die Anwendung die Zeilen oder Kandidaten präsentieren?</p>
<p>Milvus 3.0 bringt diese Operationen in dieselbe Engine, der die Daten, die ANN-Kandidatengrenze und die Sichtbarkeitssemantik gehören. Query-Aggregation führt exakte verteilte Reduktion über sichtbare Zeilen aus. Search Aggregation erstellt eine Bucket-Ansicht über beibehaltene ANN-Kandidaten. <code translate="no">ORDER BY</code> gibt Query- und Search-Pfaden eine serverseitige Skalarreihenfolge, ohne die Anwendung aufzufordern, sie Seite für Seite zu rekonstruieren.</p>
<p>Das Ergebnis ist keine OLAP-Engine, die in einer Vektordatenbank versteckt ist. Es ist eine Retrieval-Engine, die mehr von der Struktur zurückgeben kann, die Anwendungen tatsächlich benötigen.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Aggregation und <code translate="no">ORDER BY</code> in Milvus 3.0 ausprobieren<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 ist jetzt verfügbar. Nutzen Sie den <a href="https://milvus.io/docs/get-and-scalar-query.md">Query-Leitfaden</a> für exakte Aggregation und Query-Sortierung, den <a href="https://milvus.io/docs/search-aggregation.md">Search-Aggregation-Leitfaden</a> für Bucket-Semantik und Limits, den <a href="https://milvus.io/docs/single-vector-search.md">Basic-Vector-Search-Leitfaden</a> für Search-Sortierung und den <a href="https://milvus.io/docs/grouping-search.md">Grouping-Search-Leitfaden</a>, wenn Ihr primäres Ziel Ergebnisvielfalt ist.</p>
<p>Für das umfassendere Release lesen Sie den <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus-3.0-Launch-Blog</a>, die <a href="https://milvus.io/docs/release_notes.md">Milvus-3.0-Release Notes</a> und das <a href="https://github.com/milvus-io/milvus">milvus-io/milvus-Repository</a>.</p>
<p>Wenn Sie dieselben APIs evaluieren möchten, ohne den Cluster selbst zu betreiben, probieren Sie sie auf <a href="https://cloud.zilliz.com">Zilliz Cloud</a> aus. Die aktuelle <a href="https://docs.zilliz.com/reference/python/python/Vector-query">Zilliz-Cloud-Query-Referenz</a> und <a href="https://docs.zilliz.com/reference/python/python/Vector-search">Search-Referenz</a> beschreiben Verfügbarkeit und Parameter für verwaltete Clustertypen.</p>
<p>Um einen Workload oder einen Edge Case mit dem Team zu besprechen, treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> bei oder buchen Sie eine <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus-Office-Hours-Sitzung</a>.</p>
