---
id: graph-based-recommendation-system-with-milvus.md
title: Comment fonctionnent les systèmes de recommandation ?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Les systèmes de recommandation peuvent générer des revenus, réduire les coûts
  et offrir un avantage concurrentiel. Apprenez à en créer un gratuitement à
  l'aide d'outils open-source.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Construction d'un système de recommandation basé sur les graphes avec les ensembles de données Milvus, PinSage, DGL et MovieLens</custom-h1><p>Les systèmes de recommandation sont alimentés par des algorithmes qui, à leurs <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">débuts,</a> aidaient les humains à trier les courriers électroniques indésirables. En 1990, l'inventeur Doug Terry a utilisé un algorithme de filtrage collaboratif pour trier les courriers électroniques souhaitables des courriers indésirables. En "aimant" ou en "détestant" simplement un courriel, en collaboration avec d'autres personnes faisant de même avec un contenu similaire, les utilisateurs pouvaient rapidement entraîner les ordinateurs à déterminer ce qu'il fallait faire passer dans la boîte de réception de l'utilisateur et ce qu'il fallait séquestrer dans le dossier des courriers indésirables.</p>
<p>D'une manière générale, les systèmes de recommandation sont des algorithmes qui font des suggestions pertinentes aux utilisateurs. Il peut s'agir de films à regarder, de livres à lire, de produits à acheter ou de toute autre chose en fonction du scénario ou du secteur d'activité. Ces algorithmes nous entourent, influençant le contenu que nous consommons et les produits que nous achetons auprès de grandes entreprises technologiques telles que Youtube, Amazon, Netflix et bien d'autres.</p>
<p>Des systèmes de recommandation bien conçus peuvent être des générateurs de revenus essentiels, des réducteurs de coûts et des facteurs de différenciation concurrentielle. Grâce à la technologie open-source et à la baisse des coûts de calcul, les systèmes de recommandation personnalisés n'ont jamais été aussi accessibles. Cet article explique comment utiliser Milvus, une base de données vectorielle open-source, PinSage, un réseau neuronal convolutif graphique (GCN), Deep Graph Library (DGL), un package python évolutif pour l'apprentissage profond sur les graphes, et les ensembles de données MovieLens pour construire un système de recommandation basé sur les graphes.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Comment fonctionnent les systèmes de recommandation ?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Outils pour construire un système de recommandation</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Construire un système de recommandation basé sur les graphes avec Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Comment fonctionnent les systèmes de recommandation ?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Il existe deux approches courantes pour créer des systèmes de recommandation : le filtrage collaboratif et le filtrage basé sur le contenu. La plupart des développeurs utilisent l'une ou l'autre de ces méthodes, ou les deux, et, bien que les systèmes de recommandation puissent varier en complexité et en construction, ils comprennent généralement trois éléments de base :</p>
<ol>
<li><strong>Le modèle de l'utilisateur :</strong> Les systèmes de recommandation nécessitent la modélisation des caractéristiques, des préférences et des besoins de l'utilisateur. De nombreux systèmes de recommandation fondent leurs suggestions sur les données implicites ou explicites fournies par les utilisateurs au niveau de l'élément.</li>
<li><strong>Modèle d'objet :</strong> Les systèmes de recommandation modélisent également les objets afin de faire des recommandations basées sur les portraits des utilisateurs.</li>
<li><strong>Algorithme de recommandation :</strong> L'élément central de tout système de recommandation est l'algorithme qui alimente ses recommandations. Les algorithmes couramment utilisés comprennent le filtrage collaboratif, la modélisation sémantique implicite, la modélisation basée sur les graphes, la recommandation combinée, etc.</li>
</ol>
<p>À un niveau élevé, les systèmes de recommandation qui s'appuient sur le filtrage collaboratif construisent un modèle à partir du comportement passé de l'utilisateur (y compris les données sur le comportement d'utilisateurs similaires) pour prédire ce qui pourrait intéresser l'utilisateur. Les systèmes qui s'appuient sur le filtrage basé sur le contenu utilisent des étiquettes discrètes et prédéfinies basées sur les caractéristiques des articles pour recommander des articles similaires.</p>
<p>Un exemple de filtrage collaboratif serait une station de radio personnalisée sur Spotify, basée sur l'historique d'écoute de l'utilisateur, ses centres d'intérêt, sa bibliothèque musicale, etc. La station diffuse de la musique que l'utilisateur n'a pas sauvegardée ou pour laquelle il n'a pas manifesté d'intérêt, mais que d'autres utilisateurs aux goûts similaires ont souvent écoutée. Un exemple de filtrage basé sur le contenu serait une station de radio basée sur une chanson ou un artiste spécifique qui utiliserait les attributs de l'entrée pour recommander de la musique similaire.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Outils de création d'un système de recommandation<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cet exemple, la création d'un système de recommandation basé sur un graphe à partir de zéro dépend des outils suivants :</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage : Un réseau convolutif graphique</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> est un réseau convolutionnel de graphe à marche aléatoire capable d'apprendre des encastrements pour les nœuds dans des graphes à l'échelle du web contenant des milliards d'objets. Le réseau a été développé par <a href="https://www.pinterest.com/">Pinterest</a>, une société de tableaux d'épingles en ligne, pour offrir des recommandations visuelles thématiques à ses utilisateurs.</p>
<p>Les utilisateurs de Pinterest peuvent "épingler" des contenus qui les intéressent sur des "tableaux", qui sont des collections de contenus épinglés. Avec plus de <a href="https://business.pinterest.com/audience/">478 millions d'</a> utilisateurs actifs mensuels (MAU) et plus de <a href="https://newsroom.pinterest.com/en/company">240 milliards d'</a> objets sauvegardés, l'entreprise dispose d'une immense quantité de données d'utilisateurs qu'elle doit développer de nouvelles technologies pour suivre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage utilise les graphes bipartites des cartes d'épingles pour générer des encastrements de haute qualité à partir des épingles, qui sont utilisés pour recommander aux utilisateurs des contenus visuellement similaires. Contrairement aux algorithmes GCN traditionnels, qui effectuent des convolutions sur les matrices de caractéristiques et le graphe complet, PinSage échantillonne les nœuds/épingles proches et effectue des convolutions locales plus efficaces grâce à la construction dynamique de graphes de calcul.</p>
<p>L'exécution de convolutions sur l'ensemble du voisinage d'un nœud se traduira par un graphe de calcul massif. Pour réduire les besoins en ressources, les algorithmes GCN traditionnels mettent à jour la représentation d'un nœud en agrégeant les informations de son voisinage de k-sauts. PinSage simule la marche aléatoire pour définir le contenu fréquemment visité comme voisinage clé, puis construit une convolution basée sur ce contenu.</p>
<p>Comme il y a souvent des chevauchements dans les voisinages à sauts multiples, la convolution locale sur les nœuds donne lieu à des calculs répétés. Pour éviter cela, à chaque étape d'agrégation, PinSage cartographie tous les nœuds sans calcul répété, puis les relie aux nœuds de niveau supérieur correspondants, et enfin récupère les embeddings des nœuds de niveau supérieur.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Bibliothèque de graphes profonds : Un package python évolutif pour l'apprentissage profond sur les graphes</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL</a> ) est un package Python conçu pour construire des modèles de réseaux neuronaux basés sur les graphes au-dessus des frameworks d'apprentissage profond existants (par exemple, PyTorch, MXNet, Gluon, et plus encore). DGL comprend une interface backend conviviale, facilitant l'implantation dans des cadres basés sur des tenseurs et qui prennent en charge la génération automatique. L'algorithme PinSage mentionné ci-dessus est optimisé pour être utilisé avec DGL et PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus : Une base de données vectorielle open-source conçue pour l'IA et la recherche de similarités</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>Comment fonctionne Milvus.png</span> </span></p>
<p>Milvus est une base de données vectorielles open-source conçue pour la recherche de similarités vectorielles et les applications d'intelligence artificielle (IA). À un niveau élevé, l'utilisation de Milvus pour la recherche de similarités fonctionne comme suit :</p>
<ol>
<li>Des modèles d'apprentissage profond sont utilisés pour convertir des données non structurées en vecteurs de caractéristiques, qui sont importés dans Milvus.</li>
<li>Milvus stocke et indexe les vecteurs de caractéristiques.</li>
<li>Sur demande, Milvus recherche et renvoie les vecteurs les plus similaires à un vecteur d'entrée.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Création d'un système de recommandation basé sur un graphe avec Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagramme.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-construction d'un système de recommandation basé sur un graphe.png</span> </span></p>
<p>La construction d'un système de recommandation basé sur un graphe avec Milvus comprend les étapes suivantes :</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Étape 1 : Prétraitement des données</h3><p>Le prétraitement des données consiste à transformer les données brutes en un format plus facilement compréhensible. Cet exemple utilise les ensembles de données ouvertes MovieLens[5] (m1-1m), qui contiennent 1 000 000 d'évaluations de 4 000 films fournies par 6 000 utilisateurs. Ces données ont été collectées par GroupLens et comprennent des descriptions de films, des évaluations de films et des caractéristiques d'utilisateurs.</p>
<p>Notez que les ensembles de données MovieLens utilisés dans cet exemple ne nécessitent qu'un nettoyage ou une organisation minimale des données. Cependant, si vous utilisez d'autres ensembles de données, votre kilométrage peut varier.</p>
<p>Pour commencer à construire un système de recommandation, créez un graphe bipartite utilisateur-film à des fins de classification en utilisant les données historiques utilisateur-film de l'ensemble de données MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Étape 2 : Entraînement du modèle avec PinSage</h3><p>Les vecteurs d'intégration des épingles générés à l'aide du modèle PinSage sont des vecteurs de caractéristiques des informations cinématographiques acquises. Créez un modèle PinSage basé sur le graphe bipartite g et les dimensions personnalisées des vecteurs de caractéristiques des films (256-d par défaut). Entraînez ensuite le modèle avec PyTorch pour obtenir les encastrements h_item de 4 000 films.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Étape 3 : Chargement des données</h3><p>Chargez les encastrements de films h_item générés par le modèle PinSage dans Milvus, qui renverra les ID correspondants. Importez les ID et les informations correspondantes sur les films dans MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Étape 4 : Effectuer une recherche de similarité vectorielle</h3><p>Obtenez les embeddings correspondants dans Milvus sur la base des ID des films, puis utilisez Milvus pour effectuer une recherche de similarité avec ces embeddings. Ensuite, identifiez les informations correspondantes sur les films dans une base de données MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Étape 5 : Obtenir des recommandations</h3><p>Le système va maintenant recommander les films les plus similaires aux requêtes de recherche des utilisateurs. Il s'agit du processus général de construction d'un système de recommandation. Pour tester et déployer rapidement des systèmes de recommandation et d'autres applications d'IA, essayez le Milvus <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus peut faire plus que des systèmes de recommandation<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est un outil puissant capable d'alimenter une vaste gamme d'applications d'intelligence artificielle et de recherche par similarité vectorielle. Pour en savoir plus sur le projet, consultez les ressources suivantes :</p>
<ul>
<li>Lisez notre <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagissez avec notre communauté open-source sur <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilisez ou contribuez à la base de données vectorielles la plus populaire au monde sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
