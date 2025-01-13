---
id: deep-dive-3-data-processing.md
title: Wie werden die Daten in einer Vektordatenbank verarbeitet?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus bietet eine Datenverwaltungsinfrastruktur, die für produktive
  KI-Anwendungen unerlässlich ist. Dieser Artikel enthüllt die Feinheiten der
  Datenverarbeitung im Inneren.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/czs007">Zhenshan Cao</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgesetzt.</p>
</blockquote>
<p>In den beiden vorangegangenen Beiträgen dieser Blogserie haben wir bereits die <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Systemarchitektur</a> von Milvus, der weltweit fortschrittlichsten Vektordatenbank, sowie ihr <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python-SDK und ihre API</a> behandelt.</p>
<p>Dieser Beitrag zielt hauptsächlich darauf ab, Ihnen dabei zu helfen, zu verstehen, wie Daten in Milvus verarbeitet werden, indem wir tief in das Milvus-System eindringen und die Interaktion zwischen den Datenverarbeitungskomponenten untersuchen.</p>
<p><em>Im Folgenden finden Sie einige nützliche Ressourcen, bevor Sie beginnen. Wir empfehlen, diese zuerst zu lesen, um das Thema in diesem Beitrag besser zu verstehen.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Ein tiefer Einblick in die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvus-Datenmodell</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Die Rolle und Funktion der einzelnen Milvus-Komponenten</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Datenverarbeitung in Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStream-Schnittstelle<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Die<a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStream-Schnittstelle</a> ist entscheidend für die Datenverarbeitung in Milvus. Wenn <code translate="no">Start()</code> aufgerufen wird, schreibt die Coroutine im Hintergrund Daten in den <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">Log-Broker</a> oder liest Daten von dort. Wenn <code translate="no">Close()</code> aufgerufen wird, stoppt die Coroutine.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>MsgStream-Schnittstelle</span> </span></p>
<p>Der MsgStream kann sowohl als Produzent als auch als Konsument dienen. Die Schnittstelle <code translate="no">AsProducer(channels []string)</code> definiert MsgStream als Produzent, während die Schnittstelle <code translate="no">AsConsumer(channels []string, subNamestring)</code>ihn als Konsument definiert. Der Parameter <code translate="no">channels</code> wird von beiden Schnittstellen gemeinsam genutzt, um festzulegen, in welche (physischen) Kanäle Daten geschrieben bzw. aus denen Daten gelesen werden sollen.</p>
<blockquote>
<p>Die Anzahl der Shards in einer Sammlung kann bei der Erstellung einer Sammlung angegeben werden. Jeder Shard entspricht einem <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">virtuellen Kanal (vchannel)</a>. Daher kann eine Sammlung mehrere V-Kanäle haben. Milvus weist jedem vchannel im Protokollbroker einen <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">physischen Kanal (pchannel)</a> zu.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Jeder virtuelle Kanal/Shaard entspricht einem physischen Kanal</span>. </span></p>
<p><code translate="no">Produce()</code> in der MsgStream-Schnittstelle, die für das Schreiben von Daten in die pchannels im Log-Broker zuständig ist. Die Daten können auf zwei Arten geschrieben werden:</p>
<ul>
<li>Einfaches Schreiben: Entitäten werden anhand der Hash-Werte der Primärschlüssel in verschiedene Shards (vchannel) geschrieben. Dann fließen diese Entitäten in die entsprechenden pchannels im Log-Broker.</li>
<li>Broadcast write: Entitäten werden in alle pchannels geschrieben, die durch den Parameter <code translate="no">channels</code> angegeben sind.</li>
</ul>
<p><code translate="no">Consume()</code> ist eine Art von blockierender API. Wenn in dem angegebenen pchannel keine Daten verfügbar sind, wird die Coroutine blockiert, wenn <code translate="no">Consume()</code> in der MsgStream-Schnittstelle aufgerufen wird. Andererseits ist <code translate="no">Chan()</code> eine nicht blockierende API, was bedeutet, dass die Coroutine nur dann Daten liest und verarbeitet, wenn im angegebenen pchannel Daten vorhanden sind. Andernfalls kann die Coroutine andere Aufgaben bearbeiten und wird nicht blockiert, wenn keine Daten verfügbar sind.</p>
<p><code translate="no">Seek()</code> ist eine Methode zur Fehlerbehebung. Wenn ein neuer Knoten gestartet wird, kann der Datenverbrauchsdatensatz abgerufen werden und der Datenverbrauch kann durch den Aufruf von <code translate="no">Seek()</code> an der Stelle fortgesetzt werden, an der er unterbrochen wurde.</p>
<h2 id="Write-data" class="common-anchor-header">Daten schreiben<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Daten, die in verschiedene V-Kanäle (Shards) geschrieben werden, können entweder eine Einfüge- oder eine Löschnachricht sein. Diese vchannels können auch als DmChannels (data manipulation channels) bezeichnet werden.</p>
<p>Verschiedene Sammlungen können sich dieselben pchannels im Log-Broker teilen. Eine Sammlung kann mehrere Shards und damit mehrere entsprechende V-Kanäle haben. Die Entitäten in derselben Sammlung fließen folglich in mehrere entsprechende pchannels im Logbroker. Der Vorteil der gemeinsamen Nutzung von P-Kanälen ist daher ein erhöhter Durchsatz, der durch die hohe Gleichzeitigkeit des Log-Brokers ermöglicht wird.</p>
<p>Bei der Erstellung einer Sammlung wird nicht nur die Anzahl der Shards angegeben, sondern auch die Zuordnung zwischen vchannels und pchannels im Log-Broker festgelegt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Schreibpfad in Milvus</span> </span></p>
<p>Wie in der obigen Abbildung gezeigt, schreiben Proxies im Schreibpfad Daten in den Log-Broker über die Schnittstelle <code translate="no">AsProducer()</code> des MsgStream. Dann konsumieren Datenknoten die Daten, konvertieren und speichern die konsumierten Daten im Objektspeicher. Der Speicherpfad ist eine Art von Metainformation, die von Datenkoordinatoren in etcd aufgezeichnet wird.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flussdiagramm</h3><p>Da sich verschiedene Sammlungen dieselben pchannels im Log-Broker teilen können, müssen Datenknoten oder Abfrageknoten beim Konsumieren von Daten beurteilen, zu welcher Sammlung die Daten in einem pchannel gehören. Um dieses Problem zu lösen, haben wir den Flowgraph in Milvus eingeführt. Er ist hauptsächlich für die Filterung von Daten in einem gemeinsamen pchannel nach Sammlungs-IDs zuständig. Wir können also sagen, dass jeder Flowgraph den Datenstrom in einem entsprechenden Shard (vchannel) in einer Sammlung verarbeitet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Flowgraph im Schreibpfad</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream-Erstellung</h3><p>Beim Schreiben von Daten wird das MsgStream-Objekt in den folgenden beiden Szenarien erstellt:</p>
<ul>
<li>Wenn der Proxy eine Dateneinfügeanforderung erhält, versucht er zunächst, die Zuordnung zwischen vchannels und pchannels über den Stammkoordinator (root coord) zu erhalten. Dann erstellt der Proxy ein MsgStream-Objekt.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Szenario 1</span> </span></p>
<ul>
<li>Wenn der Datenknoten startet und die Metainformationen der Kanäle in etcd liest, wird das MsgStream-Objekt erstellt.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Szenario 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Daten lesen<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Lesepfad in Milvus</span> </span></p>
<p>Der allgemeine Arbeitsablauf beim Lesen von Daten ist in der obigen Abbildung dargestellt. Abfrageanfragen werden über DqRequestChannel an Abfrageknoten gesendet. Die Abfrageknoten führen die Abfrageaufgaben parallel aus. Die Abfrageergebnisse von den Abfrageknoten gehen durch gRPC und der Proxy aggregiert die Ergebnisse und gibt sie an den Client zurück.</p>
<p>Um einen genaueren Blick auf den Datenleseprozess zu werfen, können wir sehen, dass der Proxy Abfrageanforderungen in den DqRequestChannel schreibt. Die Abfrageknoten konsumieren dann die Nachricht, indem sie den DqRequestChannel abonnieren. Jede Nachricht im DqRequestChannel wird verbreitet, so dass alle abonnierten Abfrageknoten die Nachricht empfangen können.</p>
<p>Wenn Abfrageknoten Abfrageanfragen erhalten, führen sie eine lokale Abfrage sowohl von Batch-Daten, die in versiegelten Segmenten gespeichert sind, als auch von Streaming-Daten durch, die dynamisch in Milvus eingefügt und in wachsenden Segmenten gespeichert werden. Anschließend müssen die Abfrageknoten die Abfrageergebnisse sowohl in <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">versiegelten als auch in wachsenden Segmenten</a> aggregieren. Diese aggregierten Ergebnisse werden über gRPC an den Proxy weitergeleitet.</p>
<p>Der Proxy sammelt alle Ergebnisse von mehreren Abfrageknoten und aggregiert sie dann, um die endgültigen Ergebnisse zu erhalten. Anschließend gibt der Proxy die endgültigen Abfrageergebnisse an den Client zurück. Da jede Abfrage und die entsprechenden Abfrageergebnisse durch dieselbe eindeutige requestID gekennzeichnet sind, kann der Proxy herausfinden, welche Abfrageergebnisse welcher Abfrage entsprechen.</p>
<h3 id="Flowgraph" class="common-anchor-header">Flussdiagramm</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Flussdiagramm im Lesepfad</span> </span></p>
<p>Ähnlich wie im Schreibpfad werden auch im Lesepfad Flussgraphen eingeführt. Milvus implementiert die einheitliche Lambda-Architektur, die die Verarbeitung von inkrementellen und historischen Daten integriert. Daher müssen die Abfrageknoten auch Echtzeit-Streaming-Daten erhalten. In ähnlicher Weise filtern und differenzieren Flowgraphs im Lesepfad Daten aus verschiedenen Sammlungen.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStream-Erstellung</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Erstellen des MsgStream-Objekts im Lesepfad</span> </span></p>
<p>Beim Lesen von Daten wird das MsgStream-Objekt im folgenden Szenario erstellt:</p>
<ul>
<li>In Milvus können die Daten erst gelesen werden, wenn sie geladen sind. Wenn der Proxy eine Anforderung zum Laden von Daten erhält, sendet er die Anforderung an den Abfragekoordinator, der über die Art der Zuweisung von Shards zu verschiedenen Abfrageknoten entscheidet. Die Zuweisungsinformationen (d. h. die Namen der V-Kanäle und die Zuordnung zwischen V-Kanälen und den entsprechenden P-Kanälen) werden per Methodenaufruf oder RPC (Remote Procedure Call) an die Abfrageknoten gesendet. Anschließend erstellen die Abfrageknoten die entsprechenden MsgStream-Objekte, um die Daten abzurufen.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL-Operationen<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL steht für Data Definition Language. DDL-Operationen auf Metadaten können in Schreib- und Leseanfragen unterteilt werden. Diese beiden Arten von Anfragen werden jedoch bei der Verarbeitung von Metadaten gleich behandelt.</p>
<p>Zu den Leseanforderungen für Metadaten gehören:</p>
<ul>
<li>Abfrage des Sammlungsschemas</li>
<li>Abfrage von Indizierungsinformationen und mehr</li>
</ul>
<p>Schreibanfragen umfassen:</p>
<ul>
<li>Erstellen einer Sammlung</li>
<li>Löschen einer Sammlung</li>
<li>Erstellen eines Index</li>
<li>Löschen eines Indexes Und mehr</li>
</ul>
<p>DDL-Anforderungen werden vom Client an den Proxy gesendet. Der Proxy leitet diese Anforderungen in der empfangenen Reihenfolge an den Root-Koordinator weiter, der jeder DDL-Anforderung einen Zeitstempel zuweist und dynamische Prüfungen der Anforderungen durchführt. Der Proxy bearbeitet jede Anfrage seriell, d.h. eine DDL-Anfrage nach der anderen. Der Proxy bearbeitet die nächste Anforderung erst, wenn er die Verarbeitung der vorherigen Anforderung abgeschlossen und die Ergebnisse vom Root-Koordinator erhalten hat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>DDL-Operationen</span>. </span></p>
<p>Wie in der obigen Abbildung zu sehen ist, befinden sich <code translate="no">K</code> DDL-Anforderungen in der Aufgabenwarteschlange des Root-Koordinators. Die DDL-Anforderungen in der Aufgabenwarteschlange sind in der Reihenfolge angeordnet, in der sie von der Root-Koordinate empfangen werden. So ist <code translate="no">ddl1</code> die erste, die an Root Coord gesendet wurde, und <code translate="no">ddlK</code> ist die letzte in diesem Stapel. Der Root-Koordinator bearbeitet die Anfragen eine nach der anderen in der zeitlichen Reihenfolge.</p>
<p>In einem verteilten System wird die Kommunikation zwischen den Proxys und dem Root-Koordinator durch gRPC ermöglicht. Der Root-Koordinator hält den maximalen Zeitstempelwert der ausgeführten Aufgaben fest, um sicherzustellen, dass alle DDL-Anforderungen in zeitlicher Reihenfolge verarbeitet werden.</p>
<p>Angenommen, es gibt zwei unabhängige Proxys, Proxy 1 und Proxy 2. Beide senden DDL-Anforderungen an dieselbe Stammkoordinate. Ein Problem besteht jedoch darin, dass frühere Anfragen nicht unbedingt vor den Anfragen, die ein anderer Proxy später erhält, an die Root-Koordinate gesendet werden. Wenn beispielsweise in der obigen Abbildung <code translate="no">DDL_K-1</code> von Proxy 1 an den Root-Koordinator gesendet wird, wurde <code translate="no">DDL_K</code> von Proxy 2 bereits akzeptiert und vom Root-Koordinator ausgeführt. Wie vom Root-Koordinator aufgezeichnet, beträgt der maximale Zeitstempelwert der ausgeführten Aufgaben zu diesem Zeitpunkt <code translate="no">K</code>. Um die zeitliche Abfolge nicht zu unterbrechen, wird die Anfrage <code translate="no">DDL_K-1</code> von der Aufgabenwarteschlange des Stammkoordinators zurückgewiesen. Sendet Proxy 2 jedoch zu diesem Zeitpunkt die Anfrage <code translate="no">DDL_K+5</code> an den Root-Koordinator, wird die Anfrage in die Aufgabenwarteschlange aufgenommen und später entsprechend ihrem Zeitstempelwert ausgeführt.</p>
<h2 id="Indexing" class="common-anchor-header">Indizierung<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Aufbau eines Indexes</h3><p>Wenn der Proxy Anfragen zur Indexerstellung vom Client erhält, führt er zunächst statische Prüfungen an den Anfragen durch und sendet sie an die Stammkoordinate. Der Root-Koordinator persistiert diese Indexaufbauanfragen im Metaspeicher (etcd) und sendet die Anfragen an den Indexkoordinator (Indexkoordinator).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Aufbau eines Index</span>. </span></p>
<p>Wenn der Indexkoordinator, wie oben dargestellt, Indexerstellungsanforderungen vom Stammkoordinator erhält, persistiert er die Aufgabe zunächst in etcd für den Metaspeicher. Der anfängliche Status des Indexaufbautasks ist <code translate="no">Unissued</code>. Der Indexkoordinator hält die Auslastung der einzelnen Indexknoten fest und leitet eingehende Tasks an einen weniger belasteten Indexknoten weiter. Nach Abschluss des Tasks schreibt der Indexknoten den Status des Tasks, entweder <code translate="no">Finished</code> oder <code translate="no">Failed</code> in den Metaspeicher, der in Milvus etcd ist. Dann kann der Index-Koordinator durch Nachschlagen in etcd feststellen, ob der Indexaufbau-Task erfolgreich war oder nicht. Wenn die Aufgabe aufgrund begrenzter Systemressourcen oder eines Ausfalls des Indexknotens fehlschlägt, löst der Indexkoordinator den gesamten Prozess erneut aus und weist die gleiche Aufgabe einem anderen Indexknoten zu.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Ablegen eines Index</h3><p>Darüber hinaus ist der Indexkoordinator auch für die Aufgabe von Indizes zuständig.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Fallenlassen eines Indexes</span>. </span></p>
<p>Wenn der Root-Koordinator eine Anfrage zum Löschen eines Index vom Client erhält, markiert er den Index zunächst als &quot;gelöscht&quot; und gibt das Ergebnis an den Client zurück, während er den Index-Koordinator benachrichtigt. Dann filtert der Indexkoordinator alle Indizierungsaufgaben mit der <code translate="no">IndexID</code> und die Aufgaben, die die Bedingung erfüllen, werden fallen gelassen.</p>
<p>Die Hintergrund-Coroutine des Indexkoordinators löscht nach und nach alle als "fallen gelassen" markierten Indizierungsaufgaben aus dem Objektspeicher (MinIO und S3). Dieser Prozess erfolgt über die Schnittstelle recycleIndexFiles. Wenn alle entsprechenden Indexdateien gelöscht sind, werden die Metainformationen der gelöschten Indexierungsaufgaben aus dem Metaspeicher (etcd) entfernt.</p>
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
