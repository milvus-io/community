---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Warum sich Claude Code so stabil anfühlt: Das Design der lokalen Speicherung
  eines Entwicklers
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Tiefe Einblicke in die Speicherung von Claude Code: JSONL-Sitzungsprotokolle,
  Projektisolierung, mehrschichtige Konfiguration und Datei-Snapshots, die
  KI-unterstütztes Coding stabil und wiederherstellbar machen.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Claude Code ist in letzter Zeit überall zu finden. Entwickler nutzen ihn, um Funktionen schneller bereitzustellen, Arbeitsabläufe zu automatisieren und Prototypen von Agenten zu entwickeln, die in echten Projekten tatsächlich funktionieren. Noch überraschender ist, wie viele Nicht-Programmierer ebenfalls mitmachen - sie erstellen Tools, verkabeln Aufgaben und erhalten nützliche Ergebnisse, ohne sich großartig einarbeiten zu müssen. Es ist selten, dass sich ein KI-Codierungstool so schnell über so viele verschiedene Qualifikationsstufen hinweg verbreitet.</p>
<p>Was aber wirklich auffällt, ist die <em>Stabilität</em> des Systems. Claude Code merkt sich, was in den verschiedenen Sitzungen passiert ist, überlebt Abstürze, ohne dass der Fortschritt verloren geht, und verhält sich eher wie ein lokales Entwicklungswerkzeug als eine Chat-Schnittstelle. Diese Zuverlässigkeit ergibt sich aus der Art und Weise, wie es die lokale Speicherung handhabt.</p>
<p>Anstatt Ihre Coding-Sitzung wie einen temporären Chat zu behandeln, liest und schreibt Claude Code echte Dateien, speichert den Projektstatus auf der Festplatte und zeichnet jeden Arbeitsschritt des Agenten auf. Sitzungen können fortgesetzt, überprüft oder zurückgesetzt werden, ohne dass man sich Gedanken machen muss, und jedes Projekt bleibt sauber isoliert - so werden die Probleme der gegenseitigen Verunreinigung vermieden, die bei vielen Agententools auftreten.</p>
<p>In diesem Beitrag werfen wir einen genaueren Blick auf die Speicherarchitektur, die hinter dieser Stabilität steht, und warum sie eine so große Rolle dabei spielt, dass sich Claude Code für die tägliche Entwicklung praktisch anfühlt.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Herausforderungen, mit denen jeder lokale KI-Codierassistent konfrontiert ist<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir erläutern, wie Claude Code an die Speicherung herangeht, wollen wir einen Blick auf die üblichen Probleme werfen, mit denen lokale KI-Codierwerkzeuge zu kämpfen haben. Diese treten natürlich auf, wenn ein Assistent direkt auf Ihrem Dateisystem arbeitet und den Status über die Zeit behält.</p>
<p><strong>1. Projektdaten werden in verschiedenen Arbeitsbereichen vermischt.</strong></p>
<p>Die meisten Entwickler wechseln im Laufe des Tages zwischen mehreren Repos hin und her. Wenn ein Assistent den Status von einem Projekt zum anderen überträgt, wird es schwieriger, sein Verhalten zu verstehen, und es ist leichter, falsche Annahmen zu treffen. Jedes Projekt braucht einen eigenen, sauberen, isolierten Bereich für Status und Historie.</p>
<p><strong>2. Abstürze können zu Datenverlusten führen.</strong></p>
<p>Während einer Coding-Sitzung produziert ein Assistent einen stetigen Strom nützlicher Daten - Dateibearbeitungen, Tool-Aufrufe, Zwischenschritte. Wenn diese Daten nicht sofort gespeichert werden, können sie bei einem Absturz oder erzwungenen Neustart verloren gehen. Ein zuverlässiges System schreibt wichtige Daten auf die Festplatte, sobald sie erstellt wurden, damit die Arbeit nicht unerwartet verloren geht.</p>
<p><strong>3. Es ist nicht immer klar, was der Agent tatsächlich getan hat.</strong></p>
<p>Eine typische Sitzung umfasst viele kleine Aktionen. Ohne eine klare, geordnete Aufzeichnung dieser Aktionen ist es schwierig, nachzuvollziehen, wie der Assistent zu einem bestimmten Ergebnis gekommen ist, oder den Schritt zu finden, bei dem etwas schief gelaufen ist. Eine vollständige Historie macht die Fehlersuche und -behebung wesentlich einfacher.</p>
<p><strong>4. Das Rückgängigmachen von Fehlern ist zu aufwändig.</strong></p>
<p>Manchmal nimmt der Assistent Änderungen vor, die nicht ganz funktionieren. Wenn Sie keine eingebaute Möglichkeit haben, diese Änderungen rückgängig zu machen, müssen Sie am Ende manuell nach Änderungen im Projektarchiv suchen. Das System sollte automatisch verfolgen, was sich geändert hat, so dass Sie es sauber und ohne zusätzliche Arbeit rückgängig machen können.</p>
<p><strong>5. Verschiedene Projekte brauchen verschiedene Einstellungen.</strong></p>
<p>Lokale Umgebungen variieren. Einige Projekte erfordern spezielle Berechtigungen, Werkzeuge oder Verzeichnisregeln, andere haben eigene Skripte oder Arbeitsabläufe. Ein Assistent muss diese Unterschiede respektieren und projektspezifische Einstellungen zulassen, während sein Kernverhalten konsistent bleibt.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Die Speicherdesignprinzipien von Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Speicherdesign von Claude Code basiert auf vier einfachen Ideen. Sie mögen einfach erscheinen, aber zusammen lösen sie die praktischen Probleme, die auftreten, wenn ein KI-Assistent direkt auf Ihrem Rechner und über mehrere Projekte hinweg arbeitet.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Jedes Projekt erhält seinen eigenen Speicher.</h3><p>Claude Code bindet alle Sitzungsdaten an das Projektverzeichnis, zu dem sie gehören. Das bedeutet, dass Unterhaltungen, Bearbeitungen und Protokolle bei dem Projekt bleiben, aus dem sie stammen, und nicht in andere Projekte gelangen. Durch die getrennte Speicherung ist das Verhalten des Assistenten leichter zu verstehen und es ist einfach, Daten für ein bestimmtes Repo zu prüfen oder zu löschen.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Die Daten werden sofort auf der Festplatte gespeichert.</h3><p>Anstatt Interaktionsdaten im Speicher zu halten, schreibt Claude Code sie auf die Festplatte, sobald sie erstellt wurden. Jedes Ereignis - Nachricht, Werkzeugaufruf oder Statusaktualisierung - wird als neuer Eintrag angehängt. Wenn das Programm abstürzt oder unerwartet geschlossen wird, ist fast alles noch vorhanden. Mit diesem Ansatz bleiben die Sitzungen dauerhaft erhalten, ohne dass die Komplexität zu groß wird.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Jede Aktion hat einen eindeutigen Platz in der Historie.</h3><p>Claude Code verknüpft jede Nachricht und jede Werkzeugaktion mit der vorhergehenden und bildet so eine vollständige Sequenz. Diese geordnete Historie macht es möglich, den Verlauf einer Sitzung zu überprüfen und die Schritte nachzuvollziehen, die zu einem bestimmten Ergebnis geführt haben. Für die Entwickler erleichtert diese Art der Rückverfolgung die Fehlersuche und das Verständnis des Agentenverhaltens erheblich.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Code-Änderungen sind leicht rückgängig zu machen.</h3><p>Bevor der Assistent eine Datei aktualisiert, speichert Claude Code einen Snapshot des vorherigen Zustands. Wenn sich die Änderung als falsch herausstellt, können Sie die frühere Version wiederherstellen, ohne sich durch das Repo zu wühlen oder zu raten, was sich geändert hat. Dieses einfache Sicherheitsnetz macht KI-gesteuerte Bearbeitungen weit weniger riskant.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Lokales Speicherlayout von Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code speichert alle lokalen Daten an einem einzigen Ort: Ihrem Home-Verzeichnis. Dadurch bleibt das System vorhersehbar und es ist einfacher, es bei Bedarf zu überprüfen, zu debuggen oder zu bereinigen. Das Speicherlayout ist um zwei Hauptkomponenten herum aufgebaut: eine kleine globale Konfigurationsdatei und ein größeres Datenverzeichnis, in dem der gesamte Projektstatus gespeichert wird.</p>
<p><strong>Zwei Kernkomponenten:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Speichert die globale Konfiguration und Verknüpfungen, einschließlich Projektzuordnungen, MCP-Servereinstellungen und zuletzt verwendete Eingabeaufforderungen.</p></li>
<li><p><code translate="no">~/.claude/</code>Das Hauptdatenverzeichnis, in dem Claude Code Unterhaltungen, Projektsitzungen, Berechtigungen, Plugins, Fertigkeiten, den Verlauf und zugehörige Laufzeitdaten speichert.</p></li>
</ul>
<p>Schauen wir uns nun diese beiden Kernkomponenten genauer an.</p>
<p><strong>(1) Globale Konfiguration</strong>: <code translate="no">~/.claude.json</code></p>
<p>Diese Datei fungiert eher als Index denn als Datenspeicher. Sie zeichnet auf, an welchen Projekten Sie gearbeitet haben, welche Werkzeuge mit den einzelnen Projekten verbunden sind und welche Prompts Sie zuletzt verwendet haben. Die Konversationsdaten selbst werden hier nicht gespeichert.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Hauptdatenverzeichnis</strong>: <code translate="no">~/.claude/</code></p>
<p>Das Verzeichnis <code translate="no">~/.claude/</code> ist der Ort, an dem der größte Teil des lokalen Status von Claude Code gespeichert wird. Seine Struktur spiegelt einige zentrale Design-Ideen wider: Projektisolierung, sofortige Persistenz und sichere Wiederherstellung nach Fehlern.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dieses Layout ist absichtlich einfach: Alles, was Claude Code erzeugt, befindet sich in einem Verzeichnis, das nach Projekt und Sitzung geordnet ist. Es gibt keine versteckten Zustände, die in Ihrem System verstreut sind, und es ist einfach, sie zu überprüfen oder zu bereinigen, wenn es nötig ist.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Wie Claude Code die Konfiguration verwaltet<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Konfigurationssystem von Claude Code basiert auf einer einfachen Idee: Das Standardverhalten soll über alle Maschinen hinweg konsistent bleiben, aber die einzelnen Umgebungen und Projekte sollen dennoch die Möglichkeit haben, das anzupassen, was sie benötigen. Um dies zu erreichen, verwendet Claude Code ein dreischichtiges Konfigurationsmodell. Wenn dieselbe Einstellung an mehreren Stellen vorkommt, gewinnt immer die spezifischere Ebene.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Die drei Konfigurationsebenen</h3><p>Claude Code lädt die Konfiguration in der folgenden Reihenfolge, von der niedrigsten zur höchsten Priorität:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Sie können sich das so vorstellen, dass Sie mit globalen Standardeinstellungen beginnen, dann maschinenspezifische Anpassungen vornehmen und schließlich projektspezifische Regeln anwenden.</p>
<p>Im Folgenden werden wir jede Konfigurationsebene im Detail durchgehen.</p>
<p><strong>(1) Globale Konfiguration</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>Die globale Konfiguration legt das Standardverhalten für Claude Code in allen Projekten fest. Hier legen Sie die grundlegenden Berechtigungen fest, aktivieren Plugins und konfigurieren das Bereinigungsverhalten.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Lokale Konfiguration</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>Die lokale Konfiguration ist spezifisch für einen einzelnen Rechner. Sie ist nicht dafür gedacht, gemeinsam genutzt oder in die Versionskontrolle eingecheckt zu werden. Daher ist sie ein guter Ort für API-Schlüssel, lokale Tools oder umgebungsspezifische Berechtigungen.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Konfiguration auf Projektebene</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>Die Konfiguration auf Projektebene gilt nur für ein einzelnes Projekt und hat die höchste Priorität. Hier legen Sie Regeln fest, die immer gelten sollen, wenn Sie in diesem Repository arbeiten.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Nachdem die Konfigurationsebenen definiert sind, stellt sich nun die Frage <strong>, wie Claude Code die Konfiguration und die Berechtigungen zur Laufzeit auflöst.</strong></p>
<p><strong>Claude Code</strong> wendet die Konfiguration in drei Ebenen an: Zunächst werden globale Standardeinstellungen verwendet, dann werden maschinenspezifische Überschreibungen angewendet und schließlich werden projektspezifische Regeln angewendet. Wenn die gleiche Einstellung an mehreren Stellen vorkommt, hat die spezifischste Konfiguration Vorrang.</p>
<p>Die Berechtigungen folgen einer festen Bewertungsreihenfolge:</p>
<ol>
<li><p><strong>verweigern</strong> - sperrt immer</p></li>
<li><p><strong>ask</strong> - erfordert eine Bestätigung</p></li>
<li><p><strong>allow</strong> - wird automatisch ausgeführt</p></li>
<li><p><strong>default</strong> - gilt nur, wenn keine Regel passt</p></li>
</ol>
<p>Auf diese Weise bleibt das System standardmäßig sicher, während es Projekten und einzelnen Maschinen die nötige Flexibilität bietet.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Sitzungsspeicherung: Wie Claude Code die wichtigsten Interaktionsdaten speichert<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>In <strong>Claude Code</strong> sind Sitzungen die zentrale Dateneinheit. Eine Sitzung erfasst die gesamte Interaktion zwischen dem Benutzer und der KI, einschließlich der Konversation selbst, der Werkzeugaufrufe, der Dateiänderungen und des zugehörigen Kontexts. Die Art und Weise, wie Sessions gespeichert werden, hat einen direkten Einfluss auf die Zuverlässigkeit, Fehlersuchbarkeit und allgemeine Sicherheit des Systems.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Sitzungsdaten für jedes Projekt getrennt halten</h3><p>Sobald die Sitzungen definiert sind, stellt sich die Frage, wie <strong>Claude Code</strong> sie so speichert, dass die Daten organisiert und isoliert bleiben.</p>
<p><strong>Claude Code</strong> isoliert die Sitzungsdaten nach Projekten. Die Sitzungen jedes Projekts werden in einem Verzeichnis gespeichert, das sich aus dem Dateipfad des Projekts ergibt.</p>
<p>Der Speicherpfad folgt diesem Muster:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Um einen gültigen Verzeichnisnamen zu erstellen, werden Sonderzeichen wie <code translate="no">/</code>, Leerzeichen und <code translate="no">~</code> durch <code translate="no">-</code> ersetzt.</p>
<p>Ein Beispiel:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Dieser Ansatz stellt sicher, dass Sitzungsdaten aus verschiedenen Projekten nicht vermischt werden und projektspezifisch verwaltet oder entfernt werden können.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Warum werden Sitzungen im JSONL-Format gespeichert?</h3><p><strong>Claude Code</strong> speichert Sitzungsdaten mit JSONL (JSON Lines) anstelle von Standard-JSON.</p>
<p>In einer herkömmlichen JSON-Datei werden alle Nachrichten in einer großen Struktur gebündelt, was bedeutet, dass die gesamte Datei bei jeder Änderung gelesen und neu geschrieben werden muss. Im Gegensatz dazu wird bei JSONL jede Meldung als eigene Zeile in der Datei gespeichert. Eine Zeile entspricht einer Nachricht, ohne äußere Hülle.</p>
<table>
<thead>
<tr><th>Aspekt</th><th>Standard-JSON</th><th>JSONL (JSON-Zeilen)</th></tr>
</thead>
<tbody>
<tr><td>Wie die Daten gespeichert werden</td><td>Eine große Struktur</td><td>Eine Nachricht pro Zeile</td></tr>
<tr><td>Wann werden die Daten gespeichert?</td><td>Normalerweise am Ende</td><td>Unmittelbar, pro Nachricht</td></tr>
<tr><td>Auswirkungen eines Absturzes</td><td>Ganze Datei kann abbrechen</td><td>Nur letzte Zeile betroffen</td></tr>
<tr><td>Schreiben neuer Daten</td><td>Gesamte Datei neu schreiben</td><td>Anhängen einer Zeile</td></tr>
<tr><td>Speicherverbrauch</td><td>Alles laden</td><td>Zeile für Zeile lesen</td></tr>
</tbody>
</table>
<p>JSONL funktioniert in mehreren wichtigen Punkten besser:</p>
<ul>
<li><p><strong>Sofortiges Speichern:</strong> Jede Nachricht wird auf die Festplatte geschrieben, sobald sie erzeugt wurde, anstatt auf das Ende der Sitzung zu warten.</p></li>
<li><p><strong>Absturzsicher:</strong> Wenn das Programm abstürzt, kann nur die letzte unvollendete Nachricht verloren gehen. Alles, was davor geschrieben wurde, bleibt intakt.</p></li>
<li><p><strong>Schnelles Anhängen:</strong> Neue Nachrichten werden an das Ende der Datei angehängt, ohne dass vorhandene Daten gelesen oder überschrieben werden müssen.</p></li>
<li><p><strong>Geringer Speicherbedarf:</strong> Sitzungsdateien können Zeile für Zeile gelesen werden, so dass nicht die gesamte Datei in den Speicher geladen werden muss.</p></li>
</ul>
<p>Eine vereinfachte JSONL-Sitzungsdatei sieht wie folgt aus:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Session-Nachrichtentypen</h3><p>Eine Sitzungsdatei zeichnet alles auf, was während einer Interaktion mit Claude Code geschieht. Um dies übersichtlich zu tun, verwendet sie verschiedene Nachrichtentypen für verschiedene Arten von Ereignissen.</p>
<ul>
<li><p><strong>Benutzernachrichten</strong> stellen neue Eingaben dar, die in das System gelangen. Dazu gehören nicht nur die Eingaben des Benutzers, sondern auch die von Werkzeugen zurückgegebenen Ergebnisse, z. B. die Ausgabe eines Shell-Befehls. Aus der Sicht der KI sind beides Eingaben, auf die sie reagieren muss.</p></li>
<li><p><strong>Assistentenmeldungen</strong> halten fest, was Claude daraufhin tut. Diese Nachrichten enthalten die Überlegungen der KI, den von ihr erzeugten Text und alle Werkzeuge, die sie zu verwenden beschließt. Sie zeichnen auch Nutzungsdetails auf, wie z. B. die Anzahl der Token, um ein vollständiges Bild der Interaktion zu erhalten.</p></li>
<li><p><strong>Schnappschüsse der Dateigeschichte</strong> sind Sicherheitskontrollpunkte, die erstellt werden, bevor Claude eine Datei ändert. Indem der ursprüngliche Dateistatus zuerst gespeichert wird, ermöglicht Claude Code es, Änderungen rückgängig zu machen, falls etwas schief geht.</p></li>
<li><p><strong>Zusammenfassungen</strong> bieten einen knappen Überblick über die Sitzung und sind mit dem Endergebnis verknüpft. Sie erleichtern das Verständnis einer Sitzung, ohne dass jeder Schritt noch einmal durchgespielt werden muss.</p></li>
</ul>
<p>Zusammen zeichnen diese Nachrichtentypen nicht nur das Gespräch auf, sondern die gesamte Abfolge von Aktionen und Auswirkungen, die während einer Sitzung auftreten.</p>
<p>Um dies zu verdeutlichen, sehen wir uns spezifische Beispiele für Benutzernachrichten und Assistentenmeldungen an.</p>
<p><strong>(1) Beispiel für Benutzernachrichten:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Beispiel für Assistentenmeldungen:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Wie Sitzungsnachrichten verknüpft werden</h3><p>Claude Code speichert Sitzungsnachrichten nicht als isolierte Einträge. Stattdessen werden sie miteinander verknüpft, um eine klare Ereigniskette zu bilden. Jede Nachricht enthält einen eindeutigen Bezeichner (<code translate="no">uuid</code>) und einen Verweis auf die Nachricht, die vor ihr kam (<code translate="no">parentUuid</code>). So kann man nicht nur sehen, was passiert ist, sondern auch, warum es passiert ist.</p>
<p>Eine Sitzung beginnt mit einer Benutzernachricht, mit der die Kette beginnt. Jede Antwort von Claude verweist zurück auf die Nachricht, die sie ausgelöst hat. Werkzeugaufrufe und ihre Ausgaben werden auf die gleiche Weise hinzugefügt, wobei jeder Schritt mit dem vorhergehenden verknüpft ist. Wenn die Sitzung endet, wird eine Zusammenfassung an die letzte Nachricht angehängt.</p>
<p>Da jeder Schritt miteinander verknüpft ist, kann Claude Code die gesamte Abfolge der Aktionen wiedergeben und nachvollziehen, wie ein Ergebnis zustande gekommen ist, was die Fehlersuche und Analyse erheblich erleichtert.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Einfaches Rückgängigmachen von Code-Änderungen mit Datei-Snapshots<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>KI-generierte Änderungen sind nicht immer korrekt, und manchmal gehen sie in die völlig falsche Richtung. Um diese Änderungen sicher zu machen, verwendet Claude Code ein einfaches Schnappschusssystem, mit dem Sie Änderungen rückgängig machen können, ohne sich durch Diffs wühlen oder Dateien manuell bereinigen zu müssen.</p>
<p>Die Idee ist einfach: <strong>Bevor Claude Code eine Datei ändert, speichert es eine Kopie des ursprünglichen Inhalts.</strong> Stellt sich heraus, dass die Änderung ein Fehler war, kann das System die vorherige Version sofort wiederherstellen.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">Was ist ein <em>Snapshot der Dateigeschichte</em>?</h3><p>Ein <em>Dateihistorien-Snapshot</em> ist ein Prüfpunkt, der vor der Änderung von Dateien erstellt wird. Er zeichnet den ursprünglichen Inhalt jeder Datei auf, die <strong>Claude</strong> gerade bearbeiten will. Diese Snapshots dienen als Datenquelle für Rückgängigmachungs- und Rollback-Vorgänge.</p>
<p>Wenn ein Benutzer eine Nachricht sendet, die möglicherweise Dateien ändert, erstellt <strong>Claude Code</strong> einen leeren Snapshot für diese Nachricht. Vor der Bearbeitung sichert das System den ursprünglichen Inhalt jeder Zieldatei im Snapshot und wendet die Änderungen dann direkt auf der Festplatte an. Wenn der Benutzer die <em>Rückgängigmachung</em> auslöst, stellt <strong>Claude Code</strong> den gesicherten Inhalt wieder her und überschreibt die geänderten Dateien.</p>
<p>In der Praxis sieht der Lebenszyklus einer rückgängig zu machenden Bearbeitung wie folgt aus:</p>
<ol>
<li><p><strong>Benutzer sendet eine NachrichtClaude</strong>Code erstellt einen neuen, leeren <code translate="no">file-history-snapshot</code> Datensatz.</p></li>
<li><p><strong>Claude bereitet sich auf die Änderung von Dateien vorDas</strong>System erkennt, welche Dateien bearbeitet werden sollen und sichert deren ursprünglichen Inhalt in <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude führt die Bearbeitung ausBearbeitungs-</strong>und Schreibvorgänge werden durchgeführt, und der geänderte Inhalt wird auf die Festplatte geschrieben.</p></li>
<li><p><strong>Benutzer löst Rückgängigmachen ausDer</strong>Benutzer drückt <strong>Esc + Esc</strong> und signalisiert damit, dass die Änderungen rückgängig gemacht werden sollen.</p></li>
<li><p><strong>Der ursprüngliche Inhalt wird wiederhergestelltClaude</strong>Code liest den gespeicherten Inhalt von <code translate="no">trackedFileBackups</code> und überschreibt die aktuellen Dateien, wodurch die Rückgängigmachung abgeschlossen wird.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Warum Rückgängigmachen funktioniert: Schnappschüsse speichern die alte Version</h3><p>Das Rückgängigmachen in Claude Code funktioniert, weil das System den <em>ursprünglichen</em> Dateiinhalt speichert, bevor eine Bearbeitung erfolgt.</p>
<p>Anstatt zu versuchen, Änderungen im Nachhinein rückgängig zu machen, wählt Claude Code einen einfacheren Ansatz: Es kopiert die Datei so, wie sie <em>vor der</em> Änderung existierte, und speichert diese Kopie in <code translate="no">trackedFileBackups</code>. Wenn der Benutzer die Rückgängigmachung auslöst, stellt das System diese gespeicherte Version wieder her und überschreibt die bearbeitete Datei.</p>
<p>Das folgende Diagramm zeigt diesen Ablauf Schritt für Schritt:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">Wie ein <em>File-History-Snapshot</em> intern aussieht</h3><p>Der Snapshot selbst wird als strukturierter Datensatz gespeichert. Er enthält Metadaten über die Benutzernachricht, den Zeitpunkt des Schnappschusses und - was besonders wichtig ist - eine Zuordnung der Dateien zu ihrem ursprünglichen Inhalt.</p>
<p>Das folgende Beispiel zeigt einen einzelnen <code translate="no">file-history-snapshot</code> -Datensatz, der erstellt wurde, bevor Claude eine Datei bearbeitet hat. Jeder Eintrag in <code translate="no">trackedFileBackups</code> speichert den Inhalt einer Datei <em>vor der Bearbeitung</em>, der später bei einer Rückgängigmachung zur Wiederherstellung der Datei verwendet wird.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Wo Schnappschüsse gespeichert werden und wie lange sie aufbewahrt werden</h3><ul>
<li><p><strong>Wo Snapshot-Metadaten gespeichert werden</strong>: Snapshot-Datensätze sind an eine bestimmte Sitzung gebunden und werden als JSONL-Dateien unter<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code> gespeichert.</p></li>
<li><p><strong>Wo die ursprünglichen Dateiinhalte gesichert werden</strong>: Der Inhalt jeder Datei vor der Bearbeitung wird getrennt nach Inhaltshash unter<code translate="no">~/.claude/file-history/{content-hash}/</code> gespeichert.</p></li>
<li><p><strong>Wie lange Snapshots standardmäßig aufbewahrt werden</strong>: Snapshot-Daten werden für 30 Tage aufbewahrt, entsprechend der globalen Einstellung <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>So ändern Sie die Aufbewahrungsdauer</strong>: Die Anzahl der Aufbewahrungstage kann über das Feld <code translate="no">cleanupPeriodDays</code> in <code translate="no">~/.claude/settings.json</code> angepasst werden.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Verwandte Befehle</h3><table>
<thead>
<tr><th>Befehl / Aktion</th><th>Beschreibung</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Rückgängig machen der letzten Dateibearbeitung (am häufigsten verwendet)</td></tr>
<tr><td>/Rückspulen</td><td>Zu einem zuvor festgelegten Prüfpunkt (Schnappschuss) zurückkehren</td></tr>
<tr><td>/diff</td><td>Unterschiede zwischen der aktuellen Datei und der Schnappschusssicherung anzeigen</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Andere wichtige Verzeichnisse<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Plugin-Verwaltung</strong></p>
<p>Im Verzeichnis <code translate="no">plugins/</code> werden Add-ons gespeichert, die Claude Code zusätzliche Fähigkeiten verleihen.</p>
<p>In diesem Verzeichnis wird gespeichert, welche <em>Plugins</em> installiert sind, woher sie stammen und welche zusätzlichen Fähigkeiten diese Plugins bieten. Es speichert auch lokale Kopien von heruntergeladenen Plugins, so dass sie nicht erneut geholt werden müssen.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - Wo Skills gespeichert und angewendet werden</strong></p>
<p>In Claude Code ist ein Skill eine kleine, wiederverwendbare Fähigkeit, die Claude hilft, eine bestimmte Aufgabe auszuführen, wie z.B. die Arbeit mit PDFs, das Bearbeiten von Dokumenten oder das Befolgen eines Coding-Workflows.</p>
<p>Nicht alle Fähigkeiten sind überall verfügbar. Einige gelten global, während andere auf ein einzelnes Projekt beschränkt sind oder durch ein Plugin bereitgestellt werden. Claude Code speichert Fertigkeiten an verschiedenen Orten, um zu steuern, wo jede Fertigkeit verwendet werden kann.</p>
<p>Die nachstehende Hierarchie zeigt, wie die Skills nach Umfang gestaffelt sind, von global verfügbaren Skills bis hin zu projektspezifischen und durch Plugins bereitgestellten Skills.</p>
<table>
<thead>
<tr><th>Ebene</th><th>Speicherort</th><th>Beschreibung</th></tr>
</thead>
<tbody>
<tr><td>Benutzer</td><td>~/.claude/skills/</td><td>Global verfügbar, zugänglich für alle Projekte</td></tr>
<tr><td>Projekt</td><td>projekt/.claude/skills/</td><td>Nur für das aktuelle Projekt verfügbar, projektspezifische Anpassungen</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Wird mit Plugins installiert, abhängig vom Plugin-Aktivierungsstatus</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Speicherung von Aufgabenlisten</strong></p>
<p>Das Verzeichnis <code translate="no">todos/</code> speichert Aufgabenlisten, die Claude erstellt, um die Arbeit während einer Konversation zu verfolgen, z. B. zu erledigende Schritte, in Arbeit befindliche Elemente und abgeschlossene Aufgaben.</p>
<p>Die Aufgabenlisten werden als JSON-Dateien unter<code translate="no">~/.claude/todos/{session-id}-*.json</code> gespeichert. Jeder Dateiname enthält die Sitzungs-ID, die die Aufgabenliste mit einer bestimmten Konversation verknüpft.</p>
<p>Der Inhalt dieser Dateien stammt aus dem Tool <code translate="no">TodoWrite</code> und enthält grundlegende Aufgabeninformationen wie die Aufgabenbeschreibung, den aktuellen Status, die Priorität und zugehörige Metadaten.</p>
<p><strong>(4) local/ - Lokale Laufzeit und Werkzeuge</strong></p>
<p>Das Verzeichnis <code translate="no">local/</code> enthält die Kerndateien, die Claude Code zur Ausführung auf Ihrem Rechner benötigt.</p>
<p>Dazu gehören die ausführbare Befehlszeile <code translate="no">claude</code> und das Verzeichnis <code translate="no">node_modules/</code>, das die Laufzeitabhängigkeiten des Programms enthält. Da diese Komponenten lokal gehalten werden, kann Claude Code unabhängig laufen, ohne auf externe Dienste oder systemweite Installationen angewiesen zu sein.</p>
<p><strong>（5）Zusätzliche unterstützende Verzeichnisse</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Speichert Schnappschüsse des Shell-Sitzungsstatus (z. B. aktuelles Verzeichnis und Umgebungsvariablen) und ermöglicht so ein Rollback von Shell-Operationen.</p></li>
<li><p><strong>plans/:</strong> Speichert Ausführungspläne, die vom Plan-Modus generiert werden (z. B. schrittweise Aufschlüsselungen von mehrstufigen Programmieraufgaben).</p></li>
<li><p><strong>statsig/:</strong> Zwischenspeichern von Merkmalskonfigurationen (z. B. ob neue Merkmale aktiviert sind), um wiederholte Anfragen zu reduzieren.</p></li>
<li><p><strong>telemetry/:</strong> Speichert anonyme Telemetriedaten (z. B. die Häufigkeit der Nutzung von Funktionen) zur Produktoptimierung.</p></li>
<li><p><strong>debug/:</strong> Speichert Debug-Protokolle (einschließlich Fehlerstapel und Ausführungsspuren) zur Unterstützung der Fehlerbehebung.</p></li>
</ul>
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
    </button></h2><p>Nachdem ich mich damit beschäftigt habe, wie Claude Code alles lokal speichert und verwaltet, wird das Bild ziemlich klar: Das Tool fühlt sich stabil an, weil die Grundlage solide ist. Nichts Ausgefallenes - nur durchdachte Technik. Jedes Projekt hat seinen eigenen Bereich, jede Aktion wird schriftlich festgehalten, und Dateibearbeitungen werden gesichert, bevor sich etwas ändert. Es ist die Art von Design, die in aller Ruhe ihre Arbeit erledigt und Ihnen die Möglichkeit gibt, sich auf Ihre Arbeit zu konzentrieren.</p>
<p>Was mir besonders gefällt, ist, dass hier nichts Mystisches vor sich geht. Claude Code funktioniert gut, weil die Grundlagen richtig gemacht sind. Wenn Sie jemals versucht haben, einen Agenten zu entwickeln, der echte Dateien berührt, wissen Sie, wie leicht die Dinge auseinanderfallen können - Zustände werden vermischt, Abstürze machen den Fortschritt zunichte, und Rückgängigmachen wird zum Ratespiel. Claude Code vermeidet all das mit einem Speichermodell, das einfach, konsistent und schwer zu knacken ist.</p>
<p>Für Teams, die lokale oder On-Premise-KI-Agenten entwickeln, insbesondere in sicheren Umgebungen, zeigt dieser Ansatz, wie starke Speicherung und Persistenz KI-Tools zuverlässig und praktisch für die tägliche Entwicklung machen.</p>
<p>Wenn Sie lokale oder vor Ort installierte KI-Agenten entwickeln und detaillierter über Speicherarchitektur, Sitzungsdesign oder sicheres Rollback diskutieren möchten, können Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> beitreten oder über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> ein 20-minütiges Einzelgespräch buchen, um eine persönliche Beratung zu erhalten.</p>
