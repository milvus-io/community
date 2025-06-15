---
id: why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
title: >-
  Warum Ihre Vibe-Codierung veralteten Code erzeugt und wie Sie dies mit Milvus
  MCP beheben können
author: Cheney Zhang
date: 2025-06-13T00:00:00.000Z
cover: assets.zilliz.com/milvus_mcp_b1dab2a00c.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, LLM'
meta_keywords: 'Vibe coding, mcp, Milvus, model context protocol'
meta_title: |
  Why Your Vibe Coding Generates Outdated Code and How to Fix It with Milvus MCP
desc: >-
  Das Halluzinationsproblem in Vibe Coding ist ein Produktivitätskiller. Milvus
  MCP zeigt, wie spezialisierte MCP-Server dieses Problem lösen können, indem
  sie Echtzeit-Zugriff auf die aktuelle Dokumentation bieten.
origin: >-
  https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
---
<h2 id="The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="common-anchor-header">Die eine Sache, die Ihren Vibe Coding Flow unterbricht<button data-href="#The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding hat seine Zeit. Tools wie Cursor und Windsurf definieren die Art und Weise, wie wir Software schreiben, neu und machen die Entwicklung mühelos und intuitiv. Fragen Sie nach einer Funktion und Sie erhalten ein Snippet. Sie brauchen einen schnellen API-Aufruf? Er wird generiert, bevor Sie zu Ende getippt haben.</p>
<p><strong>Der Haken an der Sache ist jedoch, dass KI-Assistenten oft veralteten Code erzeugen, der in der Produktion nicht funktioniert.</strong> Das liegt daran, dass die LLMs, die diese Tools antreiben, oft auf veralteten Trainingsdaten beruhen. Selbst der raffinierteste KI-Copilot kann Code vorschlagen, der ein Jahr - oder drei - hinter der Zeit zurückliegt. Das kann dazu führen, dass Sie eine Syntax verwenden, die nicht mehr funktioniert, veraltete API-Aufrufe oder Praktiken, von denen die heutigen Frameworks aktiv abraten.</p>
<p>Betrachten Sie dieses Beispiel: Ich habe Cursor gebeten, den Milvus-Verbindungscode zu generieren, und das Ergebnis war dieses:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Das hat früher perfekt funktioniert, aber das aktuelle pymilvus SDK empfiehlt die Verwendung von <code translate="no">MilvusClient</code> für alle Verbindungen und Operationen. Die alte Methode gilt nicht mehr als Best Practice, aber die KI-Assistenten schlagen sie weiterhin vor, weil ihre Trainingsdaten oft Monate oder Jahre veraltet sind.</p>
<p>Schlimmer noch: Als ich den OpenAI-API-Code anforderte, generierte Cursor ein Snippet, das <code translate="no">gpt-3.5-turbo</code>verwendete - ein Modell, das inzwischen von OpenAI als <em>veraltet</em> eingestuft wird und das dreimal so viel kostet wie sein Nachfolger, aber minderwertige Ergebnisse liefert. Der Code stützte sich auch auf <code translate="no">openai.ChatCompletion</code>, eine API, die seit März 2024 veraltet ist.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_pricing_6bfa92d83b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hier geht es nicht nur um kaputten Code, sondern auch um <strong>kaputte Abläufe</strong>. Das ganze Versprechen von Vibe Coding ist, dass sich die Entwicklung reibungslos und intuitiv anfühlen sollte. Aber wenn Ihr KI-Assistent veraltete APIs und überholte Muster generiert, ist es mit dem Vibe vorbei. Man ist wieder auf Stack Overflow, auf der Suche nach Dokumentationen und auf die alte Art, Dinge zu tun.</p>
<p>Trotz aller Fortschritte bei den Vibe Coding-Tools verbringen Entwickler immer noch viel Zeit damit, die "letzte Meile" zwischen generiertem Code und produktionsreifen Lösungen zu überbrücken. Der Vibe ist da, aber die Genauigkeit ist es nicht.</p>
<p><strong>Bis jetzt.</strong></p>
<h2 id="Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="common-anchor-header">Lernen Sie Milvus MCP kennen: Vibe Coding mit immer aktuellen Docs<button data-href="#Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="anchor-icon" translate="no">
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
    </button></h2><p>Gibt es also eine Möglichkeit, die leistungsstarke Codegenerierung von Tools wie Cursor <em>mit</em> aktueller Dokumentation zu kombinieren, so dass wir direkt in der IDE präzisen Code generieren können?</p>
