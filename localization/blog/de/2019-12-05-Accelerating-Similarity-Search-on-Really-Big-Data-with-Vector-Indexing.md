---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Beschleunigung der Ähnlichkeitssuche auf wirklich großen Daten mit
  Vektorindizierung
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Ohne die Vektorindizierung wären viele moderne KI-Anwendungen unvorstellbar
  langsam. Erfahren Sie, wie Sie den richtigen Index für Ihre nächste
  Machine-Learning-Anwendung auswählen.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Beschleunigung der Ähnlichkeitssuche in wirklich großen Daten mit Vektorindizierung</custom-h1><p>Von der Computer Vision bis hin zur Entdeckung neuer Medikamente: Vektorielle Ähnlichkeitssuchmaschinen treiben viele beliebte Anwendungen der künstlichen Intelligenz (KI) an. Eine wichtige Komponente, die eine effiziente Abfrage der Millionen-, Milliarden- oder sogar Billionen-Vektordatensätze ermöglicht, auf die sich die Ähnlichkeitssuchmaschinen stützen, ist die Indizierung, ein Prozess zur Organisation von Daten, der die Big-Data-Suche drastisch beschleunigt. Dieser Artikel befasst sich mit der Rolle, die die Indizierung bei der effizienten Suche nach Vektorähnlichkeit spielt, mit verschiedenen Indexarten für invertierte Vektordateien (IVF) und mit Ratschlägen, welcher Index in verschiedenen Szenarien zu verwenden ist.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">Wie beschleunigt die Vektorindizierung die Ähnlichkeitssuche und das maschinelle Lernen?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Welche verschiedenen Arten von IVF-Indizes gibt es und für welche Szenarien sind sie am besten geeignet?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Gut geeignet für die Suche in relativ kleinen Datensätzen (im Millionenbereich), wenn eine 100%ige Wiedererkennung erforderlich ist.</a><ul>
