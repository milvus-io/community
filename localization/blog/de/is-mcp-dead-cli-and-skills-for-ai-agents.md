---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: 'Ist MCP tot? Was wir gelernt haben Bauen mit MCP-, CLI- und Agentenkenntnissen'
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP frisst Kontext, bricht in der Produktion ab und kann die LLM Ihres Agenten
  nicht wiederverwenden. Wir haben mit allen drei gebaut - hier ist, wenn jeder
  passt.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Als Denis Yarats, CTO von Perplexity, auf der ASK 2026 erklärte, dass das Unternehmen MCP intern keine Priorität mehr einräumt, setzte dies den üblichen Kreislauf in Gang. YC-CEO Garry Tan legte nach - MCP frisst zu viel Kontextfenster, auth ist kaputt, er hat einen CLI-Ersatz in 30 Minuten gebaut. Hacker News hat sich stark gegen MCP ausgesprochen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vor einem Jahr wäre ein solches Maß an öffentlicher Skepsis noch ungewöhnlich gewesen. Das Model Context Protocol (MCP) wurde als endgültiger Standard für die Integration von <a href="https://zilliz.com/glossary/ai-agents">KI-Agententools</a> propagiert. Die Zahl der Server verdoppelte sich wöchentlich. Seitdem hat sich die Entwicklung nach dem bekannten Muster vollzogen: schneller Hype, breite Akzeptanz, dann Ernüchterung in der Produktion.</p>
