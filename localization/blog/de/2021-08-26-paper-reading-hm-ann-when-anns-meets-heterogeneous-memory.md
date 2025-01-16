---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: Lesen von Papier｜HM-ANN Wenn ANNS auf heterogenen Speicher trifft
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Effiziente Milliarden-Punkt-Nächste-Nachbarn-Suche auf heterogenem
  Speicher
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Paper Reading ｜ HM-ANN: Wenn ANNS auf heterogenen Speicher trifft</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a> ist ein Forschungspapier, das auf der 2020 Conference on Neural Information Processing Systems<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>) angenommen wurde. In diesem Papier wird ein neuartiger Algorithmus für graphbasierte Ähnlichkeitssuche, genannt HM-ANN, vorgeschlagen. Dieser Algorithmus berücksichtigt sowohl die Heterogenität des Speichers als auch die Heterogenität der Daten in einer modernen Hardwareumgebung. HM-ANN ermöglicht eine Ähnlichkeitssuche in Milliardenhöhe auf einer einzigen Maschine ohne Komprimierungstechnologien. Heterogener Speicher (HM) ist eine Kombination aus schnellem, aber kleinem dynamischen Direktzugriffsspeicher (DRAM) und langsamem, aber großem persistenten Speicher (PMem). HM-ANN erreicht eine niedrige Suchlatenz und eine hohe Suchgenauigkeit, insbesondere wenn der Datensatz nicht in den DRAM passt. Der Algorithmus hat einen deutlichen Vorteil gegenüber dem Stand der Technik bei der approximativen Suche nach dem nächsten Nachbarn (ANN).</p>
<custom-h1>Motivation</custom-h1><p>Seit ihrer Einführung stellen ANN-Suchalgorithmen aufgrund der begrenzten DRAM-Kapazität einen grundlegenden Kompromiss zwischen Abfragegenauigkeit und Abfragelatenz dar. Um Indizes im DRAM für einen schnellen Abfragezugriff zu speichern, ist es notwendig, die Anzahl der Datenpunkte zu begrenzen oder komprimierte Vektoren zu speichern, was beides die Suchgenauigkeit beeinträchtigt. Graphenbasierte Indizes (z. B. Hierarchical Navigable Small World, HNSW) haben eine bessere Abfrage-Laufzeitleistung und Abfragegenauigkeit. Allerdings können diese Indizes auch 1-TiB-DRAM verbrauchen, wenn sie mit Datensätzen im Milliardenbereich arbeiten.</p>
<p>Es gibt andere Lösungen, um zu vermeiden, dass DRAM Datensätze in Milliardengröße im Rohformat speichert. Wenn ein Datensatz zu groß ist, um auf einer einzelnen Maschine in den Speicher zu passen, werden komprimierte Verfahren wie die Produktquantisierung der Punkte des Datensatzes verwendet. Allerdings ist die Wiederauffindbarkeit dieser Indizes mit dem komprimierten Datensatz aufgrund des Präzisionsverlusts bei der Quantisierung normalerweise gering. Subramanya et al. [1] erforschen die Nutzung von Solid-State-Laufwerken (SSD), um eine ANN-Suche in Milliardenhöhe mit einer einzigen Maschine zu erreichen, mit einem Ansatz namens Disk-ANN, bei dem der Rohdatensatz auf SSD und die komprimierte Darstellung auf DRAM gespeichert wird.</p>
<custom-h1>Einführung in den heterogenen Speicher</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Heterogener Speicher (HM) ist die Kombination aus schnellem, aber kleinem DRAM und langsamem, aber großem PMem. DRAM ist normale Hardware, die in jedem modernen Server zu finden ist, und sein Zugriff ist relativ schnell. Neue PMem-Technologien wie die Intel® Optane™ DC Persistent Memory Modules schließen die Lücke zwischen NAND-basiertem Flash (SSD) und DRAM und beseitigen den E/A-Engpass. PMem ist langlebig wie SSD und wie Speicher direkt von der CPU adressierbar. Renen et al. [2] haben herausgefunden, dass die PMem-Lesebandbreite 2,6-mal niedriger und die Schreibbandbreite 7,5-mal niedriger ist als die von DRAM in der konfigurierten Versuchsumgebung.</p>
<custom-h1>HM-ANN-Entwurf</custom-h1><p>HM-ANN ist ein genauer und schneller ANN-Suchalgorithmus in Milliardenhöhe, der auf einer einzigen Maschine ohne Komprimierung läuft. Das Design von HM-ANN verallgemeinert die Idee von HNSW, dessen hierarchische Struktur natürlich in HM passt. HNSW besteht aus mehreren Schichten - nur Schicht 0 enthält den gesamten Datensatz, und jede verbleibende Schicht enthält eine Teilmenge von Elementen aus der direkt darunter liegenden Schicht.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Die Elemente in den oberen Schichten, die nur Teilmengen des Datensatzes enthalten, verbrauchen nur einen kleinen Teil des gesamten Speichers. Diese Beobachtung macht sie zu geeigneten Kandidaten für die Unterbringung im DRAM. Auf diese Weise wird erwartet, dass die meisten Suchvorgänge bei HM-ANN in den oberen Schichten stattfinden, wodurch die schnelle Zugriffscharakteristik von DRAM maximal ausgenutzt werden kann. Bei HNSW hingegen finden die meisten Suchvorgänge in der untersten Schicht statt.</li>
<li>Da der Zugriff auf die Schicht 0 langsamer ist, ist es vorzuziehen, dass bei jeder Abfrage nur auf einen kleinen Teil zugegriffen wird und die Zugriffshäufigkeit reduziert wird.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algorithmus zur Erstellung von Graphen<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Der Kerngedanke der HM-ANN-Konstruktion besteht darin, qualitativ hochwertige obere Schichten zu schaffen, um eine bessere Navigation für die Suche auf Schicht 0 zu ermöglichen. So erfolgt der meiste Speicherzugriff im DRAM, und der Zugriff im PMem wird reduziert. Um dies zu ermöglichen, hat der Konstruktionsalgorithmus von HM-ANN eine Top-Down-Einfügephase und eine Bottom-Up-Promotion-Phase.</p>
<p>In der Top-Down-Einfügephase wird ein navigierbarer Small-World-Graph erstellt, wenn die unterste Schicht auf dem PMem platziert wird.</p>
<p>In der Bottom-up-Promotion-Phase werden Pivot-Punkte aus der untersten Schicht in die oberen Schichten eingefügt, die ohne größere Genauigkeitsverluste auf dem DRAM platziert werden. Wenn eine qualitativ hochwertige Projektion von Elementen aus Schicht 0 in Schicht 1 erstellt wird, findet die Suche in Schicht 0 die genauen nächsten Nachbarn der Anfrage mit nur wenigen Sprüngen.</p>
<ul>
<li>Anstelle der zufälligen Auswahl von HNSW für die Beförderung verwendet HM-ANN eine Beförderungsstrategie mit hohem Grad, um Elemente mit dem höchsten Grad in Schicht 0 in Schicht 1 zu befördern. Für höhere Schichten befördert HM-ANN Knoten mit hohem Grad in die obere Schicht, basierend auf einer Beförderungsrate.</li>
<li>HM-ANN befördert mehr Knoten von Schicht 0 nach Schicht 1 und legt für jedes Element in Schicht 1 eine größere maximale Anzahl von Nachbarn fest. Die Anzahl der Knoten in den oberen Schichten wird durch den verfügbaren DRAM-Speicherplatz bestimmt. Da die Schicht 0 nicht im DRAM gespeichert wird, erhöht sich die Suchqualität, wenn jede Schicht im DRAM dichter gespeichert wird.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Graph Seach Algorithmus<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Der Suchalgorithmus besteht aus zwei Phasen: schnelle Speichersuche und parallele Schicht-0-Suche mit Prefetching.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Schnelle Speichersuche</h3><p>Wie bei HNSW beginnt die Suche in DRAM am Einstiegspunkt in der obersten Schicht und führt dann eine 1-Greedy-Suche von oben bis zur Schicht 2 durch. Um den Suchraum in Schicht 0 einzugrenzen, führt HM-ANN die Suche in Schicht 1 mit einem Suchbudget von <code translate="no">efSearchL1</code> durch, wodurch die Größe der Kandidatenliste in Schicht 1 begrenzt wird. Diese Kandidaten der Liste werden als mehrere Einstiegspunkte für die Suche in Schicht 0 verwendet, um die Suchqualität in Schicht 0 zu verbessern. Während HNSW nur einen Einstiegspunkt verwendet, wird die Lücke zwischen Schicht 0 und Schicht 1 in HM-ANN spezieller behandelt als Lücken zwischen zwei anderen Schichten.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Parallele Schicht-0-Suche mit Prefetching</h3><p>In der unteren Schicht teilt HM-ANN die oben genannten Kandidaten aus der Suche in Schicht 1 gleichmäßig auf und betrachtet sie als Einstiegspunkte für eine parallele Multi-Start-1-Greedy-Suche mit Threads. Die Spitzenkandidaten aus jeder Suche werden gesammelt, um die besten Kandidaten zu finden. Die parallele Suche verbirgt die Latenz von PMem und nutzt die Speicherbandbreite optimal aus, um die Suchqualität zu verbessern, ohne die Suchzeit zu erhöhen.</p>
<p>HM-ANN implementiert einen softwareverwalteten Puffer im DRAM, um Daten vor dem Speicherzugriff aus PMem zu holen. Bei der Suche in Schicht 1 kopiert HM-ANN asynchron die Nachbarelemente der Kandidaten in <code translate="no">efSearchL1</code> und die Verbindungen der Nachbarelemente in Schicht 1 aus PMem in den Puffer. Bei der Suche in Schicht 0 wird ein Teil der Daten, auf die zugegriffen werden soll, bereits im DRAM vorgeholt, was die Latenzzeit für den Zugriff auf PMem verbirgt und zu einer kürzeren Abfragezeit führt. Dies entspricht dem Designziel von HM-ANN, bei dem die meisten Speicherzugriffe im DRAM stattfinden und die Speicherzugriffe im PMem reduziert werden.</p>
<custom-h1>Bewertung</custom-h1><p>In diesem Papier wird eine umfassende Bewertung durchgeführt. Alle Experimente werden auf einem Rechner mit Intel Xeon Gold 6252 CPU@2.3GHz durchgeführt. Er verwendet DDR4 (96GB) als schnellen Speicher und Optane DC PMM (1,5TB) als langsamen Speicher. Es werden fünf Datensätze ausgewertet: BIGANN, DEEP1B, SIFT1M, DEEP1M und GIST1M. Für die Tests im Milliarden-Maßstab werden die folgenden Verfahren herangezogen: Quantisierungsbasierte Verfahren im Milliarden-Maßstab (IMI+OPQ und L&amp;C), die nicht kompressionsbasierten Verfahren (HNSW und NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Vergleich der Algorithmen im Milliardenmaßstab<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>In Tabelle 1 werden die Erstellungszeit und der Speicherplatz der verschiedenen graphbasierten Indizes verglichen. HNSW benötigt die kürzeste Erstellungszeit und HM-ANN benötigt 8 % mehr Zeit als HNSW. In Bezug auf die gesamte Speichernutzung sind HM-ANN-Indizes 5-13 % größer als HSNW, da mehr Knoten von Schicht 0 nach Schicht 1 verschoben werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>In Abbildung 1 wird die Abfrageleistung der verschiedenen Indizes analysiert. Abbildung 1 (a) und (b) zeigen, dass HM-ANN den Top-1 Recall von &gt; 95% innerhalb von 1ms erreicht. Die Abbildungen 1 © und (d) zeigen, dass HM-ANN einen Top-100-Recall von &gt; 90% innerhalb von 4 ms erreicht. HM-ANN bietet im Vergleich zu allen anderen Ansätzen die beste Leistung in Bezug auf die Latenzzeit und den Abruf.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Vergleich der Algorithmen im Millionenmaßstab<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>In Abbildung 2 wird die Abfrageleistung der verschiedenen Indizes in einer reinen DRAM-Umgebung analysiert. HNSW, NSG und HM-ANN werden mit den drei Millionen-Datensätzen bewertet, die in DRAM passen. HM-ANN erreicht immer noch eine bessere Abfrageleistung als HNSW. Der Grund dafür ist, dass die Gesamtzahl der Abstandsberechnungen von HM-ANN geringer ist (durchschnittlich 850/Abfrage) als die von HNSW (durchschnittlich 900/Abfrage), um das Ziel von 99 % Recall zu erreichen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Effektivität der Beförderung mit hohen Graden<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>In Abbildung 3 werden die Strategien Random Promotion und High-Degree Promotion in derselben Konfiguration verglichen. Die High-Degree-Promotion übertrifft die Baseline. Die High-Degree-Promotion ist 1,8-mal, 4,3-mal und 3,9-mal schneller als die Random-Promotion, um die Ziele von 95 %, 99 % bzw. 99,5 % Recall zu erreichen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Leistungsvorteil von Speicherverwaltungstechniken<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbildung 5 enthält eine Reihe von Schritten zwischen HNSW und HM-ANN, um zu zeigen, wie jede Optimierung von HM-ANN zu den Verbesserungen beiträgt. BP steht für die Bottom-up-Promotion beim Aufbau des Index. PL0 steht für die parallele Layer-0-Suche, während DP für das Prefetching von Daten vom PMem zum DRAM steht. Schritt für Schritt wird die Suchleistung von HM-ANN weiter gesteigert.</p>
<custom-h1>Schlussfolgerung</custom-h1><p>Ein neuer graphbasierter Indizierungs- und Suchalgorithmus, genannt HM-ANN, bildet das hierarchische Design der graphbasierten ANNs mit der Speicherheterogenität in HM ab. Auswertungen zeigen, dass HM-ANN zu den neuen State-of-the-Art-Indizes in Milliarden-Punkte-Datensätzen gehört.</p>
<p>Wir stellen einen Trend in der akademischen Welt und in der Industrie fest, bei dem der Aufbau von Indizes auf persistenten Speichergeräten im Mittelpunkt steht. Um DRAM zu entlasten, wurde mit Disk-ANN [1] ein Index auf SSD gebaut, dessen Durchsatz deutlich geringer ist als der von PMem. Die Erstellung von HM-ANN dauert jedoch immer noch einige Tage, wobei keine großen Unterschiede im Vergleich zu Disk-ANN festgestellt wurden. Wir glauben, dass es möglich ist, die Erstellungszeit von HM-ANN zu optimieren, wenn wir die Eigenschaften von PMem sorgfältiger nutzen, z. B. die Granularität von PMem (256 Bytes) berücksichtigen und Streaming-Befehle zur Umgehung von Cachelines verwenden. Wir glauben auch, dass in Zukunft weitere Ansätze mit langlebigen Speichergeräten vorgeschlagen werden.</p>
<custom-h1>Referenz</custom-h1><p>[1]: Suhas Jayaram Subramanya und Devvrit und Rohan Kadekodi und Ravishankar Krishaswamy und Ravishankar Krishaswamy: DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: Schnelle, genaue Milliarden-Punkt-Nächste-Nachbarn-Suche auf einem einzigen Knoten - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: Schnelle, genaue Milliarden-Punkt-Nächste-Nachbarn-Suche auf einem einzigen Knoten</a></p>
<p>[2]: Alexander van Renen und Lukas Vogel und Viktor Leis und Thomas Neumann und Alfons Kemper: Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Persistente Speicher-I/O-Primitive</a></p>
