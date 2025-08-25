---
id: >-
  stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
title: >-
  Halten Sie Ihren KI-Assistenten davon ab, veralteten Code zu schreiben - mit
  Milvus SDK Code Helper
author: 'Cheney Zhang, Stacy Li'
date: 2025-08-22T00:00:00.000Z
desc: >-
  Schritt-für-Schritt-Anleitung zur Einrichtung des Milvus SDK Code Helper, um
  zu verhindern, dass KI-Assistenten veralteten Code erzeugen, und um Best
  Practices sicherzustellen.
cover: >-
  assets.zilliz.com/stop_your_ai_assistant_from_writing_outdated_code_with_milvus_sdk_code_helper_min_64fa8d3396.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus SDK Code Helper, AI coding assistant, MCP server, vibe coding, pymilvus'
meta_title: |
  Milvus SDK Code Helper Tutorial: Fix AI Outdated Code
origin: >-
  https://milvus.io/blog/stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
---
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding verändert die Art und Weise, wie wir Software schreiben. Tools wie Cursor und Windsurf sorgen dafür, dass sich die Entwicklung mühelos und intuitiv anfühlt - fragen Sie nach einer Funktion und erhalten Sie ein Snippet, benötigen Sie einen schnellen API-Aufruf, wird dieser generiert, bevor Sie zu Ende getippt haben. Das Versprechen ist eine reibungslose, nahtlose Entwicklung, bei der Ihr KI-Assistent Ihre Bedürfnisse vorhersieht und genau das liefert, was Sie wollen.</p>
<p>Aber es gibt einen entscheidenden Fehler, der diesen schönen Fluss unterbricht: KI-Assistenten erzeugen häufig veralteten Code, der in der Produktion nicht funktioniert.</p>
<p>Betrachten Sie dieses Beispiel: Ich habe Cursor gebeten, den Milvus-Verbindungscode zu generieren, und er hat das hier erzeugt:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Dies funktionierte früher perfekt, aber das aktuelle pymilvus SDK empfiehlt die Verwendung von <code translate="no">MilvusClient</code> für alle Verbindungen und Operationen. Die alte Methode gilt nicht mehr als Best Practice, aber die KI-Assistenten schlagen sie weiterhin vor, weil ihre Trainingsdaten oft Monate oder Jahre veraltet sind.</p>
<p>Trotz aller Fortschritte bei den Vibe Coding Tools verbringen Entwickler immer noch viel Zeit damit, die "letzte Meile" zwischen generiertem Code und produktionsreifen Lösungen zu überbrücken. Der Vibe ist da, aber die Genauigkeit ist es nicht.</p>
<h3 id="What-is-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Was ist der Milvus SDK Code Helper?</h3><p>Der <strong>Milvus SDK Code Helper</strong> ist eine auf Entwickler ausgerichtete Lösung, die das Problem der <em>"letzten Meile"</em> bei der Vibe-Codierung löst und die Lücke zwischen der KI-gestützten Codierung und den produktionsreifen Milvus-Anwendungen schließt.</p>
<p>Im Kern handelt es sich um einen <strong>Model Context Protocol (MCP)-Server</strong>, der Ihre KI-gestützte IDE direkt mit der neuesten offiziellen Milvus-Dokumentation verbindet. In Kombination mit Retrieval-Augmented Generation (RAG) stellt er sicher, dass der von Ihrem Assistenten generierte Code stets korrekt und aktuell ist und den Best Practices von Milvus entspricht.</p>
<p>Statt veralteter Snippets oder Vermutungen erhalten Sie kontextbezogene, standardkonforme Codevorschläge - direkt in Ihrem Entwicklungsworkflow.</p>
<p><strong>Hauptvorteile:</strong></p>
<ul>
<li><p>⚡ <strong>Einmal konfigurieren, Effizienz für immer steigern</strong>: Einmal einrichten und konsistent aktualisierte Codegenerierung genießen</p></li>
<li><p><strong>🎯 Immer aktuell</strong>: Zugriff auf die neueste offizielle Milvus SDK-Dokumentation</p></li>
<li><p>📈 <strong>Verbesserte Code-Qualität</strong>: Generieren Sie Code, der den aktuellen Best Practices folgt</p></li>
<li><p>🌊 <strong>Wiederhergestellter Fluss</strong>: Halten Sie Ihre Vibe Coding Erfahrung reibungslos und ohne Unterbrechung</p></li>
</ul>
<p><strong>Drei Tools in einem</strong></p>
<ol>
<li><p><code translate="no">pymilvus-code-generator</code> → Schnelles Schreiben von Python-Code für gängige Milvus-Aufgaben (z. B. Erstellen von Sammlungen, Einfügen von Daten, Ausführen von Vektorsuchen).</p></li>
<li><p><code translate="no">orm-client-code-converter</code> → Modernisieren Sie alten Python-Code, indem Sie veraltete ORM-Muster durch die neueste <code translate="no">MilvusClient</code> -Syntax ersetzen.</p></li>
<li><p><code translate="no">language-translator</code> → Nahtlose Konvertierung von Milvus-SDK-Code zwischen verschiedenen Sprachen (z. B. Python ↔ TypeScript).</p></li>
</ol>
<p>Weitere Details finden Sie in den unten stehenden Ressourcen:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Warum Ihre Vibe-Codierung veralteten Code erzeugt und wie Sie dies mit Milvus MCP beheben können </a></p></li>
<li><p>Doc: <a href="https://milvus.io/docs/milvus-sdk-helper-mcp.md#Quickstart">Milvus SDK Code Helper Guide | Milvus Dokumentation</a></p></li>
</ul>
<h3 id="Before-You-Begin" class="common-anchor-header">Bevor Sie beginnen</h3><p>Bevor wir uns mit der Einrichtung befassen, sollten wir uns den dramatischen Unterschied ansehen, den der Code Helper in der Praxis macht. Der folgende Vergleich zeigt, wie die gleiche Anfrage zur Erstellung einer Milvus-Sammlung völlig unterschiedliche Ergebnisse liefert:</p>
<table>
<thead>
<tr><th><strong>MCP Code Helper Aktiviert:</strong></th><th><strong>MCP Code Helper Deaktiviert:</strong></th></tr>
</thead>
<tbody>
<tr><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_enabled_fcb94737fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_disabled_769db4faee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td></tr>
</tbody>
</table>
<p>Dies veranschaulicht perfekt das Kernproblem: Ohne den Code Helper generieren selbst die fortschrittlichsten KI-Assistenten Code unter Verwendung veralteter ORM SDK-Muster, die nicht mehr empfohlen werden. Der Code Helper stellt sicher, dass Sie jedes Mal die aktuellste, effizienteste und offiziell anerkannte Implementierung erhalten.</p>
<p><strong>Der Unterschied in der Praxis:</strong></p>
<ul>
<li><p><strong>Moderner Ansatz</strong>: Sauberer, wartbarer Code unter Verwendung aktueller Best Practices</p></li>
<li><p><strong>Veralteter Ansatz</strong>: Code, der funktioniert, aber veralteten Mustern folgt</p></li>
<li><p><strong>Auswirkungen auf die Produktion</strong>: Aktueller Code ist effizienter, einfacher zu pflegen und zukunftssicher</p></li>
</ul>
<p>Dieser Leitfaden führt Sie durch die Einrichtung des Milvus SDK Code Helper für mehrere AI-IDEs und Entwicklungsumgebungen. Der Einrichtungsprozess ist unkompliziert und dauert in der Regel nur ein paar Minuten pro IDE.</p>
<h2 id="Setting-Up-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Einrichten des Milvus SDK Code Helper<button data-href="#Setting-Up-the-Milvus-SDK-Code-Helper" class="anchor-icon" translate="no">
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
    </button></h2><p>Die folgenden Abschnitte enthalten detaillierte Einrichtungsanweisungen für jede unterstützte IDE und Entwicklungsumgebung. Wählen Sie den Abschnitt, der Ihrer bevorzugten Entwicklungsumgebung entspricht.</p>
