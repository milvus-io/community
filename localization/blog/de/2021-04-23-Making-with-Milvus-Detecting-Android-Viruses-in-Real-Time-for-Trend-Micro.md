---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: Mit Milvus Android-Viren in Echtzeit für Trend Micro aufspüren
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Erfahren Sie, wie Milvus eingesetzt wird, um Bedrohungen für wichtige Daten
  abzuschwächen und die Cybersicherheit durch Virenerkennung in Echtzeit zu
  verbessern.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Making with Milvus: Erkennung von Android-Viren in Echtzeit für Trend Micro</custom-h1><p>Die Cybersicherheit ist nach wie vor eine ständige Bedrohung für Privatpersonen und Unternehmen. Im Jahr 2020 werden <a href="https://www.getapp.com/resources/annual-data-security-report/">86 % der Unternehmen</a> Bedenken hinsichtlich des Datenschutzes haben und nur <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23 % der Verbraucher</a> glauben, dass ihre persönlichen Daten sehr sicher sind. Da Malware immer allgegenwärtiger und raffinierter wird, ist ein proaktiver Ansatz zur Erkennung von Bedrohungen unerlässlich geworden. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> ist ein weltweit führender Anbieter von Hybrid-Cloud-Sicherheit, Netzwerkschutz, Sicherheit für kleine Unternehmen und Endpunktsicherheit. Um Android-Geräte vor Viren zu schützen, hat das Unternehmen Trend Micro Mobile Security entwickelt - eine mobile App, die APKs (Android Application Package) aus dem Google Play Store mit einer Datenbank bekannter Malware vergleicht. Das Virenerkennungssystem funktioniert wie folgt:</p>
