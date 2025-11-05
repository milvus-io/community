---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Ziehen, ablegen und bereitstellen: Wie man RAG-Workflows mit Langflow und
  Milvus erstellt
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Lernen Sie, wie Sie visuelle RAG-Workflows mit Langflow und Milvus erstellen.
  Ziehen, ablegen und bereitstellen von kontextabhängigen KI-Apps in wenigen
  Minuten - ohne Programmierung.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Der Aufbau eines KI-Workflows fühlt sich oft schwieriger an, als er sein sollte. Zwischen dem Schreiben von Glue-Code, dem Debuggen von API-Aufrufen und dem Verwalten von Datenpipelines kann der Prozess Stunden verschlingen, bevor Sie überhaupt Ergebnisse sehen. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> und <a href="https://milvus.io/"><strong>Milvus</strong></a> vereinfachen diesen Prozess dramatisch - sie bieten Ihnen eine Code-leichte Möglichkeit, RAG-Workflows (Retrieval-Augmented Generation) innerhalb von Minuten und nicht Tagen zu entwerfen, zu testen und einzusetzen.</p>
<p><strong>Langflow</strong> bietet eine übersichtliche Drag-and-Drop-Benutzeroberfläche, die sich eher wie eine Ideenskizze auf einem Whiteboard anfühlt als wie ein Code. Sie können Sprachmodelle, Datenquellen und externe Tools visuell miteinander verbinden, um Ihre Workflow-Logik zu definieren - und das alles, ohne eine einzige Zeile Code zu schreiben.</p>
<p>Zusammen mit <strong>Milvus</strong>, der Open-Source-Vektordatenbank, die LLMs ein Langzeitgedächtnis und ein kontextuelles Verständnis verleiht, bilden die beiden eine vollständige Umgebung für produktionsreife RAG. Milvus speichert und ruft effizient Einbettungen aus Ihren unternehmens- oder domänenspezifischen Daten ab und ermöglicht es LLMs, Antworten zu generieren, die fundiert, genau und kontextbezogen sind.</p>
<p>In diesem Leitfaden zeigen wir Ihnen, wie Sie Langflow und Milvus kombinieren können, um einen fortschrittlichen RAG-Workflow zu erstellen - und das alles mit ein paar Klicks und Drag &amp; Drop.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Was ist Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir die RAG-Demo durchgehen, wollen wir erst einmal lernen, was Langflow ist und was es kann.</p>
<p>Langflow ist ein Open-Source-Framework auf Python-Basis, das die Entwicklung und das Experimentieren mit KI-Anwendungen erleichtert. Es unterstützt wichtige KI-Funktionen wie Agenten und das Model Context Protocol (MCP) und bietet Entwicklern und Nicht-Entwicklern eine flexible Grundlage für die Erstellung intelligenter Systeme.</p>
<p>In seinem Kern bietet Langflow einen visuellen Editor. Sie können verschiedene Ressourcen durch Ziehen, Ablegen und Verbinden miteinander verbinden, um komplette Anwendungen zu entwerfen, die Modelle, Werkzeuge und Datenquellen kombinieren. Wenn Sie einen Workflow exportieren, erzeugt Langflow automatisch eine Datei namens <code translate="no">FLOW_NAME.json</code> auf Ihrem lokalen Rechner. Diese Datei zeichnet alle Knoten, Kanten und Metadaten auf, die Ihren Workflow beschreiben, und ermöglicht Ihnen die Versionskontrolle, die gemeinsame Nutzung und die einfache Reproduktion von Projekten in verschiedenen Teams.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hinter den Kulissen führt eine Python-basierte Laufzeit-Engine den Ablauf aus. Sie orchestriert LLMs, Werkzeuge, Abrufmodule und Routing-Logik und verwaltet Datenfluss, Status und Fehlerbehandlung, um eine reibungslose Ausführung von Anfang bis Ende zu gewährleisten.</p>
<p>Langflow enthält auch eine umfangreiche Komponentenbibliothek mit vorgefertigten Adaptern für gängige LLMs und Vektordatenbanken - einschließlich <a href="https://milvus.io/">Milvus</a>. Sie können diese weiter ausbauen, indem Sie eigene Python-Komponenten für spezielle Anwendungsfälle erstellen. Zum Testen und Optimieren bietet Langflow eine schrittweise Ausführung, einen Playground für schnelles Testen und Integrationen mit LangSmith und Langfuse zum Überwachen, Debuggen und Wiedergeben von Workflows von Anfang bis Ende.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Hands-on Demo: Wie man einen RAG-Workflow mit Langflow und Milvus erstellt<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Aufbauend auf der Architektur von Langflow kann Milvus als Vektordatenbank dienen, die Einbettungen verwaltet und private Unternehmensdaten oder domänenspezifisches Wissen abruft.</p>
<p>In dieser Demo verwenden wir das Vector Store RAG Template von Langflow, um zu demonstrieren, wie man Milvus integriert und einen Vektorindex aus lokalen Daten aufbaut, der eine effiziente, kontextbezogene Beantwortung von Fragen ermöglicht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen：</h3><p>1.Python 3.11 (oder Conda)</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4.OpenAI-Schlüssel</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Schritt 1. Bereitstellen der Milvus-Vektor-Datenbank</h3><p>Laden Sie die Bereitstellungsdateien herunter.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Starten Sie den Milvus-Dienst.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Schritt 2. Erstellen Sie eine virtuelle Python-Umgebung</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Schritt 3. Installieren Sie die neuesten Pakete</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Schritt 4. Langflow starten</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Besuchen Sie Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Schritt 5. Konfigurieren Sie die RAG-Vorlage</h3><p>Wählen Sie die Vector Store RAG-Vorlage in Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wählen Sie Milvus als Ihre Standard-Vektordatenbank.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Suchen Sie in der linken Leiste nach "Milvus" und fügen Sie es zu Ihrem Fluss hinzu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Konfigurieren Sie die Verbindungsdetails von Milvus. Belassen Sie die anderen Optionen vorerst auf dem Standard.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Fügen Sie Ihren OpenAI API-Schlüssel zum entsprechenden Knoten hinzu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Schritt 6. Testdaten vorbereiten</h3><p>Hinweis: Verwenden Sie die offizielle FAQ für Milvus 2.6 als Testdaten.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Schritt 7. Erste Testphase</h3><p>Laden Sie Ihren Datensatz hoch und übertragen Sie ihn in Milvus. Hinweis: Langflow konvertiert dann Ihren Text in Vektordarstellungen. Sie müssen mindestens zwei Datensätze hochladen, sonst schlägt der Einbettungsprozess fehl. Dies ist ein bekannter Fehler in der aktuellen Knoten-Implementierung von Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Überprüfen Sie den Status Ihrer Knoten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Schritt 8. Phase Zwei Testen</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Schritt 9. Ausführen des vollständigen RAG-Workflows</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>Die Erstellung von AI-Workflows muss nicht kompliziert sein. Langflow + Milvus macht es schnell, visuell und code-light - eine einfache Möglichkeit, RAG ohne großen technischen Aufwand zu verbessern.</p>
<p>Die Drag-and-Drop-Oberfläche von Langflow macht es zu einer geeigneten Wahl für den Unterricht, für Workshops oder Live-Demos, bei denen Sie die Funktionsweise von KI-Systemen auf klare und interaktive Weise demonstrieren müssen. Für Teams, die ein intuitives Workflow-Design mit einer unternehmensgerechten Vektorsuche verbinden möchten, bietet die Kombination der Einfachheit von Langflow mit der Hochleistungssuche von Milvus sowohl Flexibilität als auch Leistung.</p>
<p>👉 Beginnen Sie noch heute mit der Erstellung intelligenter RAG-Workflows mit <a href="https://milvus.io/">Milvus</a>.</p>
<p>Haben Sie Fragen oder möchten Sie einen tieferen Einblick in eine Funktion? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