<li><a href="#flat-performance-test-results">FLAT-Leistungstestergebnisse:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Abfragezeit-Testergebnisse für den FLAT-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Wichtigste Erkenntnisse:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Verbessert die Geschwindigkeit auf Kosten der Genauigkeit (und umgekehrt).</a><ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLAT-Leistungstestergebnisse:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Abfragezeit-Testergebnisse für den IVF_FLAT-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Wichtigste Erkenntnisse:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Testergebnisse für die Wiederfindungsrate für den IVF_FLAT-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Wichtigste Erkenntnisse:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: Schneller und weniger ressourcenhungrig als IVF_FLAT, aber auch weniger genau.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8 Leistungstestergebnisse:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Abfragezeit-Testergebnisse für den IVF_SQ8-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Wichtigste Erkenntnisse:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Recall-Rate-Testergebnisse für den IVF_SQ8-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Wichtigste Erkenntnisse:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: Neuer hybrider GPU/CPU-Ansatz, der noch schneller ist als IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8H Leistungstestergebnisse:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Abfragezeit-Testergebnisse für den IVF_SQ8H-Index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Wichtigste Erkenntnisse:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Erfahren Sie mehr über Milvus, eine Plattform zur Verwaltung von Vektordaten in großem Maßstab.</a></li>
<li><a href="#methodology">Methodik</a><ul>
<li><a href="#performance-testing-environment">Umgebung für Leistungstests</a></li>
<li><a href="#relevant-technical-concepts">Relevante technische Konzepte</a></li>
<li><a href="#resources">Ressourcen</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">Wie beschleunigt die Vektorindizierung die Ähnlichkeitssuche und das maschinelle Lernen?</h3><p>Ähnlichkeitssuchmaschinen vergleichen eine Eingabe mit einer Datenbank, um Objekte zu finden, die der Eingabe am ähnlichsten sind. Die Indizierung ist der Prozess der effizienten Organisation von Daten und spielt eine wichtige Rolle bei der Nützlichkeit der Ähnlichkeitssuche, indem sie zeitaufwändige Abfragen in großen Datensätzen erheblich beschleunigt. Nachdem ein großer Vektordatensatz indiziert wurde, können Abfragen zu Clustern oder Teilmengen von Daten geleitet werden, die mit hoher Wahrscheinlichkeit Vektoren enthalten, die einer Eingabeabfrage ähnlich sind. In der Praxis bedeutet dies, dass ein gewisses Maß an Genauigkeit geopfert werden muss, um Abfragen auf wirklich großen Vektordaten zu beschleunigen.</p>
<p>Es kann eine Analogie zu einem Wörterbuch gezogen werden, in dem die Wörter alphabetisch sortiert sind. Wenn man ein Wort nachschlägt, kann man schnell zu einem Abschnitt navigieren, der nur Wörter mit demselben Anfangsbuchstaben enthält, was die Suche nach der Definition des eingegebenen Wortes drastisch beschleunigt.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Welche verschiedenen Arten von IVF-Indizes gibt es und für welche Szenarien sind sie am besten geeignet?</h3><p>Es gibt zahlreiche Indizes, die für die hochdimensionale vektorielle Ähnlichkeitssuche entwickelt wurden, und jeder von ihnen bringt Kompromisse in Bezug auf Leistung, Genauigkeit und Speicherbedarf mit sich. In diesem Artikel werden verschiedene gängige IVF-Indextypen, ihre Stärken und Schwächen sowie die Ergebnisse von Leistungstests für jeden Indextyp behandelt. Die Leistungstests quantifizieren die Abfragezeit und die Abrufraten für jeden Indextyp in <a href="https://milvus.io/">Milvus</a>, einer Open-Source-Plattform zur Verwaltung von Vektordaten. Weitere Informationen über die Testumgebung finden Sie im Abschnitt über die Methodik am Ende dieses Artikels.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Gut geeignet für die Suche in relativ kleinen Datensätzen (im Millionenbereich), wenn eine 100-prozentige Trefferquote erforderlich ist.</h3><p>Für Anwendungen der Vektorähnlichkeitssuche, die eine perfekte Genauigkeit erfordern und von relativ kleinen Datensätzen (im Millionenbereich) abhängen, ist der FLAT-Index eine gute Wahl. FLAT komprimiert die Vektoren nicht und ist der einzige Index, der exakte Suchergebnisse garantieren kann. Die Ergebnisse von FLAT können auch als Vergleichspunkt für Ergebnisse anderer Indizes verwendet werden, die weniger als 100 % Recall haben.</p>
<p>FLAT ist genau, weil er einen erschöpfenden Suchansatz verfolgt, d. h. für jede Abfrage wird die Zieleingabe mit jedem Vektor in einem Datensatz verglichen. Dadurch ist FLAT der langsamste Index auf unserer Liste und eignet sich schlecht für die Abfrage umfangreicher Vektordaten. Es gibt keine Parameter für den FLAT-Index in Milvus, und seine Verwendung erfordert kein Datentraining oder zusätzlichen Speicher.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Ergebnisse der FLAT-Leistungstests:</h4><p>Die Leistungstests für die FLAT-Abfragezeit wurden in Milvus mit einem Datensatz aus 2 Millionen 128-dimensionalen Vektoren durchgeführt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtige Erkenntnisse:</h4><ul>
<li>Wenn nq (die Anzahl der Zielvektoren für eine Abfrage) steigt, erhöht sich die Abfragezeit.</li>
<li>Bei Verwendung des FLAT-Index in Milvus können wir sehen, dass die Abfragezeit stark ansteigt, sobald nq 200 überschreitet.</li>
<li>Im Allgemeinen ist der FLAT-Index schneller und konsistenter, wenn Milvus auf der GPU und nicht auf der CPU ausgeführt wird. Allerdings sind FLAT-Abfragen auf der CPU schneller, wenn nq unter 20 liegt.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Verbessert die Geschwindigkeit auf Kosten der Genauigkeit (und umgekehrt).</h3><p>Eine gängige Methode zur Beschleunigung der Ähnlichkeitssuche auf Kosten der Genauigkeit ist die Durchführung einer ANN-Suche (approximate nearest neighbor). ANN-Algorithmen verringern den Speicherbedarf und die Rechenlast, indem sie ähnliche Vektoren zu Clustern zusammenfassen, was zu einer schnelleren Vektorsuche führt. IVF_FLAT ist der einfachste invertierte Dateiindex-Typ und basiert auf einer Form der ANN-Suche.</p>
<p>IVF_FLAT unterteilt die Vektordaten in eine Anzahl von Cluster-Einheiten (nlist) und vergleicht dann die Abstände zwischen dem Ziel-Eingangsvektor und dem Zentrum jedes Clusters. Abhängig von der Anzahl der Cluster, die das System abfragen soll (nprobe), werden die Ergebnisse der Ähnlichkeitssuche nur auf der Grundlage von Vergleichen zwischen der Zieleingabe und den Vektoren in den ähnlichsten Clustern zurückgegeben, was die Abfragezeit drastisch reduziert.</p>
<p>Durch die Anpassung von nprobe kann ein ideales Gleichgewicht zwischen Genauigkeit und Geschwindigkeit für ein bestimmtes Szenario gefunden werden. Die Ergebnisse unseres IVF_FLAT-Leistungstests zeigen, dass die Abfragezeit stark ansteigt, wenn sowohl die Anzahl der Zieleingangsvektoren (nq) als auch die Anzahl der zu durchsuchenden Cluster (nprobe) zunimmt. IVF_FLAT komprimiert die Vektordaten nicht, die Indexdateien enthalten jedoch Metadaten, die den Speicherbedarf im Vergleich zum unindizierten Vektordatensatz geringfügig erhöhen.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Ergebnisse der IVF_FLAT-Leistungstests:</h4><p>IVF_FLAT-Abfragezeittests wurden in Milvus unter Verwendung des öffentlichen 1B SIFT-Datensatzes durchgeführt, der 1 Milliarde 128-dimensionale Vektoren enthält.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse:</h4><ul>
<li>Bei der Ausführung auf der CPU steigt die Abfragezeit für den IVF_FLAT-Index in Milvus sowohl mit nprobe als auch mit nq. Das bedeutet, je mehr Eingabevektoren eine Abfrage enthält oder je mehr Cluster eine Abfrage durchsucht, desto länger wird die Abfragezeit.</li>
<li>Auf der GPU zeigt der Index eine geringere Zeitvarianz bei Änderungen von nq und nprobe. Dies liegt daran, dass die Indexdaten groß sind und das Kopieren der Daten vom CPU-Speicher in den GPU-Speicher den Großteil der gesamten Abfragezeit ausmacht.</li>
<li>In allen Szenarien, außer bei nq = 1.000 und nprobe = 32, ist der IVF_FLAT-Index effizienter, wenn er auf der CPU läuft.</li>
</ul>
<p>IVF_FLAT-Recall-Leistungstests wurden in Milvus durchgeführt, wobei sowohl der öffentliche 1M-SIFT-Datensatz, der 1 Million 128-dimensionale Vektoren enthält, als auch der glove-200-angular-Datensatz, der 1+ Millionen 200-dimensionale Vektoren enthält, für die Indexerstellung verwendet wurden (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse:</h4><ul>
<li>Der IVF_FLAT-Index kann auf Genauigkeit optimiert werden und erreicht eine Wiederfindungsrate von über 0,99 auf dem 1M-SIFT-Datensatz, wenn nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: Schneller und weniger ressourcenhungrig als IVF_FLAT, aber auch weniger genau.</h3><p>IVF_FLAT führt keine Komprimierung durch, so dass die erzeugten Indexdateien ungefähr die gleiche Größe haben wie die ursprünglichen, nicht indizierten Vektordaten. Wenn z. B. der ursprüngliche 1B-SIFT-Datensatz 476 GB groß ist, sind die IVF_FLAT-Indexdateien etwas größer (~470 GB). Wenn alle Indexdateien in den Speicher geladen werden, werden 470 GB Speicherplatz verbraucht.</p>
<p>Wenn Festplatten-, CPU- oder GPU-Speicherressourcen begrenzt sind, ist IVF_SQ8 eine bessere Option als IVF_FLAT. Dieser Indextyp kann jedes FLOAT (4 Byte) in UINT8 (1 Byte) umwandeln, indem er eine skalare Quantisierung durchführt. Dies reduziert den Festplatten-, CPU- und GPU-Speicherverbrauch um 70-75 %. Für den 1B-SIFT-Datensatz benötigen die IVF_SQ8-Indexdateien nur 140 GB Speicherplatz.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8-Leistungstestergebnisse:</h4><p>IVF_SQ8-Abfragezeittests wurden in Milvus unter Verwendung des öffentlichen 1B-SIFT-Datensatzes, der 1 Milliarde 128-dimensionale Vektoren enthält, zur Indexerstellung durchgeführt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse:</h4><ul>
<li>Durch die Reduzierung der Indexdateigröße bietet IVF_SQ8 deutliche Leistungsverbesserungen gegenüber IVF_FLAT. IVF_SQ8 folgt einer ähnlichen Leistungskurve wie IVF_FLAT, wobei die Abfragezeit mit nq und nprobe zunimmt.</li>
<li>Ähnlich wie bei IVF_FLAT ist die Leistung von IVF_SQ8 höher, wenn die Abfrage auf der CPU ausgeführt wird und wenn nq und nprobe kleiner sind.</li>
</ul>
<p>IVF_SQ8 wurde in Milvus mit dem öffentlichen 1M-SIFT-Datensatz, der 1 Million 128-dimensionale Vektoren enthält, und dem glove-200-angular-Datensatz, der 1+ Millionen 200-dimensionale Vektoren enthält, für die Indexerstellung getestet (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse:</h4><ul>
<li>Trotz der Komprimierung der Originaldaten ist bei IVF_SQ8 kein signifikanter Rückgang der Abfragegenauigkeit zu verzeichnen. Bei verschiedenen nprobe-Einstellungen hat IVF_SQ8 höchstens eine um 1 % niedrigere Rückrufrate als IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: Neuer hybrider GPU/CPU-Ansatz, der noch schneller ist als IVF_SQ8.</h3><p>IVF_SQ8H ist ein neuer Indextyp, der die Abfrageleistung im Vergleich zu IVF_SQ8 verbessert. Wenn ein IVF_SQ8-Index, der auf der CPU läuft, abgefragt wird, wird der größte Teil der gesamten Abfragezeit damit verbracht, nprobe Cluster zu finden, die dem Zieleingabevektor am nächsten sind. Um die Abfragezeit zu verkürzen, kopiert IVF_SQ8 die Daten für die Grobquantisierungsoperationen, die kleiner sind als die Indexdateien, in den GPU-Speicher, was die Grobquantisierungsoperationen erheblich beschleunigt. Dann bestimmt gpu_search_threshold, welches Gerät die Abfrage ausführt. Wenn nq &gt;= gpu_search_threshold ist, führt die GPU die Abfrage aus; andernfalls führt die CPU die Abfrage aus.</p>
<p>IVF_SQ8H ist ein hybrider Indextyp, bei dem CPU und GPU zusammenarbeiten müssen. Er kann nur mit GPU-aktiviertem Milvus verwendet werden.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8H Leistungstestergebnisse:</h4><p>IVF_SQ8H-Abfragezeit-Leistungstests wurden in Milvus unter Verwendung des öffentlichen 1B-SIFT-Datensatzes, der 1 Milliarde 128-dimensionale Vektoren enthält, zur Indexerstellung durchgeführt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse:</h4><ul>
<li>Wenn nq kleiner oder gleich 1.000 ist, sind die Abfragezeiten bei IVF_SQ8H fast doppelt so schnell wie bei IVFSQ8.</li>
<li>Wenn nq = 2000 ist, sind die Abfragezeiten für IVFSQ8H und IVF_SQ8 gleich lang. Wenn jedoch der Parameter gpu_search_threshold kleiner als 2000 ist, ist IVF_SQ8H schneller als IVF_SQ8.</li>
<li>Die Abfrageerinnerungsrate von IVF_SQ8H ist identisch mit der von IVF_SQ8, was bedeutet, dass weniger Abfragezeit ohne Verlust an Suchgenauigkeit erreicht wird.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Erfahren Sie mehr über Milvus, eine Plattform zur Verwaltung von Vektordaten in großem Maßstab.</h3><p>Milvus ist eine Plattform zur Verwaltung von Vektordaten, die Anwendungen zur Ähnlichkeitssuche in den Bereichen künstliche Intelligenz, Deep Learning, herkömmliche Vektorberechnungen und mehr unterstützen kann. Weitere Informationen über Milvus finden Sie in den folgenden Ressourcen:</p>
<ul>
<li>Milvus ist unter einer Open-Source-Lizenz auf <a href="https://github.com/milvus-io/milvus">GitHub</a> verfügbar.</li>
<li>Zusätzliche Indextypen, einschließlich graph- und baumbasierte Indizes, werden in Milvus unterstützt. Eine umfassende Liste der unterstützten Indextypen finden Sie in der <a href="https://milvus.io/docs/v0.11.0/index.md">Dokumentation für Vektorindizes</a> in Milvus.</li>
<li>Um mehr über das Unternehmen zu erfahren, das Milvus auf den Markt gebracht hat, besuchen Sie <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Chatten Sie mit der Milvus-Community oder erhalten Sie Hilfe bei einem Problem auf <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Methodik</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Umgebung für Leistungstests</h4><p>Die Serverkonfiguration, die für die Leistungstests in diesem Artikel verwendet wurde, sieht wie folgt aus:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 Kerne</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB Speicher</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Relevante technische Konzepte</h4><p>Auch wenn dies für das Verständnis dieses Artikels nicht erforderlich ist, finden Sie hier einige technische Konzepte, die für die Interpretation der Ergebnisse unserer Indexleistungstests hilfreich sind:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Ressourcen</h4><p>Die folgenden Quellen wurden für diesen Artikel verwendet:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Enzyklopädie der Datenbanksysteme</a>", Ling Liu und M. Tamer Özsu.</li>
</ul>