<ul>
<li>Externe APKs (Android-Anwendungspakete) aus dem Google Play Store werden gecrawlt.</li>
<li>Bekannte Malware wird in Vektoren umgewandelt und in <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a> gespeichert.</li>
<li>Neue APKs werden ebenfalls in Vektoren umgewandelt und dann mit der Malware-Datenbank mittels Ähnlichkeitssuche verglichen.</li>
<li>Wenn ein APK-Vektor einem der Malware-Vektoren ähnelt, liefert die App dem Nutzer detaillierte Informationen über den Virus und seine Bedrohungsstufe.</li>
</ul>
<p>Damit das System funktioniert, muss es eine hocheffiziente Ähnlichkeitssuche auf riesigen Vektordatensätzen in Echtzeit durchführen. Ursprünglich verwendete Trend Micro <a href="https://www.mysql.com/">MySQL</a>. Mit dem Wachstum des Unternehmens wuchs jedoch auch die Anzahl der APKs mit schädlichem Code, die in der Datenbank gespeichert waren. Das Algorithmusteam des Unternehmens begann mit der Suche nach alternativen Lösungen für die vektorielle Ähnlichkeitssuche, nachdem MySQL schnell überholt war.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Vergleich von Lösungen für die Vektorähnlichkeitssuche</h3><p>Es gibt eine Reihe von Lösungen für die vektorielle Ähnlichkeitssuche, von denen viele Open Source sind. Obwohl die Umstände von Projekt zu Projekt unterschiedlich sind, profitieren die meisten Benutzer von einer Vektordatenbank, die für die Verarbeitung und Analyse unstrukturierter Daten entwickelt wurde, und nicht von einer einfachen Bibliothek, die eine umfangreiche Konfiguration erfordert. Im Folgenden vergleichen wir einige beliebte Lösungen für die Suche nach Vektorähnlichkeit und erläutern, warum Trend Micro sich für Milvus entschieden hat.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> ist eine von Facebook AI Research entwickelte Bibliothek, die eine effiziente Ähnlichkeitssuche und Clustering von dichten Vektoren ermöglicht. Die darin enthaltenen Algorithmen durchsuchen Vektoren beliebiger Größe in Mengen. Faiss ist in C++ mit Wrappern für Python/numpy geschrieben und unterstützt eine Reihe von Indizes wie IndexFlatL2, IndexFlatIP, HNSW und IVF.</p>
<p>Obwohl Faiss ein unglaublich nützliches Werkzeug ist, hat es Grenzen. Es funktioniert nur als grundlegende Algorithmenbibliothek, nicht als Datenbank für die Verwaltung von Vektordatensätzen. Außerdem bietet es keine verteilte Version, keine Überwachungsdienste, keine SDKs und keine Hochverfügbarkeit, was die wichtigsten Merkmale der meisten Cloud-basierten Dienste sind.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-ins auf der Grundlage von Faiss und anderen ANN-Suchbibliotheken</h4><p>Es gibt mehrere Plug-ins, die auf Faiss, NMSLIB und anderen ANN-Suchbibliotheken aufbauen und dazu dienen, die grundlegende Funktionalität des zugrunde liegenden Werkzeugs zu erweitern, auf dem sie basieren. Elasticsearch (ES) ist eine Suchmaschine, die auf der Lucene-Bibliothek basiert und eine Reihe solcher Plugins enthält. Nachfolgend finden Sie ein Architekturdiagramm eines ES-Plug-ins:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Die eingebaute Unterstützung für verteilte Systeme ist ein großer Vorteil einer ES-Lösung. Dies spart Entwicklern Zeit und Unternehmen Geld, da kein Code geschrieben werden muss. ES-Plug-ins sind technisch fortgeschritten und weit verbreitet. Elasticsearch bietet eine QueryDSL (domänenspezifische Sprache), die Abfragen auf der Grundlage von JSON definiert und einfach zu verstehen ist. Ein vollständiger Satz von ES-Diensten ermöglicht die gleichzeitige Durchführung einer Vektor-/Textsuche und die Filterung skalarer Daten.</p>
<p>Amazon, Alibaba und Netease sind einige große Technologieunternehmen, die sich derzeit auf Elasticsearch-Plug-ins für die Vektorähnlichkeitssuche verlassen. Die Hauptnachteile dieser Lösung sind der hohe Speicherverbrauch und die fehlende Unterstützung für die Leistungsoptimierung. Im Gegensatz dazu hat <a href="http://jd.com/">JD.com</a> seine eigene verteilte Lösung auf der Grundlage von Faiss namens <a href="https://github.com/vearch/vearch">Vearch</a> entwickelt. Allerdings befindet sich Vearch noch in der Inkubationsphase und die Open-Source-Gemeinschaft ist relativ inaktiv.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> ist eine Open-Source-Vektordatenbank, die von <a href="https://zilliz.com">Zilliz</a> entwickelt wurde. Sie ist äußerst flexibel, zuverlässig und rasend schnell. Durch die Kapselung mehrerer weit verbreiteter Indexbibliotheken wie Faiss, NMSLIB und Annoy bietet Milvus einen umfassenden Satz intuitiver APIs, mit denen Entwickler den idealen Indextyp für ihr Szenario auswählen können. Außerdem bietet Milvus verteilte Lösungen und Überwachungsdienste. Milvus hat eine sehr aktive Open-Source-Community und über 5.5K Sterne auf <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus übertrifft die Konkurrenz</h4><p>Wir haben eine Reihe von Testergebnissen der verschiedenen oben genannten Lösungen für die Vektorähnlichkeitssuche zusammengestellt. Wie in der folgenden Vergleichstabelle zu sehen ist, war Milvus deutlich schneller als die Konkurrenz, obwohl es mit einem Datensatz von 1 Milliarde 128-dimensionalen Vektoren getestet wurde.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Motor</strong></th><th style="text-align:left"><strong>Leistung (ms)</strong></th><th style="text-align:left"><strong>Datensatzgröße (Millionen)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Nicht gut</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Ein Vergleich der Lösungen für die vektorielle Ähnlichkeitssuche.</em></h6><p>Nach Abwägung der Vor- und Nachteile der einzelnen Lösungen entschied sich Trend Micro für Milvus für sein Vektorabrufmodell. Aufgrund der außergewöhnlichen Leistung bei riesigen, milliardenschweren Datensätzen liegt es auf der Hand, warum das Unternehmen Milvus für einen mobilen Sicherheitsdienst gewählt hat, der eine Vektorähnlichkeitssuche in Echtzeit erfordert.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Entwicklung eines Systems zur Virenerkennung in Echtzeit</h3><p>Trend Micro hat mehr als 10 Millionen bösartige APKs in seiner MySQL-Datenbank gespeichert, und jeden Tag kommen 100 000 neue APKs hinzu. Das System extrahiert und berechnet die Thash-Werte verschiedener Komponenten einer APK-Datei und verwendet dann den Sha256-Algorithmus, um sie in Binärdateien umzuwandeln und 256-Bit-Sha256-Werte zu erzeugen, die die APK von anderen unterscheiden. Da Sha256-Werte bei APK-Dateien variieren, kann eine APK einen kombinierten Thash-Wert und einen eindeutigen Sha256-Wert haben.</p>
<p>Sha256-Werte werden nur zur Unterscheidung von APKs verwendet, und Thash-Werte werden für die Suche nach Vektorähnlichkeit verwendet. Ähnliche APKs können die gleichen Thash-Werte, aber unterschiedliche Sha256-Werte haben.</p>
<p>Um APKs mit schadhaftem Code zu erkennen, hat Trend Micro ein eigenes System entwickelt, um ähnliche Thash-Werte und entsprechende Sha256-Werte zu ermitteln. Trend Micro entschied sich für Milvus, um eine sofortige Vektorähnlichkeitssuche in umfangreichen Vektordatensätzen durchzuführen, die aus Thash-Werten konvertiert wurden. Nachdem die Ähnlichkeitssuche durchgeführt wurde, werden die entsprechenden Sha256-Werte in MySQL abgefragt. Eine Redis-Zwischenspeicherschicht ist ebenfalls in die Architektur integriert, um Thash-Werte auf Sha256-Werte abzubilden, was die Abfragezeit erheblich verkürzt.</p>
<p>Nachstehend finden Sie das Architekturdiagramm des mobilen Sicherheitssystems von Trend Micro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>Die Wahl einer geeigneten Abstandsmetrik trägt zur Verbesserung der Vektorklassifizierungs- und Clustering-Leistung bei. Die folgende Tabelle zeigt die <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">Abstandsmetriken</a> und die entsprechenden Indizes, die mit binären Vektoren arbeiten.</p>
<table>
<thead>
<tr><th><strong>Abstandsmetrik</strong></th><th><strong>Index-Typen</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- FLACH <br/> - IVF_FLACH</td></tr>
<tr><td>- Überstruktur <br/> - Unterstruktur</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Abstandsmetriken und Indizes für binäre Vektoren.</em></h6><p><br/></p>
<p>Trend Micro konvertiert Thash-Werte in binäre Vektoren und speichert sie in Milvus. Für dieses Szenario verwendet Trend Micro die Hamming-Distanz zum Vergleich von Vektoren.</p>
<p>Milvus wird bald String-Vektor-IDs unterstützen, und Integer-IDs müssen nicht mehr auf den entsprechenden Namen im String-Format abgebildet werden. Dadurch wird die Redis-Zwischenspeicherschicht überflüssig und die Systemarchitektur weniger sperrig.</p>
<p>Trend Micro setzt auf eine Cloud-basierte Lösung und stellt viele Aufgaben auf <a href="https://kubernetes.io/">Kubernetes</a> bereit. Um Hochverfügbarkeit zu erreichen, setzt Trend Micro <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a> ein, eine in Python entwickelte Milvus-Cluster-Sharding-Middleware.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro trennt Speicherung und Abstandsberechnung, indem es alle Vektoren im von <a href="https://aws.amazon.com/">AWS</a> bereitgestellten <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) speichert. Diese Praxis ist ein beliebter Trend in der Branche. Kubernetes wird verwendet, um mehrere Leseknoten zu starten, und entwickelt LoadBalancer-Dienste auf diesen Leseknoten, um eine hohe Verfügbarkeit zu gewährleisten.</p>
<p>Zur Wahrung der Datenkonsistenz unterstützt Mishards nur einen Schreibknoten. Eine verteilte Version von Milvus mit Unterstützung für mehrere Schreibknoten wird jedoch in den kommenden Monaten verfügbar sein.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Überwachungs- und Warnfunktionen</h3><p>Milvus ist kompatibel mit Überwachungssystemen, die auf <a href="https://prometheus.io/">Prometheus</a> aufbauen, und verwendet <a href="https://grafana.com/">Grafana</a>, eine Open-Source-Plattform für Zeitreihenanalysen, um verschiedene Leistungsmetriken zu visualisieren.</p>
<p>Prometheus überwacht und speichert die folgenden Metriken:</p>
<ul>
<li>Milvus-Leistungsmetriken, einschließlich Einfügegeschwindigkeit, Abfragegeschwindigkeit und Milvus-Betriebszeit.</li>
<li>Systemleistungsmetriken, einschließlich CPU/GPU-Nutzung, Netzwerkverkehr und Festplattenzugriffsgeschwindigkeit.</li>
<li>Metriken zum Hardwarespeicher, einschließlich Datengröße und Gesamtanzahl der Dateien.</li>
</ul>
<p>Das Überwachungs- und Warnsystem funktioniert wie folgt:</p>
<ul>
<li>Ein Milvus-Client sendet angepasste Metrikdaten an Pushgateway.</li>
<li>Das Pushgateway sorgt dafür, dass kurzlebige, flüchtige Metrikdaten sicher an Prometheus gesendet werden.</li>
<li>Prometheus ruft weiterhin Daten von Pushgateway ab.</li>
<li>Der Alertmanager legt die Alarmschwelle für verschiedene Metriken fest und löst Alarme per E-Mail oder Nachricht aus.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Systemleistung</h3><p>Seit dem Start des auf Milvus basierenden ThashSearch-Dienstes sind ein paar Monate vergangen. Die Grafik unten zeigt, dass die End-to-End-Abfrage-Latenz weniger als 95 Millisekunden beträgt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>Auch das Einfügen ist schnell. Es dauert etwa 10 Sekunden, um 3 Millionen 192-dimensionale Vektoren einzufügen. Mit Hilfe von Milvus konnte die Systemleistung die von Trend Micro festgelegten Leistungskriterien erfüllen.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Seien Sie kein Unbekannter</h3><ul>
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
