---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Faire avec Milvus une recommandation d'actualités basée sur l'IA dans le
  navigateur mobile de Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Découvrez comment Xiaomi a tiré parti de l'IA et de Milvus pour créer un
  système intelligent de recommandation de nouvelles capable de trouver le
  contenu le plus pertinent pour les utilisateurs de son navigateur web mobile.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Making with Milvus : AI-Powered News Recommendation Inside Xiaomi's Mobile Browser (en anglais)</custom-h1><p>Des flux de médias sociaux aux recommandations de listes de lecture sur Spotify, l'<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">intelligence artificielle</a> joue déjà un rôle majeur dans le contenu que nous voyons et avec lequel nous interagissons chaque jour. Afin de différencier son navigateur web mobile, le fabricant multinational d'électronique Xiaomi a conçu un moteur de recommandation d'actualités basé sur l'intelligence artificielle. <a href="https://milvus.io/">Milvus</a>, une base de données vectorielle open-source spécialement conçue pour la recherche de similarités et l'intelligence artificielle, a été utilisée comme plateforme de gestion des données de base de l'application. Cet article explique comment Xiaomi a construit son moteur de recommandation d'actualités alimenté par l'IA et comment Milvus et d'autres algorithmes d'IA ont été utilisés.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">L'utilisation de l'IA pour suggérer des contenus personnalisés et réduire le bruit de l'actualité</h3><p>Le New York Times publiant à lui seul plus de <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 articles par</a> jour, le simple volume d'articles produits ne permet pas aux individus d'avoir une vue d'ensemble de toutes les actualités. Pour aider à passer au crible d'importants volumes de contenu et recommander les articles les plus pertinents ou les plus intéressants, nous nous tournons de plus en plus vers l'IA. Bien que les recommandations soient loin d'être parfaites, l'apprentissage automatique est de plus en plus nécessaire pour se frayer un chemin dans le flux constant de nouvelles informations qui se déversent dans notre monde de plus en plus complexe et interconnecté.</p>
