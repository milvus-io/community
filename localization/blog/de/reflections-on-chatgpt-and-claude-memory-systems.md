---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Überlegungen zu ChatGPT und Claude's Memory Systems: Was es braucht, um den
  Abruf von Konversationen auf Abruf zu ermöglichen
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Erfahren Sie, wie ChatGPT und Claude den Speicher anders gestalten, warum die
  Abfrage von Gesprächen auf Abruf schwierig ist und wie Milvus 2.6 dies im
  Produktionsmaßstab ermöglicht.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>Bei hochwertigen KI-Agenten-Systemen ist die Gestaltung des Speichers weitaus komplexer, als es zunächst scheint. Im Kern geht es um die Beantwortung von drei grundlegenden Fragen: Wie soll der Gesprächsverlauf gespeichert werden? Wann soll der vergangene Kontext abgerufen werden? Und was genau soll abgerufen werden?</p>
<p>Diese Entscheidungen wirken sich direkt auf die Reaktionszeit, die Ressourcennutzung und letztlich auf die maximale Leistungsfähigkeit eines Agenten aus.</p>
<p>Modelle wie ChatGPT und Claude werden immer "gedächtnisbewusster", je mehr wir sie einsetzen. Sie merken sich Präferenzen, passen sich an langfristige Ziele an und behalten die Kontinuität über Sitzungen hinweg bei. In diesem Sinne funktionieren sie bereits wie Mini-KI-Agenten. Unter der Oberfläche jedoch basieren ihre Speichersysteme auf sehr unterschiedlichen architektonischen Annahmen.</p>
<p>Jüngste Reverse-Engineering-Analysen der <a href="https://manthanguptaa.in/posts/claude_memory/">Speichermechanismen</a> von <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>und <a href="https://manthanguptaa.in/posts/claude_memory/">Claude</a> zeigen einen deutlichen Unterschied. <strong>ChatGPT</strong> verlässt sich auf vorberechnete Kontextinjektion und Layered Caching, um eine leichtgewichtige, vorhersehbare Kontinuität zu gewährleisten. <strong>Claude</strong> hingegen verwendet RAG-ähnliche On-Demand-Abrufe mit dynamischen Speicheraktualisierungen, um ein Gleichgewicht zwischen Speichertiefe und Effizienz herzustellen.</p>
<p>Bei diesen beiden Ansätzen handelt es sich nicht nur um Designvorlieben, sondern auch um die Möglichkeiten der Infrastruktur. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a> führt die Kombination aus hybridem Dense-parse Retrieval, effizienter skalarer Filterung und abgestuftem Speicher ein, die für On-Demand-Conversational-Memory erforderlich ist, wodurch das selektive Retrieval schnell und wirtschaftlich genug ist, um in realen Systemen eingesetzt zu werden.</p>
<p>In diesem Beitrag gehen wir darauf ein, wie die Speichersysteme von ChatGPT und Claude tatsächlich funktionieren, warum sie sich architektonisch unterschieden haben und wie die jüngsten Fortschritte in Systemen wie Milvus die Abfrage von Konversationen auf Abruf in großem Maßstab praktisch machen.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">ChatGPTs Speichersystem<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Anstatt eine Vektordatenbank abzufragen oder vergangene Unterhaltungen dynamisch abzurufen, baut ChatGPT sein "Gedächtnis" auf, indem es einen festen Satz von Kontextkomponenten zusammenstellt und sie direkt in jede Eingabeaufforderung einfügt. Jede Komponente wird im Voraus vorbereitet und nimmt eine bekannte Position im Prompt ein.</p>
<p>Durch dieses Design bleiben die Personalisierung und die Kontinuität der Konversation erhalten, während die Latenzzeit, die Verwendung von Token und das Systemverhalten besser vorhersehbar sind. Mit anderen Worten: Speicher ist nicht etwas, das das Modell spontan sucht, sondern etwas, das das System verpackt und dem Modell jedes Mal zur Verfügung stellt, wenn es eine Antwort erzeugt.</p>
<p>Im Großen und Ganzen besteht eine vollständige ChatGPT-Eingabeaufforderung aus den folgenden Schichten, geordnet von der globalsten zur unmittelbarsten:</p>
<p>[0] Systemanweisungen</p>
<p>[1] Anweisungen für Entwickler</p>
<p>[2] Sitzungs-Metadaten (kurzlebig)</p>
<p>[3] Benutzerspeicher (langfristige Fakten)</p>
<p>[4] Recent Conversations Summary (vergangene Chats, Titel + Ausschnitte)</p>
<p>[5] Aktuelle Sitzungsnachrichten (dieser Chat)</p>
<p>[6] Ihre letzte Nachricht</p>
<p>Die Komponenten [2] bis [5] bilden das effektive Gedächtnis des Systems und erfüllen jeweils eine bestimmte Funktion.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Sitzungs-Metadaten</h3><p>Sitzungs-Metadaten sind kurzlebige, nicht-persistente Informationen, die einmal zu Beginn einer Konversation eingefügt und nach Beendigung der Sitzung verworfen werden. Ihre Aufgabe ist es, das Modell an den aktuellen Nutzungskontext anzupassen und nicht, das Verhalten langfristig zu personalisieren.</p>
<p>Diese Schicht erfasst Signale über die unmittelbare Umgebung des Benutzers und seine jüngsten Nutzungsmuster. Typische Signale sind:</p>
<ul>
<li><p><strong>Geräteinformationen</strong> - z. B. ob der Benutzer ein Mobiltelefon oder einen Desktop benutzt</p></li>
<li><p><strong>Kontoattribute</strong> - wie die Abonnementstufe (z. B. ChatGPT Go), das Alter des Kontos und die allgemeine Nutzungshäufigkeit</p></li>
<li><p><strong>Verhaltensmetriken</strong> - einschließlich aktiver Tage in den letzten 1, 7 und 30 Tagen, durchschnittliche Gesprächslänge und Modellnutzungsverteilung (z. B. 49 % der Anfragen wurden von GPT-5 bearbeitet)</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Benutzerspeicher</h3><p>Der Benutzerspeicher ist die dauerhafte, bearbeitbare Speicherschicht, die eine Personalisierung über Konversationen hinweg ermöglicht. Sie speichert relativ stabile Informationen - wie den Namen des Benutzers, seine Rolle oder Karriereziele, laufende Projekte, frühere Ergebnisse und Lernpräferenzen - und wird in jede neue Konversation eingefügt, um die Kontinuität über die Zeit zu wahren.</p>
<p>Dieser Speicher kann auf zwei Arten aktualisiert werden:</p>
<ul>
<li><p><strong>Explizite Aktualisierungen</strong> erfolgen, wenn die Benutzer den Speicher direkt mit Anweisungen wie "merke dir das" oder "lösche das aus dem Speicher" verwalten.</p></li>
<li><p><strong>Implizite Aktualisierungen</strong> erfolgen, wenn das System Informationen identifiziert, die den Speicherkriterien von OpenAI entsprechen - wie z. B. ein bestätigter Name oder eine Berufsbezeichnung - und diese automatisch speichert, vorbehaltlich der standardmäßigen Zustimmung und Speichereinstellungen des Benutzers.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Zusammenfassung der letzten Konversation</h3><p>Die Zusammenfassung der letzten Konversation ist eine leichtgewichtige, sitzungsübergreifende Kontextebene, die die Kontinuität bewahrt, ohne den gesamten Chatverlauf erneut abzuspielen oder abzurufen. Anstatt sich auf einen dynamischen Abruf zu verlassen, wie es bei traditionellen RAG-basierten Ansätzen der Fall ist, wird diese Zusammenfassung vorberechnet und direkt in jede neue Unterhaltung eingefügt.</p>
<p>Diese Schicht fasst nur Nutzernachrichten zusammen, ohne die Antworten der Assistenten. Ihre Größe ist absichtlich begrenzt - typischerweise etwa 15 Einträge - und sie enthält nur hochrangige Signale über aktuelle Interessen, nicht aber detaillierte Inhalte. Da sie sich nicht auf Einbettungen oder Ähnlichkeitssuche stützt, hält sie sowohl die Latenzzeit als auch den Token-Verbrauch niedrig.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Aktuelle Sitzungsnachrichten</h3><p>Aktuelle Sitzungsnachrichten enthalten den vollständigen Nachrichtenverlauf der laufenden Konversation und liefern den kurzfristigen Kontext, der für kohärente Turn-by-Turn-Antworten erforderlich ist. Diese Schicht umfasst sowohl Benutzereingaben als auch Antworten des Assistenten, jedoch nur solange die Sitzung aktiv ist.</p>
<p>Da das Modell mit einem festen Token-Limit arbeitet, kann dieser Verlauf nicht unbegrenzt wachsen. Wenn das Limit erreicht ist, lässt das System die ältesten Nachrichten fallen, um Platz für neuere zu schaffen. Diese Kürzung wirkt sich nur auf die aktuelle Sitzung aus: Das Langzeitgedächtnis des Benutzers und die Zusammenfassung der letzten Unterhaltung bleiben intakt.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">Das Speichersystem von Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude verfolgt einen anderen Ansatz bei der Speicherverwaltung. Anstatt ein großes, festes Bündel von Speicherkomponenten in jede Eingabeaufforderung einzubauen - wie es ChatGPT tut -, kombiniert Claude persistenten Benutzerspeicher mit On-Demand-Tools und selektivem Abruf. Historischer Kontext wird nur dann abgerufen, wenn das Modell ihn als relevant erachtet, so dass das System die Tiefe des Kontexts gegen die Rechenkosten abwägen kann.</p>
<p>Der Prompt-Kontext von Claude ist wie folgt strukturiert:</p>
<p>[0] System-Eingabeaufforderung (statische Anweisungen)</p>
<p>[1] Benutzererinnerungen</p>
<p>[2] Konversationsverlauf</p>
<p>[3] Aktuelle Nachricht</p>
<p>Die Hauptunterschiede zwischen Claude und ChatGPT liegen in der <strong>Art und Weise, wie der Gesprächsverlauf abgerufen wird</strong> und <strong>wie der Benutzerspeicher aktualisiert und gepflegt wird</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Benutzererinnerungen</h3><p>In Claude bilden die Benutzerspeicher eine langfristige Kontextebene, die dem Benutzergedächtnis von ChatGPT ähnelt, aber stärker auf automatische, im Hintergrund ablaufende Aktualisierungen ausgerichtet ist. Diese Erinnerungen werden in einem strukturierten Format (in XML-ähnlichen Tags) gespeichert und sind so konzipiert, dass sie sich im Laufe der Zeit mit minimalem Benutzereingriff weiterentwickeln.</p>
<p>Claude unterstützt zwei Aktualisierungspfade:</p>
<ul>
<li><p><strong>Implizite Aktualisierungen</strong> - Das System analysiert regelmäßig den Gesprächsinhalt und aktualisiert den Speicher im Hintergrund. Diese Aktualisierungen werden nicht in Echtzeit durchgeführt, und die mit gelöschten Konversationen verbundenen Speicher werden im Rahmen der laufenden Optimierung nach und nach entfernt.</p></li>
<li><p><strong>Explizite Aktualisierungen</strong> - Benutzer können den Speicher direkt über Befehle wie "dies merken" oder "dies löschen" verwalten, die über ein spezielles Tool <code translate="no">memory_user_edits</code> ausgeführt werden.</p></li>
</ul>
<p>Im Vergleich zu ChatGPT überträgt Claude dem System selbst mehr Verantwortung für die Verfeinerung, Aktualisierung und Bereinigung des Langzeitgedächtnisses. Dies reduziert die Notwendigkeit für die Benutzer, aktiv zu kuratieren, was gespeichert wird.</p>
<h3 id="Conversation-History" class="common-anchor-header">Konversationsverlauf</h3><p>Für den Gesprächsverlauf verlässt sich Claude nicht auf eine feste Zusammenfassung, die bei jedem Prompt eingeblendet wird. Stattdessen werden vergangene Kontexte nur dann abgerufen, wenn das Modell dies für notwendig erachtet, wobei drei verschiedene Mechanismen zum Einsatz kommen. Auf diese Weise wird vermieden, dass irrelevante Vorgänge mitgeschleppt werden, und die Verwendung von Token bleibt unter Kontrolle.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Komponente</strong></th><th style="text-align:center"><strong>Zweck</strong></th><th style="text-align:center"><strong>Wie sie verwendet wird</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Rolling Window (Aktuelle Konversation)</strong></td><td style="text-align:center">Speichert den vollständigen Nachrichtenverlauf der aktuellen Konversation (keine Zusammenfassung), ähnlich wie der Sitzungskontext von ChatGPT</td><td style="text-align:center">Wird automatisch eingespeist. Token-Limit ist ~190K; ältere Nachrichten werden verworfen, sobald das Limit erreicht ist</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>Werkzeug</strong></td><td style="text-align:center">Durchsucht vergangene Unterhaltungen nach Themen oder Schlüsselwörtern und liefert Links zu Unterhaltungen, Titel und Auszüge von Benutzer-/Assistentennachrichten</td><td style="text-align:center">Wird ausgelöst, wenn das Modell feststellt, dass historische Details benötigt werden. Zu den Parametern gehören <code translate="no">query</code> (Suchbegriffe) und <code translate="no">max_results</code> (1-10)</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>Werkzeug</strong></td><td style="text-align:center">Ruft die jüngsten Unterhaltungen innerhalb eines bestimmten Zeitraums ab (z. B. "letzte 3 Tage"), wobei die Ergebnisse wie folgt formatiert werden <code translate="no">conversation_search</code></td><td style="text-align:center">Wird ausgelöst, wenn der aktuelle, zeitlich begrenzte Kontext relevant ist. Zu den Parametern gehören <code translate="no">n</code> (Anzahl der Ergebnisse), <code translate="no">sort_order</code> und der Zeitbereich</td></tr>
</tbody>
</table>
<p>Unter diesen Komponenten ist <code translate="no">conversation_search</code> besonders erwähnenswert. Sie kann relevante Ergebnisse selbst für lose formulierte oder mehrsprachige Suchanfragen anzeigen, was darauf hindeutet, dass sie auf semantischer Ebene arbeitet und sich nicht auf den einfachen Abgleich von Schlüsselwörtern verlässt. Wahrscheinlich handelt es sich dabei um ein einbettungsbasiertes Retrieval oder um einen hybriden Ansatz, bei dem die Anfrage zunächst in eine kanonische Form übersetzt oder normalisiert wird und dann ein Keyword- oder Hybrid-Retrieval erfolgt.</p>
<p>Insgesamt hat der On-Demand-Abrufansatz von Claude mehrere bemerkenswerte Stärken:</p>
<ul>
<li><p><strong>Der Abruf erfolgt nicht automatisch</strong>: Tool-Aufrufe werden durch das eigene Urteil des Modells ausgelöst. Wenn sich ein Benutzer beispielsweise auf <em>"das Projekt, das wir beim letzten Mal besprochen haben"</em> bezieht <em>,</em> kann Claude entscheiden, <code translate="no">conversation_search</code> aufzurufen, um den relevanten Kontext abzurufen.</p></li>
<li><p><strong>Umfassenderer Kontext bei Bedarf</strong>: Die abgerufenen Ergebnisse können <strong>Auszüge aus den Antworten der Assistenten</strong> enthalten, während die Zusammenfassungen von ChatGPT nur die Nutzernachrichten erfassen. Dadurch ist Claude besser für Anwendungsfälle geeignet, die einen tieferen oder präziseren Gesprächskontext erfordern.</p></li>
<li><p><strong>Bessere Effizienz durch Voreinstellung</strong>: Da historischer Kontext nur bei Bedarf eingespeist wird, vermeidet das System die Übertragung großer Mengen irrelevanter Daten und reduziert so den unnötigen Token-Verbrauch.</p></li>
</ul>
<p>Die Nachteile liegen ebenfalls auf der Hand. Die Einführung der On-Demand-Abfrage erhöht die Systemkomplexität: Indizes müssen erstellt und gepflegt, Abfragen ausgeführt, Ergebnisse eingestuft und manchmal neu eingestuft werden. Auch die End-to-End-Latenz wird weniger vorhersehbar als bei einem vorberechneten, stets eingefügten Kontext. Darüber hinaus muss das Modell lernen zu entscheiden, wann ein Abruf notwendig ist. Wenn diese Entscheidung fehlschlägt, wird der relevante Kontext möglicherweise gar nicht abgerufen.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">Die Zwänge hinter dem Claude-Style On-Demand Retrieval<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Einführung eines bedarfsgesteuerten Abrufmodells macht die Vektordatenbank zu einem kritischen Teil der Architektur. Der Abruf von Konversationen stellt ungewöhnlich hohe Anforderungen an die Speicherung und die Ausführung von Abfragen, und das System muss vier Bedingungen gleichzeitig erfüllen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Niedrige Latenzzeittoleranz</h3><p>In Konversationssystemen muss die P99-Latenz normalerweise unter ~20 ms bleiben. Verzögerungen, die darüber hinausgehen, werden von den Benutzern sofort wahrgenommen. Dies lässt wenig Spielraum für Ineffizienz: Vektorsuche, Metadatenfilterung und Ergebnisranking müssen alle sorgfältig optimiert werden. Ein Engpass an irgendeiner Stelle kann das gesamte Konversationserlebnis beeinträchtigen.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Hybride Suchanforderung</h3><p>Benutzeranfragen erstrecken sich oft über mehrere Dimensionen. Eine Anfrage wie <em>"Diskussionen über RAG der letzten Woche"</em> kombiniert semantische Relevanz mit zeitbasierter Filterung. Wenn eine Datenbank nur die Vektorsuche unterstützt, kann es sein, dass sie 1.000 semantisch ähnliche Ergebnisse liefert, die dann durch die Filterung auf der Anwendungsebene auf eine Handvoll reduziert werden - was einen Großteil der Berechnungen verschlingt. Um praktikabel zu sein, muss die Datenbank von Haus aus kombinierte Vektor- und Skalarabfragen unterstützen.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Trennung von Speicherung und Berechnung</h3><p>Der Gesprächsverlauf weist ein klares Hot-Cold-Zugriffsmuster auf. Aktuelle Konversationen werden häufig abgefragt, während ältere Konversationen nur selten angefasst werden. Müssten alle Vektoren im Speicher verbleiben, würde die Speicherung von mehreren zehn Millionen Konversationen Hunderte von Gigabyte an RAM verbrauchen - ein unpraktischer Kostenfaktor in großem Maßstab. Um praktikabel zu sein, muss das System eine Trennung von Speicher und Rechenleistung unterstützen, indem heiße Daten im Speicher und kalte Daten im Objektspeicher gehalten werden, wobei die Vektoren bei Bedarf geladen werden.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Vielfältige Abfragemuster</h3><p>Die Abfrage von Konversationen folgt nicht einem einzigen Zugriffsmuster. Einige Abfragen sind rein semantisch (z. B. <em>"die Leistungsoptimierung, die wir besprochen haben")</em>, andere sind rein zeitlich (<em>"alle Konversationen der letzten Woche")</em>, und viele kombinieren mehrere Einschränkungen (<em>"Diskussionen über Python, in denen FastAPI in den letzten drei Monaten erwähnt wurde")</em>. Der Datenbank-Abfrageplaner muss die Ausführungsstrategien an die verschiedenen Abfragetypen anpassen, anstatt sich auf eine pauschale Brute-Force-Suche zu verlassen.</p>
<p>Zusammen definieren diese vier Herausforderungen die Kernbedingungen des Conversational Retrieval. Jedes System, das eine On-Demand-Suche im Stile von Claude implementieren will, muss alle diese Herausforderungen auf koordinierte Weise angehen.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Warum Milvus 2.6 für die konversationelle Suche gut funktioniert<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Design-Entscheidungen in <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a> stehen in engem Einklang mit den Kernanforderungen des On-Demand-Conversational Retrieval. Nachfolgend finden Sie eine Aufschlüsselung der Schlüsselfunktionen und deren Zuordnung zu den realen Anforderungen an die Gesprächsabfrage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Hybrides Retrieval mit dichten und spärlichen Vektoren</h3><p>Milvus 2.6 unterstützt von Haus aus die Speicherung von dichten und spärlichen Vektoren innerhalb derselben Sammlung und die automatische Zusammenführung ihrer Ergebnisse zur Abfragezeit. Dichte Vektoren (z.B. 768-dimensionale Einbettungen, die von Modellen wie BGE-M3 erzeugt werden) erfassen semantische Ähnlichkeit, während spärliche Vektoren (typischerweise von BM25 erzeugt) exakte Schlüsselwortsignale erhalten.</p>
<p>Für eine Abfrage wie <em>"Diskussionen über RAG von letzter Woche"</em> führt Milvus die semantische Suche und die Suche nach Schlüsselwörtern parallel aus und führt dann die Ergebnisse durch Reranking zusammen. Im Vergleich zur alleinigen Verwendung eines der beiden Ansätze liefert diese hybride Strategie in realen Konversationsszenarien eine deutlich höhere Trefferquote.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Speicher-Rechner-Trennung und Abfrageoptimierung</h3><p>Milvus 2.6 unterstützt Tiered Storage auf zwei Arten:</p>
<ul>
<li><p>Heiße Daten im Speicher, kalte Daten im Objektspeicher</p></li>
<li><p>Indizes im Arbeitsspeicher, Rohvektordaten im Objektspeicher</p></li>
</ul>
<p>Mit diesem Design kann die Speicherung von einer Million Konversationseinträgen mit etwa 2 GB Arbeitsspeicher und 8 GB Objektspeicher erreicht werden. Mit der richtigen Einstellung kann die P99-Latenzzeit unter 20 ms bleiben, selbst wenn die Trennung von Speicher und Rechenleistung aktiviert ist.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">JSON-Zerkleinerung und schnelle skalare Filterung</h3><p>Milvus 2.6 aktiviert standardmäßig JSON Shredding, wodurch verschachtelte JSON-Felder in einem spaltenförmigen Speicher abgeflacht werden. Dies verbessert die Leistung der skalaren Filterung laut offiziellen Benchmarks um das 3-5fache (die tatsächlichen Gewinne variieren je nach Abfragemuster).</p>
<p>Die Abfrage von Konversationen erfordert häufig die Filterung nach Metadaten wie Benutzer-ID, Sitzungs-ID oder Zeitspanne. Mit JSON Shredding können Abfragen wie <em>"alle Unterhaltungen von Benutzer A in der letzten Woche"</em> direkt auf spaltenförmigen Indizes ausgeführt werden, ohne dass wiederholt ganze JSON-Blobs geparst werden müssen.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Open-Source-Kontrolle und betriebliche Flexibilität</h3><p>Als Open-Source-System bietet Milvus ein Maß an architektonischer und betrieblicher Kontrolle, das geschlossene Black-Box-Lösungen nicht bieten. Teams können Indexparameter einstellen, Daten-Tiering-Strategien anwenden und verteilte Bereitstellungen an ihre Arbeitslasten anpassen.</p>
<p>Diese Flexibilität senkt die Einstiegshürde: Kleine und mittelgroße Teams können Conversational Retrieval-Systeme im Millionen- bis Zig-Millionen-Bereich aufbauen, ohne auf überdimensionierte Infrastrukturbudgets angewiesen zu sein.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Warum ChatGPT und Claude unterschiedliche Wege gegangen sind<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Unterschied zwischen den Gedächtnissystemen von ChatGPT und Claude besteht im Wesentlichen darin, wie beide Systeme mit dem Vergessen umgehen. ChatGPT bevorzugt proaktives Vergessen: Sobald der Speicher eine festgelegte Grenze überschreitet, wird der ältere Kontext gelöscht. Damit wird Vollständigkeit gegen Einfachheit und vorhersehbares Systemverhalten eingetauscht. Claude bevorzugt das verzögerte Vergessen. Theoretisch kann der Gesprächsverlauf unbegrenzt wachsen, wobei der Abruf an ein Abrufsystem auf Abruf delegiert wird.</p>
<p>Warum also haben die beiden Systeme unterschiedliche Wege gewählt? Die Antwort liegt auf der Hand: <strong>Jede Architektur ist nur dann praktikabel, wenn die zugrunde liegende Infrastruktur sie unterstützen kann</strong>.</p>
<p>Wäre der Ansatz von Claude im Jahr 2020 versucht worden, wäre er wahrscheinlich unpraktisch gewesen. Damals hatten Vektordatenbanken oft eine Latenzzeit von Hunderten von Millisekunden, hybride Abfragen wurden nur unzureichend unterstützt, und die Ressourcennutzung skalierte bei wachsendem Datenaufkommen ins Unermessliche. Unter diesen Bedingungen wäre der On-Demand-Abruf als überzogene Technik abgetan worden.</p>
<p>Im Jahr 2025 hat sich die Landschaft verändert. Fortschritte in der Infrastruktur - angetrieben durch Systeme wie <strong>Milvus 2.6 - haben</strong>die Trennung von Speicher und Rechenleistung, die Optimierung von Abfragen, hybride Abfragen mit hoher Dichte und geringer Dichte sowie JSON Shredding in der Produktion möglich gemacht. Diese Fortschritte verringern die Latenzzeit, kontrollieren die Kosten und machen selektive Abrufe in großem Umfang praktikabel. Infolgedessen sind On-Demand-Tools und abrufbasierte Speicher nicht nur machbar, sondern auch zunehmend attraktiv geworden, insbesondere als Grundlage für agentenähnliche Systeme.</p>
<p>Letztlich richtet sich die Wahl der Architektur danach, was die Infrastruktur ermöglicht.</p>
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
    </button></h2><p>In realen Systemen ist das Speicherdesign keine binäre Entscheidung zwischen vorberechneten Kontexten und bedarfsgesteuertem Abruf. Die effektivsten Architekturen sind in der Regel hybrid und kombinieren beide Ansätze.</p>
