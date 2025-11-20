---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  Débloquer des performances Milvus 8× avec Cloudian HyperStore et NVIDIA RDMA
  pour le stockage S3
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_931ffc8646.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian et NVIDIA introduisent RDMA pour le stockage compatible S3,
  accélérant les charges de travail d'IA avec une faible latence et permettant
  une augmentation des performances de 8× dans Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Cet article a été publié à l'origine sur <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> et est réédité ici avec l'autorisation de Cloudian.</em></p>
<p>Cloudian a collaboré avec NVIDIA pour ajouter à sa solution HyperStore® la prise en charge de RDMA pour le stockage compatible S3, en s'appuyant sur plus de 13 ans d'expérience dans la mise en œuvre de l'API S3. En tant que plate-forme basée sur l'API S3 et dotée d'une architecture de traitement parallèle, Cloudian est particulièrement bien placé pour contribuer au développement de cette technologie et en tirer parti. Cette collaboration s'appuie sur l'expertise de Cloudian dans les protocoles de stockage objet et sur le leadership de NVIDIA dans l'accélération du calcul et du réseau pour créer une solution qui intègre de façon transparente le calcul de haute performance et le stockage à l'échelle de l'entreprise ".</p>
<p>NVIDIA a annoncé la disponibilité générale prochaine de la technologie RDMA pour le stockage compatible S3 (Remote Direct Memory Access), marquant une étape importante dans l'évolution de l'infrastructure de l'IA. Cette technologie révolutionnaire promet de transformer la façon dont les entreprises gèrent les besoins en données massives des charges de travail d'IA modernes, en apportant des améliorations de performances sans précédent tout en conservant l'évolutivité et la simplicité qui ont fait du stockage d'objets compatible S3 le fondement du cloud computing.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">Qu'est-ce que RDMA pour le stockage compatible S3 ?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce lancement représente une avancée fondamentale dans la manière dont les systèmes de stockage communiquent avec les accélérateurs d'IA. La technologie permet des transferts de données directs entre le stockage d'objets compatible avec l'API S3 et la mémoire GPU, en contournant complètement les chemins de données traditionnels médiés par le CPU. Contrairement aux architectures de stockage conventionnelles qui font passer tous les transferts de données par l'unité centrale et la mémoire système, ce qui crée des goulets d'étranglement et des temps de latence, la technologie RDMA pour le stockage compatible S3 établit une autoroute directe entre le stockage et le GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Au fond, cette technologie élimine les étapes intermédiaires grâce à une voie directe qui réduit la latence, diminue considérablement les demandes de traitement de l'unité centrale et réduit de manière significative la consommation d'énergie. Il en résulte des systèmes de stockage capables de fournir des données à la vitesse requise par les GPU modernes pour les applications d'IA exigeantes.</p>
<p>La technologie maintient la compatibilité avec les API S3 omniprésentes tout en ajoutant ce chemin de données haute performance. Les commandes sont toujours émises via les protocoles de stockage standard basés sur l'API S3, mais le transfert de données réel s'effectue via RDMA directement vers la mémoire du GPU, en contournant entièrement le CPU et en éliminant la surcharge du traitement du protocole TCP.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Des performances révolutionnaires<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Les améliorations de performances apportées par RDMA pour le stockage compatible S3 ne sont rien de moins que transformationnelles. Les tests en conditions réelles démontrent la capacité de la technologie à éliminer les goulets d'étranglement des E/S de stockage qui limitent les charges de travail de l'intelligence artificielle.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Améliorations spectaculaires de la vitesse :</h3><ul>
<li><p><strong>Débit de 35 Go/s par nœud</strong> (lecture) mesuré, avec une évolutivité linéaire entre les clusters.</p></li>
<li><p><strong>Évolutivité jusqu'à des TBs/s</strong> avec l'architecture de traitement parallèle de Cloudian</p></li>
<li><p><strong>Amélioration du débit de 3 à 5 fois</strong> par rapport au stockage d'objets conventionnel basé sur TCP</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Gains d'efficacité des ressources :</h3><ul>
<li><p><strong>Réduction de 90 % de l'utilisation du processeur</strong> grâce à l'établissement de voies d'accès directes aux GPU pour les données</p></li>
<li><p><strong>Augmentation de l'utilisation des GPU</strong> grâce à l'élimination des goulets d'étranglement</p></li>
<li><p>Réduction considérable de la consommation d'énergie grâce à la réduction des frais généraux de traitement</p></li>
<li><p>Réduction des coûts pour le stockage de l'IA</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Augmentation des performances de 8X sur Milvus by Zilliz Vector DB</h3><p>Ces améliorations de performances sont particulièrement évidentes dans les opérations de bases de données vectorielles, où la collaboration entre Cloudian et Zilliz utilisant les <a href="https://www.nvidia.com/en-us/data-center/l40s/">GPU</a> <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> et <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S</a> a permis de <strong>multiplier par 8 les performances des opérations Milvus</strong> par rapport aux systèmes basés sur le CPU et au transfert de données basé sur le TCP. Il s'agit là d'un changement fondamental : le stockage n'est plus une contrainte mais permet aux applications d'IA d'atteindre leur plein potentiel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Pourquoi le stockage d'objets basé sur l'API S3 pour les charges de travail d'IA ?<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>La convergence de la technologie RDMA et de l'architecture de stockage objet crée la base idéale pour l'infrastructure d'IA, en relevant de nombreux défis qui ont limité les approches de stockage traditionnelles.</p>
<p><strong>Évolutivité de l'ordre de l'exaoctet pour l'explosion des données d'IA :</strong> Les charges de travail de l'IA, en particulier celles qui impliquent des données synthétiques et multimodales, augmentent les besoins en stockage jusqu'à 100 pétaoctets et plus. L'espace d'adressage plat du stockage objet s'étend de manière transparente des pétaoctets aux exaoctets, s'adaptant à la croissance exponentielle des ensembles de données d'apprentissage de l'IA sans les limites hiérarchiques qui contraignent les systèmes à base de fichiers.</p>
<p><strong>Plateforme unifiée pour des flux de travail d'IA complets :</strong> Les opérations d'IA modernes englobent l'ingestion de données, le nettoyage, l'entraînement, le point de contrôle et l'inférence, chacun ayant des exigences distinctes en matière de performances et de capacité. Le stockage objet compatible S3 prend en charge l'ensemble de ces opérations grâce à un accès API cohérent, éliminant ainsi la complexité et le coût de la gestion de plusieurs niveaux de stockage. Les données d'entraînement, les modèles, les fichiers de points de contrôle et les ensembles de données d'inférence peuvent tous résider dans un seul lac de données hautes performances.</p>
<p><strong>Des métadonnées riches pour les opérations d'IA :</strong> Les opérations critiques de l'IA, telles que la recherche et l'énumération, sont fondamentalement basées sur les métadonnées. Les capacités de métadonnées riches et personnalisables du stockage d'objets permettent d'étiqueter, de rechercher et de gérer efficacement les données, ce qui est essentiel pour organiser et récupérer les données dans les flux de travail complexes de formation et d'inférence de modèles d'IA.</p>
<p><strong>Avantages économiques et opérationnels :</strong> Le stockage objet compatible S3 permet de réduire le coût total de possession de 80 % par rapport aux solutions de stockage de fichiers, en tirant parti d'un matériel standard et d'une mise à l'échelle indépendante de la capacité et des performances. Cette efficacité économique devient cruciale lorsque les ensembles de données d'IA atteignent l'échelle de l'entreprise.</p>
<p><strong>Sécurité et gouvernance d'entreprise :</strong> Contrairement aux implémentations GPUDirect qui nécessitent des modifications au niveau du noyau, RDMA pour le stockage compatible S3 ne nécessite aucune modification du noyau spécifique au fournisseur, ce qui permet de maintenir la sécurité du système et la conformité réglementaire. Cette approche est particulièrement précieuse dans des secteurs comme la santé et la finance où la sécurité des données et la conformité réglementaire sont primordiales.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">La voie à suivre<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>L'annonce par NVIDIA de la disponibilité générale de RDMA pour le stockage compatible S3 représente plus qu'une étape technologique : elle marque la maturation de l'architecture de l'infrastructure de l'IA. En associant l'évolutivité illimitée du stockage objet aux performances exceptionnelles de l'accès direct au GPU, les entreprises peuvent enfin construire des infrastructures d'IA à la hauteur de leurs ambitions.</p>
<p>Alors que les charges de travail d'IA continuent de croître en complexité et en échelle, RDMA pour le stockage compatible S3 fournit la base de stockage qui permet aux organisations de maximiser leurs investissements dans l'IA tout en maintenant la souveraineté des données et la simplicité opérationnelle. Cette technologie transforme le stockage d'un goulot d'étranglement en un facilitateur, permettant aux applications d'IA d'atteindre leur plein potentiel à l'échelle de l'entreprise.</p>
<p>Pour les organisations qui planifient leur feuille de route en matière d'infrastructure d'IA, la disponibilité générale de RDMA pour le stockage compatible S3 marque le début d'une nouvelle ère où les performances de stockage correspondent réellement aux exigences des charges de travail d'IA modernes.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Perspectives du secteur<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>Alors que l'IA devient de plus en plus centrale dans la prestation de soins de santé, nous cherchons continuellement à améliorer les performances et l'efficacité de notre infrastructure. Le nouveau stockage compatible RDMA pour S3 de NVIDIA et Cloudian sera essentiel pour nos applications d'analyse d'imagerie médicale et d'IA diagnostique, où le traitement rapide de grands ensembles de données peut avoir un impact direct sur les soins aux patients, tout en réduisant les coûts de déplacement des données entre les périphériques de stockage basés sur S3-API et les stockages NAS basés sur SSD.  - <em>Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professeur (F) de pathologie, PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre</em></p>
<p>"L'annonce de NVIDIA concernant la compatibilité RDMA pour S3 confirme la valeur de notre stratégie d'infrastructure d'IA basée sur Cloudian. Nous permettons aux entreprises de faire tourner l'IA à haute performance à l'échelle tout en préservant la compatibilité de l'API S3 qui simplifie la migration et réduit les coûts de développement des applications." - <em>Sunil Gupta, cofondateur, directeur général et président-directeur général (PDG), Yotta Data Services</em></p>
<p>"Alors que nous développons nos capacités sur site pour fournir une IA souveraine, la technologie de stockage compatible RDMA for S3 de NVIDIA et le stockage objet haute performance de Cloudian nous apportent les performances dont nous avons besoin sans compromettre la résidence des données et sans nécessiter de modifications au niveau du noyau. La plateforme HyperStore de Cloudian nous permet d'évoluer jusqu'à des exaoctets tout en gardant le contrôle total de nos données sensibles d'intelligence artificielle." - <em>Logan Lee, EVP &amp; Head of Cloud, Kakao</em></p>
<p>"Nous sommes ravis de l'annonce par NVIDIA de la prochaine version de l'AG de stockage compatible RDMA for S3. Nos tests avec Cloudian ont montré une amélioration des performances jusqu'à 8 fois pour les opérations de base de données vectorielles, ce qui permettra à nos utilisateurs Milvus by Zilliz d'obtenir des performances à l'échelle du cloud pour les charges de travail d'IA exigeantes tout en conservant une souveraineté totale sur les données." - <em>Charles Xie, fondateur et PDG de Zilliz</em></p>
