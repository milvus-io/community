---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 und Milvus: Wie man produktionsreife Agenten mit echtem
  Langzeitgedächtnis erstellt
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Erfahren Sie, wie LangChain 1.0 die Agentenarchitektur vereinfacht und wie
  Milvus den Langzeitspeicher für skalierbare, produktionsreife KI-Anwendungen
  erweitert.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain ist ein beliebtes Open-Source-Framework für die Entwicklung von Anwendungen, die auf großen Sprachmodellen (LLMs) basieren. Es bietet ein modulares Toolkit für den Aufbau von logischen und werkzeugverwendenden Agenten, die Verbindung von Modellen mit externen Daten und die Verwaltung von Interaktionsflüssen.</p>
<p>Mit der Veröffentlichung von <strong>LangChain 1.0</strong> macht das Framework einen Schritt in Richtung einer produktionsfreundlicheren Architektur. Die neue Version ersetzt das frühere kettenbasierte Design durch eine standardisierte ReAct-Schleife (Reason → Tool Call → Observe → Decide) und führt Middleware zur Verwaltung von Ausführung, Kontrolle und Sicherheit ein.</p>
<p>Aber logisches Denken allein ist nicht genug. Agenten müssen auch in der Lage sein, Informationen zu speichern, abzurufen und wiederzuverwenden. Hier kann <a href="https://milvus.io/"><strong>Milvus</strong></a>, eine Open-Source-Vektordatenbank, eine wichtige Rolle spielen. Milvus bietet eine skalierbare, hochleistungsfähige Speicherebene, die es Agenten ermöglicht, Informationen über semantische Ähnlichkeit effizient zu speichern, zu suchen und abzurufen.</p>
<p>In diesem Beitrag werden wir untersuchen, wie LangChain 1.0 die Agentenarchitektur aktualisiert und wie die Integration von Milvus den Agenten hilft, über das Argumentieren hinauszugehen und einen persistenten, intelligenten Speicher für reale Anwendungsfälle zu ermöglichen.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Warum das kettenbasierte Design zu kurz greift<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>In den frühen Tagen (Version 0.x) war die Architektur von LangChain auf Ketten ausgerichtet. Jede Kette definierte eine feste Sequenz und wurde mit vorgefertigten Vorlagen geliefert, die die LLM-Orchestrierung einfach und schnell machten. Dieses Design war ideal für die schnelle Erstellung von Prototypen. Aber als sich das LLM-Ökosystem weiterentwickelte und die realen Anwendungsfälle komplexer wurden, begannen sich Risse in dieser Architektur zu zeigen.</p>
<p><strong>1. Mangel an Flexibilität</strong></p>
<p>Frühe Versionen von LangChain boten modulare Pipelines wie SimpleSequentialChain oder LLMChain, die jeweils einem festen, linearen Ablauf folgten - Prompt-Erstellung → Modellaufruf → Ausgabeverarbeitung. Dieses Design eignete sich gut für einfache und vorhersehbare Aufgaben und erleichterte die schnelle Erstellung von Prototypen.</p>
<p>Als die Anwendungen jedoch immer dynamischer wurden, fühlten sich diese starren Vorlagen zunehmend einschränkend an. Wenn die Geschäftslogik nicht mehr sauber in eine vordefinierte Sequenz passt, bleiben Ihnen zwei unbefriedigende Optionen: Sie können Ihre Logik zwingen, sich an das Framework anzupassen, oder es ganz umgehen, indem Sie die LLM-API direkt aufrufen.</p>
<p><strong>2. Fehlende Kontrolle in der Produktion</strong></p>
<p>Was in Demos gut funktionierte, ging in der Produktion oft schief. Die Chains enthielten nicht die Sicherheitsvorkehrungen, die für groß angelegte, dauerhafte oder sensible Anwendungen erforderlich sind. Häufige Probleme waren:</p>
<ul>
<li><p><strong>Überlauf von Kontexten:</strong> Lange Konversationen konnten die Token-Grenzen überschreiten und Abstürze oder stillschweigende Abbrüche verursachen.</p></li>
<li><p><strong>Sensible Datenlecks:</strong> Persönlich identifizierbare Informationen (wie E-Mails oder IDs) könnten versehentlich an Modelle von Drittanbietern gesendet werden.</p></li>
<li><p><strong>Unüberwachte Vorgänge:</strong> Agenten könnten Daten löschen oder E-Mails ohne menschliche Zustimmung versenden.</p></li>
</ul>
<p><strong>3. Fehlende modellübergreifende Kompatibilität</strong></p>
<p>Jeder LLM-Anbieter - OpenAI, Anthropic und viele chinesische Modelle - implementiert seine eigenen Protokolle für Schlussfolgerungen und Tool-Aufrufe. Jedes Mal, wenn man den Anbieter wechselte, musste man die Integrationsschicht neu schreiben: Eingabeaufforderungsvorlagen, Adapter und Antwortparser. Diese sich wiederholende Arbeit verlangsamte die Entwicklung und machte das Experimentieren mühsam.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: All-in ReAct Agent<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Als das LangChain-Team Hunderte von produktionsreifen Agenten-Implementierungen analysierte, stach eine Erkenntnis hervor: Fast alle erfolgreichen Agenten konvergierten auf natürliche Weise zum <strong>ReAct-Muster ("Reasoning + Acting")</strong>.</p>
<p>Unabhängig davon, ob es sich um ein Multi-Agenten-System oder einen einzelnen Agenten handelt, der tiefgreifende Überlegungen anstellt, ergibt sich derselbe Regelkreis: Abwechselnd werden kurze Überlegungsschritte mit gezielten Tool-Aufrufen durchgeführt, und die daraus resultierenden Beobachtungen fließen in nachfolgende Entscheidungen ein, bis der Agent eine endgültige Antwort geben kann.</p>
<p>Um auf dieser bewährten Struktur aufzubauen, stellt LangChain 1.0 die ReAct-Schleife in den Mittelpunkt seiner Architektur und macht sie zur Standardstruktur für den Aufbau zuverlässiger, interpretierbarer und produktionsreifer Agenten.</p>
<p>Um alles zu unterstützen, von einfachen Agenten bis hin zu komplexen Orchestrierungen, verwendet LangChain 1.0 ein mehrschichtiges Design, das Benutzerfreundlichkeit mit präziser Kontrolle kombiniert:</p>
<ul>
<li><p><strong>Standardszenarien:</strong> Beginnen Sie mit der create_agent()-Funktion - eine saubere, standardisierte ReAct-Schleife, die Argumente und Tool-Aufrufe sofort verarbeitet.</p></li>
<li><p><strong>Erweiterte Szenarien:</strong> Fügen Sie Middleware hinzu, um eine feinkörnige Kontrolle zu erhalten. Mit Middleware können Sie die Vorgänge innerhalb des Agenten überprüfen oder ändern, z. B. durch Hinzufügen von PII-Erkennung, Prüfpunkten für die menschliche Zustimmung, automatischen Wiederholungsversuchen oder Überwachungshaken.</p></li>
<li><p><strong>Komplexe Szenarien:</strong> Für zustandsbehaftete Workflows oder die Orchestrierung mehrerer Agenten verwenden Sie LangGraph, eine graphenbasierte Ausführungsengine, die eine präzise Kontrolle über den Logikfluss, die Abhängigkeiten und die Ausführungszustände bietet.</p></li>
</ul>
<p>Lassen Sie uns nun die drei Schlüsselkomponenten aufschlüsseln, die die Agentenentwicklung einfacher, sicherer und konsistenter über alle Modelle hinweg machen.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. Der create_agent(): Eine einfachere Methode zur Erstellung von Agenten</h3><p>Ein wichtiger Durchbruch in LangChain 1.0 ist die Reduzierung der Komplexität der Agentenentwicklung auf eine einzige Funktion - create_agent(). Sie müssen sich nicht mehr manuell um Zustandsverwaltung, Fehlerbehandlung oder Streaming-Ausgaben kümmern. Diese Funktionen auf Produktionsebene werden nun automatisch von der darunter liegenden LangGraph-Laufzeit verwaltet.</p>
<p>Mit nur drei Parametern können Sie einen voll funktionsfähigen Agenten starten:</p>
<ul>
<li><p><strong>model</strong> - entweder ein Modellbezeichner (String) oder ein instanziiertes Modellobjekt.</p></li>
<li><p><strong>tools</strong> - eine Liste von Funktionen, die dem Agenten seine Fähigkeiten verleihen.</p></li>
<li><p><strong>system_prompt</strong> - die Anweisung, die die Rolle, den Ton und das Verhalten des Agenten definiert.</p></li>
</ul>
<p>Unter der Haube läuft create_agent() in der Standard-Agentenschleife - es ruft ein Modell auf, lässt es Werkzeuge zur Ausführung wählen und schließt ab, sobald keine Werkzeuge mehr benötigt werden:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Er erbt auch die in LangGraph eingebauten Fähigkeiten zur Zustandspersistenz, zur Wiederherstellung von Unterbrechungen und zum Streaming. Aufgaben, die früher Hunderte von Zeilen an Orchestrierungscode erforderten, werden jetzt über eine einzige, deklarative API abgewickelt.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. Die Middleware: Eine komponierbare Schicht für produktionsreife Steuerung</h3><p>Die Middleware ist die entscheidende Brücke, die LangChain vom Prototyp zur Produktion bringt. Sie stellt an strategischen Punkten in der Ausführungsschleife des Agenten Hooks zur Verfügung, die es Ihnen ermöglichen, benutzerdefinierte Logik hinzuzufügen, ohne den Kernprozess von ReAct neu zu schreiben.</p>
<p>Die Hauptschleife eines Agenten folgt einem dreistufigen Entscheidungsprozess - Modell → Werkzeug → Beendigung:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 bietet ein paar <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">vorgefertigte Middlewares</a> für gängige Muster. Hier sind vier Beispiele.</p>
<ul>
<li><strong>PII-Erkennung: Jede Anwendung, die sensible Benutzerdaten verarbeitet</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Zusammenfassen: Automatisches Zusammenfassen des Gesprächsverlaufs, wenn sich die Token-Grenze nähert.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Tool-Wiederholung: Automatische Wiederholung fehlgeschlagener Tool-Aufrufe mit konfigurierbarem exponentiellem Backoff.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Benutzerdefinierte Middleware</strong></li>
</ul>
<p>Zusätzlich zu den offiziellen, vorgefertigten Middleware-Optionen können Sie auch benutzerdefinierte Middleware auf dekorator- oder klassenbasierte Weise erstellen.</p>
<p>Der folgende Ausschnitt zeigt beispielsweise, wie Modellaufrufe vor der Ausführung protokolliert werden:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Strukturierte Ausgabe: Ein standardisierter Weg, Daten zu handhaben</h3><p>In der traditionellen Agentenentwicklung war es schon immer schwierig, strukturierte Ausgaben zu verwalten. Jeder Modellanbieter handhabt dies anders - OpenAI bietet zum Beispiel eine native Structured Output API, während andere nur indirekt über Toolaufrufe strukturierte Antworten unterstützen. Das bedeutete oft, dass für jeden Anbieter eigene Adapter geschrieben werden mussten, was zusätzliche Arbeit bedeutete und die Wartung mühsamer machte, als sie sein sollte.</p>
<p>In LangChain 1.0 wird die strukturierte Ausgabe direkt über den Parameter response_format in create_agent() gehandhabt.  Sie brauchen Ihr Datenschema nur einmal zu definieren. LangChain wählt automatisch die beste Durchsetzungsstrategie auf der Grundlage des von Ihnen verwendeten Modells aus - kein zusätzliches Setup oder anbieterspezifischer Code ist erforderlich.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain unterstützt zwei Strategien für die strukturierte Ausgabe:</p>
<p><strong>1. Anbieter-Strategie:</strong> Einige Modellanbieter unterstützen strukturierte Ausgaben von Haus aus über ihre APIs (z.B. OpenAI und Grok). Wenn eine solche Unterstützung verfügbar ist, verwendet LangChain direkt die eingebaute Schemadurchsetzung des Anbieters. Dieser Ansatz bietet den höchsten Grad an Zuverlässigkeit und Konsistenz, da das Modell selbst das Ausgabeformat garantiert.</p>
<p><strong>2. Werkzeugaufruf-Strategie:</strong> Für Modelle, die keine native strukturierte Ausgabe unterstützen, verwendet LangChain Tool-Aufrufe, um das gleiche Ergebnis zu erzielen.</p>
<p>Sie müssen sich nicht darum kümmern, welche Strategie verwendet wird - das Framework erkennt die Fähigkeiten des Modells und passt sich automatisch an. Dank dieser Abstraktion können Sie zwischen verschiedenen Modellanbietern wechseln, ohne Ihre Geschäftslogik zu ändern.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Wie Milvus den Agentenspeicher verbessert<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei produktiven Agenten ist der wirkliche Leistungsengpass oft nicht die Logik-Engine, sondern das Speichersystem. In LangChain 1.0 fungieren Vektordatenbanken als externes Gedächtnis eines Agenten, das einen langfristigen Abruf durch semantisches Retrieval ermöglicht.</p>
<p><a href="https://milvus.io/">Milvus</a> ist eine der ausgereiftesten Open-Source-Vektordatenbanken auf dem Markt, die speziell für die umfangreiche Vektorsuche in KI-Anwendungen entwickelt wurde. Sie lässt sich nativ in LangChain integrieren, so dass Sie sich nicht manuell um Vektorisierung, Indexverwaltung oder Ähnlichkeitssuche kümmern müssen. Das Paket langchain_milvus wickelt Milvus als Standard-VectorStore-Schnittstelle ein, so dass Sie es mit nur wenigen Zeilen Code mit Ihren Agenten verbinden können.</p>
<p>Auf diese Weise löst Milvus drei zentrale Herausforderungen beim Aufbau skalierbarer und zuverlässiger Agentenspeichersysteme:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Schneller Abruf von massiven Wissensdatenbanken</strong></h4><p>Wenn ein Agent Tausende von Dokumenten, vergangenen Gesprächen oder Produkthandbüchern verarbeiten muss, reicht eine einfache Stichwortsuche nicht aus. Milvus verwendet eine vektorielle Ähnlichkeitssuche, um semantisch relevante Informationen innerhalb von Millisekunden zu finden - selbst wenn die Anfrage einen anderen Wortlaut hat. So kann Ihr Agent Wissen auf der Grundlage der Bedeutung abrufen, nicht nur aufgrund exakter Textübereinstimmungen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Persistentes Langzeitgedächtnis</strong></h4><p>Die SummarizationMiddleware von LangChain kann den Gesprächsverlauf verdichten, wenn er zu lang wird, aber was passiert mit all den Details, die weggekürzt werden? Milvus bewahrt sie auf. Jedes Gespräch, jeder Toolaufruf und jeder Argumentationsschritt kann vektorisiert und für eine langfristige Referenz gespeichert werden. Bei Bedarf kann der Agent über die semantische Suche schnell relevante Erinnerungen abrufen, was eine echte Kontinuität über Sitzungen hinweg ermöglicht.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Einheitliche Verwaltung von multimodalen Inhalten</strong></h4><p>Moderne Agenten verarbeiten mehr als nur Text - sie interagieren mit Bildern, Audio und Video. Milvus unterstützt Multi-Vektor-Speicher und dynamische Schemata, so dass Sie Einbettungen aus mehreren Modalitäten in einem einzigen System verwalten können. Dies bietet eine einheitliche Speichergrundlage für multimodale Agenten, die eine konsistente Abfrage über verschiedene Datentypen hinweg ermöglicht.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph: Wie Sie die passende Lösung für Ihre Agenten auswählen<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Upgrade auf LangChain 1.0 ist ein wichtiger Schritt auf dem Weg zur Erstellung produktionsreifer Agenten - aber das bedeutet nicht, dass es immer die einzige oder beste Wahl für jeden Anwendungsfall ist. Die Wahl des richtigen Frameworks bestimmt, wie schnell Sie diese Fähigkeiten zu einem funktionierenden, wartbaren System kombinieren können.</p>
<p>Tatsächlich können LangChain 1.0 und LangGraph 1.0 als Teil desselben Schichtenstapels betrachtet werden, der so konzipiert ist, dass er zusammenarbeitet, anstatt sich gegenseitig zu ersetzen: LangChain hilft Ihnen, Standard-Agenten schnell zu erstellen, während LangGraph Ihnen eine feinkörnige Kontrolle für komplexe Arbeitsabläufe bietet. Mit anderen Worten: LangChain hilft Ihnen, schnell zu arbeiten, während LangGraph Ihnen hilft, in die Tiefe zu gehen.</p>
<p>Im Folgenden finden Sie einen kurzen Vergleich der technischen Positionierung der beiden Systeme:</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Abstraktionsebene</strong></td><td>High-Level-Abstraktion, konzipiert für Standard-Agentenszenarien</td><td>Low-Level-Orchestrierungs-Framework, konzipiert für komplexe Arbeitsabläufe</td></tr>
<tr><td><strong>Kern-Fähigkeit</strong></td><td>Standard ReAct-Schleife (Reason → Tool Call → Observation → Response)</td><td>Benutzerdefinierte Zustandsautomaten und komplexe Verzweigungslogik (StateGraph + Conditional Routing)</td></tr>
<tr><td><strong>Erweiterungs-Mechanismus</strong></td><td>Middleware für produktionsreife Fähigkeiten</td><td>Manuelle Verwaltung von Knoten, Kanten und Zustandsübergängen</td></tr>
<tr><td><strong>Zugrundeliegende Implementierung</strong></td><td>Manuelle Verwaltung von Knoten, Kanten und Zustandsübergängen</td><td>Native Laufzeit mit eingebauter Persistenz und Wiederherstellung</td></tr>
<tr><td><strong>Typische Anwendungsfälle</strong></td><td>80% der Standard-Agentenszenarien</td><td>Multi-Agenten-Kollaboration und lang laufende Workflow-Orchestrierung</td></tr>
<tr><td><strong>Lernkurve</strong></td><td>Erstellen eines Agenten in ~10 Codezeilen</td><td>Erfordert ein Verständnis von Zustandsgraphen und Knotenorchestrierung</td></tr>
</tbody>
</table>
<p>Wenn Sie neu in der Erstellung von Agenten sind oder ein Projekt schnell zum Laufen bringen wollen, beginnen Sie mit LangChain. Wenn Sie bereits wissen, dass Ihr Anwendungsfall eine komplexe Orchestrierung, Multi-Agenten-Kollaboration oder langlaufende Workflows erfordert, sollten Sie direkt zu LangGraph wechseln.</p>
<p>Beide Frameworks können im selben Projekt koexistieren - Sie können einfach mit LangChain beginnen und LangGraph einbinden, wenn Ihr System mehr Kontrolle und Flexibilität benötigt. Der Schlüssel liegt darin, das richtige Werkzeug für jeden Teil Ihres Workflows zu wählen.</p>
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
    </button></h2><p>Vor drei Jahren begann LangChain als ein leichtgewichtiger Wrapper für den Aufruf von LLMs. Heute hat es sich zu einem vollständigen, produktionsreifen Framework entwickelt.</p>
