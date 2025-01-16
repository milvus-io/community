---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Semantische Suche schnell aufbauen
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Erfahren Sie mehr über den Einsatz semantischer maschineller Lernmethoden, um
  relevantere Suchergebnisse in Ihrem Unternehmen zu erzielen.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Schnelle Entwicklung der semantischen Suche</custom-h1><p>Die<a href="https://lucidworks.com/post/what-is-semantic-search/">semantische Suche</a> ist ein großartiges Instrument, das Ihren Kunden - oder Ihren Mitarbeitern - hilft, die richtigen Produkte oder Informationen zu finden. Sie kann sogar schwer zu indexierende Informationen aufdecken und so bessere Ergebnisse erzielen. Wenn Ihre semantischen Methoden jedoch nicht schnell eingesetzt werden, werden sie Ihnen nichts nützen. Der Kunde oder Mitarbeiter wird nicht einfach nur rumsitzen, während das System sich mit der Beantwortung seiner Anfrage Zeit lässt - und wahrscheinlich werden zur gleichen Zeit tausend andere Anfragen eingegeben.</p>
<p>Wie kann man die semantische Suche schnell machen? Mit einer langsamen semantischen Suche ist es nicht getan.</p>
<p>Glücklicherweise ist dies die Art von Problem, die Lucidworks gerne löst. Wir haben vor kurzem einen mittelgroßen Cluster getestet - lesen Sie weiter, um mehr Details zu erfahren -, der 1500 RPS (Anfragen pro Sekunde) mit einer Sammlung von über einer Million Dokumenten und einer durchschnittlichen Antwortzeit von etwa 40 Millisekunden erreichte. Das ist eine beachtliche Geschwindigkeit.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Implementierung der semantischen Suche</h3><p>Um die blitzschnelle Magie des maschinellen Lernens zu ermöglichen, hat Lucidworks die semantische Suche mit dem Ansatz der semantischen Vektorsuche implementiert. Es gibt zwei entscheidende Teile.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Teil eins: Das maschinelle Lernmodell</h4><p>Zunächst benötigen Sie eine Möglichkeit, Text in einen numerischen Vektor zu kodieren. Bei dem Text kann es sich um eine Produktbeschreibung, eine Suchanfrage eines Benutzers, eine Frage oder sogar eine Antwort auf eine Frage handeln. Ein semantisches Suchmodell wird darauf trainiert, Text so zu kodieren, dass Text, der anderen Texten semantisch ähnlich ist, in Vektoren kodiert wird, die numerisch "nah" beieinander liegen. Dieser Kodierungsschritt muss schnell sein, um die tausend oder mehr möglichen Kundensuchen oder Benutzeranfragen zu unterstützen, die jede Sekunde eingehen.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Zweiter Teil: Die Vektorsuchmaschine</h4><p>Zweitens brauchen Sie eine Möglichkeit, schnell die besten Übereinstimmungen mit der Kundensuche oder Benutzeranfrage zu finden. Das Modell wird diesen Text in einen numerischen Vektor kodiert haben. Diesen müssen Sie nun mit allen numerischen Vektoren in Ihrem Katalog oder den Listen mit Fragen und Antworten vergleichen, um die besten Übereinstimmungen zu finden - die Vektoren, die dem Abfragevektor am nächsten kommen. Dazu benötigen Sie eine Vektormaschine, die all diese Informationen effektiv und blitzschnell verarbeiten kann. Die Engine könnte Millionen von Vektoren enthalten, und Sie wollen wirklich nur die besten zwanzig oder so Übereinstimmungen mit Ihrer Anfrage. Und natürlich muss sie etwa tausend solcher Abfragen pro Sekunde verarbeiten.</p>
<p>Um diese Herausforderungen zu meistern, haben wir in unserer <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Version 5.3 von Fusion</a> die Vektorsuchmaschine <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> hinzugefügt. Milvus ist eine Open-Source-Software und sie ist schnell. Milvus verwendet FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), dieselbe Technologie, die Facebook in der Produktion für seine eigenen maschinellen Lerninitiativen einsetzt. Bei Bedarf kann es sogar noch schneller auf der <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a> laufen. Wenn Fusion 5.3 (oder höher) mit der Komponente für maschinelles Lernen installiert ist, wird Milvus automatisch als Teil dieser Komponente installiert, so dass Sie all diese Funktionen problemlos aktivieren können.</p>
<p>Die Größe der Vektoren in einer bestimmten Sammlung, die beim Erstellen der Sammlung angegeben wird, hängt von dem Modell ab, das diese Vektoren erzeugt. In einer bestimmten Sammlung könnten beispielsweise die Vektoren gespeichert werden, die bei der Kodierung (über ein Modell) aller Produktbeschreibungen in einem Produktkatalog entstehen. Ohne eine Vektorsuchmaschine wie Milvus wäre eine Ähnlichkeitssuche über den gesamten Vektorraum nicht möglich. Die Ähnlichkeitssuche müsste sich also auf eine Vorauswahl von Kandidaten aus dem Vektorraum (z. B. 500) beschränken und hätte sowohl eine geringere Leistung als auch qualitativ schlechtere Ergebnisse zur Folge. Milvus kann Hunderte von Milliarden von Vektoren in mehreren Vektorsammlungen speichern, um sicherzustellen, dass die Suche schnell und die Ergebnisse relevant sind.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Verwendung der semantischen Suche</h3><p>Nachdem wir nun ein wenig darüber erfahren haben, warum Milvus so wichtig sein könnte, kommen wir zurück zum Arbeitsablauf der semantischen Suche. Die semantische Suche besteht aus drei Phasen. In der ersten Phase wird das maschinelle Lernmodell geladen und/oder trainiert. Danach werden die Daten in Milvus und Solr indiziert. Die letzte Phase ist die Abfragephase, in der die eigentliche Suche stattfindet. Im Folgenden werden wir uns auf die letzten beiden Phasen konzentrieren.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indizierung in Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Wie im obigen Diagramm dargestellt, beginnt die Abfragephase ähnlich wie die Indizierungsphase, nur dass hier Abfragen anstelle von Dokumenten eingehen. Für jede Abfrage:</p>
<ol>
<li>Die Abfrage wird an die <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> Index-Pipeline gesendet.</li>
<li>Die Abfrage wird dann an das ML-Modell gesendet.</li>
<li>Das ML-Modell gibt einen numerischen Vektor zurück (verschlüsselt aus der Anfrage). Auch hier bestimmt der Typ des Modells die Größe des Vektors.</li>
<li>Der Vektor wird an Milvus gesendet, das dann ermittelt, welche Vektoren in der angegebenen Milvus-Sammlung am besten mit dem angegebenen Vektor übereinstimmen.</li>
<li>Milvus gibt eine Liste von eindeutigen IDs und Abständen zurück, die den in Schritt vier ermittelten Vektoren entsprechen.</li>
<li>Eine Abfrage mit diesen IDs und Abständen wird an Solr gesendet.</li>
<li>Solr gibt dann eine geordnete Liste der mit diesen IDs verbundenen Dokumente zurück.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Skalentests</h3><p>Um zu beweisen, dass unsere semantischen Suchabläufe mit der von unseren Kunden geforderten Effizienz ablaufen, haben wir Skalierungstests mit Gatling-Skripten auf der Google Cloud Platform unter Verwendung eines Fusion-Clusters mit acht Replikaten des ML-Modells, acht Replikaten des Abfragedienstes und einer einzelnen Instanz von Milvus durchgeführt. Die Tests wurden mit den Milvus-Indizes FLAT und HNSW durchgeführt. Der FLAT-Index hat eine 100-prozentige Trefferquote, ist aber weniger effizient - es sei denn, die Datensätze sind klein. Der HNSW-Index (Hierarchical Small World Graph) liefert immer noch qualitativ hochwertige Ergebnisse und hat seine Leistung bei größeren Datenmengen verbessert.</p>
<p>Sehen wir uns nun einige Zahlen aus einem kürzlich durchgeführten Beispiel an:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Erste Schritte</h3><p>Die <a href="https://lucidworks.com/products/smart-answers/">Smart Answers-Pipelines</a> sind so konzipiert, dass sie einfach zu bedienen sind. Lucidworks verfügt über <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">vortrainierte Modelle, die einfach einzusetzen sind</a> und in der Regel gute Ergebnisse liefern. Die besten Ergebnisse erzielen Sie jedoch, wenn Sie Ihre eigenen Modelle zusammen mit den vortrainierten Modellen trainieren. Setzen Sie sich noch heute mit uns in Verbindung, um zu erfahren, wie Sie diese Initiativen in Ihre Suchwerkzeuge implementieren können, um effektivere und attraktivere Ergebnisse zu erzielen.</p>
<blockquote>
<p>Dieser Blog wurde neu veröffentlicht von: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
