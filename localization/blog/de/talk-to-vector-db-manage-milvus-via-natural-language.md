---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: >-
  Sprechen Sie mit Ihrer Vektordatenbank: Milvus über natürliche Sprache
  verwalten
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server verbindet Milvus direkt mit KI-Codierassistenten wie Claude
  Code und Cursor über MCP. Sie können Milvus über natürliche Sprache verwalten.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Haben Sie sich jemals gewünscht, Sie könnten Ihrem KI-Assistenten einfach sagen <em>: "Zeigen Sie mir alle Sammlungen in meiner Vektordatenbank"</em> oder <em>"Finden Sie Dokumente, die diesem Text ähnlich sind"</em> und er würde tatsächlich funktionieren?</p>
<p>Der <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a> macht dies möglich, indem er Ihre Milvus-Vektordatenbank über das Model Context Protocol (MCP) direkt mit KI-Codierassistenten wie Claude Desktop und Cursor IDE verbindet. Anstatt <code translate="no">pymilvus</code> Code zu schreiben, können Sie Ihr gesamtes Milvus über natürlichsprachliche Konversationen verwalten.</p>
<ul>
<li><p>Ohne Milvus MCP Server: Schreiben von Python-Skripten mit pymilvus SDK zur Suche von Vektoren</p></li>
<li><p>Mit Milvus MCP Server: "Finde Dokumente, die diesem Text ähnlich sind, in meiner Sammlung."</p></li>
</ul>
<p>👉 <strong>GitHub Repository:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>Und wenn Sie <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (managed Milvus) verwenden, haben wir auch für Sie gesorgt. Am Ende dieses Blogs werden wir auch den <strong>Zilliz MCP Server</strong> vorstellen, eine verwaltete Option, die nahtlos mit Zilliz Cloud zusammenarbeitet. Lassen Sie uns eintauchen.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Was Sie mit dem Milvus MCP Server erhalten<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Milvus MCP Server bietet Ihrem KI-Assistenten die folgenden Möglichkeiten:</p>
<ul>
<li><p><strong>Auflisten und Erkunden</strong> von Vektorsammlungen</p></li>
<li><p><strong>Suche nach Vektoren</strong> anhand semantischer Ähnlichkeit</p></li>
<li><p><strong>Erstellen neuer Sammlungen</strong> mit benutzerdefinierten Schemata</p></li>
<li><p><strong>Einfügen und Verwalten</strong> von Vektordaten</p></li>
<li><p><strong>Ausführen komplexer Abfragen</strong> ohne das Schreiben von Code</p></li>
<li><p>und vieles mehr</p></li>
</ul>
<p>Und das alles durch natürliche Konversation, als ob Sie mit einem Datenbankexperten sprechen würden. Die vollständige Liste der Funktionen finden Sie in <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">diesem Repo</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Schnellstart-Anleitung<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><p><strong>Erforderlich:</strong></p>
<ul>
<li><p>Python 3.10 oder höher</p></li>
<li><p>Eine laufende Milvus-Instanz (lokal oder remote)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">uv package manager</a> (empfohlen)</p></li>
</ul>
<p><strong>Unterstützte AI-Anwendungen:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>Cursor-IDE</p></li>
<li><p>Jede MCP-kompatible Anwendung</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Verwendeter Tech Stack</h3><p>In diesem Tutorium verwenden wir den folgenden Tech Stack:</p>
<ul>
<li><p><strong>Sprache Laufzeit:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Paket-Manager:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursor</p></li>
<li><p><strong>MCP-Server:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Vektor-Datenbank:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Schritt 1: Abhängigkeiten installieren</h3><p>Installieren Sie zunächst den uv-Paketmanager:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Oder:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Überprüfen Sie die Installation:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Schritt 2: Einrichten von Milvus</h3><p><a href="https://milvus.io/">Milvus</a> ist eine Open-Source-Vektordatenbank für KI-Workloads, die von <a href="https://zilliz.com/">Zilliz</a> entwickelt wurde. Sie wurde entwickelt, um Millionen bis Milliarden von Vektordatensätzen zu verarbeiten und hat auf GitHub über 36.000 Sterne erhalten. Aufbauend auf dieser Grundlage bietet Zilliz auch <a href="https://zilliz.com/cloud">Zilliz Cloud</a>an <a href="https://zilliz.com/cloud">- einen</a>vollständig verwalteten Service von Milvus, der für Benutzerfreundlichkeit, Kosteneffizienz und Sicherheit mit einer Cloud-nativen Architektur entwickelt wurde.</p>
<p>Die Anforderungen für die Bereitstellung von Milvus finden Sie in <a href="https://milvus.io/docs/prerequisite-docker.md">diesem Leitfaden auf der Doc-Site</a>.</p>
<p><strong>Mindestanforderungen:</strong></p>
<ul>
<li><p><strong>Software:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Festplatte:</strong> 100GB+</p></li>
</ul>
<p>Laden Sie die YAML-Datei für die Bereitstellung herunter:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Starten Sie Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ihre Milvus-Instanz wird unter <code translate="no">http://localhost:19530</code> verfügbar sein.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Schritt 3: Installieren Sie den MCP-Server</h3><p>Klonen und testen Sie den MCP-Server:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Wir empfehlen, die Abhängigkeiten zu installieren und lokal zu überprüfen, bevor der Server in Cursor registriert wird:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie sehen, dass der Server erfolgreich startet, können Sie Ihr KI-Tool konfigurieren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Schritt 4: Konfigurieren Sie Ihren AI-Assistenten</h3><p><strong>Möglichkeit A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Installieren Sie Claude Desktop von <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Öffnen Sie die Konfigurationsdatei:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Fügen Sie diese Konfiguration hinzu:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Claude Desktop neu starten</li>
</ol>
<p><strong>Option B: Cursor-IDE</strong></p>
<ol>
<li><p>Öffnen Sie Cursor-Einstellungen → Funktionen → MCP</p></li>
<li><p>Fügen Sie einen neuen globalen MCP-Server hinzu (dadurch wird <code translate="no">.cursor/mcp.json</code> erstellt)</p></li>
<li><p>Fügen Sie diese Konfiguration hinzu:</p></li>
</ol>
<p>Hinweis: Passen Sie die Pfade an Ihre tatsächliche Dateistruktur an.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parameter:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> ist der Pfad zur ausführbaren Datei uv</li>
<li><code translate="no">--directory</code> ist der Pfad zu dem geklonten Projekt</li>
<li><code translate="no">--milvus-uri</code> ist der Endpunkt Ihres Milvus-Servers</li>
</ul>
<ol start="4">
<li>Starten Sie den Cursor neu oder laden Sie das Fenster neu</li>
</ol>
<p><strong>Profi-Tipp:</strong> Finden Sie Ihren <code translate="no">uv</code> Pfad mit <code translate="no">which uv</code> unter macOS/Linux oder <code translate="no">where uv</code> unter Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Schritt 5: Sehen Sie es in Aktion</h3><p>Nach der Konfiguration können Sie diese Befehle in natürlicher Sprache ausprobieren:</p>
<ul>
<li><p><strong>Durchsuchen Sie Ihre Datenbank:</strong> "Welche Sammlungen habe ich in meiner Milvus-Datenbank?"</p></li>
<li><p><strong>Erstellen Sie eine neue Sammlung:</strong> "Erstellen Sie eine Sammlung namens 'Artikel' mit Feldern für Titel (String), Inhalt (String) und einem 768-dimensionalen Vektorfeld für Einbettungen."</p></li>
<li><p><strong>Suchen Sie nach ähnlichen Inhalten:</strong> "Finde die fünf ähnlichsten Artikel zu 'Anwendungen des maschinellen Lernens' in meiner Artikelsammlung."</p></li>
<li><p><strong>Daten einfügen:</strong> "Füge einen neuen Artikel mit dem Titel 'AI Trends 2024' und dem Inhalt 'Künstliche Intelligenz entwickelt sich weiter...' in die Artikelsammlung ein"</p></li>
</ul>
<p><strong>Was früher mehr als 30 Minuten Programmierarbeit erforderte, ist jetzt eine Sache von Sekunden.</strong></p>
<p>Sie erhalten Echtzeitkontrolle und natürlichsprachlichen Zugriff auf Milvus - ohne Boilerplate zu schreiben oder die API zu lernen.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Fehlersuche<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn die MCP-Tools nicht angezeigt werden, starten Sie Ihre KI-Anwendung vollständig neu, überprüfen Sie den UV-Pfad mit <code translate="no">which uv</code> und testen Sie den Server manuell mit <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>Prüfen Sie bei Verbindungsfehlern, ob Milvus mit <code translate="no">docker ps | grep milvus</code> läuft, versuchen Sie, <code translate="no">127.0.0.1</code> anstelle von <code translate="no">localhost</code> zu verwenden, und stellen Sie sicher, dass Port 19530 zugänglich ist.</p>
<p>Wenn Sie Probleme mit der Authentifizierung haben, setzen Sie die Umgebungsvariable <code translate="no">MILVUS_TOKEN</code>, wenn Ihr Milvus eine Authentifizierung erfordert, und überprüfen Sie Ihre Berechtigungen für die Vorgänge, die Sie durchführen wollen.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Verwaltete Alternative: Zilliz MCP-Server<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Open-Source <strong>Milvus MCP Server</strong> ist eine großartige Lösung für lokale oder selbst gehostete Milvus-Implementierungen. Wenn Sie jedoch die <a href="https://zilliz.com/cloud">Zilliz Cloud</a>nutzen <a href="https://zilliz.com/cloud">, den</a>vollständig verwalteten, unternehmensgerechten Service, der von den Entwicklern von Milvus entwickelt wurde, gibt es eine speziell entwickelte Alternative: den <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> eliminiert den Aufwand für die Verwaltung Ihrer eigenen Milvus-Instanz und bietet eine skalierbare, performante und sichere Cloud-native Vektordatenbank. Der <strong>Zilliz MCP Server</strong> ist direkt in die Zilliz Cloud integriert und stellt seine Fähigkeiten als MCP-kompatible Tools zur Verfügung. Das bedeutet, dass Ihr KI-Assistent - ob in Claude, Cursor oder einer anderen MCP-kompatiblen Umgebung - jetzt Ihren Zilliz Cloud-Arbeitsbereich in natürlicher Sprache abfragen, verwalten und orchestrieren kann.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kein Kesselstein-Code. Kein Wechsel der Registerkarten. Kein manuelles Schreiben von REST- oder SDK-Aufrufen. Sagen Sie einfach Ihre Anfrage und lassen Sie Ihren Assistenten den Rest erledigen.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Erste Schritte mit Zilliz MCP Server</h3><p>Wenn Sie bereit sind für eine produktionsreife Vektorinfrastruktur mit der Leichtigkeit der natürlichen Sprache, dann ist der Einstieg in wenigen Schritten erledigt:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Melden Sie sich für die Zilliz Cloud an</strong></a> - eine kostenlose Version ist verfügbar.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Installieren Sie den Zilliz MCP Server</strong> aus dem </a>GitHub Repository.</p></li>
<li><p><strong>Konfigurieren Sie Ihren MCP-kompatiblen Assistenten</strong> (Claude, Cursor, etc.), um sich mit Ihrer Zilliz Cloud-Instanz zu verbinden.</p></li>
</ol>
<p>So erhalten Sie das Beste aus beiden Welten: eine leistungsstarke Vektorsuche mit einer produktionsgerechten Infrastruktur, die jetzt in einfachem Englisch zugänglich ist.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Zusammenfassen<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Und das war's - Sie haben gerade gelernt, wie Sie Milvus in eine natürlichsprachliche Vektordatenbank verwandeln, <em>mit der</em> Sie buchstäblich <em>sprechen</em> können. Sie müssen sich nicht mehr durch SDK-Dokumente wühlen oder Boilerplate schreiben, nur um eine Sammlung zu erstellen oder eine Suche durchzuführen.</p>
<p>Egal, ob Sie Milvus lokal betreiben oder die Zilliz Cloud nutzen, der MCP Server gibt Ihrem KI-Assistenten eine Toolbox an die Hand, mit der Sie Ihre Vektordaten wie ein Profi verwalten können. Geben Sie einfach ein, was Sie tun möchten, und lassen Sie Claude oder Cursor den Rest erledigen.</p>
<p>Starten Sie also Ihr KI-Entwicklungstool, fragen Sie: "Welche Sammlungen habe ich?", und sehen Sie es in Aktion. Sie werden nie mehr zurückkehren wollen, um Vektorabfragen von Hand zu schreiben.</p>
<ul>
<li><p>Lokale Einrichtung? Verwenden Sie den quelloffenen<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP Server</a></p></li>
<li><p>Bevorzugen Sie einen verwalteten Dienst? Melden Sie sich für die Zilliz Cloud an und verwenden Sie den<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP Server</a></p></li>
</ul>
<p>Sie haben die Werkzeuge. Jetzt lassen Sie Ihre KI das Tippen erledigen.</p>
