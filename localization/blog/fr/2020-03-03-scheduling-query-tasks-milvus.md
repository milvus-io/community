---
id: scheduling-query-tasks-milvus.md
title: Contexte
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: Le travail en coulisses
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Comment Milvus planifie-t-il les tâches de requête ?</custom-h1><p>ans cet article, nous verrons comment Milvus planifie les tâches d'interrogation. Nous aborderons également les problèmes, les solutions et les orientations futures pour la mise en œuvre de l'ordonnancement de Milvus.</p>
<h2 id="Background" class="common-anchor-header">Contexte<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>La gestion des données dans un moteur de recherche vectorielle à grande échelle nous a appris que la recherche de similarité vectorielle est mise en œuvre par la distance entre deux vecteurs dans un espace à haute dimension. L'objectif de la recherche vectorielle est de trouver les K vecteurs les plus proches du vecteur cible.</p>
<p>Il existe de nombreuses façons de mesurer la distance vectorielle, comme la distance euclidienne :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-distance-euclidienne.png</span> </span></p>
<p>où x et y sont deux vecteurs. n est la dimension des vecteurs.</p>
<p>Afin de trouver les K vecteurs les plus proches dans un ensemble de données, la distance euclidienne doit être calculée entre le vecteur cible et tous les vecteurs de l'ensemble de données à rechercher. Ensuite, les vecteurs sont triés en fonction de la distance pour obtenir les K vecteurs les plus proches. Le travail de calcul est directement proportionnel à la taille de l'ensemble de données. Plus l'ensemble de données est important, plus la requête nécessite de travail de calcul. Un GPU, spécialisé dans le traitement des graphes, dispose d'un grand nombre de cœurs pour fournir la puissance de calcul nécessaire. La prise en charge multi-GPU est donc également prise en compte lors de la mise en œuvre de Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Concepts de base<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Bloc de données（TableFile）</h3><p>Pour améliorer la prise en charge de la recherche de données à grande échelle, nous avons optimisé le stockage des données de Milvus. Milvus divise les données d'une table par taille en plusieurs blocs de données. Pendant la recherche vectorielle, Milvus recherche des vecteurs dans chaque bloc de données et fusionne les résultats. Une opération de recherche vectorielle se compose de N opérations indépendantes de recherche vectorielle (N est le nombre de blocs de données) et de N-1 opérations de fusion des résultats.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">File d'attente des tâches（TaskTable）</h3><p>Chaque ressource possède un tableau de tâches, qui enregistre les tâches appartenant à la ressource. Chaque tâche a différents états : démarrage, chargement, chargement, exécution et exécution. Le chargeur et l'exécuteur d'un dispositif informatique partagent la même file d'attente de tâches.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Ordonnancement des requêtes</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>Lorsque le serveur Milvus démarre, Milvus lance la GpuResource correspondante via les paramètres <code translate="no">gpu_resource_config</code> dans le fichier de configuration <code translate="no">server_config.yaml</code>. DiskResource et CpuResource ne peuvent toujours pas être modifiés dans <code translate="no">server_config.yaml</code>. GpuResource est la combinaison de <code translate="no">search_resources</code> et <code translate="no">build_index_resources</code> et est appelé <code translate="no">{gpu0, gpu1}</code> dans l'exemple suivant :</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>Milvus reçoit une demande. Les métadonnées de la table sont stockées dans une base de données externe, qui est SQLite ou MySQl pour l'hôte unique et MySQL pour la base de données distribuée. Après avoir reçu une demande de recherche, Milvus vérifie que la table existe et que la dimension est cohérente. Ensuite, Milvus lit la liste TableFile de la table.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus crée une SearchTask. Le calcul de chaque TableFile étant effectué indépendamment, Milvus crée une SearchTask pour chaque TableFile. En tant qu'unité de base de l'ordonnancement des tâches, une SearchTask contient les vecteurs cibles, les paramètres de recherche et les noms de fichiers des TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus choisit un dispositif informatique. Le dispositif sur lequel une SearchTask effectue les calculs dépend du temps d'<strong>exécution estimé</strong> pour chaque dispositif. Le temps de <strong>réalisation estimé</strong> spécifie l'intervalle estimé entre l'heure actuelle et l'heure estimée de la fin du calcul.</li>
</ol>
<p>Par exemple, lorsqu'un bloc de données d'une SearchTask est chargé dans la mémoire du CPU, la SearchTask suivante est en attente dans la file d'attente des tâches de calcul du CPU et la file d'attente des tâches de calcul du GPU est inactive. Le <strong>temps d'exécution estimé</strong> pour l'unité centrale est égal à la somme des temps d'exécution estimés de la tâche de recherche précédente et de la tâche de recherche actuelle. Le temps de <strong>réalisation</strong> estimé pour un GPU est égal à la somme du temps de chargement des blocs de données sur le GPU et du coût temporel estimé de la tâche de recherche en cours. Le temps de réalisation <strong>estimé</strong> pour une tâche de recherche dans une ressource est égal au temps d'exécution moyen de toutes les tâches de recherche dans la ressource. Milvus choisit alors un dispositif dont le <strong>temps d'exécution estimé est</strong> le plus court et affecte la tâche de recherche à ce dispositif.</p>
<p>Ici, nous supposons que le <strong>temps d'exécution estimé</strong> pour le GPU1 est plus court.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-shorter-estimated-completion-time.png</span> </span></p>
<ol start="5">
<li><p>Milvus ajoute SearchTask à la file d'attente de DiskResource.</p></li>
<li><p>Milvus déplace SearchTask dans la file d'attente de CpuResource. Le thread de chargement de CpuResource charge chaque tâche de la file d'attente de manière séquentielle. CpuResource lit les blocs de données correspondants dans la mémoire du processeur.</p></li>
<li><p>Milvus déplace SearchTask vers GpuResource. Le thread de chargement de GpuResource copie les données de la mémoire du CPU vers la mémoire du GPU. GpuResource lit les blocs de données correspondants dans la mémoire du GPU.</p></li>
<li><p>Milvus exécute SearchTask dans GpuResource. Le résultat d'une SearchTask étant relativement petit, il est directement renvoyé dans la mémoire de l'unité centrale.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus fusionne le résultat de la SearchTask avec l'ensemble des résultats de la recherche.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>Lorsque toutes les tâches de recherche sont terminées, Milvus renvoie le résultat complet de la recherche au client.</p>
<h2 id="Index-building" class="common-anchor-header">Création d'index<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>La construction d'un index est essentiellement la même chose que le processus de recherche sans le processus de fusion. Nous n'en parlerons pas en détail.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimisation des performances<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>Comme indiqué précédemment, les blocs de données doivent être chargés dans les dispositifs de stockage correspondants, tels que la mémoire de l'unité centrale ou la mémoire du processeur graphique, avant le calcul. Pour éviter le chargement répétitif des données, Milvus introduit le cache LRU (Least Recently Used). Lorsque le cache est plein, les nouveaux blocs de données repoussent les anciens. Vous pouvez personnaliser la taille du cache à l'aide du fichier de configuration en fonction de la taille de la mémoire actuelle. Il est recommandé d'utiliser un cache de grande taille pour stocker les données de recherche afin d'économiser le temps de chargement des données et d'améliorer les performances de la recherche.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Chevauchement du chargement des données et du calcul</h3><p>Le cache ne peut pas répondre à nos besoins en matière de performances de recherche. Les données doivent être rechargées lorsque la mémoire est insuffisante ou que la taille de l'ensemble de données est trop importante. Nous devons réduire l'effet du chargement des données sur les performances de recherche. Le chargement des données, que ce soit du disque vers la mémoire de l'unité centrale ou de la mémoire de l'unité centrale vers la mémoire du processeur graphique, fait partie des opérations d'E/S et ne nécessite pratiquement aucun travail de calcul de la part des processeurs. Nous envisageons donc d'effectuer le chargement des données et le calcul en parallèle pour une meilleure utilisation des ressources.</p>
<p>Nous divisons le calcul d'un bloc de données en trois étapes (chargement du disque vers la mémoire du CPU, calcul du CPU, fusion des résultats) ou en quatre étapes (chargement du disque vers la mémoire du CPU, chargement de la mémoire du CPU vers la mémoire du GPU, calcul du GPU et récupération des résultats, et fusion des résultats). Si l'on prend l'exemple d'un calcul en 3 étapes, on peut lancer 3 threads responsables des 3 étapes pour faire fonctionner le pipelining d'instructions. Comme les ensembles de résultats sont généralement petits, la fusion des résultats ne prend pas beaucoup de temps. Dans certains cas, le chevauchement du chargement des données et du calcul peut réduire le temps de recherche de moitié.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Problèmes et solutions<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Différentes vitesses de transmission</h3><p>Auparavant, Milvus utilisait la stratégie Round Robin pour la planification des tâches multi-GPU. Cette stratégie a parfaitement fonctionné sur notre serveur à 4 GPU et les performances de recherche ont été multipliées par 4. Cependant, pour nos hôtes à 2 GPU, les performances n'ont pas été multipliées par 2. Nous avons fait quelques expériences et découvert que la vitesse de copie des données pour un GPU était de 11 GB/s. Cependant, pour un autre GPU, elle était de 3 GB/s. Après avoir consulté la documentation de la carte mère, nous avons confirmé que la carte mère était connectée à un GPU via PCIe x16 et à un autre GPU via PCIe x4. En d'autres termes, ces GPU ont des vitesses de copie différentes. Par la suite, nous avons ajouté le temps de copie pour mesurer le dispositif optimal pour chaque SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Travaux futurs<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Environnement matériel plus complexe</h3><p>Dans des conditions réelles, l'environnement matériel peut être plus complexe. Dans les environnements matériels comportant plusieurs CPU, une mémoire avec architecture NUMA, NVLink et NVSwitch, la communication entre les CPU/GPU offre de nombreuses possibilités d'optimisation.</p>
<p>Optimisation des requêtes</p>
<p>Au cours de l'expérimentation, nous avons découvert quelques possibilités d'amélioration des performances. Par exemple, lorsque le serveur reçoit plusieurs requêtes pour la même table, les requêtes peuvent être fusionnées sous certaines conditions. En utilisant la localité des données, nous pouvons améliorer les performances. Ces optimisations seront mises en œuvre dans nos développements futurs. Nous savons déjà comment les requêtes sont planifiées et exécutées pour le scénario mono-hôte et multi-GPU. Nous continuerons à présenter d'autres mécanismes internes pour Milvus dans les prochains articles.</p>
