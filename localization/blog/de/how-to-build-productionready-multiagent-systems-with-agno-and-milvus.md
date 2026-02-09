---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Wie man produktionsreife Multi-Agenten-Systeme mit Agno und Milvus erstellt
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Lernen Sie, wie Sie mit Agno, AgentOS und Milvus produktionsreife
  Multiagentensysteme für reale Arbeitslasten erstellen, bereitstellen und
  skalieren.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Wenn Sie KI-Agenten entwickelt haben, sind Sie wahrscheinlich schon einmal gegen diese Wand gestoßen: Ihre Demo funktioniert großartig, aber die Umsetzung in die Produktion ist eine ganz andere Geschichte.</p>
<p>Wir haben uns in früheren Beiträgen mit der Speicherverwaltung von Agenten und dem Reranking beschäftigt. Jetzt wollen wir die größere Herausforderung angehen: Agenten zu entwickeln, die in der Produktion tatsächlich funktionieren.</p>
<p>Die Realität sieht so aus: Produktionsumgebungen sind chaotisch. Ein einzelner Agent reicht selten aus, weshalb Multiagentensysteme allgegenwärtig sind. Die heute verfügbaren Frameworks lassen sich jedoch in zwei Lager einteilen: leichtgewichtige, die sich gut demonstrieren lassen, aber unter echter Belastung zusammenbrechen, oder leistungsstarke, die ewig brauchen, um zu lernen und zu entwickeln.</p>
<p>Ich habe in letzter Zeit mit <a href="https://github.com/agno-agi/agno">Agno</a> experimentiert, und es scheint einen vernünftigen Mittelweg zu finden - mit dem Fokus auf Produktionsbereitschaft ohne übermäßige Komplexität. Das Projekt hat in wenigen Monaten über 37.000 GitHub-Sterne erhalten, was darauf hindeutet, dass andere Entwickler es ebenfalls nützlich finden.</p>
<p>In diesem Beitrag erzähle ich, was ich beim Aufbau eines Multiagentensystems mit Agno und <a href="https://milvus.io/">Milvus</a> als Speicherschicht gelernt habe. Wir werden uns ansehen, wie Agno im Vergleich zu Alternativen wie LangGraph abschneidet und eine vollständige Implementierung durchgehen, die Sie selbst ausprobieren können.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Was ist Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> ist ein Multi-Agenten-Framework, das speziell für den Produktionseinsatz entwickelt wurde. Es besteht aus zwei verschiedenen Schichten:</p>
<ul>
<li><p><strong>Agno-Framework-Schicht</strong>: Hier definieren Sie Ihre Agentenlogik</p></li>
<li><p><strong>AgentOS-Laufzeitschicht</strong>: Setzt diese Logik in HTTP-Dienste um, die Sie tatsächlich einsetzen können</p></li>
</ul>
<p>Stellen Sie es sich so vor: Die Framework-Schicht definiert <em>, was</em> Ihre Agenten tun sollen, während AgentOS dafür sorgt <em>,</em> dass diese Arbeit ausgeführt und bereitgestellt wird.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">Die Framework-Schicht</h3><p>Mit dieser Schicht arbeiten Sie direkt. Hier werden drei Kernkonzepte eingeführt:</p>
<ul>
<li><p><strong>Agent</strong>: Erledigt eine bestimmte Art von Aufgabe</p></li>
<li><p><strong>Team</strong>: Koordiniert mehrere Agenten, um komplexe Probleme zu lösen</p></li>
<li><p><strong>Arbeitsablauf</strong>: Definiert Ausführungsreihenfolge und Struktur</p></li>
</ul>
<p>Eine Sache, die ich sehr schätze: Sie müssen keine neue DSL lernen oder Flussdiagramme zeichnen. Das Verhalten der Agenten wird mit Standard-Python-Funktionsaufrufen definiert. Das Framework kümmert sich um LLM-Aufrufe, Werkzeugausführung und Speicherverwaltung.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">Die AgentOS-Laufzeitschicht</h3><p>AgentOS ist durch die asynchrone Ausführung für hohe Anforderungsvolumina ausgelegt, und seine zustandslose Architektur ermöglicht eine unkomplizierte Skalierung.</p>
<p>Zu den wichtigsten Funktionen gehören:</p>
<ul>
<li><p>Integrierte FastAPI-Integration für die Darstellung von Agenten als HTTP-Endpunkte</p></li>
<li><p>Sitzungsmanagement und Streaming-Antworten</p></li>
<li><p>Überwachung von Endpunkten</p></li>
<li><p>Unterstützung für horizontale Skalierung</p></li>
</ul>
<p>In der Praxis übernimmt AgentOS den größten Teil der Infrastrukturarbeit, so dass Sie sich auf die eigentliche Agentenlogik konzentrieren können.</p>
<p>Eine Übersicht über die Architektur von Agno ist unten dargestellt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno im Vergleich zu LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Um zu verstehen, wo Agno hingehört, vergleichen wir es mit LangGraph - einem der am weitesten verbreiteten Multi-Agent-Frameworks.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> verwendet einen graphbasierten Zustandsautomaten. Sie modellieren Ihren gesamten Agenten-Workflow als einen Graphen: Schritte sind Knoten, Ausführungspfade sind Kanten. Dies funktioniert gut, wenn Ihr Prozess fest und streng geordnet ist. Aber für offene oder konversationelle Szenarien kann es einschränkend wirken. Je dynamischer die Interaktionen werden, desto schwieriger wird es, einen sauberen Graphen aufrechtzuerhalten.</p>
<p><strong>Agno</strong> verfolgt einen anderen Ansatz. Es ist keine reine Orchestrierungsschicht, sondern ein End-to-End-System. Definieren Sie Ihr Agentenverhalten, und AgentOS stellt es automatisch als produktionsbereiten HTTP-Dienst bereit - mit integrierter Überwachung, Skalierbarkeit und Unterstützung für Konversationen mit mehreren Abläufen. Kein separates API-Gateway, keine benutzerdefinierte Sitzungsverwaltung, kein zusätzliches operatives Tooling.</p>
<p>Hier ein kurzer Vergleich:</p>
<table>
<thead>
<tr><th>Dimension</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Orchestrierungsmodell</td><td>Explizite Graphendefinition mit Knoten und Kanten</td><td>Deklarative Arbeitsabläufe in Python definiert</td></tr>
<tr><td>Verwaltung von Zuständen</td><td>Benutzerdefinierte Zustandsklassen, die von Entwicklern definiert und verwaltet werden</td><td>Eingebautes Speichersystem</td></tr>
<tr><td>Fehlersuche und Beobachtbarkeit</td><td>LangSmith (kostenpflichtig)</td><td>AgentOS UI (quelloffen)</td></tr>
<tr><td>Laufzeitmodell</td><td>Integriert in eine bestehende Laufzeitumgebung</td><td>Eigenständiger FastAPI-basierter Dienst</td></tr>
<tr><td>Komplexität des Einsatzes</td><td>Erfordert zusätzliche Einrichtung über LangServe</td><td>Funktioniert sofort nach der Installation</td></tr>
</tbody>
</table>
<p>LangGraph bietet Ihnen mehr Flexibilität und feinkörnige Kontrolle. Agno optimiert für eine schnellere Time-to-Production. Die richtige Wahl hängt von Ihrem Projektstadium, der vorhandenen Infrastruktur und dem Grad der Anpassung ab, den Sie benötigen. Wenn Sie unsicher sind, ist ein kleiner Proof of Concept mit beiden wahrscheinlich die zuverlässigste Methode, um eine Entscheidung zu treffen.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Auswahl von Milvus für die Agentenspeicherschicht<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie sich für ein Framework entschieden haben, ist die nächste Entscheidung, wie Sie Speicher und Wissen speichern wollen. Wir verwenden Milvus für diese Aufgabe. <a href="https://milvus.io/">Milvus</a> ist die beliebteste Open-Source-Vektordatenbank für KI-Workloads mit mehr als <a href="https://github.com/milvus-io/milvus">42.000+ GitHub-Sternen</a>.</p>
<p><strong>Agno hat native Milvus-Unterstützung.</strong> Das Modul <code translate="no">agno.vectordb.milvus</code> umfasst Produktionsfunktionen wie Verbindungsverwaltung, automatische Wiederholungen, Batch-Schreibvorgänge und die Erzeugung von Einbettungen. Sie müssen keine Verbindungspools aufbauen oder sich selbst um Netzwerkausfälle kümmern - ein paar Zeilen Python geben Ihnen eine funktionierende Vektorspeicherschicht.</p>
<p><strong>Milvus skaliert mit Ihren Anforderungen.</strong> Es unterstützt drei <a href="https://milvus.io/docs/install-overview.md">Bereitstellungsmodi:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Leichtgewichtig, dateibasiert - ideal für lokale Entwicklung und Tests</p></li>
<li><p><strong>Eigenständig</strong>: Einsatz auf einem einzelnen Server für Produktionsworkloads</p></li>
<li><p><strong>Verteilt</strong>: Vollständiger Cluster für groß angelegte Szenarien</p></li>
</ul>
<p>Sie können mit Milvus Lite beginnen, um Ihren Agentenspeicher lokal zu validieren, und dann bei wachsendem Datenverkehr zu Standalone oder Distributed wechseln - ohne Ihren Anwendungscode zu ändern. Diese Flexibilität ist besonders nützlich, wenn Sie in der Anfangsphase schnell iterieren, aber später einen klaren Pfad zur Skalierung benötigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Schritt-für-Schritt: Aufbau eines produktionsbereiten Agno-Agenten mit Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns einen produktionsbereiten Agenten von Grund auf erstellen.</p>
<p>Wir beginnen mit einem einfachen Beispiel für einen einzelnen Agenten, um den gesamten Arbeitsablauf zu zeigen. Dann werden wir es zu einem Multi-Agenten-System ausbauen. AgentOS wird alles automatisch als aufrufbaren HTTP-Dienst verpacken.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Bereitstellung von Milvus Standalone mit Docker</h3><p><strong>(1) Laden Sie die Deployment-Dateien herunter</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Starten Sie den Milvus-Dienst</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Kern-Implementierung</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Ausführen des Agenten</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Verbinden mit der AgentOS-Konsole</h3><p>https://os.agno.com/</p>
<p><strong>(1) Erstellen Sie ein Konto und melden Sie sich an</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Verbinden Sie Ihren Agent mit AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Konfigurieren Sie den exponierten Port und den Agentennamen</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Fügen Sie Dokumente hinzu und indizieren Sie sie in Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Testen Sie den Agenten von Ende zu Ende</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In dieser Konfiguration übernimmt Milvus das semantische Retrieval mit hoher Leistung. Wenn der Wissensdatenbank-Assistent eine technische Frage erhält, ruft er das Tool <code translate="no">search_knowledge</code> auf, um die Anfrage einzubetten, ruft die relevantesten Dokumententeile von Milvus ab und verwendet diese Ergebnisse als Grundlage für seine Antwort.</p>
<p>Milvus bietet drei Bereitstellungsoptionen, so dass Sie eine Architektur wählen können, die Ihren betrieblichen Anforderungen entspricht, während die APIs auf Anwendungsebene in allen Bereitstellungsmodi konsistent bleiben.</p>
<p>Die obige Demo zeigt den zentralen Abruf- und Generierungsfluss. Um dieses Design in eine Produktionsumgebung zu übertragen, müssen jedoch mehrere architektonische Aspekte detaillierter erörtert werden.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Wie Abfrageergebnisse über Agenten hinweg geteilt werden<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agnos Team-Modus verfügt über eine <code translate="no">share_member_interactions=True</code> Option, die es späteren Agenten erlaubt, die gesamte Interaktionshistorie früherer Agenten zu übernehmen. In der Praxis bedeutet dies, dass, wenn der erste Agent Informationen von Milvus abruft, nachfolgende Agenten diese Ergebnisse wiederverwenden können, anstatt die gleiche Suche erneut durchzuführen.</p>
<ul>
<li><p><strong>Das Gute daran:</strong> Die Kosten für das Abrufen von Informationen amortisieren sich für das gesamte Team. Eine Vektorsuche unterstützt mehrere Agenten, wodurch redundante Abfragen reduziert werden.</p></li>
<li><p><strong>Der Nachteil:</strong> Die Qualität des Abrufs wird verbessert. Wenn die ursprüngliche Suche unvollständige oder ungenaue Ergebnisse liefert, überträgt sich dieser Fehler auf jeden Agenten, der davon abhängt.</p></li>
</ul>
<p>Aus diesem Grund ist die Abfragegenauigkeit in Multiagentensystemen noch wichtiger. Ein schlechter Abruf beeinträchtigt nicht nur die Antwort eines Agenten, sondern wirkt sich auf das gesamte Team aus.</p>
<p>Hier ist ein Beispiel für ein Team-Setup:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Warum Agno und Milvus separat geschichtet sind<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>In dieser Architektur ist <strong>Agno</strong> auf der Gesprächs- und Orchestrierungsebene angesiedelt. Es ist verantwortlich für die Verwaltung des Dialogflusses, die Koordination der Agenten und die Aufrechterhaltung des Gesprächsstatus, wobei der Sitzungsverlauf in einer relationalen Datenbank gespeichert wird. Das eigentliche Domänenwissen des Systems - wie Produktdokumentation und technische Berichte - wird separat behandelt und als Vektoreinbettungen in <strong>Milvus</strong> gespeichert. Durch diese klare Trennung bleiben Gesprächslogik und Wissensspeicherung vollständig entkoppelt.</p>
<p>Warum dies für den Betrieb wichtig ist:</p>
<ul>
<li><p><strong>Unabhängige Skalierung</strong>: Wenn die Nachfrage nach Agno steigt, fügen Sie weitere Agno-Instanzen hinzu. Wenn das Abfragevolumen wächst, erweitern Sie Milvus durch Hinzufügen von Abfrageknoten. Jede Schicht skaliert isoliert.</p></li>
<li><p><strong>Unterschiedliche Hardwareanforderungen</strong>: Agno ist CPU- und speichergebunden (LLM-Inferenz, Workflow-Ausführung). Milvus ist für Vektorabfragen mit hohem Durchsatz optimiert (Festplatten-E/A, manchmal GPU-Beschleunigung). Durch die Trennung der beiden Systeme wird eine Ressourcenkonkurrenz vermieden.</p></li>
<li><p><strong>Kostenoptimierung</strong>: Sie können die Ressourcen für jede Schicht unabhängig voneinander abstimmen und zuweisen.</p></li>
</ul>
<p>Durch diesen mehrschichtigen Ansatz erhalten Sie eine effizientere, stabilere und produktionsreife Architektur.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Was ist bei der Verwendung von Agno mit Milvus zu überwachen?<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno verfügt über eingebaute Evaluierungsfunktionen, aber das Hinzufügen von Milvus erweitert das, was Sie beobachten sollten. Nach unserer Erfahrung sollten Sie sich auf drei Bereiche konzentrieren:</p>
<ul>
<li><p><strong>Qualität des Abrufs</strong>: Sind die von Milvus zurückgegebenen Dokumente tatsächlich relevant für die Anfrage oder nur oberflächlich ähnlich auf der Vektorebene?</p></li>
<li><p><strong>Antworttreue</strong>: Stützt sich die endgültige Antwort auf den abgerufenen Inhalt, oder generiert das LLM ungestützte Behauptungen?</p></li>
<li><p><strong>Aufschlüsselung der End-to-End-Latenz</strong>: Erfassen Sie nicht nur die Gesamtantwortzeit. Schlüsseln Sie sie nach Phasen auf - Einbettungsgenerierung, Vektorsuche, Kontextzusammenstellung, LLM-Inferenz -, damit Sie erkennen können, wo Verzögerungen auftreten.</p></li>
</ul>
<p><strong>Ein praktisches Beispiel:</strong> Wenn Ihre Milvus-Sammlung von 1 Million auf 10 Millionen Vektoren anwächst, werden Sie möglicherweise feststellen, dass die Abruflatenz schleichend zunimmt. Dies ist in der Regel ein Zeichen dafür, dass Sie die Indexparameter (wie <code translate="no">nlist</code> und <code translate="no">nprobe</code>) anpassen oder den Wechsel von einer eigenständigen zu einer verteilten Bereitstellung in Betracht ziehen sollten.</p>
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
    </button></h2><p>Der Aufbau produktionsfähiger Agentensysteme erfordert mehr als nur die Verkabelung von LLM-Aufrufen und Abrufdemos. Sie brauchen klare architektonische Grenzen, eine unabhängig skalierbare Infrastruktur und Beobachtungsmöglichkeiten, um Probleme frühzeitig zu erkennen.</p>
<p>In diesem Beitrag habe ich gezeigt, wie Agno und Milvus zusammenarbeiten können: Agno für die Multi-Agenten-Orchestrierung, Milvus für skalierbaren Speicher und semantisches Retrieval. Durch die Trennung dieser Schichten können Sie vom Prototyp zur Produktion übergehen, ohne die Kernlogik neu schreiben zu müssen - und jede Komponente nach Bedarf skalieren.</p>
<p>Wenn Sie mit ähnlichen Konzepten experimentieren, würde ich gerne wissen, was bei Ihnen funktioniert.</p>
<p><strong>Haben Sie Fragen zu Milvus?</strong> Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>.</p>