<p>Ein gängiges Muster ist die Einspeisung aktueller Gesprächsverläufe über ein gleitendes Kontextfenster, die Speicherung stabiler Benutzerpräferenzen als Festspeicher und der Abruf älterer Gesprächsverläufe bei Bedarf über eine Vektorsuche. Mit zunehmender Reife eines Produkts kann sich dieses Gleichgewicht allmählich verschieben - von einem primär vorberechneten Kontext zu einem zunehmend abrufgesteuerten -, ohne dass eine störende architektonische Umstellung erforderlich ist.</p>
<p>Selbst wenn man mit einem vorberechneten Ansatz beginnt, ist es wichtig, die Migration im Blick zu haben. Der Speicher sollte mit eindeutigen Bezeichnern, Zeitstempeln, Kategorien und Quellverweisen gespeichert werden. Wenn die Abfrage praktikabel wird, können Einbettungen für den vorhandenen Speicher generiert und zusammen mit denselben Metadaten zu einer Vektordatenbank hinzugefügt werden, sodass die Abfragelogik schrittweise und mit minimaler Unterbrechung eingeführt werden kann.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion der neuesten Milvus-Version genauer kennenlernen? Treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei oder stellen Sie Fragen auf <a href="https://github.com/milvus-io/milvus">GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitungen und Antworten auf Ihre Fragen über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> zu erhalten.</p>
