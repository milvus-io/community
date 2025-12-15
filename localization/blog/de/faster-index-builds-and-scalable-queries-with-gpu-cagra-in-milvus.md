---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Optimierung von NVIDIA CAGRA in Milvus: Ein hybrider GPU-CPU-Ansatz für
  schnellere Indizierung und günstigere Abfragen
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Erfahren Sie, wie GPU_CAGRA in Milvus 2.6 GPUs für die schnelle
  Graphenkonstruktion und CPUs für die skalierbare Abfrageverarbeitung nutzt.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>Mit dem Übergang von KI-Systemen von Experimenten zu Produktionsinfrastrukturen haben Vektordatenbanken nicht mehr mit Millionen von Einbettungen zu tun. <strong>Milliarden sind jetzt Routine, und Dutzende von Milliarden sind zunehmend üblich.</strong> In dieser Größenordnung wirken sich die Entscheidungen der Algorithmen nicht nur auf die Leistung und den Abruf aus, sondern schlagen sich auch direkt in den Infrastrukturkosten nieder.</p>
<p>Daraus ergibt sich eine zentrale Frage für den Einsatz in großem Maßstab: <strong>Wie wählt man den richtigen Index aus, um eine akzeptable Wiederauffindbarkeit und Latenzzeit zu erreichen, ohne dass die Nutzung der Rechenressourcen außer Kontrolle gerät?</strong></p>
<p>Graphenbasierte Indizes wie <strong>NSW, HNSW, CAGRA und Vamana</strong> sind die am häufigsten verwendete Antwort. Durch die Navigation in vorgefertigten Nachbarschaftsgraphen ermöglichen diese Indizes eine schnelle Suche nach den nächsten Nachbarn im Milliardenmaßstab, ohne dass ein brutales Scannen und ein Vergleich jedes Vektors mit der Abfrage erforderlich ist.</p>
<p>Das Kostenprofil dieses Ansatzes ist jedoch uneinheitlich. <strong>Die Abfrage eines Graphen ist relativ billig, seine Erstellung dagegen nicht.</strong> Die Erstellung eines qualitativ hochwertigen Graphen erfordert umfangreiche Abstandsberechnungen und iterative Verfeinerungen über den gesamten Datensatz hinweg - Aufgaben, die herkömmliche CPU-Ressourcen bei wachsenden Datenmengen nur schwer bewältigen können.</p>
<p>NVIDIAs CAGRA behebt diesen Engpass, indem es GPUs zur Beschleunigung der Graphenerstellung durch massive Parallelität einsetzt. Dadurch wird zwar die Erstellungszeit erheblich verkürzt, aber der Einsatz von Grafikprozessoren sowohl für die Indexerstellung als auch für das Abfrageservice führt in Produktionsumgebungen zu höheren Kosten und Skalierbarkeitsbeschränkungen.</p>
<p>Um diese Kompromisse auszugleichen, <strong>wählt</strong> <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>ein hybrides Design für</strong> <strong>GPU_CAGRA-Indizes</strong>: <strong>GPUs werden nur für die Graphenkonstruktion verwendet, während die Abfrageausführung auf CPUs erfolgt.</strong> Dadurch bleiben die Qualitätsvorteile von GPU-erstellten Graphen erhalten, während die Abfrageausführung skalierbar und kosteneffizient bleibt - was sich besonders gut für Arbeitslasten mit seltenen Datenaktualisierungen, großen Abfragevolumina und strikter Kostensensitivität eignet.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">Was ist CAGRA und wie funktioniert es?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Graphenbasierte Vektorindizes fallen im Allgemeinen in zwei Hauptkategorien:</p>
<ul>
<li><p><strong>Iterative Graphenkonstruktion</strong>, dargestellt durch <strong>CAGRA</strong> (bereits in Milvus unterstützt).</p></li>
<li><p><strong>Einfügungsbasierte Graphenkonstruktion</strong>, repräsentiert durch <strong>Vamana</strong> (derzeit in der Entwicklung in Milvus).</p></li>
</ul>
<p>Diese beiden Ansätze unterscheiden sich erheblich in ihren Designzielen und technischen Grundlagen, so dass sie für unterschiedliche Datenskalen und Arbeitslastmuster geeignet sind.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> ist ein GPU-nativer Algorithmus für die ungefähre Suche nach dem nächsten Nachbarn (ANN), der für die effiziente Erstellung und Abfrage großer Proximity-Graphen entwickelt wurde. Durch die Nutzung der GPU-Parallelität beschleunigt CAGRA den Aufbau von Graphen erheblich und bietet im Vergleich zu CPU-basierten Ansätzen wie HNSW eine hohe Durchsatzleistung bei Abfragen.</p>
<p>CAGRA basiert auf dem <strong>NN-Descent (Nearest Neighbor Descent)</strong> Algorithmus, der einen k-nearest-neighbor (kNN) Graphen durch iterative Verfeinerung konstruiert. In jeder Iteration werden die Nachbarschaftskandidaten bewertet und aktualisiert, so dass sich allmählich höherwertige Nachbarschaftsbeziehungen im gesamten Datensatz ergeben.</p>
<p>Nach jeder Verfeinerungsrunde wendet CAGRA zusätzliche Graph Pruning-Techniken an, wie z. B. <strong>2-Hop Detour Pruning, um</strong>redundante Kanten zu entfernen und gleichzeitig die Suchqualität zu erhalten. Diese Kombination aus iterativer Verfeinerung und Beschneidung führt zu einem <strong>kompakten, aber gut vernetzten Graphen</strong>, der zur Abfragezeit effizient durchlaufen werden kann.</p>
<p>Durch wiederholtes Verfeinern und Beschneiden erzeugt CAGRA eine Graphenstruktur, die eine <strong>hohe Wiederauffindbarkeit und eine Nearest-Neighbor-Suche mit geringer Latenzzeit in großem Maßstab</strong> unterstützt, wodurch sie sich besonders gut für statische oder selten aktualisierte Datensätze eignet.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Schritt 1: Aufbau des Ausgangsgraphen mit NN-Descent</h3><p>NN-Descent basiert auf einer einfachen, aber aussagekräftigen Beobachtung: Wenn Knoten <em>u</em> ein Nachbar von <em>v</em> und Knoten <em>w</em> ein Nachbar von <em>u</em> ist, dann ist <em>w</em> mit hoher Wahrscheinlichkeit auch ein Nachbar von <em>v</em>. Diese transitive Eigenschaft ermöglicht es dem Algorithmus, echte nächste Nachbarn effizient zu entdecken, ohne jedes Vektorpaar erschöpfend zu vergleichen.</p>
<p>CAGRA verwendet NN-Descent als Kernalgorithmus für die Graphkonstruktion. Der Prozess funktioniert wie folgt:</p>
<p><strong>1. Zufällige Initialisierung:</strong> Jeder Knoten beginnt mit einer kleinen Menge zufällig ausgewählter Nachbarn, die einen groben Anfangsgraphen bilden.</p>
<p><strong>2. Erweiterung der Nachbarschaft:</strong> In jeder Iteration sammelt ein Knoten seine aktuellen Nachbarn und deren Nachbarn, um eine Kandidatenliste zu erstellen. Der Algorithmus berechnet die Ähnlichkeiten zwischen dem Knoten und allen Kandidaten. Da die Kandidatenliste eines jeden Knotens unabhängig ist, können diese Berechnungen separaten GPU-Thread-Blöcken zugewiesen und in großem Umfang parallel ausgeführt werden.</p>
<p><strong>3. Aktualisierung der Kandidatenliste:</strong> Wenn der Algorithmus Kandidaten findet, die näher liegen als die aktuellen Nachbarn des Knotens, tauscht er die weiter entfernten Nachbarn aus und aktualisiert die kNN-Liste des Knotens. Über mehrere Iterationen hinweg führt dieser Prozess zu einem wesentlich hochwertigeren approximativen kNN-Graphen.</p>
<p><strong>4. Konvergenzprüfung:</strong> Je weiter die Iterationen fortschreiten, desto weniger Nachbarschaftsaktualisierungen finden statt. Sobald die Anzahl der aktualisierten Verbindungen unter einen bestimmten Schwellenwert fällt, stoppt der Algorithmus und zeigt damit an, dass sich der Graph tatsächlich stabilisiert hat.</p>
<p>Da die Nachbarschaftsexpansion und die Ähnlichkeitsberechnung für verschiedene Knoten völlig unabhängig sind, ordnet CAGRA die NN-Descent-Arbeitslast jedes Knotens einem speziellen GPU-Thread-Block zu. Dieses Design ermöglicht massive Parallelität und macht die Graphenkonstruktion um Größenordnungen schneller als herkömmliche CPU-basierte Methoden.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Schritt 2: Beschneidung des Graphen mit 2-Hop-Umwegen</h3><p>Nach Abschluss des NN-Descent ist der resultierende Graph zwar genau, aber übermäßig dicht. NN-Descent behält absichtlich zusätzliche Nachbarschaftskandidaten, und die zufällige Initialisierungsphase führt viele schwache oder irrelevante Kanten ein. Infolgedessen hat jeder Knoten am Ende oft einen Grad, der doppelt oder sogar mehrfach so hoch ist wie der Zielgrad.</p>
<p>Um einen kompakten und effizienten Graphen zu erzeugen, wendet CAGRA das 2-Hop Detour Pruning an.</p>
<p>Die Idee ist einfach: Wenn der Knoten <em>A</em> den Knoten <em>B</em> indirekt über einen gemeinsamen Nachbarn <em>C</em> erreichen kann (indem er einen Pfad A → C → B bildet) und die Entfernung dieses indirekten Pfades mit der direkten Entfernung zwischen <em>A</em> und <em>B</em> vergleichbar ist, dann wird die direkte Kante A → B als überflüssig betrachtet und kann entfernt werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ein entscheidender Vorteil dieser Pruning-Strategie ist, dass die Redundanzprüfung jeder Kante nur von lokalen Informationen abhängt - den Entfernungen zwischen den beiden Endpunkten und ihren gemeinsamen Nachbarn. Da jede Kante unabhängig ausgewertet werden kann, ist der Pruning-Schritt hochgradig parallelisierbar und passt natürlich in die GPU-Stapelverarbeitung.</p>
<p>Dadurch kann CAGRA den Graphen auf GPUs effizient beschneiden und den Speicheraufwand um <strong>40-50%</strong> reduzieren, während die Suchgenauigkeit erhalten bleibt und die Traversalgeschwindigkeit bei der Abfrageausführung verbessert wird.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA in Milvus: Was ist anders?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Während GPUs große Leistungsvorteile für die Graphenkonstruktion bieten, stehen Produktionsumgebungen vor einer praktischen Herausforderung: GPU-Ressourcen sind viel teurer und begrenzter als CPUs. Wenn sowohl die Indexerstellung als auch die Abfrageausführung ausschließlich von GPUs abhängen, treten schnell mehrere betriebliche Probleme auf:</p>
<ul>
<li><p><strong>Geringe Ressourcenauslastung:</strong> Der Abfrageverkehr ist oft unregelmäßig und stoßweise, so dass die GPUs über lange Zeiträume ungenutzt bleiben und teure Rechenkapazität vergeuden.</p></li>
<li><p><strong>Hohe Bereitstellungskosten:</strong> Die Zuweisung eines Grafikprozessors für jede Abfrageinstanz treibt die Hardwarekosten in die Höhe, obwohl die meisten Abfragen die Leistung des Grafikprozessors nicht voll ausschöpfen.</p></li>
<li><p><strong>Begrenzte Skalierbarkeit:</strong> Die Anzahl der verfügbaren GPUs begrenzt direkt die Anzahl der Service-Replikate, die Sie ausführen können, und schränkt damit Ihre Fähigkeit ein, mit der Nachfrage zu skalieren.</p></li>
<li><p><strong>Geringere Flexibilität:</strong> Wenn sowohl die Indexerstellung als auch die Abfragen von GPUs abhängen, ist das System an die GPU-Verfügbarkeit gebunden und kann Arbeitslasten nicht einfach auf CPUs verlagern.</p></li>
</ul>
<p>Um diesen Einschränkungen zu begegnen, führt Milvus 2.6.1 einen flexiblen Bereitstellungsmodus für den GPU_CAGRA-Index über den Parameter <code translate="no">adapt_for_cpu</code> ein. Dieser Modus ermöglicht einen hybriden Arbeitsablauf: CAGRA verwendet die GPU, um einen hochwertigen Graph-Index zu erstellen, während die Ausführung der Abfrage auf der CPU erfolgt - typischerweise mit HNSW als Suchalgorithmus.</p>
<p>In diesem Setup werden GPUs dort eingesetzt, wo sie den größten Nutzen bringen - bei der schnellen, hochpräzisen Indexerstellung -, während CPUs große Abfrage-Workloads weitaus kostengünstiger und skalierbarer bewältigen.</p>
<p>Daher ist dieser hybride Ansatz besonders gut für Arbeitslasten geeignet, bei denen:</p>
<ul>
<li><p><strong>Datenaktualisierungen sind selten</strong>, so dass der Index nur selten neu aufgebaut werden muss</p></li>
<li><p><strong>das Abfragevolumen hoch ist</strong> und viele kostengünstige Replikate benötigt werden</p></li>
<li><p><strong>die Kostensensibilität hoch ist</strong> und die GPU-Nutzung streng kontrolliert werden muss</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Verständnis von <code translate="no">adapt_for_cpu</code></h3><p>In Milvus steuert der Parameter <code translate="no">adapt_for_cpu</code>, wie ein CAGRA-Index während der Indexerstellung auf die Festplatte serialisiert und wie er zur Ladezeit in den Speicher deserialisiert wird. Durch Ändern dieser Einstellung zur Erstellungszeit und zur Ladezeit kann Milvus flexibel zwischen GPU-basierter Indexerstellung und CPU-basierter Abfrageausführung wechseln.</p>
<p>Unterschiedliche Kombinationen von <code translate="no">adapt_for_cpu</code> zur Erstellungs- und Ladezeit führen zu vier Ausführungsmodi, die jeweils für ein bestimmtes Einsatzszenario konzipiert sind.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Erstellungszeit (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Ladezeit (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Ausführungslogik</strong></th><th style="text-align:center"><strong>Empfohlenes Szenario</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>wahr</strong></td><td style="text-align:center"><strong>wahr</strong></td><td style="text-align:center">Erstellung mit GPU_CAGRA → Serialisierung als HNSW → Deserialisierung als HNSW → <strong>CPU-Abfrage</strong></td><td style="text-align:center">Kostensensitive Workloads; Abfragen in großem Umfang</td></tr>
<tr><td style="text-align:center"><strong>wahr</strong></td><td style="text-align:center"><strong>falsch</strong></td><td style="text-align:center">Erstellen mit GPU_CAGRA → Serialisieren als HNSW → Deserialisieren als HNSW → <strong>CPU-Abfragen</strong></td><td style="text-align:center">Nachfolgende Abfragen werden an die CPU zurückgegeben, wenn die Parameter nicht übereinstimmen</td></tr>
<tr><td style="text-align:center"><strong>falsch</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">Erstellen mit GPU_CAGRA → Serialisieren als CAGRA → Deserialisieren als HNSW → <strong>CPU-Abfragen</strong></td><td style="text-align:center">Beibehaltung des ursprünglichen CAGRA-Index für die Speicherung bei gleichzeitiger Aktivierung einer temporären CPU-Suche</td></tr>
<tr><td style="text-align:center"><strong>falsch</strong></td><td style="text-align:center"><strong>false</strong></td><td style="text-align:center">Erstellen mit GPU_CAGRA → Serialisieren als CAGRA → Deserialisieren als CAGRA → <strong>GPU-Abfragen</strong></td><td style="text-align:center">Leistungskritische Workloads, bei denen die Kosten zweitrangig sind</td></tr>
</tbody>
</table>
<p><strong>Hinweis:</strong> Der Mechanismus <code translate="no">adapt_for_cpu</code> unterstützt nur eine einseitige Konvertierung. Ein CAGRA-Index kann in einen HNSW-Index konvertiert werden, da die CAGRA-Graphenstruktur alle Nachbarschaftsbeziehungen beibehält, die HNSW benötigt. Ein HNSW-Index kann jedoch nicht zurück nach CAGRA konvertiert werden, da ihm die zusätzlichen Strukturinformationen fehlen, die für GPU-basierte Abfragen benötigt werden. Daher sollten die Einstellungen für die Erstellungszeit sorgfältig ausgewählt werden, wobei die langfristige Bereitstellung und die Abfrageanforderungen zu berücksichtigen sind.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">GPU_CAGRA auf dem Prüfstand<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Zur Bewertung der Effektivität des hybriden Ausführungsmodells - Verwendung von GPUs für die Indexerstellung und CPUs für die Abfrageausführung - haben wir eine Reihe von kontrollierten Experimenten in einer standardisierten Umgebung durchgeführt. Die Bewertung konzentriert sich auf drei Dimensionen: <strong>Indexaufbauleistung</strong>, <strong>Abfrageleistung</strong> und <strong>Abrufgenauigkeit</strong>.</p>
<p><strong>Versuchsaufbau</strong></p>
<p>Die Experimente wurden auf weit verbreiteter, branchenüblicher Hardware durchgeführt, um sicherzustellen, dass die Ergebnisse zuverlässig und allgemein anwendbar sind.</p>
<ul>
<li><p>CPU: MD EPYC 7R13-Prozessor (16 CPUs)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Leistung des Indexaufbaus</h3><p>Wir vergleichen CAGRA, das auf dem Grafikprozessor erstellt wurde, mit HNSW, das auf der CPU erstellt wurde, mit demselben Zielgraphengrad von 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Wichtigste Ergebnisse</strong></p>
<ul>
<li><p><strong>GPU CAGRA baut Indizes 12-15x schneller auf als CPU HNSW.</strong> Sowohl bei Cohere1M als auch bei Gist1M übertrifft GPU-basiertes CAGRA das CPU-basierte HNSW deutlich, was die Effizienz der GPU-Parallelität während der Graphenerstellung unterstreicht.</p></li>
<li><p><strong>Die Erstellungszeit steigt linear mit den NN-Descent-Iterationen.</strong> Mit steigender Iterationszahl wächst die Erstellungszeit nahezu linear, was die iterative Verfeinerung des NN-Descent widerspiegelt und einen vorhersehbaren Kompromiss zwischen Erstellungskosten und Graphenqualität bietet.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Abfrageleistung</h3><p>In diesem Experiment wird der CAGRA-Graph einmal auf der GPU erstellt und dann über zwei verschiedene Ausführungspfade abgefragt:</p>
<ul>
<li><p><strong>CPU-Abfrage</strong>: Der Index wird in das HNSW-Format deserialisiert und auf der CPU durchsucht.</p></li>
<li><p><strong>GPU-Abfrage</strong>: Die Suche läuft direkt auf dem CAGRA-Graphen unter Verwendung eines GPU-basierten Traversals</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Wichtigste Ergebnisse</strong></p>
<ul>
<li><p><strong>Der Durchsatz der GPU-Suche ist 5-6x höher als der der CPU-Suche.</strong> Sowohl bei Cohere1M als auch bei Gist1M liefert das GPU-basierte Traversal wesentlich höhere QPS, was die Effizienz der parallelen Graphnavigation auf GPUs unterstreicht.</p></li>
<li><p><strong>Der Wiedererkennungswert steigt mit den NN-Descent-Iterationen und erreicht dann ein Plateau.</strong> Mit zunehmender Anzahl der Build-Iterationen verbessert sich die Wiederauffindung sowohl bei CPU- als auch bei GPU-Abfragen. Über einen bestimmten Punkt hinaus führen zusätzliche Iterationen jedoch zu abnehmenden Gewinnen, was darauf hindeutet, dass die Qualität des Graphen weitgehend konvergiert hat.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Abrufgenauigkeit</h3><p>In diesem Experiment werden sowohl CAGRA als auch HNSW auf der CPU abgefragt, um die Auffindbarkeit unter identischen Abfragebedingungen zu vergleichen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Wichtigste Ergebnisse</strong></p>
<p><strong>CAGRA erreicht bei beiden Datensätzen eine höhere Wiederauffindbarkeit als HNSW</strong>. Dies zeigt, dass die Qualität des Graphen auch dann gut erhalten bleibt, wenn ein CAGRA-Index auf der GPU erstellt und für die CPU-Suche deserialisiert wird.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">Was kommt als Nächstes? Skalierung der Indexerstellung mit Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Der hybride GPU-CPU-Ansatz von Milvus bietet eine praktische und kosteneffiziente Lösung für die heutigen umfangreichen Vektorsuch-Workloads. Durch die Erstellung qualitativ hochwertiger CAGRA-Graphen auf GPUs und die Bereitstellung von Abfragen auf CPUs wird eine schnelle Indexerstellung mit einer skalierbaren, kostengünstigen Abfrageausführung kombiniert - besonders<strong>geeignet für Arbeitslasten mit seltenen Aktualisierungen, hohem Abfragevolumen und strengen Kostenbeschränkungen.</strong></p>
<p>Bei noch größeren Skalen - zehn<strong>oder hundert Milliarden Vektoren -</strong>wird die<strong>Indexerstellung</strong>selbst zum Engpass. Wenn der gesamte Datensatz nicht mehr in den GPU-Speicher passt, wendet sich die Branche in der Regel <strong>einfügungsbasierten Graphkonstruktionsmethoden</strong> wie <strong>Vamana</strong> zu. Anstatt den Graphen auf einmal zu erstellen, verarbeitet Vamana die Daten stapelweise und fügt schrittweise neue Vektoren ein, während die globale Konnektivität erhalten bleibt.</p>
<p>Die Konstruktionspipeline folgt drei Schlüsselphasen:</p>
<p><strong>1. Geometrisches Batch-Wachstum</strong> - beginnend mit kleinen Batches zur Bildung eines Skelettgraphen, dann Erhöhung der Batch-Größe zur Maximierung der Parallelität und schließlich Verwendung großer Batches zur Verfeinerung von Details.</p>
<p><strong>2. Greedy Insertion</strong> - jeder neue Knoten wird durch Navigation von einem zentralen Einstiegspunkt aus eingefügt, wobei seine Nachbarn iterativ verfeinert werden.</p>
<p><strong>3. Rückwärts gerichtete Kantenaktualisierungen</strong> - Hinzufügen von Rückwärtsverbindungen, um die Symmetrie zu erhalten und eine effiziente Graphnavigation zu gewährleisten.</p>
<p>Das Pruning wird direkt in den Konstruktionsprozess integriert, indem das α-RNG-Kriterium verwendet wird: Wenn ein Nachbarschaftskandidat <em>v</em> bereits von einem bestehenden Nachbarn <em>p′</em> abgedeckt wird (d.h. <em>d(p′, v) &lt; α × d(p, v)</em>), wird <em>v</em> beschnitten. Der Parameter α ermöglicht eine genaue Kontrolle über die Sparsamkeit und Genauigkeit. Die GPU-Beschleunigung wird durch In-Batch-Parallelität und geometrische Batch-Skalierung erreicht, wodurch ein Gleichgewicht zwischen Indexqualität und Durchsatz erreicht wird.</p>
<p>Zusammen ermöglichen diese Techniken den Teams, ein schnelles Datenwachstum und umfangreiche Indexaktualisierungen zu bewältigen, ohne an die Grenzen des GPU-Speichers zu stoßen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Milvus-Team arbeitet aktiv an der Vamana-Unterstützung und plant eine Veröffentlichung in der ersten Hälfte des Jahres 2026. Bleiben Sie dran.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion des neuesten Milvus näher kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
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
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt</a></p></li>
</ul>
