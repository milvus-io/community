---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: >-
  Apprendre à visualiser les métadonnées dans la base de données vectorielles
  Milvus.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Gestion des métadonnées Milvus (1)</custom-h1><p>Nous avons présenté quelques informations sur les métadonnées dans <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vector Search Engine (Gestion des données dans un moteur de recherche vectorielle à grande échelle)</a>. Cet article montre principalement comment afficher les métadonnées de Milvus.</p>
<p>Milvus prend en charge le stockage des métadonnées dans SQLite ou MySQL. Il existe un paramètre <code translate="no">backend_url</code> (dans le fichier de configuration <code translate="no">server_config.yaml</code>) qui vous permet de spécifier si vous souhaitez utiliser SQLite ou MySQL pour gérer vos métadonnées.</p>
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
    </button></h2><p>Si SQLite est utilisé, un fichier <code translate="no">meta.sqlite</code> sera généré dans le répertoire de données (défini dans <code translate="no">primary_path</code> du fichier de configuration <code translate="no">server_config.yaml</code>) après le démarrage de Milvus. Pour visualiser le fichier, il suffit d'installer un client SQLite.</p>
<p>Installer SQLite3 à partir de la ligne de commande :</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Entrez ensuite dans le répertoire de données de Milvus et ouvrez le fichier méta à l'aide de SQLite3 :</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Vous êtes déjà entré dans la ligne de commande du client SQLite. Il vous suffit d'utiliser quelques commandes pour voir ce que contiennent les métadonnées.</p>
<p>Pour que les résultats imprimés soient plus faciles à lire :</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Pour interroger les tables et les TableFiles à l'aide d'instructions SQL (insensibles à la casse) :</p>
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
    </button></h2><p>Si vous utilisez MySQL, vous devez spécifier l'adresse du service MySQL à l'adresse <code translate="no">backend_url</code> du fichier de configuration <code translate="no">server_config.yaml</code>.</p>
<p>Par exemple, les paramètres suivants indiquent que le service MySQL est déployé localement, avec le port "3306", le nom d'utilisateur "root", le mot de passe "123456" et le nom de la base de données "milvus" :</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Tout d'abord, installez le client MySQL :</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Après le démarrage de Milvus, deux tables (Tables et TableFiles) seront créées dans le service MySQL spécifié par <code translate="no">backend_url</code>.</p>
<p>Utilisez la commande suivante pour vous connecter au service MySQL :</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Vous pouvez maintenant utiliser des instructions SQL pour interroger les informations sur les métadonnées :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Prochaines étapes<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Les prochains articles présenteront en détail le schéma des tables de métadonnées. Restez à l'écoute !</p>
<p>Si vous avez des questions, n'hésitez pas à rejoindre notre <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal Slack</a> ou à déposer un problème dans le repo.</p>
<p>Dépôt GitHub : https://github.com/milvus-io/milvus</p>
<p>Si vous aimez cet article ou si vous le trouvez utile, n'oubliez pas d'applaudir !</p>
