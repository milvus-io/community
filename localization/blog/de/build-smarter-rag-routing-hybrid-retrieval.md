---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Jenseits von Naive RAG: Aufbau intelligenter Systeme mit Query Routing und
  Hybrid Retrieval
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Erfahren Sie, wie moderne RAG-Systeme Abfrage-Routing, hybrides Retrieval und
  stufenweise Auswertung nutzen, um bessere Antworten zu geringeren Kosten zu
  liefern.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>Ihre <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipeline</a> ruft für jede Abfrage Dokumente ab, unabhängig davon, ob ein Abruf erforderlich ist. Sie führt die gleiche Ähnlichkeitssuche für Code, natürliche Sprache und Finanzberichte durch. Und wenn die Ergebnisse schlecht sind, können Sie nicht feststellen, welche Stufe defekt ist.</p>
<p>Dies sind die Symptome einer naiven RAG - einer festen Pipeline, die jede Abfrage auf die gleiche Weise behandelt. Moderne RAG-Systeme arbeiten anders. Sie leiten Abfragen an den richtigen Handler weiter, kombinieren mehrere Abfragemethoden und bewerten jede Stufe unabhängig.</p>
<p>In diesem Artikel wird eine Vier-Knoten-Architektur für den Aufbau intelligenterer RAG-Systeme vorgestellt. Es wird erläutert, wie <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">hybride Abfragen</a> ohne die Pflege separater Indizes implementiert werden können, und es wird gezeigt, wie jede Pipelinestufe ausgewertet werden kann, damit Sie Probleme schneller beheben können.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Warum Long Context RAG nicht ersetzen kann<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Einfach alles in die Eingabeaufforderung packen" ist ein gängiger Vorschlag, jetzt wo Modelle 128K+ Token-Fenster unterstützen. In der Produktion ist das aus zwei Gründen nicht haltbar.</p>
<p><strong>Die Kosten skalieren mit Ihrer Wissensbasis, nicht mit Ihrer Anfrage.</strong> Bei jeder Anfrage wird die gesamte Wissensbasis durch das Modell geschickt. Bei einem Korpus mit 100.000 Token sind das 100.000 Eingabe-Token pro Anfrage - unabhängig davon, ob die Antwort einen oder zehn Absätze erfordert. Die monatlichen Inferenzkosten wachsen linear mit der Korpusgröße.</p>
<p><strong>Die Aufmerksamkeit nimmt mit der Länge des Kontexts ab.</strong> Modelle haben Schwierigkeiten, sich auf relevante Informationen zu konzentrieren, die in langen Kontexten verborgen sind. Forschungen zum "lost in the middle"-Effekt (Liu et al., 2023) zeigen, dass Modelle eher dazu neigen, Informationen zu übersehen, die sich in der Mitte von langen Eingaben befinden. Größere Kontextfenster haben dieses Problem nicht gelöst - die Aufmerksamkeitsqualität hat nicht mit der Fenstergröße Schritt gehalten.</p>
<p>RAG umgeht beide Probleme, indem es vor der Generierung nur die relevanten Passagen abruft. Die Frage ist nicht, ob RAG notwendig ist, sondern wie man RAG so gestaltet, dass es tatsächlich funktioniert.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">Was ist falsch an der traditionellen RAG?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Traditionelle RAG folgt einer festen Pipeline: Einbettung der Anfrage, Durchführung einer <a href="https://zilliz.com/learn/what-is-vector-search">Vektorähnlichkeitssuche</a>, Übernahme der Top-K-Ergebnisse, Generierung einer Antwort. Jede Abfrage folgt demselben Pfad.</p>
<p>Dies führt zu zwei Problemen:</p>
<ol>
<li><p><strong>Vergeudete Rechenleistung bei trivialen Abfragen.</strong> Die Frage "Was ist 2 + 2?" muss nicht abgerufen werden, aber das System führt sie trotzdem aus - mit zusätzlichen Latenzzeiten und Kosten ohne Nutzen.</p></li>
<li><p><strong>Sprödes Retrieval bei komplexen Abfragen.</strong> Zweideutige Formulierungen, Synonyme oder gemischtsprachige Abfragen machen die reine Vektorähnlichkeit oft zunichte. Wenn beim Abruf relevante Dokumente nicht gefunden werden, sinkt die Qualität der Generierung ohne Ausweichmöglichkeit.</p></li>
</ol>
<p>Die Lösung: eine Entscheidungsfindung vor dem Abruf. Ein modernes RAG-System entscheidet <em>, ob</em> es abgerufen wird, <em>wonach</em> es sucht und <em>wie</em> es sucht - anstatt jedes Mal blind dieselbe Pipeline ablaufen zu lassen.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Wie moderne RAG-Systeme funktionieren: Eine Vier-Knoten-Architektur<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anstelle einer festen Pipeline leitet ein modernes RAG-System jede Anfrage durch vier Entscheidungsknoten. Jeder Knoten beantwortet eine Frage, wie die aktuelle Anfrage zu behandeln ist.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Knoten 1: Abfrage-Routing - Muss diese Abfrage abgerufen werden?</h3><p>Das Query Routing ist die erste Entscheidung in der Pipeline. Sie klassifiziert die eingehende Abfrage und sendet sie über den entsprechenden Pfad:</p>
<table>
<thead>
<tr><th>Abfragetyp</th><th>Beispiel</th><th>Aktion</th></tr>
</thead>
<tbody>
<tr><td>Gesunder Menschenverstand / Allgemeinwissen</td><td>"Was ist 2 + 2?"</td><td>Beantworten Sie direkt mit dem LLM-Skip Retrieval</td></tr>
<tr><td>Wissensbasierte Frage</td><td>"Wie lauten die Spezifikationen für Model X?"</td><td>Weiterleitung an die Retrieval-Pipeline</td></tr>
<tr><td>Informationen in Echtzeit</td><td>"Wetter in Paris an diesem Wochenende"</td><td>Aufrufen einer externen API</td></tr>
</tbody>
</table>
<p>Durch das Routing im Vorfeld werden unnötige Abfragen vermieden, die nicht erforderlich sind. In Systemen, in denen ein großer Teil der Abfragen einfach oder allgemein bekannt ist, können allein dadurch die Rechenkosten erheblich gesenkt werden.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Knoten 2: Abfrageumformung - Wonach soll das System suchen?</h3><p>Benutzeranfragen sind oft vage. Eine Frage wie "die wichtigsten Zahlen im Q3-Bericht von LightOn" lässt sich nicht gut in eine Suchanfrage übersetzen.</p>
<p>Das Query Rewriting wandelt die ursprüngliche Frage in strukturierte Suchbedingungen um:</p>
<ul>
<li><strong>Zeitspanne:</strong> 1. Juli - 30. September 2025 (Q3)</li>
<li><strong>Dokumenttyp:</strong> Finanzbericht</li>
<li><strong>Entität:</strong> LightOn, Finanzabteilung</li>
</ul>
<p>Dieser Schritt schließt die Lücke zwischen der Art und Weise, wie Nutzer Fragen stellen, und der Art und Weise, wie Retrievalsysteme Dokumente indizieren. Bessere Abfragen bedeuten weniger irrelevante Ergebnisse.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Knoten 3: Auswahl der Retrieval-Strategie - Wie soll das System suchen?</h3><p>Unterschiedliche Inhaltstypen erfordern unterschiedliche Suchstrategien. Eine einzige Methode kann nicht alles abdecken:</p>
<table>
<thead>
<tr><th>Inhaltstyp</th><th>Beste Abfragemethode</th><th>Warum</th></tr>
</thead>
<tbody>
<tr><td>Code (Variablennamen, Funktionssignaturen)</td><td>Lexikalische Suche<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>Genaue Schlüsselwortsuche funktioniert gut bei strukturierten Token</td></tr>
<tr><td>Natürliche Sprache (Dokumente, Artikel)</td><td>Semantische Suche (dichte Vektoren)</td><td>Verarbeitet Synonyme, Umschreibungen und Absicht</td></tr>
<tr><td>Multimodal (Tabellen, Diagramme, Zeichnungen)</td><td>Multimodale Abfrage</td><td>Erfasst visuelle Strukturen, die bei der Textextraktion nicht berücksichtigt werden</td></tr>
</tbody>
</table>
<p>Die Dokumente werden bei der Indizierung mit Metadaten versehen. Bei der Abfrage leiten diese Tags sowohl die zu durchsuchenden Dokumente als auch die zu verwendende Abrufmethode.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Knoten 4: Minimal-Context-Generierung - Wie viel Kontext braucht das Modell?</h3><p>Nach dem Abruf und der <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">Neueinstufung</a> sendet das System nur die relevantesten Passagen an das Modell - nicht ganze Dokumente.</p>
<p>Dies ist wichtiger als es klingt. Verglichen mit dem Laden ganzer Dokumente kann durch die Übermittlung nur der relevanten Passagen die Verwendung von Token um über 90 % reduziert werden. Eine geringere Anzahl von Token bedeutet schnellere Antworten und geringere Kosten, selbst wenn Caching im Spiel ist.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Warum Hybrid Retrieval für Enterprise RAG wichtig ist<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In der Praxis ist die Auswahl der Abrufstrategie (Knoten 3) der Punkt, an dem die meisten Teams nicht weiterkommen. Es gibt keine einzige Retrieval-Methode, die alle Arten von Unternehmensdokumenten abdeckt.</p>
<p>Einige argumentieren, dass die Suche nach Schlüsselwörtern ausreicht - schließlich funktioniert die grep-basierte Codesuche von Claude Code gut. Aber Code ist stark strukturiert und hat einheitliche Namenskonventionen. Unternehmensdokumente sind eine andere Geschichte.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Unternehmensdokumente sind chaotisch</h3><p><strong>Synonyme und unterschiedliche Formulierungen.</strong> "Speichernutzung optimieren" und "Speicherplatzbedarf reduzieren" bedeuten dasselbe, verwenden aber unterschiedliche Wörter. Die Suche nach Schlüsselwörtern findet das eine und das andere nicht. In mehrsprachigen Umgebungen - Chinesisch mit Wortsegmentierung, Japanisch mit gemischten Schriftzeichen, Deutsch mit zusammengesetzten Wörtern - vervielfacht sich das Problem.</p>
<p><strong>Die visuelle Struktur ist wichtig.</strong> Technische Zeichnungen hängen vom Layout ab. Finanzberichte beruhen auf Tabellen. Medizinische Bilder hängen von räumlichen Beziehungen ab. OCR extrahiert Text, verliert aber die Struktur. Reine Textabfragen können diese Dokumente nicht zuverlässig verarbeiten.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Wie man hybrides Retrieval implementiert</h3><p>Hybrides Retrieval kombiniert mehrere Suchmethoden - typischerweise <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 für den Abgleich von Schlüsselwörtern und dichte Vektoren für die semantische Suche -, um</a>das abzudecken, was keine der beiden Methoden allein bewältigt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Beim herkömmlichen Ansatz werden zwei getrennte Systeme betrieben: eines für BM25 und eines für die Vektorsuche. Jede Anfrage durchläuft beide, und die Ergebnisse werden anschließend zusammengeführt. Das funktioniert, ist aber mit einem echten Overhead verbunden:</p>
<table>
<thead>
<tr><th></th><th>Traditionell (getrennte Systeme)</th><th>Vereinheitlicht (eine Sammlung)</th></tr>
</thead>
<tbody>
<tr><td>Speicherung</td><td>Zwei separate Indizes</td><td>Eine Sammlung, beide Vektortypen</td></tr>
<tr><td>Daten-Synchronisation</td><td>Zwei Systeme müssen synchronisiert werden</td><td>Ein einziger Schreibpfad</td></tr>
<tr><td>Abfragepfad</td><td>Zwei Abfragen + Zusammenführung der Ergebnisse</td><td>Ein API-Aufruf, automatische Zusammenführung</td></tr>
<tr><td>Abstimmung</td><td>Anpassung der Zusammenführungsgewichte über Systeme hinweg</td><td>Änderung der dichten/sparsamen Gewichtung in einer Abfrage</td></tr>
<tr><td>Operative Komplexität</td><td>Hoch</td><td>Niedrig</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 unterstützt sowohl dichte Vektoren (für die semantische Suche) als auch spärliche Vektoren (für die BM25-ähnliche Stichwortsuche) in derselben Sammlung. Ein einziger API-Aufruf liefert fusionierte Ergebnisse, wobei das Abrufverhalten durch Änderung der Gewichtung zwischen den Vektortypen angepasst werden kann. Keine separaten Indizes, keine Synchronisationsprobleme, keine Latenz beim Zusammenführen.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Wie man eine RAG-Pipeline Stufe für Stufe auswertet<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Es reicht nicht aus, nur die endgültige Antwort zu überprüfen. RAG ist eine mehrstufige Pipeline, und ein Fehler in einer beliebigen Stufe wirkt sich auf die nachfolgenden Stufen aus. Wenn Sie nur die Antwortqualität messen, können Sie nicht feststellen, ob das Problem beim Routing, Rewriting, Retrieval, Reranking oder der Generierung liegt.</p>
<p>Wenn Benutzer "ungenaue Ergebnisse" melden, kann die Ursache überall liegen: Das Routing kann den Abruf überspringen, wenn es nicht sollte; das Rewriting von Abfragen kann wichtige Entitäten auslassen; der Abruf kann relevante Dokumente übersehen; das Reranking kann gute Ergebnisse begraben; oder das Modell kann den abgerufenen Kontext völlig ignorieren.</p>
<p>Bewerten Sie jede Phase mit ihren eigenen Metriken:</p>
<table>
<thead>
<tr><th>Stufe</th><th>Metrik</th><th>Was es abfängt</th></tr>
</thead>
<tbody>
<tr><td>Weiterleitung</td><td>F1-Wert</td><td>Hohe Falsch-Negativ-Rate = Abfragen, die abgerufen werden müssen, werden übersprungen</td></tr>
<tr><td>Umschreiben von Suchanfragen</td><td>Genauigkeit der Entitätsextraktion, Abdeckung von Synonymen</td><td>Umgeschriebene Abfrage lässt wichtige Begriffe aus oder ändert die Absicht</td></tr>
<tr><td>Abruf</td><td>Rückruf@K, NDCG@10</td><td>Relevante Dokumente werden nicht abgerufen oder sind zu niedrig eingestuft</td></tr>
<tr><td>Neueinstufung</td><td>Genauigkeit@3</td><td>Die besten Ergebnisse sind nicht wirklich relevant</td></tr>
<tr><td>Generierung</td><td>Treue, Vollständigkeit der Antworten</td><td>Modell ignoriert abgerufenen Kontext oder gibt Teilantworten</td></tr>
</tbody>
</table>
<p><strong>Richten Sie eine mehrstufige Überwachung ein.</strong> Verwenden Sie Offline-Testsätze, um Basiswerte für jede Stufe zu definieren. Lösen Sie in der Produktion Warnungen aus, wenn eine Stufe unter ihre Basislinie fällt. Auf diese Weise können Sie Regressionen frühzeitig erkennen und zu einer bestimmten Phase zurückverfolgen - anstatt zu raten.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">Was Sie zuerst entwickeln sollten<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Drei Prioritäten zeichnen sich bei der Implementierung von RAG in der Praxis ab:</p>
<ol>
<li><p><strong>Frühzeitiges Hinzufügen von Routing.</strong> Viele Abfragen müssen gar nicht abgerufen werden. Das Filtern dieser Abfragen im Vorfeld reduziert die Last und verbessert die Antwortzeit mit minimalem technischen Aufwand.</p></li>
<li><p><strong>Verwenden Sie ein einheitliches hybrides Retrieval.</strong> Wenn Sie getrennte BM25- und Vektorsuchsysteme unterhalten, verdoppeln sich die Speicherkosten, die Komplexität der Synchronisierung steigt und die Latenzzeit für die Zusammenführung nimmt zu. Ein vereinheitlichtes System wie Milvus 2.6, bei dem dichte und spärliche Vektoren in derselben Sammlung enthalten sind, beseitigt diese Probleme.</p></li>
<li><p><strong>Bewerten Sie jede Stufe unabhängig.</strong> Die End-to-End-Antwortqualität allein ist kein nützliches Signal. Durch stufenweise Metriken (F1 für Routing, Recall@K und NDCG für Retrieval) können Sie schneller debuggen und vermeiden, eine Stufe zu zerstören, während Sie eine andere optimieren.</p></li>
</ol>
<p>Der wahre Wert eines modernen RAG-Systems liegt nicht nur in der Suche, sondern auch darin, <em>zu</em> wissen, <em>wann</em> und <em>wie</em> gesucht werden soll. Beginnen Sie mit Routing und vereinheitlichter hybrider Suche, und Sie haben eine Grundlage, die sich skalieren lässt.</p>
<hr>
<p>Wenn Sie ein RAG-System aufbauen oder aktualisieren und Probleme mit der Abrufqualität haben, würden wir Ihnen gerne helfen:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um Fragen zu stellen, Ihre Architektur zu teilen und von anderen Entwicklern zu lernen, die an ähnlichen Problemen arbeiten.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihren Anwendungsfall durchzugehen - egal, ob es sich um das Routing-Design, die Einrichtung eines hybriden Retrievals oder eine mehrstufige Auswertung handelt.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltet von Milvus) eine kostenlose Stufe für den Einstieg.</li>
</ul>
<hr>
<p>Einige Fragen, die häufig auftauchen, wenn Teams mit dem Aufbau intelligenterer RAG-Systeme beginnen:</p>
<p><strong>F: Ist RAG immer noch notwendig, jetzt wo die Modelle 128K+ Kontextfenster unterstützen?</strong></p>
<p>Ja. Lange Kontextfenster sind hilfreich, wenn Sie ein einzelnes großes Dokument verarbeiten müssen, aber sie ersetzen nicht das Retrieval für Wissensdatenbankabfragen. Das Versenden des gesamten Korpus bei jeder Anfrage treibt die Kosten linear in die Höhe, und die Modelle verlieren bei langen Kontexten den Fokus auf relevante Informationen - ein gut dokumentiertes Problem, das als "Lost in the middle"-Effekt bekannt ist (Liu et al., 2023). RAG ruft nur das ab, was relevant ist, so dass Kosten und Latenzzeiten vorhersehbar bleiben.</p>
<p><strong>F: Wie kombiniere ich BM25 und Vektorsuche, ohne zwei getrennte Systeme zu betreiben?</strong></p>
<p>Verwenden Sie eine Vektordatenbank, die sowohl dichte als auch spärliche Vektoren in derselben Sammlung unterstützt. Milvus 2.6 speichert beide Vektortypen pro Dokument und liefert fusionierte Ergebnisse aus einer einzigen Abfrage. Sie können das Gleichgewicht zwischen Schlüsselwort- und semantischem Abgleich durch Ändern eines Gewichtungsparameters einstellen - keine separaten Indizes, kein Zusammenführen von Ergebnissen, keine Synchronisationsprobleme.</p>
<p><strong>F: Was sollte ich als erstes hinzufügen, um meine bestehende RAG-Pipeline zu verbessern?</strong></p>
<p>Abfrage-Routing. Das ist die Verbesserung mit der größten Auswirkung und dem geringsten Aufwand. In den meisten Produktionssystemen gibt es einen beträchtlichen Anteil an Abfragen, die überhaupt nicht abgerufen werden müssen - Fragen des gesunden Menschenverstands, einfache Berechnungen, allgemeines Wissen. Wenn diese direkt an den LLM weitergeleitet werden, werden unnötige Abrufe vermieden und die Antwortzeit sofort verbessert.</p>
<p><strong>F: Wie kann ich herausfinden, welche Phase meiner RAG-Pipeline schlechte Ergebnisse verursacht?</strong></p>
<p>Bewerten Sie jede Stufe unabhängig. Verwenden Sie den F1-Wert für die Routing-Genauigkeit, Recall@K und NDCG@10 für die Abrufqualität, Precision@3 für das Reranking und die Treuemetriken für die Generierung. Legen Sie Basiswerte aus Offline-Testdaten fest und überwachen Sie jede Phase in der Produktion. Wenn die Qualität der Antworten abnimmt, können Sie die Ursache für den Rückgang auf die jeweilige Stufe zurückführen, anstatt zu raten.</p>
