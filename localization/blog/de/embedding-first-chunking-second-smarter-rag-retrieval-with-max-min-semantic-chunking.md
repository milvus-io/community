---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  Erst einbetten, dann chunking: Smarter RAG Retrieval mit Max-Min Semantic
  Chunking
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Erfahren Sie, wie Max-Min Semantic Chunking die RAG-Genauigkeit durch einen
  Embedding-First-Ansatz erhöht, der intelligentere Chunks erzeugt, die
  Kontextqualität verbessert und eine bessere Suchleistung liefert.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a> ist zum Standardansatz für die Bereitstellung von Kontext und Gedächtnis für KI-Anwendungen geworden - KI-Agenten, Kundensupport-Assistenten, Wissensdatenbanken und Suchsysteme verlassen sich alle auf diesen Ansatz.</p>
<p>In fast jeder RAG-Pipeline ist der Standardprozess derselbe: Man nimmt die Dokumente, teilt sie in Chunks auf und bettet diese Chunks dann für die Ähnlichkeitssuche in eine Vektordatenbank wie <a href="https://milvus.io/">Milvus</a> ein. Da das <strong>Chunking</strong> im Vorfeld stattfindet, wirkt sich die Qualität dieser Chunks direkt darauf aus, wie gut das System Informationen abruft und wie genau die endgültigen Antworten sind.</p>
<p>Das Problem ist, dass herkömmliche Chunking-Strategien den Text in der Regel ohne jegliches semantisches Verständnis zerlegen. Chunking mit fester Länge schneidet auf der Grundlage der Tokenanzahl, und rekursives Chunking verwendet eine Oberflächenstruktur, aber beide ignorieren die eigentliche Bedeutung des Textes. Infolgedessen werden verwandte Ideen oft getrennt, unzusammenhängende Zeilen werden gruppiert, und wichtiger Kontext wird fragmentiert.</p>
<p><a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a> geht das Problem anders an. Anstatt zuerst zu chunking, wird der Text im Voraus eingebettet und anhand der semantischen Ähnlichkeit entschieden, wo die Grenzen gezogen werden sollen. Durch die Einbettung vor dem Schneiden kann die Pipeline natürliche Bedeutungsverschiebungen verfolgen, anstatt sich auf willkürliche Längengrenzen zu verlassen.</p>
<p>In unserem letzten Blog haben wir Methoden wie <a href="https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md"><strong>Late Chunking</strong></a> von Jina AI besprochen, die dazu beigetragen haben, die Idee des "embed-first" populär zu machen und zu zeigen, dass sie in der Praxis funktionieren kann. <strong>Max-Min Semantic Chunking</strong> baut auf demselben Konzept auf und verwendet eine einfache Regel, die festlegt, wann sich die Bedeutung so stark ändert, dass ein neuer Chunk erforderlich ist. In diesem Beitrag werden wir die Funktionsweise von Max-Min erläutern und seine Stärken und Grenzen für echte RAG-Workloads untersuchen.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Wie eine typische RAG-Pipeline funktioniert<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Die meisten RAG-Pipelines, unabhängig vom Framework, folgen demselben vierstufigen Fließband. Wahrscheinlich haben Sie selbst schon eine Version davon geschrieben:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Datenbereinigung und Chunking</h3><p>Die Pipeline beginnt mit der Bereinigung der Rohdokumente: Kopf- und Fußzeilen, Navigationstext und alles, was nicht zum eigentlichen Inhalt gehört, werden entfernt. Sobald das Rauschen beseitigt ist, wird der Text in kleinere Stücke aufgeteilt. Die meisten Teams verwenden Chunks fester Größe - in der Regel 300-800 Token -, weil das Einbettungsmodell so überschaubar bleibt. Der Nachteil ist, dass die Aufteilung auf der Länge und nicht auf der Bedeutung basiert, so dass die Grenzen willkürlich sein können.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Einbettung und Speicherung</h3><p>Jeder Brocken wird dann mit einem Einbettungsmodell wie dem von OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> oder BAAIs Kodierer. Die resultierenden Vektoren werden in einer Vektordatenbank wie <a href="https://milvus.io/">Milvus</a> oder <a href="https://zilliz.com/cloud">Zilliz Cloud</a> gespeichert. Die Datenbank übernimmt die Indizierung und Ähnlichkeitssuche, so dass Sie neue Abfragen schnell mit allen gespeicherten Chunks vergleichen können.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Abfrage von</h3><p>Wenn ein Nutzer eine Frage stellt - zum Beispiel <em>: "Wie reduziert RAG Halluzinationen?"</em> - bettet das System die Abfrage ein und sendet sie an die Datenbank. Die Datenbank gibt die Top-K-Chunks zurück, deren Vektoren der Anfrage am nächsten kommen. Dies sind die Textstücke, auf die sich das Modell stützt, um die Frage zu beantworten.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Generierung der Antwort</h3><p>Die abgerufenen Chunks werden zusammen mit der Benutzeranfrage gebündelt und in ein LLM eingespeist. Das Modell generiert eine Antwort unter Verwendung des bereitgestellten Kontexts als Grundlage.</p>
<p><strong>Das Chunking steht am Anfang dieser ganzen Pipeline, hat aber einen großen Einfluss</strong>. Wenn die Chunks mit der natürlichen Bedeutung des Textes übereinstimmen, ist der Abruf genau und konsistent. Wenn die Chunks an ungünstigen Stellen geschnitten wurden, hat es das System schwerer, die richtigen Informationen zu finden, selbst mit starken Einbettungen und einer schnellen Vektordatenbank.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Die Herausforderungen beim richtigen Chunking</h3><p>Die meisten RAG-Systeme verwenden heute eine von zwei grundlegenden Chunking-Methoden, die beide ihre Grenzen haben.</p>
<p><strong>1. Chunking mit fester Größe</strong></p>
<p>Dies ist der einfachste Ansatz: Der Text wird nach einer festen Anzahl von Token oder Zeichen aufgeteilt. Sie ist schnell und vorhersehbar, berücksichtigt aber weder Grammatik noch Themen oder Übergänge. Sätze können um die Hälfte gekürzt werden. Manchmal sogar Wörter. Die Einbettungen, die man aus diesen Brocken erhält, sind in der Regel verrauscht, da die Grenzen nicht die tatsächliche Struktur des Textes widerspiegeln.</p>
<p><strong>2. Rekursive Zeichenaufteilung</strong></p>
<p>Diese Methode ist ein wenig intelligenter. Sie unterteilt den Text hierarchisch anhand von Merkmalen wie Absätzen, Zeilenumbrüchen oder Sätzen. Wenn ein Abschnitt zu lang ist, wird er rekursiv weiter unterteilt. Die Ausgabe ist im Allgemeinen kohärenter, aber immer noch uneinheitlich. Einigen Dokumenten mangelt es an einer klaren Struktur oder sie haben ungleiche Abschnittslängen, was die Abrufgenauigkeit beeinträchtigt. Und in einigen Fällen erzeugt dieser Ansatz immer noch Abschnitte, die das Kontextfenster des Modells überschreiten.</p>
<p>Beide Methoden stehen vor demselben Zielkonflikt: Präzision vs. Kontext. Kleinere Chunks verbessern die Abrufgenauigkeit, verlieren aber den umgebenden Kontext; bei größeren Chunks bleibt die Bedeutung erhalten, aber es besteht die Gefahr, dass irrelevantes Rauschen hinzugefügt wird. Das richtige Gleichgewicht zu finden, ist das, was das Chunking sowohl zu einem grundlegenden als auch zu einem frustrierenden Faktor im RAG-Systemdesign macht.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="common-anchor-header">Max-Min Semantisches Chunking: Erst einbetten, dann chunken<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Jahr 2025 veröffentlichten S.R. Bhat et al. <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval: A Multi-Dataset Analysis</em></a>. Eines der wichtigsten Ergebnisse war, dass es keine einzige <strong>"beste"</strong> Chunk-Größe für RAG gibt. Kleine Chunks (64-128 Token) eignen sich tendenziell besser für faktische oder nachschlageähnliche Fragen, während größere Chunks (512-1024 Token) bei narrativen oder schlussfolgernden Aufgaben helfen. Mit anderen Worten: Chunking mit fester Größe ist immer ein Kompromiss.</p>
<p>Daraus ergibt sich eine naheliegende Frage: Können wir, anstatt eine bestimmte Länge zu wählen und auf das Beste zu hoffen, die Chunks nach ihrer Bedeutung und nicht nach ihrer Größe ordnen? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a> ist ein Ansatz, den ich gefunden habe und der genau das versucht.</p>
<p>Die Idee ist einfach: <strong>erst einbetten, dann chunken</strong>. Anstatt den Text zu zerlegen und dann die herausfallenden Teile einzubetten, bettet der Algorithmus <em>alle Sätze</em> im Voraus ein. Er verwendet dann die semantischen Beziehungen zwischen diesen Satzeinbettungen, um zu entscheiden, wo die Grenzen verlaufen sollen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagramm des Arbeitsablaufs "Einbetten-erst-Chunk-zweit" bei Max-Min Semantic Chunking</span> </span></p>
<p>Konzeptionell behandelt die Methode das Chunking als ein eingeschränktes Clustering-Problem im Einbettungsraum. Sie gehen das Dokument der Reihe nach durch, einen Satz nach dem anderen. Für jeden Satz vergleicht der Algorithmus seine Einbettung mit der des aktuellen Chunks. Wenn der neue Satz semantisch nahe genug ist, wird er in den Chunk eingefügt. Wenn er zu weit entfernt ist, beginnt der Algorithmus einen neuen Chunk. Die wichtigste Einschränkung ist, dass die Chunks der ursprünglichen Satzreihenfolge folgen müssen - keine Umordnung, kein globales Clustering.</p>
<p>Das Ergebnis ist eine Reihe von Chunks mit variabler Länge, die widerspiegeln, wo sich die Bedeutung des Dokuments tatsächlich ändert, und nicht, wo ein Zeichenzähler zufällig auf Null steht.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Wie die Max-Min Semantic Chunking Strategie funktioniert<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking bestimmt die Chunk-Grenzen, indem es vergleicht, wie sich die Sätze im hochdimensionalen Vektorraum zueinander verhalten. Anstatt sich auf feste Längen zu verlassen, wird untersucht, wie sich die Bedeutung im Dokument verschiebt. Der Prozess kann in sechs Schritte unterteilt werden:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Alle Sätze einbetten und einen Chunk beginnen</h3><p>Das Einbettungsmodell wandelt jeden Satz des Dokuments in eine Vektoreinbettung um. Es verarbeitet die Sätze der Reihe nach. Wenn die ersten <em>n-k</em> Sätze den aktuellen Chunk C bilden, muss der folgende Satz (sₙ₋ₖ₊₁) bewertet werden: Soll er sich C anschließen oder einen neuen Chunk beginnen?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Messen Sie, wie konsistent der aktuelle Chunk ist</h3><p>Berechnen Sie innerhalb des Chunks C die minimale paarweise Kosinusähnlichkeit zwischen allen Satzeinbettungen. Dieser Wert gibt an, wie eng die Sätze innerhalb des Chunks miteinander verwandt sind. Eine geringere minimale Ähnlichkeit zeigt an, dass die Sätze weniger miteinander verwandt sind, was darauf hindeutet, dass der Chunk möglicherweise geteilt werden muss.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Vergleichen Sie den neuen Satz mit dem Chunk</h3><p>Berechnen Sie als nächstes die maximale Cosinus-Ähnlichkeit zwischen dem neuen Satz und allen Sätzen, die bereits in C enthalten sind. Dies zeigt, wie gut der neue Satz semantisch mit dem bestehenden Chunk übereinstimmt.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Entscheiden Sie, ob Sie den Chunk erweitern oder einen neuen Chunk beginnen wollen.</h3><p>Dies ist die Kernregel:</p>
<ul>
<li><p>Wenn <strong>die maximale Ähnlichkeit des neuen Satzes</strong> mit dem Chunk <strong>C</strong> <strong>größer oder gleich der</strong> <strong>minimalen Ähnlichkeit innerhalb von C</strong> ist, → passt der neue Satz und bleibt im Chunk.</p></li>
<li><p>Andernfalls → wird ein neuer Chunk begonnen.</p></li>
</ul>
<p>Dadurch wird sichergestellt, dass jeder Chunk seine interne semantische Konsistenz beibehält.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Anpassung der Schwellenwerte, wenn sich das Dokument ändert</h3><p>Um die Qualität der Chunks zu optimieren, können Parameter wie die Chunk-Größe und die Ähnlichkeitsschwellen dynamisch angepasst werden. Dadurch kann sich der Algorithmus an unterschiedliche Dokumentstrukturen und semantische Dichten anpassen.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Behandlung der ersten paar Sätze</h3><p>Wenn ein Chunk nur einen Satz enthält, behandelt der Algorithmus den ersten Vergleich mit einer festen Ähnlichkeitsschwelle. Wenn die Ähnlichkeit zwischen Satz 1 und Satz 2 über diesem Schwellenwert liegt, bilden sie einen Chunk. Wenn nicht, werden sie sofort getrennt.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Stärken und Grenzen des Max-Min Semantic Chunking<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking verbessert die Art und Weise, wie RAG-Systeme Text aufteilen, indem es die Bedeutung anstelle der Länge verwendet, aber es ist kein Allheilmittel. Hier ein praktischer Blick darauf, was es gut kann und wo es noch Schwächen hat.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">Was es gut kann</h3><p>Max-Min Semantic Chunking verbessert das traditionelle Chunking in drei wichtigen Punkten:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Dynamische, bedeutungsgesteuerte Chunk-Grenzen</strong></h4><p>Im Gegensatz zu Ansätzen, die auf festen Größen oder Strukturen basieren, stützt sich diese Methode auf die semantische Ähnlichkeit, um das Chunking zu steuern. Sie vergleicht die minimale Ähnlichkeit innerhalb des aktuellen Chunks (wie kohäsiv er ist) mit der maximalen Ähnlichkeit zwischen dem neuen Satz und diesem Chunk (wie gut er passt). Ist letztere höher, schließt sich der Satz dem Chunk an; andernfalls beginnt ein neuer Chunk.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Einfache, praktische Parameterabstimmung</strong></h4><p>Der Algorithmus hängt von nur drei zentralen Hyperparametern ab:</p>
<ul>
<li><p>der <strong>maximalen Chunk-Größe</strong>,</p></li>
<li><p>der <strong>Mindestähnlichkeit</strong> zwischen den ersten beiden Sätzen und</p></li>
<li><p>der <strong>Ähnlichkeitsschwelle</strong> für das Hinzufügen neuer Sätze.</p></li>
</ul>
<p>Diese Parameter passen sich automatisch an den Kontext an - größere Chunks erfordern strengere Ähnlichkeitsschwellen, um die Kohärenz zu wahren.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Geringer Verarbeitungsaufwand</strong></h4><p>Da die RAG-Pipeline bereits Satzeinbettungen berechnet, erfordert Max-Min Semantic Chunking keine zusätzlichen Berechnungen. Alles, was es braucht, ist eine Reihe von Kosinus-Ähnlichkeitsprüfungen beim Durchsuchen von Sätzen. Das macht es billiger als viele semantische Chunking-Techniken, die zusätzliche Modelle oder mehrstufiges Clustering erfordern.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">Was es noch nicht lösen kann</h3><p>Max-Min Semantic Chunking verbessert zwar die Chunk-Grenzen, beseitigt aber nicht alle Herausforderungen der Dokumentensegmentierung. Da der Algorithmus die Sätze der Reihe nach verarbeitet und nur lokal clustert, kann er in längeren oder komplexeren Dokumenten immer noch weitreichende Beziehungen übersehen.</p>
<p>Ein häufiges Problem ist die <strong>Kontextfragmentierung</strong>. Wenn wichtige Informationen über verschiedene Teile eines Dokuments verstreut sind, kann der Algorithmus diese Teile in separate Chunks einteilen. Jeder Teil enthält dann nur einen Teil der Bedeutung.</p>
<p>In den Versionshinweisen zu Milvus 2.4.13 (siehe unten) enthält ein Chunk beispielsweise die Versionskennung, während ein anderer die Funktionsliste enthält. Eine Abfrage wie <em>"Welche neuen Funktionen wurden in Milvus 2.4.13 eingeführt?"</em> hängt von beiden ab. Wenn diese Details auf verschiedene Chunks aufgeteilt sind, kann das Einbettungsmodell sie nicht miteinander verbinden, was zu einer schlechteren Suche führt.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Beispiel für die Kontextfragmentierung in Milvus 2.4.13 Release Notes mit Versionskennung und Feature-Liste in separaten Chunks</span> </span></li>
</ul>
<p>Diese Fragmentierung wirkt sich auch auf die LLM-Generierungsphase aus. Wenn sich die Versionsreferenz in einem Chunk und die Merkmalsbeschreibungen in einem anderen Chunk befinden, erhält das Modell einen unvollständigen Kontext und kann nicht sauber auf die Beziehung zwischen den beiden schließen.</p>
<p>Um diese Fälle zu entschärfen, verwenden Systeme oft Techniken wie gleitende Fenster, überlappende Chunk-Grenzen oder Multi-Pass-Scans. Mit diesen Ansätzen wird ein Teil des fehlenden Kontexts wiederhergestellt, die Fragmentierung verringert und der Abruf von zusammenhängenden Informationen erleichtert.</p>
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
    </button></h2><p>Max-Min Semantic Chunking ist keine magische Lösung für jedes RAG-Problem, aber es gibt uns einen vernünftigeren Weg, um über Chunk-Grenzen nachzudenken. Anstatt Token-Grenzen entscheiden zu lassen, wo Ideen zerhackt werden, werden Einbettungen verwendet, um zu erkennen, wo sich die Bedeutung tatsächlich verschiebt. Bei vielen realen Dokumenten - APIs, Spezifikationen, Protokollen, Versionshinweisen und Anleitungen zur Fehlerbehebung - kann allein dadurch die Abrufqualität deutlich verbessert werden.</p>
