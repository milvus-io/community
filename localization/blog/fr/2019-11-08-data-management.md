---
id: 2019-11-08-data-management.md
title: Comment la gestion des données est effectuée dans Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Ce billet présente la stratégie de gestion des données dans Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Gestion des données dans un moteur de recherche vectorielle à grande échelle</custom-h1><blockquote>
<p>L'auteur : Yihua Mo</p>
<p>Date : 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Comment la gestion des données est effectuée dans Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout d'abord, quelques concepts de base de Milvus :</p>
<ul>
<li>Table : La table est un ensemble de données de vecteurs, chaque vecteur ayant un identifiant unique. Chaque vecteur et son ID représentent une ligne de la table. Tous les vecteurs d'un tableau doivent avoir les mêmes dimensions. Voici un exemple de tableau avec des vecteurs à 10 dimensions :</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>tableau</span> </span></p>
<ul>
<li>Index : La construction d'un index est le processus de regroupement des vecteurs par un certain algorithme, ce qui nécessite de l'espace disque supplémentaire. Certains types d'index nécessitent moins d'espace car ils simplifient et compriment les vecteurs, tandis que d'autres types nécessitent plus d'espace que les vecteurs bruts.</li>
</ul>
<p>Dans Milvus, les utilisateurs peuvent effectuer des tâches telles que la création d'une table, l'insertion de vecteurs, la construction d'index, la recherche de vecteurs, l'extraction d'informations de table, l'abandon de tables, la suppression de données partielles dans une table et la suppression d'index, etc.</p>
<p>Supposons que nous ayons 100 millions de vecteurs à 512 dimensions et que nous devions les insérer et les gérer dans Milvus pour une recherche vectorielle efficace.</p>
<p><strong>(1) Insertion de vecteurs</strong></p>
<p>Voyons comment les vecteurs sont insérés dans Milvus.</p>
<p>Chaque vecteur occupant 2 Ko d'espace, l'espace de stockage minimum pour 100 millions de vecteurs est d'environ 200 Go, ce qui rend irréaliste l'insertion en une seule fois de tous ces vecteurs. Il faut donc plusieurs fichiers de données au lieu d'un seul. La performance d'insertion est l'un des principaux indicateurs de performance. Milvus prend en charge l'insertion unique de centaines, voire de dizaines de milliers de vecteurs. Par exemple, l'insertion en une seule fois de 30 000 vecteurs à 512 dimensions ne prend généralement qu'une seconde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>insertion</span> </span></p>
<p>Toutes les insertions de vecteurs ne sont pas chargées sur le disque. Milvus réserve un tampon mutable dans la mémoire de l'unité centrale pour chaque table créée, où les données insérées peuvent être rapidement écrites. Lorsque les données du tampon mutable atteignent une certaine taille, cet espace est considéré comme immuable. Dans l'intervalle, un nouveau tampon mutable sera réservé. Les données de la mémoire tampon immuable sont écrites régulièrement sur le disque et la mémoire correspondante de l'unité centrale est libérée. Le mécanisme d'écriture régulière sur le disque est similaire à celui utilisé dans Elasticsearch, qui écrit les données en mémoire tampon sur le disque toutes les secondes. En outre, les utilisateurs qui connaissent LevelDB/RocksDB peuvent y voir une certaine ressemblance avec MemTable.</p>
<p>Les objectifs du mécanisme d'insertion de données sont les suivants</p>
<ul>
<li>L'insertion de données doit être efficace.</li>
<li>Les données insérées peuvent être utilisées instantanément.</li>
<li>Les fichiers de données ne doivent pas être trop fragmentés.</li>
</ul>
<p><strong>(2) Fichier de données brutes</strong></p>
<p>Lorsque les vecteurs sont écrits sur le disque, ils sont sauvegardés dans un fichier de données brutes contenant les vecteurs bruts. Comme indiqué précédemment, les vecteurs à grande échelle doivent être enregistrés et gérés dans plusieurs fichiers de données. La taille des données insérées varie : les utilisateurs peuvent insérer 10 vecteurs ou 1 million de vecteurs à la fois. Cependant, l'opération d'écriture sur le disque est exécutée une fois toutes les secondes. Des fichiers de données de tailles différentes sont donc générés.</p>
<p>Les fichiers de données fragmentés ne sont ni pratiques à gérer, ni faciles d'accès pour la recherche de vecteurs. Milvus fusionne constamment ces petits fichiers de données jusqu'à ce que la taille du fichier fusionné atteigne une taille donnée, par exemple 1 Go. Cette taille particulière peut être configurée dans le paramètre API <code translate="no">index_file_size</code> lors de la création de la table. Par conséquent, 100 millions de vecteurs à 512 dimensions seront distribués et enregistrés dans environ 200 fichiers de données.</p>
<p>Compte tenu des scénarios de calcul incrémentiel, dans lesquels les vecteurs sont insérés et recherchés simultanément, nous devons nous assurer qu'une fois les vecteurs écrits sur le disque, ils sont disponibles pour la recherche. Ainsi, avant que les petits fichiers de données ne soient fusionnés, il est possible d'y accéder et d'y effectuer des recherches. Une fois la fusion terminée, les petits fichiers de données seront supprimés et les nouveaux fichiers fusionnés seront utilisés pour la recherche.</p>
<p>Voici à quoi ressemblent les fichiers interrogés avant la fusion :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>Fichiers interrogés après la fusion :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) Fichier d'index</strong></p>
<p>La recherche basée sur le fichier de données brutes est une recherche par force brute qui compare les distances entre les vecteurs de la requête et les vecteurs d'origine, et calcule les k vecteurs les plus proches. La recherche par force brute est inefficace. L'efficacité de la recherche peut être grandement améliorée si la recherche est basée sur le fichier d'index où les vecteurs sont indexés. La création d'un index nécessite de l'espace disque supplémentaire et prend généralement beaucoup de temps.</p>
<p>Quelles sont donc les différences entre les fichiers de données brutes et les fichiers d'index ? Pour simplifier, le fichier de données brutes enregistre chaque vecteur avec son identifiant unique, tandis que le fichier d'index enregistre les résultats du regroupement des vecteurs, tels que le type d'index, les centroïdes des regroupements et les vecteurs de chaque regroupement.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>fichier d'index</span> </span></p>
<p>En général, le fichier d'index contient plus d'informations que le fichier de données brutes, mais la taille des fichiers est beaucoup plus petite car les vecteurs sont simplifiés et quantifiés pendant le processus de construction de l'index (pour certains types d'index).</p>
<p>Les tables nouvellement créées font par défaut l'objet d'une recherche par calcul brut. Une fois l'index créé dans le système, Milvus construit automatiquement l'index pour les fichiers fusionnés dont la taille atteint 1 Go dans un thread autonome. Lorsque la construction de l'index est terminée, un nouveau fichier d'index est généré. Les fichiers de données brutes seront archivés pour la construction d'index basée sur d'autres types d'index.</p>
<p>Milvus construit automatiquement un index pour les fichiers qui atteignent 1 Go :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>La construction de l'index est terminée :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>L'index ne sera pas construit automatiquement pour les fichiers de données brutes qui n'atteignent pas 1 Go, ce qui peut ralentir la vitesse de recherche. Pour éviter cette situation, vous devez forcer manuellement la construction de l'index pour cette table.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcer la construction</span> </span></p>
<p>Après la construction forcée de l'index pour le fichier, les performances de recherche sont grandement améliorées.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Métadonnées</strong></p>
<p>Comme indiqué précédemment, 100 millions de vecteurs à 512 dimensions sont enregistrés dans 200 fichiers disque. Lorsque l'index est construit pour ces vecteurs, il y a 200 fichiers d'index supplémentaires, ce qui porte le nombre total de fichiers à 400 (y compris les fichiers de disque et les fichiers d'index). Un mécanisme efficace est nécessaire pour gérer les métadonnées (état des fichiers et autres informations) de ces fichiers afin de vérifier l'état des fichiers, de les supprimer ou de les créer.</p>
<p>L'utilisation de bases de données OLTP pour gérer ces informations est un bon choix. Milvus autonome utilise SQLite pour gérer les métadonnées, tandis que dans le cadre d'un déploiement distribué, Milvus utilise MySQL. Lorsque le serveur Milvus démarre, deux tables (à savoir "Tables" et "TableFiles") sont créées respectivement dans SQLite/MySQL. Tables" enregistre les informations relatives aux tables et "TableFiles" enregistre les informations relatives aux fichiers de données et aux fichiers d'index.</p>
<p>Comme le montre l'organigramme ci-dessous, "Tables" contient des métadonnées telles que le nom de la table (table_id), la dimension du vecteur (dimension), la date de création de la table (created_on), le statut de la table (state), le type d'index (engine_type), le nombre de grappes de vecteurs (nlist) et la méthode de calcul de la distance (metric_type).</p>
<p>TableFiles" contient le nom de la table à laquelle le fichier appartient (table_id), le type d'index du fichier (engine_type), le nom du fichier (file_id), le type de fichier (file_type), la taille du fichier (file_size), le nombre de lignes (row_count) et la date de création du fichier (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>métadonnées</span> </span></p>
<p>Ces métadonnées permettent d'effectuer diverses opérations. Voici quelques exemples :</p>
<ul>
<li>Pour créer une table, Meta Manager n'a besoin que d'exécuter une instruction SQL : <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Pour exécuter une recherche vectorielle sur la table_2, Meta Manager exécutera une requête dans SQLite/MySQL, qui est une instruction SQL de facto : <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> pour récupérer les informations sur les fichiers de la table_2. Ces fichiers seront ensuite chargés en mémoire par le planificateur de requêtes pour le calcul de la recherche.</li>
<li>Il n'est pas permis de supprimer instantanément une table car des requêtes peuvent être exécutées sur celle-ci. C'est la raison pour laquelle il existe des fonctions de suppression douce et de suppression dure pour une table. Lorsque vous supprimez une table, elle est étiquetée comme "soft-delete" et ne peut plus faire l'objet de requêtes ou de modifications. Cependant, les requêtes qui étaient en cours avant la suppression sont toujours en cours. Ce n'est que lorsque toutes ces requêtes préalables à la suppression seront terminées que la table, ainsi que ses métadonnées et ses fichiers connexes, seront définitivement supprimés.</li>
</ul>
<p><strong>(5) Planificateur de requêtes</strong></p>
<p>Le graphique ci-dessous illustre le processus de recherche vectorielle dans le CPU et le GPU en interrogeant les fichiers (fichiers de données brutes et fichiers d'index) qui sont copiés et sauvegardés sur le disque, dans la mémoire du CPU et dans celle du GPU pour trouver les k vecteurs les plus similaires.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkrésultat</span> </span></p>
<p>L'algorithme de planification des requêtes améliore considérablement les performances du système. La philosophie de base de la conception est d'obtenir les meilleures performances de recherche en utilisant au maximum les ressources matérielles. Voici une brève description de l'algorithme d'ordonnancement des requêtes, qui fera l'objet d'un article spécifique à l'avenir.</p>
<p>Nous appelons la première requête sur une table donnée la requête "froide", et les requêtes suivantes la requête "chaude". Lors de la première interrogation d'une table donnée, Milvus effectue un travail considérable pour charger les données dans la mémoire de l'unité centrale et certaines données dans la mémoire du processeur graphique, ce qui prend beaucoup de temps. Pour les requêtes suivantes, la recherche est beaucoup plus rapide car une partie ou la totalité des données se trouvent déjà dans la mémoire de l'unité centrale, ce qui permet d'économiser le temps de lecture à partir du disque.</p>
<p>Pour raccourcir le temps de recherche de la première requête, Milvus propose la configuration Preload Table (<code translate="no">preload_table</code>) qui permet le préchargement automatique des tables dans la mémoire de l'unité centrale au démarrage du serveur. Pour une table contenant 100 millions de vecteurs à 512 dimensions, soit 200 Go, la vitesse de recherche est la plus rapide si la mémoire de l'unité centrale est suffisante pour stocker toutes ces données. Toutefois, si la table contient des vecteurs à l'échelle du milliard, il est parfois inévitable de libérer de la mémoire CPU/GPU pour ajouter de nouvelles données qui ne sont pas interrogées. Actuellement, nous utilisons la stratégie de remplacement des données LRU (Latest Recently Used).</p>
<p>Comme le montre le graphique ci-dessous, supposons qu'une table comporte 6 fichiers d'index stockés sur le disque. La mémoire de l'unité centrale ne peut stocker que 3 fichiers d'index, et la mémoire de l'unité de calcul que 1 fichier d'index.</p>
<p>Lorsque la recherche commence, 3 fichiers d'index sont chargés dans la mémoire de l'unité centrale pour la requête. Le premier fichier est libéré de la mémoire de l'unité centrale immédiatement après avoir été interrogé. Pendant ce temps, le quatrième fichier est chargé dans la mémoire de l'unité centrale. De la même manière, lorsqu'un fichier est interrogé dans la mémoire du GPU, il est instantanément libéré et remplacé par un nouveau fichier.</p>
<p>Le planificateur de requêtes gère principalement deux ensembles de files d'attente, l'une pour le chargement des données et l'autre pour l'exécution de la recherche.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>planificateur de requêtes</span> </span></p>
<p><strong>(6) Réducteur de résultats</strong></p>
<p>Il existe deux paramètres clés liés à la recherche vectorielle : l'un est "n", qui signifie n nombre de vecteurs cibles ; l'autre est "k", qui signifie les k vecteurs les plus similaires. Les résultats de la recherche sont en fait n ensembles de KVP (paires clé-valeur), chacun comportant k paires clé-valeur. Comme les requêtes doivent être exécutées pour chaque fichier individuel, qu'il s'agisse d'un fichier de données brutes ou d'un fichier d'index, n ensembles d'ensembles de résultats top-k seront récupérés pour chaque fichier. Tous ces ensembles de résultats sont fusionnés pour obtenir les ensembles de résultats top-k de la table.</p>
<p>L'exemple ci-dessous montre comment les ensembles de résultats sont fusionnés et réduits pour la recherche vectorielle dans un tableau comportant 4 fichiers d'index (n=2, k=3). Notez que chaque ensemble de résultats comporte 2 colonnes. La colonne de gauche représente l'identifiant du vecteur et la colonne de droite représente la distance euclidienne.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>résultat</span> </span></p>
<p><strong>(7) Optimisation future</strong></p>
<p>Voici quelques réflexions sur les optimisations possibles de la gestion des données.</p>
<ul>
<li>Et si les données de la mémoire tampon immuable ou même de la mémoire tampon mutable pouvaient également être interrogées instantanément ? Actuellement, les données de la mémoire tampon immuable ne peuvent pas être interrogées, tant qu'elles n'ont pas été écrites sur le disque. Certains utilisateurs sont plus intéressés par l'accès instantané aux données après leur insertion.</li>
<li>Fournir une fonctionnalité de partitionnement des tables qui permette à l'utilisateur de diviser de très grandes tables en partitions plus petites et d'exécuter une recherche vectorielle sur une partition donnée.</li>
<li>Ajouter aux vecteurs certains attributs qui peuvent être filtrés. Par exemple, certains utilisateurs ne veulent rechercher que parmi les vecteurs ayant certains attributs. Il est nécessaire de récupérer les attributs des vecteurs et même les vecteurs bruts. Une approche possible consiste à utiliser une base de données KV telle que RocksDB.</li>
<li>Fournir une fonctionnalité de migration des données qui permette la migration automatique des données obsolètes vers d'autres espaces de stockage. Dans certains scénarios où les données affluent en permanence, les données peuvent vieillir. Comme certains utilisateurs ne s'intéressent qu'aux données du mois le plus récent et n'effectuent des recherches que sur celles-ci, les données plus anciennes perdent de leur utilité tout en consommant beaucoup d'espace disque. Un mécanisme de migration des données permet de libérer de l'espace disque pour les nouvelles données.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">Résumé de l'article<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Cet article présente principalement la stratégie de gestion des données dans Milvus. D'autres articles sur le déploiement distribué de Milvus, la sélection des méthodes d'indexation vectorielle et le planificateur de requêtes seront publiés prochainement. Restez à l'écoute !</p>
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestion des métadonnées Milvus (1) : Comment visualiser les métadonnées</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestion des métadonnées Milvus (2) : Champs de la table des métadonnées</a></li>
</ul>
