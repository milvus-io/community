---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Allgemeine Architektur
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  Milvus macht es einfach, den Nutzern einen personalisierten Empfehlungsdienst
  zu bieten.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Aufbau eines personalisierten Produktempfehlungssystems mit Vipshop und Milvus</custom-h1><p>Mit dem explosionsartigen Wachstum des Internet-Datenvolumens steigen einerseits die Produktmenge und die Produktkategorien auf den gängigen E-Commerce-Plattformen, andererseits wird es für die Benutzer immer schwieriger, die gewünschten Produkte zu finden.</p>
<p><a href="https://www.vip.com/">Vipshop</a> ist ein führender Online-Discounter für Markenartikel in China. Das Unternehmen bietet Verbrauchern in ganz China hochwertige und beliebte Markenprodukte zu einem erheblichen Preisnachlass gegenüber den Einzelhandelspreisen an. Um das Einkaufserlebnis für seine Kunden zu optimieren, beschloss das Unternehmen, ein personalisiertes Suchempfehlungssystem zu entwickeln, das auf den Schlüsselwörtern der Benutzeranfrage und den Benutzerporträts basiert.</p>
<p>Die Kernfunktion des E-Commerce-Suchempfehlungssystems besteht darin, aus einer großen Anzahl von Produkten geeignete Produkte zu finden und sie den Nutzern entsprechend ihrer Suchabsicht und Präferenz anzuzeigen. In diesem Prozess muss das System die Ähnlichkeit zwischen den Produkten und den Suchintentionen und -präferenzen der Benutzer berechnen und den Benutzern die TopK-Produkte mit der höchsten Ähnlichkeit empfehlen.</p>
<p>Daten wie Produktinformationen, Suchabsichten und Präferenzen der Nutzer sind allesamt unstrukturierte Daten. Wir haben versucht, die Ähnlichkeit solcher Daten mit CosineSimilarity(7.x) der Suchmaschine Elasticsearch (ES) zu berechnen, aber dieser Ansatz hat die folgenden Nachteile</p>
<ul>
<li><p>Lange Rechenzeit - die durchschnittliche Latenzzeit für das Abrufen von TopK-Ergebnissen aus Millionen von Einträgen beträgt etwa 300 ms.</p></li>
<li><p>Hohe Wartungskosten für ES-Indizes - derselbe Satz von Indizes wird sowohl für Warenmerkmalsvektoren als auch für andere verwandte Daten verwendet, was die Indexerstellung kaum erleichtert, aber eine riesige Datenmenge erzeugt.</p></li>
</ul>
<p>Wir haben versucht, unser eigenes lokal sensitives Hash-Plug-in zu entwickeln, um die CosineSimilarity-Berechnung von ES zu beschleunigen. Obwohl die Leistung und der Durchsatz nach der Beschleunigung erheblich verbessert wurden, war die Latenzzeit von 100+ ms immer noch schwierig, um die tatsächlichen Anforderungen an die Online-Produktabfrage zu erfüllen.</p>
<p>Nach einer gründlichen Recherche entschieden wir uns für Milvus, eine Open-Source-Vektordatenbank, die im Vergleich zu der üblicherweise verwendeten eigenständigen Faiss den Vorteil hat, dass sie eine verteilte Bereitstellung, mehrsprachige SDKs und eine Trennung von Lesen und Schreiben unterstützt.</p>
<p>Mithilfe verschiedener Deep-Learning-Modelle wandeln wir massive unstrukturierte Daten in Merkmalsvektoren um und importieren die Vektoren in Milvus. Mit der hervorragenden Leistung von Milvus kann unser E-Commerce-Suchempfehlungssystem effizient die TopK-Vektoren abfragen, die den Zielvektoren ähnlich sind.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Allgemeine Architektur<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![Architektur](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Architektur.) Wie im Diagramm dargestellt, besteht die Gesamtarchitektur des Systems aus zwei Hauptteilen.</p>
<ul>
<li><p>Schreibprozess: Die durch das Deep-Learning-Modell erzeugten Element-Merkmalsvektoren (im Folgenden als Elementvektoren bezeichnet) werden normalisiert und in MySQL geschrieben. MySQL liest dann die verarbeiteten Item-Merkmalsvektoren mithilfe des Datensynchronisierungstools (ETL) und importiert sie in die Vektordatenbank Milvus.</p></li>
<li><p>Lesevorgang: Der Suchdienst erhält die Merkmalsvektoren der Benutzerpräferenzen (im Folgenden als Benutzervektoren bezeichnet) auf der Grundlage der Schlüsselwörter der Benutzerabfrage und der Benutzerporträts, fragt ähnliche Vektoren in Milvus ab und ruft die TopK-Item-Vektoren ab.</p></li>
</ul>
<p>Milvus unterstützt sowohl inkrementelle Datenaktualisierungen als auch vollständige Datenaktualisierungen. Bei jeder inkrementellen Aktualisierung wird der vorhandene Objektvektor gelöscht und ein neuer Objektvektor eingefügt, was bedeutet, dass jede neu aktualisierte Sammlung neu indiziert wird. Dies eignet sich besser für ein Szenario mit mehr Lese- und weniger Schreibvorgängen. Daher wählen wir die Methode der vollständigen Datenaktualisierung. Darüber hinaus dauert es nur wenige Minuten, die gesamten Daten in Stapeln von mehreren Partitionen zu schreiben, was einer Aktualisierung nahezu in Echtzeit entspricht.</p>
<p>Die Milvus-Schreibknoten führen alle Schreibvorgänge durch, einschließlich der Erstellung von Datensammlungen, der Erstellung von Indizes, dem Einfügen von Vektoren usw., und bieten der Öffentlichkeit Dienste mit Schreibdomänennamen an. Milvus-Leseknoten führen alle Lesevorgänge durch und stellen der Öffentlichkeit Dienste mit reinen Lese-Domänennamen zur Verfügung.</p>
<p>Während die aktuelle Version von Milvus das Umschalten von Sammlungsaliasen nicht unterstützt, führen wir Redis ein, um nahtlos zwischen mehreren vollständigen Datensammlungen umzuschalten.</p>
<p>Der Leseknoten muss nur vorhandene Metadateninformationen und Vektordaten oder Indizes aus MySQL, Milvus und dem verteilten Dateisystem GlusterFS lesen, so dass die Lesefähigkeit durch den Einsatz mehrerer Instanzen horizontal erweitert werden kann.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Details zur Implementierung<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Datenaktualisierung</h3><p>Der Datenaktualisierungsdienst umfasst nicht nur das Schreiben von Vektordaten, sondern auch die Erkennung des Datenvolumens von Vektoren, den Aufbau von Indizes, das Vorladen von Indizes, die Kontrolle von Aliasen, usw. Der Gesamtprozess sieht wie folgt aus. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Prozess</span> </span></p>
<ol>
<li><p>Nehmen wir an, dass SammlungA vor dem Aufbau der gesamten Daten einen Datendienst für die Öffentlichkeit bereitstellt und die gesamten Daten, die verwendet werden, an SammlungA gerichtet werden (<code translate="no">redis key1 = CollectionA</code>). Der Zweck des Aufbaus der Gesamtdaten ist die Erstellung einer neuen Sammlung CollectionB.</p></li>
<li><p>Überprüfung der Warendaten - Überprüfung der Positionsnummer der Warendaten in der MySQL-Tabelle, Vergleich der Warendaten mit den vorhandenen Daten in SammlungA. Die Warnung kann nach Menge oder Prozentsatz eingestellt werden. Wenn die eingestellte Menge (Prozentsatz) nicht erreicht wird, werden die gesamten Daten nicht aufgebaut, was als Fehlschlag dieses Aufbauprozesses angesehen wird und den Alarm auslöst; sobald die eingestellte Menge (Prozentsatz) erreicht ist, beginnt der gesamte Datenaufbauprozess.</p></li>
<li><p>Start des Aufbaus der gesamten Daten - Initialisierung des Alias der gesamten Daten, die aufgebaut werden, und Aktualisierung von Redis. Nach der Aktualisierung wird der Alias der gesamten Daten, die erstellt werden, an CollectionB (<code translate="no">redis key2 = CollectionB</code>) weitergeleitet.</p></li>
<li><p>Erstellen Sie eine neue vollständige Sammlung - stellen Sie fest, ob CollectionB existiert. Wenn ja, löschen Sie sie, bevor Sie eine neue Sammlung erstellen.</p></li>
<li><p>Schreiben von Datenstapeln - Berechnen Sie die Partitions-ID der einzelnen Warendaten mit ihrer eigenen ID mithilfe der Modulo-Operation und schreiben Sie die Daten in mehreren Partitionen stapelweise in die neu erstellte Sammlung.</p></li>
<li><p>Erstellen und Vorladen des Index - Erstellen eines Index (<code translate="no">createIndex()</code>) für die neue Sammlung. Die Indexdatei wird auf dem verteilten Speicherserver GlusterFS gespeichert. Das System simuliert automatisch Abfragen auf die neue Sammlung und lädt den Index zum Aufwärmen der Abfrage vor.</p></li>
<li><p>Überprüfung der Sammlungsdaten - Überprüfung der Anzahl der Daten in der neuen Sammlung, Vergleich der Daten mit der bestehenden Sammlung und Festlegen von Alarmen auf der Grundlage der Menge und des Prozentsatzes. Wenn die eingestellte Anzahl (Prozentsatz) nicht erreicht wird, wird die Sammlung nicht umgestellt und der Erstellungsprozess wird als Fehlschlag betrachtet, wodurch der Alarm ausgelöst wird.</p></li>
<li><p>Umschalten der Sammlung - Alias-Kontrolle. Nach der Aktualisierung von Redis wird der gesamte verwendete Datenalias in die SammlungB (<code translate="no">redis key1 = CollectionB</code>) umgeleitet, der ursprüngliche Redis-Schlüssel2 wird gelöscht, und der Erstellungsprozess ist abgeschlossen.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Datenabruf</h3><p>Die Milvus-Partitionsdaten werden mehrmals aufgerufen, um die Ähnlichkeit zwischen den Benutzervektoren, die auf der Grundlage der Schlüsselwörter der Benutzerabfrage und des Benutzerporträts ermittelt wurden, und dem Objektvektor zu berechnen. Nach der Zusammenführung werden die TopK-Objektvektoren zurückgegeben. Der gesamte Arbeitsablauf sieht wie folgt aus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>workflow</span>In der </span>folgenden Tabelle sind die wichtigsten an diesem Prozess beteiligten Dienste aufgeführt. Es ist ersichtlich, dass die durchschnittliche Latenzzeit für den Abruf der TopK-Vektoren etwa 30 ms beträgt.</p>
<table>
<thead>
<tr><th><strong>Dienst</strong></th><th><strong>Rolle</strong></th><th><strong>Eingabe-Parameter</strong></th><th><strong>Ausgabe-Parameter</strong></th><th><strong>Antwort-Latenzzeit</strong></th></tr>
</thead>
<tbody>
<tr><td>Erfassung von Benutzervektoren</td><td>Abrufen des Benutzervektors</td><td>Benutzerinfo + Abfrage</td><td>Benutzervektor</td><td>10 ms</td></tr>
<tr><td>Milvus-Suche</td><td>Berechnet die Vektorähnlichkeit und liefert TopK-Ergebnisse</td><td>Benutzer-Vektor</td><td>Element-Vektor</td><td>10 Sekunden</td></tr>
<tr><td>Logik der Zeitplanung</td><td>Gleichzeitiges Abrufen und Zusammenführen von Ergebnissen</td><td>Mehrkanalig abgerufene Item-Vektoren und die Ähnlichkeitsbewertung</td><td>TopK-Elemente</td><td>10 Minuten</td></tr>
</tbody>
</table>
<p><strong>Implementierungsprozess:</strong></p>
<ol>
<li>Basierend auf den Schlüsselwörtern der Benutzerabfrage und dem Benutzerporträt wird der Benutzervektor durch das Deep-Learning-Modell berechnet.</li>
<li>Abrufen des Sammlungsalias der gesamten verwendeten Daten aus Redis currentInUseKeyRef und Abrufen von Milvus CollectionName. Bei diesem Prozess handelt es sich um einen Datensynchronisierungsdienst, d. h. der Alias wird nach der Aktualisierung der gesamten Daten auf Redis umgestellt.</li>
<li>Milvus wird gleichzeitig und asynchron mit dem User-Vektor aufgerufen, um Daten aus verschiedenen Partitionen derselben Sammlung zu erhalten. Milvus berechnet die Ähnlichkeit zwischen dem User-Vektor und dem Item-Vektor und gibt die TopK ähnlichen Item-Vektoren in jeder Partition zurück.</li>
<li>Die aus jeder Partition zurückgegebenen TopK-Element-Vektoren werden zusammengeführt und die Ergebnisse in umgekehrter Reihenfolge der Ähnlichkeitsdistanz geordnet, die mit dem inneren Produkt von IP berechnet wird (je größer die Distanz zwischen den Vektoren, desto ähnlicher sind sie). Die endgültigen TopK-Item-Vektoren werden zurückgegeben.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">Ein Blick in die Zukunft<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Gegenwärtig kann die Milvus-basierte Vektorsuche kontinuierlich bei der Suche nach Empfehlungsszenarien eingesetzt werden, und ihre hohe Leistung gibt uns mehr Spielraum bei der Dimensionalität des Modells und der Auswahl des Algorithmus.</p>
<p>Milvus wird eine entscheidende Rolle als Middleware für weitere Szenarien spielen, einschließlich der Erinnerung an die Suche auf der Hauptseite und Empfehlungen für alle Szenarien.</p>
<p>Die drei am meisten erwarteten Funktionen von Milvus für die Zukunft sind folgende</p>
<ul>
<li>Logik für das Umschalten von Sammlungsalias - koordinieren Sie das Umschalten zwischen Sammlungen ohne externe Komponenten.</li>
<li>Filtermechanismus - Milvus v0.11.0 unterstützt den ES DSL-Filtermechanismus nur in der Standalone-Version. Das neu veröffentlichte Milvus 2.0 unterstützt die skalare Filterung und die Trennung von Lesen und Schreiben.</li>
<li>Speicherunterstützung für Hadoop Distributed File System (HDFS) - Das von uns verwendete Milvus v0.10.6 unterstützt nur die POSIX-Dateischnittstelle, und wir haben GlusterFS mit FUSE-Unterstützung als Speicher-Backend eingesetzt. HDFS ist jedoch in Bezug auf Leistung und einfache Skalierung die bessere Wahl.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Lehren und bewährte Praktiken<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Bei Anwendungen, bei denen Lesevorgänge im Vordergrund stehen, kann eine Lese-Schreib-Trennung die Verarbeitungsleistung erheblich steigern und die Leistung verbessern.</li>
<li>Dem Milvus-Java-Client fehlt ein Mechanismus zur Wiederherstellung der Verbindung, da der vom Rückrufdienst verwendete Milvus-Client im Speicher resident ist. Wir müssen unseren eigenen Verbindungspool aufbauen, um die Verfügbarkeit der Verbindung zwischen dem Java-Client und dem Server durch Heartbeat-Tests sicherzustellen.</li>
<li>Gelegentlich treten bei Milvus langsame Abfragen auf. Dies ist auf eine unzureichende Aufwärmphase der neuen Sammlung zurückzuführen. Durch die Simulation der Abfrage auf die neue Sammlung wird die Indexdatei in den Speicher geladen, um das Aufwärmen des Index zu erreichen.</li>
<li>nlist ist der Indexaufbauparameter und nprobe ist der Abfrageparameter. Sie müssen einen angemessenen Schwellenwert entsprechend Ihrem Geschäftsszenario durch Drucktest-Experimente ermitteln, um ein Gleichgewicht zwischen Abrufleistung und Genauigkeit herzustellen.</li>
<li>Bei einem Szenario mit statischen Daten ist es effizienter, zunächst alle Daten in die Sammlung zu importieren und später Indizes zu erstellen.</li>
</ol>