<h3 id="Cursor-IDE-Setup" class="common-anchor-header">Cursor IDE-Einrichtung</h3><p>Cursor bietet durch sein eingebautes Konfigurationssystem eine nahtlose Integration mit MCP-Servern.</p>
<p><strong>Schritt 1: Zugriff auf MCP-Einstellungen</strong></p>
<p>Navigieren Sie zu: Einstellungen → Cursor-Einstellungen → Werkzeuge &amp; Integrationen → Neuen globalen MCP-Server hinzufügen</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cursor_mcp_configuration_interface_9ff0b7dcb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
 <em>Cursor MCP-Konfigurationsschnittstelle</em></p>
<p><strong>Schritt 2: Konfigurieren Sie den MCP-Server</strong></p>
<p>Sie haben zwei Optionen für die Konfiguration:</p>
<p><strong>Option A: Globale Konfiguration (empfohlen)</strong></p>
<p>Fügen Sie die folgende Konfiguration zu Ihrer Cursor <code translate="no">~/.cursor/mcp.json</code> Datei hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Option B: Projektspezifische Konfiguration</strong></p>
<p>Erstellen Sie in Ihrem Projektordner eine Datei <code translate="no">.cursor/mcp.json</code> mit der gleichen Konfiguration wie oben.</p>
<p>Weitere Konfigurationsoptionen und Informationen zur Fehlerbehebung finden Sie in der<a href="https://docs.cursor.com/context/model-context-protocol"> Cursor MCP-Dokumentation</a>.</p>
<h3 id="Claude-Desktop-Setup" class="common-anchor-header">Einrichtung von Claude Desktop</h3><p>Claude Desktop bietet eine unkomplizierte MCP-Integration durch sein Konfigurationssystem.</p>
<p><strong>Schritt 1: Auffinden der Konfigurationsdatei</strong></p>
<p>Fügen Sie die folgende Konfiguration zu Ihrer Claude Desktop-Konfigurationsdatei hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 2: Neustart von Claude Desktop</strong></p>
<p>Nachdem Sie die Konfiguration gespeichert haben, starten Sie Claude Desktop neu, um den neuen MCP-Server zu aktivieren.</p>
<h3 id="Claude-Code-Setup" class="common-anchor-header">Einrichtung von Claude Code</h3><p>Claude Code bietet eine Befehlszeilenkonfiguration für MCP-Server und ist damit ideal für Entwickler, die eine terminalbasierte Einrichtung bevorzugen.</p>
<p><strong>Schritt 1: MCP-Server über die Kommandozeile hinzufügen</strong></p>
<p>Führen Sie den folgenden Befehl in Ihrem Terminal aus:</p>
<pre><code translate="no">claude mcp add-json sdk-code-helper --json &#x27;{
  &quot;url&quot;: &quot;https://sdk.milvus.io/mcp/&quot;,
  &quot;headers&quot;: {
    &quot;Accept&quot;: &quot;text/event-stream&quot;
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 2: Überprüfen der Installation</strong></p>
<p>Der MCP-Server wird automatisch konfiguriert und ist sofort nach Ausführung des Befehls einsatzbereit.</p>
<h3 id="Windsurf-IDE-Setup" class="common-anchor-header">Windsurf IDE Einrichtung</h3><p>Windsurf unterstützt die MCP-Konfiguration durch sein JSON-basiertes Einstellungssystem.</p>
<p><strong>Schritt 1: Zugriff auf MCP-Einstellungen</strong></p>
<p>Fügen Sie die folgende Konfiguration zu Ihrer Windsurf MCP-Einstellungsdatei hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 2: Konfiguration anwenden</strong></p>
<p>Speichern Sie die Einstellungsdatei und starten Sie Windsurf neu, um den MCP-Server zu aktivieren.</p>
<h3 id="VS-Code-Setup" class="common-anchor-header">VS-Code-Einrichtung</h3><p>Die Integration von VS Code erfordert eine MCP-kompatible Erweiterung, um ordnungsgemäß zu funktionieren.</p>
<p><strong>Schritt 1: MCP-Erweiterung installieren</strong></p>
<p>Stellen Sie sicher, dass Sie eine MCP-kompatible Erweiterung in VS Code installiert haben.</p>
<p><strong>Schritt 2: Konfigurieren Sie den MCP-Server</strong></p>
<p>Fügen Sie die folgende Konfiguration zu Ihren VS Code MCP-Einstellungen hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Cherry-Studio-Setup" class="common-anchor-header">Cherry Studio-Einrichtung</h3><p>Cherry Studio bietet eine benutzerfreundliche grafische Oberfläche für die Konfiguration des MCP-Servers, so dass sie für Entwickler, die visuelle Setup-Prozesse bevorzugen, zugänglich ist.</p>
<p><strong>Schritt 1: Zugriff auf die MCP-Server-Einstellungen</strong></p>
<p>Navigieren Sie über die Cherry Studio-Oberfläche zu Einstellungen → MCP-Server → Server hinzufügen.</p>
<p><strong>Schritt 2: Konfigurieren Sie die Serverdetails</strong></p>
<p>Füllen Sie das Serverkonfigurationsformular mit den folgenden Informationen aus:</p>
<ul>
<li><p><strong>Name</strong>: <code translate="no">sdk code helper</code></p></li>
<li><p><strong>Typ</strong>: <code translate="no">Streamable HTTP</code></p></li>
<li><p><strong>URL</strong>: <code translate="no">https://sdk.milvus.io/mcp/</code></p></li>
<li><p><strong>Kopfzeilen</strong>: <code translate="no">&quot;Accept&quot;: &quot;text/event-stream&quot;</code></p></li>
</ul>
<p><strong>Schritt 3: Speichern und Aktivieren</strong></p>
<p>Klicken Sie auf Speichern, um die Serverkonfiguration zu aktivieren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cherry_studio_mcp_configuration_interface_b7dce8b26d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cherry Studio MCP Konfigurationsoberfläche</em></p>
<h3 id="Cline-Setup" class="common-anchor-header">Cline-Einrichtung</h3><p>Cline verwendet ein JSON-basiertes Konfigurationssystem, das über seine Schnittstelle zugänglich ist.</p>
<p><strong>Schritt 1: Zugriff auf MCP-Einstellungen</strong></p>
<ol>
<li><p>Öffnen Sie Cline und klicken Sie auf das Symbol MCP Servers in der oberen Navigationsleiste</p></li>
<li><p>Wählen Sie die Registerkarte Installed</p></li>
<li><p>Klicken Sie auf Erweiterte MCP-Einstellungen</p></li>
</ol>
<p><strong>Schritt 2: Bearbeiten Sie die Konfigurationsdatei</strong> In der Datei <code translate="no">cline_mcp_settings.json</code> fügen Sie die folgende Konfiguration hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 3: Speichern und neu starten</strong></p>
<p>Speichern Sie die Konfigurationsdatei und starten Sie Cline neu, um die Änderungen zu übernehmen.</p>
<h3 id="Augment-Setup" class="common-anchor-header">Augment-Einrichtung</h3><p>Augment ermöglicht den Zugriff auf die MCP-Konfiguration über sein Panel für erweiterte Einstellungen.</p>
<p><strong>Schritt 1: Zugriff auf Einstellungen</strong></p>
<ol>
<li><p>Drücken Sie Cmd/Ctrl + Shift + P oder navigieren Sie zum Hamburger-Menü im Augment-Panel</p></li>
<li><p>Wählen Sie Einstellungen bearbeiten</p></li>
<li><p>Klicken Sie unter Advanced auf Edit in settings.json</p></li>
</ol>
<p><strong>Schritt 2: Serverkonfiguration hinzufügen</strong></p>
<p>Fügen Sie die Serverkonfiguration zum Array <code translate="no">mcpServers</code> im Objekt <code translate="no">augment.advanced</code> hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Gemini-CLI-Setup" class="common-anchor-header">Gemini CLI-Einrichtung</h3><p>Gemini CLI erfordert eine manuelle Konfiguration über eine JSON-Einstellungsdatei.</p>
<p><strong>Schritt 1: Einstellungsdatei erstellen oder bearbeiten</strong></p>
<p>Erstellen oder bearbeiten Sie die Datei <code translate="no">~/.gemini/settings.json</code> auf Ihrem System.</p>
<p><strong>Schritt 2: Konfiguration hinzufügen</strong></p>
<p>Fügen Sie die folgende Konfiguration in die Einstellungsdatei ein:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 3: Änderungen übernehmen</strong></p>
<p>Speichern Sie die Datei und starten Sie Gemini CLI neu, um die Konfigurationsänderungen zu übernehmen.</p>
<h3 id="Roo-Code-Setup" class="common-anchor-header">Roo Code Einrichtung</h3><p>Roo Code verwendet eine zentralisierte JSON-Konfigurationsdatei für die Verwaltung von MCP-Servern.</p>
<p><strong>Schritt 1: Zugriff auf die globale Konfiguration</strong></p>
<ol>
<li><p>Öffnen Sie Roo Code</p></li>
<li><p>Navigieren Sie zu Settings → MCP Servers → Edit Global Config</p></li>
</ol>
<p><strong>Schritt 2: Konfigurationsdatei bearbeiten</strong></p>
<p>Fügen Sie in der Datei <code translate="no">mcp_settings.json</code> die folgende Konfiguration hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schritt 3: Aktivieren Sie den Server</strong></p>
<p>Speichern Sie die Datei, um den MCP-Server automatisch zu aktivieren.</p>
<h3 id="Verification-and-Testing" class="common-anchor-header">Überprüfung und Test</h3><p>Nachdem Sie das Setup für die von Ihnen gewählte IDE abgeschlossen haben, können Sie überprüfen, ob der Milvus SDK Code Helper korrekt funktioniert:</p>
<ol>
<li><p><strong>Testen der Codegenerierung</strong>: Bitten Sie Ihren KI-Assistenten, Milvus-bezogenen Code zu generieren und beobachten Sie, ob er die aktuellen Best Practices verwendet.</p></li>
<li><p><strong>Zugang zur Dokumentation prüfen</strong>: Informationen über bestimmte Milvus-Funktionen anfordern, um sicherzustellen, dass der Helfer aktuelle Antworten liefert</p></li>
<li><p><strong>Vergleich der Ergebnisse</strong>: Generieren Sie dieselbe Code-Anfrage mit und ohne den Assistenten, um den Unterschied in Qualität und Aktualität festzustellen.</p></li>
</ol>
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
    </button></h2><p>Mit der Einrichtung des Milvus SDK Code Helper haben Sie einen entscheidenden Schritt in Richtung der Zukunft der Entwicklung getan - in der KI-Assistenten nicht nur schnellen, sondern auch <strong>präzisen und aktuellen</strong> Code generieren. Anstatt sich auf statische Trainingsdaten zu verlassen, die veraltet sind, bewegen wir uns hin zu dynamischen Echtzeit-Wissenssystemen, die sich mit den Technologien, die sie unterstützen, weiterentwickeln.</p>
<p>Da KI-Codierassistenten immer ausgefeilter werden, wird sich die Kluft zwischen Tools mit aktuellem Wissen und solchen ohne Wissen nur vergrößern. Der Milvus SDK Code Helper ist nur der Anfang - es ist zu erwarten, dass ähnliche spezialisierte Wissensserver für andere wichtige Technologien und Frameworks entwickelt werden. Die Zukunft gehört den Entwicklern, die sich die Geschwindigkeit von KI zunutze machen und gleichzeitig Genauigkeit und Aktualität gewährleisten können. Sie sind jetzt mit beidem ausgestattet.</p>
