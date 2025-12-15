---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  Zusammenführung von raumbezogener Filterung und Vektorsuche mit
  Geometriefeldern und RTREE in Milvus 2.6
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  Erfahren Sie, wie Milvus 2.6 mit Hilfe von Geometriefeldern und dem
  RTREE-Index die Vektorsuche mit der raumbezogenen Indizierung vereint und so
  eine präzise, ortsbezogene KI-Suche ermöglicht.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>Mit der zunehmenden Anwendung von KI-Systemen für die Entscheidungsfindung in Echtzeit werden Geodaten in einer wachsenden Zahl von Anwendungen immer wichtiger - insbesondere in solchen, die in der realen Welt operieren oder Nutzer an realen Orten bedienen.</p>
<p>Man denke nur an Plattformen für Essenslieferungen wie DoorDash oder Uber Eats. Wenn ein Benutzer eine Bestellung aufgibt, berechnet das System nicht nur die kürzeste Entfernung zwischen zwei Punkten. Es bewertet die Qualität des Restaurants, die Verfügbarkeit des Kuriers, die aktuellen Verkehrsbedingungen, die Servicegebiete und zunehmend auch die Einbettung von Benutzern und Artikeln, die persönliche Vorlieben darstellen. In ähnlicher Weise müssen autonome Fahrzeuge Pfadplanung, Hinderniserkennung und semantisches Verständnis auf Szenenebene unter strengen Latenzvorgaben durchführen - oft innerhalb von Millisekunden. In diesen Bereichen hängen effektive Entscheidungen davon ab, dass räumliche Beschränkungen mit semantischer Ähnlichkeit kombiniert werden, anstatt sie als unabhängige Schritte zu behandeln.</p>
<p>Auf der Datenebene wurden räumliche und semantische Daten jedoch traditionell von getrennten Systemen verarbeitet.</p>
<ul>
<li><p>Geodatenbanken und räumliche Erweiterungen sind für die Speicherung von Koordinaten, Polygonen und räumlichen Beziehungen, wie z. B. Einschluss oder Entfernung, konzipiert.</p></li>
<li><p>Vektordatenbanken verarbeiten Vektoreinbettungen, die die semantische Bedeutung der Daten darstellen.</p></li>
</ul>
<p>Wenn Anwendungen beides benötigen, sind sie oft zu mehrstufigen Abfragepipelines gezwungen - Filterung nach Standort in einem System, dann Durchführung einer Vektorsuche in einem anderen. Diese Trennung erhöht die Systemkomplexität, verlängert die Abfragelatenz und erschwert die effiziente Durchführung räumlich-semantischer Schlussfolgerungen in großem Maßstab.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> behebt dieses Problem durch die Einführung des <a href="https://milvus.io/docs/geometry-field.md">Geometry Field</a>, das die direkte Kombination von Vektorähnlichkeitssuche und räumlichen Einschränkungen ermöglicht. Dies ermöglicht Anwendungsfälle wie zum Beispiel:</p>
<ul>
<li><p>Location-Base Service (LBS): "Finde ähnliche POIs innerhalb dieses Stadtblocks"</p></li>
<li><p>Multimodale Suche: "Finde ähnliche Fotos im Umkreis von 1 km von diesem Punkt".</p></li>
<li><p>Karten und Logistik: "Anlagen innerhalb einer Region" oder "Routen, die einen Weg kreuzen"</p></li>
</ul>
<p>In Verbindung mit dem neuen <a href="https://milvus.io/docs/rtree.md">RTREE-Index - einer</a>baumbasierten Struktur, die für die räumliche Filterung optimiert ist - unterstützt Milvus jetzt neben der hochdimensionalen Vektorsuche auch effiziente räumliche Operatoren wie <code translate="no">st_contains</code>, <code translate="no">st_within</code> und <code translate="no">st_dwithin</code>. Zusammen machen sie raumbezogenes intelligentes Retrieval nicht nur möglich, sondern praktisch.</p>
<p>In diesem Beitrag wird erläutert, wie das Geometriefeld und der RTREE-Index funktionieren und wie sie mit der Vektorähnlichkeitssuche kombiniert werden, um reale, räumlich-semantische Anwendungen zu ermöglichen.</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">Was ist ein Geometriefeld in Milvus?<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein <strong>Geometriefeld</strong> ist ein schema-definierter Datentyp (<code translate="no">DataType.GEOMETRY</code>) in Milvus, der zur Speicherung geometrischer Daten verwendet wird. Im Gegensatz zu Systemen, die nur Rohkoordinaten verarbeiten, unterstützt Milvus eine Reihe von räumlichen Strukturen, darunter <strong>Point</strong>, <strong>LineString</strong> und <strong>Polygon</strong>.</p>
<p>Dadurch ist es möglich, reale Konzepte wie Restaurantstandorte (Point), Lieferzonen (Polygon) oder Flugbahnen autonomer Fahrzeuge (LineString) in derselben Datenbank darzustellen, die auch semantische Vektoren speichert. Mit anderen Worten: Milvus wird zu einem einheitlichen System, das sowohl den <em>Ort</em> als auch die <em>Bedeutung</em> eines Objekts erfasst.</p>
<p>Geometriewerte werden im <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a> -Format gespeichert, einem für Menschen lesbaren Standard für das Einfügen und Abfragen geometrischer Daten. Dies vereinfacht die Dateneingabe und -abfrage, da WKT-Strings direkt in einen Milvus-Datensatz eingefügt werden können. Zum Beispiel:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">Was ist der RTREE-Index und wie funktioniert er?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald Milvus den Datentyp Geometrie einführt, benötigt es auch eine effiziente Möglichkeit, räumliche Objekte zu filtern. Milvus handhabt dies mit einer zweistufigen räumlichen Filterpipeline:</p>
<ul>
<li><p><strong>Grobfilterung:</strong> Schnelles Eingrenzen der Kandidaten mit Hilfe von räumlichen Indizes wie RTREE.</p></li>
<li><p><strong>Feines Filtern:</strong> Wendet exakte Geometrieprüfungen auf die verbleibenden Kandidaten an, um die Korrektheit an den Grenzen zu gewährleisten.</p></li>
</ul>
<p>Dieses Design stellt ein Gleichgewicht zwischen Leistung und Genauigkeit her. Der räumliche Index entfernt aggressiv irrelevante Daten, während präzise geometrische Prüfungen korrekte Ergebnisse für Operatoren wie Einschluss, Schnittpunkt und Abstandsschwellenwerte sicherstellen.</p>
<p>Das Herzstück dieser Pipeline ist <strong>RTREE (Rectangle Tree)</strong>, eine räumliche Indexierungsstruktur, die zur Beschleunigung von Abfragen über geometrische Daten entwickelt wurde. RTREE organisiert Objekte hierarchisch mit Hilfe von <strong>Minimum Bounding Rectangles (MBRs)</strong>, wodurch große Teile des Suchraums bei der Ausführung von Abfragen übersprungen werden können.</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">Phase 1: Aufbau des RTREE-Index</h3><p>Die RTREE-Konstruktion folgt einem Bottom-up-Prozess, bei dem nahegelegene räumliche Objekte in zunehmend größeren Begrenzungsbereichen gruppiert werden:</p>
<p><strong>1. Erstellen von Blattknoten:</strong> Berechnen Sie für jedes Geometrieobjekt sein <strong>Minimum Bounding Rectangle (MBR)</strong>- das kleinste Rechteck, das das Objekt vollständig enthält - und speichern Sie es als Blattknoten.</p>
<p><strong>2. Gruppieren in größere Boxen:</strong> Gruppieren Sie nahe gelegene Blattknoten und umhüllen Sie jede Gruppe mit einem neuen MBR, wodurch interne Knoten entstehen.</p>
<p><strong>3. Hinzufügen des Wurzelknotens:</strong> Erstellen Sie einen Wurzelknoten, dessen MBR alle internen Gruppen umfasst, und bilden Sie so eine höhenbalancierte Baumstruktur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Phase 2: Abfragen beschleunigen</strong></p>
<p><strong>1. Bilden Sie den Abfrage-MBR:</strong> Berechnen Sie den MBR für die in Ihrer Abfrage verwendete Geometrie.</p>
<p><strong>2. Beschneiden der Zweige:</strong> Vergleichen Sie, ausgehend von der Wurzel, den Abfrage-MBR mit jedem internen Knoten. Überspringen Sie jeden Zweig, dessen MBR sich nicht mit dem MBR der Abfrage schneidet.</p>
<p><strong>3. Kandidaten sammeln:</strong> Steigen Sie in die sich schneidenden Zweige hinab und sammeln Sie die Kandidaten-Blattknoten.</p>
<p><strong>4. Exaktes Matching durchführen:</strong> Für jeden Kandidaten das räumliche Prädikat ausführen, um genaue Ergebnisse zu erhalten.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Warum RTREE schnell ist</h3><p>RTREE bietet eine hohe Leistung bei der räumlichen Filterung aufgrund mehrerer wichtiger Konstruktionsmerkmale:</p>
<ul>
<li><p><strong>Jeder Knoten speichert einen MBR:</strong> Jeder Knoten approximiert die Fläche aller Geometrien in seinem Teilbaum. Dadurch lässt sich leicht entscheiden, ob ein Zweig während einer Abfrage untersucht werden sollte.</p></li>
<li><p><strong>Schnelles Pruning:</strong> Nur Teilbäume, deren MBR die Abfrageregion schneidet, werden durchsucht. Irrelevante Bereiche werden komplett ignoriert.</p></li>
<li><p><strong>Skaliert mit der Datengröße:</strong> RTREE unterstützt räumliche Suchvorgänge in <strong>O(log N)-Zeit</strong> und ermöglicht so schnelle Abfragen, auch wenn der Datensatz größer wird.</p></li>
<li><p><strong>Boost.Geometry-Implementierung:</strong> Milvus baut seinen RTREE-Index mit <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a> auf, einer weit verbreiteten C++-Bibliothek, die optimierte Geometriealgorithmen und eine thread-sichere RTREE-Implementierung für gleichzeitige Arbeitslasten bietet.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Unterstützte Geometrieoperatoren</h3><p>Milvus bietet eine Reihe von räumlichen Operatoren, mit denen Sie Entitäten auf der Grundlage geometrischer Beziehungen filtern und abrufen können. Diese Operatoren sind unerlässlich für Workloads, die verstehen müssen, wie sich Objekte im Raum zueinander verhalten.</p>
<p>In der folgenden Tabelle sind die derzeit in Milvus verfügbaren <a href="https://milvus.io/docs/geometry-operators.md">Geometrieoperatoren</a> aufgeführt.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operator</strong></th><th style="text-align:center"><strong>Beschreibung</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn die Geometrien A und B mindestens einen gemeinsamen Punkt haben.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn die Geometrie A die Geometrie B vollständig enthält (mit Ausnahme des Randes).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn die Geometrie A vollständig in der Geometrie B enthalten ist. Dies ist die Umkehrung von st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn die Geometrie A die Geometrie B bedeckt (einschließlich der Begrenzung).</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn sich die Geometrien A und B an ihren Grenzen berühren, sich aber intern nicht schneiden.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn die Geometrien A und B räumlich identisch sind.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn sich die Geometrien A und B teilweise überlappen und keine die andere vollständig enthält.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Gibt TRUE zurück, wenn der Abstand zwischen A und B kleiner als <em>d</em> ist.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Kombinieren von Geolokalisierungsindex und Vektorindex</h3><p>Mit der Geometrieunterstützung und dem RTREE-Index kann Milvus die räumliche Filterung mit der vektoriellen Ähnlichkeitssuche in einem einzigen Arbeitsablauf kombinieren. Der Prozess läuft in zwei Schritten ab:</p>
<p><strong>1. Filtern nach Standort mit RTREE:</strong> Milvus verwendet zunächst den RTREE-Index, um die Suche auf Entitäten innerhalb des angegebenen geografischen Bereichs einzugrenzen (z. B. "innerhalb von 2 km").</p>
<p><strong>2. Rangfolge nach Semantik mittels Vektorsuche:</strong> Aus den verbleibenden Kandidaten wählt der Vektorindex die Top-N der ähnlichsten Ergebnisse auf der Grundlage der Einbettungsähnlichkeit aus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">Reale Anwendungsfälle für Geo-Vektor Retrieval<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Lieferdienste: Intelligente, standortbezogene Empfehlungen</h3><p>Plattformen wie DoorDash oder Uber Eats bearbeiten täglich Hunderte von Millionen von Anfragen. In dem Moment, in dem ein Benutzer die App öffnet, muss das System auf der Grundlage des Standorts des Benutzers, der Tageszeit, der Geschmackspräferenzen, der geschätzten Lieferzeiten, des Echtzeitverkehrs und der Verfügbarkeit von Kurieren ermitteln, welche Restaurants oder Kuriere <em>gerade</em> am besten geeignet sind.</p>
<p>Traditionell erfordert dies die Abfrage einer Geodatenbank und einer separaten Empfehlungsmaschine, gefolgt von mehreren Runden der Filterung und Neueinstufung. Mit dem Geolocation Index vereinfacht Milvus diesen Arbeitsablauf erheblich:</p>
<ul>
<li><p><strong>Einheitliche Speicherung</strong> - Restaurantkoordinaten, Kurierstandorte und die Einbettung der Benutzerpräferenzen befinden sich alle in einem System.</p></li>
<li><p><strong>Gemeinsame Suche</strong> - Zunächst wird ein räumlicher Filter angewendet (z. B. <em>Restaurants im Umkreis von 3 km</em>), dann wird die Vektorsuche verwendet, um eine Rangfolge nach Ähnlichkeit, Geschmackspräferenz oder Qualität zu erstellen.</p></li>
<li><p><strong>Dynamische Entscheidungsfindung</strong> - Kombinieren Sie Echtzeit-Kurierverteilung und Verkehrssignale, um schnell den nächstgelegenen, am besten geeigneten Kurier zuzuweisen.</p></li>
</ul>
<p>Dieser einheitliche Ansatz ermöglicht es der Plattform, räumliche und semantische Schlussfolgerungen in einer einzigen Abfrage zu ziehen. Wenn ein Benutzer beispielsweise nach "Curryreis" sucht, findet Milvus Restaurants, die semantisch relevant sind <em>, und</em> gibt denjenigen den Vorrang, die in der Nähe sind, schnell liefern und dem Geschmacksprofil des Benutzers entsprechen.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Autonomes Fahren: Intelligentere Entscheidungen</h3><p>Beim autonomen Fahren ist die raumbezogene Indizierung von grundlegender Bedeutung für die Wahrnehmung, Lokalisierung und Entscheidungsfindung. Fahrzeuge müssen sich kontinuierlich an hochauflösenden Karten orientieren, Hindernisse erkennen und sichere Fahrwege planen - und das alles innerhalb weniger Millisekunden.</p>
<p>Mit Milvus können der Geometrietyp und der RTREE-Index umfangreiche räumliche Strukturen speichern und abfragen, wie zum Beispiel:</p>
<ul>
<li><p><strong>Straßenbegrenzungen</strong> (LineString)</p></li>
<li><p><strong>Verkehrsregelungszonen</strong> (Polygon)</p></li>
<li><p><strong>Erkannte Hindernisse</strong> (Punkt)</p></li>
</ul>
<p>Diese Strukturen können effizient indiziert werden, so dass Geodaten direkt in die KI-Entscheidungsschleife einfließen können. So kann ein autonomes Fahrzeug beispielsweise durch ein RTREE-Raumprädikat schnell feststellen, ob seine aktuellen Koordinaten innerhalb einer bestimmten Fahrspur liegen oder sich mit einem Sperrgebiet kreuzen.</p>
<p>In Kombination mit den vom Wahrnehmungssystem generierten Vektoreinbettungen - wie z. B. Szeneneinbettungen, die die aktuelle Fahrumgebung erfassen - kann Milvus erweiterte Abfragen unterstützen, wie z. B. das Abrufen historischer Fahrszenarien, die dem aktuellen in einem Umkreis von 50 Metern ähneln. Dies hilft den Modellen, die Umgebung schneller zu interpretieren und bessere Entscheidungen zu treffen.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Geolokalisierung ist mehr als Breiten- und Längengrad. In ortsabhängigen Anwendungen liefert sie wichtige Informationen darüber, <strong>wo Ereignisse stattfinden, wie Einheiten räumlich zusammenhängen und wie diese Beziehungen das Systemverhalten beeinflussen</strong>. In Kombination mit semantischen Signalen aus Modellen des maschinellen Lernens ermöglichen Geodaten eine reichhaltigere Klasse von Abfragen, die bei der getrennten Verarbeitung von Raum- und Vektordaten schwer auszudrücken oder ineffizient auszuführen sind.</p>
<p>Mit der Einführung des Geometry Field und des RTREE-Index bringt Milvus die Vektorähnlichkeitssuche und die räumliche Filterung in eine einzige Abfrage-Engine. Dadurch können Anwendungen eine gemeinsame Suche über <strong>Vektoren, Geodaten und Zeit</strong> durchführen, was Anwendungsfälle wie raumbezogene Empfehlungssysteme, multimodale ortsbezogene Suche und regions- oder pfadgebundene Analysen unterstützt. Vor allem aber wird die architektonische Komplexität durch den Wegfall mehrstufiger Pipelines, die Daten zwischen spezialisierten Systemen verschieben, reduziert.</p>
<p>Da sich KI-Systeme immer mehr der realen Entscheidungsfindung annähern, muss das Verständnis dafür <strong><em>, welche</em></strong> Inhalte relevant sind, zunehmend mit der Frage verknüpft werden <strong><em>, wo</em></strong> sie anwendbar sind und <strong><em>wann</em></strong> sie wichtig sind. Milvus bietet die Bausteine für diese Klasse von räumlich-semantischen Workloads in einer Art und Weise, die sowohl aussagekräftig als auch praktisch für den Betrieb im großen Maßstab ist.</p>
<p>Weitere Informationen über das Geometry Field und den RTREE-Index finden Sie in der nachstehenden Dokumentation:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Geometriefeld | Milvus-Dokumentation</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Milvus-Dokumentation</a></p></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie einen tieferen Einblick in eine Funktion des neuesten Milvus? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Erfahren Sie mehr über die Funktionen von Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Einführung in Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche rationalisiert</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Suche auf Entity-Ebene ermöglichen: Neue Array-of-Structs und MAX_SIM-Fähigkeiten in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vektorsuche in der realen Welt: Wie man effizient filtert, ohne den Rückruf zu töten</a></p></li>
</ul>
