---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Construire une recherche sémantique à grande vitesse
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  En savoir plus sur l'utilisation des méthodologies d'apprentissage automatique
  sémantique pour obtenir des résultats de recherche plus pertinents au sein de
  votre organisation.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Construire une recherche sémantique à grande vitesse</custom-h1><p>La<a href="https://lucidworks.com/post/what-is-semantic-search/">recherche sémantique</a> est un outil formidable pour aider vos clients - ou vos employés - à trouver les bons produits ou les bonnes informations. Elle peut même remonter à la surface des informations difficiles à indexer pour obtenir de meilleurs résultats. Cela dit, si vos méthodologies sémantiques ne sont pas déployées pour travailler rapidement, elles ne vous seront d'aucune utilité. Le client ou l'employé ne va pas s'asseoir pendant que le système prend son temps pour répondre à sa requête - et il est probable qu'un millier d'autres requêtes soient ingérées en même temps.</p>
<p>Comment rendre la recherche sémantique plus rapide ? Une recherche sémantique lente ne suffira pas.</p>
<p>Heureusement, c'est le genre de problème que Lucidworks aime résoudre. Nous avons récemment testé un cluster de taille modeste - lisez la suite pour plus de détails - qui a permis d'obtenir 1 500 RPS (requêtes par seconde) sur une collection de plus d'un million de documents, avec un temps de réponse moyen d'environ 40 millisecondes. Il s'agit là d'une véritable vitesse.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Mise en œuvre de la recherche sémantique</h3><p>Pour que la magie de l'apprentissage automatique se produise à la vitesse de l'éclair, Lucidworks a mis en œuvre la recherche sémantique en utilisant l'approche de la recherche vectorielle sémantique. Il y a deux parties essentielles.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Première partie : le modèle d'apprentissage automatique</h4><p>Tout d'abord, vous avez besoin d'un moyen d'encoder du texte dans un vecteur numérique. Le texte peut être une description de produit, une requête de recherche d'un utilisateur, une question ou même une réponse à une question. Un modèle de recherche sémantique est entraîné à coder le texte de manière à ce que le texte qui est sémantiquement similaire à d'autres textes soit codé dans des vecteurs qui sont numériquement "proches" les uns des autres. Cette étape d'encodage doit être rapide afin de prendre en charge le millier ou plus de recherches possibles de clients ou de requêtes d'utilisateurs qui arrivent chaque seconde.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Deuxième partie : le moteur de recherche vectoriel</h4><p>Deuxièmement, vous devez trouver rapidement les meilleures correspondances avec la recherche du client ou la requête de l'utilisateur. Le modèle aura encodé ce texte en un vecteur numérique. À partir de là, vous devez le comparer à tous les vecteurs numériques de votre catalogue ou de vos listes de questions et réponses pour trouver les meilleures correspondances, c'est-à-dire les vecteurs les plus "proches" du vecteur de la requête. Pour ce faire, vous aurez besoin d'un moteur vectoriel capable de traiter toutes ces informations efficacement et à la vitesse de l'éclair. Le moteur peut contenir des millions de vecteurs, alors que vous ne souhaitez obtenir qu'une vingtaine de correspondances avec votre requête. Et bien sûr, il doit traiter un millier de requêtes de ce type chaque seconde.</p>
<p>Pour relever ces défis, nous avons ajouté le moteur de recherche vectorielle <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> dans la <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">version 5.3 de Fusion</a>. Milvus est un logiciel libre et rapide. Milvus utilise FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), la même technologie que Facebook utilise en production pour ses propres initiatives d'apprentissage automatique. Si nécessaire, il peut fonctionner encore plus rapidement sur <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>. Lorsque Fusion 5.3 (ou supérieur) est installé avec le composant d'apprentissage automatique, Milvus est automatiquement installé dans le cadre de ce composant afin que vous puissiez activer toutes ces capacités en toute simplicité.</p>
<p>La taille des vecteurs d'une collection donnée, spécifiée lors de la création de la collection, dépend du modèle qui produit ces vecteurs. Par exemple, une collection donnée peut stocker les vecteurs créés à partir de l'encodage (via un modèle) de toutes les descriptions de produits dans un catalogue de produits. Sans un moteur de recherche vectoriel comme Milvus, les recherches de similarité ne seraient pas possibles dans l'ensemble de l'espace vectoriel. Les recherches de similitudes devraient donc être limitées à des candidats présélectionnés dans l'espace vectoriel (par exemple, 500), ce qui entraînerait des performances plus lentes et des résultats de moindre qualité. Milvus peut stocker des centaines de milliards de vecteurs dans plusieurs collections de vecteurs afin de garantir la rapidité de la recherche et la pertinence des résultats.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Utilisation de la recherche sémantique</h3><p>Revenons au flux de travail de la recherche sémantique, maintenant que nous avons un peu appris pourquoi Milvus peut être si important. La recherche sémantique se déroule en trois étapes. Au cours de la première étape, le modèle d'apprentissage automatique est chargé et/ou formé. Ensuite, les données sont indexées dans Milvus et Solr. La dernière étape est celle de la requête, lorsque la recherche proprement dite a lieu. Nous nous concentrerons sur ces deux dernières étapes ci-dessous.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indexation dans Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Comme le montre le diagramme ci-dessus, l'étape d'interrogation commence de la même manière que l'étape d'indexation, mais les requêtes arrivent à la place des documents. Pour chaque requête :</p>
<ol>
<li>La requête est envoyée au pipeline d'indexation <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>.</li>
<li>La requête est ensuite envoyée au modèle ML.</li>
<li>Le modèle ML renvoie un vecteur numérique (crypté à partir de la requête). Là encore, le type de modèle détermine la taille du vecteur.</li>
<li>Le vecteur est envoyé à Milvus, qui détermine alors quels vecteurs, dans la collection Milvus spécifiée, correspondent le mieux au vecteur fourni.</li>
<li>Milvus renvoie une liste d'ID et de distances uniques correspondant aux vecteurs déterminés à la quatrième étape.</li>
<li>Une requête contenant ces ID et ces distances est envoyée à Solr.</li>
<li>Solr renvoie alors une liste ordonnée des documents associés à ces identifiants.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Test d'échelle</h3><p>Afin de prouver que nos flux de recherche sémantique fonctionnent avec l'efficacité requise pour nos clients, nous avons effectué des tests d'échelle à l'aide de scripts Gatling sur la Google Cloud Platform en utilisant un cluster Fusion avec huit répliques du modèle ML, huit répliques du service de requête et une seule instance de Milvus. Les tests ont été effectués à l'aide des index Milvus FLAT et HNSW. L'index FLAT a un rappel de 100 %, mais il est moins efficace, sauf lorsque les ensembles de données sont petits. L'index HNSW (Hierarchical Small World Graph) présente toujours des résultats de haute qualité et ses performances sont améliorées sur des ensembles de données plus importants.</p>
<p>Voyons maintenant quelques chiffres tirés d'un exemple récent :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Pour commencer</h3><p>Les pipelines de <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> sont conçus pour être faciles à utiliser. Lucidworks dispose de <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">modèles pré-entraînés qui sont faciles à déployer</a> et donnent généralement de bons résultats. Cependant, l'entraînement de vos propres modèles, en tandem avec les modèles pré-entraînés, offre les meilleurs résultats. Contactez-nous dès aujourd'hui pour savoir comment vous pouvez mettre en œuvre ces initiatives dans vos outils de recherche afin d'obtenir des résultats plus efficaces et plus agréables.</p>
<blockquote>
<p>Ce blog est repris de : https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
