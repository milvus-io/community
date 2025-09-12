---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Erste Schritte mit langgraph-up-react: Eine praktische LangGraph-Vorlage'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  Einführung von langgraph-up-react, einer gebrauchsfertigen LangGraph + ReAct
  Vorlage für ReAct Agenten.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>KI-Agenten entwickeln sich zu einem zentralen Muster in der angewandten KI. Immer mehr Projekte gehen über einzelne Eingabeaufforderungen hinaus und integrieren Modelle in Entscheidungsschleifen. Das ist aufregend, aber es bedeutet auch die Verwaltung von Zuständen, die Koordination von Werkzeugen, die Handhabung von Verzweigungen und das Hinzufügen von menschlichen Übergaben - Dinge, die nicht sofort offensichtlich sind.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> ist eine gute Wahl für diese Ebene. Es ist ein KI-Framework, das Schleifen, Konditionierungen, Persistenz, Human-in-the-Loop-Kontrollen und Streaming bietet - genug Struktur, um eine Idee in eine echte Multi-Agenten-App zu verwandeln. Allerdings hat LangGraph eine steile Lernkurve. Die Dokumentation bewegt sich schnell, die Abstraktionen sind gewöhnungsbedürftig und der Sprung von einer einfachen Demo zu etwas, das sich wie ein Produkt anfühlt, kann frustrierend sein.</p>