<p>Im Kern sorgen die Middleware-Schichten für Sicherheit, Konformität und Beobachtbarkeit. LangGraph fügt persistente Ausführung, Kontrollfluss und Zustandsverwaltung hinzu. Und auf der Speicherebene füllt <a href="https://milvus.io/">Milvus</a> eine kritische Lücke, indem es einen skalierbaren, zuverlässigen Langzeitspeicher bereitstellt, der es Agenten ermöglicht, Kontext abzurufen, Rückschlüsse auf den Verlauf zu ziehen und sich im Laufe der Zeit zu verbessern.</p>
<p>Zusammen bilden LangChain, LangGraph und Milvus eine praktische Toolchain für das moderne Agentenzeitalter, die eine Brücke zwischen schnellem Prototyping und unternehmensweitem Einsatz schlägt, ohne dabei an Zuverlässigkeit oder Leistung einzubüßen.</p>
<p>🚀 Sind Sie bereit, Ihrem Agenten ein zuverlässiges Langzeitgedächtnis zu geben? Informieren Sie sich über <a href="https://milvus.io">Milvus</a> und sehen Sie, wie es einen intelligenten Langzeitspeicher für LangChain-Agenten in der Produktion bereitstellt.</p>
<p>Haben Sie Fragen oder möchten Sie in eine Funktion eintauchen? Treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei oder melden Sie Probleme auf <a href="https://github.com/milvus-io/milvus">GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> zu erhalten.</p>
