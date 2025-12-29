---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  KI-Agenten auf dem Boden der Tatsachen halten: Kontext-Engineering-Strategien
  zur Verhinderung von Kontextverfälschung mit Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Erfahren Sie, warum der Kontext in langlaufenden LLM-Workflows verfälscht wird
  und wie Kontext-Engineering, Abrufstrategien und die Milvus-Vektorsuche dazu
  beitragen, dass KI-Agenten bei komplexen mehrstufigen Aufgaben präzise,
  konzentriert und zuverlässig arbeiten.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Wenn Sie schon einmal mit langwierigen LLM-Gesprächen gearbeitet haben, kennen Sie wahrscheinlich diesen frustrierenden Moment: Nach der Hälfte eines langen Gesprächs beginnt das Modell abzudriften. Die Antworten werden vage, die Argumentation wird schwächer, und wichtige Details verschwinden auf mysteriöse Weise. Wenn Sie jedoch genau dieselbe Aufforderung in einem neuen Chat stellen, verhält sich das Modell plötzlich konzentriert, genau und geerdet.</p>
<p>Das liegt nicht daran, dass das Modell "müde" wird - es ist eine <strong>Kontextverfälschung</strong>. Je länger ein Gespräch dauert, desto mehr Informationen muss das Modell jonglieren, und seine Fähigkeit, Prioritäten zu setzen, nimmt langsam ab. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Antropische Studien</a> zeigen, dass die Abrufgenauigkeit um 15-30 % sinken kann, wenn sich die Kontextfenster von etwa 8K Token auf 128K Token ausdehnen. Das Modell hat immer noch Platz, aber es verliert den Überblick über das, was wichtig ist. Größere Kontextfenster helfen, das Problem zu verzögern, aber sie beseitigen es nicht.</p>
<p>Hier kommt das <strong>Context Engineering</strong> ins Spiel. Anstatt dem Modell alles auf einmal zu geben, formen wir das, was es sieht: Wir rufen nur die Teile ab, die wichtig sind, komprimieren das, was nicht mehr ausführlich sein muss, und halten die Eingabeaufforderungen und Werkzeuge so übersichtlich, dass das Modell darüber nachdenken kann. Das Ziel ist einfach: wichtige Informationen im richtigen Moment zur Verfügung stellen und den Rest ignorieren.</p>
<p>Das Retrieval spielt hier eine zentrale Rolle, insbesondere bei lang laufenden Agenten. Vektordatenbanken wie <a href="https://milvus.io/"><strong>Milvus</strong></a> bilden die Grundlage, um relevantes Wissen effizient wieder in den Kontext einzubinden, so dass das System auch dann noch auf dem Boden der Tatsachen bleibt, wenn die Aufgaben an Tiefe und Komplexität zunehmen.</p>
<p>In diesem Blog befassen wir uns mit der Frage, wie es zur Kontextrotation kommt, mit den Strategien, die Teams zur Bewältigung dieses Phänomens einsetzen, und mit den Architekturmustern - von der Abfrage bis zum Prompt-Design -, die KI-Agenten über lange, mehrstufige Arbeitsabläufe hinweg fit halten.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Warum Kontextfäule auftritt<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>Oft wird angenommen, dass ein KI-Modell mit mehr Kontext zu besseren Antworten führt. Aber das stimmt nicht wirklich. Auch Menschen haben mit langen Eingaben zu kämpfen: Die Kognitionswissenschaft zeigt, dass unser Arbeitsgedächtnis etwa <strong>7±2 Informationsblöcke</strong> speichert. Wenn wir darüber hinausgehen, beginnen wir, Details zu vergessen, zu verwischen oder falsch zu interpretieren.</p>
<p>LLMs zeigen ein ähnliches Verhalten - nur in einem viel größeren Maßstab und mit dramatischeren Fehlermöglichkeiten.</p>
<p>Das Grundproblem liegt in der <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">Transformer-Architektur</a> selbst. Jedes Token muss sich selbst mit jedem anderen Token vergleichen und paarweise Aufmerksamkeit über die gesamte Sequenz hinweg erzeugen. Das bedeutet, dass die Berechnung mit der Kontextlänge <strong>O(n²)</strong> wächst. Wenn Sie Ihre Eingabeaufforderung von 1K Token auf 100K erweitern, wird das Modell nicht "härter arbeiten" - es multipliziert die Anzahl der Token-Interaktionen um das <strong>10.000-fache</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dann gibt es noch das Problem mit den Trainingsdaten.</strong> Modelle sehen viel mehr kurze Sequenzen als lange. Wenn Sie also von einem LLM verlangen, in extrem großen Kontexten zu operieren, drängen Sie es in ein System, für das es nicht besonders trainiert wurde. In der Praxis ist das Denken in sehr langen Kontexten für die meisten Modelle oft <strong>nicht mehr möglich</strong>.</p>
<p>Trotz dieser Grenzen sind lange Kontexte heute unvermeidlich. Bei den frühen LLM-Anwendungen handelte es sich meist um Einzelaufgaben wie Klassifizierung, Zusammenfassung oder einfache Generierung. Heute verlassen sich mehr als 70 % der KI-Systeme in Unternehmen auf Agenten, die über viele Interaktionsrunden hinweg aktiv bleiben, oft stundenlang, und verzweigte, mehrstufige Arbeitsabläufe verwalten. Langlebige Sitzungen sind von der Ausnahme zum Standard geworden.</p>
<p>Die nächste Frage lautet also: <strong>Wie können wir die Aufmerksamkeit des Modells aufrechterhalten, ohne es zu überfordern?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Context Retrieval - Ansätze zur Lösung des Kontextproblems<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Retrieval ist einer der wirksamsten Hebel, die wir haben, um Kontextfäule zu bekämpfen, und in der Praxis zeigt sich dies in komplementären Mustern, die Kontextfäule aus verschiedenen Blickwinkeln angehen.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Just-in-Time-Abruf: Unnötiger Kontext wird reduziert</h3><p>Eine der Hauptursachen für Context Rot ist die <em>Überfrachtung</em> des Modells mit Informationen, die es noch nicht braucht. Claude Code - Anthropic's Coding Assistant - löst dieses Problem mit <strong>Just-in-Time (JIT) Retrieval</strong>, einer Strategie, bei der das Modell Informationen nur dann abruft, wenn sie relevant werden.</p>
<p>Anstatt ganze Codebasen oder Datensätze in seinen Kontext zu packen (was die Gefahr des Abdriftens und Vergessens stark erhöht), unterhält Claude Code einen winzigen Index: Dateipfade, Befehle und Dokumentationslinks. Wenn das Modell eine bestimmte Information benötigt, ruft es dieses spezifische Element ab und fügt es in <strong>dem Moment</strong>in den Kontext ein <strong>, in dem es von Bedeutung ist - nicht</strong>vorher.</p>
<p>Wenn Sie Claude Code z. B. bitten, eine 10-GB-Datenbank zu analysieren, versucht es nie, die ganze Datenbank zu laden. Er arbeitet eher wie ein Ingenieur:</p>
<ol>
<li><p>Er führt eine SQL-Abfrage aus, um Zusammenfassungen des Datensatzes auf hoher Ebene zu erstellen.</p></li>
<li><p>Verwendet Befehle wie <code translate="no">head</code> und <code translate="no">tail</code>, um Beispieldaten anzuzeigen und ihre Struktur zu verstehen.</p></li>
<li><p>Behält nur die wichtigsten Informationen - wie z. B. Schlüsselstatistiken oder Beispielzeilen - im Kontext bei.</p></li>
</ol>
<p>Durch die Minimierung der im Kontext gehaltenen Informationen verhindert die JIT-Abruffunktion die Anhäufung irrelevanter Token, die zu Fäulnis führen. Das Modell bleibt fokussiert, da es immer nur die Informationen sieht, die für den aktuellen Schlussfolgerungsschritt erforderlich sind.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pre-retrieval (Vektorsuche): Verhindern von Kontextabweichungen, bevor sie beginnen</h3><p>Manchmal kann das Modell nicht dynamisch nach Informationen "fragen" - Kundensupport, Q&amp;A-Systeme und Agenten-Workflows benötigen oft das richtige Wissen <em>, bevor</em> die Generierung beginnt. An dieser Stelle wird die <strong>Vorabrecherche</strong> entscheidend.</p>
<p>Kontextverfälschungen treten häufig auf, weil dem Modell ein großer Haufen Rohtext vorgelegt wird und von ihm erwartet wird, dass es heraussortiert, was wichtig ist. Pre-Retrieval kehrt dies um: Eine Vektordatenbank (wie <a href="https://milvus.io/">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) identifiziert die relevantesten Teile <em>vor der</em> Inferenz und stellt sicher, dass nur hochwertiger Kontext das Modell erreicht.</p>
<p>In einer typischen RAG-Konfiguration:</p>
<ul>
<li><p>Dokumente werden eingebettet und in einer Vektordatenbank wie Milvus gespeichert.</p></li>
<li><p>Bei der Abfrage findet das System durch Ähnlichkeitssuche eine kleine Menge hochrelevanter Teile.</p></li>
<li><p>Nur diese Chunks werden in den Kontext des Modells aufgenommen.</p></li>
</ul>
<p>Dies verhindert Fäulnis in zweierlei Hinsicht:</p>
<ul>
<li><p><strong>Rauschunterdrückung:</strong> irrelevanter oder wenig verwandter Text wird gar nicht erst in den Kontext aufgenommen.</p></li>
<li><p><strong>Effizienz:</strong> Die Modelle verarbeiten viel weniger Token, wodurch die Gefahr, dass wesentliche Details verloren gehen, verringert wird.</p></li>
</ul>
<p>Milvus kann Millionen von Dokumenten in Millisekunden durchsuchen, was diesen Ansatz ideal für Live-Systeme macht, bei denen Latenzzeiten eine Rolle spielen.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Hybrides JIT- und Vektor-Retrieval</h3><p>Die auf der Vektorsuche basierende Vorabrecherche löst einen wesentlichen Teil der Kontextverfälschung, indem sie sicherstellt, dass das Modell mit Informationen mit hohem Signalgehalt und nicht mit rohem, übergroßem Text beginnt. Anthropic hebt jedoch zwei echte Herausforderungen hervor, die von den Teams oft übersehen werden:</p>
<ul>
<li><p><strong>Aktualität:</strong> Wenn die Wissensbasis schneller aktualisiert wird, als der Vektorindex neu aufgebaut wird, kann das Modell auf veraltete Informationen zurückgreifen.</p></li>
<li><p><strong>Genauigkeit:</strong> Bevor eine Aufgabe beginnt, ist es schwierig, genau vorherzusagen, was das Modell benötigen wird - insbesondere bei mehrstufigen oder explorativen Workflows.</p></li>
</ul>
<p>Bei realen Arbeitslasten ist daher eine hybride Anwendung die optimale Lösung.</p>
<ul>
<li><p>Vektorsuche für stabiles, zuverlässiges Wissen</p></li>
<li><p>Agentengesteuerte JIT-Exploration für Informationen, die sich weiterentwickeln oder erst in der Mitte einer Aufgabe relevant werden</p></li>
</ul>
<p>Durch die Kombination dieser beiden Ansätze erhalten Sie die Geschwindigkeit und Effizienz der Vektorsuche für bekannte Informationen und die Flexibilität des Modells, neue Daten zu entdecken und zu laden, sobald sie relevant werden.</p>
<p>Schauen wir uns an, wie dies in einem realen System funktioniert. Nehmen wir zum Beispiel einen Produktionsdokumentationsassistenten. Die meisten Teams entscheiden sich schließlich für eine zweistufige Pipeline: Milvus-gestützte Vektorsuche + agentenbasiertes JIT-Retrieval.</p>
<p><strong>1. Milvus-gestützte Vektorsuche (Pre-retrieval)</strong></p>
<ul>
<li><p>Konvertieren Sie Ihre Dokumentation, API-Referenzen, Änderungsprotokolle und bekannte Probleme in Einbettungen.</p></li>
<li><p>Speichern Sie sie in der Milvus-Vektor-Datenbank mit Metadaten wie Produktbereich, Version und Aktualisierungszeit.</p></li>
<li><p>Wenn ein Benutzer eine Frage stellt, führen Sie eine semantische Suche durch, um die wichtigsten K relevanten Segmente zu erfassen.</p></li>
</ul>
<p>Auf diese Weise werden etwa 80 % der Routineanfragen in weniger als 500 ms gelöst, wodurch das Modell einen starken, kontextresistenten Ausgangspunkt erhält.</p>
<p><strong>2. Agentengestützte Erkundung</strong></p>
<p>Wenn die anfängliche Suche nicht ausreicht, z. B. wenn der Benutzer nach etwas sehr Speziellem oder Zeitkritischem fragt, kann der Agent Tools aufrufen, um neue Informationen zu beschaffen:</p>
<ul>
<li><p>Verwendung von <code translate="no">search_code</code> zum Auffinden bestimmter Funktionen oder Dateien in der Codebasis</p></li>
<li><p>Verwenden Sie <code translate="no">run_query</code>, um Echtzeitdaten aus der Datenbank abzurufen.</p></li>
<li><p>Verwenden Sie <code translate="no">fetch_api</code>, um den aktuellen Systemstatus abzurufen.</p></li>
</ul>
<p>Diese Aufrufe dauern in der Regel <strong>3 bis 5 Sekunden</strong>, stellen aber sicher, dass das Modell immer mit aktuellen, genauen und relevanten Daten arbeitet - selbst bei Fragen, die das System vorher nicht vorhersehen konnte.</p>
<p>Diese hybride Struktur stellt sicher, dass der Kontext zeitnah, korrekt und aufgabenspezifisch bleibt, wodurch das Risiko einer Kontextverfälschung in langlaufenden Agenten-Workflows drastisch reduziert wird.</p>
<p>Milvus ist in diesen hybriden Szenarien besonders effektiv, weil es Folgendes unterstützt:</p>
<ul>
<li><p><strong>Vektorsuche + skalare Filterung</strong>, die semantische Relevanz mit strukturierten Beschränkungen kombiniert</p></li>
<li><p><strong>Inkrementelle Updates</strong>, so dass Einbettungen ohne Ausfallzeiten aktualisiert werden können</p></li>
</ul>
<p>Dies macht Milvus zu einem idealen Rückgrat für Systeme, die sowohl ein semantisches Verständnis als auch eine präzise Kontrolle darüber benötigen, was abgerufen wird.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sie könnten zum Beispiel eine Abfrage wie diese durchführen:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Wie wählt man den richtigen Ansatz für den Umgang mit Context Rot<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Da es sowohl die Vektorsuche als auch die Just-in-Time-Suche und die hybride Suche gibt, stellt sich natürlich die Frage, <strong>welche Methode Sie verwenden sollten.</strong></p>
<p>Hier ist ein einfacher, aber praktischer Weg zur Auswahl - je nachdem, wie <em>stabil</em> Ihr Wissen ist und wie <em>vorhersehbar</em> der Informationsbedarf des Modells ist.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Vektorsuche → Am besten für stabile Bereiche</h3><p>Wenn sich der Bereich nur langsam ändert, aber Präzision erfordert - Finanzen, juristische Arbeit, Einhaltung von Vorschriften, medizinische Dokumentation - dann ist eine von Milvus betriebene Wissensdatenbank mit <strong>Pre-Retrieval</strong> in der Regel die richtige Lösung.</p>
<p>Die Informationen sind klar definiert, Aktualisierungen kommen selten vor und die meisten Fragen können durch das Abrufen semantisch relevanter Dokumente im Voraus beantwortet werden.</p>
<p><strong>Vorhersehbare Aufgaben + stabiles Wissen → Pre-Retrieval.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Just-in-Time Retrieval → Am besten für dynamische, explorative Arbeitsabläufe</h3><p>In Bereichen wie Software-Engineering, Debugging, Analytik und Datenwissenschaft ändern sich die Umgebungen schnell: neue Dateien, neue Daten, neue Bereitstellungszustände. Das Modell kann nicht vorhersagen, was es benötigt, bevor die Aufgabe beginnt.</p>
<p><strong>Unvorhersehbare Aufgaben + sich schnell änderndes Wissen → Just-in-Time-Abfrage.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Hybrider Ansatz → Wenn beide Bedingungen erfüllt sind</h3><p>Viele reale Systeme sind weder rein stabil noch rein dynamisch. Beispielsweise ändert sich die Entwicklerdokumentation nur langsam, während sich der Zustand einer Produktionsumgebung im Minutentakt ändert. Mit einem hybriden Ansatz können Sie:</p>
<ul>
<li><p>Laden von bekanntem, stabilem Wissen mittels Vektorsuche (schnell, geringe Latenz)</p></li>
<li><p>Abrufen dynamischer Informationen mit Agententools bei Bedarf (genau, aktuell)</p></li>
</ul>
<p><strong>Gemischtes Wissen + gemischte Aufgabenstruktur → Hybrider Retrieval-Ansatz.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">Was, wenn das Kontextfenster immer noch nicht ausreicht?<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Kontext-Engineering hilft, die Überlastung zu reduzieren, aber manchmal ist das Problem grundlegender: <strong>Die Aufgabe passt einfach nicht</strong>, selbst bei sorgfältigem Zuschnitt.</p>
<p>Bestimmte Arbeitsabläufe - wie die Migration einer großen Codebasis, die Überprüfung von Architekturen mit mehreren Repositories oder die Erstellung umfangreicher Forschungsberichte - können mehr als 200.000 Kontextfenster umfassen, bevor das Modell das Ende der Aufgabe erreicht. Selbst wenn die Vektorsuche die Hauptarbeit leistet, erfordern einige Aufgaben einen beständigeren, strukturierten Speicher.</p>
<p>Vor kurzem hat Anthropic drei praktische Strategien angeboten.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. Komprimierung: Signal bewahren, Rauschen entfernen</h3><p>Wenn sich das Kontextfenster seiner Grenze nähert, kann das Modell <strong>frühere Interaktionen</strong> zu prägnanten Zusammenfassungen <strong>komprimieren</strong>. Eine gute Komprimierung erhält</p>
<ul>
<li><p>Wichtige Entscheidungen</p></li>
<li><p>Beschränkungen und Anforderungen</p></li>
<li><p>Offene Fragen</p></li>
<li><p>Relevante Muster oder Beispiele</p></li>
</ul>
<p>Und beseitigt:</p>
<ul>
<li><p>Ausführliche Werkzeugausgaben</p></li>
<li><p>Irrelevante Protokolle</p></li>
<li><p>Redundante Schritte</p></li>
</ul>
<p>Die Herausforderung ist das Gleichgewicht. Wenn Sie zu stark komprimieren, gehen dem Modell wichtige Informationen verloren; wenn Sie zu wenig komprimieren, gewinnen Sie nur wenig Platz. Bei einer effektiven Komprimierung bleiben das "Warum" und das "Was" erhalten, während das "Wie wir hierher gekommen sind" weggelassen wird.</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Strukturierte Notizen: Stabile Informationen aus dem Kontext herausnehmen</h3><p>Anstatt alles innerhalb des Modellfensters zu speichern, kann das System wichtige Fakten in einem <strong>externen Speicher</strong>ablegen <strong>- einer</strong>separaten Datenbank oder einem strukturierten Speicher, den der Agent bei Bedarf abfragen kann.</p>
<p>Claudes Pokémon-Agent-Prototyp speichert zum Beispiel dauerhafte Fakten wie:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>In der Zwischenzeit bleiben flüchtige Details - Kampfprotokolle, lange Werkzeugausgaben - außerhalb des aktiven Kontexts. Dies spiegelt die Verwendung von Notizbüchern durch Menschen wider: Wir speichern nicht jedes Detail in unserem Arbeitsspeicher; wir speichern Referenzpunkte extern und schlagen sie bei Bedarf nach.</p>
<p>Die strukturierte Aufzeichnung von Notizen verhindert, dass der Kontext durch wiederholte, unnötige Details verfälscht wird, und gibt dem Modell eine zuverlässige Quelle der Wahrheit.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Unter-Agenten-Architektur: Aufteilung und Eroberung großer Aufgaben</h3><p>Für komplexe Aufgaben kann eine Multi-Agenten-Architektur entworfen werden, bei der ein leitender Agent die Gesamtarbeit überwacht, während mehrere spezialisierte Sub-Agenten bestimmte Aspekte der Aufgabe bearbeiten. Diese Subagenten tauchen tief in große Datenmengen ein, die mit ihren Teilaufgaben zusammenhängen, liefern aber nur die knappen, wesentlichen Ergebnisse zurück. Dieser Ansatz wird häufig in Szenarien wie Forschungsberichten oder Datenanalysen verwendet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In der Praxis ist es am besten, mit einem einzigen Agenten in Kombination mit einer Komprimierung zu beginnen, um die Aufgabe zu bewältigen. Externer Speicher sollte nur dann eingesetzt werden, wenn die Notwendigkeit besteht, den Speicher über Sitzungen hinweg beizubehalten. Die Multi-Agenten-Architektur sollte für Aufgaben reserviert werden, die tatsächlich eine parallele Verarbeitung komplexer, spezialisierter Teilaufgaben erfordern.</p>
<p>Jeder Ansatz erweitert den effektiven "Arbeitsspeicher" des Systems, ohne das Kontextfenster zu sprengen - und ohne einen Kontextwechsel auszulösen.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Bewährte Praktiken für das Entwerfen von Kontext, der tatsächlich funktioniert<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Nach der Behandlung des Kontextüberlaufs gibt es einen weiteren, ebenso wichtigen Punkt: die Art und Weise, wie der Kontext überhaupt erstellt wird. Selbst mit Komprimierung, externen Notizen und Unteragenten wird das System Probleme haben, wenn die Eingabeaufforderung und die Tools selbst nicht für lange, komplexe Argumentationen ausgelegt sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic bietet eine hilfreiche Möglichkeit, dies zu betrachten - weniger als eine einzelne Übung zum Schreiben von Prompts, sondern vielmehr als die Konstruktion von Kontext auf drei Ebenen.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>System-Eingabeaufforderungen: Finden Sie die Goldlöckchen-Zone</strong></h3><p>Die meisten Systemaufforderungen scheitern an den Extremen. Zu viele Details - Listen von Regeln, verschachtelte Bedingungen, fest kodierte Ausnahmen - machen den Prompt spröde und schwer zu pflegen. Zu wenig Struktur lässt das Modell raten, was es tun soll.</p>
<p>Die besten Prompts liegen in der Mitte: strukturiert genug, um das Verhalten zu lenken, und flexibel genug, damit das Modell logisch denken kann. In der Praxis bedeutet dies, dass man dem Modell eine klare Rolle, einen allgemeinen Arbeitsablauf und eine leichte Anleitung für das Werkzeug gibt - nicht mehr und nicht weniger.</p>
<p>Ein Beispiel:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Diese Eingabeaufforderung gibt die Richtung vor, ohne das Modell zu überwältigen oder es zu zwingen, mit dynamischen Informationen zu jonglieren, die hier nicht hingehören.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Werkzeug-Design: Weniger ist mehr</h3><p>Sobald die Systemaufforderung das Verhalten auf hoher Ebene festlegt, übernehmen die Werkzeuge die eigentliche Betriebslogik. Ein überraschenderweise häufiger Fehler in werkzeugunterstützten Systemen besteht darin, dass einfach zu viele Werkzeuge vorhanden sind - oder Werkzeuge, deren Zwecke sich überschneiden.</p>
<p>Eine gute Faustregel ist:</p>
<ul>
<li><p><strong>Ein Werkzeug, ein Zweck</strong></p></li>
<li><p><strong>Explizite, unmissverständliche Parameter</strong></p></li>
<li><p><strong>Keine sich überschneidenden Zuständigkeiten</strong></p></li>
</ul>
<p>Wenn ein menschlicher Ingenieur zögern würde, welches Werkzeug er verwenden soll, wird es auch das Modell tun. Ein sauberes Werkzeugdesign reduziert Mehrdeutigkeit, senkt die kognitive Belastung und verhindert, dass der Kontext mit unnötigen Werkzeugversuchen überladen wird.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">Dynamische Informationen sollten abgerufen und nicht fest kodiert werden</h3><p>Die letzte Ebene ist diejenige, die am leichtesten zu übersehen ist. Dynamische oder zeitkritische Informationen - wie Statuswerte, jüngste Aktualisierungen oder benutzerspezifische Zustände - sollten in der Systemeingabeaufforderung überhaupt nicht erscheinen. Das Einbinden in die Eingabeaufforderung garantiert, dass sie bei langen Aufgaben veraltet, aufgebläht oder widersprüchlich wird.</p>
<p>Stattdessen sollten diese Informationen nur bei Bedarf abgerufen werden, entweder durch Abruf oder über Agententools. Die Herausnahme dynamischer Inhalte aus dem Systemprompt verhindert das Verrotten des Kontexts und hält den Argumentationsraum des Modells sauber.</p>
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
    </button></h2><p>Mit dem Einzug von KI-Agenten in Produktionsumgebungen in verschiedenen Branchen übernehmen sie längere Arbeitsabläufe und komplexere Aufgaben als je zuvor. In diesen Umgebungen wird die Verwaltung von Kontext zu einer praktischen Notwendigkeit.</p>
