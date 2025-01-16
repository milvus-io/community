---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: >-
  Milvus 2.2.8 : Meilleures performances en matière d'interrogation, débit
  supérieur de 20
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Nous sommes heureux d'annoncer notre dernière version de Milvus 2.2.8. Cette version comprend de nombreuses améliorations et corrections de bogues par rapport aux versions précédentes, ce qui se traduit par de meilleures performances d'interrogation, des économies de ressources et des débits plus élevés. Examinons ensemble les nouveautés de cette version.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Réduction des pics de consommation de mémoire lors du chargement des collections<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour exécuter des requêtes, Milvus doit charger des données et des index en mémoire. Toutefois, au cours du processus de chargement, de multiples copies de la mémoire peuvent entraîner une augmentation de l'utilisation maximale de la mémoire jusqu'à trois ou quatre fois supérieure à celle observée au cours de l'exécution réelle. La dernière version de Milvus 2.2.8 résout efficacement ce problème et optimise l'utilisation de la mémoire.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Scénarios d'interrogation élargis avec la prise en charge des plugins par QueryNode<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>QueryNode prend désormais en charge les plugins dans la dernière version de Milvus 2.2.8. Vous pouvez facilement spécifier le chemin du fichier de plugin avec la configuration <code translate="no">queryNode.soPath</code>. Milvus peut alors charger le plugin au moment de l'exécution et étendre les scénarios d'interrogation disponibles. Reportez-vous à la <a href="https://pkg.go.dev/plugin">documentation du plugin Go</a> si vous avez besoin de conseils sur le développement de plugins.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Performances d'interrogation optimisées grâce à un algorithme de compactage amélioré<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>L'algorithme de compactage détermine la vitesse à laquelle les segments peuvent converger, ce qui affecte directement les performances des requêtes. Grâce aux récentes améliorations apportées à l'algorithme de compactage, l'efficacité de la convergence s'est considérablement améliorée, ce qui se traduit par des requêtes plus rapides.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Une meilleure économie de ressources et de meilleures performances d'interrogation grâce à la réduction du nombre de morceaux de collection<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est un système de traitement massivement parallèle (MPP), ce qui signifie que le nombre d'unités de collection a une incidence sur l'efficacité de Milvus en matière d'écriture et d'interrogation. Dans les versions antérieures, une collection comportait par défaut deux unités, ce qui se traduisait par d'excellentes performances d'écriture, mais compromettait les performances d'interrogation et le coût des ressources. Avec la nouvelle mise à jour Milvus 2.2.8, le nombre de tessons de collection par défaut a été réduit à un, ce qui permet aux utilisateurs d'économiser davantage de ressources et d'effectuer de meilleures requêtes. La plupart des utilisateurs de la communauté ont moins de 10 millions de volumes de données, et un seul shard est suffisant pour obtenir de bonnes performances d'écriture.</p>
<p><strong>Remarque</strong>: cette mise à jour n'affecte pas les collections créées avant cette version.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">Augmentation de 20 % du débit grâce à un algorithme de regroupement des requêtes amélioré<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus dispose d'un algorithme de regroupement de requêtes efficace qui combine plusieurs requêtes dans la file d'attente en une seule pour une exécution plus rapide, ce qui améliore considérablement le débit. Dans la dernière version, nous apportons des améliorations supplémentaires à cet algorithme, augmentant le débit de Milvus d'au moins 20 %.</p>
<p>Outre les améliorations mentionnées, Milvus 2.2.8 corrige également divers bogues. Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md">notes de version de Milvus</a>.</p>
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, n'hésitez pas à nous contacter via <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter directement avec nos ingénieurs et l'ensemble de la communauté ou vous rendre à nos <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">heures de bureau du mardi</a>!</p>
