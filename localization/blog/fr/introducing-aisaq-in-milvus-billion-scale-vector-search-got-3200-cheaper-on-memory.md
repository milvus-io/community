---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Présentation d'AISAQ dans Milvus : la recherche vectorielle à l'échelle du
  milliard est désormais 3 200 fois moins gourmande en mémoire
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
  Découvrez comment Milvus réduit les coûts de mémoire de 3 200 fois grâce à
  AISAQ, permettant ainsi une recherche évolutive portant sur des milliards de
  vecteurs sans surcharge de la DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Les bases de données vectorielles sont devenues une infrastructure essentielle pour les systèmes d’IA critiques, et leurs volumes de données connaissent une croissance exponentielle, atteignant souvent des milliards de vecteurs. À cette échelle, tout devient plus difficile : maintenir une faible latence, préserver la précision, garantir la fiabilité et assurer le fonctionnement entre les répliques et les régions. Mais un défi tend à se poser très tôt et à dominer les décisions architecturales :<strong>le COÛT.</strong></p>
<p>Pour garantir une recherche rapide, la plupart des bases de données vectorielles conservent leurs structures d’indexation clés en DRAM (mémoire vive dynamique), le niveau de mémoire le plus rapide mais aussi le plus coûteux. Cette conception est efficace en termes de performances, mais elle s’adapte mal à l’évolutivité. L’utilisation de la DRAM évolue en fonction de la taille des données plutôt que du trafic de requêtes, et même avec la compression ou un déchargement partiel vers des SSD, une grande partie de l’index doit rester en mémoire. À mesure que les ensembles de données s’étoffent, les coûts de mémoire deviennent rapidement un facteur limitant.</p>
<p>Milvus prend déjà en charge <strong>DISKANN</strong>, une approche ANN (réseau neuronal artificiel) basée sur disque qui réduit la pression sur la mémoire en transférant une grande partie de l’index vers un SSD. Cependant, DISKANN repose toujours sur la DRAM pour les représentations compressées utilisées lors de la recherche. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> va plus loin avec <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un index vectoriel basé sur disque inspiré de <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Développée par KIOXIA, l’architecture d’AiSAQ a été conçue selon le principe « Zero-DRAM-Footprint Architecture », qui stocke toutes les données essentielles à la recherche sur disque et optimise le placement des données afin de minimiser les opérations d’E/S. Dans le cadre d’une charge de travail d’un milliard de vecteurs, cela permet de réduire l’utilisation de mémoire de <strong>32 Go à environ 10 Mo</strong>— soit une <strong>réduction de 3 200 fois</strong>— tout en conservant des performances pratiques.</p>
<p>Dans les sections suivantes, nous expliquons comment fonctionne la recherche vectorielle basée sur des graphes, d’où proviennent les coûts de mémoire, et comment AiSAQ redéfinit la courbe des coûts pour la recherche vectorielle à l’échelle du milliard.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Fonctionnement de la recherche vectorielle classique basée sur des graphes<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La recherche vectorielle</strong> consiste à trouver les points de données dont les représentations numériques sont les plus proches d’une requête dans un espace à haute dimension. « Le plus proche » signifie simplement la plus petite distance selon une fonction de distance, telle que la distance cosinus ou la distance L2. À petite échelle, le processus est simple : il suffit de calculer la distance entre la requête et chaque vecteur, puis de renvoyer les plus proches. À grande échelle, par exemple à l’échelle du milliard, cette approche devient cependant rapidement trop lente pour être pratique.</p>
<p>Pour éviter les comparaisons exhaustives, les systèmes modernes de recherche approximative du plus proche voisin (ANNS) s’appuient sur <strong>des index basés sur des graphes</strong>. Au lieu de comparer une requête à chaque vecteur, l’index organise les vecteurs en un <strong>graphe</strong>. Chaque nœud représente un vecteur, et les arêtes relient les vecteurs qui sont numériquement proches. Cette structure permet au système de réduire considérablement l’espace de recherche.</p>
<p>Le graphe est construit à l’avance, en se basant uniquement sur les relations entre les vecteurs. Il ne dépend pas des requêtes. Lorsqu’une requête arrive, la tâche du système consiste à <strong>parcourir efficacement le graphe</strong> et à identifier les vecteurs les plus proches de la requête, sans avoir à analyser l’ensemble des données.</p>
<p>La recherche commence à partir d’un <strong>point d’entrée</strong> prédéfini dans le graphe. Ce point de départ peut être éloigné de la requête, mais l’algorithme améliore sa position étape par étape en se dirigeant vers les vecteurs qui semblent plus proches de la requête. Au cours de ce processus, la recherche gère deux structures de données internes qui fonctionnent de concert : une <strong>liste de candidats</strong> et une <strong>liste de résultats</strong>.</p>
<p>Les deux étapes les plus importantes de ce processus sont l’élargissement de la liste des candidats et la mise à jour de la liste des résultats.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Élargissement de la liste des candidats</h3><p><strong>La liste des candidats</strong> représente les directions possibles pour la suite de la recherche. Il s’agit d’un ensemble hiérarchisé de nœuds du graphe qui semblent prometteurs en fonction de leur distance par rapport à la requête.</p>
<p>À chaque itération, l’algorithme :</p>
<ul>
<li><p><strong>Sélectionne le candidat le plus proche découvert jusqu’à présent.</strong> Dans la liste des candidats, il choisit le vecteur dont la distance par rapport à la requête est la plus faible.</p></li>
<li><p><strong>Récupère les voisins de ce vecteur dans le graphe.</strong> Ces voisins sont des vecteurs qui ont été identifiés lors de la construction de l’index comme étant proches du vecteur actuel.</p></li>
<li><p><strong>Évalue les voisins non visités et les ajoute à la liste des candidats.</strong> Pour chaque voisin qui n’a pas encore été exploré, l’algorithme calcule sa distance par rapport à la requête. Les voisins déjà visités sont ignorés, tandis que les nouveaux voisins sont insérés dans la liste des candidats s’ils semblent prometteurs.</p></li>
</ul>
<p>En élargissant de manière répétée la liste des candidats, la recherche explore des régions de plus en plus pertinentes du graphe. Cela permet à l’algorithme de progresser régulièrement vers de meilleures réponses tout en n’examinant qu’une petite fraction de l’ensemble des vecteurs.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Mise à jour de la liste des résultats</h3><p>Parallèlement, l’algorithme tient à jour une <strong>liste de résultats</strong>, qui recense les meilleurs candidats trouvés jusqu’à présent pour le résultat final. Au fur et à mesure que la recherche progresse, il :</p>
<ul>
<li><p><strong>Suivi des vecteurs les plus proches rencontrés au cours de la traversée.</strong> Il s’agit notamment des vecteurs sélectionnés pour l’extension ainsi que d’autres évalués en cours de route.</p></li>
<li><p><strong>Enregistre leurs distances par rapport à la requête.</strong> Cela permet de classer les candidats et de conserver les K voisins les plus proches du moment.</p></li>
</ul>
<p>Au fil du temps, à mesure que davantage de candidats sont évalués et que les améliorations se font plus rares, la liste des résultats se stabilise. Dès lors qu’il est peu probable qu’une exploration plus poussée du graphe permette de trouver des vecteurs plus proches, la recherche s’arrête et renvoie la liste des résultats comme réponse finale.</p>
<p>En termes simples, la <strong>liste des candidats contrôle l’exploration</strong>, tandis que la <strong>liste des résultats recense les meilleures réponses découvertes jusqu’à présent</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">Le compromis de la recherche vectorielle basée sur un graphe<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>C’est cette approche basée sur un graphe qui rend la recherche vectorielle à grande échelle réalisable. En parcourant le graphe plutôt qu’en analysant chaque vecteur, le système peut trouver des résultats de haute qualité tout en n’exploitant qu’une petite fraction de l’ensemble de données.</p>
<p>Cependant, cette efficacité a un coût. La recherche basée sur un graphe met en évidence un compromis fondamental entre <strong>précision et coût.</strong></p>
<ul>
<li><p>Explorer davantage de voisins améliore la précision en couvrant une plus grande partie du graphe et en réduisant le risque de passer à côté de véritables voisins les plus proches.</p></li>
<li><p>Dans le même temps, chaque extension supplémentaire entraîne une charge de travail accrue : davantage de calculs de distance, davantage d’accès à la structure du graphe et davantage de lectures de données vectorielles. À mesure que la recherche s’approfondit ou s’étend, ces coûts s’accumulent. Selon la conception de l’index, ils se traduisent par une utilisation plus importante du processeur, une pression accrue sur la mémoire ou des E/S disque supplémentaires.</p></li>
</ul>
<p>Trouver l’équilibre entre ces forces opposées — un rappel élevé face à une utilisation efficace des ressources — est au cœur de la conception de la recherche basée sur les graphes.</p>
<p><a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> et <strong>AISAQ</strong> s’articulent tous deux autour de cette même tension, mais ils font des choix architecturaux différents quant à la manière et à l’endroit où ces coûts sont pris en charge.</p>
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
<p>DISKANN est à ce jour la solution ANN sur disque la plus influente et sert de référence officielle pour le concours NeurIPS Big ANN, une référence mondiale en matière de recherche vectorielle à l’échelle du milliard. Son importance ne réside pas seulement dans ses performances, mais aussi dans ce qu’elle a démontré : <strong>la recherche ANN basée sur des graphes n’a pas besoin de résider entièrement en mémoire pour être rapide</strong>.</p>
<p>En combinant un stockage sur SSD avec des structures en mémoire soigneusement choisies, DISKANN a démontré que la recherche vectorielle à grande échelle pouvait atteindre une grande précision et une faible latence sur du matériel standard, sans nécessiter d’énormes quantités de DRAM. Pour ce faire, il redéfinit <em>quelles parties de la recherche doivent être rapides</em> et <em>lesquelles peuvent tolérer un accès plus lent</em>.</p>
<p><strong>De manière générale, DISKANN conserve en mémoire les données les plus fréquemment consultées, tout en déplaçant vers le disque les structures plus volumineuses et moins souvent utilisées.</strong> Cet équilibre est obtenu grâce à plusieurs choix de conception clés.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Utilisation des distances PQ pour étendre la liste des candidats</h3><p>L’élargissement de la liste des candidats est l’opération la plus fréquente dans la recherche basée sur des graphes. Chaque élargissement nécessite d’estimer la distance entre le vecteur de requête et les voisins d’un nœud candidat. Effectuer ces calculs à l’aide de vecteurs complets et de haute dimension nécessiterait de fréquentes lectures aléatoires sur le disque — une opération coûteuse tant sur le plan computationnel qu’en termes d’E/S.</p>
<p>DISKANN évite ce coût en compressant les vecteurs sous forme de <strong>codes de quantification de produit (PQ)</strong> et en les conservant en mémoire. Les codes PQ sont bien plus petits que les vecteurs complets, tout en conservant suffisamment d’informations pour estimer la distance de manière approximative.</p>
<p>Lors de l’extension des candidats, DISKANN calcule les distances à l’aide de ces codes PQ en mémoire au lieu de lire les vecteurs complets depuis le SSD. Cela réduit considérablement les E/S disque pendant le parcours du graphe, ce qui permet à la recherche d’étendre rapidement et efficacement les candidats tout en maintenant la majeure partie du trafic SSD hors du chemin critique.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Colocalisation des vecteurs complets et des listes de voisins sur le disque</h3><p>Toutes les données ne peuvent pas être compressées ou consultées de manière approximative. Une fois que des candidats prometteurs ont été identifiés, la recherche doit encore accéder à deux types de données pour obtenir des résultats précis :</p>
<ul>
<li><p><strong>Les listes de voisins</strong>, pour poursuivre le parcours du graphe</p></li>
<li><p><strong>Les vecteurs complets (non compressés)</strong>, pour le reclassement final</p></li>
</ul>
<p>Ces structures sont consultées moins fréquemment que les codes PQ ; DISKANN les stocke donc sur SSD. Afin de minimiser la surcharge du disque, DISKANN place la liste des voisins de chaque nœud et son vecteur complet dans la même région physique sur le disque. Cela garantit qu’une seule lecture sur le SSD permet de récupérer les deux.</p>
<p>En regroupant les données associées, DISKANN réduit le nombre d’accès aléatoires au disque nécessaires pendant la recherche. Cette optimisation améliore à la fois l’efficacité de l’expansion et du reclassement, en particulier à grande échelle.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansion parallèle des nœuds pour une meilleure utilisation du SSD</h3><p>La recherche ANN basée sur des graphes est un processus itératif. Si chaque itération n’étend qu’un seul nœud candidat, le système n’émet qu’une seule lecture de disque à la fois, laissant inutilisée la majeure partie de la bande passante parallèle du SSD. Pour éviter cette inefficacité, DISKANN étend plusieurs candidats à chaque itération et envoie des requêtes de lecture parallèles au SSD. Cette approche exploite bien mieux la bande passante disponible et réduit le nombre total d’itérations nécessaires.</p>
<p>Le paramètre <strong>`beam_width_ratio`</strong> contrôle le nombre de nœuds candidats développés en parallèle : <strong>largeur du faisceau = nombre de cœurs de processeur × `beam_width_ratio`.</strong> Un ratio plus élevé élargit la recherche — ce qui peut améliorer la précision — mais augmente également la charge de calcul et les E/S disque.</p>
<p>Pour compenser cela, DISKANN intègre un mécanisme de mise en cache ( <code translate="no">search_cache_budget_gb_ratio</code> ) qui réserve de la mémoire pour mettre en cache les données fréquemment consultées, réduisant ainsi les lectures répétées sur le SSD. Ensemble, ces mécanismes aident DISKANN à trouver un équilibre entre précision, latence et efficacité des E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Pourquoi est-ce important — et où se situent les limites ?</h3><p>La conception de DISKANN constitue une avancée majeure pour la recherche vectorielle sur disque. En conservant les codes PQ en mémoire et en transférant les structures plus volumineuses vers le SSD, elle réduit considérablement l’empreinte mémoire par rapport aux index de graphes entièrement en mémoire.</p>
<p>Dans le même temps, cette architecture reste tributaire d’ <strong>une DRAM toujours active</strong> pour les données critiques pour la recherche. Les codes PQ, les caches et les structures de contrôle doivent rester résidents en mémoire pour garantir l’efficacité du parcours. À mesure que les ensembles de données atteignent des milliards de vecteurs et que les déploiements ajoutent des répliques ou des régions, ces besoins en mémoire peuvent encore devenir un facteur limitant.</p>
<p>C’est cette lacune qu’ <strong>AISAQ</strong> a pour vocation de combler.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Fonctionnement d’AISAQ et importance de cette solution<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ s’appuie directement sur les principes fondamentaux de DISKANN, mais introduit un changement majeur : il élimine <strong>la nécessité de conserver les données PQ en DRAM</strong>. Au lieu de traiter les vecteurs compressés comme des structures essentielles à la recherche et devant rester en mémoire en permanence, AISAQ les transfère sur des SSD et repense la disposition des données de graphe sur le disque afin de préserver l’efficacité de la traversée.</p>
<p>Pour que cela fonctionne, AISAQ réorganise le stockage des nœuds de manière à ce que les données nécessaires à la recherche dans le graphe — vecteurs complets, listes de voisins et informations PQ — soient disposées sur le disque selon des schémas optimisés pour la localité d’accès. L’objectif n’est pas seulement de transférer davantage de données vers le disque, plus économique, mais de le faire <strong>sans perturber le processus de recherche décrit précédemment</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour répondre aux différentes exigences des applications, AISAQ propose deux modes de stockage sur disque : « Performance » et « Scale ». D’un point de vue technique, ces modes diffèrent principalement par la manière dont les données compressées au format PQ sont stockées et consultées lors de la recherche. Du point de vue des applications, ces modes répondent à deux types d’exigences distincts : les exigences de faible latence, typiques des systèmes de recherche sémantique et de recommandation en ligne, et les exigences d’échelle ultra-élevée, typiques du RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance : optimisé pour la vitesse</h3><p>AISAQ-performance conserve toutes les données sur disque tout en maintenant une faible surcharge d’E/S grâce à la colocalisation des données.</p>
<p>Dans ce mode :</p>
<ul>
<li><p>le vecteur complet de chaque nœud, sa liste d’arêtes et les codes PQ de ses voisins sont stockés ensemble sur le disque.</p></li>
<li><p>L’accès à un nœud ne nécessite toujours qu’une <strong>seule lecture sur SSD</strong>, car toutes les données nécessaires à l’expansion et à l’évaluation des candidats sont colocalisées.</p></li>
</ul>
<p>Du point de vue de l’algorithme de recherche, cela reflète étroitement le modèle d’accès de DISKANN. L’expansion des candidats reste efficace et les performances d’exécution sont comparables, même si toutes les données essentielles à la recherche se trouvent désormais sur le disque.</p>
<p>Le compromis réside dans la surcharge de stockage. Étant donné que les données PQ d’un voisin peuvent apparaître dans les pages disque de plusieurs nœuds, cette disposition introduit une redondance et augmente considérablement la taille globale de l’index.</p>
<p>Par conséquent, le mode AISAQ-Performance privilégie une faible latence d’E/S au détriment de l’efficacité du disque. Du point de vue de l’application, le mode AISAQ-Performance peut offrir une latence de l’ordre de 10 ms, comme l’exige la recherche sémantique en ligne.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale : optimisé pour l’efficacité du stockage</h3><p>AISAQ-Scale adopte l’approche inverse. Il est conçu pour <strong>minimiser l’utilisation du disque</strong> tout en conservant l’intégralité des données sur SSD.</p>
<p>Dans ce mode :</p>
<ul>
<li><p>les données PQ sont stockées séparément sur le disque, sans redondance.</p></li>
<li><p>Cela élimine la redondance et réduit considérablement la taille de l’index.</p></li>
</ul>
<p>En contrepartie, l’accès aux codes PQ d’un nœud et de ses voisins peut nécessiter <strong>plusieurs lectures sur le SSD</strong>, ce qui augmente les opérations d’E/S lors de l’expansion des candidats. Sans optimisation, cela ralentirait considérablement la recherche.</p>
<p>Pour maîtriser cette surcharge, le mode AISAQ-Scale introduit deux optimisations supplémentaires :</p>
<ul>
<li><p><strong>Le réagencement des données PQ</strong>, qui classe les vecteurs PQ par ordre de priorité d’accès afin d’améliorer la localité et de réduire les lectures aléatoires.</p></li>
<li><p><strong>Un cache PQ en DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), qui stocke les données PQ fréquemment consultées et évite les lectures répétées sur le disque pour les entrées les plus sollicitées.</p></li>
</ul>
<p>Grâce à ces optimisations, le mode AISAQ-Scale offre une bien meilleure efficacité de stockage que le mode AISAQ-Performance, tout en conservant des performances de recherche satisfaisantes. Ces performances restent inférieures à celles de DISKANN, mais il n’y a pas de surcharge de stockage (la taille de l’index est similaire à celle de DISKANN) et l’empreinte mémoire est considérablement réduite. Du point de vue des applications, AiSAQ offre les moyens de répondre aux exigences RAG à très grande échelle.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Principaux avantages d’AISAQ</h3><p>En transférant toutes les données essentielles à la recherche sur le disque et en repensant la manière dont ces données sont consultées, AISAQ modifie fondamentalement le profil de coût et d’évolutivité de la recherche vectorielle basée sur des graphes. Sa conception offre trois avantages significatifs.</p>
<p><strong>1. Une utilisation de la DRAM jusqu’à 3 200 fois inférieure</strong></p>
<p>La quantification de produit (Product Quantization) réduit considérablement la taille des vecteurs de haute dimension, mais à l’échelle du milliard, l’empreinte mémoire reste importante. Même après compression, les codes PQ doivent être conservés en mémoire pendant la recherche dans les architectures conventionnelles.</p>
<p>Par exemple, sur <strong>SIFT1B</strong>, un benchmark comprenant un milliard de vecteurs à 128 dimensions, les codes PQ à eux seuls nécessitent environ <strong>30 à 120 Go de DRAM</strong>, selon la configuration. Le stockage des vecteurs complets et non compressés nécessiterait <strong> environ 480 Go</strong> supplémentaires. Bien que la quantification PQ réduise l’utilisation de la mémoire de 4 à 16 fois, l’empreinte restante reste suffisamment importante pour peser lourdement sur le coût de l’infrastructure.</p>
<p>AISAQ supprime entièrement cette exigence. En stockant les codes PQ sur un SSD plutôt que dans la DRAM, la mémoire n’est plus consommée par les données d’index persistantes. La DRAM n’est utilisée que pour des structures légères et transitoires telles que les listes de candidats et les métadonnées de contrôle. En pratique, cela réduit l’utilisation de la mémoire de plusieurs dizaines de gigaoctets à <strong>environ 10 Mo</strong>. Dans une configuration représentative à l’échelle du milliard, la DRAM passe de <strong>32 Go à 10 Mo</strong>, soit une <strong>réduction de 3 200 fois</strong>.</p>
<p>Étant donné que le stockage sur SSD coûte environ <strong>1/30e du prix unitaire de capacité</strong> par rapport à la DRAM, cette évolution a un impact direct et considérable sur le coût total du système.</p>
<p><strong>2. Aucune surcharge d’E/S supplémentaire</strong></p>
<p>Le transfert des codes PQ de la mémoire vers le disque augmenterait normalement le nombre d’opérations d’E/S pendant la recherche. AISAQ évite cela en contrôlant minutieusement <strong>la disposition des données et les schémas d’accès</strong>. Plutôt que de disperser les données associées sur le disque, AISAQ regroupe les codes PQ, les vecteurs complets et les listes de voisins afin qu’ils puissent être récupérés ensemble. Cela garantit que l’expansion des candidats n’entraîne pas de lectures aléatoires supplémentaires.</p>
<p>Afin de permettre aux utilisateurs de contrôler le compromis entre la taille de l’index et l’efficacité des E/S, AISAQ introduit le paramètre « <code translate="no">inline_pq</code> », qui détermine la quantité de données PQ stockées en ligne avec chaque nœud :</p>
<ul>
<li><p><strong>Valeur faible d’`inline_pq` :</strong> taille d’index réduite, mais peut nécessiter des E/S supplémentaires</p></li>
<li><p><strong>Valeur plus élevée d’`inline_pq` :</strong> taille d’index plus importante, mais préserve l’accès en une seule lecture</p></li>
</ul>
<p>Lorsqu’il est configuré avec <strong>`inline_pq = max_degree</strong>`, AISAQ lit le vecteur complet d’un nœud, sa liste de voisins et tous les codes PQ en une seule opération disque, reproduisant ainsi le modèle d’E/S de DISKANN tout en conservant toutes les données sur SSD.</p>
<p><strong>3. L’accès séquentiel aux PQ améliore l’efficacité des calculs</strong></p>
<p>Dans DISKANN, l’expansion d’un nœud candidat nécessite R accès aléatoires en mémoire pour récupérer les codes PQ de ses R voisins. AISAQ élimine ce caractère aléatoire en récupérant tous les codes PQ en une seule opération d’E/S et en les stockant de manière séquentielle sur le disque.</p>
<p>La disposition séquentielle offre deux avantages importants :</p>
<ul>
<li><p><strong>Les lectures séquentielles sur SSD sont bien plus rapides</strong> que les lectures aléatoires dispersées.</p></li>
<li><p><strong>Les données contiguës sont mieux adaptées au cache</strong>, ce qui permet aux processeurs de calculer les distances PQ plus efficacement.</p></li>
</ul>
<p>Cela améliore à la fois la vitesse et la prévisibilité des calculs de distance PQ et contribue à compenser le coût en termes de performances lié au stockage des codes PQ sur un SSD plutôt que dans la DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs DISKANN : évaluation des performances<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir compris en quoi AISAQ diffère de DISKANN sur le plan architectural, la question suivante s’impose : <strong>comment ces choix de conception affectent-ils les performances et l’utilisation des ressources dans la pratique ?</strong> Cette évaluation compare AISAQ et DISKANN selon trois critères essentiels à l’échelle du milliard : <strong>les performances de recherche, la consommation de mémoire et l’utilisation du disque</strong>.</p>
<p>Nous examinons en particulier le comportement d’AISAQ lorsque la quantité de données PQ intégrées (<code translate="no">INLINE_PQ</code>) varie. Ce paramètre contrôle directement le compromis entre la taille de l’index, les E/S disque et l’efficacité d’exécution. Nous évaluons également ces deux approches sur <strong>des charges de travail vectorielles de faible et de haute dimension, car la dimensionnalité influence fortement le coût du calcul de distance et</strong> les besoins en stockage.</p>
<h3 id="Setup" class="common-anchor-header">Configuration</h3><p>Toutes les expériences ont été menées sur un système à nœud unique afin d’isoler le comportement de l’index et d’éviter toute interférence due au réseau ou aux effets propres aux systèmes distribués.</p>
<p><strong>Configuration matérielle :</strong></p>
<ul>
<li><p>Processeur : AMD EPYC 9454P à 2,70 GHz</p></li>
<li><p>Mémoire : vitesse : 3 200 MT/s, type : DDR4, capacité : 384 Go</p></li>
<li><p>Disque : SSD<sup>NVMe™</sup> KIOXIA CM7 de 7,68 To</p></li>
</ul>
<p><h6><em>AMD EPYC est une marque déposée d’Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe est une marque déposée ou non déposée de NVM Express, Inc. aux États-Unis et dans d'autres pays.</em></h6></p>
<p><strong>Paramètres de création d'index</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paramètres de requête</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Méthode de benchmark</h3><p>DISKANN et AISAQ ont tous deux été testés à l’aide de <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, le moteur de recherche vectorielle open source utilisé dans Milvus. Deux jeux de données ont été utilisés dans cette évaluation :</p>
<ul>
<li><p><strong>SIFT128D (1 million de vecteurs) :</strong> un benchmark bien connu à 128 dimensions, couramment utilisé pour la recherche de descripteurs d’images. <em>(Taille brute du jeu de données ≈ 488 Mo)</em></p></li>
<li><p><strong>Cohere768D (1 million de vecteurs) :</strong> un ensemble d’embeddings à 768 dimensions typique de la recherche sémantique basée sur les transformateurs. <em>(Taille brute du jeu de données ≈ 2 930 Mo)</em></p></li>
</ul>
<p>Ces ensembles de données reflètent deux scénarios concrets distincts : les caractéristiques visuelles compactes et les représentations sémantiques de grande taille.</p>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p><strong>Sift128D1M (vecteur complet ~488 Mo)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Graphique comparatif entre le taux de rappel SIFT et la latence</span>
  
 </span></p>
