---
id: 2019-12-24-view-metadata.md
title: Gestione dei metadati Milvus (1) Come visualizzare i metadati
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus supporta la memorizzazione dei metadati in SQLite o MySQL. Questo post
  spiega come visualizzare i metadati con SQLite e MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Gestione dei metadati Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Come visualizzare i metadati<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Data: 2019-12-24</p>
</blockquote>
<p>Abbiamo introdotto alcune informazioni sui metadati in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestione dei dati nel motore di ricerca vettoriale su larga scala</a>. Questo articolo mostra principalmente come visualizzare i metadati di Milvus.</p>
<p>Milvus supporta la memorizzazione dei metadati in SQLite o MySQL. Esiste un parametro <code translate="no">backend_url</code> (nel file di configurazione <code translate="no">server_config.yaml</code>) con il quale è possibile specificare se utilizzare SQLite o MySQL per gestire i metadati.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Se si utilizza SQLite, dopo l'avvio di Milvus viene generato un file <code translate="no">meta.sqlite</code> nella directory dei dati (definita nel file di configurazione <code translate="no">primary_path</code> <code translate="no">server_config.yaml</code> ). Per visualizzare il file, è sufficiente installare un client SQLite.</p>
<p>Installare SQLite3 dalla riga di comando:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Quindi entrare nella directory dei dati di Milvus e aprire il metafile con SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Ora si è già entrati nella riga di comando del client SQLite. Basta usare alcuni comandi per vedere cosa c'è nei metadati.</p>
<p>Per facilitare la lettura dei risultati stampati:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Per interrogare tabelle e file di tabelle utilizzando istruzioni SQL (senza distinzione tra maiuscole e minuscole):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Se si utilizza MySQL, è necessario specificare l'indirizzo del servizio MySQL nel file di configurazione <code translate="no">backend_url</code> <code translate="no">server_config.yaml</code> .</p>
<p>Ad esempio, le seguenti impostazioni indicano che il servizio MySQL è distribuito localmente, con porta '3306', nome utente 'root', password '123456' e nome database 'milvus':</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Prima di tutto, installare il client MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Dopo l'avvio di Milvus, verranno create due tabelle (Tables e TableFiles) nel servizio MySQL specificato da <code translate="no">backend_url</code>.</p>
<p>Utilizzare il seguente comando per connettersi al servizio MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>A questo punto, è possibile utilizzare le istruzioni SQL per interrogare le informazioni sui metadati:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">相关博客<button data-href="#相关博客" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestione dei dati in un motore di ricerca vettoriale su scala massiva</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestione dei metadati Milvus (2): Campi della tabella dei metadati</a></li>
</ul>
