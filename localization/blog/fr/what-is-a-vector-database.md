---
id: what-is-vector-database-and-how-it-works.md
title: >-
  Il semble que vous ayez fourni uniquement le titre de l'article, sans le
  contenu HTML complet à traduire. Veuillez coller l'intégralité du texte HTML
  de l'article afin que je puisse effectuer la traduction en français tout en
  préservant la structure HTML.
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Une base de données vectorielle stocke, indexe et recherche des plongements
  vectoriels générés par des modèles d'apprentissage automatique pour une
  récupération rapide d'informations et une recherche de similarité.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>Une base de données vectorielle indexe et stocke des plongements vectoriels pour une récupération rapide et une recherche de similarité, avec des capacités telles que les opérations CRUD, le filtrage par métadonnées et la mise à l'échelle horizontale, conçues spécifiquement pour les applications d'IA.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introduction : L'essor des bases de données vectorielles à l'ère de l'IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Aux débuts d'ImageNet, il a fallu 25 000 conservateurs humains pour étiqueter manuellement l'ensemble de données. Ce nombre stupéfiant met en évidence un défi fondamental de l'IA : la catégorisation manuelle de données non structurées ne passe tout simplement pas à l'échelle. Avec des milliards d'images, de vidéos, de documents et de fichiers audio générés chaque jour, un changement de paradigme était nécessaire dans la façon dont les ordinateurs comprennent et interagissent avec le contenu.</p>
