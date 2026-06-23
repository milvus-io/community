---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Warum wir Loon entwickelt haben: eine Speicher-Engine für KI-Daten, die sich
  ständig ändern.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon ist eine neue Speicher-Engine für Milvus 3.0 und Zilliz Vector Lakebase,
  die speziell für die Verwaltung sich weiterentwickelnder Vektordatensätze mit
  ColumnGroups, Zeilen-ID-Ausrichtung und Manifesten entwickelt wurde.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Dieser Blogbeitrag wurde ursprünglich auf zilliz.com veröffentlicht und mit Genehmigung erneut veröffentlicht.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Das Wichtigste auf einen Blick<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Da es sich hierbei um einen langen, tiefgehenden technischen Einblick handelt, finden Sie hier die wichtigsten Punkte, bevor wir ins Detail gehen.</p>
<ul>
<li>KI-Datensätze sind keine statischen Tabellen. Die gleichen Zeilen ändern sich ständig, da Teams Embedding-Modelle ersetzen, spärliche Vektoren hinzufügen, Bildunterschriften überarbeiten, Labels nachträglich ergänzen, Indizes neu erstellen und Offline-Analysen durchführen.</li>
<li>Herkömmliche Speicherlayouts weisen drei Schwachstellen auf: Lange Vektorspalten machen das Nachfüllen aufwendig, ein einziges Dateiformat kann weder Scans noch Punktlesungen gut unterstützen, und die Speicherung in privaten Datenbanken zwingt externe Pipelines dazu, zusätzliche Kopien der Originaldaten zu erstellen.</li>
<li>Loon ist die neue Speicher-Engine für Milvus und Zilliz Vector Lakebase. Sie basiert auf hybriden Dateiformaten, der Ausrichtung von Zeilen-IDs und einem Manifest, das den versionierten Zustand des Datensatzes definiert.</li>
<li>Das Ziel ist es, mit einem einzigen Vektordatensatz Online-Suche, Offline-Analyse, Backfills, Komprimierung und externe Berechnungen zu ermöglichen, ohne Daten ständig kopieren, neu schreiben oder erneut importieren zu müssen.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Einleitung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
<p><em>Herkömmliche Datenbanken speichern bereits Ganzzahlen, Zeichenfolgen, JSON, Blobs und Indizes. Warum also nicht einen</em> <em>Typ</em> „ <code translate="no">_vector_</code> “<em>hinzufügen</em> <em>, daneben einen ANN-Index erstellen und es dabei belassen?</em></p>
<p>Für die semantische Suche in der Anfangsphase funktioniert das gut genug. Eine Vektorspalte plus ein Index reichen für eine Demo, eine kleine RAG-Anwendung oder eine interne Suchfunktion aus. Das Problem tritt erst später zutage, wenn sich der Datensatz weniger wie eine Tabelle und mehr wie ein KI-Datensystem verhält.</p>
<p>Ein Vektordatensatz in der Produktion verfügt über Zeilen, Primärschlüssel, skalare Felder und abfragbare Spalten. In diesem Sinne ähnelt er einer Datenbanktabelle. Aber er hat auch die Größenordnung und die Workflow-Struktur eines Data Lake. Er kann Hunderte von Millionen Datensätze enthalten. Er wird wiederholt von Spark, Ray, DuckDB, Trainingspipelines, Auswertungsjobs und Datenqualitätssystemen gelesen und neu geschrieben.</p>
<p>Er stützt sich zudem auf Objektspeicher. Bei den Quellobjekten handelt es sich häufig um Videos, Bilder, PDFs, Audiodateien oder Webdokumente, die in S3, GCS, OSS oder einem anderen Objektspeicher verbleiben. Die Datenbank speichert Referenzen, Metadaten, abgeleitete Merkmale und Indizes. Dann fügt sie Elemente hinzu, für deren Verwaltung herkömmliche Speichermodelle nicht ausgelegt waren, und zwar als Objekte erster Klasse: dichte Einbettungen, spärliche Vektoren, Bildunterschriften, Vektorindizes, Textindizes, Löschprotokolle, Statistiken, Modellversionen, Parser-Versionen, Referenzen auf externe Blobs sowie die Versionsbeziehungen zwischen all diesen Elementen.</p>
<p><strong>An dieser Stelle stößt der Ansatz „einfach eine Vektorspalte hinzufügen“ an seine Grenzen.</strong> Die Frage ist nicht, ob eine Datenbank Vektor-Bytes speichern kann. Viele Systeme können das. Die schwierigere Frage ist <strong>, ob das Speichermodell damit umgehen kann, wie sich Vektordaten ändern, wie sie abgefragt werden und wie sie über den gesamten KI-Datenstack hinweg gemeinsam genutzt werden.</strong></p>
<p><strong>Aus diesem Grund haben wir Loon entwickelt, die neue Speicher-Engine für Milvus und</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(die nächste Evolutionsstufe von Zilliz Cloud).</strong></p>
<p>Loon basiert auf drei Grundgedanken:</p>
<ol>
<li>Verwendung unterschiedlicher physischer Formate für verschiedene Spaltenarten.</li>
<li>Diese Spalten über einen gemeinsamen Zeilen-ID-Raum aufeinander abstimmen.</li>
<li>Verwendung eines Manifests zur Definition des versionierten Zustands des Datensatzes.</li>
</ol>
<p>Um zu verstehen, warum diese Aspekte wichtig sind, beginnen wir mit einem gängigen multimodalen Workflow.</p>
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
    </button></h2><p>Stellen Sie sich ein KI-Team vor, das einen Videodatensatz für das multimodale Training erstellt.</p>
