---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus à son meilleur : Exploration de la v2.2 à la v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Quelles sont les nouveautés de Milvus 2.2 à 2.2.6 ?
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus à son meilleur</span> </span></p>
<p>Bienvenue à tous les adeptes de Milvus ! Nous savons que cela fait un moment que nous n'avons pas partagé nos mises à jour sur cette base de données vectorielles open-source de pointe. Mais n'ayez crainte, nous sommes là pour vous informer de tous les développements passionnants qui ont eu lieu depuis le mois d'août dernier.</p>
<p>Dans ce billet de blog, nous allons vous présenter les dernières versions de Milvus, de la version 2.2 à la version 2.2.6. Nous avons beaucoup de choses à couvrir, notamment de nouvelles fonctionnalités, des améliorations, des corrections de bogues et des optimisations. Alors, attachez vos ceintures et plongeons dans l'aventure !</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2 : une version majeure avec une stabilité améliorée, une vitesse de recherche plus rapide et une évolutivité flexible<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 est une version importante qui introduit sept nouvelles fonctionnalités et de nombreuses améliorations par rapport aux versions précédentes. Examinons de plus près quelques-unes de ses principales caractéristiques :</p>
<ul>
<li><strong>Insertions en masse d'entités à partir de fichiers</strong>: Grâce à cette fonctionnalité, vous pouvez télécharger un lot d'entités dans un ou plusieurs fichiers directement vers Milvus avec seulement quelques lignes de code, ce qui vous permet de gagner du temps et d'économiser des efforts.</li>
<li><strong>Pagination des résultats des requêtes</strong>: Pour éviter que les résultats d'une recherche ou d'une requête ne soient renvoyés en masse dans un seul appel de procédure à distance (RPC), Milvus v2.2 vous permet de configurer la pagination et de filtrer les résultats à l'aide de mots clés dans les recherches et les requêtes.</li>
<li><strong>Contrôle d'accès basé sur les rôles (RBAC)</strong>: Milvus v2.2 prend désormais en charge le RBAC, ce qui vous permet de contrôler l'accès à votre instance Milvus en gérant les utilisateurs, les rôles et les autorisations.</li>
<li><strong>Quotas et limites</strong>: Les quotas et les limites sont un nouveau mécanisme de Milvus v2.2 qui protège le système de base de données contre les erreurs de mémoire insuffisante (OOM) et les pannes en cas d'augmentation soudaine du trafic. Cette fonctionnalité permet de contrôler l'ingestion, la recherche et l'utilisation de la mémoire.</li>
<li><strong>Durée de vie (TTL) au niveau de la collection</strong>: Dans les versions précédentes, Milvus vous permettait uniquement de configurer le TTL pour vos clusters. Toutefois, Milvus v2.2 prend désormais en charge la configuration du TTL au niveau de la collection. En configurant le TTL pour une collection spécifique, les entités de cette collection expireront automatiquement à la fin du TTL. Cette configuration permet un contrôle plus fin de la conservation des données.</li>
<li><strong>Indices ANNS (Approximate Nearest Neighbor Search) basés sur disque (Beta)</strong>: Milvus v2.2 introduit la prise en charge de DiskANN, un algorithme ANNS basé sur les graphes de Vamana et résidant dans le SSD. Cette prise en charge permet d'effectuer des recherches directes sur des ensembles de données à grande échelle, ce qui peut réduire considérablement l'utilisation de la mémoire, jusqu'à 10 fois.</li>
<li><strong>Sauvegarde des données (Beta)</strong>: Milvus v2.2 fournit <a href="https://github.com/zilliztech/milvus-backup">un tout nouvel outil</a> pour sauvegarder et restaurer correctement vos données Milvus, soit via une ligne de commande, soit via un serveur API.</li>
</ul>
<p>Outre les nouvelles fonctionnalités mentionnées ci-dessus, Milvus v2.2 comprend des corrections pour cinq bogues et de nombreuses améliorations visant à renforcer la stabilité, l'observabilité et les performances de Milvus. Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#v220">notes de mise à jour de Milvus v2.2.</a></p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2 : versions mineures avec problèmes corrigés<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 et v2.2.2 sont des versions mineures qui se concentrent sur la correction de problèmes critiques dans les anciennes versions et l'introduction de nouvelles fonctionnalités. En voici les grandes lignes :</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Prise en charge du locataire et de l'authentification Pulsa</li>
<li>Prise en charge de la sécurité de la couche transport (TLS) dans la source de configuration etcd</li>
<li>Amélioration des performances de recherche de plus de 30</li>
<li>Optimisation du planificateur et augmentation de la probabilité des tâches de fusion</li>
<li>Corrige de nombreux bogues, notamment les échecs de filtrage des termes sur les champs scalaires indexés et la panique de l'IndexNode en cas d'échec de la création d'un index.</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Corrige le problème selon lequel le proxy ne met pas à jour le cache des leaders de shard.</li>
<li>Corrige le problème selon lequel les informations chargées ne sont pas nettoyées pour les collections/partitions libérées.</li>
<li>Corrige le fait que le compte de charge n'est pas effacé à temps.</li>
</ul>
<p>Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#v221">notes de mise à jour de Milvus v2.2.1</a> et les <a href="https://milvus.io/docs/release_notes.md#v222">notes de mise à jour de Milvus v2.2.2.</a></p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3 : plus sûr, plus stable et plus disponible<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 est une version qui se concentre sur l'amélioration de la sécurité, de la stabilité et de la disponibilité du système. En outre, elle introduit deux fonctionnalités importantes :</p>
<ul>
<li><p><strong>Mise à niveau continue</strong>: cette fonctionnalité permet à Milvus de répondre aux demandes entrantes pendant le processus de mise à niveau, ce qui était impossible dans les versions précédentes. Les mises à niveau continues garantissent que le système reste disponible et qu'il répond aux demandes des utilisateurs même pendant les mises à niveau.</p></li>
<li><p><strong>Haute disponibilité des coordinateurs (HA)</strong>: Cette fonction permet aux coordinateurs Milvus de travailler en mode actif-standby, ce qui réduit le risque de défaillance d'un seul point. Même en cas de catastrophe inattendue, le temps de récupération est réduit à 30 secondes au maximum.</p></li>
</ul>
<p>Outre ces nouvelles fonctionnalités, Milvus v2.2.3 comprend de nombreuses améliorations et corrections de bogues, notamment l'amélioration des performances d'insertion en masse, la réduction de l'utilisation de la mémoire, l'optimisation des métriques de surveillance et l'amélioration des performances du méta-stockage. Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#v223">notes de mise à jour de Milvus v2.2.3</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4 : plus rapide, plus fiable et plus économe en ressources<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 est une mise à jour mineure de Milvus v2.2. Elle introduit quatre nouvelles fonctionnalités et plusieurs améliorations, ce qui se traduit par des performances plus rapides, une fiabilité accrue et une consommation de ressources réduite. Les points forts de cette version sont les suivants</p>
<ul>
<li><strong>Regroupement des ressources</strong>: Milvus prend désormais en charge le regroupement des QueryNodes dans d'autres groupes de ressources, ce qui permet d'isoler complètement l'accès aux ressources physiques dans différents groupes.</li>
<li><strong>Renommage des collections</strong>: L'API de renommage des collections permet aux utilisateurs de modifier le nom d'une collection, ce qui offre une plus grande souplesse dans la gestion des collections et améliore la convivialité.</li>
<li><strong>Prise en charge de Google Cloud Storage</strong></li>
<li><strong>Nouvelle option dans les API de recherche et d'interrogation</strong>: Cette nouvelle fonctionnalité permet aux utilisateurs d'ignorer la recherche sur tous les segments croissants, offrant ainsi de meilleures performances de recherche dans les scénarios où la recherche est effectuée en même temps que l'insertion de données.</li>
</ul>
<p>Pour plus d'informations, voir les <a href="https://milvus.io/docs/release_notes.md#v224">notes de mise à jour de Milvus v2.2.4</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5 : NON RECOMMANDÉ<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 présente plusieurs problèmes critiques et, par conséquent, nous ne recommandons pas l'utilisation de cette version.  Nous nous excusons sincèrement pour tout désagrément causé par ces problèmes. Toutefois, ces problèmes ont été résolus dans Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6 : résout les problèmes critiques de la v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 a résolu avec succès les problèmes critiques découverts dans la v2.2.5, y compris les problèmes de recyclage des données binlog sales et l'échec du GC DataCoord. Si vous utilisez actuellement la version 2.2.5, veuillez la mettre à jour pour garantir des performances et une stabilité optimales.</p>
<p>Les problèmes critiques corrigés sont les suivants</p>
<ul>
<li>Échec du GC de DataCoord</li>
<li>Remplacement des paramètres d'index passés</li>
<li>Retard du système causé par l'accumulation de messages RootCoord</li>
<li>Imprécision de la métrique RootCoordInsertChannelTimeTick</li>
<li>Arrêt possible de l'horodatage</li>
<li>Autodestruction occasionnelle du rôle du coordinateur au cours du processus de redémarrage</li>
<li>Retard des points de contrôle en raison d'une sortie anormale du ramassage des ordures.</li>
</ul>
<p>Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#v226">notes de mise à jour de Milvus v2.2.6.</a></p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>En conclusion, les dernières versions de Milvus, de v2.2 à v2.2.6, ont apporté de nombreuses mises à jour et améliorations intéressantes. Des nouvelles fonctionnalités aux corrections de bogues et aux optimisations, Milvus continue de respecter ses engagements à fournir des solutions de pointe et à renforcer les applications dans divers domaines. Restez à l'écoute pour d'autres mises à jour et innovations passionnantes de la part de la communauté Milvus.</p>
