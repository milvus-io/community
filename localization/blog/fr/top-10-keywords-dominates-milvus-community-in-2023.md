---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: >-
  Dévoiler les 10 principaux mots-clés qui domineront la communauté Milvus en
  2023
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: >-
  Ce billet explore le cœur de la communauté en analysant l'historique des chats
  et en révélant les 10 principaux mots-clés des discussions.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>En cette fin d'année 2023, revenons sur le parcours remarquable de la communauté Milvus : <a href="https://github.com/milvus-io/milvus">25 000 GitHub Stars</a>, le lancement de <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a> et plus de 10 millions de téléchargements d'<a href="https://hub.docker.com/r/milvusdb/milvus">images Docker</a>. Ce billet explore le cœur de la communauté en analysant l'historique des chats et en révélant les 10 mots-clés les plus utilisés dans les discussions.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 Version - La montée en puissance de l'AIGC entraîne une itération rapide de Milvus<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>De manière surprenante, "Version" est apparu comme le mot-clé le plus discuté en 2023. Cette révélation est ancrée dans la vague d'IA de l'année, les bases de données vectorielles étant une infrastructure essentielle pour relever les défis liés aux problèmes d'hallucination des applications AIGC.</p>
<p>L'enthousiasme suscité par les bases de données vectorielles entraîne Milvus dans une phase d'itération rapide. La communauté a été témoin de la publication de vingt versions au cours de la seule année 2023, répondant aux demandes des développeurs de l'AIGC qui inondent la communauté de demandes de renseignements sur le choix de la version optimale de Milvus pour diverses applications. Pour les utilisateurs qui naviguent dans ces mises à jour, nous recommandons d'adopter la dernière version pour bénéficier de fonctionnalités et de performances améliorées.</p>
<p>Si vous êtes intéressé par la planification des versions de Milvus, consultez la page <a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">Feuille de route de Milvus</a> sur le site web officiel.</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 Search - au-delà de la recherche vectorielle<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La "recherche" occupe la deuxième place, reflétant son rôle fondamental dans les opérations de base de données. Milvus prend en charge diverses capacités de recherche, de la recherche Top-K ANN à la recherche scalaire filtrée et à la recherche par plage. La sortie imminente de Milvus 3.0 (Beta) promet la recherche par mot-clé (sparse embeddings), que de nombreux développeurs d'applications RAG attendent avec impatience.</p>
<p>Les discussions de la communauté sur la recherche se concentrent sur les performances, les capacités et les principes. Les utilisateurs posent souvent des questions sur le filtrage des attributs, la définition des valeurs seuils de l'index et les problèmes de latence. Les ressources telles que la <a href="https://milvus.io/docs/v2.0.x/search.md">documentation sur les requêtes et les recherches</a>, les <a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">propositions d'amélioration de Milvus (MEP)</a> et les discussions sur Discord sont devenues les références incontournables pour démêler les subtilités de la recherche dans Milvus.</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">#3 Mémoire - compromis entre performance et précision pour minimiser la charge de mémoire<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>La "mémoire" a également occupé le devant de la scène dans les discussions de la communauté au cours de l'année écoulée. En tant que type de données particulier, les vecteurs ont par nature des dimensions élevées. Le stockage des vecteurs en mémoire est une pratique courante pour des performances optimales, mais le volume croissant de données limite la mémoire disponible. Milvus optimise l'utilisation de la mémoire en adoptant des techniques telles que <a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a> et DiskANN.</p>
<p>Toutefois, il reste complexe de parvenir simultanément à une faible utilisation de la mémoire, à d'excellentes performances et à une grande précision dans un système de base de données, ce qui nécessite des compromis entre les performances et la précision afin de minimiser la surcharge de la mémoire.</p>
<p>Dans le cas du contenu généré par l'intelligence artificielle (AIGC), les développeurs privilégient généralement les réponses rapides et la précision des résultats par rapport aux exigences strictes en matière de performances. L'ajout de MMap et DiskANN par Milvus minimise l'utilisation de la mémoire tout en maximisant le traitement des données et la précision des résultats, établissant ainsi un équilibre qui correspond aux besoins pratiques des applications AIGC.</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert - une navigation fluide dans l'insertion des données<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'insertion efficace des données est une préoccupation cruciale pour les développeurs, ce qui suscite de fréquentes discussions sur l'optimisation de la vitesse d'insertion au sein de la communauté Milvus. Milvus excelle dans l'insertion efficace de données en continu et dans la construction d'index, grâce à sa séparation adroite des données en continu et des données par lots. Cette capacité en fait une solution très performante par rapport à d'autres fournisseurs de bases de données vectorielles, tels que Pinecone.</p>
<p>Voici quelques informations et recommandations utiles sur les insertions de données :</p>
<ul>
<li><p><strong>Insertion par lots :</strong> Optez pour l'insertion par lots plutôt que pour l'insertion d'une seule rangée afin d'améliorer l'efficacité. L'insertion à partir de fichiers est notamment plus rapide que l'insertion par lots. Lorsque vous traitez de grands ensembles de données dépassant dix millions d'enregistrements, envisagez d'utiliser l'interface <code translate="no">bulk_insert</code> pour un processus d'importation rationalisé et accéléré.</p></li>
<li><p><strong>Utilisation stratégique de <code translate="no">flush()</code>:</strong> Plutôt que d'invoquer l'interface <code translate="no">flush()</code> après chaque lot, faites un seul appel après avoir terminé l'insertion de toutes les données. Une utilisation excessive de l'interface <code translate="no">flush()</code> entre les lots peut conduire à la génération de fichiers de segments fragmentés, ce qui impose une charge de compactage considérable au système.</p></li>
<li><p><strong>Déduplication des clés primaires :</strong> Milvus n'effectue pas de déduplication des clés primaires lors de l'utilisation de l'interface <code translate="no">insert</code> pour l'insertion de données. Si vous devez dédupliquer les clés primaires, nous vous recommandons de déployer l'interface <code translate="no">upsert</code>. Toutefois, les performances d'insertion de <code translate="no">upsert</code>sont inférieures à celles de <code translate="no">insert</code>, en raison d'une opération de requête interne supplémentaire.</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 Configuration - décoder le labyrinthe des paramètres<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une base de données vectorielle distribuée qui intègre de nombreux composants tiers tels que le stockage d'objets, les files d'attente de messages et Etcd. Les utilisateurs ont été confrontés à l'ajustement des paramètres et à la compréhension de leur impact sur les performances de Milvus, ce qui a fait de la "configuration" un sujet fréquemment abordé.</p>
<p>Parmi toutes les questions sur les configurations, "quels paramètres ajuster" est sans doute l'aspect le plus difficile, car les paramètres varient selon les situations. Par exemple, l'optimisation des paramètres de performance de recherche diffère de l'optimisation des paramètres de performance d'insertion et repose largement sur l'expérience pratique.</p>
<p>Une fois que les utilisateurs ont identifié "les paramètres à ajuster", les questions suivantes "comment ajuster" deviennent plus faciles à gérer. Pour des procédures spécifiques, reportez-vous à notre documentation <a href="https://milvus.io/docs/configure-helm.md">Configurer Milvus</a>. La bonne nouvelle est que Milvus prend en charge les ajustements dynamiques des paramètres depuis la version 2.3.0, ce qui élimine la nécessité de redémarrer pour que les modifications prennent effet. Pour des procédures spécifiques, voir <a href="https://milvus.io/docs/dynamic_config.md">Configurer Milvus à la volée</a>.</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 Journaux - naviguer dans la boussole de dépannage<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>Les "journaux" servent de boussole au dépanneur. Les utilisateurs ont demandé des conseils à la communauté sur l'exportation des journaux Milvus, l'ajustement des niveaux de journaux et l'intégration avec des systèmes tels que Loki de Grafana. Voici quelques suggestions concernant les journaux Milvus.</p>
<ul>
<li><p><strong>Comment afficher et exporter les journaux Milvus :</strong> Vous pouvez facilement exporter les journaux Milvus avec le script en un clic <a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a> qui est disponible sur le dépôt GitHub.</p></li>
<li><p><strong>Niveau de journalisation :</strong> Milvus dispose de plusieurs niveaux de journalisation pour s'adapter à divers cas d'utilisation. Le niveau info est suffisant pour la plupart des cas, et le niveau debug est destiné au débogage. Un excès de journaux Milvus peut être le signe d'une mauvaise configuration des niveaux de journaux.</p></li>
<li><p><strong>Nous recommandons d'intégrer les journaux Milvus à un système de collecte de journaux</strong> tel que Loki pour rationaliser la récupération des journaux lors de dépannages ultérieurs.</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">Cluster #7 - mise à l'échelle pour les environnements de production<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>Compte tenu de l'identité de Milvus en tant que base de données vectorielle distribuée, le terme "cluster" est un sujet de discussion fréquent au sein de la communauté. Les conversations tournent autour de la mise à l'échelle des données dans un cluster, de la migration des données et de la sauvegarde et de la synchronisation des données.</p>
<p>Dans les environnements de production, l'évolutivité robuste et la haute disponibilité sont des exigences standard pour les systèmes de bases de données distribuées. L'architecture de séparation stockage-calcul de Milvus permet une évolutivité transparente des données en augmentant les ressources pour les nœuds de calcul et de stockage, ce qui permet des échelles de données illimitées. Milvus offre également une haute disponibilité grâce à une architecture multiréplique et à de solides capacités de sauvegarde et de synchronisation.  Pour plus d'informations, reportez-vous à <a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">Coordinator HA</a>.</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 Documentation - la porte d'entrée pour comprendre Milvus<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>La "documentation" est un autre mot-clé fréquemment mentionné dans les discussions de la communauté, souvent lié à des questions sur l'existence d'une page de documentation pour une fonctionnalité spécifique et sur l'endroit où la trouver.</p>
<p>Servant de porte d'entrée pour comprendre Milvus, environ 80 % des demandes de la communauté trouvent des réponses dans la <a href="https://milvus.io/docs">documentation officielle</a>. Nous vous recommandons de lire notre documentation avant d'utiliser Milvus ou de rencontrer des problèmes. En outre, vous pouvez explorer les exemples de code dans divers dépôts SDK pour avoir un aperçu de l'utilisation de Milvus.</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">Déploiement #9 - simplifier le parcours Milvus<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>La simplicité du déploiement reste l'objectif permanent de l'équipe Milvus. Pour remplir cet engagement, nous avons introduit <a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>, une alternative légère à Milvus qui est entièrement fonctionnelle mais n'a pas de dépendances K8s ou Docker.</p>
<p>Nous avons encore rationalisé le déploiement en introduisant la solution de messagerie <a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a> plus légère et en consolidant les composants des nœuds. En réponse aux commentaires des utilisateurs, nous nous préparons à publier une version autonome sans dépendances, avec des efforts continus pour améliorer les fonctionnalités et simplifier les opérations de déploiement. L'itération rapide de Milvus témoigne de l'engagement continu de la communauté en faveur de l'amélioration constante du processus de déploiement.</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 Suppression - démêler l'impact<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>Les discussions courantes sur la "suppression" tournent autour du nombre de données inchangées après la suppression, de la possibilité de récupérer les données supprimées et de l'échec de la récupération de l'espace disque après la suppression.</p>
<p>Milvus 2.3 introduit l'expression <code translate="no">count(*)</code> pour traiter les mises à jour retardées du nombre d'entités. La persistance des données supprimées dans les requêtes est probablement due à l'utilisation inappropriée des <a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">modèles de cohérence des données</a>. Les problèmes d'échec de la récupération de l'espace disque incitent à revoir la conception du mécanisme de collecte des déchets de Milvus, qui fixe une période d'attente avant la suppression complète des données. Cette approche permet de disposer d'une fenêtre temporelle pour une éventuelle récupération.</p>
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
    </button></h2><p>Les 10 principaux mots-clés donnent un aperçu des discussions animées au sein de la communauté Milvus. Alors que Milvus continue d'évoluer, la communauté reste une ressource inestimable pour les développeurs qui recherchent des solutions, partagent leurs expériences et contribuent à faire progresser les bases de données vectorielles à l'ère de l'IA.</p>
<p>Participez à ce voyage passionnant en rejoignant notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> en 2024. Vous pourrez y dialoguer avec nos brillants ingénieurs et vous connecter avec des passionnés de Milvus partageant les mêmes idées. Participez également au <a href="https://discord.com/invite/RjNbk8RR4f">déjeuner et à la formation de la communauté Milvus</a> tous les mardis de 12h00 à 12h30 (heure de Paris). Faites part de vos réflexions, de vos questions et de vos commentaires, car chaque contribution contribue à l'esprit de collaboration qui propulse Milvus vers l'avant. Votre participation active n'est pas seulement la bienvenue, elle est appréciée. Innovons ensemble !</p>
