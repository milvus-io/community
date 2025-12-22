---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Einführung von AISAQ in Milvus: Milliardenfache Vektorsuche ist jetzt 3.200x
  billiger im Speicher
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
  Entdecken Sie, wie Milvus mit AISAQ die Speicherkosten um das 3200-fache
  reduziert und so eine skalierbare Milliarden-Vektorsuche ohne DRAM-Overhead
  ermöglicht.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Vektordatenbanken sind zu einer zentralen Infrastruktur für unternehmenskritische KI-Systeme geworden, und ihre Datenmengen wachsen exponentiell - oft erreichen sie Milliarden von Vektoren. Bei dieser Größenordnung wird alles schwieriger: niedrige Latenzzeiten, Genauigkeit, Zuverlässigkeit und der Betrieb über Replikate und Regionen hinweg. Eine Herausforderung taucht jedoch schon früh auf und dominiert die Architekturentscheidungen: die Kosten<strong>.</strong></p>
<p>Um eine schnelle Suche zu ermöglichen, speichern die meisten Vektordatenbanken wichtige Indizierungsstrukturen in DRAM (Dynamic Random Access Memory), der schnellsten und teuersten Speicherebene. Dieses Design ist zwar leistungsfähig, aber schlecht skalierbar. Die DRAM-Nutzung skaliert eher mit der Datengröße als mit dem Abfrageverkehr, und selbst bei Komprimierung oder teilweisem SSD-Offloading müssen große Teile des Indexes im Speicher verbleiben. Wenn die Datensätze wachsen, werden die Speicherkosten schnell zu einem begrenzenden Faktor.</p>
<p>Milvus unterstützt bereits <strong>DISKANN</strong>, einen festplattenbasierten ANN-Ansatz, der die Speicherbelastung durch Verlagerung eines Großteils des Index auf SSD reduziert. Allerdings ist DISKANN immer noch auf DRAM für komprimierte Darstellungen angewiesen, die während der Suche verwendet werden. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> geht mit <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, einem von <a href="https://milvus.io/docs/diskann.md">DISKANN</a> inspirierten festplattenbasierten Vektorindex, noch einen Schritt weiter. Die von KIOXIA entwickelte AiSAQ-Architektur wurde mit einer "Zero-DRAM-Footprint-Architektur" konzipiert, die alle suchkritischen Daten auf der Festplatte speichert und die Datenplatzierung zur Minimierung der E/A-Operationen optimiert. Bei einer Arbeitslast von einer Milliarde Vektoren reduziert dies die Speichernutzung von <strong>32 GB auf etwa 10 MB - eine</strong> <strong>3.200-fache Reduzierung - bei</strong>gleichbleibender praktischer Leistung.</p>
<p>In den folgenden Abschnitten wird erläutert, wie die graphenbasierte Vektorsuche funktioniert, woher die Speicherkosten kommen und wie AISAQ die Kostenkurve für die Vektorsuche in Milliardenhöhe umgestaltet.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Wie die herkömmliche graphenbasierte Vektorsuche funktioniert<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der<strong>Vektorsuche</strong> geht es darum, Datenpunkte zu finden, deren numerische Repräsentationen einer Abfrage in einem hochdimensionalen Raum am nächsten kommen. "Am nächsten" bedeutet einfach den kleinsten Abstand gemäß einer Abstandsfunktion, z. B. Kosinusabstand oder L2-Abstand. Auf einer kleinen Skala ist dies ganz einfach: Berechnen Sie den Abstand zwischen der Abfrage und jedem Vektor und geben Sie dann die nächstgelegenen zurück. Auf einer großen Skala, z. B. in Milliardenhöhe, wird dieser Ansatz jedoch schnell zu langsam, um praktikabel zu sein.</p>
<p>Um erschöpfende Vergleiche zu vermeiden, stützen sich moderne ANNS-Systeme (Approximate Nearest Neighbour Search) auf <strong>graphbasierte Indizes</strong>. Anstatt eine Abfrage mit jedem Vektor zu vergleichen, organisiert der Index die Vektoren in einem <strong>Graphen</strong>. Jeder Knoten stellt einen Vektor dar, und die Kanten verbinden Vektoren, die numerisch nahe beieinander liegen. Durch diese Struktur kann das System den Suchraum drastisch einschränken.</p>
<p>Der Graph wird im Voraus erstellt und basiert ausschließlich auf den Beziehungen zwischen den Vektoren. Er hängt nicht von Abfragen ab. Wenn eine Abfrage eintrifft, besteht die Aufgabe des Systems darin, <strong>effizient durch den Graphen zu navigieren</strong> und die Vektoren mit dem geringsten Abstand zur Abfrage zu identifizieren - ohne den gesamten Datensatz zu durchsuchen.</p>
<p>Die Suche beginnt an einem vordefinierten <strong>Einstiegspunkt</strong> im Graphen. Dieser Startpunkt kann weit von der Abfrage entfernt sein, aber der Algorithmus verbessert seine Position Schritt für Schritt, indem er sich zu Vektoren bewegt, die näher an der Abfrage liegen. Während dieses Prozesses unterhält die Suche zwei interne Datenstrukturen, die zusammenarbeiten: eine <strong>Kandidatenliste</strong> und eine <strong>Ergebnisliste</strong>.</p>
<p>Und die beiden wichtigsten Schritte während dieses Prozesses sind die Erweiterung der Kandidatenliste und die Aktualisierung der Ergebnisliste.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Erweitern der Kandidatenliste</h3><p>Die <strong>Kandidatenliste</strong> zeigt an, wo die Suche als nächstes ansetzen kann. Es handelt sich dabei um eine nach Prioritäten geordnete Menge von Graphknoten, die aufgrund ihrer Entfernung zur Suchanfrage vielversprechend erscheinen.</p>
<p>Bei jeder Iteration wählt der Algorithmus:</p>
<ul>
<li><p><strong>Er wählt den nächstgelegenen Kandidaten aus, der bisher entdeckt wurde.</strong> Aus der Kandidatenliste wählt er den Vektor mit dem geringsten Abstand zur Abfrage aus.</p></li>
<li><p><strong>Er ruft die Nachbarn dieses Vektors aus dem Graphen ab.</strong> Diese Nachbarn sind Vektoren, die während der Indexerstellung als nahe am aktuellen Vektor liegend identifiziert wurden.</p></li>
<li><p><strong>Bewertet die nicht besuchten Nachbarn und fügt sie der Kandidatenliste hinzu.</strong> Für jeden Nachbarn, der noch nicht erforscht wurde, berechnet der Algorithmus seine Entfernung zur Abfrage. Zuvor besuchte Nachbarn werden übersprungen, während neue Nachbarn in die Kandidatenliste aufgenommen werden, wenn sie vielversprechend erscheinen.</p></li>
</ul>
<p>Durch wiederholtes Erweitern der Kandidatenliste erforscht die Suche zunehmend relevante Regionen des Graphen. So kann der Algorithmus immer bessere Antworten finden, während er nur einen kleinen Teil aller Vektoren untersucht.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Aktualisieren der Ergebnisliste</h3><p>Gleichzeitig führt der Algorithmus eine <strong>Ergebnisliste</strong>, in der die besten bisher gefundenen Kandidaten für die endgültige Ausgabe festgehalten werden. Während die Suche fortschreitet, wird:</p>
<ul>
<li><p><strong>Verfolgt die nächstgelegenen Vektoren, die während der Durchquerung gefunden wurden.</strong> Dazu gehören sowohl Vektoren, die zur Erweiterung ausgewählt wurden, als auch andere, die auf dem Weg dorthin untersucht wurden.</p></li>
<li><p><strong>Speichert ihre Entfernungen zur Abfrage.</strong> Dies ermöglicht es, die Kandidaten in eine Rangfolge zu bringen und die aktuellen Top-K-Nächsten Nachbarn zu erhalten.</p></li>
</ul>
<p>Im Laufe der Zeit, wenn mehr Kandidaten bewertet und weniger Verbesserungen gefunden werden, stabilisiert sich die Ergebnisliste. Sobald es unwahrscheinlich ist, dass eine weitere Graphenuntersuchung zu näheren Vektoren führt, wird die Suche beendet und die Ergebnisliste als endgültige Antwort zurückgegeben.</p>
<p>Vereinfacht ausgedrückt, <strong>steuert</strong> die <strong>Kandidatenliste die Erkundung</strong>, während die <strong>Ergebnisliste die besten bisher gefundenen Antworten festhält</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Der Kompromiss bei der graphenbasierten Vektorsuche<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser graphenbasierte Ansatz macht eine groß angelegte Vektorsuche überhaupt erst praktisch. Indem das System durch den Graphen navigiert, anstatt jeden Vektor zu scannen, kann es hochwertige Ergebnisse finden, während es nur einen kleinen Teil des Datensatzes berührt.</p>
<p>Diese Effizienz gibt es jedoch nicht umsonst. Bei der graphenbasierten Suche gibt es einen grundlegenden Kompromiss zwischen <strong>Genauigkeit und Kosten.</strong></p>
<ul>
<li><p>Die Suche nach mehr Nachbarn verbessert die Genauigkeit, da ein größerer Teil des Graphen abgedeckt und die Wahrscheinlichkeit, dass echte nächste Nachbarn übersehen werden, verringert wird.</p></li>
<li><p>Gleichzeitig bedeutet jede zusätzliche Erweiterung mehr Arbeit: mehr Abstandsberechnungen, mehr Zugriffe auf die Graphenstruktur und mehr Lesungen von Vektordaten. Je tiefer oder weiter die Suche geht, desto mehr Kosten fallen an. Je nachdem, wie der Index konzipiert ist, zeigen sie sich in Form von höherer CPU-Auslastung, erhöhtem Speicherbedarf oder zusätzlichen Festplatten-E/A.</p></li>
</ul>
<p>Das Ausbalancieren dieser gegensätzlichen Kräfte - hohe Wiederauffindbarkeit und effiziente Ressourcennutzung - ist von zentraler Bedeutung für das Design einer graphbasierten Suche.</p>
<p>Sowohl <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> als auch <strong>AISAQ</strong> bauen auf diesem Spannungsfeld auf, treffen aber unterschiedliche architektonische Entscheidungen darüber, wie und wo diese Kosten zu tragen sind.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Wie DISKANN die plattenbasierte Vektorsuche optimiert<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
<p>DISKANN ist die bisher einflussreichste plattenbasierte ANN-Lösung und dient als offizielle Grundlage für den NeurIPS Big ANN-Wettbewerb, einem globalen Benchmark für die Vektorsuche in Milliardenhöhe. Seine Bedeutung liegt nicht nur in der Leistung, sondern auch in dem, was er bewiesen hat: <strong>Graphenbasierte ANN-Suche muss nicht ausschließlich im Speicher stattfinden, um schnell zu sein</strong>.</p>
<p>Durch die Kombination von SSD-basiertem Speicher mit sorgfältig ausgewählten In-Memory-Strukturen hat DISKANN gezeigt, dass eine groß angelegte Vektorsuche eine hohe Genauigkeit und eine geringe Latenzzeit auf handelsüblicher Hardware erreichen kann, ohne dass ein großer DRAM-Footprint erforderlich ist. Dies wird erreicht, indem neu überlegt wird <em>, welche Teile der Suche schnell sein müssen</em> und <em>welche Teile einen langsameren Zugriff tolerieren</em> können.</p>
<p><strong>DISKANN behält die Daten, auf die am häufigsten zugegriffen wird, im Speicher, während größere Strukturen, auf die weniger häufig zugegriffen wird, auf die Festplatte verlagert werden.</strong> Dieses Gleichgewicht wird durch mehrere wichtige Designentscheidungen erreicht.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Verwendung von PQ-Distanzen zum Erweitern der Kandidatenliste</h3><p>Das Erweitern der Kandidatenliste ist die häufigste Operation bei der graphbasierten Suche. Jede Erweiterung erfordert eine Abschätzung der Distanz zwischen dem Abfragevektor und den Nachbarn eines Kandidatenknotens. Die Durchführung dieser Berechnungen mit vollständigen, hochdimensionalen Vektoren würde häufige zufällige Lesevorgänge von der Festplatte erfordern - ein teurer Vorgang sowohl rechnerisch als auch in Bezug auf die E/A.</p>
<p>DISKANN vermeidet diese Kosten, indem es die Vektoren in <strong>Produktquantisierungscodes (PQ-Codes)</strong> komprimiert und diese im Speicher hält. PQ-Codes sind viel kleiner als vollständige Vektoren, enthalten aber immer noch genügend Informationen, um die Entfernung annähernd zu schätzen.</p>
<p>Während der Kandidatenexpansion berechnet DISKANN die Abstände unter Verwendung dieser PQ-Codes im Speicher, anstatt vollständige Vektoren von der SSD zu lesen. Dies reduziert die Festplattenein- und -ausgabe während der Graphenüberquerung drastisch und ermöglicht es der Suche, Kandidaten schnell und effizient zu erweitern, während der meiste SSD-Verkehr vom kritischen Pfad ferngehalten wird.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Gemeinsame Unterbringung von vollständigen Vektoren und Nachbarlisten auf der Festplatte</h3><p>Nicht alle Daten können komprimiert oder ungefähr abgerufen werden. Sobald vielversprechende Kandidaten identifiziert worden sind, benötigt die Suche für genaue Ergebnisse immer noch Zugriff auf zwei Arten von Daten:</p>
<ul>
<li><p><strong>Nachbarlisten</strong>, um die Durchquerung des Graphen fortzusetzen</p></li>
<li><p><strong>Vollständige (unkomprimierte) Vektoren</strong> für das endgültige Reranking</p></li>
</ul>
<p>Auf diese Strukturen wird weniger häufig zugegriffen als auf die PQ-Codes, daher speichert DISKANN sie auf SSD. Um den Festplatten-Overhead zu minimieren, platziert DISKANN die Nachbarliste eines jeden Knotens und seinen vollständigen Vektor in derselben physischen Region auf der Festplatte. Dadurch wird sichergestellt, dass ein einziger SSD-Lesevorgang beides abrufen kann.</p>
<p>Durch die gemeinsame Platzierung verwandter Daten reduziert DISKANN die Anzahl der während der Suche erforderlichen zufälligen Festplattenzugriffe. Diese Optimierung verbessert sowohl die Expansions- als auch die Rerankingeffizienz, insbesondere bei großem Umfang.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Parallele Knotenexpansion für bessere SSD-Nutzung</h3><p>Die graphbasierte ANN-Suche ist ein iterativer Prozess. Wenn jede Iteration nur einen Kandidatenknoten erweitert, gibt das System jeweils nur einen einzigen Festplattenlesevorgang aus, wodurch der größte Teil der parallelen SSD-Bandbreite ungenutzt bleibt. Um diese Ineffizienz zu vermeiden, erweitert DISKANN in jeder Iteration mehrere Kandidaten und sendet parallele Leseanforderungen an die SSD. Dieser Ansatz nutzt die verfügbare Bandbreite wesentlich besser aus und reduziert die Gesamtzahl der erforderlichen Iterationen.</p>
<p>Der Parameter <strong>beam_width_ratio</strong> steuert, wie viele Kandidaten parallel expandiert werden: <strong>Balkenbreite = Anzahl der CPU-Kerne × beam_width_ratio.</strong> Ein höheres Verhältnis verbreitert die Suche - was die Genauigkeit verbessern kann -, erhöht aber auch den Rechenaufwand und die Festplatten-E/A.</p>
<p>Um dies auszugleichen, führt DISKANN eine <code translate="no">search_cache_budget_gb_ratio</code> ein, die Speicher reserviert, um Daten, auf die häufig zugegriffen wird, zwischenzuspeichern, wodurch wiederholte SSD-Lesevorgänge reduziert werden. Gemeinsam helfen diese Mechanismen DISKANN dabei, Genauigkeit, Latenz und E/A-Effizienz auszugleichen.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Warum dies wichtig ist - und wo die Grenzen liegen</h3><p>Das Design von DISKANN ist ein großer Schritt vorwärts für die plattenbasierte Vektorsuche. Da PQ-Codes im Speicher verbleiben und größere Strukturen auf die SSD verlagert werden, wird der Speicherbedarf im Vergleich zu vollständig speicherinternen Graphenindizes erheblich reduziert.</p>
<p>Gleichzeitig ist diese Architektur für suchkritische Daten nach wie vor auf <strong>permanent verfügbaren DRAM</strong> angewiesen. PQ-Codes, Caches und Kontrollstrukturen müssen im Speicher verbleiben, damit das Traversal effizient bleibt. Wenn die Datensätze auf Milliarden von Vektoren anwachsen und Implementierungen Replikate oder Regionen hinzufügen, kann dieser Speicherbedarf zu einem begrenzenden Faktor werden.</p>
<p>Dies ist die Lücke, die <strong>AISAQ</strong> schließen soll.</p>
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
    </button></h2><p>AISAQ baut direkt auf den Kernideen von DISKANN auf, führt aber eine entscheidende Änderung ein: Es macht die <strong>Speicherung von PQ-Daten im DRAM</strong> überflüssig. Anstatt komprimierte Vektoren als suchkritische, immer im Speicher befindliche Strukturen zu behandeln, verschiebt AISAQ sie auf SSD und gestaltet die Anordnung der Graphdaten auf der Festplatte neu, um eine effiziente Traversierung zu gewährleisten.</p>
