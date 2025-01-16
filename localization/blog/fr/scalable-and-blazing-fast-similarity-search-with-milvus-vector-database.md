---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Recherche de similarité évolutive et ultrarapide avec la base de données
  vectorielles Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Stockez, indexez, gérez et recherchez des trillions de vecteurs de documents
  en quelques millisecondes !
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>image de couverture</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cet article, nous aborderons quelques aspects intéressants des bases de données vectorielles et de la recherche de similarités à grande échelle. Dans le monde d'aujourd'hui, qui évolue rapidement, nous voyons apparaître de nouvelles technologies, de nouvelles entreprises, de nouvelles sources de données et, par conséquent, nous devrons continuer à utiliser de nouvelles méthodes pour stocker, gérer et exploiter ces données afin d'en tirer des enseignements. Les données structurées et tabulaires sont stockées dans des bases de données relationnelles depuis des décennies, et la Business Intelligence se nourrit de l'analyse et de l'extraction d'informations à partir de ces données. Cependant, si l'on considère le paysage actuel des données, "plus de 80 à 90 % des données sont des informations non structurées telles que le texte, la vidéo, l'audio, les journaux de serveurs web, les médias sociaux, et bien plus encore". Les organisations ont tiré parti de la puissance de l'apprentissage automatique et de l'apprentissage profond pour tenter d'extraire des informations de ces données, car les méthodes traditionnelles basées sur les requêtes ne sont pas toujours suffisantes, voire impossibles à mettre en œuvre. Il existe un énorme potentiel inexploité pour extraire des informations précieuses de ces données et nous ne faisons que commencer !</p>
<blockquote>
<p>"La plupart des données mondiales n'étant pas structurées, la possibilité de les analyser et d'agir sur elles représente une grande opportunité." - Mikey Shulman, responsable de la ML, Kensho</p>
</blockquote>
<p>Les données non structurées, comme leur nom l'indique, n'ont pas de structure implicite, comme un tableau de lignes et de colonnes (d'où leur nom de données tabulaires ou structurées). Contrairement aux données structurées, il n'existe pas de moyen simple de stocker le contenu des données non structurées dans une base de données relationnelle. L'exploitation des données non structurées à des fins d'analyse est confrontée à trois grands défis :</p>
<ul>
<li><strong>Le stockage :</strong> Les bases de données relationnelles classiques sont adaptées au stockage des données structurées. Bien que vous puissiez utiliser des bases de données NoSQL pour stocker ces données, le traitement de ces données pour en extraire les bonnes représentations afin d'alimenter les applications d'IA à grande échelle représente une charge supplémentaire.</li>
<li><strong>Représentation :</strong> Les ordinateurs ne comprennent pas le texte ou les images comme nous. Ils ne comprennent que les nombres et nous devons convertir les données non structurées en une représentation numérique utile, généralement des vecteurs ou des encastrements.</li>
<li><strong>Interrogation :</strong> Il n'est pas possible d'interroger des données non structurées directement sur la base d'instructions conditionnelles définies, comme le fait SQL pour les données structurées. Imaginez, par exemple, que vous essayiez de rechercher des chaussures similaires à partir d'une photo de votre paire de chaussures préférée ! Vous ne pouvez pas utiliser les valeurs brutes des pixels pour la recherche, ni représenter des caractéristiques structurées telles que la forme, la taille, le style, la couleur des chaussures, etc. Imaginez maintenant que vous deviez faire cela pour des millions de chaussures !</li>
</ul>
<p>Par conséquent, pour que les ordinateurs puissent comprendre, traiter et représenter des données non structurées, nous les convertissons généralement en vecteurs denses, souvent appelés "embeddings".</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>figure 1</span> </span></p>
<p>Il existe une variété de méthodologies tirant particulièrement parti de l'apprentissage profond, notamment les réseaux neuronaux convolutifs (CNN) pour les données visuelles telles que les images et les transformateurs pour les données textuelles, qui peuvent être utilisés pour transformer de telles données non structurées en embeddings. <a href="https://zilliz.com/">Zilliz</a> a publié <a href="https://zilliz.com/learn/embedding-generation">un excellent article couvrant les différentes techniques d'intégration</a>!</p>
<p>Il ne suffit pas de stocker ces vecteurs d'intégration. Il faut également être en mesure d'interroger et de trouver des vecteurs similaires. Pourquoi ? Une majorité d'applications réelles sont alimentées par la recherche de similarités vectorielles pour les solutions basées sur l'IA. Il s'agit notamment de la recherche visuelle (image) dans Google, des systèmes de recommandation dans Netflix ou Amazon, des moteurs de recherche textuelle dans Google, de la recherche multimodale, de la déduplication des données et de bien d'autres choses encore !</p>
<p>Stocker, gérer et interroger des vecteurs à grande échelle n'est pas une tâche simple. Vous avez besoin d'outils spécialisés pour cela et les bases de données vectorielles sont l'outil le plus efficace pour ce travail ! Dans cet article, nous aborderons les aspects suivants :</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vecteurs et recherche de similarité vectorielle</a></li>
<li><a href="#What-is-a-Vector-Database">Qu'est-ce qu'une base de données vectorielle ?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - La base de données vectorielles la plus avancée au monde</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Effectuer une recherche visuelle d'images avec Milvus - Un exemple de cas d'utilisation</a></li>
</ul>
<p>Commençons !</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vecteurs et recherche de similarité vectorielle<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Plus tôt, nous avons établi la nécessité de représenter les données non structurées telles que les images et le texte sous forme de vecteurs, car les ordinateurs ne peuvent comprendre que des nombres. Nous utilisons généralement des modèles d'IA, plus précisément des modèles d'apprentissage profond, pour convertir les données non structurées en vecteurs numériques qui peuvent être lus par les machines. En règle générale, ces vecteurs sont une liste de nombres à virgule flottante qui représentent collectivement l'élément sous-jacent (image, texte, etc.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Comprendre les vecteurs</h3><p>Dans le domaine du traitement du langage naturel (NLP), nous disposons de nombreux modèles d'intégration de mots, tels que <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe et FastText</a>, qui permettent de représenter les mots sous forme de vecteurs numériques. Avec le temps, nous avons vu apparaître des modèles de <a href="https://arxiv.org/abs/1706.03762">transformation</a> tels que <a href="https://jalammar.github.io/illustrated-bert/">BERT</a>, qui peuvent être exploités pour apprendre des vecteurs d'intégration contextuels et de meilleures représentations pour des phrases et des paragraphes entiers.</p>
<p>De même, dans le domaine de la vision par ordinateur, nous disposons de modèles tels que les <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">réseaux neuronaux convolutifs (CNN)</a> qui peuvent aider à apprendre des représentations à partir de données visuelles telles que des images et des vidéos. Avec l'essor des transformateurs, nous avons également des <a href="https://arxiv.org/abs/2010.11929">transformateurs de vision</a> qui peuvent être plus performants que les CNN classiques.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>figure 2</span> </span></p>
<p>L'avantage de ces vecteurs est qu'ils peuvent être utilisés pour résoudre des problèmes réels tels que la recherche visuelle, où vous téléchargez généralement une photo et obtenez des résultats de recherche comprenant des images visuellement similaires. C'est une fonction très populaire du moteur de recherche de Google, comme le montre l'exemple suivant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>figure 3</span> </span></p>
<p>Ces applications sont alimentées par des vecteurs de données et la recherche de similarités vectorielles. Si vous considérez deux points dans un espace de coordonnées cartésiennes X-Y, la distance entre ces deux points peut être calculée. La distance entre deux points peut être calculée comme une simple distance euclidienne décrite par l'équation suivante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>figure 4</span> </span></p>
<p>Imaginons maintenant que chaque point de données soit un vecteur de dimension D. Vous pouvez toujours utiliser la distance euclidienne ou même d'autres mesures de distance telles que la distance de hamming ou la distance cosinus pour déterminer à quel point les deux points de données sont proches l'un de l'autre. Cela peut aider à construire une notion de proximité ou de similarité qui pourrait être utilisée comme une métrique quantifiable pour trouver des éléments similaires à partir d'un élément de référence en utilisant leurs vecteurs.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Comprendre la recherche de similarité vectorielle</h3><p>La recherche de similarité vectorielle, souvent connue sous le nom de recherche du plus proche voisin (NN), consiste essentiellement à calculer la similarité par paire (ou les distances) entre un élément de référence (pour lequel nous voulons trouver des éléments similaires) et une collection d'éléments existants (généralement dans une base de données) et à renvoyer les "k" plus proches voisins qui sont les "k" éléments les plus similaires. L'élément clé pour calculer cette similarité est la métrique de similarité, qui peut être la distance euclidienne, le produit intérieur, la distance cosinus, la distance de Hamming, etc. Plus la distance est faible, plus les vecteurs sont similaires.</p>
<p>Le problème de la recherche exacte du plus proche voisin (NN) est l'extensibilité. Vous devez calculer N distances (en supposant qu'il y ait N éléments existants) à chaque fois pour obtenir des éléments similaires. Cela peut être très lent, surtout si vous ne stockez pas et n'indexez pas les données quelque part (comme une base de données vectorielle !). Pour accélérer le calcul, nous utilisons généralement la recherche approximative du plus proche voisin, souvent appelée recherche ANN, qui permet de stocker les vecteurs dans un index. L'index permet de stocker ces vecteurs de manière intelligente afin de pouvoir retrouver rapidement des voisins "approximativement" similaires pour un élément de référence. Les méthodologies typiques d'indexation ANN sont les suivantes</p>
<ul>
<li><strong>Transformations vectorielles :</strong> Il s'agit d'ajouter des transformations supplémentaires aux vecteurs, telles que la réduction des dimensions (par exemple PCA \ t-SNE), la rotation, etc.</li>
<li><strong>Encodage des vecteurs :</strong> Il s'agit d'appliquer des techniques basées sur des structures de données telles que le hachage sensible à la localité (LSH), la quantification, les arbres, etc. qui peuvent aider à retrouver plus rapidement des éléments similaires.</li>
<li><strong>Méthodes de recherche non exhaustive :</strong> Elles sont principalement utilisées pour empêcher la recherche exhaustive et comprennent des méthodes telles que les graphes de voisinage, les indices inversés, etc.</li>
</ul>
<p>Pour créer une application de recherche de similarités vectorielles, il faut donc une base de données capable de stocker, d'indexer et d'interroger (recherche) efficacement et à grande échelle. Voici les bases de données vectorielles !</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">Qu'est-ce qu'une base de données vectorielle ?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Étant donné que nous comprenons maintenant comment les vecteurs peuvent être utilisés pour représenter des données non structurées et comment fonctionne la recherche vectorielle, nous pouvons combiner ces deux concepts pour construire une base de données vectorielle.</p>
<p>Les bases de données vectorielles sont des plateformes de données évolutives permettant de stocker, d'indexer et d'interroger des vecteurs d'intégration générés à partir de données non structurées (images, textes, etc.) à l'aide de modèles d'apprentissage profond.</p>
<p>Le traitement d'un nombre massif de vecteurs pour la recherche de similarités (même avec des index) peut s'avérer très coûteux. Malgré cela, les bases de données vectorielles les meilleures et les plus avancées devraient vous permettre d'insérer, d'indexer et de rechercher des millions ou des milliards de vecteurs cibles, en plus de spécifier un algorithme d'indexation et une métrique de similarité de votre choix.</p>
<p>Les bases de données vectorielles doivent principalement répondre aux exigences clés suivantes pour un système de gestion de base de données robuste à utiliser dans l'entreprise :</p>
<ol>
<li><strong>Évolutivité :</strong> Les bases de données vectorielles doivent être capables d'indexer et d'exécuter une recherche approximative du plus proche voisin pour des milliards de vecteurs d'intégration.</li>
<li><strong>Fiable :</strong> Les bases de données vectorielles doivent être capables de gérer les défaillances internes sans perte de données et avec un impact opérationnel minimal, c'est-à-dire qu'elles doivent être tolérantes aux défaillances.</li>
<li><strong>Rapides :</strong> Les vitesses d'interrogation et d'écriture sont importantes pour les bases de données vectorielles. Pour des plateformes telles que Snapchat et Instagram, qui peuvent avoir des centaines ou des milliers de nouvelles images téléchargées par seconde, la vitesse devient un facteur incroyablement important.</li>
</ol>
<p>Les bases de données vectorielles ne se contentent pas de stocker des vecteurs de données. Elles sont également responsables de l'utilisation de structures de données efficaces pour indexer ces vecteurs en vue d'une récupération rapide et de la prise en charge des opérations CRUD (création, lecture, mise à jour et suppression). Idéalement, les bases de données vectorielles devraient également prendre en charge le filtrage d'attributs, c'est-à-dire le filtrage basé sur des champs de métadonnées qui sont généralement des champs scalaires. Un exemple simple serait de retrouver des chaussures similaires en se basant sur les vecteurs d'images d'une marque spécifique. La marque serait l'attribut sur lequel le filtrage serait effectué.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>figure 5</span> </span></p>
<p>La figure ci-dessus montre comment <a href="https://milvus.io/">Milvus</a>, la base de données vectorielles dont nous parlerons bientôt, utilise le filtrage par attributs. <a href="https://milvus.io/">Milvus</a> introduit le concept de masque de bits dans le mécanisme de filtrage afin de conserver les vecteurs similaires avec un masque de bits de 1 en fonction de la satisfaction de filtres d'attributs spécifiques. Plus de détails à ce sujet <a href="https://zilliz.com/learn/attribute-filtering">ici</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - La base de données vectorielles la plus avancée au monde<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> est une plateforme de gestion de base de données vectorielles open-source conçue spécifiquement pour les données vectorielles massives et la rationalisation des opérations d'apprentissage automatique (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>chiffre 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a> est l'organisation qui a créé <a href="https://milvus.io/">Milvus</a>, la base de données vectorielles la plus avancée au monde, afin d'accélérer le développement de la prochaine génération de tissus de données. Milvus est actuellement un projet de fin d'études à la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> et se concentre sur la gestion d'énormes ensembles de données non structurées pour le stockage et la recherche. L'efficacité et la fiabilité de la plateforme simplifient le processus de déploiement de modèles d'IA et de MLOps à grande échelle. Milvus a de vastes applications couvrant la découverte de médicaments, la vision par ordinateur, les systèmes de recommandation, les chatbots, et bien plus encore.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Principales caractéristiques de Milvus</h3><p>Milvus est doté de nombreuses fonctionnalités et capacités utiles, telles que :</p>
<ul>
<li><strong>Des vitesses de recherche fulgurantes sur un trillion d'ensembles de données vectorielles :</strong> La latence moyenne de la recherche et de l'extraction vectorielles a été mesurée en millisecondes sur un trillion d'ensembles de données vectorielles.</li>
<li><strong>Gestion simplifiée des données non structurées :</strong> Milvus dispose d'API riches conçues pour les flux de travail de la science des données.</li>
<li><strong>Base de données vectorielles fiable et toujours active :</strong> Les fonctions intégrées de réplication et de basculement/failback de Milvus garantissent la continuité des données et des applications à tout moment.</li>
<li><strong>Hautement évolutive et élastique :</strong> L'évolutivité au niveau des composants permet d'augmenter ou de réduire la taille de la base de données à la demande.</li>
<li><strong>Recherche hybride :</strong> Outre les vecteurs, Milvus prend en charge des types de données tels que les booléens, les chaînes, les entiers, les nombres à virgule flottante, etc. Milvus associe le filtrage scalaire à une puissante recherche de similarité vectorielle (comme le montre l'exemple de similarité de chaussures présenté plus haut).</li>
<li><strong>Structure Lambda unifiée :</strong> Milvus combine le traitement en flux et le traitement par lots pour le stockage des données afin d'équilibrer la rapidité et l'efficacité.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Voyage dans le temps</a>:</strong> Milvus maintient une chronologie pour toutes les opérations d'insertion et de suppression de données. Il permet aux utilisateurs de spécifier des horodatages dans une recherche pour récupérer une vue de données à un moment précis.</li>
<li><strong>Soutenu par la communauté et reconnu par l'industrie :</strong> Avec plus de 1 000 entreprises utilisatrices, plus de 10,5K étoiles sur <a href="https://github.com/milvus-io/milvus">GitHub</a> et une communauté open-source active, vous n'êtes pas seul lorsque vous utilisez Milvus. En tant que projet diplômé de la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus bénéficie d'un soutien institutionnel.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Approches existantes de la gestion et de la recherche de données vectorielles</h3><p>Une façon courante de construire un système d'IA alimenté par la recherche de similarités vectorielles est de coupler des algorithmes comme Approximate Nearest Neighbor Search (ANNS) avec des bibliothèques open-source telles que :</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Ce cadre permet une recherche de similarité efficace et le regroupement de vecteurs denses. Il contient des algorithmes qui recherchent dans des ensembles de vecteurs de toute taille, jusqu'à ceux qui ne tiennent pas dans la mémoire vive. Il prend en charge des capacités d'indexation telles que le multi-index inversé et la quantification des produits.</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify's Annoy (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Ce cadre utilise des <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">projections aléatoires</a> et construit un arbre pour permettre l'ANNS à l'échelle pour les vecteurs denses.</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) de Google</a>:</strong> Ce cadre effectue une recherche de similarité vectorielle efficace à l'échelle. Il se compose d'implémentations qui incluent l'élagage de l'espace de recherche et la quantification pour la recherche du produit intérieur maximal (MIPS).</li>
</ul>
<p>Bien que chacune de ces bibliothèques soit utile à sa manière, en raison de plusieurs limitations, ces combinaisons algorithme-bibliothèque ne sont pas équivalentes à un système de gestion de données vectorielles à part entière comme Milvus. Nous allons maintenant examiner certaines de ces limitations.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Limites des approches existantes</h3><p>Les approches existantes utilisées pour la gestion des données vectorielles, comme indiqué dans la section précédente, présentent les limites suivantes :</p>
<ol>
<li><strong>Flexibilité :</strong> Les systèmes existants stockent généralement toutes les données dans la mémoire principale. Ils ne peuvent donc pas être exécutés facilement en mode distribué sur plusieurs machines et ne sont pas adaptés au traitement d'ensembles de données volumineux.</li>
<li><strong>Traitement dynamique des données :</strong> Les données sont souvent considérées comme statiques une fois introduites dans les systèmes existants, ce qui complique le traitement des données dynamiques et rend impossible la recherche en temps quasi réel.</li>
<li><strong>Traitement avancé des requêtes :</strong> La plupart des outils ne prennent pas en charge le traitement avancé des requêtes (par exemple, le filtrage des attributs, la recherche hybride et les requêtes multi-vectorielles), ce qui est essentiel pour construire des moteurs de recherche par similarité dans le monde réel prenant en charge le filtrage avancé.</li>
<li><strong>Optimisations informatiques hétérogènes :</strong> Peu de plateformes offrent des optimisations pour les architectures de systèmes hétérogènes à la fois sur les CPU et les GPU (à l'exception de FAISS), ce qui entraîne des pertes d'efficacité.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> tente de surmonter toutes ces limitations et nous en discuterons en détail dans la section suivante.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">L'avantage Milvus - Comprendre Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> tente de s'attaquer et de résoudre avec succès les limites des systèmes existants basés sur des algorithmes inefficaces de gestion des données vectorielles et de recherche de similitudes de la manière suivante :</p>
<ul>
<li>Il améliore la flexibilité en offrant un support pour une variété d'interfaces d'application (y compris des SDK en Python, Java, Go, C++ et des API RESTful).</li>
<li>Il prend en charge plusieurs types d'index vectoriels (par exemple, les index basés sur la quantification et les index basés sur les graphes), ainsi qu'un traitement avancé des requêtes.</li>
<li>Milvus traite les données vectorielles dynamiques à l'aide d'un arbre de fusion log-structuré (arbre LSM), ce qui permet de conserver des insertions et des suppressions de données efficaces et des recherches en temps réel.</li>
<li>Milvus fournit également des optimisations pour les architectures informatiques hétérogènes sur les CPU et GPU modernes, ce qui permet aux développeurs d'adapter les systèmes à des scénarios, des ensembles de données et des environnements d'application spécifiques.</li>
</ul>
<p>Knowhere, le moteur d'exécution vectorielle de Milvus, est une interface d'exploitation permettant d'accéder aux services dans les couches supérieures du système et aux bibliothèques de recherche de similarités vectorielles telles que Faiss, Hnswlib, Annoy dans les couches inférieures du système. En outre, Knowhere est également responsable de l'informatique hétérogène. Knowhere contrôle sur quel matériel (par exemple, CPU ou GPU) sont exécutées les requêtes de construction d'index et de recherche. C'est ainsi que Knowhere tire son nom - savoir où exécuter les opérations. D'autres types de matériel, notamment les DPU et TPU, seront pris en charge dans les prochaines versions.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>figure 7</span> </span></p>
<p>Le calcul dans Milvus implique principalement des opérations vectorielles et scalaires. Knowhere ne gère que les opérations sur les vecteurs dans Milvus. La figure ci-dessus illustre l'architecture de Knowhere dans Milvus. La couche inférieure est le matériel du système. Les bibliothèques d'indexation tierces se trouvent au-dessus du matériel. Knowhere interagit ensuite avec le nœud d'index et le nœud de requête au sommet par l'intermédiaire de CGO. Knowhere ne se contente pas d'étendre les fonctions de Faiss, il optimise également les performances et présente plusieurs avantages, notamment la prise en charge de BitsetView, la prise en charge d'un plus grand nombre de mesures de similarité, la prise en charge du jeu d'instructions AVX512, la sélection automatique des instructions SIMD et d'autres optimisations des performances. Les détails sont disponibles <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ici</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Architecture de Milvus</h3><p>La figure suivante présente l'architecture globale de la plate-forme Milvus. Milvus sépare le flux de données du flux de contrôle et est divisé en quatre couches indépendantes en termes d'évolutivité et de reprise après sinistre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>figure 8</span> </span></p>
<ul>
<li><strong>Couche d'accès :</strong> La couche d'accès est composée d'un groupe de proxies sans état et sert de couche frontale du système et de point final pour les utilisateurs.</li>
<li><strong>Service de coordination :</strong> Le service de coordination est responsable de la gestion des nœuds de la topologie de la grappe, de l'équilibrage de la charge, de la génération de l'horodatage, de la déclaration des données et de la gestion des données.</li>
<li><strong>Nœuds de travail :</strong> Le nœud de travailleur, ou nœud d'exécution, exécute les instructions émises par le service coordinateur et les commandes de langage de manipulation de données (DML) lancées par le proxy. Un nœud de travailleur dans Milvus est similaire à un nœud de données dans <a href="https://hadoop.apache.org/">Hadoop</a> ou à un serveur de région dans HBase.</li>
<li><strong>Stockage :</strong> Il s'agit de la pierre angulaire de Milvus, responsable de la persistance des données. La couche de stockage se compose d'un <strong>méta-magasin</strong>, d'un <strong>courtier de journaux</strong> et d'un <strong>stockage d'objets</strong>.</li>
</ul>
<p>Pour plus de détails sur l'architecture <a href="https://milvus.io/docs/v2.0.x/four_layers.md">, cliquez ici</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Effectuer une recherche d'images visuelles avec Milvus - Un exemple de cas d'utilisation<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles open-source comme Milvus permettent à toute entreprise de créer son propre système de recherche d'images visuelles en un minimum d'étapes. Les développeurs peuvent utiliser des modèles d'IA pré-entraînés pour convertir leurs propres ensembles de données d'images en vecteurs, puis exploiter Milvus pour permettre la recherche de produits similaires par image. Examinons le schéma suivant qui montre comment concevoir et construire un tel système.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>figure 9</span> </span></p>
<p>Dans ce flux de travail, nous pouvons utiliser un framework open-source comme <a href="https://github.com/towhee-io/towhee">towhee</a> pour exploiter un modèle pré-entraîné comme ResNet-50 et extraire des vecteurs à partir d'images, stocker et indexer ces vecteurs facilement dans Milvus et également stocker une correspondance entre les ID d'images et les images réelles dans une base de données MySQL. Une fois les données indexées, nous pouvons télécharger facilement toute nouvelle image et effectuer des recherches d'images à grande échelle à l'aide de Milvus. La figure suivante montre un exemple de recherche visuelle d'images.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>figure 10</span> </span></p>
<p>Consultez le <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutoriel</a> détaillé qui a été mis à disposition sur GitHub grâce à Milvus.</p>
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
    </button></h2><p>Nous avons abordé un grand nombre de sujets dans cet article. Nous avons commencé par les défis posés par la représentation des données non structurées, l'exploitation des vecteurs et la recherche de similarité vectorielle à l'échelle avec Milvus, une base de données vectorielle open-source. Nous avons discuté des détails de la structure de Milvus et des composants clés qui l'alimentent, ainsi que de la façon de résoudre un problème réel, la recherche d'images visuelles avec Milvus. Essayez-le et commencez à résoudre vos propres problèmes du monde réel avec <a href="https://milvus.io/">Milvus</a>!</p>
<p>Cet article vous a plu ? N'hésitez pas à <a href="https://www.linkedin.com/in/dipanzan/">me contacter</a> pour en discuter davantage ou pour me faire part de vos commentaires !</p>
<h2 id="About-the-author" class="common-anchor-header">À propos de l'auteur<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar est Data Science Lead, Google Developer Expert - Machine Learning, auteur, consultant et conseiller en IA. Connexion : http://bit.ly/djs_linkedin</p>
