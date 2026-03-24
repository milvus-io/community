---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Behebung von RAG-Abruffehlern mit CRAG, LangGraph und Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Hohe Ähnlichkeit, aber falsche Antworten? Erfahren Sie, wie CRAG die
  RAG-Pipelines um Auswertung und Korrektur erweitert. Bauen Sie ein
  produktionsreifes System mit LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>Wenn LLM-Anwendungen in Produktion gehen, müssen die Teams mit ihren Modellen zunehmend Fragen beantworten, die auf privaten Daten oder Echtzeitinformationen basieren. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-augmented generation</a> (RAG) - bei der das Modell zum Zeitpunkt der Abfrage auf eine externe Wissensbasis zurückgreift - ist der Standardansatz. Dadurch werden Halluzinationen vermieden und die Antworten bleiben aktuell.</p>
<p>In der Praxis zeigt sich jedoch schnell ein Problem: <strong>Ein Dokument kann einen hohen Ähnlichkeitsgrad aufweisen und dennoch völlig falsch für die Frage sein.</strong> Traditionelle RAG-Pipelines setzen Ähnlichkeit mit Relevanz gleich. In der Produktion wird diese Annahme gebrochen. Ein Ergebnis, das an erster Stelle steht, kann veraltet sein, nur am Rande mit der Frage zu tun haben oder genau das Detail enthalten, das der Benutzer benötigt.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) geht dieses Problem an, indem es eine Bewertung und Korrektur zwischen Retrieval und Generierung einfügt. Anstatt sich blind auf Ähnlichkeitswerte zu verlassen, prüft das System, ob die abgerufenen Inhalte tatsächlich die Frage beantworten - und korrigiert die Situation, wenn dies nicht der Fall ist.</p>
<p>Dieser Artikel führt durch den Aufbau eines produktionsreifen CRAG-Systems mit LangChain, LangGraph und <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Drei Retrieval-Probleme, die traditionelle RAG nicht lösen kann<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>Die meisten RAG-Fehler in der Produktion lassen sich auf eines von drei Problemen zurückführen:</p>
<p><strong>Unstimmigkeiten beim Abruf.</strong> Das Dokument ist thematisch ähnlich, beantwortet aber nicht wirklich die Frage. Wenn Sie fragen, wie man ein HTTPS-Zertifikat in Nginx konfiguriert, könnte das System eine Apache-Einrichtungsanleitung, eine Anleitung für 2019 oder eine allgemeine Erklärung zur Funktionsweise von TLS zurückgeben. Semantisch nah dran, praktisch nutzlos.</p>
<p><strong>Veraltete Inhalte.</strong> Die <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuche</a> hat kein Konzept der Aktualität. Wenn Sie "Python async best practices" abfragen, erhalten Sie eine Mischung aus Mustern aus dem Jahr 2018 und Mustern aus dem Jahr 2024, die lediglich nach dem Einbettungsabstand geordnet sind. Das System kann nicht unterscheiden, was der Benutzer tatsächlich braucht.</p>
<p><strong>Speicherverschmutzung.</strong> Dieses Problem nimmt mit der Zeit zu und ist oft am schwierigsten zu beheben. Angenommen, das System ruft eine veraltete API-Referenz ab und generiert falschen Code. Die fehlerhafte Ausgabe wird wieder im Speicher abgelegt. Bei der nächsten ähnlichen Abfrage ruft das System sie erneut ab und verstärkt damit den Fehler. Veraltete und neue Informationen vermischen sich allmählich, und die Zuverlässigkeit des Systems nimmt mit jedem Zyklus ab.</p>
<p>Dies sind keine Einzelfälle. Sie treten regelmäßig auf, sobald ein RAG-System echten Datenverkehr verarbeitet. Das macht die Qualitätsprüfung der Abfrage zu einer Anforderung und nicht zu einem Nice-to-have.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">Was ist CRAG? Erst evaluieren, dann generieren<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Corrective Retrieval-Augmented Generation (CRAG)</strong> ist eine Methode, die einen Bewertungs- und Korrekturschritt zwischen Retrieval und Generierung in einer RAG-Pipeline einfügt. Sie wurde in dem Papier <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024) vorgestellt. Im Gegensatz zum traditionellen RAG, das eine binäre Entscheidung trifft - das Dokument verwenden oder verwerfen - bewertet RAG jedes gefundene Ergebnis nach seiner Relevanz und leitet es durch einen von drei Korrekturpfaden, bevor es überhaupt das Sprachmodell erreicht.</p>
<p>Traditionelle RAG hat Probleme, wenn die Suchergebnisse in einer Grauzone landen: teilweise relevant, etwas veraltet oder es fehlt ein wichtiges Element. Ein einfaches Ja/Nein-Gate verwirft entweder nützliche Teilinformationen oder lässt verrauschte Inhalte durch. Mit CRAG wird die Pipeline von <strong>Abrufen → Generieren</strong> auf <strong>Abrufen → Bewerten → Korrigieren → Generieren</strong> umgestellt, so dass das System die Möglichkeit hat, die Abrufqualität zu verbessern, bevor die Generierung beginnt.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>CRAG Arbeitsablauf in vier Schritten: Abrufen → Bewerten → Korrigieren → Generieren, was zeigt, wie die Dokumente bewertet und weitergeleitet werden</span> </span></p>
<p>Die abgerufenen Ergebnisse werden in eine von drei Kategorien eingeteilt:</p>
<ul>
<li><strong>Richtig:</strong> beantwortet die Anfrage direkt; nach leichter Verfeinerung brauchbar</li>
<li><strong>Mehrdeutig:</strong> teilweise relevant; benötigt ergänzende Informationen</li>
<li><strong>Falsch:</strong> irrelevant; zu verwerfen und auf alternative Quellen zurückzugreifen</li>
</ul>
<table>
<thead>
<tr><th>Entscheidung</th><th>Zuversicht</th><th>Aktion</th></tr>
</thead>
<tbody>
<tr><td>Richtig</td><td>&gt; 0.9</td><td>Verfeinern Sie den Inhalt des Dokuments</td></tr>
<tr><td>Mehrdeutig</td><td>0.5-0.9</td><td>Verfeinern Sie das Dokument + ergänzen Sie es mit einer Websuche</td></tr>
<tr><td>Falsch</td><td>&lt; 0.5</td><td>Abrufergebnisse verwerfen; vollständig auf die Websuche zurückgreifen</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Verfeinerung des Inhalts</h3><p>CRAG geht auch auf ein kleineres Problem der Standard-RAG ein: Die meisten Systeme geben das gesamte abgerufene Dokument an das Modell weiter. Dadurch werden Tokens verschwendet und das Signal verwässert - das Modell muss sich durch irrelevante Absätze wühlen, um den einen Satz zu finden, der wirklich wichtig ist. CRAG verfeinert den abgerufenen Inhalt zuerst, indem es relevante Teile extrahiert und den Rest entfernt.</p>
<p>In der Originalarbeit werden hierfür Wissensstreifen und heuristische Regeln verwendet. In der Praxis funktioniert der Abgleich von Schlüsselwörtern für viele Anwendungsfälle, und Produktionssysteme können eine LLM-basierte Zusammenfassung oder eine strukturierte Extraktion für eine höhere Qualität aufsetzen.</p>
<p>Der Verfeinerungsprozess besteht aus drei Teilen:</p>
<ul>
<li><strong>Dokumentenzerlegung:</strong> Extraktion von Schlüsselpassagen aus einem längeren Dokument</li>
<li><strong>Neuformulierung von Abfragen:</strong> Umwandlung vager oder mehrdeutiger Abfragen in gezieltere Abfragen</li>
<li><strong>Wissensselektion:</strong> Deduplizierung, Einstufung und Beibehaltung nur der nützlichsten Inhalte</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>Der dreistufige Prozess zur Verfeinerung von Dokumenten: Dokumentenzerlegung (2000 → 500 Token), Query Rewriting (verbesserte Suchpräzision) und Knowledge Selection (Filtern, Einordnen und Beschneiden)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">Der Auswerter</h3><p>Der Evaluator ist das Herzstück von CRAG. Er ist nicht für tiefgreifende Schlussfolgerungen gedacht - er ist ein schnelles Triage-Gate. Anhand einer Anfrage und einer Reihe von abgerufenen Dokumenten entscheidet er, ob der Inhalt gut genug ist, um verwendet zu werden.</p>
<p>In der Originalarbeit wird ein fein abgestimmtes T5-Large-Modell anstelle eines Allzweck-LLM gewählt. Die Begründung: Geschwindigkeit und Präzision sind für diese spezielle Aufgabe wichtiger als Flexibilität.</p>
<table>
<thead>
<tr><th>Attribut</th><th>Feinabgestimmtes T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Latenz</td><td>10-20 ms</td><td>200 ms+</td></tr>
<tr><td>Genauigkeit</td><td>92% (Papierversuche)</td><td>TBD</td></tr>
<tr><td>Aufgabenanpassung</td><td>Hoch - Feinabstimmung für Einzelaufgaben, höhere Präzision</td><td>Mittel - universell einsetzbar, flexibler, aber weniger spezialisiert</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Websuche Fallback</h3><p>Wenn die interne Suche als fehlerhaft oder mehrdeutig eingestuft wird, kann CRAG eine Websuche auslösen, um frischere oder ergänzende Informationen einzuholen. Dies dient als Sicherheitsnetz für zeitkritische Abfragen und Themen, bei denen die interne Wissensbasis Lücken aufweist.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Warum Milvus gut für CRAG in der Produktion geeignet ist<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Effektivität von CRAG hängt davon ab, was sich darunter befindet. Die <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> muss mehr können als eine einfache Ähnlichkeitssuche - sie muss die mandantenübergreifende Isolierung, die hybride Abfrage und die Schemaflexibilität unterstützen, die ein produktives CRAG-System erfordert.</p>
<p>Nach der Evaluierung mehrerer Optionen haben wir uns aus drei Gründen für <a href="https://zilliz.com/what-is-milvus">Milvus</a> entschieden.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Mandantenübergreifende Isolierung</h3><p>In agentenbasierten Systemen benötigt jeder Benutzer oder jede Sitzung seinen eigenen Speicherplatz. Der naive Ansatz - eine Sammlung pro Mandant - bereitet schnell Kopfzerbrechen, vor allem im großen Maßstab.</p>
<p>Milvus handhabt dies mit <a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>. Setzen Sie <code translate="no">is_partition_key=True</code> auf das Feld <code translate="no">agent_id</code>, und Milvus leitet Abfragen automatisch an die richtige Partition weiter. Keine ausufernde Sammlung, kein manueller Routing-Code.</p>
<p>In unseren Benchmarks mit 10 Millionen Vektoren über 100 Tenants lieferte Milvus mit Clustering Compaction eine <strong>3-5fach höhere QPS</strong> im Vergleich zur nicht optimierten Baseline.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Hybrides Retrieval</h3><p>Die reine Vektorsuche ist nicht ausreichend, wenn es um die exakte Zuordnung von Inhalten zu Produkt-SKUs wie <code translate="no">SKU-2024-X5</code>, Versionsstrings oder spezifische Terminologie geht.</p>
<p>Milvus 2.5 unterstützt von Haus aus <a href="https://milvus.io/docs/multi-vector-search.md">hybrides Retrieval</a>: dichte Vektoren für semantische Ähnlichkeit, spärliche Vektoren für BM25-ähnliches Keyword-Matching und skalare Metadatenfilterung - alles in einer Anfrage. Die Ergebnisse werden mittels Reciprocal Rank Fusion (RRF) fusioniert, so dass Sie keine separaten Retrieval-Pipelines erstellen und zusammenführen müssen.</p>
<p>Bei einem Datensatz mit 1 Million Vektoren lag die Abruflatenz von Milvus Sparse-BM25 bei <strong>6 ms</strong>, mit vernachlässigbaren Auswirkungen auf die End-to-End-CRAG-Leistung.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Flexibles Schema für sich entwickelnde Speicher</h3><p>Mit der Weiterentwicklung der CRAG-Pipelines entwickelt sich auch das Datenmodell mit. Wir mussten Felder wie <code translate="no">confidence</code>, <code translate="no">verified</code> und <code translate="no">source</code> hinzufügen, während wir die Auswertungslogik iterierten. Bei den meisten Datenbanken bedeutet dies Migrations-Skripte und Ausfallzeiten.</p>
<p>Milvus unterstützt dynamische JSON-Felder, so dass Metadaten ohne Unterbrechung des Dienstes im laufenden Betrieb erweitert werden können.</p>
<p>Hier ist ein typisches Schema:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus vereinfacht auch die Skalierung der Bereitstellung. Es bietet <a href="https://milvus.io/docs/install-overview.md">Lite-, Standalone- und verteilte Modi</a>, die codekompatibel sind - der Wechsel von der lokalen Entwicklung zu einem Produktionscluster erfordert lediglich eine Änderung des Verbindungsstrings.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Praktische Übungen: Aufbau eines CRAG-Systems mit LangGraph Middleware und Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Warum der Middleware-Ansatz?</h3><p>Eine gängige Methode, CRAG mit LangGraph zu erstellen, besteht darin, einen Zustandsgraphen mit Knoten und Kanten zu erstellen, die jeden Schritt steuern. Das funktioniert, aber der Graph wird mit zunehmender Komplexität unübersichtlich, und die Fehlersuche wird zum Problem.</p>
<p>Wir haben uns für das <strong>Middleware-Muster</strong> in LangGraph 1.0 entschieden. Es fängt Anfragen vor dem Modellaufruf ab, so dass Abruf, Auswertung und Korrektur an einer Stelle zusammenhängend behandelt werden. Im Vergleich zum State-Graph-Ansatz:</p>
<ul>
<li><strong>Weniger Code:</strong> Die Logik ist zentralisiert und nicht über die Graphenknoten verstreut.</li>
<li><strong>Leichtere Nachvollziehbarkeit:</strong> der Kontrollfluss ist linear</li>
<li><strong>Leichtere Fehlersuche:</strong> Fehler weisen auf eine einzige Stelle hin, nicht auf einen Graph-Traversal</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Kern-Workflow</h3><p>Die Pipeline läuft in vier Schritten ab:</p>
<ol>
<li><strong>Abruf:</strong> Abruf der 3 wichtigsten relevanten Dokumente aus Milvus, bezogen auf den aktuellen Mandanten</li>
<li><strong>Bewertung:</strong> Bewertung der Dokumentenqualität mit einem leichtgewichtigen Modell</li>
<li><strong>Korrektur:</strong> Verfeinerung, Ergänzung durch Websuche oder vollständiger Rückgriff auf das Urteil</li>
<li><strong>Injektion:</strong> Übergabe des endgültigen Kontexts an das Modell durch eine dynamische Systemaufforderung</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Einrichtung der Umgebung und Datenvorbereitung</h3><p><strong>Umgebungsvariablen</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Erstellen Sie die Milvus-Sammlung</strong></p>
<p>Bevor Sie den Code ausführen, erstellen Sie eine Sammlung in Milvus mit einem Schema, das der Abfragelogik entspricht.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Versionshinweis:</strong> Dieser Code verwendet die neuesten Middleware-Funktionen von LangGraph und LangChain. Diese APIs können sich im Zuge der Weiterentwicklung der Frameworks ändern - prüfen Sie die <a href="https://langchain-ai.github.io/langgraph/">LangGraph-Dokumentation</a> auf die aktuellste Verwendung.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Wichtige Module</h3><p><strong>1. Produktionstauglicher Evaluator-Entwurf</strong></p>
<p>Die Methode <code translate="no">_evaluate_relevance()</code> im obigen Code ist absichtlich für schnelle Tests vereinfacht. Für die Produktion benötigen Sie eine strukturierte Ausgabe mit Vertrauensbewertung und Erklärbarkeit:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Wissensverfeinerung und Fallback</strong></p>
<p>Drei Mechanismen arbeiten zusammen, um die Qualität des Modellkontexts zu erhalten:</p>
<ul>
<li><strong>Die Wissensveredelung</strong> extrahiert die abfragerelevantesten Sätze und entfernt das Rauschen.</li>
<li>Die<strong>Fallback-Suche</strong> wird ausgelöst, wenn der lokale Abruf nicht ausreicht, und zieht externes Wissen über Tavily hinzu.</li>
<li><strong>Context Merging</strong> kombiniert den internen Speicher mit externen Ergebnissen zu einem einzigen, deduplizierten Kontextblock, bevor dieser das Modell erreicht.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Tipps für den Einsatz von CRAG in der Produktion<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Drei Bereiche sind am wichtigsten, sobald Sie über das Prototyping hinausgehen.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Kosten: Wählen Sie den richtigen Evaluator</h3><p>Der Evaluator läuft bei jeder einzelnen Abfrage und ist damit der größte Hebel für Latenz und Kosten.</p>
<ul>
<li><strong>Workloads mit hoher Gleichzeitigkeit:</strong> Ein fein abgestimmtes, leichtgewichtiges Modell wie T5-Large hält die Latenz bei 10-20 ms und die Kosten vorhersehbar.</li>
<li><strong>Geringer Datenverkehr oder Prototyping:</strong> Ein gehostetes Modell wie <code translate="no">gpt-4o-mini</code> ist schneller einzurichten und erfordert weniger Betriebsaufwand, aber die Latenzzeit und die Kosten pro Anruf sind höher.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Beobachtbarkeit: Instrument vom ersten Tag an</h3><p>Die schwierigsten Probleme in der Produktion sind die, die man erst sieht, wenn die Qualität der Antworten bereits nachgelassen hat.</p>
<ul>
<li><strong>Überwachung der Infrastruktur:</strong> Milvus lässt sich mit <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a> integrieren. Beginnen Sie mit drei Metriken: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, und <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Überwachung von Anwendungen:</strong> Verfolgen Sie die Verteilung der CRAG-Urteile, die Auslöserquote der Websuche und die Verteilung der Konfidenzwerte. Ohne diese Signale können Sie nicht feststellen, ob ein Qualitätsabfall auf eine schlechte Abfrage oder eine Fehleinschätzung des Bewerters zurückzuführen ist.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Langfristige Wartung: Verhindern von Speicherkontamination</h3><p>Je länger ein Agent läuft, desto mehr veraltete und minderwertige Daten sammeln sich im Speicher an. Richten Sie frühzeitig Leitplanken ein:</p>
<ul>
<li><strong>Vor-Filterung:</strong> Zeigen Sie nur Speicher mit <code translate="no">confidence &gt; 0.7</code> an, damit minderwertige Inhalte blockiert werden, bevor sie den Auswerter erreichen.</li>
<li><strong>Zeitlicher Verfall:</strong> Reduzieren Sie schrittweise das Gewicht älterer Speicher. Dreißig Tage sind eine vernünftige Anfangsvorgabe, die je nach Anwendungsfall angepasst werden kann.</li>
<li><strong>Geplante Bereinigung:</strong> Führen Sie einen wöchentlichen Job aus, um alte, wenig vertrauenswürdige, ungeprüfte Erinnerungen zu bereinigen. Dadurch wird eine Rückkopplungsschleife verhindert, in der veraltete Daten abgerufen, verwendet und erneut gespeichert werden.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Zusammenfassung - und ein paar allgemeine Fragen<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG befasst sich mit einem der hartnäckigsten Probleme in der RAG-Produktion: Abfrageergebnisse, die relevant aussehen, es aber nicht sind. Durch die Einfügung eines Bewertungs- und Korrekturschritts zwischen Abruf und Generierung werden schlechte Ergebnisse herausgefiltert, Lücken durch externe Suche gefüllt und dem Modell ein sauberer Kontext gegeben, mit dem es arbeiten kann.</p>
<p>Damit CRAG in der Produktion zuverlässig funktioniert, bedarf es jedoch mehr als einer guten Abfragelogik. Dazu ist eine Vektordatenbank erforderlich, die die Isolierung mehrerer Mandanten, die hybride Suche und die Entwicklung von Schemata beherrscht - und genau hier kommt <a href="https://milvus.io/intro">Milvus</a> ins Spiel. Auf der Anwendungsseite machen die Wahl des richtigen Evaluators, die frühzeitige Instrumentierung der Beobachtbarkeit und die aktive Verwaltung der Speicherqualität den Unterschied zwischen einer Demo und einem System aus, dem Sie vertrauen können.</p>
<p>Wenn Sie RAG- oder Agentensysteme aufbauen und Probleme mit der Abrufqualität haben, würden wir Ihnen gerne helfen:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um Fragen zu stellen, Ihre Architektur zu teilen und von anderen Entwicklern zu lernen, die an ähnlichen Problemen arbeiten.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihren Anwendungsfall mit dem Team durchzugehen - egal, ob es um CRAG-Design, hybrides Retrieval oder mandantenfähige Skalierung geht.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen und direkt mit dem Aufbau beginnen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltet von Milvus) eine kostenlose Stufe für den Einstieg.</li>
</ul>
<hr>
<p>Ein paar Fragen, die häufig auftauchen, wenn Teams mit der Implementierung von CRAG beginnen:</p>
<p><strong>Was ist der Unterschied zwischen CRAG und dem einfachen Hinzufügen eines Rerankers zu RAG?</strong></p>
<p>Ein Reranker ordnet die Ergebnisse nach Relevanz neu, geht aber immer noch davon aus, dass die abgerufenen Dokumente brauchbar sind. CRAG geht noch weiter: Es bewertet, ob die abgerufenen Inhalte die Anfrage überhaupt beantworten, und ergreift Korrekturmaßnahmen, wenn dies nicht der Fall ist: Verfeinerung von Teiltreffern, Ergänzung durch eine Websuche oder Verwerfen der Ergebnisse ganz. Es handelt sich um eine Qualitätskontrollschleife, nicht nur um eine bessere Sortierung.</p>
<p><strong>Warum liefert ein hoher Ähnlichkeitswert manchmal das falsche Dokument?</strong></p>
<p>Die Einbettungsähnlichkeit misst die semantische Nähe im Vektorraum, aber das ist nicht dasselbe wie die Beantwortung der Frage. Ein Dokument über die Konfiguration von HTTPS auf Apache ist semantisch nahe an einer Frage über HTTPS auf Nginx - aber es wird nicht helfen. CRAG fängt dies auf, indem es die Relevanz für die eigentliche Anfrage bewertet, nicht nur den Vektorabstand.</p>
<p><strong>Worauf sollte ich bei einer Vektordatenbank für CRAG achten?</strong></p>
<p>Drei Dinge sind am wichtigsten: hybride Abfrage (damit Sie die semantische Suche mit dem Abgleich von Schlüsselwörtern für exakte Begriffe kombinieren können), mandantenfähige Isolierung (damit jeder Benutzer oder jede Agentensitzung seinen eigenen Speicherplatz hat) und ein flexibles Schema (damit Sie Felder wie <code translate="no">confidence</code> oder <code translate="no">verified</code> ohne Ausfallzeiten hinzufügen können, wenn sich Ihre Pipeline weiterentwickelt).</p>
<p><strong>Was passiert, wenn keines der abgerufenen Dokumente relevant ist?</strong></p>
<p>CRAG gibt nicht einfach auf. Wenn die Konfidenz unter 0,5 fällt, kehrt es zur Websuche zurück. Wenn die Ergebnisse mehrdeutig sind (0,5-0,9), werden verfeinerte interne Dokumente mit externen Suchergebnissen zusammengeführt. Das Modell erhält immer einen gewissen Kontext, mit dem es arbeiten kann, selbst wenn die Wissensbasis Lücken aufweist.</p>
