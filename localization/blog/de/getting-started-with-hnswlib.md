---
id: getting-started-with-hnswlib.md
title: Erste Schritte mit HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, eine Bibliothek, die HNSW implementiert, ist hocheffizient und
  skalierbar. Sie ist selbst bei Millionen von Punkten sehr leistungsfähig.
  Erfahren Sie, wie Sie sie in wenigen Minuten implementieren können.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p>Die<a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a> ermöglicht es Maschinen, Sprache zu verstehen und bessere Suchergebnisse zu erzielen, was für die KI und die Datenanalyse unerlässlich ist. Sobald die Sprache als <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">Einbettungen</a> dargestellt ist, kann die Suche mit exakten oder approximativen Methoden durchgeführt werden. Die ungefähre Suche nach dem nächsten Nachbarn<a href="https://zilliz.com/glossary/anns">(</a>Approximate Nearest Neighbor<a href="https://zilliz.com/glossary/anns">, ANN</a>) ist eine Methode, mit der schnell die Punkte in einem Datensatz gefunden werden können, die einem bestimmten Abfragepunkt am nächsten liegen, im Gegensatz zur <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">exakten Suche nach dem nächsten Nachbarn</a>, die bei hochdimensionalen Daten sehr rechenintensiv sein kann. ANN ermöglicht einen schnelleren Abruf, indem es Ergebnisse liefert, die den nächsten Nachbarn annähernd entsprechen.</p>
