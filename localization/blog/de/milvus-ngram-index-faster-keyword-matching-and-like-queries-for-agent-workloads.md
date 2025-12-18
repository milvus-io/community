---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Einführung in den Milvus Ngram Index: Schnelleres Keyword Matching und
  LIKE-Abfragen für Agent Workloads
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Erfahren Sie, wie der Ngram-Index in Milvus LIKE-Abfragen beschleunigt, indem
  er Teilstring-Matching in effiziente N-Gramm-Lookups umwandelt und so eine
  100-fach schnellere Leistung liefert.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>In Agentensystemen ist die <strong>Kontextsuche</strong> ein grundlegender Baustein in der gesamten Pipeline, der die Grundlage für nachgelagerte Überlegungen, Planungen und Aktionen bildet. Die Vektorsuche hilft den Agenten, semantisch relevanten Kontext abzurufen, der die Absicht und Bedeutung großer und unstrukturierter Datensätze erfasst. Die semantische Relevanz allein reicht jedoch oft nicht aus. Agenten-Pipelines stützen sich auch auf die Volltextsuche, um exakte Schlüsselwortbeschränkungen durchzusetzen, z. B. Produktnamen, Funktionsaufrufe, Fehlercodes oder rechtlich relevante Begriffe. Diese unterstützende Schicht stellt sicher, dass der abgerufenen Kontext nicht nur relevant ist, sondern auch explizit harte textliche Anforderungen erfüllt.</p>
