---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: >-
  Extraction des faits marquants d'un événement à l'aide de l'application
  iYUNDONG Sports
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Réalisation avec Milvus Système intelligent de recherche d'images pour le
  sport App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Extraction des faits marquants d'un événement à l'aide de l'application sportive iYUNDONG</custom-h1><p>iYUNDONG est une société Internet qui vise à attirer davantage d'amateurs de sport et de participants à des événements tels que les marathons. Elle conçoit des outils d'<a href="https://en.wikipedia.org/wiki/Artificial_intelligence">intelligence artificielle (IA)</a> capables d'analyser les médias capturés lors d'événements sportifs afin de générer automatiquement des moments forts. Par exemple, en téléchargeant un selfie, un utilisateur de l'application sportive iYUNDONG qui a participé à un événement sportif peut instantanément récupérer ses propres photos ou clips vidéo à partir d'un vaste ensemble de données médiatiques de l'événement.</p>
<p>L'une des principales caractéristiques de l'application iYUNDONG est la fonction "Find me in motion".  Les photographes prennent généralement d'énormes quantités de photos ou de vidéos lors d'un événement sportif tel qu'un marathon, et téléchargent les photos et les vidéos en temps réel dans la base de données médiatique de l'application iYUNDONG. Les marathoniens qui souhaitent revoir les moments forts de leur course peuvent récupérer des photos d'eux-mêmes en téléchargeant simplement l'un de leurs selfies. Ils gagnent ainsi beaucoup de temps, car un système de recherche d'images dans l'application iYUNDONG se charge de la mise en correspondance des images. <a href="https://milvus.io/">Milvus</a> est adopté par iYUNDONG pour alimenter ce système, car Milvus peut accélérer considérablement le processus de récupération et renvoyer des résultats très précis.</p>
<p><br/></p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Extraction des faits marquants d'un événement à l'aide de l'application iYUNDONG Sports</a><ul>
<li><a href="#difficulties-and-solutions">Difficultés et solutions</a></li>
<li><a href="#what-is-milvus">Qu'est-ce que Milvus</a>- <a href="#an-overview-of-milvus"><em>Une vue d'ensemble de Milvus.</em></a></li>
<li><a href="#why-milvus">Pourquoi Milvus ?</a></li>
<li><a href="#system-and-workflow">Système et flux de travail</a></li>
<li><a href="#iyundong-app-interface">Interface de l'application iYUNDONG</a>- <a href="#iyundong-app-interface-1"><em>Interface de l'application iYUNDONG.</em></a></li>
<li><a href="#conclusion">Conclusion</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Difficultés et solutions</h3><p>iYUNDONG a été confronté aux problèmes suivants et a trouvé des solutions correspondantes lors de la création de son système de recherche d'images.</p>
<ul>
<li>Les photos d'événements doivent être immédiatement disponibles pour la recherche.</li>
</ul>
<p>iYUNDONG a développé une fonction appelée InstantUpload pour s'assurer que les photos d'événements sont disponibles pour la recherche immédiatement après leur téléchargement.</p>
<ul>
<li>Stockage d'ensembles de données massives</li>
</ul>
<p>Des données massives telles que des photos et des vidéos sont téléchargées vers le backend de l'iYUNDONG toutes les millisecondes. iYUNDONG a donc décidé de migrer vers des systèmes de stockage en nuage, notamment <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> et <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a>, afin de traiter des volumes gargantuesques de données non structurées de manière sécurisée, rapide et fiable.</p>
<ul>
<li>Lecture instantanée</li>
</ul>
<p>Pour réaliser la lecture instantanée, iYUNDONG a développé son propre middleware de sharding afin d'atteindre facilement l'évolutivité horizontale et d'atténuer l'impact de la lecture sur disque sur le système. En outre, <a href="https://redis.io/">Redis</a> est utilisé comme couche de mise en cache pour garantir des performances constantes en cas de forte concurrence.</p>
<ul>
<li>Extraction instantanée des traits du visage</li>
</ul>
<p>Afin d'extraire avec précision et efficacité les caractéristiques faciales des photos téléchargées par les utilisateurs, iYUNDONG a développé un algorithme de conversion d'image propriétaire qui convertit les images en vecteurs de caractéristiques à 128 dimensions. Un autre problème rencontré est que, souvent, de nombreux utilisateurs et photographes téléchargent des images ou des vidéos simultanément. Les ingénieurs système ont donc dû tenir compte de l'évolutivité dynamique lors du déploiement du système. Plus précisément, iYUNDONG a pleinement tiré parti de son service de calcul élastique (ECS) sur le nuage pour réaliser une mise à l'échelle dynamique.</p>
<ul>
<li>Recherche vectorielle rapide et à grande échelle</li>
</ul>
<p>iYUNDONG avait besoin d'une base de données vectorielle pour stocker son grand nombre de vecteurs de caractéristiques extraits par des modèles d'IA. En fonction de son scénario d'application commerciale unique, iYUNDONG attendait de la base de données vectorielle qu'elle soit en mesure de</p>
<ol>
<li>Effectuer des recherches vectorielles très rapides sur des ensembles de données ultra-larges.</li>
<li>d'assurer un stockage de masse à moindre coût.</li>
</ol>
<p>Au départ, une moyenne d'un million d'images était traitée chaque année, de sorte que iYUNDONG stockait toutes ses données de recherche dans la mémoire vive. Cependant, au cours des deux dernières années, son activité a connu un essor fulgurant et une croissance exponentielle des données non structurées - le nombre d'images dans la base de données de iYUNDONG a dépassé 60 millions en 2019, ce qui signifie que plus d'un milliard de vecteurs de caractéristiques ont dû être stockés. Une énorme quantité de données a inévitablement rendu le système iYUNDONG lourd et consommateur de ressources. Il a donc fallu investir continuellement dans des installations matérielles pour assurer une performance élevée. Plus précisément, l'iYUNDONG a déployé davantage de serveurs de recherche, une mémoire vive plus importante et une unité centrale plus performante afin de parvenir à une plus grande efficacité et à une évolutivité horizontale. Cependant, l'un des défauts de cette solution était qu'elle entraînait des coûts d'exploitation prohibitifs. Par conséquent, iYUNDONG a commencé à explorer une meilleure solution à ce problème et a réfléchi à la possibilité d'exploiter des bibliothèques d'index vectoriels comme Faiss pour économiser des coûts et mieux orienter ses activités. Finalement, iYUNDONG a choisi la base de données vectorielles open-source Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Qu'est-ce que Milvus ?</h3><p>Milvus est une base de données vectorielles open-source facile à utiliser, très flexible, fiable et extrêmement rapide. Combiné à divers modèles d'apprentissage profond tels que la reconnaissance photo et vocale, le traitement vidéo, le traitement du langage naturel, Milvus peut traiter et analyser des données non structurées qui sont converties en vecteurs à l'aide de divers algorithmes d'IA. Vous trouverez ci-dessous le flux de travail de la manière dont Milvus traite toutes les données non structurées :</p>
<p>● Les données non structurées sont converties en vecteurs d'intégration par des modèles d'apprentissage profond ou d'autres algorithmes d'IA.</p>
<p>● Ensuite, les vecteurs d'intégration sont insérés dans Milvus pour être stockés. Milvus construit également des index pour ces vecteurs.</p>
<p>● Milvus effectue une recherche de similarité et renvoie des résultats de recherche précis en fonction de divers besoins commerciaux.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONG Blog 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Pourquoi Milvus</h3><p>Depuis la fin de l'année 2019, iYUNDONG a effectué une série de tests sur l'utilisation de Milvus pour alimenter son système de recherche d'images. Les résultats des tests ont révélé que Milvus surpasse les autres bases de données vectorielles grand public, car il prend en charge plusieurs index et peut réduire efficacement l'utilisation de la RAM, ce qui comprime considérablement la chronologie de la recherche de similarités vectorielles.</p>
<p>De plus, de nouvelles versions de Milvus sont régulièrement publiées. Au cours de la période de test, Milvus a fait l'objet de plusieurs mises à jour, de la version 0.6.0 à la version 0.10.1.</p>
<p>En outre, grâce à sa communauté open-source active et à ses puissantes fonctionnalités prêtes à l'emploi, Milvus permet à iYUNDONG d'opérer avec un budget de développement serré.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Système et flux de travail</h3><p>Le système de iYUNDONG extrait les caractéristiques faciales en détectant d'abord les visages dans les photos d'événements téléchargées par les photographes. Ces caractéristiques faciales sont ensuite converties en vecteurs à 128 dimensions et stockées dans la bibliothèque Milvus. Milvus crée des index pour ces vecteurs et peut instantanément fournir des résultats très précis.</p>
<p>D'autres informations supplémentaires, telles que les identifiants des photos et les coordonnées indiquant la position d'un visage sur une photo, sont stockées dans une base de données tierce.</p>
<p>Chaque vecteur de caractéristiques a son ID unique dans la bibliothèque Milvus. iYUNDONG a adopté l'<a href="https://github.com/Meituan-Dianping/Leaf">algorithme Leaf</a>, un service de génération d'ID distribué développé par la plateforme de R&amp;D de base <a href="https://about.meituan.com/en">Meituan</a>, pour associer l'ID du vecteur dans Milvus à l'information supplémentaire correspondante stockée dans une autre base de données. En combinant le vecteur de caractéristiques et les informations supplémentaires, le système iYUNDONG peut renvoyer des résultats similaires lors de la recherche de l'utilisateur.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Interface de l'application iYUNDONG</h3><p>La page d'accueil présente une série d'événements sportifs récents. En appuyant sur l'un des événements, les utilisateurs peuvent en voir tous les détails.</p>
<p>Après avoir appuyé sur le bouton en haut de la page de la galerie de photos, les utilisateurs peuvent télécharger une photo de leur choix pour récupérer des images de leurs moments forts.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusion</h3><p>Cet article présente comment l'application iYUNDONG construit un système intelligent de recherche d'images qui peut renvoyer des résultats de recherche précis sur la base de photos téléchargées par l'utilisateur dont la résolution, la taille, la clarté, l'angle et d'autres aspects compliquent la recherche de similitudes. Avec l'aide de Milvus, l'application iYUNDONG peut exécuter avec succès des requêtes au niveau de la milliseconde sur une base de données de plus de 60 millions d'images. Le taux de précision de l'extraction des photos est constamment supérieur à 92 %. Milvus permet à iYUNDONG de créer plus facilement un système de recherche d'images puissant, de niveau entreprise, en peu de temps et avec des ressources limitées.</p>
<p>Lisez d'autres <a href="https://zilliz.com/user-stories">témoignages d'utilisateurs</a> pour en savoir plus sur l'utilisation de Milvus.</p>
