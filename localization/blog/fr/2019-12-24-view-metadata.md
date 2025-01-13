---
id: 2019-12-24-view-metadata.md
title: Milvus Metadata Management (1) Comment visualiser les métadonnées ?
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  Milvus prend en charge le stockage des métadonnées dans SQLite ou MySQL. Ce
  billet présente comment visualiser les métadonnées avec SQLite et MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Gestion des métadonnées Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Comment visualiser les métadonnées<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Auteur : Yihua Mo</p>
<p>Date : 2019-12-24</p>
</blockquote>
<p>Nous avons présenté quelques informations sur les métadonnées dans <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestion des données dans le moteur de recherche vectorielle à grande échelle.</a> Cet article montre principalement comment afficher les métadonnées de Milvus.</p>
<p>Milvus prend en charge le stockage des métadonnées dans SQLite ou MySQL. Il existe un paramètre <code translate="no">backend_url</code> (dans le fichier de configuration <code translate="no">server_config.yaml</code>) qui vous permet de spécifier si vous souhaitez utiliser SQLite ou MySQL pour gérer vos métadonnées.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Si SQLite est utilisé, un fichier <code translate="no">meta.sqlite</code> sera généré dans le répertoire de données (défini dans <code translate="no">primary_path</code> du fichier de configuration <code translate="no">server_config.yaml</code>) après le démarrage de Milvus. Pour visualiser le fichier, il suffit d'installer un client SQLite.</p>
<p>Installer SQLite3 à partir de la ligne de commande :</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Entrez ensuite dans le répertoire de données de Milvus et ouvrez le fichier méta à l'aide de SQLite3 :</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Vous êtes déjà entré dans la ligne de commande du client SQLite. Il vous suffit d'utiliser quelques commandes pour voir ce que contiennent les métadonnées.</p>
<p>Pour que les résultats imprimés soient plus faciles à lire :</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pour interroger les tables et les TableFiles à l'aide d'instructions SQL (insensibles à la casse) :</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Si vous utilisez MySQL, vous devez spécifier l'adresse du service MySQL à l'adresse <code translate="no">backend_url</code> du fichier de configuration <code translate="no">server_config.yaml</code>.</p>
<p>Par exemple, les paramètres suivants indiquent que le service MySQL est déployé localement, avec le port "3306", le nom d'utilisateur "root", le mot de passe "123456" et le nom de la base de données "milvus" :</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Tout d'abord, installer le client MySQL :</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Après le démarrage de Milvus, deux tables (Tables et TableFiles) seront créées dans le service MySQL spécifié par <code translate="no">backend_url</code>.</p>
<p>Utilisez la commande suivante pour vous connecter au service MySQL :</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez maintenant utiliser des instructions SQL pour interroger les informations sur les métadonnées :</p>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestion des données dans un moteur de recherche vectorielle à grande échelle</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestion des métadonnées Milvus (2) : Champs de la table des métadonnées</a></li>
</ul>