<p>Die Branche hat schnell reagiert. Lark/Feishu von Bytedance haben ihr offizielles CLI offengelegt - mehr als 200 Befehle für 11 Geschäftsbereiche mit 19 integrierten Agentenfähigkeiten. Google hat gws für Google Workspace veröffentlicht. Das CLI + Skills-Muster wird schnell zum Standard für Agenten-Tools in Unternehmen, nicht zu einer Nischenalternative.</p>
<p>Bei Zilliz haben wir <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> veröffentlicht, mit dem Sie <a href="https://milvus.io/intro">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (vollständig verwaltetes Milvus) direkt von Ihrem Terminal aus bedienen und verwalten können, ohne Ihre Programmierumgebung zu verlassen. Darüber hinaus haben wir <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> und <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>entwickelt, damit KI-Codieragenten wie Claude Code und Codex Ihre <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> über natürliche Sprache verwalten können.</p>
<p>Vor einem Jahr haben wir auch einen MCP-Server für Milvus und Zilliz Cloud entwickelt. Diese Erfahrung hat uns genau gezeigt, wo MCP versagt - und wo es noch passt. Drei architektonische Einschränkungen haben uns zu CLI und Skills getrieben: Aufblähung des Kontextfensters, passives Tool-Design und die Unfähigkeit, die eigene LLM des Agenten wiederzuverwenden.</p>
<p>In diesem Beitrag gehen wir auf jedes Problem ein, zeigen, was wir stattdessen bauen, und legen einen praktischen Rahmen für die Wahl zwischen MCP, CLI und Agent Skills fest.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP beansprucht beim Start 72 % des Kontextfensters<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Standard-MCP-Setup kann etwa 72 % des verfügbaren Kontextfensters belegen, bevor der Agent eine einzige Aktion ausführt. Verbinden Sie drei Server - GitHub, Playwright und eine IDE-Integration - mit einem 200K-Token-Modell, und allein die Werkzeugdefinitionen belegen etwa 143K Token. Der Agent hat noch nichts getan. Er ist bereits zu drei Vierteln ausgelastet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Kosten bestehen nicht nur aus Token. Je mehr unzusammenhängende Inhalte in den Kontext gepackt werden, desto weniger konzentriert sich das Modell auf das, was wirklich wichtig ist. Hundert Werkzeugschemata im Kontext bedeuten, dass sich der Agent bei jeder Entscheidung durch all diese Schemata wühlen muss. Forscher haben dokumentiert, was sie als <em>Kontextfäule</em> bezeichnen - eine verminderte Qualität der Argumentation aufgrund von Kontextüberlastung. In gemessenen Tests fiel die Genauigkeit der Werkzeugauswahl von 43 % auf unter 14 %, wenn die Anzahl der Werkzeuge zunahm. Mehr Tools bedeuten paradoxerweise eine schlechtere Nutzung der Tools.</p>
<p>Die Ursache dafür ist architektonischer Natur. MCP lädt alle Werkzeugbeschreibungen zu Beginn der Sitzung vollständig, unabhängig davon, ob sie in der aktuellen Konversation jemals verwendet werden. Das ist eine Designentscheidung auf Protokollebene, kein Fehler - aber die Kosten steigen mit jedem Tool, das Sie hinzufügen.</p>
<p>Agentenfähigkeiten verfolgen einen anderen Ansatz: <strong>progressive Offenlegung</strong>. Zu Beginn der Sitzung liest ein Agent nur die Metadaten der einzelnen Skills - Name, einzeilige Beschreibung, Auslösebedingung. Insgesamt ein paar Dutzend Token. Der vollständige Skill-Inhalt wird nur geladen, wenn der Agent ihn für relevant hält. Stellen Sie sich das folgendermaßen vor: MCP stellt jedes Tool vor die Tür und zwingt Sie zur Auswahl; mit Skills erhalten Sie zunächst einen Index und bei Bedarf den vollständigen Inhalt.</p>
<p>CLI-Tools bieten einen ähnlichen Vorteil. Ein Agent führt git --help oder docker --help aus, um Fähigkeiten bei Bedarf zu entdecken, ohne jede Parameterdefinition im Voraus zu laden. Die Kosten für den Kontext werden nach und nach bezahlt, nicht im Voraus.</p>
<p>In einem kleinen Maßstab ist der Unterschied vernachlässigbar. Im Produktionsmaßstab ist es der Unterschied zwischen einem funktionierenden Agenten und einem Agenten, der in seinen eigenen Tooldefinitionen ertrinkt.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">Die passive Architektur von MCP schränkt die Arbeitsabläufe von Agenten ein<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP ist ein Protokoll zum Aufrufen von Tools: wie man Tools erkennt, sie aufruft und die Ergebnisse erhält. Ein sauberes Design für einfache Anwendungsfälle. Aber diese Klarheit ist auch eine Einschränkung.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Flacher Werkzeugraum ohne Hierarchie</h3><p>Ein MCP-Werkzeug ist eine flache Funktionssignatur. Keine Unterbefehle, keine Kenntnis des Sitzungslebenszyklus, kein Gefühl dafür, wo sich der Agent in einem mehrstufigen Arbeitsablauf befindet. Es wartet darauf, aufgerufen zu werden. Das ist alles, was es tut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ein CLI funktioniert anders. git commit, git push und git log sind völlig unterschiedliche Ausführungspfade, die sich eine einzige Schnittstelle teilen. Ein Agent führt --help aus, erkundet die verfügbare Oberfläche inkrementell und erweitert nur das, was er braucht - ohne die gesamte Parameterdokumentation in den Kontext einzubinden.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Skills kodieren Workflow-Logik - MCP kann das nicht</h3><p>Ein Agenten-Skill ist eine Markdown-Datei, die eine Standardarbeitsanweisung enthält: was zuerst zu tun ist, was als nächstes zu tun ist, wie mit Fehlern umzugehen ist und wann dem Benutzer etwas angezeigt werden soll. Der Agent erhält nicht nur ein Werkzeug, sondern einen ganzen Arbeitsablauf. Die Fertigkeiten bestimmen aktiv, wie sich ein Agent während eines Gesprächs verhält - was er auslöst, was er im Voraus vorbereitet und wie er sich von Fehlern erholt. MCP-Tools können nur warten.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP kann nicht auf das LLM des Agenten zugreifen</h3><p>Dies ist die Einschränkung, die uns eigentlich aufgehalten hat.</p>
<p>Als wir <a href="https://github.com/zilliztech/claude-context">claude-context</a> entwickelt haben - ein MCP-Plugin, das Claude Code und anderen KI-Codieragenten eine <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a> hinzufügt und sie mit tiefem Kontext aus einer gesamten Codebasis ausstattet - wollten wir relevante historische Konversationsschnipsel von Milvus abrufen und sie als Kontext anzeigen. Die <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuche</a> funktionierte. Das Problem war, was wir mit den Ergebnissen machen sollten.</p>
<p>Wenn man die 10 besten Ergebnisse abruft, sind vielleicht 3 davon nützlich. Die anderen 7 sind Rauschen. Gibt man alle 10 an den äußeren Agenten weiter, beeinträchtigt das Rauschen die Antwort. Bei unseren Tests haben wir festgestellt, dass die Antworten durch irrelevante historische Datensätze abgelenkt wurden. Wir mussten filtern, bevor wir die Ergebnisse weitergaben.</p>
<p>Wir haben mehrere Ansätze ausprobiert. Hinzufügen eines Reranking-Schrittes innerhalb des MCP-Servers unter Verwendung eines kleinen Modells: nicht genau genug, und der Relevanzschwellenwert musste auf den jeweiligen Anwendungsfall abgestimmt werden. Verwendung eines großen Modells für das Reranking: technisch einwandfrei, aber ein MCP-Server läuft als separater Prozess ohne Zugriff auf das LLM des äußeren Agenten. Wir müssten einen separaten LLM-Client konfigurieren, einen separaten API-Schlüssel verwalten und einen separaten Aufrufpfad verwalten.</p>
<p>Was wir wollten, war einfach: Der LLM des äußeren Agenten sollte direkt an der Filterentscheidung beteiligt werden. Rufen Sie die Top 10 ab, lassen Sie den Agenten selbst entscheiden, was er behalten möchte, und geben Sie nur die relevanten Ergebnisse zurück. Kein zweites Modell. Keine zusätzlichen API-Schlüssel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP kann dies nicht tun. Die Prozessgrenze zwischen Server und Agent ist auch eine Intelligenzgrenze. Der Server kann das LLM des Agenten nicht nutzen; der Agent kann nicht bestimmen, was innerhalb des Servers geschieht. Gut für einfache CRUD-Tools. In dem Moment, in dem ein Tool eine Entscheidung treffen muss, wird diese Isolation zu einer echten Einschränkung.</p>
<p>Ein Agentenskill löst dieses Problem direkt. Ein Retrieval Skill kann eine Vektorsuche für die Top 10 aufrufen, die Relevanz durch das eigene LLM des Agenten beurteilen lassen und nur das zurückgeben, was passt. Kein zusätzliches Modell. Der Agent führt die Filterung selbst durch.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">Was wir stattdessen mit CLI und Skills entwickelt haben<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir sehen CLI + Skills als die Richtung für die Interaktion zwischen Agent und Tool - nicht nur für den Speicherabruf, sondern für den gesamten Stack. Diese Überzeugung treibt alles an, was wir bauen.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: Eine fähigkeitsbasierte Speicherschicht für KI-Agenten</h3><p>Wir haben <a href="https://github.com/zilliztech/memsearch">memsearch</a> entwickelt, eine Open-Source-Speicherschicht für Claude Code und andere KI-Agenten. Der Skill läuft innerhalb eines Subagenten mit drei Stufen: Milvus führt die anfängliche Vektorsuche für eine breite Entdeckung durch, der eigene LLM des Agenten bewertet die Relevanz und erweitert den Kontext für vielversprechende Treffer, und ein abschließender Drill-down greift nur bei Bedarf auf die ursprünglichen Gespräche zu. Störgeräusche werden auf jeder Stufe aussortiert - zwischengeschalteter Suchmüll erreicht nie das primäre Kontextfenster.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die wichtigste Erkenntnis: Die Intelligenz des Agenten ist Teil der Ausführung des Tools. Der LLM, der sich bereits in der Schleife befindet, übernimmt die Filterung - kein zweites Modell, kein zusätzlicher API-Schlüssel, keine spröde Schwellenwertabstimmung. Dies ist ein spezieller Anwendungsfall - die Abfrage von Konversationskontexten für Kodieragenten - aber die Architektur lässt sich auf jedes Szenario übertragen, in dem ein Tool nicht nur die Ausführung, sondern auch eine Beurteilung benötigt.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills und Plugin für Vektordatenbankoperationen</h3><p>Milvus ist die weltweit am weitesten verbreitete Open-Source-Vektordatenbank mit <a href="https://github.com/milvus-io/milvus">43K+ Sternen auf GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> ist der vollständig verwaltete Service von Milvus mit erweiterten Unternehmensfunktionen und ist viel schneller als Milvus.</p>
<p>Die oben erwähnte mehrschichtige Architektur steuert auch unsere Entwickler-Tools:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> ist die Infrastrukturschicht. Cluster-Management, <a href="https://milvus.io/docs/manage-collections.md">Sammeloperationen</a>, Vektorsuche, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, Backups, Abrechnung - alles, was Sie in der Zilliz-Cloud-Konsole tun würden, ist über das Terminal verfügbar. Menschen und Agenten verwenden die gleichen Befehle. Zilliz CLI dient auch als Grundlage für Milvus Skills und Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> ist die Wissensschicht für Open-Source Milvus. Es lehrt KI-Coding-Agenten (Claude Code, Cursor, Codex, GitHub Copilot), jede Milvus-Bereitstellung - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone oder Distributed - durch <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a> Python-Code zu bedienen: Verbindungen, <a href="https://milvus.io/docs/schema-hands-on.md">Schema-Design</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">Hybrid-Suche</a>, <a href="https://milvus.io/docs/full-text-search.md">Volltextsuche</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipelines</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> tut dasselbe für Zilliz Cloud, indem es Agenten lehrt, die Cloud-Infrastruktur durch Zilliz CLI zu verwalten.</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Plugin</a> ist die Entwicklererfahrungsschicht für Claude Code - verpackt CLI + Skill in eine geführte Erfahrung mit Slash-Befehlen wie /zilliz:quickstart und /zilliz:status.</li>
</ul>
<p>CLI übernimmt die Ausführung, Skills kodieren Wissen und Workflow-Logik, Plugin liefert die UX. Kein MCP-Server in der Schleife.</p>
<p>Weitere Details finden Sie in diesen Ressourcen:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Einführung in Zilliz CLI und Agent Skills für Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud ist gerade in Claude Code gelandet</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI Prompts - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI-Referenz - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz-Fähigkeit - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus für KI-Agenten - Milvus-Dokumentation</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">Stirbt MCP tatsächlich aus?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele Entwickler und Unternehmen, einschließlich uns hier bei Zilliz, wenden sich CLI und Skills zu. Aber ist MCP wirklich am Aussterben?</p>
<p>Die kurze Antwort lautet: Nein - aber der Bereich, in dem es eingesetzt wird, schrumpft.</p>
<p>MCP wurde an die Linux Foundation gespendet. Die Zahl der aktiven Server liegt bei über 10.000. Die monatlichen SDK-Downloads liegen bei 97 Millionen. Ein Ökosystem dieser Größe verschwindet nicht wegen eines Konferenzkommentars.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ein Thread auf Hacker News - <em>"Wann macht MCP gegenüber CLI Sinn?"</em> - zog Antworten nach sich, die meist zugunsten von CLI ausfielen: "CLI-Tools sind wie Präzisionsinstrumente", "CLIs fühlen sich auch flotter an als MCPs." Einige Entwickler vertreten eine ausgewogenere Ansicht: Skills sind ein detailliertes Rezept, das Ihnen hilft, ein Problem besser zu lösen; MCP ist das Werkzeug, das Ihnen hilft, das Problem zu lösen. Beide haben ihren Platz.</p>
<p>Das ist fair - aber es wirft eine praktische Frage auf. Wenn das Rezept selbst dem Agenten vorgibt, welche Werkzeuge er wie verwenden soll, ist dann noch ein separates Protokoll für die Verteilung der Werkzeuge erforderlich?</p>
<p>Das kommt auf den Anwendungsfall an.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bei<strong>MCP über stdio</strong> - der Version, die die meisten Entwickler lokal ausführen - häufen sich die Probleme: instabile Kommunikation zwischen den Prozessen, unsaubere Isolierung der Umgebung, hoher Token-Overhead. In diesem Zusammenhang gibt es für fast jeden Anwendungsfall bessere Alternativen.</p>
<p><strong>MCP über HTTP</strong> ist eine andere Geschichte. Unternehmensinterne Tooling-Plattformen benötigen eine zentralisierte Rechteverwaltung, einheitliches OAuth, standardisierte Telemetrie und Protokollierung. Fragmentierte CLI-Tools können dies nur schwer leisten. Die zentralisierte Architektur von MCP hat in diesem Zusammenhang einen echten Wert.</p>
<p>Was Perplexity tatsächlich fallen ließ, war in erster Linie der Anwendungsfall stdio. Denis Yarats spezifizierte "intern" und forderte nicht die branchenweite Übernahme dieser Entscheidung. Diese Nuance ging bei der Übertragung verloren - "Perplexity gibt MCP auf" verbreitete sich wesentlich schneller als "Perplexity gibt MCP für die interne Tool-Integration den Vorzug vor stdio".</p>
<p>MCP ist entstanden, weil es ein echtes Problem gelöst hat: Vor MCP hat jede KI-Anwendung ihre eigene Logik für den Aufruf von Tools geschrieben, ohne einen gemeinsamen Standard. MCP bot zum richtigen Zeitpunkt eine einheitliche Schnittstelle, und das Ökosystem entwickelte sich schnell. Die Produktionserfahrung hat dann die Grenzen aufgezeigt. Das ist eine normale Entwicklung für Infrastruktur-Tools - und kein Todesurteil.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Wann sollte man MCP, CLI oder Skills verwenden?<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP über stdio (lokal)</th><th>MCP über HTTP (Unternehmen)</th></tr>
</thead>
<tbody>
<tr><td><strong>Authentifizierung</strong></td><td>Keine</td><td>OAuth, zentralisiert</td></tr>
<tr><td><strong>Stabilität der Verbindung</strong></td><td>Probleme mit der Prozessisolierung</td><td>Stabiles HTTPS</td></tr>
<tr><td><strong>Protokollierung</strong></td><td>Kein Standardmechanismus</td><td>Zentralisierte Telemetrie</td></tr>
<tr><td><strong>Zugriffskontrolle</strong></td><td>Keine</td><td>Rollenbasierte Berechtigungen</td></tr>
<tr><td><strong>Unser Standpunkt</strong></td><td>Ersetzen durch CLI + Skills</td><td>Behalten für Unternehmens-Tooling</td></tr>
</tbody>
</table>
<p>Für Teams, die sich für einen <a href="https://zilliz.com/glossary/ai-agents">agentenbasierten KI-Tooling-Stack</a> entscheiden, sind die Schichten wie folgt aufeinander abgestimmt:</p>
<table>
<thead>
<tr><th>Schicht</th><th>Was es tut</th><th>Am besten geeignet für</th><th>Beispiele</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Operative Aufgaben, Infra-Management</td><td>Befehle, die sowohl von Agenten als auch von Menschen ausgeführt werden</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Fertigkeiten</strong></td><td>Agenten-Workflow-Logik, kodiertes Wissen</td><td>Aufgaben, die ein LLM-Urteil erfordern, mehrstufige SOPs</td><td>milvus-Fähigkeit, zilliz-Fähigkeit, memsearch</td></tr>
<tr><td><strong>REST-APIs</strong></td><td>Externe Integrationen</td><td>Verbindung zu Diensten von Drittanbietern</td><td>GitHub-API, Slack-API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Plattformen für Unternehmenstools</td><td>Zentralisierte Autorisierung, Audit-Protokollierung</td><td>Interne Tool-Gateways</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Starten Sie<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Alles, was wir in diesem Artikel besprochen haben, ist heute verfügbar:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - die Skills-basierte Speicherschicht für KI-Agenten. Fügen Sie es in Claude Code oder jeden Agenten ein, der Skills unterstützt.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - verwalte Milvus und Zilliz Cloud von deinem Terminal aus. Installieren Sie es und entdecken Sie die Unterbefehle, die Ihre Agenten verwenden können.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> und <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> - geben Sie Ihrem KI-Agenten natives Wissen über Milvus und Zilliz Cloud.</li>
</ul>
<p>Haben Sie Fragen zur Vektorsuche, zur Agentenarchitektur oder zur Erstellung mit CLI und Skills? Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord-Community</a> bei oder <a href="https://milvus.io/office-hours">buchen Sie eine kostenlose Office Hours-Sitzung</a>, um Ihren Anwendungsfall durchzusprechen.</p>
<p>Bereit zum Bauen? <a href="https://cloud.zilliz.com/signup">Melden Sie sich für die Zilliz Cloud an</a> - neue Konten mit einer Arbeits-E-Mail erhalten 100 $ an kostenlosen Credits. Sie haben bereits ein Konto? <a href="https://cloud.zilliz.com/login">Melden Sie sich hier an</a>.</p>
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">Was ist falsch an MCP für KI-Agenten?</h3><p>MCP hat drei wesentliche architektonische Einschränkungen in der Produktion. Erstens werden alle Toolschemata beim Sitzungsstart in das Kontextfenster geladen - die Verbindung von nur drei MCP-Servern bei einem Modell mit 200.000 Token kann über 70 % des verfügbaren Kontexts verbrauchen, bevor der Agent etwas tut. Zweitens sind MCP-Tools passiv: Sie warten darauf, aufgerufen zu werden, und können keine mehrstufigen Workflows, Fehlerbehandlungslogik oder Standardbetriebsverfahren kodieren. Drittens werden MCP-Server als separate Prozesse ausgeführt, die keinen Zugriff auf die LLM des Agenten haben, so dass jedes Tool, das Entscheidungen treffen muss (z. B. das Filtern von Suchergebnissen nach Relevanz), die Konfiguration eines separaten Modells mit eigenem API-Schlüssel erfordert. Diese Probleme sind bei MCP über stdio am akutesten; MCP über HTTP entschärft einige von ihnen.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">Was ist der Unterschied zwischen MCP und Agent Skills?</h3><p>MCP ist ein Protokoll zum Aufrufen von Tools, das definiert, wie ein Agent externe Tools findet und aufruft. Ein Agent Skill ist eine Markdown-Datei, die eine vollständige Standardarbeitsanweisung enthält - Auslöser, Schritt-für-Schritt-Anweisungen, Fehlerbehandlung und Eskalationsregeln. Der entscheidende architektonische Unterschied: Skills werden innerhalb des Prozesses des Agenten ausgeführt, so dass sie das eigene LLM des Agenten für Entscheidungen wie Relevanzfilterung oder Ergebnis-Reranking nutzen können. MCP-Tools werden in einem separaten Prozess ausgeführt und können nicht auf die Intelligenz des Agenten zugreifen. Skills verwenden außerdem die progressive Offenlegung - nur leichtgewichtige Metadaten werden beim Start geladen, während der gesamte Inhalt bei Bedarf geladen wird - wodurch die Nutzung des Kontextfensters im Vergleich zum Vorabladen des Schemas bei MCP minimal gehalten wird.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">Wann sollte ich dennoch MCP anstelle von CLI oder Skills verwenden?</h3><p>MCP über HTTP ist nach wie vor sinnvoll für Tooling-Plattformen in Unternehmen, in denen Sie zentralisiertes OAuth, rollenbasierte Zugriffskontrolle, standardisierte Telemetrie und Audit-Protokollierung für viele interne Tools benötigen. Fragmentierte CLI-Tools haben Schwierigkeiten, diese Unternehmensanforderungen konsistent zu erfüllen. Für lokale Entwicklungsworkflows - bei denen Agenten mit Tools auf Ihrem Rechner interagieren - bietet CLI + Skills in der Regel eine bessere Leistung, einen geringeren Kontext-Overhead und eine flexiblere Workflow-Logik als MCP über stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">Wie arbeiten CLI-Tools und Agent Skills zusammen?</h3><p>CLI liefert die Ausführungsschicht (die eigentlichen Befehle), während Skills die Wissensschicht liefern (wann welche Befehle in welcher Reihenfolge auszuführen sind und wie mit Fehlern umzugehen ist). Zilliz CLI verwaltet zum Beispiel Infrastrukturoperationen wie Cluster Management, Collection CRUD und Vektorsuche. Milvus Skill bringt dem Agenten die richtigen Pymilvus-Muster für Schemadesign, hybride Suche und RAG-Pipelines bei. Die CLI macht die Arbeit, der Skill kennt den Workflow. Dieses mehrschichtige Muster - CLI für die Ausführung, Skills für das Wissen, ein Plugin für die UX - ist die Art und Weise, wie wir unser gesamtes Entwickler-Tooling bei Zilliz strukturiert haben.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs. Skills vs. CLI: Wann sollte ich welche verwenden?</h3><p>CLI-Tools wie Git, Docker oder zilliz-cli eignen sich am besten für operative Aufgaben - sie stellen hierarchische Unterbefehle zur Verfügung und werden bei Bedarf geladen. Skills wie milvus-skill eignen sich am besten für die Workflow-Logik des Agenten - sie enthalten Betriebsverfahren, Fehlerbehebung und können auf das LLM des Agenten zugreifen. MCP über HTTP eignet sich immer noch für Unternehmens-Tool-Plattformen, die zentralisiertes OAuth, Berechtigungen und Audit-Protokollierung benötigen. MCP über stdio - die lokale Version - wird in den meisten Produktionskonfigurationen durch CLI + Skills ersetzt.</p>
