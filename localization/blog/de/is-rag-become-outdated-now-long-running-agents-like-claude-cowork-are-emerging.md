---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: 'Ist die RAG überholt, jetzt, wo Langzeitagenten wie Claude Cowork auftauchen?'
author: Min Yin
date: 2026-1-27
desc: >-
  Eine eingehende Analyse des Langzeitspeichers von Claude Cowork, des
  beschreibbaren Agentenspeichers, der RAG-Kompromisse und warum
  Vektordatenbanken immer noch wichtig sind.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> ist eine neue Agentenfunktion in der Claude Desktop App. Aus der Sicht eines Entwicklers ist es im Grunde ein automatisierter Task-Runner, der das Modell umgibt: Es kann lokale Dateien lesen, ändern und erzeugen und es kann mehrstufige Aufgaben planen, ohne dass Sie manuell nach jedem Schritt fragen müssen. Stellen Sie sich dieselbe Schleife hinter Claude Code vor, nur eben auf dem Desktop und nicht auf dem Terminal.</p>
<p>Die wichtigste Fähigkeit von Cowork ist seine Fähigkeit, über längere Zeiträume zu laufen, ohne den Status zu verlieren. Es stößt nicht an die übliche Zeitüberschreitung der Konversation oder das Zurücksetzen des Kontexts. Es kann weiterarbeiten, Zwischenergebnisse verfolgen und frühere Informationen sitzungsübergreifend wiederverwenden. Das erweckt den Eindruck eines "Langzeitgedächtnisses", auch wenn die zugrunde liegende Mechanik eher ein dauerhafter Aufgabenstatus und eine kontextuelle Übertragung ist. In jedem Fall unterscheidet sich die Erfahrung von dem traditionellen Chat-Modell, bei dem alles zurückgesetzt wird, es sei denn, Sie bauen eine eigene Speicherschicht auf.</p>
<p>Dies wirft zwei praktische Fragen für Entwickler auf:</p>
<ol>
<li><p><strong>Wenn sich das Modell bereits an vergangene Informationen erinnern kann, wo passt dann noch RAG oder agentisches RAG hinein? Wird RAG ersetzt werden?</strong></p></li>
<li><p><strong>Wenn wir einen lokalen Agenten im Cowork-Stil wollen, wie implementieren wir dann selbst ein Langzeitgedächtnis?</strong></p></li>
</ol>
<p>Der Rest dieses Artikels geht auf diese Fragen im Detail ein und erklärt, wie Vektordatenbanken in diese neue "Modellgedächtnis"-Landschaft passen.</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG: Was ist der Unterschied?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie ich bereits erwähnt habe, ist Claude Cowork ein Agentenmodus innerhalb von Claude Desktop, der lokale Dateien lesen und schreiben, Aufgaben in kleinere Schritte aufteilen und ohne Statusverlust weiterarbeiten kann. Er behält seinen eigenen Arbeitskontext bei, so dass mehrstündige Aufgaben nicht wie eine normale Chatsitzung zurückgesetzt werden.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) löst ein anderes Problem: Es gibt einem Modell Zugang zu externem Wissen. Man indiziert seine Daten in einer Vektordatenbank, ruft für jede Abfrage relevante Teile ab und speist sie in das Modell ein. Diese Methode ist weit verbreitet, da sie LLM-Anwendungen eine Art "Langzeitgedächtnis" für Dokumente, Protokolle, Produktdaten und mehr bietet.</p>
<p>Wenn beide Systeme einem Modell helfen, sich zu "erinnern", was ist dann der eigentliche Unterschied?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Wie Cowork mit dem Speicher umgeht</h3><p>Der Speicher von Cowork ist ein Schreib-Lese-Speicher. Der Agent entscheidet, welche Informationen aus der aktuellen Aufgabe oder Konversation relevant sind, speichert sie als Speichereinträge und ruft sie später ab, wenn die Aufgabe fortschreitet. Dadurch kann Cowork die Kontinuität über lange laufende Arbeitsabläufe hinweg aufrechterhalten - insbesondere bei solchen, die im Verlauf neue Zwischenzustände erzeugen.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Wie RAG und Agentic RAG mit dem Speicher umgehen</h3><p>Standard-RAG ist ein abfragegesteuertes Retrieval: Der Benutzer stellt eine Frage, das System holt relevante Dokumente und das Modell verwendet diese, um zu antworten. Der Abfragekorpus bleibt stabil und versioniert, und die Entwickler kontrollieren genau, was in den Korpus eingeht.</p>
<p>Modernes agentenbasiertes RAG erweitert dieses Muster. Das Modell kann entscheiden, wann es Informationen abruft, was es abruft und wie es diese während der Planung oder Ausführung eines Arbeitsablaufs verwendet. Diese Systeme können lange Aufgaben ausführen und Werkzeuge aufrufen, ähnlich wie Cowork. Aber auch bei der agentenbasierten RAG bleibt die Abfrageschicht eher wissens- als zustandsorientiert. Der Agent ruft maßgebliche Fakten ab; er schreibt seinen sich entwickelnden Aufgabenzustand nicht in den Korpus zurück.</p>
<p>Man kann es auch anders sehen:</p>
<ul>
<li><p><strong>Das Gedächtnis von Cowork ist aufgabenorientiert:</strong> der Agent schreibt und liest seinen eigenen sich entwickelnden Zustand.</p></li>
<li><p><strong>RAG ist wissensgesteuert:</strong> Das System ruft etablierte Informationen ab, auf die sich das Modell stützen sollte.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Reverse-Engineering Claude Cowork: Wie es ein langlaufendes Agentengedächtnis aufbaut<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork wird viel gepriesen, weil es mehrstufige Aufgaben bewältigt, ohne ständig zu vergessen, was es gerade getan hat. Aus der Sicht eines Entwicklers frage ich mich, <strong>wie er den Status über so lange Sitzungen hinweg beibehält?</strong> Anthropic hat die Interna nicht veröffentlicht, aber auf der Grundlage früherer Entwicklungsexperimente mit dem Speichermodul von Claude können wir ein vernünftiges mentales Modell zusammensetzen.</p>
<p>Claude scheint sich auf einen hybriden Aufbau zu stützen: <strong>eine persistente Langzeitspeicherschicht und Tools zum Abrufen auf Abruf.</strong> Anstatt die gesamte Konversation in jede Anfrage zu packen, greift Claude nur dann selektiv auf vergangenen Kontext zurück, wenn es ihn für relevant hält. Auf diese Weise kann das Modell die Genauigkeit hoch halten, ohne jedes Mal die Token zu verbrauchen.</p>
<p>Wenn Sie die Struktur der Anfrage aufschlüsseln, sieht sie ungefähr so aus:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>Interessant ist nicht die Struktur selbst, sondern die Art und Weise, wie das Modell entscheidet, was zu aktualisieren ist und wann eine Abfrage durchgeführt werden soll.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">Benutzer-Speicher: Die persistente Schicht</h3><p>Claude verfügt über einen Langzeitspeicher, der mit der Zeit aktualisiert wird. Und im Gegensatz zum eher vorhersehbaren Speichersystem von ChatGPT fühlt sich Claude etwas "lebendiger" an. Es speichert Erinnerungen in XML-ähnlichen Blöcken und aktualisiert sie auf zwei Arten:</p>
<ul>
<li><p><strong>Implizite Aktualisierungen:</strong> Manchmal entscheidet das Modell einfach, dass etwas eine stabile Präferenz oder Tatsache ist und schreibt es stillschweigend in den Speicher. Diese Aktualisierungen erfolgen nicht sofort, sondern erst nach ein paar Runden, und ältere Erinnerungen können verblassen, wenn die zugehörige Unterhaltung verschwindet.</p></li>
<li><p><strong>Explizite Aktualisierungen:</strong> Mit dem Werkzeug <code translate="no">memory_user_edits</code> können die Benutzer den Speicher direkt verändern ("X merken", "Y vergessen"). Diese Schreibvorgänge erfolgen sofort und verhalten sich eher wie eine CRUD-Operation.</p></li>
</ul>
<p>Claude führt im Hintergrund Heuristiken aus, um zu entscheiden, was gespeichert werden soll, und wartet nicht auf explizite Anweisungen.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Abruf von Gesprächen: Der On-Demand-Teil</h3><p>Claude führt <em>keine</em> fortlaufende Zusammenfassung wie viele LLM-Systeme. Stattdessen verfügt es über eine Reihe von Abfragefunktionen, die es immer dann aufrufen kann, wenn es meint, dass ihm ein Kontext fehlt. Diese Abrufe erfolgen nicht bei jedem Zug - das Modell löst sie auf der Grundlage seiner eigenen internen Beurteilung aus.</p>
<p>Das herausragende Beispiel ist <code translate="no">conversation_search</code>. Wenn der Benutzer etwas Vages wie "das Projekt vom letzten Monat" sagt, ruft Claude oft dieses Tool auf, um relevante Züge auszugraben. Bemerkenswert ist, dass es auch dann funktioniert, wenn die Formulierung zweideutig oder in einer anderen Sprache ist. Das deutet ziemlich klar darauf hin:</p>
<ul>
<li><p>Eine Art semantischer Abgleich (Einbettung)</p></li>
<li><p>Wahrscheinlich kombiniert mit Normalisierung oder leichter Übersetzung</p></li>
<li><p>Schlüsselwortsuche für mehr Präzision</p></li>
</ul>
<p>Im Grunde sieht dies sehr nach einem Miniatur-RAG-System aus, das in das Toolset des Modells integriert ist.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Wie sich das Abrufverhalten von Claude von einfachen Verlaufspuffern unterscheidet</h3><p>Aus den Tests und Protokollen gehen einige Muster hervor:</p>
<ul>
<li><p><strong>Der Abruf erfolgt nicht automatisch.</strong> Das Modell entscheidet selbst, wann es ihn aufruft. Wenn es der Meinung ist, dass es bereits über genügend Kontext verfügt, macht es sich gar nicht erst die Mühe.</p></li>
<li><p><strong>Die abgerufenen Chunks enthalten</strong> <em>sowohl</em> <strong>Benutzer- als auch Assistentennachrichten.</strong> Das ist nützlich - es bleiben mehr Nuancen erhalten als bei reinen Benutzerzusammenfassungen.</p></li>
<li><p><strong>Die Verwendung von Token bleibt überschaubar.</strong> Da der Verlauf nicht jedes Mal neu eingegeben wird, werden lange Sitzungen nicht unvorhersehbar aufgebläht.</p></li>
</ul>
<p>Alles in allem fühlt es sich an wie ein LLM mit Abfrageerweiterung, nur dass die Abfrage als Teil der eigenen Argumentationsschleife des Modells erfolgt.</p>
<p>Diese Architektur ist clever, aber nicht kostenlos:</p>
<ul>
<li><p>Die Abfrage bringt zusätzliche Latenzzeiten und mehr "bewegliche Teile" mit sich (Indizierung, Einstufung, Neueinstufung).</p></li>
<li><p>Das Modell schätzt gelegentlich falsch ein, ob es Kontext benötigt, was bedeutet, dass Sie die klassische "LLM-Vergesslichkeit" erleben, obwohl die Daten verfügbar <em>waren</em>.</p></li>
<li><p>Die Fehlersuche wird schwieriger, weil das Verhalten des Modells von unsichtbaren Werkzeugauslösern abhängt, nicht nur von Eingaben.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork vs. Claude Codex im Umgang mit dem Langzeitgedächtnis</h3><p>Im Gegensatz zu Claudes abruflastigem Aufbau geht ChatGPT viel strukturierter und vorhersehbarer mit dem Speicher um. Anstatt semantische Lookups durchzuführen oder alte Konversationen wie einen Mini-Vektorspeicher zu behandeln, injiziert ChatGPT Speicher direkt in jede Sitzung durch die folgenden Komponenten:</p>
<ul>
<li><p>Benutzer-Speicher</p></li>
<li><p>Sitzungs-Metadaten</p></li>
<li><p>Aktuelle Sitzungsnachrichten</p></li>
</ul>
<p><strong>Benutzer-Speicher</strong></p>
<p>Der Benutzerspeicher ist die wichtigste langfristige Speicherschicht - der Teil, der über Sitzungen hinweg bestehen bleibt und vom Benutzer bearbeitet werden kann. Er speichert ziemlich standardmäßige Dinge: Name, Hintergrund, laufende Projekte, Lernpräferenzen und dergleichen. Jede neue Konversation bekommt diesen Block zu Beginn injiziert, so dass das Modell immer mit einer konsistenten Ansicht des Benutzers beginnt.</p>
<p>ChatGPT aktualisiert diese Schicht auf zwei Arten:</p>
<ul>
<li><p><strong>Explizite Aktualisierungen:</strong> Benutzer können dem Modell sagen, dass es sich dies merken" oder das vergessen" soll, und der Speicher ändert sich sofort. Dies ist im Grunde eine CRUD-API, die das Modell durch natürliche Sprache offenlegt.</p></li>
<li><p><strong>Implizite Aktualisierungen:</strong> Wenn das Modell Informationen findet, die den OpenAI-Regeln für das Langzeitgedächtnis entsprechen, wie z. B. eine Berufsbezeichnung oder eine Vorliebe, und der Benutzer den Speicher nicht deaktiviert hat, fügt es diese von selbst hinzu.</p></li>
</ul>
<p>Aus der Sicht des Entwicklers ist diese Schicht einfach, deterministisch und leicht zu durchschauen. Kein Einbetten von Suchvorgängen, keine Heuristik darüber, was zu holen ist.</p>
<p><strong>Sitzungs-Metadaten</strong></p>
<p>Sitzungsmetadaten befinden sich am anderen Ende des Spektrums. Sie sind kurzlebig, nicht persistent und werden nur einmal zu Beginn einer Sitzung eingefügt. Man kann sie sich als Umgebungsvariablen für die Konversation vorstellen. Dazu gehören Dinge wie:</p>
<ul>
<li><p>das Gerät, auf dem Sie sich befinden</p></li>
<li><p>Konto-/Abonnementstatus</p></li>
<li><p>grobe Nutzungsmuster (aktive Tage, Modellverteilung, durchschnittliche Gesprächslänge)</p></li>
</ul>
<p>Mithilfe dieser Metadaten kann das Modell die Antworten an die aktuelle Umgebung anpassen, z. B. kürzere Antworten auf dem Handy schreiben, ohne den Langzeitspeicher zu belasten.</p>
<p><strong>Aktuelle Sitzungsnachrichten</strong></p>
<p>Dies ist der Standardverlauf mit gleitendem Fenster: alle Nachrichten in der aktuellen Konversation, bis das Token-Limit erreicht ist. Wenn das Fenster zu groß wird, werden ältere Nachrichten automatisch gelöscht.</p>
<p>Entscheidend ist, dass dieser Vorgang <strong>weder</strong> den Benutzerspeicher noch sitzungsübergreifende Zusammenfassungen betrifft. Nur der lokale Gesprächsverlauf schrumpft.</p>
<p>Die größte Abweichung von Claude besteht darin, wie ChatGPT mit "kürzlich geführten, aber nicht aktuellen" Unterhaltungen umgeht. Claude ruft ein Suchwerkzeug auf, um vergangenen Kontext abzurufen, wenn es ihn für relevant hält. ChatGPT macht das nicht.</p>
<p>Stattdessen speichert ChatGPT eine sehr leichtgewichtige <strong>, sitzungsübergreifende Zusammenfassung</strong>, die in jede Unterhaltung eingefügt wird. Ein paar wichtige Details zu dieser Schicht:</p>
<ul>
<li><p>Sie fasst <strong>nur Benutzernachrichten</strong> zusammen, nicht die Nachrichten von Assistenten.</p></li>
<li><p>Sie speichert eine sehr kleine Menge von Elementen - ungefähr 15 - gerade genug, um stabile Themen oder Interessen zu erfassen.</p></li>
<li><p>Sie führt <strong>keine Einbettungsberechnungen, keine Ähnlichkeitsbewertung und keine Abrufe</strong> durch. Es handelt sich im Grunde um vorgekauten Kontext, nicht um dynamisches Nachschlagen.</p></li>
</ul>
<p>Aus technischer Sicht wird bei diesem Ansatz Flexibilität gegen Vorhersagbarkeit getauscht. Es gibt kein Risiko eines seltsamen Abruffehlers, und die Latenzzeit für die Inferenz bleibt stabil, da nichts spontan abgerufen wird. Der Nachteil ist, dass ChatGPT keine zufällige Nachricht von vor sechs Monaten abruft, wenn sie es nicht in die Zusammenfassungsschicht geschafft hat.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Herausforderungen bei der Beschreibbarkeit des Agentenspeichers<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn ein Agent von einem <strong>Nur-Lese-Speicher</strong> (typisch RAG) zu einem <strong>beschreibbaren Speicher</strong>wechselt <strong>, in dem</strong>er Benutzeraktionen, Entscheidungen und Einstellungen protokollieren kann, steigt die Komplexität schnell an. Es geht nicht mehr nur um das Abrufen von Dokumenten, sondern um die Aufrechterhaltung eines wachsenden Zustands, von dem das Modell abhängt.</p>
<p>Ein System mit beschreibbarem Speicher muss drei echte Probleme lösen:</p>
<ol>
<li><p><strong>Was soll gespeichert werden:</strong> Der Agent braucht Regeln, um zu entscheiden, welche Ereignisse, Präferenzen oder Beobachtungen es wert sind, gespeichert zu werden. Ohne dies explodiert der Speicher entweder in seiner Größe oder füllt sich mit Rauschen.</p></li>
<li><p><strong>Wie wird der Speicher gespeichert und geordnet:</strong> Nicht alle Erinnerungen sind gleich. Aktuelle Elemente, langfristige Fakten und flüchtige Notizen benötigen unterschiedliche Speicherebenen, Aufbewahrungsrichtlinien und Indizierungsstrategien.</p></li>
<li><p><strong>Wie man schnell schreibt, ohne den Abruf zu beeinträchtigen:</strong> Der Speicher muss kontinuierlich beschrieben werden, aber häufige Aktualisierungen können die Qualität des Index beeinträchtigen oder Abfragen verlangsamen, wenn das System nicht für einen hohen Durchsatz an Einfügungen ausgelegt ist.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Herausforderung 1: Was ist es wert, gespeichert zu werden?</h3><p>Nicht alles, was ein Benutzer tut, sollte im Langzeitspeicher landen. Wenn jemand eine temporäre Datei anlegt und sie fünf Minuten später wieder löscht, nützt es niemandem, dies für immer zu speichern. Hier liegt das Kernproblem: <strong>Wie entscheidet das System, was wirklich wichtig ist?</strong></p>
<p><strong>(1) Übliche Methoden zur Beurteilung der Wichtigkeit</strong></p>
<p>Teams verlassen sich in der Regel auf eine Mischung von Heuristiken:</p>
<ul>
<li><p><strong>Zeitbasiert</strong>: neuere Aktionen sind wichtiger als ältere</p></li>
<li><p><strong>Frequenzbasiert</strong>: Dateien oder Aktionen, auf die wiederholt zugegriffen wird, sind wichtiger</p></li>
<li><p><strong>Typbasiert</strong>: Einige Objekte sind von Natur aus wichtiger (z. B. Projektkonfigurationsdateien gegenüber Cache-Dateien)</p></li>
</ul>
<p><strong>(2) Wenn Regeln kollidieren</strong></p>
<p>Diese Signale widersprechen sich oft. Eine Datei, die letzte Woche erstellt, aber heute stark bearbeitet wurde - sollte das Alter oder die Aktivität den Ausschlag geben? Es gibt keine einzige "richtige" Antwort, weshalb die Bewertung der Wichtigkeit schnell unübersichtlich werden kann.</p>
<p><strong>(3) Wie Vektordatenbanken helfen</strong></p>
<p>Vektordatenbanken bieten Ihnen Mechanismen zur Durchsetzung von Wichtigkeitsregeln ohne manuelle Bereinigung:</p>
<ul>
<li><p><strong>TTL:</strong> Milvus kann Daten nach einer bestimmten Zeit automatisch entfernen</p></li>
<li><p><strong>Verfall:</strong> Ältere Vektoren können herabgewichtet werden, so dass sie auf natürliche Weise aus dem Abruf verschwinden.</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Herausforderung 2: Speicher-Tiering in der Praxis</h3><p>Wenn Agenten länger laufen, stapelt sich der Speicher. Es ist nicht nachhaltig, alles im schnellen Speicher zu halten, also braucht das System eine Möglichkeit, den Speicher in <strong>heiße</strong> (häufige Zugriffe) und <strong>kalte</strong> (seltene Zugriffe) Ebenen aufzuteilen.</p>
<p><strong>(1) Entscheiden, wann der Speicher kalt wird</strong></p>
<p>In diesem Modell bezieht sich <em>"heißer" Speicher</em> auf Daten, die für einen Zugriff mit geringer Latenz im RAM gehalten werden, während <em>"kalter" Speicher</em> sich auf Daten bezieht, die zur Kostenreduzierung auf die Festplatte oder den Objektspeicher verschoben werden.</p>
<p>Die Entscheidung, wann der Speicher kalt wird, kann auf unterschiedliche Weise getroffen werden. Einige Systeme verwenden leichtgewichtige Modelle, um die semantische Bedeutung einer Aktion oder Datei auf der Grundlage ihrer Bedeutung und jüngsten Verwendung zu schätzen. Andere verlassen sich auf eine einfache, regelbasierte Logik, wie z. B. das Verschieben von Speicher, auf den seit 30 Tagen nicht mehr zugegriffen wurde oder der seit einer Woche nicht mehr in den Abfrageergebnissen auftaucht. Die Benutzer können auch bestimmte Dateien oder Aktionen explizit als wichtig markieren, um sicherzustellen, dass sie immer heiß bleiben.</p>
<p><strong>(2) Wo werden heißer und kalter Speicher gespeichert?</strong></p>
<p>Einmal klassifiziert, werden heißer und kalter Speicher unterschiedlich gespeichert. Der heiße Speicher verbleibt im Arbeitsspeicher und wird für Inhalte verwendet, auf die häufig zugegriffen wird, wie z. B. den aktiven Aufgabenkontext oder die letzten Benutzeraktionen. Der kalte Speicher wird auf die Festplatte oder in Objektspeichersysteme wie S3 verlagert, wo der Zugriff zwar langsamer ist, aber die Speicherkosten viel niedriger sind. Dieser Kompromiss funktioniert gut, da der kalte Speicher nur selten benötigt wird und der Zugriff in der Regel nur für langfristige Referenzen erfolgt.</p>
<p><strong>(3) Wie Vektordatenbanken helfen</strong></p>
<p><strong>Milvus und Zilliz Cloud</strong> unterstützen dieses Muster, indem sie Hot-Cold-Tiered-Storage ermöglichen und dabei eine einzige Abfrageoberfläche beibehalten, so dass Vektoren, auf die häufig zugegriffen wird, im Speicher verbleiben und ältere Daten automatisch in kostengünstigeren Speicher verschoben werden.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Herausforderung 3: Wie schnell sollte der Speicher beschrieben werden?</h3><p>Herkömmliche RAG-Systeme schreiben Daten normalerweise in Stapeln. Indizes werden offline - oft über Nacht - neu aufgebaut und sind erst später durchsuchbar. Dieser Ansatz funktioniert für statische Wissensdatenbanken, ist aber für den Agentenspeicher nicht geeignet.</p>
<p><strong>(1) Warum der Agentenspeicher Echtzeit-Schreibvorgänge benötigt</strong></p>
<p>Der Agentenspeicher muss Benutzeraktionen erfassen, sobald sie geschehen. Wenn eine Aktion nicht sofort aufgezeichnet wird, kann es sein, dass bei der nächsten Konversationsrunde der entscheidende Kontext fehlt. Aus diesem Grund benötigen beschreibbare Speichersysteme Echtzeit-Schreibvorgänge und keine verzögerten Offline-Aktualisierungen.</p>
<p><strong>(2) Das Spannungsverhältnis zwischen Schreibgeschwindigkeit und Abrufqualität</strong></p>
<p>Echtzeitspeicher erfordern eine sehr geringe Schreiblatenz. Gleichzeitig hängt die Qualität des Abrufs von gut aufgebauten Indizes ab, und der Aufbau von Indizes braucht Zeit. Der Neuaufbau eines Index bei jedem Schreibvorgang ist zu teuer, aber eine Verzögerung der Indexierung bedeutet, dass neu geschriebene Daten für den Abruf vorübergehend unsichtbar bleiben. Dieser Kompromiss steht im Mittelpunkt des Designs von beschreibbarem Speicher.</p>
<p><strong>(3) Wie Vektordatenbanken helfen</strong></p>
<p>Vektordatenbanken lösen dieses Problem, indem sie das Schreiben von der Indizierung entkoppeln. Eine gängige Lösung besteht darin, Schreibvorgänge zu streamen und einen inkrementellen Indexaufbau durchzuführen. Am Beispiel von <strong>Milvus</strong> werden neue Daten zunächst in einen speicherinternen Puffer geschrieben, so dass das System hochfrequente Schreibvorgänge effizient verarbeiten kann. Noch bevor ein vollständiger Index erstellt ist, können gepufferte Daten innerhalb von Sekunden durch dynamische Zusammenführung oder ungefähre Suche abgefragt werden.</p>
<p>Wenn der Puffer einen vordefinierten Schwellenwert erreicht, baut das System Indizes in Stapeln auf und speichert sie. Dadurch wird die langfristige Abrufleistung verbessert, ohne dass Echtzeit-Schreibvorgänge blockiert werden. Durch die Trennung von schneller Ingestion und langsamer Indexerstellung erreicht Milvus ein praktisches Gleichgewicht zwischen Schreibgeschwindigkeit und Suchqualität, das für den Agentenspeicher gut geeignet ist.</p>
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
    </button></h2><p>Cowork gibt uns einen Einblick in eine neue Klasse von Agenten - persistent, zustandsorientiert und in der Lage, Kontext über lange Zeiträume hinweg zu speichern. Aber es macht auch etwas anderes deutlich: Das Langzeitgedächtnis ist nur die Hälfte des Bildes. Um produktionsreife Agenten zu entwickeln, die sowohl autonom als auch zuverlässig sind, brauchen wir immer noch eine strukturierte Suche in großen, sich entwickelnden Wissensdatenbanken.</p>
<p>RAG verwaltet die Fakten der Welt; beschreibbarer Speicher verwaltet den internen Zustand des Agenten. Vektordatenbanken sitzen an der Schnittstelle und bieten Indizierung, hybride Suche und skalierbaren Speicher, so dass beide Ebenen zusammenarbeiten können.</p>
<p>Mit der weiteren Reifung von Langzeitagenten werden sich ihre Architekturen wahrscheinlich diesem hybriden Design annähern. Cowork ist ein deutliches Signal dafür, wohin sich die Dinge entwickeln - nicht in Richtung einer Welt ohne RAG, sondern in Richtung von Agenten mit reichhaltigeren Speicherstapeln, die von darunter liegenden Vektordatenbanken unterstützt werden.</p>
<p>Wenn Sie diese Ideen erforschen oder Hilfe bei Ihrer eigenen Einrichtung erhalten möchten, <strong>treten Sie unserem</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei, um mit Milvus-Ingenieuren zu chatten. Und wenn Sie mehr praktische Hilfe benötigen, können Sie jederzeit <strong>eine</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus-Sprechstunde</strong></a> <strong>buchen</strong> <strong>.</strong></p>
