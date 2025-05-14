---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: >-
  Les benchmarks mentent - Les BD vectorielles méritent d'être testées en vraie
  grandeur
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Découvrez l'écart de performance des bases de données vectorielles avec
  VDBBench. Notre outil effectue des tests dans le cadre de scénarios de
  production réels, garantissant ainsi le bon fonctionnement de vos applications
  d'intelligence artificielle, sans temps d'arrêt imprévu.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">La base de données vectorielles que vous avez choisie sur la base de critères de référence risque d'échouer en production<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la sélection d'une <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de données vectorielles</a> pour votre application d'IA, les critères de référence conventionnels reviennent à tester une voiture de sport sur un circuit vide, avant de constater qu'elle cale à l'heure de pointe. L'inconfortable vérité ? La plupart des tests de référence n'évaluent les performances que dans des conditions artificielles qui n'existent jamais dans les environnements de production.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La plupart des bancs d'essai testent les bases de données vectorielles <strong>une fois que</strong> toutes les données ont été ingérées et que l'index est entièrement construit. Mais en production, les données ne s'arrêtent jamais de circuler. Il n'est pas possible d'interrompre le système pendant des heures pour reconstruire un index.</p>
<p>Nous avons pu constater ce décalage de première main. Par exemple, Elasticsearch peut se vanter d'une vitesse de requête de l'ordre de la milliseconde, mais en coulisses, nous l'avons vu prendre <strong>plus de 20 heures</strong> rien que pour optimiser son index. C'est un temps d'arrêt qu'aucun système de production ne peut se permettre, en particulier pour les charges de travail d'IA qui exigent des mises à jour continues et des réponses instantanées.</p>
<p>Avec Milvus, après avoir effectué d'innombrables évaluations de preuves de concept (PoC) avec des entreprises clientes, nous avons découvert un schéma troublant : les <strong>bases de données vectorielles qui excellent dans des environnements de laboratoire contrôlés ont souvent du mal à supporter les charges de production réelles.</strong> Cette lacune critique ne se contente pas de frustrer les ingénieurs d'infrastructure, elle peut faire dérailler des initiatives d'IA entières basées sur ces promesses de performance trompeuses.</p>
<p>C'est pourquoi nous avons créé <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>: un benchmark open-source conçu dès le départ pour simuler la réalité de la production. Contrairement aux tests synthétiques qui sélectionnent des scénarios, VDBBench soumet les bases de données à une ingestion continue, à des conditions de filtrage rigoureuses et à divers scénarios, tout comme vos charges de travail de production réelles. Notre mission est simple : donner aux ingénieurs un outil qui montre comment les bases de données vectorielles fonctionnent réellement dans des conditions réelles afin que vous puissiez prendre des décisions d'infrastructure basées sur des chiffres fiables.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">Le fossé entre les benchmarks et la réalité<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Les approches traditionnelles de benchmarking souffrent de trois défauts critiques qui rendent leurs résultats pratiquement insignifiants pour la prise de décision en production :</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Des données obsolètes</h3><p>De nombreux benchmarks s'appuient encore sur des jeux de données obsolètes tels que SIFT ou<a href="https://zilliz.com/glossary/glove"> GloVe</a>, qui ne ressemblent en rien aux encastrements vectoriels complexes à haute dimension générés par les modèles d'IA d'aujourd'hui. Prenons un exemple : SIFT contient des vecteurs à 128 dimensions, tandis que les encastrements populaires des modèles d'encastrement d'OpenAI varient de 768 à 3072 dimensions.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Mesures de vanité</h3><p>De nombreux benchmarks se concentrent uniquement sur la latence moyenne ou le QPS maximal, ce qui crée une image déformée. Ces mesures idéalisées ne parviennent pas à capturer les valeurs aberrantes et les incohérences que les utilisateurs réels rencontrent dans les environnements de production. Par exemple, à quoi sert un nombre impressionnant de QPS s'il nécessite des ressources informatiques illimitées qui mettraient votre entreprise en faillite ?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Scénarios simplifiés à l'extrême</h3><p>La plupart des bancs d'essai ne testent que des charges de travail basiques et statiques - essentiellement le "Hello World" de la recherche vectorielle. Par exemple, ils n'émettent des requêtes de recherche qu'une fois que l'ensemble des données a été ingéré et indexé, ignorant la réalité dynamique dans laquelle les utilisateurs effectuent des recherches pendant que de nouvelles données affluent. Cette conception simpliste ne tient pas compte des schémas complexes qui définissent les systèmes de production réels, tels que les requêtes simultanées, les recherches filtrées et l'ingestion continue de données.</p>
<p>Conscients de ces lacunes, nous avons réalisé que l'industrie avait besoin d'un <strong>changement radical dans la philosophie de l'évaluation comparative, un changement</strong>fondé sur la façon dont les systèmes d'IA se comportent réellement dans la nature. C'est pourquoi nous avons créé <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Du laboratoire à la production : Comment VDBBench comble le fossé<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench ne se contente pas d'itérer sur des philosophies de benchmarking dépassées, il reconstruit le concept à partir des premiers principes avec une croyance directrice : <strong>un benchmark n'a de valeur que s'il prédit le comportement réel en production</strong>.</p>
<p>Nous avons conçu VDBBench pour reproduire fidèlement les conditions du monde réel dans trois domaines critiques : l'authenticité des données, les modèles de charge de travail et la mesure des performances.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernisation de l'ensemble des données</h3><p>Nous avons complètement revu les jeux de données utilisés pour le benchmarking de vectorDB. Au lieu d'utiliser des ensembles de tests traditionnels comme SIFT et GloVe, VDBBench utilise des vecteurs générés à partir de modèles d'intégration de pointe qui alimentent les applications d'IA d'aujourd'hui.</p>
<p>Pour garantir la pertinence, en particulier pour les cas d'utilisation tels que la génération améliorée par récupération (RAG), nous avons sélectionné des corpus qui reflètent des scénarios d'entreprises et de domaines spécifiques du monde réel. Ces corpus vont des bases de connaissances à usage général aux applications verticales telles que la réponse aux questions biomédicales et la recherche sur le web à grande échelle.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modèle d'intégration</strong></td><td><strong>Dimensions</strong></td><td><strong>Taille</strong></td></tr>
<tr><td>Wikipédia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tableau : Jeux de données utilisés dans VDBBench</p>
<p>VDBBench prend également en charge des ensembles de données personnalisés, ce qui vous permet d'effectuer des analyses comparatives avec vos propres données générées à partir de vos modèles d'intégration spécifiques pour vos charges de travail spécifiques. Après tout, aucun ensemble de données n'est plus parlant que vos propres données de production.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Conception de métriques axées sur la production</h3><p><strong>VDBBench donne la priorité aux mesures qui reflètent les performances réelles, et pas seulement les résultats de laboratoire.</strong> Nous avons repensé l'étalonnage en fonction de ce qui compte réellement dans les environnements de production : fiabilité sous charge, latence de queue, débit soutenu et précision.</p>
<ul>
<li><p><strong>Latence P95/P99 pour mesurer l'expérience réelle de l'utilisateur</strong>: La latence moyenne/médiane masque les valeurs aberrantes qui frustrent les utilisateurs réels. C'est pourquoi VDBBench se concentre sur la latence de queue comme P95/P99, révélant la performance que 95% ou 99% de vos requêtes atteindront réellement.</p></li>
<li><p><strong>Un débit durable sous charge :</strong> Un système qui fonctionne bien pendant 5 secondes n'est pas suffisant en production. VDBBench augmente progressivement la concurrence pour trouver le nombre maximum de requêtes par seconde de votre base de données (<code translate="no">max_qps</code>) - et non le nombre maximum dans des conditions courtes et idéales. Cela montre la capacité de votre système à tenir dans le temps.</p></li>
<li><p><strong>Le rappel est équilibré par la performance :</strong> La vitesse sans la précision n'a pas de sens. Chaque chiffre de performance dans VDBBench est associé au rappel, afin que vous sachiez exactement quelle pertinence vous échangez pour le débit. Cela permet d'établir des comparaisons équitables entre des systèmes dont les compromis internes sont très différents.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Une méthodologie de test qui reflète la réalité</h3><p>Une innovation clé dans la conception de VDBBench est la <strong>séparation entre les tests en série et les tests simultanés</strong>, ce qui permet de comprendre comment les systèmes se comportent sous différents types de charge. Par exemple, les mesures de latence sont divisées comme suit :</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mesure les performances du système sous une charge minimale, lorsqu'une seule requête est traitée à la fois. Il s'agit du <em>meilleur scénario</em> pour la latence.</p></li>
<li><p><code translate="no">conc_latency_p99</code> mesure le comportement du système dans des <em>conditions réalistes, à haute fréquence</em>, où plusieurs requêtes arrivent simultanément.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Deux phases de test</h3><p>VDBBench sépare les tests en deux phases cruciales :</p>
<ol>
<li><strong>Test en série</strong></li>
</ol>
<p>Il s'agit d'une exécution mono-processus de 1 000 requêtes. Cette phase établit une base de référence pour la performance et la précision idéales, en rapportant à la fois <code translate="no">serial_latency_p99</code> et le rappel.</p>
<ol start="2">
<li><strong>Test de simultanéité</strong></li>
</ol>
<p>Cette phase simule un environnement de production soumis à une charge soutenue.</p>
<ul>
<li><p><strong>Simulation réaliste du client</strong>: Chaque processus de test fonctionne indépendamment avec sa propre connexion et son propre ensemble de requêtes. Cela permet d'éviter les interférences liées à l'état partagé (par exemple, le cache) qui pourraient fausser les résultats.</p></li>
<li><p><strong>Démarrage synchronisé</strong>: Tous les processus démarrent simultanément, ce qui garantit que le QPS mesuré reflète fidèlement le niveau de concurrence annoncé.</p></li>
</ul>
<p>Ces méthodes soigneusement structurées garantissent que les valeurs <code translate="no">max_qps</code> et <code translate="no">conc_latency_p99</code> rapportées par VDBBench sont à la fois <strong>précises et pertinentes pour</strong> la <strong>production</strong>, fournissant des informations utiles pour la planification de la capacité de production et la conception du système.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et temps de latence de Milvus-16c64g-standalone à différents niveaux de simultanéité (test Cohere 1M). Dans ce test, Milvus est initialement sous-utilisé - jusqu'au</em> <strong><em>niveau de simultanéité 20</em></strong><em>, l'augmentation de la simultanéité améliore l'utilisation du système et se traduit par un QPS plus élevé. Au-delà du</em> <strong><em>niveau de concurrence 20</em></strong><em>, le système atteint sa pleine charge : les augmentations ultérieures de la concurrence n'améliorent plus le débit et la latence augmente en raison des délais de mise en file d'attente.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Au-delà de la recherche de données statiques : Les scénarios de production réels<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>À notre connaissance, VDBBench est le seul outil de référence qui teste les bases de données vectorielles dans l'ensemble des scénarios critiques de production, y compris la collecte statique, le filtrage et la diffusion en continu.</p>
<h3 id="Static-Collection" class="common-anchor-header">Collecte statique</h3><p>Contrairement à d'autres benchmarks qui se précipitent dans les tests, VDBBench s'assure d'abord que chaque base de données a entièrement optimisé ses index - une condition préalable essentielle à la production que de nombreux benchmarks négligent souvent. Cela vous permet d'obtenir une image complète :</p>
<ul>
<li><p>Temps d'ingestion des données</p></li>
<li><p>Temps d'indexation (le temps utilisé pour construire un index optimisé, ce qui affecte considérablement les performances de recherche)</p></li>
<li><p>Performances de recherche sur des index entièrement optimisés dans des conditions sérielles et simultanées</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtrage</h3><p>La recherche vectorielle en production se fait rarement de manière isolée. Les applications réelles combinent la similarité vectorielle avec le filtrage des métadonnées ("trouver des chaussures qui ressemblent à cette photo mais qui coûtent moins de 100 $"). Cette recherche vectorielle filtrée crée des défis uniques :</p>
<ul>
<li><p><strong>Complexité du filtre</strong>: Plus de colonnes scalaires et de conditions logiques augmentent les demandes de calcul.</p></li>
<li><p><strong>Sélectivité du filtre</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Notre expérience en production</a> révèle qu'il s'agit de la cause cachée de la perte de performance - la vitesse des requêtes peut fluctuer de plusieurs ordres de grandeur en fonction de la sélectivité des filtres.</p></li>
</ul>
<p>VDBBench évalue systématiquement les performances des filtres à différents niveaux de sélectivité (de 50 % à 99,9 %), fournissant un profil complet de la façon dont les bases de données gèrent ce modèle de production critique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et rappel de Milvus et OpenSearch pour différents niveaux de sélectivité des filtres (test Cohere 1M). L'axe X représente le pourcentage de données filtrées. Comme le montre la figure, Milvus maintient un rappel élevé et constant à tous les niveaux de sélectivité du filtre, tandis qu'OpenSearch présente des performances instables, le rappel fluctuant de manière significative dans différentes conditions de filtrage.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>Les systèmes de production bénéficient rarement du luxe de données statiques. De nouvelles informations affluent continuellement pendant que les recherches s'exécutent - un scénario dans lequel de nombreuses bases de données, par ailleurs impressionnantes, s'effondrent.</p>
<p>Le cas unique de test de streaming de VDBBench examine la performance de la recherche pendant l'insertion, en mesurant :</p>
<ol>
<li><p>L<strong>'impact de l'augmentation du volume des données</strong>: Comment les performances de recherche s'adaptent à l'augmentation de la taille des données.</p></li>
<li><p><strong>Impact de la charge d'écriture</strong>: comment les écritures simultanées affectent la latence et le débit de la recherche, étant donné que l'écriture consomme également des ressources de CPU ou de mémoire dans le système.</p></li>
</ol>
<p>Les scénarios de streaming représentent un test de résistance complet pour toute base de données vectorielle. Mais il n'est pas facile d'établir un critère de référence <em>équitable</em> pour cela. Il ne suffit pas de décrire le comportement d'un système, il faut un modèle d'évaluation cohérent qui permette de <strong>comparer des</strong> bases de données différentes.</p>
<p>Forts de notre expérience en matière d'aide aux entreprises dans le cadre de déploiements réels, nous avons élaboré une approche structurée et reproductible. Avec VDBBench :</p>
<ul>
<li><p>Vous <strong>définissez un taux d'insertion fixe</strong> qui reflète votre charge de travail de production cible.</p></li>
<li><p>VDBBench applique ensuite une <strong>pression de charge identique sur</strong> tous les systèmes, ce qui garantit des résultats de performance directement comparables.</p></li>
</ul>
<p>Par exemple, avec un jeu de données Cohere 10M et un objectif d'ingestion de 500 lignes/seconde :</p>
<ul>
<li><p>VDBBench lance 5 processus producteurs parallèles, chacun insérant 100 lignes par seconde.</p></li>
<li><p>Après chaque 10% de données ingérées, VDBBench déclenche une série de tests de recherche dans des conditions sérielles et simultanées.</p></li>
<li><p>Des mesures telles que la latence, le QPS et le rappel sont enregistrées après chaque étape.</p></li>
</ul>
<p>Cette méthodologie contrôlée révèle comment les performances de chaque système évoluent dans le temps et dans des conditions de stress opérationnel réelles, ce qui vous donne les informations dont vous avez besoin pour prendre des décisions en matière d'infrastructure qui soient évolutives.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et rappel de Pinecone par rapport à Elasticsearch dans le test de streaming Cohere 10M (taux d'ingestion de 500 lignes/s). Pinecone a maintenu un QPS et un rappel plus élevés, montrant une amélioration significative du QPS après l'insertion de 100% des données.</em></p>
<p>Mais ce n'est pas tout. VDBBench va encore plus loin en prenant en charge une étape d'optimisation optionnelle, permettant aux utilisateurs de comparer les performances de la recherche en continu avant et après l'optimisation de l'index. Il suit et rapporte également le temps réel passé sur chaque étape, offrant une vision plus profonde de l'efficacité et du comportement du système dans des conditions similaires à celles de la production.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et rappel de Pinecone vs. Elasticsearch dans le test de streaming Cohere 10M après optimisation (taux d'ingestion de 500 lignes/s)</em></p>
<p>Comme le montre le diagramme, ElasticSearch a surpassé Pinecone en termes de QPS après optimisation de l'index. Un miracle ? Pas tout à fait. Le graphique de droite en dit long : une fois que l'axe des x reflète le temps réel écoulé, il est clair qu'ElasticSearch a mis beaucoup plus de temps à atteindre cette performance. Et en production, ce délai est important. Cette comparaison révèle un compromis essentiel : le débit maximal par rapport au temps de service.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Choisissez votre base de données vectorielle en toute confiance<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>L'écart entre les résultats des analyses comparatives et les performances réelles ne devrait pas être un jeu de devinettes. VDBBench permet d'évaluer les bases de données vectorielles dans des conditions réalistes, proches de la production, notamment l'ingestion continue de données, le filtrage des métadonnées et les charges de travail en continu.</p>
<p>Si vous envisagez de déployer une base de données vectorielle en production, il est intéressant de comprendre comment elle se comporte au-delà des tests de laboratoire idéalisés. VDBBench est open-source, transparent et conçu pour permettre des comparaisons significatives, de type "apples-to-apples".</p>
<p>Essayez VDBBench avec vos propres charges de travail dès aujourd'hui et voyez comment les différents systèmes se comportent dans la pratique <a href="https://github.com/zilliztech/VectorDBBench">: https://github.com/zilliztech/VectorDBBench.</a></p>
<p>Vous avez des questions ou souhaitez partager vos résultats ? Rejoignez la conversation sur<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou connectez-vous avec notre communauté sur <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Nous serions ravis d'entendre vos opinions.</p>
