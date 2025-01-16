---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Skalierbare und rasend schnelle Ähnlichkeitssuche mit der
  Milvus-Vektordatenbank
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Speichern, indexieren, verwalten und durchsuchen Sie Billionen von
  Dokumentenvektoren in Millisekunden!
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Artikel werden wir einige interessante Aspekte behandeln, die für Vektordatenbanken und die Ähnlichkeitssuche im großen Maßstab relevant sind. In der heutigen, sich schnell entwickelnden Welt gibt es neue Technologien, neue Unternehmen und neue Datenquellen, und folglich müssen wir immer wieder neue Wege finden, um diese Daten zu speichern, zu verwalten und für Erkenntnisse zu nutzen. Strukturierte, tabellarische Daten werden seit Jahrzehnten in relationalen Datenbanken gespeichert, und Business Intelligence lebt von der Analyse und Gewinnung von Erkenntnissen aus solchen Daten. Betrachtet man jedoch die aktuelle Datenlandschaft, so handelt es sich bei mehr als 80-90 % der Daten um unstrukturierte Informationen wie Text, Video, Audio, Webserverprotokolle, soziale Medien und mehr". Unternehmen nutzen die Möglichkeiten des maschinellen Lernens und des Deep Learning, um Erkenntnisse aus solchen Daten zu gewinnen, da herkömmliche abfragebasierte Methoden möglicherweise nicht ausreichen oder gar nicht möglich sind. Es gibt ein riesiges, ungenutztes Potenzial, um aus solchen Daten wertvolle Erkenntnisse zu gewinnen, und wir stehen erst am Anfang!</p>
<blockquote>
<p>"Da die meisten Daten auf der Welt unstrukturiert sind, stellt die Möglichkeit, sie zu analysieren und darauf zu reagieren, eine große Chance dar. - Mikey Shulman, Head of ML, Kensho</p>
</blockquote>
<p>Unstrukturierte Daten haben, wie der Name schon sagt, keine implizite Struktur, wie eine Tabelle mit Zeilen und Spalten (daher auch tabellarische oder strukturierte Daten genannt). Im Gegensatz zu strukturierten Daten gibt es keine einfache Möglichkeit, den Inhalt von unstrukturierten Daten in einer relationalen Datenbank zu speichern. Bei der Nutzung unstrukturierter Daten zur Gewinnung von Erkenntnissen gibt es drei wesentliche Herausforderungen:</p>
<ul>
<li><strong>Speicherung:</strong> Normale relationale Datenbanken sind für die Speicherung strukturierter Daten geeignet. Sie können zwar NoSQL-Datenbanken verwenden, um solche Daten zu speichern, aber die Verarbeitung dieser Daten, um die richtigen Darstellungen für KI-Anwendungen in großem Umfang zu extrahieren, ist mit zusätzlichem Aufwand verbunden.</li>
<li><strong>Repräsentation:</strong> Computer verstehen keine Texte oder Bilder wie wir. Sie verstehen nur Zahlen, und wir müssen unstrukturierte Daten in eine nützliche numerische Darstellung umwandeln, typischerweise Vektoren oder Einbettungen.</li>
<li><strong>Abfragen:</strong> Sie können unstrukturierte Daten nicht direkt auf der Grundlage bestimmter bedingter Anweisungen abfragen, wie dies bei SQL für strukturierte Daten möglich ist. Stellen Sie sich ein einfaches Beispiel vor: Sie versuchen, anhand eines Fotos Ihres Lieblingsschuhs nach ähnlichen Schuhen zu suchen! Sie können weder rohe Pixelwerte für die Suche verwenden, noch können Sie strukturierte Merkmale wie Schuhform, Größe, Stil, Farbe und mehr darstellen. Stellen Sie sich nun vor, Sie müssten dies für Millionen von Schuhen tun!</li>
</ul>
<p>Damit Computer unstrukturierte Daten verstehen, verarbeiten und darstellen können, wandeln wir sie in der Regel in dichte Vektoren um, die oft als Einbettungen bezeichnet werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>Abbildung 1</span> </span></p>
<p>Es gibt eine Vielzahl von Methoden, die insbesondere das Deep Learning nutzen, darunter Convolutional Neural Networks (CNNs) für visuelle Daten wie Bilder und Transformers für Textdaten, die zur Umwandlung solcher unstrukturierter Daten in Embeddings verwendet werden können. <a href="https://zilliz.com/">Zilliz</a> hat <a href="https://zilliz.com/learn/embedding-generation">einen hervorragenden Artikel über verschiedene Einbettungstechniken</a>!</p>
<p>Mit dem Speichern dieser Einbettungsvektoren ist es jedoch nicht getan. Man muss auch in der Lage sein, ähnliche Vektoren abzufragen und herauszufinden. Warum, fragen Sie? Ein Großteil der realen Anwendungen wird durch Vektorähnlichkeitssuche für KI-basierte Lösungen angetrieben. Dazu gehören die visuelle (Bild-)Suche in Google, Empfehlungssysteme in Netflix oder Amazon, Textsuchmaschinen in Google, multimodale Suche, Datendeduplizierung und vieles mehr!</p>
<p>Die Speicherung, Verwaltung und Abfrage von Vektoren in großem Umfang ist keine einfache Aufgabe. Man braucht dafür spezialisierte Werkzeuge und Vektordatenbanken sind das effektivste Werkzeug für diese Aufgabe! In diesem Artikel werden wir die folgenden Aspekte behandeln:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vektoren und Vektorähnlichkeitssuche</a></li>
<li><a href="#What-is-a-Vector-Database">Was ist eine Vektordatenbank?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - die fortschrittlichste Vektordatenbank der Welt</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Durchführen einer visuellen Bildsuche mit Milvus - Ein Anwendungsfall</a></li>
</ul>
<p>Legen wir los!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vektoren und vektorielle Ähnlichkeitssuche<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben bereits festgestellt, dass es notwendig ist, unstrukturierte Daten wie Bilder und Texte als Vektoren darzustellen, da Computer nur Zahlen verstehen können. In der Regel nutzen wir KI-Modelle, genauer gesagt Deep-Learning-Modelle, um unstrukturierte Daten in numerische Vektoren umzuwandeln, die von Maschinen eingelesen werden können. Diese Vektoren sind in der Regel eine Liste von Fließkommazahlen, die zusammen das zugrunde liegende Element (Bild, Text usw.) darstellen.</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Verstehen von Vektoren</h3><p>Im Bereich der Verarbeitung natürlicher Sprache (NLP) gibt es viele Modelle zur Einbettung von Wörtern wie <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe und FastText</a>, die dabei helfen können, Wörter als numerische Vektoren darzustellen. Im Laufe der Zeit haben sich <a href="https://arxiv.org/abs/1706.03762">Transformer-Modelle</a> wie <a href="https://jalammar.github.io/illustrated-bert/">BERT</a> entwickelt, mit denen kontextbezogene Einbettungsvektoren und bessere Darstellungen für ganze Sätze und Absätze gelernt werden können.</p>
<p>In ähnlicher Weise gibt es im Bereich der Computer Vision Modelle wie <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">Convolutional Neural Networks (CNNs)</a>, die beim Lernen von Darstellungen aus visuellen Daten wie Bildern und Videos helfen können. Mit dem Aufkommen von Transformers gibt es auch <a href="https://arxiv.org/abs/2010.11929">Vision Transformers</a>, die eine bessere Leistung als normale CNNs erbringen können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>Abbildung 2</span> </span></p>
<p>Der Vorteil solcher Vektoren besteht darin, dass wir sie für die Lösung realer Probleme nutzen können, z. B. für die visuelle Suche, bei der man typischerweise ein Foto hochlädt und Suchergebnisse mit visuell ähnlichen Bildern erhält. Google hat dies als eine sehr beliebte Funktion in seine Suchmaschine integriert, wie im folgenden Beispiel dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>Abbildung 3</span> </span></p>
<p>Solche Anwendungen werden mit Datenvektoren und einer vektoriellen Ähnlichkeitssuche betrieben. Betrachten Sie zwei Punkte in einem kartesischen X-Y-Koordinatenraum. Der Abstand zwischen zwei Punkten kann als einfacher euklidischer Abstand berechnet werden, der durch die folgende Gleichung dargestellt wird.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>Abbildung 4</span> </span></p>
<p>Stellen Sie sich nun vor, dass jeder Datenpunkt ein Vektor mit D-Dimensionen ist. Dann könnten Sie immer noch den euklidischen Abstand oder sogar andere Abstandsmetriken wie den Hamming- oder Cosinus-Abstand verwenden, um herauszufinden, wie nahe die beiden Datenpunkte beieinander liegen. Auf diese Weise lässt sich eine Vorstellung von Nähe oder Ähnlichkeit entwickeln, die als quantifizierbare Metrik verwendet werden kann, um ähnliche Elemente anhand eines Referenzelements unter Verwendung ihrer Vektoren zu finden.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Verständnis der vektoriellen Ähnlichkeitssuche</h3><p>Bei der vektoriellen Ähnlichkeitssuche, die oft auch als Suche nach dem nächsten Nachbarn (NN) bezeichnet wird, geht es im Wesentlichen um die Berechnung der paarweisen Ähnlichkeit (oder des Abstands) zwischen einem Referenzobjekt (für das wir ähnliche Objekte finden wollen) und einer Sammlung vorhandener Objekte (in der Regel in einer Datenbank) und die Rückgabe der obersten "k" nächsten Nachbarn, die die obersten "k" ähnlichsten Objekte sind. Die Schlüsselkomponente zur Berechnung dieser Ähnlichkeit ist die Ähnlichkeitsmetrik, die euklidischer Abstand, inneres Produkt, Kosinusabstand, Hamming-Abstand usw. sein kann. Je kleiner der Abstand ist, desto ähnlicher sind die Vektoren.</p>
<p>Die Herausforderung bei der exakten Suche nach dem nächsten Nachbarn (NN) ist die Skalierbarkeit. Sie müssen jedes Mal N-Distanzen berechnen (unter der Annahme von N vorhandenen Elementen), um ähnliche Elemente zu erhalten. Das kann sehr langsam sein, vor allem wenn man die Daten nicht irgendwo speichert und indiziert (wie eine Vektordatenbank!). Um die Berechnung zu beschleunigen, nutzen wir in der Regel die ungefähre Suche nach dem nächsten Nachbarn, die oft auch als ANN-Suche bezeichnet wird und die Speicherung der Vektoren in einem Index beinhaltet. Der Index hilft bei der Speicherung dieser Vektoren in einer intelligenten Weise, um einen schnellen Abruf von "ungefähr" ähnlichen Nachbarn für ein Referenzabfrageelement zu ermöglichen. Typische ANN-Indizierungsmethoden sind:</p>
<ul>
<li><strong>Vektor-Transformationen:</strong> Dazu gehört das Hinzufügen zusätzlicher Transformationen zu den Vektoren wie Dimensionsreduktion (z. B. PCA \ t-SNE), Rotation usw.</li>
<li><strong>Vektor-Kodierung:</strong> Dazu gehört die Anwendung von Techniken auf der Grundlage von Datenstrukturen wie Locality Sensitive Hashing (LSH), Quantisierung, Bäume usw., die zu einem schnelleren Auffinden ähnlicher Elemente beitragen können.</li>
<li><strong>Nicht-erschöpfende Suchmethoden:</strong> Diese werden meist verwendet, um eine erschöpfende Suche zu verhindern, und umfassen Methoden wie Nachbarschaftsgraphen, invertierte Indizes usw.</li>
</ul>
<p>Daraus ergibt sich, dass Sie für die Entwicklung einer Anwendung zur Suche nach Vektorähnlichkeit eine Datenbank benötigen, die Ihnen bei der effizienten Speicherung, Indizierung und Abfrage (Suche) in großem Umfang helfen kann. Hier kommen die Vektordatenbanken ins Spiel!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">Was ist eine Vektordatenbank?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Da wir nun wissen, wie Vektoren zur Darstellung unstrukturierter Daten verwendet werden können und wie die Vektorsuche funktioniert, können wir die beiden Konzepte miteinander kombinieren, um eine Vektordatenbank aufzubauen.</p>
<p>Vektordatenbanken sind skalierbare Datenplattformen für die Speicherung, Indizierung und Abfrage von Einbettungsvektoren, die aus unstrukturierten Daten (Bilder, Text usw.) mithilfe von Deep-Learning-Modellen generiert werden.</p>
<p>Die Verarbeitung einer großen Anzahl von Vektoren für die Ähnlichkeitssuche (selbst mit Indizes) kann sehr teuer sein. Trotzdem sollten die besten und fortschrittlichsten Vektordatenbanken die Möglichkeit bieten, Millionen oder Milliarden von Zielvektoren einzufügen, zu indizieren und zu durchsuchen und darüber hinaus einen Indizierungsalgorithmus und eine Ähnlichkeitsmetrik Ihrer Wahl festzulegen.</p>
<p>Vektordatenbanken sollten vor allem die folgenden Hauptanforderungen an ein robustes Datenbankmanagementsystem für den Einsatz im Unternehmen erfüllen:</p>
<ol>
<li><strong>Skalierbar:</strong> Vektordatenbanken sollten in der Lage sein, Milliarden von Einbettungsvektoren zu indizieren und eine ungefähre Suche nach dem nächsten Nachbarn durchzuführen.</li>
<li><strong>Zuverlässig:</strong> Vektordatenbanken sollten in der Lage sein, interne Fehler ohne Datenverlust und mit minimalen betrieblichen Auswirkungen zu bewältigen, d.h. fehlertolerant sein</li>
<li><strong>Schnell:</strong> Abfrage- und Schreibgeschwindigkeiten sind für Vektordatenbanken wichtig. Für Plattformen wie Snapchat und Instagram, auf denen pro Sekunde Hunderte oder Tausende von neuen Bildern hochgeladen werden können, ist die Geschwindigkeit ein unglaublich wichtiger Faktor.</li>
</ol>
<p>Vektordatenbanken speichern nicht nur Datenvektoren. Sie sind auch für die Verwendung effizienter Datenstrukturen verantwortlich, um diese Vektoren für einen schnellen Abruf zu indizieren und CRUD-Operationen (Erstellen, Lesen, Aktualisieren und Löschen) zu unterstützen. Vektordatenbanken sollten idealerweise auch die Attributfilterung unterstützen, d. h. die Filterung auf der Grundlage von Metadatenfeldern, die in der Regel skalare Felder sind. Ein einfaches Beispiel wäre die Suche nach ähnlichen Schuhen auf der Grundlage der Bildvektoren für eine bestimmte Marke. Hier wäre die Marke das Attribut, nach dem gefiltert werden würde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>Abbildung 5</span> </span></p>
<p>Die obige Abbildung zeigt, wie <a href="https://milvus.io/">Milvus</a>, die Vektordatenbank, über die wir gleich sprechen werden, Attributfilterung verwendet. <a href="https://milvus.io/">Milvus</a> führt das Konzept einer Bitmaske in den Filterungsmechanismus ein, um ähnliche Vektoren mit einer Bitmaske von 1 zu behalten, die bestimmte Attributfilter erfüllen. Mehr Details dazu <a href="https://zilliz.com/learn/attribute-filtering">hier</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - Die fortschrittlichste Vektordatenbank der Welt<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> ist eine Open-Source-Plattform zur Verwaltung von Vektordatenbanken, die speziell für große Vektordatenmengen und die Rationalisierung von Operationen des maschinellen Lernens (MLOps) entwickelt wurde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>Abbildung 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a> ist die Organisation, die hinter der Entwicklung von <a href="https://milvus.io/">Milvus</a> steht, der fortschrittlichsten Vektordatenbank der Welt, um die Entwicklung von Datenstrukturen der nächsten Generation zu beschleunigen. Milvus ist derzeit ein Abschlussprojekt der <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> und konzentriert sich auf die Verwaltung massiver unstrukturierter Datensätze für Speicherung und Suche. Die Effizienz und Zuverlässigkeit der Plattform vereinfacht den Prozess der Bereitstellung von KI-Modellen und MLOps in großem Maßstab. Milvus hat ein breites Anwendungsspektrum, das von der Arzneimittelforschung über Computer Vision, Empfehlungssysteme und Chatbots bis hin zu vielen anderen Bereichen reicht.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Hauptmerkmale von Milvus</h3><p>Milvus ist vollgepackt mit nützlichen Funktionen und Möglichkeiten, wie z. B.:</p>
<ul>
<li><strong>Rasante Suchgeschwindigkeiten bei einer Billion Vektordatensätzen:</strong> Die durchschnittliche Latenz der Vektorsuche und -abfrage wurde bei einer Billion Vektordatensätzen in Millisekunden gemessen.</li>
<li><strong>Vereinfachte Verwaltung unstrukturierter Daten:</strong> Milvus verfügt über umfangreiche APIs, die für Data-Science-Workflows entwickelt wurden.</li>
<li><strong>Zuverlässige, stets verfügbare Vektordatenbank:</strong> Die integrierten Replikations- und Failover-/Failback-Funktionen von Milvus stellen sicher, dass Daten und Anwendungen jederzeit unterbrechungsfrei funktionieren.</li>
<li><strong>Hochgradig skalierbar und elastisch:</strong> Die Skalierbarkeit auf Komponentenebene ermöglicht eine bedarfsgerechte Auf- und Abwärtsskalierung.</li>
<li><strong>Hybride Suche:</strong> Neben Vektoren unterstützt Milvus Datentypen wie Boolean, String, Ganzzahlen, Gleitkommazahlen und mehr. Milvus kombiniert die skalare Filterung mit einer leistungsstarken vektoriellen Ähnlichkeitssuche (wie im Beispiel der Schuhähnlichkeit oben gezeigt).</li>
<li><strong>Vereinheitlichte Lambda-Struktur:</strong> Milvus kombiniert Stream- und Stapelverarbeitung für die Datenspeicherung, um Aktualität und Effizienz auszugleichen.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Zeitreise</a>:</strong> Milvus unterhält eine Zeitleiste für alle Einfüge- und Löschvorgänge von Daten. Es ermöglicht Benutzern, Zeitstempel in einer Suche anzugeben, um eine Datenansicht zu einem bestimmten Zeitpunkt abzurufen.</li>
<li><strong>Von der Gemeinschaft unterstützt und von der Industrie anerkannt:</strong> Mit über 1.000 Nutzern in Unternehmen, 10.5K+ Sternen auf <a href="https://github.com/milvus-io/milvus">GitHub</a> und einer aktiven Open-Source-Community sind Sie nicht allein, wenn Sie Milvus verwenden. Als Graduiertenprojekt der <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> genießt Milvus institutionelle Unterstützung.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Bestehende Ansätze zur Verwaltung und Suche von Vektordaten</h3><p>Eine gängige Methode zum Aufbau eines KI-Systems, das auf der Suche nach Vektorähnlichkeit basiert, ist die Kombination von Algorithmen wie Approximate Nearest Neighbor Search (ANNS) mit Open-Source-Bibliotheken wie:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Dieses Framework ermöglicht eine effiziente Ähnlichkeitssuche und Clustering von dichten Vektoren. Es enthält Algorithmen, die in Vektorsätzen beliebiger Größe suchen, bis hin zu solchen, die möglicherweise nicht in den Arbeitsspeicher passen. Es unterstützt Indizierungsfunktionen wie invertierter Multiindex und Produktquantisierung.</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotifys Annoy (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Dieses Framework verwendet <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">zufällige Projektionen</a> und baut einen Baum auf, um ANNS in großem Umfang für dichte Vektoren zu ermöglichen</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) von Google</a>:</strong> Dieses Framework führt eine effiziente Vektorähnlichkeitssuche in großem Maßstab durch. Besteht aus Implementierungen, die Suchraumbeschneidung und Quantisierung für Maximum Inner Product Search (MIPS) umfassen.</li>
</ul>
<p>Obwohl jede dieser Bibliotheken auf ihre eigene Weise nützlich ist, sind diese Algorithmus-Bibliotheks-Kombinationen aufgrund verschiedener Einschränkungen nicht mit einem vollwertigen Vektordatenverwaltungssystem wie Milvus gleichzusetzen. Wir werden nun einige dieser Einschränkungen diskutieren.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Beschränkungen bestehender Ansätze</h3><p>Bestehende Ansätze zur Verwaltung von Vektordaten, wie sie im vorigen Abschnitt besprochen wurden, weisen die folgenden Einschränkungen auf:</p>
<ol>
<li><strong>Flexibilität:</strong> Bestehende Systeme speichern in der Regel alle Daten im Hauptspeicher und können daher nicht ohne Weiteres im verteilten Modus auf mehreren Rechnern betrieben werden und eignen sich nicht für die Verarbeitung großer Datenmengen.</li>
<li><strong>Dynamische Datenverarbeitung:</strong> Daten werden oft als statisch angenommen, sobald sie in bestehende Systeme eingespeist werden, was die Verarbeitung dynamischer Daten erschwert und eine Suche in nahezu Echtzeit unmöglich macht.</li>
<li><strong>Erweiterte Abfrageverarbeitung:</strong> Die meisten Tools unterstützen keine fortgeschrittene Abfrageverarbeitung (z. B. Attributfilterung, hybride Suche und Multi-Vektor-Abfragen), was für den Aufbau realer Ähnlichkeitssuchmaschinen, die fortgeschrittene Filterung unterstützen, unerlässlich ist.</li>
<li><strong>Optimierungen für heterogenes Rechnen:</strong> Nur wenige Plattformen bieten Optimierungen für heterogene Systemarchitekturen sowohl auf CPUs als auch auf GPUs (außer FAISS), was zu Effizienzverlusten führt.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> versucht, all diese Einschränkungen zu überwinden, und wir werden dies im nächsten Abschnitt im Detail diskutieren.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Der Milvus-Vorteil - Verstehen von Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> versucht, die Beschränkungen bestehender Systeme, die auf ineffizientem Vektordatenmanagement und Algorithmen für die Ähnlichkeitssuche basieren, auf folgende Weise anzugehen und erfolgreich zu lösen:</p>
<ul>
<li>Es erhöht die Flexibilität, indem es Unterstützung für eine Vielzahl von Anwendungsschnittstellen bietet (einschließlich SDKs in Python, Java, Go, C++ und RESTful APIs)</li>
<li>Es unterstützt mehrere Vektorindex-Typen (z. B. quantisierungsbasierte Indizes und graphenbasierte Indizes) und eine erweiterte Abfrageverarbeitung</li>
<li>Milvus verarbeitet dynamische Vektordaten mit einem log-structured merge-tree (LSM-Baum), so dass das Einfügen und Löschen von Daten effizient ist und die Suche in Echtzeit abläuft.</li>
<li>Milvus bietet auch Optimierungen für heterogene Rechnerarchitekturen auf modernen CPUs und GPUs, so dass Entwickler Systeme für bestimmte Szenarien, Datensätze und Anwendungsumgebungen anpassen können.</li>
</ul>
<p>Knowhere, die Vektorausführungsmaschine von Milvus, ist eine Betriebsschnittstelle für den Zugriff auf Dienste in den oberen Schichten des Systems und auf Vektorähnlichkeitssuchbibliotheken wie Faiss, Hnswlib und Annoy in den unteren Schichten des Systems. Darüber hinaus ist Knowhere auch für heterogenes Computing zuständig. Knowhere steuert, auf welcher Hardware (z.B. CPU oder GPU) die Indexerstellung und Suchanfragen ausgeführt werden sollen. Daher kommt auch der Name Knowhere - Knowhere weiß, wo die Operationen ausgeführt werden sollen. Weitere Hardwaretypen, einschließlich DPU und TPU, werden in zukünftigen Versionen unterstützt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>Abbildung 7</span> </span></p>
<p>Die Berechnungen in Milvus umfassen hauptsächlich Vektor- und Skalaroperationen. Knowhere verarbeitet in Milvus nur die Vektoroperationen. Die obige Abbildung veranschaulicht die Knowhere-Architektur in Milvus. Die unterste Schicht ist die Systemhardware. Die Indexbibliotheken von Drittanbietern befinden sich oberhalb der Hardware. Dann interagiert Knowhere mit dem Indexknoten und dem Abfrageknoten auf der obersten Ebene über CGO. Knowhere erweitert nicht nur die Funktionen von Faiss, sondern optimiert auch die Leistung und bietet mehrere Vorteile, darunter Unterstützung für BitsetView, Unterstützung für weitere Ähnlichkeitsmetriken, Unterstützung für den AVX512-Befehlssatz, automatische SIMD-Befehlsauswahl und andere Leistungsoptimierungen. Details können <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">hier</a> gefunden werden.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus-Architektur</h3><p>Die folgende Abbildung veranschaulicht die Gesamtarchitektur der Milvus-Plattform. Milvus trennt den Datenfluss vom Kontrollfluss und ist in vier Schichten unterteilt, die in Bezug auf Skalierbarkeit und Notfallwiederherstellung unabhängig sind.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>Abbildung 8</span> </span></p>
<ul>
<li><strong>Zugriffsschicht:</strong> Die Zugriffsschicht besteht aus einer Gruppe zustandsloser Proxys und dient als Frontschicht des Systems und Endpunkt für die Benutzer.</li>
<li><strong>Koordinator-Dienst:</strong> Der Koordinatordienst ist für die Verwaltung der Clustertopologieknoten, den Lastausgleich, die Zeitstempelerzeugung, die Datendeklaration und die Datenverwaltung zuständig.</li>
<li><strong>Worker-Knoten:</strong> Der Worker- oder Ausführungsknoten führt die vom Coordinator-Dienst erteilten Anweisungen und die vom Proxy initiierten DML-Befehle (Data Manipulation Language) aus. Ein Worker-Knoten in Milvus ist vergleichbar mit einem Datenknoten in <a href="https://hadoop.apache.org/">Hadoop</a> oder einem Region-Server in HBase</li>
<li><strong>Speicherung:</strong> Dies ist der Eckpfeiler von Milvus, der für die Persistenz der Daten verantwortlich ist. Die Speicherschicht besteht aus <strong>Metaspeicher</strong>, <strong>Log-Broker</strong> und <strong>Objektspeicher</strong>.</li>
</ul>
<p>Mehr Details über die Architektur finden Sie <a href="https://milvus.io/docs/v2.0.x/four_layers.md">hier</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Durchführen einer visuellen Bildsuche mit Milvus - ein Anwendungsfall<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Open-Source-Vektordatenbanken wie Milvus ermöglichen es jedem Unternehmen, sein eigenes visuelles Bildsuchsystem mit einer minimalen Anzahl von Schritten zu erstellen. Entwickler können vortrainierte KI-Modelle verwenden, um ihre eigenen Bilddatensätze in Vektoren zu konvertieren, und dann Milvus nutzen, um die Suche nach ähnlichen Produkten anhand von Bildern zu ermöglichen. Im Folgenden sehen wir uns an, wie ein solches System entworfen und aufgebaut werden kann.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>Abbildung 9</span> </span></p>
<p>In diesem Arbeitsablauf können wir ein Open-Source-Framework wie <a href="https://github.com/towhee-io/towhee">towhee</a> verwenden, um ein vorab trainiertes Modell wie ResNet-50 zu nutzen und Vektoren aus Bildern zu extrahieren, diese Vektoren mit Leichtigkeit in Milvus zu speichern und zu indizieren und auch eine Zuordnung von Bild-IDs zu den tatsächlichen Bildern in einer MySQL-Datenbank zu speichern. Sobald die Daten indiziert sind, können wir jedes neue Bild mühelos hochladen und mit Milvus eine skalierte Bildsuche durchführen. Die folgende Abbildung zeigt ein Beispiel für eine visuelle Bildsuche.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>Abbildung 10</span> </span></p>
<p>Schauen Sie sich das detaillierte <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">Tutorial</a> an, das dank Milvus auf GitHub veröffentlicht wurde.</p>
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
    </button></h2><p>Wir haben in diesem Artikel eine ganze Reihe von Themen behandelt. Wir begannen mit den Herausforderungen bei der Darstellung unstrukturierter Daten, der Nutzung von Vektoren und der vektoriellen Ähnlichkeitssuche auf Skala mit Milvus, einer Open-Source-Vektordatenbank. Wir haben Details darüber besprochen, wie Milvus strukturiert ist, welche Schlüsselkomponenten es antreiben und wie ein reales Problem, die visuelle Bildsuche mit Milvus, gelöst werden kann. Probieren Sie es aus und beginnen Sie, Ihre eigenen realen Probleme mit <a href="https://milvus.io/">Milvus</a> zu lösen!</p>
<p>Hat Ihnen dieser Artikel gefallen? <a href="https://www.linkedin.com/in/dipanzan/">Nehmen</a> Sie <a href="https://www.linkedin.com/in/dipanzan/">Kontakt mit mir auf</a>, um mehr darüber zu diskutieren oder Feedback zu geben!</p>
<h2 id="About-the-author" class="common-anchor-header">Über den Autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar ist ein Data Science Lead, Google Developer Expert - Machine Learning, Autor, Berater und AI Advisor. Verbinden: http://bit.ly/djs_linkedin</p>
