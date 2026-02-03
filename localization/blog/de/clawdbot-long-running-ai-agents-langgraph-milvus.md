---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Warum Clawdbot viral wurde - und wie man mit LangGraph und Milvus
  produktionsreife, langlebige Agenten erstellt
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot hat bewiesen, dass Menschen KI wollen, die handelt. Erfahren Sie, wie
  Sie mit der Zwei-Agenten-Architektur, Milvus und LangGraph produktionsreife,
  langlebige Agenten erstellen können.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (jetzt OpenClaw) ging viral<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, jetzt umbenannt in OpenClaw, hat das Internet letzte Woche im Sturm erobert. Der von Peter Steinberger entwickelte Open-Source-KI-Assistent erreichte in nur wenigen Tagen <a href="https://github.com/openclaw/openclaw">mehr als 110.000 GitHub-Sterne</a>. Nutzer haben Videos gepostet, in denen sie zu sehen sind, wie er selbstständig Flüge eincheckt, E-Mails verwaltet und Smart-Home-Geräte steuert. Andrej Karpathy, der Gründungsingenieur von OpenAI, lobte es. David Sacks, ein Tech-Gründer und Investor, tweetete darüber. Die Leute nannten es "Jarvis, aber echt".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dann kamen die Sicherheitswarnungen.</p>
