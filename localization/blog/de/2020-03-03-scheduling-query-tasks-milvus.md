---
id: scheduling-query-tasks-milvus.md
title: Hintergrund
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: Die Arbeit hinter den Kulissen
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Wie plant Milvus die Abfrageaufgaben?</custom-h1><p>In diesem Artikel wird erörtert, wie Milvus die Abfrageaufgaben plant. Wir werden auch über Probleme, Lösungen und zukünftige Orientierungen für die Implementierung von Milvus Scheduling sprechen.</p>
<h2 id="Background" class="common-anchor-header">Hintergrund<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir wissen aus der Verwaltung von Daten in einer massiven Vektorsuchmaschine, dass die Ähnlichkeitssuche in Vektoren durch den Abstand zwischen zwei Vektoren im hochdimensionalen Raum implementiert wird. Das Ziel der Vektorsuche ist es, K Vektoren zu finden, die dem Zielvektor am nächsten sind.</p>
<p>Es gibt viele Möglichkeiten, den Vektorabstand zu messen, z. B. den euklidischen Abstand:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euklidischer-abstand.png</span> </span></p>
<p>wobei x und y zwei Vektoren sind. n ist die Dimension der Vektoren.</p>
<p>Um K nächstgelegene Vektoren in einem Datensatz zu finden, muss der euklidische Abstand zwischen dem Zielvektor und allen Vektoren im zu durchsuchenden Datensatz berechnet werden. Anschließend werden die Vektoren nach ihrem Abstand sortiert, um die K nächstgelegenen Vektoren zu ermitteln. Der Rechenaufwand steht in direktem Verhältnis zur Größe des Datensatzes. Je größer der Datensatz ist, desto mehr Rechenarbeit erfordert eine Abfrage. Ein Grafikprozessor (GPU), der auf die Verarbeitung von Graphen spezialisiert ist, verfügt zufällig über viele Kerne, um die erforderliche Rechenleistung zu erbringen. Daher wird bei der Implementierung von Milvus auch die Unterstützung mehrerer GPUs in Betracht gezogen.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Grundlegende Konzepte<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Datenblock（TableFile）</h3><p>Um die Unterstützung für die Suche in großen Datenmengen zu verbessern, haben wir die Datenspeicherung von Milvus optimiert. Milvus unterteilt die Daten in einer Tabelle nach Größe in mehrere Datenblöcke. Bei der Vektorsuche durchsucht Milvus die Vektoren in jedem Datenblock und führt die Ergebnisse zusammen. Ein Vektorsuchvorgang besteht aus N unabhängigen Vektorsuchvorgängen (N ist die Anzahl der Datenblöcke) und N-1 Ergebnis-Zusammenführungsvorgängen.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Aufgaben-Warteschlange（TaskTable）</h3><p>Jede Ressource hat ein Aufgaben-Array, das die zur Ressource gehörenden Aufgaben aufzeichnet. Jede Aufgabe hat verschiedene Zustände, darunter Start, Laden, Geladen, Ausführen und Ausgeführt. Der Loader und der Executor in einer Recheneinheit teilen sich dieselbe Aufgabenwarteschlange.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Abfrage-Planung</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-abfrage-planung.png</span> </span></p>
<ol>
<li>Wenn der Milvus-Server startet, startet Milvus die entsprechende GpuResource über die <code translate="no">gpu_resource_config</code> Parameter in der <code translate="no">server_config.yaml</code> Konfigurationsdatei. DiskResource und CpuResource können in <code translate="no">server_config.yaml</code> noch nicht bearbeitet werden. GpuResource ist die Kombination aus <code translate="no">search_resources</code> und <code translate="no">build_index_resources</code> und wird im folgenden Beispiel als <code translate="no">{gpu0, gpu1}</code> bezeichnet:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-Beispiel-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-beispiel.png</span> </span></p>
<ol start="2">
<li>Milvus empfängt eine Anfrage. Die Tabellen-Metadaten werden in einer externen Datenbank gespeichert, die SQLite oder MySQl für Single-Host und MySQL für verteilte Systeme ist. Nachdem Milvus eine Suchanfrage erhalten hat, prüft es, ob die Tabelle existiert und die Dimension konsistent ist. Dann liest Milvus die TableFile-Liste der Tabelle.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-liest-tabelle-datei-liste.png</span> </span></p>
<ol start="3">
<li>Milvus erstellt eine SearchTask. Da die Berechnung jeder TableFile unabhängig voneinander durchgeführt wird, erstellt Milvus für jede TableFile eine SearchTask. Als Grundeinheit der Aufgabenplanung enthält eine SearchTask die Zielvektoren, Suchparameter und die Dateinamen der TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus wählt ein Rechengerät aus. Das Gerät, auf dem eine SearchTask Berechnungen durchführt, hängt von der <strong>geschätzten Fertigstellungszeit</strong> für jedes Gerät ab. Die <strong>geschätzte Fertigstellungszeit</strong> gibt das geschätzte Intervall zwischen dem aktuellen Zeitpunkt und dem geschätzten Zeitpunkt des Abschlusses der Berechnung an.</li>
</ol>
<p>Wenn beispielsweise ein Datenblock einer SearchTask in den CPU-Speicher geladen wird, wartet die nächste SearchTask in der Warteschlange für CPU-Berechnungsaufgaben und die Warteschlange für GPU-Berechnungsaufgaben ist inaktiv. Die <strong>geschätzte Fertigstellungszeit</strong> für die CPU ist gleich der Summe der geschätzten Zeitkosten der vorherigen SearchTask und der aktuellen SearchTask. Die <strong>geschätzte Fertigstellungszeit</strong> für einen Grafikprozessor ist gleich der Summe aus der Zeit für das Laden von Datenblöcken in den Grafikprozessor und den geschätzten Zeitkosten der aktuellen SearchTask. Die <strong>geschätzte Fertigstellungszeit</strong> für eine SearchTask in einer Ressource ist gleich der durchschnittlichen Ausführungszeit aller SearchTasks in der Ressource. Milvus wählt dann ein Gerät mit der geringsten <strong>geschätzten Fertigstellungszeit</strong> und weist die Suchaufgabe dem Gerät zu.</p>
<p>Hier nehmen wir an, dass die <strong>geschätzte Fertigstellungszeit</strong> für GPU1 kürzer ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-kürzere-geschätzte-Fertigstellungszeit.png</span> </span></p>
<ol start="5">
<li><p>Milvus fügt SearchTask in die Task-Warteschlange von DiskResource ein.</p></li>
<li><p>Milvus verschiebt SearchTask in die Task-Warteschlange von CpuResource. Der Lade-Thread in CpuResource lädt jede Aufgabe der Reihe nach aus der Aufgaben-Warteschlange. CpuResource liest die entsprechenden Datenblöcke in den CPU-Speicher.</p></li>
<li><p>Milvus verschiebt SearchTask nach GpuResource. Der Lade-Thread in GpuResource kopiert Daten aus dem CPU-Speicher in den GPU-Speicher. GpuResource liest die entsprechenden Datenblöcke in den GPU-Speicher.</p></li>
<li><p>Milvus führt SearchTask in GpuResource aus. Da das Ergebnis einer SearchTask relativ klein ist, wird das Ergebnis direkt in den CPU-Speicher zurückgegeben.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus fügt das Ergebnis von SearchTask zum gesamten Suchergebnis zusammen.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>Nachdem alle SearchTasks abgeschlossen sind, gibt Milvus das gesamte Suchergebnis an den Client zurück.</p>
<h2 id="Index-building" class="common-anchor-header">Indexerstellung<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Indexaufbau ist im Grunde dasselbe wie der Suchprozess ohne den Zusammenführungsprozess. Wir werden hier nicht im Detail darauf eingehen.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimierung der Leistung<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>Wie bereits erwähnt, müssen Datenblöcke vor der Berechnung in die entsprechenden Speichergeräte wie den CPU-Speicher oder den GPU-Speicher geladen werden. Um das wiederholte Laden von Daten zu vermeiden, führt Milvus den LRU-Cache (Least Recently Used) ein. Wenn der Cache voll ist, verdrängen neue Datenblöcke alte Datenblöcke. Sie können die Cache-Größe in der Konfigurationsdatei auf der Grundlage der aktuellen Speichergröße anpassen. Ein großer Cache zum Speichern von Suchdaten wird empfohlen, um effektiv Datenladezeit zu sparen und die Suchleistung zu verbessern.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Überschneidungen beim Laden und Berechnen von Daten</h3><p>Der Cache kann unsere Anforderungen an eine bessere Suchleistung nicht erfüllen. Die Daten müssen neu geladen werden, wenn der Speicher nicht ausreicht oder der Datensatz zu groß ist. Wir müssen die Auswirkungen des Datenladens auf die Suchleistung verringern. Das Laden von Daten, sei es von der Festplatte in den CPU-Speicher oder vom CPU-Speicher in den GPU-Speicher, gehört zu den IO-Operationen und erfordert kaum Rechenarbeit von den Prozessoren. Daher ziehen wir in Betracht, das Laden von Daten und die Berechnung parallel durchzuführen, um die Ressourcen besser zu nutzen.</p>
<p>Wir unterteilen die Berechnung eines Datenblocks in drei Stufen (Laden von der Festplatte in den CPU-Speicher, CPU-Berechnung, Zusammenführung der Ergebnisse) oder in vier Stufen (Laden von der Festplatte in den CPU-Speicher, Laden vom CPU-Speicher in den GPU-Speicher, GPU-Berechnung und Ergebnisabruf sowie Zusammenführung der Ergebnisse). Nehmen wir als Beispiel eine 3-stufige Berechnung, so können wir 3 Threads starten, die für die 3 Stufen verantwortlich sind, um als Befehlspipelining zu funktionieren. Da die Ergebnismengen meist klein sind, nimmt die Zusammenführung der Ergebnisse nicht viel Zeit in Anspruch. In einigen Fällen kann die Überlappung von Datenladen und Berechnung die Suchzeit um die Hälfte reduzieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequenzielles-überlappendes-laden-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Probleme und Lösungen<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Unterschiedliche Übertragungsgeschwindigkeiten</h3><p>Bisher verwendet Milvus die Round-Robin-Strategie für die Planung von Multi-GPU-Aufgaben. Diese Strategie funktionierte auf unserem 4-GPU-Server perfekt und die Suchleistung war viermal besser. Bei unseren 2-GPU-Hosts war die Leistung jedoch nicht um den Faktor 2 besser. Wir haben einige Experimente durchgeführt und festgestellt, dass die Datenkopiergeschwindigkeit für eine GPU 11 GB/s betrug. Bei einer anderen GPU waren es jedoch nur 3 GB/s. Nach einem Blick in die Mainboard-Dokumentation bestätigten wir, dass das Mainboard mit einer GPU über PCIe x16 und einer anderen GPU über PCIe x4 verbunden war. Das bedeutet, dass diese GPUs unterschiedliche Kopiergeschwindigkeiten haben. Später fügten wir die Kopierzeit hinzu, um das optimale Gerät für jede SearchTask zu messen.</p>
<h2 id="Future-work" class="common-anchor-header">Zukünftige Arbeiten<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Hardwareumgebung mit erhöhter Komplexität</h3><p>Unter realen Bedingungen kann die Hardwareumgebung komplizierter sein. Bei Hardwareumgebungen mit mehreren CPUs, Speicher mit NUMA-Architektur, NVLink und NVSwitch bietet die Kommunikation zwischen CPUs/GPUs viele Möglichkeiten zur Optimierung.</p>
<p>Abfrageoptimierung</p>
<p>Bei unseren Experimenten haben wir einige Möglichkeiten zur Leistungsverbesserung entdeckt. Wenn der Server zum Beispiel mehrere Abfragen für dieselbe Tabelle erhält, können die Abfragen unter bestimmten Bedingungen zusammengeführt werden. Durch die Nutzung der Datenlokalität können wir die Leistung verbessern. Diese Optimierungen werden in unserer zukünftigen Entwicklung implementiert. Jetzt wissen wir bereits, wie Abfragen für das Single-Host- und Multi-GPU-Szenario geplant und durchgeführt werden. Wir werden in den kommenden Artikeln weitere innere Mechanismen für Milvus vorstellen.</p>
