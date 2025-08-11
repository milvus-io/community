---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  AI-Agenten oder Workflows? Warum Sie bei 80 % der Automatisierungsaufgaben auf
  Agenten verzichten sollten
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  Die Integration von Refly und Milvus bietet einen pragmatischen Ansatz für die
  Automatisierung - einen Ansatz, der Zuverlässigkeit und Benutzerfreundlichkeit
  über unnötige Komplexität stellt.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>KI-Agenten sind derzeit allgegenwärtig - von Programmier-Copiloten bis hin zu Kundendienst-Bots - und sie können atemberaubend gut in komplexen Denkprozessen sein. Wie viele von Ihnen, liebe ich sie. Aber nachdem ich sowohl Agenten als auch Automatisierungsworkflows entwickelt habe, habe ich eine einfache Wahrheit gelernt: <strong>Agenten sind nicht die beste Lösung für jedes Problem.</strong></p>
<p>Als ich zum Beispiel ein Multi-Agenten-System mit CrewAI für die Dekodierung von ML gebaut habe, wurden die Dinge schnell chaotisch. Forschungsagenten ignorierten Webcrawler zu 70 % der Zeit. Zusammenfassende Agenten ließen Zitate fallen. Die Koordination brach immer dann zusammen, wenn die Aufgaben nicht kristallklar waren.</p>
<p>Und das gilt nicht nur für Experimente. Viele von uns pendeln bereits zwischen ChatGPT für das Brainstorming, Claude für die Codierung und einem halben Dutzend APIs für die Datenverarbeitung hin und her und denken im Stillen: <em>Es muss doch einen besseren Weg geben, all das zusammen zu bringen.</em></p>
<p>Manchmal ist die Antwort ein Agent. Häufiger ist es ein <strong>gut durchdachter KI-Workflow</strong>, der Ihre vorhandenen Tools zu etwas Leistungsfähigem zusammenfügt, ohne die unvorhersehbare Komplexität.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Aufbau intelligenter KI-Workflows mit Refly und Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich weiß, dass einige von Ihnen bereits den Kopf schütteln: "Workflows? Die sind doch starr. Sie sind nicht intelligent genug für echte KI-Automatisierung." Das stimmt - die meisten Workflows sind starr, weil sie nach dem Vorbild von Fließbändern alter Schule gestaltet sind: Schritt A → Schritt B → Schritt C, keine Abweichung erlaubt.</p>
<p>Aber das eigentliche Problem ist nicht die <em>Idee</em> der Workflows, sondern die <em>Ausführung</em>. Wir müssen uns nicht mit spröden, linearen Pipelines zufrieden geben. Wir können intelligentere Arbeitsabläufe entwerfen, die sich an den Kontext anpassen, mit Kreativität arbeiten und dennoch vorhersehbare Ergebnisse liefern.</p>
<p>In diesem Leitfaden bauen wir ein komplettes System zur Erstellung von Inhalten mit Refly und Milvus auf, um zu zeigen, warum KI-Workflows komplexe Multi-Agenten-Architekturen übertreffen können, vor allem, wenn Sie Wert auf Geschwindigkeit, Zuverlässigkeit und Wartungsfreundlichkeit legen.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Die von uns verwendeten Tools</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Eine Open-Source-Plattform für die Erstellung von KI-Inhalten, die auf einem "Free Canvas"-Konzept basiert.</p>
<ul>
<li><p><strong>Kernfunktionen:</strong> Intelligente Leinwand, Wissensmanagement, Multithreading-Dialog und professionelle Erstellungstools.</p></li>
<li><p><strong>Warum es nützlich ist:</strong> Dank der Drag-and-Drop-Workflow-Erstellung können Sie Tools zu zusammenhängenden Automatisierungssequenzen verketten, ohne sich auf eine starre, einseitige Ausführung festlegen zu müssen.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: Eine Open-Source-Vektordatenbank für die Datenebene.</p>
<ul>
<li><p><strong>Warum das wichtig ist:</strong> Bei der Erstellung von Inhalten geht es hauptsächlich darum, vorhandene Informationen zu finden und neu zu kombinieren. Herkömmliche Datenbanken können gut mit strukturierten Daten umgehen, aber die meisten kreativen Arbeiten beinhalten unstrukturierte Formate - Dokumente, Bilder, Videos.</p></li>
<li><p><strong>Was es bringt:</strong> Milvus nutzt integrierte Einbettungsmodelle, um unstrukturierte Daten als Vektoren zu kodieren und eine semantische Suche zu ermöglichen, damit Ihre Arbeitsabläufe relevanten Kontext mit einer Latenzzeit von Millisekunden abrufen können. Über Protokolle wie MCP lässt sich Milvus nahtlos in Ihre KI-Frameworks integrieren, so dass Sie Daten in natürlicher Sprache abfragen können, anstatt sich mit der Datenbanksyntax herumzuschlagen.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Einrichten Ihrer Umgebung</h3><p>Ich zeige Ihnen, wie Sie diesen Workflow lokal einrichten.</p>
<p><strong>Schnelle Einrichtungs-Checkliste:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (oder ein ähnliches Linux)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Ein API-Schlüssel von einem LLM, der Funktionsaufrufe unterstützt. In dieser Anleitung verwende ich den LLM von <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>System-Anforderungen</strong></p>
<ul>
<li><p>CPU: Mindestens 8 Kerne (16 Kerne empfohlen)</p></li>
<li><p>Speicher: mindestens 16 GB (32 GB empfohlen)</p></li>
<li><p>Speicherplatz: Mindestens 100 GB SSD (500 GB empfohlen)</p></li>
<li><p>Netzwerk: Stabile Internetverbindung erforderlich</p></li>
</ul>
<p><strong>Software-Abhängigkeiten</strong></p>
<ul>
<li><p>Betriebssystem: Linux (Ubuntu 20.04+ empfohlen)</p></li>
<li><p>Containerisierung: Docker + Docker Compose</p></li>
<li><p>Python: Version 3.11 oder höher</p></li>
<li><p>Sprachmodell: Jedes Modell, das Funktionsaufrufe unterstützt (Online-Dienste oder Ollama-Offline-Bereitstellung funktionieren beide)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Schritt 1: Bereitstellen der Milvus-Vektor-Datenbank</h3><p><strong>1.1 Milvus herunterladen</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Milvus-Dienste starten</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Schritt 2: Bereitstellen der Refly-Plattform</h3><p><strong>2.1 Klonen Sie das Repository</strong></p>
<p>Sie können für alle Umgebungsvariablen Standardwerte verwenden, es sei denn, Sie haben spezielle Anforderungen:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Überprüfen des Dienststatus</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Schritt 3: Einrichten der MCP-Dienste</h3><p><strong>3.1 Herunterladen des Milvus MCP-Servers</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Starten Sie den MCP-Dienst</strong></p>
<p>In diesem Beispiel wird der SSE-Modus verwendet. Ersetzen Sie die URI durch Ihren verfügbaren Milvus-Dienst-Endpunkt:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Bestätigen Sie, dass der MCP-Dienst läuft</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Schritt 4: Konfiguration und Einrichtung</h3><p>Jetzt, wo Ihre Infrastruktur läuft, können wir alles so konfigurieren, dass es nahtlos zusammenarbeitet.</p>
<p><strong>4.1 Zugriff auf die Refly-Plattform</strong></p>
<p>Navigieren Sie zu Ihrer lokalen Refly-Instanz:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Erstellen Sie Ihr Konto</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Konfigurieren Sie Ihr Sprachmodell</strong></p>
<p>Für diesen Leitfaden verwenden wir <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. Registrieren Sie sich zunächst und erhalten Sie Ihren API-Schlüssel.</p>
<p><strong>4.4 Fügen Sie Ihren Modellanbieter hinzu</strong></p>
<p>Geben Sie den API-Schlüssel ein, den Sie im vorherigen Schritt erhalten haben:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Konfigurieren Sie das LLM-Modell</strong></p>
<p>Stellen Sie sicher, dass Sie ein Modell auswählen, das Funktionsaufrufe unterstützt, da dies für die Workflow-Integrationen, die wir erstellen werden, unerlässlich ist:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Integrieren Sie den Milvus-MCP-Dienst</strong></p>
<p>Beachten Sie, dass die Webversion keine Verbindungen vom Typ stdio unterstützt, daher verwenden wir den HTTP-Endpunkt, den wir zuvor eingerichtet haben:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ausgezeichnet! Nachdem nun alles konfiguriert ist, wollen wir das System anhand einiger praktischer Beispiele in Aktion sehen.</p>
<p><strong>4.7 Beispiel: Effizientes Abrufen von Vektoren mit MCP-Milvus-Server</strong></p>
<p>Dieses Beispiel zeigt, wie der <strong>MCP-Milvus-Server</strong> als Middleware zwischen Ihren KI-Modellen und den Milvus-Vektor-Datenbankinstanzen arbeitet. Er agiert wie ein Übersetzer - er nimmt natürlichsprachliche Anfragen von Ihrem KI-Modell an, konvertiert sie in die richtigen Datenbankabfragen und gibt die Ergebnisse zurück, so dass Ihre Modelle mit Vektordaten arbeiten können, ohne eine Datenbanksyntax zu kennen.</p>
<p><strong>4.7.1 Erstellen Sie eine neue Leinwand</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Starten Sie eine Konversation</strong></p>
<p>Öffnen Sie die Dialogschnittstelle, wählen Sie Ihr Modell aus, geben Sie Ihre Frage ein und senden Sie.</p>
<p><strong>4.7.3 Überprüfen Sie die Ergebnisse</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Was hier passiert, ist ziemlich bemerkenswert: Wir haben gerade gezeigt, wie eine Milvus-Vektordatenbank mit Hilfe von <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> als Integrationsschicht über natürliche Sprache gesteuert wird. Keine komplexe Abfragesyntax - sagen Sie dem System einfach, was Sie brauchen, und es erledigt die Datenbankoperationen für Sie.</p>
<p><strong>4.8 Beispiel 2: Erstellung einer Refly-Einsatzanleitung mit Workflows</strong></p>
<p>Dieses zweite Beispiel zeigt die wahre Stärke der Workflow-Orchestrierung. Wir werden einen vollständigen Einsatzleitfaden erstellen, indem wir mehrere KI-Tools und Datenquellen in einem einzigen, kohärenten Prozess kombinieren.</p>
<p><strong>4.8.1 Sammeln Sie Ihr Quellmaterial</strong></p>
<p>Die Stärke von Refly ist seine Flexibilität im Umgang mit verschiedenen Eingabeformaten. Sie können Ressourcen in verschiedenen Formaten importieren, egal ob es sich um Dokumente, Bilder oder strukturierte Daten handelt.</p>
<p><strong>4.8.2 Aufgaben erstellen und Ressourcenkarten verknüpfen</strong></p>
<p>Jetzt erstellen wir unseren Arbeitsablauf, indem wir Aufgaben definieren und sie mit unseren Quellmaterialien verknüpfen.</p>
<p><strong>4.8.3 Drei Verarbeitungsaufgaben einrichten</strong></p>
<p>Hier kommt der Workflow-Ansatz voll zur Geltung. Anstatt zu versuchen, alles in einem komplexen Prozess zu bearbeiten, unterteilen wir die Arbeit in drei konzentrierte Aufgaben, die hochgeladene Materialien integrieren und systematisch verfeinern.</p>
<ul>
<li><p><strong>Aufgabe zur Integration von Inhalten</strong>: Kombiniert und strukturiert das Quellmaterial</p></li>
<li><p><strong>Aufgabe zur Verfeinerung des Inhalts</strong>: Verbessert die Klarheit und den Fluss</p></li>
<li><p><strong>Zusammenstellung des endgültigen Entwurfs</strong>: Erstellung einer publikationsreifen Ausgabe</p></li>
</ul>
<p>Die Ergebnisse sprechen für sich selbst. Was früher stundenlange manuelle Koordination über mehrere Werkzeuge hinweg erforderte, wird jetzt automatisch erledigt, wobei jeder Schritt logisch auf dem vorhergehenden aufbaut.</p>
<p><strong>Multimodale Workflow-Funktionen:</strong></p>
<ul>
<li><p><strong>Bilderzeugung und -verarbeitung</strong>: Integration mit hochwertigen Modellen wie flux-schnell, flux-pro und SDXL</p></li>
<li><p><strong>Videogenerierung und -verstehen</strong>: Unterstützung für verschiedene stilisierte Videomodelle, darunter Seedance, Kling und Veo</p></li>
<li><p><strong>Werkzeuge zur Audiogenerierung</strong>: Musikgenerierung durch Modelle wie Lyria-2 und Sprachsynthese durch Modelle wie Chatterbox</p></li>
<li><p><strong>Integrierte Verarbeitung</strong>: Alle multimodalen Ausgaben können innerhalb des Systems referenziert, analysiert und weiterverarbeitet werden.</p></li>
</ul>
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
    </button></h2><p>Die Integration von <strong>Refly</strong> und <strong>Milvus</strong> bietet einen pragmatischen Ansatz für die Automatisierung - einen Ansatz, der Zuverlässigkeit und Benutzerfreundlichkeit über unnötige Komplexität stellt. Durch die Kombination von Workflow-Orchestrierung und multimodaler Verarbeitung können Teams schneller vom Konzept zur Veröffentlichung gelangen und behalten dabei in jeder Phase die volle Kontrolle.</p>
<p>Hier geht es nicht darum, KI-Agenten zu verwerfen. Sie sind wertvoll für die Bewältigung wirklich komplexer, unvorhersehbarer Probleme. Aber bei vielen Automatisierungsanforderungen - vor allem bei der Erstellung von Inhalten und der Datenverarbeitung - kann ein gut durchdachter Workflow bessere Ergebnisse bei geringerem Aufwand liefern.</p>
<p>Mit der Weiterentwicklung der KI-Technologie werden die effektivsten Systeme wahrscheinlich beide Strategien kombinieren:</p>
<ul>
<li><p><strong>Workflows</strong>, bei denen Vorhersagbarkeit, Wartbarkeit und Reproduzierbarkeit im Vordergrund stehen.</p></li>
<li><p><strong>Agenten</strong>, bei denen echtes Denkvermögen, Anpassungsfähigkeit und offene Problemlösungen gefragt sind.</p></li>
</ul>
<p>Das Ziel ist nicht, die auffälligste KI zu entwickeln, sondern die <em>nützlichste</em>. Und oft ist die hilfreichste Lösung auch die einfachste.</p>
