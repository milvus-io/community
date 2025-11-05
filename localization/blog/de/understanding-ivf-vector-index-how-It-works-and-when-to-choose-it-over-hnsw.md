---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  IVF-Vektor-Index verstehen: Wie er funktioniert und wann man ihn dem HNSW
  vorziehen sollte
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_cover_157df122bc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Erfahren Sie, wie der IVF-Vektorindex funktioniert, wie er die ANN-Suche
  beschleunigt und wann er HNSW in Bezug auf Geschwindigkeit, Speicher und
  Filtereffizienz übertrifft.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>In einer Vektordatenbank müssen wir oft schnell die ähnlichsten Ergebnisse in riesigen Sammlungen hochdimensionaler Vektoren finden, z. B. Bildmerkmale, Texteinbettungen oder Audiodarstellungen. Ohne einen Index besteht die einzige Möglichkeit darin, den Abfragevektor mit jedem einzelnen Vektor des Datensatzes zu vergleichen. Diese <strong>brachiale Suche</strong> mag bei einigen Tausend Vektoren funktionieren, aber sobald es um Dutzende oder Hunderte von Millionen geht, wird sie unerträglich langsam und rechenintensiv.</p>
<p>An dieser Stelle kommt die <strong>ANN-Suche (Approximate Nearest Neighbor)</strong> ins Spiel. Stellen Sie sich vor, Sie suchen in einer riesigen Bibliothek nach einem bestimmten Buch. Anstatt jedes Buch einzeln zu prüfen, beginnen Sie damit, die Abschnitte zu durchsuchen, in denen das Buch am ehesten zu finden ist. Sie erhalten vielleicht nicht <em>genau</em> die gleichen Ergebnisse wie bei einer vollständigen Suche, aber Sie kommen dem Ergebnis sehr nahe - und das in einem Bruchteil der Zeit. Kurz gesagt, ANN tauscht einen leichten Verlust an Genauigkeit gegen einen erheblichen Gewinn an Geschwindigkeit und Skalierbarkeit.</p>
<p>Unter den vielen Möglichkeiten, die ANN-Suche zu implementieren, sind <strong>IVF (Inverted File)</strong> und <strong>HNSW (Hierarchical Navigable Small World)</strong> zwei der am häufigsten verwendeten. IVF zeichnet sich jedoch durch seine Effizienz und Anpassungsfähigkeit bei der Vektorsuche in großem Maßstab aus. In diesem Artikel erläutern wir Ihnen, wie IVF funktioniert und wie es im Vergleich zu HNSW abschneidet, damit Sie die Vorteile der beiden Verfahren verstehen und das für Ihre Arbeitslast am besten geeignete auswählen können.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">Was ist ein IVF-Vektorindex?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF (Inverted File)</strong> ist einer der am häufigsten verwendeten Algorithmen für ANN. Seine Kernidee ist dem "invertierten Index" entlehnt, der in Textsuchsystemen verwendet wird - nur dass wir es diesmal nicht mit Wörtern und Dokumenten, sondern mit Vektoren in einem hochdimensionalen Raum zu tun haben.</p>
<p>Stellen Sie sich das so vor, als würden Sie eine riesige Bibliothek organisieren. Wenn man alle Bücher (Vektoren) auf einen riesigen Stapel werfen würde, würde es ewig dauern, das zu finden, was man braucht. IVF löst dieses Problem, indem es zunächst alle Vektoren in Gruppen ( <em>Buckets</em>) <strong>zusammenfasst</strong>. Jeder Bereich stellt eine "Kategorie" ähnlicher Vektoren dar, die durch einen <strong>Schwerpunkt</strong>definiert ist <strong>- eine</strong>Art Zusammenfassung oder "Etikett" für alles in diesem Cluster.</p>
<p>Wenn eine Abfrage eingeht, erfolgt die Suche in zwei Schritten:</p>
<p><strong>1. Suche nach den nächstgelegenen Clustern.</strong> Das System sucht nach den wenigen Clustern, deren Zentroide dem Abfragevektor am nächsten liegen - so als ob man sich direkt zu den zwei oder drei Bibliotheksabteilungen begibt, die das gesuchte Buch am wahrscheinlichsten haben.</p>
<p><strong>2. Suchen Sie in diesen Clustern.</strong> Sobald Sie sich in den richtigen Abteilungen befinden, müssen Sie nur noch eine kleine Gruppe von Büchern durchsuchen und nicht mehr die gesamte Bibliothek.</p>
<p>Auf diese Weise lässt sich der Berechnungsaufwand um Größenordnungen reduzieren. Sie erhalten immer noch hochpräzise Ergebnisse - aber viel schneller.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Aufbau eines IVF-Vektorindex<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Aufbau eines IVF-Vektorindexes umfasst drei Hauptschritte: K-means Clustering, Vektorzuordnung und Kompressionskodierung (optional). Der vollständige Prozess sieht wie folgt aus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Schritt 1: K-means Clustering</h3><p>Zunächst wird das K-Means-Clustering auf den Datensatz X angewendet, um den hochdimensionalen Vektorraum in n Listencluster zu unterteilen. Jeder Cluster wird durch einen Zentroid repräsentiert, der in der Zentroid-Tabelle C gespeichert wird. Die Anzahl der Zentroide, nlist, ist ein wichtiger Hyperparameter, der bestimmt, wie feinkörnig das Clustering sein wird.</p>
<p>So funktioniert k-means unter der Haube:</p>
<ul>
<li><p><strong>Initialisierung:</strong> Zufällige Auswahl von <em>nlist</em> Vektoren als anfängliche Zentroide.</p></li>
<li><p><strong>Zuweisung:</strong> Berechnen Sie für jeden Vektor den Abstand zu allen Zentren und ordnen Sie ihn dem nächstgelegenen zu.</p></li>
<li><p><strong>Aktualisieren:</strong> Berechnen Sie für jeden Cluster den Durchschnitt seiner Vektoren und legen Sie diesen als neuen Schwerpunkt fest.</p></li>
<li><p><strong>Iteration und Konvergenz:</strong> Wiederholen Sie die Zuweisung und Aktualisierung, bis sich die Schwerpunkte nicht mehr signifikant ändern oder eine maximale Anzahl von Iterationen erreicht ist.</p></li>
</ul>
<p>Sobald k-means konvergiert, bilden die resultierenden n-Listen-Schwerpunkte das "Indexverzeichnis" von IVF. Sie legen fest, wie der Datensatz grob partitioniert ist, so dass Abfragen den Suchraum später schnell eingrenzen können.</p>
<p>Denken Sie an die Analogie zur Bibliothek: Das Training von Zentroiden ist wie die Entscheidung, wie man Bücher nach Themen gruppiert:</p>
<ul>
<li><p>Eine größere nListe bedeutet mehr Abschnitte mit jeweils weniger, spezifischeren Büchern.</p></li>
<li><p>Eine kleinere nListe bedeutet weniger Abschnitte, die jeweils ein breiteres, gemischtes Themenspektrum abdecken.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Schritt 2: Vektorzuordnung</h3><p>Als Nächstes wird jeder Vektor dem Cluster zugeordnet, dessen Schwerpunkt ihm am nächsten liegt, wobei invertierte Listen (List_i) gebildet werden. Jede invertierte Liste speichert die IDs und Speicherinformationen aller Vektoren, die zu diesem Cluster gehören.</p>
<p>Dieser Schritt ist vergleichbar mit der Einordnung der Bücher in die jeweiligen Abteilungen. Wenn Sie später nach einem Titel suchen, brauchen Sie nur in den wenigen Abteilungen nachzusehen, in denen er am ehesten zu finden ist, anstatt die gesamte Bibliothek zu durchforsten.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Schritt 3: Komprimierungskodierung (optional)</h3><p>Um Speicherplatz zu sparen und die Berechnungen zu beschleunigen, können die Vektoren innerhalb jedes Clusters einer Kompressionskodierung unterzogen werden. Es gibt zwei gängige Ansätze:</p>
<ul>
<li><p><strong>SQ8 (Skalarquantisierung):</strong> Bei dieser Methode wird jede Dimension eines Vektors in 8 Bits quantisiert. Bei einem Standardvektor <code translate="no">float32</code> nimmt jede Dimension normalerweise 4 Byte ein. Mit SQ8 wird sie auf nur 1 Byte reduziert, wodurch ein Kompressionsverhältnis von 4:1 erreicht wird, während die Geometrie des Vektors weitgehend erhalten bleibt.</p></li>
<li><p><strong>PQ (Produktquantisierung):</strong> Hierbei wird ein hochdimensionaler Vektor in mehrere Unterräume aufgeteilt. So kann beispielsweise ein 128-dimensionaler Vektor in 8 Untervektoren mit je 16 Dimensionen unterteilt werden. In jedem Unterraum wird ein kleines Codebuch (typischerweise mit 256 Einträgen) trainiert, und jeder Untervektor wird durch einen 8-Bit-Index dargestellt, der auf den nächstgelegenen Codebucheintrag verweist. Das bedeutet, dass der ursprüngliche 128-D-Vektor <code translate="no">float32</code> (der 512 Bytes benötigt) mit nur 8 Bytes (8 Unterräume × je 1 Byte) dargestellt werden kann, wodurch ein Kompressionsverhältnis von 64:1 erreicht wird.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Verwendung des IVF-Vektorindex für die Suche<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald die Schwerpunkttabelle, die invertierten Listen, der Kompressionscodierer und die Codebücher (optional) erstellt sind, kann der IVF-Index zur Beschleunigung der Ähnlichkeitssuche verwendet werden. Der Prozess besteht in der Regel aus drei Hauptschritten, wie unten dargestellt:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Schritt 1: Berechnung der Entfernungen zwischen dem Abfragevektor und allen Zentroiden</h3><p>Wenn ein Abfragevektor q eintrifft, bestimmt das System zunächst, zu welchen Clustern er höchstwahrscheinlich gehören wird. Dann berechnet es den Abstand zwischen q und jedem Schwerpunkt in der Schwerpunkttabelle C - in der Regel unter Verwendung des euklidischen Abstands oder des inneren Produkts als Ähnlichkeitsmetrik. Die Zentroide werden dann nach ihrem Abstand zum Abfragevektor sortiert, so dass eine geordnete Liste vom nächsten bis zum entferntesten entsteht.</p>
<p>Wie in der Abbildung dargestellt, lautet die Reihenfolge zum Beispiel: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Schritt 2: Auswahl der nächstgelegenen nprobe-Cluster</h3><p>Um zu vermeiden, dass der gesamte Datensatz gescannt wird, sucht IVF nur in den obersten <em>nprobe-Clustern</em>, die dem Abfragevektor am nächsten sind.</p>
<p>Der Parameter nprobe definiert den Suchbereich und wirkt sich direkt auf das Gleichgewicht zwischen Geschwindigkeit und Wiedererkennungswert aus:</p>
<ul>
<li><p>Eine kleinere nprobe führt zu schnelleren Abfragen, kann aber die Trefferquote verringern.</p></li>
<li><p>Eine größere nprobe verbessert die Trefferquote, erhöht aber die Latenzzeit.</p></li>
</ul>
<p>In realen Systemen kann nprobe dynamisch auf der Grundlage des Latenzbudgets oder der Genauigkeitsanforderungen eingestellt werden. Wenn im obigen Beispiel nprobe = 2 ist, sucht das System nur in Cluster 2 und Cluster 4 - den beiden nächstgelegenen Clustern.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Schritt 3: Suche nach dem nächstgelegenen Nachbarn in den ausgewählten Clustern</h3><p>Sobald die Kandidatencluster ausgewählt sind, vergleicht das System den Abfragevektor q mit den darin gespeicherten Vektoren. Es gibt zwei Hauptvergleichsmodi:</p>
<ul>
<li><p><strong>Exakter Vergleich (IVF_FLAT)</strong>: Das System ruft die ursprünglichen Vektoren aus den ausgewählten Clustern ab und berechnet ihre Abstände zu q direkt, was die genauesten Ergebnisse liefert.</p></li>
<li><p><strong>Näherungsweiser Vergleich (IVF_PQ / IVF_SQ8)</strong>: Bei PQ- oder SQ8-Komprimierung verwendet das System eine <strong>Nachschlagetabellenmethode</strong>, um die Abstandsberechnung zu beschleunigen. Bevor die Suche beginnt, berechnet es die Abstände zwischen dem Abfragevektor und jedem Codebucheintrag. Dann kann es für jeden Vektor diese vorberechneten Abstände einfach "nachschlagen und summieren", um die Ähnlichkeit zu schätzen.</p></li>
</ul>
<p>Schließlich werden die Kandidatenergebnisse aus allen durchsuchten Clustern zusammengeführt und neu geordnet, so dass die Top-k-Vektoren mit der größten Ähnlichkeit die endgültige Ausgabe bilden.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">IVF in der Praxis<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie einmal verstanden haben, wie IVF-Vektorindizes <strong>erstellt</strong> und <strong>durchsucht werden</strong>, besteht der nächste Schritt darin, sie für reale Arbeitslasten anzuwenden. In der Praxis müssen Sie oft ein Gleichgewicht zwischen <strong>Leistung</strong>, <strong>Genauigkeit</strong> und <strong>Speichernutzung</strong> finden. Im Folgenden finden Sie einige praktische Richtlinien, die aus der Erfahrung der Ingenieure stammen.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Wie man die richtige nlist auswählt</h3><p>Wie bereits erwähnt, bestimmt der Parameter nlist die Anzahl der Cluster, in die der Datensatz beim Aufbau eines IVF-Index unterteilt wird.</p>
<ul>
<li><p><strong>Größere nlist</strong>: Erzeugt feinere Cluster, d. h. jeder Cluster enthält weniger Vektoren. Dies reduziert die Anzahl der Vektoren, die während der Suche gescannt werden, und führt im Allgemeinen zu schnelleren Abfragen. Der Aufbau des Index dauert jedoch länger, und die Schwerpunkttabelle verbraucht mehr Speicher.</p></li>
<li><p><strong>Kleinere nlist</strong>: Beschleunigt den Indexaufbau und reduziert den Speicherverbrauch, aber jeder Cluster wird "überfüllt". Jede Abfrage muss mehr Vektoren innerhalb eines Clusters scannen, was zu Leistungsengpässen führen kann.</p></li>
</ul>
<p>Auf der Grundlage dieser Kompromisse gibt es eine praktische Faustregel:</p>
<p>Für Datensätze im <strong>Millionenbereich</strong> ist ein guter Ausgangspunkt <strong>nlist ≈ √n</strong> (n ist die Anzahl der Vektoren in dem zu indizierenden Datenshard).</p>
<p>Wenn Sie zum Beispiel 1 Million Vektoren haben, versuchen Sie nlist = 1.000. Bei größeren Datensätzen - zehn oder hundert Millionen - schichten die meisten Vektordatenbanken die Daten so auf, dass jede Scherbe etwa eine Million Vektoren enthält, so dass diese Regel praktikabel bleibt.</p>
<p>Da nlist bei der Indexerstellung festgelegt wird, bedeutet eine spätere Änderung, dass der gesamte Index neu erstellt werden muss. Daher ist es am besten, frühzeitig zu experimentieren. Testen Sie mehrere Werte - idealerweise in Zweierpotenzen (z. B. 1024, 2048) -, um den Sweet Spot zu finden, der Geschwindigkeit, Genauigkeit und Speicherplatz für Ihre Arbeitslast ausgleicht.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Abstimmen von nprobe</h3><p>Der Parameter nprobe steuert die Anzahl der Cluster, die während der Abfragezeit durchsucht werden. Er wirkt sich direkt auf den Kompromiss zwischen Abruf und Latenzzeit aus.</p>
<ul>
<li><p><strong>Größere nprobe</strong>: Deckt mehr Cluster ab, was zu einer höheren Auffindbarkeit, aber auch zu einer höheren Latenz führt. Die Verzögerung steigt im Allgemeinen linear mit der Anzahl der durchsuchten Cluster.</p></li>
<li><p><strong>Kleinere nprobe</strong>: Durchsucht weniger Cluster, was zu geringeren Latenzzeiten und schnelleren Abfragen führt. Es können jedoch einige echte nächste Nachbarn übersehen werden, was zu einer geringfügigen Verringerung der Auffindbarkeit und der Ergebnisgenauigkeit führt.</p></li>
</ul>
<p>Wenn Ihre Anwendung nicht extrem latenzempfindlich ist, empfiehlt es sich, mit nprobe dynamisch zu experimentieren, z. B. durch Testen von Werten zwischen 1 und 16, um zu beobachten, wie sich Recall und Latenz verändern. Ziel ist es, den Sweet Spot zu finden, bei dem der Rückruf akzeptabel ist und die Latenz innerhalb des Zielbereichs bleibt.</p>
<p>Da es sich bei nprobe um einen Laufzeit-Suchparameter handelt, kann er im laufenden Betrieb angepasst werden, ohne dass der Index neu erstellt werden muss. Dies ermöglicht ein schnelles, kostengünstiges und äußerst flexibles Tuning für verschiedene Workloads oder Abfrageszenarien.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Übliche Varianten des IVF-Index</h3><p>Bei der Erstellung eines IVF-Index müssen Sie entscheiden, ob Sie eine Kompressionskodierung für die Vektoren in den einzelnen Clustern verwenden wollen - und wenn ja, mit welcher Methode.</p>
<p>Daraus ergeben sich drei gängige IVF-Indexvarianten:</p>
<table>
<thead>
<tr><th><strong>IVF-Variante</strong></th><th><strong>Wesentliche Merkmale</strong></th><th><strong>Anwendungsfälle</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Speichert rohe Vektoren innerhalb jedes Clusters ohne Komprimierung. Bietet die höchste Genauigkeit, verbraucht aber auch den meisten Speicher.</td><td>Ideal für mittelgroße Datensätze (bis zu Hunderten von Millionen von Vektoren), bei denen eine hohe Wiederauffindbarkeit (95 %+) erforderlich ist.</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Wendet Produktquantisierung (PQ) an, um Vektoren innerhalb von Clustern zu komprimieren. Durch Anpassung des Komprimierungsverhältnisses kann die Speichernutzung erheblich reduziert werden.</td><td>Geeignet für umfangreiche Vektorsuchen (Hunderte von Millionen oder mehr), bei denen ein gewisser Genauigkeitsverlust akzeptabel ist. Bei einem Komprimierungsverhältnis von 64:1 liegt die Wiederauffindbarkeit typischerweise bei etwa 70 %, kann aber durch Verringerung des Komprimierungsverhältnisses 90 % oder mehr erreichen.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Verwendet Skalarquantisierung (SQ8) zur Quantisierung von Vektoren. Der Speicherverbrauch liegt zwischen IVF_FLAT und IVF_PQ.</td><td>Ideal für groß angelegte Vektorsuchen, bei denen Sie eine relativ hohe Trefferquote (90 %+) beibehalten und gleichzeitig die Effizienz verbessern müssen.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs. HNSW: Wählen Sie das Passende<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben IVF ist <strong>HNSW (Hierarchical Navigable Small World)</strong> ein weiterer häufig verwendeter In-Memory-Vektorindex. Die folgende Tabelle zeigt die wichtigsten Unterschiede zwischen den beiden.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algorithmus Konzept</strong></td><td>Clustering und Bucketing</td><td>Mehrschichtige Graphnavigation</td></tr>
<tr><td><strong>Speicherverbrauch</strong></td><td>Relativ niedrig</td><td>Relativ hoch</td></tr>
<tr><td><strong>Geschwindigkeit des Indexaufbaus</strong></td><td>Schnell (erfordert nur Clustering)</td><td>Langsam (erfordert mehrschichtigen Graphenaufbau)</td></tr>
<tr><td><strong>Abfragegeschwindigkeit (keine Filterung)</strong></td><td>Schnell, hängt von <em>nprobe</em> ab</td><td>Extrem schnell, aber mit logarithmischer Komplexität</td></tr>
<tr><td><strong>Abfragegeschwindigkeit (mit Filterung)</strong></td><td>Stabil - führt eine grobe Filterung auf der Ebene des Schwerpunkts durch, um die Kandidaten einzugrenzen</td><td>Instabil - vor allem bei einem hohen Filterungsgrad (90 % und mehr) wird der Graph fragmentiert und kann zu einer fast vollständigen Durchquerung des Graphen degradieren, was sogar langsamer ist als die Brute-Force-Suche</td></tr>
<tr><td><strong>Wiederfindungsrate</strong></td><td>Hängt davon ab, ob Komprimierung verwendet wird; ohne Quantisierung kann die Wiederfindungsrate <strong>95%+</strong> erreichen</td><td>Normalerweise höher, etwa <strong>98%+</strong></td></tr>
<tr><td><strong>Wichtige Parameter</strong></td><td><em>nliste</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Anwendungsfälle</strong></td><td>Wenn der Speicher begrenzt ist, aber eine hohe Abfrageleistung und ein hoher Abruf erforderlich sind; gut geeignet für Suchvorgänge mit Filterungsbedingungen</td><td>Wenn ausreichend Speicher vorhanden ist und das Ziel eine extrem hohe Auffindbarkeit und Abfrageleistung ist, aber keine Filterung benötigt wird oder die Filterungsrate gering ist</td></tr>
</tbody>
</table>
<p>In realen Anwendungen ist es sehr üblich, Filterbedingungen einzubeziehen, z. B. "nur Vektoren von einem bestimmten Benutzer suchen" oder "Ergebnisse auf einen bestimmten Zeitraum beschränken". Aufgrund der Unterschiede in den zugrundeliegenden Algorithmen kann die IVF gefilterte Suchen im Allgemeinen effizienter handhaben als die HNSW.</p>
<p>Die Stärke der IVF liegt in ihrem zweistufigen Filterungsprozess. Es kann zunächst einen grobkörnigen Filter auf der Ebene der Zentroide (Cluster) durchführen, um die Kandidatengruppe schnell einzugrenzen, und dann feinkörnige Abstandsberechnungen innerhalb der ausgewählten Cluster durchführen. Dadurch bleibt die Leistung stabil und vorhersehbar, auch wenn ein großer Teil der Daten herausgefiltert wird.</p>
<p>Im Gegensatz dazu basiert HNSW auf der Durchquerung von Graphen. Aufgrund seiner Struktur kann es die Filterbedingungen während der Durchquerung nicht direkt nutzen. Wenn der Filterungsgrad niedrig ist, verursacht dies keine größeren Probleme. Wenn der Filterungsgrad jedoch hoch ist (z. B. wenn mehr als 90 % der Daten herausgefiltert werden), wird der verbleibende Graph oft fragmentiert und bildet viele "isolierte Knoten". In solchen Fällen kann die Suche zu einer fast vollständigen Durchquerung des Graphen degradieren - manchmal sogar schlechter als eine Brute-Force-Suche.</p>
<p>In der Praxis kommen IVF-Indizes bereits in vielen wichtigen Anwendungsfällen in verschiedenen Bereichen zum Einsatz:</p>
<ul>
<li><p><strong>E-Commerce-Suche:</strong> Ein Benutzer kann ein Produktbild hochladen und sofort visuell ähnliche Artikel aus Millionen von Angeboten finden.</p></li>
<li><p><strong>Patentrecherche:</strong> Anhand einer kurzen Beschreibung kann das System die semantisch am meisten verwandten Patente aus einer riesigen Datenbank heraussuchen - weitaus effizienter als die herkömmliche Stichwortsuche.</p></li>
<li><p><strong>RAG-Wissensdatenbanken:</strong> IVF hilft bei der Suche nach dem relevantesten Kontext aus Millionen von Mieterdokumenten und sorgt dafür, dass KI-Modelle genauere und fundiertere Antworten generieren.</p></li>
</ul>
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
    </button></h2><p>Bei der Wahl des richtigen Index kommt es auf Ihren spezifischen Anwendungsfall an. Wenn Sie mit großen Datensätzen arbeiten oder eine gefilterte Suche unterstützen müssen, kann IVF die bessere Wahl sein. Im Vergleich zu graphenbasierten Indizes wie HNSW bietet IVF einen schnelleren Indexaufbau, eine geringere Speichernutzung und ein gutes Gleichgewicht zwischen Geschwindigkeit und Genauigkeit.</p>
<p><a href="https://milvus.io/">Milvus</a>, die beliebteste Open-Source-Vektordatenbank, bietet vollständige Unterstützung für die gesamte IVF-Familie, einschließlich IVF_FLAT, IVF_PQ und IVF_SQ8. Sie können ganz einfach mit diesen Indextypen experimentieren und die Konfiguration finden, die Ihren Leistungs- und Speicheranforderungen am besten entspricht. Eine vollständige Liste der von Milvus unterstützten Indizes finden Sie auf der <a href="https://milvus.io/docs/index-explained.md">Milvus Index-Dokumentationsseite</a>.</p>
<p>Wenn Sie eine Bildsuche, ein Empfehlungssystem oder eine RAG-Wissensdatenbank entwickeln, sollten Sie die IVF-Indizierung in Milvus ausprobieren und sehen, wie sich eine effiziente, groß angelegte Vektorsuche in der Praxis anfühlt.</p>
