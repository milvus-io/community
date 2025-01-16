---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Dévoilement de Milvus 2.3 : une version importante qui prend en charge les
  GPU, Arm64, CDC et de nombreuses autres fonctionnalités très attendues.
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 est une version d'étape avec de nombreuses fonctionnalités très
  attendues, notamment la prise en charge des GPU, Arm64, upsert, la capture des
  données de changement, l'index ScaNN et la recherche par plage. Elle améliore
  également les performances des requêtes, l'équilibrage des charges et la
  planification, ainsi que l'observabilité et l'opérabilité.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Des nouvelles passionnantes ! Après huit mois d'efforts concertés, nous sommes ravis d'annoncer la sortie de Milvus 2.3, une version importante qui apporte de nombreuses fonctionnalités très attendues, notamment la prise en charge du GPU, de l'Arm64, de l'upsert, de la capture des données de modification, de l'index ScaNN et de la technologie MMap. Milvus 2.3 améliore également les performances des requêtes, l'équilibrage des charges et la planification, ainsi que l'observabilité et l'opérabilité.</p>
<p>Rejoignez-moi pour examiner ces nouvelles fonctionnalités et améliorations et apprendre comment vous pouvez bénéficier de cette version.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Prise en charge de l'index GPU qui permet de multiplier par 3 à 10 les performances en termes de QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>L'index GPU est une fonctionnalité très attendue par la communauté Milvus. Grâce à une excellente collaboration avec les ingénieurs de Nvidia, Milvus 2.3 a pris en charge l'indexation GPU avec le robuste algorithme RAFT ajouté à Knowhere, le moteur d'indexation de Milvus. Avec la prise en charge du GPU, Milvus 2.3 est plus de trois fois plus rapide en QPS que les anciennes versions utilisant l'index HNSW du CPU et presque dix fois plus rapide pour des ensembles de données spécifiques qui nécessitent des calculs lourds.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Prise en charge d'Arm64 pour répondre à la demande croissante des utilisateurs<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Les processeurs Arm sont de plus en plus populaires parmi les fournisseurs de cloud et les développeurs. Pour répondre à cette demande croissante, Milvus fournit désormais des images Docker pour l'architecture ARM64. Grâce à cette nouvelle prise en charge de l'unité centrale, les utilisateurs de MacOS peuvent créer leurs applications avec Milvus de manière plus transparente.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Prise en charge de l'Upsert pour une meilleure expérience utilisateur<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 introduit une amélioration notable en prenant en charge l'opération upsert. Cette nouvelle fonctionnalité permet aux utilisateurs de mettre à jour ou d'insérer des données de manière transparente et leur donne la possibilité d'effectuer les deux opérations en une seule demande par le biais de l'interface Upsert. Cette fonctionnalité rationalise la gestion des données et apporte de l'efficacité.</p>
<p><strong>Remarque</strong>:</p>
<ul>
<li>La fonction Upsert ne s'applique pas aux ID auto-incrémentés.</li>
<li>Upsert est implémenté comme une combinaison de <code translate="no">delete</code> et <code translate="no">insert</code>, ce qui peut entraîner une perte de performance. Nous vous recommandons d'utiliser <code translate="no">insert</code> si vous utilisez Milvus dans des scénarios à forte densité d'écriture.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Recherche par plage pour des résultats plus précis<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 permet aux utilisateurs de spécifier la distance entre le vecteur d'entrée et les vecteurs stockés dans Milvus lors d'une requête. Milvus renvoie alors tous les résultats correspondants dans la plage définie. Vous trouverez ci-dessous un exemple de spécification de la distance de recherche à l'aide de la fonction de recherche par plage.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Dans cet exemple, l'utilisateur demande à Milvus de renvoyer des vecteurs situés à une distance de 10 à 20 unités du vecteur d'entrée.</p>
<p><strong>Remarque</strong>: Les différentes mesures de distance varient dans la manière dont elles calculent les distances, ce qui se traduit par des plages de valeurs et des stratégies de tri distinctes. Il est donc essentiel de comprendre leurs caractéristiques avant d'utiliser la fonction de recherche par plage.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Index ScaNN pour une vitesse de recherche plus rapide<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 prend désormais en charge l'index ScaNN, un index de <a href="https://zilliz.com/glossary/anns">voisinage approximatif (ANN)</a> open-source développé par Google. L'index ScaNN a démontré des performances supérieures dans divers benchmarks, surpassant HNSW d'environ 20 % et étant environ sept fois plus rapide que IVFFlat. Grâce à la prise en charge de l'index ScaNN, Milvus atteint une vitesse d'interrogation beaucoup plus rapide que les anciennes versions.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Index croissant pour des performances d'interrogation stables et meilleures<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus comprend deux catégories de données : les données indexées et les données en continu. Milvus peut utiliser des index pour rechercher rapidement des données indexées, mais il ne peut effectuer qu'une recherche brute ligne par ligne dans les données en continu, ce qui peut avoir un impact sur les performances. Milvus 2.3 introduit l'index croissant, qui crée automatiquement des index en temps réel pour les données en continu afin d'améliorer les performances des requêtes.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Itérateur pour l'extraction de données par lots<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans Milvus 2.3, Pymilvus a introduit une interface d'itérateur qui permet aux utilisateurs de récupérer plus de 16 384 entités dans une recherche ou une plage de recherche. Cette fonctionnalité est pratique lorsque les utilisateurs doivent exporter des dizaines de milliers de vecteurs, voire plus, par lots.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Prise en charge de MMap pour une capacité accrue<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap est un appel système UNIX utilisé pour mapper des fichiers et d'autres objets dans la mémoire. Milvus 2.3 prend en charge MMap, qui permet aux utilisateurs de charger des données sur des disques locaux et de les mapper en mémoire, augmentant ainsi la capacité d'une seule machine.</p>
<p>Les résultats de nos tests indiquent qu'en utilisant la technologie MMap, Milvus peut doubler sa capacité de données tout en limitant la dégradation des performances à moins de 20 %. Cette approche réduit considérablement les coûts globaux, ce qui la rend particulièrement avantageuse pour les utilisateurs disposant d'un budget serré et n'ayant pas peur de compromettre les performances.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Prise en charge du CDC pour une plus grande disponibilité du système<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Change Data Capture (CDC) est une fonction couramment utilisée dans les systèmes de base de données qui capture et réplique les modifications de données vers une destination désignée. Grâce à la fonction CDC, Milvus 2.3 permet aux utilisateurs de synchroniser les données entre les centres de données, de sauvegarder les données incrémentielles et de migrer les données de manière transparente, ce qui rend le système plus disponible.</p>
<p>Outre les fonctionnalités ci-dessus, Milvus 2.3 introduit une interface de comptage pour calculer avec précision le nombre de lignes de données stockées dans une collection en temps réel, prend en charge la métrique Cosinus pour mesurer la distance vectorielle et davantage d'opérations sur les tableaux JSON. Pour plus de fonctionnalités et d'informations détaillées, consultez les <a href="https://milvus.io/docs/release_notes.md">notes de mise à jour de Milvus 2.3</a>.</p>
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
    </button></h2><p>Outre les nouvelles fonctionnalités, Milvus 2.3 comprend de nombreuses améliorations et corrections de bogues pour les versions antérieures.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Amélioration des performances du filtrage des données</h3><p>Milvus effectue un filtrage scalaire avant la recherche vectorielle dans les requêtes de données scalaires et vectorielles hybrides pour obtenir des résultats plus précis. Toutefois, les performances d'indexation peuvent diminuer si l'utilisateur a filtré trop de données après le filtrage scalaire. Dans Milvus 2.3, nous avons optimisé la stratégie de filtrage de HNSW pour résoudre ce problème, ce qui a permis d'améliorer les performances des requêtes.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Augmentation de l'utilisation de l'unité centrale multicœur</h3><p>La recherche approximative la plus proche (ANN) est une tâche de calcul intensif qui nécessite des ressources CPU massives. Dans les versions précédentes, Milvus ne pouvait utiliser qu'environ 70 % des ressources CPU multicœurs disponibles. Toutefois, avec la dernière version, Milvus a surmonté cette limitation et peut utiliser pleinement toutes les ressources CPU multicœurs disponibles, ce qui améliore les performances des requêtes et réduit le gaspillage des ressources.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">QueryNode remanié</h3><p>QueryNode est un composant essentiel de Milvus qui est responsable de la recherche vectorielle. Cependant, dans les versions antérieures, QueryNode avait des états complexes, des files d'attente de messages en double, une structure de code non organisée et des messages d'erreur non intuitifs.</p>
