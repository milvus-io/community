---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Vektorsuche in der realen Welt: Wie man effizient filtert, ohne den
  Wiedererkennungswert zu zerstören
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Dieser Blog befasst sich mit gängigen Filtertechniken in der Vektorsuche und
  den innovativen Optimierungen, die wir in Milvus und Zilliz Cloud eingebaut
  haben.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Viele Leute denken, dass es bei der Vektorsuche einfach darum geht, einen ANN-Algorithmus (Approximate Nearest Neighbor) zu implementieren und dann Feierabend zu machen. Aber wenn Sie die Vektorsuche in der Produktion einsetzen, kennen Sie die Wahrheit: Es wird schnell kompliziert.</p>
<p>Stellen Sie sich vor, Sie bauen eine Produktsuchmaschine. Ein Benutzer könnte fragen: "<em>Zeigen Sie mir Schuhe, die diesem Foto ähnlich sind, aber nur in Rot und unter 100 $</em>." Um diese Anfrage zu beantworten, muss ein Metadatenfilter auf die Suchergebnisse der semantischen Ähnlichkeit angewendet werden. Klingt so einfach wie die Anwendung eines Filters nach den Ergebnissen Ihrer Vektorsuche? Nun, nicht ganz.</p>
<p>Was passiert, wenn Ihre Filterbedingung sehr selektiv ist? Sie erhalten dann möglicherweise nicht genügend Ergebnisse. Und eine einfache Erhöhung des <strong>topK-Parameters</strong> der Vektorsuche kann schnell zu einer Leistungsverschlechterung führen und erheblich mehr Ressourcen verbrauchen, um das gleiche Suchvolumen zu verarbeiten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Unter der Haube ist eine effiziente Metadatenfilterung eine ziemliche Herausforderung. Ihre Vektordatenbank muss den Graphenindex durchsuchen, Metadatenfilter anwenden und trotzdem innerhalb eines engen Latenzzeitbudgets von beispielsweise 20 Millisekunden antworten. Tausende solcher Abfragen pro Sekunde zu bedienen, ohne bankrott zu gehen, erfordert durchdachte Technik und sorgfältige Optimierung.</p>
<p>In diesem Blog werden gängige Filtertechniken in der Vektorsuche sowie die innovativen Optimierungen vorgestellt, die wir in die Vektordatenbank <a href="https://milvus.io/docs/overview.md">Milvus</a> und ihren vollständig verwalteten Cloud-Service<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) eingebaut haben. Außerdem zeigen wir anhand eines Benchmark-Tests, wie viel mehr Leistung die vollständig verwaltete Milvus-Datenbank mit einem Cloud-Budget von 1000 US-Dollar im Vergleich zu anderen Vektordatenbanken erreichen kann.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Graph-Index-Optimierung<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken benötigen effiziente Indizierungsmethoden, um große Datensätze zu verarbeiten. Ohne Indizes muss eine Datenbank Ihre Abfrage mit jedem Vektor im Datensatz vergleichen (Brute-Force-Scanning), was bei wachsenden Datenmengen extrem langsam wird.</p>
<p><strong>Milvus</strong> unterstützt verschiedene Indextypen, um dieses Leistungsproblem zu lösen. Die beliebtesten sind graphbasierte Indexarten: HNSW (läuft vollständig im Speicher) und DiskANN (nutzt sowohl Speicher als auch SSD). Diese Indizes organisieren Vektoren in einer Netzwerkstruktur, in der Nachbarschaften von Vektoren auf einer Karte miteinander verbunden sind, so dass Suchvorgänge schnell zu relevanten Ergebnissen navigieren können, während nur ein kleiner Teil aller Vektoren überprüft wird. <strong>Zilliz Cloud</strong>, der vollständig verwaltete Milvus-Dienst, geht noch einen Schritt weiter und führt Cardinal ein, eine fortschrittliche proprietäre Vektorsuchmaschine, die diese Indizes für eine noch bessere Leistung weiter verbessert.</p>
<p>Wenn wir jedoch Filteranforderungen hinzufügen (z. B. "nur Produkte unter 100 $ anzeigen"), entsteht ein neues Problem. Der Standardansatz ist die Erstellung eines <em>Bitsets</em> - einer Liste, in der markiert wird, welche Vektoren die Filterkriterien erfüllen. Bei der Suche berücksichtigt das System nur die Vektoren, die in diesem Bitset als gültig markiert sind. Dieser Ansatz erscheint logisch, führt aber zu einem ernsten Problem: <strong>unterbrochene Konnektivität</strong>. Wenn viele Vektoren herausgefiltert werden, werden die sorgfältig konstruierten Pfade in unserem Graphindex unterbrochen.</p>
<p>Hier ein einfaches Beispiel für das Problem: Im folgenden Diagramm ist Punkt A mit B, C und D verbunden, aber B, C und D sind nicht direkt miteinander verbunden. Wenn unser Filter den Punkt A entfernt (vielleicht ist er zu teuer), dann ist der Pfad zwischen B, C und D unterbrochen, auch wenn sie für unsere Suche relevant sind. Dadurch entstehen "Inseln" nicht miteinander verbundener Vektoren, die bei der Suche nicht mehr erreicht werden können, was die Qualität der Ergebnisse (Recall) beeinträchtigt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Es gibt zwei gängige Ansätze für das Filtern während der Durchquerung des Graphen: alle herausgefilterten Punkte im Voraus ausschließen oder alles einbeziehen und den Filter erst danach anwenden. Wie im folgenden Diagramm dargestellt, ist keiner der beiden Ansätze ideal. Wenn gefilterte Punkte vollständig übersprungen werden, kann die Wiederauffindbarkeit zusammenbrechen, wenn das Filterverhältnis sich 1 nähert (blaue Linie), während der Besuch jedes Punktes unabhängig von seinen Metadaten den Suchraum aufbläht und die Leistung erheblich verlangsamt (rote Linie).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Forscher haben mehrere Ansätze vorgeschlagen, um ein Gleichgewicht zwischen Auffindbarkeit und Leistung herzustellen:</p>
<ol>
<li><strong>Alpha-Strategie:</strong> Hierbei handelt es sich um einen probabilistischen Ansatz: Auch wenn ein Vektor nicht mit dem Filter übereinstimmt, wird er bei der Suche mit einer gewissen Wahrscheinlichkeit dennoch besucht. Diese Wahrscheinlichkeit (Alpha) hängt vom Filterverhältnis ab - also davon, wie streng der Filter ist. Dies hilft dabei, wesentliche Verbindungen im Graphen zu erhalten, ohne zu viele irrelevante Vektoren zu besuchen.</li>
</ol>
<ol start="2">
<li><strong>ACORN-Methode [1]:</strong> Bei der Standard-HNSW-Methode wird während der Indexerstellung eine Kantenbeschneidung vorgenommen, um einen dünnen Graphen zu erstellen und die Suche zu beschleunigen. Bei der ACORN-Methode wird dieser Schritt bewusst übersprungen, um mehr Kanten beizubehalten und die Konnektivität zu stärken - ein entscheidender Faktor, wenn Filter viele Knoten ausschließen könnten. In einigen Fällen erweitert ACORN auch die Nachbarliste eines jeden Knotens, indem es zusätzliche ungefähre nächste Nachbarn sammelt und so den Graphen weiter stärkt. Darüber hinaus blickt sein Traversal-Algorithmus zwei Schritte voraus (d. h. er untersucht Nachbarn von Nachbarn), was die Chancen erhöht, auch bei hohen Filterquoten gültige Pfade zu finden.</li>
</ol>
<ol start="3">
<li><strong>Dynamisch ausgewählte Nachbarn:</strong> Eine Methode, die die Alpha-Strategie verbessert. Anstatt sich auf probabilistisches Überspringen zu verlassen, wählt dieser Ansatz die nächsten Knoten während der Suche adaptiv aus. Er bietet mehr Kontrolle als die Alpha-Strategie.</li>
</ol>
<p>In Milvus haben wir die Alpha-Strategie zusammen mit anderen Optimierungstechniken implementiert. So wird beispielsweise dynamisch zwischen den Strategien gewechselt, wenn extrem selektive Filter erkannt werden: Wenn beispielsweise etwa 99 % der Daten nicht mit dem Filterausdruck übereinstimmen, würde die "Include-All"-Strategie dazu führen, dass sich die Pfade zur Durchquerung des Graphen erheblich verlängern, was zu Leistungseinbußen und isolierten "Dateninseln" führt. In solchen Fällen greift Milvus automatisch auf einen Brute-Force-Scan zurück und umgeht den Graphenindex vollständig, um die Effizienz zu steigern. In Cardinal, der Vektorsuchmaschine, die das vollständig verwaltete Milvus (Zilliz Cloud) antreibt, sind wir noch einen Schritt weiter gegangen, indem wir eine dynamische Kombination von "Include-All"- und "Exclude-All"-Traversalmethoden implementiert haben, die sich intelligent an die Datenstatistiken anpassen, um die Abfrageleistung zu optimieren.</p>
<p>Unsere Experimente mit dem Cohere 1M-Datensatz (Dimension = 768) unter Verwendung einer AWS r7gd.4xlarge-Instanz zeigen die Wirksamkeit dieses Ansatzes. Im folgenden Diagramm stellt die blaue Linie unsere dynamische Kombinationsstrategie dar, während die rote Linie den Basisansatz illustriert, der alle gefilterten Punkte im Diagramm durchläuft.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Metadaten-bewusste Indizierung<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine weitere Herausforderung ergibt sich aus der Beziehung zwischen Metadaten und Vektoreinbettungen. In den meisten Anwendungen haben die Metadateneigenschaften eines Artikels (z. B. der Preis eines Produkts) nur eine minimale Verbindung zu dem, was der Vektor tatsächlich darstellt (die semantische Bedeutung oder die visuellen Merkmale). So haben beispielsweise ein <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">90dressanda90-Kleid und ein</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90-Gürtel</span></span></span></span>denselben Preis, weisen aber völlig unterschiedliche visuelle Merkmale auf. Aufgrund dieser Diskrepanz ist die Kombination von Filtern und Vektorsuche naturgemäß ineffizient.</p>
<p>Um dieses Problem zu lösen, haben wir <strong>metadatenbasierte Vektorindizes</strong> entwickelt. Anstatt nur einen Graphen für alle Vektoren zu haben, werden spezielle "Untergraphen" für verschiedene Metadatenwerte erstellt. Wenn Ihre Daten z. B. Felder für "Farbe" und "Form" enthalten, werden für diese Felder separate Diagrammstrukturen erstellt.</p>
<p>Wenn Sie mit einem Filter wie "Farbe = blau" suchen, wird der farbspezifische Untergraph und nicht der Hauptgraph verwendet. Dies ist viel schneller, da die Untergrafik bereits um die Metadaten herum organisiert ist, nach denen Sie filtern.</p>
<p>In der folgenden Abbildung wird der Hauptgraphenindex als <strong>Basisgraph</strong> bezeichnet, während die spezialisierten Graphen, die für bestimmte Metadatenfelder erstellt wurden, als <strong>Spaltengraphen</strong> bezeichnet werden. Um die Speichernutzung effektiv zu verwalten, wird die Anzahl der Verbindungen, die jeder Punkt haben kann, begrenzt (out-degree). Wenn eine Suche keine Metadatenfilter enthält, wird standardmäßig der Basisgraph verwendet. Wenn Filter angewandt werden, wird auf das entsprechende Säulendiagramm umgeschaltet, was einen erheblichen Geschwindigkeitsvorteil bietet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Iterative Filterung<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Manchmal wird die Filterung selbst zum Engpass, nicht die Vektorsuche. Dies geschieht insbesondere bei komplexen Filtern wie JSON-Bedingungen oder detaillierten String-Vergleichen. Der herkömmliche Ansatz (erst filtern, dann suchen) kann extrem langsam sein, weil das System diese teuren Filter auf potenziell Millionen von Datensätzen auswerten muss, bevor es überhaupt mit der Vektorsuche beginnt.</p>
<p>Sie denken vielleicht: "Warum nicht erst die Vektorsuche durchführen und dann die besten Ergebnisse filtern?" Dieser Ansatz funktioniert manchmal, hat aber einen großen Nachteil: Wenn Ihr Filter streng ist und die meisten Ergebnisse herausfiltert, haben Sie nach der Filterung möglicherweise zu wenige (oder gar keine) Ergebnisse.</p>
<p>Um dieses Dilemma zu lösen, haben wir die <strong>iterative Filterung</strong> in Milvus und Zilliz Cloud entwickelt, inspiriert von<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Anstelle eines Alles-oder-Nichts-Ansatzes arbeitet die iterative Filterung in Stapeln:</p>
<ol>
<li><p>Erhalten Sie einen Stapel der engsten Vektorübereinstimmungen</p></li>
<li><p>Anwendung von Filtern auf diesen Stapel</p></li>
<li><p>Wenn wir nicht genügend gefilterte Ergebnisse haben, holen wir einen weiteren Stapel</p></li>
<li><p>Wiederholen Sie den Vorgang, bis Sie die erforderliche Anzahl von Ergebnissen haben.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dieser Ansatz reduziert die Anzahl der teuren Filteroperationen drastisch und stellt gleichzeitig sicher, dass genügend qualitativ hochwertige Ergebnisse zur Verfügung stehen. Weitere Informationen zur Aktivierung der iterativen Filterung finden Sie auf dieser <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">Dokumentseite zur iterativen Filterung</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">Externe Filterung<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele reale Anwendungen teilen ihre Daten auf verschiedene Systeme auf - Vektoren in einer Vektordatenbank und Metadaten in herkömmlichen Datenbanken. Viele Unternehmen speichern beispielsweise Produktbeschreibungen und Benutzerbewertungen als Vektoren in Milvus für die semantische Suche, während sie den Bestandsstatus, die Preise und andere strukturierte Daten in herkömmlichen Datenbanken wie PostgreSQL oder MongoDB speichern.</p>
<p>Diese Trennung ist architektonisch sinnvoll, stellt aber eine Herausforderung für die gefilterte Suche dar. Der typische Arbeitsablauf sieht folgendermaßen aus:</p>
<ul>
<li><p>Abfrage Ihrer relationalen Datenbank nach Datensätzen, die den Filterkriterien entsprechen (z. B. "vorrätige Artikel unter 50 $")</p></li>
<li><p>Abrufen der übereinstimmenden IDs und Übermittlung an Milvus zur Filterung der Vektorsuche</p></li>
<li><p>Führen Sie die semantische Suche nur nach Vektoren durch, die mit diesen IDs übereinstimmen.</p></li>
</ul>
<p>Das hört sich einfach an, aber wenn die Anzahl der Zeilen über Millionen hinausgeht, wird es zu einem Engpass. Die Übertragung großer Listen von IDs verbraucht Netzwerkbandbreite, und die Ausführung umfangreicher Filterausdrücke in Milvus verursacht zusätzlichen Overhead.</p>
<p>Um dieses Problem zu lösen, haben wir <strong>External Filtering</strong> in Milvus eingeführt, eine leichtgewichtige Lösung auf SDK-Ebene, die die Such-Iterator-API verwendet und den traditionellen Arbeitsablauf umkehrt.</p>
<ul>
<li><p>Führt zunächst eine Vektorsuche durch, wobei Stapel der semantisch relevantesten Kandidaten abgerufen werden</p></li>
<li><p>Wendet Ihre benutzerdefinierte Filterfunktion auf jeden Stapel auf der Client-Seite an</p></li>
<li><p>Ruft automatisch weitere Stapel ab, bis Sie genügend gefilterte Ergebnisse haben</p></li>
</ul>
<p>Dieser stapelweise, iterative Ansatz reduziert sowohl den Netzwerkverkehr als auch den Verarbeitungsaufwand erheblich, da Sie nur mit den vielversprechendsten Kandidaten aus der Vektorsuche arbeiten.</p>
<p>Hier ist ein Beispiel für die Verwendung der externen Filterung in pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>Im Gegensatz zur iterativen Filterung, die mit Iteratoren auf Segmentebene arbeitet, funktioniert die externe Filterung auf der globalen Abfrageebene. Dieses Design minimiert die Auswertung von Metadaten und vermeidet die Ausführung großer Filter innerhalb von Milvus, was zu einer schlankeren und schnelleren End-to-End-Leistung führt.</p>
<h2 id="AutoIndex" class="common-anchor-header">AutoIndex<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Vektorsuche ist immer mit einem Kompromiss zwischen Genauigkeit und Geschwindigkeit verbunden - je mehr Vektoren Sie überprüfen, desto besser sind Ihre Ergebnisse, aber desto langsamer ist Ihre Abfrage. Wenn Sie Filter hinzufügen, wird dieses Gleichgewicht noch schwieriger zu erreichen.</p>
<p>In Zilliz Cloud haben wir <strong>AutoIndex</strong> entwickelt - einen ML-basierten Optimierer, der dieses Gleichgewicht automatisch für Sie abstimmt. Anstatt komplexe Parameter manuell zu konfigurieren, nutzt AutoIndex maschinelles Lernen, um die optimalen Einstellungen für Ihre spezifischen Daten und Abfragemuster zu ermitteln.</p>
<p>Um zu verstehen, wie das funktioniert, ist es hilfreich, ein wenig über die Architektur von Milvus zu wissen, da Zilliz auf Milvus aufgebaut ist: Abfragen werden über mehrere QueryNode-Instanzen verteilt. Jeder Knoten bearbeitet einen Teil Ihrer Daten (ein Segment), führt seine Suche durch und die Ergebnisse werden dann zusammengeführt.</p>
<p>AutoIndex analysiert die Statistiken aus diesen Segmenten und nimmt intelligente Anpassungen vor. Bei einer niedrigen Filterquote wird der Abfragebereich des Index erweitert, um die Trefferquote zu erhöhen. Bei einem hohen Filterungsgrad wird der Abfragebereich eingegrenzt, um eine Verschwendung von Aufwand für unwahrscheinliche Kandidaten zu vermeiden. Diese Entscheidungen werden von statistischen Modellen geleitet, die die effektivste Suchstrategie für jedes spezifische Filterszenario vorhersagen.</p>
<p>AutoIndex geht über die Indizierungsparameter hinaus. Es hilft auch bei der Auswahl der besten Filterbewertungsstrategie. Durch das Parsen von Filterausdrücken und das Abtasten von Segmentdaten kann AutoIndex die Evaluierungskosten abschätzen. Wenn es hohe Evaluierungskosten feststellt, wechselt es automatisch zu effizienteren Techniken wie der iterativen Filterung. Diese dynamische Anpassung stellt sicher, dass Sie für jede Abfrage immer die am besten geeignete Strategie verwenden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Leistung bei einem Budget von 1.000 Dollar<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Theoretische Verbesserungen sind zwar wichtig, aber für die meisten Entwickler ist die Leistung in der Praxis entscheidend. Wir wollten testen, wie sich diese Optimierungen unter realistischen Budgeteinschränkungen auf die tatsächliche Anwendungsleistung auswirken.</p>
<p>Wir haben mehrere Vektordatenbanklösungen mit einem praktischen monatlichen Budget von 1.000 US-Dollar verglichen - ein angemessener Betrag, den viele Unternehmen für die Vektorsuchinfrastruktur bereitstellen würden. Für jede Lösung wählten wir die leistungsstärkste Instanzkonfiguration aus, die innerhalb dieser Budgetbeschränkung möglich war.</p>
<p>Für unsere Tests wurden verwendet:</p>
<ul>
<li><p>Der Cohere 1M-Datensatz mit 1 Million 768-dimensionalen Vektoren</p></li>
<li><p>Eine Mischung aus gefilterten und ungefilterten Suchaufgaben aus der Praxis</p></li>
<li><p>Das Open-Source-Benchmark-Tool vdb-bench für konsistente Vergleiche</p></li>
</ul>
<p>Die konkurrierenden Lösungen (anonymisiert als "VDB A", "VDB B" und "VDB C") wurden alle im Rahmen des Budgets optimal konfiguriert. Die Ergebnisse zeigten, dass die vollständig verwaltete Milvus (Zilliz Cloud) sowohl bei gefilterten als auch bei ungefilterten Abfragen durchweg den höchsten Durchsatz erzielte. Mit dem gleichen Budget von 1000 $ liefern unsere Optimierungstechniken die höchste Leistung bei wettbewerbsfähigem Abruf.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Die Vektorsuche mit Filterung mag oberflächlich betrachtet einfach aussehen - fügen Sie einfach eine Filterklausel zu Ihrer Abfrage hinzu, und Sie sind fertig. Wie wir jedoch in diesem Blog gezeigt haben, erfordert das Erzielen sowohl hoher Leistung als auch präziser Ergebnisse in großem Umfang ausgefeilte technische Lösungen. Milvus und Zilliz Cloud gehen diese Herausforderungen mit mehreren innovativen Ansätzen an:</p>
<ul>
<li><p><strong>Graph-Index-Optimierung</strong>: Pfade zwischen ähnlichen Elementen bleiben erhalten, selbst wenn Filter Verbindungsknoten entfernen, wodurch das "Insel"-Problem vermieden wird, das die Qualität der Ergebnisse beeinträchtigt.</p></li>
<li><p><strong>Metadaten-bewusste Indizierung</strong>: Erstellt spezielle Pfade für häufige Filterbedingungen, wodurch gefilterte Suchvorgänge erheblich schneller werden, ohne dass die Genauigkeit darunter leidet.</p></li>
<li><p><strong>Iterative Filterung</strong>: Verarbeitet Ergebnisse stapelweise und wendet komplexe Filter nur auf die vielversprechendsten Kandidaten anstelle des gesamten Datensatzes an.</p></li>
<li><p><strong>AutoIndex</strong>: Verwendet maschinelles Lernen, um die Suchparameter auf der Grundlage Ihrer Daten und Abfragen automatisch zu optimieren und so Geschwindigkeit und Genauigkeit ohne manuelle Konfiguration auszugleichen.</p></li>
<li><p><strong>Externe Filterung</strong>: Verbindet die Vektorsuche effizient mit externen Datenbanken und eliminiert so Netzwerkengpässe bei gleichbleibender Ergebnisqualität.</p></li>
</ul>
<p>Milvus und Zilliz Cloud entwickeln sich ständig weiter mit neuen Funktionen, die die gefilterte Suchleistung weiter verbessern. Funktionen wie<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> ermöglichen eine noch effizientere Datenorganisation auf der Grundlage von Filtermustern, und fortschrittliche Subgraph-Routing-Techniken verschieben die Leistungsgrenzen noch weiter.</p>
<p>Das Volumen und die Komplexität unstrukturierter Daten nehmen weiterhin exponentiell zu und stellen Suchsysteme überall vor neue Herausforderungen. Unser Team verschiebt ständig die Grenzen dessen, was mit Vektordatenbanken möglich ist, um eine schnellere und skalierbarere KI-gestützte Suche zu ermöglichen.</p>
<p>Wenn Ihre Anwendungen bei der gefilterten Vektorsuche auf Leistungsengpässe stoßen, laden wir Sie ein, unserer aktiven Entwickler-Community unter <a href="https://milvus.io/community">milvus.io/community</a> beizutreten - dort können Sie sich über Ihre Herausforderungen austauschen, Expertenrat einholen und neue Best Practices entdecken.</p>
<h2 id="References" class="common-anchor-header">Referenzen<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
