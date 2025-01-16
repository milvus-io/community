---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Révélation de Milvus 2.3.2 &amp; 2.3.3 : Prise en charge des types de données
  de tableau, suppression complexe, intégration TiKV, et plus encore
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  Aujourd'hui, nous sommes ravis d'annoncer la sortie de Milvus 2.3.2 et 2.3.3 !
  Ces mises à jour apportent de nombreuses fonctionnalités, optimisations et
  améliorations passionnantes, améliorant les performances du système, la
  flexibilité et l'expérience globale de l'utilisateur.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans le paysage en constante évolution des technologies de recherche vectorielle, Milvus reste à l'avant-garde, repoussant les limites et établissant de nouvelles normes. Aujourd'hui, nous sommes ravis d'annoncer la sortie de Milvus 2.3.2 et 2.3.3 ! Ces mises à jour apportent de nombreuses fonctionnalités, optimisations et améliorations passionnantes, améliorant les performances du système, la flexibilité et l'expérience globale de l'utilisateur.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Prise en charge des types de données Array - pour des résultats de recherche plus précis et plus pertinents<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ajout de la prise en charge des types de données Array est une amélioration essentielle pour Milvus, en particulier dans les scénarios de filtrage des requêtes tels que l'intersection et l'union. Cet ajout garantit que les résultats de la recherche sont non seulement plus précis, mais aussi plus pertinents. En termes pratiques, par exemple, dans le secteur du commerce électronique, les étiquettes de produits stockées sous forme de tableaux de chaînes permettent aux consommateurs d'effectuer des recherches avancées, en filtrant les résultats non pertinents.</p>
<p>Plongez dans notre <a href="https://milvus.io/docs/array_data_type.md">documentation</a> complète pour obtenir un guide approfondi sur l'exploitation des types de tableaux dans Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Prise en charge des expressions de suppression complexes - amélioration de la gestion des données<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les versions précédentes, Milvus prenait en charge les expressions de suppression de clé primaire, offrant ainsi une architecture stable et rationalisée. Avec Milvus 2.3.2 ou 2.3.3, les utilisateurs peuvent employer des expressions de suppression complexes, ce qui facilite les tâches de gestion de données sophistiquées telles que le nettoyage en continu des anciennes données ou la suppression de données conforme au GDPR basée sur les identifiants des utilisateurs.</p>
<p>Remarque : assurez-vous d'avoir chargé les collections avant d'utiliser des expressions complexes. En outre, il est important de noter que le processus de suppression ne garantit pas l'atomicité.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">Intégration de TiKV - stockage de métadonnées évolutif et stable<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>S'appuyant auparavant sur Etcd pour le stockage des métadonnées, Milvus a été confronté à une capacité limitée et à des problèmes d'évolutivité dans le stockage des métadonnées. Pour résoudre ces problèmes, Milvus a ajouté TiKV, un magasin de clés-valeurs open-source, comme option supplémentaire pour le stockage des métadonnées. TiKV offre une évolutivité, une stabilité et une efficacité accrues, ce qui en fait une solution idéale pour répondre aux besoins évolutifs de Milvus. À partir de Milvus 2.3.2, les utilisateurs peuvent passer en toute transparence à TiKV pour le stockage de leurs métadonnées en modifiant la configuration.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Prise en charge du type de vecteur FP16 - pour une meilleure efficacité de l'apprentissage automatique<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 et les versions ultérieures prennent désormais en charge le type de vecteur FP16 au niveau de l'interface. FP16, ou virgule flottante 16 bits, est un format de données largement utilisé dans l'apprentissage profond et l'apprentissage automatique, fournissant une représentation et un calcul efficaces des valeurs numériques. Bien que la prise en charge complète de FP16 soit en cours, divers index dans la couche d'indexation nécessitent de convertir FP16 en FP32 pendant la construction.</p>
<p>Nous prendrons pleinement en charge les types de données FP16, BF16 et int8 dans les versions ultérieures de Milvus. Restez à l'écoute.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Amélioration significative de l'expérience de mise à niveau continue - transition transparente pour les utilisateurs<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>La mise à niveau continue est une fonctionnalité essentielle pour les systèmes distribués, car elle permet de mettre à niveau les systèmes sans perturber les services commerciaux ni subir de temps d'arrêt. Dans les dernières versions de Milvus, nous avons renforcé la fonction de mise à niveau continue de Milvus, assurant une transition plus rationalisée et efficace pour les utilisateurs qui passent de la version 2.2.15 à la version 2.3.3 et à toutes les versions ultérieures. La communauté a également investi dans des tests et des optimisations approfondis, réduisant l'impact des requêtes pendant la mise à niveau à moins de 5 minutes, offrant ainsi aux utilisateurs une expérience sans problème.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimisation des performances<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre l'introduction de nouvelles fonctionnalités, nous avons considérablement optimisé les performances de Milvus dans les deux dernières versions.</p>
<ul>
<li><p>Réduction des opérations de copie de données pour un chargement optimisé des données</p></li>
<li><p>Simplification des insertions de grande capacité à l'aide de la lecture varchar par lots</p></li>
<li><p>Suppression des vérifications d'offset inutiles pendant le remplissage des données afin d'améliorer les performances de la phase de rappel.</p></li>
<li><p>Résolution des problèmes de consommation élevée de l'unité centrale dans les scénarios comportant des insertions de données importantes.</p></li>
</ul>
<p>Ces optimisations contribuent collectivement à une expérience Milvus plus rapide et plus efficace. Consultez notre tableau de bord de surveillance pour un aperçu rapide de l'amélioration des performances de Milvus.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Modifications incompatibles<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>Suppression définitive du code lié à TimeTravel.</p></li>
<li><p>Suppression de la prise en charge de MySQL en tant que magasin de métadonnées.</p></li>
</ul>
<p>Consultez les <a href="https://milvus.io/docs/release_notes.md">notes de version de Milvus</a> pour obtenir des informations plus détaillées sur toutes les nouvelles fonctionnalités et améliorations.</p>
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
    </button></h2><p>Avec les dernières versions 2.3.2 et 2.3.3 de Milvus, nous nous engageons à fournir une solution de base de données robuste, riche en fonctionnalités et très performante. Explorez ces nouvelles fonctionnalités, profitez des optimisations et rejoignez-nous dans cette aventure passionnante au cours de laquelle nous faisons évoluer Milvus pour répondre aux exigences de la gestion moderne des données. Téléchargez la dernière version dès maintenant et découvrez l'avenir du stockage de données avec Milvus !</p>
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> pour dialoguer directement avec nos ingénieurs et la communauté ou participez à notre <a href="https://discord.com/invite/RjNbk8RR4f">déjeuner et apprentissage de la communauté Milvus</a> tous les mardis de 12 à 12 h 30 (heure de Paris). Nous vous invitons également à nous suivre sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> pour connaître les dernières nouvelles et mises à jour concernant Milvus.</p>
