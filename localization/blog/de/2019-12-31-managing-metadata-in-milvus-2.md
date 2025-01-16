---
id: managing-metadata-in-milvus-2.md
title: Felder in der Tabelle Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Felder in der Metadatentabelle
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Milvus-Metadatenverwaltung (2)</custom-h1><p>Im letzten Blog haben wir erwähnt, wie Sie Ihre Metadaten mit MySQL oder SQLite anzeigen können. In diesem Artikel sollen vor allem die Felder in den Metadaten-Tabellen im Detail vorgestellt werden.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Felder in der Tabelle <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Nehmen Sie SQLite als Beispiel. Das folgende Ergebnis stammt aus 0.5.0. Einige Felder wurden in 0.6.0 hinzugefügt, die später vorgestellt werden. Es gibt eine Zeile in <code translate="no">Tables</code>, die eine 512-dimensionale Vektortabelle mit dem Namen &lt;codetable_1</code>&gt; angibt. Wenn die Tabelle erstellt wird, ist <code translate="no">index_file_size</code> 1024 MB, <code translate="no">engine_type</code> ist 1 (FLAT), <code translate="no">nlist</code> ist 16384, <code translate="no">metric_type</code> ist 1 (Euklidischer Abstand L2). id ist der eindeutige Bezeichner der Tabelle. <code translate="no">state</code> ist der Zustand der Tabelle, wobei 0 einen normalen Zustand anzeigt. <code translate="no">created_on</code> ist die Erstellungszeit. <code translate="no">flag</code> ist das für interne Zwecke reservierte Flag.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>Die folgende Tabelle zeigt die Feldtypen und Beschreibungen der Felder in <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>Die Tabellenpartitionierung ist in 0.6.0 mit einigen neuen Feldern aktiviert, darunter <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> und <code translate="no">version</code>. Eine Vektortabelle, <code translate="no">table_1</code>, hat eine Partition namens <code translate="no">table_1_p1</code>, die ebenfalls eine Vektortabelle ist. <code translate="no">partition_name</code> entspricht <code translate="no">table_id</code>. Die Felder in einer Partitionstabelle werden von <code translate="no">owner table</code> geerbt, wobei das Feld owner table den Namen der Eigentümertabelle und das Feld <code translate="no">partition_tag</code> das Tag der Partition angibt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>Die folgende Tabelle zeigt die neuen Felder in 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Felder in der Tabelle TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Das folgende Beispiel enthält zwei Dateien, die beide zu der Vektortabelle <code translate="no">table_1</code> gehören. Der Indextyp (<code translate="no">engine_type</code>) der ersten Datei ist 1 (FLAT); der Dateistatus (<code translate="no">file_type</code>) ist 7 (Backup der Originaldatei); <code translate="no">file_size</code> ist 411200113 bytes; die Anzahl der Vektorzeilen ist 200.000. Der Indextyp der zweiten Datei ist 2 (IVFLAT); der Dateistatus ist 3 (Indexdatei). Die zweite Datei ist eigentlich der Index der ersten Datei. Weitere Informationen werden wir in den nächsten Artikeln vorstellen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-bild-3.png</span> </span></p>
<p>Die folgende Tabelle zeigt die Felder und Beschreibungen von <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Der nächste Artikel wird Ihnen zeigen, wie Sie SQLite zur Verwaltung von Metadaten in Milvus verwenden können. Bleiben Sie dran!</p>
<p>Wenn Sie Fragen haben, können Sie gerne unserem <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack-Kanal</a>beitreten <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">oder</a>eine Meldung im Repo machen.</p>
<p>GitHub-Repositorium: https://github.com/milvus-io/milvus</p>
