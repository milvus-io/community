---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: Verwaltung mehrerer Cluster, KI-Agent und eine neu gestaltete
  Milvus-Konsole
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/Attu_3_0_New_cover_1af4c44467.png
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
  Funktionen zur Verwaltung mehrerer Cluster, einem persistenten Status, einem
  integrierten KI-Agenten, Experten-Diagnosen, Echtzeit-Metriken, API-Debugging,
  Sicherungs- und Wiederherstellungsfunktionen sowie vereinfachten
  RBAC-Workflows.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta ist ab sofort verfügbar.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> ist die Open-Source-Verwaltungskonsole für <a href="https://milvus.io"><strong>Milvus</strong></a>. Wenn Sie Milvus lokal oder in der Produktion eingesetzt haben, haben Sie wahrscheinlich Attu verwendet, um Sammlungen zu überprüfen, Daten zu durchsuchen, Schemata zu verwalten oder zu überprüfen, was innerhalb eines Clusters geschieht.</p>
<p>Attu 2.x hat sich für die grundlegende Verwaltung einzelner Cluster gut bewährt. Doch mit dem Wachstum der Milvus-Bereitstellungen wurden seine Grenzen deutlicher. Es konnte jeweils nur eine Verbindung zu einer Milvus-Instanz herstellen. Nach einem Neustart des Containers ging der Verbindungsstatus verloren. Das Durchsuchen von Daten erfolgte größtenteils auf Basis der Sammlungen. Für Diagnose, Überwachung, API-Fehlerbehebung, Sicherung und Wiederherstellung sowie die Berechtigungsverwaltung waren oft separate Tools oder manuelle Schritte erforderlich.</p>
<p><strong>Attu 3.0 Beta ist eine komplette Neugestaltung der Milvus-Verwaltung.</strong></p>
<p>Diese Version bietet nun Multi-Cluster-Verwaltung, einen persistenten lokalen Status, einen integrierten KI-Agenten mit über 50 Milvus-Tools, erweiterte Diagnosefunktionen, einen neu gestalteten Datenbrowser, integrierte Prometheus-Metriken, einen API-Playground, GUI-basierte Sicherungs- und Wiederherstellungsfunktionen sowie vereinfachte RBAC-Workflows.</p>
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
<tr><td>Zustandserhaltung</td><td>Zustandslos; geht beim Neustart des Containers verloren</td><td>Lokale Datenbank; bleibt bei Neustarts erhalten</td></tr>
<tr><td>KI-Unterstützung</td><td>Keine</td><td>Integrierter Agent mit über 50 Milvus-Tools</td></tr>
<tr><td>Diagnose</td><td>Manuelle Untersuchung</td><td>4 integrierte Diagnosefunktionen auf Expertenniveau</td></tr>
<tr><td>RBAC-Verwaltung</td><td>Separate Seiten, mehrstufiger Ablauf</td><td>Kontextbezogene Benutzererstellung mit einem Klick</td></tr>
<tr><td>Datennavigation</td><td>Flache Sammlungsliste</td><td>Hierarchischer Baum: Datenbank → Sammlung → Partition</td></tr>
<tr><td>Überwachung</td><td>Externes Grafana erforderlich</td><td>Integriertes Prometheus-Metrik-Dashboard</td></tr>
<tr><td>API-Debugging</td><td>Externe Tools wie curl oder Postman</td><td>Integrierter REST-API-Playground</td></tr>
<tr><td>Sicherung und Wiederherstellung</td><td>Nur über die Befehlszeile</td><td>GUI mit Unterstützung für S3, MinIO, GCS und Azure</td></tr>
<tr><td>LLM-Integration</td><td>Keine</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini und weitere</td></tr>
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
    </button></h2><p><strong>Die größte Veränderung im Arbeitsalltag ist die Verwaltung mehrerer Cluster.</strong> Attu 3.0 kann eine Verbindung zu jeder von Ihnen betriebenen Milvus-Instanz herstellen und diese in einer einzigen Seitenleiste auflisten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0-Seitenleiste mit mehreren Milvus-Verbindungen und Statusanzeigen</p>
