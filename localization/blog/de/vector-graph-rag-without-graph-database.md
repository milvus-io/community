---
id: vector-graph-rag-without-graph-database.md
title: Wir haben Graph RAG ohne die Graphdatenbank gebaut
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Open-Source Vector Graph RAG fügt RAG Multi-Hop-Folgerungen hinzu und
  verwendet dabei nur Milvus. 87.8% Recall@5, 2 LLM-Aufrufe pro Anfrage, keine
  Graphdatenbank erforderlich.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>Braucht man für Graph RAG tatsächlich eine Graphdatenbank? Nein. Geben Sie Entitäten, Relationen und Passagen in Milvus ein. Verwenden Sie Subgraphenexpansion anstelle von Graphentraversal und einen LLM-Rerank anstelle von Mehrrunden-Agentenschleifen. Das ist</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a><strong><em>,</em></strong> <em>und das ist es, was wir gebaut haben. Dieser Ansatz erreicht 87,8 % durchschnittlichen Recall@5 bei drei Multi-Hop-QA-Benchmarks und schlägt HippoRAG 2 bei einer einzelnen Milvus-Instanz.</em></p>
</blockquote>
<p>Multi-Hop-Fragen sind die Mauer, gegen die die meisten RAG-Pipelines irgendwann anrennen. Die Antwort ist im Korpus vorhanden, aber sie erstreckt sich über mehrere Passagen, die durch Entitäten verbunden sind, die in der Frage nie genannt werden. Die übliche Lösung besteht darin, eine Graphdatenbank hinzuzufügen, was bedeutet, dass zwei Systeme anstelle von einem betrieben werden.</p>
<p>Wir sind selbst immer wieder an diese Grenze gestoßen und wollten nicht zwei Datenbanken betreiben, nur um das zu bewältigen. Also haben wir <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> entwickelt und als Open Source zur Verfügung gestellt, eine Python-Bibliothek, die Multi-Hop-Reasoning in <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> ermöglicht und dabei nur <a href="https://milvus.io/docs">Milvus</a>, die am weitesten verbreitete Open-Source-Vektordatenbank, verwendet. Sie bietet die gleiche Multi-Hop-Fähigkeit mit einer Datenbank statt zwei.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Warum Multi-Hop-Fragen den Standard-RAG brechen<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Multi-Hop-Fragen brechen Standard-RAG, weil die Antwort von Entitätsbeziehungen abhängt, die die Vektorsuche nicht sehen kann. Die Brückenentität, die die Frage mit der Antwort verbindet, befindet sich oft nicht in der Frage selbst.</p>
<p>Einfache Fragen funktionieren gut. Man zerlegt Dokumente, bettet sie ein, sucht die engsten Übereinstimmungen heraus und gibt sie an einen LLM weiter. Die Frage "Welche Indizes unterstützt Milvus?" steht in einem Abschnitt, und die Vektorsuche findet sie.</p>
<p>Multi-Hop-Fragen passen nicht in dieses Muster. Nehmen wir eine Frage wie <em>"Auf welche Nebenwirkungen sollte ich bei Diabetes-Medikamenten der ersten Wahl achten?"</em> in einer medizinischen Wissensdatenbank.</p>
<p>Die Beantwortung dieser Frage erfordert zwei Denkschritte. Zunächst muss das System wissen, dass Metformin das Mittel der ersten Wahl bei Diabetes ist. Erst dann kann es die Nebenwirkungen von Metformin nachschlagen: Überwachung der Nierenfunktion, Magen-Darm-Beschwerden, Vitamin-B12-Mangel.</p>
<p>"Metformin" ist die Brückeneinheit. Es verbindet die Frage mit der Antwort, wird aber in der Frage nicht erwähnt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>An dieser Stelle hört die <a href="https://zilliz.com/learn/vector-similarity-search">Vector Ähnlichkeitssuche</a> auf. Sie findet Passagen, die wie die Frage aussehen, Diabetes-Behandlungsleitfäden und Listen mit Nebenwirkungen von Medikamenten, aber sie kann die Entitätsbeziehungen, die diese Passagen miteinander verbinden, nicht nachvollziehen. Fakten wie "Metformin ist das Mittel der ersten Wahl bei Diabetes" finden sich in diesen Beziehungen, nicht im Text einer einzelnen Passage.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Warum Graphdatenbanken und Agentic RAG nicht die Antwort sind<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Standardmethoden zur Lösung von Multi-Hop-RAG sind Graphdatenbanken und iterative Agentenschleifen. Beide funktionieren. Beide kosten mehr, als die meisten Teams für eine einzige Funktion bezahlen wollen.</p>
<p>Nehmen Sie zunächst den Weg über die Graph-Datenbank. Sie extrahieren Tripel aus Ihren Dokumenten, speichern sie in einer Graphdatenbank und durchlaufen die Kanten, um Multi-Hop-Verbindungen zu finden. Das bedeutet, dass Sie ein zweites System neben Ihrer <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> betreiben, Cypher oder Gremlin lernen und die Graph- und Vektorspeicher synchron halten müssen.</p>
<p>Iterative Agentenschleifen sind der andere Ansatz. Der LLM ruft einen Stapel ab, prüft ihn, entscheidet, ob er genügend Kontext hat, und ruft ihn erneut ab, falls nicht. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) macht 3-5 LLM-Aufrufe pro Abfrage. Die agentenbasierte RAG kann 10 übersteigen, da der Agent entscheidet, wann er aufhört. Die Kosten pro Abfrage werden unvorhersehbar, und die P99-Latenzzeit steigt an, wenn der Agent zusätzliche Runden durchführt.</p>
<p>Beides eignet sich nicht für Teams, die Multi-Hop-Recherchen durchführen wollen, ohne ihren Stack neu aufbauen zu müssen. Also haben wir etwas anderes ausprobiert.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Was ist Vector Graph RAG, eine Graphenstruktur innerhalb einer Vektordatenbank?<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> ist eine quelloffene Python-Bibliothek, die Multi-Hop-Reasoning in <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> nur mit <a href="https://milvus.io/docs">Milvus</a> ermöglicht. Sie speichert die Graphstruktur als ID-Referenzen in drei Milvus-Sammlungen. Traversal wird zu einer Kette von Primärschlüssel-Lookups in Milvus anstelle von Cypher-Abfragen gegen eine Graphdatenbank. Ein Milvus erledigt beide Aufgaben.</p>
<p>Es funktioniert, weil Beziehungen in einem Wissensgraphen nur Text sind. Das Tripel <em>(Metformin, das Medikament der ersten Wahl bei Typ-2-Diabetes)</em> ist eine gerichtete Kante in einer Graphdatenbank. Es ist auch ein Satz: "Metformin ist das Mittel der ersten Wahl bei Typ-2-Diabetes." Sie können diesen Satz als Vektor einbetten und in <a href="https://milvus.io/docs">Milvus</a> speichern, genau wie jeden anderen Text.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Beantwortung einer Multi-Hop-Anfrage bedeutet, dass man Verbindungen von dem, was in der Anfrage erwähnt wird (wie "Diabetes") zu dem, was nicht erwähnt wird (wie "Metformin"), verfolgen muss. Das funktioniert nur, wenn die Speicherung diese Verbindungen beibehält: welche Entität mit welcher durch welche Beziehung verbunden ist. Einfacher Text ist durchsuchbar, aber nicht nachvollziehbar.</p>
<p>Damit die Verbindungen in Milvus nachvollziehbar bleiben, geben wir jeder Entität und jeder Beziehung eine eindeutige ID und speichern sie dann in separaten Sammlungen, die sich gegenseitig über die ID referenzieren. Insgesamt gibt es drei Sammlungen: <strong>Entitäten</strong> (die Knoten), <strong>Relationen</strong> (die Kanten) und <strong>Passagen</strong> (der Ausgangstext, den der LLM zur Generierung von Antworten benötigt). Jede Zeile hat eine Vektoreinbettung, so dass wir jede der drei Sammlungen semantisch durchsuchen können.</p>
<p><strong>Entitäten</strong> speichern deduplizierte Entitäten. Jede hat eine eindeutige ID, eine <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettung</a> für die <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a> und eine Liste von Beziehungs-IDs, an denen sie beteiligt ist.</p>
<table>
<thead>
<tr><th>id</th><th>Name</th><th>Einbettung</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>Metformin</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>Typ-2-Diabetes</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>Nierenfunktion</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>Beziehungen</strong> speichern Wissens-Tripel. Jedes Tripel enthält die IDs seiner Subjekt- und Objektentität, die IDs der Passagen, aus denen es stammt, und eine Einbettung des vollständigen Beziehungstextes.</p>
<table>
<thead>
<tr><th>id</th><th>Subjekt_id</th><th>objekt_id</th><th>Text</th><th>Einbettung</th><th>passage_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>Metformin ist das Mittel der ersten Wahl bei Typ-2-Diabetes</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Patienten, die Metformin einnehmen, sollten ihre Nierenfunktion überwachen lassen</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p>Die<strong>Passagen</strong> speichern die Originaldokumente mit Verweisen auf die Entitäten und Relationen, die aus ihnen extrahiert wurden.</p>
<p>Die drei Sammlungen verweisen über ID-Felder aufeinander: Entitäten tragen die IDs ihrer Relationen, Relationen tragen die IDs ihrer Subjekt- und Objektentitäten und Quellpassagen, und Passagen tragen die IDs von allem, was aus ihnen extrahiert wurde. Dieses Netzwerk von ID-Referenzen ist der Graph.</p>
<p>Traversal ist einfach eine Kette von ID-Lookups. Man holt die Entität e01, um ihre <code translate="no">relation_ids</code> zu erhalten, holt die Relationen r01 und r02 anhand dieser IDs, liest die <code translate="no">object_id</code> von r01, um die Entität e02 zu entdecken, und so weiter. Jeder Sprung ist eine <a href="https://milvus.io/docs/get-and-scalar-query.md">Standard-Milvus-Primärschlüsselabfrage</a>. Kein Cypher erforderlich.</p>
<p>Sie werden sich vielleicht fragen, ob sich die zusätzlichen Umwege zu Milvus lohnen. Das tun sie nicht. Die Erweiterung des Untergraphen kostet 2-3 ID-basierte Abfragen von insgesamt 20-30 ms. Der LLM-Aufruf dauert 1-3 Sekunden, was die ID-Abfragen daneben unsichtbar macht.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Wie Vektorgraph RAG eine Multi-Hop-Anfrage beantwortet<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Suchfluss führt eine Multi-Hop-Anfrage in vier Schritten zu einer fundierten Antwort: <strong>Seed Retrieval → Subgraph Expansion → LLM Rerank → Antwortgenerierung.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir werden die Diabetesfrage durchgehen: <em>"Auf welche Nebenwirkungen sollte ich bei Diabetes-Medikamenten der ersten Wahl achten?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Schritt 1: Seed-Retrieval</h3><p>Ein LLM extrahiert Schlüsselentitäten aus der Frage: "Diabetes", "Nebenwirkungen", "Erstlinienmedikament". Die Vektorsuche in Milvus findet die relevantesten Entitäten und Beziehungen direkt.</p>
<p>Aber Metformin ist nicht darunter. In der Frage wird es nicht erwähnt, also kann die Vektorsuche es nicht finden.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Schritt 2: Teilgraphen-Expansion</h3><p>Hier weicht Vector Graph RAG von Standard RAG ab.</p>
<p>Das System folgt den ID-Referenzen der Start-Entitäten einen Schritt weiter. Es holt sich die IDs der Startentitäten, findet alle Relationen, die diese IDs enthalten, und zieht die neuen Entitäts-IDs in den Subgraphen. Standard: ein Sprung.</p>
<p><strong>Metformin, die Brückenentität, betritt den Subgraphen.</strong></p>
<p>"Diabetes" hat eine Relation: <em>"Metformin ist das Medikament der ersten Wahl bei Typ-2-Diabetes".</em> Das Folgen dieser Kante bringt Metformin hinein. Sobald Metformin im Teilgraphen ist, kommen seine eigenen Relationen mit ihm: <em>"Patienten, die Metformin einnehmen, sollten ihre Nierenfunktion überwachen lassen", "Metformin kann Magen-Darm-Beschwerden verursachen", "Langfristige Einnahme von Metformin kann zu Vitamin-B12-Mangel führen".</em></p>
<p>Zwei Fakten, die in getrennten Passagen vorkamen, sind nun durch einen Sprung in der Graphenerweiterung verbunden. Die Brückenentität, die in der Frage nie erwähnt wurde, ist nun auffindbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Schritt 3: LLM Rerank</h3><p>Nach der Expansion bleiben Dutzende von Kandidatenbeziehungen übrig. Die meisten sind Rauschen.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>Das System sendet diese Kandidaten und die ursprüngliche Frage an einen LLM: "Welche beziehen sich auf Nebenwirkungen von Diabetes-Medikamenten der ersten Wahl?" Das ist ein einziger Aufruf ohne Iteration.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Die ausgewählten Beziehungen decken die gesamte Kette ab: Diabetes → Metformin → Nierenüberwachung / GI-Beschwerden / B12-Mangel.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Schritt 4: Generierung der Antwort</h3><p>Das System ruft die Originalpassagen für die ausgewählten Relationen ab und sendet sie an den LLM.</p>
<p>Der LLM generiert aus dem vollständigen Text der Passage, nicht aus den gekürzten Tripeln. Tripel sind komprimierte Zusammenfassungen. Ihnen fehlen der Kontext, die Vorbehalte und die Besonderheiten, die der LLM benötigt, um eine fundierte Antwort zu geben.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Sehen Sie Vector Graph RAG in Aktion</h3><p>Wir haben auch ein interaktives Frontend entwickelt, das die einzelnen Schritte visualisiert. Klicken Sie sich durch die Schritte auf der linken Seite und der Graph wird in Echtzeit aktualisiert: orange für Startknoten, blau für erweiterte Knoten, grün für ausgewählte Beziehungen. Dadurch wird der Abruffluss konkret statt abstrakt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Warum ein Rerank besser ist als mehrere Iterationen<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Unsere Pipeline führt zwei LLM-Aufrufe pro Abfrage durch: einen für den Rerank und einen für die Generierung. Iterative Systeme wie IRCoT und Agentic RAG führen 3 bis 10+ Aufrufe durch, weil sie eine Schleife bilden: abrufen, begründen, wieder abrufen. Wir überspringen die Schleife, weil die Vektorsuche und die Subgraphenexpansion sowohl die semantische Ähnlichkeit als auch die strukturellen Verbindungen in einem Durchgang abdecken, so dass der LLM genug Kandidaten hat, um mit einem Rerank fertig zu werden.</p>
<table>
<thead>
<tr><th>Ansatz</th><th>LLM-Aufrufe pro Anfrage</th><th>Latenz-Profil</th><th>Relative API-Kosten</th></tr>
</thead>
<tbody>
<tr><td>Vektorgraph RAG</td><td>2 (rerank + generieren)</td><td>Fest, vorhersehbar</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variabel</td><td>~2-3x</td></tr>
<tr><td>Agentische RAG</td><td>5-10+</td><td>Unvorhersehbar</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>In der Produktion bedeutet das etwa 60 % niedrigere API-Kosten, 2-3 mal schnellere Antworten und vorhersehbare Latenzzeiten. Keine überraschenden Spitzen, wenn ein Agent beschließt, zusätzliche Runden zu fahren.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Benchmark-Ergebnisse<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG erreicht durchschnittlich 87,8 % Recall@5 bei drei Standard-Multi-Hop-QA-Benchmarks und erreicht oder übertrifft damit jede von uns getestete Methode, einschließlich HippoRAG 2, mit nur Milvus und 2 LLM-Aufrufen.</p>
<p>Wir haben MuSiQue (2-4 Hop, die schwierigste Methode), HotpotQA (2 Hop, die am weitesten verbreitete Methode) und 2WikiMultiHopQA (2 Hop, dokumentenübergreifendes Reasoning) getestet. Die Metrik ist Recall@5: ob die richtigen unterstützenden Passagen in den Top 5 der abgerufenen Ergebnisse erscheinen.</p>
<p>Um einen fairen Vergleich zu ermöglichen, haben wir genau dieselben vor-extrahierten Tripel aus dem <a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG-Repository</a> verwendet. Keine erneute Extraktion, keine benutzerdefinierte Vorverarbeitung. Der Vergleich isoliert den Abrufalgorithmus selbst.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> vs. Standard (Naive) RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG hebt den durchschnittlichen Recall@5 von 73,4 % auf 87,8 %, eine Verbesserung um 19,6 Prozentpunkte.</p>
<ul>
<li>MuSiQue: größter Gewinn (+31,4 pp). 3-4-Hop-Benchmark, die schwierigsten Multi-Hop-Fragen und genau dort, wo die Subgraphenerweiterung den größten Einfluss hat.</li>
<li>2WikiMultiHopQA: deutliche Verbesserung (+27,7 Punkte). Dokumentenübergreifendes Reasoning, ein weiterer Sweet Spot für die Subgraphenerweiterung.</li>
<li>HotpotQA: geringerer Zuwachs (+6,1 pp), aber Standard-RAG erreicht bereits 90,8 % in diesem Datensatz. Die Obergrenze ist niedrig.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Vektorgrafik-RAG</a> im Vergleich zu State-of-the-Art-Methoden (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG erzielt mit 87,8 % die höchste Durchschnittspunktzahl im Vergleich zu HippoRAG 2, IRCoT und NV-Embed-v2.</p>
<p>Benchmark für Benchmark:</p>
<ul>
<li>HotpotQA: Gleichstand mit HippoRAG 2 (beide 96,3%)</li>
<li>2WikiMultiHopQA: führt mit 3,7 Punkten Vorsprung (94,1% vs. 90,4%)</li>
<li>MuSiQue (der härteste): liegt um 1,7 Punkte zurück (73,0% vs. 74,7%)</li>
</ul>
<p>Vector Graph RAG erreicht diese Zahlen mit nur 2 LLM-Aufrufen pro Anfrage, ohne Graphdatenbank und ohne ColBERTv2. Es läuft auf der einfachsten Infrastruktur im Vergleich und erreicht trotzdem den höchsten Durchschnitt.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Wie <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> im Vergleich zu anderen Graph RAG-Ansätzen abschneidet<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Verschiedene Graph RAG-Ansätze sind für unterschiedliche Probleme optimiert. Vector Graph RAG ist für produktive Multi-Hop-QA mit vorhersehbaren Kosten und einfacher Infrastruktur konzipiert.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT/Agentisches RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infrastruktur</strong></td><td>Graph DB + Vektor DB</td><td>ColBERTv2 + In-Memory-Graph</td><td>Vektor-DB + Mehrrunden-Agenten</td><td><strong>Nur Milvus</strong></td></tr>
<tr><td><strong>LLM-Aufrufe pro Abfrage</strong></td><td>Variiert</td><td>Mäßig</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Am besten geeignet für</strong></td><td>Globale Korpuszusammenfassung</td><td>Feinkörniges akademisches Retrieval</td><td>Komplexe, ergebnisoffene Erkundung</td><td><strong>Mehrstufige QA in der Produktion</strong></td></tr>
<tr><td><strong>Bedenken hinsichtlich der Skalierung</strong></td><td>Teure LLM-Indizierung</td><td>Vollständiger Graph im Speicher</td><td>Unvorhersehbare Latenzzeiten und Kosten</td><td><strong>Skalierbar mit Milvus</strong></td></tr>
<tr><td><strong>Komplexität der Einrichtung</strong></td><td>Hoch</td><td>Mittel-Hoch</td><td>Mittel</td><td><strong>Niedrig (Pip-Installation)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> verwendet hierarchisches Community Clustering, um globale Zusammenfassungsfragen zu beantworten, wie z. B. "Was sind die Hauptthemen in diesem Korpus? Das ist ein anderes Problem als Multi-Hop-QA&quot;.</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) verwendet kognitiv inspiriertes Retrieval mit ColBERTv2-Matching auf Token-Ebene. Das Laden des gesamten Graphen in den Speicher schränkt die Skalierbarkeit ein.</p>
<p>Iterative Ansätze wie <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> tauschen die Einfachheit der Infrastruktur gegen LLM-Kosten und unvorhersehbare Latenzzeiten.</p>
<p>Vector Graph RAG zielt auf die produktive Multi-Hop-QA ab: Teams, die vorhersehbare Kosten und Latenzzeiten wünschen, ohne eine Graphdatenbank hinzuzufügen.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Wann wird Vector Graph RAG verwendet und welche Anwendungsfälle gibt es?<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG ist für vier Arten von Workloads ausgelegt:</p>
<table>
<thead>
<tr><th>Szenario</th><th>Warum es passt</th></tr>
</thead>
<tbody>
<tr><td><strong>Wissensintensive Dokumente</strong></td><td>Juristische Codes mit Querverweisen, biomedizinische Literatur mit Wirkstoff-Gen-Krankheits-Ketten, Finanzberichte mit Firmen-Personen-Ereignis-Verknüpfungen, technische Dokumentationen mit API-Abhängigkeitsgraphen</td></tr>
<tr><td><strong>2-4-Hop-Fragen</strong></td><td>Fragen mit einem Sprung funktionieren gut mit Standard-RAG. Bei fünf oder mehr Sprüngen sind möglicherweise iterative Methoden erforderlich. Der Bereich von 2 bis 4 Hops ist der Sweet Spot der Subgraph Expansion.</td></tr>
<tr><td><strong>Einfacher Einsatz</strong></td><td>Eine Datenbank, eine <code translate="no">pip install</code>, keine Graph-Infrastruktur zu erlernen</td></tr>
<tr><td><strong>Empfindlichkeit gegenüber Kosten und Latenzzeiten</strong></td><td>Zwei LLM-Aufrufe pro Abfrage, fest und vorhersehbar. Bei Tausenden von täglichen Abfragen macht sich der Unterschied bemerkbar.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Erste Schritte mit Vector Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> ohne Argumente wird standardmäßig <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> verwendet. Es wird eine lokale <code translate="no">.db</code> Datei erstellt, wie SQLite. Kein Server zu starten, nichts zu konfigurieren.</p>
<p><code translate="no">add_texts()</code> RAG ruft einen LLM auf, um Tripel aus Ihrem Text zu extrahieren, vektorisiert sie und speichert alles in Milvus. <code translate="no">query()</code> führt den vollständigen vierstufigen Abfragefluss aus: Seed, Expand, Rerank, Generate.</p>
<p>Für die Produktion muss ein URI-Parameter ausgetauscht werden. Der Rest des Codes bleibt gleich:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Zum Importieren von PDFs, Webseiten oder Word-Dateien:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG braucht keine Graphdatenbank. Vector Graph RAG speichert die Graphenstruktur als ID-Referenzen über drei Milvus-Sammlungen hinweg, wodurch Graphen-Traversal in Primärschlüssel-Lookups umgewandelt wird und jede Multi-Hop-Abfrage auf zwei LLM-Aufrufe beschränkt bleibt.</p>
<p>Auf einen Blick:</p>
<ul>
<li>Open-Source-Python-Bibliothek. Multi-Hop-Reasoning allein mit Milvus.</li>
<li>Drei durch ID verknüpfte Sammlungen. Entitäten (Knoten), Beziehungen (Kanten), Passagen (Quelltext). Subgraphenexpansion folgt den IDs, um Brückenentitäten zu entdecken, die in der Anfrage nicht erwähnt werden.</li>
<li>Zwei LLM-Aufrufe pro Abfrage. Ein Rerank, eine Generierung. Keine Iteration.</li>
<li>87,8 % durchschnittlicher Recall@5 bei MuSiQue, HotpotQA und 2WikiMultiHopQA, wobei zwei der drei Abfragen mit HippoRAG 2 übereinstimmen oder es sogar übertreffen.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Probieren Sie es aus:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> für den Code</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Docs</a> für die vollständige API und Beispiele</li>
<li>Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Community</a> <a href="https://slack.milvus.io/">auf Discord</a> bei, um Fragen zu stellen und Feedback zu geben</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine Milvus-Sprechstunde</a>, um Ihren Anwendungsfall durchzugehen</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> bietet ein kostenloses Tier mit verwaltetem Milvus, wenn Sie die Einrichtung der Infrastruktur überspringen möchten</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">FAQ<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Kann ich Graph RAG nur mit einer Vektordatenbank betreiben?</h3><p>Ja. Vector Graph RAG speichert die Struktur des Wissensgraphen (Entitäten, Relationen und ihre Verbindungen) in drei Milvus-Sammlungen, die durch ID-Querverweise verbunden sind. Anstatt Kanten in einer Graphdatenbank zu durchlaufen, werden Primärschlüssel-Lookups in Milvus verkettet, um einen Subgraphen um die Startentitäten zu erweitern. Bei drei Standard-Multi-Hop-Benchmarks wird so ein durchschnittlicher Recall@5 von 87,8 % erreicht, ohne dass eine Graphdatenbank-Infrastruktur benötigt wird.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Was ist der Unterschied zwischen Vector Graph RAG und Microsoft GraphRAG?</h3><p>Sie lösen unterschiedliche Probleme. Microsoft GraphRAG verwendet hierarchisches Community Clustering für die globale Korpuszusammenfassung ("Was sind die Hauptthemen in diesen Dokumenten?"). Vector Graph RAG konzentriert sich auf die Beantwortung von Multi-Hop-Fragen, bei denen das Ziel darin besteht, bestimmte Fakten über Passagen hinweg zu verknüpfen. Vector Graph RAG benötigt nur Milvus und zwei LLM-Aufrufe pro Anfrage. Microsoft GraphRAG benötigt eine Graphdatenbank und verursacht höhere Indizierungskosten.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Welche Arten von Fragen profitieren von Multi-hop RAG?</h3><p>Multi-hop RAG hilft bei Fragen, bei denen die Antwort von der Verknüpfung von Informationen abhängt, die über mehrere Passagen verstreut sind, insbesondere wenn eine Schlüsselentität nie in der Frage vorkommt. Beispiele hierfür sind "Welche Nebenwirkungen hat das Medikament der ersten Wahl für Diabetes?" (erfordert die Entdeckung von Metformin als Brücke), die Suche nach Querverweisen in rechtlichen oder regulatorischen Texten und die Verfolgung der Abhängigkeitskette in technischer Dokumentation. Standard-RAG kann gut mit Einzelfaktor-Suchanfragen umgehen. Multi-Hop-RAG ist von Vorteil, wenn der Argumentationspfad zwei bis vier Schritte lang ist.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Muss ich Wissensgraphen-Tripel manuell extrahieren?</h3><p>Nein. <code translate="no">add_texts()</code> und <code translate="no">add_documents()</code> rufen automatisch ein LLM auf, um Entitäten und Beziehungen zu extrahieren, sie zu vektorisieren und in Milvus zu speichern. Sie können Dokumente aus URLs, PDFs und DOCX-Dateien importieren, indem Sie die integrierte <code translate="no">DocumentImporter</code> verwenden. Für das Benchmarking oder die Migration unterstützt die Bibliothek den Import von vor-extrahierten Triples aus anderen Frameworks wie HippoRAG.</p>
