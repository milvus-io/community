---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Wie gleicht Milvus die Abfragelast über die Knoten aus?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  Milvus 2.0 unterstützt den automatischen Lastausgleich zwischen den
  Abfrageknoten.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog Titelbild</span> </span></p>
<p>Von <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>In früheren Blog-Artikeln haben wir nacheinander die Funktionen Deletion, Bitset und Compaction in Milvus 2.0 vorgestellt. Zum Abschluss dieser Serie möchten wir das Design hinter Load Balance, einer wichtigen Funktion im verteilten Cluster von Milvus, vorstellen.</p>
<h2 id="Implementation" class="common-anchor-header">Implementierung<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Während die Anzahl und Größe der in den Abfrageknoten gepufferten Segmente unterschiedlich ist, kann auch die Suchleistung zwischen den Abfrageknoten variieren. Der schlimmste Fall könnte eintreten, wenn einige Abfrageknoten mit der Suche nach einer großen Datenmenge ausgelastet sind, neu erstellte Abfrageknoten aber untätig bleiben, weil kein Segment an sie verteilt wird, was zu einer massiven Verschwendung von CPU-Ressourcen und einem enormen Abfall der Suchleistung führt.</p>
<p>Um solche Umstände zu vermeiden, ist der Abfragekoordinator (query coord) so programmiert, dass er die Segmente gleichmäßig auf jeden Abfrageknoten entsprechend der RAM-Nutzung der Knoten verteilt. Dadurch werden die CPU-Ressourcen gleichmäßig auf die Knoten verteilt, was die Suchleistung erheblich verbessert.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Automatischen Lastausgleich auslösen</h3><p>Gemäß dem Standardwert in der Konfiguration <code translate="no">queryCoord.balanceIntervalSeconds</code> überprüft das Abfragekoordinatensystem alle 60 Sekunden die RAM-Auslastung (in Prozent) aller Abfrageknoten. Wenn eine der folgenden Bedingungen erfüllt ist, beginnt der Abfragekoordinator, die Abfragelast auf die Abfrageknoten zu verteilen:</p>
<ol>
<li>Die RAM-Auslastung eines beliebigen Abfrageknotens im Cluster ist größer als <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (Standard: 90);</li>
<li>Oder der absolute Wert des Unterschieds zwischen der RAM-Nutzung von zwei beliebigen Abfrageknoten ist größer als <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (Standard: 30).</li>
</ol>
<p>Nachdem die Segmente vom Quellabfrageknoten zum Zielabfrageknoten übertragen wurden, sollten sie auch die beiden folgenden Bedingungen erfüllen:</p>
<ol>
<li>Der RAM-Verbrauch des Ziel-Abfrageknotens ist nicht größer als <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (Standardwert: 90);</li>
<li>Der absolute Wert der Differenz zwischen der RAM-Nutzung des Quell- und des Ziel-Abfrageknotens ist nach dem Lastausgleich geringer als vor dem Lastausgleich.</li>
</ol>
<p>Wenn die oben genannten Bedingungen erfüllt sind, fährt das Abfragekoordinatensystem fort, die Abfragelast auf die Knoten zu verteilen.</p>
<h2 id="Load-balance" class="common-anchor-header">Lastausgleich<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn der Lastausgleich ausgelöst wird, lädt der Abfragekoordinator zunächst das/die Zielsegment(e) in den Zielabfrageknoten. Beide Abfrageknoten geben bei jeder Suchanfrage zu diesem Zeitpunkt Suchergebnisse aus dem/den Zielsegment(en) zurück, um die Vollständigkeit des Ergebnisses zu gewährleisten.</p>
<p>Nachdem der Zielabfrageknoten das Zielsegment erfolgreich geladen hat, veröffentlicht der Abfragekoordinator eine <code translate="no">sealedSegmentChangeInfo</code> an den Abfragekanal. Wie unten dargestellt, geben <code translate="no">onlineNodeID</code> und <code translate="no">onlineSegmentIDs</code> den Abfrageknoten an, der das Segment lädt bzw. das geladene Segment, und <code translate="no">offlineNodeID</code> und <code translate="no">offlineSegmentIDs</code> geben den Abfrageknoten an, der das Segment freigeben muss bzw. das freizugebende Segment.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Nach Erhalt der <code translate="no">sealedSegmentChangeInfo</code> gibt der Quell-Abfrageknoten das Zielsegment frei.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Lastausgleichs-Workflow</span> </span></p>
<p>Der gesamte Prozess ist erfolgreich, wenn der Quellabfrageknoten das Zielsegment freigibt. Damit ist die Abfragelast über die Abfrageknoten hinweg ausgeglichen, d. h. die RAM-Nutzung aller Abfrageknoten ist nicht größer als <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, und der absolute Wert der Differenz zwischen der RAM-Nutzung des Quell- und des Zielabfrageknotens ist nach dem Lastausgleich geringer als vor dem Lastausgleich.</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Blog zur Serie der neuen Funktionen 2.0 wollen wir das Design der neuen Funktionen erklären. Lesen Sie mehr in dieser Blogserie!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Wie Milvus Streaming-Daten in einem verteilten Cluster löscht</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Wie verdichtet man Daten in Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Wie gleicht Milvus die Abfragelast über die Knoten aus?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Wie Bitset die Vielseitigkeit der vektoriellen Ähnlichkeitssuche ermöglicht</a></li>
</ul>
<p>Dies ist das Finale der Blogserie zu den neuen Funktionen von Milvus 2.0. Im Anschluss an diese Serie planen wir eine neue Serie von Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, in der die grundlegende Architektur von Milvus 2.0 vorgestellt wird. Bitte bleiben Sie auf dem Laufenden.</p>
