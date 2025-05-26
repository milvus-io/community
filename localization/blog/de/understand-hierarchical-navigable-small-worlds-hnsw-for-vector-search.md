---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: Verständnis von Hierarchical Navigable Small Worlds (HNSW) für die Vektorsuche
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) ist ein effizienter Algorithmus für
  die ungefähre Suche nach dem nächsten Nachbarn unter Verwendung einer
  geschichteten Graphstruktur.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>Die wichtigste Funktion von <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbanken</a> ist die <em>Ähnlichkeitssuche</em>, bei der die nächstgelegenen Nachbarn in der Datenbank zu einem Abfragevektor gefunden werden müssen, z. B. anhand des euklidischen Abstands. Eine naive Methode würde den Abstand zwischen dem Abfragevektor und jedem in der Datenbank gespeicherten Vektor berechnen und den am nächsten liegenden K-Vektor auswählen. Diese Methode ist jedoch nicht skalierbar, wenn die Größe der Datenbank zunimmt. In der Praxis ist eine naive Ähnlichkeitssuche nur für Datenbanken mit weniger als etwa 1 Million Vektoren praktikabel. Wie sollen wir unsere Suche auf 10 und 100 Millionen oder sogar Milliarden von Vektoren skalieren?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Abstieg von einer Hierarchie von Vektorsuchindizes</em></p>
