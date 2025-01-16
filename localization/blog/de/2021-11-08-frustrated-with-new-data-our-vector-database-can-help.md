---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Einführung
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Entwurf und Praxis von KI-orientierten Mehrzweck-Vektor-Datenbanksystemen
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>Frustriert von neuen Daten? Unsere Vektordatenbank kann helfen</custom-h1><p>Welche Datenbanktechnologien und -anwendungen werden im Zeitalter von Big Data ins Rampenlicht rücken? Was wird der nächste entscheidende Schritt sein?</p>
<p>Unstrukturierte Daten machen etwa 80-90 % aller gespeicherten Daten aus; was sollen wir mit diesen wachsenden Datenmengen anfangen? Man könnte an die Verwendung traditioneller Analysemethoden denken, die jedoch, wenn überhaupt, keine nützlichen Informationen liefern. Um diese Frage zu beantworten, haben die "drei Musketiere" des Forschungs- und Entwicklungsteams von Zilliz, Dr. Rentong Guo, Herr Xiaofan Luan und Dr. Xiaomeng Yi, einen Artikel verfasst, in dem sie das Design und die Herausforderungen beim Aufbau eines allgemeinen Vektor-Datenbanksystems diskutieren.</p>
<p>Dieser Artikel wurde in Programmer veröffentlicht, einer Zeitschrift, die von CSDN, der größten Softwareentwicklergemeinschaft in China, herausgegeben wird. Diese Ausgabe des Programmer enthält auch Artikel von Jeffrey Ullman, Empfänger des Turing Award 2020, Yann LeCun, Empfänger des Turing Award 2018, Mark Porter, CTO von MongoDB, Zhenkun Yang, Gründer von OceanBase, Dongxu Huang, Gründer von PingCAP, usw.</p>
<p>Nachfolgend stellen wir Ihnen den Artikel in voller Länge zur Verfügung:</p>
<custom-h1>Design und Praxis von KI-orientierten Allzweck-Vektor-Datenbanksystemen</custom-h1><h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Moderne Datenanwendungen können problemlos mit strukturierten Daten umgehen, die etwa 20 % des heutigen Datenbestands ausmachen. In ihrem Werkzeugkasten befinden sich Systeme wie relationale Datenbanken, NoSQL-Datenbanken usw. Im Gegensatz dazu gibt es für unstrukturierte Daten, die etwa 80 % aller Daten ausmachen, keine zuverlässigen Systeme. Um dieses Problem zu lösen, werden in diesem Artikel die Probleme erörtert, die die traditionelle Datenanalyse mit unstrukturierten Daten hat, sowie die Architektur und die Herausforderungen, mit denen wir beim Aufbau unseres eigenen Allzweck-Vektor-Datenbanksystems konfrontiert waren.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">Datenrevolution in der KI-Ära<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der rasanten Entwicklung von 5G- und IoT-Technologien versucht die Industrie, ihre Kanäle zur Datenerfassung zu vervielfachen und die reale Welt weiter in den digitalen Raum zu projizieren. Dies hat zwar einige enorme Herausforderungen mit sich gebracht, aber auch enorme Vorteile für die wachsende Industrie. Eine dieser großen Herausforderungen ist die Frage, wie man tiefere Einblicke in die neu eingehenden Daten gewinnen kann.</p>
<p>Laut IDC-Statistiken werden allein im Jahr 2020 weltweit mehr als 40.000 Exabyte an neuen Daten erzeugt. Davon sind nur 20 % strukturierte Daten - Daten, die hochgradig geordnet und durch numerische Berechnungen und relationale Algebra leicht zu organisieren und zu analysieren sind. Im Gegensatz dazu sind unstrukturierte Daten (die die restlichen 80 % ausmachen) extrem reich an Datentypvariationen, was es schwierig macht, die tiefe Semantik durch herkömmliche Datenanalysemethoden aufzudecken.</p>
<p>Glücklicherweise erleben wir eine gleichzeitige, rasante Entwicklung von unstrukturierten Daten und künstlicher Intelligenz, wobei uns die künstliche Intelligenz ein besseres Verständnis der Daten durch verschiedene Arten von neuronalen Netzen ermöglicht, wie in Abbildung 1 dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>neueDaten1.jpeg</span> </span></p>
<p>Die Einbettungstechnologie hat nach dem Debüt von Word2vec schnell an Popularität gewonnen, wobei die Idee des "Einbettens von allem" alle Bereiche des maschinellen Lernens erreicht hat. Dies führt zur Entstehung von zwei großen Datenschichten: der Rohdatenschicht und der Vektordatenschicht. Die Rohdatenebene besteht aus unstrukturierten Daten und bestimmten Arten von strukturierten Daten; die Vektorebene ist die Sammlung leicht analysierbarer Einbettungen, die aus der Rohdatenebene stammen und maschinelle Lernmodelle durchlaufen.</p>
<p>Im Vergleich zu Rohdaten bieten vektorisierte Daten die folgenden Vorteile:</p>
<ul>
<li>Einbettungsvektoren sind ein abstrakter Datentyp, was bedeutet, dass wir ein einheitliches Algebra-System aufbauen können, das die Komplexität von unstrukturierten Daten reduziert.</li>
<li>Einbettungsvektoren werden durch dichte Gleitkomma-Vektoren ausgedrückt, so dass Anwendungen die Vorteile von SIMD nutzen können. Da SIMD von GPUs und fast allen modernen CPUs unterstützt wird, können Berechnungen über Vektoren eine hohe Leistung bei relativ geringen Kosten erreichen.</li>
<li>Vektordaten, die über Modelle des maschinellen Lernens kodiert werden, benötigen weniger Speicherplatz als die unstrukturierten Originaldaten, was einen höheren Durchsatz ermöglicht.</li>
<li>Arithmetische Berechnungen können auch über eingebettete Vektoren hinweg durchgeführt werden. Abbildung 2 zeigt ein Beispiel für ein cross-modales semantisches Approximationsmatching - die in der Abbildung gezeigten Bilder sind das Ergebnis eines Abgleichs von Worteinbettungen mit Bildeinbettungen.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>neueDaten2.png</span> </span></p>
<p>Wie in Abbildung 3 zu sehen ist, kann die Kombination von Bild- und Wortsemantik durch einfache Vektoraddition und -subtraktion über ihre entsprechenden Einbettungen erfolgen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Abgesehen von den oben genannten Merkmalen unterstützen diese Operatoren in praktischen Szenarien auch kompliziertere Abfrageanweisungen. Ein bekanntes Beispiel ist die Empfehlung von Inhalten. Im Allgemeinen bettet das System sowohl den Inhalt als auch die Sehgewohnheiten der Benutzer ein. Anschließend gleicht das System die eingebetteten Benutzerpräferenzen mit den ähnlichsten eingebetteten Inhalten über eine semantische Ähnlichkeitsanalyse ab, was zu neuen Inhalten führt, die den Benutzerpräferenzen ähnlich sind. Diese Vektordatenschicht ist nicht nur auf Empfehlungssysteme beschränkt, es gibt auch Anwendungsfälle wie E-Commerce, Malware-Analyse, Datenanalyse, biometrische Überprüfung, Analyse chemischer Formeln, Finanzen, Versicherungen usw.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Unstrukturierte Daten erfordern einen kompletten Software-Stack<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Systemsoftware bildet die Grundlage aller datenorientierten Anwendungen, aber die in den letzten Jahrzehnten aufgebaute Datensystemsoftware, z. B. Datenbanken, Datenanalyse-Engines usw., ist für den Umgang mit strukturierten Daten gedacht. Moderne Datenanwendungen stützen sich fast ausschließlich auf unstrukturierte Daten und profitieren nicht von traditionellen Datenbankmanagementsystemen.</p>
<p>Um dieses Problem anzugehen, haben wir ein KI-orientiertes Allzweck-Vektor-Datenbanksystem namens <em>Milvus</em> entwickelt und als Open Source zur Verfügung gestellt (Referenz Nr. 1~2). Im Vergleich zu herkömmlichen Datenbanksystemen arbeitet Milvus auf einer anderen Datenebene. Herkömmliche Datenbanken wie relationale Datenbanken, KV-Datenbanken, Textdatenbanken, Bild-/Videodatenbanken usw. arbeiten auf der Ebene der Rohdaten, während Milvus auf der Ebene der Vektordaten arbeitet.</p>
<p>In den folgenden Kapiteln werden wir die neuartigen Funktionen, das architektonische Design und die technischen Herausforderungen erörtern, mit denen wir bei der Entwicklung von Milvus konfrontiert waren.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Hauptmerkmale einer Vektordatenbank<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken können Vektoren speichern, abrufen und analysieren und bieten, wie jede andere Datenbank auch, eine Standardschnittstelle für CRUD-Operationen. Zusätzlich zu diesen "Standard"-Funktionen sind die unten aufgeführten Attribute ebenfalls wichtige Eigenschaften für eine Vektordatenbank:</p>
<ul>
<li><strong>Unterstützung für hocheffiziente Vektoroperatoren</strong></li>
</ul>
<p>Die Unterstützung für Vektoroperatoren in einer Analyse-Engine konzentriert sich auf zwei Ebenen. Erstens sollte die Vektordatenbank verschiedene Arten von Operatoren unterstützen, z. B. den oben erwähnten semantischen Ähnlichkeitsabgleich und die semantische Arithmetik. Darüber hinaus sollte sie eine Vielzahl von Ähnlichkeitsmetriken für die zugrunde liegenden Ähnlichkeitsberechnungen unterstützen. Diese Ähnlichkeit wird in der Regel als räumlicher Abstand zwischen Vektoren quantifiziert, wobei gängige Metriken der euklidische Abstand, der Kosinusabstand und der Innenproduktabstand sind.</p>
<ul>
<li><strong>Unterstützung für die Vektorindizierung</strong></li>
</ul>
<p>Im Vergleich zu B-Baum- oder LSM-Baum-basierten Indizes in herkömmlichen Datenbanken verbrauchen hochdimensionale Vektorindizes in der Regel viel mehr Rechenressourcen. Wir empfehlen die Verwendung von Clustering- und Graphenindex-Algorithmen und die Bevorzugung von Matrix- und Vektoroperationen, um die bereits erwähnte Beschleunigung der Hardware-Vektorberechnung voll auszunutzen.</p>
<ul>
<li><strong>Konsistente Benutzererfahrung in verschiedenen Einsatzumgebungen</strong></li>
</ul>
<p>Vektordatenbanken werden in der Regel in verschiedenen Umgebungen entwickelt und eingesetzt. In der Anfangsphase arbeiten Datenwissenschaftler und Algorithmenentwickler meist an ihren Laptops und Workstations, da sie mehr auf die Effizienz der Verifizierung und die Iterationsgeschwindigkeit achten. Wenn die Überprüfung abgeschlossen ist, können sie die Datenbank in voller Größe auf einem privaten Cluster oder in der Cloud bereitstellen. Daher sollte ein qualifiziertes Vektordatenbanksystem eine konsistente Leistung und Benutzerfreundlichkeit in verschiedenen Einsatzumgebungen bieten.</p>
<ul>
<li><strong>Unterstützung für hybride Suche</strong></li>
</ul>
<p>In dem Maße, in dem Vektordatenbanken allgegenwärtig werden, entstehen neue Anwendungen. Unter all diesen Anforderungen ist die am häufigsten genannte die hybride Suche in Vektoren und anderen Datentypen. Einige Beispiele hierfür sind die Approximate Nearest Neighbor Search (ANNS) nach skalarer Filterung, der Multi-Channel-Recall von Volltextsuche und Vektorsuche sowie die hybride Suche von räumlich-zeitlichen Daten und Vektordaten. Solche Herausforderungen erfordern elastische Skalierbarkeit und Abfrageoptimierung, um Vektorsuchmaschinen effektiv mit KV-, Text- und anderen Suchmaschinen zu verschmelzen.</p>
<ul>
<li><strong>Cloud-native Architektur</strong></li>
</ul>
<p>Das Volumen der Vektordaten wächst mit dem exponentiellen Wachstum der Datenerfassung explosionsartig an. Hochdimensionale Vektordaten im Billionenmaßstab entsprechen Tausenden von TB an Speicherplatz, was weit über die Grenzen eines einzelnen Knotens hinausgeht. Folglich ist die horizontale Erweiterbarkeit eine Schlüsselfunktion für eine Vektordatenbank und sollte die Anforderungen der Nutzer an Elastizität und Flexibilität bei der Bereitstellung erfüllen. Darüber hinaus sollte sie auch die Komplexität des Systembetriebs und der Wartung verringern und gleichzeitig die Beobachtbarkeit mit Hilfe der Cloud-Infrastruktur verbessern. Einige dieser Anforderungen kommen in Form von Multi-Tenant-Isolation, Daten-Snapshot und Backup, Datenverschlüsselung und Datenvisualisierung, die in traditionellen Datenbanken üblich sind.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Architektur des Vektordatenbanksystems<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 folgt den Designprinzipien &quot;Log as Data&quot;, &quot;Unified Batch and Stream Processing&quot;, &quot;Stateless&quot; und &quot;Micro-Services&quot;. Abbildung 4 zeigt die Gesamtarchitektur von Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Protokoll als Daten</strong>: Milvus 2.0 unterhält keine physischen Tabellen. Stattdessen wird die Datenzuverlässigkeit durch Log-Persistenz und Log-Snapshots sichergestellt. Der Log-Broker (das Rückgrat des Systems) speichert Protokolle und entkoppelt Komponenten und Dienste durch den Mechanismus der Protokollveröffentlichung und -abonnierung (pub-sub). Wie in Abbildung 5 dargestellt, besteht der Log-Broker aus einer &quot;Log-Sequenz&quot; und einem &quot;Log-Subscriber&quot;. Die Log-Sequenz zeichnet alle Operationen auf, die den Zustand einer Sammlung ändern (entspricht einer Tabelle in einer relationalen Datenbank); der Log-Abonnent abonniert die Log-Sequenz, um seine lokalen Daten zu aktualisieren und Dienste in Form von Nur-Lese-Kopien anzubieten. Der Pub-Sub-Mechanismus bietet auch Raum für die Erweiterbarkeit des Systems im Hinblick auf die Erfassung von Änderungsdaten (CDC) und den global verteilten Einsatz.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Vereinheitlichte Batch- und Stream-Verarbeitung</strong>: Mit Log-Streaming kann Milvus Daten in Echtzeit aktualisieren und so die Echtzeit-Bereitstellung sicherstellen. Darüber hinaus kann Milvus durch die Umwandlung von Datenbatches in Protokoll-Snapshots und die Erstellung von Indizes auf Snapshots eine höhere Abfrageeffizienz erzielen. Während einer Abfrage führt Milvus die Abfrageergebnisse aus inkrementellen Daten und historischen Daten zusammen, um die Integrität der zurückgegebenen Daten zu gewährleisten. Ein solches Design sorgt für ein besseres Gleichgewicht zwischen Echtzeitleistung und Effizienz und verringert den Wartungsaufwand von Online- und Offline-Systemen im Vergleich zur traditionellen Lambda-Architektur.</p>
<p><strong>Zustandslos</strong>: Cloud-Infrastruktur und Open-Source-Speicherkomponenten befreien Milvus von der Persistenz der Daten innerhalb seiner eigenen Komponenten. Milvus 2.0 persistiert Daten mit drei Arten von Speicher: Metadatenspeicher, Protokollspeicher und Objektspeicher. Der Metadatenspeicher speichert nicht nur die Metadaten, sondern übernimmt auch die Erkennung von Diensten und die Knotenverwaltung. Der Protokollspeicher führt die inkrementelle Datenpersistenz und die Datenveröffentlichung und -abonnierung durch. Der Objektspeicher speichert Protokoll-Snapshots, Indizes und einige Berechnungszwischenergebnisse.</p>
<p><strong>Microservices</strong>: Milvus folgt den Prinzipien der Disaggregation von Daten- und Steuerungsebene, der Trennung von Lesen und Schreiben sowie der Trennung von Online- und Offline-Aufgaben. Es besteht aus vier Dienstschichten: der Zugriffsschicht, der Koordinatorschicht, der Arbeitsschicht und der Speicherschicht. Diese Schichten sind voneinander unabhängig, wenn es um Skalierung und Notfallwiederherstellung geht. Die Zugriffsschicht ist die Frontschicht und der Endpunkt des Benutzers. Sie verarbeitet Client-Verbindungen, validiert Client-Anfragen und kombiniert Abfrageergebnisse. Als &quot;Gehirn&quot; des Systems übernimmt die Koordinatorschicht die Aufgaben der Verwaltung der Clustertopologie, des Lastausgleichs, der Datenerklärung und der Datenverwaltung. Die Worker-Schicht enthält die "Gliedmaßen" des Systems und führt Datenaktualisierungen, Abfragen und Indexaufbauoperationen aus. Die Speicherschicht schließlich ist für die Datenpersistenz und -replikation zuständig. Insgesamt gewährleistet dieses auf Mikrodiensten basierende Design eine kontrollierbare Systemkomplexität, wobei jede Komponente für ihre eigene Funktion verantwortlich ist. Milvus verdeutlicht die Dienstgrenzen durch klar definierte Schnittstellen und entkoppelt die Dienste auf der Grundlage einer feineren Granularität, wodurch die elastische Skalierbarkeit und Ressourcenverteilung weiter optimiert wird.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Technische Herausforderungen für Vektordatenbanken<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Die frühe Forschung im Bereich der Vektordatenbanken konzentrierte sich hauptsächlich auf die Entwicklung hocheffizienter Indexstrukturen und Abfragemethoden - dies führte zu einer Vielzahl von Bibliotheken mit Vektorsuchalgorithmen (Referenz Nr. 3~5). In den letzten Jahren haben immer mehr akademische und technische Teams die Probleme der Vektorsuche aus der Perspektive des Systemdesigns neu betrachtet und einige systematische Lösungen vorgeschlagen. Auf der Grundlage bestehender Studien und der Nachfrage der Nutzer lassen sich die wichtigsten technischen Herausforderungen für Vektordatenbanken wie folgt kategorisieren:</p>
<ul>
<li><strong>Optimierung des Kosten-Leistungs-Verhältnisses im Verhältnis zur Last</strong></li>
</ul>
<p>Im Vergleich zu traditionellen Datentypen erfordert die Analyse von Vektordaten aufgrund ihrer hohen Dimensionalität viel mehr Speicher- und Rechenressourcen. Darüber hinaus haben die Benutzer unterschiedliche Präferenzen hinsichtlich der Lastcharakteristiken und der Optimierung des Kosten-Leistungs-Verhältnisses bei Vektorsuchlösungen gezeigt. So bevorzugen beispielsweise Nutzer, die mit extrem großen Datensätzen (Dutzende oder Hunderte Milliarden Vektoren) arbeiten, Lösungen mit geringeren Datenspeicherkosten und variabler Suchlatenz, während andere eine höhere Suchleistung und eine nicht variierende durchschnittliche Latenz verlangen. Um solchen unterschiedlichen Präferenzen gerecht zu werden, muss die Kernindexkomponente der Vektordatenbank in der Lage sein, Indexstrukturen und Suchalgorithmen mit unterschiedlichen Arten von Speicher- und Computerhardware zu unterstützen.</p>
<p>So sollte beispielsweise die Speicherung von Vektordaten und den entsprechenden Indexdaten in kostengünstigeren Speichermedien (wie NVM und SSD) in Betracht gezogen werden, um die Speicherkosten zu senken. Die meisten bestehenden Vektorsuchalgorithmen arbeiten jedoch mit Daten, die direkt aus dem Speicher gelesen werden. Um Leistungseinbußen durch die Verwendung von Festplattenlaufwerken zu vermeiden, sollte die Vektordatenbank in der Lage sein, die Lokalität des Datenzugriffs in Kombination mit Suchalgorithmen zu nutzen und sich an Speicherlösungen für Vektordaten und Indexstruktur anzupassen (Referenz Nr. 6~8). Um die Leistung zu verbessern, konzentriert sich die aktuelle Forschung auf Hardware-Beschleunigungstechnologien wie GPU, NPU, FPGA usw. (Referenz Nr. 9). Beschleunigungsspezifische Hardware und Chips unterscheiden sich jedoch im Architekturdesign, und das Problem der effizientesten Ausführung über verschiedene Hardwarebeschleuniger hinweg ist noch nicht gelöst.</p>
<ul>
<li><strong>Automatisierte Systemkonfiguration und -abstimmung</strong></li>
</ul>
<p>Die meisten bestehenden Studien über Vektorsuchalgorithmen suchen nach einem flexiblen Gleichgewicht zwischen Speicherkosten, Rechenleistung und Suchgenauigkeit. Im Allgemeinen beeinflussen sowohl Algorithmusparameter als auch Datenmerkmale die tatsächliche Leistung eines Algorithmus. Da sich die Anforderungen der Benutzer in Bezug auf Kosten und Leistung unterscheiden, stellt die Auswahl einer Vektorabfragemethode, die ihren Bedürfnissen und Datenmerkmalen entspricht, eine große Herausforderung dar.</p>
<p>Manuelle Methoden zur Analyse der Auswirkungen der Datenverteilung auf Suchalgorithmen sind jedoch aufgrund der hohen Dimensionalität der Vektordaten nicht effektiv. Um dieses Problem zu lösen, suchen Wissenschaft und Industrie nach Lösungen für Algorithmenempfehlungen, die auf maschinellem Lernen basieren (Referenz Nr. 10).</p>
<p>Die Entwicklung eines ML-gestützten intelligenten Vektorsuchalgorithmus ist ebenfalls ein Forschungsschwerpunkt. Im Allgemeinen sind die bestehenden Vektorsuchalgorithmen universell für Vektordaten mit unterschiedlicher Dimensionalität und Verteilungsmustern entwickelt worden. Infolgedessen unterstützen sie keine spezifischen Indexstrukturen entsprechend den Datenmerkmalen und bieten daher wenig Raum für Optimierungen. Zukünftige Studien sollten auch effektive Technologien des maschinellen Lernens erforschen, die Indexstrukturen für verschiedene Datenmerkmale maßschneidern können (Referenz Nr. 11-12).</p>
<ul>
<li><strong>Unterstützung für fortgeschrittene Abfragesemantiken</strong></li>
</ul>
<p>Moderne Anwendungen erfordern häufig fortgeschrittene Abfragen über Vektoren hinweg - die herkömmliche Semantik der Nearest Neighbour-Suche ist auf die Suche nach Vektordaten nicht mehr anwendbar. Darüber hinaus entsteht ein Bedarf an kombinierter Suche über mehrere Vektordatenbanken oder über Vektor- und Nicht-Vektordaten (Referenz Nr. 13).</p>
<p>Insbesondere die Variationen der Abstandsmetriken für Vektorähnlichkeit nehmen schnell zu. Herkömmliche Ähnlichkeitsmaße wie der euklidische Abstand, der Innenproduktabstand und der Kosinusabstand können nicht alle Anwendungsanforderungen erfüllen. Mit der Popularisierung der Technologie der künstlichen Intelligenz entwickeln viele Branchen ihre eigenen feldspezifischen Vektorähnlichkeitsmetriken, wie z. B. Tanimoto-Distanz, Mahalanobis-Distanz, Superstruktur und Substruktur. Die Integration dieser Bewertungsmetriken in bestehende Suchalgorithmen und die Entwicklung neuer Algorithmen, die diese Metriken nutzen, sind beides anspruchsvolle Forschungsprobleme.</p>
<p>Da die Komplexität der Benutzerdienste zunimmt, müssen die Anwendungen sowohl in Vektordaten als auch in Nicht-Vektordaten suchen. Beispielsweise analysiert ein Empfehlungsprogramm für Inhalte die Vorlieben und sozialen Beziehungen der Benutzer und gleicht sie mit aktuellen Themen ab, um den Benutzern geeignete Inhalte zu präsentieren. Solche Suchen beinhalten normalerweise Abfragen über mehrere Datentypen oder über mehrere Datenverarbeitungssysteme hinweg. Die effiziente und flexible Unterstützung solcher hybriden Suchen ist eine weitere Herausforderung für das Systemdesign.</p>
<h2 id="Authors" class="common-anchor-header">Autoren<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Dr. Rentong Guo (Ph.D. of Computer Software and Theory, Huazhong University of Science and Technology), Partner und F&amp;E Direktor von Zilliz. Er ist Mitglied des China Computer Federation Technical Committee on Distributed Computing and Processing (CCF TCDCP). Seine Forschungsschwerpunkte sind Datenbanken, verteilte Systeme, Caching-Systeme und heterogenes Computing. Seine Forschungsarbeiten wurden auf mehreren hochrangigen Konferenzen und in Fachzeitschriften veröffentlicht, darunter Usenix ATC, ICS, DATE und TPDS. Als Architekt von Milvus sucht Dr. Guo nach Lösungen für die Entwicklung hoch skalierbarer und kosteneffizienter KI-basierter Datenanalysesysteme.</p>
<p>Xiaofan Luan, Partner und technischer Leiter von Zilliz und Mitglied des technischen Beratungsausschusses der LF AI &amp; Data Foundation. Er arbeitete nacheinander in der US-Zentrale von Oracle und bei Hedvig, einem Software Defined Storage-Startup. Er trat dem Alibaba Cloud Database Team bei und war für die Entwicklung der NoSQL-Datenbanken HBase und Lindorm verantwortlich. Luan erwarb seinen Master-Abschluss in Electronic Computer Engineering an der Cornell University.</p>
<p>Dr. Xiaomeng Yi (Ph.D. of Computer Architecture, Huazhong University of Science and Technology), Senior Researcher und Leiter des Forschungsteams von Zilliz. Seine Forschung konzentriert sich auf die Verwaltung hochdimensionaler Daten, die Suche nach Informationen in großem Maßstab und die Ressourcenzuweisung in verteilten Systemen. Dr. Yis Forschungsarbeiten wurden in führenden Fachzeitschriften und auf internationalen Konferenzen veröffentlicht, darunter IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS und ACM TOMPECS.</p>
<p>Filip Haltmayer, ein Dateningenieur bei Zilliz, schloss sein Studium an der University of California, Santa Cruz mit einem BS in Informatik ab. Nachdem er zu Zilliz gekommen ist, verbringt Filip die meiste Zeit damit, an Cloud-Implementierungen, Kundeninteraktionen, technischen Gesprächen und der Entwicklung von KI-Anwendungen zu arbeiten.</p>
<h2 id="References" class="common-anchor-header">Referenzen<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Milvus-Projekt: https://github.com/milvus-io/milvus</li>
<li>Milvus: Ein zweckmäßiges Vektordaten-Management-System, SIGMOD'21</li>
<li>Faiss-Projekt: https://github.com/facebookresearch/faiss</li>
<li>Annoy Projekt: https://github.com/spotify/annoy</li>
<li>SPTAG-Projekt: https://github.com/microsoft/SPTAG</li>
<li>GRIP: Multi-Store Capacity-Optimized High-Performance Nearest Neighbor Search for Vector Search Engine, CIKM'19</li>
<li>DiskANN: Schnelle, genaue Milliarden-Punkt-Nächste-Nachbarn-Suche auf einem einzigen Knoten, NIPS'19</li>
<li>HM-ANN: Effiziente Milliarden-Punkte-Nächste-Nachbarn-Suche auf heterogenem Speicher, NIPS'20</li>
<li>SONG: Approximate Nearest Neighbor Search auf GPU, ICDE'20</li>
<li>Eine Demonstration des automatischen Datenbankverwaltungssystem-Tuningdienstes ottertune, VLDB'18</li>
<li>Der Fall für erlernte Index-Strukturen, SIGMOD'18</li>
<li>Verbesserung der Approximate Nearest Neighbor Search durch erlernte adaptive Frühbeendigung, SIGMOD'20</li>
<li>AnalyticDB-V: A Hybrid Analytical Engine Towards Query Fusion for Structured and Unstructured Data, VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Beteiligen Sie sich an unserer Open-Source-Community:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>Finden Sie Milvus auf <a href="https://bit.ly/3khejQB">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über das <a href="https://bit.ly/307HVsY">Forum</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
