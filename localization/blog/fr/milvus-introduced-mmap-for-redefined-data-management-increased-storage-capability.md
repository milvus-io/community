---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus présente MMap pour une gestion des données redéfinie et une capacité de
  stockage accrue
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  La fonction MMap de Milvus permet aux utilisateurs de traiter davantage de
  données dans une mémoire limitée, en trouvant un équilibre délicat entre les
  performances, le coût et les limites du système.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> est la solution la plus rapide dans le domaine des <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de données vectorielles</a> open-source, destinée aux utilisateurs ayant des exigences de performance élevées. Cependant, la diversité des besoins des utilisateurs reflète les données avec lesquelles ils travaillent. Certains privilégient les solutions économiques et le stockage étendu à la vitesse pure. Comprenant cet éventail de demandes, Milvus introduit la fonctionnalité MMap, qui redéfinit la manière dont nous traitons les grands volumes de données tout en promettant une rentabilité sans sacrifier la fonctionnalité.</p>
<h2 id="What-is-MMap" class="common-anchor-header">Qu'est-ce que MMap ?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, abréviation de memory-mapped files (fichiers mappés en mémoire), comble le fossé entre les fichiers et la mémoire au sein des systèmes d'exploitation. Cette technologie permet à Milvus de mapper des fichiers volumineux directement dans l'espace mémoire du système, en transformant les fichiers en blocs de mémoire contigus. Cette intégration élimine le besoin d'opérations de lecture ou d'écriture explicites, ce qui modifie fondamentalement la façon dont Milvus gère les données. Elle garantit un accès transparent et un stockage efficace pour les fichiers volumineux ou les situations dans lesquelles les utilisateurs doivent accéder aux fichiers de manière aléatoire.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Qui bénéficie de MMap ?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles nécessitent une capacité de mémoire importante en raison des besoins de stockage des données vectorielles. Grâce à la fonction MMap, le traitement d'un plus grand nombre de données dans une mémoire limitée devient une réalité. Toutefois, cette capacité accrue a un coût en termes de performances. Le système gère intelligemment la mémoire, en évinçant certaines données en fonction de la charge et de l'utilisation. Cette éviction permet à Milvus de traiter davantage de données avec la même capacité de mémoire.</p>
<p>Au cours de nos tests, nous avons observé qu'avec une mémoire suffisante, toutes les données résident en mémoire après une période de préchauffage, ce qui préserve les performances du système. Toutefois, à mesure que le volume de données augmente, les performances diminuent progressivement. <strong>Par conséquent, nous recommandons la fonction MMap aux utilisateurs moins sensibles aux fluctuations des performances.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Activation de MMap dans Milvus : une configuration simple<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>L'activation de MMap dans Milvus est remarquablement simple. Il vous suffit de modifier le fichier <code translate="no">milvus.yaml</code>: ajoutez l'élément <code translate="no">mmapDirPath</code> sous la configuration <code translate="no">queryNode</code> et définissez un chemin d'accès valide comme valeur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Trouver l'équilibre : performances, stockage et limites du système<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Les modèles d'accès aux données ont un impact significatif sur les performances. La fonction MMap de Milvus optimise l'accès aux données en fonction de la localité. MMap permet à Milvus d'écrire des données scalaires directement sur le disque pour les segments de données à accès séquentiel. Les données de longueur variable, telles que les chaînes, sont aplaties et indexées à l'aide d'un tableau d'offsets en mémoire. Cette approche garantit la localité de l'accès aux données et élimine les frais généraux liés au stockage séparé de chaque donnée de longueur variable. Les optimisations pour les index vectoriels sont méticuleuses. MMap est utilisé de manière sélective pour les données vectorielles tout en conservant les listes d'adjacence en mémoire, ce qui permet de conserver une quantité importante de mémoire sans compromettre les performances.</p>
<p>En outre, MMap maximise le traitement des données en minimisant l'utilisation de la mémoire. Contrairement aux versions précédentes de Milvus dans lesquelles QueryNode copiait des ensembles de données entiers, MMap adopte un processus de streaming rationalisé et sans copie pendant le développement. Cette optimisation réduit considérablement la charge de mémoire.</p>
<p><strong>Les résultats de nos tests internes montrent que Milvus peut traiter efficacement un volume de données deux fois plus important lorsque MMap est activé.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">La voie à suivre : innovation continue et améliorations centrées sur l'utilisateur<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien que la fonction MMap soit en phase bêta, l'équipe de Milvus s'est engagée à l'améliorer en permanence. Les prochaines mises à jour affineront l'utilisation de la mémoire du système, ce qui permettra à Milvus de prendre en charge des volumes de données encore plus importants sur un seul nœud. Les utilisateurs peuvent s'attendre à un contrôle plus granulaire de la fonction MMap, permettant des modifications dynamiques des collections et des modes de chargement de champs avancés. Ces améliorations offrent une flexibilité sans précédent, permettant aux utilisateurs d'adapter leurs stratégies de traitement des données à des exigences spécifiques.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Conclusion : redéfinir l'excellence du traitement des données avec Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>La fonction MMap de Milvus 2.3 marque une avancée significative dans la technologie du traitement des données. En trouvant un équilibre délicat entre les performances, le coût et les limites du système, Milvus permet aux utilisateurs de traiter de grandes quantités de données de manière efficace et rentable. Tout en continuant à évoluer, Milvus reste à l'avant-garde des solutions innovantes, redéfinissant les limites de ce qui est réalisable dans la gestion des données.</p>
<p>Restez à l'écoute pour découvrir d'autres développements révolutionnaires alors que Milvus poursuit son voyage vers une excellence inégalée en matière de traitement des données.</p>
