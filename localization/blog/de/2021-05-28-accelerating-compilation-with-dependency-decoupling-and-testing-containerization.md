---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  2,5-fache Beschleunigung der Kompilierung durch Entkopplung von Abhängigkeiten
  und Containerisierung von Tests
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Entdecken Sie, wie zilliz die Kompilierzeiten mithilfe von Techniken zur
  Entkopplung von Abhängigkeiten und Containerisierung für große KI- und
  MLOps-Projekte um das 2,5-fache reduzieren kann.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>2,5-fache Beschleunigung der Kompilierung mit Dependency Decoupling &amp; Testing Containerization</custom-h1><p>Die Kompilierungszeit kann durch komplexe interne und externe Abhängigkeiten, die sich im Laufe des Entwicklungsprozesses entwickeln, sowie durch Änderungen in den Kompilierungsumgebungen, wie z. B. dem Betriebssystem oder den Hardwarearchitekturen, verlängert werden. Die folgenden Probleme können bei der Arbeit an großen KI- oder MLOps-Projekten häufig auftreten:</p>
<p><strong>Langwierige Kompilierung</strong> - Die Code-Integration wird jeden Tag Hunderte Male durchgeführt. Bei Hunderttausenden von Codezeilen kann selbst eine kleine Änderung zu einer vollständigen Kompilierung führen, die normalerweise eine oder mehrere Stunden dauert.</p>
<p><strong>Komplexe Kompilierungsumgebung</strong> - Der Projektcode muss unter verschiedenen Umgebungen kompiliert werden, die unterschiedliche Betriebssysteme (z. B. CentOS und Ubuntu), zugrunde liegende Abhängigkeiten (z. B. GCC, LLVM und CUDA) und Hardwarearchitekturen umfassen. Und die Kompilierung unter einer bestimmten Umgebung funktioniert normalerweise nicht unter einer anderen Umgebung.</p>
<p><strong>Komplexe Abhängigkeiten</strong> - Die Projektkompilierung umfasst mehr als 30 Abhängigkeiten zwischen Komponenten und von Dritten. Die Projektentwicklung führt häufig zu Änderungen in den Abhängigkeiten, was unweigerlich zu Abhängigkeitskonflikten führt. Die Versionskontrolle zwischen den Abhängigkeiten ist so komplex, dass sich eine Versionsaktualisierung von Abhängigkeiten leicht auf andere Komponenten auswirken kann.</p>
<p><strong>Der Download von Abhängigkeiten von Drittanbietern ist langsam oder schlägt fehl</strong> - Netzwerkverzögerungen oder instabile Bibliotheken von Drittanbietern führen zu langsamen Ressourcendownloads oder Zugriffsfehlern, was die Code-Integration erheblich beeinträchtigt.</p>
<p>Durch die Entkopplung von Abhängigkeiten und die Implementierung von Testcontainern ist es uns gelungen, die durchschnittliche Kompilierzeit um 60 % zu senken, während wir an dem Open-Source-Projekt <a href="https://milvus.io/">Milvus</a> zur Ähnlichkeitssuche von Embeddings gearbeitet haben.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Entkoppeln Sie die Abhängigkeiten des Projekts</h3><p>Die Kompilierung eines Projekts umfasst in der Regel eine große Anzahl von internen und externen Komponentenabhängigkeiten. Je mehr Abhängigkeiten ein Projekt hat, desto komplexer wird es, diese zu verwalten. Je größer die Software wird, desto schwieriger und kostspieliger wird es, die Abhängigkeiten zu ändern oder zu entfernen und die Auswirkungen dieser Änderungen zu ermitteln. Während des gesamten Entwicklungsprozesses ist eine regelmäßige Wartung erforderlich, um sicherzustellen, dass die Abhängigkeiten ordnungsgemäß funktionieren. Schlechte Wartung, komplexe Abhängigkeiten oder fehlerhafte Abhängigkeiten können Konflikte verursachen, die die Entwicklung verlangsamen oder zum Stillstand bringen. In der Praxis kann dies zu verzögerten Ressourcen-Downloads, Zugriffsfehlern, die sich negativ auf die Code-Integration auswirken, und vielem mehr führen. Die Entkopplung von Projektabhängigkeiten kann Defekte abmildern und die Kompilierzeit verkürzen, wodurch Systemtests beschleunigt und die Softwareentwicklung nicht unnötig verlangsamt wird.</p>
<p>Daher empfehlen wir, die Abhängigkeiten in Ihrem Projekt zu entkoppeln:</p>
<ul>
<li>Teilen Sie Komponenten mit komplexen Abhängigkeiten auf</li>
<li>Verwenden Sie verschiedene Repositories für die Versionsverwaltung.</li>
<li>Verwenden Sie Konfigurationsdateien zur Verwaltung von Versionsinformationen, Kompilierungsoptionen, Abhängigkeiten usw.</li>
<li>Fügen Sie die Konfigurationsdateien zu den Komponentenbibliotheken hinzu, damit sie bei der Iteration des Projekts aktualisiert werden.</li>
</ul>
<p><strong>Kompilierungsoptimierung zwischen Komponenten</strong> - Ziehen und kompilieren Sie die entsprechende Komponente entsprechend den Abhängigkeiten und den in den Konfigurationsdateien aufgezeichneten Kompilierungsoptionen. Markieren und verpacken Sie die Ergebnisse der Binärkompilierung und die entsprechenden Manifestdateien und laden Sie sie anschließend in Ihr privates Repository hoch. Wenn an einer Komponente oder den Komponenten, von denen sie abhängt, keine Änderungen vorgenommen werden, geben Sie die Kompilierungsergebnisse gemäß den Manifestdateien wieder. Bei Problemen wie Netzwerkverzögerungen oder instabilen Bibliotheken von Drittanbietern sollten Sie versuchen, ein internes Repository einzurichten oder gespiegelte Repositories zu verwenden.</p>
<p>Um die Kompilierung zwischen Komponenten zu optimieren:</p>
<p>1. erstellen Sie einen Abhängigkeitsbeziehungsgraphen - Verwenden Sie die Konfigurationsdateien in den Komponentenbibliotheken, um einen Abhängigkeitsbeziehungsgraphen zu erstellen. Verwenden Sie die Abhängigkeitsbeziehung, um die Versionsinformationen (Git Branch, Tag und Git Commit ID) und die Kompilierungsoptionen und mehr von sowohl Upstream- als auch Downstream-abhängigen Komponenten abzurufen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>.check for dependencies</strong> - Generieren Sie Warnungen für zirkuläre Abhängigkeiten, Versionskonflikte und andere Probleme, die zwischen Komponenten auftreten.</p>
<p>3<strong>.flatten dependencies</strong> - Sortieren Sie Abhängigkeiten nach Depth First Search (DFS) und fassen Sie Komponenten mit doppelten Abhängigkeiten zu einem Abhängigkeitsdiagramm zusammen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4.verwenden Sie den MerkleTree-Algorithmus, um einen Hash (Root Hash) zu generieren, der die Abhängigkeiten jeder Komponente auf der Grundlage von Versionsinformationen, Kompilierungsoptionen und mehr enthält. In Kombination mit Informationen wie dem Komponentennamen bildet der Algorithmus ein eindeutiges Tag für jede Komponente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Auf der Grundlage der eindeutigen Tag-Informationen der Komponente wird geprüft, ob ein entsprechendes Kompilierungsarchiv in der privaten Repo existiert. Wenn ein Kompilierungsarchiv abgerufen wird, entpacken Sie es, um die Manifestdatei für die Wiedergabe zu erhalten; wenn nicht, kompilieren Sie die Komponente, markieren Sie die generierten Kompilierungsobjektdateien und die Manifestdatei und laden Sie sie in die private Repo hoch.</p>
<p><br/></p>
<p><strong>Implementieren Sie Kompilierungsoptimierungen innerhalb von Komponenten</strong> - Wählen Sie ein sprachspezifisches Kompilierungs-Cache-Tool, um die kompilierten Objektdateien zwischenzuspeichern, und laden Sie sie in Ihr privates Repository hoch und speichern Sie sie dort. Wählen Sie für die C/C++-Kompilierung ein Kompilierungs-Cache-Tool wie CCache, um die C/C++-Kompilierungs-Zwischendateien zwischenzuspeichern, und archivieren Sie dann den lokalen CCache-Cache nach der Kompilierung. Solche Kompilier-Cache-Tools zwischenspeichern einfach die geänderten Codedateien eine nach der anderen nach der Kompilierung und kopieren die kompilierten Komponenten der unveränderten Codedatei, damit sie direkt in die endgültige Kompilierung einbezogen werden können. Die Optimierung der Kompilierung innerhalb der Komponenten umfasst die folgenden Schritte:</p>
<ol>
<li>Hinzufügen der erforderlichen Kompilierungsabhängigkeiten zum Dockerfile. Verwenden Sie Hadolint, um Konformitätsprüfungen an Dockerfile durchzuführen, um sicherzustellen, dass das Image den Best Practices von Docker entspricht.</li>
<li>Spiegeln Sie die Kompilierungsumgebung entsprechend der Projekt-Sprint-Version (Version + Build), des Betriebssystems und anderer Informationen.</li>
<li>Führen Sie den gespiegelten Kompilierungsumgebungs-Container aus und übertragen Sie die Image-ID als Umgebungsvariable an den Container. Hier ein Beispielbefehl zum Abrufen der Image-ID: "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Wählen Sie das entsprechende Compile-Cache-Tool: Geben Sie Ihren Containter ein, um Ihre Codes zu integrieren und zu kompilieren, und prüfen Sie in Ihrem privaten Repository, ob ein geeigneter Kompilier-Cache vorhanden ist. Wenn ja, laden Sie ihn herunter und entpacken Sie ihn in das angegebene Verzeichnis. Nachdem alle Komponenten kompiliert wurden, wird der vom Kompilier-Cache-Tool generierte Cache verpackt und in Ihr privates Repository hochgeladen, basierend auf der Projektversion und der Image-ID.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Weitere Optimierung der Kompilierung</h3><p>Da unsere ursprüngliche Version zu viel Speicherplatz und Netzwerkbandbreite beansprucht und die Bereitstellung sehr lange dauert, haben wir die folgenden Maßnahmen ergriffen:</p>
<ol>
<li>Wählen Sie das schlankste Basis-Image, um die Image-Größe zu reduzieren, z.B. Alpine, Busybox, etc.</li>
<li>Reduzieren Sie die Anzahl der Bildschichten. Wiederverwendung von Abhängigkeiten so weit wie möglich. Führen Sie mehrere Befehle mit "&amp;&amp;" zusammen.</li>
<li>Bereinigen Sie die Zwischenprodukte bei der Bilderstellung.</li>
<li>Verwenden Sie den Image-Cache, um das Image so weit wie möglich zu erstellen.</li>
</ol>
<p>Mit dem Fortschreiten unseres Projekts stiegen die Festplattennutzung und die Netzwerkressourcen an, da der Kompilierungscache zunahm, während einige der Kompilierungscaches nicht ausgelastet waren. Wir haben daraufhin die folgenden Anpassungen vorgenommen:</p>
<p><strong>Regelmäßiges Bereinigen von Cache-Dateien</strong> - Überprüfen Sie regelmäßig das private Repository (z. B. mithilfe von Skripten) und bereinigen Sie Cache-Dateien, die sich seit einiger Zeit nicht mehr geändert haben oder die nicht häufig heruntergeladen wurden.</p>
<p><strong>Selektives Zwischenspeichern von Kompilaten</strong> - Zwischenspeichern Sie nur ressourcenintensive Kompilate und überspringen Sie das Zwischenspeichern von Kompilaten, die nicht viele Ressourcen benötigen.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Nutzung von Containertests zur Reduzierung von Fehlern, Verbesserung der Stabilität und Zuverlässigkeit</h3><p>Codes müssen in verschiedenen Umgebungen kompiliert werden, die eine Vielzahl von Betriebssystemen (z. B. CentOS und Ubuntu), zugrundeliegende Abhängigkeiten (z. B. GCC, LLVM und CUDA) und spezifische Hardwarearchitekturen umfassen. Code, der in einer bestimmten Umgebung erfolgreich kompiliert wurde, schlägt in einer anderen Umgebung fehl. Durch die Ausführung von Tests in Containern wird der Testprozess schneller und genauer.</p>
<p>Die Containerisierung stellt sicher, dass die Testumgebung konsistent ist und eine Anwendung wie erwartet funktioniert. Der containerisierte Testansatz verpackt die Tests als Image-Container und baut eine wirklich isolierte Testumgebung auf. Unsere Tester fanden diesen Ansatz sehr nützlich und konnten die Kompilierzeiten um bis zu 60 % reduzieren.</p>
<p><strong>Sicherstellung einer konsistenten Kompilierumgebung</strong> - Da die kompilierten Produkte empfindlich auf Änderungen in der Systemumgebung reagieren, können auf verschiedenen Betriebssystemen unbekannte Fehler auftreten. Wir müssen den Zwischenspeicher der kompilierten Produkte entsprechend den Änderungen in der Kompilierumgebung kennzeichnen und archivieren, aber diese sind schwer zu kategorisieren. Daher haben wir die Containerisierungstechnologie eingeführt, um die Kompilierumgebung zu vereinheitlichen und solche Probleme zu lösen.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Schlussfolgerung</h3><p>Durch die Analyse der Projektabhängigkeiten werden in diesem Artikel verschiedene Methoden zur Optimierung der Kompilierung zwischen und innerhalb von Komponenten vorgestellt. Dabei werden Ideen und bewährte Verfahren für den Aufbau einer stabilen und effizienten kontinuierlichen Code-Integration vermittelt. Diese Methoden haben dazu beigetragen, die durch komplexe Abhängigkeiten verursachte langsame Code-Integration zu lösen, Operationen innerhalb des Containers zu vereinheitlichen, um die Konsistenz der Umgebung zu gewährleisten, und die Kompilierungseffizienz durch die Wiedergabe der Kompilierungsergebnisse und die Verwendung von Kompilierungs-Cache-Tools zum Zwischenspeichern der Kompilierungszwischenergebnisse zu verbessern.</p>
<p>Durch diese Maßnahmen konnte die Kompilierzeit des Projekts um durchschnittlich 60 % reduziert werden, was die Gesamteffizienz der Code-Integration erheblich verbessert. In Zukunft werden wir die Kompilierung zwischen und innerhalb von Komponenten weiter parallelisieren, um die Kompilierungszeiten weiter zu reduzieren.</p>
<p><br/></p>
<p><em>Die folgenden Quellen wurden für diesen Artikel verwendet:</em></p>
<ul>
<li>"Entkopplung von Quellbäumen in Komponenten auf Build-Ebene"</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Faktoren, die beim Hinzufügen von Abhängigkeiten von Drittanbietern zu einem Projekt zu berücksichtigen sind</a>"</li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Überleben von Software-Abhängigkeiten</a>"</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Abhängigkeiten verstehen: Eine Studie über die Koordinationsherausforderungen in der Softwareentwicklung</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">Über den Autor</h3><p>Zhifeng Zhang ist ein leitender DevOps-Ingenieur bei Zilliz.com, der an Milvus, einer Open-Source-Vektordatenbank, arbeitet, und autorisierter Dozent der LF Open-Source-Software-Universität in China. Er erhielt seinen Bachelor-Abschluss in Internet of Things (IOT) vom Software Engineering Institute of Guangzhou. Er verbringt seine Karriere mit der Teilnahme an und der Leitung von Projekten in den Bereichen CI/CD, DevOps, IT-Infrastrukturmanagement, Cloud-Native-Toolkit, Containerisierung und Optimierung von Kompilierungsprozessen.</p>