<p>Die Forscher fanden Hunderte von ungeschützten Administrationspanels. Der Bot läuft standardmäßig mit Root-Zugriff. Es gibt kein Sandboxing. Schwachstellen bei der Eingabeaufforderung könnten Angreifern die Möglichkeit geben, den Agenten zu kapern. Ein Sicherheitsalbtraum.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot wurde nicht ohne Grund viral<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot wurde nicht ohne Grund zum Verkaufsschlager.</strong> Er läuft lokal oder auf Ihrem eigenen Server. Er stellt eine Verbindung zu Messaging-Apps her, die bereits genutzt werden - WhatsApp, Slack, Telegram, iMessage. Es merkt sich den Kontext im Laufe der Zeit, anstatt alles nach jeder Antwort zu vergessen. Es verwaltet Kalender, fasst E-Mails zusammen und automatisiert app-übergreifende Aufgaben.</p>
<p>Die Nutzer haben das Gefühl, eine persönliche KI zu haben, die sich um sie kümmert - und nicht nur ein Prompt-and-Response-Tool. Das quelloffene, selbst gehostete Modell spricht Entwickler an, die Kontrolle und Anpassungsmöglichkeiten wünschen. Und die einfache Integration in bestehende Arbeitsabläufe macht es leicht, sie weiterzugeben und zu empfehlen.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Zwei Herausforderungen bei der Entwicklung langlebiger Agenten<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die Popularität von Clawdbot beweist, dass die Menschen KI wollen, die</strong> <em>handelt</em><strong> und nicht nur antwortet.</strong> Aber jeder Agent, der über lange Zeiträume läuft und echte Aufgaben erledigt - ob Clawdbot oder etwas, das Sie selbst entwickeln - muss zwei technische Herausforderungen lösen: <strong>Speicher</strong> und <strong>Verifizierung</strong>.</p>
<p><strong>Das Speicherproblem</strong> zeigt sich auf verschiedene Weise:</p>
<ul>
<li><p>Agenten erschöpfen ihr Kontextfenster mitten in der Aufgabe und lassen halbfertige Arbeit zurück</p></li>
<li><p>Sie verlieren den Überblick über die gesamte Aufgabenliste und erklären zu früh "fertig".</p></li>
<li><p>Sie können den Kontext zwischen Sitzungen nicht weitergeben, so dass jede neue Sitzung bei Null beginnt.</p></li>
</ul>
<p>Alle diese Probleme haben die gleiche Ursache: Agenten haben keinen dauerhaften Speicher. Die Kontextfenster sind begrenzt, der sitzungsübergreifende Abruf ist eingeschränkt, und der Fortschritt wird nicht auf eine Weise verfolgt, auf die die Agenten zugreifen können.</p>
<p><strong>Das Problem der Überprüfung</strong> ist ein anderes. Selbst wenn der Speicher funktioniert, markieren Agenten Aufgaben nach einem kurzen Unit-Test als abgeschlossen, ohne zu prüfen, ob die Funktion tatsächlich durchgängig funktioniert.</p>
<p>Clawdbot löst beide Probleme. Er speichert Speicher lokal über Sitzungen hinweg und verwendet modulare "Fähigkeiten" zur Automatisierung von Browsern, Dateien und externen Diensten. Der Ansatz funktioniert. Aber er ist nicht produktionstauglich. Für den Einsatz in Unternehmen benötigen Sie eine Struktur, Nachvollziehbarkeit und Sicherheit, die Clawdbot nicht von Haus aus bietet.</p>
<p>Dieser Artikel behandelt die gleichen Probleme mit produktionsreifen Lösungen.</p>
<p>Für den Speicher verwenden wir eine <strong>Zwei-Agenten-Architektur</strong>, die auf der <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Forschung von Anthropic</a> basiert: einen Initialisierungs-Agenten, der Projekte in überprüfbare Funktionen aufteilt, und einen Kodierungs-Agenten, der sie nacheinander mit sauberen Übergaben abarbeitet. Für den sitzungsübergreifenden semantischen Abruf verwenden wir <a href="https://milvus.io/">Milvus</a>, eine Vektordatenbank, mit der Agenten nach Bedeutung und nicht nach Schlüsselwörtern suchen können.</p>
<p>Für die Überprüfung verwenden wir die <strong>Browser-Automatisierung</strong>. Anstatt sich auf Unit-Tests zu verlassen, testet der Agent Funktionen so, wie es ein echter Benutzer tun würde.</p>
<p>Wir werden die Konzepte erläutern und dann eine funktionierende Implementierung mit <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> und Milvus zeigen.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Wie die Zwei-Agenten-Architektur die Erschöpfung des Kontexts verhindert<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Jeder LLM hat ein Kontextfenster: eine Grenze, wie viel Text er auf einmal verarbeiten kann. Wenn ein Agent an einer komplexen Aufgabe arbeitet, füllt sich dieses Fenster mit Code, Fehlermeldungen, Gesprächsverlauf und Dokumentation. Sobald das Fenster voll ist, hält der Agent entweder an oder beginnt, den früheren Kontext zu vergessen. Bei langwierigen Aufgaben ist dies unvermeidlich.</p>
<p>Stellen Sie sich einen Agenten vor, der eine einfache Aufforderung erhält: "Erstelle einen Klon von claude.ai." Das Projekt erfordert Authentifizierung, Chat-Schnittstellen, Gesprächsverlauf, Streaming-Antworten und Dutzende anderer Funktionen. Ein einzelner Agent wird versuchen, alles auf einmal in Angriff zu nehmen. Auf halbem Weg zur Implementierung der Chat-Schnittstelle füllt sich das Kontextfenster. Die Sitzung endet mit halb geschriebenem Code, ohne Dokumentation dessen, was versucht wurde, und ohne Hinweise darauf, was funktioniert und was nicht. Die nächste Sitzung erbt ein Chaos. Selbst mit Kontextverdichtung muss der neue Agent erraten, was die vorherige Sitzung gemacht hat, Code debuggen, den er nicht geschrieben hat, und herausfinden, wo er weitermachen soll. Es vergehen Stunden, bevor ein neuer Fortschritt erzielt wird.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">Die Zwei-Agenten-Lösung</h3><p>Die Lösung von Anthropic, die in ihrem technischen Beitrag <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents"</a> beschrieben wird <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">,</a> besteht darin, zwei verschiedene Prompting-Modi zu verwenden: <strong>einen Initialisierungs-Prompt</strong> für die erste Sitzung und <strong>einen Coding-Prompt</strong> für nachfolgende Sitzungen.</p>
<p>Technisch gesehen verwenden beide Modi denselben zugrundeliegenden Agenten, Systemprompt, Tools und Kabelbaum. Der einzige Unterschied ist die anfängliche Benutzerführung. Da sie jedoch unterschiedliche Aufgaben erfüllen, ist es sinnvoll, sie als zwei separate Agenten zu betrachten. Wir nennen dies die Zwei-Agenten-Architektur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Der Initialisierer richtet die Umgebung für den schrittweisen Fortschritt ein.</strong> Er nimmt eine vage Anfrage entgegen und tut drei Dinge:</p>
<ul>
<li><p><strong>Er zerlegt das Projekt in spezifische, überprüfbare Funktionen.</strong> Keine vagen Anforderungen wie "Erstellen Sie eine Chat-Schnittstelle", sondern konkrete, testbare Schritte: "Benutzer klickt auf die Schaltfläche "Neuer Chat" → neue Unterhaltung erscheint in der Seitenleiste → Chatbereich zeigt den Begrüßungsstatus an." Anthropic's claude.ai clone Beispiel hatte über 200 solcher Funktionen.</p></li>
<li><p><strong>Erzeugt eine Fortschrittsverfolgungsdatei.</strong> Diese Datei zeichnet den Fertigstellungsstatus jeder Funktion auf, so dass jede Sitzung sehen kann, was getan wurde und was noch übrig ist.</p></li>
<li><p><strong>Schreibt Einrichtungsskripte und nimmt eine erste Git-Übertragung vor.</strong> Skripte wie <code translate="no">init.sh</code> ermöglichen es zukünftigen Sitzungen, die Entwicklungsumgebung schnell zu starten. Der Git-Commit stellt eine saubere Baseline her.</p></li>
</ul>
<p>Der Initialisierer plant nicht nur. Er schafft eine Infrastruktur, die es zukünftigen Sitzungen ermöglicht, sofort mit der Arbeit zu beginnen.</p>
<p><strong>Der Coding Agent</strong> kümmert sich um jede nachfolgende Sitzung. Er:</p>
<ul>
<li><p>Liest die Fortschrittsdatei und die Git-Protokolle, um den aktuellen Zustand zu verstehen</p></li>
<li><p>Führt einen grundlegenden End-to-End-Test durch, um zu bestätigen, dass die Anwendung noch funktioniert</p></li>
<li><p>Wählt eine Funktion aus, an der er arbeiten möchte</p></li>
<li><p>Implementiert die Funktion, testet sie gründlich, überträgt sie mit einer beschreibenden Nachricht an Git und aktualisiert die Fortschrittsdatei</p></li>
</ul>
<p>Wenn die Sitzung endet, befindet sich die Codebasis in einem zusammenführbaren Zustand: keine größeren Fehler, ordentlicher Code, klare Dokumentation. Es gibt keine halbfertige Arbeit und kein Geheimnis darüber, was gemacht wurde. Die nächste Sitzung macht genau da weiter, wo die erste aufgehört hat.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Verwenden Sie JSON für das Feature Tracking, nicht Markdown</h3><p><strong>Ein erwähnenswertes Implementierungsdetail: Die Feature-Liste sollte JSON und nicht Markdown sein.</strong></p>
<p>Bei der Bearbeitung von JSON neigen KI-Modelle dazu, bestimmte Felder chirurgisch zu verändern. Bei der Bearbeitung von Markdown werden oft ganze Abschnitte umgeschrieben. Bei einer Liste von mehr als 200 Funktionen können Markdown-Bearbeitungen versehentlich Ihre Fortschrittsverfolgung beeinträchtigen.</p>
<p>Ein JSON-Eintrag sieht so aus:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Jede Funktion hat klare Überprüfungsschritte. Das Feld <code translate="no">passes</code> verfolgt die Fertigstellung. Scharf formulierte Anweisungen wie "Es ist inakzeptabel, Tests zu entfernen oder zu bearbeiten, da dies zu fehlenden oder fehlerhaften Funktionen führen könnte" werden ebenfalls empfohlen, um zu verhindern, dass der Agent das System durch Löschen schwieriger Funktionen manipuliert.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Wie Milvus den Agenten ein semantisches Gedächtnis über mehrere Sitzungen hinweg verleiht<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die Zwei-Agenten-Architektur löst zwar das Problem der Kontexterschöpfung, nicht aber das des Vergessens.</strong> Selbst bei sauberen Übergaben zwischen den Sitzungen verliert der Agent den Überblick über das, was er gelernt hat. Er kann sich nicht daran erinnern, dass "JWT-Refresh-Token" mit "Benutzerauthentifizierung" zusammenhängt, es sei denn, genau diese Wörter tauchen in der Verlaufsdatei auf. Wenn das Projekt wächst, wird die Suche in Hunderten von Git-Commits langsam. Beim Abgleich von Schlüsselwörtern werden Verbindungen übersehen, die für einen Menschen offensichtlich wären.</p>
<p><strong>Hier kommen Vektordatenbanken ins Spiel.</strong> Anstatt Text zu speichern und nach Schlüsselwörtern zu suchen, wandelt eine Vektordatenbank Text in numerische Darstellungen der Bedeutung um. Wenn Sie nach "Benutzerauthentifizierung" suchen, finden Sie Einträge über "JWT-Refresh-Tokens" und "Anmeldesitzungsverarbeitung". Nicht weil die Wörter übereinstimmen, sondern weil die Konzepte semantisch ähnlich sind. Der Agent kann fragen: "Habe ich so etwas schon einmal gesehen?" und erhält eine nützliche Antwort.</p>
<p><strong>In der Praxis funktioniert dies, indem Fortschrittsberichte und Git-Commits als Vektoren in die Datenbank eingebettet werden.</strong> Wenn eine Coding-Sitzung beginnt, fragt der Agent die Datenbank mit seiner aktuellen Aufgabe ab. Die Datenbank gibt in Millisekunden den relevanten Verlauf zurück: was zuvor versucht wurde, was funktioniert hat und was nicht. Der Agent fängt nicht bei Null an. Er beginnt mit dem Kontext.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>ist für diesen Anwendungsfall gut geeignet.</strong> Milvus ist quelloffen und für die Vektorsuche im Produktionsmaßstab konzipiert, so dass Milliarden von Vektoren ohne Probleme verarbeitet werden können. Für kleinere Projekte oder lokale Entwicklungen kann <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> direkt in eine Anwendung wie SQLite eingebettet werden. Die Einrichtung eines Clusters ist nicht erforderlich. Wenn das Projekt wächst, können Sie zu verteiltem Milvus migrieren, ohne Ihren Code zu ändern. Für die Erzeugung von Einbettungen können Sie externe Modelle wie den <a href="https://www.sbert.net/">SentenceTransformer</a> für eine feinkörnige Steuerung verwenden oder auf die <a href="https://milvus.io/docs/embeddings.md">eingebauten Einbettungsfunktionen</a> für einfachere Setups verweisen. Milvus unterstützt auch die <a href="https://milvus.io/docs/hybridsearch.md">hybride Suche</a>, die Vektorähnlichkeit mit herkömmlicher Filterung kombiniert, so dass Sie mit einem einzigen Aufruf die Abfrage "Finde ähnliche Authentifizierungsprobleme der letzten Woche" stellen können.</p>
<p><strong>Dadurch wird auch das Übertragungsproblem gelöst.</strong> Die Vektordatenbank bleibt über eine einzelne Sitzung hinaus bestehen, so dass sich das Wissen im Laufe der Zeit ansammelt. Sitzung 50 hat Zugriff auf alles, was in den Sitzungen 1 bis 49 gelernt wurde. Das Projekt entwickelt ein institutionelles Gedächtnis.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Überprüfung der Fertigstellung mit automatisierten Tests<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Selbst mit der Zwei-Agenten-Architektur und dem Langzeitgedächtnis können die Agenten den Sieg zu früh verkünden. Das ist das Problem der Verifizierung.</strong></p>
<p>Hier ist ein häufiger Fehlermodus: Eine Programmiersitzung stellt eine Funktion fertig, führt einen kurzen Einheitstest durch, stellt fest, dass er bestanden wurde, und schaltet <code translate="no">&quot;passes&quot;: false</code> auf <code translate="no">&quot;passes&quot;: true</code>. Ein bestandener Einheitstest bedeutet jedoch nicht, dass die Funktion tatsächlich funktioniert. Die API könnte korrekte Daten zurückgeben, während die Benutzeroberfläche aufgrund eines CSS-Fehlers nichts anzeigt. Die Fortschrittsdatei sagt "vollständig", während die Benutzer nichts sehen.</p>
<p><strong>Die Lösung besteht darin, den Agenten wie einen echten Benutzer testen zu lassen.</strong> Für jede Funktion in der Funktionsliste gibt es konkrete Prüfschritte: "Benutzer klickt auf die Schaltfläche "Neuer Chat" → neue Konversation erscheint in der Seitenleiste → Chatbereich zeigt Willkommensstatus". Der Agent sollte diese Schritte buchstäblich verifizieren. Anstatt nur Tests auf Code-Ebene durchzuführen, verwendet er Browser-Automatisierungstools wie Puppeteer, um die tatsächliche Nutzung zu simulieren. Er öffnet die Seite, klickt auf Schaltflächen, füllt Formulare aus und überprüft, ob die richtigen Elemente auf dem Bildschirm erscheinen. Erst wenn der gesamte Ablauf erfolgreich war, markiert der Agent die Funktion als vollständig.</p>
<p><strong>Auf diese Weise werden Probleme erkannt, die bei Unit-Tests übersehen</strong> werden. Eine Chatfunktion kann über eine perfekte Backend-Logik und korrekte API-Antworten verfügen. Aber wenn das Frontend die Antwort nicht rendert, sehen die Benutzer nichts. Die Browser-Automatisierung kann einen Screenshot des Ergebnisses erstellen und überprüfen, ob das, was auf dem Bildschirm erscheint, mit dem übereinstimmt, was erscheinen sollte. Das Feld <code translate="no">passes</code> wird nur dann zu <code translate="no">true</code>, wenn die Funktion wirklich von Anfang bis Ende funktioniert.</p>
<p><strong>Allerdings gibt es auch Einschränkungen.</strong> Einige browsereigene Funktionen können von Tools wie Puppeteer nicht automatisiert werden. Dateipicker und Systembestätigungsdialoge sind gängige Beispiele. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic merkte an</a>, dass Funktionen, die sich auf browser-native Warnmeldungen stützen, dazu neigen, fehlerhafter zu sein, weil der Agent sie nicht durch Puppeteer sehen kann. Der praktische Workaround besteht darin, diese Einschränkungen zu umgehen. Verwenden Sie, wo immer möglich, benutzerdefinierte UI-Komponenten anstelle von nativen Dialogen, damit der Agent jeden Überprüfungsschritt in der Feature-Liste testen kann.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Zusammenfügen: LangGraph für den Sitzungsstatus, Milvus für das Langzeitgedächtnis<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die oben genannten Konzepte werden in einem funktionierenden System mit zwei Werkzeugen zusammengeführt: LangGraph für den Sitzungsstatus und Milvus für das Langzeitgedächtnis.</strong> LangGraph verwaltet, was innerhalb einer einzelnen Sitzung passiert: an welcher Funktion wird gearbeitet, was ist abgeschlossen, was steht als nächstes an. Milvus speichert einen durchsuchbaren Verlauf über mehrere Sitzungen hinweg: was vorher gemacht wurde, welche Probleme aufgetreten sind und welche Lösungen funktioniert haben. Zusammen geben sie den Agenten sowohl ein Kurzzeit- als auch ein Langzeitgedächtnis.</p>
<p><strong>Ein Hinweis zu dieser Implementierung:</strong> Der folgende Code ist eine vereinfachte Demonstration. Er zeigt die wichtigsten Muster in einem einzigen Skript, aber er bildet die zuvor beschriebene Trennung der Sitzungen nicht vollständig ab. In einer Produktionsumgebung würde jede Codierungssitzung ein separater Aufruf sein, möglicherweise auf verschiedenen Rechnern oder zu verschiedenen Zeiten. Die <code translate="no">MemorySaver</code> und <code translate="no">thread_id</code> in LangGraph ermöglichen dies, indem sie den Zustand zwischen den Aufrufen aufrechterhalten. Um das Fortsetzungsverhalten zu verdeutlichen, führen Sie das Skript einmal aus, halten es an und führen es dann erneut mit demselben <code translate="no">thread_id</code> aus. Der zweite Durchlauf würde dort weitermachen, wo der erste aufgehört hat.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Schlussfolgerung</h3><p>KI-Agenten versagen bei langwierigen Aufgaben, weil ihnen ein dauerhafter Speicher und eine angemessene Überprüfung fehlen. Clawdbot wurde durch die Lösung dieser Probleme viral, aber sein Ansatz ist nicht produktionstauglich.</p>
<p>In diesem Artikel wurden drei Lösungen vorgestellt, die es sind:</p>
<ul>
<li><p><strong>Zwei-Agenten-Architektur:</strong> Ein Initialisierer unterteilt Projekte in überprüfbare Funktionen; ein Kodierungsagent arbeitet sie einzeln mit sauberen Übergaben ab. Dies verhindert die Erschöpfung des Kontexts und macht den Fortschritt nachvollziehbar.</p></li>
<li><p><strong>Vektordatenbank für semantisches Gedächtnis:</strong> <a href="https://milvus.io/">Milvus</a> speichert Fortschrittsaufzeichnungen und Git-Commits als Einbettungen, so dass Agenten nach Bedeutung und nicht nach Schlüsselwörtern suchen können. Sitzung 50 merkt sich, was Sitzung 1 gelernt hat.</p></li>
<li><p><strong>Browser-Automatisierung für echte Verifizierung:</strong> Unit-Tests verifizieren, dass der Code läuft. Puppeteer prüft, ob Funktionen tatsächlich funktionieren, indem es testet, was Benutzer auf dem Bildschirm sehen.</p></li>
</ul>
<p>Diese Muster sind nicht auf die Softwareentwicklung beschränkt. Wissenschaftliche Forschung, Finanzmodellierung, Überprüfung von Rechtsdokumenten - jede Aufgabe, die sich über mehrere Sitzungen erstreckt und zuverlässige Übergaben erfordert, kann davon profitieren.</p>
<p>Die wichtigsten Grundsätze:</p>
<ul>
<li><p>Verwenden Sie einen Initialisierer, um die Arbeit in überprüfbare Abschnitte zu unterteilen.</p></li>
<li><p>Verfolgung des Fortschritts in einem strukturierten, maschinenlesbaren Format</p></li>
<li><p>Speichern von Erfahrungen in einer Vektordatenbank zum semantischen Abruf</p></li>
<li><p>Überprüfen Sie die Fertigstellung mit realen Tests, nicht nur mit Unit-Tests</p></li>
<li><p>Entwurf sauberer Sitzungsgrenzen, damit die Arbeit sicher unterbrochen und fortgesetzt werden kann</p></li>
</ul>
<p>Die Werkzeuge sind vorhanden. Die Muster sind erprobt. Was bleibt, ist ihre Anwendung.</p>
<p><strong>Sind Sie bereit anzufangen?</strong></p>
<ul>
<li><p>Entdecken Sie <a href="https://milvus.io/">Milvus</a> und <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, um Ihren Agenten semantisches Gedächtnis hinzuzufügen.</p></li>
<li><p>Sehen Sie sich LangGraph für die Verwaltung des Sitzungsstatus an</p></li>
<li><p>Lesen Sie <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">die vollständige Studie von Anthropic</a> über langlaufende Agenten-Kabelbäume</p></li>
</ul>
<p><strong>Haben Sie Fragen oder möchten Sie uns mitteilen, was Sie entwickeln?</strong></p>
<ul>
<li><p>Treten Sie der <a href="https://milvus.io/slack">Milvus-Slack-Community</a> bei, um sich mit anderen Entwicklern auszutauschen</p></li>
<li><p>Besuchen Sie die <a href="https://milvus.io/office-hours">Milvus-Sprechstunden</a> für Live-Fragen und Antworten mit dem Team</p></li>
</ul>
