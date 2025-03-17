---
id: what-milvus-version-to-start-with.md
title: Quelle version de Milvus pour commencer
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Un guide complet des caractéristiques et des capacités de chaque version de
  Milvus pour prendre une décision éclairée pour vos projets de recherche
  vectorielle.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Introduction aux versions de Milvus</custom-h1><p>Le choix de la version appropriée de Milvus est essentiel à la réussite de tout projet utilisant la technologie de recherche vectorielle. Les différentes versions de Milvus étant adaptées à diverses exigences, il est essentiel de comprendre l'importance du choix de la bonne version pour obtenir les résultats souhaités.</p>
<p>La bonne version de Milvus peut aider un développeur à apprendre et à prototyper rapidement ou à optimiser l'utilisation des ressources, à rationaliser les efforts de développement et à garantir la compatibilité avec l'infrastructure et les outils existants. En fin de compte, il s'agit de maintenir la productivité des développeurs et d'améliorer l'efficacité, la fiabilité et la satisfaction des utilisateurs.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Versions disponibles de Milvus<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Trois versions de Milvus sont disponibles pour les développeurs, et toutes sont open source. Les trois versions sont Milvus Lite, Milvus Standalone et Milvus Cluster, qui diffèrent par leurs fonctionnalités et la manière dont les utilisateurs prévoient d'utiliser Milvus à court et à long terme. Nous allons donc les étudier individuellement.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme son nom l'indique, Milvus Lite est une version légère qui s'intègre de manière transparente à Google Colab et Jupyter Notebook. Elle se présente sous la forme d'un binaire unique sans dépendances supplémentaires, ce qui la rend facile à installer et à exécuter sur votre machine ou à intégrer dans des applications Python. En outre, Milvus Lite inclut un serveur Milvus autonome basé sur l'interface de programmation, ce qui permet de l'exécuter directement sur votre machine. Que vous l'intégriez dans votre code Python ou que vous l'utilisiez en tant que serveur autonome dépend entièrement de vos préférences et des exigences spécifiques de votre application.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caractéristiques et capacités</h3><p>Milvus Lite comprend toutes les fonctionnalités principales de recherche vectorielle de Milvus.</p>
<ul>
<li><p><strong>Capacités de recherche</strong>: Prend en charge les recherches top-k, par plage et hybrides, y compris le filtrage des métadonnées, pour répondre à diverses exigences en matière de recherche.</p></li>
<li><p><strong>Types d'index et mesures de similarité</strong>: Prise en charge de 11 types d'index et de cinq mesures de similarité, ce qui offre des options de flexibilité et de personnalisation pour votre cas d'utilisation spécifique.</p></li>
<li><p><strong>Traitement des données</strong>: Permet le traitement par lots (Apache Parquet, Arrays, JSON) et par flux, avec une intégration transparente grâce à des connecteurs pour Airbyte, Apache Kafka et Apache Spark.</p></li>
<li><p><strong>Opérations CRUD</strong>: Offre un support CRUD complet (création, lecture, mise à jour/versement, suppression), offrant aux utilisateurs des capacités complètes de gestion des données.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Applications et limitations</h3><p>Milvus Lite est idéal pour le prototypage rapide et le développement local, offrant une prise en charge de la configuration rapide et de l'expérimentation avec des ensembles de données à petite échelle sur votre machine. Cependant, ses limites deviennent apparentes lors de la transition vers des environnements de production avec des ensembles de données plus importants et des exigences d'infrastructure plus strictes. Ainsi, bien que Milvus Lite soit un excellent outil pour l'exploration et les tests initiaux, il n'est peut-être pas adapté au déploiement d'applications dans des environnements à fort volume ou prêts pour la production.</p>
<h3 id="Available-Resources" class="common-anchor-header">Ressources disponibles</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Documentation (en anglais)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Dépôt Github</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Exemple Google Colab</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Vidéo de prise en main</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus autonome<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offre deux modes opérationnels : Autonome et Cluster. Les deux modes sont identiques en ce qui concerne les caractéristiques de base de la base de données vectorielle et diffèrent en ce qui concerne la prise en charge de la taille des données et les exigences en matière d'évolutivité. Cette distinction vous permet de sélectionner le mode qui correspond le mieux à la taille de vos ensembles de données, au volume de trafic et à d'autres exigences d'infrastructure pour la production.</p>
<p>Milvus Standalone est un mode de fonctionnement du système de base de données vectorielles Milvus dans lequel il fonctionne indépendamment en tant qu'instance unique sans clustering ni configuration distribuée. Milvus s'exécute sur un seul serveur ou une seule machine dans ce mode, fournissant des fonctionnalités telles que l'indexation et la recherche de vecteurs. Il convient aux situations où l'échelle des données et du volume de trafic est relativement petite et ne nécessite pas les capacités distribuées fournies par une configuration en grappe.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caractéristiques et capacités</h3><ul>
<li><p><strong>Haute performance</strong>: Effectuez des recherches vectorielles sur des ensembles de données volumineux (des milliards ou plus) avec une rapidité et une efficacité exceptionnelles.</p></li>
<li><p><strong>Capacités de recherche</strong>: Prise en charge des recherches top-k, par plage et hybrides, y compris le filtrage des métadonnées, pour répondre à diverses exigences de recherche.</p></li>
<li><p><strong>Types d'index et mesures de similarité</strong>: Prise en charge de 11 types d'index et de 5 mesures de similarité, offrant une grande souplesse et des options de personnalisation pour votre cas d'utilisation spécifique.</p></li>
<li><p><strong>Traitement des données</strong>: Permet le traitement par lots (Apache Parquet, Arrays, Json) et par flux, avec une intégration transparente grâce à des connecteurs pour Airbyte, Apache Kafka et Apache Spark.</p></li>
<li><p><strong>Évolutivité</strong>: Réalisez une évolutivité dynamique avec une mise à l'échelle au niveau des composants, ce qui permet une mise à l'échelle transparente vers le haut ou vers le bas en fonction de la demande. Milvus peut procéder à une mise à l'échelle automatique au niveau des composants, optimisant ainsi l'allocation des ressources pour une meilleure efficacité.</p></li>
<li><p><strong>Multi-tenance</strong>: Prend en charge la multi-location avec la capacité de gérer jusqu'à 10 000 collections/partitions dans un cluster, ce qui permet une utilisation efficace des ressources et une isolation pour différents utilisateurs ou applications.</p></li>
<li><p><strong>Opérations CRUD</strong>: Prise en charge complète des opérations CRUD (création, lecture, mise à jour/suppression, suppression), offrant aux utilisateurs des capacités complètes de gestion des données.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Composants essentiels :</h3><ul>
<li><p>Milvus : le composant fonctionnel de base.</p></li>
<li><p>etcd : Le moteur de métadonnées responsable de l'accès aux métadonnées et de leur stockage à partir des composants internes de Milvus, y compris les proxies, les nœuds d'index, etc.</p></li>
<li><p>MinIO : le moteur de stockage responsable de la persistance des données au sein de Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 1 : Architecture autonome de Milvus</p>
<h3 id="Available-Resources" class="common-anchor-header">Ressources disponibles</h3><ul>
<li><p>Documentation</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Liste de contrôle de l'environnement pour Milvus avec Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Installer Milvus Standalone avec Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Dépôt Github</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster est un mode de fonctionnement du système de base de données vectorielle Milvus dans lequel il fonctionne et est distribué sur plusieurs nœuds ou serveurs. Dans ce mode, les instances Milvus sont regroupées pour former un système unifié qui peut gérer des volumes de données plus importants et des charges de trafic plus élevées par rapport à une configuration autonome. Milvus Cluster offre des fonctions d'évolutivité, de tolérance aux pannes et d'équilibrage de charge, ce qui le rend adapté aux scénarios qui doivent traiter des données volumineuses et servir efficacement de nombreuses requêtes simultanées.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Fonctionnalités et capacités</h3><ul>
<li><p>Hérite de toutes les fonctionnalités disponibles dans Milvus Standalone, y compris la recherche vectorielle haute performance, la prise en charge de plusieurs types d'index et de métriques de similarité, et l'intégration transparente avec les frameworks de traitement par lots et par flux.</p></li>
<li><p>Offre une disponibilité, des performances et une optimisation des coûts inégalées en tirant parti de l'informatique distribuée et de l'équilibrage des charges sur plusieurs nœuds.</p></li>
<li><p>Permet de déployer et de mettre à l'échelle des charges de travail sécurisées de niveau professionnel avec des coûts totaux réduits en utilisant efficacement les ressources dans le cluster et en optimisant l'allocation des ressources en fonction des exigences de la charge de travail.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Composants essentiels :</h3><p>Milvus Cluster comprend huit composants microservices et trois dépendances tierces. Tous les microservices peuvent être déployés sur Kubernetes indépendamment les uns des autres.</p>
<h4 id="Microservice-components" class="common-anchor-header">Composants de microservices</h4><ul>
<li><p>Coordonnée racine</p></li>
<li><p>Proxy</p></li>
<li><p>Coordonnateur de requête</p></li>
<li><p>Nœud de requête</p></li>
<li><p>Coordonnée de l'index</p></li>
<li><p>Nœud d'index</p></li>
<li><p>Coordonnée de données</p></li>
<li><p>Nœud de données</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Dépendances tierces</h4><ul>
<li><p>etcd : Stocke les métadonnées des différents composants du cluster.</p></li>
<li><p>MinIO : Responsable de la persistance des données des fichiers volumineux dans le cluster, tels que les fichiers d'index et les fichiers journaux binaires.</p></li>
<li><p>Pulsar : Gère les journaux des opérations de mutation récentes, produit des journaux en continu et fournit des services de publication et d'abonnement aux journaux.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 2 : Architecture du cluster Milvus</p>
<h4 id="Available-Resources" class="common-anchor-header">Ressources disponibles</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Documentation sur</a> la façon de démarrer</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Installer le cluster Milvus avec Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Installer le cluster Milvus avec Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Comment faire évoluer un cluster Milvus</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Dépôt Github</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Décider de la version de Milvus à utiliser<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque vous décidez de la version de Milvus à utiliser pour votre projet, vous devez prendre en compte des facteurs tels que la taille de votre ensemble de données, le volume de trafic, les exigences d'évolutivité et les contraintes de l'environnement de production. Milvus Lite est parfait pour le prototypage sur votre ordinateur portable. Milvus Standalone offre de hautes performances et une grande flexibilité pour effectuer des recherches vectorielles sur vos ensembles de données, ce qui le rend adapté aux déploiements à plus petite échelle, à la CI/CD et aux déploiements hors ligne lorsque vous n'avez pas de prise en charge Kubernetes... Et enfin, Milvus Cluster offre une disponibilité, une évolutivité et une optimisation des coûts inégalées pour les charges de travail de niveau entreprise, ce qui en fait le choix privilégié pour les environnements de production à grande échelle et hautement disponibles.</p>
<p>Il existe une autre version qui est une version sans tracas, il s'agit d'une version gérée de Milvus appelée <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>En fin de compte, la version de Milvus dépendra de votre cas d'utilisation spécifique, de vos exigences en matière d'infrastructure et de vos objectifs à long terme. En évaluant soigneusement ces facteurs et en comprenant les caractéristiques et les capacités de chaque version, vous pouvez prendre une décision éclairée qui s'aligne sur les besoins et les objectifs de votre projet. Que vous choisissiez Milvus Standalone ou Milvus Cluster, vous pouvez exploiter la puissance des bases de données vectorielles pour améliorer les performances et l'efficacité de vos applications d'IA.</p>
