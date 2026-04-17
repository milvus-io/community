---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Produire la recherche sémantique : Comment nous avons construit et mis à
  l'échelle l'infrastructure vectorielle chez Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Découvrez comment Airtable a construit une infrastructure vectorielle
  évolutive basée sur Milvus pour la recherche sémantique, la recherche
  multi-tenant et les expériences d'IA à faible latence.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Cet article a été publié à l'origine sur le</em> <em>canal</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Medium d'Airtable</a></em> <em>et est rediffusé ici avec l'autorisation de l'auteur.</em></p>
<p>Alors que la recherche sémantique chez Airtable évoluait d'un concept à une fonctionnalité de base du produit, l'équipe de l'infrastructure des données a été confrontée au défi de la mettre à l'échelle. Comme détaillé dans notre <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">précédent article sur la construction du système d'intégration</a>, nous avions déjà conçu une couche d'application robuste et cohérente pour gérer le cycle de vie de l'intégration. Mais une pièce essentielle manquait encore à notre schéma d'architecture : la base de données vectorielle elle-même.</p>
<p>Nous avions besoin d'un moteur de stockage capable d'indexer et de servir des milliards d'enregistrements, de supporter une multi-location massive et de maintenir des objectifs de performance et de disponibilité dans un environnement cloud distribué. Voici comment nous avons architecturé, renforcé et fait évoluer notre plateforme de recherche vectorielle pour qu'elle devienne un pilier central de l'infrastructure d'Airtable.</p>
<h2 id="Background" class="common-anchor-header">Contexte<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Chez Airtable, notre objectif est d'aider les clients à travailler avec leurs données de manière puissante et intuitive. Avec l'émergence de LLM de plus en plus puissants et précis, les fonctionnalités qui exploitent la signification sémantique de vos données sont devenues essentielles à notre produit.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Comment nous utilisons la recherche sémantique<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (le chat IA d'Airtable) répond à de vraies questions à partir de grands ensembles de données.</h3><p>Imaginez que vous posiez une question en langage naturel à votre base (base de données) d'un demi-million de lignes et que vous obteniez une réponse correcte et riche en contexte. Par exemple : "Qu'est-ce que les clients pensent de la durée de vie des batteries ?</p>
<p>"Que disent les clients à propos de l'autonomie de la batterie ces derniers temps ?"</p>
<p>Pour les petits ensembles de données, il est possible d'envoyer toutes les lignes directement à un LLM. À plus grande échelle, cette solution devient rapidement irréalisable. Au lieu de cela, nous avions besoin d'un système capable de</p>
<ul>
<li>comprendre l'intention sémantique d'une requête</li>
<li>d'extraire les lignes les plus pertinentes par le biais d'une recherche de similarité vectorielle</li>
<li>de fournir ces lignes comme contexte à un LLM.</li>
</ul>
<p>Cette exigence a influencé presque toutes les décisions de conception qui ont suivi : Omni devait donner une impression d'instantanéité et d'intelligence, même sur de très grandes bases.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Recommandations d'enregistrements liés : La signification plutôt que les correspondances exactes</h3><p>La recherche sémantique améliore également une fonctionnalité essentielle d'Airtable : les enregistrements liés. Les utilisateurs ont besoin de suggestions de relations basées sur le contexte plutôt que sur des correspondances exactes. Par exemple, une description de projet peut impliquer une relation avec "Team Infrastructure" sans jamais utiliser cette phrase spécifique.</p>
<p>Pour fournir ces suggestions à la demande, il faut une récupération sémantique de haute qualité avec une latence cohérente et prévisible.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Nos priorités en matière de conception<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour prendre en charge ces fonctionnalités et d'autres encore, nous avons ancré le système autour de 4 objectifs :</p>
<ul>
<li><strong>Requêtes à faible latence (500 ms p99) :</strong> la prévisibilité des performances est essentielle pour la confiance des utilisateurs.</li>
<li><strong>Écritures à haut débit : les</strong> bases changent constamment, et les encastrements doivent rester synchronisés.</li>
<li><strong>Évolutivité horizontale :</strong> le système doit prendre en charge des millions de bases indépendantes.</li>
<li><strong>Auto-hébergement :</strong> toutes les données des clients doivent rester dans l'infrastructure contrôlée par Airtable.</li>
</ul>
<p>Ces objectifs ont influencé toutes les décisions architecturales qui ont suivi.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Évaluation des fournisseurs de bases de données vectorielles<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Fin 2024, nous avons évalué plusieurs options de bases de données vectorielles et avons finalement choisi <a href="https://milvus.io/">Milvus</a> sur la base de trois exigences clés.</p>
<ul>
<li>Tout d'abord, nous avons donné la priorité à une solution auto-hébergée pour garantir la confidentialité des données et maintenir un contrôle précis de notre infrastructure.</li>
<li>Deuxièmement, notre charge de travail à forte intensité d'écriture et nos modèles d'interrogation en rafale nécessitaient un système capable d'évoluer de manière élastique tout en maintenant une latence faible et prévisible.</li>
<li>Enfin, notre architecture nécessitait une forte isolation entre des millions de clients locataires.</li>
</ul>
<p><strong>Milvus</strong> s'est avéré être la solution la mieux adaptée : sa nature distribuée prend en charge la multi-location massive et nous permet de faire évoluer l'ingestion, l'indexation et l'exécution des requêtes de manière indépendante, en offrant des performances tout en maintenant des coûts prévisibles.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Conception de l'architecture<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir choisi une technologie, nous avons dû déterminer une architecture pour représenter la forme unique des données d'Airtable : des millions de "bases" distinctes appartenant à différents clients.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">Le défi du partitionnement<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons évalué deux stratégies principales de partitionnement des données :</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Option 1 : Partitions partagées</h3><p>Plusieurs bases partagent une partition et les requêtes sont délimitées en filtrant sur l'identifiant d'une base. Cette méthode améliore l'utilisation des ressources, mais introduit une surcharge de filtrage supplémentaire et rend la suppression des bases plus complexe.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Option 2 : Une base par partition</h3><p>Chaque base Airtable est mappée à sa propre partition physique dans Milvus. Cela fournit une forte isolation, permet une suppression rapide et simple de la base et évite l'impact sur les performances du filtrage post-requête.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Stratégie finale</h3><p>Nous avons choisi l'option 2 pour sa simplicité et sa forte isolation. Toutefois, les premiers tests ont montré que la création de 100 000 partitions dans une seule collection Milvus entraînait une dégradation significative des performances :</p>
<ul>
<li>La latence de création des partitions est passée de ~20 ms à ~250 ms.</li>
<li>Les temps de chargement des partitions dépassaient les 30 secondes.</li>
</ul>
<p>Pour remédier à ce problème, nous avons plafonné le nombre de partitions par collection. Pour chaque cluster Milvus, nous créons 400 collections, chacune comportant au maximum 1 000 partitions. Cela limite le nombre total de bases par cluster à 400k, et les nouveaux clusters sont approvisionnés au fur et à mesure de l'arrivée de nouveaux clients.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indexation et rappel<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>Le choix de l'index s'est avéré être l'un des compromis les plus importants de notre système. Lorsqu'une partition est chargée, son index est mis en cache en mémoire ou sur disque. Pour trouver un équilibre entre le taux de rappel, la taille de l'index et les performances, nous avons comparé plusieurs types d'index.</p>
<ul>
<li><strong>IVF-SQ8 :</strong> offre un faible encombrement en mémoire mais un taux de rappel plus faible.</li>
<li><strong>HNSW :</strong> offre le meilleur taux de rappel (99 %-100 %) mais est gourmand en mémoire.</li>
<li><strong>DiskANN :</strong> offre un rappel similaire à HNSW mais avec une latence d'interrogation plus élevée.</li>
</ul>
<p>En fin de compte, nous avons choisi HNSW pour ses caractéristiques supérieures en termes de rappel et de performances.</p>
<h2 id="The-Application-layer" class="common-anchor-header">La couche d'application<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>À un niveau élevé, le pipeline de recherche sémantique d'Airtable implique deux flux principaux :</p>
<ol>
<li><strong>Flux d'ingestion :</strong> Convertir les lignes d'Airtable en enchâssements et les stocker dans Milvus.</li>
<li><strong>Flux de requête :</strong> Intégrer les requêtes de l'utilisateur, récupérer les ID de ligne pertinents et fournir un contexte au LLM.</li>
</ol>
<p>Les deux flux doivent fonctionner en continu et de manière fiable à l'échelle, et nous examinons chacun d'entre eux ci-dessous. Nous examinons chacun d'entre eux ci-dessous.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Flux d'ingestion : maintenir Milvus en synchronisation avec Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'un utilisateur ouvre Omni, Airtable commence à synchroniser sa base avec Milvus. Nous créons une partition, puis traitons les lignes par morceaux, en générant des embeddings et en les insérant dans Milvus. À partir de là, nous capturons toutes les modifications apportées à la base, et nous réincorporons et réinsérons ces lignes pour maintenir la cohérence des données.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Flux de requêtes : comment nous utilisons les données<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>En ce qui concerne les requêtes, nous intégrons la demande de l'utilisateur et l'envoyons à Milvus pour récupérer les identifiants des lignes les plus pertinentes. Nous récupérons ensuite les dernières versions de ces lignes et les incluons en tant que contexte dans la demande adressée au LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Défis opérationnels et solutions apportées<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Construire une architecture de recherche sémantique est un défi ; la faire fonctionner de manière fiable pour des centaines de milliers de bases en est un autre. Voici quelques leçons opérationnelles clés que nous avons apprises en cours de route.</p>
<h3 id="Deployment" class="common-anchor-header">Déploiement</h3><p>Nous déployons Milvus via son CRD Kubernetes avec l'<a href="https://github.com/zilliztech/milvus-operator">opérateur Milvus</a>, ce qui nous permet de définir et de gérer des clusters de manière déclarative. Chaque changement, qu'il s'agisse d'une mise à jour de la configuration, d'une amélioration du client ou d'une mise à niveau de Milvus, est soumis à des tests unitaires et à un test de charge à la demande qui simule le trafic de production avant d'être déployé auprès des utilisateurs.</p>
<p>Dans la version 2.5, le cluster Milvus est constitué de ces composants de base :</p>
<ul>
<li>Les nœuds de requête conservent les index vectoriels en mémoire et exécutent les recherches vectorielles.</li>
<li>Les nœuds de données gèrent l'ingestion et le compactage, et maintiennent les nouvelles données dans le stockage.</li>
<li>Les nœuds d'indexation construisent et maintiennent les index vectoriels afin de maintenir la rapidité de la recherche au fur et à mesure que les données augmentent.</li>
<li>Le nœud coordinateur orchestre l'ensemble des activités du cluster et l'assignation des shards.</li>
<li>Les nœuds proxy acheminent le trafic API et équilibrent la charge entre les nœuds.</li>
<li>Kafka fournit la colonne vertébrale de log/streaming pour la messagerie interne et le flux de données</li>
<li>Etcd stocke les métadonnées du cluster et l'état de la coordination.</li>
</ul>
<p>Grâce à l'automatisation pilotée par CRD et à un pipeline de test rigoureux, nous pouvons déployer des mises à jour rapidement et en toute sécurité.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Observabilité : Comprendre la santé du système de bout en bout<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous surveillons le système à deux niveaux pour nous assurer que la recherche sémantique reste rapide et prévisible.</p>
<p>Au niveau de l'infrastructure, nous suivons l'utilisation de l'UC et de la mémoire, ainsi que la santé des pods dans tous les composants Milvus. Ces signaux nous indiquent si le cluster fonctionne dans des limites sûres et nous aident à détecter les problèmes tels que la saturation des ressources ou les nœuds malsains avant qu'ils n'affectent les utilisateurs.</p>
<p>Au niveau des services, nous nous concentrons sur la capacité de chaque base à répondre à nos charges de travail d'ingestion et d'interrogation. Des mesures telles que le compactage et le débit d'indexation nous donnent une visibilité sur l'efficacité de l'ingestion des données. Les taux de réussite des requêtes et la latence nous donnent une idée de l'expérience de l'utilisateur lors de l'interrogation des données, et la croissance des partitions nous permet de connaître la croissance de nos données, de sorte que nous sommes alertés en cas de besoin de mise à l'échelle.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Rotation des nœuds<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour des raisons de sécurité et de conformité, nous effectuons régulièrement une rotation des nœuds Kubernetes. Dans un cluster de recherche vectorielle, cette opération n'est pas triviale :</p>
<ul>
<li>Au fur et à mesure de la rotation des nœuds de requête, le coordinateur rééquilibre les données en mémoire entre les nœuds de requête.</li>
<li>Kafka et Etcd stockent des informations avec état et nécessitent un quorum et une disponibilité continue.</li>
</ul>
<p>Nous abordons ce problème avec des budgets de perturbation stricts et une politique de rotation d'un nœud à la fois. Le coordinateur Milvus a le temps de se rééquilibrer avant que le nœud suivant ne soit mis en cycle. Cette orchestration minutieuse préserve la fiabilité sans ralentir notre vitesse.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Déchargement des partitions froides<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>L'une de nos plus grandes victoires opérationnelles a été de reconnaître que nos données ont des schémas d'accès chauds/froids clairs. En analysant l'utilisation, nous avons découvert que seulement 25 % des données dans Milvus sont écrites ou lues au cours d'une semaine donnée. Milvus nous permet de décharger des partitions entières, libérant ainsi de la mémoire sur les nœuds de requête. Si ces données sont nécessaires ultérieurement, nous pouvons les recharger en quelques secondes. Cela nous permet de conserver les données chaudes en mémoire et de décharger le reste, ce qui réduit les coûts et nous permet d'évoluer plus efficacement au fil du temps.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Récupération des données<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de déployer Milvus à grande échelle, nous devions être certains de pouvoir récupérer rapidement tout scénario de défaillance. Si la plupart des problèmes sont couverts par la tolérance aux pannes intégrée au cluster, nous avons également prévu de rares cas où les données pourraient être corrompues ou le système entrer dans un état irrécupérable.</p>
<p>Dans ces situations, notre chemin de récupération est simple. Nous commençons par mettre en place un nouveau cluster Milvus afin de pouvoir reprendre le trafic presque immédiatement. Une fois que le nouveau cluster est opérationnel, nous réintégrons de manière proactive les bases les plus couramment utilisées, puis nous traitons paresseusement les autres au fur et à mesure qu'elles sont consultées. Cela permet de minimiser les temps d'arrêt pour les données les plus consultées pendant que le système reconstruit progressivement un index sémantique cohérent.</p>
<h2 id="What’s-Next" class="common-anchor-header">Prochaines étapes<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre travail avec <a href="https://milvus.io/">Milvus</a> a jeté des bases solides pour la recherche sémantique chez Airtable : alimenter des expériences d'IA rapides et significatives à l'échelle. Avec ce système en place, nous explorons maintenant des pipelines de recherche plus riches et des intégrations d'IA plus profondes à travers le produit. Il y a beaucoup de travail passionnant à venir, et nous ne faisons que commencer.</p>
<p><em>Merci à tous les anciens et actuels Airtablets sur l'infrastructure des données et à l'ensemble de l'organisation qui ont contribué à ce projet : Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">À propos d'Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> est une plateforme d'opérations numériques de premier plan qui permet aux organisations de créer des applications personnalisées, d'automatiser les flux de travail et de gérer les données partagées à l'échelle de l'entreprise. Conçue pour soutenir des processus complexes et interfonctionnels, Airtable aide les équipes à construire des systèmes flexibles pour la planification, la coordination et l'exécution sur une source de vérité partagée. Alors qu'Airtable développe sa plateforme alimentée par l'IA, des technologies comme Milvus jouent un rôle important dans le renforcement de l'infrastructure d'extraction nécessaire pour offrir des expériences de produits plus rapides et plus intelligentes.</p>
