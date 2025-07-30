---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Aufbau einer Open-Source-Alternative zu Cursor mit Code Context
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context - ein quelloffenes, MCP-kompatibles Plugin, das eine
  leistungsstarke semantische Codesuche für jeden AI Coding Agent, Claude Code
  und Gemini CLI, IDEs wie VSCode und sogar Umgebungen wie Chrome ermöglicht.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">Der KI-Codierungsboom - und sein blinder Fleck<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>KI-Coding-Tools sind allgegenwärtig - und sie verbreiten sich aus gutem Grund. Von <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code über Gemini CLI</a> bis hin zu den Open-Source-Alternativen von Cursor können diese Agenten mit einer einzigen Eingabeaufforderung Funktionen schreiben, Code-Abhängigkeiten erklären und ganze Dateien refaktorisieren. Die Entwickler stürzen sich darauf, sie in ihre Arbeitsabläufe zu integrieren, und in vielerlei Hinsicht werden sie dem Hype gerecht.</p>
<p><strong>Aber wenn es darum geht, <em>Ihre Codebasis zu verstehen</em>, stoßen die meisten KI-Tools an ihre Grenzen.</strong></p>
<p>Wenn Sie Claude Code bitten, herauszufinden, "wo in diesem Projekt die Benutzerauthentifizierung gehandhabt wird", greift es auf <code translate="no">grep -r &quot;auth&quot;</code>zurück und spuckt 87 lose zusammenhängende Übereinstimmungen in Kommentaren, Variablennamen und Dateinamen aus, wobei wahrscheinlich viele Funktionen mit Authentifizierungslogik fehlen, die aber nicht "auth" heißen. Versuchen Sie Gemini CLI, und es wird nach Schlüsselwörtern wie "login" oder "password" suchen, wobei Funktionen wie <code translate="no">verifyCredentials()</code> völlig fehlen. Diese Tools sind großartig, wenn es darum geht, Code zu generieren, aber wenn es an der Zeit ist, zu navigieren, zu debuggen oder unbekannte Systeme zu erkunden, fallen sie auseinander. Wenn sie nicht die gesamte Codebasis an den LLM senden, um den Kontext zu ermitteln - und dabei Token und Zeit verbrennen -, können sie kaum sinnvolle Antworten liefern.</p>
<p><em>Das ist die eigentliche Lücke in den heutigen KI-Werkzeugen:</em> <strong><em>Code-Kontext.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor hat es geschafft - aber nicht für jeden<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> geht dieses Problem frontal an. Anstelle einer Schlüsselwortsuche erstellt es eine semantische Karte Ihrer Codebasis mithilfe von Syntaxbäumen, Vektoreinbettungen und einer codebasierten Suche. Auf die Frage "Wo befindet sich die Logik für die E-Mail-Validierung?" gibt Cursor <code translate="no">isValidEmailFormat()</code> zurück - nicht, weil der Name übereinstimmt, sondern weil es versteht, was dieser Code <em>tut</em>.</p>
<p>Cursor ist zwar leistungsstark, aber nicht für jeden geeignet. <strong><em>Cursor ist ein Closed-Source-Programm, das in der Cloud gehostet wird und auf einem Abonnement basiert.</em></strong> Damit ist es für Teams, die mit sensiblem Code arbeiten, sicherheitsbewusste Organisationen, unabhängige Entwickler, Studenten und alle, die offene Systeme bevorzugen, unerreichbar.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">Was wäre, wenn Sie Ihren eigenen Cursor erstellen könnten?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Kerntechnologie hinter Cursor ist nicht proprietär. Sie baut auf bewährten Open-Source-Grundlagen auf: Vektordatenbanken wie <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">Einbettungsmodelle</a>, Syntax-Parser mit Tree-sitter - alles verfügbar für jeden, der bereit ist, die Punkte zu verbinden.</p>
<p><em>Also haben wir gefragt:</em> <strong><em>Was wäre, wenn jeder seinen eigenen Cursor bauen könnte?</em></strong> Läuft auf Ihrer Infrastruktur. Keine Abonnementgebühren. Vollständig anpassbar. Vollständige Kontrolle über Ihren Code und Ihre Daten.</p>
<p>Deshalb haben wir <a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a>entwickelt <a href="https://github.com/zilliztech/code-context"><strong>- ein</strong></a>quelloffenes, MCP-kompatibles Plugin, das eine leistungsstarke semantische Codesuche in jeden AI Coding Agent bringt, wie Claude Code und Gemini CLI, IDEs wie VSCode und sogar Umgebungen wie Google Chrome. Es gibt Ihnen auch die Möglichkeit, Ihren eigenen Coding Agent wie Cursor von Grund auf neu zu entwickeln, um eine intelligente Echtzeit-Navigation in Ihrer Codebasis zu ermöglichen.</p>
<p><strong><em>Keine Abonnements. Keine Blackboxen. Nur Code-Intelligenz - zu Ihren Bedingungen.</em></strong></p>
<p>Im weiteren Verlauf dieses Beitrags erfahren Sie, wie Code Context funktioniert und wie Sie es noch heute nutzen können.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context: Open-Source-Alternative zu Cursors Intelligenz<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> ist eine quelloffene, MCP-kompatible semantische Code-Suchmaschine. Ganz gleich, ob Sie einen benutzerdefinierten KI-Codierassistenten von Grund auf neu entwickeln oder KI-Codieragenten wie Claude Code und Gemini CLI mit semantischem Bewusstsein ausstatten möchten, Code Context ist die Engine, die dies möglich macht.</p>
<p>Sie wird lokal ausgeführt, lässt sich in Ihre bevorzugten Tools und Umgebungen wie VS Code und Chrome-Browser integrieren und bietet ein solides Codeverständnis, ohne auf Cloud-basierte, quelloffene Plattformen angewiesen zu sein.</p>
<p><strong>Zu den Kernfunktionen gehören:</strong></p>
<ul>
<li><p><strong>Semantische Codesuche über natürliche Sprache:</strong> Finden Sie Code mit einfachem Englisch. Suchen Sie nach Begriffen wie "Überprüfung der Benutzeranmeldung" oder "Logik für die Zahlungsabwicklung", und Code Context findet die relevanten Funktionen - auch wenn sie nicht genau mit den Schlüsselwörtern übereinstimmen.</p></li>
<li><p><strong>Mehrsprachige Unterstützung:</strong> Suchen Sie nahtlos in mehr als 15 Programmiersprachen, darunter JavaScript, Python, Java und Go, mit einem konsistenten semantischen Verständnis für alle Sprachen.</p></li>
<li><p><strong>AST-basiertes Code Chunking:</strong> Der Code wird mithilfe von AST-Parsing automatisch in logische Einheiten wie Funktionen und Klassen aufgeteilt, um sicherzustellen, dass die Suchergebnisse vollständig und aussagekräftig sind und nie mitten in einer Funktion unterbrochen werden.</p></li>
<li><p><strong>Live, inkrementelle Indizierung:</strong> Codeänderungen werden in Echtzeit indiziert. Wenn Sie Dateien bearbeiten, bleibt der Suchindex auf dem neuesten Stand - manuelle Aktualisierungen oder Neuindizierungen sind nicht erforderlich.</p></li>
<li><p><strong>Vollständig lokale, sichere Bereitstellung:</strong> Führen Sie alles in Ihrer eigenen Infrastruktur aus. Code Context unterstützt lokale Modelle über Ollama und die Indizierung über <a href="https://milvus.io/">Milvus</a>, sodass Ihr Code Ihre Umgebung nie verlässt.</p></li>
<li><p><strong>Erstklassige IDE-Integration:</strong> Mit der VSCode-Erweiterung können Sie direkt von Ihrem Editor aus suchen und sofort zu den Ergebnissen springen, ohne den Kontext wechseln zu müssen.</p></li>
<li><p><strong>Unterstützung des MCP-Protokolls:</strong> Code Context spricht MCP, was die Integration mit KI-Codierassistenten erleichtert und die semantische Suche direkt in deren Arbeitsabläufe integriert.</p></li>
<li><p><strong>Browser-Plugin-Unterstützung:</strong> Durchsuchen Sie Repositories direkt von GitHub in Ihrem Browser - keine Tabs, kein Kopieren und Einfügen, sondern sofortiger Kontext, egal wo Sie gerade arbeiten.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Wie Code Context funktioniert</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context verwendet eine modulare Architektur mit einem Kern-Orchestrator und spezialisierten Komponenten zum Einbetten, Parsen, Speichern und Abrufen.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">Das Kernmodul: Code Context-Kern</h3><p>Das Herzstück von Code Context ist der <strong>Code Context Core</strong>, der das Parsen, Einbetten, Speichern und semantische Abrufen von Code koordiniert:</p>
<ul>
<li><p><strong>Das Textverarbeitungsmodul</strong> zerlegt und parst den Code mit Hilfe von Tree-sitter für eine sprachbewusste AST-Analyse.</p></li>
<li><p><strong>Die Einbettungsschnittstelle</strong> unterstützt steckbare Backends - derzeit OpenAI und VoyageAI - und konvertiert Code-Blöcke in Vektoreinbettungen, die ihre semantische Bedeutung und kontextuellen Beziehungen erfassen.</p></li>
<li><p><strong>Das Vector Database Interface</strong> speichert diese Einbettungen in einer selbst gehosteten <a href="https://milvus.io/">Milvus-Instanz</a> (standardmäßig) oder in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, der verwalteten Version von Milvus.</p></li>
</ul>
<p>All dies wird mit Ihrem Dateisystem auf einer geplanten Basis synchronisiert, um sicherzustellen, dass der Index auf dem neuesten Stand bleibt, ohne dass manuelle Eingriffe erforderlich sind.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Erweiterungsmodule auf dem Code Context Core</h3><ul>
<li><p><strong>VSCode-Erweiterung</strong>: Nahtlose IDE-Integration für schnelle semantische Suche im Editor und Sprung zur Definition.</p></li>
<li><p><strong>Chrome-Erweiterung</strong>: Semantische Inline-Codesuche beim Durchsuchen von GitHub-Repositories - kein Wechsel der Tabs erforderlich.</p></li>
<li><p><strong>MCP-Server</strong>: Stellt Code Context über das MCP-Protokoll beliebigen KI-Codierassistenten zur Verfügung und ermöglicht so kontextbezogene Unterstützung in Echtzeit.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Erste Schritte mit Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context kann in bereits verwendete Codierungstools integriert werden, oder Sie können einen eigenen KI-Codierungsassistenten von Grund auf neu erstellen. In diesem Abschnitt werden wir beide Szenarien durchgehen:</p>
<ul>
<li><p>Integration von Code Context in vorhandene Tools</p></li>
<li><p>Wie Sie das Kernmodul für die eigenständige semantische Codesuche einrichten, wenn Sie Ihren eigenen KI-Codierassistenten erstellen</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCP-Integration</h3><p>Code Context unterstützt das <strong>Model Context Protocol (MCP)</strong>, so dass KI-Codieragenten wie Claude Code es als semantisches Backend nutzen können.</p>
<p>Zur Integration mit Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Einmal konfiguriert, ruft Claude Code Context bei Bedarf automatisch für die semantische Codesuche auf.</p>
<p>Für die Integration mit anderen Tools oder Umgebungen finden Sie in unserem<a href="https://github.com/zilliztech/code-context"> GitHub Repo</a> weitere Beispiele und Adapter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Erstellen Sie Ihren eigenen KI-Codierassistenten mit Code Context</h3><p>Um einen eigenen KI-Assistenten mit Code Context zu erstellen, müssen Sie das Kernmodul für die semantische Codesuche in nur drei Schritten einrichten:</p>
<ol>
<li><p>Konfigurieren Sie Ihr Einbettungsmodell</p></li>
<li><p>Verbinden Sie sich mit Ihrer Vektordatenbank</p></li>
<li><p>Indizieren Sie Ihr Projekt und beginnen Sie mit der Suche</p></li>
</ol>
<p>Hier ist ein Beispiel, das <strong>OpenAI Embeddings</strong> und die <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>Vektordatenbank</strong> als Vektor-Backend verwendet:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCode-Erweiterung</h3><p>Code Context ist als VSCode-Erweiterung namens <strong>"Semantic Code Search"</strong> verfügbar, die eine intelligente, auf natürlicher Sprache basierende Codesuche direkt in Ihren Editor bringt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Einmal installiert:</p>
<ul>
<li><p>Konfigurieren Sie Ihren API-Schlüssel</p></li>
<li><p>Indizieren Sie Ihr Projekt</p></li>
<li><p>Verwenden Sie einfache englische Abfragen (keine exakte Übereinstimmung erforderlich)</p></li>
<li><p>Sofortiger Sprung zu den Ergebnissen mit Click-to-Navigate</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dies macht die semantische Exploration zu einem nativen Teil Ihres Programmierworkflows - kein Terminal oder Browser erforderlich.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome-Erweiterung (demnächst verfügbar)</h3><p>Unsere in Kürze erscheinende <strong>Chrome-Erweiterung</strong> bringt Code Context auf GitHub-Webseiten, so dass Sie eine semantische Codesuche direkt in jedem öffentlichen Repository durchführen können - ohne Kontextwechsel oder Tabs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>So können Sie unbekannte Codebases mit denselben tiefgehenden Suchfunktionen erkunden, die Sie auch lokal nutzen. Bleiben Sie dran - die Erweiterung befindet sich in der Entwicklung und wird bald verfügbar sein.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Warum Code Context verwenden?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der Grundkonfiguration sind Sie schnell startklar, aber die wahre Stärke von <strong>Code Context</strong> liegt in professionellen, leistungsstarken Entwicklungsumgebungen. Die fortschrittlichen Funktionen sind darauf ausgelegt, ernsthafte Arbeitsabläufe zu unterstützen, von unternehmensweiten Implementierungen bis hin zu benutzerdefinierten AI-Tools.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Private Bereitstellung für Sicherheit auf Unternehmensniveau</h3><p>Code Context unterstützt die vollständige Offline-Bereitstellung mithilfe des lokalen Einbettungsmodells <strong>von Ollama</strong> und <strong>Milvus</strong> als selbst gehostete Vektordatenbank. Dies ermöglicht eine vollständig private Code-Suchpipeline: keine API-Aufrufe, keine Internetübertragung, und keine Daten verlassen jemals Ihre lokale Umgebung.</p>
<p>Diese Architektur ist ideal für Branchen mit strengen Compliance-Anforderungen, wie z. B. Finanzwesen, Behörden und Verteidigung, wo die Vertraulichkeit des Codes nicht verhandelbar ist.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Indexierung in Echtzeit mit intelligenter Dateisynchronisierung</h3><p>Ihren Code-Index auf dem neuesten Stand zu halten, sollte nicht langsam oder manuell sein. Code Context enthält ein <strong>Merkle Tree-basiertes Datei-Überwachungssystem</strong>, das Änderungen sofort erkennt und inkrementelle Aktualisierungen in Echtzeit durchführt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_0fd958fe81.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Da nur geänderte Dateien neu indiziert werden, verkürzen sich die Aktualisierungszeiten für große Repositories von Minuten auf Sekunden. So wird sichergestellt, dass der Code, den Sie gerade geschrieben haben, bereits durchsuchbar ist, ohne dass Sie auf "Aktualisieren" klicken müssen.</p>
<p>In schnelllebigen Entwicklungsumgebungen ist diese Art der Unmittelbarkeit entscheidend.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">AST-Parsing, das den Code wie Sie selbst versteht</h3><p>Herkömmliche Tools für die Codesuche teilen den Text nach Zeilen- oder Zeichenzahl auf, wobei oft logische Einheiten unterbrochen werden und verwirrende Ergebnisse zurückgegeben werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context macht es besser. Es nutzt das Tree-sitter AST-Parsing, um die tatsächliche Codestruktur zu verstehen. Es identifiziert vollständige Funktionen, Klassen, Schnittstellen und Module und liefert saubere, semantisch vollständige Ergebnisse.</p>
<p>Es unterstützt die wichtigsten Programmiersprachen, darunter JavaScript/TypeScript, Python, Java, C/C++, Go und Rust, mit sprachspezifischen Strategien für präzises Chunking. Bei nicht unterstützten Sprachen wird auf ein regelbasiertes Parsing zurückgegriffen, um einen reibungslosen Ablauf ohne Abstürze oder leere Ergebnisse zu gewährleisten.</p>
<p>Diese strukturierten Codeeinheiten fließen auch in die Metadaten ein, um eine genauere semantische Suche zu ermöglichen.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Open Source und erweiterbar durch Design</h3><p>Code Context ist vollständig quelloffen und steht unter der MIT-Lizenz. Alle Kernmodule sind auf GitHub öffentlich zugänglich.</p>
<p>Wir sind davon überzeugt, dass eine offene Infrastruktur der Schlüssel zum Aufbau leistungsfähiger, vertrauenswürdiger Entwickler-Tools ist, und laden Entwickler ein, sie für neue Modelle, Sprachen oder Anwendungsfälle zu erweitern.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Lösung des Kontextfensterproblems für KI-Assistenten</h3><p>Große Sprachmodelle (LLMs) haben eine harte Grenze: ihr Kontextfenster. Dadurch können sie nicht die gesamte Codebasis sehen, was die Genauigkeit von Vervollständigungen, Korrekturen und Vorschlägen verringert.</p>
<p>Code Context hilft, diese Lücke zu schließen. Die semantische Codesuche findet die <em>richtigen</em> Codeteile und liefert Ihrem KI-Assistenten einen gezielten, relevanten Kontext, auf den er sich stützen kann. Es verbessert die Qualität der von der KI erzeugten Ergebnisse, indem es das Modell auf die wirklich wichtigen Dinge "einzoomen" lässt.</p>
<p>Beliebte KI-Coding-Tools wie Claude Code und Gemini CLI verfügen nicht über eine native semantische Codesuche - sie verlassen sich auf oberflächliche, schlagwortbasierte Heuristiken. Durch die Integration von Code Context über <strong>MCP</strong> erhalten sie ein Brain-Upgrade.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Für Entwickler, von Entwicklern entwickelt</h3><p>Code Context ist für die modulare Wiederverwendung verpackt: Jede Komponente ist als unabhängiges <strong>npm-Paket</strong> verfügbar. Sie können sie je nach Bedarf für Ihr Projekt mischen, anpassen und erweitern.</p>
<ul>
<li><p>Sie benötigen nur eine semantische Codesuche? Verwenden Sie<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Möchten Sie einen KI-Agenten einbinden? Fügen Sie  hinzu. <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Bauen Sie Ihr eigenes IDE/Browser-Tool? Forken Sie unsere VSCode- und Chrome-Erweiterungsbeispiele</p></li>
</ul>
<p>Einige Anwendungsbeispiele für Code-Kontext:</p>
<ul>
<li><p><strong>Kontextabhängige Autovervollständigungs-Plugins</strong>, die relevante Snippets für bessere LLM-Vervollständigungen ziehen</p></li>
<li><p><strong>Intelligente Fehlerdetektoren</strong>, die umgebenden Code sammeln, um Korrekturvorschläge zu verbessern</p></li>
<li><p><strong>Sichere Code-Refactoring-Tools</strong>, die automatisch semantisch verwandte Stellen finden</p></li>
<li><p><strong>Architekturvisualisierer</strong>, die Diagramme aus semantischen Code-Beziehungen erstellen</p></li>
<li><p><strong>Intelligentere Code-Review-Assistenten</strong>, die bei PR-Reviews historische Implementierungen aufzeigen</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Willkommen in unserer Community<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> ist mehr als nur ein Tool - es ist eine Plattform, die erforscht, wie <strong>KI und Vektordatenbanken</strong> zusammenarbeiten können, um Code wirklich zu verstehen. Wir glauben, dass die semantische Codesuche eine grundlegende Fähigkeit sein wird, wenn KI-gestützte Entwicklung zur Norm wird.</p>
<p>Wir freuen uns über Beiträge aller Art:</p>
<ul>
<li><p>Unterstützung für neue Sprachen</p></li>
<li><p>Neue Einbettungsmodell-Backends</p></li>
<li><p>Innovative KI-unterstützte Arbeitsabläufe</p></li>
<li><p>Feedback, Fehlerberichte und Design-Ideen</p></li>
</ul>
<p>Finden Sie uns hier:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context auf GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm-Paket</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode-Marktplatz</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Gemeinsam können wir die Infrastruktur für die nächste Generation von KI-Entwicklungstools aufbauen - transparent, leistungsstark und entwicklerorientiert.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
