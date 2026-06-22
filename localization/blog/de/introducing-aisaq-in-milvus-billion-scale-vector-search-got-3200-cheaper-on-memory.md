---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Vorstellung von AISAQ in Milvus: Die Vektorsuche im Milliardenbereich ist nun
  3.200-mal speichersparender geworden
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Erfahren Sie, wie Milvus mit AISAQ die Speicherkosten um das 3200-Fache senkt
  und so eine skalierbare Suche in Milliarden von Vektoren ohne DRAM-Overhead
  ermöglicht.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Vektordatenbanken sind zur zentralen Infrastruktur für geschäftskritische KI-Systeme geworden, und ihre Datenmengen wachsen exponentiell – oft bis in die Milliarden von Vektoren. In dieser Größenordnung wird alles schwieriger: die Aufrechterhaltung geringer Latenzzeiten, die Wahrung der Genauigkeit, die Gewährleistung der Zuverlässigkeit sowie der Betrieb über Replikate und Regionen hinweg. Eine Herausforderung tritt jedoch meist schon früh zutage und bestimmt die architektonischen Entscheidungen maßgeblich:<strong>die KOSTEN.</strong></p>
<p>Um eine schnelle Suche zu ermöglichen, speichern die meisten Vektordatenbanken wichtige Indizierungsstrukturen im DRAM (Dynamic Random Access Memory), der schnellsten und teuersten Speicherebene. Dieses Design ist zwar leistungsstark, lässt sich jedoch nur schlecht skalieren. Der DRAM-Verbrauch skaliert eher mit der Datengröße als mit dem Abfrageaufkommen, und selbst bei Komprimierung oder teilweiser Auslagerung auf SSD müssen große Teile des Indexes im Speicher verbleiben. Mit wachsenden Datensätzen werden die Speicherkosten schnell zu einem begrenzenden Faktor.</p>
<p>Milvus unterstützt bereits <strong>DISKANN</strong>, einen festplattenbasierten ANN-Ansatz, der den Speicherbedarf senkt, indem ein Großteil des Indexes auf SSDs verlagert wird. Allerdings ist DISKANN für die bei der Suche verwendeten komprimierten Darstellungen weiterhin auf DRAM angewiesen. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> geht mit <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, einem von <a href="https://milvus.io/docs/diskann.md">DISKANN</a> inspirierten festplattenbasierten Vektorindex, noch einen Schritt weiter. Die von KIOXIA entwickelte Architektur von AiSAQ basiert auf einer „Zero-DRAM-Footprint-Architektur“, die alle für die Suche kritischen Daten auf der Festplatte speichert und die Datenplatzierung optimiert, um E/A-Vorgänge zu minimieren. Bei einer Workload mit einer Milliarde Vektoren reduziert dies den Speicherbedarf von <strong>32 GB auf etwa 10 MB</strong>– eine <strong>Reduzierung um das 3.200-Fache</strong>–, während die praktische Leistung erhalten bleibt.</p>
<p>In den folgenden Abschnitten erläutern wir, wie die graphbasierte Vektorsuche funktioniert, woher die Speicherkosten stammen und wie AiSAQ die Kostenkurve für die Vektorsuche im Milliardenbereich neu gestaltet.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">So funktioniert die herkömmliche graphbasierte Vektorsuche<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die Vektorsuche</strong> ist der Prozess des Auffindens von Datenpunkten, deren numerische Darstellungen einer Abfrage in einem hochdimensionalen Raum am nächsten liegen. „Am nächsten“ bedeutet einfach den kleinsten Abstand gemäß einer Abstandsfunktion, wie beispielsweise dem Kosinusabstand oder dem L2-Abstand. Im kleinen Maßstab ist dies unkompliziert: Man berechnet den Abstand zwischen der Abfrage und jedem Vektor und gibt dann die nächstgelegenen zurück. Im großen Maßstab, etwa im Milliardenbereich, wird dieser Ansatz jedoch schnell zu langsam, um praktikabel zu sein.</p>
<p>Um erschöpfende Vergleiche zu vermeiden, stützen sich moderne Systeme zur approximativen Suche nach dem nächsten Nachbarn (ANNS) auf <strong>graphbasierte Indizes</strong>. Anstatt eine Abfrage mit jedem Vektor zu vergleichen, organisiert der Index die Vektoren in einem <strong>Graphen</strong>. Jeder Knoten repräsentiert einen Vektor, und Kanten verbinden Vektoren, die numerisch nahe beieinander liegen. Diese Struktur ermöglicht es dem System, den Suchraum drastisch einzugrenzen.</p>
<p>Der Graph wird im Voraus erstellt und basiert ausschließlich auf den Beziehungen zwischen den Vektoren. Er ist unabhängig von Suchanfragen. Wenn eine Suchanfrage eingeht, besteht die Aufgabe des Systems darin, <strong>den Graphen effizient zu durchlaufen</strong> und die Vektoren mit dem geringsten Abstand zur Suchanfrage zu identifizieren – ohne den gesamten Datensatz zu durchsuchen.</p>
<p>Die Suche beginnt an einem vordefinierten <strong>Einstiegspunkt</strong> im Graphen. Dieser Startpunkt kann weit von der Abfrage entfernt sein, doch der Algorithmus verbessert seine Position Schritt für Schritt, indem er sich auf Vektoren zubewegt, die näher an der Abfrage zu liegen scheinen. Während dieses Prozesses verwaltet die Suche zwei interne Datenstrukturen, die zusammenwirken: eine <strong>Kandidatenliste</strong> und eine <strong>Ergebnisliste</strong>.</p>
<p>Die beiden wichtigsten Schritte in diesem Prozess sind die Erweiterung der Kandidatenliste und die Aktualisierung der Ergebnisliste.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Erweiterung der Kandidatenliste</h3><p>Die <strong>Kandidatenliste</strong> gibt an, wohin die Suche als Nächstes führen kann. Es handelt sich um eine nach Priorität geordnete Menge von Graphenknoten, die aufgrund ihrer Entfernung zur Abfrage vielversprechend erscheinen.</p>
<p>Bei jeder Iteration führt der Algorithmus Folgendes aus:</p>
<ul>
<li><p><strong>den bisher entdeckten nächstgelegenen Kandidaten aus.</strong> Aus der Kandidatenliste wählt er den Vektor mit dem geringsten Abstand zur Suchanfrage aus.</p></li>
<li><p><strong>ruft die Nachbarn dieses Vektors aus dem Graphen ab.</strong> Diese Nachbarn sind Vektoren, die bei der Indexerstellung als dem aktuellen Vektor nahe liegend identifiziert wurden.</p></li>
<li><p><strong>Er bewertet noch nicht besuchte Nachbarn und fügt sie der Kandidatenliste hinzu.</strong> Für jeden Nachbarn, der noch nicht untersucht wurde, berechnet der Algorithmus dessen Abstand zur Abfrage. Zuvor besuchte Nachbarn werden übersprungen, während neue Nachbarn in die Kandidatenliste aufgenommen werden, wenn sie vielversprechend erscheinen.</p></li>
</ul>
<p>Durch die wiederholte Erweiterung der Kandidatenliste erkundet die Suche zunehmend relevantere Bereiche des Graphen. So kann sich der Algorithmus stetig auf bessere Antworten zubewegen, während er nur einen kleinen Teil aller Vektoren untersucht.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Aktualisierung der Ergebnisliste</h3><p>Gleichzeitig führt der Algorithmus eine <strong>Ergebnisliste</strong>, in der die bisher besten Kandidaten für die endgültige Ausgabe erfasst werden. Im Verlauf der Suche:</p>
<ul>
<li><p><strong>Erfasst die nächstgelegenen Vektoren, auf die er während der Durchquerung stößt.</strong> Dazu gehören sowohl Vektoren, die zur Erweiterung ausgewählt wurden, als auch andere, die im Verlauf der Suche ausgewertet wurden.</p></li>
<li><p><strong>Speichert deren Abstände zur Abfrage.</strong> Dies ermöglicht es, Kandidaten zu ordnen und die aktuellen Top-K-Nächsten Nachbarn zu verwalten.</p></li>
</ul>
<p>Im Laufe der Zeit, wenn immer mehr Kandidaten ausgewertet und immer weniger Verbesserungen gefunden werden, stabilisiert sich die Ergebnisliste. Sobald es unwahrscheinlich ist, dass eine weitere Erkundung des Graphen näher liegende Vektoren hervorbringt, wird die Suche beendet und die Ergebnisliste als endgültiges Ergebnis zurückgegeben.</p>
<p>Einfach ausgedrückt: Die <strong>Kandidatenliste steuert die Erkundung</strong>, während die <strong>Ergebnisliste die bisher gefundenen besten Antworten erfasst</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Der Kompromiss bei der graphbasierten Vektorsuche<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser graphbasierte Ansatz ist es, der die groß angelegte Vektorsuche überhaupt erst praktikabel macht. Indem das System den Graphen durchläuft, anstatt jeden Vektor einzeln zu scannen, kann es qualitativ hochwertige Ergebnisse finden, während es nur einen kleinen Teil des Datensatzes durchläuft.</p>
<p>Diese Effizienz hat jedoch ihren Preis. Die graphbasierte Suche bringt einen grundlegenden Kompromiss zwischen <strong>Genauigkeit und Aufwand</strong> mit sich <strong>.</strong></p>
<ul>
<li><p>Die Erkundung weiterer Nachbarn verbessert die Genauigkeit, da ein größerer Teil des Graphen abgedeckt wird und die Wahrscheinlichkeit sinkt, echte nächste Nachbarn zu übersehen.</p></li>
<li><p>Gleichzeitig bedeutet jede zusätzliche Erweiterung mehr Aufwand: mehr Abstandsberechnungen, mehr Zugriffe auf die Graphstruktur und mehr Lesevorgänge von Vektordaten. Je tiefer oder weiter die Suche voranschreitet, desto mehr summieren sich diese Kosten. Je nach Gestaltung des Indexes äußern sie sich in einer höheren CPU-Auslastung, erhöhtem Speicherbedarf oder zusätzlichem Festplatten-I/O.</p></li>
</ul>
<p>Das Gleichgewicht zwischen diesen gegensätzlichen Faktoren – hoher Recall gegenüber effizienter Ressourcennutzung – ist von zentraler Bedeutung für das Design graphbasierter Suchverfahren.</p>
<p>Sowohl <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> als auch <strong>AISAQ</strong> basieren auf diesem Spannungsfeld, treffen jedoch unterschiedliche architektonische Entscheidungen darüber, wie und wo diese Kosten getragen werden.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Wie DISKANN die festplattenbasierte Vektorsuche optimiert<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN ist die bislang einflussreichste festplattenbasierte ANN-Lösung und dient als offizielle Basis für den NeurIPS Big ANN-Wettbewerb, einen globalen Maßstab für die Vektorsuche im Milliardenbereich. Ihre Bedeutung liegt nicht nur in der Leistung, sondern auch in dem, was sie bewiesen hat: <strong>Eine graphbasierte ANN-Suche muss nicht vollständig im Arbeitsspeicher stattfinden, um schnell zu sein</strong>.</p>
<p>Durch die Kombination von SSD-basiertem Speicher mit sorgfältig ausgewählten In-Memory-Strukturen hat DISKANN gezeigt, dass die Vektorsuche in großem Maßstab auf handelsüblicher Hardware eine hohe Genauigkeit und geringe Latenz erreichen kann – ohne dass dafür enorme DRAM-Ressourcen erforderlich sind. Dies wird erreicht, indem neu überdacht wird, <em>welche Teile der Suche schnell sein müssen</em> und <em>welche Teile einen langsameren Zugriff tolerieren können</em>.</p>
<p><strong>Auf einer übergeordneten Ebene hält DISKANN die am häufigsten abgerufenen Daten im Arbeitsspeicher, während größere, seltener abgerufene Strukturen auf die Festplatte verlagert werden.</strong> Dieses Gleichgewicht wird durch mehrere zentrale Designentscheidungen erreicht.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Verwendung von PQ-Abständen zur Erweiterung der Kandidatenliste</h3><p>Die Erweiterung der Kandidatenliste ist die häufigste Operation bei der graphbasierten Suche. Jede Erweiterung erfordert die Schätzung des Abstands zwischen dem Abfragevektor und den Nachbarn eines Kandidatenknotens. Die Durchführung dieser Berechnungen mit vollständigen, hochdimensionalen Vektoren würde häufige zufällige Lesezugriffe von der Festplatte erfordern – ein sowohl rechnerisch als auch in Bezug auf die E/A-Leistung aufwendiger Vorgang.</p>
<p>DISKANN vermeidet diesen Aufwand, indem es Vektoren in <strong>Product-Quantization-Codes (PQ-Codes)</strong> komprimiert und im Arbeitsspeicher hält. PQ-Codes sind wesentlich kleiner als vollständige Vektoren, bewahren aber dennoch genügend Informationen, um den Abstand annähernd zu schätzen.</p>
<p>Während der Erweiterung der Kandidatenliste berechnet DISKANN die Abstände anhand dieser im Speicher befindlichen PQ-Codes, anstatt vollständige Vektoren von der SSD zu lesen. Dies reduziert die Festplatten-E/A während der Graphdurchquerung drastisch und ermöglicht es der Suche, Kandidaten schnell und effizient zu erweitern, während der Großteil des SSD-Datenverkehrs vom kritischen Pfad ferngehalten wird.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Gemeinsame Speicherung von vollständigen Vektoren und Nachbarlisten auf der Festplatte</h3><p>Nicht alle Daten lassen sich komprimieren oder annähernd abrufen. Sobald vielversprechende Kandidaten identifiziert wurden, benötigt die Suche für genaue Ergebnisse weiterhin Zugriff auf zwei Arten von Daten:</p>
<ul>
<li><p><strong>Nachbarlisten</strong>, um die Graphdurchquerung fortzusetzen</p></li>
<li><p><strong>Vollständige (unkomprimierte) Vektoren</strong> für die abschließende Neureihung</p></li>
</ul>
<p>Auf diese Strukturen wird seltener zugegriffen als auf PQ-Codes, daher speichert DISKANN sie auf der SSD. Um den Festplatten-Overhead zu minimieren, platziert DISKANN die Nachbarliste jedes Knotens und dessen vollständigen Vektor im selben physischen Bereich auf der Festplatte. Dadurch wird sichergestellt, dass beide mit einem einzigen SSD-Lesevorgang abgerufen werden können.</p>
<p>Durch die gemeinsame Speicherung verwandter Daten reduziert DISKANN die Anzahl der während der Suche erforderlichen zufälligen Festplattenzugriffe. Diese Optimierung verbessert sowohl die Effizienz der Erweiterung als auch der Neureihung, insbesondere im großen Maßstab.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Parallele Knotenerweiterung für eine bessere SSD-Auslastung</h3><p>Die graphbasierte ANN-Suche ist ein iterativer Prozess. Wenn bei jeder Iteration nur ein Kandidatenknoten erweitert wird, führt das System jeweils nur einen einzigen Lesevorgang auf der Festplatte durch, wodurch der Großteil der parallelen Bandbreite der SSD ungenutzt bleibt. Um diese Ineffizienz zu vermeiden, erweitert DISKANN in jeder Iteration mehrere Kandidaten und sendet parallele Leseanfragen an die SSD. Dieser Ansatz nutzt die verfügbare Bandbreite wesentlich besser aus und reduziert die Gesamtzahl der erforderlichen Iterationen.</p>
<p>Der Parameter <strong>„beam_width_ratio“</strong> steuert, wie viele Kandidaten parallel erweitert werden: <strong>Suchbreite = Anzahl der CPU-Kerne × beam_width_ratio.</strong> Ein höherer Wert erweitert die Suche – was potenziell die Genauigkeit verbessert –, erhöht jedoch auch den Rechenaufwand und die Festplatten-E/A.</p>
<p>Um dem entgegenzuwirken, führt DISKANN einen „ <code translate="no">search_cache_budget_gb_ratio</code> “ ein, der Speicherplatz für häufig abgerufene Daten reserviert und so wiederholte Lesevorgänge auf der SSD reduziert. Zusammen tragen diese Mechanismen dazu bei, dass DISKANN ein Gleichgewicht zwischen Genauigkeit, Latenz und E/A-Effizienz herstellt.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Warum dies wichtig ist – und wo die Grenzen liegen</h3><p>Das Design von DISKANN ist ein großer Fortschritt für die festplattenbasierte Vektorsuche. Indem PQ-Codes im Arbeitsspeicher gehalten und größere Strukturen auf die SSD ausgelagert werden, wird der Speicherbedarf im Vergleich zu vollständig im Arbeitsspeicher befindlichen Graphenindizes deutlich reduziert.</p>
<p>Gleichzeitig ist diese Architektur für suchkritische Daten weiterhin auf <strong>einen ständig aktiven DRAM</strong> angewiesen. PQ-Codes, Caches und Kontrollstrukturen müssen im Speicher verbleiben, um eine effiziente Durchquerung zu gewährleisten. Wenn Datensätze auf Milliarden von Vektoren anwachsen und bei Bereitstellungen Replikate oder Regionen hinzukommen, kann dieser Speicherbedarf dennoch zu einem begrenzenden Faktor werden.</p>
<p>Genau diese Lücke soll <strong>AISAQ</strong> schließen.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Wie AISAQ funktioniert und warum es wichtig ist<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ baut direkt auf den Kernideen von DISKANN auf, führt jedoch eine entscheidende Neuerung ein: Es macht <strong>es überflüssig, PQ-Daten im DRAM zu halten</strong>. Anstatt komprimierte Vektoren als suchkritische, stets im Speicher befindliche Strukturen zu behandeln, verlagert AISAQ sie auf SSDs und gestaltet die Anordnung der Graphdaten auf der Festplatte neu, um eine effiziente Durchquerung zu gewährleisten.</p>
<p>Damit dies funktioniert, reorganisiert AISAQ die Speicherung der Knoten so, dass die bei der Graphensuche benötigten Daten – vollständige Vektoren, Nachbarlisten und PQ-Informationen – auf der Festplatte in Mustern angeordnet werden, die für die Zugriffslokalität optimiert sind. Das Ziel besteht nicht nur darin, mehr Daten auf die kostengünstigere Festplatte zu verlagern, sondern dies zu tun, <strong>ohne den zuvor beschriebenen Suchprozess zu beeinträchtigen</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um unterschiedlichen Anwendungsanforderungen gerecht zu werden, bietet AISAQ zwei festplattenbasierte Speichermodi an: „Performance“ und „Scale“. Aus technischer Sicht unterscheiden sich diese Modi in erster Linie darin, wie PQ-komprimierte Daten gespeichert und während der Suche abgerufen werden. Aus Anwendungssicht erfüllen diese Modi zwei unterschiedliche Arten von Anforderungen: Anforderungen an geringe Latenz, wie sie typisch für semantische Online-Such- und Empfehlungssysteme sind, sowie Anforderungen an extrem hohe Skalierbarkeit, wie sie typisch für RAG sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-Performance: Optimiert für Geschwindigkeit</h3><p>AISAQ-Performance speichert alle Daten auf Festplatte und sorgt durch Datenkolokation für einen geringen I/O-Overhead.</p>
<p>In diesem Modus:</p>
<ul>
<li><p>Der vollständige Vektor jedes Knotens, die Kantenliste und die PQ-Codes seiner Nachbarn werden gemeinsam auf der Festplatte gespeichert.</p></li>
<li><p>Der Zugriff auf einen Knoten erfordert weiterhin nur einen <strong>einzigen SSD-Lesevorgang</strong>, da alle für die Erweiterung und Bewertung der Kandidaten benötigten Daten an einem Ort gespeichert sind.</p></li>
</ul>
<p>Aus Sicht des Suchalgorithmus entspricht dies weitgehend dem Zugriffsmuster von DISKANN. Die Kandidatenausweitung bleibt effizient, und die Laufzeitleistung ist vergleichbar, obwohl sich nun alle für die Suche kritischen Daten auf der Festplatte befinden.</p>
<p>Der Kompromiss besteht im Speicher-Overhead. Da die PQ-Daten eines Nachbarn in den Festplattenseiten mehrerer Knoten vorkommen können, führt dieses Layout zu Redundanzen und erhöht die Gesamtgröße des Indexes erheblich.</p>
<p>Daher priorisiert der AISAQ-Performance-Modus eine niedrige I/O-Latenz gegenüber der Festplatteneffizienz. Aus Anwendungssicht kann der AISAQ-Performance-Modus eine Latenz im Bereich von 10 ms liefern, wie sie für die semantische Online-Suche erforderlich ist.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale: Optimiert für Speichereffizienz</h3><p>AISAQ-Scale verfolgt den gegenteiligen Ansatz. Er ist darauf ausgelegt, <strong>die Festplattenauslastung zu minimieren</strong> und gleichzeitig alle Daten auf SSDs zu belassen.</p>
<p>In diesem Modus:</p>
<ul>
<li><p>werden PQ-Daten separat und ohne Redundanz auf der Festplatte gespeichert.</p></li>
<li><p>Dadurch wird Redundanz vermieden und die Indexgröße drastisch reduziert.</p></li>
</ul>
<p>Der Nachteil ist, dass der Zugriff auf die PQ-Codes eines Knotens und seiner Nachbarn möglicherweise <strong>mehrere SSD-Lesevorgänge</strong> erfordert, was die Anzahl der E/A-Operationen während der Kandidatenausweitung erhöht. Ohne Optimierung würde dies die Suche erheblich verlangsamen.</p>
<p>Um diesen Overhead zu kontrollieren, führt der AISAQ-Scale-Modus zwei zusätzliche Optimierungen ein:</p>
<ul>
<li><p><strong>Die Neuanordnung der PQ-Daten</strong>, bei der PQ-Vektoren nach Zugriffspriorität sortiert werden, um die Lokalität zu verbessern und zufällige Lesevorgänge zu reduzieren.</p></li>
<li><p>Ein <strong>PQ-Cache im DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), der häufig abgerufene PQ-Daten speichert und wiederholte Festplattenzugriffe für häufig genutzte Einträge vermeidet.</p></li>
</ul>
<p>Mit diesen Optimierungen erreicht der AISAQ-Scale-Modus eine deutlich bessere Speichereffizienz als AISAQ-Performance, bei gleichbleibender praktischer Suchleistung. Diese Leistung bleibt zwar hinter der von DISKANN zurück, jedoch entsteht kein Speicher-Overhead (die Indexgröße ist vergleichbar mit DISKANN) und der Speicherbedarf ist deutlich geringer. Aus Anwendungssicht bietet AiSAQ die Möglichkeit, RAG-Anforderungen in extrem großem Maßstab zu erfüllen.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Wichtige Vorteile von AISAQ</h3><p>Durch die Verlagerung aller suchrelevanten Daten auf die Festplatte und die Neugestaltung des Zugriffs auf diese Daten verändert AISAQ das Kosten- und Skalierbarkeitsprofil der graphbasierten Vektorsuche grundlegend. Sein Design bietet drei wesentliche Vorteile.</p>
<p><strong>1. Bis zu 3.200-mal geringerer DRAM-Verbrauch</strong></p>
<p>Die Produktquantisierung reduziert die Größe hochdimensionaler Vektoren erheblich, doch im Milliardenbereich ist der Speicherbedarf nach wie vor beträchtlich. Selbst nach der Komprimierung müssen PQ-Codes bei herkömmlichen Designs während der Suche im Speicher verbleiben.</p>
<p>Beispielsweise benötigen bei <strong>SIFT1B</strong>, einem Benchmark mit einer Milliarde 128-dimensionaler Vektoren, allein die PQ-Codes je nach Konfiguration etwa <strong>30–120 GB DRAM</strong>. Das Speichern der vollständigen, unkomprimierten Vektoren würde zusätzlich <strong> etwa 480 GB</strong> erfordern. Zwar reduziert PQ den Speicherbedarf um das 4- bis 16-Fache, doch ist der verbleibende Speicherbedarf immer noch groß genug, um die Infrastrukturkosten maßgeblich zu beeinflussen.</p>
<p>AISAQ beseitigt diesen Bedarf vollständig. Durch die Speicherung der PQ-Codes auf einer SSD anstelle von DRAM wird kein Speicherplatz mehr durch persistente Indexdaten belegt. DRAM wird nur noch für leichtgewichtige, vorübergehende Strukturen wie Kandidatenlisten und Steuermetadaten verwendet. In der Praxis reduziert dies den Speicherbedarf von mehreren zehn Gigabyte auf <strong>etwa 10 MB</strong>. In einer repräsentativen Konfiguration im Milliardenbereich sinkt der DRAM-Bedarf von <strong>32 GB auf 10 MB</strong>, was einer <strong>Reduzierung um das 3.200-Fache</strong> entspricht.</p>
<p>Da die Speicherkosten für SSDs im Vergleich zu DRAM etwa <strong>1/30 des Preises pro Kapazitätseinheit</strong> betragen, hat diese Umstellung direkte und erhebliche Auswirkungen auf die Gesamtsystemkosten.</p>
<p><strong>2. Kein zusätzlicher E/A-Overhead</strong></p>
<p>Das Verschieben von PQ-Codes vom Speicher auf die Festplatte würde normalerweise die Anzahl der E/A-Vorgänge während der Suche erhöhen. AISAQ vermeidet dies durch eine sorgfältige Steuerung <strong>des Datenlayouts und der Zugriffsmuster</strong>. Anstatt verwandte Daten über die Festplatte zu verstreuen, ordnet AISAQ PQ-Codes, vollständige Vektoren und Nachbarlisten an einander an, sodass sie gemeinsam abgerufen werden können. Dadurch wird sichergestellt, dass die Kandidatenausweitung keine zusätzlichen zufälligen Lesevorgänge verursacht.</p>
<p>Um den Benutzern die Kontrolle über den Kompromiss zwischen Indexgröße und E/A-Effizienz zu geben, führt AISAQ den Parameter „ <code translate="no">inline_pq</code> “ ein, der bestimmt, wie viele PQ-Daten inline mit jedem Knoten gespeichert werden:</p>
<ul>
<li><p><strong>Niedrigerer „inline_pq“-Wert:</strong> kleinere Indexgröße, erfordert jedoch möglicherweise zusätzliche E/A-Vorgänge</p></li>
<li><p><strong>Höherer „inline_pq“-Wert:</strong> größere Indexgröße, bewahrt jedoch den Zugriff mit einem einzigen Lesevorgang</p></li>
</ul>
<p>Bei der Konfiguration mit <strong>`inline_pq = max_degree</strong>` liest AISAQ den vollständigen Vektor eines Knotens, die Nachbarliste und alle PQ-Codes in einem einzigen Festplattenzugriff aus, was dem E/A-Muster von DISKANN entspricht und gleichzeitig alle Daten auf der SSD belässt.</p>
<p><strong>3. Sequenzieller PQ-Zugriff verbessert die Recheneffizienz</strong></p>
<p>In DISKANN erfordert das Erweitern eines Kandidatenknotens R zufällige Speicherzugriffe, um die PQ-Codes seiner R Nachbarn abzurufen. AISAQ beseitigt diese Zufälligkeit, indem alle PQ-Codes in einem einzigen I/O-Vorgang abgerufen und sequenziell auf der Festplatte gespeichert werden.</p>
<p>Das sequenzielle Layout bietet zwei wichtige Vorteile:</p>
<ul>
<li><p><strong>Sequentielle SSD-Lesevorgänge sind wesentlich schneller</strong> als verstreute zufällige Lesevorgänge.</p></li>
<li><p><strong>Zusammenhängende Daten sind cachefreundlicher</strong>, wodurch CPUs PQ-Abstände effizienter berechnen können.</p></li>
</ul>
<p>Dies verbessert sowohl die Geschwindigkeit als auch die Vorhersagbarkeit der PQ-Abstandsberechnungen und hilft, die Leistungseinbußen auszugleichen, die durch die Speicherung der PQ-Codes auf einer SSD statt im DRAM entstehen.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: Leistungsbewertung<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir verstanden haben, wie sich AISAQ architektonisch von DISKANN unterscheidet, stellt sich als Nächstes die naheliegende Frage: <strong>Wie wirken sich diese Designentscheidungen in der Praxis auf die Leistung und die Ressourcennutzung aus?</strong> Diese Bewertung vergleicht AISAQ und DISKANN anhand von drei Dimensionen <strong>,</strong> die im Milliardenmaßstab am wichtigsten sind: <strong>Suchleistung, Speicherverbrauch und Festplattennutzung</strong>.</p>
<p>Insbesondere untersuchen wir, wie sich AISAQ verhält, wenn sich die Menge der inline-gespeicherten PQ-Daten (<code translate="no">INLINE_PQ</code>) ändert. Dieser Parameter steuert direkt den Kompromiss zwischen Indexgröße, Festplatten-I/O und Laufzeiteffizienz. Außerdem bewerten wir beide Ansätze bei <strong>niedrig- und hochdimensionalen Vektor-Workloads, da die Dimensionalität die Kosten der Abstandsberechnung und</strong> die Speicheranforderungen <strong>stark beeinflusst</strong>.</p>
<h3 id="Setup" class="common-anchor-header">Versuchsaufbau</h3><p>Alle Experimente wurden auf einem Ein-Knoten-System durchgeführt, um das Indexverhalten zu isolieren und Störungen durch Netzwerk- oder verteilte Systemeffekte zu vermeiden.</p>
<p><strong>Hardwarekonfiguration:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P CPU mit 2,70 GHz</p></li>
<li><p>Arbeitsspeicher: Geschwindigkeit: 3200 MT/s, Typ: DDR4, Größe: 384 GB</p></li>
<li><p>Festplatte: KIOXIA CM7 7,68 TB<sup>NVMe™</sup> SSD</p></li>
</ul>
<p><h6><em>AMD EPYC ist eine Marke von Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe ist eine eingetragene oder nicht eingetragene Marke von NVM Express, Inc. in den Vereinigten Staaten und anderen Ländern.</em></h6></p>
<p><strong>Parameter für die Indexerstellung</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Abfrageparameter</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Benchmark-Methode</h3><p>Sowohl DISKANN als auch AISAQ wurden mit <a href="https://milvus.io/docs/knowhere.md">Knowhere</a> getestet, der in Milvus verwendeten Open-Source-Vektorsuchmaschine. Bei dieser Bewertung kamen zwei Datensätze zum Einsatz:</p>
<ul>
<li><p><strong>SIFT128D (1 Mio. Vektoren):</strong> ein bekannter 128-dimensionaler Benchmark, der häufig für die Suche nach Bilddeskriptoren verwendet wird. <em>(Größe des Rohdatensatzes ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1 Mio. Vektoren):</strong> ein 768-dimensionales Einbettungsset, das typisch für die transformatorbasierte semantische Suche ist. <em>(Größe des Rohdatensatzes ≈ 2930 MB)</em></p></li>
</ul>
<p>Diese Datensätze spiegeln zwei unterschiedliche Szenarien aus der Praxis wider: kompakte Bildmerkmale und große semantische Einbettungen.</p>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p><strong>Sift128D1M (Vollvektor ~488 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Diagramm: SIFT-Recall vs. Latenz</span>
  
 </span></p>
<p><strong>Cohere768D1M (Vollvektor ~2930 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Diagramm: Recall vs. Latenz bei Cohere</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Analyse</h3><p><strong>SIFT128D-Datensatz</strong></p>
<p>Auf dem SIFT128D-Datensatz kann AISAQ die Leistung von DISKANN erreichen, wenn alle PQ-Daten so inline geladen werden, dass die von jedem Knoten benötigten Daten vollständig in eine einzelne 4-KB-SSD-Seite passen (INLINE_PQ = 48). Bei dieser Konfiguration befinden sich alle während der Suche benötigten Informationen am selben Ort:</p>
<ul>
<li><p>Vollvektor: 512 B</p></li>
<li><p>Nachbarliste: 48 × 4 + 4 = 196 B</p></li>
<li><p>PQ-Codes der Nachbarn: 48 × (512 B × 0,125) ≈ 3072 B</p></li>
<li><p>Gesamt: 3780 B</p></li>
</ul>
<p>Da der gesamte Knoten auf eine Seite passt, ist pro Zugriff nur ein I/O-Vorgang erforderlich, und AISAQ vermeidet zufällige Lesezugriffe auf externe PQ-Daten.</p>
<p>Wenn jedoch nur ein Teil der PQ-Daten inline gespeichert ist, müssen die verbleibenden PQ-Codes von einer anderen Stelle auf der Festplatte abgerufen werden (der Parameter `inline_pq` wurde zur Optimierung der SSD-Seitenauslastung eingestellt; beispielsweise ermöglicht `inline_pq = 20`, dass zwei Knoten in eine einzige 4-KB-Seite passen). Dies führt zu zusätzlichen zufälligen E/A-Vorgängen, die den IOPS-Bedarf stark erhöhen und zu einem Leistungsabfall führen.</p>
<p><strong>Cohere768D-Datensatz</strong></p>
<p>Beim Cohere768D-Datensatz schneidet AISAQ um ca. 8 % schlechter ab als DISKANN. Der Grund dafür ist, dass ein 768-dimensionaler Vektor einfach nicht in eine 4-KB-SSD-Seite passt:</p>
<ul>
<li><p>Gesamtvektor: 3072 B</p></li>
<li><p>Nachbarliste: 48 × 4 + 4 = 196 B</p></li>
<li><p>PQ-Codes der Nachbarn: 48 × (3072 B × 0,04167) ≈ 6.144 B</p></li>
<li><p>Gesamt: 9.412 B (≈ 3 Seiten)</p></li>
</ul>
<p>In diesem Fall erstreckt sich jeder Knoten über mehrere Seiten, selbst wenn alle PQ-Codes inline gespeichert werden. Während die Anzahl der E/A-Operationen konstant bleibt, muss bei jeder E/A-Operation weitaus mehr Daten übertragen werden, wodurch die SSD-Bandbreite viel schneller aufgebraucht wird. Sobald die Bandbreite zum begrenzenden Faktor wird, kann AISAQ nicht mehr mit DISKANN mithalten – insbesondere bei hochdimensionalen Workloads, bei denen der Datenumfang pro Knoten schnell ansteigt.</p>
<p><strong>Hinweis:</strong></p>
<p>Das Speicherlayout von AISAQ vergrößert die Indexgröße auf der Festplatte in der Regel um <strong>das 3- bis 5-Fache</strong>. Dies ist ein bewusster Kompromiss: Vollvektoren, Nachbarlisten und PQ-Codes werden auf der Festplatte zusammen gespeichert, um während der Suche einen effizienten Zugriff auf einzelne Seiten zu ermöglichen. Dies erhöht zwar die SSD-Auslastung, doch ist Festplattenkapazität deutlich kostengünstiger als DRAM und lässt sich bei großen Datenmengen leichter skalieren.</p>
<p>In der Praxis können Anwender diesen Kompromiss durch Anpassung der Kompressionsverhältnisse für „ <code translate="no">INLINE_PQ</code> “ und PQ-Kompression optimieren. Diese Parameter ermöglichen es, Suchleistung, Speicherplatzbedarf auf der Festplatte und Gesamtsystemkosten entsprechend den Anforderungen der Arbeitslast abzustimmen, anstatt durch feste Speichergrenzen eingeschränkt zu sein.</p>
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
    </button></h2><p>Die Wirtschaftlichkeit moderner Hardware verändert sich. Die DRAM-Preise bleiben hoch, während die SSD-Leistung rasant zugenommen hat – PCIe-5.0-Laufwerke bieten mittlerweile eine Bandbreite von über <strong>14 GB/s</strong>. Infolgedessen werden Architekturen, die suchkritische Daten vom teuren DRAM auf weitaus kostengünstigeren SSD-Speicher verlagern, zunehmend attraktiv. Da die SSD-Kapazität <strong>pro Gigabyte weniger als das 30-Fache des DRAM-Preises</strong> kostet, sind diese Unterschiede nicht mehr marginal – sie beeinflussen das Systemdesign maßgeblich.</p>
<p>AISAQ spiegelt diesen Wandel wider. Indem es die Notwendigkeit großer, ständig aktiver Speicherzuweisungen beseitigt, ermöglicht es Vektorsuchsystemen, sich anhand der Datengröße und der Anforderungen an die Arbeitslast zu skalieren, anstatt durch DRAM-Grenzen eingeschränkt zu sein. Dieser Ansatz steht im Einklang mit einem breiteren Trend hin zu „All-in-Storage“-Architekturen, bei denen schnelle SSDs nicht nur bei der Datenspeicherung, sondern auch bei der aktiven Berechnung und Suche eine zentrale Rolle spielen. Durch das Angebot von zwei Betriebsmodi – „Performance“ und „Scale“ – erfüllt AiSAQ sowohl die Anforderungen der semantischen Suche (die die geringste Latenz erfordert) als auch die von RAG (das eine sehr hohe Skalierbarkeit, aber moderate Latenz erfordert).</p>
<p>Dieser Wandel wird sich wahrscheinlich nicht auf Vektordatenbanken beschränken. Ähnliche Entwurfsmuster zeichnen sich bereits in der Graphverarbeitung, der Zeitreihenanalyse und sogar in Teilen traditioneller relationaler Systeme ab, da Entwickler langjährige Annahmen darüber überdenken, wo Daten gespeichert sein müssen, um eine akzeptable Leistung zu erzielen. Mit der weiteren Entwicklung der Hardware-Ökonomie werden sich auch die Systemarchitekturen weiterentwickeln.</p>
<p>Weitere Details zu den hier besprochenen Entwürfen finden Sie in der Dokumentation:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus-Dokumentation</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus-Dokumentation</a></p></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie sich eingehend mit einer Funktion der neuesten Milvus-Version befassen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelberatung buchen, um im Rahmen<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> der „Milvus Office Hours“</a> Einblicke, Anleitungen und Antworten auf Ihre Fragen zu erhalten.</p>
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Vorstellung von Milvus 2.6: Kostengünstige Vektorsuche im Milliardenbereich</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Vorstellung der Embedding-Funktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche optimiert</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON-Shredding in Milvus: 88,9-mal schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Entity-Level-Retrieval erschließen: Neue „Array-of-Structs“- und MAX_SIM-Funktionen in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe im Kampf gegen Duplikate in LLM-Trainingsdaten </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkompression auf die Spitze getrieben: Wie Milvus mit RaBitQ dreimal so viele Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen – Vektordatenbanken verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar für Milvus durch einen „Woodpecker“ ersetzt </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vektorsuche in der Praxis: Wie man effizient filtert, ohne den Recall zu beeinträchtigen</a></p></li>
</ul>
