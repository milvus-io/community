---
id: diskann-explained.md
title: DiskANN Erklärt
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Erfahren Sie, wie DiskANN Milliarden von Vektorsuchen mit SSDs durchführt und
  dabei einen Ausgleich zwischen geringer Speichernutzung, hoher Genauigkeit und
  skalierbarer Leistung schafft.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">Was ist DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> stellt einen Paradigmenwechsel bei der <a href="https://zilliz.com/learn/vector-similarity-search">Vektorähnlichkeitssuche</a> dar. Zuvor waren die meisten Vektorindex-Typen wie HNSW stark auf RAM angewiesen, um eine niedrige Latenzzeit und eine hohe Trefferquote zu erreichen. Dieser Ansatz ist zwar für mittelgroße Datensätze effektiv, wird aber mit zunehmendem Datenvolumen unerschwinglich teuer und weniger skalierbar. DiskANN bietet eine kosteneffiziente Alternative, indem es SSDs zur Speicherung des Index nutzt und so den Speicherbedarf erheblich reduziert.</p>
<p>DiskANN verwendet eine flache Graphenstruktur, die für den Festplattenzugriff optimiert ist. Dadurch können Datensätze in Milliardenhöhe mit einem Bruchteil des Speicherbedarfs von In-Memory-Methoden verarbeitet werden. So kann DiskANN beispielsweise bis zu einer Milliarde Vektoren indizieren und dabei eine Suchgenauigkeit von 95 % bei einer Latenzzeit von 5 ms erreichen, während RAM-basierte Algorithmen bei ähnlicher Leistung erst bei 100-200 Millionen Punkten ihren Höhepunkt erreichen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 1: Vektorindizierung und Suchworkflow mit DiskANN</em></p>
<p>Obwohl DiskANN im Vergleich zu RAM-basierten Ansätzen eine etwas höhere Latenz aufweisen kann, ist dieser Kompromiss angesichts der erheblichen Kosteneinsparungen und Skalierbarkeitsvorteile oft akzeptabel. DiskANN eignet sich besonders für Anwendungen, die eine umfangreiche Vektorsuche auf Commodity-Hardware erfordern.</p>
<p>In diesem Artikel werden die cleveren Methoden erläutert, mit denen DiskANN neben dem RAM auch die SSD nutzt und kostspielige SSD-Lesevorgänge reduziert.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">Wie funktioniert DiskANN?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN ist eine graphbasierte Vektorsuchmethode, die zur gleichen Methodenfamilie wie HNSW gehört. Wir konstruieren zunächst einen Suchgraphen, bei dem die Knoten Vektoren (oder Gruppen von Vektoren) entsprechen und die Kanten anzeigen, dass ein Paar von Vektoren in gewisser Weise "relativ nah" ist. Bei einer typischen Suche wird nach dem Zufallsprinzip ein "Einstiegsknoten" gewählt, der zu seinem der Abfrage am nächsten liegenden Nachbarn navigiert, wobei die Suche nach dem Gierprinzip so lange wiederholt wird, bis ein lokales Minimum erreicht ist.</p>
<p>Graphenbasierte Indexierungssysteme unterscheiden sich in erster Linie darin, wie sie den Suchgraphen konstruieren und die Suche durchführen. In diesem Abschnitt werden wir einen technischen Einblick in die Innovationen von DiskANN für diese Schritte geben und erläutern, wie sie eine Leistung mit geringer Latenz und wenig Speicherplatz ermöglichen. (Siehe die obige Abbildung für eine Zusammenfassung).</p>
<h3 id="An-Overview" class="common-anchor-header">Ein Überblick</h3><p>Wir gehen davon aus, dass der Benutzer einen Satz von Dokumentenvektoreinbettungen erstellt hat. Der erste Schritt besteht darin, die Einbettungen zu clustern. Für jeden Cluster wird mit dem Vamana-Algorithmus (der im nächsten Abschnitt erläutert wird) ein eigener Suchgraph erstellt, und die Ergebnisse werden zu einem einzigen Graphen zusammengeführt. <em>Die Divide-and-Conquer-Strategie für die Erstellung des endgültigen Suchgraphen reduziert die Speichernutzung erheblich, ohne die Suchlatenz oder den Abruf zu stark zu beeinträchtigen.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 2: Wie DiskANN den Vektorindex im RAM und auf der SSD speichert</em></p>
<p>Nach der Erstellung des globalen Suchgraphen wird dieser zusammen mit den vollpräzisen Vektoreinbettungen auf der SSD gespeichert. Eine große Herausforderung besteht darin, die Suche innerhalb einer begrenzten Anzahl von SSD-Lesevorgängen abzuschließen, da der SSD-Zugriff im Vergleich zum RAM-Zugriff teuer ist. Daher werden einige clevere Tricks angewandt, um die Anzahl der Lesevorgänge zu begrenzen:</p>
<p>Erstens schafft der Vamana-Algorithmus Anreize für kürzere Pfade zwischen nahe beieinander liegenden Knoten, während die maximale Anzahl der Nachbarn eines Knotens begrenzt wird. Zweitens wird eine Datenstruktur fester Größe verwendet, um die Einbettung jedes Knotens und seiner Nachbarn zu speichern (siehe obige Abbildung). Das bedeutet, dass wir die Metadaten eines Knotens adressieren können, indem wir einfach die Größe der Datenstruktur mit dem Index des Knotens multiplizieren und dies als Offset verwenden, während wir gleichzeitig die Einbettung des Knotens abrufen. Drittens können wir aufgrund der Funktionsweise von SSD mehrere Knoten pro Leseanforderung abrufen - in unserem Fall die Nachbarknoten - was die Anzahl der Leseanforderungen weiter reduziert.</p>
<p>Unabhängig davon komprimieren wir die Einbettungen mithilfe der Produktquantisierung und speichern sie im RAM. Auf diese Weise können wir milliardenschwere Vektordatensätze in einen Speicher einpassen, der auf einer einzelnen Maschine für die schnelle Berechnung von <em>ungefähren Vektorähnlichkeiten</em> ohne Festplattenlesevorgänge geeignet ist. Dies bietet eine Orientierungshilfe für die Reduzierung der Anzahl von Nachbarknoten, auf die als nächstes auf der SSD zugegriffen werden muss. Wichtig ist jedoch, dass die Suchentscheidungen auf der Grundlage der <em>exakten Vektorähnlichkeiten</em> getroffen werden, wobei die vollständigen Einbettungen von der SSD abgerufen werden, was eine höhere Auffindbarkeit gewährleistet. Es gibt also eine erste Suchphase mit quantisierten Einbettungen im Speicher und eine anschließende Suche auf einer kleineren Teilmenge, die vom SSD gelesen wird.</p>
<p>In dieser Beschreibung haben wir zwei wichtige, wenn auch komplizierte Schritte ausgelassen: die Konstruktion des Graphen und die Suche im Graphen - die beiden Schritte, die oben durch die roten Kästen gekennzeichnet sind. Lassen Sie uns jeden dieser Schritte der Reihe nach untersuchen.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">Aufbau des "Vamana"-Diagramms</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Aufbau des "Vamana"-Graphen</em></p>
<p>Die DiskANN-Autoren entwickeln eine neue Methode zur Konstruktion des Suchgraphen, die sie Vamana-Algorithmus nennen. Er initialisiert den Suchgraphen durch zufälliges Hinzufügen von O(N) Kanten. Dies führt zu einem Graphen, der "gut verbunden" ist, wenn auch ohne Garantien für die Konvergenz der gierigen Suche. Anschließend werden die Kanten auf intelligente Weise beschnitten und neu verbunden, um sicherzustellen, dass ausreichend weitreichende Verbindungen vorhanden sind (siehe obige Abbildung). Erlauben Sie uns, dies näher zu erläutern:</p>
<h4 id="Initialization" class="common-anchor-header">Initialisierung</h4><p>Der Suchgraph wird mit einem zufälligen gerichteten Graphen initialisiert, bei dem jeder Knoten R Out-Neighbors hat. Wir berechnen auch das Medoid des Graphen, d.h. den Punkt, der den geringsten durchschnittlichen Abstand zu allen anderen Punkten hat. Man kann sich dies als Analogie zu einem Schwerpunkt vorstellen, der ein Mitglied der Knotenmenge ist.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Suche nach Kandidaten</h4><p>Nach der Initialisierung iterieren wir über die Knoten, wobei wir bei jedem Schritt sowohl Kanten hinzufügen als auch entfernen. Zunächst wird ein Suchalgorithmus für den ausgewählten Knoten p ausgeführt, um eine Liste von Kandidaten zu erstellen. Der Suchalgorithmus beginnt am Medoid und navigiert gierig immer näher an den ausgewählten Knoten heran, wobei er bei jedem Schritt die äußeren Nachbarn des bis dahin am nächsten gefundenen Knotens hinzufügt. Die Liste der L gefundenen Knoten, die p am nächsten sind, wird zurückgegeben. (Falls Sie mit dem Konzept nicht vertraut sind: Das Medoid eines Graphen ist der Punkt, der den geringsten durchschnittlichen Abstand zu allen anderen Punkten hat und als Analogon eines Schwerpunkts für Graphen fungiert).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Ausschneiden und Hinzufügen von Kanten</h4><p>Die Nachbarschaftskandidaten des Knotens werden nach Entfernung sortiert, und für jeden Kandidaten prüft der Algorithmus, ob er in der Richtung zu nahe an einem bereits ausgewählten Nachbarn liegt. Wenn ja, wird er beschnitten. Dies fördert die Winkelvielfalt unter den Nachbarn, was erfahrungsgemäß zu besseren Navigationseigenschaften führt. In der Praxis bedeutet dies, dass eine Suche, die von einem zufälligen Knoten ausgeht, einen beliebigen Zielknoten schneller erreichen kann, indem sie einen spärlichen Satz von Langstrecken- und lokalen Verbindungen erkundet.</p>
<p>Nach dem Beschneiden der Kanten werden die Kanten entlang des gierigen Suchpfads zu p hinzugefügt. Es werden zwei Durchgänge des Pruning durchgeführt, wobei der Entfernungsschwellenwert für das Pruning so variiert wird, dass im zweiten Durchgang langfristige Kanten hinzugefügt werden.</p>
<h2 id="What’s-Next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachfolgende Arbeiten bauen auf DiskANN auf, um weitere Verbesserungen zu erzielen. Ein bemerkenswertes Beispiel, bekannt als <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifiziert die Methode, um eine einfache Aktualisierung des Indexes nach der Erstellung zu ermöglichen. Dieser Suchindex, der einen ausgezeichneten Kompromiss zwischen den Leistungskriterien darstellt, ist in der <a href="https://milvus.io/docs/overview.md">Milvus-Vektordatenbank</a> als Index-Typ <code translate="no">DISKANN</code> verfügbar.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Sie können sogar die DiskANN-Parameter, wie <code translate="no">MaxDegree</code> und <code translate="no">BeamWidthRatio</code>, anpassen: Weitere Einzelheiten finden Sie auf <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">der Dokumentationsseite</a>.</p>
<h2 id="Resources" class="common-anchor-header">Ressourcen<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Milvus-Dokumentation zur Verwendung von DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: Schnelle, präzise Milliarden-Punkt-Nächste-Nachbarn-Suche auf einem einzigen Knoten"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: Ein schneller und präziser Graph-basierter ANN-Index für die Streaming-Suche nach Ähnlichkeit"</a></p></li>
</ul>
