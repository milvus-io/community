---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Erstellung von KI-Agenten in 10 Minuten mit natürlicher Sprache mit LangSmith
  Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Sie mit LangSmith Agent Builder und Milvus in wenigen
  Minuten speicherfähige KI-Agenten erstellen können - ohne Code, in natürlicher
  Sprache und produktionsreif.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>Da die Entwicklung von KI immer schneller voranschreitet, entdecken immer mehr Teams, dass für die Entwicklung eines KI-Assistenten nicht unbedingt ein Hintergrundwissen im Bereich Softwaretechnik erforderlich ist. Die Leute, die Assistenten am meisten brauchen - Produktteams, Betriebsabläufe, Support, Forscher - wissen oft genau, was der Agent tun soll, aber nicht, wie man es in Code umsetzt. Herkömmliche "No-Code"-Tools versuchten, diese Lücke mit Drag-and-Drop-Grafiken zu schließen, aber sie brechen in dem Moment zusammen, in dem Sie echtes Agentenverhalten benötigen: mehrstufiges Denken, Verwendung von Tools oder persistenter Speicher.</p>
<p>Der neu veröffentlichte <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> verfolgt einen anderen Ansatz. Anstatt Workflows zu entwerfen, beschreiben Sie die Ziele des Agenten und die verfügbaren Werkzeuge in einfacher Sprache, und die Laufzeitumgebung übernimmt die Entscheidungsfindung. Keine Flussdiagramme, keine Skripte - nur eine klare Absicht.</p>
<p>Aber Absicht allein macht noch keinen intelligenten Assistenten. Das <strong>Gedächtnis</strong> tut es. Hier bietet <a href="https://milvus.io/"><strong>Milvus</strong></a>, die weit verbreitete Open-Source-Vektordatenbank, die Grundlage. Durch die Speicherung von Dokumenten und Gesprächsverläufen als Einbettungen ermöglicht Milvus Ihrem Agenten, sich an den Kontext zu erinnern, relevante Informationen abzurufen und in großem Umfang präzise zu reagieren.</p>
<p>Dieser Leitfaden zeigt Ihnen, wie Sie mit <strong>LangSmith Agent Builder und Milvus</strong> einen produktionsreifen, speicherfähigen KI-Assistenten erstellen können, ohne eine einzige Zeile Code schreiben zu müssen.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">Was ist LangSmith Agent Builder und wie funktioniert er?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie der Name schon sagt, ist <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> ein No-Code-Tool von LangChain, mit dem Sie KI-Agenten in einfacher Sprache erstellen, einsetzen und verwalten können. Anstatt Logik zu schreiben oder visuelle Abläufe zu entwerfen, erklären Sie, was der Agent tun soll, welche Tools er verwenden kann und wie er sich verhalten soll. Das System kümmert sich dann um den schwierigen Teil - die Erstellung von Eingabeaufforderungen, die Auswahl von Tools, die Verknüpfung von Komponenten und die Aktivierung von Speicher.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Im Gegensatz zu herkömmlichen No-Code- oder Workflow-Tools verfügt Agent Builder nicht über eine Drag-and-Drop-Oberfläche und keine Knotenbibliothek. Sie interagieren mit ihm auf die gleiche Weise wie mit ChatGPT. Beschreiben Sie, was Sie bauen möchten, beantworten Sie ein paar klärende Fragen, und der Builder erstellt einen voll funktionsfähigen Agenten auf der Grundlage Ihrer Absicht.</p>
<p>Hinter den Kulissen wird dieser Agent aus vier Kernbausteinen aufgebaut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Eingabeaufforderung:</strong> Der Prompt ist das Gehirn des Agenten und definiert seine Ziele, Einschränkungen und Entscheidungslogik. LangSmith Agent Builder verwendet Meta-Prompting, um diesen automatisch zu erstellen: Sie beschreiben, was Sie wollen, es werden klärende Fragen gestellt, und Ihre Antworten werden zu einem detaillierten, produktionsreifen Systemprompt zusammengefasst. Anstatt die Logik von Hand zu schreiben, drücken Sie einfach Ihre Absicht aus.</li>
<li><strong>Werkzeuge:</strong> Tools ermöglichen es dem Agenten, Maßnahmen zu ergreifen - das Senden von E-Mails, das Posten auf Slack, das Erstellen von Kalenderereignissen, das Durchsuchen von Daten oder das Aufrufen von APIs. Agent Builder integriert diese Tools über das Model Context Protocol (MCP), das eine sichere, erweiterbare Methode zur Offenlegung von Funktionen bietet. Benutzer können sich auf integrierte Integrationen verlassen oder benutzerdefinierte MCP-Server hinzufügen, darunter Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP-Server</a>für die Vektorsuche und den Langzeitspeicher.</li>
<li><strong>Auslöser:</strong> Auslöser definieren, wann ein Agent ausgeführt wird. Zusätzlich zur manuellen Ausführung können Sie Agenten an Zeitpläne oder externe Ereignisse anhängen, damit sie automatisch auf Nachrichten, E-Mails oder Webhook-Aktivitäten reagieren. Wenn ein Auslöser ausgelöst wird, startet Agent Builder einen neuen Ausführungs-Thread und führt die Logik des Agenten aus, was ein kontinuierliches, ereignisgesteuertes Verhalten ermöglicht.</li>
<li><strong>Unteragenten:</strong> Unteragenten unterteilen komplexe Aufgaben in kleinere, spezialisierte Einheiten. Ein primärer Agent kann die Arbeit an Unteragenten delegieren - jeder mit eigener Eingabeaufforderung und eigenem Toolset -, so dass Aufgaben wie Datenabruf, Zusammenfassung oder Formatierung von speziellen Helfern erledigt werden. Auf diese Weise wird ein einzelner überladener Prompt vermieden und eine modularere, skalierbare Agentenarchitektur geschaffen.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Wie merkt sich ein Agent Ihre Präferenzen?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Was Agent Builder einzigartig macht, ist die Art und Weise, wie er mit dem <em>Speicher</em> umgeht. Anstatt die Einstellungen in den Chatverlauf zu packen, kann der Agent seine eigenen Verhaltensregeln während der Ausführung aktualisieren. Wenn Sie sagen: "Von nun an beende jede Slack-Nachricht mit einem Gedicht", behandelt der Agent dies nicht als einmalige Anforderung, sondern speichert es als dauerhafte Einstellung, die in zukünftigen Ausführungen gilt.</p>
<p>Unter der Haube speichert der Agent eine interne Speicherdatei - im Wesentlichen seine sich entwickelnde Systemeingabeaufforderung. Jedes Mal, wenn er startet, liest er diese Datei, um zu entscheiden, wie er sich verhalten soll. Wenn Sie Korrekturen oder Auflagen machen, bearbeitet der Agent die Datei, indem er strukturierte Regeln hinzufügt, wie z. B. "Schließe das Briefing immer mit einem kurzen, aufmunternden Gedicht ab." Dieser Ansatz ist weitaus stabiler als das Verlassen auf den Gesprächsverlauf, da der Agent seine Betriebsanweisungen aktiv umschreibt, anstatt Ihre Präferenzen in einer Abschrift zu verbergen.</p>
<p>Dieses Design stammt von DeepAgents FilesystemMiddleware, ist aber im Agent Builder vollständig abstrahiert. Sie berühren Dateien nie direkt: Sie drücken Aktualisierungen in natürlicher Sprache aus, und das System erledigt die Änderungen im Hintergrund. Wenn Sie mehr Kontrolle benötigen, können Sie einen benutzerdefinierten MCP-Server einbinden oder die DeepAgents-Schicht für eine erweiterte Speicheranpassung nutzen.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Praktische Demo: Erstellen eines Milvus-Assistenten in 10 Minuten mit Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun die Design-Philosophie hinter Agent Builder erläutert haben, wollen wir den gesamten Erstellungsprozess anhand eines praktischen Beispiels durchlaufen. Unser Ziel ist es, einen intelligenten Assistenten zu erstellen, der technische Fragen zu Milvus beantworten, die offizielle Dokumentation durchsuchen und sich die Präferenzen des Benutzers merken kann.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Schritt 1. Anmeldung bei der LangChain-Website</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Schritt 2. Richten Sie Ihren Anthropic-API-Schlüssel ein</h3><p><strong>Hinweis:</strong> Anthropic wird standardmäßig unterstützt. Sie können auch ein benutzerdefiniertes Modell verwenden, solange dessen Typ in der Liste der offiziell von LangChain unterstützten Modelle enthalten ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Fügen Sie einen API-Schlüssel hinzu</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Geben Sie den API-Schlüssel ein und speichern Sie ihn</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Schritt 3. Erstellen Sie einen neuen Agenten</h3><p><strong>Hinweis:</strong> Klicken Sie auf <strong>Mehr erfahren</strong>, um die Nutzungsdokumentation anzuzeigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Konfigurieren Sie ein benutzerdefiniertes Modell (optional)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Parameter eingeben und speichern</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Schritt 4. Beschreiben Sie Ihre Anforderungen, um den Agenten zu erstellen</h3><p><strong>Hinweis:</strong> Erstellen Sie den Agenten mit einer Beschreibung in natürlicher Sprache.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Das System stellt Folgefragen zur Verfeinerung der Anforderungen</strong></li>
</ol>
<p>Frage 1: Wählen Sie die Milvus-Index-Typen, die sich der Agent merken soll</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Frage 2: Wählen Sie, wie der Agent technische Fragen behandeln soll  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Frage 3: Geben Sie an, ob der Agent sich auf die Anleitung für eine bestimmte Milvus-Version konzentrieren soll  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Schritt 5. Überprüfen und Bestätigen des generierten Agenten</h3><p><strong>Hinweis:</strong> Das System generiert die Agentenkonfiguration automatisch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bevor Sie den Agenten erstellen, können Sie seine Metadaten, Tools und Eingabeaufforderungen überprüfen. Wenn alles korrekt aussieht, klicken Sie auf <strong>Erstellen</strong>, um fortzufahren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Schritt 6. Erkunden Sie die Schnittstelle und die Funktionsbereiche</h3><p>Nachdem der Agent erstellt wurde, sehen Sie drei Funktionsbereiche in der unteren linken Ecke der Benutzeroberfläche:</p>
<p><strong>(1) Auslöser</strong></p>
<p>Auslöser definieren, wann der Agent ausgeführt werden soll, entweder als Reaktion auf externe Ereignisse oder nach einem Zeitplan:</p>
<ul>
<li><strong>Slack:</strong> Aktivieren Sie den Agenten, wenn eine Nachricht in einem bestimmten Kanal eingeht.</li>
<li><strong>Gmail:</strong> Auslösen des Agenten, wenn eine neue E-Mail eingeht</li>
<li><strong>Cron:</strong> Führen Sie den Agenten in einem geplanten Intervall aus</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Werkzeugkasten</strong></p>
<p>Dies ist der Satz von Tools, die der Agent aufrufen kann. Im gezeigten Beispiel werden die drei Tools automatisch während der Erstellung generiert, und Sie können weitere hinzufügen, indem Sie auf <strong>Tool hinzufügen</strong> klicken.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Wenn Ihr Agent Vektorsuchfunktionen benötigt - wie z. B. die semantische Suche in großen Mengen technischer Dokumentation - können Sie den MCP-Server von Milvus einsetzen</strong> und ihn hier über die Schaltfläche <strong>MCP</strong> hinzufügen. Vergewissern Sie sich, dass der MCP-Server <strong>an einem erreichbaren Netzwerkendpunkt</strong> ausgeführt wird; andernfalls kann er von Agent Builder nicht aufgerufen werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Unter-Agenten</strong></p>
<p>Erstellen Sie unabhängige Agentenmodule für bestimmte Teilaufgaben, um ein modulares Systemdesign zu ermöglichen.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Schritt 7. Testen Sie den Agenten</h3><p>Klicken Sie auf <strong>Test</strong> in der oberen rechten Ecke, um den Testmodus zu aktivieren. Nachfolgend sehen Sie ein Beispiel für die Testergebnisse.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents: Welches sollten Sie wählen?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain bietet mehrere Agenten-Frameworks an, und die richtige Wahl hängt davon ab, wie viel Kontrolle Sie benötigen. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> ist ein Werkzeug zur Erstellung von Agenten. Es wird verwendet, um autonome, langlaufende KI-Agenten zu erstellen, die komplexe, mehrstufige Aufgaben bewältigen. Es basiert auf LangGraph und unterstützt fortschrittliche Planung, dateibasiertes Kontextmanagement und die Orchestrierung von Subagenten, was es ideal für Projekte mit langem Zeithorizont oder für die Produktion macht.</p>
<p>Was ist der Unterschied zu <strong>Agent Builder</strong>, und wann sollten Sie beide einsetzen?</p>
<p><strong>Agent Builder</strong> konzentriert sich auf Einfachheit und Geschwindigkeit. Er abstrahiert die meisten Implementierungsdetails und ermöglicht es Ihnen, Ihren Agenten in natürlicher Sprache zu beschreiben, Tools zu konfigurieren und ihn sofort auszuführen. Arbeitsspeicher, Toolverwendung und Arbeitsabläufe, an denen der Mensch beteiligt ist, werden für Sie erledigt. Dadurch eignet sich Agent Builder perfekt für Rapid Prototyping, interne Tools und Validierungen im Frühstadium, bei denen die Benutzerfreundlichkeit wichtiger ist als eine detaillierte Kontrolle.</p>
<p><strong>DeepAgents</strong> hingegen ist für Szenarien konzipiert, in denen Sie die volle Kontrolle über Speicher, Ausführung und Infrastruktur benötigen. Sie können die Middleware anpassen, jedes Python-Tool integrieren, das Speicher-Backend modifizieren (einschließlich der Persistenz des Speichers in <a href="https://milvus.io/blog">Milvus</a>) und den Zustandsgraphen des Agenten explizit verwalten. Der Nachteil ist der technische Aufwand: Sie müssen selbst Code schreiben, Abhängigkeiten verwalten und Fehlermodi handhaben, aber Sie erhalten einen vollständig anpassbaren Agent-Stack.</p>
<p>Wichtig ist, dass <strong>Agent Builder und DeepAgents keine getrennten Ökosysteme sind - sie bilden ein einziges Kontinuum</strong>. Agent Builder ist auf DeepAgents aufgebaut. Das bedeutet, dass Sie mit einem schnellen Prototyp in Agent Builder beginnen und dann zu DeepAgents wechseln können, wenn Sie mehr Flexibilität benötigen, ohne alles von Grund auf neu schreiben zu müssen. Der umgekehrte Weg funktioniert ebenfalls: In DeepAgents erstellte Muster können als Agent Builder-Vorlagen verpackt werden, so dass auch technisch nicht versierte Benutzer sie wiederverwenden können.</p>
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
    </button></h2><p>Dank der Entwicklung der Künstlichen Intelligenz (KI) sind für die Entwicklung von KI-Agenten keine komplexen Arbeitsabläufe oder schweres Engineering mehr erforderlich. Mit LangSmith Agent Builder können Sie zustandsabhängige, langlebige Assistenten allein mit natürlicher Sprache erstellen. Sie konzentrieren sich darauf, zu beschreiben, was der Agent tun soll, während das System die Planung, die Werkzeugausführung und die laufenden Speicheraktualisierungen übernimmt.</p>
<p>In Verbindung mit <a href="https://milvus.io/blog">Milvus</a> erhalten diese Agenten einen zuverlässigen, dauerhaften Speicher für die semantische Suche, die Verfolgung von Präferenzen und den langfristigen Kontext über mehrere Sitzungen hinweg. Ganz gleich, ob Sie eine Idee validieren oder ein skalierbares System bereitstellen möchten, LangSmith Agent Builder und Milvus bieten eine einfache, flexible Grundlage für Agenten, die nicht nur reagieren, sondern sich auch erinnern und mit der Zeit verbessern.</p>
<p>Haben Sie Fragen oder möchten Sie eine ausführliche Einführung? Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>, um eine persönliche Beratung zu erhalten.</p>