<p><strong>Ein größeres Kontextfenster führt jedoch nicht automatisch zu besseren Ergebnissen</strong>; in vielen Fällen bewirkt es sogar das Gegenteil. Wenn ein Modell überlastet ist, mit veralteten Informationen gefüttert wird oder durch massive Aufforderungen gezwungen wird, sinkt die Genauigkeit still und leise. Diese langsame, subtile Verschlechterung nennen wir heute <strong>Kontextfäule</strong>.</p>
<p>Techniken wie JIT-Retrieval, Pre-Retrieval, hybride Pipelines und vektorbasierte semantische Suche zielen alle auf dasselbe Ziel ab: <strong>sicherzustellen, dass das Modell die richtigen Informationen zum richtigen Zeitpunkt sieht - nicht mehr und nicht weniger -, damit es auf dem Boden der Tatsachen bleiben und zuverlässige Antworten liefern kann.</strong></p>
<p>Als quelloffene, hochleistungsfähige Vektordatenbank bildet <a href="https://milvus.io/"><strong>Milvus</strong></a> den Kern dieses Workflows. Sie bietet die Infrastruktur, um Wissen effizient zu speichern und die relevantesten Teile mit geringer Latenzzeit abzurufen. In Kombination mit JIT-Abrufen und anderen ergänzenden Strategien hilft Milvus den KI-Agenten, auch bei immer umfangreicheren und dynamischeren Aufgaben präzise zu bleiben.</p>
<p>Aber die Abfrage ist nur ein Teil des Puzzles. Ein gutes Prompt-Design, ein sauberes und minimales Toolset und sinnvolle Overflow-Strategien - ob Komprimierung, strukturierte Notizen oder Sub-Agenten - sorgen dafür, dass das Modell über lange Sitzungen hinweg konzentriert bleibt. So sieht echtes Context Engineering aus: keine cleveren Hacks, sondern eine durchdachte Architektur.</p>
<p>Wenn Sie möchten, dass KI-Agenten über Stunden, Tage oder ganze Arbeitsabläufe hinweg präzise arbeiten, verdient der Kontext die gleiche Aufmerksamkeit, die Sie auch jedem anderen Kernbestandteil Ihres Stacks widmen.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitungen und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