<p>Xiaomi fabrique et investit dans des smartphones, des applications mobiles, des ordinateurs portables, des appareils électroménagers et bien d'autres produits. Afin de différencier un navigateur mobile préinstallé sur plus de 40 millions de smartphones vendus chaque trimestre par l'entreprise, Xiaomi y a intégré un système de recommandation d'actualités. Lorsque les utilisateurs lancent le navigateur mobile de Xiaomi, l'intelligence artificielle est utilisée pour recommander des contenus similaires en fonction de l'historique de recherche de l'utilisateur, de ses centres d'intérêt, etc. Milvus est une base de données de recherche de similarités vectorielles open-source utilisée pour accélérer la recherche d'articles connexes.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Comment fonctionne la recommandation de contenu alimentée par l'IA ?</h3><p>À la base, la recommandation d'actualités (ou tout autre type de système de recommandation de contenu) consiste à comparer des données d'entrée à une base de données massive afin de trouver des informations similaires. Pour que la recommandation de contenu soit efficace, il faut trouver un équilibre entre la pertinence et l'actualité, et intégrer efficacement d'énormes volumes de nouvelles données, souvent en temps réel.</p>
<p>Pour s'adapter à des ensembles de données volumineux, les systèmes de recommandation sont généralement divisés en deux étapes :</p>
<ol>
<li>La<strong>recherche</strong>: Lors de la recherche, le contenu est réduit à partir d'une bibliothèque plus large en fonction des intérêts et du comportement de l'utilisateur. Dans le navigateur mobile de Xiaomi, des milliers d'éléments de contenu sont sélectionnés à partir d'un vaste ensemble de données contenant des millions d'articles d'actualité.</li>
<li><strong>Tri</strong>: Ensuite, le contenu sélectionné lors de la recherche est trié en fonction de certains indicateurs avant d'être transmis à l'utilisateur. Au fur et à mesure que les utilisateurs s'intéressent au contenu recommandé, le système s'adapte en temps réel pour fournir des suggestions plus pertinentes.</li>
</ol>
<p>Les recommandations de contenu d'actualité doivent être faites en temps réel sur la base du comportement de l'utilisateur et du contenu récemment publié. En outre, le contenu suggéré doit correspondre autant que possible aux intérêts de l'utilisateur et à son intention de recherche.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = suggestions de contenu intelligentes</h3><p>Milvus est une base de données open-source de recherche de similarités vectorielles qui peut être intégrée à des modèles d'apprentissage profond pour alimenter des applications couvrant le traitement du langage naturel, la vérification d'identité, et bien plus encore. Milvus indexe de grands ensembles de données vectorielles pour rendre la recherche plus efficace et prend en charge une variété de cadres d'IA populaires pour simplifier le processus de développement d'applications d'apprentissage automatique. Ces caractéristiques font de la plateforme la solution idéale pour le stockage et l'interrogation de données vectorielles, un élément essentiel de nombreuses applications d'apprentissage automatique.</p>
<p>Xiaomi a choisi Milvus pour gérer les données vectorielles de son système intelligent de recommandation d'actualités parce qu'il est rapide, fiable et ne nécessite qu'une configuration et une maintenance minimales. Cependant, Milvus doit être associé à un algorithme d'IA pour créer des applications déployables. Xiaomi a choisi BERT, abréviation de Bidirectional Encoder Representation Transformers, comme modèle de représentation du langage dans son moteur de recommandation. BERT peut être utilisé comme un modèle NLU (compréhension du langage naturel) général qui peut piloter un certain nombre de tâches NLP (traitement du langage naturel) différentes. Ses principales caractéristiques sont les suivantes</p>
<ul>
<li>Le transformateur de BERT est utilisé comme cadre principal de l'algorithme et est capable de capturer des relations explicites et implicites dans et entre les phrases.</li>
<li>Objectifs d'apprentissage multitâches, modélisation du langage masqué (MLM) et prédiction de la phrase suivante (NSP).</li>
<li>BERT est plus performant avec de grandes quantités de données et peut améliorer d'autres techniques de traitement du langage naturel telles que Word2Vec en agissant comme une matrice de conversion.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>L'architecture du réseau BERT utilise une structure de transformateur multicouche qui abandonne les réseaux neuronaux RNN et CNN traditionnels. Elle fonctionne en convertissant la distance entre deux mots à n'importe quelle position en un seul grâce à son mécanisme d'attention, et résout le problème de dépendance qui persiste dans le NLP depuis un certain temps.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT propose un modèle simple et un modèle complexe. Les hyperparamètres correspondants sont les suivants : BERT BASE : L = 12, H = 768, A = 12, paramètre total 110M ; BERT LARGE : L = 24, H = 1024, A = 16, le nombre total de paramètres est 340M.</p>
<p>Dans les hyperparamètres ci-dessus, L représente le nombre de couches dans le réseau (c'est-à-dire le nombre de blocs Transformer), A représente le nombre d'auto-attention dans l'attention multi-têtes, et la taille du filtre est de 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Système de recommandation de contenu de Xiaomi</h3><p>Le système de recommandation d'actualités de Xiaomi basé sur le navigateur repose sur trois composants clés : la vectorisation, le mappage d'ID et le service de voisinage le plus proche (ANN).</p>
<p>La vectorisation est un processus par lequel les titres des articles sont convertis en vecteurs de phrases générales. Le modèle SimBert, basé sur BERT, est utilisé dans le système de recommandation de Xiaomi. SimBert est un modèle à 12 couches avec une taille cachée de 768. Simbert utilise le modèle d'apprentissage chinois L-12_H-768_A-12 pour l'apprentissage continu (la tâche d'apprentissage étant "apprentissage métrique +UniLM", et a entraîné 1,17 million d'étapes sur une TITAN RTX avec l'optimiseur Adam (taux d'apprentissage 2e-6, taille de lot 128). En d'autres termes, il s'agit d'un modèle BERT optimisé.</p>
<p>Les algorithmes ANN comparent les titres d'articles vectorisés à l'ensemble de la bibliothèque d'actualités stockée dans Milvus, puis renvoient un contenu similaire aux utilisateurs. Le mappage d'ID est utilisé pour obtenir des informations pertinentes telles que les pages vues et les clics pour les articles correspondants.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Les données stockées dans Milvus qui alimentent le moteur de recommandation d'actualités de Xiaomi sont constamment mises à jour, y compris des articles supplémentaires et des informations sur les activités. Au fur et à mesure que le système intègre de nouvelles données, les anciennes doivent être purgées. Dans ce système, des mises à jour complètes des données sont effectuées pendant les premiers T-1 jours et des mises à jour incrémentielles sont effectuées pendant les T jours suivants.</p>
<p>À intervalles définis, les anciennes données sont supprimées et les données traitées des T-1 jours sont insérées dans la collection. Ici, les données nouvellement générées sont incorporées en temps réel. Une fois les nouvelles données insérées, une recherche de similarité est effectuée dans Milvus. Les articles récupérés sont à nouveau triés en fonction du taux de clics et d'autres facteurs, et le contenu le plus important est présenté aux utilisateurs. Dans un scénario comme celui-ci, où les données sont fréquemment mises à jour et où les résultats doivent être fournis en temps réel, la capacité de Milvus à intégrer et à rechercher rapidement de nouvelles données permet d'accélérer considérablement la recommandation de contenu d'actualités dans le navigateur mobile de Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus améliore la recherche de similarité vectorielle</h3><p>La vectorisation des données et le calcul de la similarité entre les vecteurs constituent la technologie de recherche la plus couramment utilisée. L'essor des moteurs de recherche de similarités vectorielles basés sur des ANN a considérablement amélioré l'efficacité des calculs de similarités vectorielles. Par rapport à des solutions similaires, Milvus offre un stockage de données optimisé, de nombreux SDK et une version distribuée qui réduit considérablement la charge de travail liée à la construction d'une couche de recherche. En outre, la communauté open-source active de Milvus est une ressource puissante qui peut aider à répondre aux questions et à résoudre les problèmes au fur et à mesure qu'ils surviennent.</p>
<p>Si vous souhaitez en savoir plus sur la recherche par similarité vectorielle et Milvus, consultez les ressources suivantes :</p>
<ul>
<li>Consultez <a href="https://github.com/milvus-io/milvus">Milvus</a> sur Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">La recherche de similarité vectorielle se cache dans la vue de tous</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Accélérer la recherche de similarité sur des données très volumineuses avec l'indexation vectorielle</a></li>
</ul>
<p>Lisez d'autres <a href="https://zilliz.com/user-stories">témoignages d'utilisateurs</a> pour en savoir plus sur l'utilisation de Milvus.</p>