<p>Auf jeden Fall. Durch die Kombination des Model Context Protocol (MCP) mit Retrieval-Augmented Generation (RAG) haben wir eine erweiterte Lösung namens <strong>Milvus MCP</strong> geschaffen. Sie hilft Entwicklern, die das Milvus SDK verwenden, automatisch auf die neuesten Dokumente zuzugreifen, so dass ihre IDE den richtigen Code erzeugen kann. Dieser Service wird bald verfügbar sein - hier ein kleiner Einblick in die Architektur dahinter.</p>
<h3 id="How-It-Works" class="common-anchor-header">Wie es funktioniert</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/The_Architecture_Behind_MCP_c9093162b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das obige Diagramm zeigt ein hybrides System, das MCP- (Model Context Protocol) und RAG-Architekturen (Retrieval-Augmented Generation) kombiniert, um Entwicklern zu helfen, korrekten Code zu erzeugen.</p>
<p>Auf der linken Seite interagieren Entwickler, die in KI-gesteuerten IDEs wie Cursor oder Windsurf arbeiten, über eine Chat-Schnittstelle, die MCP-Tool-Aufrufe auslöst. Diese Anfragen werden an den MCP-Server auf der rechten Seite gesendet, der spezialisierte Tools für alltägliche Codierungsaufgaben wie Codegenerierung und Refactoring bereitstellt.</p>
<p>Die RAG-Komponente arbeitet auf der MCP-Serverseite, wo die Milvus-Dokumentation vorverarbeitet und als Vektoren in einer Milvus-Datenbank gespeichert wurde. Wenn ein Werkzeug eine Anfrage erhält, führt es eine semantische Suche durch, um die relevantesten Dokumentationsschnipsel und Codebeispiele zu finden. Diese kontextbezogenen Informationen werden dann an den Client zurückgeschickt, wo ein LLM sie verwendet, um genaue, aktuelle Code-Vorschläge zu generieren.</p>
<h3 id="MCP-transport-mechanism" class="common-anchor-header">MCP-Transportmechanismus</h3><p>MCP unterstützt zwei Transportmechanismen: <code translate="no">stdio</code> und <code translate="no">SSE</code>:</p>
<ul>
<li><p>Standard Input/Output (stdio): Der Transport <code translate="no">stdio</code> ermöglicht die Kommunikation über Standard-Ein-/Ausgabeströme. Er ist besonders nützlich für lokale Tools oder Befehlszeilenintegrationen.</p></li>
<li><p>Server-gesendete Ereignisse (SSE): SSE unterstützt Server-to-Client-Streaming unter Verwendung von HTTP-POST-Anfragen für die Client-to-Server-Kommunikation.</p></li>
</ul>
<p>Da <code translate="no">stdio</code> auf eine lokale Infrastruktur angewiesen ist, müssen die Benutzer die Aufnahme von Dokumenten selbst verwalten. In unserem Fall <strong>ist SSE besser geeignet, da der</strong>Server die gesamte Dokumentenverarbeitung und -aktualisierung automatisch übernimmt. Zum Beispiel können Dokumente täglich neu indiziert werden. Die Benutzer müssen lediglich diese JSON-Konfiguration zu ihrer MCP-Einrichtung hinzufügen:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus-code-generate-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;http://&lt;SERVER_ADDRESS&gt;:23333/milvus-code-helper/sse&quot;</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Sobald dies geschehen ist, kann Ihre IDE (z. B. Cursor oder Windsurf) mit den serverseitigen Tools kommunizieren und automatisch die neueste Milvus-Dokumentation für eine intelligentere, aktuelle Codegenerierung abrufen.</p>
<h2 id="Milvus-MCP-in-Action" class="common-anchor-header">Milvus MCP in Aktion<button data-href="#Milvus-MCP-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>Um zu zeigen, wie dieses System in der Praxis funktioniert, haben wir drei einsatzbereite Tools auf dem Milvus MCP Server erstellt, auf die Sie direkt von Ihrer IDE aus zugreifen können. Jedes Tool löst ein häufiges Problem, dem Entwickler bei der Arbeit mit Milvus begegnen:</p>
<ul>
<li><p><strong>pymilvus-code-generator</strong>: Schreibt Python-Code für Sie, wenn Sie gängige Milvus-Operationen wie das Erstellen von Sammlungen, das Einfügen von Daten oder das Ausführen von Suchvorgängen mit dem pymilvus SDK durchführen müssen.</p></li>
<li><p><strong>orm-client-code-konvertierer</strong>: Modernisiert Ihren bestehenden Python-Code, indem veraltete ORM-Muster (Object Relational Mapping) durch die einfachere, neuere MilvusClient-Syntax ersetzt werden.</p></li>
<li><p><strong>Sprach-Übersetzer</strong>: Konvertiert Ihren Milvus-SDK-Code zwischen verschiedenen Programmiersprachen. Wenn Sie z. B. funktionierenden Python-SDK-Code haben, ihn aber in TypeScript-SDK benötigen, übersetzt dieses Tool ihn für Sie.</p></li>
</ul>
<p>Schauen wir uns nun an, wie sie funktionieren.</p>
<h3 id="pymilvus-code-generator" class="common-anchor-header">pymilvus-code-generator</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="pymilvus-code-generator"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>In dieser Demo habe ich Cursor gebeten, den Code für die Volltextsuche mit <code translate="no">pymilvus</code> zu generieren. Cursor ruft erfolgreich das richtige MCP-Tool auf und gibt spezifizierungskonformen Code aus. Die meisten Anwendungsfälle von <code translate="no">pymilvus</code> funktionieren nahtlos mit diesem Tool.</p>
<p>Hier ein direkter Vergleich mit und ohne dieses Tool.</p>
<p><strong>Mit MCP MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/With_Milvus_MCP_f72ad4cfb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Cursor mit Milvus MCP verwendet die neueste Schnittstelle <code translate="no">MilvusClient</code>, um eine Sammlung zu erstellen.</p>
<p><strong>Ohne MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Without_Milvus_MCP_3336d956a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Der Cursor ohne Milvus MCP-Server verwendet eine veraltete ORM-Syntax, die nicht mehr empfohlen wird.</p>
<h3 id="orm-client-code-convertor" class="common-anchor-header">orm-client-code-konverter</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504859?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="orm-client-code-convertor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>In diesem Beispiel hebt der Benutzer einige ORM-ähnliche Codes hervor und fordert eine Konvertierung an. Das Tool schreibt die Verbindungs- und Schemalogik unter Verwendung einer <code translate="no">MilvusClient</code> -Instanz korrekt um. Der Benutzer kann alle Änderungen mit einem Klick übernehmen.</p>
<h3 id="language-translator" class="common-anchor-header"><strong>Sprachübersetzer</strong></h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504885?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="tool3 ts-1"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>Hier wählt der Benutzer eine <code translate="no">.py</code> Datei aus und bittet um eine TypeScript-Übersetzung. Das Tool ruft den richtigen MCP-Endpunkt auf, ruft die neuesten TypeScript-SDK-Dokumente ab und gibt eine äquivalente <code translate="no">.ts</code> -Datei mit der gleichen Geschäftslogik aus. Dies ist ideal für sprachenübergreifende Migrationen.</p>
<h2 id="Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="common-anchor-header">Vergleich von Milvus MCP mit Context7, DeepWiki und anderen Tools<button data-href="#Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben das Problem der Halluzinationen auf der "letzten Meile" in Vibe Coding diskutiert. Neben unserem Milvus MCP zielen auch viele andere Tools auf die Lösung dieses Problems ab, wie Context7 und DeepWiki. Diese Tools, die oft auf MCP oder RAG basieren, helfen dabei, aktuelle Dokumente und Codebeispiele in das Kontextfenster des Modells einzublenden.</p>
<h3 id="Context7" class="common-anchor-header">Kontext7</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Context7_fc32b53a0e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Auf der Milvus-Seite von Context7 können Benutzer Dokumentsnippets suchen und anpassen<a href="https://context7.com/milvus-io/milvus">(https://context7.com/milvus-io/milvus)</a></p>
<p>Context7 bietet aktuelle, versionsspezifische Dokumentation und Codebeispiele für LLMs und KI-Code-Editoren. Das Kernproblem besteht darin, dass LLMs sich auf veraltete oder allgemeine Informationen über die von Ihnen verwendeten Bibliotheken verlassen und Ihnen Codebeispiele liefern, die veraltet sind und auf jahrealten Trainingsdaten basieren.</p>
<p>Context7 MCP zieht aktuelle, versionsspezifische Dokumentation und Codebeispiele direkt aus dem Quellcode und platziert sie direkt in Ihrem Prompt. Es unterstützt GitHub Repo-Importe und <code translate="no">llms.txt</code> Dateien, einschließlich Formate wie <code translate="no">.md</code>, <code translate="no">.mdx</code>, <code translate="no">.txt</code>, <code translate="no">.rst</code> und <code translate="no">.ipynb</code> (nicht <code translate="no">.py</code> Dateien).</p>
<p>Benutzer können Inhalte entweder manuell von der Website kopieren oder die MCP-Integration von Context7 für den automatischen Abruf verwenden.</p>
<h3 id="DeepWiki" class="common-anchor-header"><strong>DeepWiki</strong></h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Wiki_bebe01aa6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: DeepWiki bietet automatisch generierte Zusammenfassungen von Milvus, einschließlich Logik und Architektur<a href="https://deepwiki.com/milvus-io/milvus">(https://deepwiki.com/milvus-io/milvus)</a></p>
<p>DeepWiki analysiert automatisch Open-Source-Projekte auf GitHub, um lesbare technische Dokumentationen, Diagramme und Flussdiagramme zu erstellen. Es enthält eine Chat-Schnittstelle für Fragen und Antworten in natürlicher Sprache. Es priorisiert jedoch Codedateien gegenüber der Dokumentation, so dass es wichtige Einblicke in die Dokumentation übersehen kann. Derzeit fehlt die MCP-Integration.</p>
<h3 id="Cursor-Agent-Mode" class="common-anchor-header">Cursor-Agent-Modus</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cursor_Agent_Mode_fba8ef66af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der Agentenmodus in Cursor ermöglicht die Websuche, MCP-Aufrufe und das Umschalten von Plugins. Er ist zwar leistungsstark, aber manchmal inkonsistent. Sie können <code translate="no">@</code> verwenden, um Dokumente manuell einzufügen, aber dazu müssen Sie den Inhalt erst finden und anhängen.</p>
<h3 id="llmstxt" class="common-anchor-header">llms.txt</h3><p><code translate="no">llms.txt</code> ist kein Werkzeug, sondern ein vorgeschlagener Standard, um LLMs mit strukturierten Website-Inhalten zu versorgen. Normalerweise wird er in Markdown in das Stammverzeichnis einer Website eingefügt und organisiert Titel, Dokumentbäume, Anleitungen, API-Links und mehr.</p>
<p>Es ist kein eigenständiges Tool, aber es lässt sich gut mit anderen Tools kombinieren, die es unterstützen.</p>
<h3 id="Side-by-Side-Feature-Comparison-Milvus-MCP-vs-Context7-vs-DeepWiki-vs-Cursor-Agent-Mode-vs-llmstxt" class="common-anchor-header">Feature-Vergleich Seite an Seite: Milvus MCP vs. Context7 vs. DeepWiki vs. Cursor Agent Mode vs llms.txt</h3><table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Merkmal</strong></td><td style="text-align:center"><strong>Kontext7</strong></td><td style="text-align:center"><strong>DeepWiki</strong></td><td style="text-align:center"><strong>Cursor-Agent-Modus</strong></td><td style="text-align:center"><strong>llms.txt</strong></td><td style="text-align:center"><strong>Milvus MCP</strong></td></tr>
<tr><td style="text-align:center"><strong>Doc-Behandlung</strong></td><td style="text-align:center">Nur Dokumente, kein Code</td><td style="text-align:center">Code-fokussiert, kann Docs übersehen</td><td style="text-align:center">Vom Benutzer ausgewählt</td><td style="text-align:center">Strukturiertes Markdown</td><td style="text-align:center">Nur offizielle Milvus-Dokumente</td></tr>
<tr><td style="text-align:center"><strong>Kontextabfrage</strong></td><td style="text-align:center">Automatisches Einfügen</td><td style="text-align:center">Manuelles Kopieren/Einfügen</td><td style="text-align:center">Gemischt, weniger genau</td><td style="text-align:center">Strukturierte Vorbeschriftung</td><td style="text-align:center">Automatischer Abruf aus Vektorspeicher</td></tr>
<tr><td style="text-align:center"><strong>Benutzerdefinierter Import</strong></td><td style="text-align:center">✅ GitHub, llms.txt</td><td style="text-align:center">✅ GitHub (auch privat)</td><td style="text-align:center">❌ Nur manuelle Auswahl</td><td style="text-align:center">✅ Manuell verfasst</td><td style="text-align:center">❌ Server-gepflegt</td></tr>
<tr><td style="text-align:center"><strong>Manueller Aufwand</strong></td><td style="text-align:center">Teilweise (MCP vs. manuell)</td><td style="text-align:center">Manuelle Kopie</td><td style="text-align:center">Halb-manuell</td><td style="text-align:center">Nur Administrator</td><td style="text-align:center">Keine Benutzeraktion erforderlich</td></tr>
<tr><td style="text-align:center"><strong>MCP-Integration</strong></td><td style="text-align:center">✅ Ja</td><td style="text-align:center">❌ Nein</td><td style="text-align:center">✅ Ja (mit Einrichtung)</td><td style="text-align:center">❌ Kein Werkzeug</td><td style="text-align:center">✅ Erforderlich</td></tr>
<tr><td style="text-align:center"><strong>Vorteile</strong></td><td style="text-align:center">Live-Updates, IDE-fähig</td><td style="text-align:center">Visuelle Diagramme, QA-Unterstützung</td><td style="text-align:center">Benutzerdefinierte Arbeitsabläufe</td><td style="text-align:center">Strukturierte Daten für AI</td><td style="text-align:center">Gewartet von Milvus/Zilliz</td></tr>
<tr><td style="text-align:center"><strong>Beschränkungen</strong></td><td style="text-align:center">Keine Unterstützung für Codedateien</td><td style="text-align:center">Überspringt Dokumente</td><td style="text-align:center">Verlässt sich auf die Genauigkeit des Webs</td><td style="text-align:center">Benötigt andere Tools</td><td style="text-align:center">Ausschließlich auf Milvus fokussiert</td></tr>
</tbody>
</table>
<p>Milvus MCP wurde speziell für die Entwicklung von Milvus-Datenbanken entwickelt. Es bezieht automatisch die neueste offizielle Dokumentation und arbeitet nahtlos mit Ihrer Programmierumgebung zusammen. Wenn Sie mit Milvus arbeiten, ist dies die beste Option für Sie.</p>
<p>Andere Tools wie Context7, DeepWiki und Cursor Agent Mode arbeiten mit vielen verschiedenen Technologien, sind aber nicht so spezialisiert oder präzise für die Milvus-spezifische Arbeit.</p>
<p>Wählen Sie je nach Bedarf. Die gute Nachricht ist, dass diese Tools gut zusammenarbeiten - Sie können mehrere gleichzeitig verwenden, um die besten Ergebnisse für verschiedene Teile Ihres Projekts zu erzielen.</p>
<h2 id="Milvus-MCP-is-Coming-Soon" class="common-anchor-header">Milvus MCP ist bald verfügbar!<button data-href="#Milvus-MCP-is-Coming-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Halluzinationsproblem in Vibe Coding ist nicht nur eine kleine Unannehmlichkeit - es ist ein Produktivitätskiller, der Entwickler dazu zwingt, manuelle Überprüfungsabläufe durchzuführen. Milvus MCP demonstriert, wie spezialisierte MCP-Server dieses Problem lösen können, indem sie Echtzeitzugriff auf die aktuelle Dokumentation bieten.</p>
<p>Für Milvus-Entwickler bedeutet dies, dass sie keine veralteten <code translate="no">connections.connect()</code> -Aufrufe mehr debuggen oder sich mit veralteten ORM-Mustern herumschlagen müssen. Die drei Tools - der Milvus-Code-Generator, der Orm-Client-Code-Konverter und der Language-Translator - lösen die häufigsten Probleme automatisch.</p>
<p>Sind Sie bereit, es auszuprobieren? Der Dienst wird in Kürze für den frühen Zugang zum Testen verfügbar sein. Bleiben Sie dran.</p>
