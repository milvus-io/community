---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: >-
  Comprendre les petits mondes navigables hiérarchiques (HNSW) pour la recherche
  vectorielle
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) est un algorithme efficace pour la
  recherche approximative du plus proche voisin à l'aide d'une structure
  graphique en couches.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>L'opération clé des <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de données vectorielles</a> est la <em>recherche de similarité</em>, qui consiste à trouver dans la base de données les voisins les plus proches d'un vecteur d'interrogation, par exemple par la distance euclidienne. Une méthode naïve consisterait à calculer la distance entre le vecteur de la requête et chaque vecteur stocké dans la base de données et à retenir les K vecteurs les plus proches. Toutefois, cette méthode n'est pas adaptée à la taille de la base de données. Dans la pratique, une recherche de similarité naïve n'est pratique que pour les bases de données contenant moins d'un million de vecteurs. Comment pouvons-nous étendre notre recherche à des dizaines et des centaines de millions, voire à des milliards de vecteurs ?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Descente dans la hiérarchie des indices de recherche vectorielle</em></p>
<p>De nombreux algorithmes et structures de données ont été développés pour adapter la recherche de similarités dans des espaces vectoriels de haute dimension à une complexité temporelle sous-linéaire. Dans cet article, nous expliquerons et mettrons en œuvre une méthode populaire et efficace appelée Hierarchical Navigable Small Worlds (HNSW), qui est souvent le choix par défaut pour les ensembles de données vectorielles de taille moyenne. Elle appartient à la famille des méthodes de recherche qui construisent un graphe sur les vecteurs, où les sommets représentent les vecteurs et les arêtes la similarité entre eux. La recherche est effectuée en naviguant dans le graphe, dans le cas le plus simple, en parcourant avec avidité le voisin du nœud actuel qui est le plus proche de la requête et en répétant l'opération jusqu'à ce qu'un minimum local soit atteint.</p>
<p>Nous expliquerons plus en détail comment le graphe de recherche est construit, comment le graphe permet la recherche, et à la fin, un lien vers une implémentation HNSW, par votre serviteur, en Python simple.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Petits mondes navigables<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Graphe NSW créé à partir de 100 points 2D situés au hasard.</em></p>
<p>Comme nous l'avons mentionné, HNSW construit un graphe de recherche hors ligne avant que nous puissions effectuer une requête. L'algorithme s'appuie sur des travaux antérieurs, une méthode appelée Navigable Small Worlds (NSW). Nous expliquerons d'abord les NGS et il sera ensuite facile de passer aux NGS <em>hiérarchiques</em>. L'illustration ci-dessus représente un graphe de recherche construit pour le NGS sur des vecteurs bidimensionnels. Dans tous les exemples ci-dessous, nous nous limitons à des vecteurs bidimensionnels afin de pouvoir les visualiser.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construction du graphe<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Un NGS est un graphe dont les sommets représentent des vecteurs et dont les arêtes sont construites de manière heuristique à partir de la similarité entre les vecteurs, de sorte que la plupart des vecteurs sont accessibles de n'importe où via un petit nombre de sauts. C'est ce qu'on appelle la propriété du "petit monde", qui permet une navigation rapide. Voir la figure ci-dessus.</p>
<p>Le graphe est initialisé pour être vide. Nous itérons à travers les vecteurs, en ajoutant chacun d'entre eux au graphe à tour de rôle. Pour chaque vecteur, à partir d'un nœud d'entrée aléatoire, nous trouvons avec avidité les nœuds R les plus proches accessibles à partir du point d'entrée <em>dans le graphe construit jusqu'à présent</em>. Ces nœuds R sont ensuite connectés à un nouveau nœud représentant le vecteur inséré, en élaguant éventuellement les nœuds voisins qui ont maintenant plus de R voisins. En répétant ce processus pour tous les vecteurs, on obtient le graphe NGS. Voir l'illustration ci-dessus qui visualise l'algorithme, et se référer aux ressources à la fin de l'article pour une analyse théorique des propriétés d'un graphe construit de cette manière.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Recherche dans le graphe<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons déjà vu l'algorithme de recherche à partir de son utilisation dans la construction de graphes. Dans ce cas, cependant, le nœud de recherche est fourni par l'utilisateur, plutôt que d'être inséré dans le graphe. En partant d'une note d'entrée aléatoire, nous naviguons avec avidité vers le voisin le plus proche de la requête, en conservant un ensemble dynamique des vecteurs les plus proches rencontrés jusqu'à présent. Voir l'illustration ci-dessus. Il convient de noter que nous pouvons améliorer la précision de la recherche en lançant des recherches à partir de plusieurs points d'entrée aléatoires et en agrégeant les résultats, ainsi qu'en prenant en compte plusieurs voisins à chaque étape. Toutefois, ces améliorations se font au prix d'un temps de latence accru.</p>
<custom-h1>Ajout d'une hiérarchie</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jusqu'à présent, nous avons décrit l'algorithme NGS et la structure de données qui peuvent nous aider à étendre la recherche dans un espace à haute dimension. Néanmoins, la méthode présente de sérieuses lacunes, notamment un échec en basse dimension, une convergence lente de la recherche et une tendance à être piégé dans des minima locaux.</p>
<p>Les auteurs de HNSW remédient à ces défauts en apportant trois modifications à NSW :</p>
<ul>
<li><p>Sélection explicite des nœuds d'entrée pendant la construction et la recherche ;</p></li>
<li><p>Séparation des arêtes à différentes échelles ; et,</p></li>
<li><p>l'utilisation d'une heuristique avancée pour sélectionner les voisins.</p></li>
</ul>
<p>Les deux premières modifications sont réalisées à partir d'une idée simple : la construction d'<em>une hiérarchie de graphes de recherche</em>. Au lieu d'un seul graphe, comme dans NSW, HNSW construit une hiérarchie de graphes. Chaque graphe, ou couche, fait l'objet d'une recherche individuelle de la même manière que dans NSW. La couche supérieure, qui est recherchée en premier, contient très peu de nœuds, et les couches plus profondes comprennent progressivement de plus en plus de nœuds, la couche inférieure comprenant tous les nœuds. Cela signifie que les couches supérieures contiennent des sauts plus longs dans l'espace vectoriel, ce qui permet une sorte de recherche de parcours à parcours. Voir l'illustration ci-dessus.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construction du graphe<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>L'algorithme de construction fonctionne comme suit : nous fixons un nombre de couches, <em>L</em>, à l'avance. La valeur l=1 correspondra à la couche la plus grossière, où la recherche commence, et l=L correspondra à la couche la plus dense, où la recherche se termine. Nous itérons sur chaque vecteur à insérer et échantillonnons une couche d'insertion en suivant une <a href="https://en.wikipedia.org/wiki/Geometric_distribution">distribution géométrique</a> tronquée (en rejetant l <em>&gt; L</em> ou en fixant <em>l' =</em> min_(l, L)_). Disons que nous échantillonnons <em>1 &lt; l &lt; L</em> pour le vecteur actuel. Nous effectuons une recherche avide sur la couche supérieure, L, jusqu'à ce que nous atteignions son minimum local. Ensuite, nous suivons une arête du minimum local dans la _L_e couche jusqu'au vecteur correspondant dans la _(L-1)_e couche et nous l'utilisons comme point d'entrée pour effectuer une recherche avide dans la _(L-1)_e couche.</p>
<p>Ce processus est répété jusqu'à ce que nous atteignions la _l_e couche. Nous commençons alors à créer des nœuds pour le vecteur à insérer, en le connectant à ses voisins les plus proches trouvés par la recherche avide dans la _l_ème couche construite jusqu'à présent, en naviguant vers la _(l-1)_ème couche et en répétant l'opération jusqu'à ce que nous ayons inséré le vecteur dans la _1_ème couche. L'animation ci-dessus le montre clairement</p>
<p>Nous pouvons voir que cette méthode de construction de graphe hiérarchique utilise une sélection explicite intelligente du nœud d'insertion pour chaque vecteur. Nous recherchons les couches situées au-dessus de la couche d'insertion construite jusqu'à présent, en effectuant une recherche efficace à partir des distances de parcours à parcours fin. De même, la méthode sépare les liens selon différentes échelles dans chaque couche : la couche supérieure permet des sauts à grande échelle dans l'espace de recherche, l'échelle diminuant jusqu'à la couche inférieure. Ces deux modifications permettent d'éviter d'être piégé dans des minima sous-optimaux et d'accélérer la convergence de la recherche au prix d'une mémoire supplémentaire.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Recherche dans le graphe<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>La procédure de recherche fonctionne de la même manière que l'étape de construction du graphe interne. En partant de la couche supérieure, nous naviguons avec avidité vers le ou les nœuds les plus proches de la requête. Nous suivons ensuite ce(s) nœud(s) jusqu'à la couche suivante et répétons le processus. Notre réponse est obtenue par la liste des <em>R</em> voisins les plus proches dans la couche inférieure, comme l'illustre l'animation ci-dessus.</p>
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
    </button></h2><p>Les bases de données vectorielles comme Milvus fournissent des implémentations hautement optimisées et réglées de HNSW, et c'est souvent le meilleur index de recherche par défaut pour les ensembles de données qui tiennent en mémoire.</p>
<p>Nous avons esquissé une vue d'ensemble de haut niveau du fonctionnement de HNSW, en préférant les visualisations et l'intuition à la théorie et aux mathématiques. Par conséquent, nous avons omis une description exacte des algorithmes de construction et de recherche<a href="https://arxiv.org/abs/1603.09320">[Malkov et Yashushin, 2016</a>; Alg 1-3], l'analyse de la complexité de la recherche et de la construction<a href="https://arxiv.org/abs/1603.09320">[Malkov et Yashushin, 2016</a>; §4.2], et des détails moins essentiels comme une heuristique pour choisir plus efficacement les nœuds voisins pendant la construction<a href="https://arxiv.org/abs/1603.09320">[Malkov et Yashushin, 2016</a>; Alg 5]. De plus, nous avons omis de discuter des hyperparamètres de l'algorithme, de leur signification et de la façon dont ils affectent le compromis latence/vitesse/mémoire<a href="https://arxiv.org/abs/1603.09320">[Malkov et Yashushin, 2016</a>; §4.1]. Il est important de comprendre cela pour utiliser HNSW dans la pratique.</p>
<p>Les ressources ci-dessous contiennent des lectures complémentaires sur ces sujets et une implémentation pédagogique complète en Python (écrite par moi-même) pour NSW et HNSW, y compris le code pour produire les animations dans cet article.</p>
<custom-h1>Ressources</custom-h1><ul>
<li><p>GitHub : "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated : Une petite implémentation de Hierarchical Navigable Small Worlds (HNSW), un algorithme de recherche vectorielle, à des fins d'apprentissage</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Documentation Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Comprendre les petits mondes navigables hiérarchiques (HNSW) - Zilliz Learn</a></p></li>
<li><p>Article sur les petits mondes navigables hiérarchiques : "<a href="https://arxiv.org/abs/1603.09320">Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small Worlds graphs</a>" (<a href="https://arxiv.org/abs/1603.09320">Recherche efficace et robuste du plus proche voisin à l'aide de graphes hiérarchiques navigables du petit monde</a>)</p></li>
<li><p>Article NSW : "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Algorithme de recherche approximative du plus proche voisin basé sur des graphes de petits mondes navigables</a>.</p></li>
</ul>