<p>In Attu 2.x bedeutete der Wechsel von einem Milvus-Cluster zu einem anderen, die Verbindung zu trennen, erneut herzustellen und zu warten. Wenn Sie separate Cluster für Entwicklung, Staging, Produktion oder verschiedene Geschäftsbereiche hatten, endete dies oft damit, dass Sie pro Cluster einen eigenen Browser-Tab offen hatten.</p>
<p>Attu 3.0 ersetzt diesen Ablauf durch eine permanente linke Seitenleiste. Jede Milvus-Verbindung wird an einer Stelle aufgelistet, daneben befindet sich ein Live-Zustandsindikator. Ein grüner Punkt bedeutet, dass der Cluster erreichbar ist. Ein roter Punkt bedeutet, dass der Cluster ausgefallen oder nicht verfügbar ist.</p>
<p>Der Wechsel zwischen Clustern erfolgt mit einem Klick. Attu behält den Kontext für jede Verbindung bei, sodass Sie nicht jedes Mal eine neue Verbindung herstellen müssen, wenn Sie zwischen den Umgebungen wechseln.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">Die Einrichtung von Verbindungen ist weniger anfällig</h3><p>Neue Verbindungen unterstützen TLS/SSL-Verschlüsselung, Token-Authentifizierung sowie die Authentifizierung per Benutzername und Passwort. Sie können eine Verbindung vor dem Speichern testen, Verbindungsdetails lokal speichern und nicht mehr benötigte Verbindungen in einem Schritt löschen, wenn alte Umgebungen nicht mehr benötigt werden.</p>
<p><strong>Jeder Cluster erhält einen eigenen Arbeitsbereich.</strong> Übersicht, Datenbrowser, Benutzerverwaltung, Metriken und Operationen beziehen sich ausschließlich auf den aktuell ausgewählten Cluster. Dadurch wird es wesentlich schwieriger, Staging- und Produktionsumgebungen zu verwechseln oder eine Operation am falschen Ort auszuführen.</p>
<p>Für alle, die mehr als eine Milvus-Instanz verwalten, ist dies eine der wichtigsten Änderungen in Attu 3.0. Es klingt einfach, aber es erspart im täglichen Milvus-Alltag viel Hin- und Herwechseln zwischen Registerkarten und Probleme beim erneuten Herstellen von Verbindungen.</p>
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
<p><strong>Attu 3.0 verfügt nun über eine lokale Datenbank, in der Clusterkonfigurationen, der Verlauf der Agent-Konversationen, benutzerdefinierte Skills, die LLM-Konfiguration und Benutzereinstellungen dauerhaft gespeichert werden.</strong></p>
<p>Wenn Sie Attu mit Docker ausführen, mounten Sie ein Volume, um diesen Zustand zu erhalten:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Ist das Volume eingebunden, bedeutet ein Neustart des Containers nicht mehr, dass man bei Null anfangen muss.</p>
<p>Dies ist auch für den neuen KI-Agenten von Bedeutung. Konversationsverlauf, benutzerdefinierte Fähigkeiten und die LLM-Konfiguration können lokal gespeichert werden, sodass Attu zu einer Konsole wird, die Sie langfristig nutzen können, anstatt einer temporären Benutzeroberfläche, die nach jedem Neustart zurückgesetzt wird.</p>
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
    </button></h2><p>Attu 3.0 enthält einen integrierten KI-Agenten für die Milvus-Verwaltung. Dabei handelt es sich nicht um einen Dokumentations-Chatbot. <strong>Der Agent ist mit über 50 Milvus-Tools verbunden, sodass er den Clusterstatus überprüfen und über Attu echte Operationen ausführen kann.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Der Attu 3.0-KI-Agent kann Milvus-Tools über Anfragen in natürlicher Sprache aufrufen</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Über 50 integrierte Tools für gängige Milvus-Workflows</h3><p>Der Agent deckt alltägliche Vorgänge, Diagnosen, Berechtigungen und das Cluster-Management ab. Sie können Fragen stellen oder Anweisungen erteilen, wie zum Beispiel:</p>
