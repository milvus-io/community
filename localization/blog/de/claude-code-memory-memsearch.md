---
id: claude-code-memory-memsearch.md
title: >-
  Wir haben den geleakten Quellcode von Claude Code gelesen. So funktioniert der
  Speicher tatsächlich
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Der durchgesickerte Quellcode von Claude Code enthüllt einen
  4-Schichten-Speicher, der auf 200 Zeilen begrenzt ist und nur mit Grep
  durchsucht wird. Hier ist, wie jede Schicht funktioniert und was memsearch
  behebt.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Der Quellcode von Claude Code wurde versehentlich öffentlich zugänglich gemacht. Version 2.1.88 enthielt eine 59,8 MB große Source-Map-Datei, die aus dem Build hätte entfernt werden müssen. Diese eine Datei enthielt die vollständige, lesbare TypeScript-Codebasis - 512.000 Zeilen, die nun auf GitHub gespiegelt werden.</p>
<p>Das <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Speichersystem</a> erregte unsere Aufmerksamkeit. Claude Code ist der beliebteste KI-Codierungsagent auf dem Markt, und der Speicher ist der Teil, mit dem die meisten Benutzer interagieren, ohne zu verstehen, wie er unter der Haube funktioniert. Also haben wir uns eingegraben.</p>
<p>Die Kurzversion: Das Gedächtnis von Claude Code ist einfacher, als man denken würde. Es ist auf 200 Zeilen Notizen beschränkt. Es kann Erinnerungen nur nach exakten Schlüsselwörtern finden - wenn man nach "Portkonflikten" fragt, aber in der Notiz "docker-compose mapping" steht, bekommt man nichts. Und nichts davon verlässt Claude Code. Wechseln Sie zu einem anderen Agenten und Sie fangen wieder bei Null an.</p>
<p>Hier sind die vier Ebenen:</p>
<ul>
<li><strong>CLAUDE.md</strong> - eine Datei, die Sie selbst schreiben, mit Regeln, die Claude befolgen soll. Manuell, statisch und begrenzt durch die Menge, die Sie im Voraus aufschreiben wollen.</li>
<li><strong>Auto Memory</strong> - Claude macht sich während der Sitzungen selbst Notizen. Nützlich, aber auf einen 200-Zeilen-Index begrenzt, ohne Suche nach Bedeutungen.</li>
<li><strong>Auto Dream</strong> - ein Aufräumprozess im Hintergrund, der unordentliche Erinnerungen konsolidiert, während Sie im Leerlauf sind. Hilft bei Tage altem Durcheinander, kann aber keine Monate überbrücken.</li>
<li><strong>KAIROS</strong> - ein unveröffentlichter, immer aktiver Daemon-Modus, der im geleakten Code gefunden wurde. Noch nicht in einem öffentlichen Build.</li>
</ul>
<p>Im Folgenden werden wir jede Schicht auspacken und dann aufzeigen, wo die Architektur zusammenbricht und was wir gebaut haben, um die Lücken zu schließen.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Wie funktioniert CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md ist eine Markdown-Datei, die Sie erstellen und in Ihrem Projektordner ablegen. Sie füllen sie mit allem, was Claude sich merken soll: Code-Stilregeln, Projektstruktur, Testbefehle, Bereitstellungsschritte. Claude lädt sie zu Beginn einer jeden Sitzung.</p>
<p>Es gibt drei Bereiche: Projektebene (im Stammverzeichnis des Projektarchivs), persönlicher Bereich (<code translate="no">~/.claude/CLAUDE.md</code>) und organisatorischer Bereich (Unternehmenskonfiguration). Kürzere Dateien werden zuverlässiger verfolgt.</p>
<p>Die Grenze liegt auf der Hand: CLAUDE.md enthält nur Dinge, die Sie im Voraus aufgeschrieben haben. Debugging-Entscheidungen, Einstellungen, die Sie während eines Gesprächs erwähnt haben, Randfälle, die Sie gemeinsam entdeckt haben - nichts davon wird erfasst, es sei denn, Sie halten an und fügen es manuell hinzu. Die meisten Leute tun das nicht.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Wie funktioniert Auto Memory?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory erfasst, was während der Arbeit auftaucht. Claude entscheidet, was aufbewahrenswert ist, und schreibt es in einen Speicherordner auf Ihrem Computer, der in vier Kategorien unterteilt ist: Benutzer (Rolle und Vorlieben), Feedback (Ihre Korrekturen), Projekt (Entscheidungen und Kontext) und Referenz (wo die Dinge bleiben).</p>
<p>Jede Notiz ist eine separate Markdown-Datei. Der Einstiegspunkt ist <code translate="no">MEMORY.md</code> - ein Index, bei dem jede Zeile ein kurzes Label (unter 150 Zeichen) ist, das auf eine detaillierte Datei verweist. Claude liest den Index und ruft dann bestimmte Dateien ab, wenn sie relevant erscheinen.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die ersten 200 Zeilen von MEMORY.md werden in jede Sitzung geladen. Alles, was darüber hinausgeht, ist unsichtbar.</p>
<p>Eine kluge Designentscheidung: Die durchgesickerte Systemaufforderung sagt Claude, dass er seinen eigenen Speicher als Hinweis und nicht als Tatsache behandeln soll. Es wird mit echtem Code abgeglichen, bevor es auf der Grundlage von Erinnerungen handelt, was dazu beiträgt, Halluzinationen zu vermeiden - ein Muster, das andere <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">KI-Agenten-Frameworks</a> zunehmend übernehmen.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Wie konsolidiert Auto Dream veraltete Erinnerungen?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory erfasst zwar Notizen, aber nach wochenlanger Nutzung werden diese Notizen veraltet. Ein Eintrag, der besagt, dass gestern ein Fehler bei der Bereitstellung aufgetreten ist, wird eine Woche später bedeutungslos. Eine Notiz besagt, dass Sie PostgreSQL verwenden; eine neuere besagt, dass Sie zu MySQL migriert haben. Gelöschte Dateien haben immer noch Speichereinträge. Der Index füllt sich mit Widersprüchen und veralteten Verweisen.</p>
<p>Auto Dream ist der Bereinigungsprozess. Er läuft im Hintergrund und:</p>
<ul>
<li>Ersetzt vage Zeitangaben durch exakte Daten. "Problem der Bereitstellung von gestern" → "Problem der Bereitstellung am 28.03.2026".</li>
<li>Löst Widersprüche auf. PostgreSQL-Notiz + MySQL-Notiz → behält die aktuelle Wahrheit bei.</li>
<li>Löscht veraltete Einträge. Notizen, die auf gelöschte Dateien oder abgeschlossene Aufgaben verweisen, werden entfernt.</li>
<li>Hält <code translate="no">MEMORY.md</code> unter 200 Zeilen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Auslösebedingungen:</strong> mehr als 24 Stunden seit der letzten Bereinigung UND mindestens 5 neue Sitzungen aufgelaufen. Sie können auch "dream" eingeben, um den Prozess manuell auszuführen. Der Prozess läuft als Sub-Agent im Hintergrund - wie der eigentliche Schlaf, er unterbricht Ihre aktive Arbeit nicht.</p>
<p>Die Systemansage des Traumagenten beginnt mit: <em>"Sie führen gerade einen Traum durch - einen reflektierenden Durchgang durch Ihre Speicherdateien."</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">Was ist KAIROS? Der unveröffentlichte Always-On-Modus von Claude Code<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>Die ersten drei Schichten sind bereits in Betrieb oder werden eingeführt. Der durchgesickerte Code enthält auch etwas, das noch nicht ausgeliefert wurde: KAIROS.</p>
<p>KAIROS - anscheinend benannt nach dem griechischen Wort für "der richtige Moment" - taucht über 150 Mal im Quellcode auf. Es würde Claude Code von einem Werkzeug, das Sie aktiv nutzen, in einen Hintergrundassistenten verwandeln, der Ihr Projekt kontinuierlich überwacht.</p>
<p>Basierend auf dem durchgesickerten Code, KAIROS:</p>
<ul>
<li>Führt ein laufendes Protokoll von Beobachtungen, Entscheidungen und Aktionen während des Tages.</li>
<li>Meldet sich über einen Timer. In regelmäßigen Abständen erhält es ein Signal und entscheidet: handeln oder schweigen.</li>
<li>Bleibt Ihnen aus dem Weg. Jede Aktion, die Sie mehr als 15 Sekunden lang behindern würde, wird aufgeschoben.</li>
<li>Führt intern eine Traumaufräumaktion durch, plus eine vollständige Beobachtungs-, Denk- und Handlungsschleife im Hintergrund.</li>
<li>Verfügt über exklusive Tools, die der normale Claude Code nicht hat: Er schickt dir Dateien, sendet Benachrichtigungen und überwacht deine GitHub Pull Requests.</li>
</ul>
<p>KAIROS befindet sich hinter einem Kompilierzeit-Flag. Es ist nicht in einem öffentlichen Build enthalten. Betrachten Sie es als Anthropic, das erforscht, was passiert, wenn der <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">Agentenspeicher</a> nicht mehr session-by-session, sondern always-on ist.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Wo bricht die Speicherarchitektur von Claude Code zusammen?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Speicher von Claude Code leistet echte Arbeit. Aber fünf strukturelle Beschränkungen schränken ein, was er bei wachsenden Projekten bewältigen kann.</p>
<table>
<thead>
<tr><th>Einschränkung</th><th>Was passiert</th></tr>
</thead>
<tbody>
<tr><td><strong>200-Zeilen-Index-Kappe</strong></td><td><code translate="no">MEMORY.md</code> fasst ~25 KB. Läuft ein Projekt über Monate, werden alte Einträge von neuen verdrängt. "Auf welche Redis-Konfiguration haben wir uns letzte Woche geeinigt?" - weg.</td></tr>
<tr><td><strong>Grep-only-Abfrage</strong></td><td>Die Speichersuche verwendet wörtliche <a href="https://milvus.io/docs/full-text-search.md">Schlüsselwortabgleiche</a>. Sie erinnern sich an "Port-Konflikte bei der Bereitstellung", aber in der Notiz steht "Port-Zuordnung bei Docker-Compose". Grep kann diese Lücke nicht überbrücken.</td></tr>
<tr><td><strong>Nur Zusammenfassungen, keine Argumentation</strong></td><td>Auto Memory speichert Notizen auf höchster Ebene, nicht aber die Debugging-Schritte oder die Überlegungen, die Sie zu Ihrem Ziel geführt haben. Das <em>Wie</em> geht verloren.</td></tr>
<tr><td><strong>Komplexität stapelt sich, ohne dass das Fundament repariert wird</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Jede Schicht existiert, weil die letzte nicht ausgereicht hat. Aber keine Schicht ändert etwas an dem, was darunter liegt: ein Werkzeug, lokale Dateien, sitzungsweise Erfassung.</td></tr>
<tr><td><strong>Speicher ist in Claude Code eingeschlossen</strong></td><td>Wenn Sie zu OpenCode, Codex CLI oder einem anderen Agenten wechseln, beginnen Sie bei Null. Kein Export, kein gemeinsames Format, keine Portabilität.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das sind keine Bugs. Es sind die natürlichen Grenzen der Architektur mit nur einem Werkzeug und lokalen Dateien. Jeden Monat kommen neue Agenten auf den Markt, Arbeitsabläufe ändern sich, aber das Wissen, das Sie in einem Projekt aufgebaut haben, sollte nicht mit ihnen verschwinden. Aus diesem Grund haben wir <a href="https://github.com/zilliztech/memsearch">memsearch</a> entwickelt.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">Was ist memsearch? Dauerhafter Speicher für jeden KI-Codierungsagenten<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> zieht den Speicher aus dem Agenten heraus und in seine eigene Schicht. Agenten kommen und gehen. Der Speicher bleibt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Wie wird memsearch installiert?</h3><p>Claude Code-Benutzer installieren vom Marktplatz:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Erledigt. Keine Konfiguration erforderlich.</p>
<p>Andere Plattformen sind genau so einfach. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. Python API über uv oder pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">Was erfasst memsearch?</h3><p>Nach der Installation klinkt sich memsearch in den Lebenszyklus des Agenten ein. Jede Konversation wird automatisch zusammengefasst und indiziert. Wenn Sie eine Frage stellen, die einen Verlauf benötigt, wird der Abruf selbständig ausgelöst.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Speicherdateien werden als datierte Markdown-Dateien gespeichert - eine Datei pro Tag:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Sie können Speicherdateien in jedem beliebigen Texteditor öffnen, lesen und bearbeiten. Wenn Sie migrieren wollen, kopieren Sie den Ordner. Wenn Sie eine Versionskontrolle wünschen, funktioniert git von Haus aus.</p>
<p>Der in <a href="https://milvus.io/docs/overview.md">Milvus</a> gespeicherte <a href="https://milvus.io/docs/index-explained.md">Vektorindex</a> ist eine Cache-Ebene - sollte er jemals verloren gehen, bauen Sie ihn aus den Markdown-Dateien wieder auf. Ihre Daten befinden sich in den Dateien, nicht im Index.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Wie findet memsearch Erinnerungen? Semantische Suche vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Gedächtnissuche von Claude Code verwendet Grep - wörtliche Schlüsselwortsuche. Das funktioniert, wenn Sie ein paar Dutzend Notizen haben, aber es versagt nach Monaten der Geschichte, wenn Sie sich nicht mehr an den genauen Wortlaut erinnern können.</p>
<p>memsearch verwendet stattdessen eine <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">hybride Suche</a>. <a href="https://zilliz.com/glossary/semantic-search">Semantische Vektoren</a> finden Inhalte, die mit Ihrer Anfrage verwandt sind, selbst wenn der Wortlaut unterschiedlich ist, während BM25 exakte Schlüsselwörter findet. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> führt beide Ergebnissätze zusammen und ordnet sie gemeinsam ein.</p>
<p>Angenommen, Sie fragen: "Wie haben wir letzte Woche die Redis-Zeitüberschreitung behoben?" - Die semantische Suche versteht die Absicht und findet sie. Angenommen, Sie fragen &quot;Suche nach <code translate="no">handleTimeout</code>&quot; - BM25 findet den genauen Funktionsnamen. Die beiden Pfade decken die blinden Flecken des jeweils anderen ab.</p>
<p>Wenn der Rückruf ausgelöst wird, sucht der Unteragent in drei Stufen und geht nur bei Bedarf tiefer:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Semantische Suche - Kurze Vorschauen</h3><p>Der Sub-Agent lässt <code translate="no">memsearch search</code> gegen den Milvus-Index laufen und zieht die relevantesten Ergebnisse heraus:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Jedes Ergebnis zeigt eine Relevanzbewertung, die Quelldatei und eine 200-Zeichen-Vorschau an. Die meisten Suchanfragen enden hier.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Vollständiger Kontext - Erweitern eines bestimmten Ergebnisses</h3><p>Wenn die Vorschau von L1 nicht ausreicht, führt der Subagent <code translate="no">memsearch expand a3f8c1</code> aus, um den vollständigen Eintrag zu finden:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Rohes Gesprächsprotokoll</h3><p>In den seltenen Fällen, in denen Sie genau sehen müssen, was gesagt wurde, ruft der Sub-Agent den ursprünglichen Austausch ab:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Das Transkript speichert alles: Ihre genauen Worte, die genaue Antwort des Agenten und jeden Tool-Call. Die drei Stufen reichen von leicht bis schwer - der Sub-Agent entscheidet, wie tief er bohrt, und gibt dann die organisierten Ergebnisse an Ihre Hauptsitzung zurück.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Wie teilt memsearch den Speicher über KI-Codieragenten hinweg?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Dies ist der größte Unterschied zwischen memsearch und dem Speicher von Claude Code.</p>
<p>Der Speicher von Claude Code ist in einem einzigen Tool eingeschlossen. Wenn Sie OpenCode, OpenClaw oder Codex CLI verwenden, fangen Sie bei Null an. MEMORY.md ist lokal, gebunden an einen Benutzer und einen Agenten.</p>
<p>memsearch unterstützt vier Coding Agents: Claude Code, OpenClaw, OpenCode und Codex CLI. Sie verwenden das gleiche Markdown-Speicherformat und die gleiche <a href="https://milvus.io/docs/manage-collections.md">Milvus-Sammlung</a>. Erinnerungen, die von einem beliebigen Agenten geschrieben wurden, sind von jedem anderen Agenten aus durchsuchbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Zwei reale Szenarien:</strong></p>
<p><strong>Wechsel der Werkzeuge.</strong> Sie verbringen einen Nachmittag in Claude Code, um die Deployment-Pipeline zu entwerfen und stoßen dabei auf mehrere Probleme. Konversationen werden automatisch zusammengefasst und indiziert. Am nächsten Tag wechseln Sie zu OpenCode und fragen: "Wie haben wir gestern den Portkonflikt gelöst?" OpenCode durchsucht memsearch, findet die Erinnerungen von Claude Code von gestern und gibt Ihnen die richtige Antwort.</p>
<p><strong>Zusammenarbeit im Team.</strong> Richten Sie das Milvus-Backend auf die <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> und mehrere Entwickler auf verschiedenen Rechnern, die verschiedene Agenten verwenden, lesen und schreiben denselben Projektspeicher. Ein neues Teammitglied kommt hinzu und muss sich nicht durch monatelange Slacks und Dokumente wühlen - der Agent weiß es bereits.</p>
<h2 id="Developer-API" class="common-anchor-header">Entwickler-API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Ihr eigenes <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Agententooling</a> entwickeln, bietet memsearch eine CLI und eine Python-API.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python-API:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Unter der Haube verwaltet Milvus die Vektorsuche. Führen Sie Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a> lokal aus (ohne Konfiguration), arbeiten Sie über die <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> zusammen (kostenloses Tier verfügbar) oder hosten Sie selbst mit Docker. <a href="https://milvus.io/docs/embeddings.md">Embeddings</a> standardmäßig auf ONNX - läuft auf CPU, keine GPU erforderlich. Wechseln Sie jederzeit zu OpenAI oder Ollama.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch: Vollständiger Vergleich<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Merkmal</th><th>Claude Code-Speicher</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Was gespeichert wird</td><td>Was Claude für wichtig hält</td><td>Jede Konversation, automatisch zusammengefaßt</td></tr>
<tr><td>Speichergrenze</td><td>~200-Zeilen-Index (~25 KB)</td><td>Unbegrenzt (tägliche Dateien + Vektorindex)</td></tr>
<tr><td>Auffinden alter Erinnerungen</td><td>Grep-Schlüsselwortsuche</td><td>Bedeutungsbasierte + stichwortbasierte Hybrid-Suche (Milvus)</td></tr>
<tr><td>Können Sie sie lesen?</td><td>Speicherordner manuell prüfen</td><td>Öffnen Sie eine beliebige .md-Datei</td></tr>
<tr><td>Können Sie sie bearbeiten?</td><td>Dateien von Hand bearbeiten</td><td>Dasselbe - automatische Neuindizierung beim Speichern</td></tr>
<tr><td>Versionskontrolle</td><td>Nicht dafür ausgelegt</td><td>git funktioniert nativ</td></tr>
<tr><td>Werkzeugübergreifende Unterstützung</td><td>Nur Claude Code</td><td>4 Agenten, gemeinsamer Speicher</td></tr>
<tr><td>Langfristiger Abruf</td><td>Verschlechtert sich nach Wochen</td><td>Dauerhaft über Monate hinweg</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Beginnen Sie mit memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Gedächtnis von Claude Code hat echte Stärken - das selbstskeptische Design, das Traumkonsolidierungskonzept und das 15-Sekunden-Blockierungsbudget in KAIROS. Anthropic denkt intensiv über dieses Problem nach.</p>
<p>Aber der Speicher für ein einzelnes Werkzeug hat eine Obergrenze. Sobald sich Ihr Arbeitsablauf über mehrere Agenten, mehrere Personen oder mehr als ein paar Wochen Geschichte erstreckt, brauchen Sie einen Speicher, der für sich selbst existiert.</p>
<ul>
<li>Versuchen Sie <a href="https://github.com/zilliztech/memsearch">memsearch</a> - Open Source, MIT lizenziert. Installieren Sie es in Claude Code mit zwei Befehlen.</li>
<li>Lesen Sie <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">, wie memsearch unter der Haube funktioniert</a> oder die <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code Plugin-Anleitung</a>.</li>
<li>Haben Sie Fragen? Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord-Community</a> bei oder <a href="https://milvus.io/office-hours">buchen Sie eine kostenlose Sprechstunde</a>, um Ihren Anwendungsfall zu besprechen.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Häufig gestellte Fragen<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Wie funktioniert das Speichersystem von Claude Code unter der Haube?</h3><p>Claude Code verwendet eine vierschichtige Speicherarchitektur, die alle als lokale Markdown-Dateien gespeichert werden. CLAUDE.md ist eine statische Regeldatei, die Sie manuell schreiben. Mit Auto Memory speichert Claude seine eigenen Notizen während der Sitzungen, die in vier Kategorien unterteilt sind: Benutzereinstellungen, Feedback, Projektkontext und Referenzpunkte. Auto Dream konsolidiert veraltete Erinnerungen im Hintergrund. KAIROS ist ein unveröffentlichter, ständig aktiver Daemon, der im geleakten Quellcode gefunden wurde. Das gesamte System ist auf einen 200-Zeilen-Index begrenzt und kann nur durch exakte Schlüsselwortabgleiche durchsucht werden - keine semantische Suche oder bedeutungsbasierter Abruf.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Können KI-Codieragenten den Speicher über verschiedene Tools hinweg gemeinsam nutzen?</h3><p>Nicht von Haus aus. Der Speicher von Claude Code ist an Claude Code gebunden - es gibt weder ein Exportformat noch ein agentenübergreifendes Protokoll. Wenn Sie zu OpenCode, Codex CLI oder OpenClaw wechseln, fangen Sie bei Null an. memsearch löst dieses Problem, indem es Speicher als datierte Markdown-Dateien speichert, die in einer <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> (Milvus) indiziert sind. Alle vier unterstützten Agenten lesen und schreiben denselben Speicher, so dass der Kontext automatisch übertragen wird, wenn Sie das Tool wechseln.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">Was ist der Unterschied zwischen der Schlüsselwortsuche und der semantischen Suche für den Agentenspeicher?</h3><p>Die Schlüsselwortsuche (grep) findet exakte Zeichenketten - wenn in Ihrem Speicher "docker-compose port mapping" steht, Sie aber nach "port conflicts" suchen, liefert sie nichts. Die semantische Suche wandelt Text in <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> um, die die Bedeutung erfassen, so dass verwandte Konzepte auch bei unterschiedlichem Wortlaut übereinstimmen. memsearch kombiniert beide Ansätze mit einer hybriden Suche, so dass Sie mit einer einzigen Abfrage einen bedeutungsbasierten Rückruf und eine exakte Stichwortpräzision erhalten.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Was ist bei dem Vorfall mit dem Claude-Code-Quellcode durchgesickert?</h3><p>Version 2.1.88 von Claude Code wurde mit einer 59,8 MB großen Quellcode-Datei ausgeliefert, die aus dem Produktions-Build hätte entfernt werden müssen. Die Datei enthielt die komplette, lesbare TypeScript-Codebasis - etwa 512.000 Zeilen - einschließlich der vollständigen Implementierung des Speichersystems, des Auto-Dream-Konsolidierungsprozesses und Verweise auf KAIROS, einen nicht veröffentlichten Always-on-Agentenmodus. Der Code wurde schnell über GitHub gespiegelt, bevor er entfernt werden konnte.</p>
