---
id: what-milvus-taught-us-in-2024.md
title: Ce que les utilisateurs de Milvus nous ont appris en 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: >-
  Consultez les questions les plus fréquemment posées sur Milvus dans notre
  Discord.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Vue d'ensemble<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Alors que Milvus s'épanouissait en 2024 avec des versions majeures et un écosystème open-source florissant, un trésor caché de points de vue d'utilisateurs se formait discrètement dans notre communauté sur <a href="https://discord.gg/xwqmFDURcz">Discord</a>. Cette compilation des discussions de la communauté offrait une occasion unique de comprendre directement les défis de nos utilisateurs. Intrigué par cette ressource inexploitée, je me suis lancé dans une analyse complète de chaque fil de discussion de l'année, à la recherche de modèles qui pourraient nous aider à compiler une foire aux questions pour les utilisateurs de Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Mon analyse a révélé trois domaines principaux dans lesquels les utilisateurs cherchaient constamment des conseils : L'<strong>optimisation des performances</strong>, les <strong>stratégies de déploiement</strong> et la <strong>gestion des données</strong>. Les utilisateurs ont souvent discuté de la manière d'affiner Milvus pour les environnements de production et de suivre efficacement les mesures de performances. En ce qui concerne le déploiement, la communauté s'est efforcée de sélectionner les déploiements appropriés, de choisir les index de recherche optimaux et de résoudre les problèmes dans les configurations distribuées. Les conversations sur la gestion des données ont porté sur les stratégies de migration des données d'un service à l'autre et sur la sélection des modèles d'intégration.</p>
