---
id: 2019-12-27-meta-table.md
title: Gestione dei metadati Milvus (2) Campi nella tabella dei metadati
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Scopri il dettaglio dei campi delle tabelle di metadati in Milvus.
cover: null
tag: Engineering
---
<custom-h1>Gestione dei metadati Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Campi nella tabella dei metadati<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>Autore: Yihua Mo</p>
<p>Data: 2019-12-27</p>
</blockquote>
<p>Nell'ultimo blog abbiamo parlato di come visualizzare i metadati utilizzando MySQL o SQLite. Questo articolo intende presentare in dettaglio i campi delle tabelle dei metadati.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Campi della tabella &quot;<code translate="no">Tables</code></h3><p>Prendiamo come esempio SQLite. Il seguente risultato proviene dalla versione 0.5.0. Nella versione 0.6.0 sono stati aggiunti alcuni campi, che verranno introdotti in seguito. C'è una riga in <code translate="no">Tables</code> che specifica una tabella vettoriale a 512 dimensioni con il nome <code translate="no">table_1</code>. Quando la tabella viene creata, <code translate="no">index_file_size</code> è 1024 MB, <code translate="no">engine_type</code> è 1 (FLAT), <code translate="no">nlist</code> è 16384, <code translate="no">metric_type</code> è 1 (distanza euclidea L2). <code translate="no">id</code> è l'identificatore univoco della tabella. <code translate="no">state</code> è lo stato della tabella, con 0 che indica uno stato normale. <code translate="no">created_on</code> è il tempo di creazione. <code translate="no">flag</code> è il flag riservato per uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>tabelle</span> </span></p>
<p>La tabella seguente mostra i tipi di campo e le descrizioni dei campi di <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Nome del campo</th><th style="text-align:left">Tipo di dati</th><th style="text-align:left">Descrizione</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificatore univoco della tabella vettoriale. <code translate="no">id</code> si incrementa automaticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Nome della tabella vettoriale. <code translate="no">table_id</code> deve essere definito dall'utente e seguire le linee guida sui nomi dei file di Linux.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Stato della tabella vettoriale. 0 significa normale e 1 significa cancellata (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Dimensione vettoriale della tabella vettoriale. Deve essere definita dall'utente.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Numero di millisecondi dal 1° gennaio 1970 al momento della creazione della tabella.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Flag per uso interno, ad esempio se l'id del vettore è definito dall'utente. Il valore predefinito è 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Se la dimensione di un file di dati raggiunge <code translate="no">index_file_size</code>, il file non viene combinato e viene usato per costruire gli indici. L'impostazione predefinita è 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo di indice da costruire per una tabella vettoriale. Il valore predefinito è 0, che indica un indice non valido. 1 specifica FLAT. 2 specifica IVFLAT. 3 specifica IVFSQ8. 4 specifica NSG. 5 specifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Numero di cluster in cui vengono suddivisi i vettori di ciascun file di dati durante la creazione dell'indice. Il valore predefinito è 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Metodo per calcolare la distanza dei vettori. 1 specifica la distanza euclidea (L1) e 2 il prodotto interno.</td></tr>
</tbody>
</table>
<p>Il partizionamento delle tabelle è abilitato nella 0.6.0 con alcuni nuovi campi, tra cui <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> e <code translate="no">version</code>. Una tabella vettoriale, <code translate="no">table_1</code>, ha una partizione chiamata <code translate="no">table_1_p1</code>, che è anch'essa una tabella vettoriale. <code translate="no">partition_name</code> corrisponde a <code translate="no">table_id</code>. I campi di una tabella di partizione sono ereditati dalla tabella proprietaria, con il campo <code translate="no">owner table</code> che specifica il nome della tabella proprietaria e il campo <code translate="no">partition_tag</code> che specifica il tag della partizione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tabelle_nuove</span> </span></p>
<p>La seguente tabella mostra i nuovi campi della versione 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Nome del campo</th><th style="text-align:left">Tipo di dati</th><th style="text-align:left">Descrizione</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Tabella madre della partizione.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Tag della partizione. Non deve essere una stringa vuota.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Versione di Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campi della tabella "<code translate="no">TableFiles&quot;</code> </h3><p>L'esempio seguente contiene due file che appartengono entrambi alla tabella vettoriale <code translate="no">table_1</code>. Il tipo di indice (<code translate="no">engine_type</code>) del primo file è 1 (FLAT); lo stato del file (<code translate="no">file_type</code>) è 7 (backup del file originale); <code translate="no">file_size</code> è 411200113 byte; il numero di righe del vettore è 200.000. Il tipo di indice del secondo file è 2 (IVFLAT); lo stato del file è 3 (file di indice). Il secondo file è in realtà l'indice del primo file. Ulteriori informazioni verranno fornite nei prossimi articoli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>file di tabella</span> </span></p>
<p>La tabella seguente mostra i campi e le descrizioni di <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Nome del campo</th><th style="text-align:left">Tipo di dati</th><th style="text-align:left">Descrizione</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificatore univoco di una tabella vettoriale. <code translate="no">id</code> si incrementa automaticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Nome della tabella vettoriale.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo di indice da costruire per una tabella vettoriale. Il valore predefinito è 0, che indica un indice non valido. 1 specifica FLAT. 2 specifica IVFLAT. 3 specifica IVFSQ8. 4 specifica NSG. 5 specifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">stringa</td><td style="text-align:left">Nome del file generato dal tempo di creazione del file. È uguale a 1000 moltiplicato per il numero di millisecondi dal 1° gennaio 1970 al momento della creazione della tabella.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Stato del file. 0 specifica un file di dati vettoriali grezzi appena generato. 1 specifica un file di dati vettoriali grezzi. 2 specifica che verrà creato un indice per il file. 3 specifica che il file è un file di indice. 4 specifica che il file verrà cancellato (soft delete). 5 specifica che il file è di nuova generazione e viene utilizzato per memorizzare i dati della combinazione. 6 specifica che il file è di nuova generazione e viene utilizzato per memorizzare i dati di indice. 7 specifica lo stato di backup del file di dati vettoriali grezzi.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Dimensione del file in byte.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Numero di vettori in un file.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Timestamp per l'ultimo tempo di aggiornamento, che specifica il numero di millisecondi dal 1° gennaio 1970 al momento della creazione della tabella.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Numero di millisecondi dal 1° gennaio 1970 al momento della creazione della tabella.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Data di creazione della tabella. È ancora presente per motivi storici e sarà rimosso nelle versioni future.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Blog correlati<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestione dei dati in un motore di ricerca vettoriale su larga scala</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestione dei metadati Milvus (1): Come visualizzare i metadati</a></li>
</ul>
