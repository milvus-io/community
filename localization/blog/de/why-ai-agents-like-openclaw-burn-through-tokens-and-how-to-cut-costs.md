---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: >-
  Warum KI-Agenten wie OpenClaw Token verbrauchen und wie man die Kosten senken
  kann
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Warum die Token-Rechnungen von OpenClaw und anderen KI-Agenten in die Höhe
  schnellen und wie man dies mit BM25 + Vektorabfrage (index1, QMD, Milvus) und
  Markdown-first memory (memsearch) beheben kann.
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<custom-h1>Warum AI-Agenten wie OpenClaw Token verbrauchen und wie man die Kosten senken kann</custom-h1><p>Wenn Sie schon etwas Zeit mit <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (früher Clawdbot und Moltbot) verbracht haben, wissen Sie bereits, wie gut dieser KI-Agent ist. Er ist schnell, lokal, flexibel und in der Lage, überraschend komplexe Arbeitsabläufe über Slack, Discord, Ihre Codebasis und praktisch alles andere, in das Sie ihn einbinden, abzuwickeln. Aber sobald man anfängt, es ernsthaft zu nutzen, zeigt sich schnell ein Muster: <strong>Der Tokenverbrauch steigt.</strong></p>
<p>Das ist nicht die Schuld von OpenClaw - so verhalten sich die meisten KI-Agenten heutzutage. Sie lösen für fast alles einen LLM-Aufruf aus: eine Datei nachschlagen, eine Aufgabe planen, eine Notiz schreiben, ein Tool ausführen oder eine Folgefrage stellen. Und da Token die universelle Währung dieser Aufrufe sind, hat jede Aktion ihre Kosten.</p>
<p>Um zu verstehen, woher diese Kosten kommen, müssen wir einen Blick unter die Haube auf zwei wichtige Faktoren werfen:</p>
<ul>
<li><strong>Die Suche:</strong> Schlecht konstruierte Suchvorgänge ziehen ausufernde Kontext-Payloads nach sich - ganze Dateien, Protokolle, Nachrichten und Codebereiche, die das Modell eigentlich nicht benötigt.</li>
<li><strong>Speicher:</strong> Das Speichern unwichtiger Informationen zwingt den Agenten dazu, diese bei zukünftigen Aufrufen erneut zu lesen und zu verarbeiten, wodurch der Tokenverbrauch im Laufe der Zeit steigt.</li>
</ul>
<p>Beide Probleme erhöhen stillschweigend die Betriebskosten, ohne die Fähigkeiten zu verbessern.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Wie KI-Agenten wie OpenClaw tatsächlich Suchvorgänge durchführen - und warum das Token verbrennt<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn ein Agent Informationen aus Ihrer Codebasis oder Dokumentenbibliothek benötigt, führt er normalerweise das Äquivalent einer projektweiten <strong>Strg+F-Funktion</strong> aus. Jede übereinstimmende Zeile wird zurückgegeben - ohne Rangfolge, ungefiltert und ohne Priorisierung. Claude Code implementiert dies durch ein spezielles Grep-Werkzeug, das auf ripgrep aufbaut. OpenClaw hat kein eingebautes Tool für die Codebase-Suche, aber sein exec-Tool lässt das zugrunde liegende Modell jeden Befehl ausführen, und geladene Skills können den Agenten dazu bringen, Tools wie rg zu verwenden. In beiden Fällen liefert die Codebase-Suche Schlüsselwortübereinstimmungen ohne Rangfolge und ungefiltert.</p>
<p>Dieser Brute-Force-Ansatz funktioniert gut bei kleinen Projekten. Aber wenn die Repositories wachsen, steigt auch der Preis. Irrelevante Treffer stapeln sich im Kontextfenster des LLM und zwingen das Modell dazu, Tausende von Token zu lesen und zu verarbeiten, die es eigentlich nicht braucht. Eine einzige unskopierte Suche kann ganze Dateien, riesige Kommentarblöcke oder Protokolle, die ein Schlüsselwort, aber nicht die zugrundeliegende Absicht enthalten, anziehen. Wiederholt man dieses Muster über eine lange Debugging- oder Forschungssitzung, summiert sich die Menge schnell.</p>
<p>Sowohl OpenClaw als auch Claude Code versuchen, dieses Wachstum zu kontrollieren. OpenClaw beschneidet übergroße Werkzeugausgaben und komprimiert lange Gesprächsverläufe, während Claude Code die Ausgabe von Dateien begrenzt und Kontextverdichtung unterstützt. Diese Abhilfemaßnahmen funktionieren - allerdings erst, nachdem die aufgeblähte Abfrage bereits ausgeführt wurde. Die nicht bewerteten Suchergebnisse verbrauchen immer noch Token, und Sie haben immer noch dafür bezahlt. Die Kontextverwaltung hilft zukünftigen Abfragen, nicht dem ursprünglichen Aufruf, der die Verschwendung verursacht hat.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Wie der Speicher des KI-Agenten funktioniert und warum auch er Token kostet<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Suche ist nicht die einzige Quelle für den Token-Overhead. Jedes Stück Kontext, das ein Agent aus dem Speicher abruft, muss auch in das Kontextfenster des LLM geladen werden, und das kostet ebenfalls Token.</p>
<p>Die LLM-APIs, auf die sich die meisten Agenten heute verlassen, sind zustandslos: Die Nachrichten-API von Anthropic erfordert bei jeder Anfrage den vollständigen Gesprächsverlauf, und die Chat Completions-API von OpenAI arbeitet auf die gleiche Weise. Sogar die neuere zustandsabhängige API von OpenAI, die den Konversationsstatus serverseitig verwaltet, verlangt bei jedem Aufruf immer noch das vollständige Kontextfenster. Der in den Kontext geladene Speicher kostet Token, unabhängig davon, wie er dorthin gelangt.</p>
<p>Um dies zu umgehen, schreiben Agent-Frameworks Notizen in Dateien auf der Festplatte und laden relevante Notizen zurück in das Kontextfenster, wenn der Agent sie benötigt. OpenClaw zum Beispiel speichert kuratierte Notizen in MEMORY.md und hängt tägliche Protokolle an zeitgestempelte Markdown-Dateien an, die dann mit einer hybriden BM25- und Vektorsuche indiziert werden, damit der Agent bei Bedarf relevanten Kontext abrufen kann.</p>
<p>Das Speicherdesign von OpenClaw funktioniert gut, aber es erfordert das gesamte OpenClaw-Ökosystem: den Gateway-Prozess, die Verbindungen zur Messaging-Plattform und den Rest des Stacks. Das Gleiche gilt für den Speicher von Claude Code, der an seine CLI gebunden ist. Wenn Sie einen benutzerdefinierten Agenten außerhalb dieser Plattformen erstellen möchten, benötigen Sie eine eigenständige Lösung. Der nächste Abschnitt behandelt die Werkzeuge, die für beide Probleme zur Verfügung stehen.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Wie man OpenClaw davon abhält, Token zu verbrauchen<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie den Token-Verbrauch von OpenClaw reduzieren wollen, können Sie zwei Hebel in Bewegung setzen.</p>
<ul>
<li>Der erste ist eine <strong>bessere Abfrage</strong> - das Ersetzen von Schlüsselwort-Dumps im Grep-Stil durch bewertete, relevanzgesteuerte Suchwerkzeuge, damit das Modell nur die Informationen sieht, die wirklich wichtig sind.</li>
<li>Der zweite ist ein <strong>besserer Speicher</strong> - weg von undurchsichtigen, vom Framework abhängigen Speichern hin zu etwas, das Sie verstehen, überprüfen und kontrollieren können.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Ersetzen von grep durch besseres Retrieval: index1, QMD und Milvus</h3><p>Viele KI-Codieragenten durchsuchen Codebasen mit grep oder ripgrep. Claude Code hat ein eigenes Grep-Tool, das auf ripgrep aufbaut. OpenClaw hat kein eingebautes Tool für die Suche in Codebasen, aber sein exec-Tool lässt das zugrunde liegende Modell jeden Befehl ausführen, und Skills wie ripgrep oder QMD können geladen werden, um die Suche des Agenten zu steuern. Ohne einen auf die Suche ausgerichteten Skill greift der Agent auf den Ansatz zurück, den das zugrunde liegende Modell wählt. Das Kernproblem ist bei allen Agenten dasselbe: Ohne eine Rangfolge der Suchvorgänge gelangen die Schlüsselworttreffer ungefiltert in das Kontextfenster.</p>
<p>Das funktioniert, wenn ein Projekt so klein ist, dass jeder Treffer bequem in das Kontextfenster passt. Das Problem beginnt, wenn eine Codebasis oder Dokumentenbibliothek so groß wird, dass ein Schlüsselwort Dutzende oder Hunderte von Treffern liefert und der Agent sie alle in die Eingabeaufforderung laden muss. In dieser Größenordnung müssen die Ergebnisse nach Relevanz geordnet werden, nicht nur nach Übereinstimmung gefiltert.</p>
<p>Die Standardlösung ist die hybride Suche, die zwei sich ergänzende Bewertungsmethoden kombiniert:</p>
<ul>
<li>BM25 bewertet jedes Ergebnis danach, wie oft und wie eindeutig ein Begriff in einem bestimmten Dokument vorkommt. Eine fokussierte Datei, in der der Begriff "Authentifizierung" 15 Mal erwähnt wird, wird höher eingestuft als eine weitläufige Datei, in der er nur einmal erwähnt wird.</li>
<li>Die Vektorsuche wandelt Text in numerische Darstellungen der Bedeutung um, so dass "Authentifizierung" mit "Login-Flow" oder "Sitzungsmanagement" übereinstimmen kann, auch wenn sie keine Schlüsselwörter gemeinsam haben.</li>
</ul>
<p>Keine der beiden Methoden allein ist ausreichend: BM25 übersieht umschriebene Begriffe, und die Vektorsuche übersieht exakte Begriffe wie Fehlercodes. Die Kombination beider Methoden und die Zusammenführung der Ranglisten durch einen Fusionsalgorithmus deckt beide Lücken ab.</p>
<p>Die nachstehenden Tools setzen dieses Muster in unterschiedlichem Umfang um. Grep ist die Basis, mit der alle beginnen. index1, QMD und Milvus fügen jeweils eine hybride Suche mit steigender Kapazität hinzu.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: schnelle hybride Suche auf einem einzigen Rechner</h4><p><a href="https://github.com/gladego/index1">index1</a> ist ein CLI-Tool, das die hybride Suche in einer einzigen SQLite-Datenbankdatei zusammenfasst. FTS5 verarbeitet BM25, sqlite-vec verarbeitet Vektorähnlichkeit und RRF fusioniert die Ranglisten. Die Einbettungen werden lokal von Ollama generiert, so dass nichts Ihren Rechner verlässt.</p>
<p>index1 gliedert den Code nach Struktur, nicht nach Zeilenzahl: Markdown-Dateien werden nach Überschriften aufgeteilt, Python-Dateien nach AST, JavaScript und TypeScript nach Regex-Mustern. Das bedeutet, dass die Suchergebnisse zusammenhängende Einheiten wie eine vollständige Funktion oder einen kompletten Dokumentationsabschnitt zurückgeben und nicht beliebige Zeilenbereiche, die in der Mitte des Blocks abgeschnitten werden. Die Antwortzeit beträgt 40 bis 180 ms für hybride Abfragen. Ohne Ollama fällt die Suche auf BM25-only zurück, das immer noch eine Rangfolge der Ergebnisse erstellt, anstatt jede Übereinstimmung in das Kontextfenster zu übertragen.</p>
<p>index1 enthält auch ein episodisches Speichermodul, um gelernte Lektionen, Fehlerursachen und Architekturentscheidungen zu speichern. Diese Erinnerungen befinden sich in der gleichen SQLite-Datenbank wie der Code-Index und nicht als eigenständige Dateien.</p>
<p>Hinweis: index1 ist ein Projekt im Anfangsstadium (0 Sterne, 4 Commits im Februar 2026). Prüfen Sie es mit Ihrer eigenen Codebasis, bevor Sie es einsetzen.</p>
<ul>
<li><strong>Am besten geeignet für</strong>: Einzelentwickler oder kleine Teams mit einer Codebasis, die auf einen Rechner passt, und die eine schnelle Verbesserung gegenüber grep suchen.</li>
<li><strong>Erweitern Sie es, wenn</strong> Sie den Zugriff mehrerer Benutzer auf denselben Index benötigen oder Ihre Daten den Umfang einer einzelnen SQLite-Datei übersteigen.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: Höhere Genauigkeit durch lokale LLM-Neueinstufung</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), entwickelt vom Shopify-Gründer Tobi Lütke, fügt eine dritte Stufe hinzu: LLM-Re-Ranking. Nachdem BM25 und die Vektorsuche jeweils Kandidaten geliefert haben, liest ein lokales Sprachmodell die Top-Ergebnisse neu ein und ordnet sie nach ihrer tatsächlichen Relevanz für die Suchanfrage neu an. Auf diese Weise werden Fälle abgefangen, in denen sowohl Schlüsselwörter als auch semantische Übereinstimmungen plausible, aber falsche Ergebnisse liefern.</p>
<p>QMD läuft vollständig auf Ihrem Rechner unter Verwendung von drei GGUF-Modellen mit einer Gesamtgröße von etwa 2 GB: ein Einbettungsmodell (embeddinggemma-300M), ein Cross-Encoder-Reranker (Qwen3-Reranker-0.6B) und ein Abfrageerweiterungsmodell (qmd-query-expansion-1.7B). Alle drei werden beim ersten Durchlauf automatisch heruntergeladen. Keine Cloud-API-Aufrufe, keine API-Schlüssel.</p>
<p>Der Nachteil ist die Kaltstartzeit: Das Laden der drei Modelle von der Festplatte dauert etwa 15 bis 16 Sekunden. QMD unterstützt einen persistenten Servermodus (qmd mcp), der die Modelle zwischen den Abfragen im Speicher hält, wodurch die Kaltstartzeit bei wiederholten Abfragen entfällt.</p>
<ul>
<li><strong>Am besten geeignet für:</strong> datenschutzkritische Umgebungen, in denen keine Daten Ihren Rechner verlassen dürfen und in denen die Abfragegenauigkeit wichtiger ist als die Antwortzeit.</li>
<li><strong>Wachsen Sie über sich hinaus, wenn</strong> Sie Antworten im Bereich von weniger als einer Sekunde benötigen, einen gemeinsamen Zugriff im Team benötigen oder Ihr Datenbestand die Kapazität eines einzelnen Rechners übersteigt.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: Hybride Suche auf Team- und Unternehmensebene</h4><p>Die oben genannten Einzelmaschinen-Tools eignen sich gut für einzelne Entwickler, stoßen aber an ihre Grenzen, wenn mehrere Personen oder Agenten Zugriff auf dieselbe Wissensdatenbank benötigen. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> ist eine Open-Source-Vektordatenbank, die für diese nächste Stufe entwickelt wurde: verteilt, mit mehreren Benutzern und in der Lage, Milliarden von Vektoren zu verarbeiten.</p>
<p>Die Schlüsselfunktion für diesen Anwendungsfall ist das eingebaute Sparse-BM25, das seit Milvus 2.5 verfügbar ist und in 2.6 deutlich schneller ist. Sie stellen Rohtext zur Verfügung und Milvus tokenisiert ihn intern mit einem auf tantivy aufbauenden Analysator und konvertiert dann das Ergebnis in Sparse-Vektoren, die vorberechnet und zur Indexzeit gespeichert werden.</p>
<p>Da die BM25-Darstellung bereits gespeichert ist, müssen bei der Abfrage keine Punktwerte neu berechnet werden. Diese spärlichen Vektoren befinden sich neben den dichten Vektoren (semantische Einbettungen) in derselben Sammlung. Zum Zeitpunkt der Abfrage werden beide Signale mit einem Ranker wie RRFRanker fusioniert, den Milvus standardmäßig bereitstellt. Das gleiche hybride Suchmuster wie index1 und QMD, aber auf einer horizontal skalierbaren Infrastruktur.</p>
<p>Milvus bietet außerdem Funktionen, die Single-Machine-Tools nicht bieten können: Multi-Tenant-Isolation (separate Datenbanken oder Sammlungen pro Team), Datenreplikation mit automatischem Failover und Hot/Cold Data Tiering für kosteneffiziente Speicherung. Für Agenten bedeutet dies, dass mehrere Entwickler oder mehrere Agenteninstanzen gleichzeitig dieselbe Wissensdatenbank abfragen können, ohne auf die Daten der jeweils anderen zuzugreifen.</p>
<ul>
<li><strong>Am besten geeignet für</strong>: mehrere Entwickler oder Agenten, die sich eine Wissensdatenbank teilen, große oder schnell wachsende Dokumentensätze oder Produktionsumgebungen, die Replikation, Failover und Zugriffskontrolle benötigen.</li>
</ul>
<p>Zusammengefasst:</p>
<table>
<thead>
<tr><th>Werkzeug</th><th>Stufe</th><th>Bereitstellung</th><th>Migrationssignal</th></tr>
</thead>
<tbody>
<tr><td>Claude Native Grep</td><td>Prototyping</td><td>Eingebaut, keine Einrichtung</td><td>Rechnungen klettern oder Abfragen verlangsamen sich</td></tr>
<tr><td>index1</td><td>Ein-Maschinen-System (Geschwindigkeit)</td><td>Lokales SQLite + Ollama</td><td>Mehrbenutzerzugriff erforderlich oder Daten wachsen über einen Rechner hinaus</td></tr>
<tr><td>QMD</td><td>Einzelplatzrechner (Genauigkeit)</td><td>Drei lokale GGUF-Modelle</td><td>Gemeinsame Indizes für das Team erforderlich</td></tr>
<tr><td>Milvus</td><td>Team oder Produktion</td><td>Verteilter Cluster</td><td>Große Dokumentensätze oder Multi-Tenant-Anforderungen</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Reduzierung der Token-Kosten für KI-Agenten durch Bereitstellung eines dauerhaften, bearbeitbaren Speichers mit memsearch</h3><p>Die Suchoptimierung reduziert die Token-Verschwendung pro Abfrage, aber sie hilft nicht bei dem, was der Agent zwischen den Sitzungen speichert.</p>
<p>Jedes Stück Kontext, das ein Agent aus dem Speicher abruft, muss in die Eingabeaufforderung geladen werden, und auch das kostet Token. Die Frage ist nicht, ob Speicher gespeichert werden soll, sondern wie. Die Speichermethode bestimmt, ob Sie sehen können, was der Agent sich merkt, ob Sie es korrigieren können, wenn es falsch ist, und ob Sie es mitnehmen können, wenn Sie das Werkzeug wechseln.</p>
<p>Die meisten Frameworks versagen in allen drei Punkten. Mem0 und Zep speichern alles in einer Vektordatenbank, was für den Abruf funktioniert, aber den Speicher undurchsichtig macht:</p>
<ul>
<li><strong>Undurchsichtig.</strong> Man kann nicht sehen, was der Agent sich merkt, ohne eine API abzufragen.</li>
<li><strong>Schwer zu bearbeiten.</strong> Das Korrigieren oder Entfernen eines Speichers bedeutet API-Aufrufe, nicht das Öffnen einer Datei.</li>
<li><strong>Eingesperrt.</strong> Ein Wechsel des Frameworks bedeutet, dass Sie Ihre Daten exportieren, konvertieren und wieder importieren müssen.</li>
</ul>
<p>OpenClaw verfolgt einen anderen Ansatz. Der gesamte Speicher wird in einfachen Markdown-Dateien auf der Festplatte gespeichert. Der Agent schreibt automatisch tägliche Protokolle, und Menschen können jede Speicherdatei direkt öffnen und bearbeiten. Damit sind alle drei Probleme gelöst: Der Speicher ist lesbar, bearbeitbar und portabel.</p>
<p>Der Nachteil ist der Aufwand für die Bereitstellung. Das Ausführen des OpenClaw-Speichers bedeutet, dass das gesamte OpenClaw-Ökosystem ausgeführt wird: der Gateway-Prozess, die Verbindungen zur Messaging-Plattform und der Rest des Stacks. Für Teams, die bereits OpenClaw verwenden, ist das in Ordnung. Für alle anderen ist die Hürde zu hoch. <strong>memsearch</strong> wurde entwickelt, um diese Lücke zu schließen: es extrahiert OpenClaw's Markdown-first memory pattern in eine eigenständige Bibliothek, die mit jedem Agenten funktioniert.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, entwickelt von Zilliz (dem Team hinter Milvus), behandelt Markdown-Dateien als einzige Quelle der Wahrheit. Eine MEMORY.md enthält langfristige Fakten und Entscheidungen, die Sie von Hand schreiben. Tägliche Protokolle (2026-02-26.md) werden automatisch aus Sitzungszusammenfassungen erstellt. Der Vektorindex, der in Milvus gespeichert wird, ist eine abgeleitete Schicht, die jederzeit aus der Markdown-Datei neu erstellt werden kann.</p>
<p>In der Praxis bedeutet dies, dass Sie jede beliebige Speicherdatei in einem Texteditor öffnen, genau das lesen können, was der Agent weiß, und es ändern können. Speichern Sie die Datei, und der Datei-Überwacher von memsearch erkennt die Änderung und indiziert automatisch neu. Sie können Speicher mit Git verwalten, KI-generierte Speicher über Pull-Requests überprüfen oder durch Kopieren eines Ordners auf einen neuen Rechner verschieben. Wenn der Milvus-Index verloren geht, bauen Sie ihn aus den Dateien neu auf. Die Dateien sind nie in Gefahr.</p>
<p>Unter der Haube verwendet memsearch dasselbe hybride Suchmuster wie oben beschrieben: Chunks, die nach Überschriftenstruktur und Absatzgrenzen aufgeteilt sind, BM25 + Vektorabfrage und ein LLM-gestützter kompakter Befehl, der alte Erinnerungen zusammenfasst, wenn die Protokolle groß werden.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Am besten geeignet für: Teams, die vollen Einblick in das haben wollen, was der Agent sich merkt, die Versionskontrolle über den Speicher benötigen oder ein Speichersystem wollen, das nicht an ein einzelnes Agent-Framework gebunden ist.</p>
<p>Zusammengefasst:</p>
<table>
<thead>
<tr><th>Fähigkeit</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Quelle der Wahrheit</td><td>Vektordatenbank (einzige Datenquelle)</td><td>Markdown-Dateien (primär) + Milvus (Index)</td></tr>
<tr><td>Transparenz</td><td>Blackbox, erfordert API zur Überprüfung</td><td>Öffnen einer beliebigen .md-Datei zum Lesen</td></tr>
<tr><td>Bearbeitbarkeit</td><td>Ändern über API-Aufrufe</td><td>Direktes Bearbeiten in einem beliebigen Texteditor, automatische Neuindizierung</td></tr>
<tr><td>Versionskontrolle</td><td>Erfordert separate Protokollierung von Prüfungen</td><td>Git arbeitet nativ</td></tr>
<tr><td>Kosten der Migration</td><td>Exportieren → Format konvertieren → Re-Importieren</td><td>Kopieren des Markdown-Ordners</td></tr>
<tr><td>Mensch-KI-Zusammenarbeit</td><td>KI schreibt, Menschen beobachten</td><td>Menschen können bearbeiten, ergänzen und überprüfen</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Welches Setup passt zu Ihrem Maßstab?<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Szenario</th><th>Suche</th><th>Speicher</th><th>Wann man weitermachen sollte</th></tr>
</thead>
<tbody>
<tr><td>Früher Prototyp</td><td>Grep (eingebaut)</td><td>-</td><td>Rechnungen steigen oder Abfragen werden langsamer</td></tr>
<tr><td>Einzelner Entwickler, nur Suche</td><td><a href="https://github.com/gladego/index1">index1</a> (Geschwindigkeit) oder <a href="https://github.com/tobi/qmd">QMD</a> (Genauigkeit)</td><td>-</td><td>Mehrbenutzerzugriff erforderlich oder Daten wachsen über einen Rechner hinaus</td></tr>
<tr><td>Einzelner Entwickler, beide</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Benötigt Mehrbenutzer-Zugriff oder die Daten wachsen über einen Rechner hinaus</td></tr>
<tr><td>Team oder Produktion, beides</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>Schnelle Integration, nur Speicher</td><td>-</td><td>Mem0 oder Zep</td><td>Notwendigkeit, Speicher zu inspizieren, zu bearbeiten oder zu migrieren</td></tr>
</tbody>
</table>
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
    </button></h2><p>Die Token-Kosten, die mit ständig aktiven KI-Agenten einhergehen, sind nicht unvermeidlich. In diesem Leitfaden wurden zwei Bereiche behandelt, in denen bessere Werkzeuge die Verschwendung verringern können: Suche und Speicher.</p>
