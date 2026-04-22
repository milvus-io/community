---
id: anthropic-managed-agents-memory-milvus.md
title: Hinzufügen eines Langzeitspeichers zu Anthropic's Managed Agents mit Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Die Managed Agents von Anthropic machen Agenten zuverlässig, aber jede Sitzung
  beginnt leer. Hier erfahren Sie, wie Sie Milvus für den semantischen Abruf
  innerhalb einer Sitzung und den gemeinsamen Speicher von Agenten koppeln
  können.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Die <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a> von Anthropic machen die Agenteninfrastruktur widerstandsfähig. Eine Aufgabe mit 200 Schritten überlebt jetzt einen Absturz des Harness, einen Timeout in der Sandbox oder eine Änderung der Infrastruktur während des Fluges ohne menschliches Eingreifen. Anthropic berichtet, dass die p50-Zeit bis zum ersten Token um etwa 60 % und die p95-Zeit um über 90 % nach der Entkopplung gesunken ist.</p>
<p>Was die Zuverlässigkeit nicht lösen kann, ist der Speicher. Eine Code-Migration in 200 Schritten, die in Schritt 201 auf einen neuen Abhängigkeitskonflikt stößt, kann nicht effizient darauf zurückblicken, wie sie den letzten Konflikt behandelt hat. Ein Agent, der Schwachstellen-Scans für einen Kunden durchführt, hat keine Ahnung, dass ein anderer Agent denselben Fall bereits vor einer Stunde gelöst hat. Jede Sitzung beginnt mit einer leeren Seite, und die parallelen Gehirne haben keinen Zugang zu dem, was die anderen bereits herausgefunden haben.</p>
<p>Die Lösung besteht darin, die <a href="https://milvus.io/">Milvus-Vektordatenbank</a> mit den Managed Agents von Anthropic zu kombinieren: semantischer Abruf innerhalb einer Sitzung und eine gemeinsame <a href="https://milvus.io/docs/milvus_for_agents.md">Vektorspeicherschicht</a> für alle Sitzungen. Der Sitzungsvertrag bleibt unangetastet, das Kabelbaumsystem erhält eine neue Schicht, und Agentenaufgaben mit langem Zeithorizont erhalten qualitativ andere Fähigkeiten.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Was Managed Agents gelöst haben (und was nicht)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Managed Agents lösten das Problem der Zuverlässigkeit durch die Entkopplung des Agenten in drei unabhängige Module. Was sie nicht gelöst haben, ist das Gedächtnis, entweder als semantischer Abruf innerhalb einer einzigen Sitzung oder als gemeinsame Erfahrung über parallele Sitzungen hinweg.</strong> Im Folgenden wird erläutert, was entkoppelt wurde und wo die Speicherlücke in diesem entkoppelten Design liegt.</p>
<table>
<thead>
<tr><th>Modul</th><th>Was es tut</th></tr>
</thead>
<tbody>
<tr><td><strong>Sitzung</strong></td><td>Ein reines Ereignisprotokoll für alles, was passiert ist. Wird außerhalb des Kabelbaums gespeichert.</td></tr>
<tr><td><strong>Harness</strong></td><td>Die Schleife, die Claude aufruft und Claudes Tool-Aufrufe an die entsprechende Infrastruktur weiterleitet.</td></tr>
<tr><td><strong>Sandkasten</strong></td><td>Die isolierte Ausführungsumgebung, in der Claude den Code ausführt und die Dateien bearbeitet.</td></tr>
</tbody>
</table>
<p>Der Rahmen, der dieses Design möglich macht, wird in Anthropics Beitrag ausdrücklich genannt:</p>
<p><em>"Die Sitzung ist nicht das Kontextfenster von Claude".</em></p>
<p>Das Kontextfenster ist flüchtig: Es ist in Token begrenzt, wird bei jedem Modellaufruf rekonstruiert und bei der Rückkehr des Aufrufs verworfen. Die Sitzung ist dauerhaft, wird außerhalb des Kabelbaums gespeichert und stellt das System der Aufzeichnung für die gesamte Aufgabe dar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn ein Harness abstürzt, startet die Plattform ein neues mit <code translate="no">wake(sessionId)</code>. Das neue Kabelbaumsystem liest das Ereignisprotokoll über <code translate="no">getSession(id)</code>, und die Aufgabe wird beim letzten aufgezeichneten Schritt fortgesetzt, ohne dass eine benutzerdefinierte Wiederherstellungslogik geschrieben werden muss und ohne dass ein Babysitting auf Sitzungsebene erforderlich ist.</p>
<p>Was der Beitrag über verwaltete Agenten nicht anspricht und auch nicht behauptet, ist, was der Agent tut, wenn er sich etwas merken muss. In dem Moment, in dem man echte Workloads durch die Architektur schiebt, zeigen sich zwei Lücken. Die eine befindet sich innerhalb einer einzigen Sitzung, die andere ist sitzungsübergreifend.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problem 1: Warum lineare Sitzungsprotokolle nach ein paar hundert Schritten versagen<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Lineare Sitzungsprotokolle versagen nach ein paar hundert Schritten, weil sequenzielle Lesevorgänge und semantische Suche grundlegend unterschiedliche Arbeitslasten sind und die</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>nur die erste bedient.</strong> Die Aufteilung nach Position oder die Suche nach einem Zeitstempel reicht aus, um die Frage zu beantworten: "Wo hat diese Sitzung aufgehört?" Es reicht nicht aus, um die Frage zu beantworten, die ein Agent vorhersehbar bei jeder längeren Aufgabe braucht: Haben wir diese Art von Problem schon einmal gesehen und was haben wir dagegen getan?</p>
<p>Nehmen wir eine Code-Migration in Schritt 200, bei der ein neuer Abhängigkeitskonflikt auftritt. Der natürliche Schritt ist ein Blick zurück. Ist der Agent bei dieser Aufgabe schon einmal auf etwas Ähnliches gestoßen? Welcher Ansatz wurde ausprobiert? Hat er funktioniert, oder hat er etwas anderes in der Folgezeit rückgängig gemacht?</p>
<p>Mit <code translate="no">getEvents()</code> gibt es zwei Möglichkeiten, diese Frage zu beantworten, und beide sind schlecht:</p>
<table>
<thead>
<tr><th>Option</th><th>Problem</th></tr>
</thead>
<tbody>
<tr><td>Jedes Ereignis sequentiell scannen</td><td>Langsam bei 200 Schritten. Unhaltbar bei 2.000.</td></tr>
<tr><td>Einen großen Teil des Datenstroms in das Kontextfenster auslagern</td><td>Teuer bei Token, unzuverlässig bei Skalierung und verdrängt den eigentlichen Arbeitsspeicher des Agenten für den aktuellen Schritt.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Sitzung ist gut für die Wiederherstellung und Prüfung, aber sie wurde nicht mit einem Index erstellt, der die Frage "Habe ich das schon einmal gesehen?" unterstützt. Bei Aufgaben mit langem Zeithorizont ist diese Frage nicht mehr optional.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Lösung 1: Hinzufügen von semantischem Speicher zur Sitzung eines verwalteten Agenten<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Fügen Sie eine Milvus-Sammlung neben dem Sitzungsprotokoll hinzu und schreiben Sie zweimal von</strong> <code translate="no">**emitEvent**</code>. Der Sitzungsvertrag bleibt unangetastet, und das Kabelbaumsystem erhält semantische Abfragen über seine eigene Vergangenheit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Design von Anthropic lässt Spielraum für genau dies. In ihrem Beitrag heißt es, dass "alle abgerufenen Ereignisse auch im Harness transformiert werden können, bevor sie an das Kontextfenster von Claude weitergegeben werden. Diese Transformationen können alles sein, was der Harness kodiert, einschließlich Kontextorganisation ... und Kontext-Engineering." Das Kontext-Engineering findet im Kabelbaum statt; die Sitzung muss nur die Dauerhaftigkeit und Abfragbarkeit garantieren.</p>
<p>Das Muster: Jedes Mal, wenn <code translate="no">emitEvent</code> ausgelöst wird, berechnet das Kabelbaumsystem auch eine <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">Vektoreinbettung</a> für indizierungswürdige Ereignisse und fügt sie in eine Milvus-Sammlung ein.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Wenn der Agent auf Schritt 200 trifft und frühere Entscheidungen abrufen muss, ist die Abfrage eine <a href="https://zilliz.com/glossary/vector-similarity-search">Vektorsuche</a>, die auf diese Sitzung beschränkt ist:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Bevor dies geschieht, sind drei Produktionsdetails wichtig:</p>
<ul>
<li><strong>Wählen Sie aus, was indiziert werden soll.</strong> Nicht jedes Ereignis verdient eine Einbettung. Zwischenzustände von Werkzeugaufrufen, Wiederholungsprotokolle und sich wiederholende Statusereignisse verschlechtern die Abfragequalität schneller als sie sie verbessern. Die Richtlinie <code translate="no">INDEXABLE_EVENT_TYPES</code> ist aufgabenabhängig, nicht global.</li>
<li><strong>Definieren Sie die Konsistenzgrenze.</strong> Wenn das Kabelbaumsystem zwischen dem Anhängen der Sitzung und dem Einfügen von Milvus abstürzt, ist eine Schicht der anderen kurz voraus. Das Fenster ist klein, aber real. Entscheiden Sie sich für einen Abstimmungspfad (erneuter Versuch beim Neustart, vorausschauendes Schreiben des Protokolls oder eventuelle Abstimmung), anstatt zu hoffen.</li>
<li><strong>Kontrolle der Einbettungsausgaben.</strong> Eine Sitzung mit 200 Schritten, die bei jedem Schritt synchron eine externe Einbettungs-API aufruft, erzeugt eine Rechnung, die niemand geplant hat. Stellen Sie Einbettungen in eine Warteschlange und senden Sie sie asynchron in Stapeln.</li>
</ul>
<p>Mit diesen Maßnahmen dauert der Abruf nur noch Millisekunden für die Vektorsuche und weniger als 100 ms für den Aufruf der Einbettung. Die fünf relevantesten Ereignisse aus der Vergangenheit landen im Kontext, bevor der Agent die Reibung bemerkt. Die Sitzung behält ihre ursprüngliche Aufgabe als dauerhaftes Protokoll; das Harness erhält die Möglichkeit, seine eigene Vergangenheit semantisch und nicht sequentiell abzufragen. Das ist eine bescheidene Änderung an der API-Oberfläche und eine strukturelle Änderung in dem, was der Agent bei Aufgaben mit langem Zeithorizont tun kann.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problem 2: Warum parallele Claude-Agenten keine Erfahrungen austauschen können<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Parallele Claude-Agenten können keine Erfahrungen austauschen, da die Sitzungen von Managed Agents von vornherein isoliert sind. Dieselbe Isolierung, die die horizontale Skalierung sauber macht, verhindert auch, dass jedes Gehirn von jedem anderen Gehirn lernen kann.</strong></p>
<p>In einem entkoppelten Kabelbaum sind die Gehirne zustandslos und unabhängig. Diese Isolierung macht die Latenzgewinne der Anthropic-Berichte sichtbar und sorgt dafür, dass jede Sitzung im Dunkeln über jede andere Sitzung bleibt.</p>
<p>Agent A verbringt 40 Minuten mit der Diagnose eines kniffligen SQL-Injection-Vektors für einen Kunden. Eine Stunde später greift Agent B denselben Fall für einen anderen Kunden auf und verbringt seine eigenen 40 Minuten damit, dieselben Sackgassen zu durchlaufen, dieselben Tool-Aufrufe auszuführen und zur selben Antwort zu gelangen.</p>
<p>Für einen einzelnen Benutzer, der nur gelegentlich einen Agenten einsetzt, ist das verschwendete Rechenzeit. Für eine Plattform, auf der täglich Dutzende von <a href="https://zilliz.com/glossary/ai-agents">KI-Agenten</a> für Code-Reviews, Schwachstellen-Scans und Dokumentationserstellung für verschiedene Kunden gleichzeitig laufen, steigen die Kosten strukturell an.</p>
<p>Wenn sich die Erfahrung, die jede Sitzung erzeugt, in dem Moment verflüchtigt, in dem die Sitzung endet, ist die Intelligenz entbehrlich. Eine auf diese Weise aufgebaute Plattform lässt sich zwar linear skalieren, wird aber im Laufe der Zeit nicht besser, so wie es menschliche Ingenieure tun.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Lösung 2: Aufbau eines gemeinsam genutzten Agentenspeicherpools mit Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Erstellen Sie eine Vektorsammlung, aus der jedes Harness beim Start liest und in die es beim Herunterfahren schreibt, partitioniert nach Tenant, so dass die Erfahrung über Sitzungen hinweg gepoolt wird, ohne dass es zu Lecks zwischen Kunden kommt.</strong></p>
<p>Wenn eine Sitzung endet, werden die wichtigsten Entscheidungen, die aufgetretenen Probleme und die erfolgreichen Ansätze in die gemeinsame Milvus-Sammlung übertragen. Wenn ein neues Gehirn initialisiert wird, führt das Harness als Teil des Setups eine semantische Abfrage durch und fügt die am besten übereinstimmenden früheren Erfahrungen in das Kontextfenster ein. Schritt eins des neuen Agenten erbt die Lektionen aller vorherigen Agenten.</p>
<p>Zwei technische Entscheidungen führen dies vom Prototyp zur Produktion.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Isolierung von Mietern mit dem Milvus Partition Key</h3><p><strong>Partitionieren Sie nach</strong> <code translate="no">**tenant_id**</code>,<strong> und die Erfahrungen des Agenten von Kunde A befinden sich physisch nicht in derselben Partition wie die von Kunde B. Das ist eher eine Isolierung auf der Datenebene als eine Abfragekonvention.</strong></p>
<p>Die Arbeit von Gehirn A an der Codebasis von Unternehmen A sollte niemals von den Agenten von Unternehmen B abgerufen werden können. Der <a href="https://milvus.io/docs/use-partition-key.md">Partitionsschlüssel</a> von Milvus behandelt dies in einer einzigen Sammlung, ohne eine zweite Sammlung pro Tenant und ohne Sharding-Logik im Anwendungscode.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Die Agenten von Kunde A tauchen niemals in den Abfragen von Kunde B auf, nicht weil der Abfragefilter korrekt geschrieben ist (obwohl er das sein muss), sondern weil die Daten physisch nicht in der gleichen Partition wie die von Kunde B liegen. Eine Sammlung für den Betrieb, logische Isolierung auf der Abfrageschicht, physische Isolierung auf der Partitionsebene.</p>
<p>In den <a href="https://milvus.io/docs/multi_tenancy.md">Dokumenten zu Mehrmandantenstrategien</a> finden Sie Informationen darüber, wann der Partitionsschlüssel passt und wann getrennte Sammlungen oder Datenbanken passen, und im <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">RAG-Musterleitfaden</a> für den Einsatz in der Produktion.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Warum die Speicherqualität von Agenten kontinuierliche Arbeit erfordert</h3><p><strong>Die Speicherqualität verschlechtert sich mit der Zeit: Fehlerhafte Workarounds, die einmal erfolgreich waren, werden wiederholt und verstärkt, und veraltete Einträge, die an veraltete Abhängigkeiten gebunden sind, führen Agenten, die sie erben, weiterhin in die Irre. Die Verteidigungsmaßnahmen sind operative Programme, keine Datenbankfunktionen.</strong></p>
<p>Ein Agent stößt auf eine fehlerhafte Umgehungslösung, die zufällig einmal erfolgreich war. Sie wird in den gemeinsamen Pool geschrieben. Der nächste Agent holt sie ab, wiederholt sie und verstärkt das schlechte Muster durch einen zweiten "erfolgreichen" Nutzungseintrag.</p>
<p>Veraltete Einträge folgen einer langsameren Version desselben Pfades. Ein Fix, der an eine Abhängigkeitsversion angeheftet ist, die vor sechs Monaten veraltet war, wird weiterhin abgerufen und führt Agenten, die ihn übernehmen, in die Irre. Je älter und stärker der Pool genutzt wird, desto mehr sammelt sich dies an.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Drei operationelle Programme schützen vor diesem Problem:</p>
<ul>
<li><strong>Zuverlässigkeitsbewertung.</strong> Verfolgt, wie oft ein Speicher in nachgelagerten Sitzungen erfolgreich angewendet wurde. Verfall von Einträgen, die bei der Wiederholung scheitern. Beförderung von Einträgen, die wiederholt erfolgreich sind.</li>
<li><strong>Zeitliche Gewichtung.</strong> Bevorzugt aktuelle Erfahrungen. Zurückziehen von Einträgen, die einen bekannten Schwellenwert überschreiten, der oft an größere Versionssprünge von Abhängigkeiten gebunden ist.</li>
<li><strong>Menschliche Stichproben.</strong> Einträge mit hoher Abrufhäufigkeit haben eine hohe Hebelwirkung. Wenn einer von ihnen falsch ist, ist er oft falsch, und hier zahlt sich die menschliche Überprüfung am schnellsten aus.</li>
</ul>
<p>Milvus allein löst dieses Problem nicht, ebenso wenig wie Mem0, Zep oder ein anderes Speicherprodukt. Das Erzwingen eines Pools mit vielen Mandanten und ohne mandantenübergreifende Lecks ist etwas, das man einmal entwickelt. Diesen Pool akkurat, frisch und nützlich zu halten, ist eine kontinuierliche operative Arbeit, die keine Datenbank vorkonfiguriert liefert.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Mitbringsel: Was Milvus den Managed Agents von Anthropic hinzufügt<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus verwandelt Managed Agents von einer zuverlässigen, aber vergesslichen Plattform in eine Plattform, die die Erfahrung im Laufe der Zeit verbessert, indem sie einen semantischen Abruf innerhalb einer Sitzung und einen gemeinsamen Speicher für alle Agenten bietet.</strong></p>
<p>Managed Agents haben eine klare Antwort auf die Frage der Zuverlässigkeit: Sowohl Gehirn als auch Hände sind Vieh, und jeder von ihnen kann sterben, ohne die Aufgabe mitzunehmen. Das ist das Infrastrukturproblem, und Anthropic hat es gut gelöst.</p>
<p>Was offen blieb, war das Wachstum. Menschliche Ingenieure entwickeln sich im Laufe der Zeit weiter; jahrelange Arbeit wird zur Mustererkennung, und sie denken nicht bei jeder Aufgabe nach den ersten Prinzipien. Die heutigen verwalteten Agenten tun dies nicht, denn jede Sitzung beginnt mit einer leeren Seite.</p>
<p>Die Verknüpfung der Sitzung mit Milvus für den semantischen Abruf innerhalb einer Aufgabe und die Zusammenführung der Erfahrungen aller Gehirne in einer gemeinsamen Vektorsammlung gibt den Agenten eine Vergangenheit, die sie tatsächlich nutzen können. Das Einbinden von Milvus ist der Teil der Infrastruktur; das Beschneiden falscher Erinnerungen, das Entfernen veralteter Erinnerungen und das Durchsetzen von Mietergrenzen ist der operative Teil. Sobald beides vorhanden ist, hört die Form des Speichers auf, eine Belastung zu sein, und beginnt, sich als Kapital zu entwickeln.</p>
<h2 id="Get-Started" class="common-anchor-header">Los geht's<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>Probieren Sie es lokal aus:</strong> Richten Sie eine eingebettete Milvus-Instanz mit <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> ein. Kein Docker, kein Cluster, nur <code translate="no">pip install pymilvus</code>. Produktions-Workloads werden bei Bedarf auf <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone oder Distributed</a> umgestellt.</li>
<li><strong>Lesen Sie die Gründe für das Design:</strong> Anthropic's <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents Engineering Post</a> geht ausführlich auf die Entkopplung von Session, Harness und Sandbox ein.</li>
<li><strong>Haben Sie Fragen?</strong> Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> bei, um über das Design des Agentenspeichers zu diskutieren, oder buchen Sie eine <a href="https://milvus.io/office-hours">Milvus-Sprechstunde</a>, um Ihren Workload durchzugehen.</li>
<li><strong>Bevorzugen Sie Managed?</strong> <a href="https://cloud.zilliz.com/signup">Melden Sie sich für Zilliz Cloud an</a> (oder <a href="https://cloud.zilliz.com/login">melden Sie sich an</a>), um Milvus mit Partitionsschlüsseln, Skalierung und Mandantenfähigkeit zu hosten. Neue Konten erhalten kostenloses Guthaben auf eine Arbeits-E-Mail.</li>
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
    </button></h2><p><strong>F: Was ist der Unterschied zwischen einer Sitzung und einem Kontextfenster in den Managed Agents von Anthropic?</strong></p>
