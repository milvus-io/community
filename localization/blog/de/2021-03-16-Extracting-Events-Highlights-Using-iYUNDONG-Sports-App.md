---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: Extrahieren von Ereignishöhepunkten mit der iYUNDONG Sports App
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: Making with Milvus Intelligentes Bildabfragesystem für Sport App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Extrahieren von Veranstaltungshöhepunkten mit der iYUNDONG Sports App</custom-h1><p>iYUNDONG ist ein Internetunternehmen, das darauf abzielt, mehr Sportliebhaber und Teilnehmer von Veranstaltungen wie Marathonläufen zu begeistern. Es entwickelt Tools <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">mit künstlicher Intelligenz (KI)</a>, die bei Sportveranstaltungen aufgenommene Medien analysieren können, um automatisch Highlights zu generieren. So kann beispielsweise ein Nutzer der iYUNDONG-Sport-App, der an einer Sportveranstaltung teilgenommen hat, durch Hochladen eines Selfies sofort seine eigenen Fotos oder Videoclips aus einem riesigen Mediendatensatz der Veranstaltung abrufen.</p>
<p>Eine der wichtigsten Funktionen der iYUNDONG-App heißt "Find me in motion".  Fotografen nehmen während eines Sportereignisses wie einem Marathonlauf in der Regel große Mengen an Fotos oder Videos auf und laden diese in Echtzeit in die iYUNDONG-Mediendatenbank hoch. Marathonläufer, die ihre schönsten Momente sehen wollen, können Bilder von sich selbst abrufen, indem sie einfach eines ihrer Selfies hochladen. Dies spart ihnen viel Zeit, da ein Bildabrufsystem in der iYUNDONG-App den gesamten Bildabgleich übernimmt. <a href="https://milvus.io/">Milvus</a> wird von iYUNDONG eingesetzt, um dieses System zu betreiben, da Milvus den Abrufprozess erheblich beschleunigen und sehr genaue Ergebnisse liefern kann.</p>
<p><br/></p>
<p><strong>Sprung zu:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Extrahieren von Ereignishöhepunkten mit iYUNDONG Sports App</a><ul>
<li><a href="#difficulties-and-solutions">Schwierigkeiten und Lösungen</a></li>
<li><a href="#what-is-milvus">Was ist Milvus</a>- <a href="#an-overview-of-milvus"><em>Ein Überblick über Milvus.</em></a></li>
<li><a href="#why-milvus">Warum Milvus</a></li>
<li><a href="#system-and-workflow">System und Arbeitsablauf</a></li>
<li><a href="#iyundong-app-interface">iYUNDONG App Schnittstelle</a>- <a href="#iyundong-app-interface-1"><em>iYUNDONG App Schnittstelle.</em></a></li>
<li><a href="#conclusion">Fazit</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Schwierigkeiten und Lösungen</h3><p>iYUNDONG sah sich beim Aufbau seines Bildrecherche-Systems mit den folgenden Problemen konfrontiert und fand erfolgreich entsprechende Lösungen.</p>
<ul>
<li>Veranstaltungsfotos müssen sofort für die Suche verfügbar sein.</li>
</ul>
<p>iYUNDONG entwickelte eine Funktion namens InstantUpload, um sicherzustellen, dass Veranstaltungsfotos sofort nach dem Hochladen für die Suche verfügbar sind.</p>
<ul>
<li>Speicherung großer Datenmengen</li>
</ul>
<p>Massive Daten wie Fotos und Videos werden im Millisekundentakt in das iYUNDONG Backend hochgeladen. Daher beschloss iYUNDONG, auf Cloud-Speichersysteme wie <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> und <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a> zu migrieren, um riesige Mengen unstrukturierter Daten sicher, schnell und zuverlässig zu verarbeiten.</p>
<ul>
<li>Sofortiges Lesen</li>
</ul>
<p>Um ein sofortiges Lesen zu erreichen, hat iYUNDONG seine eigene Sharding-Middleware entwickelt, um eine einfache horizontale Skalierbarkeit zu erreichen und die Auswirkungen auf das System durch das Lesen von Festplatten zu minimieren. Darüber hinaus wird <a href="https://redis.io/">Redis</a> als Caching-Schicht verwendet, um eine konsistente Leistung bei hoher Gleichzeitigkeit zu gewährleisten.</p>
<ul>
<li>Sofortige Extraktion von Gesichtsmerkmalen</li>
</ul>
<p>Um Gesichtsmerkmale aus von Benutzern hochgeladenen Fotos genau und effizient zu extrahieren, entwickelte iYUNDONG einen proprietären Bildkonvertierungsalgorithmus, der Bilder in 128-dimensionale Merkmalsvektoren umwandelt. Ein weiteres Problem bestand darin, dass oft viele Nutzer und Fotografen gleichzeitig Bilder oder Videos hochgeladen haben. Daher mussten die Systemingenieure beim Einsatz des Systems die dynamische Skalierbarkeit berücksichtigen. Genauer gesagt, nutzte iYUNDONG seinen Elastic Compute Service (ECS) in der Cloud voll aus, um eine dynamische Skalierung zu erreichen.</p>
<ul>
<li>Schnelle und groß angelegte Vektorsuche</li>
</ul>
<p>iYUNDONG benötigte eine Vektordatenbank, um seine große Anzahl von Merkmalsvektoren zu speichern, die von KI-Modellen extrahiert wurden. Gemäß seinem eigenen einzigartigen Geschäftsanwendungsszenario erwartete iYUNDONG, dass die Vektordatenbank in der Lage ist:</p>
<ol>
<li>blitzschnelles Abrufen von Vektoren auf extrem großen Datensätzen.</li>
<li>Massenspeicherung bei geringeren Kosten.</li>
</ol>
<p>Anfänglich wurden durchschnittlich 1 Million Bilder pro Jahr verarbeitet, so dass iYUNDONG alle Daten für die Suche im RAM speicherte. In den letzten zwei Jahren boomte das Unternehmen jedoch und verzeichnete ein exponentielles Wachstum unstrukturierter Daten - die Anzahl der Bilder in der iYUNDONG-Datenbank überstieg im Jahr 2019 60 Millionen, was bedeutet, dass mehr als 1 Milliarde Merkmalsvektoren gespeichert werden mussten. Diese enorme Datenmenge führte zwangsläufig dazu, dass das iYUNDONG-System schwerfällig und ressourcenintensiv wurde. Daher musste das Unternehmen kontinuierlich in Hardware-Einrichtungen investieren, um eine hohe Leistung zu gewährleisten. Konkret setzte iYUNDONG mehr Suchserver, einen größeren Arbeitsspeicher und eine leistungsfähigere CPU ein, um eine höhere Effizienz und horizontale Skalierbarkeit zu erreichen. Einer der Mängel dieser Lösung war jedoch, dass sie die Betriebskosten prohibitiv hoch trieb. Daher suchte iYUNDONG nach einer besseren Lösung für dieses Problem und dachte über die Nutzung von Vektorindexbibliotheken wie Faiss nach, um Kosten zu sparen und das Geschäft besser zu steuern. Schließlich entschied sich iYUNDONG für die Open-Source-Vektordatenbank Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Was ist Milvus?</h3><p>Milvus ist eine Open-Source-Vektordatenbank, die einfach zu bedienen, hoch flexibel, zuverlässig und rasend schnell ist. In Kombination mit verschiedenen Deep-Learning-Modellen wie Foto- und Spracherkennung, Videoverarbeitung und Verarbeitung natürlicher Sprache kann Milvus unstrukturierte Daten verarbeiten und analysieren, die mit Hilfe verschiedener KI-Algorithmen in Vektoren umgewandelt werden. Im Folgenden ist der Arbeitsablauf dargestellt, wie Milvus alle unstrukturierten Daten verarbeitet:</p>
<p>● Unstrukturierte Daten werden durch Deep-Learning-Modelle oder andere KI-Algorithmen in Einbettungsvektoren umgewandelt.</p>
<p>Anschließend werden die Einbettungsvektoren zur Speicherung in Milvus eingefügt. Milvus baut auch Indizes für diese Vektoren auf.</p>
<p>Milvus führt eine Ähnlichkeitssuche durch und liefert genaue Suchergebnisse, die auf verschiedenen Geschäftsanforderungen basieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONG Blog 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Warum Milvus?</h3><p>Seit Ende 2019 hat iYUNDONG eine Reihe von Tests durchgeführt, um Milvus als Grundlage für sein Bildabfragesystem zu nutzen. Die Testergebnisse haben gezeigt, dass Milvus andere Mainstream-Vektordatenbanken übertrifft, da es mehrere Indizes unterstützt und die RAM-Nutzung effizient reduzieren kann, wodurch die Zeitspanne für die Vektorähnlichkeitssuche erheblich verkürzt wird.</p>
<p>Außerdem werden regelmäßig neue Versionen von Milvus veröffentlicht. Während des Testzeitraums hat Milvus mehrere Versions-Updates von Version 0.6.0 bis Version 0.10.1 durchlaufen.</p>
<p>Darüber hinaus ermöglicht Milvus mit seiner aktiven Open-Source-Gemeinschaft und seinen leistungsstarken Out-of-the-Box-Funktionen iYUNDONG, mit einem knappen Entwicklungsbudget zu arbeiten.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">System und Arbeitsablauf</h3><p>Das System von iYUNDONG extrahiert Gesichtsmerkmale, indem es zunächst Gesichter in von Fotografen hochgeladenen Veranstaltungsfotos erkennt. Dann werden diese Gesichtsmerkmale in 128-dimensionale Vektoren umgewandelt und in der Milvus-Bibliothek gespeichert. Milvus erstellt Indizes für diese Vektoren und kann sofort sehr genaue Ergebnisse liefern.</p>
<p>Weitere Zusatzinformationen wie Foto-IDs und Koordinaten, die die Position eines Gesichts auf einem Foto angeben, werden in einer Datenbank eines Drittanbieters gespeichert.</p>
<p>Jeder Merkmalsvektor hat eine eindeutige ID in der Milvus-Bibliothek. iYUNDONG verwendet den <a href="https://github.com/Meituan-Dianping/Leaf">Leaf-Algorithmus</a>, einen verteilten ID-Generierungsdienst, der von der grundlegenden F&amp;E-Plattform <a href="https://about.meituan.com/en">von Meituan</a> entwickelt wurde, um die Vektor-ID in Milvus mit den entsprechenden Zusatzinformationen zu verknüpfen, die in einer anderen Datenbank gespeichert sind. Durch die Kombination des Merkmalsvektors und der zusätzlichen Informationen kann das iYUNDONG-System bei der Benutzersuche ähnliche Ergebnisse liefern.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">iYUNDONG App Schnittstelle</h3><p>Auf der Startseite werden eine Reihe von aktuellen Sportereignissen aufgelistet. Durch Antippen eines der Ereignisse können die Benutzer die vollständigen Details sehen.</p>
<p>Nach Antippen der Schaltfläche oben auf der Fotogalerie-Seite können die Nutzer dann ein eigenes Foto hochladen, um Bilder von ihren Highlights abzurufen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Fazit</h3><p>Dieser Artikel stellt vor, wie die iYUNDONG-App ein intelligentes Bildabfragesystem aufbaut, das genaue Suchergebnisse auf der Grundlage der von den Benutzern hochgeladenen Fotos liefert, die sich in Auflösung, Größe, Klarheit, Winkel und anderen Aspekten unterscheiden, die eine Ähnlichkeitssuche erschweren. Mit Hilfe von Milvus kann iYUNDONG App erfolgreich Abfragen im Millisekundenbereich auf einer Datenbank von über 60 Millionen Bildern durchführen. Und die Trefferquote bei der Suche nach Fotos liegt konstant bei über 92%. Milvus macht es für iYUNDONG einfacher, ein leistungsfähiges, unternehmensgerechtes Bildabfragesystem in kurzer Zeit mit begrenzten Ressourcen zu erstellen.</p>
<p>Lesen Sie andere <a href="https://zilliz.com/user-stories">Anwenderberichte</a>, um mehr über die Arbeit mit Milvus zu erfahren.</p>
