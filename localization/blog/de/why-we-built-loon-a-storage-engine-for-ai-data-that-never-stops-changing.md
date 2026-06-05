---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >-
  Warum wir Loon entwickelt haben: eine Speicher-Engine für KI-Daten, die sich
  ständig verändert.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Chat_GPT_Image_Jun_5_2026_11_35_09_AM_82329865f6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >-
  Loon ist eine neue Speicher-Engine für Milvus 3.0 und Zilliz Vector Lakebase,
  die entwickelt wurde, um sich entwickelnde Vektordatensätze mit ColumnGroups,
  row ID alignment und Manifests zu verwalten.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Dieser Blog wurde ursprünglich auf zilliz.com veröffentlicht und wurde mit Genehmigung wiederveröffentlicht.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Wichtigste Erkenntnisse<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Dies ist ein langer, tiefgehender technischer Tauchgang, daher hier die wichtigsten Punkte, bevor wir ins Detail gehen.</p>
<ul>
<li>KI-Datensätze sind keine statischen Tabellen. Dieselben Zeilen ändern sich ständig, wenn Teams Einbettungsmodelle ersetzen, spärliche Vektoren hinzufügen, Beschriftungen überarbeiten, Beschriftungen wieder auffüllen, Indizes neu erstellen und Offline-Analysen durchführen.</li>
<li>Herkömmliche Speicherlayouts versagen in dreierlei Hinsicht: Lange Vektorspalten machen Backfills teuer, ein einziges Dateiformat kann sowohl Scans als auch Punktlesungen nicht gut bedienen, und die Speicherung in privaten Datenbanken zwingt externe Pipelines dazu, zusätzliche Kopien der Wahrheit zu erstellen.</li>
<li>Loon ist die neue Speicher-Engine für Milvus und Zilliz Vector Lakebase. Sie basiert auf hybriden Dateiformaten, Zeilen-ID-Abgleich und einem Manifest, das den Versionsstand des Datensatzes definiert.</li>
<li>Ziel ist es, dass ein einziger Vektordatensatz Online-Suche, Offline-Analyse, Backfills, Verdichtung und externe Berechnungen unterstützt, ohne dass Daten ständig kopiert, neu geschrieben oder neu importiert werden müssen.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine Zeit lang gab es ein Argument gegen Vektordatenbanken, das vernünftig klang.</p>
<p><em>Traditionelle Datenbanken speichern bereits Integer, Strings, JSON, Blobs und Indizes. Warum nicht einen</em> <em>Typ</em> <code translate="no">_vector_</code> <em>hinzufügen</em> <em>, daneben einen ANN-Index erstellen und das Ganze abhaken?</em></p>
<p>Für die frühe semantische Suche funktioniert das gut genug. Eine Vektorspalte plus ein Index können eine Demo, eine kleine RAG-Anwendung oder eine interne Suchfunktion unterstützen. Das Problem zeigt sich später, wenn der Datensatz sich weniger wie eine Tabelle und mehr wie ein KI-Datensystem verhält.</p>
<p>Ein Produktionsvektordatensatz hat Zeilen, Primärschlüssel, skalare Felder und abfragbare Spalten. In diesem Sinne sieht er wie eine Datenbanktabelle aus. Aber er hat auch den Umfang und die Workflow-Form eines Datensees. Er kann Hunderte von Millionen von Datensätzen enthalten. Sie wird wiederholt von Spark, Ray, DuckDB, Schulungspipelines, Auswertungsaufträgen und Datenqualitätssystemen gelesen und neu geschrieben.</p>
<p>Er hängt auch von der Objektspeicherung ab. Die Quellobjekte sind häufig Videos, Bilder, PDFs, Audiodateien oder Webdokumente, die in S3, GCS, OSS oder einem anderen Objektspeicher verbleiben. Die Datenbank speichert Verweise, Metadaten, abgeleitete Merkmale und Indizes. Dann kommen Dinge hinzu, für die herkömmliche Speichermodelle nicht als erstklassige Objekte konzipiert wurden: dichte Einbettungen, spärliche Vektoren, Beschriftungen, Vektorindizes, Textindizes, Löschprotokolle, Statistiken, Modellversionen, Parserversionen, externe Blob-Referenzen und die Versionsbeziehungen zwischen all diesen Objekten.</p>
<p><strong>Das ist der Punkt, an dem "einfach eine Vektorspalte hinzufügen" zu scheitern beginnt.</strong> Das Problem ist nicht, ob eine Datenbank Vektorbytes speichern kann. Viele Systeme können das. Die schwierigere Frage ist <strong>, ob das Speichermodell damit umgehen kann, wie sich Vektordaten ändern, wie sie abgefragt werden und wie sie über den KI-Datenstapel verteilt werden.</strong></p>
<p><strong>Aus diesem Grund haben wir Loon entwickelt, die neue Speicher-Engine für Milvus und</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(die nächste Evolution der Zilliz Cloud).</strong></p>
<p>Loon wurde mit drei Ideen entwickelt:</p>
<ol>
<li>Verwenden Sie verschiedene physische Formate für verschiedene Arten von Spalten.</li>
<li>Ausrichten dieser Spalten durch einen gemeinsamen Zeilen-ID-Raum.</li>
<li>Verwendung eines Manifests, um den Versionsstatus des Datensatzes zu definieren.</li>
</ol>
<p>Um zu sehen, warum diese Teile wichtig sind, beginnen wir mit einem gängigen multimodalen Workflow.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Ein Vektordatensatz ist nie wirklich fertig.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Stellen Sie sich vor, ein KI-Team erstellt einen Videodatensatz für multimodales Training.</p>
<p>Ein langes Video wird in den Objektspeicher hochgeladen. Eine Pipeline schneidet es auf der Grundlage von Szenenwechseln, Aufnahmegrenzen oder Zeitfenstern in Clips. Clips, die zu lang oder zu kurz, verschwommen, doppelt vorhanden oder von schlechter Qualität sind, werden herausgefiltert. Die verbleibenden Clips werden von einem ästhetischen Modell bewertet, von einem anderen Modell mit Untertiteln versehen, von einem Bildsprachmodell eingebettet und in einer Vektordatenbank zur Suche, Deduplizierung und Filterung von Trainingsdaten gespeichert.</p>
<p>Auf den ersten Blick sieht der Arbeitsablauf einfach aus:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Aber der Datensatz ist nicht vollständig ausgebildet.</p>
<ul>
<li>In der ersten Woche enthält die Tabelle vielleicht nur <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> und <code translate="no">duration</code>.</li>
<li>In der zweiten Woche fügt das Team <code translate="no">aesthetic_score</code> hinzu.</li>
<li>In der dritten Woche wird ein Untertitelungsmodell ausgeführt, und jeder Clip erhält eine <code translate="no">caption</code>.</li>
<li>In der vierten Woche geht das erste Einbettungsmodell online, und jeder Clip erhält eine 768-dimensionale CLIP-Einbettung.</li>
<li>Einen Monat später wechselt das Team das Modell und füllt <code translate="no">embedding_v2</code> wieder auf, jetzt mit 1024 Dimensionen.</li>
<li>Zwei Monate später wird die hybride Suche zu einer Anforderung, so dass das Team eine spärliche Vektorsäule hinzufügt.</li>
<li>Drei Monate später werden die Beschriftungen von Menschen überprüft und müssen an Ort und Stelle korrigiert werden.</li>
</ul>
<p>Der Datensatz wurde nie fertiggestellt. Es wurden immer wieder neue Interpretationen der gleichen zugrunde liegenden Zeilen angehäuft.</p>
<p>Dies ist einer der Hauptunterschiede zwischen Vektordaten und herkömmlichen Geschäftsdaten. Dieselbe Zeile wird immer wieder neu verarbeitet. Und durch die Skalierung wird dies von einer Unannehmlichkeit zu einem Speicherproblem: Multimodale Datensätze bestehen oft nicht aus Millionen von Datensätzen, sondern aus Hunderten von Millionen oder Milliarden. LAION-5B ist eine nützliche Referenz für diese Form - Milliarden von Bild-Text-Paaren, jedes mit Metadaten, Beschriftungen und Einbettungen. Der schwierige Teil ist also nicht das erste Einfügen. Der schwierige Teil ist alles, was passiert, nachdem der Datensatz anfängt, sich zu entwickeln. <strong>Diese Entwicklung wirft drei Probleme auf.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Das erste Problem: Lange Spalten machen die Schreibvergrößerung teuer<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Spaltenbasierte Formate wie Parquet eignen sich hervorragend für viele analytische Arbeitslasten. Sie funktionieren gut, wenn die Schemata ziemlich stabil sind, die Daten häufiger gelesen als neu geschrieben werden, die Scans nur eine Teilmenge der Spalten betreffen und die Komprimierung wichtig ist. Das ist die Welt, für die viele analytische Formate optimiert wurden.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Vektorielle Zeilen sind viel breiter als analytische Zeilen</h3><p>TPC-H <code translate="no">lineitem</code> ist eine gute Ausgangsbasis. Sie hat 16 Spalten: Ganzzahlige Schlüssel, Dezimalwerte, Datumsangaben, kurze Zeichenfolgen und ein kleines Kommentarfeld. Eine unkomprimierte Zeile ist etwa 150 Byte groß. Nach der Komprimierung kann sie noch viel kleiner sein. Mit einer 64 MB großen Zeilengruppe kann ein Speichersystem Hunderttausende von Zeilen in eine Gruppe packen.</p>
<p><strong>Vektordatensätze sehen nicht so aus.</strong></p>
<p>Ein Bild-Text-Datensatz im LAION-Stil kommt dem, was viele KI-Pipelines heute produzieren, sehr viel näher. Jede Zeile hat immer noch gewöhnliche Metadaten: eine URL, eine Beschriftung, Breite, Höhe, Qualitätsbewertungen, Beschriftungen usw. Sobald jedoch die Einbettung hinzugefügt wird, ändert sich die physische Form der Zeile.</p>
<p>Ein 768-dimensionaler CLIP-Vektor benötigt etwa 1,5 KB in fp16 oder 3 KB in fp32. Diese eine Spalte kann viel größer sein als eine ganze TPC-H <code translate="no">lineitem</code> Zeile.</p>
<p>Und 768 Dimensionen sind nach heutigen Maßstäben nicht ungewöhnlich oder groß. Eine 1024- oder 2048-dimensionale Einbettung ist in multimodalen Pipelines üblich. OpenAIs <code translate="no">text-embedding-3-large</code> geht bis zu 3072 Dimensionen, was etwa 12 KB pro Vektor in fp32 entspricht.</p>
<p>Der Vergleich ist deutlich:</p>
<table>
<thead>
<tr><th>Form des Datensatzes</th><th>Ungefähre Zeilengröße</th><th>Was dominiert die Zeile</th></tr>
</thead>
<tbody>
<tr><td>TPC-H-Zeilensatz</td><td>~150 Bytes unkomprimiert</td><td>Skalare und kurze String-Felder</td></tr>
<tr><td>LAION-artige Zeile mit 768-dim fp16-Vektor</td><td>~1,5 KB+</td><td>Einbettung</td></tr>
<tr><td>LAION-ähnliche Zeile mit 768-dim fp32-Vektor</td><td>~3 KB+</td><td>Einbettung</td></tr>
<tr><td>Zeile mit 3072-dim fp32-Vektor</td><td>~12 KB+ allein für den Vektor</td><td>Einbettung</td></tr>
</tbody>
</table>
<p>In vielen KI-Datensätzen ist die Vektorspalte nicht nur ein weiteres Feld. Physikalisch gesehen ist sie der größte Teil der Zeile. Das verändert die Kosten der Schemaentwicklung.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Das Hinzufügen einer Vektorspalte kann Hunderte von Gigabyte bedeuten</h3><p>Angenommen, ein Datensatz enthält 100 Millionen Videoclips. Das Hinzufügen einer neuen 1024-dimensionalen fp32-Einbettungsspalte bedeutet das Schreiben von etwa 400 GB an rohen Vektordaten. Dabei sind Statistiken, Indizes, Metadatenaktualisierungen, Objektspeicher-Overhead, Validierung oder Serving-Path-Integration noch nicht berücksichtigt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn das Team jeden Monat eine oder zwei vektorähnliche Spalten hinzufügt, z. B. <code translate="no">embedding_v2</code>, <code translate="no">sparse_vector</code> oder Rerank-Funktionen, wird die Schemaentwicklung zu einer wiederkehrenden daAta-Engineering-Aufgabe, die sich auf Hunderte von Gigabyte oder Terabyte beläuft.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Kleine logische Updates können große physische Rewrites auslösen</h3><p>Aktualisierungen sind ebenso wichtig.</p>
<p>In spaltenorientierten Systemen werden alte Daten normalerweise nicht an Ort und Stelle aktualisiert. Ein Löschprotokoll zeichnet auf, was sich geändert hat, und die Verdichtung schreibt später die aktiven Zeilen in neue Dateien. Dieses Modell ist überschaubar, wenn die Zeilen klein sind.</p>
<p>Bei Vektordaten kann eine kleine logische Aktualisierung eine große physische Neuschreibung auslösen.</p>
<p>Ein menschlicher Überprüfungsauftrag korrigiert vielleicht nur ein paar hundert Bytes in einer Beschriftung. Wenn aber die Beschriftung, der dichte Vektor, der spärliche Vektor und andere abgeleitete Merkmale denselben physischen Dateilebenszyklus haben, kann das System am Ende auch die Vektoren neu schreiben. Die logische Änderung ist gering. Die physische E/A kann riesig sein.</p>
<p>Dies ist das Problem der Schreibverstärkung bei der Vektorspeicherung. Der teure Teil ist nicht nur, dass Vektoren groß sind. Es liegt daran, dass große abgeleitete Felder und kleine veränderbare Felder oft durch ein Speicherlayout, das sie als eine Einheit behandelt, miteinander verbunden werden.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Bei KI-Datensätzen ist das Backfill eine Routineaufgabe</h3><p>Bei herkömmlichen analytischen Tabellen kann eine Schemaentwicklung nur gelegentlich auftreten. Bei KI-Datensätzen ist sie Routine. Erfassungsmodelle werden aktualisiert. Einbettungsmodelle werden ersetzt. Spärliche Vektoren werden später hinzugefügt. Rerank-Merkmale erscheinen. Menschliche Beschriftungen werden korrigiert. Governance-Tags werden wieder aufgefüllt. Indizes werden neu aufgebaut.</p>
<p>Diese Vorgänge sind keine einfachen Anhänge. Sie ändern oder erweitern häufig bestehende Zeilen.</p>
<p>Aus diesem Grund kann die Vektorspeicherung nicht nur auf den Scandurchsatz optimiert werden. Sie muss auch Backfills und partielle Aktualisierungen billiger machen.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Das zweite Problem: Dieselben Daten müssen Scans und Punktlesungen unterstützen<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem die Daten geschrieben wurden, teilt sich der Lesepfad auf. Ein und derselbe Vektordatensatz hat in der Regel zwei unterschiedliche Zugriffsmuster: <strong>analytisches Scannen und punktuelles Lesen.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Analytische Workloads benötigen breite, komprimierte Scans</h3><p>Eine Pipeline kann Filter wie z. B.:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Oder sie kann Offline-Analysen, vollständige Einbettungsbewertungen, BM25-Statistiken, Bitmap-Konstruktionen, Datenqualitätsprüfungen, Zählungen und Gruppierungen durchführen.</p>
<p>Dieses Muster liest viele Zeilen, aber nur wenige Spalten. Es bevorzugt sequenzielle E/A, größere Zeilengruppen, Komprimierung, Spaltenbeschneidung, Batch-Dekodierung und vektorisierte Ausführung.</p>
<p>Große Zeilengruppen sind hier hilfreich. Sie ermöglichen es, mit einer einzigen E/A-Anforderung eine große Menge an nützlichen Daten abzurufen, die Komprimierungseffizienz zu verbessern und der Ausführungsmaschine genügend zusammenhängende Daten zur Verfügung zu stellen, um den Overhead zu amortisieren. Wenn mehrere Spalten zusammen gelesen werden, trägt die Organisation dieser Spalten für den Scan-Durchsatz auch dazu bei, die Cache-Misses während der vektorisierten Ausführung zu reduzieren.</p>
<p>Parquet ist auf diesem Weg stark.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">ANN-Ergebnisse benötigen enge Suchabfragen auf Zeilenebene</h3><p>Nachdem die ANN-Suche die IDs der Kandidatenzeilen zurückgegeben hat, muss das System häufig Felder wie abrufen:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Dieses Muster liest weniger Zeilen, oft Hunderte oder Tausende, aber es benötigt einen genauen Zugriff nach Zeilen-ID. Es möchte eine bestimmte Zeile und Spalte finden, nur den erforderlichen Bytebereich abrufen und vermeiden, dass eine ganze Zeilengruppe abgerufen wird, nur um ein paar Datensätze zu erhalten.</p>
<p>Point Lookup hat fast die gegenteilige Vorliebe für das Scannen. Sie will eine kleinere Lesegranularität. Im Idealfall kann die Speicherschicht das relevante Segment oder den Bytebereich anhand der Zeilen-ID finden, nur diesen Bereich lesen und nur die für das Ergebnis benötigten Daten dekodieren.</p>
<p>Auch bei der Komprimierung gibt es einen anderen Kompromiss. Bei Scans lohnt sich eine stärkere Komprimierung oft, weil das System viele Daten liest und E/A einspart. Bei der Punktsuche kann die Komprimierung zu einer Belastung werden, wenn das Abrufen einer Zeile die Dekodierung eines viel größeren komprimierten Blocks erfordert.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Ein Layout kann nicht für beide Pfade optimiert werden</h3><p>Dies ist der Kernkonflikt. Skalare Filterung und Analysen erfordern breite, komprimierte, scanfreundliche Layouts. Die Vektorsuche benötigt enge, präzise, zeilenadressierbare Layouts.</p>
<p>Ein einziges Dateiformat kann beide bis zu einem gewissen Grad unterstützen, aber es kann nicht für beide gleichzeitig optimal sein.</p>
<p>Wenn sich alle Spalten in Parquet befinden, sind skalare Scans bequem. Aber die ANN-Suche nach dem Abruf wird schwieriger. Das System benötigt vielleicht nur ein paar hundert Vektoren, Beschriftungen oder Metadatensätze, während die Speicherebene möglicherweise große Zeilengruppen lesen muss, die größtenteils irrelevante Zeilen enthalten.</p>
<p>Auf einer lokalen SSD können Cache und mmap einen Teil dieser Kosten verbergen. Sobald die Daten im Objektspeicher gespeichert sind, werden die Kosten deutlicher sichtbar. Jeder Cache-Miss kann zu einem Remote Range Read werden. Wenn Kandidatenzeilen über viele Zeilengruppen verstreut sind, kann eine einzige Abfrage mehrere Lesevorgänge auslösen, die jeweils mehr Daten abrufen, als die Abfrage benötigt. In einem schlecht angelegten Layout kann das Abrufen von 1.000 Kandidatenzeilen leicht zu Dutzenden oder Hunderten von Megabyte unnötiger E/A führen, in Extremfällen sogar zu viel mehr.</p>
<p>Die Verkleinerung von Zeilengruppen hilft bei der Punktsuche, schadet aber den Scans. Zu viele kleine Fragmente verringern die Komprimierungseffizienz, erhöhen den Metadaten-Overhead und stören die langen sequenziellen Lesevorgänge, auf die Analyseprogramme angewiesen sind.</p>
<p><strong>Das Problem besteht also nicht darin, eine einzige magische Zeilengruppengröße zu finden. Das Problem ist, dass ein und derselbe Datensatz sich wie zwei verschiedene Speichersysteme verhalten soll.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">Die hybride Suche zwingt beide Wege in eine Abfrage</h3><p>Bei der hybriden Suche ist der Konflikt noch schwerer zu ignorieren. Eine einzelne Abfrage kann zunächst skalare Filter anwenden:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Dann führt sie die ANN-Suche durch.</p>
<p>Dann werden Überschrift, Vektor und Metadaten nach Zeilen-ID abgerufen.</p>
<p>Für den Benutzer ist dies eine einzige Suchanfrage. Für die Speicherebene ist es sowohl ein analytischer Scan als auch eine zufällige Suche mit niedriger Latenz.</p>
<p>Aus diesem Grund braucht die Vektorspeicherung mehr als nur eine bessere Parquet-Einstellung. Es muss eine Möglichkeit geben, verschiedene Spalten so zu platzieren, wie sie tatsächlich gelesen werden.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Das dritte Problem: Der Datensatz befindet sich nicht in einer einzigen Engine<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Die ersten beiden Probleme treten innerhalb der Datenbank auf. Das dritte Problem tritt an der Grenze zwischen den Systemen auf.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">KI-Datenpipelines umfassen viele Systeme</h3><p>Im Video-Workflow passiert nur sehr wenig innerhalb der Vektordatenbank selbst.</p>
<p>Die Rohvideos befinden sich im Objektspeicher. Die Clip-Generierung kann in Spark oder Ray ausgeführt werden. Die ästhetische Bewertung kann in einem GPU-Dienst ausgeführt werden. Die Untertitelung kann in einer LLM-Inferenz-Pipeline ausgeführt werden. Einbettungen können von einem anderen GPU-Job generiert werden. Spärliche Vektoren können von einem SPLADE-Dienst stammen. Offline-Evaluierung, Filterung von Trainingsdaten, menschliche Überprüfung und Verwaltungsaufgaben können an anderer Stelle ausgeführt werden.</p>
<p>Die Vektordatenbank dient der Online-Suche, aber der Datensatz wird von vielen Systemen erstellt, korrigiert, ausgewertet und erweitert.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Private Speicherformate erzeugen mehrere Kopien der Wahrheit</h3><p>Wenn die Datenbank ein privates physisches Format verwendet, das nur sie lesen und schreiben kann, benötigt jeder externe Auftrag einen Export, eine Konvertierung, eine Kopie und einen Import. Dieselbe Sammlung kann in der Datenbank, in einem temporären Spark-Verzeichnis, in einer Auswertungsausgabe und in einem lokalen Backfill-Verzeichnis vorhanden sein. Dann stellt sich die eigentliche Frage:</p>
<ul>
<li>Welche Kopie ist die Quelle der Wahrheit?</li>
<li>Welche Kopie enthält das Erfassungsmodell vom letzten Monat?</li>
<li>Welche Zeilen wurden bereits durch eine menschliche Überprüfung korrigiert?</li>
<li>Welche Spalte des spärlichen Vektors wurde von welchem Modell erzeugt?</li>
<li>Welcher Vektorindex ist nach dem Backfill noch gültig?</li>
<li>Auf welches ursprüngliche Videoobjekt bezieht sich diese Zeile?</li>
</ul>
<p>In kleinem Maßstab können Teams manchmal mit Namenskonventionen und manuellen Überprüfungen auskommen. Bei Hunderten von Millionen von Zeilen und Terabytes von Einbettungen wird dies zu einem Konsistenzproblem.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Vektordatensätze brauchen einen gemeinsamen versionierten Zustand</h3><p>Lakehouse-Systeme haben eine Version dieses Problems für strukturierte Daten aufgegriffen. Bei Iceberg, Delta Lake und Hudi geht es nicht nur um die Speicherung von Dateien. Ihr wichtigster Beitrag besteht darin, dass sich mehrere Engines um denselben Tabellenstatus herum koordinieren können.</p>
<p>Vektordatenbanken benötigen nun eine ähnliche Fähigkeit, aber der Zustand ist komplexer. Er muss nicht nur Tabellendateien und Partitionen, sondern auch Vektorindizes, Textindizes, Sparse Features, Löschprotokolle, Statistiken, Zeilen-ID-Bereiche und Verweise auf externe Blobs umfassen.</p>
<p>Die Frage lautet nicht einfach: "Kann Spark Milvus-Dateien lesen?"</p>
<p>Die Frage ist, nachdem Spark eine Sparse-Vektor-Spalte gefüllt hat, wie weiß Milvus, zu welcher Version diese Spalte gehört, welche Zeilen sie abdeckt, welches Modell sie erzeugt hat und wann Online-Abfragen sie sicher verwenden können?</p>
<p>Die Antwort muss im Speichermodell liegen.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Warum Patches nicht genug sind<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist verlockend, dies als drei separate technische Probleme zu betrachten.</p>
<ul>
<li>Schreibverstärkung? Batching hinzufügen.</li>
<li>Punktuelle Lesevorgänge? Fügen Sie einen Cache hinzu.</li>
<li>Externe Systeme? Fügen Sie Export- und Importwerkzeuge hinzu.</li>
</ul>
<p>Diese Korrekturen können helfen, aber sie lösen nicht das eigentliche Problem: Ein Vektordatensatz ist physikalisch heterogen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In dem Videobeispiel sind <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> und <code translate="no">aesthetic_score</code> kurze skalare Felder. Sie sind nützlich für Filterung und Analyse.</p>
<ul>
<li><code translate="no">caption</code> ist Text. Er kann für BM25, Überprüfung, Korrektur und Backfill verwendet werden.</li>
<li><code translate="no">embedding</code> ist ein langer, dichter Vektor. Er wird für den ANN-Abruf und später für das Nachschlagen auf Zeilenebene oder das Reranking verwendet.</li>
<li><code translate="no">embedding_v2</code> ist eine neue Modellausgabe, die oft lange nach dem Einfügen der ursprünglichen Daten aufgefüllt wird.</li>
<li><code translate="no">sparse_vector</code> unterstützt die hybride Suche und hat sein eigenes Zugriffsmuster.</li>
<li>Das Rohvideo sollte im Objektspeicher verbleiben. Die Datenbank sollte eine Referenz, eine Prüfsumme, einen MIME-Typ, eine Parser-Version und eine Beziehung auf Zeilenebene speichern.</li>
<li>Vektorindizes, Textindizes, Statistiken und Löschprotokolle sind abgeleitete Objekte mit einer eigenen Versionssemantik.</li>
</ul>
<p>Diese Objekte teilen sich eine logische Zeile, aber sie sollten nicht alle das gleiche physische Layout oder den gleichen Lebenszyklus haben.</p>
<ul>
<li>Wenn sie in ein gewöhnliches Tabellenlayout gezwungen werden, werden Aktualisierungen teuer.</li>
<li>Wenn sie in ein spaltenförmiges Dateiformat gezwungen werden, wird das Lesen von Punkten teuer.</li>
<li>Werden sie als unverbundene Objektdateien behandelt, wird die Versionsverwaltung anfällig.</li>
</ul>
<p>Das Speichermodell muss also von der Tatsache ausgehen, dass der Datenbestand heterogen ist.</p>
<p><strong>Daraus ergeben sich drei Designanforderungen:</strong></p>
<ul>
<li>Erstens sollten verschiedene Spaltengruppen in unterschiedlichen physischen Formaten gespeichert werden.</li>
<li>Zweitens benötigen diese Spaltengruppen einen gemeinsamen Zeilen-ID-Raum, damit sie sich weiterhin wie eine einzige logische Tabelle verhalten können.</li>
<li>Drittens benötigt das Dataset ein versioniertes Manifest, das angibt, welche Dateien, Indizes, Protokolle, Statistiken und Objektreferenzen zur aktuellen Ansicht gehören.</li>
</ul>
<p><strong>Dies ist das Design hinter Loon, unserer neuen Speicher-Engine hinter Milvus und Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: eine Speicher-Engine hinter Milvus und Zilliz Cloud für sich entwickelnde Vektordatensätze<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Um all die oben genannten Probleme zu lösen, haben wir <strong>Loon</strong> entwickelt, die neue Speicher-Engine für Milvus und <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (die nächste Evolution von Zilliz Cloud), die für sich entwickelnde Vektordatensätze entwickelt wurde.</p>
<p>Der Name folgt der Tradition der Vogelnamen von Zilliz. Ein Seetaucher ist ein Tauchvogel, der auf Seen lebt, was gut zum Ziel des Systems passt: eine Vektordatenbank sollte nicht jedes Mal einen ganzen Datensee verschieben, scannen oder neu schreiben müssen, wenn sie eine Abfrage durchführt, eine Spalte zurückfüllt oder einen Index erstellt. Sie sollte zunächst die aktuelle Version des Datensatzes verstehen, einschließlich seiner Spalten, Indizes, Statistiken, Löschprotokolle und Objektreferenzen, und dann nur den Teil lesen, den sie tatsächlich benötigt.</p>
<p>Hybride Dateiformate, die Ausrichtung von Zeilen-IDs und das Manifest sind keine drei separaten Funktionen. Sie beruhen auf der gleichen Design-Annahme: Ein Vektordatensatz ist von Natur aus heterogen.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Drei Teile, ein Speichermodell</h3><p>Hybride Dateiformate tragen der Tatsache Rechnung, dass verschiedene Spalten unterschiedliche Zugriffsmuster haben. Skalare Felder eignen sich gut für Scans und Filter. Vektorfelder benötigen effiziente Nachschlagemöglichkeiten auf Zeilenebene. Rohe Objekte wie Videos, PDFs, Bilder und Audiodateien gehören in den Objektspeicher und nicht in die Datenbankdateien.</p>
<p>Die Ausrichtung von Zeilen-IDs berücksichtigt, dass diese Spalten zwar physisch getrennt sein können, aber dennoch dieselben logischen Zeilen beschreiben. Eine Beschriftung, eine Einbettung, ein Sparse-Vektor und ein Video-URI können sich in unterschiedlichen Dateien und Formaten befinden, müssen aber dennoch zu einem einzigen Ergebnis zusammengeführt werden.</p>
<p>Das Manifest erkennt an, dass der Datensatz nicht einmal geschrieben und dann allein gelassen wird. Er wird von mehreren Systemen, in mehreren Versionen und für mehrere Aufgaben geändert. Indizes, Statistiken, Löschprotokolle, externe Objektreferenzen und Spaltengruppen müssen alle in der gleichen versionierten Ansicht erscheinen.</p>
<p><strong>Aus diesem Grund ist Loon nicht nur ein schnelleres Vektordateiformat.</strong> Ein schnelleres Format hilft bei der Punktsuche, aber es löst nicht die Schema-Evolution oder die Multi-Engine-Koordination. Durch die Ausrichtung der Zeilen-IDs verhalten sich geteilte Spalten wie eine einzige Tabelle, aber es wird nicht angegeben, welche Dateien zur aktuellen Version gehören. Ein Manifest kann den Zustand eines Datensatzes beschreiben, aber ohne Spaltengruppen und Zeilen-ID-Abgleich kann es verschiedene physische Layouts innerhalb einer logischen Sammlung nicht sauber darstellen.</p>
<p>Das Speichermodell braucht alle drei: verschiedene Formate für verschiedene Spaltengruppen, einen gemeinsamen Zeilen-ID-Raum, um Zeilen zu rekonstruieren, und ein versioniertes Manifest, das jedem Leser und Schreiber mitteilt, was der Datensatz gerade ist.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Wo Loon in Milvus und Zilliz Vector Lakebase passt</h3><p>In Milvus wird die alte Segment-Binlog-Speicherschicht durch ein Modell ersetzt, das auf Manifest, ColumnGroup, Dateiformat und Dateisystem-Abstraktionen aufbaut. In <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (die nächste Evolution von Zilliz Cloud) gilt<strong> die</strong> gleiche Richtung für die Vector Lakebase-Architektur: die Vektordatenbank soll schnell sein, während die zugrundeliegenden Daten einfacher zu entwickeln, zu analysieren und mit externen Systemen zu koordinieren sind.</p>
<p>Die Milvus-Komponenten der oberen Ebene behalten ihre vertrauten Rollen. Proxy übernimmt das Routing. QueryCoord und DataCoord übernehmen die Zeitplanung. IndexNode baut Indizes auf. Die anwendungsnahen APIs für Sammlungen, Einfügungen, Suchen und hybride Suchen müssen keine Manifestdateien oder ColumnGroups bereitstellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Änderung liegt darunter.</p>
<p>DataNode, QueryNode, Segcore, Compaction und externe Konnektoren können über dieselbe Speicherabstraktion arbeiten. Das ist wichtig, weil der Datensatz nicht mehr nur von der Datenbank geschrieben und gelesen wird. Er kann von externen Computersystemen erweitert und gleichzeitig von der Online-Suche genutzt werden.</p>
<p>Auf einer hohen Ebene sehen die Schichten wie folgt aus:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Manifest beschreibt den versionierten Zustand des Datensatzes. ColumnGroups bilden eine logische Sammlung in physische Gruppen von Spalten ab. Die Dateiformatebene ermöglicht jeder ColumnGroup die Auswahl eines geeigneten Formats. Die Abstraktion des Dateisystems funktioniert sowohl im Objektspeicher als auch im lokalen Speicher.</p>
<p>Wichtig ist, dass hybride Dateiformate, die Ausrichtung von Zeilen-IDs und das Manifest keine separaten Funktionen sind. Zusammen definieren sie das Speichermodell.</p>
<p>Mit diesem Modell können wir die drei Design-Entscheidungen einzeln betrachten: wie Loon verschiedene ColumnGroups speichert, wie es sie wieder zu Zeilen ausrichtet und wie das Manifest diese Dateien in einen versionierten Datensatz verwandelt.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Design 1: Verwenden Sie das richtige Dateiformat für die richtige Spaltengruppe<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Verschiedene Spalten haben unterschiedliche Zugriffsmuster. Sie sollten nicht in dasselbe Dateiformat gezwungen werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon trennt eine logische Sammlung in ColumnGroups.</h3><ul>
<li>Skalare Felder, Filterfelder, Geschäftsschlüssel und statistische Felder werden oft gescannt, gefiltert, aggregiert oder für die Abfrageplanung verwendet. Sie profitieren von Komprimierung, Spaltenbeschneidung und Ökosystemkompatibilität. Parquet ist für diese Spalten gut geeignet.</li>
<li>Dichte Vektoren, spärliche Vektoren und Rerank-Merkmale werden oft nach dem ANN-Abruf nach Zeilen-ID gelesen. Sie benötigen einen zufälligen Zugriff mit niedriger Latenz, präzise Lesevorgänge im Byte-Bereich und eine selektive Dekodierung. Ein segmentorientiertes Layout ist hier besser geeignet. Loon verwendet Vortex in dieser Richtung.</li>
<li>Rohe Objekte wie Videos, PDFs, Bilder und Audiodateien sollten nicht in die Datendateien der Vektordatenbank eingebettet werden. Sie sollten im Objektspeicher verbleiben. Die Datenbank zeichnet Referenzen, Prüfsummen, MIME-Typen, Parser-Versionen und Beziehungen auf Zeilenebene auf.</li>
</ul>
<p>Für das Videobeispiel könnte ein physisches Layout wie folgt aussehen:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Für die Anwendung ist dies immer noch eine einzige Sammlung. Für die Speicherebene verwenden die verschiedenen Teile dieser Sammlung unterschiedliche physische Formate. Dadurch werden unnötige Neuschreibungen direkt reduziert. Das Hinzufügen von <code translate="no">embedding_v2</code> kann zu einer neuen Vektor ColumnGroup plus einem Manifest Commit werden. Es ist nicht erforderlich, die Beschriftungsspalte, die skalaren Metadaten oder die vorhandene Einbettungsspalte neu zu schreiben.</p>
<p>Die gleiche Idee gilt für spärliche Vektoren, Rerank-Merkmale oder andere abgeleitete Felder. Wenn eine neue Spalte physisch unabhängig und an der Zeilen-ID ausgerichtet werden kann, muss sie nicht unverbundene Spalten durch denselben Rewrite-Pfad ziehen.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon passt sich auch an die Verwendung von Dateiformaten an.</h3><p><strong>Für Parquet sind die Standardeinstellungen nicht immer ideal für vektorlastige Daten.</strong> Eine 64-MB-Zeilengruppe kann für die Punktsuche zu groß sein, da ein kleiner zufälliger Lesezugriff viel mehr Daten als nötig abrufen kann. Loon verkleinert Zeilengruppen in relevanten Pfaden auf 1 MB und deaktiviert Kodierungen, wie z. B. die Wörterbuchkodierung von Vektorspalten, wenn sie für zufällig aussehende Vektordaten nicht hilfreich sind.</p>
<p><strong>Für Vortex ist das Layout die wichtigere Arbeit.</strong> Loon verwendet ein Layout, das ein Gleichgewicht zwischen Scan-Effizienz und Punktsuche herstellt. Innerhalb einer Zeilengruppe können Segmente aus verwandten Spalten nahe beieinander platziert werden, um das Scannen zu unterstützen. Um Operationen durchzuführen, kann das System durch das Lesen von Teilsegmenten nur die relevanten Bytes abrufen, anstatt ein ganzes Segment zu ziehen.</p>
<p><strong>Loon unterstützt auch die schreibgeschützte Lance-Integration</strong>, so dass bestehende Lance-Datensätze als ColumnGroups gemountet werden können, wenn Kompatibilität erforderlich ist.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Was der Benchmark zeigt</h3><p>In einem lokalen Test, bei dem eine einzelne Datei mit 40.000 Zeilen und dem Schema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code> verwendet wurde, zeigte Vortex diese Ergebnisse gegenüber Parquet mit 1 MB Zeilengruppen:</p>
<table>
<thead>
<tr><th>Vorgang</th><th>Vortex</th><th>Parquet</th><th>Unterschied</th></tr>
</thead>
<tbody>
<tr><td>Nehmen, K=1000 zufällige Zeilen</td><td>5,8 ms</td><td>144 ms</td><td>25x schneller</td></tr>
<tr><td>Vollständiger Vektor-Spalten-Scan</td><td>21 ms</td><td>142 ms</td><td>6,76x schneller</td></tr>
<tr><td>Dateigröße, ~21 MB Rohdaten</td><td>6,62 MB</td><td>7,16 MB</td><td>7% kleiner</td></tr>
</tbody>
</table>
<p>Das Ergebnis von <code translate="no">take</code> ergibt sich aus der Verringerung der Menge an irrelevanten Daten, die gelesen und dekodiert werden müssen. Das Scan-Ergebnis ergibt sich aus der Komprimierung und der Wahl der Implementierung.</p>
<p>Diese Zahlen sollten mit ihrer Einrichtung verbunden bleiben: 8 vCPU Ubuntu 22.04 KVM, lokales Dateisystem, eine Datei, 40.000 Zeilen, 1 MB Zeilengruppen und das obige Schema. Bei Objektspeicher kann die Netzwerk-E/A dominieren, so dass die Reduzierung der Leseverstärkung noch wichtiger sein kann. Die tatsächlichen Ergebnisse hängen von der Form des Datensatzes, dem Verhalten des Objektspeichers, dem Cache-Status und dem Abfragemuster ab.</p>
<p>Im Großen und Ganzen geht es nicht darum, dass jede Spalte Vortex verwenden sollte.</p>
<p>Es geht darum, dass Vektordatensätze eine Wahl des Dateiformats auf der Ebene der ColumnGroup benötigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Entwurf 2: Angleichung physischer Dateien durch Zeilen-IDs<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Hybride Dateiformate lösen ein Problem: Verschiedene Spalten können jetzt in den Formaten leben, die am besten zu ihnen passen.</p>
<p>Aber das schafft ein zweites Problem. Wenn skalare Felder in Parquet, Vektoren in Vortex und rohe Objekte in Objektspeicher leben, wie behandelt das System sie dann noch als eine Sammlung?</p>
<p><strong>Loon löst dieses Problem mit der Ausrichtung der Zeilen-ID.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">Row ID ist das Koordinatensystem der Speicherebene</h3><p>Jede physische ColumnGroupFile speichert den Dateipfad und den Zeilen-ID-Bereich, den sie abdeckt:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Verschiedene ColumnGroups können denselben Row-ID-Bereich abdecken, auch wenn sie in unterschiedlichen Dateien und Formaten vorliegen.</p>
<p>Bei der Zeilen-ID <code translate="no">12345</code> können die skalaren Metadaten in einer Parquet ColumnGroup, die Einbettung in einer Vortex ColumnGroup und das Rohvideo in einer Objektspeicherreferenz enthalten sein. Logisch gesehen handelt es sich immer noch um eine Zeile. Dadurch erhält die Speicherebene ein stabiles Koordinatensystem.</p>
<p>Die Zeilen-ID ist nicht der geschäftliche Primärschlüssel. Es ist das Koordinatensystem der Speicherebene, das es Loon ermöglicht, eine Sammlung physisch aufzuteilen, ohne die Fähigkeit zu verlieren, sie logisch zu rekonstruieren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Neue Spalten müssen alte Spalten nicht umschreiben</h3><p>Das Hinzufügen von <code translate="no">embedding_v2</code> erfordert kein Umschreiben der ursprünglichen Beschriftung, Metadaten oder <code translate="no">embedding_v1</code> ColumnGroups. Loon kann eine neue Vektor-ColumnGroup schreiben, den Zeilen-ID-Bereich aufzeichnen, den sie abdeckt, und diese Änderung über das Manifest festschreiben.</p>
<p>Dasselbe gilt für spärliche Vektoren, Rerank-Features oder andere abgeleitete Felder, die später hinzukommen.</p>
<p>Solange die neue ColumnGroup den richtigen Zeilen-ID-Bereich abdeckt, kann sie der gleichen logischen Auflistung beitreten, ohne dass nicht zugehörige Daten verschoben werden müssen.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Löschungen und Verdichtungen können gezielter erfolgen</h3><p>Die Ausrichtung von Zeilen-IDs hilft auch bei Löschungen.</p>
<p>Ein Löschvorgang kann zunächst durch ein Löschprotokoll ausgedrückt werden. Die Zeile wird auf der logischen Ebene unsichtbar, während die physische Bereinigung bis zur Verdichtung verzögert wird. Wenn die Verdichtung schließlich läuft, muss nicht immer jede ColumnGroup, die mit den betroffenen Zeilen verbunden ist, neu geschrieben werden. Sie kann sich auf die ColumnGroups konzentrieren, die bereinigt werden müssen.</p>
<p>Dies ist wichtig, weil nicht jede Spalte das gleiche Kostenprofil hat. Das Umschreiben einer kurzen skalaren ColumnGroup ist etwas ganz anderes als das Umschreiben von Hunderten von Gigabytes an dichten Vektoren.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">Die hybride Suche kann nur die Spalten abrufen, die sie benötigt.</h3><p>Der Abgleich von Zeilen-IDs macht die hybride Suche auch bei hybriden Dateiformaten sinnvoll.</p>
<p>Nachdem die ANN-Suche Kandidatenzeilen-IDs zurückgegeben hat, kann das System nur die Felder abrufen, die für das Endergebnis benötigt werden: Beschriftungen, Metadaten, Vektoren, Rerank-Features oder Objektreferenzen.</p>
<p>Zum Beispiel kann eine Abfrage erforderlich sein:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Diese Felder können sich in verschiedenen ColumnGroups befinden. Loon kann die relevanten Dateien anhand des Zeilen-ID-Bereichs lokalisieren, die erforderlichen Byte-Bereiche lesen und das Ergebnis zusammenstellen.</p>
<p>Ohne Row ID Alignment wären Hybridformate nur separate Dateien, die nebeneinander liegen. Mit Row ID Alignment verhalten sie sich wie eine einzige logische Sammlung.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader verbirgt die Aufteilung vor der oberen Schicht</h3><p>Die Laufzeitkomponente, die dies nutzbar macht, ist der Packed Reader.</p>
<p>Die obere Schicht sieht einen vereinheitlichten Arrow RecordBatch Stream. Darunter können die Daten aus mehreren ColumnGroups in unterschiedlichen Dateiformaten stammen. Der Packed Reader verbirgt diese Unterschiede, richtet die Daten nach Zeilen-ID-Bereichen aus und plant die E/A mehrerer Dateien mit kontrollierter Speichernutzung.</p>
<p>Er unterstützt auch die direkte <code translate="no">take</code> nach Zeilen-ID. Ausgehend von einer Reihe von Zeilen-IDs werden die entsprechenden ColumnGroupFiles gesucht, Lesebereiche ausgegeben und die angeforderten Felder zurückgegeben.</p>
<p>Für den Video-Workflow benötigt eine ANN-Abfrage möglicherweise <code translate="no">caption</code>, <code translate="no">embedding</code> und <code translate="no">video_uri</code>. Der Packed Reader kann die skalare ColumnGroup und die vektorielle ColumnGroup abrufen, ohne unverbundene Spalten zu berühren.</p>
<p>Das ist der Unterschied zwischen "getrennten Dateien" und "einer Tabelle mit mehreren physischen Layouts".</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Entwurf 3: Das Manifest als Quelle der Wahrheit<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Hybride Dateiformate definieren, wie die Daten physisch gespeichert werden. Die Ausrichtung der Zeilen-IDs bestimmt, wie getrennte ColumnGroups dennoch eine einzige logische Tabelle bilden. Aber das System muss noch eine größere Frage beantworten: <strong>Welche Dateien, Protokolle, Statistiken, Indizes und Objektreferenzen gehören zur aktuellen Version des Datensatzes? Das ist die Aufgabe des Manifests.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Objektspeicherverzeichnisse sind nicht genug</h3><p>Ein Objektspeicher ist kein Datenbankkatalog. Ein Verzeichnis kann alte Dateien, neue Dateien, fehlgeschlagene Job-Outputs, temporäre Dateien, Löschprotokolle, Dateien, auf die noch von älteren Snapshots verwiesen wird, und Dateien, die auf die Bereinigung warten, enthalten. Die Tatsache, dass eine Datei existiert, bedeutet nicht, dass sie zur aktuellen Version des Datasets gehört.</p>
<p>Ein Loon-Datensatz kann in Verzeichnissen wie dem folgenden organisiert sein:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Aber die Verzeichnisstruktur ist nicht die Quelle der Wahrheit. Das Manifest ist es. Leser sollten keine Verzeichnisse auflisten und den Zustand aus den zufällig vorhandenen Dateien ableiten. Sie sollten das aktuelle Manifest lesen und der versionierten Ansicht folgen die es deklariert.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Das Manifest definiert eine versionierte Ansicht des Datensatzes</h3><p>Das Manifest definiert den Datensatz in einer bestimmten Version. Es zeichnet auf:</p>
<ul>
<li>welche ColumnGroups existieren</li>
<li>welche Zeilen-ID-Bereiche sie abdecken</li>
<li>welches physische Format jede ColumnGroup verwendet</li>
<li>wo sich die Dateien befinden</li>
<li>welche Löschprotokolle aktiv sind</li>
<li>welche Statistiken verfügbar sind</li>
<li>welche Indizes existieren</li>
<li>welche externen Blobs referenziert werden</li>
<li>welche Spalten und Zeilenbereiche diese Statistiken oder Indizes abdecken</li>
</ul>
<p>Bei jeder Aktualisierung wird eine neue Manifest-Version geschrieben. Ein Leser, der Version N öffnet, sieht eine stabile Ansicht des Datenbestands in Version N. Ein Autor kann Version N+1 vorbereiten, ohne Leser zu stören, die noch Version N verwenden.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Das Manifest verfolgt mehr als nur Tabellendateien</h3><p>In Loon ist der Manifestkörper mit Apache Avro kodiert und in vier Hauptabschnitte gegliedert.</p>
<ul>
<li>ColumnGroups beschreiben die Spalten, Formate, Dateien und Zeilen-ID-Bereiche.</li>
<li>DeltaLogs beschreiben Löschvorgänge. Verschiedene Löschtypen decken unterschiedliche Änderungsquellen ab, z. B. Primärschlüssel-Löschungen von Clients, Positionslöschungen von der internen Verdichtung oder Gleichheitslöschungen von externen Engines.</li>
<li>Statistiken enthalten Planungsmetadaten wie Bloom-Filter, BM25-Statistiken und Min/Max-Werte.</li>
<li>Indizes beschreiben Index-Typ, Parameter, abgedeckte Spalten und Zeilen-ID-Bereiche. Dies kann Vektorindizes wie HNSW oder IVF, Textindizes, invertierte Indizes, Bitmap-Indizes und verwandte Strukturen umfassen.</li>
</ul>
<p>Darin unterscheidet sich Loon von einem herkömmlichen Tabellenmanifest.</p>
<p>Ein Vektordatensatz muss nicht nur Datendateien und Partitionen verfolgen. Es muss auch Vektorindizes, Textindizes, Sparse Features, Löschprotokolle, Statistiken, externe Objektreferenzen und die Zeilen-ID-Bereiche, die sie verbinden, verfolgen.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Das Manifest muss nicht nur von der Datenbank beschreibbar sein</h3><p>Der wichtigste Teil ist nicht nur, was das Manifest enthält. Es geht darum, wer es schreiben kann.</p>
<ul>
<li>Wenn nur die Datenbank das Manifest schreiben kann, bleiben es interne Metadaten. Sauberere Metadaten, aber immer noch privat für eine Engine.</li>
<li>Wenn externe Engines neue ColumnGroups, Statistiken und Manifest-Einträge erzeugen können, wird das Manifest zu einer Koordinationsschnittstelle.</li>
<li>Ein Spark-Auftrag kann zum Beispiel eine spärliche Vektorspalte auffüllen. Er schreibt eine neue ColumnGroup, zeichnet Zeilenabdeckung und Statistiken auf und überträgt ein neues Manifest. Online-Abfragen können während des Jobs weiterhin die alte Version lesen. Sobald die Übertragung erfolgreich war, wird die neue Version sichtbar.</li>
</ul>
<p>Diese Methode ähnelt Iceberg und Delta Lake, aber das Objektmodell ist breiter angelegt. Ein Vektordatensatz muss Vektorindizes, Textindizes, Sparse Features, Löschprotokolle, Statistiken, Blob-Referenzen und Zeilen-ID-Bereiche verfolgen, nicht nur Tabellendateien und Partitionen.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Optimistische Übertragungen halten Versionsaktualisierungen einfach</h3><p>Jeder Commit schreibt eine neue Manifest-Version. Ein Writer kann neue Inhalte basierend auf Version N erstellen und dann versuchen, <code translate="no">manifest-{N+1}.avro</code> zu schreiben. Die Semantik des Objektspeichers für bedingtes Schreiben oder Generierung kann dazu führen, dass der Commit fehlschlägt, wenn diese Version bereits existiert. Der Writer kann es dann mit der neueren Version erneut versuchen.</p>
<p>Dies gibt Loon optimistische Gleichzeitigkeit, ohne jede Aktualisierung durch einen schweren, stark konsistenten Koordinationspfad zu zwingen. Ohne ein Manifest wird die Speicherung in mehreren Formaten und mit mehreren Maschinen schließlich zu einer Namenskonvention und einem manuellen Abgleich. Das mag für kleine Datensätze funktionieren. Bei Vektordaten im TB-Bereich funktioniert es nicht.</p>
<p>Erst das Manifest macht aus heterogenen Dateien einen Datensatz, den mehrere Systeme sicher lesen und aktualisieren können.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Was sich für die Nutzer ändert, wenn der Speicher versioniert wird<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Für Anwendungsentwickler sollte Loon nicht zu einer neuen API-Belastung werden.</p>
<p>Die Benutzer sollten weiterhin mit vertrauten Milvus-Konzepten arbeiten: Sammlungen, Einfügungen, Suche und hybride Suche. Sie sollten sich während der normalen Anwendungsentwicklung keine Gedanken über Manifest-Dateien, ColumnGroups, Zeilen-ID-Bereiche oder Dateilayouts machen müssen.</p>
<p>Die Veränderung liegt darunter. Die Speicherung wird sich der tatsächlichen Entwicklung von KI-Datensätzen stärker bewusst.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Das Hinzufügen einer neuen Einbettung sollte die alten Daten nicht verschieben</h3><p>Bisher war es für das Hinzufügen von <code translate="no">embedding_v2</code> zu einer bestehenden Sammlung oft erforderlich, Daten zu exportieren, ein neues Modell zu trainieren, Vektoren zu generieren und die Sammlung dann über das SDK erneut zu importieren oder zu aktualisieren. Dieser Weg verursacht eine Menge betrieblicher Arbeit: Versionsverfolgung, fehlgeschlagene Job-Wiederholungen, Index-Neuaufbau, Serving Impact und Konsistenzprüfungen.</p>
<p><strong>Mit Loon kann dies zu einer Schema-Evolution plus einem neuen ColumnGroup-Commit werden.</strong> Die neue Einbettungsspalte kann als eigene physische ColumnGroup geschrieben, nach Zeilen-ID ausgerichtet und über das Manifest sichtbar gemacht werden. Die alte Beschriftungsspalte, die skalare Metadatenspalte und die ursprüngliche Einbettungsspalte müssen nicht verschoben werden.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Backfills sollten keine clientseitige Aktualisierungsschleife erfordern</h3><p>Viele AI-Datenaktualisierungen sind Backfills. Ein Team kann spärliche Vektoren hinzufügen, nachdem die hybride Suche wichtig geworden ist. Es kann Rerank-Features hinzufügen, nachdem ein neues Modell trainiert wurde. Es kann Beschriftungen nach einer menschlichen Überprüfung korrigieren. Es kann Governance-Tags nach einer Richtlinienaktualisierung hinzufügen.</p>
<p>In einem herkömmlichen Layout erfolgen diese Änderungen oft über Client-SDK-Updates oder reine Datenbank-Schreibpfade, selbst wenn die Daten von Spark, Ray oder einer anderen externen Engine erzeugt werden.</p>
<p>Mit Loon können externe Rechensysteme neue ColumnGroups erstellen und diese über das Manifest übertragen. Die Datenbank muss nicht mehr der einzige Einstiegspunkt für jeden Rewrite sein.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">Offline-Analyse sollte keine weitere Kopie der Wahrheit erfordern</h3><p>Früher haben Teams oft eine Online-Sammlung zur Offline-Auswertung oder -Analyse in Parquet abgelegt. Dadurch wurden zwei Versionen desselben Datensatzes erstellt: die Online-Sammlung und die Analysekopie. Sobald Beschriftungen korrigiert, Einbettungen neu generiert, Löschprotokolle angewendet oder Indizes neu erstellt werden, muss sich das Team fragen, welche Kopie aktuell ist.</p>
<p>Mit einem Manifest-basierten Speichermodell können Analyse-Engines die gleiche versionierte Datensatzansicht lesen wie das Serving-System. Sie können nur die benötigten Spalten projizieren, nur die relevanten Zeilenbereiche scannen und mit einer deklarierten Version des Datensatzes arbeiten, anstatt mit einem manuell exportierten Snapshot.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Löschungen und Korrekturen sollten nur das betreffen, was sich geändert hat</h3><p>Löschungen, Beschriftungskorrekturen, Korrekturen von Bezeichnungen und Aktualisierungen der Governance sind in AI-Datensätzen Routine. Sie sollten nicht jede lange Vektorspalte durch denselben Rewrite-Pfad zwingen.</p>
<p>Mit Loon kann das Löschen von Protokollen zunächst als logische Löschung behandelt werden. Eine spätere Verdichtung kann die betroffenen ColumnGroups bereinigen, ohne dass nicht zugehörige Daten neu geschrieben werden. Wenn sich ein kurzes Textfeld ändert, sollte die Speicherschicht nicht Hunderte von Gigabyte dichter Vektoren neu schreiben müssen, nur weil sie dieselbe logische Zeile teilen.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Externe Engines werden Teil des Arbeitsablaufs, nicht eine Fluchtluke</h3><p>Die größere Veränderung besteht darin, dass externe Engines nicht mehr als Systeme außerhalb der Vektordatenbank behandelt werden.</p>
<p>Spark, Ray, Auswertungsjobs, Beschriftungssysteme und Governance-Pipelines erzeugen und verändern bereits einen Großteil der Daten. Die Speicherebene sollte es ihnen ermöglichen, um eine einzige Quelle der Wahrheit herum zusammenzuarbeiten, anstatt ständig zu exportieren, zu kopieren und wieder zu importieren.</p>
<p>Das ist es, was eine Version von Manifest ermöglicht. Es bietet Online-Serving, Offline-Analyse, Backfill-Jobs und Verdichtung eine gemeinsame Ansicht des Datensatzes.</p>
<p>Dies mag wie interne Speicherdetails klingen, hat aber Auswirkungen darauf, wie schnell Teams KI-Datensätze iterieren können. Jede Modelländerung, jedes Backfill von Merkmalen, jede Korrektur von Beschriftungen, jeder Qualitätsfilter und jeder Indexneuaufbau hängt von der gleichen Frage ab: &quot;<strong>Kann das System den Datensatz aktualisieren, ohne Daten zu verschieben, die nicht verschoben werden müssen?&quot;</strong></p>
<p>Das ist der praktische Wert des Speichermodells.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon ist in Milvus 3.0 beta und Zilliz Vector Lakebase verfügbar<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon ist in <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 beta</a> verfügbar und ist auch Teil der Speicherschicht in <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, der nächsten Evolution von Zilliz Cloud. Und diese Version konzentriert sich auf drei Kernbereiche:</p>
<ul>
<li><strong>Das Manifest.</strong> Ziel ist es, dass Schreibvorgänge, Backfills, Löschvorgänge, Statistiken und Index-Updates versionierte Datensatzansichten erzeugen, die Leser konsistent öffnen können. Für Leser bedeutet dies, dass eine Abfrage eine bestimmte Manifestversion öffnen kann und eine stabile Ansicht des Datensatzes angezeigt wird. Für Autoren bedeutet dies, dass neue Datendateien, Löschprotokolle, Statistiken oder Indexdateien zunächst vorbereitet und dann durch eine versionierte Übergabe sichtbar gemacht werden können.</li>
<li><strong>Die ColumnGroup und die Formatunterstützung.</strong> Parquet unterstützt skalare und ökosystemfreundliche Spalten. Vortex unterstützt vektorlastige Zugriffsmuster. Lance kann im Nur-Lese-Modus integriert werden, um die Kompatibilität mit bestehenden Lance-Datensätzen zu gewährleisten.</li>
<li><strong>Der Index auf Lake.</strong> Skalare Statistiken, filternde Indizes und textinvertierte Indizes können an der Manifest-basierten Planung nach Zeilenbereich teilnehmen. Lake-native Vektorindizes sind komplizierter. HNSW und IVF haben ein unterschiedliches Verhalten bei der Speicherung von Objekten, und insbesondere HNSW reagiert empfindlich auf zufälligen Zugriff und Cache-Lokalität. Es kann nicht einfach ein für eine lokale SSD entworfenes Layout wiederverwenden und das gleiche Ergebnis erwarten.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Es gibt noch viel zu tun</h3><ul>
<li><strong>Externe Schreibpfade</strong> sind wichtig, da Spark und Ray in der Lage sein sollten, ColumnGroups und Manifest-Commits zu erzeugen, ohne jeden Backfill durch eine Client-SDK-Schleife zu zwingen.</li>
<li><strong>Lakehouse-Interoperabilität</strong> ist wichtig, da viele Teams bereits Kataloge und Abfrage-Engines wie <strong>Iceberg, Delta Lake, Trino, DuckDB und Athena</strong> verwenden <strong>.</strong> Vektordaten sollten in der Lage sein, an diesem Ökosystem teilzunehmen, ohne dass die Vektorsuchleistung darunter leidet.</li>
<li>Das<strong>Index-Layout</strong> ist wichtig, da Graphenindizes und invertierte Strukturen unterschiedliche Zugriffsmuster auf Objektspeicher haben.</li>
<li><strong>Die Semantik großer Objekte</strong> ist wichtig, da Rohvideos, PDFs, Bilder und Audiodateien ein Referenzmanagement, eine Versionierung und ein Löschverhalten erfordern, das mit dem abgeleiteten Vektordatensatz übereinstimmt.</li>
</ul>
<p>Das genaue Freigabeverhalten, die Standardeinstellungen und der Migrationspfad sollten den entsprechenden Milvus- und <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud-Versionshinweisen</a> folgen. Die Richtung der Speicherung ist jedoch klar: Vektordatenbanken benötigen eine versionierte, lake-native Grundlage unterhalb der Serving-Schicht.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Versuchen Sie Loon unter Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Ihr aktueller Stack Online-Serving, Offline-Analyse, Backfills und externe Data-Lake-Workflows in verschiedene Systeme aufteilt, ist Zilliz Vector Lakebase einen Blick wert. Sie können es in <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> ausprobieren. Wer sich per E-Mail neu anmeldet, erhält $100 Gratis-Credits. Sie sind auch herzlich eingeladen, <a href="https://zilliz.com/contact-sales">mit uns</a> über Ihren Anwendungsfall <a href="https://zilliz.com/contact-sales">zu sprechen</a>.</p>
<p>Sie können auch die <a href="https://milvus.io/docs/release_notes.md">Veröffentlichung von Milvus 3.0</a> verfolgen, um zu sehen, wie sich Loon in der Open-Source-Engine weiterentwickelt.</p>
<p><strong>Zilliz Vector Lakebase bringt zusammen:</strong></p>
<ul>
<li>Tiered Serving für unterschiedliche Echtzeit-Performance und Kostenabwägungen</li>
<li>On-Demand-Suche für große oder explorative Workloads ohne permanente Rechenleistung</li>
<li>Externe Data-Lake-Suche, so dass Sie direkt über vorhandene Lake-Daten indizieren und suchen können</li>
<li>Vollspektrum-Suche über Vektoren, Text, JSON und Geodaten, mit hybrider Suche und Reranking</li>
<li>Einheitlicher Lake-nativer Speicher auf Basis von Vortex, einem offenen Format, das für schnellere, kostengünstigere Zufallslesevorgänge bei vektorlastigen Daten entwickelt wurde</li>
</ul>
