---
id: managing-metadata-in-milvus-2.md
title: Campi della tabella Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Campi della tabella dei metadati
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Gestione dei metadati Milvus (2)</custom-h1><p>Nell'ultimo blog abbiamo accennato a come visualizzare i metadati utilizzando MySQL o SQLite. Questo articolo intende presentare in dettaglio i campi delle tabelle dei metadati.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Campi della tabella <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Prendiamo come esempio SQLite. Il seguente risultato proviene dalla versione 0.5.0. Nella versione 0.6.0 sono stati aggiunti alcuni campi, che verranno introdotti in seguito. C'è una riga in <code translate="no">Tables</code> che specifica una tabella vettoriale a 512 dimensioni con il nome &lt;codetable_1</code>. Quando la tabella viene creata, <code translate="no">index_file_size</code> è 1024 MB, <code translate="no">engine_type</code> è 1 (FLAT), <code translate="no">nlist</code> è 16384, <code translate="no">metric_type</code> è 1 (distanza euclidea L2). id è l'identificatore univoco della tabella. <code translate="no">state</code> è lo stato della tabella, con 0 che indica uno stato normale. <code translate="no">created_on</code> è il tempo di creazione. <code translate="no">flag</code> è il flag riservato per uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-immagine-1.png</span> </span></p>
<p>La tabella seguente mostra i tipi di campo e le descrizioni dei campi in <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-tipi di campo-descrizioni-milvus-metadata.png</span> </span></p>
<p>Il partizionamento delle tabelle è abilitato nella 0.6.0 con alcuni nuovi campi, tra cui <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> e <code translate="no">version</code>. Una tabella vettoriale, <code translate="no">table_1</code>, ha una partizione chiamata <code translate="no">table_1_p1</code>, anch'essa una tabella vettoriale. <code translate="no">partition_name</code> corrisponde a <code translate="no">table_id</code>. I campi di una tabella di partizione sono ereditati da <code translate="no">owner table</code>, con il campo owner table che specifica il nome della tabella proprietaria e il campo <code translate="no">partition_tag</code> che specifica il tag della partizione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-immagine-2.png</span> </span></p>
<p>La tabella seguente mostra i nuovi campi della 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-nuovi-campi-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campi nella tabella TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>L'esempio seguente contiene due file che appartengono entrambi alla tabella vettoriale <code translate="no">table_1</code>. Il tipo di indice (<code translate="no">engine_type</code>) del primo file è 1 (FLAT); lo stato del file (<code translate="no">file_type</code>) è 7 (backup del file originale); <code translate="no">file_size</code> è 411200113 byte; il numero di righe vettoriali è 200.000. Il tipo di indice del secondo file è 2 (IVFLAT); lo stato del file è 3 (file di indice). Il secondo file è in realtà l'indice del primo file. Ulteriori informazioni verranno fornite nei prossimi articoli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-immagine-3.png</span> </span></p>
<p>La tabella seguente mostra i campi e le descrizioni di <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Il prossimo articolo<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Il prossimo articolo vi mostrerà come utilizzare SQLite per gestire i metadati in Milvus. Restate sintonizzati!</p>
<p>Per qualsiasi domanda, potete unirvi al nostro <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canale Slack o</a>segnalare un problema nel repo.</p>
<p>Repository GitHub: https://github.com/milvus-io/milvus</p>