<p><strong>Cohere768D1M (vecteur complet ~2 930 Mo)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Graphique représentant le rappel de Cohere en fonction de la latence</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Analyse</h3><p><strong>Ensemble de données SIFT128D</strong></p>
<p>Sur le jeu de données SIFT128D, AISAQ peut égaler les performances de DISKANN lorsque toutes les données PQ sont intégrées en ligne, de sorte que les données requises par chaque nœud tiennent entièrement dans une seule page SSD de 4 Ko (INLINE_PQ = 48). Dans cette configuration, toutes les informations nécessaires à la recherche sont regroupées au même endroit :</p>
<ul>
<li><p>Vecteur complet : 512 octets</p></li>
<li><p>Liste des voisins : 48 × 4 + 4 = 196 octets</p></li>
<li><p>Codes PQ des voisins : 48 × (512 octets × 0,125) ≈ 3 072 octets</p></li>
<li><p>Total : 3 780 octets</p></li>
</ul>
<p>Comme le nœud entier tient dans une seule page, une seule opération d’E/S est nécessaire par accès, et AISAQ évite les lectures aléatoires de données PQ externes.</p>
<p>Cependant, lorsque seule une partie des données PQ est intégrée, les codes PQ restants doivent être récupérés ailleurs sur le disque (le paramètre inline_pq a été défini pour optimiser l’utilisation des pages du SSD ; par exemple, inline_pq = 20 permet de faire tenir deux nœuds dans une seule page de 4 Ko). Cela entraîne des opérations d’E/S aléatoires supplémentaires, ce qui augmente considérablement la demande en IOPS et entraîne une baisse des performances.</p>
<p><strong>Ensemble de données Cohere768D</strong></p>
<p>Sur l’ensemble de données Cohere768D, AISAQ affiche des performances inférieures d’environ 8 % à celles de DISKANN. La raison en est qu’un vecteur de 768 dimensions ne tient tout simplement pas dans une seule page SSD de 4 Ko :</p>
<ul>
<li><p>Vecteur complet : 3 072 octets</p></li>
<li><p>Liste des voisins : 48 × 4 + 4 = 196 octets</p></li>
<li><p>Codes PQ des voisins : 48 × (3 072 octets × 0,04167) ≈ 6 144 octets</p></li>
<li><p>Total : 9 412 octets (≈ 3 pages)</p></li>
</ul>
<p>Dans ce cas, même si tous les codes PQ sont intégrés, chaque nœud s’étend sur plusieurs pages. Bien que le nombre d’opérations d’E/S reste constant, chaque E/S doit transférer beaucoup plus de données, ce qui épuise la bande passante du SSD beaucoup plus rapidement. Dès que la bande passante devient le facteur limitant, AISAQ ne peut plus rivaliser avec DISKANN, en particulier sur des charges de travail à haute dimension où l’empreinte de données par nœud augmente rapidement.</p>
<p><strong>Remarque :</strong></p>
<p>la disposition de stockage d’AISAQ multiplie généralement la taille de l’index sur disque par <strong>3 à 5</strong>. Il s’agit d’un compromis délibéré : les vecteurs complets, les listes de voisins et les codes PQ sont regroupés sur le disque afin de permettre un accès efficace à une seule page lors de la recherche. Bien que cela augmente l’utilisation du SSD, la capacité de stockage sur disque est nettement moins coûteuse que la DRAM et s’adapte plus facilement à de grands volumes de données.</p>
<p>En pratique, les utilisateurs peuvent ajuster ce compromis en modifiant les taux de compression de l’ <code translate="no">INLINE_PQ</code> e et du PQ. Ces paramètres permettent d’équilibrer les performances de recherche, l’empreinte disque et le coût global du système en fonction des exigences de la charge de travail, plutôt que d’être limités par des contraintes de mémoire fixes.</p>
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
    </button></h2><p>L’économie du matériel moderne est en pleine mutation. Les prix de la DRAM restent élevés, tandis que les performances des SSD ont progressé rapidement : les disques PCIe 5.0 offrent désormais une bande passante supérieure à <strong>14 Go/s</strong>. En conséquence, les architectures qui transfèrent les données critiques pour la recherche de la DRAM, coûteuse, vers un stockage SSD bien plus abordable deviennent de plus en plus intéressantes. La capacité des SSD coûtant <strong>moins de 30 fois plus cher par gigaoctet que</strong> la DRAM, ces différences ne sont plus marginales : elles influencent de manière significative la conception des systèmes.</p>
