---
id: 2019-12-27-meta-table.md
title: Milvus Metadata Management (2) Felder in der Metadatentabelle
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: >-
  Erfahren Sie mehr über die Details der Felder in den Metadaten-Tabellen in
  Milvus.
cover: null
tag: Engineering
---
<custom-h1>Milvus-Metadatenverwaltung (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Felder in der Metadatentabelle<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Autor: Yihua Mo</p>
<p>Datum: 2019-12-27</p>
</blockquote>
<p>Im letzten Blog haben wir erwähnt, wie Sie Ihre Metadaten mit MySQL oder SQLite anzeigen können. In diesem Artikel sollen vor allem die Felder in den Metadaten-Tabellen im Detail vorgestellt werden.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Felder in der Tabelle &quot;<code translate="no">Tables</code>&quot;</h3><p>Nehmen Sie SQLite als Beispiel. Das folgende Ergebnis stammt aus 0.5.0. In 0.6.0 wurden einige Felder hinzugefügt, die später vorgestellt werden. Es gibt eine Zeile in <code translate="no">Tables</code>, die eine 512-dimensionale Vektortabelle mit dem Namen <code translate="no">table_1</code> angibt. Wenn die Tabelle erstellt wird, ist <code translate="no">index_file_size</code> 1024 MB, <code translate="no">engine_type</code> ist 1 (FLAT), <code translate="no">nlist</code> ist 16384, <code translate="no">metric_type</code> ist 1 (Euklidischer Abstand L2). <code translate="no">id</code> ist der eindeutige Bezeichner der Tabelle. <code translate="no">state</code> ist der Zustand der Tabelle, wobei 0 einen normalen Zustand anzeigt. <code translate="no">created_on</code> ist die Erstellungszeit. <code translate="no">flag</code> ist das für interne Zwecke reservierte Flag.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>Tabellen</span> </span></p>
<p>Die folgende Tabelle zeigt die Feldtypen und Beschreibungen der Felder in <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Feldname</th><th style="text-align:left">Datentyp</th><th style="text-align:left">Beschreibung</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Eindeutiger Bezeichner der Vektortabelle. <code translate="no">id</code> wird automatisch inkrementiert.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Name der Vektortabelle. <code translate="no">table_id</code> muss benutzerdefiniert sein und den Linux-Richtlinien für Dateinamen entsprechen.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Zustand der Vektortabelle. 0 steht für normal und 1 steht für gelöscht (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Vektordimension der Vektortabelle. Muss benutzerdefiniert sein.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Anzahl der Millisekunden vom 1. Januar 1970 bis zum Zeitpunkt der Erstellung der Tabelle.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Flag zur internen Verwendung, z. B. ob die Vektor-ID benutzerdefiniert ist. Die Voreinstellung ist 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Wenn die Größe einer Datendatei <code translate="no">index_file_size</code> erreicht, wird die Datei nicht kombiniert und zum Aufbau von Indizes verwendet. Die Vorgabe ist 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Typ des zu erstellenden Index für eine Vektortabelle. Die Vorgabe ist 0, was einen ungültigen Index angibt. 1 spezifiziert FLAT. 2 spezifiziert IVFLAT. 3 spezifiziert IVFSQ8. 4 gibt NSG an. 5 legt IVFSQ8H fest.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Anzahl der Cluster, in die die Vektoren in jeder Datendatei unterteilt werden, wenn der Index erstellt wird. Die Vorgabe ist 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Methode zur Berechnung des Vektorabstands. 1 spezifiziert den euklidischen Abstand (L1) und 2 spezifiziert das innere Produkt.</td></tr>
</tbody>
</table>
<p>Die Tabellenpartitionierung ist in 0.6.0 mit einigen neuen Feldern aktiviert, darunter <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> und <code translate="no">version</code>. Eine Vektortabelle, <code translate="no">table_1</code>, hat eine Partition namens <code translate="no">table_1_p1</code>, die ebenfalls eine Vektortabelle ist. <code translate="no">partition_name</code> entspricht <code translate="no">table_id</code>. Felder in einer Partitionstabelle werden von der Eigentümertabelle geerbt, wobei das Feld <code translate="no">owner table</code> den Namen der Eigentümertabelle und das Feld <code translate="no">partition_tag</code> den Tag der Partition angibt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tabellen_neu</span> </span></p>
<p>Die folgende Tabelle zeigt die neuen Felder in 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Feldname</th><th style="text-align:left">Datentyp</th><th style="text-align:left">Beschreibung</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string</td><td style="text-align:left">Übergeordnete Tabelle der Partition.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">string</td><td style="text-align:left">Tag der Partition. Darf keine leere Zeichenkette sein.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Milvus-Version.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Felder in der Tabelle "<code translate="no">TableFiles&quot;</code> </h3><p>Das folgende Beispiel enthält zwei Dateien, die beide zur Vektortabelle <code translate="no">table_1</code> gehören. Der Indextyp (<code translate="no">engine_type</code>) der ersten Datei ist 1 (FLAT); der Dateistatus (<code translate="no">file_type</code>) ist 7 (Backup der Originaldatei); <code translate="no">file_size</code> ist 411200113 bytes; die Anzahl der Vektorzeilen ist 200.000. Der Indextyp der zweiten Datei ist 2 (IVFLAT); der Dateistatus ist 3 (Indexdatei). Die zweite Datei ist eigentlich der Index der ersten Datei. Weitere Informationen werden wir in den nächsten Artikeln vorstellen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>tablefiles</span> </span></p>
<p>Die folgende Tabelle zeigt die Felder und Beschreibungen von <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Feldname</th><th style="text-align:left">Datentyp</th><th style="text-align:left">Beschreibung</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Eindeutiger Bezeichner einer Vektortabelle. <code translate="no">id</code> wird automatisch inkrementiert.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Name der Vektortabelle.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Typ des zu erstellenden Index für eine Vektortabelle. Der Standardwert ist 0, was einen ungültigen Index angibt. 1 spezifiziert FLAT. 2 spezifiziert IVFLAT. 3 spezifiziert IVFSQ8. 4 gibt NSG an. 5 legt IVFSQ8H fest.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">Zeichenfolge</td><td style="text-align:left">Dateiname, der aus der Erstellungszeit der Datei generiert wird. Entspricht 1000 multipliziert mit der Anzahl der Millisekunden vom 1. Januar 1970 bis zum Zeitpunkt der Erstellung der Tabelle.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Dateistatus. 0 gibt eine neu erzeugte Rohvektordatei an. 1 gibt eine rohe Vektordatendatei an. 2 gibt an, dass ein Index für die Datei erstellt wird. 3 gibt an, dass die Datei eine Indexdatei ist. 4 gibt an, dass die Datei gelöscht wird (soft delete). 5 gibt an, dass die Datei neu erzeugt wird und zur Speicherung von Kombinationsdaten dient. 6 gibt an, dass es sich um eine neu erzeugte Datei handelt, die zur Speicherung von Indexdaten verwendet wird. 7 gibt den Sicherungsstatus der Rohvektordatei an.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Dateigröße in Bytes.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Anzahl der Vektoren in einer Datei.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Zeitstempel für den letzten Aktualisierungszeitpunkt, der die Anzahl der Millisekunden vom 1. Januar 1970 bis zum Zeitpunkt der Erstellung der Tabelle angibt.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Anzahl der Millisekunden vom 1. Januar 1970 bis zum Zeitpunkt der Erstellung der Tabelle.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Datum, an dem die Tabelle erstellt wurde. Sie ist aus historischen Gründen noch vorhanden und wird in zukünftigen Versionen entfernt.</td></tr>
</tbody>
</table>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Verwaltung von Daten in einer massiven Vektorsuchmaschine</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus Metadaten-Verwaltung (1): Wie man Metadaten anzeigt</a></li>
</ul>
