---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Aperçu de Milvus 2.6 : 72% de réduction de la mémoire sans compromettre le
  rappel et 4x plus rapide qu'Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Découvrez en exclusivité les innovations de la prochaine version de Milvus 2.6
  qui redéfinira les performances et l'efficacité des bases de données
  vectorielles.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Tout au long de cette semaine, nous avons partagé une série d'innovations passionnantes dans Milvus qui repoussent les limites de la technologie des bases de données vectorielles :</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans tuer le rappel </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie - Les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données d'entraînement LLM </a></p></li>
</ul>
<p>Alors que nous clôturons notre semaine Milvus, je suis ravi de vous donner un aperçu de ce qui vous attend dans Milvus 2.6, une étape cruciale de notre feuille de route 2025 actuellement en cours de développement, et de la manière dont ces améliorations transformeront la recherche alimentée par l'IA. Cette prochaine version rassemble toutes ces innovations et bien plus encore sur trois fronts critiques : l'<strong>optimisation de la rentabilité</strong>, les <strong>capacités de recherche avancées</strong> et <strong>une nouvelle architecture</strong> qui pousse la recherche vectorielle au-delà de l'échelle de 10 milliards de vecteurs.</p>
<p>Examinons quelques-unes des principales améliorations auxquelles vous pouvez vous attendre lorsque Milvus 2.6 arrivera en juin, en commençant par ce qui pourrait avoir l'impact le plus immédiat : des réductions spectaculaires de l'utilisation et du coût de la mémoire, ainsi que des performances ultra-rapides.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Réduction des coûts : Réduire l'utilisation de la mémoire tout en augmentant les performances<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>L'utilisation d'une mémoire coûteuse constitue l'un des principaux obstacles à l'extension de la recherche vectorielle à des milliards d'enregistrements. Milvus 2.6 introduira plusieurs optimisations clés qui réduiront considérablement les coûts de votre infrastructure tout en améliorant les performances.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">Quantification à 1 bit RaBitQ : Réduction de 72 % de la mémoire avec 4× QPS et aucune perte de rappel</h3><p>La consommation de mémoire a longtemps été le talon d'Achille des bases de données vectorielles à grande échelle. Bien que la quantification vectorielle ne soit pas nouvelle, la plupart des approches existantes sacrifient trop la qualité de la recherche pour économiser de la mémoire. Milvus 2.6 s'attaque de front à ce défi en introduisant la<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> quantification RaBitQ à 1 bit</a> dans les environnements de production.</p>
<p>Ce qui rend notre implémentation spéciale, c'est la capacité d'optimisation ajustable Refine que nous construisons. En implémentant un index primaire avec la quantification RaBitQ et les options SQ4/SQ6/SQ8 Refine, nous avons atteint un équilibre optimal entre l'utilisation de la mémoire et la qualité de la recherche (~95% de rappel).</p>
<p>Nos tests préliminaires révèlent des résultats prometteurs :</p>
<table>
<thead>
<tr><th><strong>Mesure de</strong><strong>performance</strong> </th><th><strong>Traditionnel IVF_FLAT</strong></th><th><strong>RaBitQ (1 bit) uniquement</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>Empreinte mémoire</td><td>100% (ligne de base)</td><td>3% (97% de réduction)</td><td>28% (72% de réduction)</td></tr>
<tr><td>Qualité du rappel</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Débit d'interrogation (QPS)</td><td>236</td><td>648 (2,7 fois plus rapide)</td><td>946 (4 fois plus rapide)</td></tr>
</tbody>
</table>
<p><em>Tableau : Évaluation de VectorDBBench avec 1M de vecteurs de 768 dimensions, testé sur AWS m6id.2xlarge</em></p>
<p>La véritable avancée ici n'est pas seulement la réduction de la mémoire, mais le fait d'y parvenir tout en améliorant le débit de 4 fois sans compromettre la précision. Cela signifie que vous serez en mesure de servir la même charge de travail avec 75 % de serveurs en moins ou de gérer 4 fois plus de trafic sur votre infrastructure existante.</p>
<p>Pour les utilisateurs professionnels qui utilisent Milvus entièrement géré sur<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, nous développons des profils de configuration automatisés qui ajusteront dynamiquement les paramètres RaBitQ en fonction des caractéristiques de votre charge de travail spécifique et de vos exigences en matière de précision.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Recherche en texte intégral 400 % plus rapide qu'Elasticsearch</h3><p>Les capacités de<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">recherche en texte intégral</a> dans les bases de données vectorielles sont devenues essentielles pour la création de systèmes de recherche hybrides. Depuis l'introduction de BM25 dans <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, nous avons reçu des commentaires enthousiastes, ainsi que des demandes d'amélioration des performances à l'échelle.</p>
<p>Milvus 2.6 offrira des gains de performances substantiels sur BM25. Nos tests sur le jeu de données BEIR montrent un débit 3 à 4 fois supérieur à celui d'Elasticsearch avec des taux de rappel équivalents. Pour certaines charges de travail, l'amélioration atteint jusqu'à 7 fois le QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Milvus vs. Elasticsearch sur le débit JSON Path Index : Une latence réduite de 99 % pour un filtrage complexe</p>
<p>Les applications d'IA modernes reposent rarement sur la similarité vectorielle seule - elles combinent presque toujours la recherche vectorielle avec le filtrage des métadonnées. Lorsque ces conditions de filtrage deviennent plus complexes (notamment avec les objets JSON imbriqués), les performances des requêtes peuvent se détériorer rapidement.</p>
<p>Milvus 2.6 introduira un mécanisme d'indexation ciblé pour les chemins JSON imbriqués qui vous permet de créer des index sur des chemins spécifiques (par exemple, $meta. <code translate="no">user_info.location</code>) dans les champs JSON. Au lieu d'analyser des objets entiers, Milvus recherchera directement les valeurs des index préconstruits.</p>
<p>Dans notre évaluation avec plus de 100 millions d'enregistrements, JSON Path Index a réduit la latence du filtre de <strong>140 ms</strong> (P99 : 480 ms) à seulement <strong>1,5 ms</strong> (P99 : 10 ms), soit une réduction de 99 % qui transformera des requêtes auparavant irréalisables en réponses instantanées.</p>
<p>Cette fonctionnalité sera particulièrement utile pour</p>
<ul>
<li><p>les systèmes de recommandation avec filtrage complexe des attributs de l'utilisateur</p></li>
<li><p>Les applications RAG qui filtrent les documents en fonction de différentes étiquettes</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Recherche de nouvelle génération : De la similarité vectorielle de base à la recherche de niveau production<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche vectorielle seule n'est pas suffisante pour les applications modernes d'intelligence artificielle. Les utilisateurs exigent la précision de la recherche d'informations traditionnelle combinée à la compréhension sémantique de l'intégration vectorielle. Milvus 2.6 introduira plusieurs fonctions de recherche avancées qui combleront ce fossé.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Amélioration de la recherche en texte intégral grâce à l'analyseur multilingue</h3><p>La recherche plein texte dépend fortement de la langue... Milvus 2.6 introduira un pipeline d'analyse de texte entièrement remanié avec une prise en charge multilingue :</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> prise en charge de la syntaxe pour l'observabilité de la configuration de l'analyseur/de la symbolisation</p></li>
<li><p>Lindera tokenizer pour les langues asiatiques telles que le japonais et le coréen</p></li>
<li><p>Le tokenizer ICU pour un support multilingue complet</p></li>
<li><p>Configuration granulaire des langues pour définir des règles de tokenisation spécifiques à chaque langue</p></li>
<li><p>Jieba amélioré avec prise en charge de l'intégration de dictionnaires personnalisés</p></li>
<li><p>Options de filtrage étendues pour un traitement de texte plus précis</p></li>
</ul>
<p>Pour les applications internationales, cela signifie une meilleure recherche multilingue sans indexation spécialisée par langue ni solutions de contournement complexes.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Correspondance de phrases : Saisir la nuance sémantique dans l'ordre des mots</h3><p>L'ordre des mots véhicule des distinctions de sens essentielles que la recherche par mot-clé ignore souvent. Essayez de comparer &quot;techniques d'apprentissage automatique&quot; et &quot;techniques d'apprentissage automatique&quot; - mêmes mots, sens totalement différent.</p>
<p>Milvus 2.6 ajoutera la <strong>correspondance des phrases</strong>, ce qui permettra aux utilisateurs de mieux contrôler l'ordre et la proximité des mots que la recherche en texte intégral ou la correspondance exacte des chaînes de caractères :</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>Le paramètre <code translate="no">slop</code> permettra un contrôle souple de la proximité des mots : 0 exige des correspondances exactes consécutives, tandis que des valeurs plus élevées permettent des variations mineures dans la formulation.</p>
<p>Cette fonction sera particulièrement utile pour</p>
<ul>
<li><p>la recherche de documents juridiques où la formulation exacte a une signification juridique</p></li>
<li><p>la recherche de contenu technique où l'ordre des termes permet de distinguer différents concepts</p></li>
<li><p>les bases de données de brevets où des phrases techniques spécifiques doivent être trouvées avec précision.</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Fonctions de décroissance en fonction du temps : Priorité automatique au contenu frais</h3><p>La valeur de l'information diminue souvent avec le temps. Les articles de presse, les communiqués de presse sur les produits et les messages sociaux perdent tous de leur pertinence à mesure qu'ils vieillissent, alors que les algorithmes de recherche traditionnels traitent tous les contenus de la même manière, indépendamment de l'horodatage.</p>
<p>Milvus 2.6 introduira des <strong>fonctions de décroissance</strong> pour le classement en fonction du temps, qui ajustent automatiquement les scores de pertinence en fonction de l'âge du document.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous pourrez configurer :</p>
<ul>
<li><p><strong>Le type de fonction</strong>: Exponentiel (décroissance rapide), Gaussien (décroissance progressive) ou Linéaire (décroissance constante).</p></li>
<li><p><strong>Le taux de décroissance</strong>: La vitesse à laquelle la pertinence diminue au fil du temps</p></li>
<li><p><strong>Point d'origine</strong>: L'heure de référence pour mesurer les différences de temps</p></li>
</ul>
<p>Ce reclassement en fonction du temps garantit que les résultats les plus récents et les plus pertinents sur le plan contextuel apparaissent en premier, ce qui est essentiel pour les systèmes de recommandation d'actualités, les plateformes de commerce électronique et les flux de médias sociaux.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Données entrantes, données sortantes : Du texte brut à la recherche vectorielle en une seule étape</h3><p>L'un des plus gros problèmes rencontrés par les développeurs avec les bases de données vectorielles est la déconnexion entre les données brutes et les encastrements vectoriels. Milvus 2.6 simplifiera considérablement ce flux de travail grâce à une nouvelle interface de <strong>fonction</strong> qui intègre des modèles d'intégration tiers directement dans votre pipeline de données. Cela permet de rationaliser votre pipeline de recherche vectorielle en un seul appel.</p>
<p>Au lieu de pré-calculer les embeddings, vous pourrez :</p>
<ol>
<li><p><strong>Insérer directement des données brutes</strong>: Soumettre du texte, des images ou d'autres contenus à Milvus.</p></li>
<li><p><strong>Configurer les fournisseurs d'intégration pour la vectorisation</strong>: Milvus peut se connecter à des services de modèles d'intégration tels que OpenAI, AWS Bedrock, Google Vertex AI et Hugging Face.</p></li>
<li><p><strong>Effectuer des requêtes en langage naturel</strong>: Recherche à l'aide de requêtes textuelles, et non d'incorporations vectorielles.</p></li>
</ol>
<p>Cela créera une expérience rationalisée de "données entrantes, données sortantes" où Milvus gère la génération de vecteurs en interne, ce qui rendra le code de votre application plus simple.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Évolution de l'architecture : Évolution vers des centaines de milliards de vecteurs<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Une bonne base de données ne se contente pas d'avoir de grandes fonctionnalités, elle doit également fournir ces fonctionnalités à grande échelle, testées en production.</p>
<p>Milvus 2.6 introduira une modification architecturale fondamentale qui permettra une mise à l'échelle rentable à des centaines de milliards de vecteurs. Il s'agit d'une nouvelle architecture de stockage étagée chaud-froid qui gère intelligemment le placement des données en fonction des schémas d'accès, en déplaçant automatiquement les données chaudes vers la mémoire/le disque dur haute performance tout en plaçant les données froides dans un stockage d'objets plus économique. Cette approche permet de réduire considérablement les coûts tout en maintenant les performances des requêtes là où elles sont les plus importantes.</p>
<p>En outre, un nouveau <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">nœud de streaming</a> permettra le traitement vectoriel en temps réel avec une intégration directe aux plateformes de streaming telles que Kafka et Pulsar et le <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a> nouvellement créé, rendant les nouvelles données immédiatement consultables sans délai de traitement par lots.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Restez à l'écoute de Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 est actuellement en développement actif et sera disponible en juin. Nous sommes ravis de vous apporter ces optimisations de performances révolutionnaires, ces capacités de recherche avancées et une nouvelle architecture pour vous aider à créer des applications d'IA évolutives à moindre coût.</p>
<p>En attendant, nous vous invitons à nous faire part de vos commentaires sur ces fonctionnalités à venir. Qu'est-ce qui vous enthousiasme le plus ? Quelles fonctionnalités auraient le plus d'impact sur vos applications ? Participez à la conversation sur notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou suivez nos progrès sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Vous souhaitez être le premier à être informé de la sortie de Milvus 2.6 ? Suivez-nous sur<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> ou<a href="https://twitter.com/milvusio"> X</a> pour obtenir les dernières mises à jour.</p>
