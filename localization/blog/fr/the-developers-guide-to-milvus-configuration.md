---
id: the-developers-guide-to-milvus-configuration.md
title: Guide du développeur pour la configuration de Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Simplifiez la configuration de Milvus grâce à notre guide ciblé. Découvrez les
  paramètres clés à ajuster pour améliorer les performances de vos applications
  de bases de données vectorielles.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
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
    </button></h2><p>En tant que développeur travaillant avec Milvus, vous avez probablement rencontré le fichier de configuration <code translate="no">milvus.yaml</code> avec ses plus de 500 paramètres. La gestion de cette complexité peut s'avérer difficile lorsque tout ce que vous souhaitez est d'optimiser les performances de votre base de données vectorielle.</p>
<p>Bonne nouvelle : il n'est pas nécessaire de comprendre tous les paramètres. Ce guide fait la part des choses et se concentre sur les paramètres critiques qui ont un impact réel sur les performances, en indiquant exactement les valeurs à modifier en fonction de votre cas d'utilisation spécifique.</p>
<p>Que vous construisiez un système de recommandation nécessitant des requêtes rapides comme l'éclair ou que vous optimisiez une application de recherche vectorielle avec des contraintes de coût, je vous montrerai exactement quels paramètres modifier avec des valeurs pratiques et testées. À la fin de ce guide, vous saurez comment régler les configurations Milvus pour obtenir des performances optimales sur la base de scénarios de déploiement réels.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Catégories de configuration<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans les paramètres spécifiques, décomposons la structure du fichier de configuration. Lorsque vous travaillez avec <code translate="no">milvus.yaml</code>, vous avez affaire à trois catégories de paramètres :</p>
<ul>
<li><p><strong>Configurations des composants de dépendance</strong>: Services externes auxquels Milvus se connecte (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - critiques pour l'installation du cluster et la persistance des données.</p></li>
<li><p><strong>Configurations des composants internes</strong>: Architecture interne de Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, etc.) - essentiel pour le réglage des performances</p></li>
<li><p><strong>Configurations fonctionnelles</strong>: Sécurité, journalisation et limites de ressources - important pour les déploiements en production</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Configurations des composants de dépendance de Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Commençons par les services externes dont Milvus dépend. Ces configurations sont particulièrement importantes lors du passage du développement à la production.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Magasin de métadonnées</h3><p>Milvus s'appuie sur <code translate="no">etcd</code> pour la persistance des métadonnées et la coordination des services. Les paramètres suivants sont essentiels :</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Spécifie l'adresse du cluster etcd. Par défaut, Milvus lance une instance groupée, mais dans les environnements d'entreprise, la meilleure pratique consiste à se connecter à un service géré <code translate="no">etcd</code> pour une meilleure disponibilité et un meilleur contrôle opérationnel.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Définit le préfixe de clé pour le stockage des données relatives à Milvus dans etcd. Si vous exploitez plusieurs clusters Milvus sur le même backend etcd, l'utilisation de différents chemins racine permet d'isoler proprement les métadonnées.</p></li>
<li><p><code translate="no">etcd.auth</code>: Contrôle les informations d'authentification. Milvus n'active pas l'authentification etcd par défaut, mais si votre instance etcd gérée nécessite des informations d'identification, vous devez les spécifier ici.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Stockage d'objets</h3><p>Malgré son nom, cette section régit tous les clients de service de stockage d'objets compatibles avec S3. Elle prend en charge des fournisseurs tels que AWS S3, GCS et Aliyun OSS via le paramètre <code translate="no">cloudProvider</code>.</p>
<p>Faites attention à ces quatre configurations clés :</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Utilisez-les pour spécifier le point de terminaison de votre service de stockage d'objets.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Attribuez des buckets distincts (ou préfixes logiques) pour éviter les collisions de données lors de l'exécution de plusieurs clusters Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Active l'espacement des noms à l'intérieur des buckets pour l'isolation des données.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifie le backend OSS. Pour une liste complète des compatibilités, voir la <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">documentation Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: File d'attente de messages</h3><p>Milvus utilise une file d'attente de messages pour la propagation des événements internes - soit Pulsar (par défaut), soit Kafka. Faites attention aux trois paramètres suivants.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Définissez ces valeurs pour utiliser un cluster Pulsar externe.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Définit le nom du locataire. Lorsque plusieurs clusters Milvus partagent une instance Pulsar, cela garantit une séparation nette des canaux.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Si vous préférez contourner le modèle de locataire de Pulsar, ajustez le préfixe du canal pour éviter les collisions.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus prend également en charge Kafka en tant que file d'attente de messages. Pour utiliser Kafka à la place, commentez les paramètres spécifiques à Pulsar et décommentez le bloc de configuration de Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Configurations des composants internes de Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Métadonnées + horodatage</h3><p>Le nœud <code translate="no">rootCoord</code> gère les changements de métadonnées (DDL/DCL) et la gestion des horodatages.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： Définit la limite supérieure du nombre de partitions par collection. Bien que la limite absolue soit de 1024, ce paramètre sert principalement de garde-fou. Pour les systèmes multi-locataires, évitez d'utiliser les partitions comme limites d'isolation - mettez plutôt en œuvre une stratégie de clé de locataire qui s'adapte à des millions de locataires logiques.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Enforce la haute disponibilité en activant un nœud de secours. Ceci est essentiel car les nœuds de coordination Milvus n'évoluent pas horizontalement par défaut.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: Passerelle API + routeur de requêtes</h3><p>Le site <code translate="no">proxy</code> gère les demandes orientées client, la validation des demandes et l'agrégation des résultats.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Limite le nombre de champs (scalaires + vectoriels) par collection. Maintenez ce nombre en dessous de 64 pour minimiser la complexité du schéma et réduire la charge d'E/S.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Contrôle le nombre de champs vectoriels dans une collection. Milvus prend en charge la recherche multimodale, mais dans la pratique, 10 champs vectoriels constituent une limite supérieure sûre.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Définit le nombre d'unités d'ingestion. En règle générale :</p>
<ul>
<li><p>&lt; 200 millions d'enregistrements → 1 tesson</p></li>
<li><p>200-400 millions d'enregistrements → 2 tiroirs</p></li>
<li><p>Au-delà, l'échelle est linéaire</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Lorsque cette option est activée, elle enregistre des informations détaillées sur les requêtes (utilisateur, IP, point de terminaison, SDK). Utile pour l'audit et le débogage.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Exécution de la requête</h3><p>Gère l'exécution de la recherche vectorielle et le chargement des segments. Prêtez attention au paramètre suivant.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Active les entrées/sorties en mémoire pour le chargement des champs scalaires et des segments. L'activation de <code translate="no">mmap</code> permet de réduire l'empreinte mémoire, mais peut réduire la latence si les E/S disque deviennent un goulot d'étranglement.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Gestion des segments et des index</h3><p>Ce paramètre contrôle la segmentation des données, l'indexation, le compactage et la collecte des déchets (GC). Les principaux paramètres de configuration sont les suivants</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Spécifie la taille maximale d'un segment de données en mémoire. Des segments plus grands signifient généralement moins de segments dans le système, ce qui peut améliorer les performances des requêtes en réduisant les frais généraux d'indexation et de recherche. Par exemple, certains utilisateurs utilisant des instances <code translate="no">queryNode</code> avec 128 Go de RAM ont indiqué que l'augmentation de ce paramètre de 1 Go à 8 Go a permis d'améliorer les performances des requêtes d'environ 4 fois.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Comme ci-dessus, ce paramètre contrôle la taille maximale des <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">index de disque</a> (diskann index) en particulier.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Détermine le moment où un segment croissant est scellé (c'est-à-dire finalisé et indexé). Le segment est scellé lorsqu'il atteint <code translate="no">maxSize * sealProportion</code>. Par défaut, avec <code translate="no">maxSize = 1024MB</code> et <code translate="no">sealProportion = 0.12</code>, un segment sera scellé à environ 123MB.</p></li>
</ol>
<ul>
<li><p>Des valeurs plus faibles (par exemple, 0.12) déclenchent le scellement plus tôt, ce qui peut permettre une création plus rapide de l'index - utile dans les charges de travail avec des mises à jour fréquentes.</p></li>
<li><p>Des valeurs plus élevées (par exemple, 0,3 à 0,5) retardent le scellement, ce qui réduit la charge d'indexation et convient mieux aux scénarios d'ingestion hors ligne ou par lots.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Définit le facteur d'expansion autorisé pendant le compactage. Milvus calcule la taille de segment maximale autorisée pendant le compactage comme <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Après le compactage d'un segment ou l'abandon d'une collection, Milvus ne supprime pas immédiatement les données sous-jacentes. Au lieu de cela, il marque les segments pour suppression et attend que le cycle de collecte des ordures (GC) se termine. Ce paramètre contrôle la durée de ce délai.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Autres configurations fonctionnelles<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Observabilité et diagnostic</h3><p>Une journalisation robuste est la pierre angulaire de tout système distribué, et Milvus ne fait pas exception. Une installation de journalisation bien configurée aide non seulement à déboguer les problèmes lorsqu'ils surviennent, mais garantit également une meilleure visibilité de la santé et du comportement du système au fil du temps.</p>
<p>Pour les déploiements en production, nous recommandons d'intégrer les journaux Milvus à des outils de journalisation et de surveillance centralisés, tels que <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>, afin de rationaliser l'analyse et les alertes. Les paramètres clés sont les suivants :</p>
<ol>
<li><p><code translate="no">log.level</code>: Contrôle la verbosité de la sortie des journaux. Pour les environnements de production, restez au niveau <code translate="no">info</code> pour capturer les détails essentiels de l'exécution sans surcharger le système. Pendant le développement ou le dépannage, vous pouvez passer à <code translate="no">debug</code> pour obtenir des informations plus détaillées sur les opérations internes. ⚠️ Soyez prudent avec le niveau <code translate="no">debug</code> en production : il génère un volume important de journaux, qui peut rapidement consommer de l'espace disque et dégrader les performances d'E/S s'il n'est pas contrôlé.</p></li>
<li><p><code translate="no">log.file</code>: Par défaut, Milvus écrit les journaux sur la sortie standard (stdout), ce qui convient aux environnements conteneurisés dans lesquels les journaux sont collectés via des sidecars ou des agents de nœuds. Pour activer la journalisation basée sur les fichiers à la place, vous pouvez configurer :</p></li>
</ol>
<ul>
<li><p>la taille maximale du fichier avant rotation</p></li>
<li><p>la période de rétention des fichiers</p></li>
<li><p>le nombre de fichiers journaux de sauvegarde à conserver.</p></li>
</ul>
<p>Cette option est utile dans les environnements "bare-metal" ou "on-prem" où l'envoi de journaux stdout n'est pas disponible.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Authentification et contrôle d'accès</h3><p>Milvus prend en charge l'<a href="https://milvus.io/docs/authenticate.md?tab=docker">authentification des utilisateurs</a> et le <a href="https://milvus.io/docs/rbac.md">contrôle d'accès basé sur les rôles (RBAC)</a>, tous deux configurés sous le module <code translate="no">common</code>. Ces paramètres sont essentiels pour sécuriser les environnements multi-locataires ou tout déploiement exposé à des clients externes.</p>
<p>Les paramètres clés sont les suivants :</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Cette option permet d'activer ou de désactiver l'authentification et le RBAC. Il est désactivé par défaut, ce qui signifie que toutes les opérations sont autorisées sans vérification d'identité. Pour appliquer un contrôle d'accès sécurisé, définissez ce paramètre sur <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Lorsque l'authentification est activée, ce paramètre définit le mot de passe initial de l'utilisateur intégré à <code translate="no">root</code>.</p></li>
</ol>
<p>Veillez à modifier le mot de passe par défaut immédiatement après l'activation de l'authentification afin d'éviter les failles de sécurité dans les environnements de production.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Limitation du débit et contrôle de l'écriture</h3><p>La section <code translate="no">quotaAndLimits</code> de <code translate="no">milvus.yaml</code> joue un rôle essentiel dans le contrôle de la circulation des données dans le système. Elle régit les limites de débit pour les opérations telles que les insertions, les suppressions, les vidages et les requêtes, afin de garantir la stabilité du cluster en cas de charge de travail élevée et d'empêcher la dégradation des performances due à l'amplification de l'écriture ou à un compactage excessif.</p>
<p>Les principaux paramètres sont les suivants :</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Contrôle la fréquence à laquelle Milvus efface les données d'une collection.</p>
<ul>
<li><p><strong>Valeur par défaut</strong>: <code translate="no">0.1</code>, ce qui signifie que le système autorise un vidage toutes les 10 secondes.</p></li>
<li><p>L'opération de vidange scelle un segment croissant et le fait passer de la file d'attente des messages au stockage des objets.</p></li>
<li><p>Un rinçage trop fréquent peut générer de nombreux petits segments scellés, ce qui augmente la surcharge de compactage et nuit aux performances des requêtes.</p></li>
</ul>
<p>💡 Meilleure pratique : Dans la plupart des cas, laisser Milvus s'en charger automatiquement. Un segment en croissance est scellé lorsqu'il atteint <code translate="no">maxSize * sealProportion</code>, et les segments scellés sont vidés toutes les 10 minutes. Les vidanges manuelles ne sont recommandées qu'après les insertions en masse, lorsque vous savez qu'il n'y a plus de données à venir.</p>
<p>N'oubliez pas non plus que la <strong>visibilité des données</strong> est déterminée par le <em>niveau de cohérence de</em> la requête, et non par le moment de la vidange.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Ces paramètres définissent le taux maximum autorisé pour les opérations d'insertion et de suppression.</p>
<ul>
<li><p>Milvus repose sur une architecture de stockage LSM-Tree, ce qui signifie que des mises à jour et des suppressions fréquentes déclenchent un compactage. Cette opération peut être gourmande en ressources et réduire le débit global si elle n'est pas gérée avec soin.</p></li>
<li><p>Il est recommandé de limiter <code translate="no">upsertRate</code> et <code translate="no">deleteRate</code> à <strong>0,5 Mo/s</strong> pour éviter de surcharger le pipeline de compactage.</p></li>
</ul>
<p>🚀 Besoin de mettre à jour rapidement un grand ensemble de données ? Utilisez une stratégie d'alias de collection :</p>
<ul>
<li><p>Insérez les nouvelles données dans une nouvelle collection.</p></li>
<li><p>Une fois la mise à jour terminée, faites pointer l'alias vers la nouvelle collection. Cela permet d'éviter la pénalité de compactage des mises à jour sur place et de basculer instantanément.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Exemples de configuration dans le monde réel<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Passons en revue deux scénarios de déploiement courants pour illustrer la manière dont les paramètres de configuration de Milvus peuvent être ajustés pour répondre à différents objectifs opérationnels.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">Exemple 1 : Configuration haute performance</h3><p>Lorsque la latence des requêtes est critique - pensez aux moteurs de recommandation, aux plates-formes de recherche sémantique ou à l'évaluation des risques en temps réel - chaque milliseconde compte. Dans ces cas d'utilisation, vous vous appuierez généralement sur des index basés sur des graphes tels que <strong>HNSW</strong> ou <strong>DISKANN</strong>, et vous optimiserez l'utilisation de la mémoire et le comportement du cycle de vie des segments.</p>
<p>Principales stratégies de réglage :</p>
<ul>
<li><p>Augmenter <code translate="no">dataCoord.segment.maxSize</code> et <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Augmentez ces valeurs à 4 Go ou même 8 Go, en fonction de la RAM disponible. Des segments plus grands réduisent le nombre de constructions d'index et améliorent le débit des requêtes en minimisant le fanout des segments. Cependant, les segments plus grands consomment plus de mémoire au moment de la requête. Assurez-vous donc que vos instances <code translate="no">indexNode</code> et <code translate="no">queryNode</code> disposent d'une marge de manœuvre suffisante.</p></li>
<li><p>Diminuez <code translate="no">dataCoord.segment.sealProportion</code> et <code translate="no">dataCoord.segment.expansionRate</code>: ciblez une taille de segment croissante d'environ 200 Mo avant de sceller. L'utilisation de la mémoire des segments reste ainsi prévisible et la charge du Delegator (le leader du queryNode qui coordonne la recherche distribuée) s'en trouve allégée.</p></li>
</ul>
<p>Règle générale : Privilégier des segments moins nombreux et plus grands lorsque la mémoire est abondante et que la latence est une priorité. Soyez prudent avec les seuils de scellement si la fraîcheur de l'index est importante.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">Exemple 2 : Configuration optimisée en fonction des coûts</h3><p>Si vous privilégiez la rentabilité aux performances brutes - ce qui est courant dans les pipelines de formation de modèles, les outils internes à faible QPS ou la recherche d'images à longue traîne - vous pouvez faire un compromis sur le rappel ou la latence pour réduire de manière significative les exigences de l'infrastructure.</p>
<p>Stratégies recommandées :</p>
<ul>
<li><p><strong>Utiliser la quantification d'index :</strong> Les types d'index tels que <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code> ou <code translate="no">HNSW_PQ/PRQ/SQ</code> (introduits dans Milvus 2.5) réduisent considérablement la taille de l'index et l'empreinte mémoire. Ils sont idéaux pour les charges de travail où la précision est moins importante que l'échelle ou le budget.</p></li>
<li><p><strong>Adoptez une stratégie d'indexation sur disque :</strong> Définissez le type d'index sur <code translate="no">DISKANN</code> pour permettre une recherche purement sur disque. <strong>Activez</strong> <code translate="no">mmap</code> pour un délestage sélectif de la mémoire.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour des économies de mémoire extrêmes, activez <code translate="no">mmap</code> pour les éléments suivants : <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, et <code translate="no">scalarIndex</code>. Cela permet de décharger de gros blocs de données dans la mémoire virtuelle, ce qui réduit considérablement l'utilisation de la mémoire vive résidente.</p>
<p>⚠️ Mise en garde : Si le filtrage scalaire représente une part importante de votre charge de travail, envisagez de désactiver <code translate="no">mmap</code> pour <code translate="no">vectorIndex</code> et <code translate="no">scalarIndex</code>. Le mappage de la mémoire peut dégrader les performances des requêtes scalaires dans les environnements à entrées/sorties limitées.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Conseil sur l'utilisation du disque</h4><ul>
<li><p>Les index HNSW construits avec <code translate="no">mmap</code> peuvent augmenter la taille totale des données jusqu'à <strong>1,8 fois</strong>.</p></li>
<li><p>Un disque physique de 100 Go ne peut en réalité contenir que 50 Go de données effectives lorsque vous tenez compte de la surcharge de l'index et de la mise en cache.</p></li>
<li><p>Prévoyez toujours un espace de stockage supplémentaire lorsque vous travaillez avec <code translate="no">mmap</code>, en particulier si vous mettez également en cache les vecteurs originaux localement.</p></li>
</ul>
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
    </button></h2><p>L'optimisation de Milvus ne consiste pas à rechercher des chiffres parfaits, mais à façonner le système en fonction du comportement réel de votre charge de travail. Les optimisations les plus efficaces proviennent souvent de la compréhension de la manière dont Milvus gère les E/S, le cycle de vie des segments et l'indexation sous pression. Il s'agit des chemins où une mauvaise configuration est la plus préjudiciable et où un réglage réfléchi permet d'obtenir les meilleurs résultats.</p>
<p>Si vous débutez avec Milvus, les paramètres de configuration que nous avons abordés couvriront 80 à 90 % de vos besoins en termes de performances et de stabilité. Commencez par là. Une fois que vous avez acquis une certaine intuition, approfondissez la spécification complète de <code translate="no">milvus.yaml</code> et la documentation officielle : vous découvrirez des contrôles fins qui peuvent faire passer votre déploiement de fonctionnel à exceptionnel.</p>
<p>Avec les bonnes configurations en place, vous serez prêt à construire des systèmes de recherche vectorielle évolutifs et performants qui s'alignent sur vos priorités opérationnelles, qu'il s'agisse d'un service à faible latence, d'un stockage rentable ou de charges de travail analytiques à haut débit.</p>