<p>AISAQ reflète cette évolution. En éliminant le besoin d’allocations de mémoire importantes et en permanence actives, il permet aux systèmes de recherche vectorielle d’évoluer en fonction de la taille des données et des exigences de la charge de travail plutôt qu’en fonction des limites de la DRAM. Cette approche s’inscrit dans une tendance plus large vers des architectures « tout en stockage », où les SSD rapides jouent un rôle central non seulement dans la persistance, mais aussi dans le calcul actif et la recherche. En proposant deux modes de fonctionnement – « Performance » et « Scale » –, AiSAQ répond à la fois aux exigences de la recherche sémantique (qui nécessite la latence la plus faible) et du RAG (qui nécessite une très grande évolutivité, mais une latence modérée).</p>
<p>Cette évolution ne devrait pas se limiter aux bases de données vectorielles. Des modèles de conception similaires apparaissent déjà dans le traitement des graphes, l’analyse des séries chronologiques et même dans certaines parties des systèmes relationnels traditionnels, à mesure que les développeurs remettent en question les hypothèses de longue date concernant l’emplacement où les données doivent résider pour atteindre des performances acceptables. À mesure que l’économie du matériel continue d’évoluer, les architectures système suivront.</p>
<p>Pour plus de détails sur les conceptions abordées ici, consultez la documentation :</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentation Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentation Milvus</a></p></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou signalez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions via<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> les « Milvus Office Hours</a> ».</p>
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : une recherche vectorielle abordable à l’échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d’embedding : comment Milvus 2.6 optimise la vectorisation et la recherche sémantique</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Le « JSON Shredding » dans Milvus : un filtrage JSON 88,9 fois plus rapide et plus flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Débloquer une véritable recherche au niveau des entités : nouvelles fonctionnalités « Array-of-Structs » et « MAX_SIM » dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l’arme secrète pour lutter contre les doublons dans les données d’entraînement des modèles de langage à grande échelle (LLM) </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Pousser la compression vectorielle à l’extrême : comment Milvus traite 3 fois plus de requêtes grâce à RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent — les bases de données vectorielles méritent un véritable test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par Woodpecker pour Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans nuire au taux de rappel</a></p></li>
</ul>
