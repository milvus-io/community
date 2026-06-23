---
id: claude-code-context-management-tools.md
title: |
  Die 7 besten Open-Source-Tools für das Kontextmanagement bei Claude-Code
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Lange „Claude Code“-Sitzungen verlieren schnell das Signal. Lernen Sie 7 Tools
  kennen, mit denen Sie Terminalrauschen reduzieren, Code abrufen, Tool-Ausgaben
  optimieren, Speicherplatz sparen und die Token-Nutzung optimieren können.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Man kann Claude Code ein Kontextfenster von 1 Million Token zur Verfügung stellen und erhält dennoch im Laufe der Zeit immer schlechtere Antworten. Das Problem ist nicht nur die Größe des Kontexts, sondern auch dessen Qualität.</p>
<p>Claude-Code-Sitzungen verschlechtern sich, wenn Terminalprotokolle, rohe Tool-Ausgaben, wiederholte Dateilesevorgänge, ausführliche Antworten und vergessene Projektverläufe um Aufmerksamkeit konkurrieren. In lang andauernden Agent-Workflows verwandelt sich dieses Rauschen in eine Schleife: Das Modell verliert den Faden, man fügt weitere Runden hinzu, um die Antwort zu korrigieren, und diese zusätzlichen Runden sorgen für noch mehr Rauschen.</p>
<p>Dies ist <strong>„Context Defocus</strong>“: Das Modell verfügt über genügend Platz, um Informationen zu speichern, doch die wichtigen Informationen gehen unter weniger aussagekräftigem Kontext unter. Größere Fenster können es leichter machen, dies zu ignorieren, da Entwickler nicht mehr sorgfältig darüber nachdenken, was in die Eingabeaufforderung eingeht.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Diagramm zum Prompt-Caching, das zeigt, wie wiederverwendete Präfixe über mehrere Runden hinweg weiterhin berechnungsrelevanten Kontext hinzufügen können</span>
  
 </span></p>
<p>Prompt-Caching kann die Kosten für wiederholte Präfixe senken, verwandelt das Kontextfenster jedoch nicht in eine „Krimskrams-Schublade“. Man zahlt weiterhin für neue Token, und das Modell muss nach wie vor die richtigen Informationen auswerten.</p>
<p>Dieser Artikel gibt einen Überblick über sieben Open-Source-Tools, die das Problem der Kontextentfokussierung auf verschiedenen Ebenen angehen: Terminalausgabe, Tool-Ausgabe, Navigation in der Codebasis, Dateilesen, Ausführlichkeit des Modells, semantische Code-Suche und sitzungsübergreifendes Gedächtnis. Außerdem wird erläutert, wie sich diese Ideen auf das Design <a href="https://zilliz.com/learn/what-is-vector-database">von Vektordatenbanken</a>, <a href="https://zilliz.com/learn/vector-similarity-search">die Vektorähnlichkeitssuche</a> und Abrufsysteme wie Milvus übertragen lassen.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Was verursacht den Kontextverlust bei Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Kontextverlust bei Claude Code ist in der Regel auf fünf Fehlerquellen zurückzuführen: zu viel roher Anweisungstext, unübersichtliche Tool-Ausgaben, wiederholte Durchsuchung der Codebasis, lange Modellantworten sowie Gedächtnislücken über Sitzungen oder Agenten hinweg.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Fünf Ursachen für den Kontextverlust bei Claude Code: redundante Anweisungen, unübersichtliche Tool-Ausgaben, wiederholtes Abrufen der Codebasis, lange Antworten und Gedächtnislücken</span>
  
 </span></p>
