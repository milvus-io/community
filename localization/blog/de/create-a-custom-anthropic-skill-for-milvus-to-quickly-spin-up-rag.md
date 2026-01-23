---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Wie anthropische Fähigkeiten das Agententooling verändern - und wie man eine
  benutzerdefinierte Fähigkeit für Milvus erstellt, um RAG schnell zu entwickeln
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Erfahren Sie, was Skills sind und wie Sie einen benutzerdefinierten Skill in
  Claude Code erstellen, der Milvus-gestützte RAG-Systeme aus
  natürlichsprachlichen Anweisungen mit Hilfe eines wiederverwendbaren Workflows
  erstellt.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>Die Verwendung von Tools ist ein wichtiger Bestandteil der Arbeit eines Agenten. Der Agent muss das richtige Tool auswählen, entscheiden, wann er es aufruft, und die Eingaben richtig formatieren. Auf dem Papier hört sich das einfach an, aber wenn man erst einmal anfängt, echte Systeme zu bauen, findet man eine Menge Randfälle und Fehlermöglichkeiten.</p>
<p>Viele Teams verwenden Werkzeugdefinitionen im Stil von MCP, um dies zu organisieren, aber MCP hat einige raue Kanten. Das Modell muss über alle Werkzeuge gleichzeitig nachdenken, und es gibt nicht viel Struktur, um seine Entscheidungen zu steuern. Darüber hinaus muss jede Werkzeugdefinition im Kontextfenster angezeigt werden. Einige davon sind sehr umfangreich - das GitHub MCP umfasst etwa 26.000 Token - was den Kontext auffrisst, bevor der Agent überhaupt mit der eigentlichen Arbeit beginnt.</p>
<p>Anthropic hat <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>Skills</strong></a> eingeführt, um diese Situation zu verbessern. Skills sind kleiner, fokussierter und können bei Bedarf leichter geladen werden. Anstatt alles in den Kontext zu packen, packen Sie Domänenlogik, Workflows oder Skripte in kompakte Einheiten, die der Agent nur bei Bedarf abrufen kann.</p>
<p>In diesem Beitrag erkläre ich, wie Anthropic Skills funktionieren und führe dann durch die Erstellung eines einfachen Skills in Claude Code, der natürliche Sprache in eine <a href="https://milvus.io/">Milvus-gestützte</a> Wissensbasis umwandelt - eine schnelle Einrichtung für RAG ohne zusätzliche Verkabelung.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">Was sind Anthropic Skills?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Anthropic Skills</a> (oder Agent Skills) sind einfach Ordner, die die Anweisungen, Skripte und Referenzdateien bündeln, die ein Agent benötigt, um eine bestimmte Aufgabe zu erledigen. Man kann sie sich als kleine, in sich geschlossene Kompetenzpakete vorstellen. Ein Skill kann definieren, wie ein Bericht zu erstellen ist, wie eine Analyse durchzuführen ist oder wie ein bestimmter Arbeitsablauf oder eine Reihe von Regeln zu befolgen ist.</p>
<p>Der Kerngedanke ist, dass Skills modular sind und bei Bedarf geladen werden können. Anstatt riesige Tooldefinitionen in das Kontextfenster zu packen, zieht der Agent nur den Skill heran, den er benötigt. Auf diese Weise wird der Kontextverbrauch gering gehalten, während dem Modell eine klare Anleitung gegeben wird, welche Werkzeuge vorhanden sind, wann sie aufgerufen werden müssen und wie jeder Schritt auszuführen ist.</p>
<p>Das Format ist absichtlich einfach gehalten und wird daher bereits von einer Reihe von Entwickler-Tools unterstützt oder leicht angepasst - Claude Code, Cursor, VS Code-Erweiterungen, GitHub-Integrationen, Codex-ähnliche Setups und so weiter.</p>
<p>Ein Skill folgt einer einheitlichen Ordnerstruktur:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Core File)</strong></p>
<p>Dies ist die Ausführungsanleitung für den Agenten - das Dokument, das dem Agenten genau sagt, wie die Aufgabe ausgeführt werden soll. Sie definiert die Metadaten des Skills (wie Name, Beschreibung und Auslöseschlüsselwörter), den Ausführungsablauf und die Standardeinstellungen. In dieser Datei sollten Sie klar beschreiben:</p>
<ul>
<li><p><strong>Wann der Skill ausgeführt werden soll:</strong> Lösen Sie den Skill zum Beispiel aus, wenn die Benutzereingabe einen Satz wie "CSV-Dateien mit Python verarbeiten" enthält.</p></li>
<li><p><strong>Wie die Aufgabe ausgeführt werden soll:</strong> Legen Sie die Ausführungsschritte der Reihe nach fest, z. B.: Interpretieren der Benutzeranfrage → Aufrufen von Vorverarbeitungsskripten aus dem Verzeichnis <code translate="no">scripts/</code> → Generieren des erforderlichen Codes → Formatieren der Ausgabe mithilfe von Vorlagen aus <code translate="no">templates/</code>.</p></li>
<li><p><strong>Regeln und Beschränkungen:</strong> Spezifizieren Sie Details wie Kodierungskonventionen, Ausgabeformate und die Behandlung von Fehlern.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Ausführungsskripte)</strong></p>
<p>Dieses Verzeichnis enthält vorgefertigte Skripte in Sprachen wie Python, Shell oder Node.js. Der Agent kann diese Skripte direkt aufrufen, anstatt denselben Code zur Laufzeit wiederholt zu generieren. Typische Beispiele sind <code translate="no">create_collection.py</code> und <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Dokumentvorlagen)</strong></p>
<p>Wiederverwendbare Vorlagendateien, die der Agent verwenden kann, um angepasste Inhalte zu generieren. Übliche Beispiele sind Berichtsvorlagen oder Konfigurationsvorlagen.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Referenzmaterialien)</strong></p>
<p>Referenzdokumente, die der Agent während der Ausführung konsultieren kann, z. B. API-Dokumentation, technische Spezifikationen oder Leitfäden für bewährte Praktiken.</p>
<p>Insgesamt spiegelt diese Struktur wider, wie die Arbeit an einen neuen Teammitglied übergeben wird: <code translate="no">SKILL.md</code> erklärt die Aufgabe, <code translate="no">scripts/</code> stellt gebrauchsfertige Tools bereit, <code translate="no">templates/</code> definiert Standardformate und <code translate="no">resources/</code> liefert Hintergrundinformationen. Wenn all dies vorhanden ist, kann der Agent die Aufgabe zuverlässig und mit minimalem Rätselraten ausführen.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Praktisches Tutorial: Erstellen eines benutzerdefinierten Skills für ein Milvus-gestütztes RAG-System<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Abschnitt wird eine benutzerdefinierte Fertigkeit erstellt, die eine Milvus-Sammlung einrichten und eine vollständige RAG-Pipeline aus einfachen Anweisungen in natürlicher Sprache zusammenstellen kann. Das Ziel ist es, die gesamte übliche Einrichtungsarbeit zu überspringen - kein manuelles Schema-Design, keine Index-Konfiguration, kein Boilerplate-Code. Sie sagen dem Agenten, was Sie wollen, und der Skill erledigt die Milvus-Teile für Sie.</p>
<h3 id="Design-Overview" class="common-anchor-header">Design-Übersicht</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><table>
<thead>
<tr><th>Komponente</th><th>Anforderung</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Modelle</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Behälter</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Plattform für Modellkonfiguration</td><td>CC-Schalter</td></tr>
<tr><td>Paket-Manager</td><td>npm</td></tr>
<tr><td>Entwicklungssprache</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Schritt 1: Einrichtung der Umgebung</h3><p><strong>Installieren Sie</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>CC-Switch installieren</strong></p>
<p><strong>Hinweis:</strong> CC-Switch ist ein Tool zum Umschalten von Modellen, das es einfach macht, zwischen verschiedenen Modell-APIs zu wechseln, wenn KI-Modelle lokal ausgeführt werden.</p>
<p>Projekt-Repository: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Wählen Sie Claude und fügen Sie einen API-Schlüssel hinzu</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Prüfen Sie den aktuellen Status</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus-Standalone bereitstellen und starten</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Konfigurieren Sie den OpenAI-API-Schlüssel</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Schritt 2: Erstellen der benutzerdefinierten Fertigkeit für Milvus</h3><p><strong>Erstellen Sie die Verzeichnisstruktur</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Initialisieren von</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Hinweis:</strong> SKILL.md dient als Ausführungsanleitung für den Agenten. Sie definiert, was der Skill tut und wie er ausgelöst werden soll.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Schreiben Sie die Kernskripte</strong></p>
<table>
<thead>
<tr><th>Skript-Typ</th><th>Name der Datei</th><th>Zweck</th></tr>
</thead>
<tbody>
<tr><td>Umgebungsprüfung</td><td><code translate="no">check_env.py</code></td><td>Überprüft die Python-Version, erforderliche Abhängigkeiten und die Milvus-Verbindung</td></tr>
<tr><td>Intent-Parsing</td><td><code translate="no">intent_parser.py</code></td><td>Konvertiert Anfragen wie "Erstelle eine RAG-Datenbank" in eine strukturierte Absicht wie <code translate="no">scene=rag</code></td></tr>
<tr><td>Erstellung von Sammlungen</td><td><code translate="no">milvus_builder.py</code></td><td>Der Core Builder, der das Sammlungsschema und die Indexkonfiguration erstellt</td></tr>
<tr><td>Dateneingabe</td><td><code translate="no">insert_milvus_data.py</code></td><td>Lädt Dokumente, chunct sie, erzeugt Einbettungen und schreibt Daten in Milvus</td></tr>
<tr><td>Beispiel 1</td><td><code translate="no">basic_text_search.py</code></td><td>Zeigt, wie man ein Dokumentensuchsystem erstellt</td></tr>
<tr><td>Beispiel 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Zeigt, wie man eine komplette RAG-Wissensdatenbank aufbaut</td></tr>
</tbody>
</table>
<p>Diese Skripte zeigen, wie man einen auf Milvus fokussierten Skill in etwas Praktisches umwandelt: ein funktionierendes Dokumentensuchsystem und eine intelligente Q&amp;A (RAG) Einrichtung.</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Schritt 3: Aktivieren Sie den Skill und führen Sie einen Test durch</h3><p><strong>Beschreiben Sie die Anfrage in natürlicher Sprache</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>RAG-System erstellt</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Beispieldaten einfügen</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Eine Abfrage ausführen</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>In diesem Tutorial haben wir den Aufbau eines Milvus-gestützten RAG-Systems mithilfe eines benutzerdefinierten Skills erläutert. Das Ziel war nicht nur, eine weitere Möglichkeit zu zeigen, Milvus aufzurufen, sondern auch zu zeigen, wie Skills ein normalerweise mehrstufiges, konfigurationslastiges Setup in etwas verwandeln können, das Sie wiederverwenden und wiederholen können. Anstatt Schemata manuell zu definieren, Indizes abzustimmen oder Workflow-Code zusammenzufügen, übernimmt der Skill den größten Teil der Formalitäten, so dass Sie sich auf die Teile von RAG konzentrieren können, die wirklich wichtig sind.</p>
<p>Dies ist nur der Anfang. Eine vollständige RAG-Pipeline hat viele bewegliche Teile: Preprocessing, Chunking, hybride Sucheinstellungen, Reranking, Auswertung und mehr. Alle diese Teile können als separate Skills verpackt und je nach Anwendungsfall zusammengestellt werden. Wenn Ihr Team über interne Standards für Vektordimensionen, Indexparameter, Eingabeaufforderungsvorlagen oder Abfragelogik verfügt, sind Skills eine saubere Möglichkeit, dieses Wissen zu kodieren und es wiederholbar zu machen.</p>
<p>Für neue Entwickler senkt dies die Einstiegshürde - sie müssen nicht jedes Detail von Milvus lernen, bevor sie etwas zum Laufen bringen. Für erfahrene Teams verringert sich der Aufwand für die wiederholte Einrichtung und hilft, Projekte in verschiedenen Umgebungen konsistent zu halten. Fertigkeiten ersetzen kein durchdachtes Systemdesign, aber sie beseitigen eine Menge unnötiger Reibungen.</p>
<p>👉 Die vollständige Implementierung ist im <a href="https://github.com/yinmin2020/open-milvus-skills">Open-Source-Repository</a> verfügbar, und Sie können weitere von der Community erstellte Beispiele auf dem <a href="https://skillsmp.com/">Skill-Marktplatz</a> entdecken.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Bleiben Sie dran!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir arbeiten auch an der Einführung offizieller Milvus- und Zilliz-Cloud-Skills, die gängige RAG-Muster und Best Practices für die Produktion abdecken. Wenn Sie Ideen oder spezifische Workflows haben, die Sie unterstützen möchten, treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> bei und chatten Sie mit unseren Ingenieuren. Und wenn Sie eine Anleitung für Ihr eigenes Setup benötigen, können Sie jederzeit eine <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> buchen.</p>