<table>
<thead>
<tr><th>Szenario</th><th>Beispiel-Eingaben</th></tr>
</thead>
<tbody>
<tr><td>Alltägliche Vorgänge</td><td>„Liste alle meine Sammlungen auf.“<br>„Erstelle eine Sammlung mit den Feldern ‚id‘, ‚title‘ und ‚embedding‘. Verwende für das Feld ‚embedding‘ die Dimension 768.“<br>„Füge einige Testdaten in ‚my_collection‘ ein.“<br>„Durchsuche ‚my_collection‘ nach den 10 Datensätzen, die ‚künstliche Intelligenz‘ am ähnlichsten sind.“</td></tr>
<tr><td>Betrieb und Diagnose</td><td>„Ist mein Cluster in Ordnung?“<br>„Warum ist die Suche so langsam?“<br>„Welche Sammlungen beanspruchen am meisten Speicher?“<br>„Gab es in letzter Zeit langsame Abfragen?“</td></tr>
<tr><td>Berechtigungen</td><td>„Erstellen Sie einen schreibgeschützten Benutzer namens ‚analyst‘.“<br>„Weisen Sie der Rolle ‚admin‘ alle Berechtigungen zu.“<br>„Überprüfen Sie, welche Berechtigungen der Benutzer zhangsan hat.“</td></tr>
<tr><td>Cluster-Verwaltung</td><td>„Zeige die aktuelle Milvus-Version und -Konfiguration an.“<br>„Liste die Nutzung der Ressourcengruppen auf.“<br>„Kompaktieren Sie ‚my_collection‘ für mich.“</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Destruktive Aktionen erfordern eine Genehmigung</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Bei destruktiven oder sensiblen Vorgängen wird vor der Ausführung ein Bestätigungsdialog angezeigt</p>
<p><strong>Der Agent ist auf Transparenz und Kontrollierbarkeit ausgelegt.</strong> Nicht-destruktive Vorgänge, wie das Auflisten von Sammlungen oder das Auslesen von Metriken, liefern die Ergebnisse direkt zurück.</p>
<p>Destruktive oder sensible Vorgänge, wie das Löschen einer Sammlung, das Löschen von Daten oder das Ändern von Berechtigungen, lösen einen Bestätigungsdialog aus. Der Dialog listet die genauen Parameter auf und wartet auf die Genehmigung, bevor der Vorgang ausgeführt wird.</p>
<p>Sie können außerdem einsehen, welche Tools der Agent aufgerufen hat, wie viele Tokens er verbraucht hat und ob ein Toolaufruf fehlgeschlagen ist. Das ist für einen Datenbankverwaltungsagenten von Bedeutung. Benutzer sollten nachvollziehen können, was der Agent getan hat, und nicht nur das Endergebnis sehen.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Experten-Diagnosefunktionen über die Konsole ausführen<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Der KI-Agent verfügt über vier integrierte Diagnose-Skills.</strong> Dabei handelt es sich um geführte Workflows für gängige Milvus-Fehlerbehebungsszenarien, nicht um allgemeine Eingabeaufforderungen.</p>
<table>
<thead>
<tr><th>Diagnose-Skill</th><th>Was wird überprüft</th></tr>
</thead>
<tbody>
<tr><td>Diagnose des Clusterzustands</td><td>Version, Knotenstatus, Zustand der einzelnen Komponenten und wichtige Kennzahlen.</td></tr>
<tr><td>Diagnose der Suchleistung</td><td>Indexintegrität, Segmentfragmentierung, Replikatausgleich und zugehörige Signale zur Suchleistung.</td></tr>
<tr><td>Diagnose der Datenschreibvorgänge</td><td>Langsame Einfügungen, Überprüfungen auf Datenverlust, Anomalien beim Flush und Symptome im Schreibpfad.</td></tr>
<tr><td>Konfigurationsprüfung</td><td>Risikobehaftete oder fehlerhafte Einstellungen, die die Stabilität, die Leistung oder das erwartete Verhalten beeinträchtigen können.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0 enthält integrierte Diagnose-Skills und unterstützt benutzerdefinierte Skills</p>
<p>Sie können auch benutzerdefinierte Skills in natürlicher Sprache erstellen. Ein Skill kann eine Checkliste vor dem Start, eine Datenqualitätsprüfung für eine bestimmte Datensammlung oder einen Diagnoseablauf enthalten, den Ihr Team für eine bekannte Arbeitslast durchführt.</p>
<p>Ein benutzerdefiniertes „Skill“ besteht im Wesentlichen aus Fachwissen und einer Vorgehensweise. Nach dem Speichern kann der Agent es wiederverwenden, anstatt sich jedes Mal auf eine einmalige Eingabeaufforderung verlassen zu müssen.</p>
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
    </button></h2><p><strong>Attu bündelt keinen LLM-Dienst und fungiert auch nicht als Proxy dafür.</strong> Sie konfigurieren Ihren eigenen Anbieter und behalten die Kontrolle über den Modellpfad.</p>
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
<p>In der Praxis ermöglicht BYOL den Einsatz des Agenten in verschiedenen Umgebungen. Ein Team nutzt vielleicht OpenAI. Ein anderes nutzt möglicherweise ein Modell von Anthropic. Ein drittes leitet den Datenfluss über einen OpenAI-kompatiblen Endpunkt. Attu schreibt keinen bestimmten Modellanbieter vor.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Milvus-Daten mit einer Baumstruktur aus Datenbank → Sammlung → Partition durchsuchen<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 gestaltet auch den Datenbrowser neu. Attu 2.x zeigte hauptsächlich eine flache Liste der Sammlungen an. Das wird unübersichtlich, sobald ein Cluster über mehrere Datenbanken, Dutzende von Sammlungen und partitionierte Daten verfügt.</p>
<p><strong>Der neue Browser verwendet eine Hierarchie, die der Art und Weise entspricht, wie Milvus Daten organisiert: Datenbank → Sammlung → Partition.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Der neu gestaltete Datenbrowser nutzt eine hierarchische Navigation für Datenbanken, Sammlungen und Partitionen</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Datenoperationen sind näher an der Stelle, an der Sie navigieren</h3><p>Der Datenbrowser behält die Operationen bei, die Nutzer bereits erwarten, und fügt weitere Aktionen direkt in der Benutzeroberfläche hinzu:</p>
<ul>
<li>Ziehen Sie eine Sammlung per Drag &amp; Drop in eine andere Datenbank.</li>
<li>Führen Sie eine Vektorsuche durch, indem Sie Text direkt eingeben, sofern ein Einbettungsmodell konfiguriert ist.</li>
<li>Überprüfen Sie Ähnlichkeitswerte und grenzen Sie die Ergebnisse mithilfe von Facetten ein.</li>
<li>Importieren und exportieren Sie Daten im CSV-, JSON- und Parquet-Format.</li>
<li>Ein Sammlungsschema visuell anzeigen und bearbeiten, einschließlich Unterstützung für dynamische Felder.</li>
<li>Erstellen, löschen und überprüfen Sie Partitionen und Partitionsstatistiken.</li>
<li>Verwalten Sie den gesamten Lebenszyklus einer Sammlung: Erstellen, Laden, Freigeben, Kopieren, Umbenennen, Verschieben zwischen Datenbanken und Löschen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0-Datenbrowser mit Vektorsuche und Ergebnisüberprüfung</p>
<p>Die meisten dieser Aktionen sind über Rechtsklick-Menüs oder Bedienfelder verfügbar. Für gängige Aufgaben im Zusammenhang mit Sammlungen müssen Sie nicht mehr zwischen der Benutzeroberfläche und Befehlszeilenoperationen hin- und herwechseln.</p>
<p>Attu 3.0 ist zudem die Produktlinie, in der die UI-Unterstützung für neue <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0-Funktionen</a> wie Snapshots und nullfähige Vektoren nach und nach hinzukommen wird, sobald diese Funktionen ausgereift sind.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Operationen, Metriken, langsame Abfragen, Topologie und Backups an einem Ort<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
<p>Bild: Seite „Ops und Überwachung“ in Attu 3.0</p>
<p>Das Ziel besteht nicht darin, jedes Observability-System zu ersetzen, das ein Produktionsteam bereits nutzt. Teams können weiterhin Prometheus, Grafana, Logs, Alerts und ihren bestehenden Monitoring-Stack verwenden. Das Ziel ist es, häufig gestellte Fragen zu Milvus direkt aus Attu heraus beantworten zu können.</p>
<table>
<thead>
<tr><th>Bereich</th><th>Was Sie tun können</th></tr>
</thead>
<tbody>
<tr><td>Visuelle Cluster-Übersicht</td><td>Milvus-Version, Bereitstellungsmodus, Anzahl der Knoten, Anzahl der Datenbanken, Anzahl der Erfassungen, Auslastungsstatus und Quotenentitäten auf einen Blick anzeigen.</td></tr>
<tr><td>Echtzeit-Metriken</td><td>Überprüfen Sie QPS, Einfüge-/Löschraten, Abfragelatenz, Cache-Trefferquote und zugehörige Prometheus-gestützte Metriken.</td></tr>
<tr><td>Analyse langsamer Abfragen</td><td>Untersuchen Sie langsame Abfragen nach Typ, Dauer, Sammlung, Zeitstempel, Quelle und zugehörigem Kontext zur Fehlerbehebung.</td></tr>
<tr><td>Topologieansicht</td><td>Verschaffen Sie sich einen Überblick über die Knotentopologie und die Verbindungen zwischen Komponenten wie RootCoord, DataCoord, IndexCoord, QueryCoord und Proxy.</td></tr>
<tr><td>Sicherung und Wiederherstellung</td><td>Erstellen Sie vollständige oder inkrementelle Sicherungen in S3, MinIO, GCS oder Azure, laden Sie die Sicherungsmetadaten als ZIP-Datei herunter oder laden Sie eine Datei hoch, um die Wiederherstellung durchzuführen.</td></tr>
</tbody>
</table>
<p>Sicherung und Wiederherstellung sind besonders wichtig, da sie einen Workflow, der zuvor auf die Verwendung der Befehlszeile (CLI) angewiesen war, in die grafische Benutzeroberfläche (GUI) verlagern. Dies ist nützlich für lokale Tests, die Validierung in der Staging-Umgebung und für Teams, die einen besser nachvollziehbaren Wiederherstellungspfad wünschen.</p>
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
    </button></h2><p><strong>Attu 3.0 bietet einen REST-API-Playground für die Entwicklung und das Debugging der Milvus-API.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Attu 3.0 API-Playground</p>
