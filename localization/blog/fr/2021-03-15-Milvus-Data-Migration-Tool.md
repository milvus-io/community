---
id: Milvus-Data-Migration-Tool.md
title: Présentation de l'outil de migration de données Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Découvrez comment utiliser l'outil de migration de données Milvus pour
  améliorer considérablement l'efficacité de la gestion des données et réduire
  les coûts DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Présentation de l'outil de migration de données Milvus</custom-h1><p><em><strong>Note importante</strong>: L'outil de migration de données Mivus est obsolète. Pour la migration des données d'autres bases de données vers Milvus, nous vous recommandons d'utiliser l'outil de migration Milvus, plus avancé.</em></p>
<p>L'outil de migration Milvus prend actuellement en charge :</p>
<ul>
<li>Elasticsearch vers Milvus 2.x</li>
<li>Faiss vers Milvus 2.x</li>
<li>Milvus 1.x vers Milvus 2.x</li>
<li>Milvus 2.3.x vers Milvus 2.3.x ou supérieur</li>
</ul>
<p>Nous prendrons en charge la migration à partir d'autres sources de données vectorielles telles que Pinecone, Chroma et Qdrant. Restez à l'écoute.</p>
<p><strong>Pour plus d'informations, consultez la <a href="https://milvus.io/docs/migrate_overview.md">documentation Milvus-migration</a> ou son <a href="https://github.com/zilliztech/milvus-migration">dépôt GitHub</a>.</strong></p>
<p>--------------------------------- <strong>L'outil de migration de données Mivus est obsolète</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Vue d'ensemble</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) est un outil open-source conçu spécifiquement pour l'importation et l'exportation de fichiers de données avec Milvus. MilvusDM peut améliorer considérablement l'efficacité de la gestion des données et réduire les coûts DevOps de la manière suivante :</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss vers Milvus</a>: Importer des données décompressées de Faiss vers Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 vers Milvus</a>: importation de fichiers HDF5 vers Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus vers Mil</a>vus : Migration de données d'un Milvus source vers un Milvus cible différent.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus to HDF5</a>: Enregistrer des données dans Milvus en tant que fichiers HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 1.png</span> </span></p>
<p>MilvusDM est hébergé sur <a href="https://github.com/milvus-io/milvus-tools">Github</a> et peut être facilement installé en exécutant la ligne de commande <code translate="no">pip3 install pymilvusdm</code>. MilvusDM vous permet de migrer des données dans une collection ou une partition spécifique. Dans les sections suivantes, nous expliquerons comment utiliser chaque type de migration de données.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss vers Milvus</h3><h4 id="Steps" class="common-anchor-header">Etapes</h4><p>1 Télécharger <strong>F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. définir les paramètres suivants :</p>
<ul>
<li><p><code translate="no">data_path</code>: Chemin des données (vecteurs et leurs ID correspondants) dans Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Adresse du serveur Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port du serveur Milvus.</p></li>
<li><p><code translate="no">mode</code>: Les données peuvent être importées dans Milvus à l'aide des modes suivants :</p>
<ul>
<li><p>Ignorer : Ignorer les données si la collection ou la partition existe déjà.</p></li>
<li><p>Ajouter : Ajouter des données si la collection ou la partition existe déjà.</p></li>
<li><p>Écraser : Supprimer les données avant l'insertion si la collection ou la partition existe déjà.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nom de la collection réceptrice pour l'importation de données.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nom de la partition réceptrice pour l'importation de données.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informations spécifiques à la collection, telles que la dimension du vecteur, la taille du fichier d'index et la métrique de distance.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. exécutez <strong>F2M.yaml :</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Exemple de code</h4><p>1. lire les fichiers Faiss pour récupérer les vecteurs et leurs identifiants correspondants</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. insérer les données récupérées dans Milvus :</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 vers Milvus</h3><h4 id="Steps" class="common-anchor-header">Etapes</h4><p>1 Télécharger <strong>H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. définir les paramètres suivants :</p>
<ul>
<li><p><code translate="no">data_path</code>: Chemin d'accès aux fichiers HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Répertoire contenant les fichiers HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Adresse du serveur Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port du serveur Milvus.</p></li>
<li><p><code translate="no">mode</code>: Les données peuvent être importées dans Milvus à l'aide des modes suivants :</p>
<ul>
<li><p>Ignorer : Ignorer les données si la collection ou la partition existe déjà.</p></li>
<li><p>Ajouter : Ajouter des données si la collection ou la partition existe déjà.</p></li>
<li><p>Écraser : Supprimer les données avant l'insertion si la collection ou la partition existe déjà.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nom de la collection réceptrice pour l'importation de données.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nom de la partition réceptrice pour l'importation de données.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informations spécifiques à la collection, telles que la dimension du vecteur, la taille du fichier d'index et la métrique de distance.</p></li>
</ul>
<blockquote>
<p>Définissez <code translate="no">data_path</code> ou <code translate="no">data_dir</code>. Ne définissez <strong>pas</strong> les deux. Utilisez <code translate="no">data_path</code> pour spécifier plusieurs chemins d'accès aux fichiers ou <code translate="no">data_dir</code> pour spécifier le répertoire contenant votre fichier de données.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. exécutez <strong>H2M.yaml :</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Exemple de code</h4><p>1. lire les fichiers HDF5 pour récupérer les vecteurs et leurs identifiants correspondants</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2. insérer les données récupérées dans Milvus :</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus to Milvus</h3><h4 id="Steps" class="common-anchor-header">Étapes</h4><p>1 Télécharger <strong>M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. définir les paramètres suivants :</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Chemin de travail source Milvus.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Paramètres MySQL de Source Milvus. Si MySQL n'est pas utilisé, définissez le paramètre mysql_ comme ''.</p></li>
<li><p><code translate="no">source_collection</code>: Noms de la collection et de ses partitions dans la source Milvus.</p></li>
<li><p><code translate="no">dest_host</code>: L'adresse du serveur Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Port du serveur Milvus.</p></li>
<li><p><code translate="no">mode</code>: Les données peuvent être importées dans Milvus à l'aide des modes suivants :</p>
<ul>
<li><p>Ignorer : Ignorer les données si la collection ou la partition existe déjà.</p></li>
<li><p>Ajouter : Ajouter des données si la collection ou la partition existe déjà.</p></li>
<li><p>Écraser : Si la collection ou la partition existe déjà, supprimer les données avant de les insérer.supprimer les données avant l'insertion si la collection ou la partition existe déjà.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. exécuter <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Exemple de code</h4><p>1. en fonction des métadonnées d'une collection ou d'une partition spécifiée, lire les fichiers sous <strong>milvus/db</strong> sur votre disque local pour récupérer les vecteurs et leurs ID correspondants à partir de la source Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. insérer les données récupérées dans le Milvus cible.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">De Milvus à HDF5</h3><h4 id="Steps" class="common-anchor-header">Etapes</h4><p>1 Télécharger <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. définir les paramètres suivants :</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Source Milvus work path.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Source Milvus paramètres MySQL. Si MySQL n'est pas utilisé, définissez le paramètre mysql_ comme ''.</p></li>
<li><p><code translate="no">source_collection</code>: Noms de la collection et de ses partitions dans la source Milvus.</p></li>
<li><p><code translate="no">data_dir</code>: Répertoire pour contenir les fichiers HDF5 sauvegardés.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. exécuter <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Exemple de code</h4><p>1. en fonction des métadonnées d'une collection ou d'une partition spécifiée, lire les fichiers sous <strong>milvus/db</strong> sur votre disque local pour récupérer les vecteurs et leurs ID correspondants.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2. enregistrer les données récupérées sous forme de fichiers HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Structure du fichier MilvusDM</h3><p>L'organigramme ci-dessous montre comment MilvusDM exécute différentes tâches en fonction du fichier YAML qu'il reçoit :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Structure du fichier MilvusDM :</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>core</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Effectue des opérations client dans Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Lit les fichiers de données HDF5 sur votre disque local. (Ajoutez votre code ici pour prendre en charge la lecture de fichiers de données dans d'autres formats).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Lit les fichiers de données dans Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Lit les fichiers de données dans Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Lit les métadonnées dans Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Crée des collections ou des partitions en fonction des paramètres des fichiers YAML et importe les vecteurs et les ID de vecteurs correspondants dans Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Enregistre les données sous forme de fichiers HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Écrit les journaux pendant l'exécution.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Importe les données de Faiss dans Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Importe des données dans des fichiers HDF5 dans Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Fait migrer les données d'un Milvus source vers un Milvus cible.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Exporte les données dans Milvus et les enregistre en tant que fichiers HDF5.</p></li>
<li><p><strong>main.py</strong>: Exécute les tâches correspondantes en fonction du fichier YAML reçu.</p></li>
<li><p><strong>setting.py</strong>: Configurations relatives à l'exécution du code MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Crée les paquets de fichiers <strong>pymilvusdm</strong> et les télécharge sur PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Récapitulatif</h3><p>MilvusDM gère principalement la migration des données dans et hors de Milvus, ce qui inclut Faiss vers Milvus, HDF5 vers Milvus, Milvus vers Milvus, et Milvus vers HDF5.</p>
<p>Les fonctionnalités suivantes sont prévues pour les prochaines versions :</p>
<ul>
<li><p>Importation de données binaires de Faiss vers Milvus.</p></li>
<li><p>Blocklist et allowlist pour la migration des données entre la source Milvus et la cible Milvus.</p></li>
<li><p>Fusionner et importer les données de plusieurs collections ou partitions dans Milvus source dans une nouvelle collection dans Milvus cible.</p></li>
<li><p>Sauvegarde et récupération des données Milvus.</p></li>
</ul>
<p>Le projet MilvusDM est en open source sur <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Toutes les contributions au projet sont les bienvenues. Donnez-lui une étoile 🌟, et n'hésitez pas à déposer un <a href="https://github.com/milvus-io/milvus-tools/issues">problème</a> ou à soumettre votre propre code !</p>
