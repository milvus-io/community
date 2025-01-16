---
id: raft-or-not.md
title: >-
  Floß oder nicht? Die beste Lösung für Datenkonsistenz in Cloud-nativen
  Datenbanken
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Warum ist der konsensbasierte Replikationsalgorithmus nicht der Königsweg zur
  Erreichung der Datenkonsistenz in verteilten Datenbanken?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgesetzt.</p>
</blockquote>
<p>Die konsensbasierte Replikation ist eine weit verbreitete Strategie in vielen Cloud-nativen, verteilten Datenbanken. Sie hat jedoch einige Schwächen und ist definitiv nicht der Königsweg.</p>
<p>In diesem Beitrag sollen zunächst die Konzepte Replikation, Konsistenz und Konsens in einer Cloud-nativen und verteilten Datenbank erläutert werden. Anschließend soll klargestellt werden, warum konsensbasierte Algorithmen wie Paxos und Raft nicht der Königsweg sind, und schließlich soll eine <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">Lösung für die konsensbasierte Replikation</a> vorgeschlagen werden.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Verständnis von Replikation, Konsistenz und Konsens</a></li>
<li><a href="#Consensus-based-replication">Konsensbasierte Replikation</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Eine Protokollreplikationsstrategie für Cloud-native und verteilte Datenbanken</a></li>
<li><a href="#Summary">Zusammenfassung</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Verständnis von Replikation, Konsistenz und Konsens<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns eingehend mit den Vor- und Nachteilen von Paxos und Raft befassen und eine am besten geeignete Protokollreplikationsstrategie vorschlagen, müssen wir zunächst die Konzepte der Replikation, Konsistenz und des Konsenses entmystifizieren.</p>
<p>Beachten Sie, dass sich dieser Artikel hauptsächlich auf die Synchronisierung von inkrementellen Daten/Protokollen konzentriert. Wenn von Daten-/Protokollreplikation die Rede ist, wird daher nur auf die Replikation inkrementeller Daten und nicht auf historische Daten Bezug genommen.</p>
<h3 id="Replication" class="common-anchor-header">Replikation</h3><p>Bei der Replikation werden mehrere Kopien von Daten erstellt und auf verschiedenen Festplatten, Prozessen, Maschinen, Clustern usw. gespeichert, um die Zuverlässigkeit der Daten zu erhöhen und Datenabfragen zu beschleunigen. Da bei der Replikation die Daten kopiert und an mehreren Orten gespeichert werden, sind die Daten zuverlässiger, wenn Festplatten-, physische Maschinen- oder Clusterfehler auftreten. Darüber hinaus können mehrere Datenreplikationen die Leistung einer verteilten Datenbank steigern, indem sie Abfragen erheblich beschleunigen.</p>
<p>Es gibt verschiedene Replikationsmodi, wie z. B. synchrone/asynchrone Replikation, Replikation mit starker/evtl. Konsistenz, Leader-Follower/dezentralisierte Replikation. Die Wahl des Replikationsmodus hat Auswirkungen auf die Systemverfügbarkeit und -konsistenz. Daher muss ein Systemarchitekt, wie im berühmten <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">CAP-Theorem</a> vorgeschlagen, einen Kompromiss zwischen Konsistenz und Verfügbarkeit eingehen, wenn eine Netzwerkpartition unvermeidlich ist.</p>
<h3 id="Consistency" class="common-anchor-header">Konsistenz</h3><p>Kurz gesagt, bezieht sich Konsistenz in einer verteilten Datenbank auf die Eigenschaft, die sicherstellt, dass jeder Knoten oder jede Replik dieselbe Sicht auf die Daten hat, wenn sie zu einem bestimmten Zeitpunkt Daten schreiben oder lesen. Eine vollständige Liste der Konsistenzstufen finden Sie in der Dokumentation <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">hier</a>.</p>
<p>Zur Klarstellung: Wir sprechen hier von Konsistenz im Sinne des CAP-Theorems, nicht von ACID (Atomarität, Konsistenz, Isolation, Dauerhaftigkeit). Konsistenz im Sinne des CAP-Theorems bedeutet, dass jeder Knoten im System über dieselben Daten verfügt, während Konsistenz im Sinne von ACID bedeutet, dass ein einzelner Knoten bei jeder potenziellen Übertragung dieselben Regeln durchsetzt.</p>
<p>Im Allgemeinen erfordern OLTP-Datenbanken (Online Transaction Processing) starke Konsistenz oder Linearität, um sicherzustellen, dass:</p>
<ul>
<li>Jeder Lesevorgang kann auf die zuletzt eingefügten Daten zugreifen.</li>
<li>Wenn nach einem Lesevorgang ein neuer Wert zurückgegeben wird, müssen alle folgenden Lesevorgänge, unabhängig davon, ob sie auf demselben oder einem anderen Client stattfinden, den neuen Wert zurückgeben.</li>
</ul>
<p>Das Wesen der Linearisierbarkeit besteht darin, die Aktualität mehrerer Datenreplikate zu garantieren - sobald ein neuer Wert geschrieben oder gelesen wird, können alle nachfolgenden Lesevorgänge den neuen Wert anzeigen, bis der Wert später überschrieben wird. Ein verteiltes System, das Linearisierbarkeit bietet, kann den Benutzern die Mühe ersparen, mehrere Replikate im Auge zu behalten, und kann die Atomarität und Reihenfolge jeder Operation garantieren.</p>
<h3 id="Consensus" class="common-anchor-header">Konsens</h3><p>Das Konzept des Konsens wird in verteilte Systeme eingeführt, da die Benutzer darauf erpicht sind, dass verteilte Systeme auf die gleiche Weise funktionieren wie eigenständige Systeme.</p>
<p>Vereinfacht ausgedrückt ist der Konsens eine allgemeine Übereinkunft über Werte. Ein Beispiel: Steve und Frank wollten etwas essen gehen. Steve schlug vor, Sandwiches zu essen. Frank stimmte Steves Vorschlag zu und beide aßen Sandwiches. Sie haben einen Konsens erzielt. Genauer gesagt, ein Wert (Sandwiches), der von einem der beiden vorgeschlagen wurde, wird von beiden akzeptiert, und beide führen auf der Grundlage dieses Wertes Aktionen durch. Ähnlich bedeutet Konsens in einem verteilten System, dass, wenn ein Prozess einen Wert vorschlägt, alle anderen Prozesse im System diesem Wert zustimmen und entsprechend handeln.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Konsens</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Konsensbasierte Replikation<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>Die ersten konsensbasierten Algorithmen wurden zusammen mit der <a href="https://pmg.csail.mit.edu/papers/vr.pdf">Viewstamped-Replikation</a> im Jahr 1988 vorgeschlagen. Im Jahr 1989 schlug Leslie Lamport <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a> vor, einen konsensbasierten Algorithmus.</p>
<p>In den letzten Jahren hat sich mit <a href="https://raft.github.io/">Raft</a> ein weiterer konsensbasierter Algorithmus in der Branche durchgesetzt. Er wurde von vielen Mainstream-NewSQL-Datenbanken wie CockroachDB, TiDB, OceanBase usw. übernommen.</p>
<p>Ein verteiltes System muss nicht unbedingt linearisierbar sein, auch wenn es konsensbasierte Replikation einsetzt. Linearisierbarkeit ist jedoch die Voraussetzung für den Aufbau einer verteilten ACID-Datenbank.</p>
<p>Beim Entwurf eines Datenbanksystems sollte die Reihenfolge der Übergabe von Protokollen und Zustandsautomaten berücksichtigt werden. Besondere Vorsicht ist auch geboten, um die Leader-Lease von Paxos oder Raft aufrechtzuerhalten und ein Split-Brain bei einer Netzwerkpartition zu verhindern.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Zustandsautomat der Raft-Replikation</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Vor- und Nachteile</h3><p>Raft, ZAB und das <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">Quorum-basierte Protokoll</a> in Aurora sind allesamt Paxos-Varianten. Die konsensbasierte Replikation hat die folgenden Vorteile:</p>
<ol>
<li>Obwohl sich die konsensbasierte Replikation im CAP-Theorem mehr auf die Konsistenz und die Netzwerkpartitionierung konzentriert, bietet sie im Vergleich zur traditionellen Leader-Follower-Replikation eine relativ bessere Verfügbarkeit.</li>
<li>Raft ist ein Durchbruch, der die konsensbasierten Algorithmen stark vereinfacht hat. Und es gibt viele Open-Source-Raft-Bibliotheken auf GitHub (z. B. <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>Die Leistung der konsensbasierten Replikation kann die meisten Anwendungen und Unternehmen zufriedenstellen. Mit der Verbreitung von Hochleistungs-SSDs und Gigabyte-NICs (Netzwerkschnittstellenkarten) wird die Last der Synchronisierung mehrerer Replikate verringert, was die Paxos- und Raft-Algorithmen zum Mainstream in der Branche macht.</li>
</ol>
<p>Ein Irrglaube ist, dass die konsensbasierte Replikation der Königsweg zur Erreichung der Datenkonsistenz in einer verteilten Datenbank ist. Dies entspricht jedoch nicht der Wahrheit. Die Herausforderungen in Bezug auf Verfügbarkeit, Komplexität und Leistung, mit denen konsensbasierte Algorithmen konfrontiert sind, verhindern, dass sie die perfekte Lösung darstellen.</p>
<ol>
<li><p>Kompromittierte Verfügbarkeit Der optimierte Paxos- oder Raft-Algorithmus ist stark von der führenden Replik abhängig, was mit einer schwachen Fähigkeit einhergeht, gegen graue Ausfälle zu kämpfen. Bei der konsensbasierten Replikation findet eine Neuwahl des führenden Replikats erst dann statt, wenn der führende Knoten über einen längeren Zeitraum nicht antwortet. Daher ist die konsensbasierte Replikation nicht in der Lage, Situationen zu bewältigen, in denen der führende Knoten langsam ist oder ein Thrashing auftritt.</p></li>
<li><p>Hohe Komplexität Obwohl es bereits viele erweiterte Algorithmen auf der Grundlage von Paxos und Raft gibt, erfordert das Aufkommen von <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> und <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel-Raft</a> weitere Überlegungen und Tests zur Synchronisierung zwischen Protokollen und Zustandsmaschinen.</p></li>
<li><p>Kompromittierte Leistung In einer Cloud-nativen Ära wird die lokale Speicherung durch gemeinsam genutzte Speicherlösungen wie EBS und S3 ersetzt, um die Zuverlässigkeit und Konsistenz der Daten zu gewährleisten. Infolgedessen ist die konsensbasierte Replikation für verteilte Systeme kein Muss mehr. Darüber hinaus bringt die konsensbasierte Replikation das Problem der Datenredundanz mit sich, da sowohl die Lösung als auch EBS über mehrere Replikate verfügen.</p></li>
</ol>
<p>Bei der Replikation in mehreren Rechenzentren und in mehreren Clouds beeinträchtigt das Streben nach Konsistenz nicht nur die Verfügbarkeit, sondern auch die <a href="https://en.wikipedia.org/wiki/PACELC_theorem">Latenz</a>, was zu Leistungseinbußen führt. Aus diesem Grund ist die Linearisierung für die meisten Anwendungen kein Muss für die Disaster-Toleranz in mehreren Rechenzentren.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Eine Protokollreplikationsstrategie für Cloud-native und verteilte Datenbanken<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist unbestreitbar, dass konsensbasierte Algorithmen wie Raft und Paxos immer noch von vielen OLTP-Datenbanken verwendet werden. Anhand der Beispiele des <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA-Protokolls</a>, von <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> und <a href="https://rockset.com/">Rockset</a> können wir jedoch sehen, dass sich der Trend verschiebt.</p>
<p>Es gibt zwei Hauptprinzipien für eine Lösung, die für eine Cloud-native, verteilte Datenbank am besten geeignet ist.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. Replikation als Dienst</h3><p>Ein separater Microservice für die Datensynchronisation ist erforderlich. Das Synchronisationsmodul und das Speichermodul sollten nicht mehr innerhalb desselben Prozesses eng gekoppelt sein.</p>
<p>Sokrates beispielsweise entkoppelt Speicherung, Protokollierung und Datenverarbeitung. Es gibt einen dedizierten Protokolldienst (XLog-Dienst in der Mitte der Abbildung unten).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Sokrates-Architektur</span> </span></p>
<p>Der XLog-Dienst ist ein eigenständiger Dienst. Die Datenpersistenz wird mit Hilfe eines Speichers mit niedriger Latenz erreicht. Die Landing Zone in Sokrates ist dafür zuständig, drei Replikate mit beschleunigter Geschwindigkeit zu halten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Sokrates XLog-Dienst</span> </span></p>
<p>Der Leader-Knoten verteilt die Protokolle asynchron an den Log-Broker und gibt die Daten an Xstore weiter. Ein lokaler SSD-Cache kann das Lesen der Daten beschleunigen. Nach erfolgreichem Flush der Daten können die Puffer in der Landing Zone gereinigt werden. Offensichtlich sind alle Protokolldaten in drei Schichten aufgeteilt - Landing Zone, lokale SSD und XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Das Prinzip der russischen Puppe</h3><p>Eine Möglichkeit, ein System zu entwerfen, besteht darin, das Prinzip der russischen Puppe zu befolgen: Jede Schicht ist vollständig und perfekt für die Aufgaben der Schicht geeignet, sodass andere Schichten darauf oder darum herum aufgebaut werden können.</p>
<p>Beim Entwurf einer Cloud-nativen Datenbank müssen wir andere Dienste von Drittanbietern geschickt nutzen, um die Komplexität der Systemarchitektur zu reduzieren.</p>
<p>Es scheint, als kämen wir nicht umhin, mit Paxos einen Single Point Failure zu vermeiden. Dennoch können wir die Protokollreplikation erheblich vereinfachen, indem wir die Leaderwahl an Raft oder Paxos-Dienste auf der Grundlage von <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> und <a href="https://etcd.io/">etcd</a> übergeben.</p>
<p>Die <a href="https://rockset.com/">Rockset-Architektur</a> beispielsweise folgt dem Prinzip der russischen Puppe und verwendet Kafka/Kineses für verteilte Logs, S3 für die Speicherung und einen lokalen SSD-Cache zur Verbesserung der Abfrageleistung.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Rockset-Architektur</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">Der Milvus-Ansatz</h3><p>Die abstimmbare Konsistenz in Milvus ähnelt in der Tat den Follower-Reads in der konsensbasierten Replikation. Die Follower-Read-Funktion bezieht sich auf die Verwendung von Follower-Replikaten zur Durchführung von Datenleseaufgaben unter der Prämisse einer starken Konsistenz. Ziel ist es, den Durchsatz des Clusters zu erhöhen und die Belastung des Leaders zu verringern. Der Mechanismus hinter der Follower-Read-Funktion besteht darin, den Commit-Index des letzten Protokolls abzufragen und einen Abfragedienst bereitzustellen, bis alle Daten im Commit-Index auf die Zustandsautomaten angewendet werden.</p>
<p>Bei der Entwicklung von Milvus wurde die Follower-Strategie jedoch nicht übernommen. Mit anderen Worten: Milvus fragt nicht jedes Mal den Commit-Index ab, wenn es eine Abfrage erhält. Stattdessen verwendet Milvus einen Mechanismus wie das Wasserzeichen in <a href="https://flink.apache.org/">Flink</a>, der den Abfrageknoten in regelmäßigen Abständen über den Standort des Commit-Index informiert. Der Grund für einen solchen Mechanismus ist, dass Milvus-Benutzer in der Regel keine hohen Anforderungen an die Datenkonsistenz stellen und für eine bessere Systemleistung einen Kompromiss bei der Datensichtbarkeit akzeptieren können.</p>
<p>Darüber hinaus setzt Milvus mehrere Microservices ein und trennt die Speicherung von der Datenverarbeitung. In der <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Milvus-Architektur</a> werden S3, MinIo und Azure Blob für die Speicherung verwendet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus-Architektur</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Heutzutage machen immer mehr Cloud-native Datenbanken die Protokollreplikation zu einem individuellen Service. Auf diese Weise können die Kosten für das Hinzufügen von Nur-Lese-Replikaten und heterogener Replikation reduziert werden. Die Verwendung mehrerer Microservices ermöglicht eine schnelle Nutzung der ausgereiften Cloud-basierten Infrastruktur, was bei herkömmlichen Datenbanken nicht möglich ist. Ein einzelner Protokolldienst kann sich auf die konsensbasierte Replikation stützen, aber er kann auch der Russian-Doll-Strategie folgen und verschiedene Konsistenzprotokolle zusammen mit Paxos oder Raft einsetzen, um Linearität zu erreichen.</p>
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
    </button></h2><ul>
<li>Lamport L. Paxos einfach gemacht[J]. ACM SIGACT News (Distributed Computing Column) 32, 4 (Ganze Nummer 121, Dezember 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped Replication: A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replikation in log-basierten verteilten Speichersystemen[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora: On avoiding distributed consensus for i/os, commits, and membership changes[C]//Proceedings of the 2018 International Conference on Management of Data. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates: The new sql server in the cloud[C]//Proceedings of the 2019 International Conference on Management of Data. 2019: 1743-1756.</li>
</ul>