<p>Seit kurzem verwende ich <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react - eine</strong></a>gebrauchsfertige LangGraph + ReAct-Vorlage für ReAct-Agenten. Es verkürzt die Einrichtung, wird mit vernünftigen Standardeinstellungen geliefert und ermöglicht es Ihnen, sich auf das Verhalten zu konzentrieren, anstatt auf die Textbausteine. In diesem Beitrag zeige ich Ihnen, wie Sie mit dieser Vorlage in LangGraph einsteigen können.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">ReAct-Agenten verstehen<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir in die Vorlage selbst eintauchen, lohnt es sich, einen Blick auf die Art von Agenten zu werfen, die wir bauen werden. Eines der gebräuchlichsten Muster ist das <strong>ReAct (Reason + Act)</strong> -Framework, das erstmals in Googles 2022 veröffentlichtem Papier <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em> vorgestellt<a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>Die Idee ist einfach: Anstatt Denken und Handeln getrennt zu behandeln, kombiniert ReAct sie in einer Rückkopplungsschleife, die dem menschlichen Problemlösen sehr ähnlich ist. Der Agent <strong>denkt</strong> über das Problem nach, <strong>handelt</strong>, indem er ein Werkzeug oder eine API aufruft, und <strong>beobachtet</strong> dann das Ergebnis, bevor er entscheidet, was er als Nächstes tun soll. Dieser einfache Zyklus - Denken → Handeln → Beobachten - ermöglicht es den Agenten, sich dynamisch anzupassen, anstatt einem festen Skript zu folgen.</p>
<p>So passen die Teile zusammen:</p>
<ul>
<li><p><strong>Vernunft</strong>: Das Modell zerlegt Probleme in Schritte, plant Strategien und kann sogar Fehler auf halbem Weg korrigieren.</p></li>
<li><p><strong>Handeln</strong>: Auf der Grundlage seiner Überlegungen ruft der Agent Tools auf - sei es eine Suchmaschine, ein Taschenrechner oder Ihre eigene benutzerdefinierte API.</p></li>
<li><p><strong>Beobachten</strong>: Der Agent sieht sich die Ausgabe des Tools an, filtert die Ergebnisse und lässt sie in die nächste Runde seiner Überlegungen einfließen.</p></li>
</ul>
<p>Diese Schleife ist schnell zum Rückgrat moderner KI-Agenten geworden. Sie finden Spuren davon in ChatGPT-Plugins, RAG-Pipelines, intelligenten Assistenten und sogar in der Robotik. In unserem Fall ist es die Grundlage, auf der die Vorlage <code translate="no">langgraph-up-react</code> aufbaut.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Verstehen von LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir uns nun das ReAct-Muster angesehen haben, stellt sich die nächste Frage: Wie implementiert man so etwas in der Praxis? Die meisten Sprachmodelle können von Haus aus nicht sehr gut mit mehrstufigen Schlussfolgerungen umgehen. Jeder Aufruf ist zustandslos: Das Modell erzeugt eine Antwort und vergisst alles, sobald es fertig ist. Das macht es schwer, Zwischenergebnisse weiterzugeben oder spätere Schritte auf der Grundlage früherer anzupassen.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> schließt diese Lücke. Anstatt jede Eingabeaufforderung als einmaligen Vorgang zu behandeln, bietet LangGraph eine Möglichkeit, komplexe Aufgaben in einzelne Schritte zu zerlegen, sich zu merken, was an jedem Punkt passiert ist, und auf der Grundlage des aktuellen Zustands zu entscheiden, was als nächstes zu tun ist. Mit anderen Worten: Der Denkprozess eines Agenten wird dadurch strukturiert und wiederholbar, anstatt eine Kette von Ad-hoc-Aufforderungen zu sein.</p>
<p>Man kann es sich wie ein <strong>Flussdiagramm für KI-Schlussfolgerungen</strong> vorstellen:</p>
<ul>
<li><p><strong>Analysieren Sie</strong> die Benutzeranfrage</p></li>
<li><p><strong>Auswahl</strong> des richtigen Werkzeugs für die Aufgabe</p></li>
<li><p><strong>Ausführen</strong> der Aufgabe durch Aufrufen des Tools</p></li>
<li><p><strong>Verarbeiten</strong> der Ergebnisse</p></li>
<li><p><strong>Prüfen Sie</strong>, ob die Aufgabe abgeschlossen ist; wenn nicht, kehren Sie zurück und setzen Sie die Argumentation fort</p></li>
<li><p><strong>Ausgabe</strong> der endgültigen Antwort</p></li>
</ul>
<p>Auf dem Weg dorthin kümmert sich LangGraph um den <strong>Speicher</strong>, damit die Ergebnisse früherer Schritte nicht verloren gehen, und integriert sich in eine <strong>externe Werkzeugbibliothek</strong> (APIs, Datenbanken, Suche, Rechner, Dateisysteme usw.).</p>
<p>Deshalb heißt es auch <em>LangGraph</em>: <strong>Lang (Sprache) + Graph - ein</strong>Rahmen für die Organisation des Denkens und Handelns von Sprachmodellen im Laufe der Zeit.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Verstehen von LangGraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph ist mächtig, aber es ist mit Aufwand verbunden. Das Einrichten der Zustandsverwaltung, das Entwerfen von Knoten und Kanten, das Behandeln von Fehlern und das Einbinden von Modellen und Werkzeugen kostet Zeit. Auch das Debuggen von mehrstufigen Abläufen kann mühsam sein - wenn etwas nicht funktioniert, kann das Problem in jedem beliebigen Knoten oder Übergang liegen. Wenn Projekte wachsen, können sich selbst kleine Änderungen in der Codebasis ausbreiten und alles verlangsamen.</p>
<p>Hier macht eine ausgereifte Vorlage einen großen Unterschied. Anstatt bei Null anzufangen, erhalten Sie mit einer Vorlage eine bewährte Struktur, vorgefertigte Tools und Skripte, die einfach funktionieren. Man überspringt den Ballast und konzentriert sich direkt auf die Agentenlogik.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> ist eine solche Vorlage. Sie soll Ihnen helfen, einen LangGraph ReAct-Agenten schnell und einfach zu erstellen:</p>
<ul>
<li><p>🔧 <strong>Eingebautes Tool-Ökosystem</strong>: Adapter und Hilfsprogramme, die sofort einsatzbereit sind</p></li>
<li><p>⚡ S <strong>chnellstart</strong>: einfache Konfiguration und ein funktionierender Agent in wenigen Minuten</p></li>
<li><p>🧪 <strong>Inklusive Tests</strong>: Unit-Tests und Integrationstests für mehr Sicherheit bei der Erweiterung</p></li>
<li><p>📦 <strong>Produktionsfertige Einrichtung</strong>: Architekturmuster und Skripte, die bei der Bereitstellung Zeit sparen</p></li>
</ul>
<p>Kurz gesagt, es kümmert sich um die Formalitäten, damit Sie sich auf die Entwicklung von Agenten konzentrieren können, die tatsächlich Ihre Geschäftsprobleme lösen.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Erste Schritte mit der langgraph-up-react-Vorlage<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Inbetriebnahme der Vorlage ist unkompliziert. Im Folgenden wird der Einrichtungsprozess Schritt für Schritt beschrieben:</p>
<ol>
<li>Umgebungsabhängigkeiten installieren</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Klonen Sie das Projekt</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Installieren der Abhängigkeiten</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Umgebung konfigurieren</li>
</ol>
<p>Kopieren Sie die Beispielkonfiguration und fügen Sie Ihre Schlüssel hinzu:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Bearbeiten Sie .env und setzen Sie mindestens einen Modellanbieter sowie Ihren Tavily-API-Schlüssel:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Starten Sie das Projekt</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Ihr Entwicklungsserver ist nun eingerichtet und bereit zum Testen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">Was können Sie mit langgraph-up-react bauen?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Was können Sie nun tun, wenn die Vorlage einmal läuft? Hier sind zwei konkrete Beispiele, die zeigen, wie es in realen Projekten angewendet werden kann.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Unternehmens-Wissensdatenbank Q&amp;A (Agentic RAG)</h3><p>Ein häufiger Anwendungsfall ist ein interner Q&amp;A-Assistent für Unternehmenswissen. Denken Sie an Produkthandbücher, technische Dokumente, FAQs - Informationen, die nützlich, aber verstreut sind. Mit <code translate="no">langgraph-up-react</code> können Sie einen Agenten erstellen, der diese Dokumente in einer <a href="https://milvus.io/"><strong>Milvus-Vektordatenbank</strong></a> indiziert, die relevantesten Passagen abruft und genaue, auf den Kontext bezogene Antworten generiert.</p>
<p>Für den Einsatz bietet Milvus flexible Optionen: <strong>Lite</strong> für schnelles Prototyping, <strong>Standalone</strong> für mittelgroße Produktionsworkloads und <strong>Distributed</strong> für Systeme im Unternehmensmaßstab. Außerdem sollten Sie die Indexparameter (z. B. HNSW) anpassen, um ein Gleichgewicht zwischen Geschwindigkeit und Genauigkeit herzustellen, und eine Überwachung der Latenz und des Abrufs einrichten, um sicherzustellen, dass das System auch unter Last zuverlässig arbeitet.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Multi-Agenten-Zusammenarbeit</h3><p>Ein weiterer leistungsstarker Anwendungsfall ist die Zusammenarbeit mehrerer Agenten. Anstatt dass ein Agent versucht, alles zu tun, definieren Sie mehrere spezialisierte Agenten, die zusammenarbeiten. In einem Softwareentwicklungs-Workflow zum Beispiel schlüsselt ein Produktmanager-Agent die Anforderungen auf, ein Architekt-Agent entwirft das Design, ein Entwickler-Agent schreibt den Code und ein Test-Agent validiert die Ergebnisse.</p>
<p>Diese Orchestrierung unterstreicht die Stärken von LangGraph: Zustandsverwaltung, Verzweigung und agentenübergreifende Koordination. Wir werden dieses Setup in einem späteren Artikel detaillierter behandeln, aber der wichtigste Punkt ist, dass <code translate="no">langgraph-up-react</code> es praktisch macht, diese Muster auszuprobieren, ohne wochenlang an einem Gerüst zu arbeiten.</p>
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
    </button></h2><p>Bei der Entwicklung zuverlässiger Agenten geht es nicht nur um clevere Prompts, sondern auch um die Strukturierung der Argumentation, die Verwaltung des Zustands und die Einbindung in ein System, das man tatsächlich warten kann. LangGraph gibt Ihnen das Gerüst, um dies zu tun, und <code translate="no">langgraph-up-react</code> senkt die Hürde, indem es sich um die Textbausteine kümmert, so dass Sie sich auf das Verhalten der Agenten konzentrieren können.</p>
<p>Mit dieser Vorlage können Sie Projekte wie Wissensdatenbank-Q&amp;A-Systeme oder Multi-Agenten-Workflows aufsetzen, ohne sich in der Einrichtung zu verlieren. Es ist ein Ausgangspunkt, der Zeit spart, häufige Fallstricke vermeidet und das Experimentieren mit LangGraph wesentlich vereinfacht.</p>
<p>Im nächsten Beitrag werde ich ein praktisches Tutorial vorstellen, in dem ich Schritt für Schritt zeige, wie man die Vorlage erweitert und einen funktionierenden Agenten für einen realen Anwendungsfall mit LangGraph, <code translate="no">langgraph-up-react</code> und der Vektordatenbank Milvus erstellt. Bleiben Sie dran.</p>