<p>Damit dies funktioniert, reorganisiert AISAQ den Knotenspeicher so, dass die bei der Graphensuche benötigten Daten - vollständige Vektoren, Nachbarlisten und PQ-Informationen - auf der Festplatte in Mustern angeordnet werden, die für die Zugriffslokalität optimiert sind. Das Ziel besteht nicht nur darin, mehr Daten auf die kostengünstigere Festplatte zu verschieben, sondern auch darin, dies zu tun <strong>, ohne den zuvor beschriebenen Suchprozess</strong> zu <strong>unterbrechen</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um unterschiedlichen Anwendungsanforderungen gerecht zu werden, bietet AISAQ zwei plattenbasierte Speichermodi: Leistung und Skalierung. Aus technischer Sicht unterscheiden sich diese Modi vor allem darin, wie PQ-komprimierte Daten gespeichert werden und wie auf sie während der Suche zugegriffen wird. Aus der Anwendungsperspektive sprechen diese Modi zwei unterschiedliche Arten von Anforderungen an: Anforderungen an eine niedrige Latenzzeit, wie sie für semantische Online-Such- und Empfehlungssysteme typisch sind, und Anforderungen an einen extrem hohen Umfang, wie er für RAG typisch ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-Leistung: Optimiert für Geschwindigkeit</h3><p>AISAQ-Performance speichert alle Daten auf der Festplatte und hält den E/A-Overhead durch Daten-Colocation niedrig.</p>
<p>In diesem Modus:</p>
<ul>
<li><p>Der vollständige Vektor jedes Knotens, die Kantenliste und die PQ-Codes seiner Nachbarn werden zusammen auf der Festplatte gespeichert.</p></li>
<li><p>Der Besuch eines Knotens erfordert immer noch nur einen <strong>einzigen SSD-Lesezugriff</strong>, da alle Daten, die für die Kandidatenerweiterung und -bewertung benötigt werden, kolokalisiert sind.</p></li>
</ul>
<p>Aus der Sicht des Suchalgorithmus entspricht dies weitgehend dem Zugriffsmuster von DISKANN. Die Kandidatenexpansion bleibt effizient, und die Laufzeitleistung ist vergleichbar, obwohl alle suchkritischen Daten jetzt auf der Festplatte liegen.</p>
<p>Der Kompromiss ist der Speicher-Overhead. Da die PQ-Daten eines Nachbarn in den Plattenseiten mehrerer Knoten erscheinen können, führt dieses Layout zu Redundanz und erhöht die Gesamtgröße des Index erheblich.</p>
<p>Daher hat im AISAQ-Performance-Modus eine geringe E/A-Latenz Vorrang vor der Festplatteneffizienz. Aus der Anwendungsperspektive kann der AiSAQ-Performance-Modus Latenzzeiten im Bereich von 10 mSek. bieten, wie sie für die semantische Online-Suche erforderlich sind.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Skala: Optimiert für Speichereffizienz</h3><p>AISAQ-Scale verfolgt den entgegengesetzten Ansatz. Er wurde entwickelt, um <strong>die Festplattennutzung zu minimieren</strong> und dennoch alle Daten auf SSD zu speichern.</p>
<p>In diesem Modus:</p>
<ul>
<li><p>Die PQ-Daten werden separat auf der Festplatte gespeichert, ohne Redundanz.</p></li>
<li><p>Dadurch wird die Redundanz eliminiert und die Indexgröße drastisch reduziert.</p></li>
</ul>
<p>Der Nachteil ist, dass der Zugriff auf die PQ-Codes eines Knotens und seiner Nachbarn möglicherweise <strong>mehrere SSD-Lesevorgänge</strong> erfordert, was die E/A-Vorgänge während der Kandidatenerweiterung erhöht. Ohne Optimierung würde dies die Suche erheblich verlangsamen.</p>
<p>Um diesen Overhead zu kontrollieren, führt der AISAQ-Scale-Modus zwei zusätzliche Optimierungen ein:</p>
<ul>
<li><p><strong>PQ-Datenumordnung</strong>, die PQ-Vektoren nach Zugriffspriorität ordnet, um die Lokalisierung zu verbessern und zufällige Lesevorgänge zu reduzieren.</p></li>
<li><p>Ein <strong>PQ-Cache im DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), der häufig aufgerufene PQ-Daten speichert und wiederholte Festplattenlesungen für heiße Einträge vermeidet.</p></li>
</ul>
<p>Mit diesen Optimierungen erreicht der AISAQ-Scale-Modus eine wesentlich bessere Speichereffizienz als AISAQ-Performance, wobei die praktische Suchleistung erhalten bleibt. Diese Leistung bleibt unter der von DISKANN, aber es gibt keinen Speicher-Overhead (die Indexgröße ist ähnlich wie bei DISKANN) und der Speicherbedarf ist erheblich geringer. Aus der Anwendungsperspektive bietet AiSAQ die Möglichkeit, die RAG-Anforderungen in ultrahohem Maßstab zu erfüllen.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Die wichtigsten Vorteile von AISAQ</h3><p>Durch die Verlagerung aller suchkritischen Daten auf die Festplatte und die Neugestaltung des Zugriffs auf diese Daten ändert AISAQ das Kosten- und Skalierbarkeitsprofil der graphbasierten Vektorsuche grundlegend. Sein Design bietet drei wesentliche Vorteile.</p>
<p><strong>1. Bis zu 3.200× geringere DRAM-Nutzung</strong></p>
<p>Die Produktquantisierung reduziert die Größe von hochdimensionalen Vektoren erheblich, aber bei einer Milliarde Vektoren ist der Speicherbedarf immer noch beträchtlich. Selbst nach der Komprimierung müssen PQ-Codes während der Suche in herkömmlichen Designs im Speicher gehalten werden.</p>
<p>Bei <strong>SIFT1B</strong>, einem Benchmark mit einer Milliarde 128-dimensionaler Vektoren, benötigen die PQ-Codes allein etwa <strong>30-120 GB DRAM</strong>, je nach Konfiguration. Die Speicherung der vollständigen, unkomprimierten Vektoren würde zusätzliche <strong>~480 GB</strong> erfordern. Während PQ die Speichernutzung um das 4-16fache reduziert, ist der verbleibende Platzbedarf immer noch groß genug, um die Infrastrukturkosten zu dominieren.</p>
<p>Mit AISAQ entfällt diese Anforderung vollständig. Durch die Speicherung von PQ-Codes auf SSD anstelle von DRAM wird der Speicher nicht mehr durch persistente Indexdaten beansprucht. DRAM wird nur noch für leichtgewichtige, flüchtige Strukturen wie Kandidatenlisten und Kontroll-Metadaten verwendet. In der Praxis reduziert sich dadurch die Speichernutzung von mehreren Dutzend Gigabyte auf <strong>etwa 10 MB</strong>. In einer repräsentativen Konfiguration im Milliardenmaßstab sinkt der DRAM von <strong>32 GB auf 10 MB</strong>, was einer <strong>3.200-fachen Reduzierung</strong> entspricht.</p>
<p>Angesichts der Tatsache, dass SSD-Speicher im Vergleich zu DRAM etwa <strong>1/30 des Preises pro Kapazitätseinheit</strong> kostet, hat diese Verschiebung direkte und dramatische Auswirkungen auf die Gesamtsystemkosten.</p>
<p><strong>2. Kein zusätzlicher E/A-Overhead</strong></p>
<p>Die Verlagerung von PQ-Codes vom Speicher auf die Festplatte würde normalerweise die Anzahl der E/A-Operationen während der Suche erhöhen. AISAQ vermeidet dies durch eine sorgfältige Kontrolle des <strong>Datenlayouts und der Zugriffsmuster</strong>. Anstatt verwandte Daten über die Festplatte zu verstreuen, platziert AISAQ PQ-Codes, vollständige Vektoren und Nachbarlisten gemeinsam, so dass sie zusammen abgerufen werden können. Dadurch wird sichergestellt, dass die Kandidatenerweiterung keine zusätzlichen zufälligen Lesevorgänge mit sich bringt.</p>
<p>Um den Benutzern die Kontrolle über den Kompromiss zwischen Indexgröße und E/A-Effizienz zu geben, führt AISAQ den Parameter <code translate="no">inline_pq</code> ein, der bestimmt, wie viele PQ-Daten inline mit jedem Knoten gespeichert werden:</p>
<ul>
<li><p><strong>Niedriger inline_pq:</strong> kleinere Indexgröße, aber möglicherweise zusätzliche E/A erforderlich</p></li>
<li><p><strong>Höhere inline_pq:</strong> größere Indexgröße, aber Erhalt des Single-Read-Zugriffs</p></li>
</ul>
<p>Wenn AISAQ mit <strong>inline_pq = max_degree</strong> konfiguriert ist, liest AISAQ den vollständigen Vektor eines Knotens, die Nachbarliste und alle PQ-Codes in einem einzigen Festplattenvorgang, was dem E/A-Muster von DISKANN entspricht, während alle Daten auf der SSD verbleiben.</p>
<p><strong>3. Sequentieller PQ-Zugriff verbessert die Berechnungseffizienz</strong></p>
<p>In DISKANN erfordert das Erweitern eines Kandidatenknotens R zufällige Speicherzugriffe, um die PQ-Codes seiner R Nachbarn abzurufen. AISAQ eliminiert diese Zufälligkeit, indem es alle PQ-Codes in einem einzigen I/O abruft und sie sequentiell auf der Festplatte speichert.</p>
<p>Das sequenzielle Layout bietet zwei wichtige Vorteile:</p>
<ul>
<li><p><strong>Sequentielle SSD-Lesevorgänge sind viel schneller</strong> als verstreute Zufallslesevorgänge.</p></li>
<li><p><strong>Zusammenhängende Daten sind cache-freundlicher</strong>, so dass die CPUs die PQ-Abstände effizienter berechnen können.</p></li>
</ul>
<p>Dies verbessert sowohl die Geschwindigkeit als auch die Vorhersagbarkeit der PQ-Abstandsberechnungen und trägt dazu bei, die Leistungskosten der Speicherung von PQ-Codes auf SSD statt auf DRAM auszugleichen.</p>
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
    </button></h2><p>Nachdem wir verstanden haben, wie sich AISAQ architektonisch von DISKANN unterscheidet, ist die nächste Frage einfach: <strong>Wie wirken sich diese Designentscheidungen in der Praxis auf die Leistung und den Ressourcenverbrauch aus?</strong> Diese Evaluierung vergleicht AISAQ und DISKANN in drei Dimensionen, die im Milliardenmaßstab am wichtigsten sind: <strong>Suchleistung, Speicherverbrauch und Festplattennutzung</strong>.</p>