<table>
<thead>
<tr><th>Fehlermodus</th><th>So sieht es in Claude Code aus</th><th>Hilfreiche Tool-Kategorie</th></tr>
</thead>
<tbody>
<tr><td>Terminal-Protokolle sind unübersichtlich</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code> sowie Cloud-CLIs geben mehr Text aus, als das Modell benötigt.</td><td>Komprimierung der CLI-Ausgabe</td></tr>
<tr><td>Tool-Ausgaben überfluten das Fenster</td><td>Testprotokolle, DOM-Dumps und MCP-Ausgaben erscheinen im Chat als riesige Rohdatenblöcke.</td><td>Sandboxing von Tool-Ausgaben</td></tr>
<tr><td>Wiederholungen bei der Navigation durch den Quellcode</td><td>Claude listet Verzeichnisse auf, führt Grep-Abfragen durch, liest Dateien und wiederholt in jeder Sitzung dieselbe Erkundung.</td><td>Code-Graph oder semantische Suche</td></tr>
<tr><td>Das Einlesen von Dateien ist zu umfassend</td><td>Das Modell liest eine ganze Datei, obwohl nur ein Symbol oder eine Zusammenfassung benötigt wurde.</td><td>Progressives Lesen des Codes</td></tr>
<tr><td>Claude redet zu viel</td><td>Die Antwort selbst fügt unnötigen Kontext für zukünftige Gesprächsrunden hinzu.</td><td>Komprimierung der Antwort</td></tr>
<tr><td>Das Gedächtnis bleibt nicht erhalten</td><td>Man erklärt Projektentscheidungen jedes Mal neu, wenn man eine neue Sitzung beginnt.</td><td>Markdown-First-Speicher</td></tr>
</tbody>
</table>
<p>Ein gutes Kontextmanagement-System sollte drei Dinge leisten: Unnötiges herausfiltern, das richtige Projektwissen bei Bedarf abrufen und dauerhafte Entscheidungen über mehrere Sitzungen hinweg bewahren.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Welches Claude-Code-Kontext-Tool sollten Sie zuerst verwenden?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Beginnen Sie mit der Ebene, die in Ihrem Workflow am meisten Störsignale verursacht. Wenn die Terminalausgabe das Problem ist, beginnen Sie mit RTK. Wenn Claude ständig durch ein großes Repository wandert, beginnen Sie mit claude-context oder code-review-graph. Wenn es Ihnen wirklich schwerfällt, jeden Tag dieselben Entscheidungen erneut zu erklären, beginnen Sie mit memsearch.</p>
<table>
<thead>
<tr><th>Tool</th><th>Hauptproblem, das es löst</th><th>Am besten geeignet</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Unübersichtliche Terminalausgabe durch gängige Entwicklerbefehle.</td><td>Entwickler, die viele CLI-Befehle innerhalb von Claude Code ausführen.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Kontextmodus</a></td><td>Umfangreiche Rohdaten von Tools, die in die Hauptkonversation einfließen.</td><td>Intensive Nutzer von Playwright, GitHub, Log-Tools oder MCP-Tools.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Blinde Erkundung der Codebasis in großen Repos.</td><td>Reviews, Abhängigkeitsanalysen und Fragen zum Auswirkungsbereich.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token-Sparer</a></td><td>Vollständiges Einlesen von Dateien, obwohl eine Symbolzusammenfassung ausreichen würde.</td><td>Große Dateien, wiederholte Symbolabfragen und inkrementelles Einlesen von Code.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Claudes eigene Neigung zu ausführlichen Antworten.</td><td>Benutzer, die eine knappe Ausgabe und einen kleineren zukünftigen Kontext wünschen.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Jede Sitzung die Code-Basis neu erkunden.</td><td>Semantische Codesuche über MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Verlust des Projektgedächtnisses über Sitzungen, Agenten und Modellwechsel hinweg.</td><td>Langfristige Projekte mit dauerhaften Entscheidungen und Erkenntnissen.</td></tr>
</tbody>
</table>
<p>Die ersten fünf Tools reduzieren, was in den Kontext gelangt oder dort verbleibt. Die letzten beiden erleichtern das Abrufen nützlicher Kontextinformationen.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK komprimiert die Rohausgabe von Befehlen, bevor Claude sie sieht<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK ist ein CLI-Proxy zur Reduzierung des Tokenverbrauchs bei gängigen Entwicklerbefehlen. Laut seiner GitHub-Beschreibung reduziert es den LLM-Tokenverbrauch bei gängigen Entwicklerbefehlen um 60–90 % und wird als einzelne Rust-Binärdatei bereitgestellt.</p>
<p>Im alltäglichen Einsatz von Claude Code geben Befehle wie „ <code translate="no">git status</code> “, „ <code translate="no">pytest</code> “ und Verzeichnisauflistungen oft vollständige Umgebungsinformationen und Statusbeschreibungen in das Kontextfenster aus. Das Modell benötigt in der Regel nur eine kürzere Antwort: welche Dateien sich geändert haben, welcher Test fehlgeschlagen ist, wo der PR hängengeblieben ist oder welche wichtigen Dateien im Verzeichnis vorhanden sind.</p>
<p>RTK sitzt zwischen der Shell und Claude. Es kann Befehle über Claude-Code-Hooks umschreiben und komprimierte Ausgaben zurückgeben.</p>
<p>Unbearbeitete „ <code translate="no">git status</code> “-Ausgabe:</p>
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
<p>Was tatsächlich zählt:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Das Gleiche gilt für „ <code translate="no">pytest</code> “. Die Rohausgabe ist voll von erfolgreichen Testfällen und Umgebungsrauschen:</p>
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
<p>Komprimiert ist das Signal sofort erkennbar:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK ist der einfachste Einstiegspunkt, wenn dein Kontextdurchsatz eher durch Shell-Befehle als durch das Abrufen von Code überlastet wird.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Der Kontextmodus isoliert riesige Tool-Ausgaben außerhalb des Hauptchats<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Kontextmodus ist für die Rohdatenblöcke konzipiert, die Tools zurückgeben: Testprotokolle, Browser-DOM-Snapshots, GitHub-Payloads, MCP-Tool-Ausgaben und gescrapte Seiten. Die GitHub-Beschreibung hebt die Optimierung des Kontextfensters für KI-Codierungsagenten hervor und gibt eine Reduzierung der Tool-Ausgaben um 98 % an.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>GitHub-Repository-Karte des Kontextmodus, die die in einer Sandbox isolierte Tool-Ausgabe und die Positionierung der Kontextoptimierung zeigt</span>
  
 </span></p>
