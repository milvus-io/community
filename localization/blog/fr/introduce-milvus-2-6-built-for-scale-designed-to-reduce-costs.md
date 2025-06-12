---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: >-
  Présentation de Milvus 2.6 : Recherche vectorielle abordable à l'échelle du
  milliard
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Nous sommes heureux d'annoncer que Milvus 2.6 est désormais disponible. Cette
  version présente des dizaines de fonctionnalités qui répondent directement aux
  défis les plus pressants de la recherche vectorielle aujourd'hui - s'adapter
  efficacement tout en gardant les coûts sous contrôle.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>Alors que la recherche alimentée par l'IA est passée du stade de projet expérimental à celui d'infrastructure critique, les exigences en matière de <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de données vectorielles</a> se sont intensifiées. Les organisations doivent gérer des milliards de vecteurs tout en gérant les coûts d'infrastructure, en prenant en charge l'ingestion de données en temps réel et en fournissant une recherche sophistiquée allant au-delà de la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités de</a> base. Pour relever ces défis en constante évolution, nous avons travaillé d'arrache-pied au développement et à l'amélioration de Milvus. La réponse de la communauté a été incroyablement encourageante, avec des commentaires précieux qui nous ont aidés à définir notre orientation.</p>
<p>Après des mois de développement intensif, nous sommes heureux d'annoncer que <strong>Milvus 2.6 est désormais disponible</strong>. Cette version répond directement aux défis les plus pressants de la recherche vectorielle aujourd'hui : une <strong><em>mise à l'échelle efficace tout en maîtrisant les coûts.</em></strong></p>
<p>Milvus 2.6 propose des innovations révolutionnaires dans trois domaines essentiels : la <strong>réduction des coûts, les capacités de recherche avancées et les améliorations architecturales pour une mise à l'échelle massive</strong>. Les résultats parlent d'eux-mêmes :</p>
<ul>
<li><p><strong>72 % de réduction de la mémoire</strong> grâce à la quantification à 1 bit RaBitQ, tout en offrant des requêtes quatre fois plus rapides</p></li>
<li><p><strong>50% de réduction des coûts</strong> grâce à un stockage intelligent à plusieurs niveaux</p></li>
<li><p><strong>Recherche plein texte 4x plus rapide</strong> qu'Elasticsearch avec notre implémentation BM25 améliorée</p></li>
<li><p>Filtrage JSON<strong>100 fois plus rapide</strong> avec le Path Index nouvellement introduit</p></li>
<li><p><strong>La fraîcheur de la recherche est obtenue de manière économique</strong> grâce à la nouvelle architecture zéro disque.</p></li>
<li><p><strong>Flux de travail d'intégration rationalisé</strong> avec la nouvelle expérience "data in and data out".</p></li>
<li><p><strong>Jusqu'à 100 000 collections dans un seul cluster</strong> pour une multi-location à l'épreuve du temps.</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Innovations pour la réduction des coûts : Rendre la recherche vectorielle abordable<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>La consommation de mémoire représente l'un des plus grands défis lors de l'extension de la recherche vectorielle à des milliards d'enregistrements. Milvus 2.6 introduit plusieurs optimisations clés qui réduisent considérablement vos coûts d'infrastructure tout en améliorant les performances.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">Quantification à 1 bit RaBitQ : Réduction de 72 % de la mémoire avec des performances 4×</h3><p>Les méthodes de quantification traditionnelles vous obligent à troquer la qualité de la recherche contre des économies de mémoire. Milvus 2.6 change la donne avec la <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantification 1 bit RaBitQ</a> combinée à un mécanisme de raffinement intelligent.</p>
<p>Le nouvel index IVF_RABITQ comprime l'index principal à 1/32 de sa taille d'origine grâce à une quantification sur 1 bit. Utilisée avec un raffinement SQ8 optionnel, cette approche maintient une qualité de recherche élevée (95% de rappel) en utilisant seulement 1/4 de l'empreinte mémoire d'origine.</p>
<p>Nos tests préliminaires révèlent des résultats prometteurs :</p>
<table>
<thead>
<tr><th><strong>Mesure de performance</strong></th><th><strong>Traditionnel IVF_FLAT</strong></th><th><strong>RaBitQ (1 bit) uniquement</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Affiner</strong></th></tr>
</thead>
<tbody>
<tr><td>Empreinte mémoire</td><td>100% (ligne de base)</td><td>3% (97% de réduction)</td><td>28% (72% de réduction)</td></tr>
<tr><td>Rappel</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Débit de recherche (QPS)</td><td>236</td><td>648 (2,7 fois plus rapide)</td><td>946 (4 fois plus rapide)</td></tr>
</tbody>
</table>
<p><em>Tableau : Évaluation de VectorDBBench avec 1M de vecteurs de 768 dimensions, testé sur AWS m6id.2xlarge</em></p>
<p>La véritable avancée ici n'est pas seulement la réduction de 72 % de la mémoire, mais le fait d'y parvenir tout en améliorant le débit de 4 fois. Cela signifie que vous pouvez servir la même charge de travail avec 75 % de serveurs en moins ou gérer 4 fois plus de trafic sur votre infrastructure existante, le tout sans sacrifier le rappel.</p>
<p>Pour les entreprises qui utilisent Milvus entièrement géré sur<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, nous développons une stratégie automatisée qui ajuste dynamiquement les paramètres RaBitQ en fonction des caractéristiques de la charge de travail et des exigences de précision. Vous bénéficierez simplement d'une meilleure rentabilité sur tous les types d'UC de Zilliz Cloud.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Stockage hiérarchisé chaud-froid : Réduction des coûts de 50 % grâce à un placement intelligent des données</h3><p>Les charges de travail de recherche vectorielle dans le monde réel contiennent des données avec des schémas d'accès très différents. Les données fréquemment consultées nécessitent une disponibilité instantanée, tandis que les données d'archivage peuvent tolérer une latence légèrement plus élevée en échange de coûts de stockage nettement inférieurs.</p>
<p>Milvus 2.6 introduit une architecture de stockage à plusieurs niveaux qui classe automatiquement les données en fonction des schémas d'accès et les place dans les niveaux de stockage appropriés :</p>
<ul>
<li><p><strong>Classification intelligente des données</strong>: Milvus identifie automatiquement les segments de données chauds (fréquemment accédés) et froids (rarement accédés) en fonction des schémas d'accès.</p></li>
<li><p><strong>Placement optimisé du stockage</strong>: Les données chaudes restent dans la mémoire/le disque dur haute performance, tandis que les données froides sont déplacées vers un stockage objet plus économique.</p></li>
<li><p><strong>Déplacement dynamique des données</strong>: Au fur et à mesure que les schémas d'utilisation changent, les données migrent automatiquement d'un niveau à l'autre.</p></li>
<li><p><strong>Récupération transparente</strong>: Lorsque les requêtes touchent des données froides, celles-ci sont automatiquement chargées à la demande.</p></li>
</ul>
<p>Il en résulte une réduction des coûts de stockage pouvant aller jusqu'à 50 %, tout en maintenant les performances des requêtes pour les données actives.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Optimisations supplémentaires des coûts</h3><p>Milvus 2.6 introduit également la prise en charge du vecteur Int8 pour les index HNSW, le format Storage v2 pour une structure optimisée qui réduit les exigences en matière d'IOPS et de mémoire, et une installation plus facile directement via les gestionnaires de paquets APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Capacités de recherche avancées : Au-delà de la similarité vectorielle de base<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche vectorielle seule n'est pas suffisante pour les applications modernes d'intelligence artificielle. Les utilisateurs exigent la précision de la recherche d'informations traditionnelle combinée à la compréhension sémantique de l'intégration vectorielle. Milvus 2.6 introduit une suite de fonctions de recherche avancées qui comblent ce fossé.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">Turbocharged BM25 : 400% Faster Full-Text Search Than Elasticsearch (recherche plein texte plus rapide qu'Elasticsearch)</h3><p>La<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">recherche plein texte</a> est devenue essentielle pour construire des systèmes de recherche hybrides dans les bases de données vectorielles. Dans Milvus 2.6, des améliorations significatives des performances ont été apportées à la recherche plein texte, en s'appuyant sur l'implémentation BM25 introduite depuis la version 2.5. Par exemple, cette version introduit de nouveaux paramètres tels que <code translate="no">drop_ratio_search</code> et <code translate="no">dim_max_score_ratio</code>, améliorant la précision et le réglage de la vitesse et offrant des contrôles de recherche plus fins.</p>
<p>Nos analyses comparatives avec l'ensemble de données BEIR standard de l'industrie montrent que Milvus 2.6 atteint un débit de 3 à 4 fois supérieur à celui d'Elasticsearch avec des taux de rappel équivalents. Pour des charges de travail spécifiques, l'amélioration atteint un QPS 7 fois plus élevé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">Index de chemin JSON : Filtrage 100 fois plus rapide</h3><p>Milvus prend en charge le type de données JSON depuis longtemps, mais le filtrage sur les champs JSON était lent en raison de l'absence de prise en charge de l'index. Milvus 2.6 ajoute la prise en charge de l'index de chemin JSON pour augmenter considérablement les performances.</p>
<p>Considérons une base de données de profils d'utilisateurs dans laquelle chaque enregistrement contient des métadonnées imbriquées comme :</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Pour une recherche sémantique "utilisateurs intéressés par l'IA" limitée à San Francisco, Milvus avait l'habitude d'analyser et d'évaluer l'intégralité de l'objet JSON pour chaque enregistrement, ce qui rendait la requête très coûteuse et lente.</p>
<p>Désormais, Milvus vous permet de créer des index sur des chemins spécifiques dans les champs JSON afin d'accélérer la recherche :</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>Lors de nos tests de performance avec plus de 100 millions d'enregistrements, JSON Path Index a réduit la latence du filtre de <strong>140 ms</strong> (P99 : 480 ms) à seulement <strong>1,5 ms</strong> (P99 : 10 ms), soit une réduction de 99 % de la latence qui rend ces recherches pratiques en production.</p>
<p>Cette fonctionnalité est particulièrement utile pour</p>
<ul>
<li><p>les systèmes de recommandation avec filtrage complexe des attributs de l'utilisateur</p></li>
<li><p>les applications RAG qui filtrent les documents en fonction des métadonnées</p></li>
<li><p>Les systèmes multi-locataires où la segmentation des données est essentielle.</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Traitement de texte amélioré et recherche temporelle</h3><p>Milvus 2.6 introduit un pipeline d'analyse de texte entièrement remanié avec un traitement linguistique sophistiqué, comprenant le tokenizer Lindera pour le japonais et le coréen, le tokenizer ICU pour une prise en charge multilingue complète et Jieba amélioré avec intégration de dictionnaires personnalisés.</p>
<p>L<strong>'intelligence de correspondance des phrases</strong> capture les nuances sémantiques dans l'ordre des mots, en faisant la distinction entre les &quot;techniques d'apprentissage automatique&quot; et les &quot;techniques d'apprentissage automatique&quot; :</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Les<strong>fonctions de décroissance temporelle</strong> donnent automatiquement la priorité aux contenus récents en ajustant les scores de pertinence en fonction de l'ancienneté des documents, avec des taux de décroissance et des types de fonctions configurables (exponentielle, gaussienne ou linéaire).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Recherche rationalisée : Expérience de l'entrée et de la sortie des données</h3><p>La déconnexion entre les données brutes et les incorporations vectorielles est un autre point sensible pour les développeurs qui utilisent des bases de données vectorielles. Avant que les données ne parviennent à Milvus pour l'indexation et la recherche vectorielle, elles subissent souvent un prétraitement à l'aide de modèles externes qui convertissent le texte brut, les images ou le son en représentations vectorielles. Après l'extraction, un traitement supplémentaire en aval est également nécessaire, tel que le mappage des ID de résultats au contenu d'origine.</p>
<p>Milvus 2.6 simplifie ces flux de travail d'intégration grâce à la nouvelle interface <strong>Function</strong> qui intègre des modèles d'intégration tiers directement dans votre pipeline de recherche. Au lieu de pré-calculer les intégrations, vous pouvez maintenant :</p>
<ol>
<li><p><strong>Insérer directement des données brutes</strong>: Soumettre du texte, des images ou d'autres contenus à Milvus.</p></li>
<li><p><strong>Configurer les fournisseurs d'intégration</strong>: Se connecter aux services API d'intégration d'OpenAI, d'AWS Bedrock, de Google Vertex AI, de Hugging Face, etc.</p></li>
<li><p><strong>Interrogation en langage naturel</strong>: Effectuez des recherches à l'aide de requêtes textuelles brutes directement</p></li>
</ol>
<p>Cela crée une expérience de "données entrantes, données sortantes" dans laquelle Milvus rationalise toutes les transformations vectorielles en coulisses pour vous.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Évolution architecturale : Passage à l'échelle pour des dizaines de milliards de vecteurs<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduit des innovations architecturales fondamentales qui permettent une mise à l'échelle rentable vers des dizaines de milliards de vecteurs.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Remplacement de Kafka et Pulsar par un nouveau Woodpecker WAL</h3><p>Les déploiements précédents de Milvus s'appuyaient sur des files d'attente de messages externes, telles que Kafka ou Pulsar, en tant que système WAL (Write-Ahead Log). Si ces systèmes fonctionnaient bien au départ, ils introduisaient une complexité opérationnelle et une surcharge de ressources importantes.</p>
<p>Milvus 2.6 introduit <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>, un système WAL spécialement conçu pour le cloud qui élimine ces dépendances externes grâce à une conception révolutionnaire sans disque :</p>
<ul>
<li><p><strong>Tout sur le stockage objet</strong>: Toutes les données de journalisation sont conservées dans un stockage d'objets tel que S3, Google Cloud Storage ou MinIO.</p></li>
<li><p><strong>Métadonnées distribuées</strong>: Les métadonnées sont toujours gérées par le magasin de valeurs clés etcd.</p></li>
<li><p><strong>Pas de dépendance à l'égard des disques locaux</strong>: Un choix pour éliminer l'architecture complexe et la surcharge opérationnelle impliquée dans l'état permanent local distribué.</p></li>
</ul>
<p>Nous avons effectué des tests complets pour comparer les performances de Woodpecker :</p>
<table>
<thead>
<tr><th><strong>Système</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Débit</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Temps de latence</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker atteint régulièrement 60 à 80 % du débit maximal théorique pour chaque backend de stockage, le mode système de fichiers local atteignant 450 Mo/s - 3,5 fois plus rapide que Kafka - et le mode S3 atteignant 750 Mo/s, 5,8 fois plus rapide que Kafka.</p>
<p>Pour plus de détails sur Woodpecker, consultez ce blog : <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par Woodpecker pour Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Fraîcheur de la recherche obtenue de manière économique</h3><p>La recherche critique exige généralement que les données nouvellement ingérées soient instantanément consultables. Milvus 2.6 remplace la dépendance à l'égard des files de messages afin d'améliorer fondamentalement le traitement des mises à jour récentes et d'assurer la fraîcheur de la recherche tout en réduisant les frais généraux liés aux ressources. La nouvelle architecture ajoute le nouveau <strong>nœud de streaming</strong>, un composant dédié qui fonctionne en étroite coordination avec d'autres composants Milvus tels que le nœud de requête et le nœud de données. Le nœud de streaming est construit au-dessus de Woodpecker, notre système WAL (Write-Ahead Log) léger et natif.</p>
<p>Ce nouveau composant permet</p>
<ul>
<li><p><strong>Une grande compatibilité</strong>: Fonctionne avec le nouveau WAL de Woodpecker et est rétrocompatible avec Kafka, Pulsar et d'autres plateformes de streaming.</p></li>
<li><p><strong>Indexation incrémentale</strong>: Les nouvelles données peuvent être recherchées immédiatement, sans délai de traitement par lots.</p></li>
<li><p><strong>Service de requêtes en continu</strong>: ingestion simultanée à haut débit et interrogation à faible latence.</p></li>
</ul>
<p>En isolant la diffusion en continu du traitement par lots, le nœud de diffusion en continu permet à Milvus de maintenir des performances stables et une fraîcheur de recherche même lors de l'ingestion de gros volumes de données. Il est conçu dans une optique d'évolutivité horizontale, avec une mise à l'échelle dynamique de la capacité des nœuds en fonction du débit de données.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Capacité multitenant améliorée : Évolution jusqu'à 100 000 collections par cluster</h3><p>Les déploiements en entreprise nécessitent souvent une isolation au niveau du locataire. Milvus 2.6 augmente considérablement la prise en charge de la multi-location en autorisant jusqu'à <strong>100 000 collections</strong> par cluster. Il s'agit d'une amélioration cruciale pour les organisations qui exploitent un grand cluster monolithique desservant de nombreux locataires.</p>
<p>Cette amélioration est rendue possible par de nombreuses optimisations techniques au niveau de la gestion des métadonnées, de l'allocation des ressources et de la planification des requêtes. Les utilisateurs de Milvus peuvent désormais bénéficier de performances stables même avec des dizaines de milliers de collections.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Autres améliorations</h3><p>Milvus 2.6 propose d'autres améliorations architecturales, telles que CDC + BulkInsert pour une réplication simplifiée des données entre les régions géographiques et Coord Merge pour une meilleure coordination des clusters dans les déploiements à grande échelle.</p>
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
    </button></h2><p>Milvus 2.6 représente un effort d'ingénierie massif avec des dizaines de nouvelles fonctionnalités et d'optimisations des performances, développées en collaboration par les ingénieurs de Zilliz et nos incroyables contributeurs de la communauté. Bien que nous ayons couvert les principales fonctionnalités ici, il y a encore beaucoup à découvrir. Nous vous recommandons vivement de vous plonger dans nos <a href="https://milvus.io/docs/release_notes.md">notes de version</a> complètes pour explorer tout ce que cette version a à offrir !</p>
<p>La documentation complète, les guides de migration et les tutoriels sont disponibles sur le<a href="https://milvus.io/"> site Web de Milvus</a>. Pour les questions et le support de la communauté, rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
