---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Présentation de l'outil de dimensionnement Milvus : Calculer et optimiser vos
  ressources de déploiement Milvus
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Maximisez les performances de Milvus grâce à notre outil de dimensionnement
  convivial ! Apprenez à configurer votre déploiement pour une utilisation
  optimale des ressources et des économies.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
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
    </button></h2><p>La sélection de la configuration optimale pour votre déploiement Milvus est essentielle pour l'optimisation des performances, l'utilisation efficace des ressources et la gestion des coûts. Que vous construisiez un prototype ou planifiez un déploiement de production, le dimensionnement correct de votre instance Milvus peut faire la différence entre une base de données vectorielle fonctionnant sans problème et une base de données dont les performances sont insuffisantes ou qui engendre des coûts inutiles.</p>
<p>Pour simplifier ce processus, nous avons remanié notre <a href="https://milvus.io/tools/sizing">outil de dimensionnement Milvus</a>, une calculatrice conviviale qui génère des estimations de ressources recommandées en fonction de vos besoins spécifiques. Dans ce guide, nous vous guiderons dans l'utilisation de l'outil et vous donnerons un aperçu plus approfondi des facteurs qui influencent les performances du Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Comment utiliser l'outil de dimensionnement Milvus ?<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est très facile d'utiliser cet outil de dimensionnement. Il suffit de suivre les étapes suivantes.</p>
<ol>
<li><p>Visitez la page de l'<a href="https://milvus.io/tools/sizing/"> outil de dimensionnement Milvus</a>.</p></li>
<li><p>Saisissez vos paramètres clés :</p>
<ul>
<li><p>Nombre de vecteurs et dimensions par vecteur</p></li>
<li><p>Type d'index</p></li>
<li><p>Taille des données du champ scalaire</p></li>
<li><p>Taille du segment</p></li>
<li><p>Votre mode de déploiement préféré</p></li>
</ul></li>
<li><p>Examiner les recommandations de ressources générées</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>outil de dimensionnement milvus</span> </span></p>
<p>Voyons comment chacun de ces paramètres influe sur le déploiement de Milvus.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Sélection d'index : Équilibrer le stockage, le coût, la précision et la vitesse<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus propose différents algorithmes d'index, notamment <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, et bien d'autres encore, chacun présentant des compromis distincts en termes d'utilisation de la mémoire, d'espace disque requis, de vitesse d'interrogation et de précision de la recherche.</p>
<p>Voici ce qu'il faut savoir sur les options les plus courantes :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>index</span> </span></p>
<p>HNSW (Hierarchical Navigable Small World - petit monde hiérarchique navigable)</p>
<ul>
<li><p><strong>Architecture</strong>: Combine des listes de sauts avec des graphes de petits mondes navigables (NSW) dans une structure hiérarchique.</p></li>
<li><p><strong>Performances</strong>: Interrogation très rapide avec d'excellents taux de rappel</p></li>
<li><p><strong>Utilisation des ressources</strong>: Requiert le plus de mémoire par vecteur (coût le plus élevé)</p></li>
<li><p><strong>Idéal pour</strong>: Les applications où la vitesse et la précision sont essentielles et où les contraintes de mémoire sont moins importantes.</p></li>
<li><p><strong>Note technique</strong>: la recherche commence par la couche la plus haute avec le moins de nœuds et descend à travers des couches de plus en plus denses.</p></li>
</ul>
<p>FLAT</p>
<ul>
<li><p><strong>Architecture</strong>: Recherche exhaustive simple sans approximation</p></li>
<li><p><strong>Performances</strong>: 100 % de rappel mais des temps d'interrogation extrêmement lents (<code translate="no">O(n)</code> pour des données de taille <code translate="no">n</code>)</p></li>
<li><p><strong>Utilisation des ressources</strong>: La taille de l'index est égale à la taille des données vectorielles brutes.</p></li>
<li><p><strong>Idéal pour</strong>: Petits ensembles de données ou applications nécessitant un rappel parfait</p></li>
<li><p><strong>Note technique</strong>: Effectue des calculs de distance complets entre le vecteur de la requête et chaque vecteur de la base de données.</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Architecture</strong>: Divise l'espace vectoriel en grappes pour une recherche plus efficace.</p></li>
<li><p><strong>Performances</strong>: Rappel moyennement élevé avec une vitesse d'interrogation modérée (plus lent que HNSW mais plus rapide que FLAT)</p></li>
<li><p><strong>Utilisation des ressources</strong>: Requiert moins de mémoire que FLAT mais plus que HNSW</p></li>
<li><p><strong>Idéal pour</strong>: Applications équilibrées où un certain rappel peut être échangé contre de meilleures performances.</p></li>
<li><p><strong>Note technique</strong>: Pendant la recherche, seuls les clusters <code translate="no">nlist</code> sont examinés, ce qui réduit considérablement les calculs.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Architecture</strong>: Applique la quantification scalaire à IVF_FLAT, en compressant les données vectorielles.</p></li>
<li><p><strong>Performances</strong>: Rappel moyen avec une vitesse d'interrogation moyenne à élevée</p></li>
<li><p><strong>Utilisation des ressources</strong>: Réduction de la consommation de disque, de calcul et de mémoire de 70 à 75 % par rapport à IVF_FLAT</p></li>
<li><p><strong>Idéal pour</strong>: Environnements à ressources limitées où la précision peut être légèrement compromise</p></li>
<li><p><strong>Note technique</strong>: compresse les valeurs à virgule flottante de 32 bits en valeurs entières de 8 bits.</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Options d'index avancées : ScaNN, DiskANN, CAGRA, etc.</h3><p>Pour les développeurs ayant des exigences particulières, Milvus propose également les options suivantes :</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% plus rapide sur l'unité centrale que HNSW avec des taux de rappel similaires</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: un index hybride disque/mémoire idéal lorsque vous devez prendre en charge un grand nombre de vecteurs avec un taux de rappel élevé et que vous pouvez accepter une latence légèrement plus longue (~100 ms). Il équilibre l'utilisation de la mémoire et les performances en ne conservant qu'une partie de l'index en mémoire, le reste demeurant sur le disque.</p></li>
<li><p><strong>Index basés sur le GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: il s'agit de l'index le plus rapide, mais il nécessite une carte d'inférence dotée d'une mémoire GDDR plutôt que d'une mémoire HBM.</p></li>
<li><p>GPU_BRUTE_FORCE : Recherche exhaustive mise en œuvre sur le GPU</p></li>
<li><p>GPU_IVF_FLAT : Version accélérée par le GPU de IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ : version d'IVF accélérée par le GPU avec <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">quantification par produit</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: Requête à très haute vitesse, ressources mémoire limitées ; accepte un compromis mineur sur le taux de rappel.</p></li>
<li><p><strong>HNSW_PQ</strong>: interrogation à vitesse moyenne ; ressources mémoire très limitées ; accepte un compromis mineur sur le taux de rappel.</p></li>
<li><p><strong>HNSW_PRQ</strong>: Interrogation à vitesse moyenne ; ressources mémoire très limitées ; accepte un compromis mineur sur le taux de rappel.</p></li>
<li><p><strong>AUTOINDEX</strong>: utilise par défaut HNSW dans Milvus open-source (ou utilise des index propriétaires plus performants dans <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, le Milvus géré).</p></li>
</ul></li>
<li><p><strong>Index binaires, épars et autres index spécialisés</strong>: Pour des types de données et des cas d'utilisation spécifiques. Voir <a href="https://milvus.io/docs/index.md">cette page de documentation sur les index</a> pour plus de détails.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Taille des segments et configuration du déploiement<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Les segments sont les éléments fondamentaux de l'organisation interne des données de Milvus. Ils fonctionnent comme des morceaux de données qui permettent la recherche distribuée et l'équilibrage de la charge dans votre déploiement. Cet outil de dimensionnement de Milvus propose trois options de taille de segment (512 Mo, 1024 Mo, 2048 Mo), 1024 Mo étant la valeur par défaut.</p>
<p>La compréhension des segments est cruciale pour l'optimisation des performances. A titre d'indication générale :</p>
<ul>
<li><p>Segments de 512 Mo : Meilleur pour les nœuds d'interrogation disposant de 4 à 8 Go de mémoire</p></li>
<li><p>segments de 1 Go : Optimal pour les nœuds d'interrogation disposant de 8 à 16 Go de mémoire</p></li>
<li><p>Segments de 2 Go : Recommandé pour les nœuds de requête disposant de plus de 16 Go de mémoire</p></li>
</ul>
<p>Aperçu pour les développeurs : Des segments moins nombreux et plus grands offrent généralement des performances de recherche plus rapides. Pour les déploiements à grande échelle, les segments de 2 Go offrent souvent le meilleur équilibre entre l'efficacité de la mémoire et la vitesse de recherche.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Sélection du système de file d'attente des messages<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque vous choisissez entre Pulsar et Kafka comme système de messagerie :</p>
<ul>
<li><p><strong>Pulsar</strong>: Recommandé pour les nouveaux projets en raison des frais généraux moins élevés par sujet et d'une meilleure évolutivité.</p></li>
<li><p><strong>Kafka</strong>: Peut être préférable si vous disposez déjà d'une expertise ou d'une infrastructure Kafka dans votre organisation.</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Optimisations d'entreprise dans Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les déploiements de production avec des exigences de performance strictes, Zilliz Cloud (la version entreprise et entièrement gérée de Milvus sur le cloud) offre des optimisations supplémentaires en matière d'indexation et de quantification :</p>
<ul>
<li><p><strong>Prévention des pertes de mémoire (OOM) :</strong> Gestion sophistiquée de la mémoire pour éviter les pannes hors mémoire.</p></li>
<li><p><strong>Optimisation du compactage</strong>: Améliore les performances de recherche et l'utilisation des ressources</p></li>
<li><p><strong>Stockage hiérarchisé</strong>: Gestion efficace des données chaudes et froides avec des unités de calcul appropriées</p>
<ul>
<li><p>Unités de calcul standard (UC) pour les données fréquemment consultées</p></li>
<li><p>Unités de stockage hiérarchisées pour le stockage rentable des données rarement consultées</p></li>
</ul></li>
</ul>
<p>Pour plus de détails sur les options de dimensionnement de l'entreprise, consultez la<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> documentation sur les plans de service de Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Conseils de configuration avancée pour les développeurs<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>Plusieurs types d'index</strong>: L'outil de dimensionnement se concentre sur un seul index. Pour les applications complexes nécessitant des algorithmes d'indexation différents pour diverses collections, créez des collections distinctes avec des configurations personnalisées.</p></li>
<li><p><strong>Allocation de mémoire</strong>: Lors de la planification de votre déploiement, tenez compte des besoins en mémoire des données vectorielles et des index. HNSW nécessite généralement 2 à 3 fois plus de mémoire que les données vectorielles brutes.</p></li>
<li><p><strong>Test de performance</strong>: Avant de finaliser votre configuration, comparez vos modèles de requêtes spécifiques sur un ensemble de données représentatif.</p></li>
<li><p><strong>Considérations sur l'échelle</strong>: Tenez compte de la croissance future. Il est plus facile de commencer avec un peu plus de ressources que de reconfigurer plus tard.</p></li>
</ol>
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
    </button></h2><p>L'<a href="https://milvus.io/tools/sizing/"> outil de dimensionnement Milvus</a> constitue un excellent point de départ pour la planification des ressources, mais n'oubliez pas que chaque application a des exigences uniques. Pour obtenir des performances optimales, vous devrez affiner votre configuration en fonction des caractéristiques spécifiques de votre charge de travail, de vos modèles de requête et de vos besoins de mise à l'échelle.</p>
<p>Nous améliorons constamment nos outils et notre documentation en fonction des commentaires des utilisateurs. Si vous avez des questions ou si vous avez besoin d'aide pour dimensionner votre déploiement Milvus, contactez notre communauté sur<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> ou<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Choisir le bon index vectoriel pour votre projet</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Index en mémoire - Documentation Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Découvrez Milvus CAGRA : Améliorer la recherche vectorielle avec l'indexation GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Calculateur de prix Zilliz Cloud</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Comment démarrer avec Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud Resource Planning | Cloud | Zilliz Cloud Developer Hub</a></p></li>
</ul>