<p>Der Playground listet die Milvus-REST-Endpunkte nach Kategorien auf. Wählen Sie eine Datenbank und eine Sammlung aus, und Attu füllt den Ausführungskontext automatisch aus. Von dort aus können Sie mit einem Klick eine Anfrage senden und die Antwort in Echtzeit überprüfen.</p>
<p>Dies ist nützlich, wenn Sie einen API-Aufruf testen möchten, ohne curl-Befehle oder eine Postman-Sammlung einrichten zu müssen. Es ist auch hilfreich, um zu verstehen, wie eine Milvus-Funktion auf die REST-API abgebildet wird, da Sie direkt zwischen dem UI-Kontext und dem Request-Body wechseln können.</p>
<p>Für Anwendungsentwickler ist der API Playground eine Debugging-Oberfläche. Für neue Milvus-Nutzer ist er eine Lernplattform. Für Plattformteams ist er eine schnelle Möglichkeit, Vorgänge zu validieren, bevor sie in Skripte oder Anwendungscode umgesetzt werden.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">RBAC neben der Datenbank oder Sammlung verwalten<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 verändert die Handhabung von Berechtigungsworkflows in der Benutzeroberfläche.</strong> Anstatt <a href="https://milvus.io/docs/rbac.md">RBAC</a> als separate Verwaltungsaufgabe zu behandeln, rückt die Zugriffskontrolle näher an die Registerkarten „Datenbank“ und „Sammlung“ heran, in denen die Benutzer ohnehin bereits arbeiten.</p>
<p>Das zugrunde liegende Modell ist nach wie vor das Milvus-RBAC: Benutzer, Rollen, <a href="https://milvus.io/docs/grant_privileges.md">Berechtigungen</a>, Erteilungen und Widerrufe. Attu 3.0 vereinfacht die Arbeitsabläufe rund um dieses Modell.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bild: Kontextbezogene Benutzer- und Berechtigungsverwaltung in Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Benutzererstellung mit einem Klick für gängige Geltungsbereiche</h3><p>In Attu 2.x umfasste das Einrichten eines schreibgeschützten Zugriffs auf eine Sammlung in der Regel mehrere Schritte: Benutzer anlegen, Rolle erstellen, Berechtigungen konfigurieren, die Rolle dem Benutzer zuweisen und sicherstellen, dass der Geltungsbereich korrekt war.</p>
<p><strong>In Attu 3.0 können Sie eine Sammlung öffnen, zur Registerkarte „Benutzer“ wechseln, auf „Benutzer erstellen“ klicken, „Nur Lesen“ oder „Lesen/Schreiben“ auswählen und Attu den Arbeitsablauf abschließen lassen.</strong> Das System erstellt den Benutzer, generiert ein sicheres Passwort, legt die passende, auf den Geltungsbereich beschränkte Rolle an und erteilt die Berechtigung.</p>
<p>Das gleiche Muster funktioniert auch auf Datenbankebene. Sie können einem bestehenden Benutzer mit einem Klick Zugriff auf die aktuelle Sammlung gewähren oder diesen widerrufen.</p>
<p>Dadurch bleibt die Berechtigungsverwaltung nah an der zu schützenden Ressource. Sie müssen nicht durch mehrere Verwaltungsseiten navigieren oder sich an eine Namenskonvention für Rollen erinnern, nur um einem Teamkollegen bereichsbezogenen Zugriff zu gewähren.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Was diese Beta-Version für Attu-Nutzer bedeutet<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta ist das größte Update der Milvus-Verwaltungskonsole seit der ersten Veröffentlichung von Attu.</strong> Es handelt sich nicht nur um eine optische Auffrischung. Es erweitert den Umfang dessen, was Attu bewältigen kann.</p>
<p>Die wichtigste Neuerung besteht darin, dass Attu nun der tatsächlichen Arbeitsweise vieler Milvus-Nutzer entspricht: mehrere Cluster, dauerhafte lokale Einstellungen, mehr Datenbewegungen, mehr Zugriffskontrolle, mehr Fehlerbehebung und ein größerer Bedarf, das Clusterverhalten zu verstehen, ohne zwischen verschiedenen Tools wechseln zu müssen.</p>
<p>Die Highlights sind:</p>
<ul>
<li>Verwaltung mehrerer Cluster mit Zustandsindikatoren und Umschaltung per Mausklick.</li>
<li>Persistenter lokaler Status für Clusterkonfigurationen, Einstellungen, LLM-Konfiguration, Agentenverlauf und benutzerdefinierte Skills.</li>
<li>Ein integrierter KI-Agent mit über 50 Milvus-Tools und Bestätigungsabfragen für destruktive Aktionen.</li>
<li>Vier integrierte Experten-Diagnose-Skills für Cluster-Zustand, Suchleistung, Datenschreibvorgänge und Konfigurationsüberprüfung.</li>
<li>Ein neu gestalteter Datenbrowser mit Navigation von Datenbank → Sammlung → Partition sowie erweiterten Funktionen für Sammlungen.</li>
<li>Integrierte Prometheus-Metriken, Analyse langsamer Abfragen, Topologie sowie Sicherung und Wiederherstellung.</li>
<li>Ein REST-API-Playground zum Debuggen und Erlernen der Milvus-APIs.</li>
<li>RBAC-Workflows, die neben der Datenbank oder Sammlung ablaufen und nicht nur in einem separaten Admin-Ablauf.</li>
</ul>
<p>Wenn Sie Attu ausschließlich für die lokale Milvus-Entwicklung nutzen, bietet Ihnen Version 3.0 eine leistungsfähigere Konsole. Wenn Sie mehrere Milvus-Umgebungen verwalten, lohnen sich allein schon die Änderungen im Bereich Multi-Cluster und Persistent-State. Wenn Sie häufig Leistungs- oder Berechtigungsprobleme beheben, sollten Ihnen der Agent, die Diagnosefunktionen, die Metriken und die kontextbezogenen RBAC-Workflows sofort Zeit sparen.</p>
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
<p>Öffnen Sie anschließend:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Fügen Sie Ihre Milvus-Verbindung über die Seitenleiste hinzu und entdecken Sie die neue Konsole.</p>
<p>Bevorzugen Sie eine Desktop-App? Laden Sie die für Ihre Plattform geeignete Version von <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a> herunter. Attu 3.0 Beta bietet Desktop-Pakete für macOS, Linux und Windows. Aktuelle Versionen enthalten außerdem ein eigenständiges Linux-Serverpaket, mit dem Sie Attu ohne Docker oder Electron ausführen können.</p>
<p><strong>Haben Sie Fragen?</strong> Bringen Sie Ihr Multi-Cluster-Setup, Ihre benutzerdefinierten Agent-Skills oder Ihr Diagnoseszenario in den <a href="https://discord.gg/milvus"><strong>Milvus-Discord</strong></a> ein oder buchen Sie <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours</strong></a>, um das Problem gemeinsam mit der Community zu lösen.</p>
<p><strong>Sie möchten die Milvus-Infrastruktur nicht selbst betreiben?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> ist die vollständig verwaltete Plattform von den Entwicklern von Milvus. Sie behält die Milvus-API bei und ergänzt sie um eine verwaltete Infrastruktur für Echtzeit-Vektorsuche, groß angelegte Datenermittlung und KI-Datenoperationen. Für Teams mit Anforderungen an die Datenhoheit läuft Zilliz Cloud <strong>BYOC</strong> in Ihrem eigenen Cloud-Konto, sodass die Daten in Ihrer VPC verbleiben, während Zilliz den Betrieb übernimmt.</p>
