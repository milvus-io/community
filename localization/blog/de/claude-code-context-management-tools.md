---
id: claude-code-context-management-tools.md
title: 7 beste Open-Source-Tools für Claude Code Context Management
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  Lange Claude Code-Sitzungen verlieren schnell an Signal. Lernen Sie 7 Tools
  zum Trimmen von Terminalrauschen, Codeabruf, Toolausgabe, Speicher und
  Token-Nutzung kennen.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Sie können Claude Code ein Kontextfenster mit 1 Mio. Token geben und erhalten trotzdem mit der Zeit immer schlechtere Antworten. Das Problem ist nicht nur die Größe des Kontexts. Es ist die Qualität des Kontexts.</p>
<p>Claude Code-Sitzungen verschlechtern sich, wenn Terminalprotokolle, rohe Werkzeugausgaben, wiederholte Dateilesevorgänge, ausführliche Antworten und vergessene Projektverläufe um Aufmerksamkeit konkurrieren. In lang andauernden Agenten-Workflows wird dieses Rauschen zu einer Schleife: Das Modell verliert den Faden, Sie fügen weitere Runden hinzu, um die Antwort zu finden, und diese zusätzlichen Runden fügen noch mehr Rauschen hinzu.</p>
<p>Dies ist der <strong>Kontextdefokus</strong>: Das Modell hat genug Platz, um Informationen zu speichern, aber die wichtigen Informationen sind unter einem Kontext mit geringem Signal vergraben. Größere Fenster machen es einfacher, dies zu ignorieren, weil die Entwickler nicht mehr sorgfältig darüber nachdenken, was in die Eingabeaufforderung kommt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>Prompt-Caching-Diagramm, das zeigt, wie wiederverwendete Präfixe immer noch abgerechneten Kontext über Turns hinweg hinzufügen können</span> </span></p>
<p>Die Zwischenspeicherung von Eingabeaufforderungen kann die Kosten für wiederholte Präfixe reduzieren, aber sie macht das Kontextfenster nicht zu einer Ramschschublade. Sie zahlen immer noch für neue Token, und Sie brauchen immer noch das Modell, um über die richtigen Informationen nachzudenken.</p>
<p>In diesem Artikel werden sieben Open-Source-Tools vorgestellt, die den Kontext-Defokus auf verschiedenen Ebenen angehen: Terminal-Ausgabe, Tool-Ausgabe, Codebase-Navigation, Lesen von Dateien, Modell-Wortreichtum, semantische Code-Wiedergewinnung und sitzungsübergreifender Speicher. Außerdem wird erläutert, wie diese Ideen auf das Design von <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbanken</a>, die <a href="https://zilliz.com/learn/vector-similarity-search">Suche nach Vektorähnlichkeit</a> und Retrievalsysteme wie Milvus übertragen werden können.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Was sind die Ursachen für Claude-Code-Kontextdefokus?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Defokussierung des Claude-Code-Kontextes ist in der Regel auf fünf Fehlerarten zurückzuführen: zu viel roher Anweisungstext, verrauschte Werkzeugausgabe, wiederholte Erkundung der Codebasis, lange Modellantworten und Speicherlücken zwischen Sitzungen oder Agenten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Fünf Ursachen für den Verlust von Claude-Code-Kontext: redundante Anweisungen, verrauschte Tool-Ausgaben, wiederholte Erkundung der Codebasis, lange Antworten und Erinnerungslücken</span> </span></p>
<table>
<thead>
<tr><th>Modus des Kontextverlusts</th><th>Wie es in Claude Code aussieht</th><th>Werkzeugkategorie, die hilft</th></tr>
</thead>
<tbody>
<tr><td>Terminalprotokolle sind laut</td><td><code translate="no">git</code> <code translate="no">pytest</code>, , und Cloud-CLIs geben mehr Text aus, als das Modell benötigt. <code translate="no">gh</code></td><td>CLI-Ausgabekomprimierung</td></tr>
<tr><td>Tool-Ausgaben überfluten das Fenster</td><td>Testprotokolle, DOM-Dumps und MCP-Ausgaben erscheinen im Chat als riesige Rohblöcke.</td><td>Sandboxing von Tool-Ausgaben</td></tr>
<tr><td>Codebase-Navigation wiederholt sich</td><td>Claude listet Verzeichnisse auf, durchsucht und liest Dateien und wiederholt dieselbe Erkundung in jeder Sitzung.</td><td>Code-Graph oder semantische Suche</td></tr>
<tr><td>Das Lesen von Dateien ist zu umfangreich</td><td>Das Modell liest eine ganze Datei, obwohl es nur ein Symbol oder eine Zusammenfassung benötigt.</td><td>Progressives Lesen von Code</td></tr>
<tr><td>Claude redet zu viel</td><td>Die Antwort selbst fügt unnötigen Kontext für zukünftige Wendungen hinzu.</td><td>Komprimierung der Antwort</td></tr>
<tr><td>Der Speicher bleibt nicht erhalten</td><td>Sie erläutern Projektentscheidungen jedes Mal neu, wenn Sie eine neue Sitzung beginnen.</td><td>Markdown-first-Speicher</td></tr>
</tbody>
</table>
<p>Ein guter Kontextverwaltungsstapel sollte drei Dinge tun: Müll fernhalten, bei Bedarf das richtige Projektwissen abrufen und Entscheidungen über mehrere Sitzungen hinweg aufrechterhalten.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Welches Claude Code Kontext-Tool sollten Sie zuerst verwenden?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Beginnen Sie mit der Ebene, die in Ihrem Arbeitsablauf das meiste Chaos verursacht. Wenn Ihre Terminalausgabe das Problem ist, beginnen Sie mit RTK. Wenn Claude ständig durch ein großes Repository wandert, beginnen Sie mit claude-context oder code-review-graph. Wenn es Sie wirklich schmerzt, dieselben Entscheidungen jeden Tag neu zu erklären, beginnen Sie mit memsearch.</p>
<table>
<thead>
<tr><th>Werkzeug</th><th>Hauptproblem, das es löst</th><th>Beste Lösung</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Verrauschte Terminalausgaben von gängigen Entwicklerbefehlen.</td><td>Entwickler, die viele CLI-Befehle innerhalb von Claude Code ausführen.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Kontext-Modus</a></td><td>Massive Rohausgaben von Tools, die in die Hauptkonversation einfließen.</td><td>Starke Nutzer von Playwright, GitHub, Log oder MCP-Tools.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">Code-Review-Grafik</a></td><td>Blinde Codebase-Erkundung in großen Repos.</td><td>Reviews, Abhängigkeitsanalysen und Fragen zum Explosionsradius.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token-Retter</a></td><td>Vollständiges Lesen von Dateien, wenn eine Symbolzusammenfassung ausreichen würde.</td><td>Große Dateien, wiederholtes Nachschlagen von Symbolen und inkrementelles Lesen von Code.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Höhlenmensch</a></td><td>Claude's eigene ausführliche Antwortgewohnheiten.</td><td>Benutzer, die eine knappe Ausgabe und einen kleineren zukünftigen Kontext wünschen.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-kontext</a></td><td>Erneutes Erforschen der Codebasis in jeder Sitzung.</td><td>Semantische Codesuche durch MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Verlust von Projektspeicher über Sitzungen, Agenten und Modellwechsel hinweg.</td><td>Lang laufende Projekte mit dauerhaften Entscheidungen und Lehren.</td></tr>
</tbody>
</table>
<p>Die ersten fünf Werkzeuge reduzieren das, was in den Kontext eingeht oder darin verbleibt. Die letzten beiden machen nützlichen Kontext leichter abrufbar.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK komprimiert die rohe Befehlsausgabe, bevor Claude sie sieht<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK ist ein CLI-Proxy, der die Verwendung von Token bei gängigen Entwicklerbefehlen reduziert. Seine GitHub-Beschreibung besagt, dass es den LLM-Token-Verbrauch bei gängigen Entwicklungsbefehlen um 60-90% reduziert, und es wird als eine einzige Rust-Binärdatei ausgeliefert.</p>
<p>Im alltäglichen Gebrauch von Claude Code geben Befehle wie <code translate="no">git status</code>, <code translate="no">pytest</code> und Verzeichnisauflistungen oft vollständige Umgebungsinformationen und Statusbeschreibungen in das Kontextfenster aus. Das Modell benötigt in der Regel nur eine kleinere Antwort: welche Dateien sich geändert haben, welcher Test fehlgeschlagen ist, wo der PR feststeckt oder welche Schlüsseldateien in dem Verzeichnis existieren.</p>
<p>RTK sitzt zwischen der Shell und Claude. Es kann Befehle über Claude Code Hooks umschreiben und komprimierte Ausgaben zurückgeben.</p>
<p>Rohe <code translate="no">git status</code> Ausgabe:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>Was wirklich wichtig ist:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Das Gleiche gilt für <code translate="no">pytest</code>. Die unkomprimierte Ausgabe ist voll von Übergangsfällen und Umgebungsgeräuschen:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Komprimiert ist das Signal unmittelbar:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK ist der einfachste Ausgangspunkt, wenn der Kontext durch Shell-Befehle und nicht durch Codeabrufe aufgebläht wird.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Der Kontextmodus sperrt riesige Werkzeugausgaben außerhalb des Hauptchats aus<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Mode ist für die rohen Blöcke gedacht, die Tools zurückgeben: Testprotokolle, Browser-DOM-Snapshots, GitHub-Payloads, MCP-Toolausgaben und gescrapte Seiten. Seine GitHub-Beschreibung hebt die Kontextfenster-Optimierung für KI-Codieragenten hervor und berichtet von einer 98%igen Reduzierung der Tool-Ausgaben.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Die Karte des GitHub-Repositorys Context Mode zeigt die Werkzeugausgabe in der Sandbox und die Positionierung der Kontextoptimierung</span> </span></p>
<p>Der Ansatz besteht darin, große Werkzeugausgaben in einer lokalen Sandbox und einem Index zu isolieren und dann nur Zusammenfassungen und Abrufhandles an die Claude-Konversation weiterzugeben.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>Kontextmodus-Fluss, der zeigt, wie große Tool-Ausgaben die Sandbox-Ausführung, SQLite- oder FTS-Indizes, Zusammenfassungen und Abrufergebnisse durchlaufen</span> </span></p>
<p>Der Fluss ist nützlich, weil ein Coding Agent oft den fehlgeschlagenen Knoten, den fehlerhaften Selektor oder die relevante Stack-Trace benötigt, nicht aber das gesamte DOM oder jede durchlaufende Testzeile. Der Kontextmodus sorgt dafür, dass die gesamte Ausgabe lokal verfügbar ist, ohne dass sie die Hauptkonversation dominiert.</p>
<p>Dies ist vergleichbar mit der Art und Weise, wie <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybride Produktionssuchsysteme</a> die Speicherung von der Abfrage trennen. Man speichert die Rohdaten an einem dauerhaften Ort und ruft dann nur den Teil ab, der wichtig ist.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph bildet die Codestruktur ab, bevor Claude sie navigiert<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph geht ein anderes Problem an: Claude braucht nicht immer mehr Text, sondern eine bessere Karte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Das Logo von code-review-graph aus dem Originalartikel</span> </span></p>
<p>In einem großen Repository kann eine einfache Frage eine teure Erkundung auslösen:</p>
<blockquote>
<p>Welche Dateien und Tests sind nach der Änderung dieser Anmeldelogik betroffen?</p>
</blockquote>
<p>Ohne einen Codegraphen ist Claude's typischer Schritt:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph erstellt vorab eine strukturelle Karte der Codebasis. Er verwendet Tree-sitter, um Funktionen, Klassen, Importe, Aufrufbeziehungen, Vererbung und Testabhängigkeiten zu analysieren, und schreibt den Graphen dann in SQLite.</p>
<p>Das macht es nützlich für Code-Review und Blast-Radius-Analyse. Anstatt Claude zu bitten, den Abhängigkeitsgraphen durch wiederholtes Lesen neu zu entdecken, lassen Sie es zuerst die Struktur abfragen.</p>
<p>Dies ist der <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">semantischen Suche</a> ähnlich, aber nicht identisch. Ein struktureller Graph beantwortet die Frage "Was hängt wovon ab?". Die semantische Suche beantwortet die Frage "Welcher Code steht in einem konzeptionellen Zusammenhang mit dieser Frage?" In echten Code-Assistenz-Workflows will man oft beides.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior liefert Claude Symbolzusammenfassungen vor vollständigen Dateien<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Kernidee von Token Savior ist einfach: Senden Sie nicht standardmäßig die vollständige Datei. Senden Sie zuerst einen Index oder eine Symbolzusammenfassung und erweitern Sie diese nur, wenn die Aufgabe mehr Details benötigt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Die Karte des Token Savior GitHub-Repositorys zeigt die Beschreibung des MCP-Servers und die Projektstatistiken</span> </span></p>
<p>Wenn Sie fragen, wo ein Zahlungs-Webhook abgewickelt wird, benötigt das Modell oft nicht jede Zeile jeder zugehörigen Datei. Es muss zunächst wissen, ob eine Datei oder ein Symbol relevant ist.</p>
<p>Token Savior stellt Code in Schichten bereit:</p>
<table>
<thead>
<tr><th>Ebene</th><th>Was Claude empfängt</th><th>Wann er expandiert</th></tr>
</thead>
<tbody>
<tr><td>Zusammenfassung</td><td>Index, Symbolnamen und Kurzbeschreibungen.</td><td>Standardmäßige erste Antwort.</td></tr>
<tr><td>Schnipsel</td><td>Ein kleinerer Codeabschnitt um das betreffende Symbol herum.</td><td>Wenn die Zusammenfassung wahrscheinlich relevant ist.</td></tr>
<tr><td>Vollständige Datei</td><td>Der gesamte Inhalt der Datei.</td><td>Nur, wenn die Bearbeitung oder tiefgreifende Überlegungen dies erfordern.</td></tr>
</tbody>
</table>
<p>Dies spiegelt wider, wie Entwickler Code tatsächlich lesen. Sie scannen, bestätigen die Relevanz und öffnen dann die vollständige Datei nur, wenn es nötig ist. Es ähnelt auch dem progressiven Abfragemuster, das in <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG-Anwendungen</a> verwendet wird: Man sucht breit genug, um sich zu orientieren, und grenzt dann den Kontext vor der Generierung ein.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman reduziert Claude's eigene Antwortaufblähung<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>Die meisten Kontext-Tools konzentrieren sich auf das, was in das Modell eingeht. Caveman zielt auf das, was Claude ausgibt.</p>
<p>Caveman ist eine Claude-Code-Fähigkeit/ein Claude-Plugin, das Füllwörter, Höflichkeitsfloskeln, Wrapper-Sätze, Übererklärungen und sich wiederholende Strukturen entfernt. Das Ziel ist nicht, Wissen zu entfernen, sondern die Antwort dichter zu machen.</p>
<p>Ohne Caveman:</p>
<blockquote>
<p>Der Grund, warum Ihre React-Komponente neu gerendert wird, ist wahrscheinlich, dass...</p>
</blockquote>
<p>Mit Caveman:</p>
<blockquote>
<p>Neues Objekt ref bei jedem Rendering. Inline Objekt prop = new ref = re-render. Wrap in useMemo.</p>
</blockquote>
<p>Das ist wichtig, weil Claudes eigene Antworten zum zukünftigen Kontext werden. Wenn jede Antwort eine lange Erklärung enthält, beginnt die nächste Runde mit mehr Text, als sie braucht. Kürzere Antworten können die nächste Runde genauso verbessern wie die aktuelle.</p>
<p>Für Teams, die über <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">Kontext-Engineering für KI-Agenten</a> nachdenken, ist Caveman eine Erinnerung daran, dass die Output-Politik Teil der Kontext-Politik ist.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context fügt semantische Codesuche durch MCP hinzu<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context löst das Problem der wiederholten Codebase-Exploration mit semantischem Retrieval. Es indiziert ein Repository, speichert Code-Bausteine in einer Vektordatenbank und stellt die Suche über das <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a> zur Verfügung.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Claude Context Repository, dargestellt auf GitHub Trending im Originalartikel</span> </span></p>
<p>In einer großen Codebasis stellt man Claude ständig Fragen wie:</p>
<blockquote>
<p>Hilf mir herauszufinden, welche Teile des Codes mit diesem Fehler in Verbindung stehen könnten.</p>
</blockquote>
<p>Ohne eine Auffindungsschicht ist Claude's Standardansatz oft:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context verschiebt diese Arbeit in eine Suchschicht. Sie zerlegt das Repository in Stücke, erzeugt Einbettungen, speichert sie in einem <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvus-gestützten Code-Index</a> und ruft relevante Code-Stücke ab, bevor das Modell anfängt, Dateien blind zu lesen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>Der Claude-Kontextfluss zeigt das Chunking der Codebasis, die Einbettungen, die Vektordatenbank und die hybride Suche, das Abrufen von relevantem Code und die Claude-Kontextinjektion</span> </span></p>
<p>An dieser Stelle beginnen KI-Codierwerkzeuge, wie Suchsysteme auszusehen. Sie benötigen Chunking, Embeddings, Metadaten, lexikalischen Abgleich, Ranking und Freshness. Dies sind die gleichen Bausteine, die auch hinter dem <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">RAG-Retrieval</a>, dem <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">hybriden Retrieval-Routing</a> und der <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">Auswahl von Einbettungsmodellen</a> stehen.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch speichert nützliche Informationen über Sitzungen und Agenten hinweg<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch befasst sich mit der entgegengesetzten Seite des Problems: nicht was vergessen werden soll, sondern wie man sich an das erinnert, was wichtig ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>memsearch-Logobild aus dem Originalartikel</span> </span></p>
<p>Stellen Sie sich vor, Sie sagen Claude am Montag:</p>
<blockquote>
<p>Unser Webhook kann bei einem Fehlschlag nicht wiederholt werden - fehlgeschlagene Ereignisse müssen in eine Warteschlange für tote Buchstaben gestellt werden.</p>
</blockquote>
<p>Am Mittwoch eröffnen Sie eine neue Sitzung und fragen:</p>
<blockquote>
<p>Was können wir in der Webhook-Schicht noch optimieren?</p>
</blockquote>
<p>Ohne dauerhaftes Gedächtnis behandelt Claude die Entscheidung vom Montag so, als hätte sie nie stattgefunden. Sie erklären es noch einmal.</p>
<p>memsearch speichert den Speicher als lokale, für Menschen lesbare Markdown-Dateien und verwendet Milvus als wiederherstellbaren Abrufindex. Durch dieses Design bleibt der Speicher für Menschen editierbar, während er gleichzeitig für Agenten durchsuchbar ist.</p>
<p>Bei der Abfrage verwendet memsearch einen progressiven Abruf: zuerst suchen, bei Bedarf erweitern und dann nur bei Bedarf auf die ursprüngliche Abschrift zurückgreifen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>memsearch progressiver Abruffluss mit Suche, Erweitern, Transkript und zusammengefasster Rückkehr zum Hauptgespräch</span> </span></p>
<p>Dieses Markdown-First-Muster ist nützlich für Teams, die sitzungs-, modell- und agentenübergreifend arbeiten. Es lässt sich auch gut mit dem <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Langzeitgedächtnis von KI-Agenten</a>, dem <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">gemeinsamen Speicher mehrerer Agenten</a> und dem allgemeineren Problem der Vermeidung von <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">Kontextverfälschung in Agentensystemen</a> kombinieren.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Wie arbeiten diese Werkzeuge zusammen?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Die sieben Werkzeuge ergänzen sich, sind aber nicht austauschbar. Verwenden Sie sie als Schichten.</p>
<table>
<thead>
<tr><th>Schicht</th><th>Verwenden Sie diese Werkzeuge</th><th>Warum</th></tr>
</thead>
<tbody>
<tr><td>Befehlsrauschen entfernen</td><td>RTK</td><td>Komprimieren Sie umfangreiche Terminalausgaben, bevor sie Claude erreichen.</td></tr>
<tr><td>Sandbox für rohe Werkzeugausgaben</td><td>Kontext-Modus</td><td>Große Protokolle, DOMs und Tool-Payloads außerhalb der Hauptkonversation halten.</td></tr>
<tr><td>Code-Struktur abbilden</td><td>Code-Review-Grafik</td><td>Beantwortung von Fragen zu Abhängigkeiten und Blast-Radius ohne blindes Lesen von Dateien.</td></tr>
<tr><td>Code schrittweise lesen</td><td>Token-Retter</td><td>Beginnen Sie mit Symbolzusammenfassungen und erweitern Sie nur bei Bedarf.</td></tr>
<tr><td>Claude's Antworten komprimieren</td><td>Höhlenmensch</td><td>Verhindern Sie, dass die eigene Ausgabe des Modells zu einer zukünftigen Kontextaufblähung wird.</td></tr>
<tr><td>Relevanten Code abrufen</td><td>Claude-Kontext</td><td>Verwenden Sie semantische und hybride Codesuche anstelle von wiederholten Grep-Schleifen.</td></tr>
<tr><td>Wiederverwendung dauerhafter Entscheidungen</td><td>memsearch</td><td>Rufen Sie den Projektverlauf über Sitzungen, Agenten und Modellwechsel hinweg ab.</td></tr>
</tbody>
</table>
<p>Eine praktische Reihenfolge für den Rollout ist:</p>
<ol>
<li><strong>Beseitigen Sie offensichtliches Rauschen zuerst.</strong> Fügen Sie RTK oder den Kontextmodus hinzu, wenn Shell-Ausgaben und Tool-Payloads Ihren Kontext dominieren.</li>
<li><strong>Repository-Navigation korrigieren.</strong> Fügen Sie code-review-graph für Struktur oder claude-context für semantische Codesuche hinzu.</li>
<li><strong>Kontrollieren Sie, was übrig bleibt.</strong> Verwenden Sie Token Savior und Caveman, um Dateilesen und Modellantworten kompakt zu halten.</li>
<li><strong>Bewahren Sie dauerhaftes Wissen.</strong> Verwenden Sie memsearch, wenn wiederholte Erklärungen zum Engpass werden.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Bleiben Sie in Kontakt<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord-Community</a> bei, um Fragen zu stellen und Kontextmanagement-Muster mit anderen Entwicklern zu vergleichen.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose Milvus-Sprechstunde</a>, wenn Sie Hilfe bei der Entwicklung einer Retrieval-Schicht für Code-, Speicher- oder RAG-Workloads benötigen.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) ein kostenloses Tier für den Einstieg.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Häufig gestellte Fragen<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Wie kann ich die Verwendung von Claude Code-Token reduzieren, ohne nützlichen Kontext zu verlieren?</strong></p>
<p>Beginnen Sie damit, die lautesten Eingaben zu komprimieren: Terminalausgaben, rohe Tool-Payloads und wiederholtes Lesen von Code. Fügen Sie dann Retrieval-Tools wie claude-context oder code-review-graph hinzu, damit Claude relevanten Code ziehen kann, anstatt das Repository von Grund auf zu erforschen.</p>
<p><strong>Sollte ich claude-context oder code-review-graph für ein großes Repository verwenden?</strong></p>
<p>Verwenden Sie claude-context, wenn Sie eine semantische Codesuche benötigen, insbesondere wenn Sie den genauen Datei- oder Symbolnamen nicht kennen. Verwenden Sie code-review-graph, wenn Sie strukturelle Antworten benötigen, wie z. B. Aufrufbeziehungen, Importe, Testabhängigkeiten und Review Blast Radius.</p>
<p><strong>Unterscheidet sich der Speicher von der Code-Suche in Claude Code?</strong></p>
<p>Ja. Die Codeabfrage findet relevante Projektdateien oder Symbole. Der Speicherabruf ruft dauerhafte Entscheidungen, Benutzerpräferenzen, Debugging-Historie und sitzungsübergreifende Lektionen ab. memsearch konzentriert sich auf den Speicher, claude-context auf den Codeabruf.</p>
<p><strong>Ersetzen diese Werkzeuge die Zwischenspeicherung von Eingabeaufforderungen oder ein größeres Kontextfenster?</strong></p>
<p>Nein. Prompt-Caching und große Kontextfenster helfen bei der Kapazitäts- und Kostenreduzierung, aber sie entscheiden nicht, welche Informationen Aufmerksamkeit verdienen. Werkzeuge für das Kontextmanagement verbessern die Qualität und Dichte dessen, was überhaupt in das Modell einfließt. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