<p>Les <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">systèmes de bases de données relationnelles</a> traditionnels excellent dans la gestion de données structurées avec des formats prédéfinis et l'exécution d'opérations de recherche précises. En revanche, les bases de données vectorielles sont spécialisées dans le stockage et la récupération de types de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a>, tels que les images, l'audio, les vidéos et les contenus textuels, grâce à des représentations numériques haute dimension appelées plongements vectoriels. Les bases de données vectorielles prennent en charge les <a href="https://zilliz.com/glossary/large-language-models-(llms)">grands modèles de langage</a> en offrant une récupération et une gestion efficaces des données. Les bases de données vectorielles modernes surpassent les systèmes traditionnels de 2 à 10 fois grâce à une optimisation consciente du matériel (AVX512, SIMD, GPU, SSD NVMe), des algorithmes de recherche hautement optimisés (HNSW, IVF, DiskANN) et une conception de stockage orientée colonnes. Leur architecture cloud-native et découplée permet une mise à l'échelle indépendante des composants de recherche, d'insertion de données et d'indexation, permettant aux systèmes de gérer efficacement des milliards de vecteurs tout en maintenant les performances des applications d'IA d'entreprise chez des sociétés comme Salesforce, PayPal, eBay et NVIDIA.</p>
<p>C'est ce que les experts appellent un « fossé sémantique » — les bases de données traditionnelles fonctionnent sur des correspondances exactes et des relations prédéfinies, tandis que la compréhension humaine du contenu est nuancée, contextuelle et multidimensionnelle. Ce fossé devient de plus en plus problématique à mesure que les applications d'IA exigent :</p>
<ul>
<li><p>Trouver des similarités conceptuelles plutôt que des correspondances exactes</p></li>
<li><p>Comprendre les relations contextuelles entre différents contenus</p></li>
<li><p>Capturer l'essence sémantique de l'information au-delà des mots-clés</p></li>
<li><p>Traiter des données multimodales dans un cadre unifié</p></li>
</ul>
<p>Les bases de données vectorielles sont devenues la technologie critique pour combler ce fossé, devenant un composant essentiel de l'infrastructure d'IA moderne. Elles améliorent les performances des modèles d'apprentissage automatique en facilitant des tâches comme le clustering et la classification.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Comprendre les plongements vectoriels : les fondations<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Les <a href="https://zilliz.com/glossary/vector-embeddings">plongements vectoriels</a> servent de pont essentiel entre les deux côtés du fossé sémantique. Ces représentations numériques haute dimension capturent l'essence sémantique des données non structurées sous une forme que les ordinateurs peuvent traiter efficacement. Les modèles d'embedding modernes transforment le contenu brut — qu'il s'agisse de texte, d'images ou d'audio — en vecteurs denses où les concepts similaires se regroupent dans l'espace vectoriel, indépendamment des différences de surface.</p>
<p>Par exemple, des plongements correctement construits positionneraient des concepts comme « automobile », « voiture » et « véhicule » à proximité dans l'espace vectoriel, malgré leurs formes lexicales différentes. Cette propriété permet à la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a>, aux <a href="https://zilliz.com/vector-database-use-cases/recommender-system">systèmes de recommandation</a> et aux applications d'IA de comprendre le contenu au-delà de la simple correspondance de motifs.</p>
<p>La puissance des plongements s'étend à travers les modalités. Les bases de données vectorielles avancées prennent en charge divers types de données non structurées — texte, images, audio — dans un système unifié, permettant des recherches et des relations intermodales qu'il était auparavant impossible de modéliser efficacement. Ces capacités des bases de données vectorielles sont cruciales pour les technologies pilotées par l'IA telles que les chatbots et les systèmes de reconnaissance d'images, prenant en charge des applications avancées comme la recherche sémantique et les systèmes de recommandation.</p>
<p>Cependant, le stockage, l'indexation et la récupération de plongements à grande échelle présentent des défis informatiques uniques que les bases de données traditionnelles n'ont pas été conçues pour relever.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bases de données vectorielles : concepts fondamentaux<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles représentent un changement de paradigme dans la façon dont nous stockons et interrogeons les données non structurées. Contrairement aux systèmes de bases de données relationnelles traditionnels qui excellent dans la gestion de données structurées avec des formats prédéfinis, les bases de données vectorielles sont spécialisées dans le traitement des données non structurées grâce à des représentations vectorielles numériques.</p>
<p>À la base, les bases de données vectorielles sont conçues pour résoudre un problème fondamental : permettre des recherches de similarité efficaces sur des ensembles massifs de données non structurées. Elles y parviennent grâce à trois composants clés :</p>
<p><strong>Plongements vectoriels</strong> : des représentations numériques haute dimension qui capturent la signification sémantique des données non structurées (texte, images, audio, etc.)</p>
<p><strong>Indexation spécialisée</strong> : des algorithmes optimisés pour les espaces vectoriels haute dimension qui permettent des recherches approximatives rapides. La base de données vectorielle indexe les vecteurs pour améliorer la vitesse et l'efficacité des recherches de similarité, en utilisant divers algorithmes de ML pour créer des index sur les plongements vectoriels.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Métriques de distance</strong></a> : des fonctions mathématiques qui quantifient la similarité entre les vecteurs</p>
<p>L'opération principale dans une base de données vectorielle est la requête des <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k plus proches voisins</a> (KNN), qui trouve les k vecteurs les plus similaires à un vecteur de requête donné. Pour les applications à grande échelle, ces bases de données implémentent généralement des algorithmes de <a href="https://zilliz.com/glossary/anns">plus proche voisin approximatif</a> (ANN), échangeant une petite quantité de précision contre des gains significatifs en vitesse de recherche.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fondements mathématiques de la similarité vectorielle</h3><p>Comprendre les bases de données vectorielles nécessite de saisir les principes mathématiques qui sous-tendent la similarité vectorielle. Voici les concepts fondamentaux :</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espaces vectoriels et plongements</h3><p>Un <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">plongement vectoriel</a> est un tableau de nombres à virgule flottante de longueur fixe (leur dimension peut aller de 100 à 32 768 !) qui représente des données non structurées dans un format numérique. Ces plongements positionnent les éléments similaires plus près les uns des autres dans un espace vectoriel haute dimension.</p>
<p>Par exemple, les mots « roi » et « reine » auraient des représentations vectorielles plus proches l'une de l'autre que chacune ne l'est de « automobile » dans un espace de plongements de mots bien entraîné.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métriques de distance</h3><p>Le choix de la métrique de distance affecte fondamentalement la façon dont la similarité est calculée. Les métriques de distance courantes incluent :</p>
<ol>
<li><p><strong>Distance euclidienne</strong> : la distance en ligne droite entre deux points dans l'espace euclidien.</p></li>
<li><p><strong>Similarité cosinus</strong> : mesure le cosinus de l'angle entre deux vecteurs, en se concentrant sur l'orientation plutôt que sur la magnitude.</p></li>
<li><p><strong>Produit scalaire</strong> : pour des vecteurs normalisés, représente à quel point deux vecteurs sont alignés.</p></li>
<li><p><strong>Distance de Manhattan (norme L1)</strong> : somme des différences absolues entre les coordonnées.</p></li>
</ol>
<p>Différents cas d'usage peuvent nécessiter différentes métriques de distance. Par exemple, la similarité cosinus fonctionne souvent bien pour les plongements textuels, tandis que la distance euclidienne peut être mieux adaptée à certains types de <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">plongements d'images</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Similarité sémantique</a> entre vecteurs dans un espace vectoriel</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Similarité sémantique entre vecteurs dans un espace vectoriel" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>Similarité sémantique entre vecteurs dans un espace vectoriel</span>
  </span>
</p>
<p>Comprendre ces fondements mathématiques mène à une question importante concernant l'implémentation : Alors, il suff