<p>Examinons chacun de ces domaines plus en détail.</p>
<h2 id="Deployment" class="common-anchor-header">Déploiement<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus propose des modes de déploiement flexibles pour s'adapter à différents cas d'utilisation. Toutefois, certains utilisateurs éprouvent des difficultés à trouver le bon choix et veulent être sûrs qu'ils le font "correctement".</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Quel type de déploiement dois-je choisir ?</h3><p>Une question très fréquente est de savoir quel déploiement choisir parmi Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> et <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. La réponse dépend principalement de la taille de votre base de données vectorielle et de l'importance du trafic qu'elle supportera :</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Si vous faites du prototypage sur votre système local avec quelques millions de vecteurs, ou si vous cherchez une base de données vectorielle intégrée pour les tests unitaires et le CI/CD, vous pouvez utiliser Milvus Lite. Notez que certaines fonctionnalités plus avancées comme la recherche plein texte ne sont pas encore disponibles dans Milvus Lite mais le seront bientôt.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h4><p>Si votre système doit servir le trafic de production et/ou si vous devez stocker entre quelques millions et cent millions de vecteurs, vous devriez utiliser Milvus Standalone, qui compile tous les composants de Milvus dans une seule image Docker. Il existe une variante qui ne prend que ses dépendances de stockage persistant (minio) et de magasin de métadonnées (etcd) en tant qu'images séparées.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus distribué</h4><p>Pour les déploiements à grande échelle desservant le trafic de production, comme le service de milliards de vecteurs à des milliers de QPS, vous devez utiliser Milvus Distributed. Certains utilisateurs peuvent vouloir effectuer un traitement par lots hors ligne à grande échelle, par exemple pour la déduplication des données ou le couplage des enregistrements, et la future version de Milvus 3.0 fournira un moyen plus efficace de le faire par ce que nous appelons un lac vectoriel.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Service entièrement géré</h4><p>Pour les développeurs qui souhaitent se concentrer sur le développement d'applications sans se préoccuper de DevOps, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> est le service Milvus entièrement géré qui offre un niveau gratuit.</p>
<p>Voir <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Vue d'ensemble des déploiements Milvus"</a> pour plus d'informations.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">De quelle quantité de mémoire, de stockage et de calcul aurai-je besoin ?</h3><p>Cette question revient souvent, non seulement pour les utilisateurs existants de Milvus, mais aussi pour ceux qui se demandent si Milvus convient à leur application. La combinaison exacte de la quantité de mémoire, de stockage et de calcul dont un déploiement aura besoin dépend d'une interaction complexe de facteurs.</p>
<p>Les encastrements vectoriels diffèrent en dimensionnalité en raison du modèle utilisé. Certains index de recherche vectorielle sont entièrement stockés en mémoire, tandis que d'autres stockent les données sur disque. En outre, de nombreux index de recherche sont capables de stocker une copie compressée (quantifiée) des enchâssements et nécessitent de la mémoire supplémentaire pour les structures de données graphiques. Il ne s'agit là que de quelques facteurs qui affectent la mémoire et le stockage.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Outil de dimensionnement des ressources Milvus</h4><p>Heureusement, Zilliz (l'équipe qui s'occupe de Milvus) a conçu <a href="https://milvus.io/tools/sizing">un outil de dimensionnement des ressources</a> qui répond parfaitement à cette question. Saisissez la dimensionnalité de votre vecteur, le type d'index, les options de déploiement, etc. et l'outil estime les besoins en CPU, en mémoire et en stockage pour les différents types de nœuds Milvus et leurs dépendances. Votre kilométrage peut varier, c'est pourquoi un test de charge réel avec vos données et un échantillon de trafic est toujours une bonne idée.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Quel indice vectoriel ou quelle mesure de distance dois-je choisir ?</h3><p>De nombreux utilisateurs ne sont pas sûrs de l'index qu'ils doivent choisir et de la manière de définir les hyperparamètres. Tout d'abord, il est toujours possible de reporter le choix du type d'index sur Milvus en sélectionnant AUTOINDEX. Toutefois, si vous souhaitez sélectionner un type d'index spécifique, quelques règles empiriques peuvent vous servir de point de départ.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">Index en mémoire</h4><p>Souhaitez-vous payer le coût de l'intégration de votre index dans la mémoire ? Un index en mémoire est généralement le plus rapide, mais aussi le plus coûteux. Voir <a href="https://milvus.io/docs/index.md?tab=floating">"Index en mémoire"</a> pour une liste des index pris en charge par Milvus et les compromis qu'ils font en termes de latence, de mémoire et de rappel.</p>
<p>N'oubliez pas que la taille de votre index n'est pas simplement le nombre de vecteurs multiplié par leur dimensionnalité et leur taille en virgule flottante. La plupart des index quantifient les vecteurs pour réduire l'utilisation de la mémoire, mais nécessitent de la mémoire pour des structures de données supplémentaires. Les autres données non vectorielles (scalaires) et leur index occupent également de l'espace mémoire.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">Index sur disque</h4><p>Lorsque votre index ne tient pas dans la mémoire, vous pouvez utiliser l'un des <a href="https://milvus.io/docs/disk_index.md">"index sur disque"</a> fournis par Milvus. <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> et <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a> sont deux choix qui présentent des compromis très différents en termes de latence et de ressources.</p>
<p>DiskANN stocke une copie hautement compressée des vecteurs en mémoire, et les vecteurs non compressés ainsi que les structures de recherche de graphes sur le disque. Il utilise des idées astucieuses pour rechercher l'espace vectoriel tout en minimisant les lectures sur le disque et tire parti de la vitesse d'accès aléatoire des disques SSD. Pour une latence minimale, le SSD doit être connecté via NVMe plutôt que SATA afin d'obtenir les meilleures performances d'E/S.</p>
<p>Techniquement parlant, MMap n'est pas un type d'index, mais fait référence à l'utilisation de la mémoire virtuelle avec un index en mémoire. Avec la mémoire virtuelle, les pages peuvent être échangées entre le disque et la RAM selon les besoins, ce qui permet d'utiliser efficacement un index beaucoup plus grand si les schémas d'accès sont tels que seule une petite partie des données est utilisée à la fois.</p>
<p>DiskANN présente un temps de latence excellent et constant. MMap a une latence encore meilleure lorsqu'il accède à une page en mémoire, mais les échanges fréquents de pages provoquent des pics de latence. MMap peut donc présenter une plus grande variabilité de latence, en fonction des schémas d'accès à la mémoire.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">Index GPU</h4><p>Une troisième option consiste à construire <a href="https://milvus.io/docs/gpu_index.md">un index en utilisant la mémoire et le calcul GPU</a>. La prise en charge GPU de Milvus est assurée par l'équipe Nvidia <a href="https://rapids.ai/">RAPIDS</a>. La recherche vectorielle GPU peut avoir une latence plus faible qu'une recherche CPU correspondante, bien qu'il faille généralement des centaines ou des milliers de QPS de recherche pour exploiter pleinement le parallélisme du GPU. En outre, les GPU disposent généralement de moins de mémoire que la RAM du CPU et leur fonctionnement est plus coûteux.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Mesures de distance</h4><p>Il est plus facile de répondre à la question de savoir quelle mesure de distance choisir pour mesurer la similarité entre les vecteurs. Il est recommandé de choisir la même mesure de distance que celle avec laquelle votre modèle d'intégration a été entraîné, qui est généralement COSINE (ou IP lorsque les entrées sont normalisées). La source de votre modèle (par exemple, la page du modèle sur HuggingFace) fournira des éclaircissements sur la métrique de distance utilisée. Zilliz a également mis au point un <a href="https://zilliz.com/ai-models">tableau</a> pratique permettant de le vérifier.</p>
<p>Pour résumer, je pense qu'une grande partie de l'incertitude concernant le choix de l'index tourne autour de l'incertitude sur la façon dont ces choix affectent le compromis latence/utilisation des ressources/rappel de votre déploiement. Je recommande d'utiliser les règles empiriques ci-dessus pour décider entre les index en mémoire, sur disque ou GPU, puis d'utiliser les directives de compromis données dans la documentation Milvus pour choisir un index particulier.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Pouvez-vous réparer mon déploiement Milvus Distributed défectueux ?</h3><p>De nombreuses questions tournent autour des problèmes de mise en place et de fonctionnement d'un déploiement de Milvus Distributed, avec des questions relatives à la configuration, à l'outillage et aux journaux de débogage. Il est difficile de donner une solution unique car chaque question semble différente de la précédente, mais heureusement Milvus dispose d'un <a href="https://milvus.io/discord">Discord dynamique</a> où vous pouvez demander de l'aide, et nous proposons également des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">heures de bureau en tête-à-tête avec un expert</a>.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Comment déployer Milvus sur Windows ?</h3><p>Une question qui est revenue à plusieurs reprises est de savoir comment déployer Milvus sur des machines Windows. Sur la base de vos commentaires, nous avons réécrit la documentation à ce sujet : voir <a href="https://milvus.io/docs/install_standalone-windows.md">Exécuter Milvus dans Docker (Windows)</a> pour savoir comment procéder, en utilisant <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Performances et profilage<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Après avoir choisi un type de déploiement et l'avoir fait fonctionner, les utilisateurs veulent être sûrs d'avoir pris des décisions optimales et souhaitent établir un profil des performances et de l'état de leur déploiement. De nombreuses questions se posent sur la manière d'établir le profil des performances, d'observer l'état et d'obtenir un aperçu de ce qui se passe et pourquoi.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">Comment mesurer les performances ?</h3><p>Les utilisateurs souhaitent vérifier les paramètres liés aux performances de leur déploiement afin de comprendre les goulets d'étranglement et d'y remédier. Les mesures mentionnées comprennent la latence moyenne des requêtes, la distribution des latences, le volume des requêtes, l'utilisation de la mémoire, le stockage sur disque, etc. Alors que l'obtention de ces mesures avec l'<a href="https://milvus.io/docs/monitor_overview.md">ancien système de surveillance</a> s'est avérée difficile, Milvus 2.5 introduit un nouveau système appelé <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (commentaires bienvenus !), qui vous permet d'accéder à toutes ces informations à partir d'une interface Web conviviale.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Que se passe-t-il dans Milvus en ce moment (c'est-à-dire observer l'état) ?</h3><p>Dans le même ordre d'idées, les utilisateurs souhaitent observer l'état interne de leur déploiement. Il s'agit notamment de comprendre pourquoi un index de recherche est si long à construire, de déterminer si le cluster est sain et de comprendre comment une requête est exécutée entre les nœuds. Il est possible de répondre à bon nombre de ces questions grâce à la nouvelle <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">interface WebUI</a>, qui permet de savoir ce que fait le système en interne.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">Comment fonctionne un aspect (complexe) de la structure interne ?</h3><p>Les utilisateurs avancés souhaitent souvent avoir une certaine compréhension des éléments internes de Milvus, par exemple en ce qui concerne le scellement des segments ou la gestion de la mémoire. L'objectif sous-jacent est généralement d'améliorer les performances et parfois de déboguer des problèmes. La documentation, en particulier dans les sections &quot;Concepts&quot; et &quot;Guide d'administration&quot;, est utile à cet égard. Voir par exemple les pages <a href="https://milvus.io/docs/architecture_overview.md">&quot;Vue d'ensemble de l'architecture Milvus&quot;</a> et <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Compaction du clustering&quot;</a>. Nous continuerons à améliorer la documentation sur les éléments internes de Milvus, à la rendre plus facile à comprendre, et nous accueillerons avec plaisir tout retour d'information ou toute demande via <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Quel modèle d'intégration dois-je choisir ?</h3><p>Une question liée aux performances qui a été soulevée à plusieurs reprises lors de réunions, d'heures de bureau et sur Discord est de savoir comment choisir un modèle d'intégration. Il est difficile de donner une réponse définitive à cette question, mais nous recommandons de commencer par des modèles par défaut comme <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Comme pour le choix de l'index de recherche, il existe des compromis entre le calcul, le stockage et le rappel. Un modèle d'intégration avec une plus grande dimension de sortie nécessitera plus de stockage, toutes choses égales par ailleurs, mais entraînera probablement un meilleur rappel des éléments pertinents. Les modèles d'intégration plus grands, pour une dimension fixe, sont généralement plus performants que les plus petits en termes de rappel, mais au prix d'une augmentation des calculs et du temps. Les tableaux de bord qui classent les performances des modèles d'intégration, tels que <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>, sont basés sur des références qui peuvent ne pas correspondre à vos données et à votre tâche spécifiques.</p>
<p>Il n'est donc pas judicieux de penser à un "meilleur" modèle d'intégration. Commencez par un modèle qui a un rappel acceptable et qui respecte votre budget de calcul et de temps pour le calcul des embeddings. D'autres optimisations, comme le réglage fin sur vos données ou l'exploration empirique du compromis calcul/rappel, peuvent être reportées à une fois que vous aurez un système fonctionnel en production.</p>
<h2 id="Data-Management" class="common-anchor-header">Gestion des données<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La manière de déplacer les données dans et hors d'un déploiement Milvus est un autre thème principal des discussions sur Discord, ce qui n'est pas surprenant étant donné l'importance de cette tâche pour la mise en production d'une application.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">Comment migrer des données de X vers Milvus ? Comment migrer les données d'un système autonome vers un système distribué ? Comment migrer de 2.4.x à 2.5.x ?</h3><p>Un nouvel utilisateur souhaite généralement intégrer des données existantes dans Milvus à partir d'une autre plate-forme, y compris des moteurs de recherche traditionnels comme <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> et d'autres bases de données vectorielles comme <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> ou <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Les utilisateurs existants peuvent également vouloir migrer leurs données d'un déploiement Milvus à un autre, ou <a href="https://docs.zilliz.com/docs/migrate-from-milvus">de Milvus auto-hébergé à Zilliz Cloud entièrement géré</a>.</p>
<p>Le <a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a> et le service de <a href="https://docs.zilliz.com/docs/migrations">migration</a> géré sur Zilliz Cloud sont conçus à cet effet.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">Comment enregistrer et charger des sauvegardes de données ? Comment exporter des données depuis Milvus ?</h3><p>Milvus dispose d'un outil dédié, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, pour prendre des instantanés sur un stockage permanent et les restaurer.</p>
<h2 id="Next-Steps" class="common-anchor-header">Prochaines étapes<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>J'espère que cet article vous a donné quelques indications sur la manière de relever les défis courants rencontrés lors de la construction d'une base de données vectorielles. Cela nous a permis de jeter un nouveau coup d'œil à notre documentation et à notre feuille de route des fonctionnalités afin de continuer à travailler sur des éléments qui peuvent aider notre communauté à mieux réussir avec Milvus. J'aimerais insister sur le fait que vos choix vous placent à différents points d'un espace de compromis entre le calcul, le stockage, la latence et le rappel. <em>Vous ne pouvez pas maximiser tous ces critères de performance simultanément - il n'y a pas de déploiement "optimal". Cependant, en comprenant mieux le fonctionnement de la recherche vectorielle et des systèmes de bases de données distribuées, vous pouvez prendre une décision en connaissance de cause.</em></p>
<p>Après avoir parcouru le grand nombre de messages de 2024, je me suis demandé pourquoi un humain devrait faire cela. L'IA générative n'a-t-elle pas promis de résoudre une telle tâche consistant à traiter de grandes quantités de texte et à en extraire des informations ? Rejoignez-moi dans la deuxième partie de ce billet (à venir), où j'étudierai la conception et la mise en œuvre d'<em>un système multi-agents permettant d'extraire des informations des forums de discussion.</em></p>
<p>Merci encore et j'espère vous voir dans le <a href="https://milvus.io/discord">Discord de</a> la communauté et lors de nos prochains meetups sur les <a href="https://lu.ma/unstructured-data-meetup">données non structurées</a>. Pour une assistance plus pratique, nous vous invitons à réserver une <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">heure de bureau individuelle</a>. <em>Vos commentaires sont essentiels à l'amélioration de Milvus !</em></p>
