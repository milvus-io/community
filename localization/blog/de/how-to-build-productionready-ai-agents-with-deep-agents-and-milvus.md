---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: Wie man produktionsreife KI-Agenten mit Deep Agents und Milvus erstellt
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Erfahren Sie, wie Sie mit Deep Agents und Milvus skalierbare KI-Agenten für
  langlaufende Aufgaben, geringere Token-Kosten und persistenten Speicher
  erstellen können.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Immer mehr Teams entwickeln KI-Agenten, und die Aufgaben, die sie ihnen zuweisen, werden immer komplexer. Viele reale Arbeitsabläufe umfassen langwierige Aufgaben mit mehreren Schritten und vielen Toolaufrufen. Wenn diese Aufgaben wachsen, treten schnell zwei Probleme auf: höhere Token-Kosten und die Grenzen des Kontextfensters des Modells. Agenten müssen sich außerdem häufig Informationen über mehrere Sitzungen hinweg merken, z. B. frühere Forschungsergebnisse, Benutzerpräferenzen oder frühere Unterhaltungen.</p>
<p>Frameworks wie <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, das von LangChain veröffentlicht wurde, helfen bei der Organisation dieser Arbeitsabläufe. Es bietet eine strukturierte Methode zur Ausführung von Agenten, mit Unterstützung für Aufgabenplanung, Dateizugriff und Delegation von Unteragenten. Dies erleichtert die Entwicklung von Agenten, die lange, mehrstufige Aufgaben zuverlässiger erledigen können.</p>
<p>Aber Workflows allein reichen nicht aus. Agenten benötigen auch ein <strong>Langzeitgedächtnis</strong>, damit sie nützliche Informationen aus früheren Sitzungen abrufen können. Hier kommt <a href="https://milvus.io/"><strong>Milvus</strong></a>, eine Open-Source-Vektor-Datenbank, ins Spiel. Durch die Speicherung von Einbettungen von Gesprächen, Dokumenten und Tool-Ergebnissen ermöglicht Milvus den Agenten, vergangenes Wissen zu suchen und abzurufen.</p>
<p>In diesem Artikel erklären wir die Funktionsweise von Deep Agents und zeigen, wie man sie mit Milvus kombiniert, um KI-Agenten mit strukturierten Arbeitsabläufen und Langzeitgedächtnis zu erstellen.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Was ist Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> ist ein Open-Source-Agenten-Framework, das vom LangChain-Team entwickelt wurde. Es wurde entwickelt, um Agenten zu helfen, langwierige, mehrstufige Aufgaben zuverlässiger zu erledigen. Es konzentriert sich auf drei Hauptfunktionen:</p>
<p><strong>1. Aufgabenplanung</strong></p>
<p>Deep Agents enthält integrierte Tools wie <code translate="no">write_todos</code> und <code translate="no">read_todos</code>. Der Agent zerlegt eine komplexe Aufgabe in eine übersichtliche To-Do-Liste und arbeitet dann jeden Punkt Schritt für Schritt ab und markiert die Aufgaben als erledigt.</p>
<p><strong>2. Zugriff auf das Dateisystem</strong></p>
<p>Er bietet Werkzeuge wie <code translate="no">ls</code>, <code translate="no">read_file</code> und <code translate="no">write_file</code>, damit der Agent Dateien anzeigen, lesen und schreiben kann. Wenn ein Werkzeug eine große Ausgabe erzeugt, wird das Ergebnis automatisch in einer Datei gespeichert, anstatt im Kontextfenster des Modells zu verbleiben. Dadurch wird verhindert, dass sich das Kontextfenster füllt.</p>
<p><strong>3. Delegation von Unteragenten</strong></p>
<p>Mit dem Tool <code translate="no">task</code> kann der Hauptagent Teilaufgaben an spezialisierte Unteragenten weitergeben. Jeder Unteragent hat sein eigenes Kontextfenster und seine eigenen Werkzeuge, was die Arbeit übersichtlicher macht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Technisch gesehen ist ein mit <code translate="no">create_deep_agent</code> erstellter Agent ein kompilierter <strong>LangGraph StateGraph</strong>. (LangGraph ist die Workflow-Bibliothek, die vom LangChain-Team entwickelt wurde, und StateGraph ist ihre zentrale Zustandsstruktur). Aus diesem Grund können Deep Agents direkt LangGraph-Funktionen wie Streaming Output, Checkpointing und Human-in-the-Loop-Interaktion nutzen.</p>
<p><strong>Was also macht Deep Agents in der Praxis nützlich?</strong></p>
<p>Langlaufende Agentenaufgaben stehen oft vor Problemen wie Kontextbegrenzungen, hohen Token-Kosten und unzuverlässiger Ausführung. Deep Agents helfen bei der Lösung dieser Probleme, indem sie Agenten-Workflows strukturierter und einfacher zu verwalten machen. Durch die Verringerung des unnötigen Kontextwachstums wird der Tokenverbrauch gesenkt und die Kosteneffizienz lang laufender Aufgaben erhöht.</p>
<p>Auch komplexe, mehrstufige Aufgaben lassen sich so leichter organisieren. Teilaufgaben können unabhängig voneinander ausgeführt werden, ohne sich gegenseitig zu behindern, was die Zuverlässigkeit erhöht. Gleichzeitig ist das System flexibel, so dass Entwickler es anpassen und erweitern können, wenn sich ihre Agenten von einfachen Experimenten zu Produktionsanwendungen entwickeln.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Individuelle Anpassung bei Deep Agents<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein allgemeiner Rahmen kann nicht alle Branchen- oder Geschäftsanforderungen abdecken. Deep Agents ist so konzipiert, dass es flexibel ist und von Entwicklern an ihre eigenen Anwendungsfälle angepasst werden kann.</p>
<p>Mit Anpassungen können Sie:</p>
<ul>
<li><p>Ihre eigenen internen Tools und APIs einbinden</p></li>
<li><p>domänenspezifische Arbeitsabläufe definieren</p></li>
<li><p>Sicherstellen, dass der Agent Geschäftsregeln befolgt</p></li>
<li><p>Speicher und Wissensaustausch über Sitzungen hinweg unterstützen</p></li>
</ul>
<p>Hier sind die wichtigsten Möglichkeiten zur Anpassung von Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Anpassung der Systemeingabeaufforderung</h3><p>Sie können zu den Standardanweisungen der Middleware Ihre eigenen Systemansagen hinzufügen. Dies ist nützlich für die Definition von Domänenregeln und Arbeitsabläufen.</p>
<p>Eine gute benutzerdefinierte Eingabeaufforderung kann Folgendes enthalten:</p>
<ul>
<li><strong>Domänen-Workflow-Regeln</strong></li>
</ul>
<p>Beispiel: "Führen Sie bei Datenanalyseaufgaben immer eine explorative Analyse durch, bevor Sie ein Modell erstellen."</p>
<ul>
<li><strong>Spezifische Beispiele</strong></li>
</ul>
<p>Beispiel: "Ähnliche Literaturrecherchen zu einem ToDo-Element zusammenfassen."</p>
<ul>
<li><strong>Regeln zum Anhalten</strong></li>
</ul>
<p>Beispiel: "Stoppen Sie, wenn mehr als 100 Tool-Aufrufe verwendet werden."</p>
<ul>
<li><strong>Anleitung zur Tool-Koordination</strong></li>
</ul>
<p>Beispiel: "Verwenden Sie <code translate="no">grep</code>, um Codestellen zu finden, und verwenden Sie dann <code translate="no">read_file</code>, um Details anzuzeigen."</p>
<p>Vermeiden Sie die Wiederholung von Anweisungen, die bereits von der Middleware verarbeitet werden, und fügen Sie keine Regeln hinzu, die mit dem Standardverhalten in Konflikt stehen.</p>
<h3 id="Tools" class="common-anchor-header">Werkzeuge</h3><p>Sie können dem eingebauten Werkzeugsatz Ihre eigenen Werkzeuge hinzufügen. Werkzeuge werden als normale Python-Funktionen definiert, und ihre Dokumentationen beschreiben, was sie tun.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents unterstützt auch Tools, die dem Model Context Protocol (MCP) Standard über <code translate="no">langchain-mcp-adapters</code> folgen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>Sie können benutzerdefinierte Middleware schreiben, um:</p>
<ul>
<li><p>Hinzufügen oder Ändern von Tools</p></li>
<li><p>Prompts anpassen</p></li>
<li><p>Sich in verschiedene Phasen der Agentenausführung einklinken</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents enthält außerdem integrierte Middleware für die Planung, die Verwaltung von Unteragenten und die Ausführungskontrolle.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Funktion</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Bietet write_todos und read_todos Werkzeuge zur Verwaltung von Aufgabenlisten</td></tr>
<tr><td>DateisystemMiddleware</td><td>Bietet Werkzeuge für Datei-Operationen und speichert automatisch große Werkzeugausgaben</td></tr>
<tr><td>SubAgentMiddleware</td><td>Stellt das Aufgabenwerkzeug zur Verfügung, um Arbeit an Subagenten zu delegieren</td></tr>
<tr><td>SummarizationMiddleware</td><td>Fasst automatisch zusammen, wenn der Kontext 170k Token überschreitet</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Ermöglicht Prompt-Caching für Anthropic-Modelle</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Behebt durch Unterbrechungen verursachte unvollständige Tool-Aufrufe</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Konfiguriert Werkzeuge, die eine menschliche Genehmigung erfordern</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Unter-Agenten</h3><p>Der Hauptagent kann Teilaufgaben an Unteragenten delegieren, indem er das Tool <code translate="no">task</code> verwendet. Jeder Unteragent wird in einem eigenen Kontextfenster ausgeführt und verfügt über eigene Werkzeuge und eine eigene Systemeingabeaufforderung.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Für fortgeschrittene Anwendungsfälle können Sie sogar einen vorgefertigten LangGraph-Workflow als Unter-Agenten einbinden.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Menschliche Genehmigungskontrolle)</h3><p>Mit dem Parameter <code translate="no">interrupt_on</code> können Sie bestimmte Werkzeuge angeben, die eine menschliche Genehmigung erfordern. Wenn der Agent eines dieser Werkzeuge aufruft, wird die Ausführung angehalten, bis eine Person es überprüft und genehmigt hat.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Backend-Anpassung (Speicherung)</h3><p>Sie können verschiedene Speicher-Backends auswählen, um zu steuern, wie Dateien behandelt werden. Die aktuellen Optionen umfassen:</p>
<ul>
<li><p><strong>StateBackend</strong> (temporärer Speicher)</p></li>
<li><p><strong>FilesystemBackend</strong> (lokaler Plattenspeicher)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Durch Änderung des Backends können Sie das Verhalten der Dateispeicherung anpassen, ohne das gesamte Systemdesign zu verändern.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Warum Deep Agents mit Milvus für KI-Agenten verwenden?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>In realen Anwendungen benötigen Agenten oft Speicher, der über Sitzungen hinweg erhalten bleibt. Sie müssen sich beispielsweise Benutzereinstellungen merken, im Laufe der Zeit Domänenwissen aufbauen, Feedback aufzeichnen, um das Verhalten anzupassen, oder langfristige Forschungsaufgaben verfolgen.</p>
<p>Deep Agents verwendet standardmäßig <code translate="no">StateBackend</code>, das Daten nur während einer einzigen Sitzung speichert. Wenn die Sitzung endet, wird alles gelöscht. Das bedeutet, dass sie keinen langfristigen, sitzungsübergreifenden Speicher unterstützen können.</p>
<p>Um einen dauerhaften Speicher zu ermöglichen, verwenden wir <a href="https://milvus.io/"><strong>Milvus</strong></a> als Vektordatenbank zusammen mit <code translate="no">StoreBackend</code>. So funktioniert es: Wichtige Gesprächsinhalte und Tool-Ergebnisse werden in Einbettungen (numerische Vektoren, die Bedeutung repräsentieren) umgewandelt und in Milvus gespeichert. Wenn eine neue Aufgabe beginnt, führt der Agent eine semantische Suche durch, um verwandte Erinnerungen aus der Vergangenheit abzurufen. Dadurch kann sich der Agent an relevante Informationen aus früheren Sitzungen "erinnern".</p>
<p>Milvus eignet sich aufgrund seiner Architektur, die eine Trennung von Datenverarbeitung und Speicherung vorsieht, gut für diesen Anwendungsfall. Es unterstützt:</p>
<ul>
<li><p>Horizontale Skalierung auf Dutzende von Milliarden Vektoren</p></li>
<li><p>Abfragen mit hoher Gleichzeitigkeit</p></li>
<li><p>Datenaktualisierungen in Echtzeit</p></li>
<li><p>Produktionsfähiger Einsatz für große Systeme</p></li>
</ul>
<p>Technisch gesehen verwendet Deep Agents <code translate="no">CompositeBackend</code>, um verschiedene Pfade zu verschiedenen Speicher-Backends zu leiten:</p>
<table>
<thead>
<tr><th>Pfad</th><th>Backend</th><th>Zweck</th></tr>
</thead>
<tbody>
<tr><td>/Arbeitsbereich/, /temp/</td><td>StatusBackend</td><td>Temporäre Daten, die nach der Sitzung gelöscht werden</td></tr>
<tr><td>/memories/, /knowledge/</td><td>StoreBackend + Milvus</td><td>Persistente Daten, durchsuchbar über Sitzungen hinweg</td></tr>
</tbody>
</table>
<p>Mit diesem Setup müssen Entwickler nur langfristige Daten unter Pfaden wie <code translate="no">/memories/</code> speichern. Das System verwaltet den sitzungsübergreifenden Speicher automatisch. Detaillierte Konfigurationsschritte finden Sie im folgenden Abschnitt.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Praktische Anwendung: Erstellen eines KI-Agenten mit Langzeitspeicher mit Milvus und Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieses Beispiel zeigt, wie man einen DeepAgents-basierten Agenten mit Milvus mit persistentem Speicher ausstattet.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Schritt 1: Installieren der Abhängigkeiten</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Schritt 2: Einrichten des Speicher-Backends</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Schritt 3: Erstellen des Agenten</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Wichtige Punkte</strong></p>
<ul>
<li><strong>Persistenter Pfad</strong></li>
</ul>
<p>Alle Dateien, die unter <code translate="no">/memories/</code> gespeichert werden, werden dauerhaft gespeichert und können über verschiedene Sitzungen hinweg aufgerufen werden.</p>
<ul>
<li><strong>Einrichtung für die Produktion</strong></li>
</ul>
<p>Das Beispiel verwendet <code translate="no">InMemoryStore()</code> zum Testen. In der Produktion sollte es durch einen Milvus-Adapter ersetzt werden, um eine skalierbare semantische Suche zu ermöglichen.</p>
<ul>
<li><strong>Automatischer Speicher</strong></li>
</ul>
<p>Der Agent speichert Rechercheergebnisse und wichtige Ausgaben automatisch im Ordner <code translate="no">/memories/</code>. In späteren Aufgaben kann er relevante frühere Informationen suchen und abrufen.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Übersicht über die eingebauten Tools<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents enthält mehrere integrierte Tools, die über Middleware bereitgestellt werden. Sie lassen sich in drei Hauptgruppen unterteilen:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Aufgabenverwaltung (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Erzeugt eine strukturierte ToDo-Liste. Jede Aufgabe kann eine Beschreibung, Priorität und Abhängigkeiten enthalten.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Zeigt die aktuelle ToDo-Liste an, einschließlich abgeschlossener und ausstehender Aufgaben.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Dateisystem-Tools (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Listet Dateien in einem Verzeichnis auf. Es muss ein absoluter Pfad verwendet werden (beginnend mit <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Liest den Inhalt von Dateien. Unterstützt <code translate="no">offset</code> und <code translate="no">limit</code> für große Dateien.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Erzeugt oder überschreibt eine Datei.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Ersetzt bestimmten Text innerhalb einer Datei.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Findet Dateien anhand von Mustern, z. B. <code translate="no">**/*.py</code>, um nach allen Python-Dateien zu suchen.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Sucht nach Text in Dateien.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Führt Shell-Befehle in einer Sandbox-Umgebung aus. Erfordert, dass das Backend <code translate="no">SandboxBackendProtocol</code> unterstützt.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Delegierung von Unteragenten (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Sendet eine Teilaufgabe an einen bestimmten Unteragenten. Sie geben den Namen des Unteragenten und die Aufgabenbeschreibung an.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Behandlung von Tool-Ausgaben</h3><p>Wenn ein Tool ein großes Ergebnis erzeugt, speichert Deep Agents es automatisch in einer Datei.</p>
<p>Wenn z. B. <code translate="no">internet_search</code> einen Inhalt von 100 KB liefert, speichert das System diesen in einer Datei wie <code translate="no">/tool_results/internet_search_1.txt</code>. Der Agent behält nur den Dateipfad in seinem Kontext. Dadurch wird die Verwendung von Token reduziert und das Kontextfenster klein gehalten.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder: Wann sollten Sie beide verwenden?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Da sich dieser Artikel auf DeepAgents konzentriert, ist es auch hilfreich zu verstehen, wie diese mit dem</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, einer anderen Option zur Agentenerstellung im LangChain-Ökosystem</em><em>, verglichen werden können</em><em>.</em></p>
<p>LangChain bietet mehrere Möglichkeiten, KI-Agenten zu erstellen, und die beste Wahl hängt in der Regel davon ab, wie viel Kontrolle Sie über das System haben möchten.</p>
<p><strong>DeepAgents</strong> ist für die Erstellung autonomer Agenten konzipiert, die langwierige, mehrstufige Aufgaben erledigen. Es gibt Entwicklern die volle Kontrolle darüber, wie der Agent Aufgaben plant, Werkzeuge verwendet und Speicher verwaltet. Da es auf LangGraph aufbaut, können Sie Komponenten anpassen, Python-Tools integrieren und das Speicher-Backend modifizieren. Dadurch eignen sich DeepAgents gut für komplexe Arbeitsabläufe und Produktionssysteme, bei denen Zuverlässigkeit und Flexibilität wichtig sind.</p>
<p><strong>Agent Builder</strong> hingegen konzentriert sich auf die Benutzerfreundlichkeit. Er verbirgt die meisten technischen Details, so dass Sie einen Agenten beschreiben, Tools hinzufügen und ihn schnell ausführen können. Speicher, Werkzeugverwendung und menschliche Genehmigungsschritte werden automatisch gehandhabt. Dies macht Agent Builder zu einem nützlichen Werkzeug für schnelle Prototypen, interne Tools oder frühe Experimente.</p>
<p><strong>Agent Builder und DeepAgents sind keine separaten Systeme - sie sind Teil desselben Stacks.</strong> Agent Builder wird auf DeepAgents aufgebaut. Viele Teams beginnen mit Agent Builder, um Ideen zu testen, und wechseln dann zu DeepAgents, wenn sie mehr Kontrolle benötigen. Arbeitsabläufe, die mit DeepAgents erstellt wurden, können auch in Agent Builder-Vorlagen umgewandelt werden, so dass andere sie leicht wiederverwenden können.</p>
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
    </button></h2><p>DeepAgents vereinfacht die Verwaltung komplexer Agenten-Workflows durch die Verwendung von drei Hauptideen: Aufgabenplanung, Dateispeicherung und Delegation von Unteragenten. Diese Mechanismen verwandeln chaotische, mehrstufige Prozesse in strukturierte Arbeitsabläufe. In Kombination mit Milvus für die Vektorsuche kann der Agent auch den Langzeitspeicher über Sitzungen hinweg beibehalten.</p>
<p>Für Entwickler bedeutet dies geringere Token-Kosten und ein zuverlässigeres System, das von einer einfachen Demo bis zu einer Produktionsumgebung skaliert werden kann.</p>
<p>Wenn Sie KI-Agenten entwickeln, die strukturierte Workflows und einen echten Langzeitspeicher benötigen, würden wir uns gerne mit Ihnen in Verbindung setzen.</p>
<p>Haben Sie Fragen zu Deep Agents oder zur Verwendung von Milvus als persistentes Speicher-Backend? Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>, um Ihren Anwendungsfall zu besprechen.</p>
