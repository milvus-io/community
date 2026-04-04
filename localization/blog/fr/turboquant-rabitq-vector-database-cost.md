---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Au-delà du débat TurboQuant-RaBitQ : pourquoi la quantification vectorielle
  est importante pour les coûts d'infrastructure de l'IA
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  Le débat TurboQuant-RaBitQ a fait de la quantification vectorielle un sujet
  d'actualité. Comment fonctionne la compression 1 bit RaBitQ et comment Milvus
  propose IVF_RABITQ pour une économie de mémoire de 97%.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>L'article TurboQuant de Google (ICLR 2026) fait état d'une compression 6x du cache KV avec une perte de précision proche de zéro - des résultats suffisamment frappants pour effacer <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> 90 milliards de dollars des stocks de puces mémoire</a> en une seule journée. SK Hynix a chuté de 12 %. Samsung a chuté de 7 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'article a rapidement fait l'objet d'un examen minutieux. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, premier auteur de <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), a <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">soulevé des questions</a> sur la relation entre la méthodologie de TurboQuant et ses travaux antérieurs sur la quantification vectorielle. (Nous publierons bientôt une conversation avec le Dr Gao - suivez-nous si vous êtes intéressé).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cet article n'a pas pour but de prendre parti dans cette discussion. Ce qui nous a frappés, c'est quelque chose de plus grand : le fait qu'un seul article sur <a href="https://milvus.io/docs/index-explained.md">la quantification vectorielle</a> ait pu déplacer 90 milliards de dollars de valeur marchande montre à quel point cette technologie est devenue essentielle pour l'infrastructure de l'IA. Qu'il s'agisse de la compression du cache KV dans les moteurs d'inférence ou de la compression des index dans les <a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a>, la capacité de réduire les données à haute dimension tout en préservant la qualité a d'énormes implications en termes de coûts - et c'est un problème sur lequel nous avons travaillé, en intégrant RaBitQ dans la base de données vectorielle <a href="https://milvus.io/">Milvus</a> et en la transformant en infrastructure de production.</p>
