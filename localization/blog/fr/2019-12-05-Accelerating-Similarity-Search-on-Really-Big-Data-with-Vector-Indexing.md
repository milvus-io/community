---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Accélérer la recherche de similitudes sur des données très volumineuses grâce
  à l'indexation vectorielle
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Sans indexation vectorielle, de nombreuses applications modernes de l'IA
  seraient extrêmement lentes. Découvrez comment sélectionner le bon index pour
  votre prochaine application d'apprentissage automatique.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Accélérer la recherche de similitudes sur des données très volumineuses grâce à l'indexation vectorielle</custom-h1><p>De la vision artificielle à la découverte de nouveaux médicaments, les moteurs de recherche de similarités vectorielles alimentent de nombreuses applications d'intelligence artificielle (IA). L'indexation, un processus d'organisation des données qui accélère considérablement la recherche dans les big data, est un élément essentiel qui permet d'interroger efficacement les ensembles de données de millions, de milliards, voire de trillions de vecteurs sur lesquels s'appuient les moteurs de recherche par similarité. Cet article traite du rôle de l'indexation dans l'efficacité de la recherche de similarités vectorielles, des différents types d'index de fichiers vectoriels inversés (FVI) et des conseils sur le choix de l'index à utiliser dans différents scénarios.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Accélérer la recherche de similarités sur des données très volumineuses grâce à l'indexation vectorielle</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">Comment l'indexation vectorielle accélère-t-elle la recherche de similarités et l'apprentissage automatique ?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Quels sont les différents types d'index IVF et quels sont les scénarios pour lesquels ils sont les mieux adaptés ?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT : Bon pour la recherche d'ensembles de données relativement petits (à l'échelle d'un million) lorsqu'un rappel de 100 % est requis.</a><ul>
