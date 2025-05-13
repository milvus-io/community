---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  La recherche vectorielle dans le monde réel : comment filtrer efficacement
  sans tuer le rappel ?
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Ce blog explore les techniques de filtrage populaires dans la recherche
  vectorielle, ainsi que les optimisations innovantes que nous avons intégrées
  dans Milvus et Zilliz Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Nombreux sont ceux qui pensent que la recherche vectorielle consiste simplement à mettre en œuvre un algorithme ANN (Approximate Nearest Neighbor) et à s'arrêter là. Mais si vous utilisez la recherche vectorielle en production, vous connaissez la vérité : elle se complique rapidement.</p>
<p>Imaginez que vous construisiez un moteur de recherche de produits. Un utilisateur pourrait demander : "<em>Montrez-moi des chaussures similaires à cette photo, mais uniquement en rouge et à moins de 100 euros</em>". Pour répondre à cette requête, il faut appliquer un filtre de métadonnées aux résultats de la recherche par similarité sémantique. Cela semble aussi simple que d'appliquer un filtre aux résultats d'une recherche vectorielle ? Pas tout à fait.</p>
<p>Que se passe-t-il lorsque votre condition de filtrage est très sélective ? Vous risquez de ne pas obtenir suffisamment de résultats. Et le simple fait d'augmenter le paramètre <strong>topK</strong> de la recherche vectorielle peut rapidement dégrader les performances et consommer beaucoup plus de ressources pour traiter le même volume de recherche.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sous le capot, le filtrage efficace des métadonnées est un véritable défi. Votre base de données vectorielle doit analyser l'index du graphe, appliquer des filtres de métadonnées et répondre dans le cadre d'un budget de latence serré, disons 20 millisecondes. Servir des milliers de requêtes de ce type par seconde sans faire faillite nécessite une ingénierie réfléchie et une optimisation minutieuse.</p>
<p>Ce blog explore les techniques de filtrage populaires dans la recherche vectorielle, ainsi que les optimisations innovantes que nous avons intégrées à la base de données vectorielle <a href="https://milvus.io/docs/overview.md">Milvus</a> et à son service en nuage entièrement géré<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>). Nous partagerons également un test de référence démontrant à quel point les performances de Milvus, entièrement géré, peuvent être supérieures à celles des autres bases de données vectorielles avec un budget cloud de 1 000 $.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Optimisation de l'index graphique<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles ont besoin de méthodes d'indexation efficaces pour gérer les grands ensembles de données. Sans index, une base de données doit comparer votre requête à chaque vecteur de l'ensemble de données (balayage brutal), ce qui devient extrêmement lent au fur et à mesure que vos données augmentent.</p>
<p><strong>Milvus</strong> prend en charge différents types d'index pour résoudre ce problème de performances. Les plus populaires sont les types d'index basés sur les graphes : HNSW (s'exécute entièrement en mémoire) et DiskANN (utilise efficacement la mémoire et le SSD). Ces index organisent les vecteurs dans une structure de réseau où les voisinages de vecteurs sont connectés sur une carte, ce qui permet aux recherches de naviguer rapidement vers les résultats pertinents tout en ne vérifiant qu'une petite fraction de tous les vecteurs. <strong>Zilliz Cloud</strong>, le service Milvus entièrement géré, va encore plus loin en introduisant Cardinal, un moteur de recherche vectorielle propriétaire avancé, qui améliore encore ces index pour de meilleures performances.</p>
<p>Cependant, lorsque nous ajoutons des exigences de filtrage (comme "n'afficher que les produits de moins de 100 $"), un nouveau problème apparaît. L'approche standard consiste à créer un <em>ensemble de bits</em> - une liste indiquant les vecteurs qui répondent aux critères de filtrage. Lors de la recherche, le système ne prend en compte que les vecteurs marqués comme valides dans cet ensemble de bits. Cette approche semble logique, mais elle crée un grave problème : la <strong>rupture de connectivité</strong>. Lorsque de nombreux vecteurs sont filtrés, les chemins soigneusement construits dans notre index graphique sont perturbés.</p>
<p>Voici un exemple simple du problème : dans le diagramme ci-dessous, le point A est relié à B, C et D, mais B, C et D ne sont pas directement reliés entre eux. Si notre filtre supprime le point A (peut-être parce qu'il est trop coûteux), même si B, C et D sont pertinents pour notre recherche, le chemin qui les relie est interrompu. Cela crée des "îlots" de vecteurs déconnectés qui deviennent inaccessibles pendant la recherche, ce qui nuit à la qualité des résultats (rappel).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il existe deux approches courantes du filtrage pendant la traversée du graphe : exclure d'emblée tous les points filtrés, ou tout inclure et appliquer le filtre par la suite. Comme l'illustre le diagramme ci-dessous, aucune de ces deux approches n'est idéale. Le fait d'ignorer complètement les points filtrés peut entraîner un effondrement du rappel lorsque le taux de filtrage se rapproche de 1 (ligne bleue), tandis que la visite de chaque point, quelles que soient ses métadonnées, gonfle l'espace de recherche et ralentit considérablement les performances (ligne rouge).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les chercheurs ont proposé plusieurs approches pour trouver un équilibre entre le rappel et la performance :</p>
<ol>
<li><strong>Stratégie Alpha :</strong> Elle introduit une approche probabiliste : même si un vecteur ne correspond pas au filtre, nous pouvons quand même le visiter pendant la recherche avec une certaine probabilité. Cette probabilité (alpha) dépend du taux de filtrage, c'est-à-dire de la rigueur du filtre. Cela permet de maintenir les connexions essentielles dans le graphe sans visiter trop de vecteurs non pertinents.</li>
</ol>
<ol start="2">
<li><strong>Méthode ACORN [1] :</strong> Dans la méthode HNSW standard, l'élagage des arêtes est utilisé lors de la construction de l'index pour créer un graphe peu dense et accélérer la recherche. La méthode ACORN saute délibérément cette étape d'élagage pour conserver davantage d'arêtes et renforcer la connectivité, ce qui est crucial lorsque les filtres risquent d'exclure de nombreux nœuds. Dans certains cas, ACORN étend également la liste des voisins de chaque nœud en rassemblant des voisins approximatifs supplémentaires, ce qui renforce encore le graphe. En outre, son algorithme de traversée a deux longueurs d'avance (il examine les voisins des voisins), ce qui améliore les chances de trouver des chemins valables, même lorsque les taux de filtrage sont élevés.</li>
</ol>
<ol start="3">
<li><strong>Voisins sélectionnés de manière dynamique :</strong> Cette méthode améliore la stratégie Alpha. Au lieu de s'appuyer sur un saut probabiliste, cette approche sélectionne de manière adaptative les nœuds suivants au cours de la recherche. Elle offre plus de contrôle que la stratégie Alpha.</li>
</ol>
<p>Dans Milvus, nous avons mis en œuvre la stratégie Alpha parallèlement à d'autres techniques d'optimisation. Par exemple, elle change dynamiquement de stratégie lorsqu'elle détecte des filtres extrêmement sélectifs : lorsque, par exemple, environ 99 % des données ne correspondent pas à l'expression de filtrage, la stratégie "include-all" allongerait considérablement les chemins de traversée du graphe, ce qui entraînerait une dégradation des performances et des "îlots" de données isolés. Dans de tels cas, Milvus revient automatiquement à un balayage brut, en contournant entièrement l'index du graphe pour une meilleure efficacité. Dans Cardinal, le moteur de recherche vectorielle qui alimente Milvus entièrement géré (Zilliz Cloud), nous sommes allés plus loin en mettant en œuvre une combinaison dynamique de méthodes de traversée "include-all" et "exclude-all" qui s'adapte intelligemment en fonction des statistiques de données afin d'optimiser les performances des requêtes.</p>
<p>Nos expériences sur le jeu de données Cohere 1M (dimension = 768) utilisant une instance AWS r7gd.4xlarge démontrent l'efficacité de cette approche. Dans le graphique ci-dessous, la ligne bleue représente notre stratégie de combinaison dynamique, tandis que la ligne rouge illustre l'approche de base qui traverse tous les points filtrés du graphique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Indexation tenant compte des métadonnées<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>La relation entre les métadonnées et les encastrements vectoriels constitue un autre défi. Dans la plupart des applications, les propriétés des métadonnées d'un article (par exemple, le prix d'un produit) ont un lien minimal avec ce que le vecteur représente réellement (la signification sémantique ou les caractéristiques visuelles). Par exemple, une <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">robe</annotation><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">et une</annotation></semantics></math></span></span>ceinture <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>ont le même prix mais présentent des caractéristiques visuelles complètement différentes. Ce décalage rend la combinaison du filtrage et de la recherche vectorielle intrinsèquement inefficace.</p>
<p>Pour résoudre ce problème, nous avons développé des <strong>index vectoriels tenant compte des métadonnées</strong>. Au lieu d'avoir un seul graphe pour tous les vecteurs, il construit des "sous-graphes" spécialisés pour différentes valeurs de métadonnées. Par exemple, si vos données comportent des champs "couleur" et "forme", il crée des structures graphiques distinctes pour ces champs.</p>
<p>Lorsque vous effectuez une recherche à l'aide d'un filtre tel que "couleur = bleu", il utilise le sous-graphe spécifique à la couleur plutôt que le graphique principal. C'est beaucoup plus rapide car le sous-graphe est déjà organisé autour des métadonnées par lesquelles vous filtrez.</p>
<p>Dans la figure ci-dessous, l'index du graphe principal est appelé <strong>graphe de base</strong>, tandis que les graphes spécialisés construits pour des champs de métadonnées spécifiques sont appelés <strong>graphes de colonnes</strong>. Pour gérer efficacement l'utilisation de la mémoire, il limite le nombre de connexions que chaque point peut avoir (out-degree). Lorsqu'une recherche n'inclut aucun filtre de métadonnées, elle utilise par défaut le graphe de base. Lorsque des filtres sont appliqués, il passe au graphe de colonnes approprié, ce qui offre un avantage considérable en termes de rapidité.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Filtrage itératif<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Parfois, c'est le filtrage lui-même qui devient le goulot d'étranglement, et non la recherche vectorielle. C'est notamment le cas des filtres complexes tels que les conditions JSON ou les comparaisons détaillées de chaînes de caractères. L'approche traditionnelle (filtre d'abord, recherche ensuite) peut être extrêmement lente car le système doit évaluer ces filtres coûteux sur des millions d'enregistrements potentiels avant même de lancer la recherche vectorielle.</p>
<p>Vous pourriez vous dire : "Pourquoi ne pas commencer par la recherche vectorielle, puis filtrer les meilleurs résultats ?" Cette approche fonctionne parfois, mais elle présente un défaut majeur : si votre filtre est strict et élimine la plupart des résultats, vous risquez de vous retrouver avec trop peu (ou pas du tout) de résultats après le filtrage.</p>
<p>Pour résoudre ce dilemme, nous avons créé le <strong>filtrage itératif</strong> dans Milvus et Zilliz Cloud, inspiré de<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Au lieu d'une approche "tout ou rien", le filtrage itératif fonctionne par lots :</p>
<ol>
<li><p>Obtenir un lot de correspondances vectorielles les plus proches</p></li>
<li><p>Appliquer des filtres à ce lot</p></li>
<li><p>Si nous n'avons pas assez de résultats filtrés, nous obtenons un autre lot.</p></li>
<li><p>Répéter l'opération jusqu'à ce que l'on obtienne le nombre requis de résultats.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette approche réduit considérablement le nombre d'opérations de filtrage coûteuses à effectuer, tout en garantissant un nombre suffisant de résultats de haute qualité. Pour plus d'informations sur l'activation du filtrage itératif, veuillez vous référer à cette <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">page de documentation sur le filtrage itératif</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">Filtrage externe<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreuses applications du monde réel répartissent leurs données entre différents systèmes - les vecteurs dans une base de données vectorielle et les métadonnées dans des bases de données traditionnelles. Par exemple, de nombreuses organisations stockent les descriptions de produits et les commentaires des utilisateurs sous forme de vecteurs dans Milvus pour la recherche sémantique, tout en conservant l'état des stocks, la tarification et d'autres données structurées dans des bases de données traditionnelles telles que PostgreSQL ou MongoDB.</p>
<p>Cette séparation est logique d'un point de vue architectural, mais pose un problème pour les recherches filtrées. Le flux de travail typique est le suivant :</p>
<ul>
<li><p>Interroger votre base de données relationnelle pour trouver les enregistrements correspondant aux critères de filtrage (par exemple, "articles en stock d'une valeur inférieure à 50 dollars").</p></li>
<li><p>Obtenir les identifiants correspondants et les envoyer à Milvus pour filtrer la recherche vectorielle.</p></li>
<li><p>Effectuer une recherche sémantique uniquement sur les vecteurs qui correspondent à ces identifiants.</p></li>
</ul>
<p>Cela semble simple, mais lorsque le nombre de lignes dépasse des millions, cela devient un goulot d'étranglement. Le transfert de grandes listes d'identifiants consomme la bande passante du réseau et l'exécution d'expressions de filtrage massives dans Milvus ajoute des frais généraux.</p>
<p>Pour résoudre ce problème, nous avons introduit le <strong>filtrage externe</strong> dans Milvus, une solution légère au niveau du SDK qui utilise l'API de l'itérateur de recherche et inverse le flux de travail traditionnel.</p>
<ul>
<li><p>Effectue d'abord une recherche vectorielle, en récupérant des lots de candidats les plus pertinents d'un point de vue sémantique.</p></li>
<li><p>Applique votre fonction de filtrage personnalisée à chaque lot côté client.</p></li>
<li><p>Récupère automatiquement d'autres lots jusqu'à ce que vous ayez suffisamment de résultats filtrés.</p></li>
</ul>
<p>Cette approche itérative par lots réduit considérablement le trafic réseau et la charge de traitement, puisque vous ne travaillez qu'avec les candidats les plus prometteurs de la recherche vectorielle.</p>
<p>Voici un exemple d'utilisation du filtrage externe dans pymilvus :</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>Contrairement au filtrage itératif, qui opère sur des itérateurs au niveau des segments, le filtrage externe fonctionne au niveau de la requête globale. Cette conception minimise l'évaluation des métadonnées et évite d'exécuter des filtres volumineux dans Milvus, ce qui se traduit par des performances de bout en bout plus légères et plus rapides.</p>
<h2 id="AutoIndex" class="common-anchor-header">AutoIndex<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche vectorielle implique toujours un compromis entre la précision et la vitesse - plus vous vérifiez de vecteurs, meilleurs sont vos résultats, mais plus lente est votre requête. Lorsque vous ajoutez des filtres, cet équilibre devient encore plus délicat à trouver.</p>
<p>Dans Zilliz Cloud, nous avons créé <strong>AutoIndex</strong> - un optimiseur basé sur le ML qui affine automatiquement cet équilibre pour vous. Au lieu de configurer manuellement des paramètres complexes, AutoIndex utilise l'apprentissage automatique pour déterminer les paramètres optimaux pour vos données spécifiques et vos modèles de requête.</p>
<p>Pour comprendre comment cela fonctionne, il est utile de connaître un peu l'architecture de Milvus puisque Zilliz est construit au-dessus de Milvus : Les requêtes sont réparties entre plusieurs instances de QueryNode. Chaque nœud traite une partie de vos données (un segment), effectue sa recherche, puis les résultats sont fusionnés.</p>
<p>AutoIndex analyse les statistiques de ces segments et procède à des ajustements intelligents. Lorsque le taux de filtrage est faible, la plage de recherche de l'index est élargie afin d'augmenter le rappel. Lorsque le taux de filtrage est élevé, l'éventail des requêtes est réduit afin d'éviter de gaspiller des efforts sur des candidats improbables. Ces décisions sont guidées par des modèles statistiques qui prédisent la stratégie de recherche la plus efficace pour chaque scénario de filtrage spécifique.</p>
<p>AutoIndex va au-delà des paramètres d'indexation. Il aide également à sélectionner la meilleure stratégie d'évaluation des filtres. En analysant les expressions de filtrage et en échantillonnant les données des segments, il peut estimer le coût de l'évaluation. S'il détecte des coûts d'évaluation élevés, il passe automatiquement à des techniques plus efficaces telles que le filtrage itératif. Cet ajustement dynamique garantit que vous utilisez toujours la stratégie la mieux adaptée à chaque requête.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Performances avec un budget de 1 000 dollars<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Si les améliorations théoriques sont importantes, ce sont les performances réelles qui comptent pour la plupart des développeurs. Nous avons voulu tester la manière dont ces optimisations se traduisent en performances réelles des applications dans le cadre de contraintes budgétaires réalistes.</p>
<p>Nous avons comparé plusieurs solutions de bases de données vectorielles avec un budget mensuel pratique de 1 000 $ - un montant raisonnable que de nombreuses entreprises alloueraient à l'infrastructure de recherche vectorielle. Pour chaque solution, nous avons sélectionné la configuration d'instance la plus performante possible dans le cadre de cette contrainte budgétaire.</p>
<p>Nos tests ont porté sur les éléments suivants</p>
<ul>
<li><p>L'ensemble de données Cohere 1M avec 1 million de vecteurs à 768 dimensions.</p></li>
<li><p>Un mélange de charges de travail de recherche filtrées et non filtrées du monde réel</p></li>
<li><p>L'outil de référence open-source vdb-bench pour des comparaisons cohérentes.</p></li>
</ul>
<p>Les solutions concurrentes (rendues anonymes sous les noms de "VDB A", "VDB B" et "VDB C") ont toutes été configurées de manière optimale dans les limites du budget. Les résultats ont montré que Milvus (Zilliz Cloud), entièrement géré, atteignait systématiquement le débit le plus élevé pour les requêtes filtrées et non filtrées. Avec le même budget de 1 000 $, nos techniques d'optimisation permettent d'obtenir les meilleures performances pour un rappel compétitif.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>La recherche vectorielle avec filtrage peut sembler simple à première vue - il suffit d'ajouter une clause de filtrage à votre requête et le tour est joué. Cependant, comme nous l'avons démontré dans ce blog, l'obtention de performances élevées et de résultats précis à grande échelle nécessite des solutions d'ingénierie sophistiquées. Milvus et Zilliz Cloud relèvent ces défis grâce à plusieurs approches innovantes :</p>
<ul>
<li><p><strong>Optimisation de l'index graphique</strong>: Préserve les chemins entre les éléments similaires même lorsque les filtres suppriment les nœuds de connexion, évitant ainsi le problème des "îlots" qui réduit la qualité des résultats.</p></li>
<li><p><strong>Indexation tenant compte des métadonnées</strong>: Crée des chemins spécialisés pour les conditions de filtrage courantes, ce qui accélère considérablement les recherches filtrées sans sacrifier la précision.</p></li>
<li><p><strong>Filtrage itératif</strong>: Traite les résultats par lots, en appliquant des filtres complexes uniquement aux candidats les plus prometteurs plutôt qu'à l'ensemble du jeu de données.</p></li>
<li><p><strong>AutoIndex</strong>: Utilise l'apprentissage automatique pour ajuster automatiquement les paramètres de recherche en fonction de vos données et de vos requêtes, ce qui permet d'équilibrer la vitesse et la précision sans configuration manuelle.</p></li>
<li><p><strong>Filtrage externe</strong>: Fait le lien entre la recherche vectorielle et les bases de données externes de manière efficace, en éliminant les goulets d'étranglement du réseau tout en maintenant la qualité des résultats.</p></li>
</ul>
<p>Milvus et Zilliz Cloud continuent d'évoluer avec de nouvelles fonctionnalités qui améliorent encore les performances de la recherche filtrée. Des fonctionnalités telles que<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> permettent une organisation des données encore plus efficace basée sur des modèles de filtrage, et des techniques avancées de routage de sous-graphes repoussent encore plus loin les limites des performances.</p>
<p>Le volume et la complexité des données non structurées continuent de croître de manière exponentielle, créant de nouveaux défis pour les systèmes de recherche partout dans le monde. Notre équipe repousse constamment les limites de ce qui est possible avec les bases de données vectorielles afin d'offrir une recherche plus rapide et plus évolutive alimentée par l'IA.</p>
<p>Si vos applications rencontrent des goulets d'étranglement au niveau des performances avec la recherche vectorielle filtrée, nous vous invitons à rejoindre notre communauté de développeurs active sur <a href="https://milvus.io/community">milvus.io/community</a> - où vous pourrez partager vos défis, accéder à des conseils d'experts et découvrir les meilleures pratiques émergentes.</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
