---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12 : un accès plus facile, des vitesses de recherche de vecteurs
  plus rapides et une meilleure expérience utilisateur
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous sommes ravis d'annoncer la dernière version de Milvus 2.2.12. Cette mise à jour comprend de nombreuses nouvelles fonctionnalités, telles que la prise en charge de l'API RESTful, la fonction <code translate="no">json_contains</code> et la récupération de vecteurs pendant les recherches ANN en réponse aux commentaires des utilisateurs. Nous avons également rationalisé l'expérience utilisateur, amélioré les vitesses de recherche vectorielle et résolu de nombreux problèmes. Voyons maintenant ce que nous pouvons attendre de Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Prise en charge de l'API RESTful<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 prend désormais en charge l'API RESTful, qui permet aux utilisateurs d'accéder à Milvus sans installer de client, ce qui facilite les opérations client-serveur. En outre, le déploiement de Milvus est devenu plus pratique car le SDK Milvus et l'API RESTful partagent le même numéro de port.</p>
<p><strong>Remarque</strong>: nous recommandons toujours d'utiliser le SDK pour déployer Milvus pour les opérations avancées ou si votre entreprise est sensible à la latence.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Récupération de vecteurs pendant les recherches ANN<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les versions précédentes, Milvus n'autorisait pas la récupération de vecteurs pendant les recherches par approximation du plus proche voisin (ANN) afin de privilégier les performances et l'utilisation de la mémoire. Par conséquent, la récupération des vecteurs bruts devait être divisée en deux étapes : l'exécution de la recherche ANN, puis l'interrogation des vecteurs bruts sur la base de leurs ID. Cette approche augmentait les coûts de développement et compliquait le déploiement et l'adoption de Milvus par les utilisateurs.</p>
<p>Avec Milvus 2.2.12, les utilisateurs peuvent récupérer les vecteurs bruts pendant les recherches ANN en définissant le champ de vecteur comme champ de sortie et en effectuant des recherches dans les collections indexées HNSW, DiskANN ou IVF-FLAT. En outre, les utilisateurs peuvent s'attendre à une vitesse de récupération des vecteurs beaucoup plus rapide.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Prise en charge des opérations sur les tableaux JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons récemment ajouté la prise en charge de JSON dans Milvus 2.2.8. Depuis, les utilisateurs ont envoyé de nombreuses demandes de prise en charge d'opérations supplémentaires sur les tableaux JSON, telles que l'inclusion, l'exclusion, l'intersection, l'union, la différence, etc. Dans Milvus 2.2.12, nous avons donné la priorité à la prise en charge de la fonction <code translate="no">json_contains</code> pour permettre l'opération d'inclusion. Nous continuerons à ajouter la prise en charge d'autres opérateurs dans les versions futures.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Améliorations et corrections de bogues<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre l'introduction de nouvelles fonctionnalités, Milvus 2.2.12 a amélioré ses performances de recherche vectorielle en réduisant les frais généraux, ce qui facilite le traitement des recherches topk étendues. En outre, elle améliore les performances d'écriture dans les situations où la clé de partition est activée et dans les situations multipartition et optimise l'utilisation de l'unité centrale pour les grandes machines. Cette mise à jour résout divers problèmes : utilisation excessive du disque, compaction bloquée, suppressions de données peu fréquentes et échecs d'insertion en vrac. Pour plus d'informations, veuillez consulter les <a href="https://milvus.io/docs/release_notes.md#2212">notes de mise à jour de Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Restons en contact !<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, n'hésitez pas à nous contacter sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter directement avec nos ingénieurs et la communauté ou consulter nos <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">heures de bureau du mardi</a>!</p>
