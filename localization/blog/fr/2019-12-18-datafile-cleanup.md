---
id: 2019-12-18-datafile-cleanup.md
title: Stratégie de suppression précédente et problèmes connexes
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Nous avons amélioré la stratégie de suppression des fichiers afin de résoudre
  les problèmes liés aux opérations de requête.
cover: null
tag: Engineering
---
<custom-h1>Amélioration du mécanisme de nettoyage des fichiers de données</custom-h1><blockquote>
<p>auteur : Yihua Mo</p>
<p>Date : 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Stratégie de suppression précédente et problèmes connexes<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans <a href="/blog/fr/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a>, nous avons mentionné le mécanisme de suppression des fichiers de données. La suppression comprend la suppression douce et la suppression dure. Après avoir effectué une opération de suppression sur une table, celle-ci est marquée par un soft-delete. Les opérations de recherche ou de mise à jour ultérieures ne sont plus autorisées. Toutefois, l'opération d'interrogation qui commence avant la suppression peut toujours être exécutée. La table n'est réellement supprimée avec les métadonnées et les autres fichiers qu'une fois l'opération de recherche terminée.</p>
<p>Alors, quand les fichiers marqués par soft-delete sont-ils réellement supprimés ? Avant la version 0.6.0, la stratégie est qu'un fichier est réellement supprimé après une suppression progressive de 5 minutes. La figure suivante illustre cette stratégie :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5mins</span> </span></p>
<p>Cette stratégie est basée sur le principe que les requêtes ne durent normalement pas plus de 5 minutes et n'est pas fiable. Si une requête dure plus de 5 minutes, elle échouera. La raison en est que lorsqu'une requête démarre, Milvus collecte des informations sur les fichiers qui peuvent être recherchés et crée des tâches de requête. Ensuite, le planificateur de requêtes charge les fichiers en mémoire un par un et les recherche un par un. Si un fichier n'existe plus lors de son chargement, la requête échoue.</p>
<p>L'allongement du délai peut contribuer à réduire le risque d'échec des requêtes, mais il pose également un autre problème : l'utilisation du disque est trop importante. En effet, lorsque de grandes quantités de vecteurs sont insérées, Milvus combine continuellement les fichiers de données et les fichiers combinés ne sont pas immédiatement supprimés du disque, même si aucune requête n'a lieu. Si l'insertion de données est trop rapide et/ou si la quantité de données insérées est trop importante, l'utilisation supplémentaire du disque peut s'élever à des dizaines de Go. Voir la figure suivante à titre d'exemple :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>résultat</span> </span></p>
<p>Comme le montre la figure précédente, le premier lot de données insérées (insert_1) est transféré sur le disque et devient le fichier_1, puis l'insert_2 devient le fichier_2. Le thread responsable de la combinaison des fichiers combine les fichiers en fichier_3. Ensuite, les fichiers 1 et 2 sont marqués comme supprimés en douceur. Le troisième lot de données d'insertion devient le fichier_4. L'application combine les fichiers 3 et 4 en fichiers 5 et marque les fichiers 3 et 4 comme étant des suppressions légères.</p>
<p>De même, les fichiers insert_6 et insert_5 sont combinés. En t3, les fichiers 5 et 6 sont marqués comme étant des suppressions douces. Entre t3 et t4, bien que de nombreux fichiers soient marqués comme étant supprimés, ils se trouvent toujours sur le disque. Les fichiers sont réellement supprimés après t4. Ainsi, entre t3 et t4, l'utilisation du disque est de 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 Mo. Les données insérées représentent 64 + 64 + 64 + 64 = 256 Mo. L'utilisation du disque est 3 fois supérieure à la taille des données insérées. Plus la vitesse d'écriture du disque est élevée, plus l'utilisation du disque est importante pendant une période donnée.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Améliorations de la stratégie de suppression dans la version 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons donc modifié la stratégie de suppression des fichiers dans la version 0.6.0. Le hard-delete n'utilise plus le temps comme déclencheur. Au lieu de cela, le déclencheur est le moment où le fichier n'est plus utilisé par aucune tâche.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>nouvelle stratégie</span> </span></p>
<p>Supposons que deux lots de vecteurs soient insérés. En t1, une requête est donnée, Milvus acquiert deux fichiers à interroger (file_1 et file_2, car file_3 n'existe toujours pas). Ensuite, le thread du backend commence à combiner les deux fichiers avec la requête qui s'exécute en même temps. Lorsque le fichier_3 est généré, les fichiers_1 et_2 sont marqués comme supprimés en douceur. Après la requête, aucune autre tâche n'utilisera les fichiers 1 et 2, qui seront donc supprimés en dur en t4. L'intervalle entre t2 et t4 est très petit et dépend de l'intervalle de la requête. De cette manière, les fichiers inutilisés seront supprimés à temps.</p>
<p>En ce qui concerne la mise en œuvre interne, le comptage de références, qui est familier aux ingénieurs logiciels, est utilisé pour déterminer si un fichier peut être supprimé. Pour l'expliquer à l'aide d'une comparaison, lorsqu'un joueur a des vies dans un jeu, il peut encore jouer. Lorsque le nombre de vies devient nul, la partie est terminée. Milvus surveille l'état de chaque fichier. Lorsqu'un fichier est utilisé par une tâche, une vie est ajoutée au fichier. Lorsque le fichier n'est plus utilisé, une vie est retirée du fichier. Lorsqu'un fichier est marqué par soft-delete et que le nombre de vies est de 0, le fichier est prêt pour hard-delete.</p>
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
<li><a href="/blog/fr/2019-11-08-data-management.md">Gestion des données dans un moteur de recherche vectorielle à grande échelle</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Gestion des métadonnées Milvus (1) : Comment visualiser les métadonnées</a></li>
<li><a href="/blog/fr/2019-12-27-meta-table.md">Gestion des métadonnées Milvus (2) : Champs de la table des métadonnées</a></li>
</ul>
