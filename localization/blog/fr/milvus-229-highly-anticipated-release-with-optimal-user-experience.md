---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: >-
  Milvus 2.2.9 : Une version très attendue avec une expérience utilisateur
  optimale
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous sommes ravis d'annoncer l'arrivée de Milvus 2.2.9, une version très attendue qui marque une étape importante pour l'équipe et la communauté. Cette version offre de nombreuses fonctionnalités intéressantes, notamment la prise en charge tant attendue des types de données JSON, du schéma dynamique et des clés de partition, ce qui garantit une expérience utilisateur optimisée et un flux de développement rationalisé. En outre, cette version intègre de nombreuses améliorations et corrections de bogues. Rejoignez-nous pour explorer Milvus 2.2.9 et découvrir pourquoi cette version est si intéressante.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Expérience utilisateur optimisée avec la prise en charge de JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus a introduit la prise en charge très attendue du type de données JSON, permettant le stockage transparent des données JSON avec les métadonnées des vecteurs dans les collections des utilisateurs. Grâce à cette amélioration, les utilisateurs peuvent insérer efficacement des données JSON en masse et effectuer des requêtes et des filtrages avancés basés sur le contenu de leurs champs JSON. En outre, les utilisateurs peuvent utiliser des expressions et effectuer des opérations adaptées aux champs JSON de leur ensemble de données, construire des requêtes et appliquer des filtres basés sur le contenu et la structure de leurs champs JSON, ce qui leur permet d'extraire des informations pertinentes et de mieux manipuler les données.</p>
<p>À l'avenir, l'équipe Milvus ajoutera des index pour les champs de type JSON, ce qui optimisera encore les performances des requêtes scalaires et vectorielles mixtes. Restez donc à l'écoute des développements passionnants à venir !</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Flexibilité accrue grâce à la prise en charge d'un schéma dynamique<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la prise en charge des données JSON, Milvus 2.2.9 offre désormais une fonctionnalité de schéma dynamique par le biais d'un kit de développement logiciel (SDK) simplifié.</p>
<p>A partir de Milvus 2.2.9, le SDK Milvus comprend une API de haut niveau qui remplit automatiquement les champs dynamiques dans le champ JSON caché de la collection, ce qui permet aux utilisateurs de se concentrer uniquement sur leurs champs commerciaux.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Meilleure séparation des données et efficacité de recherche accrue grâce à la clé de partition<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 améliore ses capacités de partitionnement en introduisant la fonction Partition Key. Elle permet d'utiliser des colonnes spécifiques à l'utilisateur comme clés primaires pour le partitionnement, éliminant ainsi le besoin d'API supplémentaires telles que <code translate="no">loadPartition</code> et <code translate="no">releasePartition</code>. Cette nouvelle fonctionnalité supprime également la limite du nombre de partitions, ce qui permet une utilisation plus efficace des ressources.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Prise en charge de l'OSS Alibaba Cloud<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 prend désormais en charge Alibaba Cloud Object Storage Service (OSS). Les utilisateurs d'Alibaba Cloud peuvent facilement configurer le site <code translate="no">cloudProvider</code> pour Alibaba Cloud et profiter d'une intégration transparente pour un stockage et une récupération efficaces des données vectorielles dans le nuage.</p>
<p>Outre les fonctionnalités mentionnées précédemment, Milvus 2.2.9 offre une prise en charge des bases de données dans le contrôle d'accès basé sur les rôles (RBAC), introduit la gestion des connexions et inclut de nombreuses améliorations et corrections de bogues. Pour plus d'informations, consultez les <a href="https://milvus.io/docs/release_notes.md">notes de mise à jour de Milvus 2.2.9</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Restons en contact !<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, n'hésitez pas à nous contacter sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter directement avec nos ingénieurs et la communauté ou vous rendre à nos <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">heures de bureau du mardi</a>!</p>
