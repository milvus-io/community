---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  La compression vectorielle à l'extrême : comment Milvus répond à 3 fois plus
  de requêtes avec RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Découvrez comment Milvus exploite RaBitQ pour améliorer l'efficacité de la
  recherche vectorielle, en réduisant les coûts de mémoire tout en maintenant la
  précision. Apprenez à optimiser vos solutions d'IA dès aujourd'hui !
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> est une base de données vectorielles open-source et hautement évolutive qui alimente la recherche sémantique à l'échelle d'un milliard de vecteurs. Alors que les utilisateurs déploient des chatbots RAG, un service client IA et une recherche visuelle à cette échelle, un défi commun émerge : les <strong>coûts d'infrastructure.</strong> En revanche, la croissance exponentielle d'une entreprise est passionnante, ce qui n'est pas le cas des factures de cloud qui montent en flèche. La recherche vectorielle rapide nécessite généralement le stockage des vecteurs en mémoire, ce qui est coûteux. Naturellement, on peut se poser la question suivante : <em>peut-on compresser les vecteurs pour gagner de l'espace sans sacrifier la qualité de la recherche ?</em></p>
<p>La réponse est <strong>OUI</strong>, et dans ce blog, nous vous montrerons comment la mise en œuvre d'une nouvelle technique appelée <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> permet à Milvus de servir 3× plus de trafic avec un coût de mémoire inférieur tout en maintenant une précision comparable. Nous partagerons également les leçons pratiques tirées de l'intégration de RaBitQ dans Milvus open-source et dans le service Milvus entièrement géré sur <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Comprendre la recherche vectorielle et la compression<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans RaBitQ, il faut comprendre le défi.</p>
<p>Les algorithmes de recherche des<a href="https://zilliz.com/glossary/anns"><strong>plus proches voisins (ANN)</strong></a> sont au cœur d'une base de données vectorielle, car ils trouvent les k vecteurs les plus proches d'une requête donnée. Un vecteur est une coordonnée dans un espace à haute dimension, comprenant souvent des centaines de nombres à virgule flottante. L'augmentation de la taille des données vectorielles s'accompagne d'une augmentation des besoins en matière de stockage et de calcul. Par exemple, l'exécution de <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (un algorithme de recherche ANN) avec un milliard de vecteurs à 768 dimensions en FP32 nécessite plus de 3 To de mémoire !</p>
<p>Tout comme le MP3 compresse les données audio en éliminant les fréquences imperceptibles à l'oreille humaine, les données vectorielles peuvent être comprimées avec un impact minimal sur la précision de la recherche. La recherche montre que la FP32 de pleine précision est souvent inutile pour les ANN. La<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> quantification scalaire</a> (SQ), une technique de compression très répandue, permet de mapper des valeurs à virgule flottante en cases discrètes et de ne stocker que les indices des cases en utilisant des entiers de faible poids. Les méthodes de quantification réduisent considérablement l'utilisation de la mémoire en représentant la même information avec moins de bits. La recherche dans ce domaine s'efforce de réaliser le plus d'économies possible avec le moins de perte de précision possible.</p>
<p>La technique de compression la plus extrême - la quantification scalaire à 1 bit, également connue sous le nom de <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">quantification binaire - représente</a>chaque flottant avec un seul bit. Par rapport à FP32 (codage 32 bits), cette technique réduit l'utilisation de la mémoire de 32 fois. La mémoire étant souvent le principal goulot d'étranglement dans la recherche vectorielle, une telle compression peut considérablement améliorer les performances. <strong>Le défi consiste toutefois à préserver la précision de la recherche.</strong> Généralement, la SQ 1 bit réduit le rappel à moins de 70 %, ce qui la rend pratiquement inutilisable.</p>
<p>C'est là que <strong>RaBitQ</strong> se distingue - une excellente technique de compression qui permet d'obtenir une quantification sur 1 bit tout en préservant un rappel élevé. Milvus prend désormais en charge RaBitQ à partir de la version 2.6, ce qui permet à la base de données vectorielles de servir 3 fois plus de QPS tout en conservant un niveau de précision comparable.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Brève présentation de RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> est une méthode de quantification binaire intelligemment conçue qui exploite la propriété géométrique de l'espace à haute dimension pour réaliser une compression vectorielle efficace et précise.</p>
<p>À première vue, réduire chaque dimension d'un vecteur à un seul bit peut sembler trop agressif, mais dans un espace à haute dimension, nos intuitions nous font souvent défaut. Comme l'<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> a illustré</a> Jianyang Gao, auteur de RaBitQ, les vecteurs à haute dimension présentent la propriété que les coordonnées individuelles tendent à être étroitement concentrées autour de zéro, résultat d'un phénomène contre-intuitif expliqué dans<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentration de la mesure.</a> Cela permet d'éliminer une grande partie de la précision d'origine tout en préservant la structure relative nécessaire à une recherche précise du plus proche voisin.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Distribution contre-intuitive des valeurs dans la géométrie à haute dimension. <em>Considérons la valeur de la première dimension pour un vecteur unitaire aléatoire uniformément échantillonné à partir de la sphère unitaire ; les valeurs sont uniformément réparties dans l'espace 3D. Cependant, dans un espace à haute dimension (par exemple, 1000D), les valeurs se concentrent autour de zéro, une propriété non intuitive de la géométrie à haute dimension. (Source de l'image : <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantization in The Counterintuitive High-Dimensional Space (Quantification dans l'espace à haute dimension contre-intuitif</a>))</em></p>
<p>Inspiré par cette propriété de l'espace à haute dimension, <strong>RaBitQ se concentre sur l'encodage des informations angulaires plutôt que sur les coordonnées spatiales exactes</strong>. Pour ce faire, il normalise chaque vecteur de données par rapport à un point de référence tel que le centroïde de l'ensemble de données. Chaque vecteur est ensuite mis en correspondance avec le sommet le plus proche de l'hypercube, ce qui permet une représentation avec seulement 1 bit par dimension. Cette approche s'étend naturellement à <code translate="no">IVF_RABITQ</code>, où la normalisation est effectuée par rapport au centroïde du groupe le plus proche, ce qui améliore la précision de l'encodage local.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Compression d'un vecteur en trouvant son approximation la plus proche sur l'hypercube, de sorte que chaque dimension peut être représentée avec seulement 1 bit. (Source de l'image :</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional Space</em></a><em>)</em></p>
<p>Pour s'assurer que la recherche reste fiable même avec de telles représentations comprimées, RaBitQ introduit un <strong>estimateur sans biais, théoriquement fondé,</strong> pour la distance entre un vecteur de requête et des vecteurs de documents quantifiés de manière binaire. Cela permet de minimiser l'erreur de reconstruction et de maintenir un rappel élevé.</p>
<p>RaBitQ est également très compatible avec d'autres techniques d'optimisation, telles que<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> et le<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> prétraitement par rotation aléatoire</a>. De plus, RaBitQ est <strong>léger à former et rapide à exécuter</strong>. L'apprentissage consiste simplement à déterminer le signe de chaque composant du vecteur, et la recherche est accélérée par des opérations bitwise rapides prises en charge par les processeurs modernes. Ensemble, ces optimisations permettent à RaBitQ d'offrir une recherche à grande vitesse avec une perte minimale de précision.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Ingénierie de RaBitQ dans Milvus : de la recherche universitaire à la production<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien que RaBitQ soit conceptuellement simple et accompagné d'une<a href="https://github.com/gaoj0017/RaBitQ"> implémentation de référence</a>, son adaptation dans une base de données vectorielle distribuée de niveau production comme Milvus a présenté plusieurs défis d'ingénierie. Nous avons implémenté RaBitQ dans Knowhere, le moteur de recherche vectorielle de base de Milvus, et avons également contribué à une version optimisée de la bibliothèque de recherche ANN open-source<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Voyons comment nous avons donné vie à cet algorithme dans Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Compromis de mise en œuvre</h3><p>Une décision importante en matière de conception concernait la gestion des données auxiliaires par vecteur. RaBitQ nécessite deux valeurs en virgule flottante par vecteur précalculées pendant l'indexation, et une troisième valeur qui peut être calculée à la volée ou précalculée. Dans Knowhere, nous avons précalculé cette valeur au moment de l'indexation et l'avons stockée pour améliorer l'efficacité de la recherche. En revanche, l'implémentation de FAISS conserve la mémoire en la calculant au moment de la requête, ce qui permet d'obtenir un compromis différent entre l'utilisation de la mémoire et la vitesse de la requête.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Accélération matérielle</h3><p>Les unités centrales modernes offrent des instructions spécialisées qui peuvent accélérer de manière significative les opérations binaires. Nous avons adapté le noyau de calcul de la distance pour tirer parti des instructions modernes de l'unité centrale. Étant donné que RaBitQ s'appuie sur des opérations popcount, nous avons créé un chemin spécialisé dans Knowhere qui utilise les instructions <code translate="no">VPOPCNTDQ</code> pour AVX512 lorsqu'elles sont disponibles. Sur le matériel pris en charge (par exemple, Intel IceLake ou AMD Zen 4), cela peut accélérer les calculs de distance binaire de plusieurs facteurs par rapport aux implémentations par défaut.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Optimisation des requêtes</h3><p>Knowhere (le moteur de recherche de Milvus) et notre version optimisée de FAISS prennent en charge la quantification scalaire (SQ1-SQ8) sur les vecteurs de requête. Cela apporte une flexibilité supplémentaire : même avec une quantification des requêtes sur 4 bits, le rappel reste élevé tandis que les exigences de calcul diminuent considérablement, ce qui est particulièrement utile lorsque les requêtes doivent être traitées à un débit élevé.</p>
<p>Nous allons encore plus loin dans l'optimisation de notre moteur Cardinal propriétaire, qui alimente Milvus on Zilliz Cloud, entièrement géré. Au-delà des capacités du Milvus open-source, nous introduisons des améliorations avancées, notamment l'intégration d'un index vectoriel basé sur un graphe, des couches d'optimisation supplémentaires et la prise en charge des instructions Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Gain de performance : 3× plus de QPS avec une précision comparable<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>À partir de la version 2.6, Milvus introduit le nouveau type d'index <code translate="no">IVF_RABITQ</code>. Ce nouvel index combine RaBitQ avec le clustering IVF, la transformation de rotation aléatoire et le raffinement optionnel pour offrir un équilibre optimal entre les performances, l'efficacité de la mémoire et la précision.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Utiliser IVF_RABITQ dans votre application</h3><p>Voici comment mettre en œuvre <code translate="no">IVF_RABITQ</code> dans votre application Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Analyse comparative : Les chiffres racontent l'histoire</h3><p>Nous avons évalué différentes configurations à l'aide de<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, un outil d'évaluation des performances open-source destiné à évaluer les bases de données vectorielles. Les environnements de test et de contrôle utilisent Milvus Standalone déployé sur des instances AWS EC2 <code translate="no">m6id.2xlarge</code>. Ces machines disposent de 8 vCPU, de 32 Go de RAM et d'un CPU Intel Xeon 8375C basé sur l'architecture Ice Lake, qui prend en charge le jeu d'instructions VPOPCNTDQ AVX-512.</p>
<p>Nous avons utilisé le test de performance de recherche de vdb-bench, avec un ensemble de données de 1 million de vecteurs, chacun avec 768 dimensions. Étant donné que la taille de segment par défaut dans Milvus est de 1 Go et que l'ensemble de données brutes (768 dimensions × 1 million de vecteurs × 4 octets par flotteur) totalise environ 3 Go, l'analyse comparative a impliqué plusieurs segments par base de données.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Exemple de configuration de test dans vdb-bench.</p>
<p>Voici quelques détails de bas niveau sur les boutons de configuration pour IVF, RaBitQ et le processus de raffinement :</p>
<ul>
<li><p><code translate="no">nlist</code> et <code translate="no">nprobe</code> sont des paramètres standard pour toutes les méthodes basées sur <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> est un entier non négatif qui spécifie le nombre total de godets IVF pour l'ensemble de données.</p></li>
<li><p><code translate="no">nprobe</code> est un nombre entier non négatif qui spécifie le nombre d'ensembles IVF visités pour un seul vecteur de données au cours du processus de recherche. Il s'agit d'un paramètre lié à la recherche.</p></li>
<li><p><code translate="no">rbq_bits_query</code> spécifie le niveau de quantification d'un vecteur de requête. Utilisez les valeurs 1...8 pour les niveaux de quantification <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. La valeur 0 désactive la quantification. Il s'agit d'un paramètre lié à la recherche.</p></li>
<li><p><code translate="no">refine</code>Les paramètres <code translate="no">refine_type</code> et <code translate="no">refine_k</code> sont des paramètres standard pour le processus d'affinage.</p></li>
<li><p><code translate="no">refine</code> est un booléen qui active la stratégie de raffinement.</p></li>
<li><p><code translate="no">refine_k</code> est une valeur fp non négative. Le processus d'affinage utilise une méthode de quantification de meilleure qualité pour sélectionner le nombre nécessaire de plus proches voisins à partir d'un ensemble de candidats <code translate="no">refine_k</code> fois plus important, choisi à l'aide de <code translate="no">IVFRaBitQ</code>. Il s'agit d'un paramètre lié à la recherche.</p></li>
<li><p><code translate="no">refine_type</code> est une chaîne qui spécifie le type de quantification pour un index de raffinage. Les options disponibles sont <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> et <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Les résultats révèlent des informations importantes :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Comparaison des coûts et des performances de la base (IVF_FLAT), d'IVF_SQ8 et d'IVF_RABITQ avec différentes stratégies de raffinement</p>
<p>Comparé à l'index de base <code translate="no">IVF_FLAT</code>, qui atteint 236 QPS avec 95,2 % de rappel, <code translate="no">IVF_RABITQ</code> atteint un débit significativement plus élevé - 648 QPS avec des requêtes FP32 et 898 QPS lorsqu'il est associé à des requêtes quantifiées SQ8. Ces chiffres démontrent l'avantage de RaBitQ en termes de performances, en particulier lorsque le raffinement est appliqué.</p>
<p>Cependant, ces performances s'accompagnent d'un compromis notable en termes de rappel. Lorsque <code translate="no">IVF_RABITQ</code> est utilisé sans raffinement, le rappel atteint environ 76 %, ce qui peut être insuffisant pour les applications nécessitant une grande précision. Cela dit, atteindre ce niveau de rappel en utilisant une compression vectorielle de 1 bit est tout de même impressionnant.</p>
<p>Le raffinement est essentiel pour retrouver la précision. Lorsqu'il est configuré avec la requête SQ8 et le raffinement SQ8, le site <code translate="no">IVF_RABITQ</code> offre à la fois de bonnes performances et un bon taux de rappel. Il conserve un rappel élevé de 94,7 %, presque identique à IVF_FLAT, tout en atteignant 864 QPS, soit 3 fois plus qu'IVF_FLAT. Même comparé à un autre indice de quantification populaire <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> avec le raffinement SQ8 atteint plus de la moitié du débit avec un rappel similaire, seulement avec un coût marginal plus élevé. Il s'agit donc d'une excellente option pour les scénarios qui exigent à la fois rapidité et précision.</p>
<p>En bref, <code translate="no">IVF_RABITQ</code> seul est excellent pour maximiser le débit avec un rappel acceptable, et devient encore plus puissant lorsqu'il est associé au raffinement pour combler l'écart de qualité, en n'utilisant qu'une fraction de l'espace mémoire par rapport à <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>RaBitQ marque une avancée significative dans la technologie de quantification vectorielle. En combinant la quantification binaire avec des stratégies d'encodage intelligentes, il réalise ce qui semblait impossible : une compression extrême avec une perte de précision minimale.</p>
<p>À partir de la version 2.6, Milvus introduira IVF_RABITQ, intégrant cette puissante technique de compression avec les stratégies de regroupement et de raffinement IVF pour amener la quantification binaire en production. Cette combinaison crée un équilibre pratique entre la précision, la vitesse et l'efficacité de la mémoire qui peut transformer vos charges de travail de recherche vectorielle.</p>
<p>Nous nous engageons à apporter davantage d'innovations de ce type à Milvus open-source et à son service entièrement géré sur Zilliz Cloud, afin de rendre la recherche vectorielle plus efficace et accessible à tous.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Démarrer avec Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 est disponible dès maintenant. Outre RabitQ, elle introduit des dizaines de nouvelles fonctionnalités et d'optimisations des performances telles que le stockage hiérarchisé, Meanhash LSH, la recherche en texte intégral améliorée et la multilocation, répondant directement aux défis les plus pressants de la recherche vectorielle aujourd'hui : une mise à l'échelle efficace tout en gardant les coûts sous contrôle.</p>
<p>Prêt à découvrir tout ce qu'offre Milvus 2.6 ? Plongez dans nos<a href="https://milvus.io/docs/release_notes.md"> notes de mise à jour</a>, parcourez la<a href="https://milvus.io/docs"> documentation complète</a> ou consultez nos<a href="https://milvus.io/blog"> blogs sur les fonctionnalités</a>.</p>
<p>Si vous avez des questions ou un cas d'utilisation similaire, n'hésitez pas à nous contacter via notre <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord</a> ou à déposer un problème sur<a href="https://github.com/milvus-io/milvus"> GitHub</a> - nous sommes là pour vous aider à tirer le meilleur parti de Milvus 2.6.</p>
