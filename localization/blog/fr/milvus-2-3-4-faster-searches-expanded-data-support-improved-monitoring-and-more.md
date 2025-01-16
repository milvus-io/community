---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4 : Recherches plus rapides, prise en charge élargie des données,
  amélioration du suivi, etc.
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Présentation des nouvelles fonctionnalités et améliorations de Milvus 2.3.4
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous sommes ravis de dévoiler la dernière version de Milvus 2.3.4. Cette mise à jour introduit une série de fonctionnalités et d'améliorations méticuleusement conçues pour optimiser les performances, stimuler l'efficacité et offrir une expérience utilisateur transparente. Dans ce billet de blog, nous allons nous pencher sur les points forts de Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Journaux d'accès pour une meilleure surveillance<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend désormais en charge les journaux d'accès, ce qui permet d'obtenir des informations précieuses sur les interactions avec les interfaces externes. Ces journaux enregistrent les noms des méthodes, les demandes des utilisateurs, les temps de réponse, les codes d'erreur et d'autres informations sur les interactions, ce qui permet aux développeurs et aux administrateurs système d'effectuer une analyse des performances, un audit de sécurité et un dépannage efficace.</p>
<p><strong><em>Remarque :</em></strong> <em>actuellement, les journaux d'accès ne prennent en charge que les interactions gRPC. Toutefois, nous nous engageons à poursuivre nos efforts d'amélioration et les prochaines versions étendront cette capacité aux journaux de requêtes RESTful.</em></p>
<p>Pour plus d'informations, reportez-vous à la section <a href="https://milvus.io/docs/configure_access_logs.md">Configurer les journaux d'accès</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Importations de fichiers Parquet pour une meilleure efficacité du traitement des données<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 prend désormais en charge l'importation de fichiers Parquet, un format de stockage en colonnes largement adopté et conçu pour améliorer l'efficacité du stockage et du traitement des ensembles de données à grande échelle. Cet ajout offre aux utilisateurs une flexibilité et une efficacité accrues dans leurs efforts de traitement des données. En éliminant le besoin de conversions laborieuses de formats de données, les utilisateurs qui gèrent des ensembles de données importants au format Parquet bénéficieront d'un processus d'importation de données rationalisé, réduisant de manière significative le temps écoulé entre la préparation initiale des données et la récupération ultérieure des vecteurs.</p>
<p>En outre, notre outil de conversion de format de données, BulkWriter, a désormais adopté Parquet comme format de données de sortie par défaut, ce qui garantit une expérience plus intuitive pour les développeurs.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Index Binlog sur des segments croissants pour des recherches plus rapides<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus exploite désormais un index binlog sur les segments croissants, ce qui permet de multiplier par dix les recherches dans les segments croissants. Cette amélioration renforce considérablement l'efficacité des recherches et prend en charge les index avancés tels que IVF ou Fast Scan, améliorant ainsi l'expérience globale de l'utilisateur.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Prise en charge d'un maximum de 10 000 collections/partitions<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme les tables et les partitions dans les bases de données relationnelles, les collections et les partitions sont les unités de base pour le stockage et la gestion des données vectorielles dans Milvus. Pour répondre à l'évolution des besoins des utilisateurs en matière d'organisation nuancée des données, Milvus 2.3.4 prend désormais en charge jusqu'à 10 000 collections/partitions dans un cluster, ce qui représente une avancée significative par rapport à la limite précédente de 4 096. Cette amélioration profite à divers cas d'utilisation, tels que la gestion des bases de connaissances et les environnements multi-locataires. La prise en charge élargie des collections/partitions découle de l'amélioration du mécanisme de time tick, de la gestion des goroutines et de l'utilisation de la mémoire.</p>
<p><strong><em>Remarque :</em></strong> <em>la limite recommandée pour le nombre de collections/partitions est de 10 000, car le dépassement de cette limite peut avoir un impact sur la récupération des pannes et l'utilisation des ressources.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">Autres améliorations<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre les fonctionnalités ci-dessus, Milvus 2.3.4 comprend diverses améliorations et corrections de bogues. Il s'agit notamment de la réduction de l'utilisation de la mémoire lors de la récupération des données et de la gestion des données de longueur variable, de l'amélioration des messages d'erreur, de l'accélération de la vitesse de chargement et de l'amélioration de l'équilibre des groupes de requêtes. L'ensemble de ces améliorations contribue à une expérience utilisateur globale plus fluide et plus efficace.</p>
<p>Pour un aperçu complet de toutes les modifications introduites dans Milvus 2.3.4, reportez-vous à nos <a href="https://milvus.io/docs/release_notes.md#v234">notes de mise à jour</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">Restez connecté !<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> pour dialoguer directement avec nos ingénieurs et la communauté ou participez à notre <a href="https://discord.com/invite/RjNbk8RR4f">déjeuner et apprentissage de la communauté Milvus</a> tous les mardis de 12 à 12 h 30 (heure de Paris). Nous vous invitons également à nous suivre sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> pour connaître les dernières nouvelles et mises à jour concernant Milvus.</p>
