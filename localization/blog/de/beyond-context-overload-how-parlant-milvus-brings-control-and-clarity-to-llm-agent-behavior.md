---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Jenseits der Kontextüberlastung: Wie Parlant × Milvus dem Verhalten von
  LLM-Agenten Kontrolle und Klarheit verschafft
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Entdecken Sie, wie Parlant × Milvus Alignment-Modellierung und
  Vektorintelligenz einsetzt, um das Verhalten von LLM-Agenten kontrollierbar,
  erklärbar und produktionsreif zu machen.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Stellen Sie sich vor, Sie sollen eine Aufgabe erledigen, die 200 Geschäftsregeln, 50 Tools und 30 Demos umfasst, und Sie haben dafür nur eine Stunde Zeit. Das ist einfach unmöglich. Dennoch erwarten wir oft, dass große Sprachmodelle genau das tun, wenn wir sie zu "Agenten" machen und sie mit Anweisungen überfrachten.</p>
<p>In der Praxis scheitert dieser Ansatz jedoch schnell. Herkömmliche Agenten-Frameworks wie LangChain oder LlamaIndex injizieren alle Regeln und Werkzeuge auf einmal in den Kontext des Modells, was zu Regelkonflikten, Kontextüberlastung und unvorhersehbarem Verhalten in der Produktion führt.</p>
<p>Um dieses Problem zu lösen, hat ein Open-Source-Agenten-Framework namens<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> kürzlich auf GitHub an Zugkraft gewonnen. Es führt einen neuen Ansatz namens Alignment Modeling ein, zusammen mit einem Überwachungsmechanismus und bedingten Übergängen, die das Agentenverhalten viel besser kontrollierbar und erklärbar machen.</p>
<p>In Verbindung mit <a href="https://milvus.io/"><strong>Milvus</strong></a>, einer Open-Source-Vektordatenbank, wird Parlant noch leistungsfähiger. Milvus fügt semantische Intelligenz hinzu, die es den Agenten ermöglicht, dynamisch und in Echtzeit die relevantesten Regeln und Kontexte abzurufen - so bleiben sie präzise, effizient und produktionsbereit.</p>
<p>In diesem Beitrag erfahren Sie, wie Parlant im Verborgenen arbeitet und wie die Integration mit Milvus eine produktionsreife Lösung ermöglicht.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Warum traditionelle Agenten-Frameworks scheitern<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>Herkömmliche Agenten-Frameworks lieben es, groß aufzutreten: Hunderte von Regeln, Dutzende von Tools und eine Handvoll Demos - alles in einer einzigen, überladenen Eingabeaufforderung zusammengefasst. Das mag in einer Demo oder einem kleinen Sandkastentest gut aussehen, aber sobald man es in die Produktion überführt, zeigen sich schnell die Risse.</p>
<ul>
<li><p><strong>Widersprüchliche Regeln bringen Chaos:</strong> Wenn zwei oder mehr Regeln gleichzeitig gelten, haben diese Frameworks keine eingebaute Möglichkeit zu entscheiden, welche von ihnen gewinnt. Manchmal wird eine davon ausgewählt. Manchmal werden beide gemischt. Manchmal wird etwas völlig Unvorhersehbares getan.</p></li>
<li><p><strong>Randfälle machen die Lücken deutlich:</strong> Sie können unmöglich alles vorhersagen, was ein Benutzer sagen könnte. Und wenn Ihr Modell auf etwas stößt, das nicht in seinen Trainingsdaten enthalten ist, gibt es nur allgemeine, unverbindliche Antworten.</p></li>
<li><p><strong>Die Fehlersuche ist mühsam und kostspielig:</strong> Wenn sich ein Agent nicht korrekt verhält, ist es fast unmöglich festzustellen, welche Regel das Problem verursacht hat. Da sich alles in einer riesigen System-Eingabeaufforderung befindet, besteht die einzige Möglichkeit, das Problem zu beheben, darin, die Eingabeaufforderung neu zu schreiben und alles von Grund auf neu zu testen.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Was ist Parlant und wie funktioniert es?<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant ist eine quelloffene Ausrichtungsmaschine für LLM-Agenten. Sie können genau steuern, wie sich ein Agent in verschiedenen Szenarien verhält, indem Sie seinen Entscheidungsprozess auf strukturierte, regelbasierte Weise modellieren.</p>
<p>Um die Probleme traditioneller Agenten-Frameworks zu lösen, führt Parlant einen neuen, leistungsstarken Ansatz ein: <strong>Alignment Modeling</strong>. Die Kernidee besteht darin, die Regeldefinition von der Regelausführung zu trennen, um sicherzustellen, dass nur die relevantesten Regeln zu einem bestimmten Zeitpunkt in den LLM-Kontext eingespeist werden.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Granulare Richtlinien: Der Kern des Alignment Modeling</h3><p>Das Herzstück des Alignment-Modells von Parlant ist das Konzept der <strong>Granularen Richtlinien</strong>. Anstatt einen riesigen Systemprompt voller Regeln zu schreiben, definieren Sie kleine, modulare Richtlinien, die jeweils beschreiben, wie der Agent mit einer bestimmten Art von Situation umgehen sollte.</p>
<p>Jede Leitlinie besteht aus drei Teilen:</p>
<ul>
<li><p><strong>Bedingung</strong> - Eine Beschreibung in natürlicher Sprache, wann die Regel gelten soll. Parlant wandelt diese Bedingung in einen semantischen Vektor um und gleicht sie mit den Eingaben des Benutzers ab, um herauszufinden, ob sie relevant ist.</p></li>
<li><p><strong>Aktion</strong> - Eine klare Anweisung, die definiert, wie der Agent reagieren soll, wenn die Bedingung erfüllt ist. Diese Aktion wird nur bei Auslösung in den LLM-Kontext injiziert.</p></li>
<li><p><strong>Tools</strong> - Alle externen Funktionen oder APIs, die mit dieser spezifischen Regel verbunden sind. Diese werden dem Agenten nur zugänglich gemacht, wenn die Richtlinie aktiv ist, so dass die Verwendung der Tools kontrolliert und kontextabhängig bleibt.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Jedes Mal, wenn ein Benutzer mit dem Agenten interagiert, führt Parlant einen leichtgewichtigen Abgleichschritt durch, um die drei bis fünf relevantesten Richtlinien zu finden. Nur diese Regeln werden in den Kontext des Modells eingefügt, so dass die Eingabeaufforderungen kurz und konzentriert bleiben und gleichzeitig sichergestellt wird, dass der Agent stets die richtigen Regeln befolgt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Überwachungsmechanismen für Genauigkeit und Konsistenz</h3><p>Um die Genauigkeit und Konsistenz weiter zu gewährleisten, führt Parlant einen <strong>Überwachungsmechanismus</strong> ein, der als zweite Ebene der Qualitätskontrolle fungiert. Der Prozess läuft in drei Schritten ab:</p>
<p><strong>1. Generierung eines Antwortkandidaten</strong> - Der Agent erstellt eine erste Antwort basierend auf den übereinstimmenden Richtlinien und dem aktuellen Gesprächskontext.</p>
<p><strong>2. Überprüfung der Übereinstimmung</strong> - Die Antwort wird mit den aktiven Richtlinien verglichen, um zu überprüfen, ob alle Anweisungen korrekt befolgt wurden.</p>
<p><strong>3. Überarbeitung oder Bestätigung</strong> - Werden Probleme festgestellt, korrigiert das System die Ausgabe; ist alles in Ordnung, wird die Antwort genehmigt und an den Benutzer gesendet.</p>
<p>Dieser Überwachungsmechanismus stellt sicher, dass der Agent die Regeln nicht nur versteht, sondern sie auch tatsächlich einhält, bevor er antwortet - das verbessert sowohl die Zuverlässigkeit als auch die Kontrolle.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Bedingte Übergänge für Kontrolle und Sicherheit</h3><p>In traditionellen Agenten-Frameworks ist jedes verfügbare Werkzeug jederzeit für den LLM zugänglich. Dieser "alles auf den Tisch"-Ansatz führt oft zu überladenen Aufforderungen und unbeabsichtigten Tool-Aufrufen. Parlant löst dieses Problem durch <strong>bedingte Übergänge</strong>. Ähnlich wie bei Zustandsautomaten wird eine Aktion oder ein Werkzeug nur dann ausgelöst, wenn eine bestimmte Bedingung erfüllt ist. Jedes Werkzeug ist eng an die entsprechende Richtlinie gebunden und wird nur verfügbar, wenn die Bedingung der Richtlinie aktiviert ist.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Durch diesen Mechanismus wird der Aufruf eines Werkzeugs zu einem bedingten Übergang - Werkzeuge werden nur dann von "inaktiv" zu "aktiv", wenn ihre Auslösebedingungen erfüllt sind. Durch diese Strukturierung der Ausführung stellt Parlant sicher, dass jede Aktion bewusst und kontextabhängig erfolgt, um Missbrauch zu verhindern und gleichzeitig die Effizienz und Systemsicherheit zu verbessern.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Wie Milvus Parlant antreibt<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn wir einen Blick unter die Haube des Parlant-Richtlinienabgleichs werfen, wird eine zentrale technische Herausforderung deutlich: Wie kann das System die drei bis fünf relevantesten Regeln aus hunderten - oder sogar tausenden - Optionen in nur wenigen Millisekunden finden? Genau hier kommt eine Vektordatenbank ins Spiel. Das semantische Retrieval macht dies möglich.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Wie Milvus den Richtlinienabgleich von Parlant unterstützt</h3><p>Der Richtlinienabgleich funktioniert über semantische Ähnlichkeit. Das Feld "Bedingung" jeder Leitlinie wird in eine Vektoreinbettung umgewandelt, die die Bedeutung der Leitlinie und nicht nur den wörtlichen Text erfasst. Wenn ein Benutzer eine Nachricht sendet, vergleicht Parlant die Semantik dieser Nachricht mit allen gespeicherten Richtlinieneinbettungen, um die relevantesten zu finden.</p>
<p>So funktioniert der Prozess Schritt für Schritt:</p>
<p><strong>1. Kodierung der Abfrage</strong> - Die Nachricht des Benutzers und der aktuelle Gesprächsverlauf werden in einen Abfragevektor umgewandelt.</p>
<p><strong>2. Suche nach Ähnlichkeit</strong> - Das System führt eine Ähnlichkeitssuche im Leitfadenvektor durch, um die nächstliegenden Übereinstimmungen zu finden.</p>
<p><strong>3. Abrufen der Top-K-Ergebnisse</strong> - Die drei bis fünf semantisch relevantesten Richtlinien werden zurückgegeben.</p>
<p><strong>4. Einfügen in den Kontext</strong> - Diese übereinstimmenden Leitlinien werden dann dynamisch in den Kontext des LLM eingefügt, damit das Modell nach den richtigen Regeln handeln kann.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um diesen Arbeitsablauf zu ermöglichen, muss die Vektordatenbank drei entscheidende Funktionen bieten: eine leistungsstarke ANN-Suche (Approximate Nearest Neighbor), eine flexible Filterung von Metadaten und Vektoraktualisierungen in Echtzeit. <a href="https://milvus.io/"><strong>Milvus</strong></a>, die quelloffene, cloud-native Vektordatenbank, bietet in allen drei Bereichen eine Leistung auf Produktionsniveau.</p>
<p>Um zu verstehen, wie Milvus in realen Szenarien funktioniert, lassen Sie uns als Beispiel einen Finanzdienstleistungsagenten betrachten.</p>
<p>Nehmen wir an, das System definiert 800 Geschäftsrichtlinien, die Aufgaben wie Kontoabfragen, Fondsüberweisungen und Beratungen zu Vermögensverwaltungsprodukten abdecken. In diesem Fall fungiert Milvus als Speicher- und Abrufschicht für alle Richtliniendaten.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Wenn nun ein Benutzer sagt: "Ich möchte 100.000 RMB auf das Konto meiner Mutter überweisen", sieht der Laufzeitablauf folgendermaßen aus:</p>
<p><strong>1. Rektorisierung der Abfrage</strong> - Umwandlung der Benutzereingabe in einen 768-dimensionalen Vektor.</p>
<p><strong>2. Hybrides Retrieval</strong> - Durchführung einer Vektorähnlichkeitssuche in Milvus mit Metadatenfilterung (z.B. <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Rangfolge der Ergebnisse</strong> - Rangfolge der in Frage kommenden Leitlinien auf der Grundlage von Ähnlichkeitsbewertungen in Kombination mit ihren <strong>Prioritätswerten</strong>.</p>
<p><strong>4. Kontextinjektion</strong> - Injektion der Top-3 übereinstimmenden Leitlinien <code translate="no">action_text</code> in den Kontext des Parlant-Agenten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In dieser Konfiguration liefert Milvus eine P99-Latenzzeit von unter 15 ms, selbst wenn die Richtlinienbibliothek auf 100.000 Einträge skaliert. Im Vergleich dazu führt die Verwendung einer herkömmlichen relationalen Datenbank mit Stichwortabgleich in der Regel zu einer Latenzzeit von über 200 ms und einer deutlich geringeren Treffergenauigkeit.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Wie Milvus Langzeitgedächtnis und Personalisierung ermöglicht</h3><p>Milvus bietet mehr als nur den Abgleich von Richtlinien. In Szenarien, in denen Agenten ein Langzeitgedächtnis und personalisierte Antworten benötigen, kann Milvus als Gedächtnisebene dienen, die vergangene Interaktionen von Benutzern als Vektoreinbettungen speichert und abruft und dem Agenten hilft, sich zu erinnern, was zuvor besprochen wurde.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Wenn derselbe Benutzer zurückkehrt, kann der Agent die relevantesten historischen Interaktionen von Milvus abrufen und sie verwenden, um eine vernetztere, menschenähnliche Erfahrung zu erzeugen. Wenn ein Nutzer beispielsweise letzte Woche nach einem Investmentfonds gefragt hat, kann sich der Agent an diesen Kontext erinnern und proaktiv reagieren: "Willkommen zurück! Haben Sie noch Fragen zu dem Fonds, den wir beim letzten Mal besprochen haben?"</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Wie man die Leistung von Milvus-gestützten Agentensystemen optimiert</h3><p>Wenn ein von Milvus betriebenes Agentensystem in einer Produktionsumgebung eingesetzt wird, ist die Leistungsoptimierung von entscheidender Bedeutung. Um niedrige Latenzzeiten und einen hohen Durchsatz zu erreichen, müssen mehrere Schlüsselparameter beachtet werden:</p>
<p><strong>1. Auswahl des richtigen Index-Typs</strong></p>
<p>Es ist wichtig, die richtige Indexstruktur zu wählen. HNSW (Hierarchical Navigable Small World) ist beispielsweise ideal für Szenarien mit hohem Abrufaufkommen, wie z. B. im Finanz- oder Gesundheitswesen, wo es auf Genauigkeit ankommt. IVF_FLAT eignet sich besser für groß angelegte Anwendungen wie E-Commerce-Empfehlungen, bei denen eine etwas geringere Wiederauffindbarkeit im Gegenzug für eine schnellere Leistung und einen geringeren Speicherbedarf akzeptabel ist.</p>
<p><strong>2. Sharding-Strategie</strong></p>
<p>Wenn die Anzahl der gespeicherten Richtlinien eine Million Einträge übersteigt, empfiehlt sich eine <strong>Partitionierung</strong>, um die Daten nach Geschäftsbereichen oder Anwendungsfällen aufzuteilen. Durch die Partitionierung wird der Suchraum pro Abfrage verkleinert, wodurch sich die Abrufgeschwindigkeit erhöht und die Latenzzeit auch bei wachsendem Datenbestand stabil bleibt.</p>
<p><strong>3. Cache-Konfiguration</strong></p>
<p>Für Richtlinien, auf die häufig zugegriffen wird, wie z. B. Standard-Kundenabfragen oder Workflows mit hohem Datenverkehr, können Sie das Caching der Milvus-Abfrageergebnisse nutzen. Dadurch kann das System frühere Ergebnisse wiederverwenden und die Latenzzeit bei wiederholten Abfragen auf unter 5 Millisekunden senken.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Hands-on-Demo: Wie man ein intelligentes Q&amp;A-System mit Parlant und Milvus Lite aufbaut<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> ist eine leichtgewichtige Version von Milvus - eine Python-Bibliothek, die einfach in Ihre Anwendungen eingebettet werden kann. Sie ist ideal für schnelles Prototyping in Umgebungen wie Jupyter Notebooks oder für die Ausführung auf Edge- und Smart-Geräten mit begrenzten Rechenressourcen. Trotz seines geringen Platzbedarfs unterstützt Milvus Lite die gleichen APIs wie andere Milvus-Implementierungen. Das bedeutet, dass der clientseitige Code, den Sie für Milvus Lite schreiben, später nahtlos mit einer vollständigen Milvus- oder Zilliz-Cloud-Instanz verbunden werden kann - ohne Refactoring.</p>
<p>In dieser Demo verwenden wir Milvus Lite in Verbindung mit Parlant, um zu demonstrieren, wie man ein intelligentes Q&amp;A-System aufbaut, das schnelle, kontextbezogene Antworten bei minimaler Einrichtung liefert.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen：</h3><p>1) Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.die Parlant-Dokumentation: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Schritt 1: Abhängigkeiten installieren</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Schritt 2: Umgebungsvariablen konfigurieren</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Schritt 3: Implementieren des Kerncodes</h3><ul>
<li>Erstellen Sie einen benutzerdefinierten OpenAI Embedder</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Initialisieren der Wissensbasis</li>
</ul>
<p>1. eine Milvus-Sammlung mit dem Namen kb_articles erstellen.</p>
<p>2. fügen Sie Beispieldaten ein (z.B. Rückerstattungsrichtlinien, Umtauschrichtlinien, Versanddauer).</p>
<p>3. einen HNSW-Index erstellen, um das Auffinden zu beschleunigen.</p>
<ul>
<li>Erstellen Sie das Vektorsuchwerkzeug</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Konfigurieren Sie den Parlant Agent</li>
</ul>
<p><strong>Leitlinie 1:</strong> Bei sachlichen oder richtlinienbezogenen Fragen muss der Agent zunächst eine Vektorsuche durchführen.</p>
<p><strong>Leitlinie 2:</strong> Wenn Beweise gefunden werden, muss der Agent anhand einer strukturierten Vorlage antworten (Zusammenfassung + Schlüsselpunkte + Quellen).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Schreiben Sie den vollständigen Code</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Schritt 4: Ausführen des Codes</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Besuchen Sie den Playground:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sie haben nun erfolgreich ein intelligentes Q&amp;A-System mit Parlant und Milvus erstellt.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex: Wie sie sich unterscheiden und wie sie zusammenarbeiten<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie unterscheidet sich Parlant von bestehenden Agenten-Frameworks wie <strong>LangChain</strong> oder <strong>LlamaIndex</strong>?</p>
<p>LangChain und LlamaIndex sind Allzweck-Frameworks. Sie bieten eine breite Palette von Komponenten und Integrationen und sind daher ideal für Rapid Prototyping und Forschungsexperimente. Wenn es jedoch um den Einsatz in der Produktion geht, müssen Entwickler oft selbst zusätzliche Schichten aufbauen, wie z.B. Regelmanagement, Konformitätsprüfungen und Zuverlässigkeitsmechanismen, um die Agenten konsistent und vertrauenswürdig zu halten.</p>
<p>Parlant bietet ein integriertes Richtlinienmanagement, Selbstkritik-Mechanismen und Erklärungswerkzeuge, die Entwicklern helfen, das Verhalten, die Reaktionen und die Gründe eines Agenten zu verwalten. Dadurch eignet sich Parlant besonders für anspruchsvolle, kundenorientierte Anwendungsfälle, bei denen es auf Genauigkeit und Verantwortlichkeit ankommt, wie z. B. im Finanz-, Gesundheits- und Rechtswesen.</p>
<p>Diese Frameworks können sogar zusammenarbeiten:</p>
<ul>
<li><p>Verwenden Sie LangChain, um komplexe Datenverarbeitungspipelines oder Abrufworkflows zu erstellen.</p></li>
<li><p>Verwenden Sie Parlant, um die letzte Interaktionsschicht zu verwalten und sicherzustellen, dass die Ausgaben den Geschäftsregeln entsprechen und interpretierbar bleiben.</p></li>
<li><p>Verwenden Sie Milvus als Grundlage für die Vektordatenbank, um die semantische Suche, das Gedächtnis und den Wissensabruf im gesamten System in Echtzeit zu ermöglichen.</p></li>
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
    </button></h2><p>Wenn LLM-Agenten von der Erprobung in die Produktion übergehen, ist die Schlüsselfrage nicht mehr, was sie tun können, sondern wie zuverlässig und sicher sie es tun können. Parlant bietet die Struktur und Kontrolle für diese Zuverlässigkeit, während Milvus die skalierbare Vektorinfrastruktur bereitstellt, die alles schnell und kontextabhängig macht.</p>
<p>Zusammen ermöglichen sie es Entwicklern, KI-Agenten zu entwickeln, die nicht nur fähig, sondern auch vertrauenswürdig, erklärbar und produktionsreif sind.</p>
<p>🚀 Schauen Sie sich<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant auf GitHub</a> an und integrieren Sie es mit<a href="https://milvus.io"> Milvus</a>, um Ihr eigenes intelligentes, regelbasiertes Agentensystem zu erstellen.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