<p>Der Ansatz besteht darin, umfangreiche Tool-Ausgaben in einer lokalen Sandbox zu isolieren und zu indizieren, um anschließend nur Zusammenfassungen und Abruf-Handles an die Claude-Konversation weiterzuleiten.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Ablauf des Context Mode, der zeigt, wie umfangreiche Tool-Ausgaben durch die Sandbox-Ausführung, SQLite- oder FTS-Indizes, Zusammenfassungen und Abrufergebnisse geleitet werden</span>
  
 </span></p>
<p>Dieser Ablauf ist nützlich, da ein Programmieragent oft den fehlerhaften Knoten, den defekten Selektor oder den relevanten Stack-Trace benötigt – nicht das gesamte DOM oder jede bestandene Testzeile. Der „Context Mode“ hält die vollständige Ausgabe lokal verfügbar und verhindert gleichzeitig, dass sie die Hauptkonversation dominiert.</p>
<p>Dies ähnelt der Vorgehensweise, mit der <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybride Suchsysteme</a> in der Produktion die Speicherung vom Abruf trennen. Man speichert die Rohdaten an einem dauerhaften Ort und ruft dann nur den relevanten Ausschnitt ab.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph bildet die Codestruktur ab, bevor Claude sie durchläuft<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph löst ein anderes Problem: Claude benötigt nicht immer mehr Text, sondern eine bessere Darstellung.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Im Originalartikel verwendetes Logo-Bild von „code-review-graph“</span>
  
 </span></p>
<p>In einem großen Repository kann eine einfache Frage eine aufwendige Suche auslösen:</p>
<blockquote>
<p>Welche Dateien und Tests sind nach der Änderung dieser Anmeldelogik betroffen?</p>
</blockquote>
<p>Ohne einen Code-Graphen geht Claude in der Regel wie folgt vor:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph erstellt vorab eine strukturelle Karte der Codebasis. Es nutzt Tree-sitter, um Funktionen, Klassen, Importe, Aufrufbeziehungen, Vererbungen und Testabhängigkeiten zu analysieren, und schreibt den Graphen anschließend in SQLite.</p>
<p>Dadurch eignet es sich für Code-Reviews und Blast-Radius-Analysen. Anstatt Claude zu beauftragen, den Abhängigkeitsgraphen durch wiederholtes Einlesen neu zu ermitteln, lässt man es zunächst die Struktur abfragen.</p>
<p>Dies grenzt an <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">die semantische Suche</a> an, ist aber nicht identisch damit. Ein Strukturgraph beantwortet die Frage „Was hängt von was ab?“, während die semantische Suche die Frage „Welcher Code steht konzeptionell mit dieser Frage in Zusammenhang?“ beantwortet. In realen Arbeitsabläufen mit Code-Assistenten benötigt man oft beides.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior liefert Claude Symbolzusammenfassungen vor den vollständigen Dateien<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Kernidee von „Token Savior“ ist einfach: Sende standardmäßig nicht die vollständige Datei. Sende zunächst einen Index oder eine Symbolzusammenfassung und erweitere diese erst, wenn die Aufgabe mehr Details erfordert.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>GitHub-Repository-Karte von „Token Savior“ mit der Beschreibung des MCP-Servers und Projektstatistiken</span>
  
 </span></p>
