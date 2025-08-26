---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Warum ich gegen den Grep-Only-Abruf von Claude Code bin? Es verbrennt einfach
  zu viele Token
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Erfahren Sie, wie die vektorbasierte Codeabfrage den Verbrauch von Claude
  Code-Token um 40 % reduziert. Open-Source-Lösung mit einfacher
  MCP-Integration. Testen Sie claude-context noch heute.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>KI-Codierassistenten sind auf dem Vormarsch. In nur zwei Jahren haben sich Tools wie Cursor, Claude Code, Gemini CLI und Qwen Code von Kuriositäten zu alltäglichen Begleitern für Millionen von Entwicklern entwickelt. Doch hinter diesem rasanten Aufstieg verbirgt sich ein Streit über etwas täuschend Einfaches: <strong>Wie sollte ein KI-Codierassistent eigentlich Ihre Codebasis nach Kontext durchsuchen?</strong></p>
<p>Zurzeit gibt es zwei Ansätze:</p>
<ul>
<li><p><strong>Vektorsuche mit RAG</strong> (semantisches Retrieval).</p></li>
<li><p><strong>Schlüsselwortsuche mit grep</strong> (literal string matching).</p></li>
</ul>
<p>Claude Code und Gemini haben sich für Letzteres entschieden. Tatsächlich gab ein Claude-Ingenieur auf Hacker News offen zu, dass Claude Code überhaupt kein RAG verwendet. Stattdessen wird das Repo einfach Zeile für Zeile durchsucht (was sie "agentic search" nennen) - keine Semantik, keine Struktur, nur roher String-Matching.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Diese Offenbarung hat die Gemeinschaft gespalten:</p>
<ul>
<li><p><strong>Die Befürworter</strong> verteidigen die Einfachheit von grep. Es ist schnell, genau und - was am wichtigsten ist - vorhersehbar. Beim Programmieren, so argumentieren sie, ist Präzision alles, und die heutigen Einbettungen sind noch zu unscharf, um ihnen zu vertrauen.</p></li>
<li><p><strong>Kritiker</strong> sehen grep als eine Sackgasse. Es ertränkt Sie in irrelevanten Treffern, verbrennt Token und bremst Ihren Arbeitsablauf. Ohne semantisches Verständnis ist es so, als würde man seine KI bitten, mit verbundenen Augen zu debuggen.</p></li>
</ul>
<p>Beide Seiten haben ihre Argumente. Und nachdem ich meine eigene Lösung entwickelt und getestet habe, kann ich Folgendes sagen: Der auf Vektorsuche basierende RAG-Ansatz verändert das Spiel. <strong>Er macht die Suche nicht nur wesentlich schneller und genauer, sondern reduziert auch die Verwendung von Token um 40 % oder mehr. (Überspringen Sie den Teil "Claude Context" für meinen Ansatz)</strong></p>
<p>Warum also ist grep so einschränkend? Und wie kann die Vektorsuche in der Praxis bessere Ergebnisse liefern? Schauen wir uns das mal an.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Was ist falsch an der reinen Grep-Codesuche von Claude Code?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Auf dieses Problem stieß ich bei der Fehlersuche in einem heiklen Fall. Claude Code feuerte Grep-Abfragen über mein Repository ab und lieferte mir riesige Klumpen irrelevanten Textes zurück. Nach einer Minute hatte ich immer noch nicht die relevante Datei gefunden. Fünf Minuten später hatte ich endlich die richtigen 10 Zeilen, aber sie waren unter 500 Zeilen Rauschen begraben worden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das ist kein Einzelfall. Ein Blick auf die GitHub-Probleme von Claude Code zeigt, dass viele frustrierte Entwickler gegen die gleiche Wand rennen:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Frustration der Community lässt sich auf drei Schmerzpunkte reduzieren:</p>
<ol>
<li><p><strong>Aufgeblähte Token.</strong> Jeder grep dump schaufelt riesige Mengen an irrelevantem Code in den LLM, was die Kosten in die Höhe treibt, die mit der Größe des Repos entsetzlich skalieren.</p></li>
<li><p><strong>Zeitsteuer.</strong> Sie müssen warten, während die KI zwanzig Fragen mit Ihrer Codebasis spielt, was den Fokus und den Ablauf stört.</p></li>
<li><p><strong>Kein Kontext.</strong> Grep vergleicht wörtliche Zeichenfolgen. Es hat keinen Sinn für Bedeutung oder Beziehungen, so dass man praktisch blind sucht.</p></li>
</ol>
<p>Deshalb ist diese Debatte so wichtig: Grep ist nicht nur "altmodisch", sondern behindert aktiv die KI-gestützte Programmierung.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Claude Code vs. Cursor: Warum letzterer den besseren Code-Kontext hat<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn es um Code-Kontext geht, hat Cursor die bessere Arbeit geleistet. Vom ersten Tag an hat sich Cursor auf die <strong>Indizierung der Codebasis</strong> gestützt: Zerlegen Sie Ihr Repo in sinnvolle Teile, betten Sie diese Teile in Vektoren ein, und rufen Sie sie semantisch ab, wenn die KI Kontext benötigt. Das ist Retrieval-Augmented Generation (RAG) wie aus dem Lehrbuch, und die Ergebnisse sprechen für sich: engerer Kontext, weniger verschwendete Token und schnelleres Auffinden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code hingegen hat sich der Einfachheit verschrieben. Keine Indizes, keine Einbettungen - nur Grep. Das bedeutet, dass jede Suche ein buchstabengetreuer Zeichenfolgenabgleich ist, ohne dass Struktur oder Semantik berücksichtigt werden. In der Theorie ist das schnell, aber in der Praxis müssen sich die Entwickler oft durch Heuhaufen von irrelevanten Übereinstimmungen wühlen, bevor sie die eine Nadel finden, die sie wirklich brauchen.</p>
<table>
<thead>
<tr><th></th><th><strong>Claude Code</strong></th><th><strong>Cursor</strong></th></tr>
</thead>
<tbody>
<tr><td>Suchgenauigkeit</td><td>Findet nur exakte Übereinstimmungen - alles, was anders heißt, wird übersehen.</td><td>Findet semantisch relevanten Code, auch wenn die Schlüsselwörter nicht genau übereinstimmen.</td></tr>
<tr><td>Effizienz</td><td>Grep speist riesige Codeblöcke in das Modell ein, was die Token-Kosten in die Höhe treibt.</td><td>Kleinere Chunks mit höherem Signalgehalt reduzieren die Tokenlast um 30-40 %.</td></tr>
<tr><td>Skalierbarkeit</td><td>Das Repo wird jedes Mal neu gegreppt, was sich bei wachsenden Projekten verlangsamt.</td><td>Einmalige Indizierung, dann Abrufe in großem Umfang mit minimaler Verzögerung.</td></tr>
<tr><td>Philosophie</td><td>Minimalistisch bleiben - keine zusätzliche Infrastruktur.</td><td>Alles indizieren, intelligent abrufen.</td></tr>
</tbody>
</table>
<p>Warum also ist Claude (oder Gemini oder Cline) nicht dem Beispiel von Cursor gefolgt? Die Gründe sind zum Teil technischer und zum Teil kultureller Natur. <strong>Das Abrufen von Vektoren ist nicht trivial - man muss Chunking, inkrementelle Aktualisierungen und groß angelegte Indizierungen lösen.</strong> Aber was noch wichtiger ist: Claude Code ist auf Minimalismus ausgelegt: keine Server, keine Indizes, nur eine saubere CLI. Einbettungen und Vektor-DBs passen nicht in diese Designphilosophie.</p>
<p>Diese Einfachheit ist reizvoll - aber sie begrenzt auch die Möglichkeiten, die Claude Code bieten kann. Die Bereitschaft von Cursor, in eine echte Indexierungsinfrastruktur zu investieren, ist der Grund, warum es sich heute leistungsfähiger anfühlt.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: ein Open-Source-Projekt zur Erweiterung von Claude Code um eine semantische Codesuche<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code ist ein starkes Werkzeug, aber es hat einen schlechten Code-Kontext. Cursor löste dieses Problem mit der Codebase-Indizierung, aber Cursor ist Closed-Source, an Abonnements gebunden und für Einzelpersonen oder kleine Teams sehr teuer.</p>
<p>Diese Lücke ist der Grund, warum wir unsere eigene Open-Source-Lösung entwickelt haben: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> ist ein quelloffenes MCP-Plugin, das die <strong>semantische Codesuche</strong> in Claude Code (und jeden anderen KI-Codieragenten, der MCP spricht) integriert. Anstatt Ihr Repo mit Grep zu durchsuchen, integriert es Vektordatenbanken mit Einbettungsmodellen, um LLMs <em>tiefen, gezielten Kontext</em> aus Ihrer gesamten Codebasis zu geben. Das Ergebnis: eine schärfere Suche, weniger Token-Verschwendung und eine weitaus bessere Erfahrung für Entwickler.</p>
<p>Hier sehen Sie, wie wir es entwickelt haben:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Verwendete Technologien</h3><p><strong>🔌 Schnittstellenschicht: MCP als universeller Konnektor</strong></p>
<p>Wir wollten, dass dies überall funktioniert - nicht nur in Claude. MCP (Model Context Protocol) funktioniert wie der USB-Standard für LLMs und ermöglicht die nahtlose Anbindung externer Tools. Da Claude Context als MCP-Server verpackt ist, funktioniert es nicht nur mit Claude Code, sondern auch mit Gemini CLI, Qwen Code, Cline und sogar Cursor.</p>
<p><strong>🗄️ Vektor-Datenbank: Zilliz Cloud</strong></p>
<p>Als Backbone haben wir uns für <a href="https://zilliz.com/cloud">Zilliz Cloud</a> entschieden (ein vollständig verwalteter Dienst, der auf <a href="https://milvus.io/">Milvus</a> aufbaut). Er ist hochleistungsfähig, Cloud-nativ, elastisch und für KI-Workloads wie Codebase-Indizierung konzipiert. Das bedeutet Abruf mit geringer Latenz, nahezu unbegrenzte Skalierbarkeit und grundsolide Zuverlässigkeit.</p>
<p><strong>🧩 Einbettungsmodelle: Flexibel durch DesignUnterschiedliche</strong>Teams haben unterschiedliche Anforderungen, daher unterstützt Claude Context von Haus aus mehrere Einbettungsanbieter:</p>
<ul>
<li><p><strong>OpenAI-Einbettungen</strong> für Stabilität und breite Akzeptanz.</p></li>
<li><p><strong>Voyage-Einbettungen</strong> für code-spezifische Leistung.</p></li>
<li><p><strong>Ollama</strong> für lokale Einsätze, bei denen der Datenschutz im Vordergrund steht.</p></li>
</ul>
<p>Weitere Modelle können je nach den sich entwickelnden Anforderungen hinzugefügt werden.</p>
<p><strong>💻 Wahl der Sprache: TypeScript</strong></p>
<p>Wir haben über Python gegen TypeScript debattiert. TypeScript hat gewonnen - nicht nur wegen der Kompatibilität auf Anwendungsebene (VSCode-Plugins, Webtools), sondern auch, weil Claude Code und Gemini CLI selbst auf TypeScript basieren. Das macht die Integration nahtlos und hält das Ökosystem kohärent.</p>
<h3 id="System-Architecture" class="common-anchor-header">Systemarchitektur</h3><p>Claude Context folgt einem sauberen, mehrschichtigen Design:</p>
<ul>
<li><p>Die<strong>Kernmodule</strong> übernehmen die Hauptarbeit: Code-Parsing, Chunking, Indizierung, Abruf und Synchronisierung.</p></li>
<li><p>Die<strong>Benutzeroberfläche</strong> kümmert sich um die Integration von MCP-Servern, VSCode-Plugins oder anderen Adaptern.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Durch diese Trennung bleibt die Kern-Engine in verschiedenen Umgebungen wiederverwendbar, während die Integrationen schnell weiterentwickelt werden können, wenn neue KI-Codierassistenten auftauchen.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Implementierung der Kernmodule</h3><p>Die Kernmodule bilden die Grundlage des gesamten Systems. Sie abstrahieren Vektordatenbanken, Einbettungsmodelle und andere Komponenten in zusammensetzbare Module, die ein Context-Objekt erstellen und verschiedene Vektordatenbanken und Einbettungsmodelle für unterschiedliche Szenarien ermöglichen.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Lösung der wichtigsten technischen Herausforderungen<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Entwicklung von Claude Context ging es nicht nur darum, Einbettungen und eine Vektordatenbank miteinander zu verbinden. Die eigentliche Arbeit bestand darin, die schwierigen Probleme zu lösen, die für die Indexierung von Code in großem Maßstab entscheidend sind. Im Folgenden erfahren Sie, wie wir die drei größten Herausforderungen angegangen sind:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Herausforderung 1: Intelligentes Code Chunking</h3><p>Code kann nicht einfach nach Zeilen oder Zeichen aufgeteilt werden. Dies führt zu unübersichtlichen, unvollständigen Fragmenten und entzieht dem Code die Logik, die ihn verständlich macht.</p>
<p>Wir haben dieses Problem mit <strong>zwei sich ergänzenden Strategien</strong> gelöst:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">AST-basiertes Chunking (primäre Strategie)</h4><p>Dies ist der Standardansatz, bei dem Tree-Sitter-Parser verwendet werden, um die Syntaxstruktur des Codes zu verstehen und entlang semantischer Grenzen aufzuteilen: Funktionen, Klassen, Methoden. Dies liefert:</p>
<ul>
<li><p><strong>Syntaktische Vollständigkeit</strong> - keine abgehackten Funktionen oder gebrochenen Deklarationen.</p></li>
<li><p><strong>Logische Kohärenz</strong> - verwandte Logik bleibt zusammen, um eine bessere semantische Auffindbarkeit zu gewährleisten.</p></li>
<li><p><strong>Unterstützung mehrerer Sprachen</strong> - funktioniert in JS, Python, Java, Go und anderen Sprachen über Tree-Sitter-Grammatiken.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChain-Textaufteilung (Fallback-Strategie)</h4><p>Für Sprachen, die AST nicht parsen kann oder wenn das Parsen fehlschlägt, bietet LangChain's <code translate="no">RecursiveCharacterTextSplitter</code> ein zuverlässiges Backup.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>Es ist weniger "intelligent" als AST, aber sehr zuverlässig und stellt sicher, dass die Entwickler nicht auf verlorenem Posten stehen. Zusammen bieten diese beiden Strategien ein Gleichgewicht zwischen semantischem Reichtum und universeller Anwendbarkeit.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Herausforderung 2: Effizienter Umgang mit Codeänderungen</h3><p>Die Verwaltung von Codeänderungen stellt eine der größten Herausforderungen bei Code-Indizierungssystemen dar. Die Neuindizierung ganzer Projekte für geringfügige Dateiänderungen wäre völlig unpraktisch.</p>
<p>Um dieses Problem zu lösen, haben wir den Merkle-Baum-basierten Synchronisationsmechanismus entwickelt.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Merkle-Bäume: Die Grundlage der Änderungserkennung</h4><p>Merkle-Bäume schaffen ein hierarchisches "Fingerabdruck"-System, in dem jede Datei ihren eigenen Hash-Fingerabdruck hat, Ordner haben Fingerabdrücke, die auf ihrem Inhalt basieren, und alles gipfelt in einem einzigartigen Fingerabdruck des Wurzelknotens für die gesamte Codebasis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn sich der Inhalt einer Datei ändert, wandern die Hash-Fingerabdrücke kaskadenförmig durch die einzelnen Ebenen bis zum Stammknoten nach oben. Dies ermöglicht eine schnelle Erkennung von Änderungen durch den Vergleich von Hash-Fingerabdrücken Schicht für Schicht von der Wurzel abwärts, wodurch Dateiveränderungen schnell identifiziert und lokalisiert werden können, ohne das gesamte Projekt neu zu indizieren.</p>
<p>Das System führt alle 5 Minuten eine Handshake-Synchronisationsprüfung durch, die in einem optimierten Drei-Phasen-Prozess abläuft:</p>
<p><strong>Phase 1: Die blitzschnelle Erkennung</strong> berechnet den Merkle-Root-Hash der gesamten Codebase und vergleicht ihn mit dem vorherigen Snapshot. Identische Root-Hashes bedeuten, dass keine Änderungen stattgefunden haben - das System überspringt die gesamte Verarbeitung in Millisekunden.</p>
<p><strong>Phase 2: Präziser Vergleich</strong> löst aus, wenn Root-Hashes voneinander abweichen, und führt eine detaillierte Analyse auf Dateiebene durch, um genau festzustellen, welche Dateien hinzugefügt, gelöscht oder geändert wurden.</p>
<p><strong>Phase 3: Inkrementelle Updates</strong> berechnet die Vektoren nur für geänderte Dateien neu und aktualisiert die Vektordatenbank entsprechend, um die Effizienz zu maximieren.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Lokale Snapshot-Verwaltung</h4><p>Der gesamte Synchronisationsstatus bleibt lokal im <code translate="no">~/.context/merkle/</code> Verzeichnis des Benutzers erhalten. Jede Codebasis unterhält ihre eigene, unabhängige Snapshot-Datei, die Datei-Hashtabellen und serialisierte Merkle-Baumdaten enthält, um eine genaue Wiederherstellung des Zustands auch nach einem Programmneustart zu gewährleisten.</p>
<p>Die Vorteile dieses Konzepts liegen auf der Hand: Die meisten Prüfungen werden innerhalb von Millisekunden abgeschlossen, wenn keine Änderungen vorliegen, nur wirklich geänderte Dateien lösen eine erneute Verarbeitung aus (wodurch eine massive Rechenverschwendung vermieden wird), und die Wiederherstellung des Zustands funktioniert in allen Programmsitzungen einwandfrei.</p>
<p>Aus Sicht des Benutzers löst die Änderung einer einzelnen Funktion die Neuindizierung nur für diese Datei und nicht für das gesamte Projekt aus, was die Entwicklungseffizienz erheblich verbessert.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Herausforderung 3: Gestaltung der MCP-Schnittstelle</h3><p>Selbst die intelligenteste Indizierungsmaschine ist ohne eine saubere Benutzeroberfläche für Entwickler nutzlos. MCP war die offensichtliche Wahl, aber sie brachte einzigartige Herausforderungen mit sich:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Tool Design: Keep It Simple</strong></h4><p>Das MCP-Modul dient als Benutzerschnittstelle, so dass die Benutzerfreundlichkeit oberste Priorität hat.</p>
<p>Das Werkzeugdesign beginnt mit der Abstrahierung der standardmäßigen Indizierung von Codebasen und Suchvorgängen in zwei Kernwerkzeuge: <code translate="no">index_codebase</code> für die Indizierung von Codebasen und <code translate="no">search_code</code> für die Codesuche.</p>
<p>Dies wirft eine wichtige Frage auf: Welche zusätzlichen Werkzeuge sind notwendig?</p>
<p>Die Anzahl der Tools erfordert eine sorgfältige Abwägung - zu viele Tools verursachen einen kognitiven Overhead und verwirren die Auswahl der LLM-Tools, während bei zu wenigen wesentliche Funktionen fehlen könnten.</p>
<p>Bei der Beantwortung dieser Frage ist es hilfreich, sich an realen Anwendungsfällen zu orientieren.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Bewältigung von Herausforderungen bei der Hintergrundverarbeitung</h4><p>Die Indizierung großer Codebasen kann erhebliche Zeit in Anspruch nehmen. Der naive Ansatz, synchron auf die Fertigstellung zu warten, zwingt die Benutzer dazu, mehrere Minuten zu warten, was einfach inakzeptabel ist. Eine asynchrone Hintergrundverarbeitung ist unumgänglich, aber MCP unterstützt dieses Muster nicht von Haus aus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Unser MCP-Server führt einen Hintergrundprozess innerhalb des MCP-Servers aus, der die Indizierung durchführt und gleichzeitig sofort Startmeldungen an die Benutzer zurückgibt, damit diese weiterarbeiten können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Daraus ergibt sich eine neue Herausforderung: Wie können die Benutzer den Fortschritt der Indizierung verfolgen?</p>
<p>Ein spezielles Tool zur Abfrage des Indizierungsfortschritts oder -status löst dieses Problem auf elegante Weise. Der Indizierungsprozess im Hintergrund speichert die Fortschrittsinformationen asynchron, so dass die Benutzer jederzeit den Prozentsatz der Fertigstellung, den Erfolgsstatus oder die Fehlerbedingungen überprüfen können. Darüber hinaus gibt es ein Tool zum manuellen Löschen von Indizes, wenn Benutzer ungenaue Indizes zurücksetzen oder den Indizierungsprozess neu starten müssen.</p>
<p><strong>Endgültiger Entwurf des Tools:</strong></p>
<p><code translate="no">index_codebase</code> - Indexcodebasis<code translate="no">search_code</code> - Suchcode<code translate="no">get_indexing_status</code> - Indexierungsstatus abfragen<code translate="no">clear_index</code> - Index löschen</p>
<p>Vier Tools, die das perfekte Gleichgewicht zwischen Einfachheit und Funktionalität herstellen.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Verwaltung von Umgebungsvariablen</h4><p>Die Verwaltung von Umgebungsvariablen wird oft übersehen, obwohl sie die Benutzerfreundlichkeit erheblich beeinträchtigt. Die Notwendigkeit einer separaten API-Schlüsselkonfiguration für jeden MCP-Client würde die Benutzer dazu zwingen, die Anmeldeinformationen beim Wechsel zwischen Claude Code und Gemini CLI mehrfach zu konfigurieren.</p>
<p>Ein globaler Konfigurationsansatz beseitigt diese Reibung, indem eine <code translate="no">~/.context/.env</code> Datei im Home-Verzeichnis des Benutzers erstellt wird:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dieser Ansatz bietet eindeutige Vorteile:</strong> Benutzer konfigurieren einmal und verwenden sie überall auf allen MCP-Clients, alle Konfigurationen werden an einem einzigen Ort zentralisiert, um die Wartung zu erleichtern, und sensible API-Schlüssel werden nicht über mehrere Konfigurationsdateien verstreut.</p>
<p>Wir implementieren außerdem eine dreistufige Prioritätshierarchie: Prozessumgebungsvariablen haben höchste Priorität, globale Konfigurationsdateien haben mittlere Priorität, und Standardwerte dienen als Fallback.</p>
<p>Dieses Design bietet eine enorme Flexibilität: Entwickler können Umgebungsvariablen für temporäre Testüberschreibungen verwenden, Produktionsumgebungen können sensible Konfigurationen über Systemumgebungsvariablen einspeisen, um die Sicherheit zu erhöhen, und Benutzer konfigurieren einmal, um nahtlos mit Claude Code, Gemini CLI und anderen Tools zu arbeiten.</p>
<p>An diesem Punkt ist die Kernarchitektur des MCP-Servers vollständig und reicht von Code-Parsing und Vektorspeicherung bis hin zu intelligentem Abruf und Konfigurationsmanagement. Jede Komponente wurde sorgfältig entworfen und optimiert, um ein System zu schaffen, das sowohl leistungsstark als auch benutzerfreundlich ist.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Praktische Tests<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie schlägt sich Claude Context nun in der Praxis? Ich habe es mit genau demselben Szenario getestet, das mich anfangs frustriert hat.</p>
<p>Die Installation war nur ein einziger Befehl vor dem Start von Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sobald meine Codebasis indiziert war, gab ich Claude Code dieselbe Fehlerbeschreibung, die es zuvor auf eine <strong>fünfminütige Grep-gestützte Gänsejagd</strong> geschickt hatte. Dieses Mal <strong>fand</strong> es durch <code translate="no">claude-context</code> MCP-Aufrufe <strong>sofort die genaue Datei- und Zeilennummer</strong>, zusammen mit einer Erklärung des Problems.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der Unterschied war nicht subtil - es war wie Tag und Nacht.</p>
<p>Und es ging nicht nur um die Fehlersuche. Mit der Integration von Claude Context lieferte Claude Code durchgängig qualitativ hochwertigere Ergebnisse:</p>
<ul>
<li><p><strong>Fehlerbehebung</strong></p></li>
<li><p><strong>Code-Refactoring</strong></p></li>
<li><p><strong>Erkennung von doppeltem Code</strong></p></li>
<li><p><strong>Umfassende Tests</strong></p></li>
</ul>
<p>Die Leistungssteigerung zeigt sich auch in den Zahlen. In einem Side-by-Side-Test:</p>
<ul>
<li><p>Der Token-Verbrauch sank um über 40 %, ohne dass es zu Einbußen bei der Wiedererkennung kam.</p></li>
<li><p>Das schlägt sich direkt in niedrigeren API-Kosten und schnelleren Antworten nieder.</p></li>
<li><p>Alternativ lieferte Claude Context mit demselben Budget weitaus genauere Abrufe.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir haben Claude Context auf GitHub als Open Source zur Verfügung gestellt, und es hat bereits 2,6K+ Sterne erhalten. Vielen Dank für eure Unterstützung und Likes.</p>
<p>Sie können es selbst ausprobieren:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Detaillierte Benchmarks und die Testmethodik sind im Repo verfügbar - wir würden uns über Ihr Feedback freuen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Blick nach vorn<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Was als Frustration mit grep in Claude Code begann, hat sich zu einer soliden Lösung entwickelt: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context - ein</strong></a>quelloffenes MCP-Plugin, das die semantische, vektorgestützte Suche in Claude Code und andere Programmierassistenten integriert. Die Botschaft ist einfach: Entwickler müssen sich nicht mit ineffizienten KI-Werkzeugen zufrieden geben. Mit RAG und Vektorsuche können Sie schneller debuggen, die Token-Kosten um 40 % senken und endlich eine KI-Unterstützung erhalten, die Ihre Codebasis wirklich versteht.</p>
<p>Und das ist nicht auf Claude Code beschränkt. Da Claude Context auf offenen Standards aufbaut, funktioniert derselbe Ansatz nahtlos mit Gemini CLI, Qwen Code, Cursor, Cline und anderen. Sie sind nicht mehr an Kompromisse zwischen Anbietern gebunden, die der Einfachheit den Vorrang vor der Leistung geben.</p>
<p>Wir würden uns freuen, wenn Sie an dieser Zukunft teilhaben könnten:</p>
<ul>
<li><p><strong>Testen</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Sie Claude Context</strong></a><strong>:</strong> es ist Open-Source und völlig kostenlos</p></li>
<li><p><strong>Tragen Sie zu seiner Entwicklung bei</strong></p></li>
<li><p><strong>Oder bauen Sie Ihre eigene Lösung</strong> mit Claude Context</p></li>
</ul>
<p>👉 Teilen Sie Ihr Feedback mit, stellen Sie Fragen oder erhalten Sie Hilfe, indem Sie unserer <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord-Community</strong></a> beitreten.</p>
