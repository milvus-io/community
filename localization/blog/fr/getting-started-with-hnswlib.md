---
id: getting-started-with-hnswlib.md
title: Premiers pas avec HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, une bibliothèque implémentant HNSW, est très efficace et évolutive,
  et fonctionne bien même avec des millions de points. Apprenez à la mettre en
  œuvre en quelques minutes.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p>La<a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a> permet aux machines de comprendre le langage et d'obtenir de meilleurs résultats de recherche, ce qui est essentiel pour l'intelligence artificielle et l'analyse des données. Une fois le langage représenté sous forme d'<a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">encastrements</a>, la recherche peut être effectuée à l'aide de méthodes exactes ou approximatives. La recherche approximative du plus proche voisin<a href="https://zilliz.com/glossary/anns">(ANN)</a> est une méthode utilisée pour trouver rapidement les points d'un ensemble de données qui sont les plus proches d'un point d'interrogation donné, contrairement à la <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">recherche exacte du plus proche voisin</a>, qui peut s'avérer coûteuse en termes de calcul pour les données de haute dimension. L'ANN permet une recherche plus rapide en fournissant des résultats qui sont approximativement proches des plus proches voisins.</p>
<p>L'un des algorithmes de recherche du plus proche voisin (ANN) est <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), implémenté sous <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, qui sera au centre de la discussion d'aujourd'hui. Dans ce blog, nous allons :</p>
<ul>
<li><p>Comprendre l'algorithme HNSW.</p></li>
<li><p>Explorer HNSWlib et ses principales caractéristiques.</p></li>
<li><p>Configurer HNSWlib, en couvrant la construction de l'index et la mise en œuvre de la recherche.</p></li>
<li><p>Le comparer avec Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Comprendre HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p>Hierarchical<strong>Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> est une structure de données basée sur un graphe qui permet des recherches de similarité efficaces, en particulier dans les espaces à haute dimension, en construisant un graphe multicouche de réseaux de "petits mondes". Introduit en <a href="https://arxiv.org/abs/1603.09320">2016</a>, HNSW résout les problèmes d'évolutivité associés aux méthodes de recherche traditionnelles telles que la force brute et les recherches basées sur les arbres. Il est idéal pour les applications impliquant de grands ensembles de données, telles que les systèmes de recommandation, la reconnaissance d'images et la <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">génération augmentée par récupération (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">L'importance de HNSW</h3><p>HNSW améliore considérablement les performances de la recherche du plus proche voisin dans les espaces à haute dimension. La combinaison de la structure hiérarchique et de la navigabilité du petit monde évite l'inefficacité informatique des anciennes méthodes, ce qui permet d'obtenir de bons résultats même avec des ensembles de données massifs et complexes. Pour mieux comprendre, voyons comment cela fonctionne aujourd'hui.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Fonctionnement de HNSW</h3><ol>
<li><p><strong>Couches hiérarchiques :</strong> HNSW organise les données en une hiérarchie de couches, où chaque couche contient des nœuds reliés par des arêtes. Les couches supérieures sont plus clairsemées, ce qui permet de faire de larges "sauts" dans le graphique, un peu comme si l'on faisait un zoom arrière sur une carte pour ne voir que les principales autoroutes entre les villes. Les couches inférieures augmentent en densité, fournissant des détails plus fins et davantage de connexions entre les voisins les plus proches.</p></li>
<li><p><strong>Concept de petits mondes navigables :</strong> Chaque couche de HNSW repose sur le concept de "petit monde", où les nœuds (points de données) ne sont qu'à quelques "sauts" les uns des autres. L'algorithme de recherche commence par la couche la plus haute et la plus éparse, puis descend vers des couches de plus en plus denses afin d'affiner la recherche. Cette approche revient à passer d'une vue globale à des détails au niveau du voisinage, en réduisant progressivement la zone de recherche.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Fig 1</a>: Exemple de graphe du petit monde navigable</p>
<ol start="3">
<li><strong>Structure de type "liste à sauter" :</strong> L'aspect hiérarchique de HNSW ressemble à une "skip list", une structure de données probabiliste dans laquelle les couches supérieures ont moins de nœuds, ce qui permet des recherches initiales plus rapides.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Fig 2</a>: Exemple de structure de type "skip list</p>
<p>Pour rechercher 96 dans la liste d'exclusion donnée, nous commençons au niveau supérieur, à l'extrême gauche, par le nœud d'en-tête. En nous déplaçant vers la droite, nous rencontrons 31, moins que 96, et nous passons donc au nœud suivant. Maintenant, nous devons descendre d'un niveau où nous voyons à nouveau 31 ; comme il est toujours inférieur à 96, nous descendons d'un autre niveau. Nous trouvons à nouveau 31, puis nous nous déplaçons vers la droite et atteignons 96, notre valeur cible. Ainsi, nous trouvons 96 sans avoir à descendre jusqu'aux niveaux les plus bas de la liste de saut.</p>
<ol start="4">
<li><p><strong>Efficacité de la recherche :</strong> L'algorithme HNSW part d'un nœud d'entrée situé dans la couche la plus haute, et progresse vers des voisins plus proches à chaque étape. Il descend le long des couches, en utilisant chacune d'entre elles pour une exploration plus ou moins fine, jusqu'à ce qu'il atteigne la couche la plus basse où les nœuds les plus similaires sont susceptibles d'être trouvés. Cette navigation par couches réduit le nombre de nœuds et d'arêtes à explorer, ce qui rend la recherche rapide et précise.</p></li>
<li><p><strong>Insertion et maintenance</strong>: Lors de l'ajout d'un nouveau nœud, l'algorithme détermine sa couche d'entrée en fonction de la probabilité et le connecte aux nœuds voisins à l'aide d'une heuristique de sélection des voisins. Cette heuristique vise à optimiser la connectivité, en créant des liens qui améliorent la navigabilité tout en équilibrant la densité du graphe. Cette approche permet à la structure de rester robuste et de s'adapter à de nouveaux points de données.</p></li>
</ol>
<p>Bien que nous ayons une compréhension fondamentale de l'algorithme HNSW, sa mise en œuvre à partir de zéro peut s'avérer fastidieuse. Heureusement, la communauté a développé des bibliothèques comme <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> pour en simplifier l'utilisation et le rendre accessible sans se gratter la tête. Voyons donc de plus près ce qu'est HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Vue d'ensemble de HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, une bibliothèque populaire implémentant HNSW, est très efficace et évolutive, et fonctionne bien même avec des millions de points. Elle atteint une complexité temporelle sous-linéaire en permettant des sauts rapides entre les couches du graphe et en optimisant la recherche pour les données denses et de haute dimension. Voici les principales caractéristiques de HNSWlib :</p>
<ul>
<li><p><strong>Structure basée sur un graphe :</strong> Un graphe multicouche représente les points de données, ce qui permet d'effectuer des recherches rapides sur les plus proches voisins.</p></li>
<li><p><strong>Efficacité en haute dimension :</strong> Optimisée pour les données à haute dimension, elle permet des recherches approximatives rapides et précises.</p></li>
<li><p><strong>Temps de recherche sous-linéaire :</strong> permet d'obtenir une complexité sous-linéaire en sautant des couches, ce qui améliore considérablement la vitesse.</p></li>
<li><p><strong>Mises à jour dynamiques :</strong> Prend en charge l'insertion et la suppression de nœuds en temps réel sans nécessiter une reconstruction complète du graphe.</p></li>
<li><p><strong>Efficacité de la mémoire :</strong> Utilisation efficace de la mémoire, adaptée aux grands ensembles de données.</p></li>
<li><p><strong>Évolutivité :</strong> S'adapte bien à des millions de points de données, ce qui le rend idéal pour des applications de taille moyenne telles que les systèmes de recommandation.</p></li>
</ul>
<p><strong>Note :</strong> HNSWlib est excellent pour créer des prototypes simples d'applications de recherche vectorielle. Cependant, en raison des limitations d'évolutivité, il peut y avoir de meilleurs choix tels que des <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de données vectorielles spécifiques</a> pour des scénarios plus complexes impliquant des centaines de millions ou même des milliards de points de données. Voyons cela en action.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Démarrer avec HNSWlib : Un guide pas à pas<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette section présente l'utilisation de HNSWlib comme <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">bibliothèque de recherche vectorielle</a> en créant un index HNSW, en insérant des données et en effectuant des recherches. Commençons par l'installation :</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Installation et importations</h3><p>Pour commencer à utiliser HNSWlib en Python, installez-la d'abord avec pip :</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, importez les bibliothèques nécessaires :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Préparation des données</h3><p>Dans cet exemple, nous utiliserons <code translate="no">NumPy</code>pour générer un ensemble de données aléatoires avec 10 000 éléments, chacun ayant une dimension de 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Créons les données :</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Maintenant que nos données sont prêtes, construisons un index.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Construction d'un index</h3><p>Pour construire un index, nous devons définir la dimensionnalité des vecteurs et le type d'espace. Créons un index :</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Ce paramètre définit la métrique de distance utilisée pour la similarité. En le fixant à <code translate="no">'l2'</code>, vous utilisez la distance euclidienne (norme L2). Si vous lui attribuez la valeur <code translate="no">'ip'</code>, le produit intérieur sera utilisé, ce qui est utile pour des tâches telles que la similarité en cosinus.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Ce paramètre spécifie la dimensionnalité des points de données avec lesquels vous travaillerez. Il doit correspondre à la dimension des données que vous prévoyez d'ajouter à l'index.</li>
</ul>
<p>Voici comment initialiser un index :</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Ceci définit le nombre maximum d'éléments qui peuvent être ajoutés à l'index. <code translate="no">Num_elements</code> est la capacité maximale, nous la fixons donc à 10 000 car nous travaillons avec 10 000 points de données.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Ce paramètre contrôle le compromis entre la précision et la vitesse de construction lors de la création de l'index. Une valeur plus élevée améliore le rappel (précision) mais augmente l'utilisation de la mémoire et le temps de construction. Les valeurs courantes sont comprises entre 100 et 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Ce paramètre détermine le nombre de liens bidirectionnels créés pour chaque point de données, ce qui influe sur la précision et la vitesse de recherche. Les valeurs typiques se situent entre 12 et 48 ; 16 est souvent un bon équilibre pour une précision et une vitesse modérées.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: Le paramètre <code translate="no">ef</code>, abréviation de "facteur d'exploration", détermine le nombre de voisins examinés au cours d'une recherche. Une valeur plus élevée de <code translate="no">ef</code> entraîne l'exploration d'un plus grand nombre de voisins, ce qui augmente généralement la précision (rappel) de la recherche, mais la rend également plus lente. À l'inverse, une valeur plus faible de <code translate="no">ef</code> permet d'accélérer la recherche, mais peut en réduire la précision.</li>
</ul>
<p>Dans ce cas, définir <code translate="no">ef</code> sur 50 signifie que l'algorithme de recherche évaluera jusqu'à 50 voisins lors de la recherche des points de données les plus similaires.</p>
<p>Remarque : <code translate="no">ef_construction</code> définit l'effort de recherche des voisins lors de la création de l'index, ce qui améliore la précision mais ralentit la construction. <code translate="no">ef</code> contrôle l'effort de recherche lors de l'interrogation, en équilibrant dynamiquement la vitesse et le rappel pour chaque interrogation.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Exécution des recherches</h3><p>Pour effectuer une recherche par le plus proche voisin à l'aide de HNSWlib, nous créons d'abord un vecteur de requête aléatoire. Dans cet exemple, la dimensionnalité du vecteur correspond aux données indexées.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Cette ligne génère un vecteur aléatoire ayant la même dimensionnalité que les données indexées, ce qui assure la compatibilité avec la recherche du plus proche voisin.</li>
<li><code translate="no">knn_query</code>: La méthode recherche les <code translate="no">k</code> plus proches voisins de <code translate="no">query_vector</code> dans l'index <code translate="no">p</code>. Elle renvoie deux tableaux : <code translate="no">labels</code>, qui contiennent les indices des plus proches voisins, et <code translate="no">distances</code>, qui indiquent les distances entre le vecteur de la requête et chacun de ces voisins. Ici, <code translate="no">k=5</code> indique que nous voulons trouver les cinq plus proches voisins.</li>
</ul>
<p>Voici les résultats après impression des étiquettes et des distances :</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Voilà, un guide simple pour démarrer avec HNSWlib.</p>
<p>Comme nous l'avons mentionné, HNSWlib est un excellent moteur de recherche vectorielle pour le prototypage ou l'expérimentation avec des ensembles de données de taille moyenne. Si vous avez des exigences plus élevées en matière d'évolutivité ou si vous avez besoin d'autres fonctionnalités de niveau entreprise, vous devrez peut-être choisir une base de données vectorielle spécialisée comme <a href="https://zilliz.com/what-is-milvus">Milvus</a>, une base de données open-source, ou son service entièrement géré sur <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Dans la section suivante, nous allons donc comparer HNSWlib avec Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib vs. les bases de données vectorielles spécifiques comme Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> stocke les données sous forme de représentations mathématiques, ce qui permet aux <a href="https://zilliz.com/ai-models">modèles d'apprentissage automatique</a> d'alimenter la recherche, les recommandations et la génération de texte en identifiant les données par des <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">mesures de similarité</a> pour une compréhension contextuelle.</p>
<p>Les bibliothèques d'indices vectoriels comme HNSWlib améliorent la<a href="https://zilliz.com/learn/vector-similarity-search">recherche</a> et l'extraction de données<a href="https://zilliz.com/learn/vector-similarity-search">vectorielles</a>, mais ne disposent pas des fonctions de gestion d'une base de données complète. En revanche, les bases de données vectorielles, telles que <a href="https://milvus.io/">Milvus</a>, sont conçues pour traiter les encastrements vectoriels à grande échelle, offrant des avantages en termes de gestion des données, d'indexation et d'interrogation que les bibliothèques autonomes n'ont généralement pas. Voici d'autres avantages liés à l'utilisation de Milvus :</p>
<ul>
<li><p><strong>Recherche de similarité vectorielle à grande vitesse</strong>: Milvus offre des performances de recherche de l'ordre de la milliseconde sur des ensembles de données vectorielles à l'échelle du milliard, ce qui est idéal pour des applications telles que la recherche d'images, les systèmes de recommandation, le traitement du langage naturel<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP)</a> et la génération augmentée de recherche<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>.</p></li>
<li><p><strong>Évolutivité et haute disponibilité :</strong> Conçu pour traiter des volumes de données massifs, Milvus évolue horizontalement et comprend des mécanismes de réplication et de basculement pour la fiabilité.</p></li>
<li><p><strong>Architecture distribuée :</strong> Milvus utilise une architecture distribuée et évolutive qui sépare le stockage et le calcul sur plusieurs nœuds pour plus de flexibilité et de robustesse.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Recherche hybride</strong></a><strong>:</strong> Milvus prend en charge la recherche multimodale, la recherche hybride <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dense</a> et <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">clairsemée</a>, ainsi que la <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">recherche</a> hybride dense et en <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">texte intégral</a>, offrant ainsi une fonctionnalité de recherche polyvalente et flexible.</p></li>
<li><p><strong>Prise en charge flexible des données</strong>: Milvus prend en charge différents types de données (vecteurs, scalaires et données structurées), ce qui permet une gestion et une analyse transparentes au sein d'un système unique.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Communauté</strong></a> <strong>et support</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>actifs</strong></a>: Une communauté florissante fournit régulièrement des mises à jour, des tutoriels et une assistance, ce qui permet à Milvus de rester en phase avec les besoins des utilisateurs et les avancées dans le domaine.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Intégration de l'IA</a>: Milvus s'est intégré à divers frameworks et technologies d'IA populaires, ce qui permet aux développeurs de créer plus facilement des applications à l'aide de leurs piles technologiques habituelles.</p></li>
</ul>
<p>Milvus fournit également un service entièrement géré sur <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, qui est sans tracas et 10 fois plus rapide que Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Comparaison : Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Fonctionnalité</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Évolutivité</td><td style="text-align:center">Traite facilement des milliards de vecteurs</td><td style="text-align:center">Convient aux petits ensembles de données en raison de l'utilisation de la RAM</td></tr>
<tr><td style="text-align:center">Idéal pour</td><td style="text-align:center">Prototypage, expérimentation et applications d'entreprise</td><td style="text-align:center">Se concentre sur les prototypes et les tâches ANN légères</td></tr>
<tr><td style="text-align:center">Indexation</td><td style="text-align:center">Prend en charge plus de 10 algorithmes d'indexation, notamment HNSW, DiskANN, quantification et binaire.</td><td style="text-align:center">Utilise uniquement un algorithme HNSW basé sur un graphe</td></tr>
<tr><td style="text-align:center">Intégration</td><td style="text-align:center">Offre des API et des services cloud-native</td><td style="text-align:center">Sert de bibliothèque légère et autonome</td></tr>
<tr><td style="text-align:center">Performances</td><td style="text-align:center">Optimisation pour les données volumineuses et les requêtes distribuées</td><td style="text-align:center">Offre une vitesse élevée mais une évolutivité limitée</td></tr>
</tbody>
</table>
<p>Dans l'ensemble, Milvus est généralement préférable pour les applications de production à grande échelle avec des besoins d'indexation complexes, tandis que HNSWlib est idéal pour le prototypage et les cas d'utilisation plus simples.</p>
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
    </button></h2><p>La recherche sémantique peut être gourmande en ressources, c'est pourquoi la structuration interne des données, comme celle effectuée par HNSW, est essentielle pour une récupération plus rapide des données. Les bibliothèques comme HNSWlib se préoccupent de l'implémentation, de sorte que les développeurs ont les recettes prêtes à l'emploi pour prototyper les capacités vectorielles. Avec seulement quelques lignes de code, nous pouvons construire notre propre index et effectuer des recherches.</p>
<p>HNSWlib est un excellent moyen de commencer. Cependant, si vous souhaitez créer des applications d'IA complexes et prêtes pour la production, les bases de données vectorielles conçues à cet effet sont la meilleure option. Par exemple, <a href="https://milvus.io/">Milvus</a> est une base de données vectorielles open-source qui présente de nombreuses caractéristiques adaptées aux entreprises, telles que la recherche vectorielle à grande vitesse, l'évolutivité, la disponibilité et la flexibilité en termes de types de données et de langage de programmation.</p>
<h2 id="Further-Reading" class="common-anchor-header">Pour en savoir plus<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Qu'est-ce que Faiss (Facebook AI Similarity Search) ? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">Qu'est-ce que HNSWlib ? Une bibliothèque basée sur les graphes pour la recherche rapide d'ANN </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">Qu'est-ce que ScaNN (Scalable Nearest Neighbors) ? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench : Un outil de benchmarking Open-Source pour VectorDB</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Que sont les bases de données vectorielles et comment fonctionnent-elles ? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Qu'est-ce que RAG ? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modèles d'IA les plus performants pour vos applications de GenAI | Zilliz</a></p></li>
</ul>