<p>Wenn man fragt, wo ein Zahlungs-Webhook verarbeitet wird, benötigt das Modell oft nicht jede Zeile jeder zugehörigen Datei. Es muss zunächst wissen, ob eine Datei oder ein Symbol relevant ist.</p>
<p>Token Savior stellt Code in Schichten bereit:</p>
<table>
<thead>
<tr><th>Ebene</th><th>Was Claude erhält</th><th>Wenn es expandiert</th></tr>
</thead>
<tbody>
<tr><td>Zusammenfassung</td><td>Index, Symbolnamen und kurze Beschreibungen.</td><td>Standardmäßige erste Antwort.</td></tr>
<tr><td>Codeausschnitt</td><td>Ein kleinerer Codeausschnitt rund um das relevante Symbol.</td><td>Wenn die Zusammenfassung wahrscheinlich relevant ist.</td></tr>
<tr><td>Vollständige Datei</td><td>Der vollständige Dateiinhalt.</td><td>Nur wenn dies für die Bearbeitung oder eine eingehende Analyse erforderlich ist.</td></tr>
</tbody>
</table>
<p>Dies spiegelt wider, wie Entwickler Code tatsächlich lesen. Man überfliegt den Text, überprüft die Relevanz und öffnet die vollständige Datei erst bei Bedarf. Es ähnelt zudem dem in <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG-Anwendungen</a> verwendeten Muster des schrittweisen Abrufs: Zunächst wird ein ausreichend breiter Kontext abgerufen, um sich zu orientieren, dann wird der Kontext vor der Generierung eingegrenzt.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman reduziert die überladenen Antworten von Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>Die meisten Kontext-Tools konzentrieren sich darauf, was in das Modell eingeht. Caveman zielt auf das ab, was Claude ausgibt.</p>
<p>Caveman ist ein Claude-Code-Skill/Plugin, das Füllmaterial, Höflichkeitsfloskeln, umschreibende Sätze, überflüssige Erklärungen und sich wiederholende Strukturen entfernt. Das Ziel ist nicht, Wissen zu entfernen, sondern die Antwort prägnanter zu gestalten.</p>
<p>Ohne Caveman:</p>
<blockquote>
<p>Der Grund, warum Ihre React-Komponente neu gerendert wird, liegt wahrscheinlich darin, dass…</p>
</blockquote>
<p>Mit Caveman:</p>
<blockquote>
<p>Bei jedem Rendering wird eine neue Objekt-Ref erstellt. Inline-Objekt-Prop = neue Ref = erneutes Rendern. Mit `useMemo` umschließen.</p>
</blockquote>
<p>Das ist wichtig, weil Claudes eigene Antworten zum zukünftigen Kontext werden. Wenn jede Antwort eine lange Erklärung enthält, beginnt der nächste Durchgang mit mehr Text, als nötig ist. Kürzere Antworten können den nächsten Durchgang ebenso verbessern wie den aktuellen.</p>
<p>Für Teams, die sich mit <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">Kontext-Engineering für KI-Agenten</a> beschäftigen, ist Caveman eine Erinnerung daran, dass die Ausgabepolitik Teil der Kontextpolitik ist.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context erweitert das MCP um eine semantische Codesuche<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context löst das Problem der wiederholten Durchsuchung der Codebasis durch semantisches Abrufen. Es indiziert ein Repository, speichert Code-Ausschnitte in einer Vektordatenbank und stellt die Suche über das <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a> bereit.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Das Claude-Context-Repository auf GitHub, das im Originalartikel als Trend aufgeführt wurde</span>
  
 </span></p>