<p>Dans Milvus 2.3, nous avons amélioré QueryNode en introduisant une structure de code sans état et en supprimant la file d'attente de messages pour la suppression des données. Ces mises à jour permettent de réduire le gaspillage de ressources et d'effectuer des recherches vectorielles plus rapides et plus stables.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Files d'attente de messages améliorées basées sur NATS</h3><p>Nous avons construit Milvus sur une architecture basée sur les journaux et, dans les versions précédentes, nous avons utilisé Pulsar et Kafka comme principaux courtiers de journaux. Toutefois, cette combinaison s'est heurtée à trois problèmes majeurs :</p>
<ul>
<li>Elle était instable dans les situations multi-sujets.</li>
<li>Elle consommait des ressources lorsqu'elle était inactive et peinait à dédupliquer les messages.</li>
<li>Pulsar et Kafka sont étroitement liés à l'écosystème Java, de sorte que leur communauté assure rarement la maintenance et la mise à jour de leurs SDK Go.</li>
</ul>
<p>Pour résoudre ces problèmes, nous avons combiné NATS et Bookeeper dans notre nouveau log broker pour Milvus, qui répond mieux aux besoins des utilisateurs.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Équilibreur de charge optimisé</h3><p>Milvus 2.3 a adopté un algorithme d'équilibrage de charge plus flexible basé sur les charges réelles du système. Cet algorithme optimisé permet aux utilisateurs de détecter rapidement les défaillances de nœuds et les charges déséquilibrées et d'ajuster les planifications en conséquence. D'après les résultats de nos tests, Milvus 2.3 peut détecter les pannes, les charges déséquilibrées, les états anormaux des nœuds et d'autres événements en quelques secondes et procéder rapidement à des ajustements.</p>
<p>Pour plus d'informations sur Milvus 2.3, voir les <a href="https://milvus.io/docs/release_notes.md">notes de mise à jour de Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Mises à jour des outils<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons également mis à jour Birdwatcher et Attu, deux outils précieux pour l'exploitation et la maintenance de Milvus, avec Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Mise à jour de Birdwatcher</h3><p>Nous avons mis à jour <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, l'outil de débogage de Milvus, en introduisant de nombreuses fonctionnalités et améliorations, notamment :</p>
<ul>
<li>API RESTful pour une intégration transparente avec d'autres systèmes de diagnostic.</li>
<li>Prise en charge de la commande PProf pour faciliter l'intégration avec l'outil Go pprof.</li>
<li>Capacités d'analyse de l'utilisation du stockage.</li>
<li>Fonctionnalité d'analyse efficace des journaux.</li>
<li>Prise en charge de la visualisation et de la modification des configurations dans etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Mise à jour d'Attu</h3><p>Nous avons lancé une toute nouvelle interface pour <a href="https://zilliz.com/attu">Attu</a>, un outil d'administration de bases de données vectorielles tout-en-un. La nouvelle interface a un design plus direct et est plus facile à comprendre.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour plus de détails, consultez les <a href="https://milvus.io/docs/release_notes.md">notes de mise à jour de Milvus 2.3</a>.</p>
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, n'hésitez pas à nous contacter via <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter directement avec nos ingénieurs et la communauté ou vous rendre à nos <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">heures de bureau du mardi</a>!</p>
