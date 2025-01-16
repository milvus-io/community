---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Accélérer la compilation 2,5 fois avec le découplage des dépendances et la
  conteneurisation des tests
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Découvrez comment zilliz a réduit les temps de compilation de 2,5 fois en
  utilisant le découplage des dépendances et les techniques de conteneurisation
  pour les projets d'IA et de MLOps à grande échelle.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Accélérer la compilation de 2,5 fois avec le découplage des dépendances et la conteneurisation des tests</custom-h1><p>Le temps de compilation peut être compliqué par des dépendances internes et externes complexes qui évoluent tout au long du processus de développement, ainsi que par des changements dans les environnements de compilation tels que le système d'exploitation ou les architectures matérielles. Voici quelques problèmes courants que l'on peut rencontrer lorsqu'on travaille sur des projets d'IA ou de MLOps à grande échelle :</p>
<p><strong>Compilation excessivement longue</strong> - L'intégration du code se fait des centaines de fois par jour. Avec des centaines de milliers de lignes de code en place, même une petite modification peut entraîner une compilation complète qui prend généralement une ou plusieurs heures.</p>
<p><strong>Environnement de compilation complexe</strong> - Le code du projet doit être compilé dans différents environnements, qui impliquent différents systèmes d'exploitation, tels que CentOS et Ubuntu, des dépendances sous-jacentes, telles que GCC, LLVM et CUDA, et des architectures matérielles. La compilation dans un environnement spécifique peut normalement ne pas fonctionner dans un environnement différent.</p>
<p><strong>Dépendances complexes</strong> - La compilation d'un projet implique plus de 30 dépendances entre composants et avec des tiers. Le développement d'un projet entraîne souvent des changements dans les dépendances, ce qui provoque inévitablement des conflits de dépendances. Le contrôle de version entre les dépendances est si complexe que la mise à jour de la version des dépendances affectera facilement les autres composants.</p>
<p>Le<strong>téléchargement de dépendances tierces est lent ou échoue</strong> - Les retards de réseau ou les bibliothèques de dépendances tierces instables entraînent des téléchargements de ressources lents ou des échecs d'accès, ce qui affecte sérieusement l'intégration du code.</p>
<p>En découplant les dépendances et en mettant en œuvre la conteneurisation des tests, nous avons réussi à réduire le temps de compilation moyen de 60 % lorsque nous travaillions sur le projet open-source de recherche de similarité d'embeddings <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Découpler les dépendances du projet</h3><p>La compilation d'un projet implique généralement un grand nombre de dépendances internes et externes. Plus un projet a de dépendances, plus il devient complexe de les gérer. Au fur et à mesure que le logiciel se développe, il devient plus difficile et plus coûteux de modifier ou de supprimer les dépendances, ainsi que d'identifier les effets de ces modifications. Une maintenance régulière est nécessaire tout au long du processus de développement pour garantir le bon fonctionnement des dépendances. Une mauvaise maintenance, des dépendances complexes ou défectueuses peuvent provoquer des conflits qui ralentissent ou bloquent le développement. En pratique, cela peut se traduire par des téléchargements de ressources tardifs, des échecs d'accès qui ont un impact négatif sur l'intégration du code, et bien d'autres choses encore. Le découplage des dépendances d'un projet peut atténuer les défauts et réduire le temps de compilation, en accélérant les tests du système et en évitant de ralentir inutilement le développement du logiciel.</p>
<p>Nous vous recommandons donc de découpler les dépendances de votre projet :</p>
<ul>
<li>Séparer les composants ayant des dépendances complexes</li>
<li>Utiliser différents référentiels pour la gestion des versions.</li>
<li>Utiliser des fichiers de configuration pour gérer les informations sur les versions, les options de compilation, les dépendances, etc.</li>
<li>Ajoutez les fichiers de configuration aux bibliothèques de composants afin qu'ils soient mis à jour au fur et à mesure de l'itération du projet.</li>
</ul>
<p><strong>Optimisation de la compilation entre les composants</strong> - Tirer et compiler le composant approprié en fonction des dépendances et des options de compilation enregistrées dans les fichiers de configuration. Marquez et emballez les résultats de la compilation binaire et les fichiers manifestes correspondants, puis téléchargez-les dans votre dépôt privé. Si aucune modification n'est apportée à un composant ou aux composants dont il dépend, lire ses résultats de compilation conformément aux fichiers manifestes. En cas de problèmes tels que des retards de réseau ou des bibliothèques de dépendances tierces instables, essayez de mettre en place un référentiel interne ou d'utiliser des référentiels miroirs.</p>
<p>Pour optimiser la compilation entre les composants :</p>
<p>1. créer un graphe de relations de dépendance - Utilisez les fichiers de configuration des bibliothèques de composants pour créer un graphe de relations de dépendance. Utilisez la relation de dépendance pour récupérer les informations de version (Git Branch, Tag, et Git commit ID) et les options de compilation et plus encore des composants dépendants en amont et en aval.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>. vérifier les dépendances</strong> - générer des alertes pour les dépendances circulaires, les conflits de version et d'autres problèmes qui surviennent entre les composants.</p>
<p>3<strong>. aplanir les dépendances</strong> - Trier les dépendances par recherche en profondeur (DFS) et fusionner les composants ayant des dépendances en double pour former un graphe de dépendances.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4. utiliser l'algorithme MerkleTree pour générer un hachage (Root Hash) contenant les dépendances de chaque composant sur la base des informations de version, des options de compilation, etc. Combiné à des informations telles que le nom du composant, l'algorithme forme une étiquette unique pour chaque composant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5. en se basant sur les informations de l'étiquette unique du composant, vérifier si une archive de compilation correspondante existe dans le repo privé. Si une archive de compilation est récupérée, décompressez-la pour obtenir le fichier manifeste pour la lecture ; sinon, compilez le composant, marquez les fichiers objets de compilation et le fichier manifeste générés, et téléchargez-les dans le répertoire privé.</p>
<p><br/></p>
<p><strong>Mettre en œuvre des optimisations de compilation dans les composants</strong> - Choisissez un outil de cache de compilation spécifique au langage pour mettre en cache les fichiers objets compilés, puis téléchargez-les et stockez-les dans votre dépôt privé. Pour la compilation C/C++, choisissez un outil de cache de compilation comme CCache pour mettre en cache les fichiers intermédiaires de compilation C/C++, puis archivez le cache CCache local après la compilation. Ces outils de cache de compilation mettent simplement en cache les fichiers de code modifiés un par un après la compilation, et copient les composants compilés du fichier de code inchangé afin qu'ils puissent être directement impliqués dans la compilation finale. L'optimisation de la compilation au sein des composants comprend les étapes suivantes :</p>
<ol>
<li>Ajouter les dépendances de compilation nécessaires au fichier Dockerfile. Utiliser Hadolint pour effectuer des contrôles de conformité sur Dockerfile afin de s'assurer que l'image est conforme aux meilleures pratiques de Docker.</li>
<li>Mettre en miroir l'environnement de compilation en fonction de la version sprint du projet (version + build), du système d'exploitation et d'autres informations.</li>
<li>Exécutez le conteneur de l'environnement de compilation miroir et transférez l'identifiant de l'image au conteneur en tant que variable d'environnement. Voici un exemple de commande pour obtenir l'ID de l'image : "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Choisissez l'outil de cache de compilation approprié : Entrez votre conteneur pour intégrer et compiler vos codes et vérifiez dans votre dépôt privé si un cache de compilation approprié existe. Si c'est le cas, téléchargez-le et extrayez-le dans le répertoire spécifié. Une fois que tous les composants ont été compilés, le cache généré par l'outil de cache de compilation est empaqueté et téléchargé dans votre dépôt privé en fonction de la version du projet et de l'ID de l'image.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Optimisation de la compilation</h3><p>Notre version initiale occupe trop d'espace disque et de bande passante, et prend beaucoup de temps à déployer, nous avons pris les mesures suivantes :</p>
<ol>
<li>Choisir l'image de base la plus légère pour réduire la taille de l'image, par exemple alpine, busybox, etc.</li>
<li>Réduire le nombre de couches d'images. Réutiliser les dépendances autant que possible. Fusionner plusieurs commandes avec "&amp;&amp;".</li>
<li>Nettoyer les produits intermédiaires pendant la construction de l'image.</li>
<li>Utiliser le cache d'image pour construire l'image autant que possible.</li>
</ol>
<p>Au fur et à mesure de l'avancement de notre projet, l'utilisation du disque et des ressources réseau a commencé à monter en flèche à mesure que le cache de compilation augmentait, alors que certains des caches de compilation étaient sous-utilisés. Nous avons donc procédé aux ajustements suivants :</p>
<p>Nettoyer<strong>régulièrement les fichiers de cache</strong> - Vérifier régulièrement le dépôt privé (à l'aide de scripts par exemple), et nettoyer les fichiers de cache qui n'ont pas été modifiés depuis un certain temps ou qui n'ont pas été beaucoup téléchargés.</p>
<p><strong>Mise en cache sélective</strong> des compilations - Ne mettre en cache que les compilations exigeant des ressources, et ne pas mettre en cache les compilations ne nécessitant pas beaucoup de ressources.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Exploiter les tests conteneurisés pour réduire les erreurs, améliorer la stabilité et la fiabilité</h3><p>Les codes doivent être compilés dans différents environnements, ce qui implique une variété de systèmes d'exploitation (par exemple CentOS et Ubuntu), de dépendances sous-jacentes (par exemple GCC, LLVM et CUDA) et d'architectures matérielles spécifiques. Le code qui se compile avec succès dans un environnement spécifique échoue dans un environnement différent. En exécutant les tests dans des conteneurs, le processus de test devient plus rapide et plus précis.</p>
<p>La conteneurisation garantit que l'environnement de test est cohérent et qu'une application fonctionne comme prévu. L'approche des tests conteneurisés consiste à emballer les tests sous forme de conteneurs d'images et à créer un environnement de test véritablement isolé. Nos testeurs ont trouvé cette approche très utile, ce qui a permis de réduire les temps de compilation de 60 %.</p>
<p><strong>Assurer un environnement de compilation cohérent</strong> - Comme les produits compilés sont sensibles aux changements dans l'environnement du système, des erreurs inconnues peuvent se produire dans différents systèmes d'exploitation. Nous devons étiqueter et archiver le cache des produits compilés en fonction des changements survenus dans l'environnement de compilation, mais il est difficile de les classer. Nous avons donc introduit la technologie de conteneurisation pour unifier l'environnement de compilation afin de résoudre ces problèmes.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusion</h3><p>En analysant les dépendances du projet, cet article présente différentes méthodes d'optimisation de la compilation entre et au sein des composants, en fournissant des idées et des bonnes pratiques pour construire une intégration de code continue stable et efficace. Ces méthodes ont permis de résoudre les problèmes de lenteur de l'intégration du code causés par des dépendances complexes, d'unifier les opérations à l'intérieur du conteneur pour assurer la cohérence de l'environnement, et d'améliorer l'efficacité de la compilation grâce à la lecture des résultats de la compilation et à l'utilisation d'outils de cache de compilation pour mettre en cache les résultats intermédiaires de la compilation.</p>
<p>Les pratiques susmentionnées ont permis de réduire le temps de compilation du projet de 60 % en moyenne, améliorant ainsi considérablement l'efficacité globale de l'intégration du code. À l'avenir, nous continuerons à paralléliser la compilation entre les composants et à l'intérieur de ceux-ci afin de réduire davantage les temps de compilation.</p>
<p><br/></p>
<p><em>Les sources suivantes ont été utilisées pour cet article :</em></p>
<ul>
<li>"Découplage des arbres de sources dans les composants de niveau bâtiment"</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Facteurs à prendre en compte lors de l'ajout de dépendances tierces à un projet</a></li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Survivre aux dépendances logicielles</a>"</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Comprendre les dépendances : Une étude des défis de coordination dans le développement de logiciels</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">A propos de l'auteur</h3><p>Zhifeng Zhang est ingénieur DevOps senior chez Zilliz.com et travaille sur Milvus, une base de données vectorielle open-source, et instructeur autorisé de l'université de logiciels open-source LF en Chine. Il a obtenu sa licence en Internet des objets (IOT) à l'Institut de génie logiciel de Guangzhou. Il passe sa carrière à participer et à diriger des projets dans le domaine du CI/CD, du DevOps, de la gestion de l'infrastructure informatique, de la boîte à outils Cloud-Native, de la conteneurisation et de l'optimisation du processus de compilation.</p>
