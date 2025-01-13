---
id: 2019-12-24-view-metadata.md
title: Milvus Metadatenverwaltung (1) Wie werden Metadaten angezeigt?
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus unterstützt die Speicherung von Metadaten in SQLite oder MySQL. In
  diesem Beitrag erfahren Sie, wie Sie Metadaten mit SQLite und MySQL anzeigen
  können.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Milvus Metadaten-Verwaltung (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Wie man Metadaten anzeigt<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Datum: 2019-12-24</p>
</blockquote>
<p>Wir haben einige Informationen über Metadaten in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a> vorgestellt. Dieser Artikel zeigt hauptsächlich, wie man die Metadaten von Milvus anzeigt.</p>
<p>Milvus unterstützt die Speicherung von Metadaten in SQLite oder MySQL. Es gibt einen Parameter <code translate="no">backend_url</code> (in der Konfigurationsdatei <code translate="no">server_config.yaml</code>), mit dem Sie angeben können, ob Sie SQLite oder MySQL zur Verwaltung Ihrer Metadaten verwenden möchten.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Wenn SQLite verwendet wird, wird nach dem Start von Milvus eine Datei <code translate="no">meta.sqlite</code> im Datenverzeichnis (definiert in <code translate="no">primary_path</code> der Konfigurationsdatei <code translate="no">server_config.yaml</code>) erzeugt. Um die Datei einzusehen, müssen Sie lediglich einen SQLite-Client installieren.</p>
<p>Installieren Sie SQLite3 über die Kommandozeile:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Geben Sie dann das Datenverzeichnis von Milvus ein und öffnen Sie die Metadatei mit SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Jetzt haben Sie bereits die Befehlszeile des SQLite-Clients eingegeben. Verwenden Sie einfach einige Befehle, um zu sehen, was in den Metadaten steht.</p>
<p>Damit die gedruckten Ergebnisse für Menschen leichter lesbar sind, wird ein Satz verwendet:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Um Tabellen und TableFiles mit SQL-Anweisungen abzufragen (Groß- und Kleinschreibung wird nicht berücksichtigt):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Wenn Sie MySQL verwenden, müssen Sie die Adresse des MySQL-Dienstes in der <code translate="no">backend_url</code> der Konfigurationsdatei <code translate="no">server_config.yaml</code> angeben.</p>
<p>Die folgenden Einstellungen bedeuten zum Beispiel, dass der MySQL-Dienst lokal eingesetzt wird, mit Port "3306", Benutzername "root", Passwort "123456" und Datenbankname "milvus":</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Zunächst muss der MySQL-Client installiert werden:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Nachdem Milvus gestartet wurde, werden zwei Tabellen (Tables und TableFiles) in dem von <code translate="no">backend_url</code> angegebenen MySQL-Dienst erstellt.</p>
<p>Verwenden Sie den folgenden Befehl, um sich mit dem MySQL-Dienst zu verbinden:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Nun können Sie SQL-Anweisungen verwenden, um Metadateninformationen abzufragen:</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Verwaltung von Daten in einer Vektorsuchmaschine in großem Maßstab</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus Metadaten-Verwaltung (2): Felder in der Metadatentabelle</a></li>
</ul>
