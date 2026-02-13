---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: >-
  Wir haben das Speichersystem von OpenClaw extrahiert und ins Internet gestellt
  (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Wir haben die KI-Speicherarchitektur von OpenClaw in memsearch integriert -
  eine eigenständige Python-Bibliothek mit Markdown-Protokollen, hybrider
  Vektorsuche und Git-Unterstützung.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (früher clawdbot und moltbot) geht viral - <a href="https://github.com/openclaw/openclaw">189k+ GitHub-Sterne</a> in weniger als zwei Wochen. Das ist Wahnsinn. Der meiste Wirbel dreht sich um seine autonomen, agentenbasierten Fähigkeiten in alltäglichen Chat-Kanälen wie iMessages, WhatsApp, Slack, Telegram und mehr.</p>
<p>Aber als Ingenieure, die an einem Vektor-Datenbanksystem arbeiten, hat uns vor allem der <strong>Ansatz von OpenClaw für das Langzeitgedächtnis</strong> beeindruckt. Anders als die meisten Speichersysteme auf dem Markt lässt OpenClaw seine KI automatisch tägliche Protokolle als Markdown-Dateien schreiben. Diese Dateien sind die Quelle der Wahrheit, und das Modell "merkt" sich nur, was auf die Festplatte geschrieben wird. Menschliche Entwickler können diese Markdown-Dateien öffnen, sie direkt bearbeiten, langfristige Prinzipien destillieren und genau sehen, woran sich die KI zu jedem Zeitpunkt erinnert. Keine Blackboxen. Ehrlich gesagt, ist dies eine der saubersten und entwicklerfreundlichsten Speicherarchitekturen, die wir je gesehen haben.</p>
<p>Wir hatten natürlich eine Frage: <strong><em>Warum sollte das nur in OpenClaw funktionieren? Was wäre, wenn jeder Agent so einen Speicher haben könnte?</em></strong> Wir haben die exakte Speicherarchitektur von OpenClaw genommen und <a href="https://github.com/zilliztech/memsearch">memsearch</a> entwickelt - eine eigenständige, Plug-and-Play-Langzeitspeicher-Bibliothek, die jedem Agenten einen persistenten, transparenten und von Menschen editierbaren Speicher bietet. Es besteht keine Abhängigkeit vom Rest von OpenClaw. Fügen Sie sie einfach ein und Ihr Agent erhält einen dauerhaften Speicher mit einer Suche, die von Milvus/Zilliz Cloud unterstützt wird, sowie Markdown-Logs als kanonische Quelle der Wahrheit.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (Open-Source, MIT-Lizenz)</p></li>
<li><p><strong>Dokumentation:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Claude-Code-Plugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Was den Speicher von OpenClaw auszeichnet<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir in die Speicherarchitektur von OpenClaw eintauchen, sollten wir zwei Begriffe klären: <strong>Kontext</strong> und <strong>Speicher</strong>. Sie klingen ähnlich, funktionieren aber in der Praxis sehr unterschiedlich.</p>
<ul>
<li><p><strong>Kontext</strong> ist alles, was der Agent in einer einzigen Anfrage sieht - Systemaufforderungen, Anleitungsdateien auf Projektebene wie <code translate="no">AGENTS.md</code> und <code translate="no">SOUL.md</code>, Gesprächsverlauf (Nachrichten, Toolaufrufe, komprimierte Zusammenfassungen) und die aktuelle Nachricht des Benutzers. Sie ist auf eine Sitzung beschränkt und relativ kompakt.</p></li>
<li><p>Der<strong>Speicher</strong> ist das, was über Sitzungen hinweg bestehen bleibt. Er befindet sich auf der lokalen Festplatte - der gesamte Verlauf vergangener Unterhaltungen, Dateien, mit denen der Agent gearbeitet hat, und Benutzereinstellungen. Nicht zusammengefasst. Nicht komprimiert. Die Rohdaten.</p></li>
</ul>
<p>Jetzt kommt die Designentscheidung, die den Ansatz von OpenClaw so besonders macht: <strong>Der gesamte Speicher wird als einfache Markdown-Dateien auf dem lokalen Dateisystem gespeichert.</strong> Nach jeder Sitzung schreibt die KI automatisch Updates in diese Markdown-Protokolle. Sie - und jeder andere Entwickler - können sie öffnen, bearbeiten, umorganisieren, löschen oder verfeinern. In der Zwischenzeit erstellt und pflegt die Vektordatenbank neben diesem System einen Index für den Abruf. Wann immer sich eine Markdown-Datei ändert, erkennt das System die Änderung und indiziert sie automatisch neu.</p>
<p>Wenn Sie Tools wie Mem0 oder Zep verwendet haben, werden Sie den Unterschied sofort bemerken. Diese Systeme speichern Erinnerungen als Einbettungen - das ist die einzige Kopie. Sie können nicht lesen, woran sich Ihr Agent erinnert. Sie können eine schlechte Erinnerung nicht durch Bearbeiten einer Zeile korrigieren. Der Ansatz von OpenClaw bietet Ihnen beides: die Transparenz von einfachen Dateien <strong>und</strong> die Abrufkraft einer Vektorsuche mit einer Vektordatenbank. Sie können sie lesen, <code translate="no">git diff</code>, grep - es sind einfach Dateien.</p>
<p>Der einzige Nachteil? Im Moment ist dieses Markdown-first Speichersystem eng mit dem gesamten OpenClaw-Ökosystem verwoben - dem Gateway-Prozess, den Plattformkonnektoren, der Workspace-Konfiguration und der Messaging-Infrastruktur. Wenn man nur das Speichermodell haben will, ist das eine Menge an Maschinerie, die man mitschleppen muss.</p>
<p>Das ist genau der Grund, warum wir <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> entwickelt haben: dieselbe Philosophie - Markdown als Quelle der Wahrheit, automatische Vektorindizierung, vollständig von Menschen editierbar - aber als leichtgewichtige, eigenständige Bibliothek, die Sie in jede agenturische Architektur einfügen können.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Wie Memsearch funktioniert<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie bereits erwähnt, ist <a href="https://github.com/zilliztech/memsearch">memsearch</a> eine völlig unabhängige Bibliothek für den Langzeitspeicher, die dieselbe Speicherarchitektur implementiert, die auch in OpenClaw verwendet wird - ohne den Rest des OpenClaw-Stacks mitzubringen. Sie können sie in jedes beliebige Agenten-Framework (Claude, GPT, Llama, benutzerdefinierte Agenten, Workflow-Engines) einbinden und Ihrem System sofort einen persistenten, transparenten und von Menschen editierbaren Speicher geben.</p>
<p>Der gesamte Agentenspeicher in memsearch wird in einem lokalen Verzeichnis als Klartext-Markdown gespeichert. Die Struktur ist absichtlich einfach gehalten, damit die Entwickler sie auf einen Blick verstehen können:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch verwendet <a href="https://milvus.io/"><strong>Milvus</strong></a> als Vektor-Datenbank, um diese Markdown-Dateien für eine schnelle semantische Suche zu indizieren. Entscheidend ist jedoch, dass der Vektorindex <em>nicht</em> die Quelle der Wahrheit ist - die Dateien sind es. Wenn Sie den Milvus-Index vollständig löschen, <strong>verlieren Sie nichts.</strong> Memsearch bettet die Markdown-Dateien einfach neu ein und indiziert sie neu, so dass die gesamte Abrufschicht in wenigen Minuten wiederhergestellt ist. Das bedeutet, dass der Speicher Ihres Agenten transparent, dauerhaft und vollständig rekonstruierbar ist.</p>
<p>Hier sind die wichtigsten Funktionen von memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Lesbares Markdown macht die Fehlersuche so einfach wie das Bearbeiten einer Datei</h3><p>Die Fehlersuche im KI-Gedächtnis ist normalerweise mühsam. Wenn ein Agent eine falsche Antwort gibt, kann man bei den meisten Speichersystemen nicht klar erkennen, <em>was</em> er tatsächlich gespeichert hat. Der typische Arbeitsablauf besteht darin, benutzerdefinierten Code zu schreiben, um eine Speicher-API abzufragen, und sich dann durch undurchsichtige Einbettungen oder wortreiche JSON-Blobs zu wühlen, die beide nicht viel über den tatsächlichen internen Zustand der KI aussagen.</p>
<p><strong>memsearch beseitigt diese ganze Klasse von Problemen.</strong> Der gesamte Speicher wird im Ordner memory/ in einfacher Markdown-Form gespeichert:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Wenn die KI etwas falsch macht, ist es so einfach wie das Bearbeiten der Datei. Aktualisieren Sie den Eintrag, speichern Sie, und memsearch indiziert die Änderung automatisch neu. Fünf Sekunden. Keine API-Aufrufe. Keine Werkzeuge. Keine Rätsel. Sie debuggen AI-Speicher auf dieselbe Weise wie Dokumentation - durch Bearbeiten einer Datei.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Git-gestützter Speicher bedeutet, dass Teams Änderungen nachverfolgen, überprüfen und rückgängig machen können</h3><p>KI-Speicher, die in einer Datenbank gespeichert sind, lassen sich nur schwer gemeinsam bearbeiten. Um herauszufinden, wer was wann geändert hat, muss man sich durch Audit-Protokolle wühlen, und viele Lösungen bieten nicht einmal diese. Änderungen erfolgen stillschweigend, und bei Meinungsverschiedenheiten darüber, was die KI speichern soll, gibt es keinen klaren Lösungsweg. Teams verlassen sich dann auf Slack-Nachrichten und Annahmen.</p>
<p>Memsearch behebt dieses Problem, indem der Speicher nur aus Markdown-Dateien besteht - was bedeutet, dass <strong>Git die Versionierung automatisch übernimmt</strong>. Ein einziger Befehl zeigt die gesamte Historie an:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Jetzt nimmt der KI-Speicher am selben Workflow teil wie der Code. Architekturentscheidungen, Konfigurationsaktualisierungen und Einstellungsänderungen werden alle in Diffs angezeigt, die jeder kommentieren, genehmigen oder rückgängig machen kann:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">Klartextspeicher macht die Migration fast mühelos</h3><p>Die Migration ist eine der größten versteckten Kosten von Speicher-Frameworks. Der Wechsel von einem Tool zu einem anderen bedeutet in der Regel, Daten zu exportieren, Formate zu konvertieren, erneut zu importieren und zu hoffen, dass die Felder kompatibel sind. Diese Art von Arbeit kann leicht einen halben Tag in Anspruch nehmen, und das Ergebnis ist nie garantiert.</p>
<p>memsearch umgeht dieses Problem vollständig, da der Speicher als Klartext-Markdown vorliegt. Es gibt kein proprietäres Format, kein Schema zu übersetzen, nichts zu migrieren:</p>
<ul>
<li><p><strong>Rechnerwechsel:</strong> <code translate="no">rsync</code> der Speicherordner. Erledigt.</p></li>
<li><p><strong>Wechseln Sie das Einbettungsmodell:</strong> Führen Sie den Index-Befehl erneut aus. Es wird fünf Minuten dauern, und die Markdown-Dateien bleiben unberührt.</p></li>
<li><p><strong>Wechseln Sie den Einsatz der Vektordatenbank:</strong> Ändern Sie einen Konfigurationswert. Wechseln Sie zum Beispiel von Milvus Lite in der Entwicklung zu Zilliz Cloud in der Produktion:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ihre Speicherdateien bleiben genau gleich. Die Infrastruktur um sie herum kann sich frei weiterentwickeln. Das Ergebnis ist eine langfristige Portabilität - eine seltene Eigenschaft bei KI-Systemen.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Gemeinsame Markdown-Dateien ermöglichen es Menschen und Agenten, gemeinsam am Speicher zu schreiben</h3><p>Bei den meisten Speicherlösungen ist es erforderlich, Code für eine API zu schreiben, um zu bearbeiten, was sich die KI merkt. Das bedeutet, dass nur Entwickler den KI-Speicher pflegen können, und selbst für diese ist es umständlich.</p>
<p>Memsearch ermöglicht eine natürlichere Aufteilung der Verantwortung:</p>
<ul>
<li><p><strong>Die KI kümmert sich:</strong> Automatische Tagesprotokolle (<code translate="no">YYYY-MM-DD.md</code>) mit Ausführungsdetails wie "Bereitgestellt v2.3.1, 12% Leistungsverbesserung."</p></li>
<li><p><strong>Menschen handhaben:</strong> Langfristige Prinzipien in <code translate="no">MEMORY.md</code>, wie "Team stack: Python + FastAPI + PostgreSQL."</p></li>
</ul>
<p>Beide Seiten bearbeiten die gleichen Markdown-Dateien mit den Tools, die sie bereits verwenden. Keine API-Aufrufe, kein spezielles Tooling, kein Gatekeeper. Wenn der Speicher in einer Datenbank gesperrt ist, ist diese Art der gemeinsamen Autorenschaft nicht möglich. memsearch macht dies zum Standard.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Unter der Haube: memsearch läuft auf vier Workflows, die den Speicher schnell, frisch und schlank halten<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch hat vier Kern-Workflows: <strong>Überwachen</strong> (Monitor) → <strong>Indexieren</strong> (Chunking und Einbetten) → <strong>Suchen</strong> (Abrufen) → <strong>Verdichten</strong> (Zusammenfassen). Jeder von ihnen hat folgende Aufgaben.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Beobachten: Automatisches Neuindizieren bei jedem Speichern einer Datei</h3><p>Der <strong>Watch-Workflow</strong> überwacht alle Markdown-Dateien im Speicher/Verzeichnis und löst eine Neuindizierung aus, sobald eine Datei geändert und gespeichert wird. Eine <strong>Verzögerung von 1500 ms</strong> stellt sicher, dass Aktualisierungen erkannt werden, ohne Rechenzeit zu verschwenden: Wenn mehrere Speicherungen kurz hintereinander erfolgen, wird der Timer zurückgesetzt und erst dann ausgelöst, wenn sich die Bearbeitungen stabilisiert haben.</p>
<p>Diese Verzögerung ist empirisch abgestimmt:</p>
<ul>
<li><p><strong>100ms</strong> → zu empfindlich; wird bei jedem Tastendruck ausgelöst, brennende Einbettungsaufrufe</p></li>
<li><p><strong>10s</strong> → zu langsam; Entwickler bemerken Verzögerung</p></li>
<li><p><strong>1500ms</strong> → ideales Gleichgewicht zwischen Reaktionsfähigkeit und Ressourceneffizienz</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In der Praxis bedeutet dies, dass ein Entwickler in einem Fenster Code schreiben und in einem anderen <code translate="no">MEMORY.md</code> bearbeiten kann, indem er eine URL für API-Dokumente hinzufügt oder einen veralteten Eintrag korrigiert. Speichern Sie die Datei, und die nächste KI-Abfrage nimmt den neuen Speicher auf. Kein Neustart, keine manuelle Neuindizierung.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Index: Intelligentes Chunking, Deduplizierung und versionssichere Einbettung</h3><p>Index ist der leistungsentscheidende Workflow. Er behandelt drei Dinge: <strong>Chunking, Deduplizierung und versionierte Chunk-IDs.</strong></p>
<p><strong>Beim Chunking</strong> wird der Text entlang semantischer Grenzen - Überschriften und Textkörper - aufgeteilt, damit zusammengehörige Inhalte zusammenbleiben. Dadurch werden Fälle vermieden, in denen ein Satz wie "Redis-Konfiguration" auf mehrere Chunks aufgeteilt wird.</p>
<p>Zum Beispiel dieser Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Wird zu zwei Chunks:</p>
<ul>
<li><p>Chunk 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Chunk 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>Die Deduplizierung</strong> verwendet einen SHA-256-Hash jedes Chunks, um zu vermeiden, dass derselbe Text zweimal eingebettet wird. Wenn mehrere Dateien "PostgreSQL 16" erwähnen, wird die Einbettungs-API einmal aufgerufen, nicht einmal pro Datei. Für ~500KB Text spart dies etwa <strong>$0,15/Monat.</strong> Im großen Maßstab summiert sich das zu Hunderten von Dollar.</p>
<p><strong>Das Chunk-ID-Design</strong> kodiert alles, was nötig ist, um zu wissen, ob ein Chunk veraltet ist. Das Format ist <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. Das Feld <code translate="no">model_version</code> ist der wichtige Teil: Wenn ein Einbettungsmodell von <code translate="no">text-embedding-3-small</code> auf <code translate="no">text-embedding-3-large</code> aktualisiert wird, werden die alten Einbettungen ungültig. Da die Modellversion in die ID integriert ist, erkennt das System automatisch, welche Chunks neu eingebettet werden müssen. Eine manuelle Bereinigung ist nicht erforderlich.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Suche: Hybrid Vector + BM25 Retrieval für maximale Genauigkeit</h3><p>Für die Suche wird ein hybrider Ansatz verwendet: Vektorsuche mit einer Gewichtung von 70 % und BM25-Schlüsselwortsuche mit einer Gewichtung von 30 %. Dadurch werden zwei unterschiedliche Anforderungen, die in der Praxis häufig auftreten, ausgeglichen.</p>
<ul>
<li><p>Die<strong>Vektorsuche</strong> übernimmt den semantischen Abgleich. Eine Abfrage nach "Redis cache config" gibt einen Chunk zurück, der "Redis L1 cache with 5min TTL" enthält, auch wenn der Wortlaut unterschiedlich ist. Dies ist nützlich, wenn sich der Entwickler zwar an das Konzept, nicht aber an die genaue Formulierung erinnert.</p></li>
<li><p><strong>BM25</strong> behandelt exakte Übereinstimmungen. Eine Abfrage nach "PostgreSQL 16" gibt keine Ergebnisse über "PostgreSQL 15" zurück. Dies ist wichtig für Fehlercodes, Funktionsnamen und versionsspezifisches Verhalten, wo "close" nicht gut genug ist.</p></li>
</ul>
<p>Die Standardaufteilung von 70/30 ist für die meisten Anwendungsfälle gut geeignet. Für Arbeitsabläufe, die stark auf exakte Übereinstimmungen ausgerichtet sind, ist die Erhöhung der BM25-Gewichtung auf 50 % eine einzeilige Konfigurationsänderung.</p>
<p>Die Ergebnisse werden als Top-K-Chunks (standardmäßig 3) zurückgegeben, die jeweils auf 200 Zeichen gekürzt sind. Wenn der vollständige Inhalt benötigt wird, lädt <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> ihn. Diese schrittweise Offenlegung hält die Nutzung des LLM-Kontextfensters schlank, ohne den Zugang zu Details zu beeinträchtigen.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Kompakt: Historischen Speicher zusammenfassen, um den Kontext sauber zu halten</h3><p>Angehäufter Speicher wird irgendwann zu einem Problem. Alte Einträge füllen das Kontextfenster, erhöhen die Token-Kosten und fügen Rauschen hinzu, das die Antwortqualität verschlechtert. Compact geht dieses Problem an, indem es einen LLM aufruft, um den historischen Speicher in einer komprimierten Form zusammenzufassen und dann die Originale zu löschen oder zu archivieren. Der Vorgang kann manuell ausgelöst oder für eine regelmäßige Ausführung geplant werden.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Wie man mit memsearch anfängt<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch bietet sowohl eine <strong>Python-API</strong> als auch eine <strong>CLI</strong>, so dass Sie es innerhalb von Agenten-Frameworks oder als eigenständiges Debugging-Tool verwenden können. Die Einrichtung ist minimal, und das System ist so konzipiert, dass Ihre lokale Entwicklungsumgebung und der Produktionseinsatz fast identisch aussehen.</p>
<p>Memsearch unterstützt drei Milvus-kompatible Backends, die alle über die <strong>gleiche API</strong> zugänglich sind:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (Standard)</strong></a><strong>:</strong> Lokale <code translate="no">.db</code> Datei, keine Konfiguration, geeignet für den individuellen Gebrauch.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Selbstgehostet, unterstützt mehrere Agenten, die Daten gemeinsam nutzen, geeignet für Teamumgebungen.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Vollständig verwaltet, mit automatischer Skalierung, Backups, hoher Verfügbarkeit und Isolierung. Ideal für Produktions-Workloads.</p></li>
</ul>
<p>Der Wechsel von der lokalen Entwicklung zur Produktion ist normalerweise <strong>eine einzeilige Konfigurationsänderung</strong>. Ihr Code bleibt derselbe.</p>
<h3 id="Install" class="common-anchor-header">installieren</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch unterstützt auch mehrere Einbettungsanbieter, darunter OpenAI, Google, Voyage, Ollama und lokale Modelle. Dadurch wird sichergestellt, dass Ihre Speicherarchitektur portabel und anbieterunabhängig bleibt.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Option 1: Python-API (integriert in Ihr Agenten-Framework)</h3><p>Hier ist ein minimales Beispiel für eine vollständige Agentenschleife mit memsearch. Sie können es kopieren/einfügen und nach Bedarf ändern:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Dies zeigt die Kernschleife:</p>
<ul>
<li><p><strong>Zur Erinnerung</strong>: memsearch führt eine hybride Vektor- und BM25-Suche durch.</p></li>
<li><p><strong>Denken Sie</strong>: Ihr LLM verarbeitet die Benutzereingabe + den abgerufenen Speicher</p></li>
<li><p><strong>Erinnern Sie sich</strong>: der Agent schreibt neuen Speicher in Markdown, und memsearch aktualisiert seinen Index</p></li>
</ul>
<p>Dieses Muster passt natürlich in jedes Agenten-System - LangChain, AutoGPT, semantische Router, LangGraph oder benutzerdefinierte Agenten-Schleifen. Es ist vom Design her rahmenunabhängig.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Option 2: CLI (schnelle Operationen, gut zum Debuggen)</h3><p>Die CLI ist ideal für eigenständige Arbeitsabläufe, schnelle Überprüfungen oder die Untersuchung des Speichers während der Entwicklung:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die CLI spiegelt die Fähigkeiten der Python-API wider, funktioniert aber ohne das Schreiben von Code - ideal für Debugging, Inspektionen, Migrationen oder die Validierung der Speicherordnerstruktur.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Wie memsearch im Vergleich zu anderen Speicherlösungen abschneidet<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>Die häufigste Frage, die Entwickler stellen, ist, warum sie memsearch verwenden sollten, wenn es bereits etablierte Optionen gibt. Die kurze Antwort: memsearch tauscht fortgeschrittene Funktionen wie temporale Wissensgraphen gegen Transparenz, Portabilität und Einfachheit. Für die meisten Anwendungsfälle von Agentenspeicher ist das der richtige Kompromiss.</p>
<table>
<thead>
<tr><th>Lösung</th><th>Stärken</th><th>Beschränkungen</th><th>Am besten geeignet für</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Transparenter Klartextspeicher, Mensch-KI-Ko-Autorenschaft, keine Reibungsverluste bei der Migration, einfaches Debugging, Git-nativ</td><td>Keine eingebauten zeitlichen Graphen oder komplexe Multi-Agenten-Speicherstrukturen</td><td>Teams, die Wert auf Kontrolle, Einfachheit und Portabilität im Langzeitspeicher legen</td></tr>
<tr><td>Mem0</td><td>Vollständig verwaltet, keine Infrastruktur zu betreiben oder zu warten</td><td>Undurchsichtig - Speicher kann nicht inspiziert oder manuell bearbeitet werden; Einbettungen sind die einzige Darstellung</td><td>Teams, die einen einfach zu verwaltenden Dienst wünschen und mit weniger Transparenz einverstanden sind</td></tr>
<tr><td>Zep</td><td>Reichhaltiger Funktionsumfang: temporales Gedächtnis, Modellierung mehrerer Personen, komplexe Wissensgraphen</td><td>Schwerfällige Architektur; mehr bewegliche Teile; schwieriger zu erlernen und zu bedienen</td><td>Agenten, die wirklich fortgeschrittene Speicherstrukturen oder zeitbewusstes Denken benötigen</td></tr>
<tr><td>LangMem / Letta</td><td>Tiefe, nahtlose Integration in ihre eigenen Ökosysteme</td><td>Framework-Lock-in; schwer auf andere Agenten-Stacks zu portieren</td><td>Teams sind bereits auf diese spezifischen Frameworks festgelegt</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">Verwenden Sie memsearch und schließen Sie sich dem Projekt an<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch ist vollständig quelloffen unter der MIT-Lizenz, und das Repository ist ab heute für Produktionsversuche bereit.</p>
<ul>
<li><p><strong>Repository:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Dokumente:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Wenn Sie einen Agenten bauen, der sich Dinge über Sitzungen hinweg merken muss und die volle Kontrolle darüber haben will, was er sich merkt, ist memsearch einen Blick wert. Die Bibliothek wird mit einem einzigen <code translate="no">pip install</code> installiert, funktioniert mit jedem Agenten-Framework und speichert alles als Markdown, das Sie lesen, bearbeiten und mit Git versionieren können.</p>
<p>Wir entwickeln memsearch aktiv weiter und würden uns über Anregungen aus der Community freuen.</p>
<ul>
<li><p>Eröffnen Sie einen Fehler, wenn etwas nicht funktioniert.</p></li>
<li><p>Reichen Sie einen PR ein, wenn Sie die Bibliothek erweitern wollen.</p></li>
<li><p>Veröffentlichen Sie das Repo, wenn Ihnen die Philosophie von Markdown-as-source-of-truth zusagt.</p></li>
</ul>
<p>Das Speichersystem von OpenClaw ist nicht länger in OpenClaw eingeschlossen. Jetzt kann es jeder benutzen.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lesen Sie weiter<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw-Anleitung: Verbindung zu Slack für einen lokalen KI-Assistenten</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Erstellen von Clawdbot-ähnlichen KI-Agenten mit LangGraph &amp; Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG vs. langlaufende Agenten: Ist RAG obsolet?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Erstellen Sie eine benutzerdefinierte Anthropic Skill für Milvus, um RAG schnell zu starten</a></p></li>
</ul>