<p>In einer großen Codebasis stellt man Claude ständig Fragen wie:</p>
<blockquote>
<p>„Hilf mir herauszufinden, welche Teile des Codes mit diesem Fehler zusammenhängen könnten.“</p>
</blockquote>
<p>Ohne eine Abrufebene sieht der Standardansatz von Claude oft so aus:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context verlagert diese Arbeit in eine Abrufebene. Es unterteilt das Repository in Teile, generiert Einbettungen, speichert diese in einem <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">von Milvus unterstützten Code-Index</a> und ruft relevante Code-Teile ab, bevor das Modell beginnt, Dateien blind zu lesen.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>claude-context-Ablauf, der die Aufteilung der Codebasis in Blöcke, Embeddings, Vektordatenbank und hybride Suche, das Abrufen relevanter Code-Teile sowie die Einbindung des Claude-Kontexts zeigt</span>
  
 </span></p>
<p>An dieser Stelle fangen KI-Codierungstools an, wie Suchsysteme auszusehen. Man benötigt Aufteilung in Blöcke, Einbettungen, Metadaten, lexikalische Übereinstimmung, Ranking und Aktualität. Das sind dieselben Bausteine, die auch hinter <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">der RAG-Abfrage in der Produktion</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">dem Routing bei der hybriden Abfrage</a> und <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">der Auswahl von Einbettungsmodellen</a> stehen.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch bewahrt nützliche Informationen über Sitzungen und Agenten hinweg auf<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch befasst sich mit der anderen Seite des Problems: nicht damit, was man vergessen soll, sondern wie man sich an das Wesentliche erinnert.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>memsearch-Logo aus dem Originalartikel</span>
  
 </span></p>
<p>Stellen Sie sich vor, Sie sagen am Montag zu Claude:</p>
<blockquote>
<p>Unser Webhook kann bei einem Fehler keinen erneuten Versuch starten – fehlgeschlagene Ereignisse müssen in eine Dead-Letter-Queue verschoben werden.</p>
</blockquote>
<p>Am Mittwoch eröffnen Sie eine neue Sitzung und fragen:</p>
<blockquote>
<p>Was können wir in der Webhook-Ebene noch optimieren?</p>
</blockquote>
<p>Ohne dauerhaften Speicher behandelt Claude die Entscheidung vom Montag so, als wäre sie nie gefallen. Du erklärst es ihm noch einmal.</p>
<p>memsearch speichert den Speicher als lokale, für Menschen lesbare Markdown-Dateien und nutzt Milvus als wiederaufbaubaren Abrufindex. Durch dieses Design bleibt der Speicher für Menschen bearbeitbar und ist gleichzeitig für Agenten durchsuchbar.</p>
<p>Zum Zeitpunkt des Abrufs nutzt memsearch einen progressiven Abruf: zuerst suchen, bei Bedarf erweitern und erst dann, wenn es notwendig ist, bis zum ursprünglichen Transkript vordringen.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Ablauf des progressiven Abrufs bei memsearch mit Suche, Erweiterung, Transkript und zusammengefasster Rückkehr zur Hauptkonversation</span>
  
 </span></p>