<p>Ein langes Video wird in einen Objektspeicher hochgeladen. Eine Pipeline zerlegt es anhand von Szenenwechseln, Schnittpunkten oder Zeitfenstern in Clips. Clips, die zu lang oder zu kurz, unscharf, doppelt vorhanden oder von geringer Qualität sind, werden herausgefiltert. Die verbleibenden Clips werden von einem ästhetischen Modell bewertet, von einem anderen Modell mit Untertiteln versehen, von einem Bild-Sprache-Modell eingebettet und in einer Vektordatenbank für die Suche, Deduplizierung und Filterung von Trainingsdaten gespeichert.</p>
<p>Auf einer übergeordneten Ebene sieht der Arbeitsablauf einfach aus:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Doch der Datensatz liegt nicht von vornherein in fertiger Form vor.</p>
<ul>
<li>In der ersten Woche enthält die Tabelle möglicherweise nur <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> und <code translate="no">duration</code>.</li>
<li>In der zweiten Woche fügt das Team „ <code translate="no">aesthetic_score</code> “ hinzu.</li>
<li>In der dritten Woche wird ein Untertitelungsmodell ausgeführt, und jeder Clip erhält eine „ <code translate="no">caption</code> “.</li>
<li>In der vierten Woche geht das erste Einbettungsmodell online, und jeder Clip erhält eine 768-dimensionale CLIP-Einbettung.</li>
<li>Einen Monat später wechselt das Team die Modelle und füllt die „ <code translate="no">embedding_v2</code> “ nachträglich auf – nun mit 1024 Dimensionen.</li>
<li>Zwei Monate später wird die hybride Suche zur Voraussetzung, sodass das Team eine Spalte mit spärlichen Vektoren hinzufügt.</li>
<li>Drei Monate später werden die Bildunterschriften einer manuellen Überprüfung unterzogen und müssen direkt korrigiert werden.</li>
</ul>
<p>Der Datensatz wurde nie vollständig fertiggestellt. Es kamen immer wieder neue Interpretationen derselben zugrunde liegenden Zeilen hinzu.</p>
<p>Das ist einer der wesentlichen Unterschiede zwischen Vektordaten und herkömmlichen Geschäftsdaten. Dieselbe Zeile wird immer wieder neu verarbeitet. Und der Umfang verwandelt dies von einer Unannehmlichkeit in ein Speicherproblem: Multimodale Datensätze umfassen oft nicht Millionen von Datensätzen, sondern Hunderte von Millionen oder Milliarden. LAION-5B ist ein nützlicher Anhaltspunkt für die Struktur – Milliarden von Bild-Text-Paaren, jedes mit Metadaten, Bildunterschriften und Einbettungen. Das Schwierige ist also nicht das erste Einfügen. Das Schwierige ist alles, was passiert, nachdem sich der Datensatz weiterentwickelt. <strong>Diese Weiterentwicklung bringt drei Probleme zum Vorschein.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Das erste Problem: Lange Spalten machen die Schreibamplifikation kostspielig<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Spaltenorientierte Formate wie Parquet eignen sich hervorragend für viele analytische Workloads. Sie funktionieren gut, wenn Schemata relativ stabil sind, Daten häufiger gelesen als überschrieben werden, Scans nur eine Teilmenge der Spalten betreffen und Komprimierung eine Rolle spielt. Das ist die Welt, für die viele analytische Formate optimiert wurden.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Vektorzeilen sind viel breiter als analytische Zeilen</h3><p>Das TPC-H- <code translate="no">lineitem</code> t eine gute Basis. Es verfügt über 16 Spalten: Ganzzahlschlüssel, Dezimalwerte, Datumsangaben, kurze Zeichenfolgen und ein kleines Kommentarfeld. Eine unkomprimierte Zeile ist etwa 150 Byte groß. Nach der Komprimierung kann sie deutlich kleiner sein. Bei einer Zeilengruppe von 64 MB kann ein Speichersystem Hunderttausende von Zeilen in einer Gruppe zusammenfassen.</p>
<p><strong>Vektordatensätze sehen anders aus.</strong></p>
<p>Ein Bild-Text-Datensatz im LAION-Stil kommt dem, was viele KI-Pipelines heute produzieren, viel näher. Jede Zeile enthält nach wie vor gewöhnliche Metadaten: eine URL, eine Bildunterschrift, Breite, Höhe, Qualitätswerte, Labels und so weiter. Sobald jedoch die Einbettung hinzugefügt wird, ändert sich die physische Form der Zeile.</p>
<p>Ein 768-dimensionaler CLIP-Vektor nimmt etwa 1,5 KB in fp16 oder 3 KB in fp32 ein. Diese eine Spalte kann viel größer sein als eine gesamte TPC-H- <code translate="no">lineitem</code> -Zeile.</p>
<p>Und 768 Dimensionen sind nach heutigen Maßstäben weder ungewöhnlich noch groß. Eine 1024- oder 2048-dimensionale Einbettung ist in multimodalen Pipelines üblich. OpenAIs „ <code translate="no">text-embedding-3-large</code> “ reicht bis zu 3072 Dimensionen, was etwa 12 KB pro Vektor in fp32 entspricht.</p>
<p>Der Vergleich ist eklatant:</p>
<table>
<thead>
<tr><th>Form des Datensatzes</th><th>Ungefähre Zeilengröße</th><th>Was die Zeile dominiert</th></tr>
</thead>
<tbody>
<tr><td>TPC-H-Lineitem</td><td>~150 Byte unkomprimiert</td><td>skalare Felder und kurze Zeichenfolgen</td></tr>
<tr><td>Zeile im LAION-Stil mit einem fp16-Vektor der Dimension 768</td><td>~1,5 KB+</td><td>Einbettung</td></tr>
<tr><td>Zeile im LAION-Stil mit einem 768-dimensionalen fp32-Vektor</td><td>~3 KB+</td><td>Einbettung</td></tr>
<tr><td>Zeile mit einem 3072-dimensionalen fp32-Vektor</td><td>~12 KB+ allein für den Vektor</td><td>Einbettung</td></tr>
</tbody>
</table>
<p>In vielen KI-Datensätzen ist die Vektorspalte nicht nur ein weiteres Feld. Physisch gesehen macht sie den größten Teil der Zeile aus. Das verändert die Kosten der Schemaentwicklung.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Das Hinzufügen einer Vektorspalte kann Hunderte von Gigabyte bedeuten</h3><p>Angenommen, ein Datensatz enthält 100 Millionen Videoclips. Das Hinzufügen einer neuen 1024-dimensionalen fp32-Einbettungsspalte bedeutet das Schreiben von etwa 400 GB Rohvektordaten. Darin sind Statistiken, Indizes, Metadaten-Aktualisierungen, Overhead für den Objektspeicher, Validierung oder die Integration in den Serving-Pfad noch nicht enthalten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn das Team jeden Monat ein oder zwei vektorähnliche Spalten hinzufügt, wie z. B. „ <code translate="no">embedding_v2</code> “, „ <code translate="no">sparse_vector</code> “ oder „Rerank Features“, wird die Schemaentwicklung zu einer wiederkehrenden Aufgabe des Data Engineering, die sich in Hunderten von Gigabyte oder Terabyte bemisst.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Kleine logische Aktualisierungen können umfangreiche physische Umschreibungen auslösen</h3><p>Aktualisierungen sind ebenso wichtig.</p>
<p>In spaltenorientierten Systemen werden alte Daten in der Regel nicht an Ort und Stelle aktualisiert. Ein Löschprotokoll erfasst, was sich geändert hat, und bei der späteren Komprimierung werden aktive Zeilen in neue Dateien umgeschrieben. Dieses Modell ist überschaubar, solange die Zeilen klein sind.</p>
<p>Bei Vektordaten kann eine kleine logische Aktualisierung eine umfangreiche physische Neuschreibung auslösen.</p>
<p>Ein manueller Überprüfungsvorgang korrigiert vielleicht nur ein paar hundert Byte in einer Bildunterschrift. Wenn jedoch die Bildunterschrift, der dichte Vektor, der spärliche Vektor und andere abgeleitete Merkmale denselben physischen Dateilebenszyklus teilen, kann es passieren, dass das System am Ende auch die Vektoren neu schreibt. Die logische Änderung ist gering. Die physische E/A-Last kann enorm sein.</p>
<p>Dies ist das Problem der Schreibverstärkung bei der Vektorspeicherung. Der aufwendige Teil besteht nicht nur darin, dass Vektoren groß sind. Vielmehr werden große abgeleitete Felder und kleine veränderbare Felder oft durch ein Speicherlayout miteinander verknüpft, das sie als eine Einheit behandelt.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Bei KI-Datensätzen ist das Nachfüllen eine routinemäßige Arbeitslast</h3><p>Bei herkömmlichen Analysetabellen kommt es nur gelegentlich zu einer Schemaentwicklung. Bei KI-Datensätzen ist dies Routine. Bildunterschriftenmodelle werden aktualisiert. Einbettungsmodelle werden ersetzt. Sparse-Vektoren werden nachträglich hinzugefügt. Rerank-Merkmale tauchen auf. Manuelle Beschriftungen werden korrigiert. Governance-Tags werden nachgetragen. Indizes werden neu aufgebaut.</p>
<p>Diese Vorgänge sind keine einfachen Anfügungen. Sie ändern oder erweitern häufig bestehende Zeilen.</p>
<p>Deshalb darf der Vektorspeicher nicht nur auf den Scan-Durchsatz optimiert sein. Er muss auch Nachträge und Teilaktualisierungen kostengünstiger gestalten.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Das zweite Problem: Dieselben Daten müssen sowohl Scans als auch Punktzugriffe unterstützen<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Nach dem Schreiben der Daten teilt sich der Lesepfad. Derselbe Vektordatensatz weist typischerweise zwei unterschiedliche Zugriffsmuster auf: <strong>analytische Scans und Punktlesungen.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Analytische Workloads erfordern breite, komprimierte Scans</h3><p>Eine Pipeline kann Filter ausführen wie:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Oder sie führt Offline-Analysen, vollständige Einbettungsauswertungen, BM25-Statistiken, Bitmap-Erstellung, Datenqualitätsprüfungen, Zählungen und Gruppierungen durch.</p>
<p>Bei diesem Muster werden viele Zeilen, aber nur wenige Spalten gelesen. Es profitiert von sequenzieller E/A, größeren Zeilengruppen, Komprimierung, Spaltenausdünnung, Batch-Dekodierung und vektorisierter Ausführung.</p>
<p>Große Zeilengruppen sind hier von Vorteil. Sie ermöglichen es, mit einer einzigen E/A-Anfrage eine große Menge nützlicher Daten abzurufen, verbessern die Komprimierungseffizienz und versorgen die Ausführungs-Engine mit genügend zusammenhängenden Daten, um den Overhead zu amortisieren. Wenn mehrere Spalten gemeinsam gelesen werden, trägt ihre Organisation im Hinblick auf den Scan-Durchsatz zudem dazu bei, Cache-Fehltreffer während der vektorisierten Ausführung zu reduzieren.</p>
<p>Parquet ist auf diesem Gebiet besonders stark.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">ANN-Ergebnisse erfordern gezielte Abfragen auf Zeilenebene</h3><p>Nachdem die ANN-Suche Kandidaten-Zeilen-IDs zurückgibt, muss das System häufig Felder abrufen wie:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Bei diesem Muster werden weniger Zeilen gelesen – oft Hunderte oder Tausende –, jedoch ist ein präziser Zugriff über die Zeilen-ID erforderlich. Es geht darum, eine bestimmte Zeile und Spalte zu lokalisieren, nur den benötigten Byte-Bereich abzurufen und zu vermeiden, dass eine ganze Zeilengruppe geladen wird, nur um einige wenige Datensätze abzurufen.</p>
<p>Die Punktabfrage hat fast die entgegengesetzte Präferenz beim Scannen. Sie benötigt eine kleinere Lese-Granularität. Im Idealfall kann die Speicherschicht das relevante Segment oder den Byte-Bereich anhand der Zeilen-ID finden, nur diesen Bereich lesen und nur die für das Ergebnis benötigten Daten dekodieren.</p>
<p>Auch bei der Komprimierung gibt es unterschiedliche Abwägungen. Bei Scans lohnt sich oft eine stärkere Komprimierung, da das System viele Daten liest und dadurch E/A-Vorgänge einspart. Bei der Punktabfrage kann Komprimierung jedoch zum Nachteil werden, wenn das Abrufen einer einzigen Zeile die Dekodierung eines viel größeren komprimierten Blocks erfordert.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Ein Layout kann nicht für beide Pfade optimiert werden</h3><p>Dies ist der zentrale Konflikt. Skalare Filterung und Analysen erfordern breite, komprimierte, scanfreundliche Layouts. Vektor-Lookups erfordern schmale, präzise, zeilenadressierbare Layouts.</p>
<p>Ein einzelnes Dateiformat kann beides bis zu einem gewissen Grad unterstützen, kann jedoch nicht gleichzeitig für beide optimal sein.</p>
<p>Wenn sich alle Spalten in Parquet befinden, sind skalare Scans problemlos möglich. Die ANN-Abfrage nach dem Abruf wird jedoch schwieriger. Das System benötigt möglicherweise nur einige hundert Vektoren, Beschriftungen oder Metadatensätze, während die Speicherschicht möglicherweise große Zeilengruppen lesen muss, die größtenteils irrelevante Zeilen enthalten.</p>
<p>Auf einer lokalen SSD können Cache und mmap einen Teil dieser Kosten verbergen. Sobald die Daten im Objektspeicher abgelegt sind, werden die Kosten deutlicher sichtbar. Jeder Cache-Fehler kann zu einem Remote-Bereichs-Lesevorgang führen. Wenn Kandidatenzeilen über viele Zeilengruppen verstreut sind, kann eine einzige Abfrage mehrere Lesevorgänge auslösen, von denen jeder mehr Daten abruft, als die Abfrage benötigt. Bei einem ungünstigen Layout kann das Abrufen von 1.000 Kandidatenzeilen leicht zu Dutzenden oder Hunderten von Megabyte unnötiger E/A führen – und in Extremfällen sogar zu weitaus mehr.</p>
<p>Kleinere Zeilengruppen erleichtern zwar die Punktabfrage, beeinträchtigen jedoch Scans. Zu viele kleine Fragmente verringern die Komprimierungseffizienz, erhöhen den Metadaten-Overhead und unterbrechen die langen sequenziellen Lesevorgänge, auf die Analyse-Engines angewiesen sind.</p>
<p><strong>Das Problem besteht also nicht darin, eine einzige „magische“ Zeilengruppengröße zu finden. Das Problem ist vielmehr, dass von ein und demselben Datensatz erwartet wird, sich wie zwei verschiedene Speichersysteme zu verhalten.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">Die hybride Suche zwingt beide Pfade in eine einzige Abfrage</h3><p>Die hybride Suche macht es schwieriger, diesen Konflikt zu ignorieren. Eine einzelne Abfrage wendet möglicherweise zunächst skalare Filter an:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Anschließend führt sie eine ANN-Suche durch.</p>
<p>Anschließend ruft sie Bildunterschrift, Vektor und Metadaten anhand der Zeilen-ID ab.</p>
<p>Für den Nutzer ist dies eine einzige Suchanfrage. Für die Speicherschicht ist es sowohl ein analytischer Scan als auch eine zufällige Abfrage mit geringer Latenz.</p>
<p>Deshalb benötigt die Vektorspeicherung mehr als nur eine bessere Parquet-Einstellung. Sie benötigt eine Möglichkeit, verschiedene Spalten entsprechend ihrer tatsächlichen Lesereihenfolge anzuordnen.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Das dritte Problem: Der Datensatz befindet sich nicht innerhalb einer einzigen Engine<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Die ersten beiden Probleme treten innerhalb der Datenbank auf. Das dritte Problem tritt an der Schnittstelle zwischen den Systemen auf.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">KI-Datenpipelines erstrecken sich über viele Systeme</h3><p>Im Video-Workflow findet innerhalb der Vektordatenbank selbst nur sehr wenig statt.</p>
<p>Die Rohvideos befinden sich im Objektspeicher. Die Clip-Erstellung kann in Spark oder Ray erfolgen. Die ästhetische Bewertung kann in einem GPU-Dienst laufen. Die Untertitelung kann in einer LLM-Inferenz-Pipeline erfolgen. Einbettungen können durch einen anderen GPU-Job generiert werden. Sparse-Vektoren können aus einem SPLADE-Dienst stammen. Offline-Auswertung, Filterung der Trainingsdaten, manuelle Überprüfung und Governance-Aufgaben können alle an anderer Stelle ausgeführt werden.</p>
<p>Die Vektordatenbank dient der Online-Suche, doch der Datensatz wird von vielen Systemen erstellt, korrigiert, ausgewertet und erweitert.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Proprietäre Speicherformate erzeugen mehrere Kopien der „Wahrheit“</h3><p>Wenn die Datenbank ein proprietäres physisches Format verwendet, das nur sie selbst lesen und schreiben kann, benötigt jeder externe Job einen Export, eine Konvertierung, eine Kopie und einen Import. Dieselbe Sammlung kann in der Datenbank, in einem temporären Spark-Verzeichnis, in einer Auswertungsausgabe und in einem lokalen Backfill-Verzeichnis vorhanden sein. Dann lautet die eigentliche Frage:</p>
<ul>
<li>Welche Kopie ist die „Quelle der Wahrheit“?</li>
<li>Welche enthält das Bildunterschriftenmodell vom letzten Monat?</li>
<li>Welche Zeilen wurden bereits durch menschliche Überprüfung korrigiert?</li>
<li>Welche Spalten mit spärlichen Vektoren wurden von welchem Modell generiert?</li>
<li>Welcher Vektorindex ist nach dem Backfill noch gültig?</li>
<li>Auf welches ursprüngliche Videoobjekt bezieht sich diese Zeile?</li>
</ul>
<p>Im kleinen Maßstab kommen Teams manchmal noch mit Namenskonventionen und manuellen Überprüfungen aus. Bei Hunderten von Millionen von Zeilen und Terabytes an Einbettungen wird dies jedoch zu einem Konsistenzproblem.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Vektordatensätze benötigen einen gemeinsamen, versionierten Zustand</h3><p>Lakehouse-Systeme haben eine Variante dieses Problems für strukturierte Daten gelöst. Bei Iceberg, Delta Lake und Hudi geht es nicht nur um die Speicherung von Dateien. Ihr wesentlicher Beitrag besteht darin, dass sich mehrere Engines auf denselben Tabellenzustand abstimmen können.</p>
<p>Vektordatenbanken benötigen nun eine ähnliche Fähigkeit, doch der Zustand ist komplexer. Er muss nicht nur Tabellendateien und Partitionen umfassen, sondern auch Vektorindizes, Textindizes, spärliche Merkmale, Löschprotokolle, Statistiken, Zeilen-ID-Bereiche und Verweise auf externe Blobs.</p>
<p>Die Frage lautet nicht einfach: „Kann Spark Milvus-Dateien lesen?“</p>
<p>Die Frage lautet vielmehr: Nachdem Spark eine spärliche Vektorspalte nachgefüllt hat, woher weiß Milvus, zu welcher Version diese Spalte gehört, welche Zeilen sie abdeckt, welches Modell sie erzeugt hat und wann Online-Abfragen sie sicher verwenden können?</p>
<p>Die Antwort muss im Speichermodell liegen.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Warum Patches nicht ausreichen<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist verlockend, diese als drei separate technische Probleme zu behandeln.</p>
<ul>
<li>Schreibverstärkung? Batching hinzufügen.</li>
<li>Punktlesungen? Fügen Sie einen Cache hinzu.</li>
<li>Externe Systeme? Export- und Import-Tools hinzufügen.</li>
</ul>
<p>Diese Patches können zwar helfen, lösen aber nicht das zugrunde liegende Problem: Ein Vektordatensatz ist physikalisch heterogen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Im Beispielvideo sind „ <code translate="no">clip_id</code> “, „ <code translate="no">video_id</code> “, „ <code translate="no">duration</code> “ und „ <code translate="no">aesthetic_score</code> “ kurze Skalarfelder. Sie sind nützlich für Filterung und Analyse.</p>
<ul>
<li><code translate="no">caption</code> ist Text. Er kann für BM25, Überprüfung, Korrektur und Backfill verwendet werden.</li>
<li><code translate="no">embedding</code> ist ein langer, dichter Vektor. Er wird für den ANN-Recall und später für die Suche auf Zeilenebene oder die Neureihung verwendet.</li>
<li><code translate="no">embedding_v2</code> ist eine neue Modellausgabe, die oft erst lange nach dem Einfügen der Originaldaten nachgetragen wird.</li>
<li><code translate="no">sparse_vector</code> unterstützt die hybride Suche und verfügt über ein eigenes Zugriffsmuster.</li>
<li>Das Rohvideo sollte im Objektspeicher verbleiben. Die Datenbank sollte einen Verweis, eine Prüfsumme, einen MIME-Typ, eine Parser-Version und eine Beziehung auf Zeilenebene speichern.</li>
<li>Vektorindizes, Textindizes, Statistiken und Löschprotokolle sind abgeleitete Objekte mit eigener Versionssemantik.</li>
</ul>
<p>Diese Objekte teilen sich eine logische Zeile, sollten jedoch nicht alle dasselbe physische Layout oder denselben Lebenszyklus aufweisen.</p>
<ul>
<li>Werden sie in ein gewöhnliches Tabellenlayout gezwängt, werden Aktualisierungen aufwendig.</li>
<li>Werden sie in ein spaltenorientiertes Dateiformat gezwängt, werden punktuelle Lesevorgänge aufwendig.</li>
<li>Werden sie als unabhängige Objektdateien behandelt, wird die Versionsverwaltung anfällig.</li>
</ul>
<p>Das Speichermodell muss also von der Tatsache ausgehen, dass der Datensatz heterogen ist.</p>
<p><strong>Daraus ergeben sich drei Designanforderungen:</strong></p>
<ul>
<li>Erstens sollten verschiedene Spaltengruppen in unterschiedlichen physischen Formaten gespeichert werden.</li>
<li>Zweitens benötigen diese Spaltengruppen einen gemeinsamen Zeilen-ID-Raum, damit sie sich weiterhin wie eine einzige logische Tabelle verhalten können.</li>
<li>Drittens benötigt der Datensatz ein versioniertes Manifest, das angibt, welche Dateien, Indizes, Protokolle, Statistiken und Objektreferenzen zur aktuellen Ansicht gehören.</li>
</ul>
<p><strong>Dies ist das Design hinter Loon, unserer neuen Speicher-Engine, die Milvus und Zilliz Cloud zugrunde liegt.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: eine Speicher-Engine hinter Milvus und Zilliz Cloud für sich weiterentwickelnde Vektordatensätze<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Um alle oben genannten Probleme zu lösen, haben wir <strong>Loon</strong> entwickelt, die neue Speicher-Engine für Milvus und <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (die nächste Evolutionsstufe von Zilliz Cloud), die für sich weiterentwickelnde Vektordatensätze konzipiert ist.</p>
<p>Der Name folgt der Tradition von Zilliz, Systeme nach Vogelarten zu benennen. Ein „Loon“ ist ein Tauchvogel, der an Seen lebt, was gut zum Ziel des Systems passt: Eine Vektordatenbank sollte nicht jedes Mal, wenn sie eine Abfrage ausführt, eine Spalte nachträglich auffüllt oder einen Index erstellt, einen ganzen See voller Daten verschieben, durchsuchen oder neu schreiben müssen. Sie sollte zunächst die aktuelle Version des Datensatzes verstehen, einschließlich seiner Spalten, Indizes, Statistiken, Löschprotokolle und Objektreferenzen, und dann nur den Teil lesen, den sie tatsächlich benötigt.</p>
<p>Hybride Dateiformate, Zeilen-ID-Ausrichtung und Manifest sind keine drei separaten Funktionen. Sie beruhen auf derselben Designannahme: Ein Vektordatensatz ist von Natur aus heterogen.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Drei Komponenten, ein Speichermodell</h3><p>Hybride Dateiformate tragen der Tatsache Rechnung, dass verschiedene Spalten unterschiedliche Zugriffsmuster aufweisen. Skalare Felder eignen sich gut für Scans und Filter. Vektorfelder erfordern eine effiziente Suche auf Zeilenebene. Rohdatenobjekte wie Videos, PDFs, Bilder und Audiodateien gehören in den Objektspeicher und nicht in Datenbankdateien.</p>
<p>Die Zeilen-ID-Ausrichtung berücksichtigt, dass diese Spalten zwar physisch getrennt sein können, aber dennoch dieselben logischen Zeilen beschreiben. Eine Bildunterschrift, eine Einbettung, ein spärlicher Vektor und eine Video-URI können sich in unterschiedlichen Dateien und Formaten befinden, müssen aber dennoch als ein einziges Ergebnis zusammengeführt werden.</p>
<p>Das Manifest berücksichtigt, dass der Datensatz nicht einmalig geschrieben und dann unverändert belassen wird. Er wird von mehreren Systemen über mehrere Versionen hinweg für verschiedene Aufgaben modifiziert. Indizes, Statistiken, Löschprotokolle, Verweise auf externe Objekte und Spaltengruppen müssen alle in derselben versionierten Ansicht erscheinen.</p>
<p><strong>Deshalb ist Loon nicht nur ein schnelleres Vektordateiformat.</strong> Ein schnelleres Format erleichtert<strong>zwar</strong> die Punktabfrage, löst aber weder die Schemaentwicklung noch die Koordination mehrerer Engines. Die Zeilen-ID-Ausrichtung lässt geteilte Spalten sich wie eine einzige Tabelle verhalten, legt jedoch nicht fest, welche Dateien zur aktuellen Version gehören. Ein Manifest kann den Zustand eines Datensatzes beschreiben, doch ohne Spaltengruppen und Zeilen-ID-Ausrichtung kann es unterschiedliche physische Layouts innerhalb einer logischen Sammlung nicht sauber abbilden.</p>
<p>Das Speichermodell benötigt alle drei Komponenten: unterschiedliche Formate für verschiedene Spaltengruppen, einen gemeinsamen Zeilen-ID-Raum zur Rekonstruktion von Zeilen und ein versioniertes Manifest, das jedem Leser und Schreiber mitteilt, wie der Datensatz aktuell beschaffen ist.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Wo Loon in Milvus und Zilliz Vector Lakebase zum Einsatz kommt</h3><p>In Milvus ersetzt es die alte Segment-Binlog-Speicherschicht durch ein Modell, das auf Manifest, ColumnGroup, Dateiformat und Dateisystem-Abstraktionen aufbaut. In <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (der nächsten Entwicklungsstufe von Zilliz Cloud) gilt derselbe Ansatz für die Vector Lakebase-Architektur: Der Abrufpfad der Vektordatenbank soll schnell bleiben<strong>,</strong> während die zugrunde liegenden Daten einfacher weiterentwickelt, analysiert und mit externen Systemen koordiniert werden können.</p>
<p>Die übergeordneten Milvus-Komponenten behalten weiterhin ihre gewohnten Rollen bei. Proxy übernimmt das Routing. QueryCoord und DataCoord kümmern sich um die Planung. IndexNode erstellt Indizes. Die anwendungsseitigen APIs für Sammlungen, Einfügungen, Suchvorgänge und hybride Suchvorgänge müssen keine Manifest-Dateien oder ColumnGroups offenlegen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Änderung findet im Hintergrund statt.</p>
<p>DataNode, QueryNode, segcore, die Komprimierung und externe Konnektoren können über dieselbe Speicherabstraktion arbeiten. Das ist wichtig, da der Datensatz nicht mehr ausschließlich von der Datenbank geschrieben und gelesen wird. Er kann durch externe Rechensysteme erweitert und gleichzeitig von der Online-Suche genutzt werden.</p>
<p>Auf einer übergeordneten Ebene sehen die Schichten wie folgt aus:</p>
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
<p>Das Manifest beschreibt den versionierten Zustand des Datensatzes. ColumnGroups ordnen eine logische Sammlung physischen Spaltengruppen zu. Die Dateiformat-Schicht ermöglicht es jeder ColumnGroup, ein geeignetes Format zu wählen. Die Dateisystem-Abstraktion funktioniert sowohl für Objektspeicher als auch für lokalen Speicher.</p>
<p>Der wichtige Punkt ist, dass hybride Dateiformate, die Ausrichtung der Zeilen-IDs und das Manifest keine separaten Funktionen sind. Zusammen definieren sie das Speichermodell.</p>
<p>Mit diesem Modell können wir die drei Entwurfsentscheidungen nacheinander betrachten: wie Loon verschiedene ColumnGroups speichert, wie es sie wieder in Zeilen ausrichtet und wie das Manifest diese Dateien in einen versionierten Datensatz umwandelt.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Entwurf 1: Das richtige Dateiformat für die richtige Spaltengruppe verwenden<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Verschiedene Spalten weisen unterschiedliche Zugriffsmuster auf. Sie sollten nicht in dasselbe Dateiformat gezwängt werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon unterteilt eine logische Sammlung in ColumnGroups.</h3><ul>
<li>Skalarfelder, Filterfelder, Geschäftsschlüssel und statistische Felder werden häufig gescannt, gefiltert, aggregiert oder für die Abfrageplanung verwendet. Sie profitieren von Komprimierung, Spaltenausdünnung und Kompatibilität mit dem Ökosystem. Parquet eignet sich gut für diese Spalten.</li>
<li>Dichte Vektoren, spärliche Vektoren und Rerank-Merkmale werden oft nach dem ANN-Recall anhand der Zeilen-ID gelesen. Sie benötigen Zufallszugriff mit geringer Latenz, präzise Lesevorgänge im Byte-Bereich und selektive Dekodierung. Ein segmentorientiertes Layout ist hierfür besser geeignet. Loon nutzt in diesem Zusammenhang Vortex.</li>
<li>Rohobjekte wie Videos, PDFs, Bilder und Audiodateien sollten nicht in die Datendateien der Vektordatenbank eingebettet werden. Sie sollten im Objektspeicher verbleiben. Die Datenbank erfasst Referenzen, Prüfsummen, MIME-Typen, Parser-Versionen und Beziehungen auf Zeilenebene.</li>
</ul>
<p>Für das Video-Beispiel könnte ein physisches Layout wie folgt aussehen:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Für die Anwendung handelt es sich weiterhin um eine einzige Sammlung. Für die Speicherschicht verwenden verschiedene Teile dieser Sammlung unterschiedliche physische Formate. Dies reduziert unnötige Umschreibungen direkt. Das Hinzufügen von „ <code translate="no">embedding_v2</code> “ kann zu einer neuen Vektor-ColumnGroup sowie einem Manifest-Commit führen. Es erfordert kein Umschreiben der Beschriftungsspalte, der skalaren Metadaten oder der bestehenden Einbettungsspalte.</p>
<p>Das gleiche Prinzip gilt für spärliche Vektoren, Rerank-Merkmale oder andere abgeleitete Felder. Wenn eine neue Spalte physisch unabhängig und anhand der Zeilen-ID ausgerichtet werden kann, müssen nicht auch nicht damit zusammenhängende Spalten denselben Umschreibungspfad durchlaufen.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon passt auch die Verwendung von Dateiformaten an.</h3><p><strong>Bei Parquet sind die Standardeinstellungen für datenintensive Vektoren nicht immer ideal.</strong> Eine 64-MB-Zeilengruppe kann für die Punkt-Suche zu groß sein, da ein kleiner zufälliger Lesezugriff weit mehr Daten abrufen kann, als benötigt werden. Loon verkleinert Zeilengruppen in relevanten Pfaden auf 1 MB und deaktiviert Kodierungen – wie beispielsweise die Wörterbuchkodierung bei Vektorspalten –, wenn diese bei zufällig angeordneten Vektordaten nicht hilfreich sind.</p>
<p><strong>Bei Vortex liegt der Schwerpunkt auf dem Layout.</strong> Loon verwendet ein Layout, das einen Ausgleich zwischen Scan-Effizienz und Punktabfrage schafft. Innerhalb einer Zeilengruppe können Segmente aus verwandten Spalten nahe beieinander platziert werden, um das Scannen zu unterstützen. Zur Durchführung von Operationen ermöglichen das Lesen von Teilsegmenten dem System, nur die relevanten Bytes abzurufen, anstatt ein gesamtes Segment zu laden.</p>
<p><strong>Loon unterstützt zudem eine schreibgeschützte Lance-Integration</strong>, sodass bestehende Lance-Datensätze als ColumnGroups eingebunden werden können, wenn Kompatibilität eine Rolle spielt.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Was der Benchmark zeigt</h3><p>In einem lokalen Test mit einer einzelnen Datei mit 40.000 Zeilen und dem Schema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code> zeigte Vortex im Vergleich zu Parquet mit 1-MB-Zeilengruppen folgende Ergebnisse:</p>
<table>
<thead>
<tr><th>Operation</th><th>Vortex</th><th>Parquet</th><th>Unterschied</th></tr>
</thead>
<tbody>
<tr><td>Auslesen, K = 1.000 zufällige Zeilen</td><td>5,8 ms</td><td>144 ms</td><td>25-mal schneller</td></tr>
<tr><td>Vollständiger Vektor-Spalten-Scan</td><td>21 ms</td><td>142 ms</td><td>6,76-mal schneller</td></tr>
<tr><td>Dateigröße, ~21 MB Rohdaten</td><td>6,62 MB</td><td>7,16 MB</td><td>7 % kleiner</td></tr>
</tbody>
</table>
<p>Das Ergebnis „ <code translate="no">take</code> “ ergibt sich aus der Reduzierung der Menge an irrelevanten Daten, die gelesen und dekodiert werden müssen. Das Scan-Ergebnis ist auf Komprimierung und Implementierungsentscheidungen zurückzuführen.</p>
<p>Diese Zahlen sollten immer im Zusammenhang mit der jeweiligen Konfiguration betrachtet werden: 8 vCPUs, Ubuntu 22.04 KVM, lokales Dateisystem, eine Datei, 40.000 Zeilen, 1 MB große Zeilengruppen und das oben dargestellte Schema. Bei Objektspeichern kann die Netzwerk-E/A eine dominierende Rolle spielen, sodass die Reduzierung der Leseamplifikation noch wichtiger sein kann. Die tatsächlichen Ergebnisse hängen von der Form des Datensatzes, dem Verhalten des Objektspeichers, dem Cache-Status und dem Abfragemuster ab.</p>
<p>Der übergeordnete Punkt ist nicht, dass jede Spalte Vortex verwenden sollte.</p>
<p>Der Punkt ist vielmehr, dass Vektordatensätze eine Auswahl des Dateiformats auf ColumnGroup-Ebene erfordern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Entwurf 2: Physische Dateien anhand von Zeilen-IDs ausrichten<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Hybride Dateiformate lösen ein Problem: Verschiedene Spalten können nun in den Formaten gespeichert werden, die am besten zu ihnen passen.</p>
<p>Doch dadurch entsteht ein zweites Problem. Wenn skalare Felder in Parquet, Vektoren in Vortex und Rohobjekte im Objektspeicher liegen, wie kann das System sie dann dennoch als eine einzige Sammlung behandeln?</p>
<p><strong>Loon löst dies durch die Ausrichtung anhand von Zeilen-IDs.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">Die Zeilen-ID ist das Koordinatensystem der Speicherebene</h3><p>Jede physische ColumnGroupFile speichert den Dateipfad und den von ihr abgedeckten Zeilen-ID-Bereich:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Verschiedene ColumnGroups können denselben Zeilen-ID-Bereich abdecken, selbst wenn sie in unterschiedlichen Dateien und Formaten gespeichert sind.</p>
<p>Für den Zeilen-ID- <code translate="no">12345</code> können sich die skalaren Metadaten in einer Parquet-ColumnGroup befinden, die Einbettung in einer Vortex-ColumnGroup und das Rohvideo durch einen Verweis auf den Objektspeicher dargestellt werden. Logisch gesehen bilden sie weiterhin eine Zeile. Dies verleiht der Speicherebene ein stabiles Koordinatensystem.</p>
<p>Die Zeilen-ID ist nicht der primäre Geschäftsschlüssel. Es ist das Koordinatensystem der Speicherschicht, das es Loon ermöglicht, eine Sammlung physisch aufzuteilen, ohne die Fähigkeit zu verlieren, sie logisch wiederherzustellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Neue Spalten erfordern kein Überschreiben alter Spalten</h3><p>Das Hinzufügen von „ <code translate="no">embedding_v2</code> “ erfordert kein Überschreiben der ursprünglichen „Caption“, Metadaten oder „ <code translate="no">embedding_v1</code> “-ColumnGroups. Loon kann eine neue „Vector“-ColumnGroup schreiben, den von ihr abgedeckten Zeilen-ID-Bereich aufzeichnen und diese Änderung über das Manifest festschreiben.</p>
<p>Das Gleiche gilt für spärliche Vektoren, neu gewertete Merkmale oder andere abgeleitete Felder, die später hinzukommen.</p>
<p>Solange die neue „ColumnGroup“ den richtigen Zeilen-ID-Bereich abdeckt, kann sie derselben logischen Sammlung hinzugefügt werden, ohne dass nicht zugehörige Daten verschoben werden müssen.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Löschvorgänge und Komprimierung können gezielter erfolgen</h3><p>Die Ausrichtung der Zeilen-IDs hilft auch bei Löschvorgängen.</p>
<p>Ein Löschvorgang kann zunächst über ein Löschprotokoll ausgedrückt werden. Die Zeile wird auf logischer Ebene unsichtbar, während die physische Bereinigung bis zur Komprimierung zurückgestellt wird. Wenn die Komprimierung schließlich ausgeführt wird, muss sie nicht immer jede mit den betroffenen Zeilen verknüpfte ColumnGroup neu schreiben. Sie kann sich auf die ColumnGroups konzentrieren, die bereinigt werden müssen.</p>
<p>Dies ist von Bedeutung, da nicht jede Spalte das gleiche Kostenprofil aufweist. Das Umschreiben einer kurzen skalaren ColumnGroup unterscheidet sich erheblich vom Umschreiben von Hunderten von Gigabyte dichter Vektoren.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">Die hybride Suche kann nur die Spalten abrufen, die sie benötigt</h3><p>Die Ausrichtung der Zeilen-IDs ist zudem der Grund, warum die hybride Suche auf der Grundlage hybrider Dateiformate praktikabel ist.</p>
<p>Nachdem die ANN-Suche Kandidaten-Zeilen-IDs zurückgegeben hat, kann das System nur die Felder abrufen, die für das Endergebnis benötigt werden: Beschriftungen, Metadaten, Vektoren, Rerank-Merkmale oder Objektreferenzen.</p>
<p>Beispielsweise benötigt eine Abfrage möglicherweise:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Diese Felder können sich in verschiedenen ColumnGroups befinden. Loon kann die relevanten Dateien anhand des Zeilen-ID-Bereichs lokalisieren, die erforderlichen Byte-Bereiche lesen und das Ergebnis zusammenstellen.</p>
<p>Ohne Zeilen-ID-Ausrichtung wären Hybridformate lediglich separate Dateien, die nebeneinander liegen. Mit Zeilen-ID-Ausrichtung verhalten sie sich wie eine einzige logische Sammlung.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Der „Packed Reader“ verbirgt die Aufteilung vor der oberen Ebene</h3><p>Die Laufzeitkomponente, die dies nutzbar macht, ist der „Packed Reader“.</p>
<p>Die obere Ebene sieht einen einheitlichen Arrow-RecordBatch-Stream. Im Hintergrund können die Daten aus mehreren ColumnGroups in unterschiedlichen Dateiformaten stammen. Der Packed Reader verbirgt diese Unterschiede, richtet die Daten anhand von Zeilen-ID-Bereichen aus und plant die E/A-Vorgänge für mehrere Dateien unter kontrollierter Speichernutzung.</p>
<p>Er unterstützt zudem das direkte „ <code translate="no">take</code> “ anhand von Zeilen-IDs. Anhand einer Reihe von Zeilen-IDs lokalisiert er die relevanten ColumnGroupFiles, führt Bereichslesungen durch und gibt die angeforderten Felder zurück.</p>
<p>Für den Video-Workflow kann eine ANN-Abfrage „ <code translate="no">caption</code> “, „ <code translate="no">embedding</code> “ und „ <code translate="no">video_uri</code> “ erfordern. Der Packed Reader kann die skalare ColumnGroup und die vektorielle ColumnGroup abrufen, ohne nicht relevante Spalten zu berühren.</p>
<p>Das ist der Unterschied zwischen „separaten Dateien“ und „einer Tabelle mit mehreren physischen Layouts“.</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Entwurf 3: Das Manifest als „Quelle der Wahrheit“ nutzen<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Hybride Dateiformate definieren, wie Daten physisch gespeichert werden. Die Ausrichtung der Zeilen-IDs bestimmt, wie getrennte ColumnGroups dennoch eine einzige logische Tabelle bilden. Das System muss jedoch noch eine übergeordnete Frage beantworten: <strong>Welche Dateien, Protokolle, Statistiken, Indizes und Objektreferenzen gehören zur aktuellen Version des Datensatzes? Das ist die Aufgabe des Manifests.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Objektspeicherverzeichnisse reichen nicht aus</h3><p>Objektspeicher ist kein Datenbankkatalog. Ein Verzeichnis kann alte Dateien, neue Dateien, Ausgabedateien fehlgeschlagener Jobs, temporäre Dateien, Löschprotokolle, Dateien, auf die noch von älteren Snapshots verwiesen wird, sowie Dateien enthalten, die auf die Bereinigung warten. Die Tatsache, dass eine Datei existiert, bedeutet nicht, dass sie zur aktuellen Version des Datensatzes gehört.</p>
<p>Ein Loon-Datensatz kann beispielsweise in folgenden Verzeichnissen organisiert sein:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Doch die Verzeichnisstruktur ist nicht die „Quelle der Wahrheit“. Das Manifest ist es. Leser sollten keine Verzeichnisse auflisten und den Status aus den zufällig vorhandenen Dateien ableiten. Sie sollten das aktuelle Manifest lesen und der darin deklarierten versionierten Ansicht folgen.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Das Manifest definiert eine versionierte Ansicht des Datensatzes</h3><p>Das Manifest definiert den Datensatz in einer bestimmten Version. Es enthält folgende Angaben:</p>
<ul>
<li>welche ColumnGroups vorhanden sind</li>
<li>welche Zeilen-ID-Bereiche sie abdecken</li>
<li>welches physische Format jede ColumnGroup verwendet</li>
<li>wo sich die Dateien befinden</li>
<li>welche Löschprotokolle aktiv sind</li>
<li>Welche Statistiken verfügbar sind</li>
<li>welche Indizes vorhanden sind</li>
<li>auf welche externen Blobs verwiesen wird</li>
<li>welche Spalten und Zeilenbereiche diese Statistiken oder Indizes abdecken</li>
</ul>
<p>Bei jeder Aktualisierung wird eine neue Manifest-Version geschrieben. Ein Leser, der Version N öffnet, sieht eine stabile Ansicht des Datensatzes in Version N. Ein Schreiber kann Version N+1 vorbereiten, ohne Leser zu stören, die noch Version N verwenden.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Das Manifest erfasst mehr als nur Tabellendateien</h3><p>In Loon ist der Hauptteil des Manifests mit Apache Avro kodiert und in vier Hauptabschnitte gegliedert.</p>
<ul>
<li>ColumnGroups beschreiben die Spalten, Formate, Dateien und Zeilen-ID-Bereiche.</li>
<li>„DeltaLogs“ beschreiben Löschvorgänge. Verschiedene Löschtypen decken unterschiedliche Ursachen für Änderungen ab, wie z. B. Primärschlüssel-Löschungen durch Clients, positionsbezogene Löschungen durch interne Komprimierung oder Gleichheitslöschungen durch externe Engines.</li>
<li>„Stats“ enthalten Planungsmetadaten wie Bloom-Filter, BM25-Statistiken sowie Min-/Max-Werte.</li>
<li>Indexes beschreiben den Indextyp, Parameter, die abgedeckten Spalten und Zeilen-ID-Bereiche. Dazu können Vektorindizes wie HNSW oder IVF, Textindizes, invertierte Indizes, Bitmap-Indizes und zugehörige Strukturen gehören.</li>
</ul>
<p>Hier unterscheidet sich Loon von einem herkömmlichen Tabellenmanifest.</p>
<p>Ein Vektordatensatz muss nicht nur Datendateien und Partitionen nachverfolgen. Er muss auch Vektorindizes, Textindizes, spärliche Merkmale, Löschprotokolle, Statistiken, Verweise auf externe Objekte und die Zeilen-ID-Bereiche nachverfolgen, die diese miteinander verbinden.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Das Manifest muss nicht nur von der Datenbank, sondern auch von anderen geschrieben werden können</h3><p>Das Wichtigste ist nicht nur, was das Manifest enthält, sondern auch, wer es schreiben darf.</p>
<ul>
<li>Wenn nur die Datenbank das Manifest schreiben kann, bleibt es interne Metadaten. Sauberere Metadaten, aber immer noch auf eine Engine beschränkt.</li>
<li>Wenn externe Engines neue ColumnGroups, Statistiken und Manifest-Einträge generieren können, wird das Manifest zu einer Koordinationsschnittstelle.</li>
<li>Ein Spark-Job kann beispielsweise eine spärliche Vektorspalte nachbelegen. Er schreibt eine neue ColumnGroup, erfasst die Zeilenabdeckung und Statistiken und führt ein neues Manifest durch. Online-Abfragen können während des Jobs weiterhin die alte Version lesen. Sobald der Commit erfolgreich ist, wird die neue Version sichtbar.</li>
</ul>
<p>Dies ähnelt im Grundgedanken Iceberg und Delta Lake, doch das Objektmodell ist umfassender. Ein Vektordatensatz muss Vektorindizes, Textindizes, spärliche Merkmale, Löschprotokolle, Statistiken, Blob-Referenzen und Zeilen-ID-Bereiche nachverfolgen, nicht nur Tabellendateien und Partitionen.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Optimistische Commits vereinfachen Versionsaktualisierungen</h3><p>Bei jedem Commit wird eine neue Manifest-Version geschrieben. Ein Schreiber kann neue Inhalte auf Basis der Version N erstellen und anschließend versuchen, diese unter <code translate="no">manifest-{N+1}.avro</code> zu schreiben. Die Semantik des bedingten Schreibens oder der Generationsabgleichs bei Objektspeichern kann dazu führen, dass der Commit fehlschlägt, wenn diese Version bereits existiert. Der Schreiber kann es dann mit der neueren Version erneut versuchen.</p>
<p>Dies verleiht Loon optimistische Parallelität, ohne dass jede Aktualisierung einen aufwendigen, stark konsistenten Koordinationspfad durchlaufen muss. Ohne ein Manifest führt die Speicherung in verschiedenen Formaten und auf verschiedenen Engines letztendlich zu Namenskonventionen und manueller Abstimmung. Das mag bei kleinen Datensätzen funktionieren. Bei Vektordaten im TB-Maßstab funktioniert es jedoch nicht.</p>
<p>Das Manifest ist das, was heterogene Dateien in einen Datensatz verwandelt, den mehrere Systeme sicher lesen und aktualisieren können.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Was ändert sich für Nutzer, wenn der Speicher versioniert wird?<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Für Anwendungsentwickler sollte Loon keine neue API-Belastung darstellen.</p>
<p>Die Nutzer sollten weiterhin mit den vertrauten Milvus-Konzepten arbeiten: Sammlungen, Einfügungen, Suche und hybride Suche. Sie sollten sich bei der normalen Anwendungsentwicklung keine Gedanken über Manifest-Dateien, ColumnGroups, Zeilen-ID-Bereiche oder das Dateilayout machen müssen.</p>
<p>Die Änderung findet im Hintergrund statt. Der Speicher berücksichtigt nun besser, wie sich KI-Datensätze tatsächlich entwickeln.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Das Hinzufügen einer neuen Einbettung sollte die alten Daten nicht verschieben</h3><p>Bisher erforderte das Hinzufügen von „ <code translate="no">embedding_v2</code> “ zu einer bestehenden Sammlung oft das Exportieren von Daten, das Trainieren eines neuen Modells, das Generieren von Vektoren und anschließend das erneute Importieren oder die Massenaktualisierung der Sammlung über das SDK. Dieser Weg verursacht einen hohen Betriebsaufwand: Versionsverfolgung, Wiederholungsversuche bei fehlgeschlagenen Jobs, Index-Neuerstellungen, Auswirkungen auf den Betrieb und Konsistenzprüfungen.</p>
<p><strong>Mit Loon lässt sich dies auf eine Schemaentwicklung plus einen neuen ColumnGroup-Commit reduzieren.</strong> Die neue Einbettungsspalte kann als eigene physische ColumnGroup geschrieben, anhand der Zeilen-ID ausgerichtet und über das Manifest sichtbar gemacht werden. Die alte Beschriftungsspalte, die skalare Metadatenspalte und die ursprüngliche Einbettungsspalte müssen nicht verschoben werden.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Nachträgliche Einträge sollten keine clientseitige Aktualisierungsschleife erfordern</h3><p>Viele AI-Datenaktualisierungen sind Backfills. Ein Team fügt möglicherweise spärliche Vektoren hinzu, nachdem die hybride Suche an Bedeutung gewonnen hat. Es fügt möglicherweise Rerank-Merkmale hinzu, nachdem ein neues Modell trainiert wurde. Es korrigiert möglicherweise Bildunterschriften nach einer manuellen Überprüfung. Es fügt möglicherweise Governance-Tags hinzu, nachdem eine Richtlinie aktualisiert wurde.</p>
<p>In einem herkömmlichen Layout erfolgen diese Änderungen oft über Client-SDK-Updates oder rein datenbankbasierte Schreibpfade, selbst wenn die Daten von Spark, Ray oder einer anderen externen Engine erzeugt werden.</p>
<p>Mit Loon können externe Rechensysteme neue ColumnGroups erzeugen und diese über das Manifest festschreiben. Die Datenbank muss nicht mehr der einzige Einstiegspunkt für jede Neuschreibung sein.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">Für die Offline-Analyse sollte keine weitere Kopie der „Wahrheit“ erforderlich sein</h3><p>Bisher haben Teams häufig eine Online-Sammlung zur Offline-Auswertung oder -Analyse in Parquet exportiert. Dadurch entstehen zwei Versionen desselben Datensatzes: die Online-Sammlung und die Analysekopie. Sobald Beschriftungen korrigiert, Einbettungen neu generiert, Löschprotokolle angewendet oder Indizes neu aufgebaut wurden, muss das Team abklären, welche Kopie aktuell ist.</p>
<p>Mit einem Manifest-basierten Speichermodell können Analyse-Engines dieselbe versionierte Datensatzansicht lesen wie das Servingsystem. Sie können nur die Spalten projizieren, die sie benötigen, nur die relevanten Zeilenbereiche scannen und mit einer deklarierten Datensatzversion arbeiten, anstatt mit einem manuell exportierten Snapshot.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Löschungen und Korrekturen sollten nur die geänderten Teile betreffen</h3><p>Löschungen, Korrekturen von Beschriftungen, Korrekturen von Labels und Governance-Aktualisierungen gehören bei KI-Datensätzen zur Routine. Sie sollten nicht dazu führen, dass jede Spalte mit langen Vektoren denselben Umschreibungsprozess durchlaufen muss.</p>
<p>Mit Loon können Löschprotokolle zunächst als logische Löschung behandelt werden. Eine spätere Komprimierung kann die betroffenen ColumnGroups bereinigen, ohne nicht betroffene Daten neu zu schreiben. Wenn sich ein kurzes Textfeld ändert, sollte die Speicherschicht nicht Hunderte von Gigabyte dichter Vektoren neu schreiben müssen, nur weil diese dieselbe logische Zeile teilen.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Externe Engines werden Teil des Workflows, nicht mehr nur eine Notlösung</h3><p>Die größere Veränderung besteht darin, dass externe Engines nicht mehr als Systeme außerhalb der Vektordatenbank behandelt werden.</p>
<p>Spark, Ray, Auswertungsjobs, Labeling-Systeme und Governance-Pipelines erzeugen und modifizieren bereits einen Großteil der Daten. Die Speicherschicht sollte es ihnen ermöglichen, auf der Grundlage einer einzigen „Single Source of Truth“ zusammenzuarbeiten, anstatt ständig Daten zu exportieren, zu kopieren und wieder zu importieren.</p>
<p>Genau das ermöglicht eine Version von Manifest. Sie bietet Online-Bereitstellung, Offline-Analyse, Backfill-Jobs und Komprimierung eine gemeinsame Sicht auf den Datensatz.</p>
<p>Das mag nach internen Speicherdetails klingen, hat aber Einfluss darauf, wie schnell Teams mit KI-Datensätzen iterieren können. Jede Modelländerung, jedes Feature-Backfill, jede Bildbeschriftungskorrektur, jeder Qualitätsfilter und jeder Index-Neuaufbau hängt von derselben Frage ab:<strong>„Kann das System den Datensatz aktualisieren, ohne Daten zu verschieben, die es nicht verschieben muss?“</strong></p>
<p>Das ist der praktische Nutzen des Speichermodells.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon ist in der Milvus 3.0-Beta und in Zilliz Vector Lakebase verfügbar<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon ist in <a href="https://milvus.io/docs/release_notes.md">der Milvus 3.0-Beta</a> verfügbar und ist zudem Teil der Speicherschicht in <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, der nächsten Entwicklungsstufe von Zilliz Cloud. Diese Version konzentriert sich auf drei Kernbereiche:</p>
<ul>
<li><strong>Das Manifest.</strong> Das Ziel besteht darin, dass Schreibvorgänge, Nachträge, Löschungen, Statistiken und Indexaktualisierungen versionierte Datensatzansichten erzeugen, die Leser konsistent öffnen können. Für Leser bedeutet dies, dass eine Abfrage eine bestimmte Manifest-Version öffnen und eine stabile Ansicht des Datensatzes anzeigen kann. Für Schreiber bedeutet dies, dass neue Datendateien, Löschprotokolle, Statistiken oder Indexdateien zunächst vorbereitet und dann durch einen versionierten Commit sichtbar gemacht werden können.</li>
<li><strong>Unterstützung für ColumnGroup und Formate.</strong> Parquet unterstützt skalare und ökosystemfreundliche Spalten. Vortex unterstützt vektorlastige Zugriffsmuster. Lance kann im schreibgeschützten Modus integriert werden, um die Kompatibilität mit bestehenden Lance-Datensätzen zu gewährleisten.</li>
<li><strong>Der Index auf Lake.</strong> Skalare Statistiken, Filterindizes und invertierte Textindizes können an der Manifest-basierten Planung nach Zeilenbereichen teilnehmen. Lake-native Vektorindizes sind stärker eingebunden. HNSW und IVF verhalten sich bei Objektspeichern unterschiedlich, wobei insbesondere HNSW empfindlich auf wahlfreien Zugriff und Cache-Lokalität reagiert. Es ist nicht möglich, einfach ein für eine lokale SSD konzipiertes Layout wiederzuverwenden und das gleiche Ergebnis zu erwarten.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Es gibt noch einiges zu tun</h3><ul>
<li><strong>Externe Schreibpfade</strong> sind wichtig, da Spark und Ray in der Lage sein sollten, ColumnGroups und Manifest-Commits zu erzeugen, ohne jeden Backfill über eine Client-SDK-Schleife erzwingen zu müssen.</li>
<li><strong>Die Lakehouse-Interoperabilität</strong> ist wichtig, da viele Teams bereits Kataloge und Abfrage-Engines wie <strong>Iceberg, Delta Lake, Trino, DuckDB und Athena</strong> nutzen <strong>.</strong> Vektordaten sollten in dieses Ökosystem integriert werden können, ohne dass die Suchleistung bei Vektoren beeinträchtigt wird.</li>
<li><strong>Das Indexlayout</strong> ist wichtig, da Graph-Indizes und invertierte Strukturen unterschiedliche Zugriffsmuster auf Objektspeichern aufweisen.</li>
<li><strong>Die Semantik großer Objekte</strong> ist wichtig, da Rohvideos, PDFs, Bilder und Audiodateien ein Referenzmanagement, eine Versionierung und ein Löschverhalten erfordern, die mit dem abgeleiteten Vektordatensatz übereinstimmen.</li>
</ul>
<p>Das genaue Release-Verhalten, die Standardeinstellungen und der Migrationspfad sollten den entsprechenden <a href="https://docs.zilliz.com/docs/release-notes-2605">Release-Hinweisen</a> von Milvus und <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a> entsprechen. Die Richtung in Sachen Speicher ist jedoch klar: Vektordatenbanken benötigen eine versionierte, Lake-native Grundlage unterhalb der Servicing-Schicht.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Testen Sie Loon unter Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Ihr aktueller Stack Online-Bereitstellung, Offline-Analyse, Backfills und externe Data-Lake-Workflows in verschiedene Systeme aufteilt, ist Zilliz Vector Lakebase einen Blick wert. Sie können es in <a href="https://cloud.zilliz.com/signup">der Zilliz Cloud</a> ausprobieren. Bei einer Neuanmeldung mit Ihrer geschäftlichen E-Mail-Adresse erhalten Sie 100 US-Dollar Gratisguthaben. Gerne können Sie auch <a href="https://zilliz.com/contact-sales">mit uns</a> über Ihren Anwendungsfall <a href="https://zilliz.com/contact-sales">sprechen</a>.</p>
<p>Sie können auch die <a href="https://milvus.io/docs/release_notes.md">Veröffentlichung von Milvus 3.0</a> verfolgen, um zu sehen, wie sich Loon in der Open-Source-Engine weiterentwickelt.</p>
<p><strong>Zilliz Vector Lakebase vereint:</strong></p>
<ul>
<li>Mehrstufige Bereitstellung für unterschiedliche Kompromisse zwischen Echtzeit-Leistung und Kosten</li>
<li>On-Demand-Suche für groß angelegte oder explorative Workloads ohne ständig aktive Rechenkapazität</li>
<li>Externe Data-Lake-Suche, sodass Sie bestehende Lake-Daten direkt indizieren und durchsuchen können</li>
<li>Umfassende Suche über Vektoren, Text, JSON und Geodaten hinweg mit hybrider Abfrage und Neurangierung</li>
<li>Einheitlicher, Lake-nativer Speicher auf Basis von Vortex, einem offenen Format, das für schnellere und kostengünstigere zufällige Lesezugriffe auf vektorlastige Daten entwickelt wurde</li>
</ul>
