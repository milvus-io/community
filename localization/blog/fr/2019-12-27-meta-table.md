---
id: 2019-12-27-meta-table.md
title: Gestion des métadonnées Milvus (2) Champs de la table des métadonnées
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: >-
  En savoir plus sur le détail des champs dans les tables de métadonnées dans
  Milvus.
cover: null
tag: Engineering
---
<custom-h1>Gestion des métadonnées Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Champs dans la table des métadonnées<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
<p>Date : 2019-12-27</p>
</blockquote>
<p>Dans le dernier blog, nous avons mentionné comment afficher vos métadonnées à l'aide de MySQL ou de SQLite. Cet article vise principalement à présenter en détail les champs des tables de métadonnées.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Champs de la table &quot;<code translate="no">Tables</code></h3><p>Prenons l'exemple de SQLite. Le résultat suivant provient de la version 0.5.0. Certains champs ont été ajoutés à la version 0.6.0 et seront présentés ultérieurement. Il y a une ligne dans <code translate="no">Tables</code> qui spécifie une table vectorielle de 512 dimensions avec le nom <code translate="no">table_1</code>. Lors de la création de la table, <code translate="no">index_file_size</code> vaut 1024 Mo, <code translate="no">engine_type</code> vaut 1 (FLAT), <code translate="no">nlist</code> vaut 16384, <code translate="no">metric_type</code> vaut 1 (distance euclidienne L2). <code translate="no">id</code> est l'identifiant unique de la table. <code translate="no">state</code> est l'état de la table, 0 indiquant un état normal. <code translate="no">created_on</code> est l'heure de création. <code translate="no">flag</code> est l'indicateur réservé à un usage interne.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>tables</span> </span></p>
<p>Le tableau suivant indique les types de champs et les descriptions des champs de <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Nom du champ</th><th style="text-align:left">Type de données</th><th style="text-align:left">Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identifiant unique de la table vectorielle. <code translate="no">id</code> s'incrémente automatiquement.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nom de la table vectorielle. <code translate="no">table_id</code> doit être défini par l'utilisateur et respecter les directives Linux relatives aux noms de fichiers.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">État de la table vectorielle. 0 signifie normal et 1 signifie supprimé (soft delete).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Dimension du tableau vectoriel. Doit être définie par l'utilisateur.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Nombre de millisecondes entre le 1er janvier 1970 et le moment où la table est créée.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Indicateur à usage interne, indiquant par exemple si l'identifiant du vecteur est défini par l'utilisateur. La valeur par défaut est 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Si la taille d'un fichier de données atteint <code translate="no">index_file_size</code>, le fichier n'est pas combiné et est utilisé pour construire des index. La valeur par défaut est 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Type d'index à construire pour une table vectorielle. La valeur par défaut est 0, ce qui signifie que l'index n'est pas valide. 1 spécifie FLAT. 2 spécifie IVFLAT. 3 spécifie IVFSQ8. 4 spécifie NSG. 5 spécifie IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Nombre de grappes dans lesquelles les vecteurs de chaque fichier de données sont divisés lors de la construction de l'index. La valeur par défaut est 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Méthode de calcul de la distance entre les vecteurs. 1 spécifie la distance euclidienne (L1) et 2 spécifie le produit intérieur.</td></tr>
</tbody>
</table>
<p>Le partitionnement des tables est activé dans la version 0.6.0 avec quelques nouveaux champs, dont <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> et <code translate="no">version</code>. Une table vectorielle, <code translate="no">table_1</code>, possède une partition appelée <code translate="no">table_1_p1</code>, qui est également une table vectorielle. <code translate="no">partition_name</code> correspond à <code translate="no">table_id</code>. Les champs d'une table de partition sont hérités de la table propriétaire, le champ <code translate="no">owner table</code> spécifiant le nom de la table propriétaire et le champ <code translate="no">partition_tag</code> spécifiant l'étiquette de la partition.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tables_new</span> </span></p>
<p>Le tableau suivant présente les nouveaux champs de la version 0.6.0 :</p>
<table>
<thead>
<tr><th style="text-align:left">Nom du champ</th><th style="text-align:left">Type de données</th><th style="text-align:left">Type de données Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string (chaîne de caractères)</td><td style="text-align:left">Table parent de la partition.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">chaîne</td><td style="text-align:left">Étiquette de la partition. Ne doit pas être une chaîne vide.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">chaîne</td><td style="text-align:left">Version de Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Champs de la table "<code translate="no">TableFiles&quot;</code> </h3><p>L'exemple suivant contient deux fichiers appartenant tous deux à la table vectorielle <code translate="no">table_1</code>. Le type d'index (<code translate="no">engine_type</code>) du premier fichier est 1 (FLAT) ; l'état du fichier (<code translate="no">file_type</code>) est 7 (sauvegarde du fichier original) ; <code translate="no">file_size</code> est 411200113 octets ; le nombre de lignes du vecteur est 200 000. Le type d'index du deuxième fichier est 2 (IVFLAT) ; l'état du fichier est 3 (fichier d'index). Le deuxième fichier est en fait l'index du premier fichier. Nous présenterons plus d'informations dans les prochains articles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>fichiers de table</span> </span></p>
<p>Le tableau suivant présente les champs et les descriptions de <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Nom du champ</th><th style="text-align:left">Type de données</th><th style="text-align:left">Description</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identifiant unique d'une table vectorielle. <code translate="no">id</code> s'incrémente automatiquement.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nom de la table vectorielle.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Type d'index à construire pour une table vectorielle. La valeur par défaut est 0, ce qui signifie que l'index n'est pas valide. 1 spécifie FLAT. 2 spécifie IVFLAT. 3 spécifie IVFSQ8. 4 spécifie NSG. 5 spécifie IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">chaîne</td><td style="text-align:left">Nom de fichier généré à partir de l'heure de création du fichier. Egal à 1000 multiplié par le nombre de millisecondes entre le 1er janvier 1970 et l'heure de création de la table.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">État du fichier. 0 indique un fichier de données vectorielles brutes nouvellement généré. 1 spécifie un fichier de données vectorielles brutes. 2 indique qu'un index sera créé pour le fichier. 3 indique que le fichier est un fichier d'index. 4 indique que le fichier sera supprimé (suppression douce). 5 spécifie que le fichier est nouvellement généré et utilisé pour stocker les données de combinaison. 6 indique que le fichier est nouvellement créé et utilisé pour stocker des données d'index. 7 indique l'état de la sauvegarde du fichier de données vectorielles brutes.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Taille du fichier en octets.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Nombre de vecteurs dans un fichier.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Horodatage de la dernière heure de mise à jour, qui spécifie le nombre de millisecondes entre le 1er janvier 1970 et l'heure de création de la table.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Nombre de millisecondes entre le 1er janvier 1970 et la date de création du tableau.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Date de création de la table. Elle est encore présente pour des raisons historiques et sera supprimée dans les versions futures.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Blogs associés<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestion des métadonnées Milvus (1) : Comment visualiser les métadonnées</a></li>
</ul>
