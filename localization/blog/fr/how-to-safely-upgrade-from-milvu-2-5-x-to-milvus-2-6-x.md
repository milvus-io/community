---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Comment passer en toute sécurité de Milvus 2.5.x à Milvus 2.6.x ?
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Découvrez les nouveautés de Milvus 2.6, notamment les changements
  d'architecture et les principales fonctionnalités, et apprenez comment
  effectuer une mise à niveau à partir de Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> est en ligne depuis un certain temps et s'avère être une avancée solide pour le projet. Cette version apporte une architecture affinée, des performances en temps réel plus élevées, une consommation de ressources plus faible et un comportement de mise à l'échelle plus intelligent dans les environnements de production. Bon nombre de ces améliorations ont été façonnées directement par les commentaires des utilisateurs, et les premiers utilisateurs de la version 2.6.x ont déjà fait état d'une recherche nettement plus rapide et de performances système plus prévisibles dans le cadre de charges de travail lourdes ou dynamiques.</p>
<p>Pour les équipes qui utilisent Milvus 2.5.x et qui envisagent de passer à 2.6.x, ce guide est le point de départ. Il décompose les différences architecturales, met en évidence les capacités clés introduites dans Milvus 2.6 et fournit un chemin de mise à niveau pratique, étape par étape, conçu pour minimiser les perturbations opérationnelles.</p>
<p>Si vos charges de travail impliquent des pipelines en temps réel, des recherches multimodales ou hybrides, ou des opérations vectorielles à grande échelle, ce blog vous aidera à évaluer si 2.6 correspond à vos besoins et, si vous décidez de poursuivre, à effectuer la mise à niveau en toute confiance tout en maintenant l'intégrité des données et la disponibilité des services.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Modifications de l'architecture de Milvus 2.5 à Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans le workflow de mise à niveau proprement dit, commençons par comprendre comment l'architecture Milvus change dans Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Architecture de Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de Milvus 2.5</span> </span></p>
<p>Dans Milvus 2.5, les flux de travail en continu et par lots étaient imbriqués sur plusieurs nœuds de travail :</p>
<ul>
<li><p><strong>QueryNode gé</strong> rait à la fois les requêtes historiques <em>et les</em> requêtes incrémentielles (en continu).</p></li>
<li><p>Le<strong>nœud de données (DataNode)</strong> gérait à la fois la vidange au moment de l'ingestion <em>et le</em> compactage en arrière-plan des données historiques.</p></li>
</ul>
<p>Ce mélange de logique de traitement par lots et de logique en temps réel a rendu difficile la mise à l'échelle indépendante des charges de travail par lots. Cela signifiait également que l'état de streaming était dispersé entre plusieurs composants, ce qui introduisait des retards de synchronisation, compliquait la reprise sur panne et augmentait la complexité opérationnelle.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Architecture de Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de Milvus 2.6</span> </span></p>
<p>Milvus 2.6 introduit un <strong>StreamingNode</strong> dédié qui prend en charge toutes les responsabilités liées aux données en temps réel : consommation de la file d'attente de messages, écriture de segments incrémentiels, service de requêtes incrémentielles et gestion de la reprise basée sur WAL. Le streaming étant isolé, les autres composants ont des rôles plus clairs et plus ciblés :</p>
<ul>
<li><p><strong>QueryNode</strong> <em>ne</em> traite <em>plus que les</em> requêtes par lots sur les segments historiques.</p></li>
<li><p>Le<strong>DataNode</strong> <em>ne</em> gère <em>plus que les</em> tâches liées aux données historiques, telles que le compactage et la création d'index.</p></li>
</ul>
<p>Le StreamingNode absorbe toutes les tâches liées à la diffusion en continu qui étaient réparties entre le DataNode, le QueryNode et même le Proxy dans Milvus 2.5, ce qui apporte de la clarté et réduit le partage d'états entre les rôles.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x : Comparaison composant par composant</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Ce qui a changé</strong></th></tr>
</thead>
<tbody>
<tr><td>Services de coordination</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (ou MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">La gestion des métadonnées et la planification des tâches sont regroupées dans un seul MixCoord, ce qui simplifie la logique de coordination et réduit la complexité distribuée.</td></tr>
<tr><td>Couche d'accès</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Les demandes d'écriture sont acheminées uniquement par le nœud de streaming pour l'ingestion des données.</td></tr>
<tr><td>Nœuds de travail</td><td style="text-align:center">-</td><td style="text-align:center">Nœud de streaming</td><td style="text-align:center">Nœud de traitement en continu dédié, responsable de toute la logique incrémentale (segments croissants), y compris:- l'ingestion de données incrémentales- l'interrogation de données incrémentales- la persistance de données incrémentales dans le stockage d'objets- les écritures basées sur le flux- la reprise sur défaillance basée sur WAL.</td></tr>
<tr><td></td><td style="text-align:center">Nœud de requête</td><td style="text-align:center">Nœud de requête</td><td style="text-align:center">Nœud de traitement par lots qui traite les requêtes portant uniquement sur des données historiques.</td></tr>
<tr><td></td><td style="text-align:center">Nœud de données</td><td style="text-align:center">Nœud de données</td><td style="text-align:center">Nœud de traitement par lots responsable des données historiques uniquement, y compris le compactage et la construction de l'index.</td></tr>
<tr><td></td><td style="text-align:center">Nœud d'index</td><td style="text-align:center">-</td><td style="text-align:center">Le nœud d'index est fusionné avec le nœud de données, ce qui simplifie la définition des rôles et la topologie du déploiement.</td></tr>
</tbody>
</table>
<p>En bref, Milvus 2.6 trace une ligne claire entre les charges de travail en continu et par lots, éliminant l'enchevêtrement des composants vu dans la version 2.5 et créant une architecture plus évolutive et plus facile à maintenir.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Caractéristiques principales de Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant d'aborder le processus de mise à niveau, voici un bref aperçu de ce que Milvus 2.6 apporte. <strong>Cette version se concentre sur la réduction des coûts d'infrastructure, l'amélioration des performances de recherche et la mise à l'échelle plus aisée des charges de travail d'IA dynamiques de grande taille.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Améliorations des coûts et de l'efficacité</h3><ul>
<li><p><strong>Quantification</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>pour les index primaires</strong> - Une nouvelle méthode de quantification sur 1 bit qui compresse les index vectoriels à <strong>1/32</strong> de leur taille d'origine. Combinée avec le reranking SQ8, elle réduit l'utilisation de la mémoire à ~28%, augmente le QPS de 4×, et maintient un rappel de ~95%, réduisant de manière significative les coûts matériels.</p></li>
<li><p><strong>Recherche plein texte</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>optimisée par BM25</strong></a> - Notation native BM25 alimentée par des vecteurs de poids de termes épars. La recherche par mot-clé est <strong>3-4× plus rapide</strong> (jusqu'à <strong>7×</strong> sur certains ensembles de données) par rapport à Elasticsearch, tout en maintenant la taille de l'index à environ un tiers des données textuelles d'origine.</p></li>
<li><p><strong>Indexation des chemins JSON avec déchiquetage JSON</strong> - Le filtrage structuré sur JSON imbriqué est désormais beaucoup plus rapide et prévisible. Les chemins JSON pré-indexés réduisent la latence du filtre de <strong>140 ms → 1,5 ms</strong> (P99 : <strong>480 ms → 10 ms</strong>), ce qui rend la recherche vectorielle hybride + le filtrage des métadonnées nettement plus réactifs.</p></li>
<li><p><strong>Support étendu des types de données</strong> - Ajout des types de vecteurs Int8, des champs <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">géométriques</a> (POINT / LINESTRING / POLYGON), et des tableaux de structures (Array-of-Structs). Ces extensions prennent en charge les charges de travail géospatiales, une modélisation plus riche des métadonnées et des schémas plus propres.</p></li>
<li><p><strong>Upsert pour les mises à jour partielles</strong> - Vous pouvez désormais insérer ou mettre à jour des entités à l'aide d'un seul appel de clé primaire. Les mises à jour partielles ne modifient que les champs fournis, ce qui réduit l'amplification de l'écriture et simplifie les pipelines qui actualisent fréquemment les métadonnées ou les embeddings.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Améliorations de la recherche et de l'extraction</h3><ul>
<li><p><strong>Amélioration du traitement du texte et de la prise en charge multilingue :</strong> Les nouveaux tokenizers Lindera et ICU améliorent le traitement des textes japonais, coréens et <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">multilingues</a>. Jieba prend désormais en charge les dictionnaires personnalisés. <code translate="no">run_analyzer</code> permet de déboguer le comportement de la symbolisation et les analyseurs multilingues garantissent une recherche cohérente entre les langues.</p></li>
<li><p><strong>Correspondance de texte de haute précision :</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Phrase Match</a> applique des requêtes de phrases ordonnées avec une marge configurable. Le nouvel index <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> accélère les requêtes de sous-chaînes et <code translate="no">LIKE</code> sur les champs VARCHAR et les chemins d'accès JSON, ce qui permet une correspondance partielle et floue rapide.</p></li>
<li><p><strong>Reranking tenant compte du temps et des métadonnées :</strong> Les <a href="https://milvus.io/docs/decay-ranker-overview.md">Rankers Decay</a> (exponentiel, linéaire, gaussien) ajustent les scores à l'aide des horodatages ; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">les Rankers Boost</a> appliquent des règles basées sur les métadonnées pour promouvoir ou rétrograder les résultats. Ces deux types d'outils permettent d'affiner le comportement de recherche sans modifier les données sous-jacentes.</p></li>
<li><p><strong>Intégration simplifiée des modèles et vectorisation automatique :</strong> Les intégrations intégrées avec OpenAI, Hugging Face et d'autres fournisseurs d'intégration permettent à Milvus de vectoriser automatiquement le texte pendant les opérations d'insertion et d'interrogation. Finis les pipelines d'intégration manuels pour les cas d'utilisation courants.</p></li>
<li><p><strong>Mises à jour du schéma en ligne pour les champs scalaires :</strong> Ajoutez de nouveaux champs scalaires aux collections existantes sans temps d'arrêt ni rechargement, ce qui simplifie l'évolution du schéma au fur et à mesure que les besoins en métadonnées augmentent.</p></li>
<li><p><strong>Détection des quasi-doublons avec MinHash :</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH permet une détection efficace des quasi-doublons dans les grands ensembles de données sans comparaisons exactes coûteuses.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Mises à jour de l'architecture et de l'évolutivité</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Stockage hiérarchisé</strong></a> <strong>pour la gestion des données chaudes et froides :</strong> Séparation des données chaudes et froides entre SSD et stockage d'objets ; prise en charge du chargement paresseux et partiel ; élimination du besoin de charger entièrement les collections localement ; réduction de l'utilisation des ressources jusqu'à 50 % et accélération des temps de chargement pour les grands ensembles de données.</p></li>
<li><p><strong>Service de streaming en temps réel :</strong> Ajoute des nœuds de streaming dédiés intégrés à Kafka/Pulsar pour une ingestion continue ; permet une indexation immédiate et une disponibilité des requêtes ; améliore le débit d'écriture et accélère la récupération des pannes pour les charges de travail en temps réel et en évolution rapide.</p></li>
<li><p><strong>Évolutivité et stabilité améliorées :</strong> Milvus prend désormais en charge plus de 100 000 collections pour les grands environnements multi-locataires. Les mises à niveau de l'infrastructure - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL sans disque), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (IOPS/mémoire réduits) et <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - améliorent la stabilité des clusters et permettent une évolution prévisible en cas de charges de travail importantes.</p></li>
</ul>
<p>Pour une liste complète des fonctionnalités de Milvus 2.6, consultez les <a href="https://milvus.io/docs/release_notes.md">notes de mise à jour de Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Comment passer de Milvus 2.5.x à Milvus 2.6.x ?<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour que le système reste aussi disponible que possible pendant la mise à niveau, les clusters Milvus 2.5 doivent être mis à niveau vers Milvus 2.6 dans l'ordre suivant.</p>
<p><strong>1. Démarrer le nœud de streaming en premier</strong></p>
<p>Démarrer le nœud de streaming à l'avance. Le nouveau <strong>Delegator</strong> (le composant du nœud de requête responsable du traitement des données en continu) doit être déplacé vers le nœud de streaming Milvus 2.6.</p>
<p><strong>2. Mise à niveau de MixCoord</strong></p>
<p>Mettre à niveau les composants du coordinateur vers <strong>MixCoord</strong>. Au cours de cette étape, MixCoord doit détecter les versions des nœuds de travailleur afin de gérer la compatibilité entre les versions au sein du système distribué.</p>
<p><strong>3. Mise à niveau du nœud de requête</strong></p>
<p>Les mises à niveau du nœud de requête prennent généralement plus de temps. Pendant cette phase, les nœuds de données et les nœuds d'index de Milvus 2.5 peuvent continuer à traiter des opérations telles que le flush et la construction d'index, ce qui permet de réduire la pression côté requête pendant la mise à niveau des nœuds de requête.</p>
<p><strong>4. Mise à niveau du nœud de données</strong></p>
<p>Une fois que les nœuds de données Milvus 2.5 sont mis hors ligne, les opérations de rinçage deviennent indisponibles et les données dans les segments en croissance peuvent continuer à s'accumuler jusqu'à ce que tous les nœuds soient entièrement mis à niveau vers Milvus 2.6.</p>
<p><strong>5. Mise à niveau du serveur mandataire</strong></p>
<p>Après la mise à niveau d'un serveur mandataire vers Milvus 2.6, les opérations d'écriture sur ce serveur mandataire resteront indisponibles jusqu'à ce que tous les composants du cluster soient mis à niveau vers 2.6.</p>
<p><strong>6. Suppression du nœud d'index</strong></p>
<p>Une fois que tous les autres composants ont été mis à niveau, le nœud d'index autonome peut être supprimé en toute sécurité.</p>
<p><strong>Notes :</strong></p>
<ul>
<li><p>Entre la fin de la mise à niveau du DataNode et la fin de la mise à niveau du Proxy, les opérations de Flush ne sont pas disponibles.</p></li>
<li><p>Entre le moment où le premier serveur mandataire est mis à niveau et celui où tous les nœuds mandataires sont mis à niveau, certaines opérations d'écriture sont indisponibles.</p></li>
<li><p><strong>Lors de la mise à niveau directe de Milvus 2.5.x vers 2.6.6, les opérations DDL (Data Definition Language) sont indisponibles pendant le processus de mise à niveau en raison des modifications apportées au cadre DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Comment passer à Milvus 2.6 avec Milvus Operator ?<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Oper</a> ator est un opérateur Kubernetes open-source qui offre un moyen évolutif et hautement disponible de déployer, gérer et mettre à niveau l'ensemble de la pile de services Milvus sur un cluster Kubernetes cible. La pile de services Milvus gérée par l'opérateur comprend :</p>
<ul>
<li><p>Les composants principaux de Milvus</p></li>
<li><p>Les dépendances requises telles que etcd, Pulsar et MinIO.</p></li>
</ul>
<p>Milvus Operator suit le modèle standard d'opérateur Kubernetes. Il introduit une ressource personnalisée Milvus (CR) qui décrit l'état souhaité d'un cluster Milvus, tel que sa version, sa topologie et sa configuration.</p>
<p>Un contrôleur surveille en permanence le cluster et rapproche l'état réel de l'état souhaité défini dans la CR. Lorsque des modifications sont apportées (par exemple, la mise à niveau de la version de Milvus), l'opérateur les applique automatiquement d'une manière contrôlée et reproductible, ce qui permet des mises à niveau automatisées et une gestion continue du cycle de vie.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Exemple de ressource personnalisée (CR) Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Mises à niveau progressives de Milvus 2.5 à 2.6 avec Milvus Operator</h3><p>Milvus Operator fournit une prise en charge intégrée des <strong>mises à niveau roulantes de Milvus 2.5 à 2.6</strong> en mode cluster, en adaptant son comportement pour tenir compte des modifications architecturales introduites dans la version 2.6.</p>
<p><strong>1. Détection du scénario de mise à niveau</strong></p>
<p>Lors d'une mise à niveau, Milvus Operator détermine la version cible de Milvus à partir de la spécification du cluster. Pour ce faire, il peut</p>
<ul>
<li><p>inspectant la balise d'image définie à l'adresse <code translate="no">spec.components.image</code>, ou</p></li>
<li><p>en lisant la version explicite spécifiée dans <code translate="no">spec.components.version</code></p></li>
</ul>
<p>L'opérateur compare ensuite cette version souhaitée avec la version en cours d'exécution, qui est enregistrée sur <code translate="no">status.currentImage</code> ou <code translate="no">status.currentVersion</code>. Si la version en cours est 2.5 et la version souhaitée 2.6, l'opérateur identifie la mise à niveau comme un scénario de mise à niveau 2.5 → 2.6.</p>
<p><strong>2. Ordre d'exécution de la mise à niveau progressive</strong></p>
<p>Lorsqu'une mise à niveau 2.5 → 2.6 est détectée et que le mode de mise à niveau est défini sur la mise à niveau continue (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, qui est la valeur par défaut), Milvus Operator exécute automatiquement la mise à niveau dans un ordre prédéfini aligné sur l'architecture Milvus 2.6 :</p>
<p>Démarrer le nœud de streaming → Mettre à niveau MixCoord → Mettre à niveau le nœud de requête → Mettre à niveau le nœud de données → Mettre à niveau le proxy → Supprimer le nœud d'index.</p>
<p><strong>3. Consolidation automatique des coordinateurs</strong></p>
<p>Milvus 2.6 remplace plusieurs composants de coordinateur par un seul MixCoord. Milvus Operator gère automatiquement cette transition architecturale.</p>
<p>Lorsque <code translate="no">spec.components.mixCoord</code> est configuré, l'opérateur lance MixCoord et attend qu'il soit prêt. Une fois que MixCoord est pleinement opérationnel, l'opérateur arrête progressivement les anciens composants de coordination - RootCoord, QueryCoord et DataCoord - achevant ainsi la migration sans nécessiter d'intervention manuelle.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Etapes de mise à niveau de Milvus 2.5 à 2.6</h3><p>1. mettre à niveau Milvus Operator vers la dernière version (dans ce guide, nous utilisons la <strong>version 1.3.3</strong>, qui était la dernière version au moment de la rédaction).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2. fusionner les composants du coordinateur</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. s'assurer que le cluster exécute Milvus 2.5.16 ou une version ultérieure</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. mettre à niveau Milvus vers la version 2.6.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Comment passer à Milvus 2.6 avec Helm ?<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors du déploiement de Milvus à l'aide de Helm, toutes les ressources Kubernetes <code translate="no">Deployment</code> sont mises à jour en parallèle, sans ordre d'exécution garanti. Par conséquent, Helm n'offre pas de contrôle strict sur les séquences de mise à niveau en continu entre les composants. Pour les environnements de production, l'utilisation de Milvus Operator est donc fortement recommandée.</p>
<p>Milvus peut toujours être mis à niveau de 2.5 à 2.6 à l'aide de Helm en suivant les étapes ci-dessous.</p>
<p>Configuration requise</p>
<ul>
<li><p><strong>Version de Helm :</strong> ≥ 3.14.0</p></li>
<li><p><strong>Version de Kubernetes :</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Mettre à jour la carte Milvus Helm vers la dernière version. Dans ce guide, nous utilisons la <strong>version 5.0.7</strong>, qui était la plus récente au moment de la rédaction.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2 Si le cluster est déployé avec plusieurs composants de coordinateur, mettez d'abord à niveau Milvus vers la version 2.5.16 ou ultérieure et activez MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3. mettre à niveau Milvus vers la version 2.6.</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">FAQ sur la mise à niveau et les opérations de Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1 : Milvus Helm vs. Milvus Operator - lequel dois-je utiliser ?</h3><p>Pour les environnements de production, Milvus Operator est fortement recommandé.</p>
<p>Se référer au guide officiel pour plus de détails <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">: https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2 : Comment choisir une file d'attente de messages (MQ) ?</h3><p>Le MQ recommandé dépend du mode de déploiement et des exigences opérationnelles :</p>
<p><strong>1. Mode autonome :</strong> Pour les déploiements sensibles aux coûts, il est recommandé d'utiliser RocksMQ.</p>
<p><strong>2. Mode cluster</strong></p>
<ul>
<li><p><strong>Pulsar</strong> prend en charge le multi-tenant, permet aux grands clusters de partager l'infrastructure et offre une forte évolutivité horizontale.</p></li>
<li><p><strong>Kafka</strong> dispose d'un écosystème plus mature, avec des offres SaaS gérées disponibles sur la plupart des grandes plateformes cloud.</p></li>
</ul>
<p><strong>3. Woodpecker (introduit dans Milvus 2.6) :</strong> Woodpecker supprime la nécessité d'une file d'attente de messages externe, réduisant ainsi les coûts et la complexité opérationnelle.</p>
<ul>
<li><p>Actuellement, seul le mode Woodpecker intégré, léger et facile à utiliser, est pris en charge.</p></li>
<li><p>Pour les déploiements autonomes de Milvus 2.6, Woodpecker est recommandé.</p></li>
<li><p>Pour les déploiements de clusters de production, il est recommandé d'utiliser le mode cluster Woodpecker dès qu'il sera disponible.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">Q3 : Peut-on changer la file d'attente des messages pendant une mise à niveau ?</h3><p>Non. Le basculement de la file d'attente des messages au cours d'une mise à niveau n'est pas pris en charge actuellement. Les prochaines versions introduiront des API de gestion qui permettront de passer de Pulsar à Kafka, Woodpecker et RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4 : Les configurations de limitation de débit doivent-elles être mises à jour pour Milvus 2.6 ?</h3><p>Non. Les configurations de limitation de débit existantes restent efficaces et s'appliquent également au nouveau nœud de streaming. Aucune modification n'est nécessaire.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5 : Après la fusion des coordinateurs, les rôles ou les configurations de surveillance changent-ils ?</h3><ul>
<li><p>Les rôles de surveillance restent inchangés (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Les options de configuration existantes continuent de fonctionner comme avant.</p></li>
<li><p>Une nouvelle option de configuration, <code translate="no">mixCoord.enableActiveStandby</code>, est introduite et reviendra à <code translate="no">rootcoord.enableActiveStandby</code> si elle n'est pas explicitement définie.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6 : Quels sont les paramètres de ressources recommandés pour StreamingNode ?</h3><ul>
<li><p>Pour l'ingestion en temps réel légère ou les charges de travail occasionnelles d'écriture et de recherche, une configuration plus petite, telle que 2 cœurs de CPU et 8 Go de mémoire, est suffisante.</p></li>
<li><p>Pour l'ingestion en temps réel lourde ou les charges de travail d'écriture et de recherche continues, il est recommandé d'allouer des ressources comparables à celles du nœud de requête.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7 : Comment mettre à niveau un déploiement autonome utilisant Docker Compose ?</h3><p>Pour les déploiements autonomes basés sur Docker Compose, il suffit de mettre à jour la balise d'image Milvus dans <code translate="no">docker-compose.yaml</code>.</p>
<p>Pour plus de détails, consultez le guide officiel <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">: https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 marque une amélioration majeure à la fois de l'architecture et des opérations. En séparant le traitement en continu et le traitement par lots avec l'introduction de StreamingNode, en consolidant les coordinateurs dans MixCoord et en simplifiant les rôles des travailleurs, Milvus 2.6 fournit une base plus stable, plus évolutive et plus facile à exploiter pour les charges de travail vectorielles à grande échelle.</p>
<p>Ces changements architecturaux rendent les mises à niveau, en particulier à partir de Milvus 2.5, plus sensibles à l'ordre. Une mise à niveau réussie dépend du respect des dépendances des composants et des contraintes de disponibilité temporaire. Pour les environnements de production, Milvus Operator est l'approche recommandée, car il automatise le séquençage des mises à niveau et réduit le risque opérationnel, tandis que les mises à niveau basées sur Helm sont mieux adaptées aux cas d'utilisation hors production.</p>
<p>Avec des fonctionnalités de recherche améliorées, des types de données plus riches, un stockage hiérarchisé et des options de file d'attente de messages améliorées, Milvus 2.6 est bien placé pour prendre en charge les applications d'IA modernes qui nécessitent une ingestion en temps réel, des performances de requête élevées et des opérations efficaces à l'échelle.</p>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Plus de ressources sur Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/release_notes.md">Notes de mise à jour de Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Enregistrement du webinaire Milvus 2.6 : Recherche plus rapide, coûts réduits et mise à l'échelle plus intelligente</a></p></li>
<li><p>Blogs sur les fonctionnalités de Milvus 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d'intégration : Comment Milvus 2.6 rationalise la vectorisation et la recherche sémantique</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Déchiquetage JSON dans Milvus : Filtrage JSON 88,9 fois plus rapide et flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Déverrouiller la véritable recherche au niveau de l'entité : Nouvelles fonctionnalités Array-of-Structs et MAX_SIM dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Ne plus payer pour des données froides : Réduction de 80 % des coûts grâce au chargement à la demande de données chaudes et froides dans le stockage hiérarchisé de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introduction d'AISAQ dans Milvus : la recherche vectorielle à l'échelle du milliard vient d'être 3 200 fois moins coûteuse en mémoire</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimisation de NVIDIA CAGRA dans Milvus : une approche hybride GPU-CPU pour une indexation plus rapide et des requêtes moins coûteuses</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Présentation de l'index Milvus Ngram : Correspondance plus rapide des mots clés et requêtes LIKE pour les charges de travail des agents</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Rapprochement du filtrage géospatial et de la recherche vectorielle avec les champs géométriques et RTREE dans Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans tuer le rappel</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus - voici ce qui s'est passé</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données d'entraînement LLM</a></p></li>
</ul></li>
</ul>
