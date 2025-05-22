---
id: diskann-explained.md
title: DiskANN expliqué
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Découvrez comment DiskANN effectue des recherches vectorielles à l'échelle du
  milliard à l'aide de disques SSD, en conciliant une faible utilisation de la
  mémoire, une grande précision et des performances évolutives.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">Qu'est-ce que DiskANN ?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> représente un changement de paradigme dans l'approche de la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités vectorielles</a>. Auparavant, la plupart des types d'index vectoriels tels que HNSW s'appuient fortement sur la RAM pour obtenir une faible latence et un rappel élevé. Bien qu'efficace pour les ensembles de données de taille moyenne, cette approche devient prohibitive et moins évolutive à mesure que les volumes de données augmentent. DiskANN offre une alternative rentable en exploitant les disques SSD pour stocker l'index, ce qui réduit considérablement les besoins en mémoire.</p>
<p>DiskANN utilise une structure de graphe plat optimisée pour l'accès au disque, ce qui lui permet de traiter des ensembles de données à l'échelle du milliard avec une fraction de l'empreinte mémoire requise par les méthodes en mémoire. Par exemple, DiskANN peut indexer jusqu'à un milliard de vecteurs tout en atteignant une précision de recherche de 95 % avec des temps de latence de 5 ms, alors que les algorithmes basés sur la RAM plafonnent à 100-200 millions de points pour des performances similaires.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1 : Indexation vectorielle et flux de travail de recherche avec DiskANN</em></p>
<p>Bien que DiskANN puisse introduire une latence légèrement plus élevée par rapport aux approches basées sur la RAM, le compromis est souvent acceptable étant donné les économies substantielles et les avantages en termes d'évolutivité. DiskANN est particulièrement adapté aux applications nécessitant une recherche vectorielle à grande échelle sur du matériel de base.</p>
<p>Cet article explique les méthodes astucieuses dont DiskANN dispose pour exploiter le SSD en plus de la RAM et réduire les lectures coûteuses sur le SSD.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">Comment fonctionne DiskANN ?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN est une méthode de recherche vectorielle basée sur un graphe, dans la même famille de méthodes que HNSW. Nous construisons d'abord un graphe de recherche où les nœuds correspondent à des vecteurs (ou à des groupes de vecteurs) et les arêtes indiquent qu'une paire de vecteurs est "relativement proche" d'une certaine manière. Une recherche typique choisit aléatoirement un "nœud d'entrée" et navigue jusqu'à son voisin le plus proche de la requête, en répétant l'opération de manière avide jusqu'à ce qu'un minimum local soit atteint.</p>
<p>Les cadres d'indexation basés sur les graphes diffèrent principalement dans la manière dont ils construisent le graphe de recherche et effectuent la recherche. Dans cette section, nous approfondirons les innovations de DiskANN pour ces étapes et la manière dont elles permettent des performances à faible latence et à faible mémoire. (Voir la figure ci-dessus pour un résumé).</p>
<h3 id="An-Overview" class="common-anchor-header">Vue d'ensemble</h3><p>Nous supposons que l'utilisateur a généré un ensemble de vecteurs d'intégration de documents. La première étape consiste à regrouper les intégrations. Un graphe de recherche pour chaque groupe est construit séparément à l'aide de l'algorithme Vamana (expliqué dans la section suivante), et les résultats sont fusionnés en un seul graphe. <em>La stratégie de division et de conquête pour créer le graphe de recherche final réduit considérablement l'utilisation de la mémoire sans trop affecter la latence de la recherche ou le rappel.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2 : Comment DiskANN stocke l'index vectoriel dans la RAM et le SSD</em></p>
<p>Une fois le graphe de recherche global produit, il est stocké sur le disque SSD avec les intégrations vectorielles de pleine précision. L'un des principaux défis consiste à terminer la recherche dans un nombre limité de lectures du SSD, car l'accès au SSD est coûteux par rapport à l'accès à la RAM. Quelques astuces sont donc utilisées pour limiter le nombre de lectures :</p>
<p>Premièrement, l'algorithme Vamana encourage les chemins plus courts entre les nœuds proches tout en limitant le nombre maximum de voisins d'un nœud. Deuxièmement, une structure de données de taille fixe est utilisée pour stocker l'intégration de chaque nœud et ses voisins (voir la figure ci-dessus). Cela signifie que nous pouvons accéder aux métadonnées d'un nœud en multipliant simplement la taille de la structure de données par l'index du nœud et en l'utilisant comme décalage tout en récupérant simultanément l'intégration du nœud. Troisièmement, en raison du fonctionnement du SSD, nous pouvons récupérer plusieurs nœuds par demande de lecture - dans notre cas, les nœuds voisins - ce qui réduit encore le nombre de demandes de lecture.</p>
<p>Séparément, nous compressons les encastrements à l'aide de la quantification par produit et nous les stockons dans la RAM. Ce faisant, nous pouvons intégrer des ensembles de données vectorielles à l'échelle du milliard dans une mémoire réalisable sur une seule machine pour calculer rapidement des <em>similitudes vectorielles approximatives</em> sans lecture sur disque. Cela permet de réduire le nombre de nœuds voisins auxquels il faut accéder ensuite sur le disque SSD. Il est toutefois important de noter que les décisions de recherche sont prises sur la base des <em>similitudes vectorielles exactes</em>, avec l'ensemble des données d'intégration récupérées sur le disque SSD, ce qui garantit un rappel plus élevé. En d'autres termes, il y a une phase initiale de recherche utilisant les encastrements quantifiés en mémoire, et une recherche ultérieure sur un sous-ensemble plus petit lu sur le disque SSD.</p>
<p>Dans cette description, nous avons passé sous silence deux étapes importantes bien qu'impliquées : la construction du graphe et la recherche dans le graphe - les deux étapes indiquées par les encadrés rouges ci-dessus. Examinons ces deux étapes l'une après l'autre.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"Construction du graphe "Vamana</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : "Construction du graphe "Vamana</em></p>
<p>Les auteurs de DiskANN développent une nouvelle méthode pour construire le graphe de recherche, qu'ils appellent l'algorithme de Vamana. Cet algorithme initialise le graphique de recherche en ajoutant de manière aléatoire O(N) arêtes. Il en résulte un graphe "bien connecté", bien qu'il n'y ait aucune garantie sur la convergence de la recherche gourmande. Il élague et reconnecte ensuite les arêtes de manière intelligente pour s'assurer qu'il y a suffisamment de connexions à longue portée (voir la figure ci-dessus). Permettez-nous d'élaborer :</p>
<h4 id="Initialization" class="common-anchor-header">Initialisation</h4><p>Le graphe de recherche est initialisé sous la forme d'un graphe dirigé aléatoire dans lequel chaque nœud a R voisins extérieurs. Nous calculons également le médioïde du graphe, c'est-à-dire le point qui a la distance moyenne minimale à tous les autres points. Vous pouvez considérer ce point comme analogue à un centroïde membre de l'ensemble des nœuds.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Recherche de candidats</h4><p>Après l'initialisation, nous itérons sur les nœuds, en ajoutant et en supprimant des arêtes à chaque étape. Tout d'abord, nous exécutons un algorithme de recherche sur le nœud sélectionné, p, afin de générer une liste de candidats. L'algorithme de recherche commence au niveau du médioïde et se rapproche de plus en plus du nœud sélectionné, en ajoutant à chaque étape les voisins extérieurs du nœud le plus proche trouvé jusqu'à présent. La liste des L nœuds trouvés les plus proches de p est renvoyée. (Si ce concept ne vous est pas familier, le médoïde d'un graphe est le point qui a la distance moyenne minimale à tous les autres points et agit comme un analogue du centroïde pour les graphes).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Élagage et ajout d'arêtes</h4><p>Les voisins candidats du nœud sont triés par distance et, pour chaque candidat, l'algorithme vérifie s'il est "trop proche" d'un voisin déjà choisi. Si c'est le cas, il est élagué. Cela favorise la diversité angulaire entre les voisins, ce qui, empiriquement, permet d'obtenir de meilleures propriétés de navigation. En pratique, cela signifie qu'une recherche débutant à partir d'un nœud aléatoire peut atteindre plus rapidement n'importe quel nœud cible en explorant un ensemble peu dense de liens locaux et à longue portée.</p>
<p>Après l'élagage des arêtes, les arêtes situées le long du chemin de recherche avide vers p sont ajoutées. Deux passages d'élagage sont effectués, en variant le seuil de distance pour l'élagage de sorte que les arêtes à long terme soient ajoutées lors du deuxième passage.</p>
<h2 id="What’s-Next" class="common-anchor-header">Prochaines étapes<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Des travaux ultérieurs se sont appuyés sur DiskANN pour apporter des améliorations supplémentaires. Un exemple remarquable, connu sous le nom de <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifie la méthode pour permettre une mise à jour facile de l'index après sa construction. Cet index de recherche, qui offre un excellent compromis entre les critères de performance, est disponible dans la base de données vectorielles <a href="https://milvus.io/docs/overview.md">Milvus</a> en tant que type d'index <code translate="no">DISKANN</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez même régler les paramètres de DiskANN, tels que <code translate="no">MaxDegree</code> et <code translate="no">BeamWidthRatio</code>: voir <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">la page de documentation</a> pour plus de détails.</p>
<h2 id="Resources" class="common-anchor-header">Ressources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Documentation Milvus sur l'utilisation de DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN : Fast Accurate Billion-point Nearest Neighbor Search on a Single Node" (DiskANN : recherche rapide et précise de milliards de points dans le voisinage le plus proche sur un seul nœud)</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN : un index ANN rapide et précis basé sur les graphes pour la recherche de similarité en continu"</a></p></li>
</ul>