<p>Es wurden viele Algorithmen und Datenstrukturen entwickelt, um die Ähnlichkeitssuche in hochdimensionalen Vektorräumen auf eine sublineare Zeitkomplexität zu skalieren. In diesem Artikel erläutern und implementieren wir eine beliebte und effektive Methode namens Hierarchical Navigable Small Worlds (HNSW), die häufig die Standardwahl für mittelgroße Vektordatensätze ist. Sie gehört zur Familie der Suchmethoden, die einen Graphen über den Vektoren konstruieren, wobei die Eckpunkte die Vektoren und die Kanten die Ähnlichkeit zwischen ihnen bezeichnen. Die Suche erfolgt durch Navigieren im Graphen, im einfachsten Fall durch gieriges Traversieren zum Nachbarn des aktuellen Knotens, der der Anfrage am nächsten liegt, und durch Wiederholung, bis ein lokales Minimum erreicht ist.</p>
<p>Wir werden genauer erklären, wie der Suchgraph aufgebaut ist, wie der Graph die Suche ermöglicht, und am Ende auf eine HNSW-Implementierung in Python verweisen, die von mir selbst erstellt wurde.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Navigierbare kleine Welten<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: NSW-Graph, erstellt aus 100 zufällig angeordneten 2D-Punkten.</em></p>
<p>Wie bereits erwähnt, konstruiert HNSW einen Suchgraphen offline, bevor wir eine Abfrage durchführen können. Der Algorithmus baut auf einer früheren Arbeit auf, einer Methode namens Navigable Small Worlds (NSW). Wir werden zunächst NSW erklären, und es wird dann trivial sein, von dort zu <em>Hierarchical</em> NSW überzugehen. Die obige Abbildung zeigt einen konstruierten Suchgraph für NSW über 2-dimensionale Vektoren. In allen folgenden Beispielen beschränken wir uns auf 2-dimensionale Vektoren, um sie visualisieren zu können.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Konstruktion des Graphen<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein NSW ist ein Graph, bei dem die Eckpunkte Vektoren darstellen und die Kanten heuristisch aus der Ähnlichkeit zwischen Vektoren konstruiert werden, so dass die meisten Vektoren von überall aus über eine geringe Anzahl von Sprüngen erreichbar sind. Dies ist die so genannte "Small World"-Eigenschaft, die eine schnelle Navigation ermöglicht. Siehe die obige Abbildung.</p>
<p>Der Graph ist zu Beginn leer. Wir iterieren durch die Vektoren und fügen sie nacheinander dem Graphen hinzu. Für jeden Vektor werden, ausgehend von einem zufälligen Einstiegsknoten, die nächstgelegenen R-Knoten gesucht, die vom Einstiegspunkt aus <em>in dem bisher konstruierten Graphen</em> erreichbar sind. Diese R-Knoten werden dann mit einem neuen Knoten verbunden, der den einzufügenden Vektor repräsentiert, wobei optional alle benachbarten Knoten, die nun mehr als R Nachbarn haben, beschnitten werden. Wiederholt man diesen Vorgang für alle Vektoren, so erhält man den NSW-Graphen. Die obige Abbildung veranschaulicht den Algorithmus. Eine theoretische Analyse der Eigenschaften eines auf diese Weise konstruierten Graphen finden Sie in den Ressourcen am Ende des Artikels.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Durchsuchen des Graphen<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben den Suchalgorithmus bereits bei der Konstruktion eines Graphen gesehen. In diesem Fall wird der Abfrageknoten jedoch vom Benutzer bereitgestellt und nicht in den Graphen eingefügt. Ausgehend von einem zufälligen Eintrag navigieren wir gierig zu seinem Nachbarn, der der Abfrage am nächsten liegt, wobei wir eine dynamische Menge der bisher am nächsten liegenden Vektoren aufbewahren. Siehe die obige Illustration. Beachten Sie, dass wir die Suchgenauigkeit verbessern können, indem wir die Suche von mehreren zufälligen Einstiegspunkten aus starten und die Ergebnisse aggregieren, sowie bei jedem Schritt mehrere Nachbarn berücksichtigen. Diese Verbesserungen gehen jedoch auf Kosten einer erhöhten Latenzzeit.</p>
<custom-h1>Hinzufügen einer Hierarchie</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bisher haben wir den NSW-Algorithmus und die Datenstruktur beschrieben, die uns helfen können, die Suche im hochdimensionalen Raum zu erweitern. Dennoch weist die Methode ernsthafte Mängel auf, darunter Versagen in niedrigen Dimensionen, langsame Suchkonvergenz und eine Tendenz, in lokalen Minima gefangen zu sein.</p>
<p>Die Autoren von HNSW beheben diese Mängel durch drei Änderungen an NSW:</p>
<ul>
<li><p>Explizite Auswahl der Eingangsknoten während der Konstruktion und der Suche;</p></li>
<li><p>Trennung der Kanten durch verschiedene Skalen; und,</p></li>
<li><p>Verwendung einer fortgeschrittenen Heuristik zur Auswahl der Nachbarn.</p></li>
</ul>
<p>Die ersten beiden werden mit einer einfachen Idee realisiert: Aufbau <em>einer Hierarchie von Suchgraphen</em>. Anstelle eines einzelnen Graphen, wie bei NSW, konstruiert HNSW eine Hierarchie von Graphen. Jeder Graph bzw. jede Ebene wird einzeln auf die gleiche Weise durchsucht wie bei NSW. Die oberste Ebene, die zuerst durchsucht wird, enthält nur sehr wenige Knoten, und die tieferen Ebenen enthalten nach und nach immer mehr Knoten, wobei die unterste Ebene alle Knoten enthält. Das bedeutet, dass die obersten Schichten längere Sprünge durch den Vektorraum enthalten, was eine Art "Course-to-Fine"-Suche ermöglicht. Siehe oben für eine Veranschaulichung.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Konstruktion des Graphen<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Konstruktionsalgorithmus funktioniert folgendermaßen: Wir legen im Voraus eine Anzahl von Schichten, <em>L</em>, fest. Der Wert l=1 entspricht der gröbsten Ebene, auf der die Suche beginnt, und l=L entspricht der dichtesten Ebene, auf der die Suche endet. Wir iterieren durch jeden einzufügenden Vektor und wählen eine Einfügeebene nach einer abgeschnittenen <a href="https://en.wikipedia.org/wiki/Geometric_distribution">geometrischen Verteilung</a> aus (indem wir entweder <em>l &gt; L</em> ablehnen oder <em>l' =</em> min_(l, L)_ setzen). Nehmen wir an, wir wählen <em>1 &lt; l &lt; L</em> für den aktuellen Vektor. Wir führen eine gierige Suche auf der obersten Schicht, L, durch, bis wir ihr lokales Minimum erreichen. Dann folgen wir einer Kante vom lokalen Minimum in der _L_ten Schicht zum entsprechenden Vektor in der _(L-1)_ten Schicht und verwenden sie als Einstiegspunkt für die gierige Suche in der _(L-1)_ten Schicht.</p>
<p>Dieser Vorgang wird wiederholt, bis wir die _l_te Schicht erreicht haben. Dann beginnen wir, Knoten für den einzufügenden Vektor zu erzeugen, indem wir ihn mit seinen nächsten Nachbarn verbinden, die wir durch die gierige Suche in der _l_ten Schicht gefunden haben, die wir bisher konstruiert haben, und navigieren zur _(l-1)_ten Schicht und wiederholen dies, bis wir den Vektor in die _1_te Schicht eingefügt haben. Eine Animation oben verdeutlicht dies</p>
<p>Wir sehen, dass diese hierarchische Graphenkonstruktionsmethode eine clevere explizite Auswahl des Einfügeknotens für jeden Vektor verwendet. Wir durchsuchen die Ebenen oberhalb der bisher konstruierten Einfügeebene, wobei wir effizient von Kurs zu Feinabstand suchen. Außerdem trennt die Methode die Verbindungen in jeder Schicht nach unterschiedlichen Maßstäben: Die oberste Schicht ermöglicht große Sprünge durch den Suchraum, während der Maßstab zur untersten Schicht hin abnimmt. Beide Modifikationen tragen dazu bei, dass man nicht in suboptimalen Minima gefangen ist, und beschleunigen die Konvergenz der Suche auf Kosten von zusätzlichem Speicherplatz.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Durchsuchen des Graphen<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Suchverfahren funktioniert ähnlich wie der Schritt der Konstruktion des inneren Graphen. Ausgehend von der obersten Schicht navigieren wir gierig zu dem oder den Knoten, die der Anfrage am nächsten sind. Dann folgen wir diesem Knoten bzw. diesen Knoten bis zur nächsten Ebene und wiederholen den Vorgang. Unsere Antwort ergibt sich aus der Liste der <em>R</em> nächsten Nachbarn in der untersten Schicht, wie die Animation oben zeigt.</p>
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
    </button></h2><p>Vektordatenbanken wie Milvus bieten hoch optimierte und abgestimmte Implementierungen von HNSW, und es ist oft der beste Standard-Suchindex für Datensätze, die in den Speicher passen.</p>
<p>Wir haben einen Überblick darüber gegeben, wie und warum HNSW funktioniert, wobei wir Visualisierungen und Intuition gegenüber Theorie und Mathematik bevorzugt haben. Daher haben wir auf eine genaue Beschreibung der Konstruktions- und Suchalgorithmen<a href="https://arxiv.org/abs/1603.09320">[Malkov und Yashushin, 2016</a>; Alg 1-3], die Analyse der Such- und Konstruktionskomplexität<a href="https://arxiv.org/abs/1603.09320">[Malkov und Yashushin, 2016</a>; §4.2] und weniger wichtige Details wie eine Heuristik zur effektiveren Auswahl von Nachbarknoten während der Konstruktion<a href="https://arxiv.org/abs/1603.09320">[Malkov und Yashushin, 2016</a>; Alg 5] verzichtet. Darüber hinaus haben wir die Diskussion der Hyperparameter des Algorithmus, ihre Bedeutung und ihre Auswirkungen auf den Kompromiss zwischen Latenz, Geschwindigkeit und Speicherplatz ausgelassen<a href="https://arxiv.org/abs/1603.09320">[Malkov und Yashushin, 2016</a>; §4.1]. Das Verständnis dafür ist wichtig für die Verwendung von HNSW in der Praxis.</p>
<p>Die nachstehenden Ressourcen enthalten weitere Lektüre zu diesen Themen und eine vollständige (von mir geschriebene) pädagogische Python-Implementierung für NSW und HNSW, einschließlich des Codes zur Erstellung der Animationen in diesem Artikel.</p>
<custom-h1>Ressourcen</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated: Eine kleine Implementierung von Hierarchical Navigable Small Worlds (HNSW), einem Vektorsuchalgorithmus, für Lernzwecke</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Milvus Dokumentation</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Verstehen von Hierarchical Navigable Small Worlds (HNSW) - Zilliz Learn</a></p></li>
<li><p>HNSW Papier: "<a href="https://arxiv.org/abs/1603.09320">Effiziente und robuste approximative Suche nach nächsten Nachbarn mit Hilfe von Hierarchical Navigable Small World Graphen</a>"</p></li>
<li><p>NSW paper: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Approximate nearest neighbor algorithm based on navigable small world graphs</a>"</p></li>
</ul>
