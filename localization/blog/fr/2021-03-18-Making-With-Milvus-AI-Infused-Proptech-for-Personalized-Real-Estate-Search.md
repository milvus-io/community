---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: >-
  Making With Milvus AI-Infused Proptech for Personalized Real Estate Search
  (Faire avec Milvus - Proptech infusé par l'IA pour une recherche immobilière
  personnalisée)
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  L'IA transforme le secteur de l'immobilier, découvrez comment la proptech
  intelligente accélère le processus de recherche et d'achat d'un logement.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Making With Milvus : AI-Infused Proptech for Personalized Real Estate Search (Faire avec Milvus : Proptech infusée par l'IA pour une recherche immobilière personnalisée)</custom-h1><p>L'intelligence artificielle (IA) a de <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">puissantes applications</a> dans l'immobilier qui transforment le processus de recherche de logement. Les professionnels de l'immobilier avertis tirent parti de l'IA depuis des années, reconnaissant sa capacité à aider les clients à trouver le bon logement plus rapidement et à simplifier le processus d'achat d'un bien immobilier. La pandémie de coronavirus <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">a accéléré l'</a> intérêt, l'adoption et l'investissement dans la technologie immobilière (ou proptech) dans le monde entier, ce qui laisse penser qu'elle jouera un rôle de plus en plus important dans le secteur de l'immobilier à l'avenir.</p>
<p>Cet article explique comment <a href="https://bj.ke.com/">Beike</a> a utilisé la recherche par similarité vectorielle pour créer une plateforme de recherche de logement qui fournit des résultats personnalisés et recommande des annonces en temps quasi réel.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">Qu'est-ce que la recherche par similarité vectorielle ?</h3><p>La<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">recherche de similarité vectorielle</a> a des applications qui couvrent une grande variété de scénarios d'intelligence artificielle, d'apprentissage profond et de calcul vectoriel traditionnel. La prolifération de la technologie de l'IA est en partie attribuée à la recherche vectorielle et à sa capacité à donner un sens aux données non structurées, qui comprennent des éléments tels que les images, les vidéos, l'audio, les données comportementales, les documents et bien d'autres choses encore.</p>
<p>Les données non structurées représentent environ 80 à 90 % de l'ensemble des données, et en extraire des informations devient rapidement une nécessité pour les entreprises qui veulent rester compétitives dans un monde en constante évolution. La demande croissante en matière d'analyse de données non structurées, l'augmentation de la puissance de calcul et la baisse des coûts de calcul ont rendu la recherche vectorielle basée sur l'IA plus accessible que jamais.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Traditionnellement, les données non structurées constituent un défi pour le traitement et l'analyse à grande échelle, car elles ne suivent pas un modèle ou une structure organisationnelle prédéfinis. Les réseaux neuronaux (CNN, RNN et BERT, par exemple) permettent de convertir les données non structurées en vecteurs de caractéristiques, un format de données numériques qui peut être facilement interprété par les ordinateurs. Des algorithmes sont ensuite utilisés pour calculer la similarité entre les vecteurs à l'aide de mesures telles que la similarité en cosinus ou la distance euclidienne.</p>
<p>En fin de compte, la recherche de similitudes vectorielles est un terme général qui décrit les techniques permettant d'identifier des éléments similaires dans des ensembles massifs de données. Beike utilise cette technologie pour alimenter un moteur de recherche intelligent qui recommande automatiquement des annonces en fonction des préférences de l'utilisateur, de son historique de recherche et des critères de propriété, accélérant ainsi le processus de recherche et d'achat de biens immobiliers. Milvus est une base de données vectorielles open-source qui relie les informations aux algorithmes, ce qui permet à Beike de développer et de gérer sa plateforme immobilière d'IA.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Comment Milvus gère-t-il les données vectorielles ?</h3><p>Milvus a été conçu spécifiquement pour la gestion des données vectorielles à grande échelle et ses applications couvrent la recherche d'images et de vidéos, l'analyse de similarité chimique, les systèmes de recommandation personnalisés, l'IA conversationnelle et bien plus encore. Les ensembles de données vectorielles stockés dans Milvus peuvent être interrogés efficacement, la plupart des implémentations suivant ce processus général :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Comment Beike utilise-t-il Milvus pour rendre la recherche de logement plus intelligente ?</h3><p>Communément décrite comme la réponse chinoise à Zillow, Beike est une plateforme en ligne qui permet aux agents immobiliers de répertorier les propriétés à louer ou à vendre. Afin d'améliorer l'expérience des chasseurs de maisons et d'aider les agents à conclure des transactions plus rapidement, l'entreprise a mis au point un moteur de recherche alimenté par l'IA pour sa base de données d'annonces. La base de données d'annonces immobilières de Beike a été convertie en vecteurs de caractéristiques, puis introduite dans Milvus à des fins d'indexation et de stockage. Milvus est ensuite utilisé pour effectuer une recherche par similarité sur la base d'une inscription, de critères de recherche, d'un profil d'utilisateur ou d'autres critères.</p>
<p>Par exemple, lors de la recherche d'autres maisons similaires à une annonce donnée, des caractéristiques telles que le plan d'étage, la taille, l'orientation, les finitions intérieures, les couleurs de peinture, etc. sont extraites. La base de données originale des annonces immobilières ayant été <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indexée</a>, les recherches peuvent être effectuées en quelques millisecondes. Le produit final de Beike avait un temps de recherche moyen de 113 millisecondes sur un ensemble de données contenant plus de 3 millions de vecteurs. Cependant, Milvus est capable de maintenir des vitesses efficaces sur des ensembles de données à l'échelle du trillion, ce qui facilite le travail de cette base de données immobilière relativement petite. En général, le système suit le processus suivant :</p>
<ol>
<li><p>Les modèles d'apprentissage profond (par exemple, CNN, RNN ou BERT) convertissent les données non structurées en vecteurs de caractéristiques, qui sont ensuite importés dans Milvus.</p></li>
<li><p>Milvus stocke et indexe les vecteurs de caractéristiques.</p></li>
<li><p>Milvus renvoie des résultats de recherche de similitudes en fonction des requêtes de l'utilisateur.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>La plateforme de recherche immobilière intelligente de Beike est alimentée par un algorithme de recommandation qui calcule la similarité des vecteurs à l'aide de la distance cosinusoïdale. Le système trouve des logements similaires en fonction des annonces favorites et des critères de recherche. À un niveau élevé, il fonctionne comme suit :</p>
<ol>
<li><p>Sur la base d'une annonce, des caractéristiques telles que le plan, la taille et l'orientation sont utilisées pour extraire 4 collections de vecteurs de caractéristiques.</p></li>
<li><p>Les collections de caractéristiques extraites sont utilisées pour effectuer une recherche de similarité dans Milvus. Les résultats de la requête pour chaque collection de vecteurs sont une mesure de la similarité entre l'annonce d'entrée et d'autres annonces similaires.</p></li>
<li><p>Les résultats de recherche de chacune des 4 collections de vecteurs sont comparés puis utilisés pour recommander des logements similaires.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagramme.jpg</span> </span></p>
<p><br/></p>
<p>Comme le montre la figure ci-dessus, le système met en œuvre un mécanisme de commutation de table A/B pour la mise à jour des données. Milvus stocke les données des T premiers jours dans la table A, au jour T+1, il commence à stocker les données dans la table B, au jour 2T+1, il commence à réécrire la table A, et ainsi de suite.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Pour en savoir plus sur la création d'objets avec Milvus, consultez les ressources suivantes :</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Construire un assistant d'écriture doté d'une IA pour WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Créer avec Milvus : Recommandation d'actualités alimentée par l'IA dans le navigateur mobile de Xiaomi</a></p></li>
</ul>
