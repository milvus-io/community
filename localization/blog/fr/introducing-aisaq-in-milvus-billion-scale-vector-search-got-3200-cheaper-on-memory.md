---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Présentation d'AISAQ dans Milvus : la recherche vectorielle à l'échelle du
  milliard vient d'être 3 200 fois moins coûteuse en mémoire
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Découvrez comment Milvus réduit les coûts de mémoire de 3200× avec AISAQ,
  permettant une recherche évolutive de milliards de vecteurs sans surcharge de
  DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Les bases de données vectorielles sont devenues l'infrastructure de base des systèmes d'IA critiques, et leurs volumes de données augmentent de façon exponentielle, atteignant souvent des milliards de vecteurs. À cette échelle, tout devient plus difficile : maintenir une faible latence, préserver la précision, garantir la fiabilité et opérer à travers les répliques et les régions. Mais un défi tend à faire surface très tôt et à dominer les décisions architecturales : le COÛT<strong>.</strong></p>
<p>Pour permettre une recherche rapide, la plupart des bases de données vectorielles conservent les structures d'indexation clés dans la DRAM (Dynamic Random Access Memory), le niveau de mémoire le plus rapide et le plus coûteux. Cette conception est efficace en termes de performances, mais elle est peu évolutive. L'utilisation de la DRAM augmente avec la taille des données plutôt qu'avec le trafic des requêtes, et même avec la compression ou le déchargement partiel du SSD, de grandes parties de l'index doivent rester en mémoire. Au fur et à mesure que les ensembles de données augmentent, les coûts de mémoire deviennent rapidement un facteur limitant.</p>
<p>Milvus prend déjà en charge <strong>DISKANN</strong>, une approche ANN basée sur le disque qui réduit la pression de la mémoire en déplaçant une grande partie de l'index sur le SSD. Cependant, DISKANN s'appuie toujours sur la DRAM pour les représentations compressées utilisées pendant la recherche. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> va plus loin avec <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un index vectoriel sur disque inspiré de <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Développée par KIOXIA, l'architecture d'AiSAQ a été conçue avec une "architecture à empreinte DRAM nulle", qui stocke toutes les données critiques pour la recherche sur le disque et optimise le placement des données afin de minimiser les opérations d'entrée/sortie. Dans une charge de travail d'un milliard de vecteurs, cela permet de réduire l'utilisation de la mémoire de <strong>32 Go à environ 10 Mo, soit une</strong> <strong>réduction de 3 200 fois, tout en</strong>maintenant des performances pratiques.</p>
<p>Dans les sections suivantes, nous expliquons comment fonctionne la recherche vectorielle basée sur les graphes, d'où proviennent les coûts de mémoire et comment AISAQ modifie la courbe des coûts pour la recherche vectorielle à l'échelle du milliard.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Fonctionnement de la recherche vectorielle conventionnelle basée sur les graphes<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>recherche vectorielle</strong> consiste à trouver les points de données dont les représentations numériques sont les plus proches d'une requête dans un espace à haute dimension. Le terme "le plus proche" signifie simplement la plus petite distance selon une fonction de distance, telle que la distance en cosinus ou la distance L2. À petite échelle, c'est simple : il suffit de calculer la distance entre la requête et chaque vecteur, puis de renvoyer les vecteurs les plus proches. Toutefois, à grande échelle, par exemple à l'échelle du milliard, cette approche devient rapidement trop lente pour être pratique.</p>
<p>Pour éviter les comparaisons exhaustives, les systèmes modernes de recherche approximative du plus proche voisin (ANNS) s'appuient sur des <strong>indices basés sur des graphes</strong>. Au lieu de comparer une requête à chaque vecteur, l'index organise les vecteurs en un <strong>graphe</strong>. Chaque nœud représente un vecteur et les arêtes relient les vecteurs qui sont numériquement proches. Cette structure permet au système de réduire considérablement l'espace de recherche.</p>
<p>Le graphe est construit à l'avance, en se basant uniquement sur les relations entre les vecteurs. Il ne dépend pas des requêtes. Lorsqu'une requête arrive, la tâche du système est de <strong>naviguer efficacement dans le graphe</strong> et d'identifier les vecteurs ayant la plus petite distance par rapport à la requête, sans balayer l'ensemble des données.</p>
<p>La recherche commence à partir d'un <strong>point d'entrée</strong> prédéfini dans le graphe. Ce point de départ peut être éloigné de la requête, mais l'algorithme améliore sa position étape par étape en se déplaçant vers des vecteurs qui semblent plus proches de la requête. Au cours de ce processus, la recherche maintient deux structures de données internes qui fonctionnent ensemble : une <strong>liste de candidats</strong> et une <strong>liste de résultats</strong>.</p>
<p>Les deux étapes les plus importantes de ce processus sont l'extension de la liste des candidats et la mise à jour de la liste des résultats.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Extension de la liste des candidats</h3><p>La <strong>liste des candidats</strong> représente la prochaine étape de la recherche. Il s'agit d'un ensemble hiérarchisé de nœuds du graphe qui semblent prometteurs en fonction de leur distance par rapport à la requête.</p>
<p>À chaque itération, l'algorithme</p>
<ul>
<li><p><strong>sélectionne le candidat le plus proche découvert jusqu'à présent.</strong> Dans la liste des candidats, il choisit le vecteur dont la distance à la requête est la plus faible.</p></li>
<li><p><strong>Il récupère les voisins de ce vecteur dans le graphe.</strong> Ces voisins sont des vecteurs qui ont été identifiés lors de la construction de l'index comme étant proches du vecteur actuel.</p></li>
<li><p><strong>Évalue les voisins non visités et les ajoute à la liste des candidats.</strong> Pour chaque voisin qui n'a pas encore été exploré, l'algorithme calcule sa distance par rapport à la requête. Les voisins précédemment visités sont ignorés, tandis que les nouveaux voisins sont insérés dans la liste des candidats s'ils semblent prometteurs.</p></li>
</ul>
<p>En élargissant de manière répétée la liste des candidats, la recherche explore des régions de plus en plus pertinentes du graphe. Cela permet à l'algorithme de progresser régulièrement vers de meilleures réponses tout en n'examinant qu'une petite fraction de tous les vecteurs.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Mise à jour de la liste des résultats</h3><p>Dans le même temps, l'algorithme tient à jour une <strong>liste de résultats</strong>, qui enregistre les meilleurs candidats trouvés jusqu'à présent pour la sortie finale. Au fur et à mesure que la recherche progresse, il</p>
<ul>
<li><p><strong>suit les vecteurs les plus proches rencontrés au cours de la traversée.</strong> Il s'agit des vecteurs sélectionnés pour l'expansion ainsi que d'autres vecteurs évalués en cours de route.</p></li>
<li><p><strong>Enregistre leurs distances par rapport à la requête.</strong> Cela permet de classer les candidats et de maintenir le top-K des plus proches voisins.</p></li>
</ul>
<p>Au fil du temps, la liste des résultats se stabilise au fur et à mesure que de nouveaux candidats sont évalués et que de moins en moins d'améliorations sont trouvées. Lorsqu'il est peu probable qu'une exploration plus poussée du graphe produise des vecteurs plus proches, la recherche se termine et renvoie la liste de résultats comme réponse finale.</p>
<p>En termes simples, la <strong>liste des candidats contrôle l'exploration</strong>, tandis que la <strong>liste des résultats contient les meilleures réponses découvertes jusqu'à présent</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Le compromis dans la recherche vectorielle basée sur les graphes<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>C'est cette approche basée sur les graphes qui rend la recherche vectorielle à grande échelle pratique en premier lieu. En naviguant dans le graphe au lieu de balayer chaque vecteur, le système peut trouver des résultats de haute qualité en ne touchant qu'une petite fraction de l'ensemble de données.</p>
<p>Toutefois, cette efficacité n'est pas gratuite. La recherche basée sur les graphes révèle un compromis fondamental entre la <strong>précision et le coût.</strong></p>
<ul>
<li><p>L'exploration d'un plus grand nombre de voisins améliore la précision en couvrant une plus grande partie du graphe et en réduisant le risque de manquer les vrais voisins les plus proches.</p></li>
<li><p>En même temps, chaque expansion supplémentaire ajoute du travail : plus de calculs de distance, plus d'accès à la structure du graphe et plus de lectures de données vectorielles. Au fur et à mesure que la recherche s'approfondit ou s'élargit, ces coûts s'accumulent. En fonction de la conception de l'index, ils se traduisent par une utilisation plus importante de l'unité centrale, une pression accrue sur la mémoire ou des entrées/sorties supplémentaires sur le disque.</p></li>
</ul>
<p>L'équilibre entre ces forces opposées - rappel élevé et utilisation efficace des ressources - est au cœur de la conception de la recherche basée sur les graphes.</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> et <strong>AISAQ</strong> sont tous deux construits autour de cette même tension, mais ils font des choix architecturaux différents quant à la manière et à l'endroit où ces coûts sont payés.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Comment DISKANN optimise la recherche vectorielle sur disque<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN est la solution ANN sur disque la plus influente à ce jour et sert de référence officielle pour la compétition NeurIPS Big ANN, une référence mondiale pour la recherche vectorielle à l'échelle du milliard. Son importance ne réside pas seulement dans ses performances, mais aussi dans ce qu'il a prouvé : <strong>la recherche ANN basée sur les graphes n'a pas besoin de vivre entièrement en mémoire pour être rapide</strong>.</p>
<p>En combinant le stockage sur SSD avec des structures en mémoire soigneusement choisies, DISKANN a démontré que la recherche vectorielle à grande échelle pouvait atteindre une grande précision et une faible latence sur du matériel de base, sans nécessiter d'empreintes DRAM massives. Il y parvient en repensant <em>les parties de la recherche qui doivent être rapides</em> et <em>celles qui peuvent tolérer un accès plus lent</em>.</p>
<p><strong>À un niveau élevé, DISKANN conserve les données les plus fréquemment consultées en mémoire, tout en déplaçant les structures plus importantes, moins fréquemment consultées, sur le disque.</strong> Cet équilibre est obtenu grâce à plusieurs choix de conception clés.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Utilisation des distances PQ pour étendre la liste des candidats</h3><p>L'expansion de la liste des candidats est l'opération la plus fréquente dans la recherche basée sur les graphes. Chaque expansion nécessite l'estimation de la distance entre le vecteur de requête et les voisins d'un nœud candidat. L'exécution de ces calculs à l'aide de vecteurs complets à haute dimension nécessiterait de fréquentes lectures aléatoires du disque, une opération coûteuse à la fois sur le plan informatique et en termes d'E/S.</p>
<p>DISKANN évite ce coût en compressant les vecteurs en <strong>codes de quantification de produit (PQ)</strong> et en les conservant en mémoire. Les codes PQ sont beaucoup plus petits que les vecteurs complets, mais conservent suffisamment d'informations pour estimer approximativement la distance.</p>
<p>Lors de l'expansion des candidats, DISKANN calcule les distances à l'aide de ces codes PQ en mémoire au lieu de lire les vecteurs complets sur le disque SSD. Cela réduit considérablement les E/S disque pendant la traversée du graphe, ce qui permet à la recherche d'étendre rapidement et efficacement les candidats tout en maintenant la majeure partie du trafic SSD en dehors du chemin critique.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Localisation conjointe des vecteurs complets et des listes de voisins sur le disque</h3><p>Toutes les données ne peuvent pas être compressées ou accessibles de manière approximative. Une fois que les candidats prometteurs ont été identifiés, la recherche a toujours besoin d'accéder à deux types de données pour obtenir des résultats précis :</p>
<ul>
<li><p>les<strong>listes de voisins</strong>, pour continuer à parcourir le graphe</p></li>
<li><p><strong>les vecteurs complets (non compressés)</strong>, pour le reclassement final.</p></li>
</ul>
<p>Ces structures sont consultées moins fréquemment que les codes PQ, c'est pourquoi DISKANN les stocke sur SSD. Pour minimiser la surcharge du disque, DISKANN place la liste des voisins de chaque nœud et son vecteur complet dans la même région physique du disque. Cela garantit qu'une seule lecture du disque SSD peut récupérer les deux.</p>
<p>En colocalisant les données connexes, DISKANN réduit le nombre d'accès aléatoires au disque requis pendant la recherche. Cette optimisation améliore l'efficacité de l'expansion et du reclassement, en particulier à grande échelle.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansion parallèle des nœuds pour une meilleure utilisation des disques SSD</h3><p>La recherche ANN basée sur les graphes est un processus itératif. Si chaque itération n'étend qu'un seul nœud candidat, le système n'effectue qu'une seule lecture de disque à la fois, ce qui laisse la majeure partie de la bande passante parallèle du disque SSD inutilisée. Pour éviter cette inefficacité, DISKANN développe plusieurs candidats à chaque itération et envoie des demandes de lecture parallèles au disque SSD. Cette approche utilise beaucoup mieux la bande passante disponible et réduit le nombre total d'itérations nécessaires.</p>
<p>Le paramètre <strong>beam_width_ratio</strong> contrôle le nombre de candidats développés en parallèle : <strong>Largeur du faisceau = nombre de cœurs de l'unité centrale × rapport_largeur_du_faisceau.</strong> Un rapport plus élevé élargit la recherche, ce qui peut améliorer la précision, mais augmente également les calculs et les E/S sur disque.</p>
<p>Pour compenser cela, DISKANN introduit un site <code translate="no">search_cache_budget_gb_ratio</code> qui réserve de la mémoire pour mettre en cache les données fréquemment consultées, réduisant ainsi les lectures répétées du SSD. Ensemble, ces mécanismes permettent à DISKANN d'équilibrer la précision, la latence et l'efficacité des E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Pourquoi c'est important - et où les limites apparaissent</h3><p>La conception de DISKANN constitue une avancée majeure pour la recherche vectorielle sur disque. En conservant les codes PQ en mémoire et en transférant les structures plus importantes sur le disque SSD, il réduit considérablement l'empreinte mémoire par rapport aux index de graphe entièrement en mémoire.</p>
<p>En même temps, cette architecture dépend toujours de la <strong>DRAM</strong> pour les données critiques de recherche. Les codes PQ, les caches et les structures de contrôle doivent rester résidents en mémoire pour assurer l'efficacité de la traversée. Lorsque les ensembles de données atteignent des milliards de vecteurs et que les déploiements ajoutent des répliques ou des régions, cette exigence de mémoire peut encore devenir un facteur limitant.</p>
<p>C'est cette lacune que l'<strong>AISAQ</strong> vise à combler.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Comment fonctionne AISAQ et pourquoi c'est important<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ s'appuie directement sur les idées fondamentales de DISKANN, mais introduit un changement essentiel : il n'est plus <strong>nécessaire de conserver les données PQ dans la DRAM</strong>. Au lieu de traiter les vecteurs compressés comme des structures critiques pour la recherche, toujours en mémoire, AISAQ les déplace vers les disques SSD et redéfinit la façon dont les données graphiques sont disposées sur le disque afin de préserver l'efficacité de la traversée.</p>
<p>Pour ce faire, AISAQ réorganise le stockage des nœuds de manière à ce que les données nécessaires à la recherche de graphes (vecteurs complets, listes de voisins et informations PQ) soient disposées sur le disque selon des schémas optimisés pour la localité d'accès. L'objectif n'est pas seulement d'envoyer plus de données sur le disque le plus économique, mais de le faire <strong>sans interrompre le processus de recherche décrit plus haut</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour répondre aux différentes exigences des applications, l'AISAQ propose deux modes de stockage sur disque : Performance et Scale. D'un point de vue technique, ces modes diffèrent principalement dans la manière dont les données compressées PQ sont stockées et accédées pendant la recherche. Du point de vue de l'application, ces modes répondent à deux types d'exigences distinctes : les exigences de faible latence, typiques des systèmes de recherche sémantique et de recommandation en ligne, et les exigences de très grande échelle, typiques de RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">Performances de l'AISAQ : Optimisé pour la vitesse</h3><p>AISAQ-performance conserve toutes les données sur disque tout en maintenant une faible charge d'E/S grâce à la colocation des données.</p>
<p>Dans ce mode :</p>
<ul>
<li><p>Le vecteur complet de chaque nœud, la liste des arêtes et les codes PQ de ses voisins sont stockés ensemble sur le disque.</p></li>
<li><p>La visite d'un nœud ne nécessite toujours qu'une <strong>seule lecture sur le disque SSD</strong>, car toutes les données nécessaires à l'expansion et à l'évaluation des candidats sont colocalisées.</p></li>
</ul>
<p>Du point de vue de l'algorithme de recherche, cela reflète étroitement le modèle d'accès de DISKANN. L'expansion des candidats reste efficace et les performances d'exécution sont comparables, même si toutes les données critiques pour la recherche se trouvent désormais sur le disque.</p>
<p>La contrepartie est une surcharge de stockage. Étant donné que les données PQ d'un voisin peuvent apparaître dans les pages de disque de plusieurs nœuds, cette disposition introduit une redondance et augmente de manière significative la taille de l'index global.</p>
<p>Par conséquent, le mode AISAQ-Performance donne la priorité à une faible latence des E/S plutôt qu'à l'efficacité du disque. Du point de vue de l'application, le mode AiSAQ-Performance peut offrir une latence de l'ordre de 10 mSec, comme l'exige la recherche sémantique en ligne.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">Échelle AISAQ : Optimisé pour l'efficacité du stockage</h3><p>AISAQ-Scale adopte l'approche inverse. Il est conçu pour <strong>minimiser l'utilisation du disque</strong> tout en conservant toutes les données sur le SSD.</p>
<p>Dans ce mode :</p>
<ul>
<li><p>Les données PQ sont stockées sur le disque séparément, sans redondance.</p></li>
<li><p>Cela permet d'éliminer la redondance et de réduire considérablement la taille de l'index.</p></li>
</ul>
<p>En contrepartie, l'accès aux codes PQ d'un nœud et de ses voisins peut nécessiter <strong>plusieurs lectures sur le disque SSD</strong>, ce qui augmente les opérations d'E/S lors de l'expansion des candidats. En l'absence d'optimisation, cela ralentirait considérablement la recherche.</p>
<p>Pour contrôler cette surcharge, le mode AISAQ-Scale introduit deux optimisations supplémentaires :</p>
<ul>
<li><p>Le<strong>réarrangement des données PQ</strong>, qui ordonne les vecteurs PQ par priorité d'accès afin d'améliorer la localité et de réduire les lectures aléatoires.</p></li>
<li><p>Un <strong>cache PQ dans la DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), qui stocke les données PQ fréquemment accédées et évite les lectures répétées sur le disque pour les entrées chaudes.</p></li>
</ul>
<p>Grâce à ces optimisations, le mode AISAQ-Scale permet d'obtenir une bien meilleure efficacité de stockage que le mode AISAQ-Performance, tout en conservant des performances de recherche pratiques. Ces performances restent inférieures à celles de DISKANN, mais il n'y a pas de surcharge de stockage (la taille de l'index est similaire à celle de DISKANN) et l'empreinte mémoire est considérablement réduite. Du point de vue de l'application, AiSAQ permet de répondre aux exigences du RAG à très grande échelle.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Principaux avantages d'AISAQ</h3><p>En déplaçant toutes les données essentielles à la recherche sur disque et en repensant le mode d'accès à ces données, AISAQ modifie fondamentalement le profil de coût et d'évolutivité de la recherche vectorielle basée sur les graphes. Sa conception offre trois avantages significatifs.</p>
<p><strong>1. Jusqu'à 3 200 fois moins d'utilisation de DRAM</strong></p>
<p>La quantification de produit réduit considérablement la taille des vecteurs à haute dimension, mais à l'échelle du milliard, l'empreinte mémoire reste importante. Même après compression, les codes PQ doivent être conservés en mémoire pendant la recherche dans les conceptions conventionnelles.</p>
<p>Par exemple, pour <strong>SIFT1B</strong>, un benchmark comportant un milliard de vecteurs à 128 dimensions, les codes PQ nécessitent à eux seuls environ <strong>30 à 120 Go de DRAM</strong>, en fonction de la configuration. Le stockage des vecteurs complets non compressés nécessiterait <strong> environ 480 Go</strong> supplémentaires. Bien que le PQ réduise l'utilisation de la mémoire de 4 à 16 fois, l'empreinte restante est encore suffisamment importante pour dominer le coût de l'infrastructure.</p>
<p>L'AISAQ supprime entièrement cette exigence. En stockant les codes PQ sur un disque SSD au lieu de la DRAM, la mémoire n'est plus consommée par les données d'indexation persistantes. La DRAM n'est utilisée que pour les structures légères et transitoires telles que les listes de candidats et les métadonnées de contrôle. Dans la pratique, cela permet de réduire l'utilisation de la mémoire de dizaines de gigaoctets à <strong>environ 10 Mo.</strong> Dans une configuration représentative à l'échelle du milliard, la DRAM passe de <strong>32 Go à 10 Mo</strong>, soit une <strong>réduction de 3 200 fois</strong>.</p>
<p>Étant donné que le stockage SSD coûte environ <strong>1/30 du prix par unité de capacité</strong> par rapport à la DRAM, ce changement a un impact direct et spectaculaire sur le coût total du système.</p>
<p><strong>2. Pas de frais généraux d'E/S supplémentaires</strong></p>
<p>Le déplacement des codes PQ de la mémoire vers le disque augmenterait normalement le nombre d'opérations d'E/S pendant la recherche. AISAQ évite ce problème en contrôlant soigneusement la <strong>disposition des données et les schémas d'accès</strong>. Plutôt que de disperser les données connexes sur le disque, AISAQ place les codes PQ, les vecteurs complets et les listes de voisins au même endroit afin qu'ils puissent être récupérés ensemble. Cela garantit que l'expansion des candidats n'introduit pas de lectures aléatoires supplémentaires.</p>
<p>Pour permettre aux utilisateurs de contrôler le compromis entre la taille de l'index et l'efficacité des E/S, AISAQ introduit le paramètre <code translate="no">inline_pq</code>, qui détermine la quantité de données PQ stockées en ligne avec chaque nœud :</p>
<ul>
<li><p><strong>Plus faible inline_pq :</strong> taille d'index plus petite, mais peut nécessiter des entrées/sorties supplémentaires.</p></li>
<li><p>inline_pq<strong>plus élevé :</strong> taille d'index plus importante, mais préservation de l'accès en lecture unique.</p></li>
</ul>
<p>Lorsqu'il est configuré avec <strong>inline_pq = max_degree</strong>, AISAQ lit le vecteur complet d'un nœud, la liste des voisins et tous les codes PQ en une seule opération sur disque, ce qui correspond au modèle d'E/S de DISKANN tout en conservant toutes les données sur le disque SSD.</p>
<p><strong>3. L'accès séquentiel aux codes PQ améliore l'efficacité des calculs</strong></p>
<p>Dans DISKANN, l'expansion d'un nœud candidat nécessite R accès aléatoires à la mémoire pour récupérer les codes PQ de ses R voisins. AISAQ élimine ce caractère aléatoire en récupérant tous les codes PQ en une seule E/S et en les stockant de manière séquentielle sur le disque.</p>
<p>La disposition séquentielle offre deux avantages importants :</p>
<ul>
<li><p>Les<strong>lectures séquentielles du disque SSD sont beaucoup plus rapides</strong> que les lectures aléatoires dispersées.</p></li>
<li><p><strong>Les données contiguës sont plus faciles à mettre en cache</strong>, ce qui permet aux CPU de calculer les distances PQ plus efficacement.</p></li>
</ul>
<p>Cela améliore à la fois la vitesse et la prévisibilité des calculs de distance PQ et aide à compenser le coût de performance du stockage des codes PQ sur SSD plutôt que sur DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN : évaluation des performances<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir compris en quoi AISAQ diffère de DISKANN sur le plan architectural, la question suivante est simple : <strong>comment ces choix de conception affectent-ils les performances et l'utilisation des ressources dans la pratique ?</strong> Cette évaluation compare AISAQ et DISKANN sur les trois dimensions les plus importantes à l'échelle du milliard : les <strong>performances de recherche, la consommation de mémoire et l'utilisation du disque</strong>.</p>
<p>En particulier, nous examinons le comportement d'AISAQ lorsque la quantité de données PQ intégrées (<code translate="no">INLINE_PQ</code>) change. Ce paramètre contrôle directement le compromis entre la taille de l'index, les entrées/sorties sur disque et l'efficacité de l'exécution. Nous évaluons également les deux approches sur <strong>des charges de travail vectorielles à faible et à haute dimension, car la dimensionnalité influence fortement le coût du calcul de la distance et les</strong> exigences en matière de stockage.</p>
<h3 id="Setup" class="common-anchor-header">Configuration</h3><p>Toutes les expériences ont été menées sur un système à nœud unique afin d'isoler le comportement de l'index et d'éviter les interférences dues aux effets du réseau ou du système distribué.</p>
<p><strong>Configuration matérielle :</strong></p>
<ul>
<li><p>CPU : Intel® Xeon® Platinum 8375C CPU @ 2.90GHz</p></li>
<li><p>Mémoire : Vitesse : 3200 MT/s, Type : DDR4, Taille : 32 Go</p></li>
<li><p>Disque : 500 GB NVMe SSD</p></li>
</ul>
<p><strong>Paramètres de construction de l'index</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paramètres de requête</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Méthode de référence</h3><p>DISKANN et AISAQ ont été testés à l'aide de <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, le moteur de recherche vectorielle open-source utilisé dans Milvus. Deux ensembles de données ont été utilisés pour cette évaluation :</p>
<ul>
<li><p><strong>SIFT128D (1M vecteurs) :</strong> une référence bien connue à 128 dimensions, couramment utilisée pour la recherche de descripteurs d'images. <em>(Taille de l'ensemble de données brutes ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M vecteurs) :</strong> un ensemble d'intégration à 768 dimensions typique de la recherche sémantique basée sur les transformateurs. <em>(Taille de l'ensemble de données brutes ≈ 2930 Mo)</em></p></li>
</ul>
<p>Ces ensembles de données reflètent deux scénarios distincts du monde réel : des caractéristiques visuelles compactes et des encastrements sémantiques de grande taille.</p>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p><strong>Sift128D1M (Vecteur complet ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (Vecteur complet ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Analyse</h3><p><strong>Jeu de données SIFT128D</strong></p>
<p>Sur l'ensemble de données SIFT128D, AISAQ peut égaler les performances de DISKANN lorsque toutes les données PQ sont intégrées de sorte que les données requises de chaque nœud tiennent entièrement dans une seule page SSD de 4 Ko (INLINE_PQ = 48). Dans cette configuration, chaque information nécessaire à la recherche est colocalisée :</p>
<ul>
<li><p>Vecteur complet : 512B</p></li>
<li><p>Liste des voisins : 48 × 4 + 4 = 196B</p></li>
<li><p>Codes PQ des voisins : 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Total : 3780B</p></li>
</ul>
<p>Comme le nœud entier tient dans une page, une seule E/S est nécessaire par accès, et AISAQ évite les lectures aléatoires des données PQ externes.</p>
<p>Cependant, lorsque seule une partie des données PQ est intégrée, les codes PQ restants doivent être récupérés ailleurs sur le disque. Cela introduit des opérations d'E/S aléatoires supplémentaires, qui augmentent fortement la demande d'IOPS et entraînent des baisses de performance significatives.</p>
<p><strong>Ensemble de données Cohere768D</strong></p>
<p>Sur le jeu de données Cohere768D, les performances d'AISAQ sont inférieures à celles de DISKANN. La raison en est qu'un vecteur de 768 dimensions ne tient tout simplement pas dans une page SSD de 4 Ko :</p>
<ul>
<li><p>Vecteur complet : 3072B</p></li>
<li><p>Liste de voisins : 48 × 4 + 4 = 196B</p></li>
<li><p>Codes PQ des voisins : 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Total : 21 700 B (≈ 6 pages)</p></li>
</ul>
<p>Dans ce cas, même si tous les codes de PQ sont intégrés, chaque nœud s'étend sur plusieurs pages. Bien que le nombre d'opérations d'E/S reste constant, chaque E/S doit transférer beaucoup plus de données, ce qui consomme la bande passante du SSD beaucoup plus rapidement. Une fois que la bande passante devient le facteur limitant, AISAQ ne peut pas suivre le rythme de DISKANN, en particulier pour les charges de travail à haute dimension où les empreintes de données par nœud augmentent rapidement.</p>
<p><strong>Remarque :</strong></p>
<p>L'organisation du stockage d'AISAQ augmente généralement la taille de l'index sur disque de <strong>4× à 6×</strong>. Il s'agit d'un compromis délibéré : les vecteurs complets, les listes de voisins et les codes PQ sont colocalisés sur le disque pour permettre un accès efficace à une seule page lors de la recherche. Bien que cela augmente l'utilisation du SSD, la capacité du disque est nettement moins chère que celle de la DRAM et s'adapte plus facilement aux grands volumes de données.</p>
<p>Dans la pratique, les utilisateurs peuvent régler ce compromis en ajustant les taux de compression <code translate="no">INLINE_PQ</code> et PQ. Ces paramètres permettent d'équilibrer les performances de recherche, l'encombrement du disque et le coût global du système en fonction des exigences de la charge de travail, plutôt que d'être contraint par des limites de mémoire fixes.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'économie du matériel moderne est en train de changer. Les prix de la DRAM restent élevés, tandis que les performances des disques SSD ont progressé rapidement - les disques PCIe 5.0 offrent désormais une bande passante supérieure à <strong>14 Go/s.</strong> Par conséquent, les architectures qui transfèrent les données essentielles à la recherche de la DRAM coûteuse vers le stockage SSD beaucoup plus abordable deviennent de plus en plus convaincantes. La capacité des disques SSD coûtant <strong>moins de 30 fois le prix du gigaoctet par rapport à la</strong> DRAM, ces différences ne sont plus marginales - elles influencent de manière significative la conception des systèmes.</p>
<p>L'AISAQ reflète cette évolution. En éliminant le besoin d'allocations de mémoire importantes et permanentes, il permet aux systèmes de recherche vectorielle d'évoluer en fonction de la taille des données et des exigences de la charge de travail plutôt qu'en fonction des limites de la DRAM. Cette approche s'inscrit dans une tendance plus large vers des architectures "tout-en-stockage", où les disques SSD rapides jouent un rôle central non seulement dans la persistance, mais aussi dans le calcul et la recherche active. En proposant deux modes de fonctionnement - performance et échelle - AiSAQ répond aux exigences de la recherche sémantique (qui nécessite la latence la plus faible) et du RAG (qui nécessite une échelle très élevée, mais une latence modérée).</p>
<p>Il est peu probable que cette évolution se limite aux bases de données vectorielles. Des modèles de conception similaires apparaissent déjà dans le traitement des graphes, l'analyse des séries temporelles et même certaines parties des systèmes relationnels traditionnels, car les développeurs repensent les hypothèses de longue date sur l'endroit où les données doivent résider pour obtenir des performances acceptables. Les architectures de systèmes suivront l'évolution de l'économie du matériel.</p>
<p>Pour plus de détails sur les conceptions discutées ici, voir la documentation :</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentation Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentation Milvus</a></p></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">En savoir plus sur les fonctionnalités de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : recherche vectorielle abordable à l'échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d'intégration : Comment Milvus 2.6 rationalise la vectorisation et la recherche sémantique</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Déchiquetage JSON dans Milvus : filtrage JSON 88,9 fois plus rapide et flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Déverrouiller la véritable recherche au niveau de l'entité : Nouvelles fonctionnalités Array-of-Structs et MAX_SIM dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données de formation LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans tuer le rappel ?</a></p></li>
</ul>
