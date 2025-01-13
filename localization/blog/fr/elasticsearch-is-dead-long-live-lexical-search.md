---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch est mort, vive la recherche lexicale !'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>Tout le monde sait désormais que la recherche hybride a amélioré la qualité de la recherche <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation). Bien que la recherche par <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">intégration dense</a> ait montré des capacités impressionnantes à capturer des relations sémantiques profondes entre les requêtes et les documents, elle présente encore des limites notables. Il s'agit notamment d'un manque d'explicabilité et d'une performance sous-optimale pour les requêtes à longue traîne et les termes rares.</p>
<p>De nombreuses applications RAG se heurtent au fait que les modèles pré-entraînés manquent souvent de connaissances spécifiques au domaine. Dans certains scénarios, la simple correspondance de mots-clés BM25 est plus performante que ces modèles sophistiqués. C'est là que la recherche hybride comble le fossé, en combinant la compréhension sémantique de la recherche vectorielle dense avec la précision de la recherche par mot-clé.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Pourquoi la recherche hybride est complexe en production<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Si des frameworks comme <a href="https://zilliz.com/learn/LangChain">LangChain</a> ou <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> facilitent la construction d'un récupérateur hybride de démonstration, le passage à la production avec des ensembles de données massifs est un défi. Les architectures traditionnelles nécessitent des bases de données vectorielles et des moteurs de recherche distincts, ce qui pose plusieurs problèmes majeurs :</p>
<ul>
<li><p>Coûts élevés de maintenance de l'infrastructure et complexité opérationnelle</p></li>
<li><p>Redondance des données entre plusieurs systèmes</p></li>
<li><p>Gestion difficile de la cohérence des données</p></li>
<li><p>Sécurité et contrôle d'accès complexes entre les systèmes</p></li>
</ul>
<p>Le marché a besoin d'une solution unifiée qui prenne en charge la recherche lexicale et sémantique tout en réduisant la complexité et le coût du système.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Les points sensibles d'Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch est l'un des projets de recherche open-source les plus influents de la dernière décennie. Basé sur Apache Lucene, il a gagné en popularité grâce à ses hautes performances, son évolutivité et son architecture distribuée. Bien qu'il ait ajouté la recherche vectorielle ANN dans la version 8.0, les déploiements en production sont confrontés à plusieurs défis majeurs :</p>
<p><strong>Coûts élevés de mise à jour et d'indexation :</strong> L'architecture d'Elasticsearch ne découple pas totalement les opérations d'écriture, la construction d'index et les requêtes. Cela entraîne une surcharge importante du processeur et des E/S lors des opérations d'écriture, en particulier lors des mises à jour en masse. Les conflits de ressources entre l'indexation et l'interrogation ont un impact sur les performances, créant un goulot d'étranglement majeur pour les scénarios de mise à jour à haute fréquence.</p>
<p><strong>Mauvaises performances en temps réel :</strong> En tant que moteur de recherche "quasi temps réel", Elasticsearch introduit une latence notable dans la visibilité des données. Cette latence devient particulièrement problématique pour les applications d'IA, telles que les systèmes d'agents, où les interactions à haute fréquence et la prise de décision dynamique nécessitent un accès immédiat aux données.</p>
<p><strong>Une gestion difficile des nuages de points (Shard Management) :</strong> Bien qu'Elasticsearch utilise le sharding pour l'architecture distribuée, la gestion des shards pose des problèmes importants. L'absence de prise en charge du sharding dynamique crée un dilemme : un trop grand nombre de shards dans de petits ensembles de données entraîne des performances médiocres, tandis qu'un nombre insuffisant de shards dans de grands ensembles de données limite l'évolutivité et entraîne une distribution inégale des données.</p>
<p><strong>Architecture non cloud-native :</strong> Développée avant la généralisation des architectures cloud-natives, la conception d'Elasticsearch associe étroitement le stockage et le calcul, ce qui limite son intégration avec les infrastructures modernes telles que les clouds publics et Kubernetes. La mise à l'échelle des ressources nécessite des augmentations simultanées du stockage et du calcul, ce qui réduit la flexibilité. Dans les scénarios multirépliqués, chaque shard doit construire son index indépendamment, ce qui augmente les coûts de calcul et réduit l'efficacité des ressources.</p>
<p><strong>Mauvaises performances de la recherche vectorielle :</strong> Bien qu'Elasticsearch 8.0 ait introduit la recherche vectorielle ANN, ses performances sont nettement inférieures à celles des moteurs vectoriels dédiés comme Milvus. Basée sur le noyau Lucene, sa structure d'index s'avère inefficace pour les données à haute dimension, et se heurte à des exigences de recherche vectorielle à grande échelle. Les performances deviennent particulièrement instables dans les scénarios complexes impliquant le filtrage scalaire et la multi-location, ce qui rend difficile la prise en charge d'une charge élevée ou de besoins commerciaux diversifiés.</p>
<p><strong>Consommation excessive de ressources :</strong> Elasticsearch sollicite énormément la mémoire et l'unité centrale, en particulier lors du traitement de données à grande échelle. Sa dépendance vis-à-vis de la JVM nécessite de fréquents ajustements de la taille du tas et des réglages du ramassage des ordures, ce qui a un impact considérable sur l'efficacité de la mémoire. Les opérations de recherche vectorielle nécessitent des calculs intensifs optimisés SIMD, pour lesquels l'environnement JVM est loin d'être idéal.</p>
<p>Ces limitations fondamentales deviennent de plus en plus problématiques au fur et à mesure que les entreprises font évoluer leur infrastructure d'intelligence artificielle, ce qui rend Elasticsearch particulièrement difficile pour les applications d'intelligence artificielle modernes nécessitant des performances et une fiabilité élevées.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Introduction de Sparse-BM25 : Réimagination de la recherche lexicale<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> introduit la prise en charge native de la recherche lexicale via Sparse-BM25, en s'appuyant sur les capacités de recherche hybride introduites dans la version 2.4. Cette approche innovante comprend les composants clés suivants :</p>
<ul>
<li><p>Une tokénisation et un prétraitement avancés via Tantivy</p></li>
<li><p>Gestion distribuée du vocabulaire et de la fréquence des termes</p></li>
<li><p>Génération de vecteurs épars à l'aide du TF du corpus et du TF-IDF de la requête</p></li>
<li><p>Prise en charge de l'index inversé avec l'algorithme WAND (Block-Max WAND et prise en charge de l'index graphique en cours de développement).</p></li>
</ul>
<p>Par rapport à Elasticsearch, Milvus offre des avantages significatifs en termes de flexibilité algorithmique. Son calcul de similarité basé sur la distance vectorielle permet une mise en correspondance plus sophistiquée, y compris la mise en œuvre de TW-BERT (Term Weighting BERT) basée sur la recherche "End-to-End Query Term Weighting" (pondération des termes de la requête de bout en bout). Cette approche a démontré des performances supérieures dans les tests in-domain et out-domain.</p>
<p>Un autre avantage crucial est le rapport coût-efficacité. En tirant parti de la compression de l'index inversé et de l'intégration dense, Milvus multiplie par cinq les performances avec une dégradation du rappel inférieure à 1 %. Grâce à l'élagage des termes de queue et à la quantification des vecteurs, l'utilisation de la mémoire a été réduite de plus de 50 %.</p>
<p>L'optimisation des requêtes longues est un point fort. Alors que les algorithmes WAND traditionnels ont du mal à traiter les requêtes longues, Milvus excelle en combinant des encastrements épars avec des indices de graphe, ce qui permet de multiplier par dix les performances dans les scénarios de recherche de vecteurs épars en haute dimension.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus : la base de données vectorielles ultime pour RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est le premier choix pour les applications RAG grâce à son ensemble complet de fonctionnalités. Ses principaux avantages sont les suivants</p>
<ul>
<li><p>Prise en charge de métadonnées riches avec des capacités de schémas dynamiques et des options de filtrage puissantes.</p></li>
<li><p>Une multi-location de niveau entreprise avec une isolation flexible par le biais de collections, de partitions et de clés de partition.</p></li>
<li><p>Prise en charge de l'index vectoriel sur disque, une première dans l'industrie, avec un stockage à plusieurs niveaux, de la mémoire à S3</p></li>
<li><p>Évolutivité native dans le nuage permettant une mise à l'échelle transparente de 10 millions à plus de 1 milliard de vecteurs</p></li>
<li><p>Capacités de recherche complètes, y compris le regroupement, l'étendue et la recherche hybride</p></li>
<li><p>Intégration approfondie de l'écosystème avec LangChain, LlamaIndex, Dify et d'autres outils d'intelligence artificielle.</p></li>
</ul>
<p>Les diverses capacités de recherche du système englobent les méthodologies de regroupement, d'étendue et de recherche hybride. L'intégration approfondie avec des outils tels que LangChain, LlamaIndex et Dify, ainsi que la prise en charge de nombreux produits d'IA, placent Milvus au centre de l'écosystème de l'infrastructure d'IA moderne.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Perspectives d'avenir<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Alors que l'IA passe du POC à la production, Milvus continue d'évoluer. Nous nous efforçons de rendre la recherche vectorielle plus accessible et plus rentable tout en améliorant la qualité de la recherche. Que vous soyez une startup ou une entreprise, Milvus réduit les obstacles techniques au développement d'applications d'IA.</p>
<p>Cet engagement en faveur de l'accessibilité et de l'innovation nous a permis de franchir une nouvelle étape importante. Alors que notre solution open-source continue de servir de base à des milliers d'applications dans le monde entier, nous reconnaissons que de nombreuses organisations ont besoin d'une solution entièrement gérée qui élimine les frais généraux d'exploitation.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud : La solution gérée<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Au cours des trois dernières années, nous avons développé <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un service de base de données vectorielles entièrement géré basé sur Milvus. Grâce à une réimplémentation cloud du protocole Milvus, ce service offre une convivialité, une rentabilité et une sécurité accrues.</p>
<p>S'appuyant sur notre expérience de la maintenance des plus grands clusters de recherche vectorielle au monde et du soutien de milliers de développeurs d'applications d'IA, Zilliz Cloud réduit considérablement les frais généraux et les coûts d'exploitation par rapport aux solutions auto-hébergées.</p>
<p>Prêt à découvrir le futur de la recherche vectorielle ? Commencez votre essai gratuit dès aujourd'hui avec jusqu'à 200 $ de crédits, sans carte de crédit.</p>
