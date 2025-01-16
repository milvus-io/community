---
id: dna-sequence-classification-based-on-milvus.md
title: DNA-Sequenz-Klassifizierung auf der Grundlage von Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Verwenden Sie Milvus, eine Open-Source-Vektor-Datenbank, um Genfamilien von
  DNA-Sequenzen zu erkennen. Weniger Platz, aber höhere Genauigkeit.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Klassifizierung von DNA-Sequenzen auf der Grundlage von Milvus</custom-h1><blockquote>
<p>Autorin: Mengjia Gu, Dateningenieurin bei Zilliz, schloss ihr Studium an der McGill University mit einem Master in Informationswissenschaften ab. Ihre Interessen umfassen KI-Anwendungen und Ähnlichkeitssuche mit Vektordatenbanken. Als Mitglied der Community des Open-Source-Projekts Milvus hat sie verschiedene Lösungen wie ein Empfehlungssystem und ein DNA-Sequenz-Klassifizierungsmodell entwickelt und verbessert. Sie genießt Herausforderungen und gibt niemals auf!</p>
</blockquote>
<custom-h1>Einführung</custom-h1><p>Die DNA-Sequenz ist ein beliebtes Konzept sowohl in der akademischen Forschung als auch bei praktischen Anwendungen wie der Rückverfolgbarkeit von Genen, der Identifizierung von Arten und der Diagnose von Krankheiten. Während alle Branchen nach einer intelligenteren und effizienteren Forschungsmethode suchen, hat die künstliche Intelligenz vor allem im biologischen und medizinischen Bereich viel Aufmerksamkeit auf sich gezogen. Immer mehr Wissenschaftler und Forscher leisten einen Beitrag zum maschinellen Lernen und zum Deep Learning in der Bioinformatik. Um experimentelle Ergebnisse überzeugender zu machen, ist eine gängige Option die Vergrößerung der Stichprobe. Die Zusammenarbeit mit Big Data in der Genomik bringt auch in der Realität mehr Möglichkeiten für Anwendungsfälle. Das traditionelle Sequenzalignment hat jedoch Einschränkungen, die es <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">für große Datenmengen ungeeignet</a> machen. Um in der Realität weniger Kompromisse eingehen zu müssen, ist die Vektorisierung eine gute Wahl für einen großen Datensatz von DNA-Sequenzen.</p>
<p>Die Open-Source-Vektordatenbank <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> ist für große Datenmengen geeignet. Sie ist in der Lage, Vektoren von Nukleinsäuresequenzen zu speichern und eine hocheffiziente Abfrage durchzuführen. Sie kann auch dazu beitragen, die Kosten für Produktion und Forschung zu senken. Das auf Milvus basierende System zur Klassifizierung von DNA-Sequenzen benötigt nur Millisekunden, um eine Genklassifizierung durchzuführen. Außerdem weist es eine höhere Genauigkeit auf als andere gängige Klassifizierungsverfahren des maschinellen Lernens.</p>
<custom-h1>Verarbeitung der Daten</custom-h1><p>Ein Gen, das genetische Informationen kodiert, besteht aus einem kleinen Abschnitt der DNA-Sequenz, die aus 4 Nukleotidbasen [A, C, G, T] besteht. Im menschlichen Genom gibt es etwa 30.000 Gene, fast 3 Milliarden DNA-Basenpaare, und jedes Basenpaar hat 2 entsprechende Basen. Um verschiedene Verwendungszwecke zu unterstützen, können DNA-Sequenzen in verschiedene Kategorien eingeteilt werden. Um die Kosten zu senken und die Nutzung von Daten mit langen DNA-Sequenzen zu erleichtern, wird <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer </a>zur Datenvorverarbeitung eingeführt. Dadurch werden die DNA-Sequenzdaten dem Klartext ähnlicher. Darüber hinaus können vektorisierte Daten die Berechnungen bei der Datenanalyse oder beim maschinellen Lernen beschleunigen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>Die k-mer-Methode wird häufig bei der Vorverarbeitung von DNA-Sequenzen verwendet. Sie extrahiert von jeder Base der ursprünglichen Sequenz einen kleinen Abschnitt der Länge k und wandelt so eine lange Sequenz der Länge s in (s-k+1) kurze Sequenzen der Länge k um. Die Anpassung des Wertes von k verbessert die Leistung des Modells. Listen kurzer Sequenzen sind einfacher für das Lesen der Daten, die Merkmalsextraktion und die Vektorisierung.</p>
<p><strong>Vektorisierung</strong></p>
<p>DNA-Sequenzen werden in Form von Text vektorisiert. Eine durch k-mer transformierte Sequenz wird zu einer Liste kurzer Sequenzen, die wie eine Liste einzelner Wörter in einem Satz aussieht. Daher sollten die meisten Modelle zur Verarbeitung natürlicher Sprache auch für DNA-Sequenzdaten funktionieren. Für das Modelltraining, die Merkmalsextraktion und die Kodierung können ähnliche Methoden angewendet werden. Da jedes Modell seine eigenen Vor- und Nachteile hat, hängt die Auswahl der Modelle von den Merkmalen der Daten und dem Zweck der Forschung ab. CountVectorizer zum Beispiel, ein Bag-of-Words-Modell, implementiert die Merkmalsextraktion durch einfache Tokenisierung. Es setzt keine Begrenzung der Datenlänge, aber das zurückgegebene Ergebnis ist im Hinblick auf den Ähnlichkeitsvergleich weniger offensichtlich.</p>
<custom-h1>Milvus-Demo</custom-h1><p>Milvus kann unstrukturierte Daten problemlos verwalten und die ähnlichsten Ergebnisse unter Billionen von Vektoren innerhalb einer durchschnittlichen Verzögerung von Millisekunden abrufen. Die Ähnlichkeitssuche basiert auf dem ANN-Suchalgorithmus (Approximate Nearest Neighbor). Diese Highlights machen Milvus zu einer großartigen Option für die Verwaltung von Vektoren von DNA-Sequenzen und fördern somit die Entwicklung und Anwendungen der Bioinformatik.</p>
<p>Hier ist eine Demo, die zeigt, wie man ein DNA-Sequenz-Klassifizierungssystem mit Milvus erstellt. Der <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">Versuchsdatensatz </a>umfasst 3 Organismen und 7 Genfamilien. Alle Daten werden mit Hilfe von k-mers in Listen von kurzen Sequenzen umgewandelt. Mit einem vortrainierten CountVectorizer-Modell kodiert das System dann Sequenzdaten in Vektoren. Das folgende Flussdiagramm zeigt die Struktur des Systems und die Prozesse des Einfügens und Suchens.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Probieren Sie diese Demo im <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvus-Bootcamp</a> aus.</p>
<p>In Milvus erstellt das System eine Sammlung und fügt entsprechende Vektoren von DNA-Sequenzen in die Sammlung (oder Partition, falls aktiviert) ein. Bei einer Abfrage gibt Milvus die Abstände zwischen dem Vektor der eingegebenen DNA-Sequenz und den ähnlichsten Ergebnissen in der Datenbank zurück. Die Klasse der Eingabesequenz und die Ähnlichkeit zwischen den DNA-Sequenzen kann durch die Vektorabstände in den Ergebnissen bestimmt werden.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Klassifizierung von DNA-Sequenzen</strong>Die Suche nach den ähnlichsten DNA-Sequenzen in Milvus kann auf die Genfamilie einer unbekannten Probe hindeuten und somit Aufschluss über ihre mögliche Funktionalität geben.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> Wenn eine Sequenz als GPCRs klassifiziert wird, dann hat sie wahrscheinlich Einfluss auf Körperfunktionen. </a>In dieser Demo hat Milvus das System erfolgreich in die Lage versetzt, die Genfamilien der menschlichen DNA-Sequenzen zu identifizieren, mit denen gesucht wurde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>Genetische Ähnlichkeit</strong></p>
<p>Die durchschnittliche DNA-Sequenz-Ähnlichkeit zwischen Organismen zeigt, wie ähnlich sich ihre Genome sind. Die Demo sucht in den menschlichen Daten nach den ähnlichsten DNA-Sequenzen wie die von Schimpansen und Hunden. Dann berechnet und vergleicht sie die durchschnittlichen inneren Produktabstände (0,97 für Schimpansen und 0,70 für Hunde), was beweist, dass Schimpansen mehr ähnliche Gene mit dem Menschen teilen als Hunde. Mit komplexeren Daten und einem komplexeren Systemdesign ist Milvus in der Lage, die Genforschung auch auf höherer Ebene zu unterstützen.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Leistung</strong></p>
<p>In der Demo wird das Klassifizierungsmodell mit 80 % der menschlichen Beispieldaten (insgesamt 3629) trainiert und die restlichen Daten als Testdaten verwendet. Sie vergleicht die Leistung des DNA-Sequenz-Klassifizierungsmodells, das Milvus verwendet, mit dem Modell, das auf Mysql und 5 gängigen Machine-Learning-Klassifizierern basiert. Das auf Milvus basierende Modell übertrifft seine Gegenstücke in der Genauigkeit.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>Weitere Erkundung</custom-h1><p>Mit der Entwicklung der Big-Data-Technologie wird die Vektorisierung von DNA-Sequenzen eine immer wichtigere Rolle in der genetischen Forschung und Praxis spielen. Kombiniert mit professionellem Wissen in der Bioinformatik können verwandte Studien weiter von der Einbeziehung der DNA-Sequenzvektorisierung profitieren. Daher kann Milvus in der Praxis bessere Ergebnisse liefern. Je nach den verschiedenen Szenarien und Bedürfnissen der Benutzer bieten die Ähnlichkeitssuche und die Abstandsberechnung mit Milvus ein großes Potenzial und viele Möglichkeiten.</p>
<ul>
<li><strong>Untersuchung unbekannter Sequenzen</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">Nach Ansicht einiger Forscher kann die Vektorisierung DNA-Sequenzdaten komprimieren.</a> Gleichzeitig erfordert sie weniger Aufwand, um Struktur, Funktion und Evolution unbekannter DNA-Sequenzen zu untersuchen. Milvus kann eine große Anzahl von DNA-Sequenzvektoren speichern und abrufen, ohne an Genauigkeit zu verlieren.</li>
<li><strong>Geräte anpassen</strong>: Begrenzt durch traditionelle Algorithmen des Sequenzalignments, kann die Ähnlichkeitssuche kaum von der Verbesserung der Geräte<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>) profitieren. Milvus, das sowohl reguläre CPU-Berechnungen als auch GPU-Beschleunigung unterstützt, löst dieses Problem mit dem Algorithmus der nächsten Nachbarn.</li>
<li><strong>Erkennung von Viren und Rückverfolgung ihrer Herkunft</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">Wissenschaftler haben Genomsequenzen verglichen und berichtet, dass das COVID19-Virus, das wahrscheinlich von Fledermäusen stammt, zu SARS-COV gehört</a>. Auf der Grundlage dieser Schlussfolgerung können die Forscher die Stichprobengröße erweitern, um weitere Beweise und Muster zu finden.</li>
<li><strong>Krankheiten diagnostizieren</strong>: In der Klinik könnten Ärzte DNA-Sequenzen zwischen Patienten und Gesunden vergleichen, um krankheitsverursachende Genvarianten zu identifizieren. Es ist möglich, Merkmale zu extrahieren und diese Daten mit geeigneten Algorithmen zu kodieren. Milvus ist in der Lage, Abstände zwischen Vektoren zu ermitteln, die mit Krankheitsdaten in Verbindung gebracht werden können. Neben der Unterstützung der Krankheitsdiagnose kann diese Anwendung auch die Erforschung <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">gezielter Therapien</a> inspirieren.</li>
</ul>
<custom-h1>Erfahren Sie mehr über Milvus</custom-h1><p>Milvus ist ein leistungsstarkes Tool, das eine Vielzahl von Anwendungen für künstliche Intelligenz und Vektorähnlichkeitssuche unterstützt. Wenn Sie mehr über das Projekt erfahren möchten, lesen Sie die folgenden Ressourcen:</p>
<ul>
<li>Lesen Sie unseren <a href="https://milvus.io/blog">Blog</a>.</li>
<li>Interagieren Sie mit unserer Open-Source-Community auf <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Nutzen Sie die beliebteste Vektordatenbank der Welt auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie zu ihr bei.</li>
<li>Testen und implementieren Sie KI-Anwendungen schnell mit unserem neuen <a href="https://github.com/milvus-io/bootcamp">Bootcamp</a>.</li>
</ul>