<li><a href="#flat-performance-test-results">Résultats des tests de performance de FLAT :</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Résultats des tests de temps de requête pour l'index FLAT dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Principaux enseignements :</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT : Améliore la vitesse au détriment de la précision (et vice versa).</a><ul>
<li><a href="#ivf_flat-performance-test-results">Résultats du test de performance IVF_FLAT :</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Résultats des tests de temps de requête pour l'index IVF_FLAT dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Principaux enseignements :</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Résultats du test du taux de rappel pour l'indice IVF_FLAT dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Principaux enseignements :</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8 : plus rapide et moins gourmand en ressources que IVF_FLAT, mais aussi moins précis.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">Résultats des tests de performance de l'index IVF_SQ8 :</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Résultats des tests de temps de requête pour l'index IVF_SQ8 dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Principaux enseignements :</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Résultats du test du taux de rappel pour l'index IVF_SQ8 dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Principaux enseignements :</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H : Nouvelle approche hybride GPU/CPU encore plus rapide que IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Résultats des tests de performance de l'IVF_SQ8H :</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Résultats des tests de temps de requête pour l'index IVF_SQ8H dans Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Principaux enseignements :</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">En savoir plus sur Milvus, une plateforme de gestion de données vectorielles à grande échelle.</a></li>
<li><a href="#methodology">Méthodologie</a><ul>
<li><a href="#performance-testing-environment">Environnement de test des performances</a></li>
<li><a href="#relevant-technical-concepts">Concepts techniques pertinents</a></li>
<li><a href="#resources">Ressources</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">Comment l'indexation vectorielle accélère-t-elle la recherche de similarités et l'apprentissage automatique ?</h3><p>Les moteurs de recherche de similarité fonctionnent en comparant une entrée à une base de données pour trouver les objets qui sont les plus similaires à l'entrée. L'indexation est le processus d'organisation efficace des données et joue un rôle majeur dans l'utilité de la recherche de similarité en accélérant considérablement les requêtes fastidieuses sur les grands ensembles de données. Après l'indexation d'un vaste ensemble de données vectorielles, les requêtes peuvent être acheminées vers les grappes, ou sous-ensembles de données, qui sont les plus susceptibles de contenir des vecteurs similaires à une requête d'entrée. Dans la pratique, cela signifie qu'un certain degré de précision est sacrifié pour accélérer les requêtes sur des données vectorielles très volumineuses.</p>
<p>On peut faire une analogie avec un dictionnaire, où les mots sont classés par ordre alphabétique. Lors de la recherche d'un mot, il est possible de naviguer rapidement vers une section qui ne contient que des mots ayant la même initiale, ce qui accélère considérablement la recherche de la définition du mot saisi.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Quels sont les différents types d'index de FIV et quels sont les scénarios pour lesquels ils sont le mieux adaptés ?</h3><p>Il existe de nombreux index conçus pour la recherche de similarités vectorielles en haute dimension, et chacun d'entre eux présente des compromis en termes de performances, de précision et d'exigences de stockage. Cet article présente plusieurs types d'index FVI courants, leurs forces et leurs faiblesses, ainsi que les résultats des tests de performance pour chaque type d'index. Les tests de performance quantifient le temps d'interrogation et les taux de rappel pour chaque type d'index dans <a href="https://milvus.io/">Milvus</a>, une plateforme de gestion de données vectorielles open-source. Pour plus d'informations sur l'environnement de test, voir la section méthodologie au bas de cet article.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT : Bon pour la recherche d'ensembles de données relativement petits (à l'échelle d'un million) lorsqu'un taux de rappel de 100 % est requis.</h3><p>Pour les applications de recherche de similarités vectorielles qui exigent une précision parfaite et qui dépendent d'ensembles de données relativement petits (à l'échelle d'un million), l'index FLAT est un bon choix. FLAT ne compresse pas les vecteurs et est le seul index qui peut garantir des résultats de recherche exacts. Les résultats de FLAT peuvent également servir de point de comparaison pour les résultats produits par d'autres index dont le taux de rappel est inférieur à 100 %.</p>
<p>FLAT est précis parce qu'il adopte une approche exhaustive de la recherche, ce qui signifie que pour chaque requête, l'entrée cible est comparée à tous les vecteurs d'un ensemble de données. Cela fait de FLAT l'index le plus lent de notre liste, et il est mal adapté à l'interrogation de données vectorielles massives. Il n'y a pas de paramètres pour l'index FLAT dans Milvus, et son utilisation ne nécessite pas d'apprentissage des données ni de stockage supplémentaire.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Résultats des tests de performance FLAT :</h4><p>Les tests de performance de l'index FLAT ont été effectués dans Milvus à l'aide d'un ensemble de données composé de 2 millions de vecteurs à 128 dimensions.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png (en anglais)</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>Plus nq (le nombre de vecteurs cibles pour une requête) augmente, plus le temps d'interrogation augmente.</li>
<li>En utilisant l'index FLAT dans Milvus, nous pouvons voir que le temps de requête augmente fortement dès que nq dépasse 200.</li>
<li>En général, l'index FLAT est plus rapide et plus cohérent lorsque Milvus est exécuté sur le GPU par rapport au CPU. Cependant, les requêtes FLAT sur le CPU sont plus rapides lorsque nq est inférieur à 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT : Améliore la vitesse au détriment de la précision (et vice versa).</h3><p>Un moyen courant d'accélérer le processus de recherche de similarités au détriment de la précision consiste à effectuer une recherche approximative du plus proche voisin (ANN). Les algorithmes ANN réduisent les besoins de stockage et la charge de calcul en regroupant les vecteurs similaires, ce qui accélère la recherche de vecteurs. IVF_FLAT est le type d'index de fichiers inversés le plus basique et repose sur une forme de recherche ANN.</p>
<p>IVF_FLAT divise les données vectorielles en un certain nombre d'unités de regroupement (nlist), puis compare les distances entre le vecteur d'entrée cible et le centre de chaque regroupement. En fonction du nombre de grappes que le système doit interroger (nprobe), les résultats de la recherche de similarité sont renvoyés sur la base des comparaisons entre l'entrée cible et les vecteurs dans la ou les grappes les plus similaires uniquement - ce qui réduit considérablement le temps de recherche.</p>
<p>En ajustant nprobe, un équilibre idéal entre la précision et la vitesse peut être trouvé pour un scénario donné. Les résultats de notre test de performance IVF_FLAT montrent que le temps d'interrogation augmente fortement lorsque le nombre de vecteurs d'entrée cibles (nq) et le nombre de grappes à rechercher (nprobe) augmentent. IVF_FLAT ne compresse pas les données vectorielles, mais les fichiers d'index comprennent des métadonnées qui augmentent marginalement les besoins de stockage par rapport à l'ensemble de données vectorielles brutes non indexées.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Résultats des tests de performance d'IVF_FLAT :</h4><p>Les tests de performance d'IVF_FLAT ont été effectués dans Milvus à l'aide de l'ensemble de données publiques 1B SIFT, qui contient 1 milliard de vecteurs à 128 dimensions.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accélérer la recherche de similarité sur des données vraiment volumineuses avec l'indexation vectorielle_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>Lors de l'exécution sur l'unité centrale, le temps d'interrogation de l'index IVF_FLAT dans Milvus augmente avec nprobe et nq. Cela signifie que plus une requête contient de vecteurs d'entrée, ou plus une requête recherche de clusters, plus le temps d'interrogation sera long.</li>
<li>Sur le GPU, l'index présente une variance de temps moindre par rapport aux changements de nq et nprobe. Cela s'explique par le fait que les données de l'index sont volumineuses et que la copie des données de la mémoire du CPU vers la mémoire du GPU représente la majeure partie du temps total de la requête.</li>
<li>Dans tous les scénarios, sauf lorsque nq = 1 000 et nprobe = 32, l'index IVF_FLAT est plus efficace lorsqu'il est exécuté sur l'unité centrale.</li>
</ul>
<p>Les tests de rappel IVF_FLAT ont été effectués dans Milvus en utilisant à la fois l'ensemble de données public 1M SIFT, qui contient 1 million de vecteurs à 128 dimensions, et l'ensemble de données glove-200-angular, qui contient plus d'un million de vecteurs à 200 dimensions, pour la construction de l'index (nlist = 16 384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accélérer la recherche de similarité sur des données vraiment volumineuses avec l'indexation vectorielle_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>L'index IVF_FLAT peut être optimisé pour la précision, atteignant un taux de rappel supérieur à 0,99 sur l'ensemble de données SIFT 1M lorsque nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8 : plus rapide et moins gourmand en ressources qu'IVF_FLAT, mais aussi moins précis.</h3><p>IVF_FLAT n'effectue aucune compression, de sorte que les fichiers d'index qu'il produit sont à peu près de la même taille que les données vectorielles brutes non indexées d'origine. Par exemple, si l'ensemble de données SIFT 1B d'origine pèse 476 Go, les fichiers d'index IVF_FLAT seront légèrement plus volumineux (~470 Go). Le chargement de tous les fichiers d'index en mémoire consommera 470 Go d'espace de stockage.</p>
<p>Lorsque les ressources disque, CPU ou mémoire GPU sont limitées, IVF_SQ8 est une meilleure option qu'IVF_FLAT. Ce type d'index peut convertir chaque FLOAT (4 octets) en UINT8 (1 octet) en effectuant une quantification scalaire. Cela permet de réduire la consommation de mémoire du disque, du CPU et du GPU de 70 à 75 %. Pour l'ensemble de données 1B SIFT, les fichiers d'index IVF_SQ8 ne nécessitent que 140 Go de stockage.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Résultats des tests de performance de l'IVF_SQ8 :</h4><p>Les tests de temps de requête IVF_SQ8 ont été effectués dans Milvus en utilisant l'ensemble de données public 1B SIFT, qui contient 1 milliard de vecteurs à 128 dimensions, pour la construction de l'index.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png (en anglais)</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>En réduisant la taille du fichier d'index, IVF_SQ8 offre de nettes améliorations des performances par rapport à IVF_FLAT. IVF_SQ8 suit une courbe de performance similaire à IVF_FLAT, le temps de requête augmentant avec nq et nprobe.</li>
<li>Comme IVF_FLAT, IVF_SQ8 est plus performant lorsqu'il est exécuté sur l'unité centrale et lorsque nq et nprobe sont plus petits.</li>
</ul>
<p>Les tests de rappel IVF_SQ8 ont été effectués dans Milvus en utilisant à la fois l'ensemble de données public 1M SIFT, qui contient 1 million de vecteurs à 128 dimensions, et l'ensemble de données glove-200-angular, qui contient plus d'un million de vecteurs à 200 dimensions, pour la construction de l'index (nlist = 16 384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accélérer la recherche de similarité sur des données vraiment volumineuses avec l'indexation vectorielle_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>Malgré la compression des données d'origine, IVF_SQ8 ne constate pas de baisse significative de la précision des requêtes. Avec les différents paramètres de nprobe, IVF_SQ8 a un taux de rappel inférieur d'au plus 1 % à celui d'IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H : Nouvelle approche hybride GPU/CPU encore plus rapide que IVF_SQ8.</h3><p>IVF_SQ8H est un nouveau type d'index qui améliore les performances des requêtes par rapport à IVF_SQ8. Lorsqu'un index IVF_SQ8 fonctionnant sur l'unité centrale est interrogé, la majeure partie du temps total d'interrogation est consacrée à la recherche des clusters nprobe les plus proches du vecteur d'entrée cible. Pour réduire le temps d'interrogation, IVF_SQ8 copie les données pour les opérations de quantification grossière, qui sont plus petites que les fichiers d'index, dans la mémoire du GPU, ce qui accélère considérablement les opérations de quantification grossière. Le seuil de recherche gpu_ détermine ensuite le dispositif qui exécute la requête. Lorsque nq &gt;= gpu_search_threshold, le GPU exécute la requête ; dans le cas contraire, le CPU exécute la requête.</p>
<p>IVF_SQ8H est un type d'index hybride qui nécessite la collaboration du CPU et du GPU. Il ne peut être utilisé qu'avec Milvus équipé d'un GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Résultats du test de performance IVF_SQ8H :</h4><p>Les tests de performance du temps de requête IVF_SQ8H ont été effectués dans Milvus en utilisant l'ensemble de données public 1B SIFT, qui contient 1 milliard de vecteurs à 128 dimensions, pour la construction de l'index.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accélérer la recherche de similarité sur des données vraiment volumineuses avec l'indexation vectorielle_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principaux enseignements :</h4><ul>
<li>Lorsque nq est inférieur ou égal à 1 000, IVF_SQ8H obtient des temps de requête presque deux fois plus rapides que IVFSQ8.</li>
<li>Lorsque nq = 2000, les temps de requête pour IVFSQ8H et IVF_SQ8 sont identiques. Cependant, si le paramètre gpu_search_threshold est inférieur à 2000, IVF_SQ8H sera plus performant que IVF_SQ8.</li>
<li>Le taux de rappel des requêtes d'IVF_SQ8H est identique à celui d'IVF_SQ8, ce qui signifie que le temps d'interrogation est réduit sans perte de précision de la recherche.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">En savoir plus sur Milvus, une plateforme de gestion de données vectorielles à grande échelle.</h3><p>Milvus est une plateforme de gestion de données vectorielles qui peut alimenter des applications de recherche par similarité dans des domaines couvrant l'intelligence artificielle, l'apprentissage profond, les calculs vectoriels traditionnels, etc. Pour plus d'informations sur Milvus, consultez les ressources suivantes :</p>
<ul>
<li>Milvus est disponible sous une licence open-source sur <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>Des types d'index supplémentaires, notamment des index basés sur des graphes et des arbres, sont pris en charge dans Milvus. Pour une liste complète des types d'index pris en charge, voir la <a href="https://milvus.io/docs/v0.11.0/index.md">documentation sur les index vectoriels</a> dans Milvus.</li>
<li>Pour en savoir plus sur la société qui a lancé Milvus, visitez <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Discutez avec la communauté Milvus ou obtenez de l'aide en cas de problème sur <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Méthodologie</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Environnement des tests de performance</h4><p>La configuration de serveur utilisée pour les tests de performance mentionnés dans cet article est la suivante :</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 cœurs</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 Go de mémoire</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Concepts techniques pertinents</h4><p>Bien que cela ne soit pas nécessaire à la compréhension de cet article, voici quelques concepts techniques utiles à l'interprétation des résultats de nos tests de performance de l'index :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accélérer la recherche de similarité sur des données vraiment volumineuses avec l'indexation vectorielle_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Ressources</h4><p>Les sources suivantes ont été utilisées pour cet article :</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Encyclopédie des systèmes de bases de données</a>", Ling Liu et M. Tamer Özsu.</li>
</ul>
