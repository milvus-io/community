---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: Mit Milvus AI-Infusion Proptech für personalisierte Immobiliensuche machen
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  KI verändert die Immobilienbranche. Entdecken Sie, wie intelligente
  Technologien den Prozess der Wohnungssuche und des Immobilienkaufs
  beschleunigen.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Making With Milvus: KI-infundiertes Proptech für die personalisierte Immobiliensuche</custom-h1><p>Künstliche Intelligenz (KI) bietet <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">leistungsstarke Anwendungen</a> im Immobilienbereich, die den Prozess der Wohnungssuche verändern. Technisch versierte Immobilienmakler nutzen die Vorteile der KI schon seit Jahren, da sie erkannt haben, dass sie ihren Kunden helfen kann, das richtige Haus schneller zu finden und den Prozess des Immobilienerwerbs zu vereinfachen. Die Coronavirus-Pandemie hat das Interesse, die Akzeptanz und die Investitionen in Immobilientechnologie (oder Proptech) weltweit <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">beschleunigt</a>, was darauf hindeutet, dass sie in Zukunft eine immer größere Rolle in der Immobilienbranche spielen wird.</p>
<p>In diesem Artikel wird untersucht, wie <a href="https://bj.ke.com/">Beike</a> mithilfe der Vektorähnlichkeitssuche eine Plattform für die Wohnungssuche entwickelt hat, die personalisierte Ergebnisse liefert und Angebote nahezu in Echtzeit empfiehlt.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">Was ist vektorielle Ähnlichkeitssuche?</h3><p>Die<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">vektorielle Ähnlichkeitssuche</a> findet in einer Vielzahl von Szenarien der künstlichen Intelligenz, des Deep Learning und der traditionellen Vektorberechnung Anwendung. Die Verbreitung der KI-Technologie ist zum Teil auf die Vektorsuche und ihre Fähigkeit zurückzuführen, unstrukturierte Daten wie Bilder, Videos, Audiodaten, Verhaltensdaten, Dokumente und vieles mehr sinnvoll zu nutzen.</p>
<p>Unstrukturierte Daten machen schätzungsweise 80-90 % aller Daten aus, und die Gewinnung von Erkenntnissen aus diesen Daten wird für Unternehmen, die in einer sich ständig verändernden Welt wettbewerbsfähig bleiben wollen, schnell zu einer Notwendigkeit. Die steigende Nachfrage nach Analysen unstrukturierter Daten, die zunehmende Rechenleistung und die sinkenden Rechenkosten haben die KI-gestützte Vektorsuche zugänglicher denn je gemacht.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Bisher war die Verarbeitung und Analyse unstrukturierter Daten in großem Umfang eine Herausforderung, da sie keinem vordefinierten Modell oder einer Organisationsstruktur folgen. Neuronale Netze (z. B. CNN, RNN und BERT) ermöglichen es, unstrukturierte Daten in Merkmalsvektoren umzuwandeln, ein numerisches Datenformat, das von Computern leicht interpretiert werden kann. Anschließend werden Algorithmen verwendet, um die Ähnlichkeit zwischen Vektoren anhand von Metriken wie der Kosinusähnlichkeit oder dem euklidischen Abstand zu berechnen.</p>
<p>Letztlich ist die Vektorähnlichkeitssuche ein weit gefasster Begriff, der Techniken zur Identifizierung ähnlicher Dinge in riesigen Datensätzen beschreibt. Beike nutzt diese Technologie, um eine intelligente Suchmaschine für Immobilien zu betreiben, die automatisch Angebote auf der Grundlage individueller Benutzerpräferenzen, des Suchverlaufs und der Immobilienkriterien empfiehlt und so den Prozess der Immobiliensuche und des Immobilienkaufs beschleunigt. Milvus ist eine Open-Source-Vektordatenbank, die Informationen mit Algorithmen verbindet und es Beike ermöglicht, seine KI-Immobilienplattform zu entwickeln und zu verwalten.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Wie verwaltet Milvus Vektordaten?</h3><p>Milvus wurde speziell für die Verwaltung großer Vektordatenmengen entwickelt und findet Anwendung in den Bereichen Bild- und Videosuche, chemische Ähnlichkeitsanalyse, personalisierte Empfehlungssysteme, KI im Dialog und vieles mehr. In Milvus gespeicherte Vektordatensätze können effizient abgefragt werden, wobei die meisten Implementierungen diesem allgemeinen Prozess folgen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Wie nutzt Beike Milvus, um die Wohnungssuche intelligenter zu machen?</h3><p>Beike wird gemeinhin als Chinas Antwort auf Zillow bezeichnet und ist eine Online-Plattform, auf der Immobilienmakler Objekte zur Vermietung oder zum Verkauf anbieten können. Um die Wohnungssuche für Wohnungssuchende zu verbessern und Maklern zu helfen, Geschäfte schneller abzuschließen, hat das Unternehmen eine KI-gestützte Suchmaschine für seine Angebotsdatenbank entwickelt. Die Immobiliendatenbank von Beike wurde in Merkmalsvektoren umgewandelt und dann zur Indizierung und Speicherung in Milvus eingespeist. Milvus wird dann verwendet, um eine Ähnlichkeitssuche auf der Grundlage eines eingegebenen Angebots, von Suchkriterien, eines Benutzerprofils oder anderer Kriterien durchzuführen.</p>
<p>Bei der Suche nach weiteren Häusern, die einem bestimmten Angebot ähnlich sind, werden beispielsweise Merkmale wie Grundriss, Größe, Ausrichtung, Innenausbau, Farbgebung und mehr extrahiert. Da die ursprüngliche Datenbank mit Immobilienangeboten <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indexiert</a> wurde, kann die Suche in nur wenigen Millisekunden durchgeführt werden. Das Endprodukt von Beike hatte eine durchschnittliche Abfragezeit von 113 Millisekunden bei einem Datensatz mit über 3 Millionen Vektoren. Milvus ist jedoch in der Lage, effiziente Geschwindigkeiten bei Datensätzen im Billionenbereich aufrechtzuerhalten, was diese relativ kleine Immobiliendatenbank zu einem Kinderspiel macht. Im Allgemeinen folgt das System dem folgenden Prozess:</p>
<ol>
<li><p>Deep Learning-Modelle (z. B. CNN, RNN oder BERT) konvertieren unstrukturierte Daten in Merkmalsvektoren, die dann in Milvus importiert werden.</p></li>
<li><p>Milvus speichert und indiziert die Merkmalsvektoren.</p></li>
<li><p>Milvus liefert Ähnlichkeitssuchergebnisse auf der Grundlage von Benutzeranfragen.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-überblick-diagramm.png</span> </span></p>
<p><br/></p>
<p>Die intelligente Immobiliensuchplattform von Beike stützt sich auf einen Empfehlungsalgorithmus, der die Vektorähnlichkeit anhand der Cosinus-Distanz berechnet. Das System findet ähnliche Immobilien auf der Grundlage von bevorzugten Angeboten und Suchkriterien. Im Großen und Ganzen funktioniert es wie folgt:</p>
<ol>
<li><p>Ausgehend von einem eingegebenen Inserat werden Merkmale wie Grundriss, Größe und Ausrichtung verwendet, um 4 Sammlungen von Merkmalsvektoren zu extrahieren.</p></li>
<li><p>Die extrahierten Merkmalskollektionen werden zur Durchführung einer Ähnlichkeitssuche in Milvus verwendet. Die Ergebnisse der Abfrage für jede Sammlung von Vektoren sind ein Maß für die Ähnlichkeit zwischen dem eingegebenen Angebot und anderen ähnlichen Angeboten.</p></li>
<li><p>Die Suchergebnisse aus jeder der 4 Vektorsammlungen werden verglichen und dann verwendet, um ähnliche Häuser zu empfehlen.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligente-haus-plattform-diagramm.jpg</span> </span></p>
<p><br/></p>
<p>Wie die obige Abbildung zeigt, implementiert das System einen A/B-Tabellenwechselmechanismus für die Aktualisierung der Daten. Milvus speichert die Daten für die ersten T Tage in Tabelle A, am Tag T+1 beginnt es, Daten in Tabelle B zu speichern, am Tag 2T+1 beginnt es, Tabelle A neu zu schreiben, und so weiter.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Wenn Sie mehr über die Arbeit mit Milvus erfahren möchten, lesen Sie die folgenden Ressourcen:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Aufbau eines KI-gesteuerten Schreibassistenten für WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Basteln mit Milvus: KI-gesteuerte Nachrichtenempfehlung im mobilen Browser von Xiaomi</a></p></li>
</ul>
