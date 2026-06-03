---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >-
  Wie man 25 Millionen Bildvektoren auf weniger als 1 GB Speicher in Milvus
  ausführt
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Wie ein Community-Benutzer eine Bildsuche mit 25 Mio. Vektoren auf &lt;1 GB
  Speicher in Milvus mit FLAT, FP16 und mmap durchführte - anstelle der vom
  Sizing Tool geschätzten 139 GB.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Ein Milvus-Benutzer kam kürzlich mit einem sehr praktischen Problem der Bildsuche zu uns.</p>
<p>"Wir müssen eine Bild-zu-Bild-Suche auf 25 Millionen Bildern durchführen, die als 1280-dimensionale Vektoren kodiert sind. Ein einziger Rechner wird diese Aufgabe übernehmen. Er verfügt über 64 GB RAM, von denen höchstens 32 GB für die Vektordatenbank verwendet werden können. Das <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> sagt jedoch, dass wir 139 GB benötigen. Sind wir am Ende?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Schätzungsergebnisse des Sizing-Tools: 25M × 1280-dimensionale Vektoren, Rohdatengröße 119,2 GB, Ladespeicher 139,4 GB</p>
<p>Nicht ganz.</p>
<p>Zunächst schien die offensichtliche Antwort ein erweiterter Index zu sein. Wenn der Datensatz groß und der Speicher knapp ist, sollte ein intelligenterer ANN-Index sicherlich helfen. In diesem Fall war das nicht der Fall. Der Index, der schließlich funktionierte, war die einfachste Option von Milvus: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>Das Ergebnis war besser als erwartet: Der stationäre Speicher blieb unter 1 GB, der residente Speicher des Containers lag bei etwa 600 MB und die Latenzzeit bei der Warmabfrage blieb unter 100 ms. Der Startvorgang erreichte kurzzeitig einen Spitzenwert von etwa 12,5 GB, und die erste Abfrage dauerte etwa 30 Sekunden, während das System aufgewärmt wurde.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der wichtige Teil ist nicht, dass FLAT auf magische Weise 25 Millionen Brute-Force-Vergleiche billig gemacht hat. Das ist nicht der Fall. Der wichtige Teil ist, dass diese Arbeitslast fast nie alle 25 Millionen Vektoren durchsucht hat. Skalare Filter schränkten jede Abfrage zuerst ein, und FLAT verglich nur Vektoren innerhalb dieser viel kleineren Kandidatengruppe.</p>
<p>In diesem Beitrag wird erläutert, was fehlgeschlagen ist, warum FLAT funktioniert hat und wann es sich lohnt, dasselbe Muster in Ihrer eigenen Arbeitslast auszuprobieren.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Warum AISAQ und IVF_FLAT hier nicht funktionierten<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Vor FLAT hat der Benutzer zwei Indizes ausprobiert, die für einen eingeschränkten Rechner natürlicher aussehen.</p>
<p><strong>Erster Versuch:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ ist ein festplattenorientierter Index, der die Speichernutzung gering halten soll. Der Haken bei dieser Arbeitslast war der Erstellungs- und Ladepfad. In einem früheren Test mit 55 Millionen Vektoren wurden beim Laden einer Sammlung 249 GB an temporären Daten auf die Festplatte geschrieben, was zu lange dauerte, um praktikabel zu sein.</p>
<p><strong>Zweiter Versuch: IVF_FLAT.</strong> IVF_FLAT sah ebenfalls vernünftig aus, da es sich um einen Standard-ANN-Index handelt. Der Index wurde erfolgreich aufgebaut, aber die Erfassungslast blieb bei 14 % stehen und erholte sich nicht mehr.</p>
<p>Nach diesen beiden Sackgassen versuchte der Benutzer die langweilige Option: FLAT. Sie wurde sauber geladen. Sie ergab auch das beste Laufzeitverhalten für dieses spezielle Abfragemuster.</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Warum es vielversprechend aussah</strong></th><th><strong>Was in diesem Workload geschah</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Plattenorientierter Index mit theoretisch geringem Speicherverbrauch</td><td>Der Erstellungs-/Ladepfad erzeugte große temporäre Dateien. In einem Test mit 55 Mio. Vektoren schrieb eine Sammlungslast 249 GB an temporären Daten und war langsam.</td></tr>
<tr><td>IVF_FLAT</td><td>Standard ANN-Index mit geringeren Suchkosten als bei einer vollständigen Suche</td><td>Der Index wurde aufgebaut, aber das Laden der Datensammlung blieb bei 14 % stehen und erholte sich nicht mehr.</td></tr>
<tr><td>FLAT</td><td>Keine zusätzliche ANN-Struktur und keine Komplexität beim Indexaufbau</td><td>Der stationäre Speicher blieb unter 1 GB. Der residente Speicher des Containers betrug etwa 600 MB. Beim Start wurde ein Spitzenwert von fast 12,5 GB erreicht. Die erste Abfrage dauerte etwa 30 Sekunden, danach blieben die warmen Abfragen unter 100 ms.</td></tr>
</tbody>
</table>
<p>Die Lektion ist einfach: Ein Index, der in der Theorie effizient ist, kann für einen bestimmten Rechner, eine bestimmte Datenform und ein bestimmtes Abfragemuster dennoch ungeeignet sein.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Warum FLAT funktionierte<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT ist der einfachste Index, den Milvus unterstützt. Kein Graph. Kein Baum. Kein Clustering. Er vergleicht den Abfragevektor direkt mit Kandidatenvektoren.</p>
<p>Das klingt wie das falsche Werkzeug für 25 Millionen Vektoren. Es wäre auch das falsche Werkzeug, wenn jede Abfrage die gesamte Sammlung durchsuchen würde.</p>
<p>Aber bei dieser Arbeitslast war der Vektorsuche ein starker Filter vorangestellt. Jede Abfrage grenzte den Suchraum zunächst mit skalaren Feldern wie <code translate="no">dataid</code> und <code translate="no">classid</code> ein. Erst dann führte Milvus eine vektorielle Ähnlichkeitssuche durch. Dadurch änderte sich das Problem von "25 Millionen Vektoren durchsuchen" zu "ein paar hundert bis zehntausend Vektoren nach der Filterung durchsuchen".</p>
<p>Drei Teile machten den Aufbau möglich: FP16-Vektorspeicher, mmap für Rohvektordaten und skalare Filterung vor dem FLAT-Durchgang.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Optimierung 1: FP16 halbiert die Vektordaten<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Vektoren hatten 1280 Dimensionen. Als FP32 gespeichert, benötigt jeder Vektor 5120 Bytes:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Bei 25 Millionen Vektoren sind das etwa 119,2 GB an rohen Vektordaten. Mit FP16 wird jede Dimension von 4 Byte auf 2 Byte reduziert:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>Damit sinken die Vektor-Rohdaten auf etwa 59,6 GB.</p>
<p>Dies passt immer noch nicht in den verfügbaren Arbeitsspeicher, aber es halbiert die Menge der Vektordaten, die Milvus und das Betriebssystem verarbeiten müssen. Bei vielen Bildabfragen hat FP16 eine geringe Auswirkung auf den Recall, aber es ist keine kostenlose Regel. Testen Sie die Wiederauffindbarkeit mit Ihren eigenen Einbettungen, Metriken und Qualitätsmerkmalen, bevor Sie es zum Standard machen.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Optimierung 2: mmap hält rohe Vektoren vom Prozess-Heap fern<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Selbst nach FP16 sind etwa 60 GB an Vektoren immer noch zu viel für das Speicherbudget. An dieser Stelle wird <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> nützlich.</p>
<p>Mit mmap kann Milvus auf Vektordaten über Memory-Mapped-Dateien zugreifen, anstatt das gesamte Rohvektorfeld in den Prozessspeicher zu laden. Das Betriebssystem blättert die Daten ein, wenn Abfragen sie berühren, und kann heiße Seiten in seinem Seiten-Cache halten.</p>
<p>In der Milvus 2.6.14-Umgebung dieses Benutzers deckte die mmap-Konfiguration auf Clusterebene bereits rohe Vektordaten ab, so dass der Benutzer mmap nicht manuell einstellen musste.</p>
<p>Ein Detail sorgte bei der Fehlersuche für Verwirrung: Attu zeigt die mmap-Einstellung auf Schemaebene an, nicht die Standardeinstellung auf Clusterebene. <a href="https://zilliz.com/attu"><strong>Attu</strong></a> kann also mmap als deaktiviert anzeigen, auch wenn die Konfiguration auf Clusterebene mmap für den Datenpfad tatsächlich aktiviert.</p>
<p>Der Kompromiss ist einfach. mmap spart zwar RAM, nutzt aber die Festplatte und den Seitencache des Betriebssystems stärker. Sie benötigen immer noch SSD-Kapazität für die Vektordateien, und die erste Abfrage kann langsamer sein, während die relevanten Seiten von der Festplatte gelesen werden.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Optimierung 3: Skalare Filterung ist der wahre Leistungsmultiplikator<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 und mmap erklären die Speicheranzahl. Skalare Filterung erklärt die Latenzzahl.</p>
<p>Jede Abfrage in diesem Workload enthielt einen Filterausdruck wie diesen:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Dieser Filter wurde vor dem Vektorvergleichsschritt ausgeführt. Anstatt mit 25 Millionen Vektoren zu vergleichen, verglich FLAT mit dem gefilterten Kandidatensatz, der von einigen Hundert bis zu Zehntausenden von Vektoren reichte.</p>
<p>Aus diesem Grund blieben die warmen Abfragen unter 100 ms. Zehntausende von Vektorvergleichen sind auf einer modernen CPU praktisch. Fünfundzwanzig Millionen Vergleiche pro Abfrage wären eine ganz andere Geschichte.</p>
<p>Dies erklärt auch, warum IVF_FLAT und HNSW hier nicht nützlich waren. Sobald die skalare Filterung die Kandidatenmenge ausreichend reduziert hat, kann eine zusätzliche ANN-Struktur zum Ballast werden. Sie erhöht den Speicherbedarf, die Erstellungszeit und die Ladekomplexität, aber die Latenzzeit wird dadurch nicht wesentlich verbessert.</p>
<p>Es gibt einen Vorbehalt. Die Filter in dieser Arbeitslast waren einfach. Wenn Ihre Filter große <code translate="no">IN</code> Listen, <code translate="no">LIKE</code> Muster, Bereichsprädikate oder verschachtelte JSON-Bedingungen verwenden, fügen Sie skalare Indizes für die relevanten Felder hinzu und messen Sie die Filterstufe direkt.</p>
<table>
<thead>
<tr><th>Optimierung</th><th>Was wird damit erreicht?</th><th>Warum es hier wichtig ist</th><th>Kompromiss</th></tr>
</thead>
<tbody>
<tr><td>FP16-Vektorspeicherung</td><td>Speichert jede Vektordimension mit 2 Byte statt mit 4 Byte</td><td>Verringerung der Vektor-Rohdaten von etwa 119,2 GB auf etwa 59,6 GB</td><td>Die Auswirkung auf den Rückruf hängt von Ihren Einbettungen und Metriken ab. Testen Sie es.</td></tr>
<tr><td>mmap auf rohen Vektoren</td><td>Bildet Vektordateien von der Festplatte ab, anstatt das gesamte rohe Vektorfeld in den Prozessspeicher zu laden</td><td>Hält den Prozessspeicher niedrig und lässt das Betriebssystem bei Bedarf Daten auslagern</td><td>Erfordert SSD-Kapazität und kann kalte Abfragen langsamer machen.</td></tr>
<tr><td>Skalare Filterung zuerst</td><td>Filtert nach skalaren Feldern vor dem Vektorvergleich</td><td>Reduziert jede Abfrage von 25 Millionen Kandidaten auf Hunderte oder Zehntausende</td><td>Komplexe Filter benötigen möglicherweise skalare Indizes.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Wo dieses Muster anwendbar ist<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Bildsuche funktionierte, weil der tatsächliche Suchraum viel kleiner war als die gesamte Sammlung. Die gleiche Form findet sich in vielen Produktions-Workloads.</p>
<ol>
<li><strong>RAG mit mehreren Mandanten:</strong> Filtern Sie zuerst nach <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code> oder <code translate="no">project_id</code>. Jeder Mandant hat möglicherweise nur Tausende oder Zehntausende von Chunks.</li>
<li><strong>E-Commerce-Produktsuche:</strong> Filtern Sie vor der Vektorsuche nach Kategorie, Marke, Verkäufer, Region oder Verfügbarkeit.</li>
<li><strong>Abruf von Protokollen und Dokumenten:</strong> Filtern Sie vor der semantischen Suche nach Zeitspanne, Quelle, Dienst oder Dokumenttyp.</li>
<li><strong>Bild- oder Mediensuche mit Labels:</strong> Filtern Sie nach Datensatz, Klasse, Kunde oder Anlagengruppe, bevor Sie Einbettungen vergleichen.</li>
</ol>
<p>Dies sind gute Kandidaten für FLAT + FP16 + mmap, da die gesamte Sammlung groß sein kann, während jede Abfrage nur eine kleine Teilmenge betrifft.</p>
<p>Das Muster trifft nicht zu, wenn jede Abfrage die gesamte Sammlung durchsucht. Wenn jede Abfrage wirklich alle 25 Millionen Vektoren durchsuchen muss, wird FLAT nicht die gleiche Latenzzeit liefern. Verwenden Sie in diesem Fall einen ANN-Index wie HNSW, IVF oder einen plattenorientierten Index, und planen Sie die Kompromisse zwischen Arbeitsspeicher, Festplatte und Erstellungszeit ein.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">So lesen Sie die Schätzung des Sizing-Tools<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Milvus Sizing Tool ist ein Ausgangspunkt und kein endgültiges Urteil über Ihre Hardware.</p>
<p>In diesem Fall diente die Schätzung von 139,4 GB Ladespeicher als konservative Grundlage für 25 Millionen 1280-dimensionale FP32-Vektoren. Die tatsächliche Arbeitslast änderte mehrere Annahmen:</p>
<ol>
<li>FP16 halbierte die Größe der Rohvektoren ungefähr.</li>
<li>mmap vermied das Laden des gesamten Rohvektorfeldes in den Prozessspeicher.</li>
<li>FLAT vermied zusätzliche ANN-Indexstrukturen.</li>
<li>Skalare Filter machten jede Abfragesuche zu einer viel kleineren Kandidatenmenge.</li>
</ol>
<p>Aus diesem Grund sind Tests unter realen Bedingungen wichtig. Bevor Sie eine Hardwarekonfiguration nur aufgrund einer Größenschätzung ablehnen, testen Sie die tatsächliche Vektorpräzision, den Indextyp, die mmap-Konfiguration, die skalaren Filter, das Verhalten bei kalten und warmen Abfragen.</p>
<h2 id="Get-Started" class="common-anchor-header">Beginnen Sie<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie das gleiche Rezept ausprobieren möchten, beginnen Sie mit dem Abfragemuster, nicht mit dem Indexnamen.</p>
<ol>
<li>Prüfen Sie, ob jede Abfrage über selektive skalare Filter verfügt.</li>
<li>Schätzen Sie, wie viele Vektoren nach der Filterung übrig bleiben.</li>
<li>Speichern Sie Vektoren als FP16, wenn der Recall-Test gut aussieht.</li>
<li>Verwenden Sie FLAT, wenn die gefilterte Kandidatenmenge klein genug für einen Brute-Force-Vergleich ist.</li>
<li>Überprüfen Sie das mmap-Verhalten für rohe Vektordaten. Überprüfen Sie sowohl die Einstellungen auf Schemaebene als auch die Konfiguration auf Clusterebene.</li>
<li>Messen Sie den Startspeicher, die Latenzzeit bei der ersten Abfrage, die Latenzzeit bei der warmen Abfrage und die Festplatten-E/A.</li>
<li>Fügen Sie skalare Indizes hinzu, wenn die Filterauswertung zum Engpass wird.</li>
</ol>
<p>Beginnen Sie für lokale Tests mit dem <a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Quickstart</strong></a> oder dem Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a> Repository. Verwenden Sie Attu, um Sammlungen zu überprüfen, aber denken Sie daran, dass Attu möglicherweise keine mmap-Standardwerte auf Clusterebene anzeigt.</p>
<p>Wenn Sie die Infrastruktur nicht selbst betreiben möchten, ist <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> der verwaltete Milvus-Service. Sie erhalten denselben Milvus-Kern mit verwaltetem Betrieb, Skalierung und einem kostenlosen Tier zum Testen. <a href="https://cloud.zilliz.com/signup"><strong>Melden Sie sich</strong></a> für 100 $ kostenloses Guthaben mit einer Arbeits-E-Mail <a href="https://cloud.zilliz.com/signup"><strong>an</strong></a>, oder <a href="https://cloud.zilliz.com/login"><strong>melden Sie sich an</strong></a>, wenn Sie bereits ein Konto haben.</p>