<p>Voici ce que nous allons couvrir : pourquoi la quantification vectorielle est si importante actuellement, comment TurboQuant et RaBitQ se comparent, ce qu'est RaBitQ et comment il fonctionne, le travail d'ingénierie derrière son intégration dans Milvus, et ce à quoi ressemble le paysage plus large de l'optimisation de la mémoire pour l'infrastructure de l'IA.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Pourquoi la quantification vectorielle est-elle importante pour les coûts d'infrastructure ?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>La quantification vectorielle n'est pas une nouveauté. Ce qui est nouveau, c'est l'urgence avec laquelle l'industrie en a besoin. Au cours des deux dernières années, les paramètres LLM ont explosé, les fenêtres contextuelles sont passées de 4K à 128K+ tokens, et les données non structurées - texte, images, audio, vidéo - sont devenues une entrée de premier ordre pour les systèmes d'IA. Chacune de ces tendances crée davantage de vecteurs à haute dimension qui doivent être stockés, indexés et recherchés. Plus de vecteurs, plus de mémoire, plus de coûts.</p>
<p>Si vous utilisez la recherche vectorielle à grande échelle - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>, moteurs de recommandation, récupération multimodale - le coût de la mémoire est probablement l'un de vos plus grands maux de tête en matière d'infrastructure.</p>
<p>Pendant le déploiement du modèle, chaque pile d'inférence LLM majeure s'appuie sur le <a href="https://zilliz.com/glossary/kv-cache">cache KV</a> - stockant les paires clé-valeur précédemment calculées afin que le mécanisme d'attention ne les recalcule pas pour chaque nouveau jeton. C'est ce qui rend possible l'inférence O(n) au lieu de O(n²). Tous les frameworks, de <a href="https://github.com/vllm-project/vllm">vLLM</a> à <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>, en dépendent. Mais le cache KV peut consommer plus de mémoire GPU que les poids du modèle eux-mêmes. Des contextes plus longs, plus d'utilisateurs simultanés, et la spirale s'emballe rapidement.</p>
<p>La même pression s'exerce sur les bases de données vectorielles - des milliards de vecteurs en haute dimension stockés en mémoire, chacun d'eux étant un flottant de 32 bits par dimension. La quantification vectorielle comprime ces vecteurs de 32 bits flottants en représentations de 4 bits, 2 bits ou même 1 bit, ce qui permet de réduire la mémoire de 90 % ou plus. Qu'il s'agisse du cache KV dans votre moteur d'inférence ou des index dans votre base de données vectorielles, les mathématiques sous-jacentes sont les mêmes et les économies sont réelles. C'est pourquoi un seul article faisant état d'une percée dans ce domaine a fait fluctuer la valeur boursière de 90 milliards de dollars.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant et RaBitQ : quelle est la différence ?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>TurboQuant et RaBitQ reposent tous deux sur la même technique de base : l'application d'une rotation aléatoire<a href="https://arxiv.org/abs/2406.03482">(transformation de Johnson-Lindenstrauss</a>) aux vecteurs d'entrée avant la quantification. Cette rotation transforme les données irrégulièrement distribuées en une distribution uniforme prévisible, ce qui facilite la quantification avec un faible taux d'erreur.</p>
<p>Au-delà de cette base commune, les deux logiciels ciblent des problèmes différents et adoptent des approches différentes :</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Cible</strong></td><td>Cache KV dans l'inférence LLM (données éphémères, par demande)</td><td>Index vectoriels persistants dans les bases de données (données stockées)</td></tr>
<tr><td><strong>Approche</strong></td><td>Deux étapes : PolarQuant (quantificateur scalaire Lloyd-Max par coordonnée) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (correction résiduelle à 1 bit)</td><td>En une étape : projection hypercube + estimateur de distance sans biais</td></tr>
<tr><td><strong>Largeur des bits</strong></td><td>clés de 3 bits, valeurs de 2 bits (précision mixte)</td><td>1 bit par dimension (avec des variantes multi-bits disponibles)</td></tr>
<tr><td><strong>Valeur théorique</strong></td><td>Taux de distorsion MSE quasi-optimal</td><td>Erreur d'estimation du produit intérieur asymptotiquement optimale (correspondant aux limites inférieures d'Alon-Klartag)</td></tr>
<tr><td><strong>État de la production</strong></td><td>Implémentations communautaires ; pas de publication officielle de Google</td><td>Livré dans <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, adopté par Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>La principale différence pour les praticiens : TurboQuant optimise le cache KV transitoire à l'intérieur d'un moteur d'inférence, tandis que RaBitQ cible les index persistants qu'une base de données vectorielle construit, partage et interroge à travers des milliards de vecteurs. Pour le reste de cet article, nous nous concentrerons sur RaBitQ - l'algorithme que nous avons intégré et expédié en production dans Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">Qu'est-ce que RaBitQ et que fournit-il ?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici d'abord les résultats : sur un ensemble de données de 10 millions de vecteurs à 768 dimensions, RaBitQ compresse chaque vecteur à 1/32 de sa taille d'origine tout en conservant un rappel supérieur à 94 %. Dans Milvus, cela se traduit par un débit de requête 3,6 fois supérieur à celui d'un index de pleine précision. Il ne s'agit pas d'une projection théorique, mais d'un résultat de référence obtenu avec Milvus 2.6.</p>
<p>Maintenant, comment on y arrive.</p>
<p>La quantification binaire traditionnelle compresse les vecteurs FP32 à 1 bit par dimension, soit une compression de 32x. La contrepartie : le rappel s'effondre parce que l'on a jeté trop d'informations. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) conserve la même compression 32x mais préserve les informations qui comptent réellement pour la recherche. Une <a href="https://arxiv.org/abs/2409.09913">version étendue</a> (Gao &amp; Long, SIGMOD 2025) prouve que cette compression est asymptotiquement optimale, correspondant aux limites inférieures théoriques établies par Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Pourquoi les angles sont-ils plus importants que les coordonnées en haute dimension ?</h3><p>L'idée clé : <strong>en haute dimension, les angles entre les vecteurs sont plus stables et plus informatifs que les valeurs individuelles des coordonnées.</strong> Il s'agit d'une conséquence de la concentration des mesures - le même phénomène qui permet aux projections aléatoires de Johnson-Lindenstrauss de fonctionner.</p>
<p>En pratique, cela signifie qu'il est possible d'écarter les valeurs exactes des coordonnées d'un vecteur à haute dimension et de ne conserver que sa direction par rapport à l'ensemble des données. Les relations angulaires - dont dépend en fait la <a href="https://zilliz.com/glossary/anns">recherche du plus proche voisin</a> - survivent à la compression.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">Comment fonctionne RaBitQ ?</h3><p>RaBitQ transforme cette vision géométrique en trois étapes :</p>
<p><strong>Etape 1 : Normaliser.</strong> Centrer chaque vecteur par rapport au centroïde de l'ensemble de données et le mettre à l'échelle à une longueur unitaire. Cela convertit le problème en une estimation du produit intérieur entre les vecteurs unitaires - plus facile à analyser et à délimiter.</p>
<p><strong>Étape 2 : Rotation aléatoire + projection hypercube.</strong> Appliquer une matrice orthogonale aléatoire (une rotation de type Johnson-Lindenstrauss) pour éliminer le biais vers un axe quelconque. Projetez chaque vecteur tourné sur le sommet le plus proche d'un hypercube {±1/√D}^D. Chaque dimension se réduit à un seul bit. Résultat : un code binaire de D bits par vecteur.</p>
<p><strong>Étape 3 : Estimation impartiale de la distance.</strong> Construire un estimateur pour le produit intérieur entre une requête et le vecteur original (non quantifié). Il est prouvé que l'estimateur est sans biais avec une erreur limitée à O(1/√D). Pour des vecteurs à 768 dimensions, le rappel reste supérieur à 94 %.</p>
<p>Le calcul de la distance entre les vecteurs binaires se réduit à l'opération bitwise AND + popcount - des opérations que les CPU modernes exécutent en un seul cycle. C'est ce qui rend RaBitQ rapide, et pas seulement petit.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Pourquoi RaBitQ est-il pratique, et pas seulement théorique ?</h3><ul>
<li><strong>Aucune formation n'est nécessaire.</strong> Appliquez la rotation, vérifiez les signes. Pas d'optimisation itérative, pas d'apprentissage de codebook. Le temps d'indexation est comparable à la <a href="https://milvus.io/docs/ivf-pq.md">quantification du produit</a>.</li>
<li><strong>Adapté au matériel.</strong> Le calcul de la distance est une opération de type bitwise AND + popcount. Les processeurs modernes (Intel IceLake+, AMD Zen 4+) disposent d'instructions AVX512VPOPCNTDQ dédiées. L'estimation à vecteur unique est trois fois plus rapide que les tables de recherche PQ.</li>
<li><strong>Flexibilité multi-bits.</strong> La <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">bibliothèque RaBitQ</a> prend en charge les variantes au-delà de 1 bit : 4 bits atteignent ~90% de rappel, 5 bits ~95%, 7 bits ~99% - le tout sans reranking.</li>
<li><strong>Composable.</strong> Se branche sur les structures d'index existantes telles que les <a href="https://milvus.io/docs/ivf-flat.md">index IVF</a> et les <a href="https://milvus.io/docs/hnsw.md">graphes HNSW</a>, et fonctionne avec FastScan pour le calcul de distance par lots.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Du papier à la production : Ce que nous avons construit pour expédier RaBitQ dans Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Le code original de RaBitQ est un prototype de recherche sur une seule machine. Pour le faire fonctionner sur un <a href="https://milvus.io/docs/architecture_overview.md">cluster distribué</a> avec partage, basculement et ingestion en temps réel, il a fallu résoudre quatre problèmes d'ingénierie. Chez <a href="https://zilliz.com/">Zilliz</a>, nous sommes allés au-delà de la simple mise en œuvre de l'algorithme - le travail a porté sur l'intégration du moteur, l'accélération matérielle, l'optimisation de l'index et le réglage du temps d'exécution pour transformer RaBitQ en une capacité de niveau industriel au sein de Milvus. Vous trouverez plus de détails dans ce blog : <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Amener la compression vectorielle à l'extrême : Comment Milvus sert 3× plus de requêtes avec RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Rendre RaBitQ prêt pour la distribution</h3><p>Nous avons intégré RaBitQ directement dans <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, le moteur de recherche principal de Milvus - pas comme un plugin, mais comme un type d'index natif avec des interfaces unifiées. Il fonctionne avec l'architecture distribuée complète de Milvus : sharding, partitionnement, mise à l'échelle dynamique et <a href="https://milvus.io/docs/manage-collections.md">gestion des collections</a>.</p>
<p>Le principal défi consiste à rendre le livre de codes de quantification (matrice de rotation, vecteurs centroïdes, paramètres de mise à l'échelle) conscient des segments, de sorte que chaque groupe construise et stocke son propre état de quantification. Les constructions d'index, les compacteurs et l'équilibrage de charge comprennent tous le nouveau type d'index de manière native.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Extraire chaque cycle de Popcount</h3><p>La vitesse de RaBitQ provient de popcount - le comptage des bits dans les vecteurs binaires. L'algorithme est intrinsèquement rapide, mais le débit que vous obtenez dépend de la façon dont vous utilisez le matériel. Nous avons construit des chemins de code SIMD dédiés pour les deux architectures de serveur dominantes :</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+) :</strong> L'instruction VPOPCNTDQ de l'AVX-512 calcule le popcount sur plusieurs registres de 512 bits en parallèle. Les boucles internes de Knowhere sont restructurées pour regrouper les calculs de distance binaire en morceaux de largeur SIMD, afin de maximiser le débit.</li>
<li><strong>ARM (Graviton, Ampère) :</strong> Instructions SVE (Scalable Vector Extension) pour le même modèle de comptage parallèle de popcount - essentiel puisque les instances ARM sont de plus en plus courantes dans les déploiements de cloud optimisés en termes de coûts.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Élimination des frais généraux d'exécution</h3><p>RaBitQ a besoin de paramètres auxiliaires en virgule flottante au moment de la requête : le centroïde de l'ensemble de données, les normes par vecteur et le produit intérieur entre chaque vecteur quantifié et son original (utilisé par l'estimateur de distance). Le calcul de ces paramètres par requête augmente le temps de latence. Le stockage des vecteurs originaux complets va à l'encontre de l'objectif de la compression.</p>
<p>Notre solution : pré-calculer et conserver ces paramètres pendant la construction de l'index, en les mettant en cache avec les codes binaires. La surcharge de mémoire est faible (quelques flottants par vecteur), mais elle élimine le calcul par requête et maintient la latence stable en cas de forte concurrence.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ : l'index que vous déployez réellement</h3><p>À partir de <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, nous livrons <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a> + RaBitQ quantization ( <a href="https://milvus.io/docs/ivf-flat.md">index de fichiers inversé</a> + quantification RaBitQ). La recherche s'effectue en deux étapes :</p>
<ol>
<li><strong>Recherche grossière (IVF).</strong> Les K-moyennes divisent l'espace vectoriel en grappes. Au moment de la requête, seuls les nprobes clusters les plus proches sont analysés.</li>
<li><strong>Recherche fine (RaBitQ).</strong> Au sein de chaque grappe, les distances sont estimées à l'aide de codes à 1 bit et de l'estimateur sans biais. Popcount se charge des tâches les plus lourdes.</li>
</ol>
<p>Les résultats sur un ensemble de données de 768 dimensions et de 10 millions de vecteurs :</p>
<table>
<thead>
<tr><th>Métrique</th><th>IVF_FLAT (base)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refine</th></tr>
</thead>
<tbody>
<tr><td>Rappel</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Empreinte mémoire</td><td>32 bits/dim</td><td>1 bit/dim (~3% de l'original)</td><td>~25% de l'original</td></tr>
</tbody>
</table>
<p>Pour les charges de travail qui ne peuvent tolérer même un écart de rappel de 0,5 %, le paramètre refine_type ajoute une deuxième passe de notation : SQ6, SQ8, FP16, BF16 ou FP32. SQ8 est le choix le plus courant - il rétablit le rappel aux niveaux IVF_FLAT à environ 1/4 de la mémoire d'origine. Vous pouvez également appliquer la <a href="https://milvus.io/docs/ivf-sq8.md">quantification scalaire</a> au côté requête (SQ1-SQ8) indépendamment, ce qui vous donne deux boutons pour régler le compromis latence-rappel-coût par charge de travail.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Comment Milvus optimise la mémoire au-delà de la quantification<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ est le levier de compression le plus spectaculaire, mais il s'agit d'une couche dans une pile d'<a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">optimisation de la mémoire</a> plus large :</p>
<table>
<thead>
<tr><th>Stratégie</th><th>Ce qu'il fait</th><th>Impact</th></tr>
</thead>
<tbody>
<tr><td><strong>Quantification de la pile complète</strong></td><td>SQ8, PQ, RaBitQ à différents compromis précision/coût</td><td>Réduction de la mémoire de 4x à 32x</td></tr>
<tr><td><strong>Optimisation de la structure de l'index</strong></td><td>Compaction des graphes HNSW, déchargement SSD DiskANN, constructions d'index OOM-safe</td><td>Moins de DRAM par index, plus grands ensembles de données par nœud</td></tr>
<tr><td><strong>E/S en mémoire (mmap)</strong></td><td>Mappage des fichiers vectoriels sur le disque, chargement des pages à la demande via le cache de pages du système d'exploitation</td><td>Ensembles de données à l'échelle du téraoctet sans tout charger dans la RAM</td></tr>
<tr><td><strong>Stockage hiérarchisé</strong></td><td>Séparation des données chaudes/chaudes/froides avec planification automatique</td><td>Ne payer le prix de la mémoire que pour les données fréquemment consultées</td></tr>
<tr><td><strong>Mise à l'échelle native dans le nuage</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, Milvus géré)</td><td>Allocation élastique de la mémoire, libération automatique des ressources inutilisées</td><td>Ne payez que ce que vous utilisez</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Quantification complète</h3><p>La compression extrême à 1 bit de RaBitQ n'est pas adaptée à toutes les charges de travail. Milvus propose une matrice de quantification complète : <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> et <a href="https://milvus.io/docs/ivf-pq.md">quantification par produit (PQ)</a> pour les charges de travail qui nécessitent un compromis précision-coût équilibré, RaBitQ pour une compression maximale sur des ensembles de données ultra-larges et des configurations hybrides qui combinent plusieurs méthodes pour un contrôle précis.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Optimisation de la structure de l'index</h3><p>Au-delà de la quantification, Milvus optimise en permanence la charge de mémoire dans ses structures d'index principales. Pour <a href="https://milvus.io/docs/hnsw.md">HNSW</a>, nous avons réduit la redondance des listes d'adjacence afin de diminuer l'utilisation de la mémoire par graphe. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> pousse les données vectorielles et les structures d'index vers le SSD, ce qui réduit considérablement la dépendance à la DRAM pour les grands ensembles de données. Nous avons également optimisé l'allocation de la mémoire intermédiaire pendant la construction de l'index afin d'éviter les défaillances OOM lors de la construction d'index sur des ensembles de données qui approchent les limites de la mémoire des nœuds.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Chargement intelligent de la mémoire</h3><p>La prise en charge <a href="https://milvus.io/docs/mmap.md">mmap</a> (E/S mappées en mémoire) de Milvus mappe les données vectorielles sur des fichiers disque, en s'appuyant sur le cache de pages du système d'exploitation pour le chargement à la demande - il n'est pas nécessaire de charger toutes les données dans la mémoire au démarrage. Associé à des stratégies de chargement paresseux et segmenté qui évitent les pics de mémoire soudains, cela permet un fonctionnement fluide avec des ensembles de données vectorielles à l'échelle du To, pour une fraction du coût de la mémoire.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Stockage hiérarchisé</h3><p>L'<a href="https://milvus.io/docs/tiered-storage-overview.md">architecture de stockage à trois niveaux</a> de Milvus couvre la mémoire, le disque SSD et le stockage d'objets : les données chaudes restent en mémoire pour une faible latence, les données tièdes sont mises en cache sur le disque SSD pour un équilibre entre les performances et le coût, et les données froides descendent vers le stockage d'objets pour minimiser les frais généraux. Le système gère automatiquement l'ordonnancement des données, sans qu'il soit nécessaire de modifier la couche applicative.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Évolution native dans le nuage</h3><p>Dans le cadre de l'<a href="https://milvus.io/docs/architecture_overview.md">architecture distribuée</a> de Milvus, le partage des données et l'équilibrage de la charge empêchent la surcharge de la mémoire d'un seul nœud. La mise en commun de la mémoire réduit la fragmentation et améliore l'utilisation. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (entièrement géré par Milvus) va encore plus loin avec une planification élastique pour une mise à l'échelle de la mémoire à la demande - en mode Serverless, les ressources inutilisées sont automatiquement libérées, ce qui réduit encore le coût total de possession.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Comment ces couches se complètent</h3><p>Ces optimisations ne sont pas des alternatives - elles s'empilent. RaBitQ réduit les vecteurs. DiskANN conserve l'index sur le disque SSD. Mmap évite de charger des données froides en mémoire. Le <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">stockage hiérarchisé</a> pousse les données d'archivage vers le stockage objet. Résultat : un déploiement servant des milliards de vecteurs n'a pas besoin de milliards de vecteurs de RAM.</p>
<h2 id="Get-Started" class="common-anchor-header">Démarrer<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Alors que les volumes de données d'IA continuent d'augmenter, l'efficacité et le coût des bases de données vectorielles détermineront directement l'étendue de l'évolutivité des applications d'IA. Nous continuerons à investir dans une infrastructure vectorielle performante et peu coûteuse, afin que davantage d'applications d'IA puissent passer du stade du prototype à celui de la production.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> est un logiciel libre. Pour essayer IVF_RABITQ :</p>
<ul>
<li>Consultez la <a href="https://milvus.io/docs/ivf-rabitq.md">documentation IVF_RABITQ</a> pour obtenir des conseils de configuration et de réglage.</li>
<li>Lisez l'<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">article de blog sur l'intégration</a> complète <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">de RaBitQ</a> pour obtenir des références plus approfondies et des détails sur la mise en œuvre.</li>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> pour poser des questions et apprendre des autres développeurs.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite Milvus Office Hours</a> pour étudier votre cas d'utilisation.</li>
</ul>
<p>Si vous préférez sauter l'étape de l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus entièrement géré) propose un niveau gratuit avec le support IVF_RABITQ.</p>
<p>Nous organiserons prochainement une interview avec le professeur <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) et le <a href="https://gaoj0017.github.io/">Dr. Jianyang Gao</a> (ETH Zurich), premier auteur de RaBitQ, dans laquelle nous approfondirons la théorie de la quantification vectorielle et les prochaines étapes. Posez vos questions dans les commentaires.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Questions fréquemment posées<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">Que sont TurboQuant et RaBitQ ?</h3><p>TurboQuant (Google, ICLR 2026) et RaBitQ (Gao &amp; Long, SIGMOD 2024) sont deux méthodes de quantification vectorielle qui utilisent la rotation aléatoire pour compresser des vecteurs de haute dimension. TurboQuant vise la compression du cache KV dans l'inférence LLM, tandis que RaBitQ vise les index vectoriels persistants dans les bases de données. Ces deux méthodes ont contribué à la vague actuelle d'intérêt pour la quantification vectorielle, bien qu'elles résolvent des problèmes différents pour des systèmes différents.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">Comment RaBitQ parvient-il à une quantification sur 1 bit sans détruire le rappel ?</h3><p>RaBitQ exploite la concentration des mesures dans les espaces à haute dimension : les angles entre les vecteurs sont plus stables que les valeurs des coordonnées individuelles à mesure que la dimensionnalité augmente. Il normalise les vecteurs par rapport au centroïde de l'ensemble de données, puis projette chacun d'eux sur le sommet le plus proche d'un hypercube (réduisant chaque dimension à un seul bit). Un estimateur de distance sans biais avec une limite d'erreur prouvable maintient la précision de la recherche malgré la compression.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">Qu'est-ce que IVF_RABITQ et quand dois-je l'utiliser ?</h3><p>IVF_RABITQ est un type d'index vectoriel dans Milvus (disponible depuis la version 2.6) qui combine le regroupement de fichiers inversé avec la quantification à 1 bit de RaBitQ. Il atteint 94,7% de rappel à 3,6 fois le débit de IVF_FLAT, avec une utilisation de la mémoire d'environ 1/32 des vecteurs originaux. Utilisez-le lorsque vous devez effectuer des recherches vectorielles à grande échelle (des millions ou des milliards de vecteurs) et que le coût de la mémoire est une préoccupation majeure - ce qui est courant dans les charges de travail de RAG, de recommandation et de recherche multimodale.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">Quel est le rapport entre la quantification vectorielle et la compression du cache KV dans les LLM ?</h3><p>Les deux problèmes impliquent la compression de vecteurs à virgule flottante de haute dimension. Le cache KV stocke les paires clé-valeur du mécanisme d'attention Transformer ; à des longueurs de contexte importantes, il peut dépasser les poids du modèle en termes d'utilisation de la mémoire. Les techniques de quantification vectorielle telles que RaBitQ réduisent ces vecteurs à des représentations de bits inférieurs. Les mêmes principes mathématiques - concentration des mesures, rotation aléatoire, estimation impartiale de la distance - s'appliquent que vous compressiez des vecteurs dans un index de base de données ou dans le cache KV d'un moteur d'inférence.</p>
