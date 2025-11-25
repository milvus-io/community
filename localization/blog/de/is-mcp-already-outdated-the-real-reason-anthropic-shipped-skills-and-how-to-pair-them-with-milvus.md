---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  Ist MCP bereits veraltet? Der wahre Grund, warum Anthropic Skills ausgeliefert
  hat - und wie man sie mit Milvus koppelt
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_162fd27dc1.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Erfahren Sie, wie Skills den Tokenverbrauch reduziert und wie Skills und MCP
  mit Milvus zusammenarbeiten, um KI-Workflows zu verbessern.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>In den letzten Wochen ist bei X und Hacker News ein überraschend hitziger Streit ausgebrochen: <em>Brauchen wir MCP-Server überhaupt noch?</em> Einige Entwickler behaupten, MCP sei übertechnisiert, Token-hungrig und grundlegend falsch darauf ausgerichtet, wie Agenten Tools verwenden sollten. Andere verteidigen MCP als zuverlässigen Weg, um Sprachmodellen reale Fähigkeiten zur Verfügung zu stellen. Je nachdem, welchen Thread man liest, ist MCP entweder die Zukunft der Werkzeugnutzung - oder der Tod bei der Ankunft.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Frustration ist verständlich. MCP ermöglicht einen robusten Zugriff auf externe Systeme, zwingt das Modell aber auch dazu, lange Schemata, ausführliche Beschreibungen und umfangreiche Werkzeuglisten zu laden. Das verursacht echte Kosten. Wenn Sie eine Besprechungsmitschrift herunterladen und sie später in ein anderes Tool einspeisen, verarbeitet das Modell denselben Text möglicherweise mehrmals, was den Token-Verbrauch ohne offensichtlichen Nutzen in die Höhe treibt. Für Teams, die in großem Umfang arbeiten, ist dies keine Unannehmlichkeit, sondern eine Rechnung.</p>