<p>Grep funktioniert in kleinem Maßstab, aber wenn die Codebasis wächst, überschwemmen nicht bewertete Schlüsselwortübereinstimmungen das Kontextfenster mit Inhalten, die das Modell nie gebraucht hat. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> und <a href="https://github.com/tobi/qmd"></a> QMD lösen dieses Problem auf einer einzigen Maschine, indem sie BM25-Schlüsselwortbewertung mit Vektorsuche kombinieren und nur die relevantesten Ergebnisse zurückgeben. Für Teams, Multi-Agenten-Setups oder Produktions-Workloads bietet <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> das gleiche hybride Suchmuster auf einer horizontal skalierbaren Infrastruktur.</p>
<p>Für den Speicher speichern die meisten Frameworks alles in einer Vektordatenbank: undurchsichtig, schwer von Hand zu bearbeiten und an das Framework gebunden, das sie erstellt hat. <a href="https://github.com/zilliztech/memsearch">memsearch</a> verfolgt einen anderen Ansatz. Der Speicher wird in einfachen Markdown-Dateien gespeichert, die Sie lesen, bearbeiten und mit Git versionskontrollieren können. Milvus dient als abgeleiteter Index, der jederzeit aus diesen Dateien neu erstellt werden kann. Sie behalten die Kontrolle darüber, was der Agent weiß.</p>
<p>Sowohl <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> als auch <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> sind Open Source. Wir entwickeln memsearch aktiv weiter und würden uns über Feedback von jedem freuen, der es in der Produktion einsetzt. Eröffnen Sie ein Issue, reichen Sie einen PR ein, oder sagen Sie uns einfach, was funktioniert und was nicht.</p>
<p>In diesem Leitfaden erwähnte Projekte:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Markdown-first memory für KI-Agenten, unterstützt von Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Open-Source-Vektordatenbank für skalierbare hybride Suche.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: BM25 + Vektor-Hybridsuche für KI-Codieragenten.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Lokale hybride Suche mit LLM-Neueinstufung.</li>
</ul>
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Wir haben das Speichersystem von OpenClaw extrahiert und als Open-Source angeboten (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Persistenter Speicher für Claude Code: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Anleitung: Verbindung zu Slack für lokalen KI-Assistenten</a></li>
</ul>