<p>Insbesondere untersuchen wir, wie sich AISAQ verhält, wenn sich die Menge der eingefügten PQ-Daten (<code translate="no">INLINE_PQ</code>) ändert. Dieser Parameter steuert direkt den Kompromiss zwischen Indexgröße, Festplatten-E/A und Laufzeiteffizienz. Wir evaluieren beide Ansätze auch für <strong>niedrig- und hochdimensionale Vektorarbeitslasten, da die Dimensionalität die Kosten der Abstandsberechnung und die</strong> Speicheranforderungen <strong>stark beeinflusst</strong>.</p>
<h3 id="Setup" class="common-anchor-header">Aufbau</h3><p>Alle Experimente wurden auf einem Ein-Knoten-System durchgeführt, um das Indexverhalten zu isolieren und Störungen durch Netzwerk- oder verteilte Systemeffekte zu vermeiden.</p>
<p><strong>Hardware-Konfiguration:</strong></p>
<ul>
<li><p>CPU: Intel® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>Speicher: Geschwindigkeit: 3200 MT/s, Typ: DDR4, Größe: 32 GB</p></li>
<li><p>Festplatte: 500 GB NVMe SSD</p></li>
</ul>
<p><strong>Parameter für den Indexaufbau</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Abfrage-Parameter</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Benchmark-Methode</h3><p>Sowohl DISKANN als auch AISAQ wurden mit <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, der in Milvus verwendeten Open-Source-Vektorsuchmaschine, getestet. Für diese Bewertung wurden zwei Datensätze verwendet:</p>
<ul>
<li><p><strong>SIFT128D (1M Vektoren):</strong> ein bekannter 128-dimensionaler Benchmark, der häufig für die Suche nach Bilddeskriptoren verwendet wird. <em>(Größe des Rohdatensatzes ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M Vektoren):</strong> ein 768-dimensionaler Einbettungssatz, der typisch für die transformatorbasierte semantische Suche ist. <em>(Größe des Rohdatensatzes ≈ 2930 MB)</em></p></li>
</ul>
<p>Diese Datensätze spiegeln zwei verschiedene reale Szenarien wider: kompakte Bildverarbeitungsmerkmale und große semantische Einbettungen.</p>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p><strong>Sift128D1M (vollständiger Vektor ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (Voller Vektor ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Analyse</h3><p><strong>SIFT128D-Datensatz</strong></p>
<p>Beim SIFT128D-Datensatz kann AISAQ mit der Leistung von DISKANN mithalten, wenn alle PQ-Daten inlined werden, so dass die erforderlichen Daten jedes Knotens vollständig in eine einzige 4 KB SSD-Seite passen (INLINE_PQ = 48). Bei dieser Konfiguration wird jede Information, die während der Suche benötigt wird, kolokalisiert:</p>
<ul>
<li><p>Vollständiger Vektor: 512B</p></li>
<li><p>Nachbarschaftsliste: 48 × 4 + 4 = 196B</p></li>
<li><p>PQ-Codes der Nachbarn: 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Insgesamt: 3780B</p></li>
</ul>
<p>Da der gesamte Knoten in eine Seite passt, ist nur eine Ein/Ausgabe pro Zugriff erforderlich, und AISAQ vermeidet das zufällige Lesen von externen PQ-Daten.</p>
<p>Wenn jedoch nur ein Teil der PQ-Daten inlined wird, müssen die restlichen PQ-Codes von einer anderen Stelle der Festplatte geholt werden. Dies führt zu zusätzlichen zufälligen E/A-Operationen, die den IOPS-Bedarf drastisch erhöhen und zu erheblichen Leistungseinbußen führen.</p>
<p><strong>Cohere768D-Datensatz</strong></p>
<p>Auf dem Cohere768D-Datensatz schneidet AISAQ schlechter ab als DISKANN. Der Grund dafür ist, dass ein 768-dimensionaler Vektor einfach nicht in eine 4 KB SSD-Seite passt:</p>
<ul>
<li><p>Vollständiger Vektor: 3072B</p></li>
<li><p>Nachbarschaftsliste: 48 × 4 + 4 = 196B</p></li>
<li><p>PQ-Codes der Nachbarn: 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Insgesamt: 21.700 B (≈ 6 Seiten)</p></li>
</ul>
<p>In diesem Fall erstreckt sich jeder Knoten über mehrere Seiten, selbst wenn alle PQ-Codes inlined sind. Während die Anzahl der E/A-Operationen konstant bleibt, muss jede E/A-Operation viel mehr Daten übertragen, wodurch die SSD-Bandbreite viel schneller verbraucht wird. Sobald die Bandbreite zum begrenzenden Faktor wird, kann AISAQ nicht mehr mit DISKANN mithalten - vor allem bei hochdimensionalen Arbeitslasten, bei denen die Datenmenge pro Knoten schnell wächst.</p>
<p><strong>Anmerkung:</strong></p>
<p>Das Speicherlayout von AISAQ erhöht die Indexgröße auf der Festplatte in der Regel um <strong>das 4- bis 6-fache</strong>. Dies ist ein bewusster Kompromiss: Vollständige Vektoren, Nachbarlisten und PQ-Codes sind auf der Festplatte untergebracht, um einen effizienten Single-Page-Zugriff während der Suche zu ermöglichen. Dies erhöht zwar die SSD-Nutzung, aber die Festplattenkapazität ist wesentlich billiger als DRAM und lässt sich bei großen Datenmengen leichter skalieren.</p>
<p>In der Praxis können Benutzer diesen Kompromiss durch Anpassen der <code translate="no">INLINE_PQ</code> und PQ-Komprimierungsverhältnisse abstimmen. Mit diesen Parametern ist es möglich, Suchleistung, Festplattenbedarf und Gesamtsystemkosten je nach den Anforderungen der Arbeitslast auszugleichen, anstatt durch feste Speichergrenzen eingeschränkt zu sein.</p>
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
    </button></h2><p>Die Wirtschaftlichkeit von moderner Hardware ändert sich. Die DRAM-Preise sind nach wie vor hoch, während die Leistung von SSDs rasant gestiegen ist - PCIe 5.0-Laufwerke bieten jetzt eine Bandbreite von über <strong>14 GB/s</strong>. Infolgedessen werden Architekturen, die suchkritische Daten von teurem DRAM auf weitaus erschwinglicheren SSD-Speicher verlagern, immer überzeugender. Da die SSD-Kapazität <strong>weniger als 30 Mal so viel pro Gigabyte</strong> kostet <strong>wie</strong> DRAM, sind diese Unterschiede nicht mehr nur marginal, sondern haben einen bedeutenden Einfluss auf das Systemdesign.</p>
<p>AISAQ spiegelt diese Verschiebung wider. Durch den Wegfall der Notwendigkeit großer, ständig verfügbarer Speicherzuweisungen können Vektorsuchsysteme auf der Grundlage der Datengröße und der Arbeitslastanforderungen skaliert werden, nicht auf der Grundlage von DRAM-Limits. Dieser Ansatz steht im Einklang mit dem allgemeinen Trend zu All-in-Storage"-Architekturen, bei denen schnelle SSDs eine zentrale Rolle nicht nur bei der Persistenz, sondern auch bei aktiven Berechnungen und Suchvorgängen spielen. Durch das Angebot von zwei Betriebsmodi - Leistung und Skalierung - erfüllt AiSAQ die Anforderungen sowohl der semantischen Suche (die die geringste Latenz erfordert) als auch der RAG (die eine sehr hohe Skalierung, aber eine moderate Latenz erfordert).</p>
<p>Es ist unwahrscheinlich, dass diese Verschiebung auf Vektordatenbanken beschränkt bleibt. Ähnliche Entwurfsmuster zeichnen sich bereits bei der Graphenverarbeitung, der Zeitreihenanalyse und sogar bei Teilen herkömmlicher relationaler Systeme ab, da die Entwickler langjährige Annahmen darüber, wo Daten gespeichert werden müssen, um eine akzeptable Leistung zu erzielen, überdenken. In dem Maße, wie sich die Wirtschaftlichkeit der Hardware weiterentwickelt, werden auch die Systemarchitekturen folgen.</p>
<p>Weitere Einzelheiten zu den hier besprochenen Designs finden Sie in der Dokumentation:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Milvus-Dokumentation</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Milvus-Dokumentation</a></p></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie eine Funktion des neuesten Milvus genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige persönliche Sitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
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