<p>Aber MCP für veraltet zu erklären, ist verfrüht. Anthropic - dasselbe Team, das MCP erfunden hat - hat in aller Stille etwas Neues eingeführt: <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Skills sind leichtgewichtige Markdown/YAML-Definitionen, die beschreiben, <em>wie</em> und <em>wann</em> ein Tool verwendet werden sollte. Anstatt vollständige Schemata in das Kontextfenster zu entladen, liest das Modell zunächst kompakte Metadaten und nutzt diese zur Planung. In der Praxis reduzieren Skills den Token-Overhead drastisch und geben Entwicklern mehr Kontrolle über die Tool-Orchestrierung.</p>
<p>Bedeutet dies also, dass Skills MCP ersetzen werden? Nicht ganz. Skills rationalisieren die Planung, aber MCP bietet nach wie vor die eigentlichen Funktionen: das Lesen von Dateien, das Aufrufen von APIs, die Interaktion mit Speichersystemen oder die Einbindung in eine externe Infrastruktur wie <a href="https://milvus.io/"><strong>Milvus</strong></a>, eine Open-Source-Vektordatenbank, die eine schnelle semantische Abfrage im großen Maßstab ermöglicht und damit ein wichtiges Backend darstellt, wenn Ihre Skills echten Datenzugriff benötigen.</p>
<p>Dieser Beitrag zeigt auf, was Skills gut können, wo MCP noch wichtig ist und wie beide in die sich entwickelnde Agentenarchitektur von Anthropic passen. Anschließend wird erläutert, wie Sie Ihre eigenen Skills erstellen können, die sich nahtlos in Milvus integrieren lassen.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Was sind Anthropic Agent Skills und wie funktionieren sie?<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein langjähriger Schmerzpunkt traditioneller KI-Agenten ist, dass Anweisungen mit zunehmender Konversation verwaschen werden.</p>
<p>Selbst bei den sorgfältigsten Systemaufforderungen kann das Verhalten des Modells im Laufe des Gesprächs allmählich abdriften. Nach mehreren Runden vergisst Claude die ursprünglichen Anweisungen oder verliert sie aus den Augen.</p>
<p>Das Problem liegt in der Struktur der Systemaufforderung. Es handelt sich um eine einmalige, statische Einblendung, die neben dem Gesprächsverlauf, den Dokumenten und allen anderen Eingaben um Platz im Kontextfenster des Modells konkurriert. Je mehr sich das Kontextfenster füllt, desto weniger Aufmerksamkeit schenkt das Modell dem Systemprompt, was im Laufe der Zeit zu einem Verlust an Konsistenz führt.</p>
<p>Skills wurden entwickelt, um dieses Problem zu lösen. Skills sind Ordner, die Anweisungen, Skripte und Ressourcen enthalten. Anstatt sich auf eine statische Eingabeaufforderung des Systems zu verlassen, gliedern Fertigkeiten das Fachwissen in modulare, wiederverwendbare und beständige Anweisungspakete, die Claude entdecken und dynamisch laden kann, wenn er sie für eine Aufgabe benötigt.</p>
<p>Wenn Claude mit einer Aufgabe beginnt, führt es zunächst einen leichtgewichtigen Scan aller verfügbaren Skills durch, indem es nur deren YAML-Metadaten liest (nur ein paar Dutzend Token). Diese Metadaten liefern Claude gerade genug Informationen, um festzustellen, ob ein Skill für die aktuelle Aufgabe relevant ist. Ist dies der Fall, erweitert Claude den vollständigen Satz von Anweisungen (in der Regel unter 5k Token), und zusätzliche Ressourcen oder Skripte werden nur bei Bedarf geladen.</p>
<p>Durch diese schrittweise Offenlegung kann Claude einen Skill mit nur 30-50 Token initialisieren, was die Effizienz erheblich verbessert und unnötigen Kontext-Overhead reduziert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Skills im Vergleich zu Prompts, Projekten, MCP und Subagenten<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Die heutige Modell-Tooling-Landschaft kann sich überfüllt anfühlen. Sogar innerhalb des agentenbasierten Ökosystems von Claude gibt es mehrere unterschiedliche Komponenten: Skills, Prompts, Projekte, Subagenten und MCP.</p>
<p>Da wir nun wissen, was Skills sind und wie sie durch modulare Anweisungspakete und dynamisches Laden funktionieren, müssen wir wissen, wie Skills mit anderen Teilen des Claude-Ökosystems zusammenhängen, insbesondere mit MCP. Hier ist eine Zusammenfassung:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Skills</h3><p>Skills sind Ordner, die Anweisungen, Skripte und Ressourcen enthalten. Claude erkennt und lädt sie dynamisch unter Verwendung der progressiven Offenlegung: zuerst die Metadaten, dann die vollständigen Anweisungen und schließlich alle erforderlichen Dateien.</p>
<p><strong>Am besten geeignet für:</strong></p>
<ul>
<li><p>Organisatorische Arbeitsabläufe (Markenrichtlinien, Compliance-Verfahren)</p></li>
<li><p>Fachwissen (Excel-Formeln, Datenanalyse)</p></li>
<li><p>Persönliche Vorlieben (Notizensysteme, Codierungsmuster)</p></li>
<li><p>Professionelle Aufgaben, die über Konversationen hinweg wiederverwendet werden müssen (OWASP-basierte Code-Sicherheitsüberprüfungen)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Eingabeaufforderungen</h3><p>Prompts sind Anweisungen in natürlicher Sprache, die Sie Claude innerhalb einer Konversation geben. Sie sind temporär und existieren nur in der aktuellen Konversation.</p>
<p><strong>Am besten geeignet für:</strong></p>
<ul>
<li><p>Einmalige Anfragen (einen Artikel zusammenfassen, eine Liste formatieren)</p></li>
<li><p>Verfeinerung der Konversation (Tonfall anpassen, Details hinzufügen)</p></li>
<li><p>Unmittelbarer Kontext (Analyse bestimmter Daten, Interpretation von Inhalten)</p></li>
<li><p>Ad-hoc-Anweisungen</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Projekte</h3><p>Projekte sind in sich geschlossene Arbeitsbereiche mit eigenen Chatverläufen und Wissensdatenbanken. Jedes Projekt bietet ein 200K-Kontextfenster. Wenn Ihr Projektwissen die Kontextgrenzen erreicht, geht Claude nahtlos in den RAG-Modus über, der eine bis zu 10-fache Erweiterung der effektiven Kapazität ermöglicht.</p>
<p><strong>Am besten geeignet für:</strong></p>
<ul>
<li><p>Dauerhafter Kontext (z. B. alle Gespräche im Zusammenhang mit einer Produkteinführung)</p></li>
<li><p>Organisation des Arbeitsbereichs (separate Kontexte für verschiedene Initiativen)</p></li>
<li><p>Zusammenarbeit im Team (bei Team- und Unternehmensplänen)</p></li>
<li><p>Individuelle Anweisungen (projektspezifischer Ton oder Perspektive)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Unteragenten</h3><p>Unteragenten sind spezialisierte KI-Assistenten mit eigenen Kontextfenstern, benutzerdefinierten Systemaufforderungen und spezifischen Werkzeugberechtigungen. Sie können unabhängig arbeiten und Ergebnisse an den Hauptagenten zurückgeben.</p>
<p><strong>Am besten geeignet für:</strong></p>
<ul>
<li><p>Aufgabenspezialisierung (Code-Review, Testerstellung, Sicherheits-Audits)</p></li>
<li><p>Kontextmanagement (um die Hauptkonversation im Auge zu behalten)</p></li>
<li><p>Parallelverarbeitung (mehrere Unteragenten arbeiten gleichzeitig an verschiedenen Aspekten)</p></li>
<li><p>Tool-Beschränkung (z. B. Nur-Lese-Zugriff)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Modell-Kontext-Protokoll)</h3><p>Das Model Context Protocol (MCP) ist ein offener Standard zur Verbindung von KI-Modellen mit externen Tools und Datenquellen.</p>
<p><strong>Am besten geeignet für:</strong></p>
<ul>
<li><p>Zugriff auf externe Daten (Google Drive, Slack, GitHub, Datenbanken)</p></li>
<li><p>Verwendung von Business-Tools (CRM-Systeme, Projektmanagement-Plattformen)</p></li>
<li><p>Verbindung zu Entwicklungsumgebungen (lokale Dateien, IDEs, Versionskontrolle)</p></li>
<li><p>Integration mit benutzerdefinierten Systemen (proprietäre Tools und Datenquellen)</p></li>
</ul>
<p>Anhand der obigen Ausführungen können wir erkennen, dass Skills und MCP unterschiedliche Herausforderungen angehen und sich gegenseitig ergänzen.</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>MCP</strong></th><th><strong>Fertigkeiten</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Kernwert</strong></td><td>Verbindet mit externen Systemen (Datenbanken, APIs, SaaS-Plattformen)</td><td>Definiert Verhaltensspezifikationen (wie Daten zu verarbeiten und darzustellen sind)</td></tr>
<tr><td><strong>Beantwortete Fragen</strong></td><td>"Worauf kann Claude zugreifen?"</td><td>"Was soll Claude tun?"</td></tr>
<tr><td><strong>Umsetzung</strong></td><td>Client-Server-Protokoll + JSON-Schema</td><td>Markdown-Datei + YAML-Metadaten</td></tr>
<tr><td><strong>Kontext-Verbrauch</strong></td><td>Zehntausende von Token (mehrere Serveransammlungen)</td><td>30-50 Token pro Vorgang</td></tr>
<tr><td><strong>Anwendungsfälle</strong></td><td>Abfrage großer Datenbanken, Aufruf von GitHub-APIs</td><td>Definition von Suchstrategien, Anwendung von Filterregeln, Ausgabeformatierung</td></tr>
</tbody>
</table>
<p>Nehmen wir die Codesuche als Beispiel.</p>
<ul>
<li><p><strong>MCP (z. B. claude-context):</strong> Bietet die Möglichkeit, auf die Milvus-Vektordatenbank zuzugreifen.</p></li>
<li><p><strong>Fertigkeiten:</strong> Definiert den Arbeitsablauf, z. B. die Priorisierung des zuletzt geänderten Codes, die Sortierung der Ergebnisse nach Relevanz und die Darstellung der Daten in einer Markdown-Tabelle.</p></li>
</ul>
<p>MCP bietet die Fähigkeit, während Skills den Prozess definieren. Zusammen bilden sie ein komplementäres Paar.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Wie man benutzerdefinierte Skills mit Claude-Context und Milvus erstellt<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> ist ein MCP-Plugin, das die semantische Code-Suchfunktionalität zu Claude Code hinzufügt und die gesamte Codebasis in Claudes Kontext verwandelt.</p>
<h3 id="Prerequisite" class="common-anchor-header">Voraussetzung</h3><p>Systemvoraussetzungen:</p>
<ul>
<li><p><strong>Node.js</strong>: Version &gt;= 20.0.0 und &lt; 24.0.0</p></li>
<li><p><strong>OpenAI-API-Schlüssel</strong> (für die Einbettung von Modellen)</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API Key</strong> (verwalteter Milvus Service)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Schritt 1: Konfigurieren Sie den MCP-Dienst (claude-context)</h3><p>Führen Sie den folgenden Befehl im Terminal aus:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Überprüfen Sie die Konfiguration:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die MCP-Einrichtung ist abgeschlossen. Claude kann nun auf die Milvus-Vektordatenbank zugreifen.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Schritt 2: Erstellen Sie den Skill</h3><p>Erstellen Sie das Verzeichnis Skills:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Erstellen Sie die Datei SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Schritt 3: Claude neu starten, um Skills anzuwenden</h3><p>Führen Sie den folgenden Befehl aus, um Claude neu zu starten:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweis:</strong> Nachdem die Konfiguration abgeschlossen ist, können Sie die Skills sofort verwenden, um die Milvus-Codebasis abzufragen.</p>
<p>Nachfolgend finden Sie ein Beispiel, wie das funktioniert.</p>
<p>Abfrage: Wie funktioniert Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Im Kern dienen Skills als Mechanismus zur Kapselung und Weitergabe von Spezialwissen. Durch die Verwendung von Skills kann KI die Erfahrung eines Teams übernehmen und die besten Praktiken der Branche befolgen - sei es eine Checkliste für Code-Reviews oder Dokumentationsstandards. Wenn dieses implizite Wissen durch Markdown-Dateien explizit gemacht wird, kann die Qualität der von der KI erzeugten Ergebnisse erheblich verbessert werden.</p>
<p>Mit Blick auf die Zukunft könnte die Fähigkeit, Skills effektiv zu nutzen, zu einem entscheidenden Unterscheidungsmerkmal dafür werden, wie Teams und Einzelpersonen KI zu ihrem Vorteil nutzen.</p>
<p>Bei der Erkundung des Potenzials von KI in Ihrem Unternehmen ist Milvus ein wichtiges Werkzeug für die Verwaltung und Suche großer Vektordaten. Wenn Sie die leistungsstarke Vektordatenbank von Milvus mit KI-Tools wie Skills kombinieren, können Sie nicht nur Ihre Arbeitsabläufe verbessern, sondern auch die Tiefe und Geschwindigkeit Ihrer datengestützten Erkenntnisse.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei, um mit unseren Ingenieuren und anderen KI-Ingenieuren in der Community zu chatten. Sie können auch ein 20-minütiges persönliches Gespräch buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunde</a> zu erhalten.</p>
