---
id: 2019-11-08-data-management.md
title: Wie die Datenverwaltung in Milvus erfolgt
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: In diesem Beitrag wird die Datenverwaltungsstrategie in Milvus vorgestellt.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Verwaltung von Daten in einer Massive-Scale-Vektor-Suchmaschine</custom-h1><blockquote>
<p>Autor: Yihua Mo</p>
<p>Datum: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Wie die Datenverwaltung in Milvus erfolgt<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Zunächst einmal einige grundlegende Konzepte von Milvus:</p>
<ul>
<li>Tabelle: Eine Tabelle ist ein Datensatz von Vektoren, wobei jeder Vektor eine eindeutige ID hat. Jeder Vektor und seine ID stellen eine Zeile der Tabelle dar. Alle Vektoren in einer Tabelle müssen die gleichen Abmessungen haben. Unten sehen Sie ein Beispiel für eine Tabelle mit 10-dimensionalen Vektoren:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>Tabelle</span> </span></p>
<ul>
<li>Index: Die Indexerstellung ist der Prozess der Clusterung der Vektoren durch einen bestimmten Algorithmus, der zusätzlichen Speicherplatz erfordert. Einige Index-Typen benötigen weniger Platz, da sie die Vektoren vereinfachen und komprimieren, während einige andere Typen mehr Platz benötigen als die Rohvektoren.</li>
</ul>
<p>In Milvus können Benutzer Aufgaben wie das Erstellen einer Tabelle, das Einfügen von Vektoren, das Erstellen von Indizes, das Durchsuchen von Vektoren, das Abrufen von Tabelleninformationen, das Löschen von Tabellen, das Entfernen von Teildaten in einer Tabelle und das Entfernen von Indizes usw. durchführen.</p>
<p>Nehmen wir an, wir haben 100 Millionen 512-dimensionale Vektoren und müssen sie in Milvus für eine effiziente Vektorsuche einfügen und verwalten.</p>
<p><strong>(1) Einfügen von Vektoren</strong></p>
<p>Werfen wir einen Blick darauf, wie Vektoren in Milvus eingefügt werden.</p>
<p>Da jeder Vektor 2 KB Platz benötigt, beträgt der minimale Speicherplatz für 100 Millionen Vektoren etwa 200 GB, was ein einmaliges Einfügen all dieser Vektoren unrealistisch macht. Es müssen also mehrere Datendateien statt einer angelegt werden. Die Einfügeleistung ist einer der wichtigsten Leistungsindikatoren. Milvus unterstützt das einmalige Einfügen von Hunderten oder sogar Zehntausenden von Vektoren. Zum Beispiel dauert das einmalige Einfügen von 30 Tausend 512-dimensionalen Vektoren im Allgemeinen nur 1 Sekunde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>Einfügen</span> </span></p>
<p>Nicht jede Einfügung eines Vektors wird auf die Festplatte geladen. Milvus reserviert für jede Tabelle, die erstellt wird, einen veränderbaren Puffer im CPU-Speicher, in den die eingefügten Daten schnell geschrieben werden können. Und wenn die Daten im veränderbaren Puffer eine bestimmte Größe erreichen, wird dieser Bereich als unveränderlich gekennzeichnet. In der Zwischenzeit wird ein neuer veränderbarer Puffer reserviert. Die Daten im unveränderlichen Puffer werden regelmäßig auf die Festplatte geschrieben und der entsprechende CPU-Speicher wird freigegeben. Der Mechanismus des regelmäßigen Schreibens auf die Festplatte ähnelt dem in Elasticsearch verwendeten Mechanismus, der gepufferte Daten alle 1 Sekunde auf die Festplatte schreibt. Darüber hinaus können Benutzer, die mit LevelDB/RocksDB vertraut sind, hier eine gewisse Ähnlichkeit mit MemTable erkennen.</p>
<p>Die Ziele des Data Insert Mechanismus sind:</p>
<ul>
<li>Das Einfügen von Daten muss effizient sein.</li>
<li>Eingefügte Daten können sofort verwendet werden.</li>
<li>Die Datendateien sollten nicht zu stark fragmentiert sein.</li>
</ul>
<p><strong>(2) Rohdaten-Datei</strong></p>
<p>Wenn Vektoren auf die Festplatte geschrieben werden, werden sie in einer Rohdaten-Datei gespeichert, die die Rohvektoren enthält. Wie bereits erwähnt, müssen Vektoren mit großem Umfang in mehreren Datendateien gespeichert und verwaltet werden. Die Größe der eingefügten Daten variiert, da Benutzer 10 Vektoren oder 1 Million Vektoren auf einmal einfügen können. Der Vorgang des Schreibens auf die Festplatte wird jedoch einmal pro 1 Sekunde ausgeführt. Daher werden Datendateien unterschiedlicher Größe erzeugt.</p>
<p>Fragmentierte Datendateien sind weder bequem zu verwalten noch für die Vektorsuche leicht zugänglich. Milvus führt diese kleinen Datendateien ständig zusammen, bis die Größe der zusammengeführten Dateien eine bestimmte Größe erreicht, z. B. 1 GB. Diese bestimmte Größe kann mit dem API-Parameter <code translate="no">index_file_size</code> bei der Tabellenerstellung konfiguriert werden. Daher werden 100 Millionen 512-dimensionale Vektoren in etwa 200 Datendateien verteilt und gespeichert.</p>
<p>In Anbetracht der inkrementellen Berechnungsszenarien, bei denen Vektoren gleichzeitig eingefügt und durchsucht werden, müssen wir sicherstellen, dass die Vektoren, sobald sie auf die Festplatte geschrieben wurden, für die Suche verfügbar sind. Bevor die kleinen Datendateien zusammengeführt werden, kann also auf sie zugegriffen und sie können durchsucht werden. Sobald die Zusammenführung abgeschlossen ist, werden die kleinen Datendateien entfernt, und stattdessen werden die neu zusammengeführten Dateien für die Suche verwendet.</p>
<p>So sehen die abgefragten Dateien vor der Zusammenführung aus:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>Abgefragte Dateien nach der Zusammenführung:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) Indexdatei</strong></p>
<p>Die Suche auf der Grundlage der Rohdaten-Datei ist eine Brute-Force-Suche, bei der die Abstände zwischen den Abfragevektoren und den Ursprungsvektoren verglichen werden und die nächstgelegenen k Vektoren berechnet werden. Brute-force-Suche ist ineffizient. Die Sucheffizienz kann erheblich gesteigert werden, wenn die Suche auf einer Indexdatei basiert, in der die Vektoren indiziert sind. Der Aufbau des Index erfordert zusätzlichen Speicherplatz und ist in der Regel zeitaufwändig.</p>
<p>Was sind nun die Unterschiede zwischen Rohdaten- und Indexdateien? Einfach ausgedrückt: In der Rohdatendatei wird jeder einzelne Vektor zusammen mit seiner eindeutigen ID aufgezeichnet, während in der Indexdatei die Ergebnisse der Vektorclusterung, wie z. B. der Indextyp, die Clusterschwerpunkte und die Vektoren in jedem Cluster, gespeichert werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>indexdatei</span> </span></p>
<p>Im Allgemeinen enthält die Indexdatei mehr Informationen als die Rohdatendatei, jedoch sind die Dateigrößen viel kleiner, da die Vektoren während des Indexaufbaus vereinfacht und quantisiert werden (für bestimmte Indextypen).</p>
<p>Neu erstellte Tabellen werden standardmäßig durch Brute-Computation durchsucht. Sobald der Index im System erstellt ist, erstellt Milvus automatisch einen Index für zusammengeführte Dateien, die eine Größe von 1 GB erreichen, in einem eigenständigen Thread. Wenn der Indexaufbau abgeschlossen ist, wird eine neue Indexdatei erstellt. Die Rohdaten werden für die Indexerstellung auf der Grundlage anderer Indextypen archiviert.</p>
<p>Milvus erstellt automatisch einen Index für Dateien, die 1 GB erreichen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Indexaufbau abgeschlossen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>Der Index wird nicht automatisch für Rohdatendateien erstellt, die weniger als 1 GB groß sind, wodurch sich die Suchgeschwindigkeit verringern kann. Um diese Situation zu vermeiden, müssen Sie die Indexerstellung für diese Tabelle manuell erzwingen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcebuild</span> </span></p>
<p>Nachdem der Index für die Datei zwangsweise erstellt wurde, wird die Suchleistung erheblich verbessert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Metadaten</strong></p>
<p>Wie bereits erwähnt, sind 100 Millionen 512-dimensionale Vektoren in 200 Plattendateien gespeichert. Wenn für diese Vektoren ein Index erstellt wird, gibt es 200 zusätzliche Indexdateien, was die Gesamtzahl der Dateien auf 400 erhöht (einschließlich der Festplattendateien und Indexdateien). Für die Verwaltung der Metadaten (Dateistatus und andere Informationen) dieser Dateien ist ein effizienter Mechanismus erforderlich, um den Dateistatus zu überprüfen, Dateien zu entfernen oder zu erstellen.</p>
<p>Die Verwendung von OLTP-Datenbanken zur Verwaltung dieser Informationen ist eine gute Wahl. Milvus verwendet SQLite für die Verwaltung von Metadaten, während Milvus bei der verteilten Bereitstellung MySQL verwendet. Wenn der Milvus-Server startet, werden 2 Tabellen (nämlich 'Tables' und 'TableFiles') in SQLite bzw. MySQL erstellt. In "Tables" werden Tabelleninformationen und in "TableFiles" Informationen über Datendateien und Indexdateien aufgezeichnet.</p>
<p>Wie im nachstehenden Flussdiagramm dargestellt, enthält "Tables" Metadateninformationen wie Tabellenname (table_id), Vektordimension (dimension), Datum der Tabellenerstellung (created_on), Tabellenstatus (state), Indextyp (engine_type), Anzahl der Vektorcluster (nlist) und Abstandsberechnungsmethode (metric_type).</p>
<p>Und "TableFiles" enthält den Namen der Tabelle, zu der die Datei gehört (table_id), den Indextyp der Datei (engine_type), den Dateinamen (file_id), den Dateityp (file_type), die Dateigröße (file_size), die Anzahl der Zeilen (row_count) und das Erstellungsdatum der Datei (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>Metadaten</span> </span></p>
<p>Mit diesen Metadaten können verschiedene Operationen durchgeführt werden. Im Folgenden einige Beispiele:</p>
<ul>
<li>Um eine Tabelle zu erstellen, muss Meta Manager nur eine SQL-Anweisung ausführen: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Um eine Vektorsuche in Tabelle_2 durchzuführen, führt Meta Manager eine Abfrage in SQLite/MySQL aus, die de facto eine SQL-Anweisung ist: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code>, um die Dateiinformationen von Tabelle_2 abzurufen. Anschließend werden diese Dateien von Query Scheduler für die Suchberechnung in den Speicher geladen.</li>
<li>Es ist nicht erlaubt, eine Tabelle sofort zu löschen, da möglicherweise noch Abfragen auf ihr ausgeführt werden. Aus diesem Grund gibt es für eine Tabelle ein Soft-Delete und ein Hard-Delete. Wenn Sie eine Tabelle löschen, wird sie als "soft-delete" gekennzeichnet, und es dürfen keine weiteren Abfragen oder Änderungen an ihr vorgenommen werden. Die Abfragen, die vor der Löschung liefen, werden jedoch weiterhin ausgeführt. Erst wenn alle Abfragen vor der Löschung abgeschlossen sind, wird die Tabelle zusammen mit ihren Metadaten und zugehörigen Dateien endgültig gelöscht.</li>
</ul>
<p><strong>(5) Abfrage-Scheduler</strong></p>
<p>Das folgende Diagramm veranschaulicht den Prozess der Vektorsuche sowohl in der CPU als auch in der GPU durch Abfrage von Dateien (Rohdaten- und Indexdateien), die kopiert und auf der Festplatte, im CPU-Speicher und im GPU-Speicher für die Topk ähnlichsten Vektoren gespeichert werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>Der Algorithmus zur Abfrageplanung verbessert die Systemleistung erheblich. Die grundlegende Designphilosophie besteht darin, die beste Suchleistung durch maximale Nutzung der Hardwareressourcen zu erreichen. Im Folgenden wird der Abfrageplanungsalgorithmus nur kurz beschrieben; zu diesem Thema wird es in Zukunft einen eigenen Artikel geben.</p>
<p>Wir bezeichnen die erste Abfrage einer bestimmten Tabelle als "kalte" Abfrage und die nachfolgenden Abfragen als "warme" Abfrage. Bei der ersten Abfrage einer gegebenen Tabelle führt Milvus eine Menge Arbeit aus, um Daten in den CPU-Speicher und einige Daten in den GPU-Speicher zu laden, was sehr zeitaufwendig ist. Bei weiteren Abfragen ist die Suche viel schneller, da sich ein Teil oder alle Daten bereits im CPU-Speicher befinden, was die Zeit zum Lesen von der Festplatte spart.</p>
<p>Um die Suchzeit der ersten Abfrage zu verkürzen, bietet Milvus die Konfiguration Preload Table (<code translate="no">preload_table</code>), die das automatische Vorladen von Tabellen in den CPU-Speicher beim Start des Servers ermöglicht. Bei einer Tabelle mit 100 Millionen 512-dimensionalen Vektoren, also 200 GB, ist die Suchgeschwindigkeit am schnellsten, wenn genügend CPU-Speicher vorhanden ist, um alle diese Daten zu speichern. Wenn die Tabelle jedoch Vektoren in Milliardengröße enthält, ist es manchmal unvermeidlich, CPU-/GPU-Speicher freizugeben, um neue Daten hinzuzufügen, die nicht abgefragt werden. Derzeit verwenden wir LRU (Latest Recently Used) als Strategie zur Datenersetzung.</p>
<p>Wie in der folgenden Tabelle dargestellt, nehmen wir an, dass eine Tabelle mit 6 Indexdateien auf der Festplatte gespeichert ist. Der CPU-Speicher kann nur 3 Indexdateien speichern, der GPU-Speicher nur 1 Indexdatei.</p>
<p>Wenn die Suche beginnt, werden 3 Indexdateien für die Abfrage in den CPU-Speicher geladen. Die erste Datei wird sofort nach der Abfrage wieder aus dem CPU-Speicher freigegeben. In der Zwischenzeit wird die 4. Datei in den CPU-Speicher geladen. Wenn eine Datei im GPU-Speicher abgefragt wird, wird sie sofort freigegeben und durch eine neue Datei ersetzt.</p>
<p>Der Abfrageplaner verwaltet hauptsächlich 2 Gruppen von Aufgaben-Warteschlangen, eine für das Laden der Daten und eine für die Ausführung der Suche.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>Abfrage-Scheduler</span> </span></p>
<p><strong>(6) Ergebnisreduzierer</strong></p>
<p>Bei der Vektorsuche gibt es zwei Schlüsselparameter: n" steht für die Anzahl n der Zielvektoren, k" für die k ähnlichsten Vektoren. Die Suchergebnisse sind eigentlich n Sätze von KVP (Schlüssel-Wert-Paaren), die jeweils k Schlüssel-Wert-Paare enthalten. Da die Abfragen für jede einzelne Datei ausgeführt werden müssen, unabhängig davon, ob es sich um eine Rohdaten- oder eine Indexdatei handelt, werden für jede Datei n Sätze von Top-k-Ergebnissätzen abgerufen. Alle diese Ergebnismengen werden zusammengeführt, um die Top-k-Ergebnismengen der Tabelle zu erhalten.</p>
<p>Das nachstehende Beispiel zeigt, wie die Ergebnismengen für die Vektorsuche in einer Tabelle mit 4 Indexdateien (n=2, k=3) zusammengeführt und reduziert werden. Beachten Sie, dass jede Ergebnismenge 2 Spalten hat. Die linke Spalte steht für die Vektorkennung und die rechte Spalte für den euklidischen Abstand.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>Ergebnis</span> </span></p>
<p><strong>(7) Zukünftige Optimierungen</strong></p>
<p>Es folgen einige Überlegungen zu möglichen Optimierungen der Datenverwaltung.</p>
<ul>
<li>Wie wäre es, wenn die Daten in unveränderlichen Puffern oder sogar veränderlichen Puffern auch sofort abgefragt werden könnten? Derzeit können die Daten in unveränderlichen Puffern nicht abgefragt werden, nicht bevor sie auf die Festplatte geschrieben werden. Einige Benutzer sind eher an einem sofortigen Zugriff auf die Daten nach dem Einfügen interessiert.</li>
<li>Bereitstellung von Tabellenpartitionierungsfunktionen, die es dem Benutzer ermöglichen, sehr große Tabellen in kleinere Partitionen zu unterteilen und eine Vektorsuche gegen eine bestimmte Partition durchzuführen.</li>
<li>Hinzufügen einiger Attribute zu Vektoren, die gefiltert werden können. Einige Benutzer möchten zum Beispiel nur in Vektoren mit bestimmten Attributen suchen. Es ist erforderlich, Vektorattribute und sogar rohe Vektoren abzurufen. Ein möglicher Ansatz ist die Verwendung einer KV-Datenbank wie z.B. RocksDB.</li>
<li>Bereitstellung von Datenmigrationsfunktionen, die eine automatische Migration veralteter Daten auf einen anderen Speicherplatz ermöglichen. In einigen Szenarien, in denen ständig Daten einfließen, können die Daten veralten. Da einige Benutzer sich nur für die Daten des letzten Monats interessieren und diese durchsuchen, werden die älteren Daten weniger nützlich und verbrauchen viel Speicherplatz. Ein Datenmigrationsmechanismus hilft, Speicherplatz für neue Daten freizugeben.</li>
</ul>
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
    </button></h2><p>Dieser Artikel stellt hauptsächlich die Datenverwaltungsstrategie in Milvus vor. Weitere Artikel über die verteilte Bereitstellung von Milvus, die Auswahl von Vektor-Indizierungsmethoden und den Abfrage-Scheduler werden in Kürze folgen. Bleiben Sie dran!</p>
<h2 id="Related-blogs" class="common-anchor-header">Verwandte Blogs<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus Metadaten-Verwaltung (1): Wie man Metadaten anzeigt</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus Metadaten-Verwaltung (2): Felder in der Metadatentabelle</a></li>
</ul>
