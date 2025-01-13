---
id: Whats-Inside-Milvus-1.0.md
title: Was ist in Milvus 1.0 enthalten?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  Milvus v1.0 ist jetzt verfügbar. Erfahren Sie mehr über die Grundlagen von
  Milvus und die wichtigsten Funktionen von Milvus v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Was ist in Milvus 1.0 enthalten?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus ist eine Open-Source-Vektordatenbank, die für die Verwaltung riesiger Millionen-, Milliarden- oder sogar Billionen-Vektordatensätze entwickelt wurde. Milvus hat ein breites Anwendungsspektrum, das von der Entdeckung neuer Medikamente über Computer Vision und autonomes Fahren bis hin zu Empfehlungsmaschinen, Chatbots und vielem mehr reicht.</p>
<p>Im März 2021 veröffentlichte Zilliz, das Unternehmen hinter Milvus, die erste Version der Plattform mit Langzeitunterstützung - Milvus v1.0. Nach monatelangen, umfangreichen Tests ist eine stabile, produktionsreife Version der weltweit beliebtesten Vektordatenbank nun bereit für den Einsatz. Dieser Blog-Artikel behandelt einige Milvus-Grundlagen sowie die wichtigsten Funktionen von v1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Milvus-Distributionen</h3><p>Milvus ist in einer reinen CPU- und einer GPU-fähigen Distribution verfügbar. Erstere verlässt sich bei der Indexerstellung und der Suche ausschließlich auf die CPU; letztere ermöglicht eine hybride Suche und Indexerstellung mit CPU und GPU, die Milvus weiter beschleunigt. Bei der Hybrid-Distribution kann beispielsweise die CPU für die Suche und die GPU für die Indexerstellung verwendet werden, was die Abfrageeffizienz weiter verbessert.</p>
<p>Beide Milvus-Distributionen sind in Docker verfügbar. Sie können Milvus entweder aus Docker kompilieren (wenn Ihr Betriebssystem dies unterstützt) oder Milvus aus dem Quellcode unter Linux kompilieren (andere Betriebssysteme werden nicht unterstützt).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Vektoren einbetten</h3><p>Vektoren werden in Milvus als Entitäten gespeichert. Jede Entität hat ein Vektor-ID-Feld und ein Vektorfeld. Milvus v1.0 unterstützt nur ganzzahlige Vektor-IDs. Bei der Erstellung einer Sammlung in Milvus können die Vektor-IDs automatisch generiert oder manuell definiert werden. Milvus stellt sicher, dass automatisch generierte Vektor-IDs eindeutig sind, manuell definierte IDs können jedoch innerhalb von Milvus dupliziert werden. Wenn IDs manuell definiert werden, sind die Benutzer dafür verantwortlich, dass alle IDs eindeutig sind.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Partitionen</h3><p>Milvus unterstützt die Erstellung von Partitionen in einer Sammlung. In Situationen, in denen Daten regelmäßig eingefügt werden und historische Daten nicht von Bedeutung sind (z. B. Streaming-Daten), können Partitionen verwendet werden, um die Vektorähnlichkeitssuche zu beschleunigen. Eine Sammlung kann bis zu 4.096 Partitionen haben. Die Angabe einer Vektorsuche innerhalb einer bestimmten Partition schränkt die Suche ein und kann die Abfragezeit erheblich reduzieren, insbesondere bei Sammlungen, die mehr als eine Billion Vektoren enthalten.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Optimierungen des Indexalgorithmus</h3><p>Milvus baut auf mehreren weit verbreiteten Indexbibliotheken auf, darunter Faiss, NMSLIB und Annoy. Milvus ist weit mehr als ein einfacher Wrapper für diese Indexbibliotheken. Hier sind einige der wichtigsten Verbesserungen, die an den zugrunde liegenden Bibliotheken vorgenommen wurden:</p>
<ul>
<li>Optimierungen der IVF-Indexleistung unter Verwendung des Elkan k-means Algorithmus.</li>
<li>Optimierungen der FLAT-Suche.</li>
<li>Unterstützung von IVF_SQ8H-Hybridindizes, die die Größe von Indexdateien um bis zu 75 % reduzieren können, ohne die Datengenauigkeit zu beeinträchtigen. IVF_SQ8H baut auf IVF_SQ8 auf, mit identischem Recall, aber viel schnellerer Abfragegeschwindigkeit. Es wurde speziell für Milvus entwickelt, um die parallele Verarbeitungskapazität von GPUs und das Potenzial für Synergien zwischen CPU/GPU-Co-Processing zu nutzen.</li>
<li>Dynamische Befehlssatzkompatibilität.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Suche, Indexerstellung und andere Milvus-Optimierungen</h3><p>Die folgenden Optimierungen wurden an Milvus vorgenommen, um die Such- und Indexerstellungsleistung zu verbessern.</p>
<ul>
<li>Die Suchleistung wird in Situationen optimiert, in denen die Anzahl der Abfragen (nq) geringer ist als die Anzahl der CPU-Threads.</li>
<li>Milvus kombiniert Suchanfragen von einem Client, die die gleichen TopK- und Suchparameter verwenden.</li>
<li>Der Indexaufbau wird unterbrochen, wenn Suchanfragen eintreffen.</li>
<li>Milvus lädt Sammlungen beim Start automatisch in den Speicher vor.</li>
<li>Mehrere GPU-Geräte können zur Beschleunigung der Vektorähnlichkeitssuche zugewiesen werden.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Abstandsmetriken</h3><p>Milvus ist eine Vektordatenbank, die zur Unterstützung der vektoriellen Ähnlichkeitssuche entwickelt wurde. Die Plattform wurde mit Blick auf MLOps und KI-Anwendungen auf Produktionsebene entwickelt. Milvus unterstützt eine breite Palette von Abstandsmetriken zur Berechnung der Ähnlichkeit, z. B. den euklidischen Abstand (L2), das innere Produkt (IP), den Jaccard-Abstand, Tanimoto, Hamming-Abstand, Superstruktur und Substruktur. Die letzten beiden Metriken werden häufig bei der molekularen Suche und der KI-gestützten Entdeckung neuer Medikamente verwendet.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Protokollierung</h3><p>Milvus unterstützt Log-Rotation. In der Systemkonfigurationsdatei milvus.yaml können Sie die Größe einer einzelnen Protokolldatei, die Anzahl der Protokolldateien und die Protokollausgabe auf stdout festlegen.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Verteilte Lösung</h3><p>Mishards, eine Milvus Sharding-Middleware, ist die verteilte Lösung für Milvus. Mit einem Schreibknoten und einer unbegrenzten Anzahl von Leseknoten setzt Mishards das Rechenpotenzial von Serverclustern frei. Zu den Funktionen gehören die Weiterleitung von Anfragen, die Aufteilung von Lese- und Schreibvorgängen, dynamische/horizontale Skalierung und vieles mehr.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Überwachung</h3><p>Milvus ist kompatibel mit Prometheus, einem Open-Source-Toolkit zur Systemüberwachung und Alarmierung. Milvus fügt Unterstützung für Pushgateway in Prometheus hinzu, was es Prometheus ermöglicht, kurzlebige Batch-Metriken zu erfassen. Das Überwachungs- und Warnsystem funktioniert wie folgt:</p>
<ul>
<li>Der Milvus-Server sendet angepasste Metrikdaten an Pushgateway.</li>
<li>Pushgateway sorgt dafür, dass kurzlebige Metrikdaten sicher an Prometheus gesendet werden.</li>
<li>Prometheus holt sich weiterhin Daten von Pushgateway.</li>
<li>Alertmanager wird verwendet, um die Alarmschwelle für verschiedene Indikatoren festzulegen und Alarme per E-Mail oder Nachricht zu senden.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Verwaltung von Metadaten</h3><p>Milvus verwendet standardmäßig SQLite für die Verwaltung von Metadaten. SQLite ist in Milvus implementiert und muss nicht konfiguriert werden. In einer Produktionsumgebung wird empfohlen, MySQL für die Metadatenverwaltung zu verwenden.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Beteiligen Sie sich an unserer Open-Source-Community:</h3><ul>
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