<p>Das Kontextfenster ist der flüchtige Satz von Token, den ein einzelner Claude-Aufruf sieht. Es ist begrenzt und wird bei jedem Modellaufruf zurückgesetzt. Die Sitzung ist das dauerhafte, nur anhängende Ereignisprotokoll, das alles enthält, was während der gesamten Aufgabe passiert ist und außerhalb des Kabelbaums gespeichert wird. Wenn ein Harness abstürzt, legt <code translate="no">wake(sessionId)</code> ein neues Harness an, das das Sitzungsprotokoll liest und fortfährt. Die Sitzung ist das System der Aufzeichnung; das Kontextfenster ist der Arbeitsspeicher. Die Sitzung ist nicht das Kontextfenster.</p>
<p><strong>F: Wie kann ich den Agentenspeicher über Claude-Sitzungen hinweg erhalten?</strong></p>
<p>Die Sitzung selbst ist bereits persistent; das ist es, was <code translate="no">getSession(id)</code> abruft. Was normalerweise fehlt, ist ein abfragbarer Langzeitspeicher. Das Muster besteht darin, Ereignisse mit hohem Signalwert (Entscheidungen, Beschlüsse, Strategien) während <code translate="no">emitEvent</code> in eine Vektordatenbank wie Milvus einzubetten und dann zum Zeitpunkt des Abrufs nach semantischer Ähnlichkeit abzufragen. Auf diese Weise erhalten Sie sowohl das dauerhafte Sitzungsprotokoll, das Anthropic bereitstellt, als auch eine semantische Abrufschicht, mit der Sie über Hunderte von Schritten zurückblicken können.</p>
<p><strong>F: Können sich mehrere Claude-Agenten den Speicher teilen?</strong></p>
<p>Nicht ohne Weiteres. Jede Sitzung von Managed Agents ist von vornherein isoliert, was eine horizontale Skalierung ermöglicht. Um den Speicher zwischen den Agenten gemeinsam zu nutzen, fügen Sie eine gemeinsame Vektorsammlung hinzu (z. B. in Milvus), aus der jedes Geschirr beim Start liest und in die es beim Herunterfahren schreibt. Verwenden Sie die Partitionierungsfunktion von Milvus, um Tenants zu isolieren, damit die Agenten-Speicher von Kunde A nicht in die Sitzungen von Kunde B übergehen.</p>
<p><strong>F: Welche ist die beste Vektordatenbank für den Speicher von KI-Agenten?</strong></p>
<p>Die ehrliche Antwort hängt vom Umfang und der Form der Bereitstellung ab. Für Prototypen und kleine Arbeitslasten eignet sich eine lokal eingebettete Option wie Milvus Lite, die prozessintern und ohne Infrastruktur läuft. Für Produktionsagenten mit vielen Mandanten benötigen Sie eine Datenbank mit ausgereifter Mehrmandantenfähigkeit (Partitionsschlüssel, gefilterte Suche), hybrider Suche (Vektor + Skalar + Schlüsselwort) und Millisekunden-Latenz bei Millionen von Vektoren. Milvus wurde speziell für Vektor-Workloads in dieser Größenordnung entwickelt, weshalb es in Produktionsagenten-Speichersystemen auf Basis von LangChain, Google ADK, Deep Agents und OpenAgents eingesetzt wird.</p>
