---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: 'Erfahren Sie, wie Sie Metadaten in der Milvus-Vektordatenbank anzeigen können.'
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Milvus-Metadatenverwaltung (1)</custom-h1><p>Wir haben einige Informationen über Metadaten in <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine</a> vorgestellt. Dieser Artikel zeigt hauptsächlich, wie man die Metadaten von Milvus anzeigt.</p>
<p>Milvus unterstützt die Speicherung von Metadaten in SQLite oder MySQL. Es gibt einen Parameter <code translate="no">backend_url</code> (in der Konfigurationsdatei <code translate="no">server_config.yaml</code>), mit dem Sie angeben können, ob Sie SQLite oder MySQL für die Verwaltung Ihrer Metadaten verwenden möchten.</p>
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
    </button></h2><p>Wenn SQLite verwendet wird, wird nach dem Start von Milvus eine Datei <code translate="no">meta.sqlite</code> im Datenverzeichnis (definiert in <code translate="no">primary_path</code> der Konfigurationsdatei <code translate="no">server_config.yaml</code>) erzeugt. Um die Datei einzusehen, müssen Sie lediglich einen SQLite-Client installieren.</p>
<p>Installieren Sie SQLite3 über die Kommandozeile:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Geben Sie dann das Datenverzeichnis von Milvus ein und öffnen Sie die Metadatei mit SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Jetzt haben Sie bereits die Befehlszeile des SQLite-Clients eingegeben. Verwenden Sie einfach einige Befehle, um zu sehen, was in den Metadaten steht.</p>
<p>Damit die gedruckten Ergebnisse für Menschen leichter lesbar sind, wird ein Satz verwendet:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Um Tabellen und TableFiles mit SQL-Anweisungen abzufragen (Groß- und Kleinschreibung wird nicht berücksichtigt):</p>
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
    </button></h2><p>Wenn Sie MySQL verwenden, müssen Sie die Adresse des MySQL-Dienstes in der <code translate="no">backend_url</code> der Konfigurationsdatei <code translate="no">server_config.yaml</code> angeben.</p>
<p>Die folgenden Einstellungen zeigen zum Beispiel, dass der MySQL-Dienst lokal eingesetzt wird, mit Port "3306", Benutzername "root", Passwort "123456" und Datenbankname "milvus":</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Installieren Sie zunächst den MySQL-Client:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Nach dem Start von Milvus werden zwei Tabellen (Tables und TableFiles) in dem durch <code translate="no">backend_url</code> angegebenen MySQL-Dienst erstellt.</p>
<p>Verwenden Sie den folgenden Befehl, um sich mit dem MySQL-Dienst zu verbinden:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Nun können Sie SQL-Anweisungen verwenden, um Metadateninformationen abzufragen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-meine-sql-ansicht-meta-daten.png</span> </span></p>
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
    </button></h2><p>In den nächsten Artikeln wird das Schema der Metadaten-Tabellen im Detail vorgestellt. Bleiben Sie dran!</p>
<p>Wenn Sie Fragen haben, können Sie gerne unserem <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack-Kanal</a> beitreten oder ein Problem im Repo einreichen.</p>
<p>GitHub Repo: https://github.com/milvus-io/milvus</p>
<p>Wenn Ihnen dieser Artikel gefällt oder Sie ihn nützlich finden, vergessen Sie nicht zu klatschen!</p>