<p>Was mir an diesem Ansatz gefällt, ist, dass er sich ganz natürlich in bestehende RAG-Pipelines einfügt. Wenn Sie bereits Sätze oder Absätze einbetten, bestehen die zusätzlichen Kosten im Wesentlichen aus ein paar Kosinus-Ähnlichkeitsprüfungen. Sie brauchen keine zusätzlichen Modelle, kein komplexes Clustering und keine aufwändige Vorverarbeitung. Und wenn es funktioniert, fühlen sich die erzeugten Chunks "menschlicher" an - näher daran, wie wir Informationen beim Lesen mental gruppieren.</p>
<p>Aber die Methode hat immer noch blinde Flecken. Sie sieht die Bedeutung nur lokal und kann Informationen, die absichtlich auseinandergezogen wurden, nicht wieder zusammenfügen. Überlappende Fenster, Scans in mehreren Durchgängen und andere kontexterhaltende Tricks sind nach wie vor erforderlich, insbesondere bei Dokumenten, in denen Verweise und Erklärungen weit voneinander entfernt sind.</p>
<p>Dennoch geht das Max-Min Semantic Chunking in die richtige Richtung: weg von der willkürlichen Textaufteilung und hin zu Retrieval-Pipelines, die tatsächlich die Semantik berücksichtigen. Wenn Sie nach Möglichkeiten suchen, RAG zuverlässiger zu machen, lohnt es sich, damit zu experimentieren.</p>
<p>Haben Sie Fragen oder möchten Sie die Leistung von RAG weiter verbessern? Treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> bei und tauschen Sie sich mit Ingenieuren aus, die tagtäglich echte Retrievalsysteme entwickeln und optimieren.</p>
