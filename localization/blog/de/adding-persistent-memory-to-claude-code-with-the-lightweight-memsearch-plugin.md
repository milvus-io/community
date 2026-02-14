---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: >-
  Hinzufügen von persistentem Speicher zu Claude Code mit dem Lightweight
  memsearch Plugin
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Geben Sie Claude Code ein Langzeitgedächtnis mit memsearch ccplugin.
  Leichtgewichtige, transparente Markdown-Speicherung, automatischer
  semantischer Abruf, null Token-Overhead.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Vor kurzem haben wir <a href="https://github.com/zilliztech/memsearch">memsearch</a> entwickelt und veröffentlicht, eine eigenständige Plug-and-Play-Langzeitspeicher-Bibliothek, die jedem Agenten einen persistenten, transparenten und vom Menschen editierbaren Speicher bietet. Sie verwendet dieselbe Speicherarchitektur wie OpenClaw - nur ohne den Rest des OpenClaw-Stacks. Das bedeutet, dass Sie sie in jedes beliebige Agenten-Framework (Claude, GPT, Llama, benutzerdefinierte Agenten, Workflow-Engines) einfügen können und sofort dauerhaften, abfragbaren Speicher hinzufügen können. <em>(Wenn Sie einen tieferen Einblick in die Funktionsweise von memsearch erhalten möchten, haben wir</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>hier</em></a> <em> einen</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>separaten Beitrag</em></a> <em> verfasst</em><em>).</em></p>
