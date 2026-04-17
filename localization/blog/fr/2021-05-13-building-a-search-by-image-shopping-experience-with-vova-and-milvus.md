---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Construire une expérience d'achat par image avec VOVA et Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Découvrez comment Milvus, une base de données vectorielles open-source, a été
  utilisée par la plateforme de commerce électronique VOVA pour permettre le
  shopping par l'image.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Construire une expérience de recherche par image avec VOVA et Milvus</custom-h1><p>Aller à :</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Construire une expérience de recherche par image avec VOVA et Milvus</a><ul>
<li><a href="#how-does-image-search-work">Comment fonctionne la recherche d'images</a>- <a href="#system-process-of-vovas-search-by-image-functionality"><em>Processus du système de la fonctionnalité de recherche d'images de VOVA.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Détection de cibles à l'aide du modèle</a> <a href="#yolo-network-architecture"><em>YOLO</em></a> - <a href="#yolo-network-architecture"><em>Architecture du réseau YOLO.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Extraction de vecteurs de caractéristiques d'images avec ResNet</a>- <a href="#resnet-structure"><em>Structure de ResNet.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Recherche de similarité vectorielle avec Milvus</a>- <a href="#mishards-architecture-in-milvus"><em>Architecture Mishards dans Milvus</em></a>.</li>
<li><a href="#vovas-shop-by-image-tool">Outil d'achat par image de VOVA</a>- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>Captures d'écran de l'outil d'achat par image de VOVA</em></a>.</li>
<li><a href="#reference">Référence</a></li>
</ul></li>
</ul>
<p>Les achats en ligne ont <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">augmenté de 44 %</a> en 2020, en grande partie à cause de la pandémie de coronavirus. Les gens cherchant à se distancer socialement et à éviter tout contact avec des étrangers, la livraison sans contact est devenue une option incroyablement souhaitable pour de nombreux consommateurs. Cette popularité a également conduit les gens à acheter une plus grande variété de produits en ligne, y compris des articles de niche qui peuvent être difficiles à décrire à l'aide d'une recherche traditionnelle par mot-clé.</p>
<p>Pour aider les utilisateurs à surmonter les limites des requêtes par mots clés, les entreprises peuvent créer des moteurs de recherche d'images qui permettent aux utilisateurs d'utiliser des images au lieu de mots pour la recherche. Non seulement cela permet aux utilisateurs de trouver des articles difficiles à décrire, mais cela les aide également à acheter des objets qu'ils rencontrent dans la vie réelle. Cette fonctionnalité contribue à créer une expérience utilisateur unique et offre une commodité générale que les clients apprécient.</p>
<p>VOVA est une plateforme de commerce électronique émergente qui met l'accent sur le caractère abordable et l'expérience d'achat positive pour ses utilisateurs, avec des listes couvrant des millions de produits et la prise en charge de 20 langues et de 35 devises principales. Pour améliorer l'expérience d'achat de ses utilisateurs, la société a utilisé Milvus pour intégrer une fonctionnalité de recherche d'images à sa plate-forme de commerce électronique. Cet article explique comment VOVA a réussi à créer un moteur de recherche d'images avec Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">Comment fonctionne la recherche d'images ?</h3><p>Le système d'achat par image de VOVA recherche dans l'inventaire de la société des images de produits similaires à celles téléchargées par l'utilisateur. Le graphique suivant montre les deux étapes du processus du système, l'importation des données (en bleu) et l'interrogation (en orange) :</p>
<ol>
<li>Utiliser le modèle YOLO pour détecter les cibles à partir des photos téléchargées ;</li>
<li>Utiliser ResNet pour extraire les vecteurs de caractéristiques des cibles détectées ;</li>
<li>utiliser Milvus pour la recherche de similarités vectorielles.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Détection de cibles à l'aide du modèle YOLO</h3><p>Les applications mobiles de VOVA sur Android et iOS prennent actuellement en charge la recherche d'images. La société utilise un système de pointe de détection d'objets en temps réel appelé YOLO (You only look once) pour détecter les objets dans les images téléchargées par les utilisateurs. Le modèle YOLO en est actuellement à sa cinquième itération.</p>
<p>YOLO est un modèle à une étape, qui utilise un seul réseau neuronal convolutionnel (CNN) pour prédire les catégories et les positions des différentes cibles. Il est petit, compact et bien adapté à une utilisation mobile.</p>
<p>YOLO utilise des couches convolutives pour extraire les caractéristiques et des couches entièrement connectées pour obtenir des valeurs prédites. S'inspirant du modèle GooLeNet, le CNN de YOLO comprend 24 couches convolutives et deux couches entièrement connectées.</p>
<p>Comme le montre l'illustration suivante, une image d'entrée de 448 × 448 est convertie par un certain nombre de couches convolutives et de couches de mise en commun en un tenseur de 7 × 7 × 1024 dimensions (représenté dans l'avant-dernier cube ci-dessous), puis convertie par deux couches entièrement connectées en un tenseur de sortie de 7 × 7 × 30 dimensions.</p>
<p>La sortie prédite de YOLO P est un tenseur bidimensionnel dont la forme est [batch,7 ×7 ×30]. En utilisant le découpage, P[ :,0:7×7×20] est la probabilité de la catégorie, P[ :,7×7×20:7×7×(20+2)] est la confiance et P[ :,7×7×(20+2)] :] est le résultat prédit de la boîte englobante.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;Architecture du réseau YOLO.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Extraction de vecteurs de caractéristiques d'image avec ResNet</h3><p>VOVA a adopté le modèle de réseau neuronal résiduel (ResNet) pour extraire les vecteurs de caractéristiques d'une vaste bibliothèque d'images de produits et de photos téléchargées par les utilisateurs. ResNet est limité car la précision d'un réseau d'apprentissage diminue au fur et à mesure que sa profondeur augmente. L'image ci-dessous montre ResNet exécutant le modèle VGG19 (une variante du modèle VGG) modifié pour inclure une unité résiduelle par le biais du mécanisme de court-circuit. Le modèle VGG a été proposé en 2014 et ne comprend que 14 couches, tandis que ResNet est sorti un an plus tard et peut en compter jusqu'à 152.</p>
<p>La structure ResNet est facile à modifier et à mettre à l'échelle. En changeant le nombre de canaux dans le bloc et le nombre de blocs empilés, la largeur et la profondeur du réseau peuvent être facilement ajustées pour obtenir des réseaux avec différentes capacités expressives. Cela permet de résoudre efficacement l'effet de dégénérescence du réseau, où la précision diminue au fur et à mesure que la profondeur d'apprentissage augmente. Avec suffisamment de données d'apprentissage, il est possible d'obtenir un modèle dont les performances expressives s'améliorent tout en approfondissant progressivement le réseau. Grâce à l'apprentissage du modèle, les caractéristiques sont extraites pour chaque image et converties en vecteurs à virgule flottante à 256 dimensions.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Recherche de similitudes vectorielles par Milvus</h3><p>La base de données d'images de produits de VOVA comprend 30 millions d'images et croît rapidement. Pour extraire rapidement les images de produits les plus similaires de cet énorme ensemble de données, Milvus est utilisé pour effectuer une recherche de similarité vectorielle. Grâce à un certain nombre d'optimisations, Milvus offre une approche rapide et rationalisée de la gestion des données vectorielles et de la création d'applications d'apprentissage automatique. Milvus offre une intégration avec des bibliothèques d'index populaires (par exemple, Faiss, Annoy), prend en charge plusieurs types d'index et de mesures de distance, dispose de SDK dans plusieurs langues et fournit des API riches pour la gestion des données vectorielles.</p>
<p>Milvus peut effectuer des recherches de similarité sur des ensembles de données vectorielles en quelques millisecondes, avec un temps de requête inférieur à 1,5 seconde lorsque nq=1 et un temps de requête moyen par lot inférieur à 0,08 seconde. Pour construire son moteur de recherche d'images, VOVA s'est référé à la conception de Mishards, la solution middleware de partage de Milvus (voir le graphique ci-dessous pour la conception du système), pour mettre en œuvre une grappe de serveurs à haute disponibilité. En tirant parti de l'évolutivité horizontale d'un cluster Milvus, l'exigence du projet en matière de performances d'interrogation élevées sur des ensembles de données massifs a été satisfaite.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">L'outil d'achat par image de VOVA</h3><p>Les captures d'écran ci-dessous montrent l'outil de recherche par image de VOVA sur l'application Android de la société.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>Comme de plus en plus d'utilisateurs recherchent des produits et téléchargent des photos, VOVA continuera à optimiser les modèles qui alimentent le système. En outre, la société intégrera de nouvelles fonctionnalités Milvus qui peuvent améliorer l'expérience d'achat en ligne de ses utilisateurs.</p>
<h3 id="Reference" class="common-anchor-header">Référence</h3><p><strong>YOLO :</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet :</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus :</strong></p>
<p>https://milvus.io/docs</p>
