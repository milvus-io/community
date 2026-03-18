---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Verwendung der hybriden räumlichen und vektoriellen Suche mit Milvus
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Erfahren Sie, wie Milvus 2.6.4 eine hybride räumliche und vektorielle Suche
  mit Geometrie und R-Tree ermöglicht, mit Einblicken in die Leistung und
  praktischen Beispielen.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Eine Anfrage wie "Finde romantische Restaurants im Umkreis von 3 km" klingt einfach. Ist sie aber nicht, denn sie kombiniert Standortfilterung und semantische Suche. Die meisten Systeme müssen diese Abfrage auf zwei Datenbanken aufteilen, was eine Synchronisierung der Daten, eine Zusammenführung der Ergebnisse im Code und zusätzliche Latenzzeiten bedeutet.</p>
<p><a href="https://milvus.io">Mit Milvus</a> 2.6.4 entfällt diese Aufteilung. Mit einem nativen <strong>GEOMETRY-Datentyp</strong> und einem <strong>R-Tree-Index</strong> kann Milvus ortsbezogene und semantische Beschränkungen in einer einzigen Abfrage zusammen anwenden. Dies macht die hybride räumliche und semantische Suche viel einfacher und effizienter.</p>
<p>Dieser Artikel erklärt, warum diese Änderung notwendig war, wie GEOMETRY und R-Tree in Milvus funktionieren, welche Leistungssteigerungen zu erwarten sind und wie man sie mit dem Python SDK einrichtet.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">Die Grenzen der traditionellen geografischen und semantischen Suche<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Abfragen wie "Romantische Restaurants im Umkreis von 3 km" sind aus zwei Gründen schwer zu handhaben:</p>
<ul>
<li><strong>"Romantisch" braucht eine semantische Suche.</strong> Das System muss Restaurantbewertungen und Tags vektorisieren und dann Übereinstimmungen durch Ähnlichkeit im Einbettungsraum finden. Dies funktioniert nur in einer Vektordatenbank.</li>
<li><strong>"Innerhalb von 3 km" erfordert eine räumliche Filterung.</strong> Die Ergebnisse müssen auf "im Umkreis von 3 km um den Nutzer" oder manchmal auf "innerhalb eines bestimmten Lieferpolygons oder einer Verwaltungsgrenze" beschränkt werden.</li>
</ul>
<p>In einer traditionellen Architektur bedeutete die Erfüllung beider Anforderungen normalerweise, dass zwei Systeme nebeneinander liefen:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> für Geofencing, Entfernungsberechnungen und räumliche Filterung.</li>
<li>Eine <strong>Vektordatenbank</strong> für die ungefähre Suche nach dem nächsten Nachbarn (ANN) über Einbettungen.</li>
</ul>
<p>Dieses "Zwei-Datenbanken"-Design schafft drei praktische Probleme:</p>
<ul>
<li><strong>Mühsame Datensynchronisierung.</strong> Wenn ein Restaurant seine Adresse ändert, müssen Sie sowohl das Geosystem als auch die Vektordatenbank aktualisieren. Eine fehlende Aktualisierung führt zu inkonsistenten Ergebnissen.</li>
<li><strong>Höhere Latenzzeit.</strong> Die Anwendung muss zwei Systeme aufrufen und deren Ergebnisse zusammenführen, was zusätzliche Netzwerkumläufe und Verarbeitungszeit erfordert.</li>
<li><strong>Ineffiziente Filterung.</strong> Wenn das System zuerst die Vektorsuche durchführte, lieferte es oft viele Ergebnisse, die weit vom Benutzer entfernt waren und später verworfen werden mussten. Wurde zuerst eine Ortsfilterung durchgeführt, war die verbleibende Menge immer noch groß, so dass der Schritt der Vektorsuche immer noch teuer war.</li>
</ul>
<p>Milvus 2.6.4 löst dieses Problem, indem es räumliche Geometrieunterstützung direkt in die Vektordatenbank einfügt. Die semantische Suche und die Standortfilterung laufen nun in derselben Abfrage. Da sich alles in einem System befindet, ist die hybride Suche schneller und einfacher zu handhaben.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Was GEOMETRY zu Milvus beiträgt<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 führt einen skalaren Feldtyp namens DataType.GEOMETRY ein. Anstatt Orte als separate Längen- und Breitengradnummern zu speichern, speichert Milvus nun geometrische Objekte: Punkte, Linien und Polygone. Abfragen wie "Liegt dieser Punkt innerhalb einer Region?" oder "Liegt er innerhalb von X Metern?" werden zu nativen Operationen. Es besteht keine Notwendigkeit, Workarounds über rohe Koordinaten zu erstellen.</p>
<p>Die Implementierung folgt dem <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access Standard</strong>, so dass sie mit den meisten bestehenden Geodaten-Tools funktioniert. Die Geometriedaten werden in <strong>WKT (Well-Known Text)</strong> gespeichert und abgefragt, einem Standardtextformat, das von Menschen gelesen und von Programmen analysiert werden kann.</p>
<p>Unterstützte Geometrietypen:</p>
<ul>
<li><strong>POINT</strong>: ein einzelner Standort, z. B. eine Ladenadresse oder die Echtzeitposition eines Fahrzeugs</li>
<li><strong>LINESTRING</strong>: eine Linie, wie z. B. eine Straßenmittellinie oder ein Bewegungspfad</li>
<li><strong>POLYGON</strong>: ein Gebiet, z. B. eine Verwaltungsgrenze oder ein Geofence</li>
<li><strong>Erfassungsarten</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON und GEOMETRYCOLLECTION</li>
</ul>
<p>Es unterstützt auch Standard-Raumoperatoren, einschließlich:</p>
<ul>
<li><strong>Räumliche Beziehungen</strong>: Einschluss (ST_CONTAINS, ST_WITHIN), Schnittpunkt (ST_INTERSECTS, ST_CROSSES) und Kontakt (ST_TOUCHES)</li>
<li><strong>Abstandsoperationen</strong>: Berechnung von Abständen zwischen Geometrien (ST_DISTANCE) und Filtern von Objekten innerhalb eines bestimmten Abstands (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Wie die R-Tree-Indizierung in Milvus funktioniert<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Die GEOMETRY-Unterstützung ist in die Milvus-Abfrage-Engine integriert und nicht nur als API-Funktion verfügbar. ISpatial-Daten werden direkt in der Engine mit dem R-Tree (Rectangle Tree)-Index indiziert und verarbeitet.</p>
<p>Ein <strong>R-Tree</strong> gruppiert nahegelegene Objekte mit Hilfe von <strong>Minimum Bounding Rectangles (MBRs)</strong>. Bei einer Abfrage überspringt die Engine große Regionen, die sich nicht mit der Abfragegeometrie überschneiden, und führt nur detaillierte Prüfungen an einer kleinen Gruppe von Kandidaten durch. Dies ist viel schneller als das Scannen jedes Objekts.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Wie Milvus den R-Baum aufbaut</h3><p>Der Aufbau des R-Baums erfolgt in mehreren Ebenen:</p>
<table>
<thead>
<tr><th><strong>Ebene</strong></th><th><strong>Was Milvus tut</strong></th><th><strong>Intuitive Analogie</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Blatt-Ebene</strong></td><td>Für jedes Geometrieobjekt (Punkt, Linie oder Polygon) berechnet Milvus sein minimales Begrenzungsrechteck (MBR) und speichert es als Blattknoten.</td><td>Jedes Objekt wird in einen transparenten Kasten eingepackt, der genau auf das Objekt passt.</td></tr>
<tr><td><strong>Zwischenebenen</strong></td><td>Nahegelegene Blattknoten werden gruppiert (in der Regel 50-100 auf einmal), und ein größerer übergeordneter MBR wird erstellt, um alle diese Knoten abzudecken.</td><td>Pakete aus der gleichen Umgebung werden in eine einzige Lieferkiste gelegt.</td></tr>
<tr><td><strong>Wurzel-Ebene</strong></td><td>Diese Gruppierung setzt sich nach oben fort, bis alle Daten von einem einzigen Root-MBR abgedeckt sind.</td><td>Verladung aller Kisten auf einen Fernverkehrs-LKW.</td></tr>
</tbody>
</table>
<p>Mit dieser Struktur sinkt die Komplexität räumlicher Abfragen von einem vollständigen Scan <strong>O(n)</strong> auf <strong>O(log n)</strong>. In der Praxis können Abfragen über Millionen von Datensätzen von Hunderten von Millisekunden auf nur wenige Millisekunden reduziert werden, ohne dass die Genauigkeit leidet.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Wie Abfragen ausgeführt werden: Zwei-Phasen-Filterung</h3><p>Um ein Gleichgewicht zwischen Geschwindigkeit und Korrektheit herzustellen, verwendet Milvus eine <strong>zweiphasige Filterstrategie</strong>:</p>
<ul>
<li><strong>Grobfilter:</strong> Der R-Tree-Index prüft zunächst, ob sich das Begrenzungsrechteck der Abfrage mit anderen Begrenzungsrechtecken im Index überschneidet. Auf diese Weise werden die meisten nicht verwandten Daten schnell entfernt, und es bleibt nur eine kleine Gruppe von Kandidaten übrig. Da es sich bei diesen Rechtecken um einfache Formen handelt, ist die Prüfung sehr schnell, aber sie kann auch einige Ergebnisse umfassen, die eigentlich nicht übereinstimmen.</li>
<li><strong>Feinfilter</strong>: Die verbleibenden Kandidaten werden dann mit <strong>GEOS</strong> geprüft, der gleichen Geometriebibliothek, die von Systemen wie PostGIS verwendet wird. GEOS führt exakte Geometrieberechnungen durch, z. B. ob sich Formen überschneiden oder eine Form eine andere enthält, um korrekte Endergebnisse zu erhalten.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus akzeptiert Geometriedaten im <strong>WKT-Format (Well-Known Text)</strong>, speichert sie aber intern als <strong>WKB (Well-Known Binary).</strong> WKB ist kompakter, was den Speicherbedarf reduziert und die E/A verbessert. GEOMETRY-Felder unterstützen auch Memory-Mapped (mmap)-Speicherung, so dass große räumliche Datensätze nicht vollständig in den RAM passen müssen.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Leistungsverbesserungen mit R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">Die Abfragelatenz bleibt bei wachsendem Datenvolumen konstant.</h3><p>Ohne einen R-Tree-Index skaliert die Abfragezeit linear mit der Datengröße - 10x mehr Daten bedeuten ungefähr 10x langsamere Abfragen.</p>
<p>Mit R-Tree wächst die Abfragezeit logarithmisch. Bei Datensätzen mit Millionen von Datensätzen kann die räumliche Filterung zehn- bis hundertmal schneller sein als ein vollständiger Scan.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">Genauigkeit wird nicht für Geschwindigkeit geopfert</h3><p>Der R-Tree grenzt die Kandidaten nach Bounding Box ein, dann überprüft GEOS jeden einzelnen mit exakter Geometrieberechnung. Alles, was wie eine Übereinstimmung aussieht, aber tatsächlich außerhalb des Abfragebereichs liegt, wird im zweiten Durchgang entfernt.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Verbesserter Durchsatz bei der hybriden Suche</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der R-Tree entfernt zunächst die Datensätze außerhalb des Zielbereichs. Milvus führt dann die Vektorähnlichkeit (L2, IP oder Cosinus) nur für die verbleibenden Kandidaten durch. Weniger Kandidaten bedeuten geringere Suchkosten und höhere Abfragen pro Sekunde (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Erste Schritte: GEOMETRY mit dem Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Definieren Sie die Sammlung und erstellen Sie Indizes</h3><p>Definieren Sie zunächst ein Feld DataType.GEOMETRY im Schema der Sammlung. Dies ermöglicht Milvus die Speicherung und Abfrage geometrischer Daten.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">Daten einfügen</h3><p>Wenn Sie Daten einfügen, müssen die Geometriewerte im WKT-Format (Well-Known Text) vorliegen. Jeder Datensatz enthält die Geometrie, den Vektor und andere Felder.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Ausführen einer hybriden Raum-Vektor-Abfrage (Beispiel)</h3><p><strong>Szenario:</strong> Suche nach den 3 ähnlichsten POIs im Vektorraum, die sich in einem Umkreis von 2 Kilometern um einen bestimmten Punkt, z. B. den Standort des Benutzers, befinden.</p>
<p>Verwenden Sie den Operator ST_DWITHIN, um den Entfernungsfilter anzuwenden. Der Entfernungswert wird in <strong>Metern</strong> angegeben <strong>.</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Tipps für die Verwendung in der Produktion<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Erstellen Sie immer einen R-Tree-Index für GEOMETRY-Felder.</strong> Bei Datensätzen mit mehr als 10.000 Entitäten fallen räumliche Filter ohne einen RTREE-Index auf einen vollständigen Scan zurück, und die Leistung nimmt stark ab.</li>
<li><strong>Verwenden Sie ein einheitliches Koordinatensystem.</strong> Alle Ortsdaten müssen das gleiche System verwenden (z. B. <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). Die Vermischung von Koordinatensystemen beeinträchtigt die Entfernungs- und Eingrenzungsberechnungen.</li>
<li><strong>Wählen Sie den richtigen räumlichen Operator für die Abfrage.</strong> ST_DWITHIN für "innerhalb von X Metern"-Suchen. ST_CONTAINS oder ST_WITHIN für Geofencing- und Eingrenzungsprüfungen.</li>
<li><strong>NULL-Geometriewerte werden automatisch behandelt.</strong> Wenn das GEOMETRY-Feld nullbar ist (nullable=True), überspringt Milvus NULL-Werte bei räumlichen Abfragen. Es ist keine zusätzliche Filterlogik erforderlich.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Anforderungen für den Einsatz<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Um diese Funktionen in der Produktion nutzen zu können, müssen Sie sicherstellen, dass Ihre Umgebung die folgenden Anforderungen erfüllt.</p>
<p><strong>1. Milvus-Version</strong></p>
<p>Sie müssen <strong>Milvus 2.6.4 oder höher</strong> einsetzen. Frühere Versionen unterstützen weder DataType.GEOMETRY noch den Indextyp <strong>RTREE</strong>.</p>
<p><strong>2. SDK-Versionen</strong></p>
<ul>
<li><strong>PyMilvus</strong>: Aktualisieren Sie auf die neueste Version (die <strong>2.6.x-Serie</strong> wird empfohlen). Dies ist für die korrekte WKT-Serialisierung und für die Übergabe von RTREE-Indexparametern erforderlich.</li>
<li><strong>Java / Go / Node SDKs</strong>: Überprüfen Sie die Versionshinweise für jedes SDK und stellen Sie sicher, dass sie mit den <strong>2.6.4</strong> Proto-Definitionen übereinstimmen.</li>
</ul>
<p><strong>3. Eingebaute Geometriebibliotheken</strong></p>
<p>Der Milvus-Server enthält bereits Boost.Geometry und GEOS, so dass Sie diese Bibliotheken nicht selbst installieren müssen.</p>
<p><strong>4. Speicherverwendung und Kapazitätsplanung</strong></p>
<p>R-Tree-Indizes verbrauchen zusätzlichen Speicher. Denken Sie bei der Kapazitätsplanung daran, sowohl Geometrieindizes als auch Vektorindizes wie HNSW oder IVF einzuplanen. Das GEOMETRY-Feld unterstützt memory-mapped (mmap) Speicherung, die den Speicherverbrauch reduzieren kann, indem ein Teil der Daten auf der Festplatte gehalten wird.</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Für eine ortsbezogene semantische Suche reicht es nicht aus, einen Geofilter an eine Vektorabfrage anzuhängen. Sie erfordert eingebaute räumliche Datentypen, geeignete Indizes und eine Abfrage-Engine, die Ort und Vektoren zusammen verarbeiten kann.</p>
<p><strong>Milvus 2.6.4</strong> löst diese Aufgabe mit nativen <strong>GEOMETRY-Feldern</strong> und <strong>R-Tree-Indizes</strong>. Räumliche Filterung und Vektorsuche laufen in einer einzigen Abfrage, gegen einen einzigen Datenspeicher. Der R-Tree sorgt für schnelles räumliches Pruning, während GEOS exakte Ergebnisse gewährleistet.</p>
<p>Für Anwendungen, die eine ortsbezogene Suche benötigen, entfällt damit die Komplexität der Ausführung und Synchronisierung zweier getrennter Systeme.</p>
<p>Wenn Sie an einer ortsbezogenen oder hybriden räumlichen und vektoriellen Suche arbeiten, würden wir uns freuen, von Ihren Erfahrungen zu hören.</p>
<p><strong>Haben Sie Fragen zu Milvus?</strong> Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>.</p>