<p>In den meisten Agenten-Workflows funktioniert memsearch genau wie vorgesehen. Aber bei <strong>der Agentencodierung</strong> sieht es anders aus. Coding-Sitzungen dauern lange, der Kontext wechselt ständig, und die Informationen, die es wert sind, gespeichert zu werden, sammeln sich über Tage oder Wochen an. Das schiere Volumen und die Volatilität zeigen die Schwächen typischer Agentenspeichersysteme auf - Memsearch eingeschlossen. In Coding-Szenarien unterscheiden sich die Abfragemuster so stark, dass wir das vorhandene Tool nicht einfach so weiterverwenden konnten.</p>
<p>Um dieses Problem zu lösen, haben wir ein <strong>Plugin für den persistenten Speicher entwickelt, das speziell für Claude Code konzipiert wurde</strong>. Es setzt auf der memsearch CLI auf und wir nennen es das <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(Open-Source, MIT-Lizenz)</em></li>
</ul>
<p>Mit dem leichtgewichtigen <strong>memsearch ccplugin</strong>, das den Speicher hinter den Kulissen verwaltet, erhält Claude Code die Fähigkeit, sich an jede Konversation, jede Entscheidung, jede Stilpräferenz und jeden mehrtägigen Thread zu erinnern - automatisch indiziert, vollständig durchsuchbar und über Sitzungen hinweg beständig.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Zur Verdeutlichung in diesem Beitrag: "ccplugin" bezieht sich auf die obere Schicht, also das Claude Code Plugin selbst. "memsearch" bezieht sich auf die untere Schicht, das eigenständige CLI-Tool darunter.</em></p>
<p>Warum also braucht Coding ein eigenes Plugin, und warum haben wir etwas so Leichtgewichtiges entwickelt? Das liegt an zwei Problemen, auf die Sie mit Sicherheit schon gestoßen sind: Claude Codes Mangel an persistentem Speicher und die Schwerfälligkeit und Komplexität bestehender Lösungen wie claude-mem.</p>
<p>Warum also überhaupt ein eigenes Plugin entwickeln? Weil Kodieragenten auf zwei Probleme stoßen, die Sie mit Sicherheit schon selbst erlebt haben:</p>
<ul>
<li><p>Claude Code hat keinen persistenten Speicher.</p></li>
<li><p>Viele bestehende Community-Lösungen - wie <em>claude-mem - sind</em>zwar leistungsfähig, aber schwerfällig, klobig oder zu komplex für die tägliche Arbeit mit Codes.</p></li>
</ul>
<p>Das ccplugin zielt darauf ab, beide Probleme mit einer minimalen, transparenten, entwicklerfreundlichen Schicht über memsearch zu lösen.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Das Speicherproblem von Claude Code: Er vergisst alles, wenn eine Sitzung endet<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Beginnen wir mit einem Szenario, das Claude Code-Benutzer mit Sicherheit schon einmal erlebt haben.</p>
<p>Sie öffnen Claude Code am Morgen. Du tippst: "Setze den gestrigen Auth-Refactor fort". Claude antwortet: "Ich bin mir nicht sicher, woran du gestern gearbeitet hast." Also verbringst du die nächsten zehn Minuten damit, die Protokolle von gestern zu kopieren und einzufügen. Es ist kein großes Problem, aber es wird schnell lästig, weil es so häufig auftritt.</p>
<p>Auch wenn Claude Code über eigene Speichermechanismen verfügt, sind diese alles andere als zufriedenstellend. Die Datei <code translate="no">CLAUDE.md</code> kann Projektrichtlinien und Voreinstellungen speichern, aber sie funktioniert besser für statische Regeln und kurze Befehle, nicht für die Ansammlung von Langzeitwissen.</p>
<p>Claude Code bietet zwar die Befehle <code translate="no">resume</code> und <code translate="no">fork</code>, aber sie sind alles andere als benutzerfreundlich. Für Fork-Befehle müssen Sie sich Sitzungs-IDs merken, Befehle manuell eingeben und einen Baum mit verzweigten Gesprächsverläufen verwalten. Wenn Sie <code translate="no">/resume</code> ausführen, erhalten Sie eine Wand von Sitzungstiteln. Wenn Sie sich nur an ein paar Details darüber erinnern, was Sie getan haben und es mehr als ein paar Tage her ist, haben Sie viel Glück, die richtige Sitzung zu finden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Für eine langfristige, projektübergreifende Wissensakkumulation ist dieser ganze Ansatz unmöglich.</p>
<p>Um diese Idee zu verwirklichen, verwendet claude-mem ein dreistufiges Speichersystem. Die erste Ebene durchsucht Zusammenfassungen auf hoher Ebene. Die zweite Ebene durchforstet eine Zeitleiste nach weiteren Details. In der dritten Ebene werden vollständige Beobachtungen für die unbearbeitete Konversation abgerufen. Darüber hinaus gibt es Datenschutzkennzeichnungen, Kostenverfolgung und eine Webvisualisierungsschnittstelle.</p>
<p>So funktioniert es unter der Haube:</p>
<ul>
<li><p><strong>Laufzeitschicht.</strong> Ein Node.js Worker-Dienst läuft auf Port 37777. Sitzungsmetadaten werden in einer leichtgewichtigen SQLite-Datenbank gespeichert. Eine Vektordatenbank sorgt für die präzise semantische Abfrage von Speicherinhalten.</p></li>
<li><p><strong>Interaktionsschicht.</strong> Über eine React-basierte Web-UI können Sie erfasste Erinnerungen in Echtzeit anzeigen: Zusammenfassungen, Zeitleisten und Rohdaten.</p></li>
<li><p><strong>Schnittstellenschicht.</strong> Ein MCP-Server (Model Context Protocol) stellt standardisierte Tool-Schnittstellen zur Verfügung. Claude kann <code translate="no">search</code> (Abfrage von High-Level-Zusammenfassungen), <code translate="no">timeline</code> (Anzeige von detaillierten Zeitleisten) und <code translate="no">get_observations</code> (Abruf von Interaktionsrohdaten) aufrufen, um Erinnerungen direkt abzurufen und zu verwenden.</p></li>
</ul>
<p>Fairerweise muss man sagen, dass dies ein solides Produkt ist, das das Speicherproblem von Claude Code löst. Aber es ist klobig und komplex in einer Weise, die im Alltag von Bedeutung ist.</p>
<table>
<thead>
<tr><th>Ebene</th><th>Technologie</th></tr>
</thead>
<tbody>
<tr><td>Sprache</td><td>TypeScript (ES2022, ESNext-Module)</td></tr>
<tr><td>Laufzeit</td><td>Node.js 18+</td></tr>
<tr><td>Datenbank</td><td>SQLite 3 mit bun:sqlite-Treiber</td></tr>
<tr><td>Vektor-Speicher</td><td>ChromaDB (optional, für semantische Suche)</td></tr>
<tr><td>HTTP-Server</td><td>Express.js 4.18</td></tr>
<tr><td>Echtzeit</td><td>Server-gesendete Ereignisse (SSE)</td></tr>
<tr><td>UI-Framework</td><td>React + TypeScript</td></tr>
<tr><td>AI SDK</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Build-Werkzeug</td><td>esbuild (bündelt TypeScript)</td></tr>
<tr><td>Prozess-Manager</td><td>Bun</td></tr>
<tr><td>Testen</td><td>In Node.js eingebauter Test-Runner</td></tr>
</tbody>
</table>
<p><strong>Für den Anfang ist die Einrichtung sehr aufwändig.</strong> Um claude-mem zum Laufen zu bringen, muss man Node.js, Bun und die MCP-Laufzeitumgebung installieren und dann einen Worker-Dienst, einen Express-Server, eine React UI, SQLite und einen Vektorspeicher darauf aufsetzen. Das ist eine Menge an beweglichen Teilen, die bereitgestellt, gewartet und im Falle eines Fehlers debuggt werden müssen.</p>
<p><strong>All diese Komponenten verbrauchen auch Token, die Sie nicht ausgeben wollten.</strong> MCP-Werkzeugdefinitionen werden permanent in das Kontextfenster von Claude geladen, und jeder Werkzeugaufruf verschlingt Token für die Anfrage und die Antwort. Bei langen Sitzungen summiert sich dieser Overhead schnell und kann die Token-Kosten außer Kontrolle geraten lassen.</p>
<p><strong>Der Speicherabruf ist unzuverlässig, weil er vollständig davon abhängt, dass Claude sich für die Suche entscheidet.</strong> Claude muss selbst entscheiden, ob er Tools wie <code translate="no">search</code> aufruft, um den Abruf auszulösen. Wenn es nicht merkt, dass es einen Speicher benötigt, taucht der relevante Inhalt einfach nicht auf. Und jede der drei Speicherebenen erfordert einen eigenen expliziten Toolaufruf, so dass es keine Ausweichmöglichkeit gibt, wenn Claude nicht daran denkt, zu suchen.</p>
<p><strong>Schließlich ist die Datenspeicherung undurchsichtig, was das Debugging und die Migration erschwert.</strong> Die Speicher sind auf SQLite für Sitzungsmetadaten und Chroma für binäre Vektordaten aufgeteilt, ohne dass es ein offenes Format gibt, das sie miteinander verbindet. Migrieren bedeutet, Exportskripte zu schreiben. Um zu sehen, was die KI tatsächlich speichert, muss man die Web-UI oder eine spezielle Abfrageoberfläche verwenden. Es gibt keine Möglichkeit, sich einfach die Rohdaten anzusehen.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Warum ist das memsearch Plugin für Claude Code besser?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir wollten eine Speicherschicht, die wirklich leichtgewichtig ist - keine zusätzlichen Dienste, keine verworrene Architektur, kein betrieblicher Overhead. Das hat uns motiviert, das <strong>memsearch ccplugin</strong> zu entwickeln. Im Kern war dies ein Experiment: <em>Könnte ein kodierungsorientiertes Speichersystem radikal einfacher sein?</em></p>
<p>Ja, und wir haben es bewiesen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das gesamte ccplugin besteht aus vier Shell-Hooks und einem Hintergrund-Watch-Prozess. Kein Node.js, kein MCP-Server, keine Web-UI. Es handelt sich lediglich um Shell-Skripte, die die memsearch CLI aufrufen, was den Einrichtungs- und Wartungsaufwand drastisch reduziert.</p>
<p>Das ccplugin kann so schlank sein, weil die Verantwortlichkeiten strikt abgegrenzt sind. Es kümmert sich nicht um die Speicherspeicherung, den Vektorabruf oder die Texteinbettung. All das wird an die darunter liegende memsearch CLI delegiert. Das ccplugin hat nur eine Aufgabe: die Lebenszyklusereignisse von Claude Code (Sitzungsstart, Eingabeaufforderung, Antwortstop, Sitzungsende) mit den entsprechenden memsearch CLI-Funktionen zu verbinden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dieses entkoppelte Design macht das System über Claude Code hinaus flexibel. Die memsearch CLI arbeitet unabhängig von anderen IDEs, anderen Agenten-Frameworks oder sogar von manuellen Aufrufen. Sie ist nicht an einen einzigen Anwendungsfall gebunden.</p>
<p>In der Praxis bietet dieses Design drei wesentliche Vorteile.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Alle Erinnerungen leben in einfachen Markdown-Dateien</h3><p>Jede Erinnerung, die das ccplugin erstellt, wird in <code translate="no">.memsearch/memory/</code> als Markdown-Datei gespeichert.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Es ist eine Datei pro Tag. Jede Datei enthält die Zusammenfassungen der Sitzungen des jeweiligen Tages in Klartext, der für Menschen lesbar ist. Hier ist ein Screenshot der täglichen Speicherdateien aus dem memsearch-Projekt selbst:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sie können das Format sofort erkennen: Zeitstempel, Sitzungs-ID, Zug-ID und eine Zusammenfassung der Sitzung. Nichts ist versteckt.</p>
<p>Möchten Sie wissen, was sich die KI merkt? Öffnen Sie die Markdown-Datei. Möchten Sie eine Erinnerung bearbeiten? Verwenden Sie Ihren Texteditor. Möchten Sie Ihre Daten migrieren? Kopieren Sie den Ordner <code translate="no">.memsearch/memory/</code>.</p>
<p>Der <a href="https://milvus.io/">Milvus-Vektorindex</a> ist ein Cache, der die semantische Suche beschleunigt. Er kann jederzeit aus Markdown neu aufgebaut werden. Keine undurchsichtigen Datenbanken, keine binären Blackboxen. Alle Daten sind nachvollziehbar und vollständig rekonstruierbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. Automatische Context Injection kostet keine zusätzlichen Token</h3><p>Transparente Speicherung ist die Grundlage dieses Systems. Der eigentliche Nutzen ergibt sich aus der Verwendung dieser Speicher, und in ccplugin erfolgt der Speicherabruf vollautomatisch.</p>
<p>Jedes Mal, wenn eine Eingabeaufforderung übermittelt wird, löst der <code translate="no">UserPromptSubmit</code> -Hook eine semantische Suche aus und fügt die drei wichtigsten relevanten Erinnerungen in den Kontext ein. Claude entscheidet nicht, ob gesucht werden soll. Er holt sich einfach den Kontext.</p>
<p>Während dieses Prozesses sieht Claude niemals MCP-Werkzeugdefinitionen, so dass das Kontextfenster nicht zusätzlich belegt wird. Der Hook läuft auf der CLI-Schicht und gibt die Suchergebnisse im Klartext aus. Kein IPC-Overhead, keine Tool-Call-Token-Kosten. Die Aufblähung des Kontextfensters, die mit MCP-Werkzeugdefinitionen einhergeht, entfällt vollständig.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Für Fälle, in denen die automatische Top-3-Suche nicht ausreicht, haben wir außerdem drei Stufen der progressiven Suche entwickelt. Alle drei sind CLI-Befehle, keine MCP-Tools.</p>
<ul>
<li><p><strong>L1 (automatisch):</strong> Jede Eingabeaufforderung liefert die Top-3 der semantischen Suchergebnisse mit einer <code translate="no">chunk_hash</code> und einer 200-Zeichen-Vorschau. Dies deckt die meisten alltäglichen Anwendungen ab.</p></li>
<li><p><strong>L2 (bedarfsgesteuert):</strong> Wenn ein vollständiger Kontext benötigt wird, gibt <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> den kompletten Markdown-Abschnitt plus Metadaten zurück.</p></li>
<li><p><strong>L3 (tief):</strong> Wenn die ursprüngliche Konversation benötigt wird, ruft <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> den rohen JSONL-Datensatz von Claude Code ab.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Sitzungszusammenfassungen werden im Hintergrund zu nahezu Nullkosten generiert</h3><p>Das Retrieval deckt ab, wie die Speicher verwendet werden. Aber die Erinnerungen müssen zuerst geschrieben werden. Wie werden all diese Markdown-Dateien erstellt?</p>
<p>Das ccplugin erzeugt sie durch eine Hintergrundpipeline, die asynchron läuft und fast nichts kostet. Jedes Mal, wenn Sie eine Claude-Antwort stoppen, wird der <code translate="no">Stop</code> -Hook ausgelöst: Er analysiert das Gesprächsprotokoll, ruft Claude Haiku (<code translate="no">claude -p --model haiku</code>) auf, um eine Zusammenfassung zu erstellen, und hängt sie an die Markdown-Datei des aktuellen Tages an. Haiku-API-Aufrufe sind extrem billig, fast vernachlässigbar pro Aufruf.</p>
<p>Anschließend erkennt der Überwachungsprozess die Datei-Änderung und indiziert den neuen Inhalt automatisch in Milvus, damit er sofort abrufbar ist. Der gesamte Ablauf läuft im Hintergrund, ohne Ihre Arbeit zu unterbrechen, und die Kosten bleiben unter Kontrolle.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Schnellstart des memsearch-Plugins mit Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Installieren Sie zunächst das Plugin vom Claude Code Marktplatz:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Zweitens: Starten Sie Claude Code neu.</h3><p>Das Plugin initialisiert seine Konfiguration automatisch.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Drittens, nach einem Gespräch, die Speicherdatei des Tages überprüfen:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Viertens: Viel Spaß.</h3><p>Wenn Claude Code das nächste Mal startet, ruft das System automatisch die relevanten Erinnerungen ab und fügt sie ein. Es sind keine weiteren Schritte erforderlich.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Kehren wir zur ursprünglichen Frage zurück: Wie gibt man der KI ein persistentes Gedächtnis? claude-mem und memsearch ccplugin verfolgen unterschiedliche Ansätze, die jeweils unterschiedliche Stärken haben. Wir haben einen kurzen Leitfaden für die Wahl zwischen diesen beiden Ansätzen zusammengestellt:</p>
<table>
<thead>
<tr><th>Kategorie</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Architektur</td><td>4 Shell-Haken + 1 Überwachungsprozess</td><td>Node.js-Worker + Express + React UI</td></tr>
<tr><td>Integration Methode</td><td>Native Haken + CLI</td><td>MCP-Server (stdio)</td></tr>
<tr><td>Abruf</td><td>Automatisch (Hook-Injektion)</td><td>Agent-gesteuert (erfordert Tool-Aufruf)</td></tr>
<tr><td>Context-Verbrauch</td><td>Null (nur Ergebnistext injizieren)</td><td>MCP-Werkzeugdefinitionen bleiben bestehen</td></tr>
<tr><td>Zusammenfassung der Sitzung</td><td>Ein asynchroner Haiku-CLI-Aufruf</td><td>Mehrere API-Aufrufe + Komprimierung der Beobachtung</td></tr>
<tr><td>Speicherformat</td><td>Normale Markdown-Dateien</td><td>SQLite + Chroma-Einbettungen</td></tr>
<tr><td>Daten-Migration</td><td>Einfache Markdown-Dateien</td><td>SQLite + Chroma-Einbettungen</td></tr>
<tr><td>Methode der Migration</td><td>Kopieren von .md-Dateien</td><td>Exportieren aus der Datenbank</td></tr>
<tr><td>Laufzeit</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP-Laufzeit</td></tr>
</tbody>
</table>
<p>claude-mem bietet umfangreichere Funktionen, eine ausgefeilte Benutzeroberfläche und eine feinere Steuerung. Für Teams, die Zusammenarbeit, Web-Visualisierung oder detaillierte Speicherverwaltung benötigen, ist es eine gute Wahl.</p>
<p>memsearch ccplugin bietet minimales Design, keinen Kontextfenster-Overhead und vollständig transparenten Speicher. Für Ingenieure, die eine leichtgewichtige Speicherebene ohne zusätzliche Komplexität wünschen, ist es die bessere Wahl. Welche Lösung besser ist, hängt von Ihren Bedürfnissen ab.</p>
<p>Möchten Sie tiefer eintauchen oder Hilfe bei der Entwicklung mit memsearch oder Milvus erhalten?</p>
<ul>
<li><p>Treten Sie der <a href="https://milvus.io/slack">Milvus-Slack-Community</a> bei, um sich mit anderen Entwicklern auszutauschen und zu zeigen, was Sie bauen.</p></li>
<li><p>Buchen Sie unsere <a href="https://milvus.io/office-hours">Milvus-Sprechstunden für</a>Live-Fragen und direkte Unterstützung durch das Team.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Ressourcen<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>memsearch ccplugin Dokumentation:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch Projekt:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Wir haben das Speichersystem von OpenClaw extrahiert und als Open-Source angeboten (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten -</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw-Tutorial: Verbindung zu Slack für lokalen KI-Assistenten</a></p></li>
</ul>
