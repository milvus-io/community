---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Informazioni su come visualizzare i metadati nel database vettoriale Milvus.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Gestione dei metadati Milvus (1)</custom-h1><p>Abbiamo introdotto alcune informazioni sui metadati in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestione dei dati nel motore di ricerca vettoriale su larga scala</a>. Questo articolo mostra principalmente come visualizzare i metadati di Milvus.</p>
<p>Milvus supporta la memorizzazione dei metadati in SQLite o MySQL. Esiste un parametro <code translate="no">backend_url</code> (nel file di configurazione <code translate="no">server_config.yaml</code>) con il quale è possibile specificare se utilizzare SQLite o MySQL per gestire i metadati.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>Se si utilizza SQLite, dopo l'avvio di Milvus viene generato un file <code translate="no">meta.sqlite</code> nella directory dei dati (definita nel file di configurazione <code translate="no">primary_path</code> <code translate="no">server_config.yaml</code> ). Per visualizzare il file, è sufficiente installare un client SQLite.</p>
<p>Installare SQLite3 dalla riga di comando:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Quindi entrare nella directory dei dati di Milvus e aprire il metafile con SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Ora si è già entrati nella riga di comando del client SQLite. Basta usare alcuni comandi per vedere cosa c'è nei metadati.</p>
<p>Per facilitare la lettura dei risultati stampati:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Per interrogare tabelle e file di tabelle utilizzando istruzioni SQL (senza distinzione tra maiuscole e minuscole):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-use-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>Se si utilizza MySQL, è necessario specificare l'indirizzo del servizio MySQL nel file <code translate="no">backend_url</code> del file di configurazione <code translate="no">server_config.yaml</code>.</p>
<p>Ad esempio, le seguenti impostazioni indicano che il servizio MySQL è distribuito localmente, con porta '3306', nome utente 'root', password '123456' e nome database 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Prima di tutto, installare il client MySQL:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Dopo l'avvio di Milvus, verranno create due tabelle (Tables e TableFiles) nel servizio MySQL specificato da <code translate="no">backend_url</code>.</p>
<p>Utilizzare il seguente comando per connettersi al servizio MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Ora è possibile utilizzare le istruzioni SQL per interrogare le informazioni sui metadati:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
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
    </button></h2><p>I prossimi articoli introdurranno in dettaglio lo schema delle tabelle dei metadati. Restate sintonizzati!</p>
<p>Per qualsiasi domanda, potete unirvi al nostro <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canale Slack</a> o segnalare un problema nel repo.</p>
<p>Repository GitHub: https://github.com/milvus-io/milvus</p>
<p>Se questo articolo vi è piaciuto o vi è stato utile, non dimenticate di applaudire!</p>
