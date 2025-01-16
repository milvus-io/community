---
id: deep-dive-5-real-time-query.md
title: Verwendung der Milvus-Vektordatenbank für Echtzeitabfragen
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: >-
  Erfahren Sie mehr über den zugrunde liegenden Mechanismus der Echtzeitabfrage
  in Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/xige-16">Xi Ge</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgesetzt.</p>
</blockquote>
<p>Im vorigen Beitrag haben wir über die <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Dateneinfügung und Datenpersistenz</a> in Milvus gesprochen. In diesem Artikel werden wir weiter erklären, wie <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">verschiedene Komponenten</a> in Milvus miteinander interagieren, um Echtzeit-Datenabfragen durchzuführen.</p>
<p><em>Bevor Sie beginnen, finden Sie unten einige nützliche Ressourcen. Wir empfehlen, diese zuerst zu lesen, um das Thema in diesem Beitrag besser zu verstehen.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Ein tiefer Einblick in die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus-Datenmodell</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Die Rolle und Funktion der einzelnen Milvus-Komponenten</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung in Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Dateneinfügung und Datenpersistenz in Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Laden von Daten in den Abfrageknoten<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor eine Abfrage ausgeführt wird, müssen die Daten zunächst in die Abfrageknoten geladen werden.</p>
<p>Es gibt zwei Arten von Daten, die in den Abfrageknoten geladen werden: Streaming-Daten aus dem <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">Log-Broker</a> und historische Daten aus dem <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">Objektspeicher</a> (im Folgenden auch persistenter Speicher genannt).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Flussdiagramm</span> </span></p>
<p>Die Datenkoordination ist für die Handhabung von Streaming-Daten zuständig, die kontinuierlich in Milvus eingefügt werden. Wenn ein Milvus-Benutzer <code translate="no">collection.load()</code> aufruft, um eine Sammlung zu laden, fragt der Abfragekoordinator den Datenkoordinator, um zu erfahren, welche Segmente im Speicher persistiert wurden und welche Checkpoints ihnen entsprechen. Ein Checkpoint ist eine Markierung, die anzeigt, dass persistierte Segmente vor dem Checkpoint verbraucht werden, während die Segmente nach dem Checkpoint nicht verbraucht werden.</p>
<p>Anschließend gibt die Abfragekoordination auf der Grundlage der Informationen aus der Datenkoordination eine Zuordnungsstrategie aus: entweder nach Segmenten oder nach Kanälen. Der Segment Allocator ist für die Zuweisung von Segmenten im persistenten Speicher (Stapeldaten) an verschiedene Abfrageknoten zuständig. In der obigen Abbildung ordnet die Segmentzuordnung beispielsweise die Segmente 1 und 3 (S1, S3) dem Abfrageknoten 1 und die Segmente 2 und 4 (S2, S4) dem Abfrageknoten 2 zu. Der Kanalzuweiser weist verschiedenen Abfrageknoten die Überwachung mehrerer <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">Datenmanipulationskanäle</a> (DMChannels) im Log-Broker zu. In der obigen Abbildung weist der Kanalzuweiser beispielsweise Abfrageknoten 1 die Überwachung von Kanal 1 (Ch1) und Abfrageknoten 2 die Überwachung von Kanal 2 (Ch2) zu.</p>
<p>Mit dieser Zuweisungsstrategie lädt jeder Abfrageknoten Segmentdaten und überwacht die Kanäle entsprechend. Im Abfrageknoten 1 in der Abbildung werden historische Daten (Stapeldaten) über die zugeordneten S1 und S3 aus dem persistenten Speicher geladen. In der Zwischenzeit lädt Abfrageknoten 1 inkrementelle Daten (Streaming-Daten), indem er den Kanal 1 im Log-Broker abonniert.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Datenverwaltung im Abfrageknoten<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Abfrageknoten muss sowohl historische als auch inkrementelle Daten verwalten. Historische Daten werden in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">versiegelten Segmenten</a> gespeichert, während inkrementelle Daten in <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">wachsenden Segmenten</a> gespeichert werden.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Verwaltung historischer Daten</h3><p>Bei der Verwaltung historischer Daten gibt es hauptsächlich zwei Überlegungen: Lastausgleich und Ausfallsicherung des Abfrageknotens.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Lastausgleich</span> </span></p>
<p>Wie in der Abbildung zu sehen ist, wurden beispielsweise dem Abfrageknoten 4 mehr versiegelte Segmente zugewiesen als den übrigen Abfrageknoten. Dadurch wird Abfrageknoten 4 höchstwahrscheinlich zum Engpass, der den gesamten Abfrageprozess verlangsamt. Um dieses Problem zu lösen, muss das System mehrere Segmente in Abfrageknoten 4 anderen Abfrageknoten zuweisen. Dies wird als Lastausgleich bezeichnet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Ausfallsicherung für Abfrageknoten</span> </span></p>
<p>Eine weitere mögliche Situation ist in der obigen Abbildung dargestellt. Einer der Knoten, Abfrageknoten 4, ist plötzlich ausgefallen. In diesem Fall muss die Last (dem Abfrageknoten 4 zugewiesene Segmente) auf andere funktionierende Abfrageknoten übertragen werden, um die Genauigkeit der Abfrageergebnisse zu gewährleisten.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Inkrementelle Datenverwaltung</h3><p>Der Abfrageknoten überwacht die DMChannels, um inkrementelle Daten zu empfangen. In diesem Prozess wird ein Flowgraph eingeführt. Er filtert zunächst alle Dateneinfügemeldungen. Damit soll sichergestellt werden, dass nur Daten in einer bestimmten Partition geladen werden. Jede Sammlung in Milvus hat einen entsprechenden Kanal, der von allen Partitionen in dieser Sammlung gemeinsam genutzt wird. Daher wird ein Flussdiagramm zum Filtern der eingefügten Daten benötigt, wenn ein Milvus-Benutzer nur Daten in einer bestimmten Partition laden möchte. Andernfalls werden die Daten aus allen Partitionen der Sammlung in den Abfrageknoten geladen.</p>
<p>Nach der Filterung werden die inkrementellen Daten in wachsende Segmente eingefügt und an die Server-Zeitknoten weitergeleitet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Flussdiagramm</span> </span></p>
<p>Beim Einfügen von Daten wird jeder Einfügemeldung ein Zeitstempel zugewiesen. In dem oben abgebildeten DMChannel werden die Daten in der Reihenfolge von links nach rechts eingefügt. Die erste Einfügemeldung hat den Zeitstempel 1, die zweite den Zeitstempel 2 und die dritte den Zeitstempel 6. Die vierte, rot markierte Meldung ist keine Einfügemeldung, sondern eine Timetick-Meldung. Dies bedeutet, dass eingefügte Daten, deren Zeitstempel kleiner als dieser Zeitstempel ist, bereits im Log-Broker sind. Mit anderen Worten: Daten, die nach dieser Zeitstempel-Meldung eingefügt werden, sollten alle Zeitstempel haben, deren Werte größer sind als dieser Zeitstempel. Wenn der Abfrageknoten in der obigen Abbildung beispielsweise feststellt, dass der aktuelle Zeitstempel 5 beträgt, bedeutet dies, dass alle Einfügemeldungen, deren Zeitstempelwert kleiner als 5 ist, in den Abfrageknoten geladen werden.</p>
<p>Der Zeitknoten des Servers liefert jedes Mal, wenn er einen Zeitstempel vom Einfügeknoten erhält, einen aktualisierten Wert <code translate="no">tsafe</code>. <code translate="no">tsafe</code> bedeutet Sicherheitszeit, und alle Daten, die vor diesem Zeitpunkt eingefügt wurden, können abgefragt werden. Ein Beispiel: Wenn <code translate="no">tsafe</code> = 9 ist, können alle eingefügten Daten mit Zeitstempeln kleiner als 9 abgefragt werden.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Echtzeit-Abfrage in Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Echtzeitabfrage in Milvus wird durch Abfragenachrichten ermöglicht. Abfragenachrichten werden über einen Proxy in den Log-Broker eingefügt. Dann erhalten die Abfrageknoten Abfragenachrichten, indem sie den Abfragekanal im Logbroker beobachten.</p>
<h3 id="Query-message" class="common-anchor-header">Abfragemeldung</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Abfragemeldung</span> </span></p>
<p>Eine Abfrage-Nachricht enthält die folgenden wichtigen Informationen über eine Abfrage:</p>
<ul>
<li><code translate="no">msgID</code>: Message ID, die vom System zugewiesene ID der Abfragenachricht.</li>
<li><code translate="no">collectionID</code>: Die ID der abzufragenden Sammlung (falls vom Benutzer angegeben).</li>
<li><code translate="no">execPlan</code>: Der Ausführungsplan wird hauptsächlich für die Attributfilterung in einer Abfrage verwendet.</li>
<li><code translate="no">service_ts</code>: Der Zeitstempel des Dienstes wird zusammen mit der oben genannten <code translate="no">tsafe</code> aktualisiert. Der Zeitstempel des Dienstes gibt an, zu welchem Zeitpunkt der Dienst in ist. Alle vor <code translate="no">service_ts</code> eingefügten Daten sind für die Abfrage verfügbar.</li>
<li><code translate="no">travel_ts</code>: Der Reisezeitstempel gibt einen Zeitbereich in der Vergangenheit an. Die Abfrage wird auf Daten durchgeführt, die in dem von <code translate="no">travel_ts</code> angegebenen Zeitraum liegen.</li>
<li><code translate="no">guarantee_ts</code>: Garantiezeitstempel gibt eine Zeitspanne an, nach der die Abfrage durchgeführt werden muss. Die Abfrage wird nur durchgeführt, wenn <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Abfrage in Echtzeit</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Abfrageprozess</span> </span></p>
<p>Wenn eine Abfragenachricht empfangen wird, beurteilt Milvus zunächst, ob die aktuelle Servicezeit, <code translate="no">service_ts</code>, größer ist als der Garantiezeitstempel, <code translate="no">guarantee_ts</code>, in der Abfragenachricht. Wenn ja, wird die Abfrage ausgeführt. Die Abfrage wird parallel zu den historischen Daten und den inkrementellen Daten durchgeführt. Da es zu Datenüberschneidungen zwischen Streaming-Daten und Batch-Daten kommen kann, ist eine Aktion namens "local reduce" erforderlich, um die redundanten Abfrageergebnisse herauszufiltern.</p>
<p>Ist jedoch die aktuelle Servicezeit kleiner als der garantierte Zeitstempel in einer neu eingefügten Abfragenachricht, wird die Abfragenachricht zu einer ungelösten Nachricht und wartet auf ihre Verarbeitung, bis die Servicezeit größer als der garantierte Zeitstempel wird.</p>
<p>Die Abfrageergebnisse werden schließlich an den Ergebniskanal weitergeleitet. Der Proxy holt die Abfrageergebnisse aus diesem Kanal ab. Ebenso führt der Proxy eine "globale Reduzierung" durch, da er Ergebnisse von mehreren Abfrageknoten erhält und sich Abfrageergebnisse wiederholen können.</p>
<p>Um sicherzustellen, dass der Proxy alle Abfrageergebnisse erhalten hat, bevor er sie an das SDK zurücksendet, enthält die Ergebnisnachricht auch eine Aufzeichnung der Informationen, einschließlich der durchsuchten versiegelten Segmente, der durchsuchten DMChannels und der globalen versiegelten Segmente (alle Segmente auf allen Abfrageknoten). Das System kann nur dann zu dem Schluss kommen, dass der Proxy alle Abfrageergebnisse erhalten hat, wenn beide der folgenden Bedingungen erfüllt sind:</p>
<ul>
<li>Die Vereinigung aller gesuchten versiegelten Segmente, die in allen Ergebnisnachrichten aufgezeichnet sind, ist größer als die globalen versiegelten Segmente,</li>
<li>Alle DMChannels in der Sammlung sind abgefragt worden.</li>
</ul>
<p>Letztendlich gibt der Proxy die endgültigen Ergebnisse nach "global reduce" an das Milvus SDK zurück.</p>
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
