---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Annonce de VDBBench 1.0 : Benchmarking de bases de données vectorielles
  open-source avec vos charges de travail de production réelles
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Découvrez VDBBench 1.0, un outil open-source permettant d'évaluer les bases de
  données vectorielles à l'aide de données réelles, de l'ingestion de flux et de
  charges de travail simultanées.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>La plupart des bancs d'essai de bases de données vectorielles testent des données statiques et des index préconstruits. Mais les systèmes de production ne fonctionnent pas de cette manière : les données circulent en continu pendant que les utilisateurs exécutent des requêtes, les filtres fragmentent les index et les caractéristiques de performance changent radicalement sous l'effet de charges de lecture/écriture simultanées.</p>
<p>Nous publions aujourd'hui <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, un benchmark open-source conçu pour tester les bases de données vectorielles dans des conditions de production réalistes : ingestion de données en continu, filtrage des métadonnées avec une sélectivité variable, et charges de travail simultanées qui révèlent les goulets d'étranglement réels du système.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Télécharger VDBBench 1.0 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>Voir le classement →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Pourquoi les tests de performance actuels sont trompeurs<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Soyons honnêtes : il existe un phénomène étrange dans notre secteur. Tout le monde parle de "ne pas jouer avec les benchmarks", mais nombreux sont ceux qui adoptent exactement ce comportement. Depuis l'explosion du marché des bases de données vectorielles en 2023, nous avons vu de nombreux exemples de systèmes dont les performances sont excellentes, mais qui échouent lamentablement en production, ce qui fait perdre du temps aux ingénieurs et nuit à la crédibilité du projet.</p>
<p>Nous avons été les premiers témoins de ce décalage. Par exemple, Elasticsearch se targue d'une vitesse d'interrogation de l'ordre de la milliseconde, mais en coulisses, l'optimisation de son index peut prendre plus de 20 heures. Quel système de production peut tolérer un tel temps d'arrêt ?</p>
<p>Le problème provient de trois faiblesses fondamentales :</p>
<ul>
<li><p><strong>Des ensembles de données obsolètes :</strong> De nombreux benchmarks s'appuient encore sur des ensembles de données anciens tels que SIFT (128 dimensions), alors que les embeddings modernes comptent de 768 à 3 072 dimensions. Les caractéristiques de performance des systèmes fonctionnant sur des vecteurs de 128D par rapport à 1024D+ sont fondamentalement différentes - les schémas d'accès à la mémoire, l'efficacité de l'index et la complexité de calcul changent tous radicalement.</p></li>
<li><p><strong>Mesures de vanité :</strong> Les repères se concentrent sur la latence moyenne ou le QPS maximal, ce qui donne une image déformée de la situation. Un système dont la latence moyenne est de 10 ms mais dont la latence P99 est de 2 secondes offre une expérience utilisateur désastreuse. Un débit maximal mesuré sur 30 secondes ne dit rien sur les performances durables.</p></li>
<li><p><strong>Scénarios simplifiés à l'extrême :</strong> La plupart des benchmarks testent les flux de travail de base "écrire des données, construire un index, faire une requête" - essentiellement des tests de niveau "Hello World". La production réelle implique l'ingestion continue de données tout en servant des requêtes, un filtrage complexe des métadonnées qui fragmente les index, et des opérations de lecture/écriture concurrentes qui se disputent les ressources.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">Quelles sont les nouveautés de VDBBench 1.0 ?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench ne se contente pas d'itérer sur des philosophies de benchmarking dépassées - il reconstruit le concept à partir des premiers principes avec une croyance directrice : un benchmark n'a de valeur que s'il prédit le comportement réel de la production.</p>
<p>Nous avons conçu VDBBench pour reproduire fidèlement les conditions du monde réel dans trois domaines critiques : l'<strong>authenticité des données, les modèles de charge de travail et les méthodologies de mesure des performances.</strong></p>
<p>Examinons de plus près les nouvelles fonctionnalités apportées à la table.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 Un tableau de bord redessiné avec des visualisations pertinentes pour la production</strong></h3><p>La plupart des benchmarks se concentrent uniquement sur la production de données brutes, mais ce qui compte, c'est la façon dont les ingénieurs interprètent et agissent sur ces résultats. Nous avons repensé l'interface utilisateur pour privilégier la clarté et l'interactivité, ce qui vous permet de repérer les écarts de performance entre les systèmes et de prendre rapidement des décisions en matière d'infrastructure.</p>
<p>Le nouveau tableau de bord visualise non seulement les chiffres de performance, mais aussi les relations entre eux : comment le QPS se dégrade sous différents niveaux de sélectivité des filtres, comment le rappel fluctue pendant l'ingestion en continu, et comment les distributions de latence révèlent les caractéristiques de stabilité du système.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous avons testé à nouveau les principales plateformes de bases de données vectorielles, notamment <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone et OpenSearch</strong>, avec leurs configurations les plus récentes et les paramètres recommandés, afin de nous assurer que toutes les données de référence reflètent les capacités actuelles. Tous les résultats des tests sont disponibles sur le<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Filtrage des balises : Le tueur de performances caché</h3><p>Dans le monde réel, les requêtes sont rarement isolées. Les applications combinent la similarité vectorielle et le filtrage des métadonnées ("trouver des chaussures qui ressemblent à cette photo mais qui coûtent moins de 100 $"). Cette recherche vectorielle filtrée crée des défis uniques que la plupart des benchmarks ignorent complètement.</p>
<p>Les recherches filtrées introduisent de la complexité dans deux domaines critiques :</p>
<ul>
<li><p><strong>Complexité du filtre</strong>: Plus de champs scalaires et de conditions logiques complexes augmentent les demandes de calcul et peuvent entraîner un rappel insuffisant et une fragmentation de l'index du graphe.</p></li>
<li><p><strong>Sélectivité du filtre</strong>: Il s'agit du "tueur de performances caché" que nous avons vérifié à plusieurs reprises en production. Lorsque les conditions de filtrage deviennent très sélectives (filtrage de plus de 99% des données), la vitesse des requêtes peut fluctuer de plusieurs ordres de grandeur, et le rappel peut devenir instable car les structures d'index se battent avec des ensembles de résultats épars.</p></li>
</ul>
<p>VDBBench teste systématiquement différents niveaux de sélectivité du filtrage (de 50 % à 99,9 %), fournissant un profil de performance complet dans ce modèle de production critique. Les résultats révèlent souvent des écarts de performance spectaculaires qui n'apparaîtraient jamais dans les benchmarks traditionnels.</p>
<p><strong>Exemple</strong>: Dans les tests Cohere 1M, Milvus a maintenu un rappel constamment élevé à tous les niveaux de sélectivité du filtre, tandis qu'OpenSearch a présenté des performances instables avec un rappel fluctuant de manière significative dans différentes conditions de filtrage - tombant en dessous de 0,8 rappel dans de nombreux cas, ce qui est inacceptable pour la plupart des environnements de production.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et rappel de Milvus et OpenSearch pour différents niveaux de sélectivité des filtres (test Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Lecture/écriture en continu : Au-delà des tests d'index statiques</h3><p>Les systèmes de production bénéficient rarement du luxe de données statiques. De nouvelles informations affluent continuellement pendant que les recherches s'exécutent - un scénario dans lequel de nombreuses bases de données, par ailleurs impressionnantes, s'effondrent sous la double pression du maintien des performances de recherche et de la gestion des écritures continues.</p>
<p>Les scénarios de streaming de VDBBench simulent des opérations parallèles réelles, aidant les développeurs à comprendre la stabilité du système dans des environnements à forte circulation, en particulier l'impact de l'écriture des données sur les performances des requêtes et l'évolution des performances au fur et à mesure que le volume des données s'accroît.</p>
<p>Pour garantir des comparaisons équitables entre différents systèmes, VDBBench utilise une approche structurée :</p>
<ul>
<li><p>Configurer des taux d'écriture contrôlés qui reflètent les charges de travail de la production cible (par exemple, 500 lignes/sec réparties sur 5 processus parallèles).</p></li>
<li><p>Déclencher des opérations de recherche après chaque 10 % d'ingestion de données, en alternant les modes sériel et simultané.</p></li>
<li><p>Enregistrement de mesures complètes : distribution des temps de latence (y compris P99), QPS soutenu et précision de rappel.</p></li>
<li><p>Suivre l'évolution des performances au fil du temps, à mesure que le volume de données et le stress du système augmentent.</p></li>
</ul>
<p>Ces tests de charge contrôlés et progressifs révèlent à quel point les systèmes conservent leur stabilité et leur précision dans le cadre d'une ingestion continue, ce que les critères de référence traditionnels ne permettent que rarement d'appréhender.</p>
<p><strong>Exemple</strong>: Dans les tests de streaming Cohere 10M, Pinecone a maintenu un QPS et un rappel plus élevés tout au long du cycle d'écriture par rapport à Elasticsearch. Notamment, les performances de Pinecone se sont considérablement améliorées après la fin de l'ingestion, démontrant une grande stabilité sous une charge soutenue, alors qu'Elasticsearch a montré un comportement plus erratique pendant les phases d'ingestion active.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : QPS et rappel de Pinecone par rapport à Elasticsearch dans le test de streaming Cohere 10M (taux d'ingestion de 500 lignes/s).</p>
<p>VDBBench va encore plus loin en prenant en charge une étape d'optimisation optionnelle, permettant aux utilisateurs de comparer les performances de la recherche en continu avant et après l'optimisation de l'index. Il suit et rapporte également le temps réel passé sur chaque étape, offrant un aperçu plus approfondi de l'efficacité et du comportement du système dans des conditions similaires à celles de la production.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : QPS et rappel de Pinecone vs. Elasticsearch dans le test de streaming Cohere 10M après optimisation (taux d'ingestion de 500 lignes/s)</em></p>
<p>Comme le montrent nos tests, Elasticsearch a surpassé Pinecone en termes de QPS après optimisation de l'index. Mais lorsque l'axe des x reflète le temps réel écoulé, il est clair qu'Elasticsearch a mis beaucoup plus de temps à atteindre cette performance. En production, ce délai est important. Cette comparaison révèle un compromis essentiel : le débit maximal par rapport au temps de service.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 Des ensembles de données modernes qui reflètent les charges de travail actuelles de l'IA</h3><p>Nous avons complètement remanié les ensembles de données utilisés pour l'analyse comparative des bases de données vectorielles. Au lieu d'utiliser des ensembles de tests hérités comme SIFT et GloVe, VDBBench utilise des vecteurs générés par des modèles d'intégration de pointe comme OpenAI et Cohere, qui alimentent les applications d'IA d'aujourd'hui.</p>
<p>Pour garantir la pertinence, en particulier pour les cas d'utilisation tels que la génération améliorée par récupération (RAG), nous avons sélectionné des corpus qui reflètent des scénarios d'entreprises et de domaines spécifiques du monde réel :</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modèle d'intégration</strong></td><td><strong>Dimensions</strong></td><td><strong>Taille</strong></td><td><strong>Cas d'utilisation</strong></td></tr>
<tr><td>Wikipédia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Base de connaissances générales</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Domaine spécifique (biomédical)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Traitement de texte à l'échelle du web</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Recherche à grande échelle</td></tr>
</tbody>
</table>
<p>Ces ensembles de données simulent mieux les données vectorielles actuelles à haut volume et à haute dimension, ce qui permet de tester de manière réaliste l'efficacité du stockage, les performances des requêtes et la précision de l'extraction dans des conditions correspondant aux charges de travail modernes de l'IA.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Prise en charge de jeux de données personnalisés pour des tests spécifiques à l'industrie</h3><p>Chaque entreprise est unique. L'industrie financière peut avoir besoin de tests axés sur l'intégration des transactions, tandis que les plateformes sociales s'intéressent davantage aux vecteurs de comportement des utilisateurs. VDBBench vous permet d'effectuer des tests avec vos propres données générées à partir de vos modèles d'intégration spécifiques pour vos charges de travail spécifiques.</p>
<p>Vous pouvez personnaliser :</p>
<ul>
<li><p>les dimensions des vecteurs et les types de données</p></li>
<li><p>Le schéma des métadonnées et les modèles de filtrage</p></li>
<li><p>Le volume de données et les modèles d'ingestion</p></li>
<li><p>Les distributions de requêtes qui correspondent à votre trafic de production</p></li>
</ul>
<p>Après tout, aucun ensemble de données ne raconte mieux l'histoire que vos propres données de production.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Comment VDBBench mesure ce qui est réellement important en production<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Conception de mesures axées sur la production</h3><p>VDBBench donne la priorité aux mesures qui reflètent les performances réelles, et pas seulement les résultats de laboratoire. Nous avons repensé l'étalonnage en fonction de ce qui importe réellement dans les environnements de production : <strong>fiabilité sous charge, caractéristiques de latence de queue, débit soutenu et préservation de la précision.</strong></p>
<ul>
<li><p><strong>Latence P95/P99 pour une expérience utilisateur réelle</strong>: La latence moyenne/médiane masque les valeurs aberrantes qui frustrent les utilisateurs réels et peuvent indiquer une instabilité sous-jacente du système. VDBBench se concentre sur la latence de queue comme P95/P99, révélant la performance que 95% ou 99% de vos requêtes atteindront réellement. Cet aspect est crucial pour la planification des accords de niveau de service (SLA) et la compréhension de l'expérience de l'utilisateur dans le pire des cas.</p></li>
<li><p><strong>Débit durable sous charge</strong>: Un système qui fonctionne bien pendant 5 secondes n'est pas suffisant en production. VDBBench augmente progressivement la concurrence pour trouver le nombre maximum de requêtes par seconde (<code translate="no">max_qps</code>) de votre base de données - et non le nombre maximum dans des conditions courtes et idéales. Cette méthodologie révèle la capacité de votre système à tenir dans le temps et vous aide à planifier votre capacité de manière réaliste.</p></li>
<li><p><strong>Un rappel équilibré par rapport à la performance</strong>: La vitesse sans la précision n'a pas de sens. Chaque chiffre de performance dans VDBBench est associé à des mesures de rappel, afin que vous sachiez exactement quelle pertinence vous échangez pour le débit. Cela permet d'établir des comparaisons équitables entre des systèmes dont les compromis internes sont très différents.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Une méthodologie de test qui reflète la réalité</h3><p>Une innovation clé dans la conception de VDBBench est la séparation des tests en série et simultanés, qui aide à capturer la façon dont les systèmes se comportent sous différents types de charge et révèle les caractéristiques de performance qui comptent pour différents cas d'utilisation.</p>
<p><strong>Séparation des mesures de latence :</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mesure les performances du système sous une charge minimale, lorsqu'une seule requête est traitée à la fois. Cela représente le meilleur scénario pour la latence et permet d'identifier les capacités de base du système.</p></li>
<li><p><code translate="no">conc_latency_p99</code> capture le comportement du système dans des conditions réalistes, à haute fréquence, où plusieurs requêtes arrivent simultanément et se disputent les ressources du système.</p></li>
</ul>
<p><strong>Structure du test de référence en deux phases</strong>:</p>
<ol>
<li><p><strong>Test en série</strong>: Exécution mono-processus de 1 000 requêtes qui établit la performance et la précision de base, en rapportant à la fois <code translate="no">serial_latency_p99</code> et le rappel. Cette phase permet d'identifier le plafond théorique des performances.</p></li>
<li><p><strong>Test de simultanéité</strong>: Simule l'environnement de production sous une charge soutenue avec plusieurs innovations clés :</p>
<ul>
<li><p><strong>Simulation réaliste du client</strong>: Chaque processus de test fonctionne indépendamment avec sa propre connexion et son propre ensemble de requêtes, évitant ainsi les interférences d'état partagé qui pourraient fausser les résultats.</p></li>
<li><p><strong>Démarrage synchronisé</strong>: Tous les processus démarrent simultanément, ce qui garantit que le QPS mesuré reflète fidèlement les niveaux de concurrence déclarés.</p></li>
<li><p><strong>Jeux de requêtes indépendants</strong>: Évite les taux d'accès au cache irréalistes qui ne reflètent pas la diversité des requêtes en production.</p></li>
</ul></li>
</ol>
<p>Ces méthodes soigneusement structurées garantissent que les valeurs <code translate="no">max_qps</code> et <code translate="no">conc_latency_p99</code> rapportées par VDBBench sont à la fois précises et pertinentes pour la production, fournissant des informations significatives pour la planification de la capacité de production et la conception du système.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Démarrer avec VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> représente un changement fondamental vers un benchmarking pertinent pour la production. En couvrant l'écriture continue de données, le filtrage de métadonnées avec une sélectivité variable, et les charges de streaming avec des modèles d'accès concurrents, il fournit l'approximation la plus proche des environnements de production réels disponibles aujourd'hui.</p>
<p>L'écart entre les résultats des analyses comparatives et les performances réelles ne doit pas être un jeu de devinettes. Si vous envisagez de déployer une base de données vectorielle en production, il est utile de comprendre comment elle se comporte au-delà des tests de laboratoire idéalisés. VDBBench est open-source, transparent et conçu pour permettre des comparaisons significatives.</p>
<p>Ne vous laissez pas influencer par des chiffres impressionnants qui ne se traduisent pas en valeur de production. <strong>Utilisez VDBBench 1.0 pour tester des scénarios importants pour votre entreprise, avec vos données, dans des conditions qui reflètent votre charge de travail réelle.</strong> L'ère des benchmarks trompeurs dans l'évaluation des bases de données vectorielles est révolue - il est temps de prendre des décisions basées sur des données pertinentes pour la production.</p>
<p><strong>Essayez VDBBench avec vos propres charges de travail</strong><a href="https://github.com/zilliztech/VectorDBBench">: https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Consultez les résultats des tests des principales bases de données vectorielles :</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a></p>
<p>Vous avez des questions ou souhaitez partager vos résultats ? Rejoignez la conversation sur<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou connectez-vous avec notre communauté sur<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