<p>Einer der Algorithmen für die Approximate Nearest Neighbor (ANN)-Suche ist <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), der unter <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a> implementiert ist und auf den wir uns heute konzentrieren werden. In diesem Blog werden wir:</p>
<ul>
<li><p>Den HNSW-Algorithmus verstehen.</p></li>
<li><p>HNSWlib und seine Hauptmerkmale kennenlernen.</p></li>
<li><p>Einrichten von HNSWlib, einschließlich Indexerstellung und Suchimplementierung.</p></li>
<li><p>Vergleich mit Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Verstehen von HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> ist eine graphenbasierte Datenstruktur, die eine effiziente Ähnlichkeitssuche, insbesondere in hochdimensionalen Räumen, ermöglicht, indem sie einen mehrschichtigen Graphen aus "Small World"-Netzwerken aufbaut. Die <a href="https://arxiv.org/abs/1603.09320">2016</a> eingeführte HNSW löst die Skalierbarkeitsprobleme, die mit herkömmlichen Suchmethoden wie Brute-Force- und baumbasierten Suchen verbunden sind. Es ist ideal für Anwendungen mit großen Datensätzen, wie Empfehlungssysteme, Bilderkennung und <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">Retrieval-Augmented Generation (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Warum HNSW wichtig ist</h3><p>HNSW verbessert die Leistung der Nearest-Neighbor-Suche in hochdimensionalen Räumen erheblich. Durch die Kombination der hierarchischen Struktur mit der Navigierbarkeit in kleinen Welten wird die rechnerische Ineffizienz älterer Methoden vermieden, so dass selbst bei großen, komplexen Datensätzen gute Ergebnisse erzielt werden können. Um dies besser zu verstehen, wollen wir uns nun ansehen, wie es funktioniert.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Wie HNSW funktioniert</h3><ol>
<li><p><strong>Hierarchische Schichten:</strong> HNSW organisiert die Daten in einer Hierarchie von Ebenen, wobei jede Ebene Knoten enthält, die durch Kanten verbunden sind. Die obersten Ebenen sind spärlicher und ermöglichen ein weites "Überspringen" des Graphen, ähnlich wie das Herauszoomen aus einer Karte, um nur die wichtigsten Autobahnen zwischen Städten zu sehen. Die unteren Schichten werden immer dichter und bieten feinere Details und mehr Verbindungen zwischen näheren Nachbarn.</p></li>
<li><p><strong>Konzept der navigierbaren kleinen Welten:</strong> Jede Ebene in HNSW baut auf dem Konzept eines "Small World"-Netzes auf, in dem die Knoten (Datenpunkte) nur wenige "Hops" voneinander entfernt sind. Der Suchalgorithmus beginnt auf der obersten, spärlichsten Ebene und arbeitet sich nach unten vor, wobei er sich zu immer dichteren Ebenen bewegt, um die Suche zu verfeinern. Auf diese Weise wird das Suchgebiet schrittweise eingegrenzt, indem man sich von einer globalen Ansicht bis hinunter zu Details auf Nachbarschaftsebene bewegt.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Abb. 1</a>: Ein Beispiel für einen navigierbaren Small World Graph</p>
<ol start="3">
<li><strong>Listenähnliche Struktur überspringen:</strong> Der hierarchische Aspekt von HNSW ähnelt einer Sprungliste, einer probabilistischen Datenstruktur, bei der höhere Ebenen weniger Knoten haben, was eine schnellere Anfangssuche ermöglicht.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Abb. 2</a>: Ein Beispiel für eine Sprunglistenstruktur</p>
<p>Für die Suche nach 96 in der gegebenen Sprungliste beginnen wir auf der obersten Ebene ganz links beim Kopfknoten. Wenn wir uns nach rechts bewegen, stoßen wir auf 31, also weniger als 96, also fahren wir mit dem nächsten Knoten fort. Nun müssen wir eine Ebene tiefer gehen, wo wir wieder auf 31 stoßen; da es immer noch weniger als 96 ist, gehen wir eine weitere Ebene hinunter. Nachdem wir erneut 31 gefunden haben, gehen wir nach rechts und erreichen 96, unseren Zielwert. Auf diese Weise finden wir 96, ohne auf die untersten Ebenen der Sprungliste hinabsteigen zu müssen.</p>
<ol start="4">
<li><p><strong>Such-Effizienz:</strong> Der HNSW-Algorithmus beginnt mit einem Einstiegsknoten auf der höchsten Ebene und rückt mit jedem Schritt zu näheren Nachbarn vor. Er steigt durch die Ebenen hinab, wobei er jede Ebene für eine grob- bis feinkörnige Erkundung nutzt, bis er die unterste Ebene erreicht, in der die ähnlichsten Knoten wahrscheinlich gefunden werden. Diese schichtweise Navigation reduziert die Anzahl der zu untersuchenden Knoten und Kanten und macht die Suche schnell und genau.</p></li>
<li><p><strong>Einfügung und Pflege</strong>: Beim Hinzufügen eines neuen Knotens bestimmt der Algorithmus seine Eintrittsebene auf der Grundlage der Wahrscheinlichkeit und verbindet ihn mit nahegelegenen Knoten unter Verwendung einer Heuristik zur Auswahl von Nachbarn. Die Heuristik zielt darauf ab, die Konnektivität zu optimieren und Links zu erstellen, die die Navigierbarkeit verbessern und gleichzeitig die Graphendichte ausgleichen. Durch diesen Ansatz bleibt die Struktur robust und anpassungsfähig an neue Datenpunkte.</p></li>
</ol>
<p>Obwohl wir ein grundlegendes Verständnis des HNSW-Algorithmus haben, kann die Implementierung von Grund auf überwältigend sein. Glücklicherweise hat die Community Bibliotheken wie <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> entwickelt, um die Verwendung zu vereinfachen und den Zugang zu erleichtern, ohne sich den Kopf zu zerbrechen. Werfen wir also einen genaueren Blick auf HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Überblick über HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, eine weit verbreitete Bibliothek zur Implementierung von HNSW, ist äußerst effizient und skalierbar und erbringt selbst bei Millionen von Punkten gute Leistungen. Sie erreicht eine sublineare Zeitkomplexität, indem sie schnelle Sprünge zwischen Graphenschichten ermöglicht und die Suche nach dichten, hochdimensionalen Daten optimiert. Hier sind die wichtigsten Merkmale von HNSWlib:</p>
<ul>
<li><p><strong>Graph-basierte Struktur:</strong> Ein mehrschichtiger Graph repräsentiert Datenpunkte und ermöglicht eine schnelle Suche nach den nächsten Nachbarn.</p></li>
<li><p><strong>Hochdimensionale Effizienz:</strong> Optimiert für hochdimensionale Daten, ermöglicht schnelle und genaue Näherungssuchen.</p></li>
<li><p><strong>Sublineare Suchzeit</strong>: Erreicht sublineare Komplexität durch das Überspringen von Schichten, was die Geschwindigkeit deutlich erhöht.</p></li>
<li><p><strong>Dynamische Aktualisierungen:</strong> Unterstützt das Einfügen und Löschen von Knoten in Echtzeit, ohne dass ein kompletter Neuaufbau des Graphen erforderlich ist.</p></li>
<li><p><strong>Speichereffizienz:</strong> Effiziente Speichernutzung, geeignet für große Datensätze.</p></li>
<li><p><strong>Skalierbarkeit:</strong> Gute Skalierbarkeit für Millionen von Datenpunkten, ideal für mittelgroße Anwendungen wie Empfehlungssysteme.</p></li>
</ul>
<p><strong>Hinweis:</strong> HNSWlib eignet sich hervorragend für die Erstellung einfacher Prototypen für Vektorsuchanwendungen. Aufgrund der eingeschränkten Skalierbarkeit gibt es jedoch möglicherweise bessere Möglichkeiten, wie z. B. <a href="https://zilliz.com/blog/what-is-a-real-vector-database">speziell entwickelte Vektordatenbanken</a> für komplexere Szenarien mit Hunderten von Millionen oder sogar Milliarden von Datenpunkten. Lassen Sie uns das in Aktion sehen.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Erste Schritte mit HNSWlib: Eine Schritt-für-Schritt-Anleitung<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Abschnitt wird die Verwendung von HNSWlib als <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Vektorsuchbibliothek</a> demonstriert, indem ein HNSW-Index erstellt, Daten eingefügt und Suchen durchgeführt werden. Beginnen wir mit der Installation:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Einrichtung und Importe</h3><p>Um mit HNSWlib in Python zu beginnen, installieren Sie es zunächst mit pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Dann importieren Sie die erforderlichen Bibliotheken:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Daten vorbereiten</h3><p>In diesem Beispiel werden wir <code translate="no">NumPy</code>verwenden, um einen Zufallsdatensatz mit 10.000 Elementen zu erzeugen, jedes mit einer Dimension von 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Lassen Sie uns die Daten erstellen:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Da unsere Daten nun bereit sind, können wir einen Index erstellen.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Erstellen eines Indexes</h3><p>Um einen Index zu erstellen, müssen wir die Dimensionalität der Vektoren und den Raumtyp festlegen. Lassen Sie uns einen Index erstellen:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Dieser Parameter definiert die für die Ähnlichkeit verwendete Distanzmetrik. Wenn Sie ihn auf <code translate="no">'l2'</code> setzen, wird der euklidische Abstand (L2-Norm) verwendet. Wenn Sie ihn stattdessen auf <code translate="no">'ip'</code> setzen, wird das innere Produkt verwendet, was für Aufgaben wie Kosinusähnlichkeit hilfreich ist.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Dieser Parameter gibt die Dimensionalität der Datenpunkte an, mit denen Sie arbeiten werden. Er muss mit der Dimension der Daten übereinstimmen, die Sie dem Index hinzufügen möchten.</li>
</ul>
<p>So initialisieren Sie einen Index:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Hier wird die maximale Anzahl der Elemente festgelegt, die dem Index hinzugefügt werden können. <code translate="no">Num_elements</code> ist die maximale Kapazität, also setzen wir diese auf 10.000, da wir mit 10.000 Datenpunkten arbeiten.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Dieser Parameter steuert den Kompromiss zwischen Genauigkeit und Konstruktionsgeschwindigkeit bei der Indexerstellung. Ein höherer Wert verbessert die Wiederauffindbarkeit (Genauigkeit), erhöht aber den Speicherverbrauch und die Erstellungszeit. Übliche Werte reichen von 100 bis 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Dieser Parameter bestimmt die Anzahl der bidirektionalen Links, die für jeden Datenpunkt erstellt werden, und beeinflusst die Genauigkeit und die Suchgeschwindigkeit. Typische Werte liegen zwischen 12 und 48; 16 ist oft ein gutes Gleichgewicht für moderate Genauigkeit und Geschwindigkeit.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: Der Parameter <code translate="no">ef</code>, kurz für "Explorationsfaktor", bestimmt, wie viele Nachbarn bei einer Suche untersucht werden. Ein höherer <code translate="no">ef</code> Wert führt dazu, dass mehr Nachbarn untersucht werden, was im Allgemeinen die Genauigkeit (Recall) der Suche erhöht, sie aber auch langsamer macht. Umgekehrt kann ein niedriger <code translate="no">ef</code> Wert die Suche beschleunigen, aber auch die Genauigkeit verringern.</li>
</ul>
<p>In diesem Fall bedeutet die Einstellung von <code translate="no">ef</code> auf 50, dass der Suchalgorithmus bei der Suche nach den ähnlichsten Datenpunkten bis zu 50 Nachbarn auswertet.</p>
<p>Hinweis: <code translate="no">ef_construction</code> legt den Aufwand für die Nachbarschaftssuche während der Indexerstellung fest, was die Genauigkeit erhöht, aber den Aufbau verlangsamt. <code translate="no">ef</code> steuert den Suchaufwand während der Abfrage, wobei Geschwindigkeit und Abruf für jede Abfrage dynamisch ausgeglichen werden.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Durchführen von Suchvorgängen</h3><p>Um eine Suche nach nächsten Nachbarn mit HNSWlib durchzuführen, erstellen wir zunächst einen zufälligen Abfragevektor. In diesem Beispiel entspricht die Dimensionalität des Vektors den indizierten Daten.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Diese Zeile erzeugt einen Zufallsvektor mit der gleichen Dimensionalität wie die indizierten Daten, um die Kompatibilität für die Nearest-Neighbour-Suche zu gewährleisten.</li>
<li><code translate="no">knn_query</code>: Die Methode sucht nach den <code translate="no">k</code> nächsten Nachbarn von <code translate="no">query_vector</code> innerhalb des Index <code translate="no">p</code>. Sie gibt zwei Arrays zurück: <code translate="no">labels</code>, die die Indizes der nächsten Nachbarn enthalten, und <code translate="no">distances</code>, die die Entfernungen vom Abfragevektor zu jedem dieser Nachbarn angeben. Hier gibt <code translate="no">k=5</code> an, dass wir die fünf nächsten Nachbarn finden wollen.</li>
</ul>
<p>Hier sind die Ergebnisse nach dem Ausdrucken der Bezeichnungen und Abstände:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Dies ist eine einfache Anleitung, um mit der HNSWlib loszulegen.</p>
<p>Wie bereits erwähnt, ist HNSWlib eine großartige Vektorsuchmaschine für das Prototyping oder das Experimentieren mit mittelgroßen Datensätzen. Wenn Sie höhere Anforderungen an die Skalierbarkeit haben oder andere Funktionen auf Unternehmensebene benötigen, sollten Sie sich für eine speziell entwickelte Vektordatenbank wie die Open-Source-Datenbank <a href="https://zilliz.com/what-is-milvus">Milvus</a> oder den vollständig verwalteten Dienst auf <a href="https://zilliz.com/cloud">Zilliz Cloud</a> entscheiden. Im folgenden Abschnitt werden wir HNSWlib mit Milvus vergleichen.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib vs. zweckbestimmte Vektordatenbanken wie Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> speichert Daten als mathematische Repräsentationen und ermöglicht es <a href="https://zilliz.com/ai-models">Modellen des maschinellen Lernens</a>, die Suche, Empfehlungen und Texterstellung zu unterstützen, indem sie Daten durch <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Ähnlichkeitsmetriken</a> für ein kontextuelles Verständnis identifiziert.</p>
<p>Bibliotheken mit Vektorindizes wie HNSWlib verbessern die<a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuche</a> und -abfrage, verfügen jedoch nicht über die Verwaltungsfunktionen einer vollständigen Datenbank. Andererseits sind Vektordatenbanken wie <a href="https://milvus.io/">Milvus</a> darauf ausgelegt, Vektoreinbettungen in großem Umfang zu verarbeiten, und bieten Vorteile bei der Datenverwaltung, Indizierung und Abfragefunktionen, die eigenständigen Bibliotheken in der Regel fehlen. Hier sind einige weitere Vorteile der Verwendung von Milvus:</p>
<ul>
<li><p><strong>Hochgeschwindigkeits-Vektorähnlichkeitssuche</strong>: Milvus bietet eine Suchleistung im Millisekundenbereich über Vektordatensätze im Milliardenbereich, ideal für Anwendungen wie Bildabfrage, Empfehlungssysteme, Verarbeitung natürlicher Sprache<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>) und Retrieval Augmented Generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>Skalierbarkeit und Hochverfügbarkeit:</strong> Milvus wurde zur Bewältigung großer Datenmengen entwickelt, ist horizontal skalierbar und umfasst Replikations- und Failover-Mechanismen zur Gewährleistung der Zuverlässigkeit.</p></li>
<li><p><strong>Verteilte Architektur:</strong> Milvus verwendet eine verteilte, skalierbare Architektur, die Speicher und Datenverarbeitung auf mehrere Knoten verteilt, um Flexibilität und Robustheit zu gewährleisten.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Hybride Suche</strong></a><strong>:</strong> Milvus unterstützt multimodale Suche, hybride <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Sparse- und Dense-Suche</a> sowie hybride Dense- und <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">Volltextsuche</a> und bietet damit vielseitige und flexible Suchfunktionen.</p></li>
<li><p><strong>Flexible Datenunterstützung</strong>: Milvus unterstützt verschiedene Datentypen - Vektoren, Skalare und strukturierte Daten - und ermöglicht so eine nahtlose Verwaltung und Analyse innerhalb eines einzigen Systems.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Aktive Gemeinschaft</strong></a> <strong>und Unterstützung</strong>: Eine florierende Community bietet regelmäßige Updates, Tutorials und Support, um sicherzustellen, dass Milvus stets an den Bedürfnissen der Benutzer und den Fortschritten in diesem Bereich ausgerichtet ist.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">KI-Integration</a>: Milvus ist in verschiedene gängige KI-Frameworks und -Technologien integriert, was es Entwicklern erleichtert, Anwendungen mit ihren vertrauten Technologie-Stacks zu erstellen.</p></li>
</ul>
<p>Milvus bietet auch einen vollständig verwalteten Service in der <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, der problemlos und 10x schneller als Milvus ist.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Vergleich: Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Merkmal</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Skalierbarkeit</td><td style="text-align:center">Einfache Handhabung von Milliarden von Vektoren</td><td style="text-align:center">Geeignet für kleinere Datensätze aufgrund der RAM-Nutzung</td></tr>
<tr><td style="text-align:center">Ideal für</td><td style="text-align:center">Prototyping, Experimentieren und Anwendungen auf Unternehmensebene</td><td style="text-align:center">Konzentriert sich auf Prototypen und leichte ANN-Aufgaben</td></tr>
<tr><td style="text-align:center">Indizierung</td><td style="text-align:center">Unterstützt 10+ Indizierungsalgorithmen, einschließlich HNSW, DiskANN, Quantisierung und Binär</td><td style="text-align:center">Verwendet nur einen graphbasierten HNSW</td></tr>
<tr><td style="text-align:center">Integration</td><td style="text-align:center">Bietet APIs und Cloud-native Dienste</td><td style="text-align:center">Dient als leichtgewichtige, eigenständige Bibliothek</td></tr>
<tr><td style="text-align:center">Leistung</td><td style="text-align:center">Optimiert für große Daten und verteilte Abfragen</td><td style="text-align:center">Bietet hohe Geschwindigkeit, aber begrenzte Skalierbarkeit</td></tr>
</tbody>
</table>
<p>Insgesamt ist Milvus im Allgemeinen für groß angelegte, produktionsreife Anwendungen mit komplexen Indizierungsanforderungen zu bevorzugen, während HNSWlib ideal für Prototypen und einfachere Anwendungsfälle ist.</p>
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
    </button></h2><p>Die semantische Suche kann ressourcenintensiv sein, so dass eine interne Datenstrukturierung, wie sie von HNSW vorgenommen wird, für einen schnelleren Datenabruf unerlässlich ist. Bibliotheken wie HNSWlib kümmern sich um die Implementierung, so dass die Entwickler die Rezepte für die Prototypisierung von Vektorfunktionen zur Hand haben. Mit nur wenigen Codezeilen können wir unseren eigenen Index aufbauen und Suchvorgänge durchführen.</p>
<p>HNSWlib ist ein guter Anfang. Wenn Sie jedoch komplexe und produktionsreife KI-Anwendungen erstellen möchten, sind speziell entwickelte Vektordatenbanken die beste Option. <a href="https://milvus.io/">Milvus</a> zum Beispiel ist eine Open-Source-Vektordatenbank mit vielen unternehmenstauglichen Funktionen wie Hochgeschwindigkeits-Vektorsuche, Skalierbarkeit, Verfügbarkeit und Flexibilität in Bezug auf Datentypen und Programmiersprache.</p>
<h2 id="Further-Reading" class="common-anchor-header">Weitere Lektüre<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Was ist Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">Was ist HNSWlib? Eine Graph-basierte Bibliothek für schnelle ANN-Suche </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">Was ist ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Ein Open-Source VectorDB-Benchmark-Werkzeug</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative KI-Ressourcen-Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Was sind Vektordatenbanken und wie funktionieren sie? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Was ist RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Leistungsstarke KI-Modelle für Ihre GenAI-Anwendungen | Zilliz</a></p></li>
</ul>
