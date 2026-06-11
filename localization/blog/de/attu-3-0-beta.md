---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: Verwaltung mehrerer Cluster, KI-Agent und eine überarbeitete
  Milvus-Konsole
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 Beta bietet eine überarbeitete Milvus-Verwaltungskonsole mit
  Multi-Cluster-Verwaltung, persistenter Statusverwaltung, einem integrierten
  KI-Agenten, Experten-Diagnosefunktionen, Echtzeit-Metriken, API-Debugging,
  Sicherungs- und Wiederherstellungsfunktionen sowie vereinfachten
  RBAC-Workflows.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta ist jetzt verfügbar.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> ist die Open-Source-Verwaltungskonsole für <a href="https://milvus.io"><strong>Milvus</strong></a>. Wenn Sie Milvus lokal oder in der Produktion eingesetzt haben, haben Sie wahrscheinlich Attu verwendet, um Sammlungen zu überprüfen, Daten zu durchsuchen, Schemata zu verwalten oder zu überprüfen, was innerhalb eines Clusters geschieht.</p>
<p>Attu 2.x funktionierte gut für die grundlegende Verwaltung einzelner Cluster. Doch mit dem Wachstum der Milvus-Bereitstellungen wurden seine Grenzen deutlicher. Es konnte jeweils nur eine Verbindung zu einer Milvus-Instanz herstellen. Der Verbindungsstatus ging nach einem Neustart des Containers verloren. Das Durchsuchen von Daten war größtenteils auf Sammlungen ausgerichtet. Diagnose, Überwachung, API-Debugging, Sicherung und Wiederherstellung sowie die Berechtigungsverwaltung erforderten oft separate Tools oder manuelle Schritte.</p>
<p><strong>Attu 3.0 Beta ist eine komplette Neugestaltung der Milvus-Verwaltungsumgebung.</strong></p>
<p>Diese Version bietet nun Multi-Cluster-Verwaltung, einen persistenten lokalen Status, einen integrierten AI-Agenten mit über 50 Milvus-Tools, erweiterte Diagnosefunktionen, einen neu gestalteten Datenbrowser, integrierte Prometheus-Metriken, einen API-Playground, GUI-basierte Sicherungs- und Wiederherstellungsfunktionen sowie vereinfachte RBAC-Workflows.</p>
<p>Kurz gesagt: Attu ist nicht mehr nur ein schlanker Viewer für eine einzelne Milvus-Instanz. Es entwickelt sich zu einer praktischen Betriebskonsole für Entwickler und Teams, die Milvus in lokalen, Staging- und Produktionsumgebungen verwalten.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Was sich in Attu 3.0 Beta geändert hat<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier ist ein allgemeiner Vergleich zwischen Attu 2.x und Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Funktion</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Cluster-Verbindungen</td><td>Nur eine Instanz</td><td>Mehrere Cluster mit Umschaltung per Mausklick</td></tr>
<tr><td>Zustandsbeibehaltung</td><td>Zustandslos; geht beim Neustart des Containers verloren</td><td>Lokale Datenbank; bleibt bei Neustarts erhalten</td></tr>
<tr><td>KI-Unterstützung</td><td>Keine</td><td>Integrierter Agent mit über 50 Milvus-Tools</td></tr>
<tr><td>Diagnose</td><td>Manuelle Untersuchung</td><td>4 integrierte Diagnosefunktionen auf Expertenniveau</td></tr>
<tr><td>RBAC-Verwaltung</td><td>Separate Seiten, mehrstufiger Ablauf</td><td>Kontextbezogene Benutzererstellung mit einem Klick</td></tr>
<tr><td>Datennavigation</td><td>Flache Sammlungsliste</td><td>Hierarchischer Baum: Datenbank → Sammlung → Partition</td></tr>
<tr><td>Überwachung</td><td>Externes Grafana erforderlich</td><td>Integriertes Prometheus-Metrik-Dashboard</td></tr>
<tr><td>API-Debugging</td><td>Externe Tools wie curl oder Postman</td><td>Integrierter REST-API-Playground</td></tr>
<tr><td>Sicherung und Wiederherstellung</td><td>Nur CLI</td><td>GUI mit Unterstützung für S3, MinIO, GCS und Azure</td></tr>
<tr><td>LLM-Integration</td><td>Keine</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini und mehr</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Verwalten Sie mehrere Milvus-Cluster über eine einzige Seitenleiste<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die größte Veränderung im Tagesgeschäft ist die Verwaltung mehrerer Cluster.</strong> Attu 3.0 kann sich mit jeder von Ihnen betriebenen Milvus-Instanz verbinden und diese in einer einzigen Seitenleiste auflisten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0-Seitenleiste mit mehreren Milvus-Verbindungen und Statusanzeigen</p>
<p>In Attu 2.x bedeutete der Wechsel von einem Milvus-Cluster zu einem anderen, die Verbindung zu trennen, neu herzustellen und zu warten. Wenn Sie separate Cluster für Entwicklung, Staging, Produktion oder verschiedene Geschäftsbereiche hatten, endete dies oft mit einem Browser-Tab pro Cluster.</p>
<p>Attu 3.0 ersetzt diesen Ablauf durch eine permanente linke Seitenleiste. Jede Milvus-Verbindung wird an einem Ort aufgelistet, daneben befindet sich ein Live-Zustandsindikator. Ein grüner Punkt bedeutet, dass der Cluster erreichbar ist. Ein roter Punkt bedeutet, dass der Cluster ausgefallen oder nicht verfügbar ist.</p>
<p>Das Wechseln zwischen Clustern erfolgt mit einem Klick. Attu speichert den Kontext für jede Verbindung, sodass Sie nicht jedes Mal eine neue Verbindung herstellen müssen, wenn Sie zwischen Umgebungen wechseln.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">Die Verbindungseinrichtung ist weniger anfällig</h3><p>Neue Verbindungen unterstützen TLS/SSL-Verschlüsselung, Token-Authentifizierung sowie Benutzername-Passwort-Authentifizierung. Sie können eine Verbindung vor dem Speichern testen, Verbindungsdetails lokal speichern und nicht mehr benötigte Verbindungen in einem Schritt löschen, wenn alte Umgebungen nicht mehr benötigt werden.</p>
<p><strong>Jeder Cluster erhält einen eigenen Arbeitsbereich.</strong> Übersicht, Datenbrowser, Benutzerverwaltung, Metriken und Operationen sind alle auf den aktuell ausgewählten Cluster beschränkt. Das macht es viel schwieriger, Staging und Produktion zu verwechseln oder eine Operation am falschen Ort auszuführen.</p>
<p>Für alle, die mehr als eine Milvus-Instanz verwalten, ist dies eine der wichtigsten Änderungen in Attu 3.0. Es klingt einfach, aber es erspart im täglichen Milvus-Alltag viel Hin- und Herwechseln zwischen Tabs und Probleme beim erneuten Herstellen von Verbindungen.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">Lokaler Status bleibt nun auch nach Neustarts erhalten<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x war zustandslos. Wenn der Container neu gestartet wurde, gingen Ihre gespeicherten Verbindungsdaten verloren und Sie mussten Ihren Arbeitsbereich neu aufbauen.</p>
<p><strong>Attu 3.0 verfügt nun über eine lokale Datenbank, die Cluster-Konfigurationen, den Verlauf der Agent-Konversationen, benutzerdefinierte Skills, die LLM-Konfiguration und Benutzereinstellungen speichert.</strong></p>
<p>Wenn Sie Attu mit Docker ausführen, mounten Sie ein Volume, um diesen Status beizubehalten:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Wenn das Volume gemountet ist, bedeutet ein Neustart des Containers nicht mehr, dass man bei Null anfangen muss.</p>
<p>Dies ist auch für den neuen KI-Agenten von Bedeutung. Konversationsverlauf, benutzerdefinierte Fähigkeiten und LLM-Konfiguration können lokal gespeichert werden, sodass Attu zu einer Konsole wird, die Sie langfristig nutzen können, anstatt zu einer temporären Benutzeroberfläche, die nach jedem Neustart zurückgesetzt wird.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Verwenden Sie den integrierten KI-Agenten, um Milvus in natürlicher Sprache zu bedienen<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 enthält einen integrierten KI-Agenten für die Milvus-Verwaltung. Dabei handelt es sich nicht um einen Dokumentations-Chatbot. <strong>Der Agent ist mit über 50 Milvus-Tools verbunden, sodass er den Cluster-Status überprüfen und über Attu echte Operationen ausführen kann.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Der Attu 3.0-KI-Agent kann Milvus-Tools über Anfragen in natürlicher Sprache aufrufen</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Über 50 integrierte Tools für gängige Milvus-Workflows</h3><p>Der Agent deckt alltägliche Vorgänge, Diagnosen, Berechtigungen und die Clusterverwaltung ab. Sie können Fragen stellen oder Anweisungen erteilen, wie zum Beispiel:</p>
<table>
<thead>
<tr><th>Szenario</th><th>Beispiel-Eingabeaufforderungen</th></tr>
</thead>
<tbody>
<tr><td>Alltägliche Vorgänge</td><td>„Liste alle meine Sammlungen auf.“<br>„Erstelle eine Sammlung mit den Feldern id, title und embedding. Verwende die Dimension 768 für das Feld embedding.“<br>„Füge einige Testdaten in my_collection ein.“<br>„Suche in my_collection nach den 10 Datensätzen, die ‚künstliche Intelligenz‘ am ähnlichsten sind.“</td></tr>
<tr><td>Betrieb und Diagnose</td><td>„Ist mein Cluster in Ordnung?“<br>„Warum ist die Suche so langsam?“<br>„Welche Sammlungen beanspruchen am meisten Speicherplatz?“<br>„Gab es in letzter Zeit langsame Abfragen?“</td></tr>
<tr><td>Berechtigungen</td><td>„Erstelle einen schreibgeschützten Benutzer namens analyst.“<br>„Weisen Sie der Admin-Rolle alle Berechtigungen zu.“<br>„Überprüfen Sie, welche Berechtigungen der Benutzer zhangsan hat.“</td></tr>
<tr><td>Cluster-Verwaltung</td><td>„Zeige die aktuelle Milvus-Version und -Konfiguration an.“<br>„Liste die Nutzung der Ressourcengruppen auf.“<br>„Kompaktieren Sie my_collection für mich.“</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Destruktive Aktionen erfordern eine Genehmigung</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Bei destruktiven oder sensiblen Vorgängen wird vor der Ausführung ein Bestätigungsdialog angezeigt</p>
<p><strong>Der Agent ist so konzipiert, dass er transparent und kontrollierbar ist.</strong> Nicht-destruktive Vorgänge, wie das Auflisten von Sammlungen oder das Auslesen von Metriken, geben die Ergebnisse direkt zurück.</p>
<p>Destruktive oder sensible Vorgänge, wie das Löschen einer Sammlung, das Löschen von Daten oder das Ändern von Berechtigungen, lösen einen Bestätigungsdialog aus. Der Dialog listet die genauen Parameter auf und wartet auf die Genehmigung, bevor der Vorgang ausgeführt wird.</p>
<p>Sie können auch sehen, welche Tools der Agent aufgerufen hat, wie viele Token er verwendet hat und ob ein Toolaufruf fehlgeschlagen ist. Das ist für einen Datenbankverwaltungsagenten wichtig. Benutzer sollten verstehen können, was der Agent getan hat, und nicht nur das Endergebnis sehen.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Führen Sie Expertendiagnose-Funktionen über die Konsole aus<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Der KI-Agent verfügt über vier integrierte Diagnosefunktionen.</strong> Dabei handelt es sich um geführte Workflows für häufige Milvus-Fehlerbehebungsszenarien, nicht um allgemeine Eingabeaufforderungen.</p>
<table>
<thead>
<tr><th>Diagnosefunktion</th><th>Was wird überprüft</th></tr>
</thead>
<tbody>
<tr><td>Diagnose des Clusterzustands</td><td>Version, Knotenstatus, Zustand der einzelnen Komponenten und wichtige Kennzahlen.</td></tr>
<tr><td>Diagnose der Suchleistung</td><td>Indexintegrität, Segmentfragmentierung, Replikatausgleich und zugehörige Signale zur Suchleistung.</td></tr>
<tr><td>Diagnose der Datenschreibvorgänge</td><td>Langsame Einfügungen, Datenverlustprüfungen, Flush-Anomalien und Symptome im Schreibpfad.</td></tr>
<tr><td>Konfigurationsprüfung</td><td>Risikobehaftete oder fehlerhafte Einstellungen, die die Stabilität, Leistung oder das erwartete Verhalten beeinträchtigen können.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0 enthält integrierte Diagnose-Skills und unterstützt benutzerdefinierte Skills</p>
<p>Sie können auch benutzerdefinierte Skills in natürlicher Sprache erstellen. Ein Skill kann eine Checkliste vor dem Start, eine Datenqualitätsprüfung für eine bestimmte Sammlung oder einen Diagnoseablauf kodieren, den Ihr Team für eine bekannte Arbeitslast ausführt.</p>
<p>Ein benutzerdefiniertes Skill besteht im Wesentlichen aus Fachwissen und einer Vorgehensweise. Nach dem Speichern kann der Agent es wiederverwenden, anstatt sich jedes Mal auf eine einmalige Eingabeaufforderung zu verlassen.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Bringen Sie Ihren eigenen LLM-Anbieter mit<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu bündelt oder vermittelt keinen LLM-Dienst.</strong> Sie konfigurieren Ihren eigenen Anbieter und behalten die Kontrolle über den Modellpfad.</p>
<p>Zu den unterstützten Anbieteroptionen gehören OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter und benutzerdefinierte OpenAI-kompatible Endpunkte.</p>
<table>
<thead>
<tr><th>Anbieter</th><th>Beispielmodelle</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Beliebiges geroutetes Modell</td></tr>
<tr><td>Benutzerdefinierter Endpunkt</td><td>Jede OpenAI-kompatible API</td></tr>
</tbody>
</table>
<p>Ihr API-Schlüssel wird lokal verschlüsselt und nicht auf einen von Attu verwalteten Dienst hochgeladen. Dieses Design ist wichtig für Teams, die KI-Unterstützung wünschen, aber dennoch die Kontrolle über Anmeldedaten, Datenfluss und die Wahl des Anbieters behalten möchten.</p>
<p>In der Praxis macht BYOL den Agenten in verschiedenen Umgebungen einsetzbar. Ein Team nutzt vielleicht OpenAI. Ein anderes nutzt vielleicht ein Anthropic-Modell. Ein drittes leitet den Datenfluss möglicherweise über einen OpenAI-kompatiblen Endpunkt. Attu schreibt keinen bestimmten Modellanbieter vor.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Durchsuchen Sie Milvus-Daten mit einer Datenbank → Sammlung → Partitionsstruktur<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 gestaltet auch den Datenbrowser neu. Attu 2.x präsentierte hauptsächlich eine flache Sammlungsliste. Das wird unpraktisch, sobald ein Cluster über mehrere Datenbanken, Dutzende von Sammlungen und partitionierte Daten verfügt.</p>
<p><strong>Der neue Browser verwendet eine Hierarchie, die der Art und Weise entspricht, wie Milvus Daten organisiert: Datenbank → Sammlung → Partition.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Der neu gestaltete Datenbrowser nutzt eine hierarchische Navigation für Datenbanken, Sammlungen und Partitionen</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Datenoperationen sind näher an der Stelle, an der Sie navigieren</h3><p>Der Datenbrowser behält die Funktionen bei, die Benutzer bereits erwarten, und fügt weitere Aktionen direkt in der Benutzeroberfläche hinzu:</p>
<ul>
<li>Ziehen Sie eine Sammlung per Drag &amp; Drop in eine andere Datenbank.</li>
<li>Führen Sie eine Vektorsuche durch, indem Sie Text direkt eingeben, sofern ein Einbettungsmodell konfiguriert ist.</li>
<li>Überprüfen Sie Ähnlichkeitswerte und grenzen Sie Ergebnisse mit Facetten ein.</li>
<li>Importieren und exportieren Sie Daten in CSV, JSON und Parquet.</li>
<li>Anzeigen und Bearbeiten eines Sammlungsschemas auf visuelle Weise, einschließlich Unterstützung für dynamische Felder.</li>
<li>Erstellen, löschen und überprüfen Sie Partitionen und Partitionsstatistiken.</li>
<li>Verwalten Sie den gesamten Lebenszyklus der Sammlung: Erstellen, Laden, Freigeben, Kopieren, Umbenennen, Verschieben zwischen Datenbanken und Löschen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0-Datenbrowser mit Vektorsuche und Ergebnisprüfung</p>
<p>Die meisten dieser Aktionen sind über Rechtsklick-Menüs oder Bedienfelder verfügbar. Für gängige Aufgaben im Zusammenhang mit Sammlungen müssen Sie nicht mehr zwischen der Benutzeroberfläche und Befehlszeilenoperationen hin- und herspringen.</p>
<p>Attu 3.0 ist zudem die Produktlinie, in der die UI-Unterstützung für neue <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0-Funktionen</a> wie Snapshots und nullfähige Vektoren nach und nach hinzukommen wird, sobald diese Funktionen ausgereift sind.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Überprüfen Sie Vorgänge, Metriken, langsame Abfragen, Topologie und Backups an einem Ort<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 stellt mehr Betriebsinformationen in der Konsole bereit.</strong> Der Bereich „Ops und Überwachung“ umfasst eine Cluster-Übersicht, Live-Metriken, die Analyse langsamer Abfragen, die Topologie sowie Backups und Wiederherstellungen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0-Seite „Ops and Monitoring“</p>
<p>Das Ziel ist nicht, jedes Observability-System zu ersetzen, das ein Produktionsteam bereits nutzt. Teams können weiterhin Prometheus, Grafana, Logs, Alerts und ihren bestehenden Monitoring-Stack verwenden. Das Ziel ist es, häufig gestellte Fragen zu Milvus direkt in Attu beantworten zu können.</p>
<table>
<thead>
<tr><th>Bereich</th><th>Was Sie tun können</th></tr>
</thead>
<tbody>
<tr><td>Visuelle Cluster-Übersicht</td><td>Milvus-Version, Bereitstellungsmodus, Anzahl der Knoten, Anzahl der Datenbanken, Anzahl der Erfassungen, Auslastungsstatus und Quotenentitäten auf einen Blick anzeigen.</td></tr>
<tr><td>Echtzeit-Metriken</td><td>Überprüfen Sie QPS, Einfüge-/Löschraten, Abfragelatenz, Cache-Trefferquote und zugehörige Prometheus-gestützte Metriken.</td></tr>
<tr><td>Analyse langsamer Abfragen</td><td>Untersuchen Sie langsame Abfragen nach Typ, Dauer, Sammlung, Zeitstempel, Quelle und zugehörigem Fehlerbehebungskontext.</td></tr>
<tr><td>Topologieansicht</td><td>Verstehen Sie die Knotentopologie und die Verbindungen zwischen Komponenten wie RootCoord, DataCoord, IndexCoord, QueryCoord und Proxy.</td></tr>
<tr><td>Sicherung und Wiederherstellung</td><td>Erstellen Sie vollständige oder inkrementelle Backups auf S3, MinIO, GCS oder Azure und laden Sie Backup-Metadaten als ZIP-Datei herunter oder laden Sie eine hoch, um sie wiederherzustellen.</td></tr>
</tbody>
</table>
<p>Sicherung und Wiederherstellung sind besonders wichtig, da sie einen Workflow, der zuvor auf die Verwendung der CLI angewiesen war, in die GUI verlagern. Dies ist nützlich für lokale Tests, die Validierung von Staging-Umgebungen und Teams, die einen besser nachvollziehbaren Wiederherstellungspfad wünschen.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Debuggen von Milvus-REST-APIs mit dem integrierten API-Playground<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 bietet einen REST-API-Playground für die Entwicklung und das Debugging von Milvus-APIs.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0 API-Playground</p>
<p>Der Playground listet Milvus-REST-Endpunkte nach Kategorien auf. Wählen Sie eine Datenbank und eine Sammlung aus, und Attu füllt den Ausführungskontext automatisch aus. Von dort aus können Sie mit einem Klick eine Anfrage senden und die Antwort in Echtzeit überprüfen.</p>
<p>Dies ist nützlich, wenn Sie einen API-Aufruf testen möchten, ohne Curl-Befehle oder eine Postman-Sammlung einrichten zu müssen. Es ist auch hilfreich, um zu verstehen, wie eine Milvus-Funktion auf die REST-API abgebildet wird, da Sie direkt zwischen dem UI-Kontext und dem Request-Body wechseln können.</p>
<p>Für Anwendungsentwickler ist der API Playground eine Debugging-Oberfläche. Für neue Milvus-Benutzer ist er eine Lernplattform. Für Plattformteams ist er eine schnelle Möglichkeit, Vorgänge zu validieren, bevor sie in Skripte oder Anwendungscode umgesetzt werden.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Verwalten Sie RBAC neben der Datenbank oder Sammlung<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 verändert die Darstellung von Berechtigungsworkflows in der Benutzeroberfläche.</strong> Anstatt <a href="https://milvus.io/docs/rbac.md">RBAC</a> als separate Verwaltungsaufgabe zu behandeln, rückt die Zugriffskontrolle näher an die Datenbank- und Sammlungstabs heran, in denen die Benutzer bereits arbeiten.</p>
<p>Das zugrunde liegende Modell ist weiterhin Milvus RBAC: Benutzer, Rollen, <a href="https://milvus.io/docs/grant_privileges.md">Berechtigungen</a>, Zuweisungen und Widerrufe. Attu 3.0 vereinfacht die Arbeitsabläufe rund um dieses Modell.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Kontextbezogene Benutzer- und Berechtigungsverwaltung in Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Benutzererstellung mit einem Klick für gängige Bereiche</h3><p>In Attu 2.x umfasste das Einrichten eines schreibgeschützten Zugriffs auf eine Sammlung in der Regel mehrere Schritte: Benutzer anlegen, Rolle anlegen, Berechtigungen konfigurieren, die Rolle dem Benutzer zuweisen und sicherstellen, dass der Bereich korrekt war.</p>
<p><strong>In Attu 3.0 können Sie eine Sammlung öffnen, zur Registerkarte „Benutzer“ wechseln, auf „Benutzer erstellen“ klicken, „Nur Lesen“ oder „Lesen/Schreiben“ auswählen und Attu den Arbeitsablauf abschließen lassen.</strong> Das System erstellt den Benutzer, generiert ein sicheres Passwort, erstellt die passende bereichsbezogene Rolle und wendet die Berechtigung zu.</p>
<p>Das gleiche Muster funktioniert auf Datenbankebene. Sie können auch einen bestehenden Benutzer für die aktuelle Sammlung autorisieren oder den Zugriff mit einem Klick widerrufen.</p>
<p>Dadurch bleibt die Berechtigungsverwaltung nah an der zu schützenden Ressource. Sie müssen nicht durch mehrere Verwaltungsseiten springen oder sich eine Namenskonvention für Rollen merken, nur um einem Teamkollegen bereichsbezogenen Zugriff zu gewähren.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Was diese Beta-Version für Attu-Benutzer bedeutet<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta ist das größte Update der Milvus-Verwaltungskonsole seit der ersten Veröffentlichung von Attu.</strong> Es handelt sich nicht nur um eine optische Auffrischung. Es verändert den Umfang dessen, was Attu bewältigen kann.</p>
<p>Die wichtigste Neuerung ist, dass Attu nun der tatsächlichen Arbeitsweise vieler Milvus-Nutzer entspricht: mehrere Cluster, dauerhafte lokale Einstellungen, mehr Datenbewegungen, mehr Zugriffskontrolle, mehr Fehlerbehebung und ein größerer Bedarf, das Cluster-Verhalten zu verstehen, ohne zwischen Tools wechseln zu müssen.</p>
<p>Die Highlights sind:</p>
<ul>
<li>Verwaltung mehrerer Cluster mit Zustandsanzeigen und Umschalten per Mausklick.</li>
<li>Persistenter lokaler Status für Clusterkonfigurationen, Einstellungen, LLM-Konfiguration, Agent-Verlauf und benutzerdefinierte Skills.</li>
<li>Ein integrierter KI-Agent mit über 50 Milvus-Tools und Bestätigungsabfragen für destruktive Aktionen.</li>
<li>Vier integrierte Expertendiagnose-Skills für Cluster-Zustand, Suchleistung, Datenschreibvorgänge und Konfigurationsüberprüfung.</li>
<li>Ein neu gestalteter Datenbrowser mit Navigation von Datenbank → Sammlung → Partition und umfangreicheren Sammlungsoperationen.</li>
<li>Integrierte Prometheus-Metriken, Analyse langsamer Abfragen, Topologie sowie Sicherung und Wiederherstellung.</li>
<li>Ein REST-API-Playground zum Debuggen und Erlernen von Milvus-APIs.</li>
<li>RBAC-Workflows, die neben der Datenbank oder Sammlung ablaufen und nicht nur in einem separaten Admin-Ablauf.</li>
</ul>
<p>Wenn Sie Attu nur für die lokale Milvus-Entwicklung nutzen, bietet Ihnen 3.0 eine leistungsfähigere Konsole. Wenn Sie mehrere Milvus-Umgebungen verwalten, sind allein schon die Änderungen bei Multi-Cluster und Persistent-State einen Versuch wert. Wenn Sie häufig Performance- oder Berechtigungsprobleme debuggen, sollten der Agent, die Diagnostik, die Metriken und die kontextbezogenen RBAC-Workflows Ihnen sofort Zeit sparen.</p>
<h2 id="Get-Started" class="common-anchor-header">Erste Schritte<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Testen Sie Attu 3.0 Beta mit Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Öffnen Sie dann:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Fügen Sie Ihre Milvus-Verbindung über die Seitenleiste hinzu und entdecken Sie die neue Konsole.</p>
<p>Bevorzugen Sie eine Desktop-App? Laden Sie die für Ihre Plattform geeignete Version von <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a> herunter. Attu 3.0 Beta bietet Desktop-Pakete für macOS, Linux und Windows. Aktuelle Versionen enthalten auch ein eigenständiges Linux-Serverpaket, um Attu ohne Docker oder Electron auszuführen.</p>
<p><strong>Haben Sie Fragen?</strong> Bringen Sie Ihr Multi-Cluster-Setup, Ihre benutzerdefinierten Agent-Skills oder Ihr Diagnoseszenario in den <a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a> ein oder buchen Sie <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours</strong></a>, um es gemeinsam mit der Community zu bearbeiten.</p>
<p><strong>Sie möchten die Milvus-Infrastruktur nicht selbst betreiben?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> ist die vollständig verwaltete Plattform von den Entwicklern von Milvus. Sie behält die Milvus-API bei und ergänzt sie um eine verwaltete Infrastruktur für Echtzeit-Vektorsuche, groß angelegte Erkennung und KI-Datenoperationen. Für Teams mit Anforderungen an die Datenhoheit läuft Zilliz Cloud <strong>BYOC</strong> in Ihrem eigenen Cloud-Konto, sodass die Daten in Ihrer VPC verbleiben, während Zilliz den Betrieb übernimmt.</p>
