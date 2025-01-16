---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Aufbau eines Einkaufserlebnisses mit Bildsuche mit VOVA und Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Erfahren Sie, wie Milvus, eine Open-Source-Vektordatenbank, von der
  E-Commerce-Plattform VOVA für das Einkaufen nach Bildern eingesetzt wurde.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Aufbau eines Einkaufserlebnisses bei der Bildersuche mit VOVA und Milvus</custom-h1><p>Springe zu:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Aufbau eines Einkaufserlebnisses mit VOVA und Milvus durch Bildersuche</a><ul>
<li><a href="#how-does-image-search-work">Wie funktioniert die Bildersuche?</a>- <a href="#system-process-of-vovas-search-by-image-functionality"><em>Systemprozess der VOVA-Bildersuchfunktionalität.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Zielerkennung mit dem YOLO-Modell</a>- <a href="#yolo-network-architecture"><em>YOLO-Netzwerkarchitektur.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Extraktion von Bildmerkmalen mit ResNet</a>- <a href="#resnet-structure"><em>ResNet-Struktur.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Vektorielle Ähnlichkeitssuche mit Milvus</a>- <a href="#mishards-architecture-in-milvus"><em>Mishards Architektur in Milvus.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVA's shop by image tool</a>- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>Screenshots von VOVA's search by image shopping tool.</em></a></li>
<li><a href="#reference">Referenz</a></li>
</ul></li>
</ul>
<p>Der Online-Einkauf ist im Jahr 2020 um <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">44 %</a> gestiegen, was zum großen Teil auf die Coronavirus-Pandemie zurückzuführen ist. Da die Menschen versuchen, sich sozial abzugrenzen und den Kontakt mit Fremden zu vermeiden, wurde die kontaktlose Lieferung für viele Verbraucher zu einer äußerst wünschenswerten Option. Diese Beliebtheit hat auch dazu geführt, dass die Menschen eine größere Vielfalt an Waren online kaufen, darunter auch Nischenartikel, die mit einer herkömmlichen Stichwortsuche nur schwer zu beschreiben sind.</p>
<p>Um den Nutzern zu helfen, die Beschränkungen von stichwortbasierten Suchanfragen zu überwinden, können Unternehmen Bildsuchmaschinen entwickeln, die es den Nutzern ermöglichen, Bilder anstelle von Wörtern für die Suche zu verwenden. Auf diese Weise können die Nutzer nicht nur schwer zu beschreibende Gegenstände finden, sondern auch Dinge einkaufen, denen sie im wirklichen Leben begegnen. Diese Funktionalität trägt dazu bei, ein einzigartiges Nutzererlebnis zu schaffen und bietet einen allgemeinen Komfort, den die Kunden zu schätzen wissen.</p>
<p>VOVA ist eine aufstrebende E-Commerce-Plattform, die sich auf Erschwinglichkeit und ein positives Einkaufserlebnis für ihre Nutzer konzentriert. Das Angebot umfasst Millionen von Produkten und unterstützt 20 Sprachen und 35 wichtige Währungen. Um das Einkaufserlebnis für seine Nutzer zu verbessern, nutzte das Unternehmen Milvus, um eine Bildsuchfunktion in seine E-Commerce-Plattform zu integrieren. In diesem Artikel erfahren Sie, wie VOVA mit Milvus erfolgreich eine Bildsuchmaschine entwickelt hat.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">Wie funktioniert die Bildersuche?</h3><p>Das Shop-by-Image-System von VOVA durchsucht den Bestand des Unternehmens nach Produktbildern, die den von den Nutzern hochgeladenen Bildern ähnlich sind. Das folgende Diagramm zeigt die beiden Phasen des Systemprozesses, die Datenimportphase (blau) und die Abfragephase (orange):</p>
<ol>
<li>Verwenden Sie das YOLO-Modell, um Ziele aus hochgeladenen Fotos zu erkennen;</li>
<li>Verwendung von ResNet zur Extraktion von Merkmalsvektoren aus den erkannten Zielen;</li>
<li>Verwendung von Milvus für die Vektorähnlichkeitssuche.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Zielerfassung mit dem YOLO-Modell</h3><p>Die mobilen Anwendungen von VOVA für Android und iOS unterstützen derzeit die Bildsuche. Das Unternehmen verwendet ein hochmodernes Echtzeit-Objekterkennungssystem namens YOLO (You only look once), um Objekte in vom Benutzer hochgeladenen Bildern zu erkennen. Das YOLO-Modell befindet sich derzeit in seiner fünften Iteration.</p>
<p>YOLO ist ein einstufiges Modell, das nur ein einziges neuronales Faltungsnetzwerk (CNN) verwendet, um Kategorien und Positionen verschiedener Ziele vorherzusagen. Es ist klein, kompakt und gut für den mobilen Einsatz geeignet.</p>
<p>YOLO verwendet Faltungsschichten, um Merkmale zu extrahieren, und voll verknüpfte Schichten, um Vorhersagewerte zu erhalten. In Anlehnung an das GooLeNet-Modell umfasst der CNN von YOLO 24 Faltungsschichten und zwei voll verknüpfte Schichten.</p>
<p>Wie die folgende Abbildung zeigt, wird ein 448 × 448-Eingabebild durch eine Reihe von Faltungsschichten und Pooling-Schichten in einen 7 × 7 × 1024-dimensionalen Tensor umgewandelt (dargestellt im drittletzten Würfel unten) und dann durch zwei vollverknüpfte Schichten in einen 7 × 7 × 30-dimensionalen Tensorausgang umgewandelt.</p>
<p>Die vorhergesagte Ausgabe von YOLO P ist ein zweidimensionaler Tensor, dessen Form [batch,7 ×7 ×30] ist. Unter Verwendung von Slicing ist P[:,0:7×7×20] die Kategoriewahrscheinlichkeit, P[:,7×7×20:7×7×(20+2)] ist die Konfidenz und P[:,7×7×(20+2)]:] ist das vorhergesagte Ergebnis der Bounding Box.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;YOLO Netzwerkarchitektur.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Extraktion von Bildvektoren mit ResNet</h3><p>VOVA verwendet das Modell des residualen neuronalen Netzes (ResNet), um Merkmalsvektoren aus einer umfangreichen Produktbildbibliothek und von Benutzern hochgeladenen Fotos zu extrahieren. ResNet ist begrenzt, da mit zunehmender Tiefe eines lernenden Netzwerks die Genauigkeit des Netzwerks abnimmt. Die Abbildung unten zeigt ResNet mit dem VGG19-Modell (einer Variante des VGG-Modells), das so modifiziert wurde, dass es durch den Kurzschlussmechanismus eine Residualeinheit enthält. VGG wurde 2014 vorgeschlagen und umfasst nur 14 Schichten, während ResNet ein Jahr später auf den Markt kam und bis zu 152 Schichten umfassen kann.</p>
<p>Die ResNet-Struktur ist leicht zu ändern und zu skalieren. Durch Änderung der Anzahl der Kanäle im Block und der Anzahl der gestapelten Blöcke können Breite und Tiefe des Netzes leicht angepasst werden, um Netze mit unterschiedlichen Ausdrucksmöglichkeiten zu erhalten. Auf diese Weise wird der Degenerationseffekt des Netzes, bei dem die Genauigkeit mit zunehmender Lerntiefe abnimmt, wirksam beseitigt. Mit ausreichenden Trainingsdaten kann ein Modell mit verbesserter Ausdrucksleistung erhalten werden, während das Netz schrittweise vertieft wird. Durch das Modelltraining werden für jedes Bild Merkmale extrahiert und in 256-dimensionale Fließkomma-Vektoren umgewandelt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Vektorielle Ähnlichkeitssuche powered by Milvus</h3><p>Die Produktbilddatenbank von VOVA umfasst 30 Millionen Bilder und wächst schnell. Um aus diesem riesigen Datenbestand schnell die ähnlichsten Produktbilder herauszufinden, wird Milvus für die vektorielle Ähnlichkeitssuche eingesetzt. Dank einer Reihe von Optimierungen bietet Milvus einen schnellen und schlanken Ansatz für die Verwaltung von Vektordaten und die Entwicklung von Anwendungen für maschinelles Lernen. Milvus bietet die Integration mit gängigen Indexbibliotheken (z. B. Faiss, Annoy), unterstützt mehrere Indextypen und Distanzmetriken, verfügt über SDKs in mehreren Sprachen und bietet umfangreiche APIs für die Verwaltung von Vektordaten.</p>
<p>Milvus kann Ähnlichkeitssuchen auf Billionen-Vektordatensätzen in Millisekunden durchführen, mit einer Abfragezeit von unter 1,5 Sekunden bei nq=1 und einer durchschnittlichen Batch-Abfragezeit von unter 0,08 Sekunden. Für den Aufbau seiner Bildsuchmaschine hat VOVA auf das Design von Mishards, der Sharding-Middleware-Lösung von Milvus, zurückgegriffen (das Systemdesign ist in der nachstehenden Grafik dargestellt), um einen hochverfügbaren Server-Cluster zu implementieren. Durch die Nutzung der horizontalen Skalierbarkeit eines Milvus-Clusters konnte die Projektanforderung einer hohen Abfrageleistung bei riesigen Datensätzen erfüllt werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">Das VOVA-Werkzeug "Shop by Image</h3><p>Die folgenden Screenshots zeigen das VOVA-Shopping-Tool für die Suche nach Bildern in der Android-App des Unternehmens.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>Da immer mehr Nutzer nach Produkten suchen und Fotos hochladen, wird VOVA die Modelle, die das System antreiben, weiter optimieren. Darüber hinaus wird das Unternehmen neue Milvus-Funktionen integrieren, die das Online-Shopping-Erlebnis seiner Nutzer weiter verbessern können.</p>
<h3 id="Reference" class="common-anchor-header">Referenz</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