<p>Reale Arbeitslasten spiegeln diesen Bedarf durchweg wider:</p>
<ul>
<li><p>Kundendienstmitarbeiter müssen Gespräche finden, in denen ein bestimmtes Produkt oder eine bestimmte Zutat erwähnt wird.</p></li>
<li><p>Coding Copilots suchen nach Snippets, die einen exakten Funktionsnamen, API-Aufruf oder eine Fehlerzeichenfolge enthalten.</p></li>
<li><p>Juristische, medizinische und akademische Mitarbeiter filtern Dokumente nach Klauseln oder Zitaten, die wortwörtlich erscheinen müssen.</p></li>
</ul>
<p>Traditionell haben die Systeme dies mit dem SQL-Operator <code translate="no">LIKE</code> gehandhabt. Eine Abfrage wie <code translate="no">name LIKE '%rod%'</code> ist einfach und wird weitgehend unterstützt, aber bei hoher Gleichzeitigkeit und großen Datenmengen geht diese Einfachheit mit erheblichen Leistungseinbußen einher.</p>
<ul>
<li><p><strong>Ohne einen Index</strong> durchsucht eine <code translate="no">LIKE</code> -Abfrage den gesamten Kontextspeicher und wendet den Musterabgleich Zeile für Zeile an. Bei Millionen von Datensätzen kann selbst eine einzige Abfrage Sekunden dauern - viel zu langsam für Agenteninteraktionen in Echtzeit.</p></li>
<li><p><strong>Selbst mit einem herkömmlichen invertierten Index</strong> lassen sich Platzhaltermuster wie <code translate="no">%rod%</code> nur schwer optimieren, da die Engine immer noch das gesamte Wörterbuch durchsuchen und den Musterabgleich auf jeden Eintrag anwenden muss. Der Vorgang vermeidet Zeilenscans, bleibt aber grundsätzlich linear, was nur zu marginalen Verbesserungen führt.</p></li>
</ul>
<p>Dies führt zu einer deutlichen Lücke in hybriden Retrievalsystemen: Die Vektorsuche bewältigt die semantische Relevanz effizient, aber die exakte Filterung von Schlüsselwörtern ist oft der langsamste Schritt in der Pipeline.</p>
<p>Milvus unterstützt von Haus aus eine hybride Vektor- und Volltextsuche mit Metadatenfilterung. Um die Grenzen des Keyword-Matching zu überwinden, führt Milvus den <a href="https://milvus.io/docs/ngram.md"><strong>Ngram Index</strong></a> ein, der die Leistung von <code translate="no">LIKE</code> verbessert, indem er den Text in kleine Teilstrings aufteilt und diese für eine effiziente Suche indiziert. Dadurch wird die Datenmenge, die während der Ausführung der Abfrage untersucht wird, drastisch reduziert, was zu <strong>zehn- bis hundertmal schnelleren</strong> <code translate="no">LIKE</code> Abfragen in echten agentenbasierten Workloads führt.</p>
<p>Im weiteren Verlauf dieses Beitrags wird die Funktionsweise des Ngram-Index in Milvus erläutert und seine Leistung in realen Szenarien evaluiert.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Was ist der Ngram-Index?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>In Datenbanken wird die Textfilterung üblicherweise mit <strong>SQL</strong> ausgedrückt, der Standardabfragesprache, die zum Abrufen und Verwalten von Daten verwendet wird. Einer der am häufigsten verwendeten Textoperatoren ist <code translate="no">LIKE</code>, der den musterbasierten String-Matching unterstützt.</p>
<p>LIKE-Ausdrücke lassen sich grob in vier gängige Mustertypen einteilen, je nachdem, wie Platzhalter verwendet werden:</p>
<ul>
<li><p><strong>Infix-Abgleich</strong> (<code translate="no">name LIKE '%rod%'</code>): Passt auf Datensätze, in denen die Teilzeichenkette an beliebiger Stelle im Text vorkommt.</p></li>
<li><p><strong>Präfix-Übereinstimmung</strong> (<code translate="no">name LIKE 'rod%'</code>): Passt auf Datensätze, deren Text mit "rod" beginnt.</p></li>
<li><p><strong>Suffix-Abgleich</strong> (<code translate="no">name LIKE '%rod'</code>): Passt auf Datensätze, deren Text mit "rod" endet.</p></li>
<li><p><strong>Platzhalterübereinstimmung</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Kombiniert mehrere Teilstring-Bedingungen (<code translate="no">%</code>) mit Ein-Zeichen-Platzhaltern (<code translate="no">_</code>) in einem einzigen Muster.</p></li>
</ul>
<p>Diese Muster unterscheiden sich zwar in Aussehen und Ausdruckskraft, aber der <strong>Ngram-Index</strong> in Milvus beschleunigt sie alle mit demselben Ansatz.</p>
<p>Bevor der Index erstellt wird, zerlegt Milvus jeden Textwert in kurze, sich überschneidende Teilstrings fester Länge, die als <em>n-Gramme</em> bezeichnet werden. Wenn zum Beispiel n = 3 ist, wird das Wort <strong>"Milvus"</strong> in die folgenden 3-Gramme zerlegt: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu",</strong> und <strong>"vus".</strong> Jedes n-Gramm wird dann in einem invertierten Index gespeichert, der die Teilzeichenkette auf die Menge der Dokument-IDs abbildet, in denen sie vorkommt. Bei der Abfrage werden die Bedingungen von <code translate="no">LIKE</code> in Kombinationen von N-Gramm-Suchanfragen übersetzt, so dass Milvus die meisten nicht übereinstimmenden Datensätze schnell herausfiltern und das Muster anhand einer viel kleineren Kandidatengruppe bewerten kann. Auf diese Weise werden teure String-Scans in effiziente indexbasierte Abfragen umgewandelt.</p>
<p>Zwei Parameter steuern, wie der Ngram-Index aufgebaut wird: <code translate="no">min_gram</code> und <code translate="no">max_gram</code>. Zusammen definieren sie den Bereich der Teilstringlängen, die Milvus generiert und indiziert.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: Die kürzeste Teilstringlänge, die indiziert werden soll. In der Praxis wird damit auch die minimale Abfrage-Teilstringlänge festgelegt, die vom Ngram-Index profitieren kann</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: Die längste zu indizierende Teilstringlänge. Zur Abfragezeit wird zusätzlich die maximale Fenstergröße festgelegt, die bei der Aufteilung längerer Abfragezeichenfolgen in n-Gramme verwendet wird.</p></li>
</ul>
<p>Durch die Indizierung aller zusammenhängenden Teilstrings, deren Länge zwischen <code translate="no">min_gram</code> und <code translate="no">max_gram</code> liegt, schafft Milvus eine konsistente und effiziente Grundlage für die Beschleunigung aller unterstützten <code translate="no">LIKE</code> Mustertypen.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Wie funktioniert der Ngram-Index?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus implementiert den Ngram-Index in einem Zwei-Phasen-Prozess:</p>
<ul>
<li><p><strong>Bauen Sie den Index auf:</strong> Generierung von N-Grammen für jedes Dokument und Aufbau eines invertierten Index während der Datenaufnahme.</p></li>
<li><p><strong>Abfragen beschleunigen:</strong> Verwenden Sie den Index, um die Suche auf eine kleine Gruppe von Kandidaten einzugrenzen, und überprüfen Sie dann die exakten <code translate="no">LIKE</code> Übereinstimmungen mit diesen Kandidaten.</p></li>
</ul>
<p>Ein konkretes Beispiel macht diesen Prozess leichter verständlich.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Phase 1: Aufbau des Index</h3><p><strong>Zerlegen Sie den Text in n-Gramme:</strong></p>
<p>Nehmen wir an, wir indizieren den Text <strong>"Apple"</strong> mit den folgenden Einstellungen:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Bei dieser Einstellung generiert Milvus alle zusammenhängenden Teilstrings der Länge 2 und 3:</p>
<ul>
<li><p>2-Gramme: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-Gramme: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Erstellen Sie einen invertierten Index:</strong></p>
<p>Betrachten wir nun einen kleinen Datensatz von fünf Datensätzen:</p>
<ul>
<li><p><strong>Dokument 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Dokument 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Dokument 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Dokument 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Dokument 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Während der Aufnahme erzeugt Milvus n-Gramme für jeden Datensatz und fügt sie in einen invertierten Index ein. In diesem Index:</p>
<ul>
<li><p><strong>Schlüssel</strong> sind n-Gramme (Teilstrings)</p></li>
<li><p><strong>Werte</strong> sind Listen von Dokument-IDs, in denen das n-Gramm vorkommt</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Jetzt ist der Index vollständig aufgebaut.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Phase 2: Beschleunigung von Abfragen</h3><p>Wenn ein <code translate="no">LIKE</code> Filter ausgeführt wird, verwendet Milvus den Ngram Index, um die Abfrageauswertung durch die folgenden Schritte zu beschleunigen:</p>
<p><strong>1. Extrahieren des Abfragebegriffs:</strong> Zusammenhängende Teilstrings ohne Platzhalter werden aus dem Ausdruck <code translate="no">LIKE</code> extrahiert (z. B. wird <code translate="no">'%apple%'</code> zu <code translate="no">apple</code>).</p>
<p><strong>2. Zerlegen des Abfragebegriffs:</strong> Der Abfrageterm wird in n-Gramme zerlegt, basierend auf seiner Länge (<code translate="no">L</code>) und den konfigurierten <code translate="no">min_gram</code> und <code translate="no">max_gram</code>.</p>
<p><strong>3. Suche nach jedem Gramm und Überschneidung:</strong> Milvus sucht nach n-Grammen im invertierten Index und überschneidet deren Dokument-ID-Listen, um eine kleine Kandidatenmenge zu erzeugen.</p>
<p><strong>4. Überprüfen und Ergebnisse zurückgeben:</strong> Die ursprüngliche Bedingung <code translate="no">LIKE</code> wird nur auf diese Kandidatenmenge angewendet, um das endgültige Ergebnis zu ermitteln.</p>
<p>In der Praxis hängt die Art und Weise, wie eine Abfrage in n-Gramme aufgeteilt wird, von der Form des Musters selbst ab. Um zu sehen, wie das funktioniert, konzentrieren wir uns auf zwei häufige Fälle: Infix-Treffer und Wildcard-Treffer. Präfix- und Suffixübereinstimmungen verhalten sich genauso wie Infixübereinstimmungen, daher werden wir sie nicht gesondert behandeln.</p>
<p><strong>Infix-Übereinstimmung</strong></p>
<p>Bei einer Infix-Übereinstimmung hängt die Ausführung von der Länge der literalen Teilzeichenkette (<code translate="no">L</code>) relativ zu <code translate="no">min_gram</code> und <code translate="no">max_gram</code> ab.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (z. B. <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>Der literale Teilstring <code translate="no">ppl</code> liegt vollständig innerhalb des konfigurierten n-gram-Bereichs. Milvus sucht direkt nach dem n-gram <code translate="no">&quot;ppl&quot;</code> im invertierten Index und erzeugt die Kandidaten-Dokument-IDs <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Da das Literal selbst ein indiziertes n-Gramm ist, erfüllen alle Kandidaten bereits die Infix-Bedingung. Der letzte Überprüfungsschritt eliminiert keine Datensätze, und das Ergebnis bleibt <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (z. B. <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>Die wörtliche Teilzeichenkette <code translate="no">pple</code> ist länger als <code translate="no">max_gram</code> und wird daher mit einer Fenstergröße von <code translate="no">max_gram</code> in überlappende n-Gramme zerlegt. Mit <code translate="no">max_gram = 3</code> ergeben sich die n-Gramme <code translate="no">&quot;ppl&quot;</code> und <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus sucht jedes n-gram im invertierten Index:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Wenn man diese Listen schneidet, erhält man die Kandidatenmenge <code translate="no">[0, 1, 4]</code>. Der ursprüngliche Filter <code translate="no">LIKE '%pple%'</code> wird dann auf diese Kandidaten angewendet. Alle drei erfüllen die Bedingung, so dass das Endergebnis <code translate="no">[0, 1, 4]</code> bleibt.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (z. B. <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>Der literale Teilstring ist kürzer als <code translate="no">min_gram</code> und kann daher nicht in indizierte n-Gramme zerlegt werden. In diesem Fall kann der Ngram-Index nicht verwendet werden, und Milvus fällt auf den Standardausführungspfad zurück und wertet die Bedingung <code translate="no">LIKE</code> durch einen vollständigen Scan mit Mustervergleich aus.</p>
<p><strong>Platzhalterübereinstimmung</strong> (z. B. <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Dieses Muster enthält mehrere Wildcards, so dass Milvus es zunächst in zusammenhängende Literale aufteilt: <code translate="no">&quot;Ap&quot;</code> und <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus verarbeitet dann jedes Literal unabhängig:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> hat die Länge 2 und fällt in den n-gram Bereich.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> ist länger als <code translate="no">max_gram</code> und wird in <code translate="no">&quot;ppl&quot;</code> und <code translate="no">&quot;ple&quot;</code> zerlegt.</p></li>
</ul>
<p>Dadurch wird die Abfrage auf die folgenden n-Gramme reduziert:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Die Überschneidung dieser Listen ergibt einen einzigen Kandidaten: <code translate="no">[0]</code>.</p>
<p>Schließlich wird der ursprüngliche Filter <code translate="no">LIKE '%Ap%pple%'</code> auf das Dokument 0 (<code translate="no">&quot;Apple&quot;</code>) angewendet. Da es das vollständige Muster nicht erfüllt, ist die endgültige Ergebnismenge leer.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Beschränkungen und Kompromisse des Ngram-Index<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Während der Ngram Index die Leistung von <code translate="no">LIKE</code> Abfragen erheblich verbessern kann, bringt er Kompromisse mit sich, die in der Praxis berücksichtigt werden sollten.</p>
<ul>
<li><strong>Erhöhte Indexgröße</strong></li>
</ul>
<p>Die primären Kosten des Ngram-Index sind ein höherer Speicher-Overhead. Da der Index alle zusammenhängenden Teilzeichenketten speichert, deren Länge zwischen <code translate="no">min_gram</code> und <code translate="no">max_gram</code> liegt, wächst die Anzahl der generierten n-Gramme schnell, wenn dieser Bereich erweitert wird. Jede zusätzliche n-Gramm-Länge fügt effektiv einen weiteren vollständigen Satz von überlappenden Teilzeichenketten für jeden Textwert hinzu, wodurch sowohl die Anzahl der Indexschlüssel als auch deren Buchungslisten steigen. In der Praxis kann die Erweiterung des Bereichs um nur ein Zeichen die Indexgröße im Vergleich zu einem standardmäßigen invertierten Index ungefähr verdoppeln.</p>
<ul>
<li><strong>Nicht für alle Workloads effektiv</strong></li>
</ul>
<p>Der Ngram Index beschleunigt nicht jede Arbeitslast. Wenn die Abfragemuster sehr unregelmäßig sind, sehr kurze Literale enthalten oder der Datensatz in der Filterphase nicht auf eine kleine Kandidatenmenge reduziert werden kann, ist der Leistungsvorteil möglicherweise begrenzt. In solchen Fällen kann sich die Ausführung der Abfrage immer noch den Kosten eines vollständigen Scans nähern, auch wenn der Index vorhanden ist.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Bewertung der Leistung von Ngram-Indizes bei LIKE-Abfragen<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Ziel dieses Benchmarks ist es, zu bewerten, wie effektiv der Ngram Index <code translate="no">LIKE</code> Abfragen in der Praxis beschleunigt.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Test-Methodik</h3><p>Um die Leistung im Kontext zu sehen, vergleichen wir ihn mit zwei grundlegenden Ausführungsmodi:</p>
<ul>
<li><p><strong>Master</strong>: Brute-Force-Ausführung ohne jeglichen Index.</p></li>
<li><p><strong>Master-invertiert</strong>: Ausführung mit einem herkömmlichen invertierten Index.</p></li>
</ul>
<p>Wir haben zwei Testszenarien entwickelt, um unterschiedliche Datenmerkmale abzudecken:</p>
<ul>
<li><p><strong>Wiki-Text-Datensatz</strong>: 100.000 Zeilen, wobei jedes Textfeld auf 1 KB abgeschnitten wurde.</p></li>
<li><p><strong>Ein-Wort-Datensatz</strong>: 1.000.000 Zeilen, wobei jede Zeile ein einzelnes Wort enthält.</p></li>
</ul>
<p>In beiden Szenarien werden die folgenden Einstellungen einheitlich angewendet:</p>
<ul>
<li><p>Die Abfragen verwenden das <strong>Infix-Match-Muster</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>Der Ngram Index ist mit <code translate="no">min_gram = 2</code> konfiguriert und <code translate="no">max_gram = 4</code></p></li>
<li><p>Um die Kosten für die Abfrageausführung zu isolieren und den Overhead bei der Ergebnismaterialisierung zu vermeiden, geben alle Abfragen <code translate="no">count(*)</code> anstelle von vollständigen Ergebnismengen zurück.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p><strong>Test für Wiki, jede Zeile ist ein Wiki-Text mit einer um 1000 gekürzten Inhaltslänge, 100K Zeilen</strong></p>
<table>
<thead>
<tr><th></th><th>Wörtlich</th><th>Zeit(ms)</th><th>Beschleunigung</th><th>Anzahl</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>Stadion</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Master-umgekehrt</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngramm</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Meister</td><td>Sekundarschule</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Meister-umgekehrt</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngramm</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Meister</td><td>ist eine koedukative Sekundarschule, die gefördert wird</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Master-umgekehrt</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngramm</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Test für einzelne Wörter, 1M Zeilen</strong></p>
<table>
<thead>
<tr><th></th><th>Wörtlich</th><th>Zeit(ms)</th><th>Beschleunigung</th><th>Anzahl</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Master-umgekehrt</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngramm</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Master-umgekehrt</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngramm</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Meister</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Master-invertiert</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngramm</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Master-umgekehrt</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngramm</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Meister</td><td>Nation</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Meister-umgekehrt</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngramm</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Hinweis:</strong> Diese Ergebnisse beruhen auf Benchmarks, die im Mai durchgeführt wurden. Seitdem hat der Master-Zweig zusätzliche Leistungsoptimierungen erfahren, so dass der hier beobachtete Leistungsunterschied in aktuellen Versionen voraussichtlich geringer ausfallen wird.</p>
<p>Die Benchmark-Ergebnisse zeigen ein klares Muster: Der Ngram-Index beschleunigt LIKE-Abfragen in allen Fällen erheblich, und wie viel schneller die Abfragen laufen, hängt stark von der Struktur und Länge der zugrunde liegenden Textdaten ab.</p>
<ul>
<li><p>Bei <strong>langen Textfeldern</strong>, wie z.B. bei Wiki-Dokumenten, die auf 1.000 Bytes gekürzt wurden, sind die Leistungsgewinne besonders ausgeprägt. Im Vergleich zur Brute-Force-Ausführung ohne Index erreicht der Ngram-Index Geschwindigkeitssteigerungen von etwa <strong>100-200×</strong>. Im Vergleich zu einem herkömmlichen invertierten Index ist die Verbesserung sogar noch dramatischer und erreicht das <strong>1.200-1.900-fache</strong>. Dies liegt daran, dass LIKE-Abfragen auf langem Text für herkömmliche Indexierungsansätze besonders teuer sind, während N-Gramm-Lookups den Suchraum schnell auf eine sehr kleine Menge von Kandidaten eingrenzen können.</p></li>
<li><p>Bei Datensätzen, die aus <strong>Ein-Wort-Einträgen</strong> bestehen, sind die Gewinne zwar geringer, aber immer noch beträchtlich. In diesem Szenario läuft der Ngram-Index etwa <strong>80 bis 100 Mal</strong> schneller als die Brute-Force-Ausführung und <strong>45 bis 55 Mal</strong> schneller als ein herkömmlicher invertierter Index. Obwohl kürzerer Text von Natur aus billiger zu scannen ist, vermeidet der N-Gramm-basierte Ansatz dennoch unnötige Vergleiche und reduziert konsequent die Abfragekosten.</p></li>
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
    </button></h2><p>Der Ngram Index beschleunigt <code translate="no">LIKE</code> Abfragen, indem er den Text in n-Gramme fester Länge aufteilt und sie mit einer invertierten Struktur indiziert. Dieses Design verwandelt teure Teilstring-Abgleiche in effiziente n-Gramm-Suchvorgänge, gefolgt von einer minimalen Überprüfung. Dadurch werden Volltextscans vermieden, während die genaue Semantik von <code translate="no">LIKE</code> erhalten bleibt.</p>
<p>In der Praxis erweist sich dieser Ansatz in einem breiten Spektrum von Arbeitslasten als effektiv, mit besonders guten Ergebnissen beim Fuzzy-Matching in langen Textfeldern. Der Ngram-Index eignet sich daher gut für Echtzeitszenarien wie die Suche nach Codes, Kundendienstmitarbeiter, juristische und medizinische Dokumente, Wissensdatenbanken in Unternehmen und die akademische Suche, bei denen ein präziser Abgleich von Schlüsselwörtern unerlässlich ist.</p>
<p>Zugleich profitiert der Ngram Index von einer sorgfältigen Konfiguration. Die Auswahl geeigneter Werte für <code translate="no">min_gram</code> und <code translate="no">max_gram</code> ist entscheidend für das Gleichgewicht zwischen Indexgröße und Abfrageleistung. Wenn der Ngram Index so eingestellt wird, dass er reale Abfragemuster widerspiegelt, bietet er eine praktische, skalierbare Lösung für leistungsstarke <code translate="no">LIKE</code> Abfragen in Produktionssystemen.</p>
<p>Weitere Informationen über den Ngram-Index finden Sie in der folgenden Dokumentation:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index | Milvus Dokumentation</a></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie einen tieferen Einblick in eine Funktion des neuesten Milvus? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen in den<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Erfahren Sie mehr über die Funktionen von Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Einführung in Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche rationalisiert</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Suche auf Entity-Ebene ermöglichen: Neue Array-of-Structs und MAX_SIM-Fähigkeiten in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Zusammenführung von Geofilterung und Vektorsuche mit Geometriefeldern und RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Einführung von AISAQ in Milvus: Milliardenschwere Vektorsuche ist jetzt 3.200x billiger im Speicher</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimierung von NVIDIA CAGRA in Milvus: Ein hybrider GPU-CPU-Ansatz für schnellere Indizierung und günstigere Abfragen</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt </a></p></li>
</ul>
