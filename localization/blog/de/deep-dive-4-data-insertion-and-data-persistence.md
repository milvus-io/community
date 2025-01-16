---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Dateneinfügung und Datenpersistenz in einer Vektordatenbank
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Erfahren Sie mehr über den Mechanismus der Dateneinfügung und Datenpersistenz
  in der Milvus-Vektordatenbank.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/sunby">Bingyi Sun</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgesetzt.</p>
</blockquote>
<p>Im letzten Beitrag der Deep Dive-Serie haben wir vorgestellt <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">, wie Daten in Milvus</a>, der weltweit fortschrittlichsten Vektordatenbank, <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">verarbeitet werden</a>. In diesem Artikel werden wir weiterhin die Komponenten untersuchen, die an der Dateneinfügung beteiligt sind, das Datenmodell im Detail illustrieren und erklären, wie die Datenpersistenz in Milvus erreicht wird.</p>
<p>Springe zu:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Wiederholung der Milvus-Architektur</a></li>
<li><a href="#The-portal-of-data-insertion-requests">Das Portal für Dateneinfügeanfragen</a></li>
<li><a href="#Data-coord-and-data-node">Datenkoordinaten und Datenknoten</a></li>
<li><a href="#Root-coord-and-Time-Tick">Wurzelkoordinate und Zeittick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Datenorganisation: Sammlung, Partition, Splitter (Kanal), Segment</a></li>
<li><a href="#Data-allocation-when-and-how">Datenzuweisung: wann und wie</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlog-Dateistruktur und Datenpersistenz</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Wiederholung der Milvus-Architektur<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Milvus-Architektur</span>. </span></p>
<p>SDK sendet Datenanfragen an den Proxy, das Portal, über den Load Balancer. Dann interagiert der Proxy mit dem Coordinator Service, um DDL- (Data Definition Language) und DML- (Data Manipulation Language) Anfragen in den Nachrichtenspeicher zu schreiben.</p>
<p>Arbeiterknoten, einschließlich Abfrageknoten, Datenknoten und Indexknoten, nehmen die Anforderungen aus dem Nachrichtenspeicher entgegen. Der Abfrageknoten ist für die Datenabfrage zuständig, der Datenknoten für die Dateneinfügung und die Datenpersistenz, und der Indexknoten befasst sich hauptsächlich mit der Indexerstellung und der Abfragebeschleunigung.</p>
<p>Die unterste Schicht ist der Objektspeicher, der hauptsächlich MinIO, S3 und AzureBlob für die Speicherung von Protokollen, Delta-Binlogs und Indexdateien nutzt.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">Das Portal für Dateneinfügeanfragen<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy in Milvus</span>. </span></p>
<p>Proxy dient als Portal für Dateneinfügeanfragen.</p>
<ol>
<li>Zunächst nimmt der Proxy Dateneinfügeanfragen von SDKs entgegen und teilt diese Anfragen mithilfe eines Hash-Algorithmus in mehrere Buckets ein.</li>
<li>Dann fordert der Proxy die Datenkoordinatoren auf, Segmente zuzuweisen, die kleinste Einheit in Milvus für die Datenspeicherung.</li>
<li>Anschließend fügt der Proxy die Informationen über die angeforderten Segmente in den Nachrichtenspeicher ein, damit diese Informationen nicht verloren gehen.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Datenkoordinaten und Datenknoten<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Hauptfunktion des Datenkoordinators ist die Verwaltung der Kanal- und Segmentzuweisung, während die Hauptfunktion des Datenknotens darin besteht, die eingefügten Daten zu verbrauchen und aufzubewahren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Datenkoordinator und Datenknoten in Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Funktion</h3><p>Die Datenkoordinierung hat die folgenden Aufgaben:</p>
<ul>
<li><p><strong>Zuweisung von Segmentplatz</strong>Die Datenkoordination weist dem Proxy Platz in wachsenden Segmenten zu, so dass der Proxy freien Platz in den Segmenten zum Einfügen von Daten nutzen kann.</p></li>
<li><p><strong>Aufzeichnung der Segmentzuweisung und des Verfallszeitpunkts des zugewiesenen Platzes im Segment</strong>Der vom Data Coord zugewiesene Platz in jedem Segment ist nicht dauerhaft, daher muss das Data Coord auch den Verfallszeitpunkt jeder Segmentzuweisung aufzeichnen.</p></li>
<li><p><strong>Automatisches Flushen von Segmentdaten</strong>Wenn das Segment voll ist, löst das Datenkoordinatensystem automatisch ein Flushen der Daten aus.</p></li>
<li><p><strong>Zuweisung von Kanälen an Datenknoten</strong>Eine Sammlung kann mehrere <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">V-Kanäle</a> haben. Die Datenkoordination legt fest, welche V-Kanäle von welchen Datenknoten verbraucht werden.</p></li>
</ul>
<p>Datenknoten haben die folgenden Aufgaben:</p>
<ul>
<li><p><strong>Daten konsumieren</strong>Der Datenknoten konsumiert Daten aus den von der Datenkoordinierung zugewiesenen Kanälen und erstellt eine Sequenz für die Daten.</p></li>
<li><p><strong>Datenpersistenz</strong>Zwischenspeichern der eingefügten Daten im Speicher und automatisches Auslagern der eingefügten Daten auf die Festplatte, wenn das Datenvolumen einen bestimmten Schwellenwert erreicht.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Arbeitsablauf</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Ein vchannel kann nur einem Datenknoten zugewiesen werden</span>. </span></p>
<p>Wie in der obigen Abbildung zu sehen ist, hat die Sammlung vier V-Kanäle (V1, V2, V3 und V4) und es gibt zwei Datenknoten. Es ist sehr wahrscheinlich, dass die Datenkoordination einem Datenknoten die Daten von V1 und V2 zuweist und dem anderen Datenknoten die Daten von V3 und V4. Ein einziger V-Kanal kann nicht mehreren Datenknoten zugewiesen werden, um eine Wiederholung des Datenverbrauchs zu verhindern, der sonst dazu führen würde, dass derselbe Datenstapel wiederholt in dasselbe Segment eingefügt wird.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Wurzelkoordinate und Zeittick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root Coord verwaltet TSO (Timestamp Oracle) und veröffentlicht weltweit Zeittick-Meldungen. Jede Dateneinfügeanforderung hat einen von Root Coord zugewiesenen Zeitstempel. Time Tick ist der Eckpfeiler von Milvus, der wie eine Uhr in Milvus funktioniert und angibt, zu welchem Zeitpunkt sich das Milvus-System befindet.</p>
<p>Wenn Daten in Milvus geschrieben werden, trägt jede Dateneinfügeanfrage einen Zeitstempel. Während des Datenkonsums konsumiert jeder Zeitdatenknoten Daten, deren Zeitstempel innerhalb eines bestimmten Bereichs liegen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Ein Beispiel für Dateneinfügung und Datenverbrauch auf der Grundlage von Zeitstempeln</span>. </span></p>
<p>Die obige Abbildung zeigt den Prozess des Einfügens von Daten. Die Werte der Zeitstempel werden durch die Zahlen 1,2,6,5,7,8 dargestellt. Die Daten werden von zwei Proxys in das System geschrieben: p1 und p2. Wenn während des Datenverbrauchs die aktuelle Zeit des Zeitticks 5 ist, können die Datenknoten nur die Daten 1 und 2 lesen. Wenn die aktuelle Zeit des Time Tick 9 ist, können die Daten 6, 7 und 8 von den Datenknoten gelesen werden.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Datenorganisation: Sammlung, Partition, Scherbe (Kanal), Segment<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Datenorganisation in Milvus</span>. </span></p>
<p>Lesen Sie zunächst diesen <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Artikel</a>, um das Datenmodell in Milvus und die Konzepte von Sammlung, Scherbe, Partition und Segment zu verstehen.</p>
<p>Zusammenfassend lässt sich sagen, dass die größte Dateneinheit in Milvus eine Sammlung ist, die mit einer Tabelle in einer relationalen Datenbank verglichen werden kann. Eine Sammlung kann mehrere Scherben (die jeweils einem Kanal entsprechen) und mehrere Partitionen innerhalb jeder Scherbe haben. Wie in der obigen Abbildung dargestellt, sind die Kanäle (Shards) die vertikalen Balken, während die Partitionen die horizontalen Balken sind. An jedem Schnittpunkt befindet sich das Konzept des Segments, die kleinste Einheit für die Datenzuweisung. In Milvus werden Indizes auf Segmenten aufgebaut. Während einer Abfrage gleicht das Milvus-System auch die Abfragelast in den verschiedenen Abfrageknoten aus, und dieser Prozess wird auf der Grundlage der Einheit der Segmente durchgeführt. Segmente enthalten mehrere <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlogs</a>, und wenn die Segmentdaten verbraucht sind, wird eine binlog-Datei erzeugt.</p>
<h3 id="Segment" class="common-anchor-header">Segment</h3><p>In Milvus gibt es drei Arten von Segmenten mit unterschiedlichem Status: wachsende, versiegelte und geleerte Segmente.</p>
<h4 id="Growing-segment" class="common-anchor-header">Wachsendes Segment</h4><p>Ein wachsendes Segment ist ein neu erstelltes Segment, das dem Proxy zum Einfügen von Daten zugewiesen werden kann. Der interne Speicherplatz eines Segments kann verwendet, zugewiesen oder frei sein.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Drei Status in einem wachsenden Segment</span> </span></p>
<ul>
<li>Belegt: Dieser Teil des Speicherplatzes eines wachsenden Segments wurde von einem Datenknoten verbraucht.</li>
<li>Zugewiesen: Dieser Teil des Speicherplatzes eines wachsenden Segments wurde vom Proxy angefordert und von der Datenkoordinate zugewiesen. Der zugewiesene Speicherplatz läuft nach einer bestimmten Zeitspanne ab.</li>
<li>Frei: Dieser Teil des Speicherplatzes eines wachsenden Segments wurde noch nicht verwendet. Der Wert des freien Speicherplatzes entspricht dem Gesamtspeicherplatz des Segments abzüglich des Wertes des verwendeten und zugewiesenen Speicherplatzes. Der freie Speicherplatz eines Segments nimmt also zu, wenn der zugewiesene Speicherplatz abläuft.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Versiegeltes Segment</h4><p>Ein versiegeltes Segment ist ein geschlossenes Segment, das dem Proxy nicht mehr zur Dateneinfügung zugewiesen werden kann.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Versiegeltes Segment in Milvus</span> </span></p>
<p>Ein wachsendes Segment wird unter den folgenden Umständen versiegelt:</p>
<ul>
<li>Wenn der belegte Platz in einem wachsenden Segment 75% des gesamten Platzes erreicht, wird das Segment versiegelt.</li>
<li>Flush() wird manuell von einem Milvus-Benutzer aufgerufen, um alle Daten in einer Sammlung zu erhalten.</li>
<li>Wachsende Segmente, die nach einem langen Zeitraum nicht versiegelt sind, werden versiegelt, da zu viele wachsende Segmente dazu führen, dass die Datenknoten zu viel Speicher verbrauchen.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Gespültes Segment</h4><p>Ein Flush-Segment ist ein Segment, das bereits auf die Festplatte geschrieben wurde. Flush bezieht sich auf die Speicherung von Segmentdaten im Objektspeicher zum Zwecke der Datenpersistenz. Ein Segment kann nur geflusht werden, wenn der zugewiesene Speicherplatz in einem versiegelten Segment abläuft. Beim Flushen wird das versiegelte Segment in ein geflushtes Segment umgewandelt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Gespültes Segment in Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Kanal</h3><p>Ein Kanal wird zugewiesen:</p>
<ul>
<li>Wenn ein Datenknoten gestartet oder heruntergefahren wird; oder</li>
<li>wenn der zugewiesene Segmentplatz vom Proxy angefordert wird.</li>
</ul>
<p>Dann gibt es mehrere Strategien der Kanalzuweisung. Milvus unterstützt 2 dieser Strategien:</p>
<ol>
<li>Konsistentes Hashing</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Konsistentes Hashing in Milvus</span> </span></p>
<p>Die Standardstrategie in Milvus. Diese Strategie nutzt die Hashing-Technik, um jedem Kanal eine Position auf dem Ring zuzuweisen, und sucht dann im Uhrzeigersinn nach dem nächstgelegenen Datenknoten für einen Kanal. In der obigen Abbildung wird also Kanal 1 dem Datenknoten 2 und Kanal 2 dem Datenknoten 3 zugewiesen.</p>
<p>Ein Problem bei dieser Strategie ist jedoch, dass die Erhöhung oder Verringerung der Anzahl der Datenknoten (z. B. wenn ein neuer Datenknoten hinzukommt oder ein Datenknoten plötzlich abgeschaltet wird) den Prozess der Kanalzuweisung beeinflussen kann. Um dieses Problem zu lösen, überwacht data coord den Status der Datenknoten über etcd, so dass data coord sofort benachrichtigt werden kann, wenn sich der Status der Datenknoten ändert. Dann bestimmt data coord, welchem Datenknoten die Kanäle ordnungsgemäß zugewiesen werden sollen.</p>
<ol start="2">
<li>Lastausgleich</li>
</ol>
<p>Die zweite Strategie besteht darin, Kanäle derselben Sammlung verschiedenen Datenknoten zuzuweisen, um sicherzustellen, dass die Kanäle gleichmäßig zugewiesen werden. Der Zweck dieser Strategie ist es, einen Lastausgleich zu erreichen.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Datenzuweisung: wann und wie<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Der Prozess der Datenzuweisung in Milvus</span> </span></p>
<p>Der Prozess der Datenzuweisung beginnt beim Client. Er sendet zunächst Dateneinfügeanfragen mit einem Zeitstempel <code translate="no">t1</code> an den Proxy. Dann sendet der Proxy eine Anfrage an die Datenkoordination zur Segmentzuweisung.</p>
<p>Nach Erhalt der Segmentzuweisungsanforderung prüft die Datenkoordination den Segmentstatus und weist das Segment zu. Wenn der aktuelle Speicherplatz der erstellten Segmente für die neu eingefügten Datenzeilen ausreicht, weist die Datenkoordination diese erstellten Segmente zu. Reicht der in den aktuellen Segmenten verfügbare Platz jedoch nicht aus, weist das Datenkoordinator ein neues Segment zu. Die Datenkoordinierungsstelle kann bei jeder Anfrage ein oder mehrere Segmente zurückgeben. In der Zwischenzeit speichert das Datenkoordinatensystem auch das zugewiesene Segment im Metaserver für die Datenpersistenz.</p>
<p>Anschließend gibt das Datenkoordinatensystem die Informationen über das zugewiesene Segment (einschließlich Segment-ID, Anzahl der Zeilen, Ablaufzeit <code translate="no">t2</code> usw.) an den Proxy zurück. Der Proxy sendet diese Informationen über das zugewiesene Segment an den Nachrichtenspeicher, damit diese Informationen ordnungsgemäß aufgezeichnet werden. Beachten Sie, dass der Wert von <code translate="no">t1</code> kleiner sein muss als der von <code translate="no">t2</code>. Der Standardwert von <code translate="no">t2</code> beträgt 2.000 Millisekunden und kann durch Konfiguration des Parameters <code translate="no">segment.assignmentExpiration</code> in der Datei <code translate="no">data_coord.yaml</code> geändert werden.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlog-Dateistruktur und Datenpersistenz<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Datenknoten Flush</span> </span></p>
<p>Der Datenknoten abonniert den Nachrichtenspeicher, da Dateneinfügeanforderungen im Nachrichtenspeicher aufbewahrt werden und die Datenknoten somit Einfügemeldungen konsumieren können. Die Datenknoten legen Einfügeaufträge zunächst in einem Einfügepuffer ab, und wenn sich die Aufträge ansammeln, werden sie nach Erreichen eines Schwellenwerts in den Objektspeicher gespült.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Struktur der Binlog-Datei</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Binlog-Dateistruktur</span>. </span></p>
<p>Die Struktur der Binlog-Datei in Milvus ähnelt der in MySQL. Binlog wird für zwei Funktionen verwendet: Datenwiederherstellung und Indexerstellung.</p>
<p>Ein Binlog enthält viele <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">Ereignisse</a>. Jedes Ereignis hat einen Ereigniskopf und Ereignisdaten.</p>
<p>Metadaten wie die Erstellungszeit des Binlogs, die ID des Schreibknotens, die Länge des Ereignisses und NextPosition (Offset des nächsten Ereignisses) usw. werden in den Ereigniskopf geschrieben.</p>
<p>Die Ereignisdaten können in zwei Teile unterteilt werden: fest und variabel.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Dateistruktur eines Einfügeereignisses</span>. </span></p>
<p>Der feste Teil in den Ereignisdaten eines <code translate="no">INSERT_EVENT</code> enthält <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code> und <code translate="no">reserved</code>.</p>
<p>Der variable Teil speichert die eingefügten Daten. Die Einfügedaten werden in das Format von Parquet sequenziert und in dieser Datei gespeichert.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistenz der Daten</h3><p>Wenn es mehrere Spalten im Schema gibt, speichert Milvus Binlogs in Spalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistenz der Binlog-Daten</span>. </span></p>
<p>Wie in der Abbildung oben dargestellt, ist die erste Spalte der Primärschlüssel binlog. Die zweite ist eine Zeitstempelspalte. Der Rest sind die im Schema definierten Spalten. Der Dateipfad der Binlogs in MinIO ist ebenfalls in der obigen Abbildung angegeben.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Serie<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine tiefgehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Überblick über die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs und Python-SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Datenverwaltung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Abfrage in Echtzeit</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Skalare Ausführungsmaschine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA-System</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vektorielles Ausführungssystem</a></li>
</ul>