<p>Dieses „Markdown-first“-Muster ist nützlich für Teams, die über verschiedene Sitzungen, Modelle und Agenten hinweg arbeiten. Es lässt sich zudem nahtlos mit <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">dem Langzeitgedächtnis von KI-Agenten</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">dem gemeinsamen Multi-Agenten-Gedächtnis</a> und dem übergeordneten Problem der Verhinderung <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">von Kontextverlust in Agentensystemen</a> kombinieren.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Wie arbeiten diese Tools zusammen?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Die sieben Werkzeuge ergänzen sich, sind jedoch nicht austauschbar. Setzen Sie sie als Schichten ein.</p>
<table>
<thead>
<tr><th>Ebene</th><th>Verwenden Sie diese Werkzeuge</th><th>Warum</th></tr>
</thead>
<tbody>
<tr><td>Befehl „Rauschen entfernen“</td><td>RTK</td><td>Komprimieren Sie umfangreiche Terminalausgaben, bevor sie Claude erreichen.</td></tr>
<tr><td>Rohdaten der Tools in die Sandbox ausgeben</td><td>Kontextmodus</td><td>Große Protokolle, DOMs und Tool-Nutzdaten außerhalb der Hauptkonversation halten.</td></tr>
<tr><td>Code-Struktur abbilden</td><td>code-review-graph</td><td>Beantworten Sie Fragen zu Abhängigkeiten und zum Einflussbereich, ohne Dateien blind lesen zu müssen.</td></tr>
<tr><td>Code schrittweise lesen</td><td>Token-Sparer</td><td>Beginnen Sie mit Symbolzusammenfassungen und erweitern Sie diese nur bei Bedarf.</td></tr>
<tr><td>Komprimieren Sie Claudes Antworten</td><td>Caveman</td><td>Verhindern Sie, dass die eigenen Ausgaben des Modells den zukünftigen Kontext überladen.</td></tr>
<tr><td>Relevanten Code abrufen</td><td>claude-context</td><td>Verwende semantische und hybride Codesuche anstelle wiederholter grep-Schleifen.</td></tr>
<tr><td>Wiederverwendung dauerhafter Entscheidungen</td><td>memsearch</td><td>Projektverlauf über Sitzungen, Agenten und Modellwechsel hinweg abrufen.</td></tr>
</tbody>
</table>
<p>Eine sinnvolle Reihenfolge für die Einführung ist:</p>
<ol>
<li><strong>Beseitigen Sie zunächst offensichtliche Störsignale.</strong> Fügen Sie RTK oder den Kontextmodus hinzu, wenn Shell-Ausgaben und Tool-Payloads Ihren Kontext dominieren.</li>
<li><strong>Optimieren Sie die Repository-Navigation.</strong> Fügen Sie „code-review-graph“ für die Struktur oder „claude-context“ für die semantische Code-Suche hinzu.</li>
<li><strong>Steuern Sie, was übrig bleibt.</strong> Verwenden Sie „Token Savior“ und „Caveman“, um Dateilesevorgänge und Modellantworten kompakt zu halten.</li>
<li><strong>Bewahren Sie dauerhaftes Wissen.</strong> Verwenden Sie „memsearch“, wenn wiederholte Erklärungen zum Engpass werden.</li>
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
<li>Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> bei, um Fragen zu stellen und Muster des Kontextmanagements mit anderen Entwicklern zu vergleichen.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose Milvus-Office-Hours-Sitzung</a>, wenn Sie Hilfe beim Entwurf einer Abrufschicht für Code, Speicher oder RAG-Workloads benötigen.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltetes Milvus) eine kostenlose Stufe für den Einstieg an.</li>
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
    </button></h2><p><strong>Wie reduziere ich die Anzahl der Claude-Code-Token, ohne dabei nützlichen Kontext zu verlieren?</strong></p>
<p>Beginnen Sie damit, die „verrauschtesten“ Eingaben zu komprimieren: Terminalausgaben, rohe Tool-Payloads und wiederholte Code-Lesevorgänge. Fügen Sie dann Abruf-Tools wie „claude-context“ oder „code-review-graph“ hinzu, damit Claude relevanten Code abrufen kann, anstatt das Repository von Grund auf zu durchsuchen.</p>
<p><strong>Sollte ich für ein großes Repository „claude-context“ oder „code-review-graph“ verwenden?</strong></p>
<p>Verwenden Sie claude-context, wenn Sie eine semantische Codesuche benötigen, insbesondere wenn Sie den genauen Datei- oder Symbolnamen nicht kennen. Verwenden Sie code-review-graph, wenn Sie strukturelle Antworten benötigen, wie z. B. Aufrufbeziehungen, Importe, Testabhängigkeiten und den Umfang der Codeüberprüfung.</p>
<p><strong>Unterscheidet sich die Speicherabfrage von der Code-Abfrage in Claude Code?</strong></p>
<p>Ja. Die Code-Suche findet relevante Projektdateien oder Symbole. Die Speicherabfrage ruft dauerhafte Entscheidungen, Benutzereinstellungen, den Debugging-Verlauf und sitzungsübergreifende Erkenntnisse ab. „memsearch“ konzentriert sich auf den Speicher; „claude-context“ konzentriert sich auf die Code-Suche.</p>
<p><strong>Ersetzen diese Tools das Prompt-Caching oder ein größeres Kontextfenster?</strong></p>
<p>Nein. Das Caching von Eingabeaufforderungen und große Kontextfenster helfen bei Kapazität und Kosten, entscheiden jedoch nicht darüber, welche Informationen Beachtung verdienen. Kontextmanagement-Tools verbessern die Qualität und Dichte dessen, was überhaupt erst in das Modell gelangt. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
