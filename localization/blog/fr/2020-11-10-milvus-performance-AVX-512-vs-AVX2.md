---
id: milvus-performance-AVX-512-vs-AVX2.md
title: Que sont les extensions vectorielles avancées ?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Découvrez les performances de Milvus sur AVX-512 par rapport à AVX2 en
  utilisant différents index vectoriels.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Performances de Milvus sur AVX-512 vs. AVX2</custom-h1><p>Les machines intelligentes et conscientes qui veulent conquérir le monde font partie intégrante de la science-fiction, mais en réalité, les ordinateurs modernes sont très obéissants. Sans qu'on le leur demande, ils savent rarement ce qu'ils doivent faire. Les ordinateurs exécutent des tâches sur la base d'instructions, ou d'ordres, envoyés par un programme à un processeur. Au niveau le plus bas, chaque instruction est une séquence de uns et de zéros qui décrit une opération à exécuter par l'ordinateur. En règle générale, dans les langages d'assemblage informatiques, chaque instruction du langage machine correspond à une instruction du processeur. L'unité centrale de traitement (UC) s'appuie sur des instructions pour effectuer des calculs et contrôler les systèmes. En outre, les performances de l'unité centrale de traitement sont souvent mesurées en termes de capacité d'exécution des instructions (par exemple, le temps d'exécution).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">Que sont les extensions vectorielles avancées ?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>Advanced Vector Extensions (AVX) est un jeu d'instructions pour les microprocesseurs qui reposent sur la famille x86 d'architectures de jeux d'instructions. Proposé pour la première fois par Intel en mars 2008, AVX a bénéficié d'un large soutien trois ans plus tard avec le lancement de Sandy Bridge - une microarchitecture utilisée dans la deuxième génération de processeurs Intel Core (par exemple, Core i7, i5, i3) - et de la microarchitecture concurrente d'AMD, Bulldozer, également lancée en 2011.</p>
<p>AVX a introduit un nouveau schéma de codage, de nouvelles fonctionnalités et de nouvelles instructions. AVX2 étend la plupart des opérations sur les nombres entiers à 256 bits et introduit des opérations de multiplication-accumulation fusionnées (FMA). AVX-512 étend AVX aux opérations sur 512 bits en utilisant un nouveau préfixe d'extension vectorielle améliorée (EVEX).</p>
<p><a href="https://milvus.io/docs">Milvus</a> est une base de données vectorielles open-source conçue pour la recherche de similarités et les applications d'intelligence artificielle (IA). La plateforme prend en charge le jeu d'instructions AVX-512, ce qui signifie qu'elle peut être utilisée avec tous les processeurs qui incluent les instructions AVX-512. Milvus a de vastes applications couvrant les systèmes de recommandation, la vision par ordinateur, le traitement du langage naturel (NLP) et bien plus encore. Cet article présente les résultats et l'analyse des performances d'une base de données vectorielles Milvus sur AVX-512 et AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Performances de Milvus sur AVX-512 vs. AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">Configuration du système</h3><ul>
<li>CPU : Intel® Platinum 8163 CPU @ 2.50GHz24 cœurs 48 threads</li>
<li>Nombre de CPU : 2</li>
<li>Carte graphique : GeForce RTX 2080Ti 11GB 4 cartes</li>
<li>Mémoire : 768 Go</li>
<li>Disque : 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Paramètres Milvus</h3><ul>
<li>cahce.cahe_size : 25, La taille de la mémoire du CPU utilisée pour la mise en cache des données afin d'accélérer les requêtes.</li>
<li>nlist : 4096</li>
<li>nprobe : 128</li>
</ul>
<p>Remarque : <code translate="no">nlist</code> est le paramètre d'indexation à créer à partir du client ; <code translate="no">nprobe</code> est le paramètre de recherche. IVF_FLAT et IVF_SQ8 utilisent tous deux un algorithme de clustering pour partitionner un grand nombre de vecteurs en buckets, <code translate="no">nlist</code> étant le nombre total de buckets à partitionner pendant le clustering. La première étape d'une requête consiste à trouver le nombre de godets qui sont les plus proches du vecteur cible, et la deuxième étape consiste à trouver les top-k vecteurs dans ces godets en comparant la distance des vecteurs. <code translate="no">nprobe</code> fait référence au nombre de godets dans la première étape.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Ensemble de données : Ensemble de données SIFT10M</h3><p>Ces tests utilisent l'<a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">ensemble de données SIFT10M</a>, qui contient un million de vecteurs à 128 dimensions et qui est souvent utilisé pour analyser les performances des méthodes de recherche du plus proche voisin correspondantes. Le temps de recherche top-1 pour nq = [1, 10, 100, 500, 1000] sera comparé entre les deux jeux d'instructions.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Résultats par type d'index vectoriel</h3><p>Les<a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">index vectoriels</a> sont des structures de données peu gourmandes en temps et en espace, construites sur le champ vectoriel d'une collection à l'aide de divers modèles mathématiques. L'indexation vectorielle permet de rechercher efficacement de grands ensembles de données en essayant d'identifier des vecteurs similaires à un vecteur d'entrée. En raison du temps nécessaire à une recherche précise, la plupart des types d'index <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">pris en charge par Milvus</a> utilisent la recherche approximative du plus proche voisin (ANN).</p>
<p>Pour ces tests, trois index ont été utilisés avec AVX-512 et AVX2 : IVF_FLAT, IVF_SQ8 et HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>Le fichier inversé (IVF_FLAT) est un type d'index basé sur la quantification. Il s'agit de l'index IVF le plus basique, et les données codées stockées dans chaque unité sont cohérentes avec les données d'origine. L'index divise les données vectorielles en un certain nombre d'unités de grappes (nlist), puis compare les distances entre le vecteur d'entrée cible et le centre de chaque grappe. En fonction du nombre de grappes que le système doit interroger (nprobe), les résultats de la recherche de similarité sont renvoyés sur la base des comparaisons entre l'entrée cible et les vecteurs dans la ou les grappes les plus similaires uniquement, ce qui réduit considérablement le temps de recherche. En ajustant nprobe, un équilibre idéal entre la précision et la vitesse peut être trouvé pour un scénario donné.</p>
<p><strong>Résultats des performances</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT n'effectue aucune compression, de sorte que les fichiers d'index qu'il produit sont à peu près de la même taille que les données vectorielles brutes non indexées d'origine. Lorsque les ressources mémoire du disque, du CPU ou du GPU sont limitées, IVF_SQ8 est une meilleure option que IVF_FLAT. Ce type d'index peut convertir chaque dimension du vecteur original d'un nombre à virgule flottante de quatre octets en un entier non signé d'un octet en effectuant une quantification scalaire. Cela permet de réduire la consommation de mémoire du disque, du CPU et du GPU de 70 à 75 %.</p>
<p><strong>Résultats des performances</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) est un algorithme d'indexation basé sur un graphe. Les requêtes commencent dans la couche supérieure par la recherche du nœud le plus proche de la cible, puis descendent dans la couche suivante pour un nouveau cycle de recherche. Après plusieurs itérations, il peut rapidement s'approcher de la position cible.</p>
<p><strong>Résultats des performances</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Comparaison des index vectoriels<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche de vecteurs est toujours plus rapide avec le jeu d'instructions AVX-512 qu'avec AVX2. Cela s'explique par le fait que l'AVX-512 prend en charge le calcul sur 512 bits, contre 256 bits seulement pour l'AVX2. Théoriquement, l'AVX-512 devrait être deux fois plus rapide que l'AVX2, mais Milvus effectue d'autres tâches fastidieuses en plus des calculs de similarité vectorielle. Il est peu probable que le temps de recherche global de l'AVX-512 soit deux fois plus court que celui de l'AVX2 dans des scénarios réels. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>La recherche est nettement plus rapide sur l'index HNSW que sur les deux autres index, tandis que la recherche IVF_SQ8 est légèrement plus rapide que IVF_FLAT sur les deux jeux d'instructions. Ceci est probablement dû au fait que IVF_SQ8 ne nécessite que 25 % de la mémoire nécessaire à IVF_FLAT. IVF_SQ8 charge 1 octet pour chaque dimension vectorielle, tandis que IVF_FLAT charge 4 octets par dimension vectorielle. Le temps nécessaire au calcul est très probablement limité par la bande passante de la mémoire. Par conséquent, IVF_SQ8 n'occupe pas seulement moins d'espace, mais nécessite également moins de temps pour récupérer les vecteurs.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus est une base de données vectorielles polyvalente et performante<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Les tests présentés dans cet article démontrent que Milvus offre d'excellentes performances sur les jeux d'instructions AVX-512 et AVX2 en utilisant différents index. Quel que soit le type d'index, Milvus est plus performant sur AVX-512.</p>
<p>Milvus est compatible avec une variété de plateformes d'apprentissage profond et est utilisé dans diverses applications d'IA. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, une version réimaginée de la base de données vectorielles la plus populaire au monde, a été publiée sous une licence open-source en juillet 2021. Pour plus d'informations sur le projet, consultez les ressources suivantes :</p>
<ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
