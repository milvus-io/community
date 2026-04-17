---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: Paper Reading｜HM-ANN Quand l'ANNS rencontre la mémoire hétérogène
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Recherche efficace du plus proche voisin en un milliard de points sur
  une mémoire hétérogène
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Lecture d'articles ｜ HM-ANN : Quand l'ANNS rencontre la mémoire hétérogène</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN : Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a> est un article de recherche qui a été accepté à la 2020 Conference on Neural Information Processing Systems<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>). Cet article propose un nouvel algorithme de recherche de similarités basé sur les graphes, appelé HM-ANN. Cet algorithme tient compte de l'hétérogénéité de la mémoire et des données dans un environnement matériel moderne. HM-ANN permet une recherche de similarité à l'échelle du milliard sur une seule machine sans technologies de compression. La mémoire hétérogène (HM) représente la combinaison d'une mémoire vive dynamique (DRAM) rapide mais petite et d'une mémoire persistante (PMem) lente mais grande. L'algorithme HM-ANN permet d'obtenir une faible latence de recherche et une grande précision de recherche, en particulier lorsque l'ensemble de données ne peut pas tenir dans la DRAM. L'algorithme présente un avantage certain par rapport aux solutions de recherche approximative du plus proche voisin (ANN) de l'état de l'art.</p>
<custom-h1>Motivation</custom-h1><p>Depuis leur création, les algorithmes de recherche ANN ont posé un compromis fondamental entre la précision et la latence des requêtes en raison de la capacité limitée de la DRAM. Pour stocker des index dans la DRAM afin d'accéder rapidement aux requêtes, il est nécessaire de limiter le nombre de points de données ou de stocker des vecteurs compressés, ce qui nuit à la précision de la recherche. Les index basés sur les graphes (par exemple Hierarchical Navigable Small World, HNSW) ont des performances et une précision d'interrogation supérieures. Toutefois, ces index peuvent également consommer 1 To de DRAM lorsqu'ils sont utilisés sur des ensembles de données à l'échelle du milliard.</p>
<p>Il existe d'autres solutions pour éviter que la DRAM ne stocke des ensembles de données à l'échelle du milliard dans un format brut. Lorsqu'un ensemble de données est trop volumineux pour tenir dans la mémoire d'une seule machine, des approches compressées telles que la quantification des produits des points de l'ensemble de données sont utilisées. Mais le rappel de ces index avec l'ensemble de données compressé est normalement faible en raison de la perte de précision lors de la quantification. Subramanya et al [1] étudient la possibilité d'exploiter les disques d'état solide (SSD) pour effectuer des recherches ANN à l'échelle du milliard à l'aide d'une seule machine dans le cadre d'une approche appelée Disk-ANN, dans laquelle l'ensemble de données brutes est stocké sur SSD et la représentation compressée sur DRAM.</p>
<custom-h1>Introduction à la mémoire hétérogène</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>La mémoire hétérogène (HM) représente la combinaison d'une DRAM rapide mais petite et d'une PMem lente mais grande. La DRAM est un matériel normal que l'on trouve dans tous les serveurs modernes, et son accès est relativement rapide. Les nouvelles technologies PMem, telles que les modules de mémoire persistante Intel® Optane™ DC, comblent le fossé entre la mémoire flash à base de NAND (SSD) et la DRAM, éliminant ainsi le goulet d'étranglement des E/S. La PMem est durable comme le SSD, et directement adressable par le CPU, comme la mémoire. Renen et al [2] ont découvert que la bande passante de lecture du PMem est 2,6 fois plus faible et la bande passante d'écriture 7,5 fois plus faible que celle de la DRAM dans l'environnement expérimental configuré.</p>
<custom-h1>Conception de HM-ANN</custom-h1><p>HM-ANN est un algorithme de recherche ANN précis et rapide à l'échelle du milliard qui fonctionne sur une seule machine sans compression. La conception de HM-ANN généralise l'idée de HNSW, dont la structure hiérarchique s'intègre naturellement dans HM. HNSW se compose de plusieurs couches - seule la couche 0 contient l'ensemble des données, et chaque couche restante contient un sous-ensemble d'éléments de la couche qui lui est directement inférieure.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Les éléments des couches supérieures, qui ne contiennent que des sous-ensembles de l'ensemble de données, ne consomment qu'une petite partie de l'ensemble de l'espace de stockage. Cette observation fait d'eux de bons candidats pour être placés dans la mémoire vive (DRAM). De cette manière, la majorité des recherches sur HM-ANN devraient se produire dans les couches supérieures, ce qui maximise l'utilisation de la caractéristique d'accès rapide de la DRAM. Toutefois, dans le cas de HNSW, la plupart des recherches sont effectuées dans la couche inférieure.</li>
<li>Comme l'accès à la couche 0 est plus lent, il est préférable que chaque requête n'accède qu'à une petite partie et que la fréquence d'accès soit réduite.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algorithme de construction de graphe<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>L'idée clé de la construction de HM-ANN est de créer des couches supérieures de haute qualité, afin de fournir une meilleure navigation pour la recherche à la couche 0. Ainsi, la plupart des accès à la mémoire se font dans la DRAM, et l'accès dans le PMem est réduit. Pour ce faire, l'algorithme de construction de HM-ANN comporte une phase d'insertion descendante et une phase de promotion ascendante.</p>
<p>La phase d'insertion descendante construit un graphe de petit monde navigable au fur et à mesure que la couche la plus basse est placée sur le PMem.</p>
<p>La phase de promotion ascendante promeut les points de pivot de la couche inférieure pour former des couches supérieures qui sont placées sur la DRAM sans perdre beaucoup de précision. Si une projection de haute qualité des éléments de la couche 0 est créée dans la couche 1, la recherche dans la couche 0 trouve les voisins les plus proches de la requête avec seulement quelques sauts.</p>
<ul>
<li>Au lieu d'utiliser la sélection aléatoire de HNSW pour la promotion, HM-ANN utilise une stratégie de promotion à haut degré pour promouvoir les éléments ayant le degré le plus élevé dans la couche 0 vers la couche 1. Pour les couches supérieures, HM-ANN promeut les nœuds à haut degré vers la couche supérieure sur la base d'un taux de promotion.</li>
<li>HM-ANN promeut davantage de nœuds de la couche 0 à la couche 1 et fixe un nombre maximal de voisins plus élevé pour chaque élément de la couche 1. Le nombre de nœuds dans les couches supérieures est déterminé par l'espace DRAM disponible. Étant donné que la couche 0 n'est pas stockée dans la DRAM, la densification de chaque couche stockée dans la DRAM augmente la qualité de la recherche.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Algorithme de recherche de graphes<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>L'algorithme de recherche se compose de deux phases : la recherche rapide en mémoire et la recherche parallèle de la couche 0 avec préchargement.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Recherche en mémoire rapide</h3><p>Comme dans HNSW, la recherche en DRAM commence au point d'entrée dans la couche supérieure et effectue ensuite une recherche 1-greedy de la couche supérieure à la couche 2. Pour réduire l'espace de recherche dans la couche 0, HM-ANN effectue la recherche dans la couche 1 avec un budget de recherche de <code translate="no">efSearchL1</code>, ce qui limite la taille de la liste des candidats dans la couche 1. Ces candidats de la liste sont utilisés comme points d'entrée multiples pour la recherche dans la couche 0, afin d'améliorer la qualité de la recherche dans la couche 0. Alors que HNSW n'utilise qu'un seul point d'entrée, l'écart entre la couche 0 et la couche 1 est traité de manière plus spéciale dans HM-ANN que les écarts entre les deux autres couches.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Recherche parallèle dans la couche 0 avec préchargement</h3><p>Dans la couche inférieure, HM-ANN répartit uniformément les candidats susmentionnés de la recherche de la couche 1 et les considère comme des points d'entrée pour effectuer une recherche parallèle multidébut à 1 degré avec des threads. Les meilleurs candidats de chaque recherche sont rassemblés pour trouver les meilleurs candidats. Comme on le sait, descendre de la couche 1 à la couche 0 revient exactement à passer par le PMem. La recherche parallèle masque la latence du PMem et utilise au mieux la bande passante de la mémoire, afin d'améliorer la qualité de la recherche sans augmenter le temps de recherche.</p>
<p>HM-ANN met en œuvre une mémoire tampon gérée par logiciel dans la DRAM pour prélever les données du PMem avant l'accès à la mémoire. Lors de la recherche dans la couche 1, HM-ANN copie de manière asynchrone les éléments voisins des candidats sur <code translate="no">efSearchL1</code> et les connexions des éléments voisins dans la couche 1 de PMem vers la mémoire tampon. Lors de la recherche dans la couche 0, une partie des données à accéder est déjà préréglée dans la DRAM, ce qui masque le temps de latence pour accéder à la PMem et permet de réduire le temps d'interrogation. Cela correspond à l'objectif de conception de HM-ANN, où la plupart des accès à la mémoire se font dans la DRAM et où les accès à la mémoire dans le PMem sont réduits.</p>
<custom-h1>Évaluation</custom-h1><p>Le présent document procède à une évaluation approfondie. Toutes les expériences sont réalisées sur une machine équipée d'un processeur Intel Xeon Gold 6252 CPU@2.3GHz. Elle utilise de la DDR4 (96 Go) comme mémoire rapide et de l'Optane DC PMM (1,5 To) comme mémoire lente. Cinq ensembles de données sont évalués : BIGANN, DEEP1B, SIFT1M, DEEP1M et GIST1M. Pour les tests à l'échelle du milliard, les schémas suivants sont inclus : les méthodes basées sur la quantification à l'échelle du milliard (IMI+OPQ et L&amp;C), les méthodes non basées sur la compression (HNSW et NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Comparaison des algorithmes à l'échelle du milliard<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Le tableau 1 compare le temps de construction et le stockage de différents index basés sur les graphes. HNSW prend le temps de construction le plus court et HM-ANN nécessite 8 % de temps supplémentaire par rapport à HNSW. En termes d'utilisation totale du stockage, les index HM-ANN sont 5 à 13 % plus grands que HSNW, car ils font passer plus de nœuds de la couche 0 à la couche 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>La figure 1 présente l'analyse des performances des différents index en matière d'interrogation. Les figures 1 (a) et (b) montrent que HM-ANN atteint un rappel top-1 de &gt; 95 % en 1 ms. Les figures 1 © et (d) montrent que HM-ANN obtient un rappel top-100 de &gt; 90 % en 4 ms. HM-ANN offre les meilleures performances en termes de latence et de rappel que toutes les autres approches.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Comparaison des algorithmes à l'échelle du million<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>Dans la figure 2, les performances des requêtes de différents index sont analysées dans un environnement DRAM pur. HNSW, NSG et HM-ANN sont évalués avec les trois ensembles de données à l'échelle du million adaptés à la DRAM. HM-ANN obtient toujours de meilleures performances d'interrogation que HNSW. La raison en est que le nombre total de calculs de distance de HM-ANN est inférieur (en moyenne 850/requête) à celui de HNSW (en moyenne 900/requête) pour atteindre l'objectif de rappel de 99 %.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Efficacité de la promotion à haut degré<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans la figure 3, les stratégies de promotion aléatoire et de promotion à haut degré sont comparées dans la même configuration. La promotion de haut degré est plus performante que la stratégie de base. Elle est 1,8 fois, 4,3 fois et 3,9 fois plus rapide que la promotion aléatoire pour atteindre les objectifs de rappel de 95 %, 99 % et 99,5 %, respectivement.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Avantages des techniques de gestion de la mémoire en termes de performances<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>La figure 5 contient une série d'étapes entre HNSW et HM-ANN pour montrer comment chaque optimisation de HM-ANN contribue à ses améliorations. BP représente la promotion ascendante lors de la construction de l'index. PL0 correspond à la recherche parallèle de la couche 0, tandis que DP correspond à l'extraction préalable des données du PMem vers la DRAM. Étape par étape, les performances de recherche de HM-ANN sont améliorées.</p>
<custom-h1>Conclusion</custom-h1><p>Un nouvel algorithme d'indexation et de recherche basé sur les graphes, appelé HM-ANN, associe la conception hiérarchique des ANN basés sur les graphes à l'hétérogénéité de la mémoire dans HM. Les évaluations montrent que HM-ANN fait partie des nouveaux index de pointe dans des ensembles de données d'un milliard de points.</p>
<p>Nous remarquons une tendance dans le monde universitaire et dans l'industrie, où l'on se concentre sur la construction d'index sur des dispositifs de stockage persistants. Pour alléger la pression de la DRAM, Disk-ANN [1] est un index construit sur SSD, dont le débit est nettement inférieur à celui de PMem. Cependant, la construction de HM-ANN prend encore quelques jours, sans qu'il y ait d'énormes différences par rapport à Disk-ANN. Nous pensons qu'il est possible d'optimiser le temps de construction de HM-ANN en utilisant les caractéristiques de PMem avec plus de soin, par exemple en étant conscient de la granularité de PMem (256 octets) et en utilisant l'instruction de streaming pour contourner les lignes de cache. Nous pensons également que d'autres approches avec des dispositifs de stockage durables seront proposées à l'avenir.</p>
<custom-h1>Références</custom-h1><p>[1] : Suhas Jayaram Subramanya et Devvrit et Rohan Kadekodi et Ravishankar Krishaswamy et Ravishankar Krishaswamy : DiskANN : Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS, 2019 (en anglais)</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN : Fast Accurate Billion-point Nearest Neighbor Search on a Single Node - Microsoft Research (en anglais)</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN : Recherche rapide et précise de voisinages en milliards de points sur un seul nœud</a></p>
<p>[2] : Alexander van Renen et Lukas Vogel et Viktor Leis et Thomas Neumann et Alfons Kemper : Persistent Memory I/O Primitives, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Primitives d'E/S à mémoire persistante</a></p>
