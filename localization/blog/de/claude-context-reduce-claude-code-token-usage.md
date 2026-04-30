---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Claude-Kontext: Reduzierung des Claude Code Token Verbrauchs mit
  Milvus-gestütztem Code Retrieval
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Claude Code verbrennt Token bei grep? Sehen Sie, wie Claude Context
  Milvus-gestütztes hybrides Retrieval verwendet, um die Verwendung von Token um
  39,4 % zu reduzieren.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Durch große Kontextfenster fühlen sich KI-Codieragenten grenzenlos, bis sie anfangen, Ihr halbes Repository zu lesen, um eine Frage zu beantworten. Für viele Nutzer von Claude Code ist der teure Teil nicht nur das Modellieren. Es ist die Abrufschleife: Suche nach einem Schlüsselwort, Lesen einer Datei, erneute Suche, Lesen weiterer Dateien und weitere Zahlungen für irrelevanten Kontext.</p>
<p>Claude Context ist ein quelloffener MCP-Server für die Codesuche, der Claude Code und anderen KI-Codieragenten eine bessere Möglichkeit bietet, relevanten Code zu finden. Er indiziert Ihr Repository, speichert durchsuchbare Codebrocken in einer <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> und verwendet <a href="https://zilliz.com/blog/hybrid-search-with-milvus">hybrides Retrieval</a>, damit der Agent den tatsächlich benötigten Code abrufen kann, anstatt die Eingabeaufforderung mit grep-Ergebnissen zu überfluten.</p>
<p>In unseren Benchmarks hat Claude Context den Token-Verbrauch um durchschnittlich 39,4 % und die Tool-Aufrufe um 36,1 % gesenkt, wobei die Abfragequalität erhalten blieb. In diesem Beitrag wird erklärt, warum die grep-artige Suche Kontext verschwendet, wie Claude Context unter der Haube arbeitet und wie es im Vergleich zu einem Basis-Workflow bei echten Debugging-Aufgaben abschneidet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub-Repository hat 10.000 Sterne erreicht</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Warum die grep-artige Codesuche Token in KI-Codieragenten verbrennt<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein KI-Coding-Agent kann nur dann nützlichen Code schreiben, wenn er die Codebasis rund um die Aufgabe versteht: Funktionsaufrufpfade, Namenskonventionen, verwandte Tests, Datenmodelle und historische Implementierungsmuster. Ein großes Kontextfenster ist zwar hilfreich, löst aber nicht das Problem der Wiederauffindung. Wenn die falschen Dateien in den Kontext gelangen, verschwendet das Modell immer noch Token und kann auf irrelevanten Code schließen.</p>
<p>Die Codesuche lässt sich in der Regel in zwei große Muster einteilen:</p>
<table>
<thead>
<tr><th>Abfragemuster</th><th>Wie es funktioniert</th><th>Wo es scheitert</th></tr>
</thead>
<tbody>
<tr><td>Grep-ähnliche Abfrage</td><td>Suche nach wörtlichen Zeichenfolgen, dann Lesen übereinstimmender Dateien oder Zeilenbereiche.</td><td>Verpasst semantisch verwandten Code, liefert verrauschte Treffer und erfordert oft wiederholte Such-/Lesezyklen.</td></tr>
<tr><td>RAG-artiges Abrufen</td><td>Indexierung des Codes im Voraus, dann Abruf relevanter Chunks mit semantischer, lexikalischer oder hybrider Suche.</td><td>Erfordert Chunking, Einbettung, Indizierung und Aktualisierungslogik, die die meisten Codierungstools nicht direkt übernehmen wollen.</td></tr>
</tbody>
</table>
<p>Dies ist derselbe Unterschied, den Entwickler beim Design von <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG-Anwendungen</a> sehen: Der Abgleich von Wörtern ist nützlich, reicht aber selten aus, wenn es auf die Bedeutung ankommt. Eine Funktion mit dem Namen <code translate="no">compute_final_cost()</code> kann für eine Abfrage über <code translate="no">calculate_total_price()</code> relevant sein, auch wenn die genauen Wörter nicht übereinstimmen. An dieser Stelle hilft <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">die semantische Suche</a>.</p>
<p>In einem Debugging-Lauf hat Claude Code wiederholt Dateien durchsucht und gelesen, bevor er den richtigen Bereich gefunden hat. Nach einigen Minuten war nur noch ein kleiner Teil des Codes, den er konsumiert hatte, relevant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>Die grep-ähnliche Suche von Claude Code vergeudet Zeit mit dem Lesen irrelevanter Dateien</span> </span></p>
<p>Dieses Muster ist so verbreitet, dass sich die Entwickler öffentlich darüber beschweren: Der Agent kann intelligent sein, aber die Kontextabrufschleife ist immer noch teuer und ungenau.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Kommentar eines Entwicklers zu Claude Code Kontext und Token-Verwendung</span> </span></p>
<p>Die Abfrage im Grep-Stil scheitert auf drei vorhersehbare Arten:</p>
<ul>
<li><strong>Informationsüberlastung:</strong> Große Repositories produzieren viele wörtliche Übereinstimmungen, von denen die meisten für die aktuelle Aufgabe nicht nützlich sind.</li>
<li><strong>Semantische Blindheit:</strong> Grep sucht nach Zeichenketten, nicht nach Absicht, Verhalten oder entsprechenden Implementierungsmustern.</li>
<li><strong>Kontextverlust:</strong> Übereinstimmungen auf Zeilenebene umfassen nicht automatisch die umgebende Klasse, Abhängigkeiten, Tests oder den Aufrufgraphen.</li>
</ul>
<p>Eine bessere Code-Retrieval-Schicht muss die Präzision von Schlüsselwörtern mit semantischem Verständnis kombinieren und dann genügend vollständige Teile zurückliefern, damit das Modell Rückschlüsse auf den Code ziehen kann.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">Was ist Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context ist ein quelloffener <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol-Server</a> für die Codeabfrage. Er verbindet KI-Codierwerkzeuge mit einem von Milvus unterstützten Code-Index, so dass ein Agent ein Repository nach Bedeutung durchsuchen kann, anstatt sich nur auf die Suche nach wörtlichem Text zu verlassen.</p>
<p>Das Ziel ist einfach: Wenn der Agent nach Kontext fragt, soll er die kleinste nützliche Menge von Code-Blöcken zurückgeben. Claude Context tut dies, indem es die Codebasis parst, Einbettungen generiert, Chunks in der <a href="https://zilliz.com/what-is-milvus">Milvus-Vektordatenbank</a> speichert und den Abruf durch MCP-kompatible Tools ermöglicht.</p>
<table>
<thead>
<tr><th>Grep-Problem</th><th>Claude Context-Ansatz</th></tr>
</thead>
<tbody>
<tr><td>Zu viele irrelevante Übereinstimmungen</td><td>Rangfolge der Codeabschnitte nach Vektorähnlichkeit und Schlüsselwortrelevanz.</td></tr>
<tr><td>Kein semantisches Verständnis</td><td>Verwendung eines <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">Einbettungsmodells</a>, damit verwandte Implementierungen übereinstimmen können, auch wenn sich die Namen unterscheiden.</td></tr>
<tr><td>Fehlender Umgebungskontext</td><td>Geben Sie vollständige Codeabschnitte mit ausreichender Struktur zurück, damit das Modell auf das Verhalten schließen kann.</td></tr>
<tr><td>Wiederholtes Lesen von Dateien</td><td>Durchsuchen Sie zuerst den Index und lesen oder bearbeiten Sie dann nur die Dateien, die von Bedeutung sind.</td></tr>
</tbody>
</table>
<p>Da Claude Context durch MCP offengelegt wird, kann es mit Claude Code, Gemini CLI, MCP-Hosts im Cursor-Stil und anderen MCP-kompatiblen Umgebungen arbeiten. Dieselbe zentrale Abrufschicht kann mehrere Agentenschnittstellen unterstützen.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Wie Claude Context unter der Haube funktioniert<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context besteht aus zwei Hauptschichten: einem wiederverwendbaren Kernmodul und Integrationsmodulen. Der Kern übernimmt Parsing, Chunking, Indexierung, Suche und inkrementelle Synchronisierung. Die obere Schicht stellt diese Fähigkeiten durch MCP- und Editor-Integrationen zur Verfügung.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Architektur von Claude Context mit MCP-Integrationen, Kernmodul, Einbettungsanbieter und Vektordatenbank</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">Wie verbindet MCP Claude Context mit Kodieragenten?</h3><p>MCP bildet die Schnittstelle zwischen dem LLM-Host und externen Tools. Indem Claude Context als MCP-Server dargestellt wird, bleibt die Suchschicht unabhängig von einer IDE oder einem Codierassistenten. Der Agent ruft ein Suchwerkzeug auf; Claude Context verwaltet den Code-Index und gibt relevante Chunks zurück.</p>
<p>Wenn Sie das breitere Muster verstehen wollen, zeigt der <a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvus-Leitfaden</a>, wie MCP KI-Tools mit Vektor-Datenbankoperationen verbinden kann.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Warum Milvus für die Code-Suche verwenden?</h3><p>Die Codesuche erfordert eine schnelle Vektorsuche, eine Filterung der Metadaten und eine ausreichende Skalierung, um große Repositories zu verwalten. Milvus wurde für eine leistungsstarke Vektorsuche entwickelt und kann dichte Vektoren, spärliche Vektoren und Reranking-Workflows unterstützen. Für Teams, die Retrieval-lastige Agentensysteme bauen, zeigen die <a href="https://milvus.io/docs/multi-vector-search.md">Multi-Vektor-Hybrid-Suchdokumente</a> und die <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a> das gleiche zugrunde liegende Retrieval-Muster, das in Produktionssystemen verwendet wird.</p>
<p>Claude Context kann die Zilliz-Cloud als verwaltetes Milvus-Backend nutzen, wodurch die Vektor-Datenbank nicht selbst betrieben und skaliert werden muss. Die gleiche Architektur kann auch für selbstverwaltete Milvus-Implementierungen angepasst werden.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Welche Anbieter von Einbettungen werden von Claude Context unterstützt?</h3><p>Claude Context unterstützt mehrere Einbettungsoptionen:</p>
<table>
<thead>
<tr><th>Anbieter</th><th>Am besten geeignet</th></tr>
</thead>
<tbody>
<tr><td>OpenAI-Einbettungen</td><td>Universell einsetzbare gehostete Einbettungen mit breiter Unterstützung durch das Ökosystem.</td></tr>
<tr><td>Voyage AI-Einbettungen</td><td>Code-orientiertes Retrieval, insbesondere wenn die Suchqualität wichtig ist.</td></tr>
<tr><td>Ollama</td><td>Lokale Einbettungs-Workflows für datenschutzsensible Umgebungen.</td></tr>
</tbody>
</table>
<p>Für verwandte Milvus-Workflows siehe den <a href="https://milvus.io/docs/embeddings.md">Überblick über Milvus-Einbettungen</a>, die <a href="https://milvus.io/docs/embed-with-openai.md">Integration von OpenAI-Einbettungen</a>, die <a href="https://milvus.io/docs/embed-with-voyage.md">Integration von Voyage-Einbettungen</a> und Beispiele für den Einsatz <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">von Ollama mit Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Warum ist die Kernbibliothek in TypeScript geschrieben?</h3><p>Claude Context ist in TypeScript geschrieben, weil viele Coding-Agent-Integrationen, Editor-Plugins und MCP-Hosts bereits TypeScript-lastig sind. Die Beibehaltung des Abrufkerns in TypeScript erleichtert die Integration mit Werkzeugen der Anwendungsschicht und bietet gleichzeitig eine saubere API.</p>
<p>Das Kernmodul abstrahiert die Vektordatenbank und den Einbettungsanbieter in ein zusammensetzbares <code translate="no">Context</code> Objekt:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Wie Claude Context Code chunked und Indizes frisch hält<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Chunking und inkrementelle Aktualisierungen entscheiden darüber, ob ein System zum Auffinden von Code in der Praxis brauchbar ist. Wenn die Chunks zu klein sind, verliert das Modell den Kontext. Sind die Chunks zu groß, liefert das Abfragesystem Rauschen. Wenn die Indizierung zu langsam ist, hören die Entwickler auf, sie zu benutzen.</p>
<p>Claude Context bewältigt dies mit AST-basiertem Chunking, einem Fallback-Text-Splitter und Merkle-Baum-basierter Änderungserkennung.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">Wie bewahrt AST-basiertes Code Chunking den Kontext?</h3><p>AST-Chunking ist die wichtigste Strategie. Anstatt Dateien nach Zeilenzahl oder Zeichenzahl aufzuteilen, analysiert Claude Context die Codestruktur und gliedert sie um semantische Einheiten wie Funktionen, Klassen und Methoden.</p>
<p>Dadurch erhält jeder Chunk drei nützliche Eigenschaften:</p>
<table>
<thead>
<tr><th>Eigenschaft</th><th>Warum das wichtig ist</th></tr>
</thead>
<tbody>
<tr><td>Syntaktische Vollständigkeit</td><td>Funktionen und Klassen sind nicht in der Mitte geteilt.</td></tr>
<tr><td>Logische Kohärenz</td><td>Zusammengehörige Logik bleibt zusammen, so dass die abgerufenen Teile für das Modell leichter zu verwenden sind.</td></tr>
<tr><td>Mehrsprachige Unterstützung</td><td>Verschiedene Tree-Sitter-Parser können JavaScript, Python, Java, Go und andere Sprachen verarbeiten.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>AST-basiertes Code-Chunking unter Beibehaltung vollständiger syntaktischer Einheiten und Chunking-Ergebnisse</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">Was passiert, wenn AST-Parsing fehlschlägt?</h3><p>Bei Sprachen oder Dateien, mit denen das AST-Parsing nicht zurechtkommt, greift Claude Context auf LangChain <code translate="no">RecursiveCharacterTextSplitter</code> zurück. Das ist weniger präzise als AST-Chunking, verhindert aber, dass die Indexierung bei nicht unterstützten Eingaben fehlschlägt.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Wie vermeidet Claude Context die Neuindizierung des gesamten Repositorys?</h3><p>Eine Neuindizierung des gesamten Projektarchivs nach jeder Änderung ist zu teuer. Claude Context verwendet einen Merkle-Baum, um genau zu erkennen, was sich geändert hat.</p>
<p>Ein Merkle-Baum ordnet jeder Datei einen Hash zu, leitet jeden Verzeichnis-Hash von seinen Kindern ab und fasst das gesamte Repository in einem Root-Hash zusammen. Wenn der Wurzel-Hash unverändert ist, kann Claude Context die Indizierung überspringen. Ändert sich die Wurzel, sucht Claude Context im Baum nach den geänderten Dateien und bettet nur diese neu ein.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Erkennung von Änderungen im Merkle-Baum durch Vergleich unveränderter und geänderter Datei-Hashes</span> </span></p>
<p>Die Synchronisierung erfolgt in drei Stufen:</p>
<table>
<thead>
<tr><th>Stufe</th><th>Was geschieht</th><th>Warum es effizient ist</th></tr>
</thead>
<tbody>
<tr><td>Schnelle Überprüfung</td><td>Vergleich der aktuellen Merkle-Wurzel mit dem letzten Snapshot.</td><td>Wenn sich nichts geändert hat, ist die Prüfung schnell abgeschlossen.</td></tr>
<tr><td>Präziser Vergleich</td><td>Durchlaufen Sie den Baum, um hinzugefügte, gelöschte und geänderte Dateien zu identifizieren.</td><td>Nur geänderte Pfade werden weitergeführt.</td></tr>
<tr><td>Inkrementelle Aktualisierung</td><td>Neuberechnung der Einbettungen für geänderte Dateien und Aktualisierung von Milvus.</td><td>Der Vektorindex bleibt frisch, ohne dass ein vollständiger Neuaufbau erforderlich ist.</td></tr>
</tbody>
</table>
<p>Der lokale Sync-Status wird unter <code translate="no">~/.context/merkle/</code> gespeichert, so dass Claude Context die Datei-Hashtabelle und den serialisierten Merkle-Baum nach einem Neustart wiederherstellen kann.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Was passiert, wenn Claude Code Claude Context verwendet?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Setup besteht aus einem einzigen Befehl, bevor Claude Code gestartet wird:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nach der Indizierung des Repositorys kann Claude Code Claude Context aufrufen, wenn er Codebase-Kontext benötigt. In demselben Szenario der Fehlersuche, das zuvor Zeit für Grep und das Lesen von Dateien verschlang, fand Claude Context die genaue Datei- und Zeilennummer mit einer vollständigen Erklärung.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Claude Context Demo, die zeigt, wie Claude Code den relevanten Fehlerort findet</span> </span></p>
<p>Das Tool ist nicht auf die Fehlersuche beschränkt. Es hilft auch beim Refactoring, bei der Erkennung von doppeltem Code, bei der Problemlösung, bei der Testgenerierung und bei allen Aufgaben, bei denen der Agent einen genauen Repository-Kontext benötigt.</p>
<p>Bei gleichem Abruf reduzierte Claude Context in unserem Benchmark den Token-Verbrauch um 39,4 % und die Tool-Aufrufe um 36,1 %. Das ist wichtig, weil Toolaufrufe und irrelevante Dateilesevorgänge oft die Kosten von Coding-Agent-Workflows dominieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Benchmark-Diagramm, das zeigt, wie Claude Context den Token-Verbrauch und die Tool-Aufrufe im Vergleich zur Baseline reduziert</span> </span></p>
<p>Das Projekt hat jetzt mehr als 10.000 GitHub-Sterne, und das Repository enthält die vollständigen Benchmark-Details und Paketlinks.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub-Sternverlauf mit schnellem Wachstum</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Wie schneidet Claude Context im Vergleich zu grep bei echten Fehlern ab?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Benchmark vergleicht die reine Textsuche mit dem Milvus-gestützten Code-Retrieval bei echten Debugging-Aufgaben. Der Unterschied besteht nicht nur in weniger Token. Claude Context verändert den Suchpfad des Agenten: Er beginnt näher an der Implementierung, die geändert werden muss.</p>
<table>
<thead>
<tr><th>Fall</th><th>Grundlegendes Verhalten</th><th>Claude Context-Verhalten</th><th>Token-Reduzierung</th></tr>
</thead>
<tbody>
<tr><td>Django <code translate="no">YearLookup</code> Fehler</td><td>Es wurde nach dem falschen zugehörigen Symbol gesucht und die Registrierungslogik bearbeitet.</td><td>Fand die <code translate="no">YearLookup</code> Optimierungslogik direkt.</td><td>93% weniger Token</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> Fehler</td><td>Lies verstreute Dateien rund um die Erwähnungen von <code translate="no">swap_dims</code>.</td><td>Fand die Implementierung und die zugehörigen Tests direkter.</td><td>62% weniger Token</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Fall 1: Django YearLookup Fehler</h3><p><strong>Beschreibung des Problems:</strong> Im Django Framework bricht die <code translate="no">YearLookup</code> Abfrageoptimierung die <code translate="no">__iso_year</code> Filterung. Bei Verwendung des <code translate="no">__iso_year</code> -Filters wendet die Klasse <code translate="no">YearLookup</code> fälschlicherweise die Standard-BETWEEN-Optimierung an - gültig für Kalenderjahre, aber nicht für Jahre mit ISO-Wochennummerierung.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Grundlinie (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>Die Textsuche konzentrierte sich auf die Registrierung von <code translate="no">ExtractIsoYear</code> statt auf die Optimierungslogik in <code translate="no">YearLookup</code>.</p>
<p><strong>Claude Kontext:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>Die semantische Suche verstand <code translate="no">YearLookup</code> als das Kernkonzept und ging direkt zur richtigen Klasse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Django YearLookup Benchmark-Tabelle zeigt 93 Prozent weniger Token mit Claude Context</span> </span></p>
<p><strong>Ergebnis:</strong> 93 % weniger Token.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Fall 2: Xarray swap_dims Fehler</h3><p><strong>Beschreibung des Problems:</strong> Die Methode <code translate="no">.swap_dims()</code> der Xarray-Bibliothek verändert unerwartet das ursprüngliche Objekt, was die Erwartung der Unveränderlichkeit verletzt.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Grundlinie (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>Die Baseline verbrachte Zeit damit, in Verzeichnissen zu navigieren und nahegelegenen Code zu lesen, bevor der tatsächliche Implementierungspfad gefunden wurde.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>Die semantische Suche fand die relevante <code translate="no">swap_dims()</code> Implementierung und den zugehörigen Kontext schneller.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Xarray swap_dims Benchmark-Tabelle zeigt 62 % weniger Token mit Claude Context</span> </span></p>
<p><strong>Ergebnis:</strong> 62 % weniger Token.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Erste Schritte mit Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie genau das Tool aus diesem Beitrag ausprobieren möchten, beginnen Sie mit dem <a href="https://github.com/zilliztech/claude-context">Claude Context GitHub-Repository</a> und dem <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCP-Paket</a>. Das Repository enthält Anweisungen zur Einrichtung, Benchmarks und die TypeScript-Kernpakete.</p>
<p>Wenn Sie die Abrufschicht verstehen oder anpassen möchten, sind diese Ressourcen nützliche nächste Schritte:</p>
<ul>
<li>Lernen Sie die Grundlagen der Vektordatenbank mit dem <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Informieren Sie sich über die <a href="https://milvus.io/docs/full-text-search.md">Milvus-Volltextsuche</a> und das <a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChain-Tutorial zur Volltextsuche</a>, wenn Sie eine Suche im BM25-Stil mit dichten Vektoren kombinieren möchten.</li>
<li>Prüfen Sie <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">Open-Source-Vektorsuchmaschinen</a>, wenn Sie Infrastrukturoptionen vergleichen möchten.</li>
<li>Probieren Sie das <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin für Claude Code</a> aus, wenn Sie Vektordatenbankoperationen direkt innerhalb des Claude Code Workflows durchführen möchten.</li>
</ul>
<p>Wenn Sie Hilfe zu Milvus oder der Code-Retrieval-Architektur benötigen, werden Sie Mitglied der <a href="https://milvus.io/community/">Milvus-Community</a> oder buchen Sie die <a href="https://milvus.io/office-hours">Milvus-Sprechstunde</a> für eine persönliche Beratung. Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, <a href="https://cloud.zilliz.com/signup">melden Sie sich für Zilliz Cloud an</a> oder <a href="https://cloud.zilliz.com/login">melden Sie sich bei Zilliz Cloud an</a> und verwenden Sie Milvus als Backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Warum verwendet Claude Code so viele Token bei einigen Codierungsaufgaben?</h3><p>Claude Code kann viele Token verwenden, wenn eine Aufgabe wiederholte Such- und Leseschleifen über ein großes Repository erfordert. Wenn der Agent nach Schlüsselwörtern sucht, irrelevante Dateien liest und dann erneut sucht, fügt jede gelesene Datei Token hinzu, selbst wenn der Code für die Aufgabe nicht nützlich ist.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Wie reduziert Claude Context die Verwendung von Token in Claude Code?</h3><p>Claude Context reduziert die Verwendung von Token, indem es einen von Milvus unterstützten Code-Index durchsucht, bevor der Agent Dateien liest. Es findet relevante Codeabschnitte mit hybrider Suche, so dass Claude Code weniger Dateien inspizieren und mehr von seinem Kontextfenster für Code verwenden kann, der tatsächlich wichtig ist.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Ist Claude Context nur für Claude Code?</h3><p>Nein. Claude Context ist als MCP-Server ausgelegt, so dass es mit jedem Codierungswerkzeug arbeiten kann, das MCP unterstützt. Claude Code ist das Hauptbeispiel in diesem Beitrag, aber dieselbe Abrufschicht kann auch andere MCP-kompatible IDEs und Agenten-Workflows unterstützen.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Brauche ich Zilliz Cloud, um Claude Context zu benutzen?</h3><p>Claude Context kann Zilliz Cloud als verwaltetes Milvus-Backend nutzen, was der einfachste Weg ist, wenn Sie keine Vektor-Datenbankinfrastruktur betreiben wollen. Die gleiche Retrieval-Architektur basiert auf Milvus-Konzepten, so dass Teams sie auch an selbstverwaltete Milvus-Implementierungen anpassen können.</p>
