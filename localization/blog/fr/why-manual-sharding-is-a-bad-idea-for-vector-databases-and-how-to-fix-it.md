---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Pourquoi le Sharding manuel est une mauvaise idée pour les bases de données
  vectorielles et comment y remédier ?
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Découvrez pourquoi le sharding manuel des bases de données vectorielles crée
  des goulets d'étranglement et comment la mise à l'échelle automatisée de
  Milvus élimine les frais généraux d'ingénierie pour une croissance
  transparente.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_300b84a4d9.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"<em>Au départ, nous avons construit notre recherche sémantique sur pgvector au lieu de Milvus parce que toutes nos données relationnelles se trouvaient déjà dans PostgreSQL",</em> se souvient Alex, directeur technique d'une startup SaaS d'IA d'entreprise. <em>"Mais dès que nous avons atteint l'adéquation produit-marché, notre croissance s'est heurtée à de sérieux obstacles du côté de l'ingénierie. Il est rapidement apparu que pgvector n'était pas conçu pour l'évolutivité. Des tâches simples telles que le déploiement de mises à jour de schémas à travers de multiples shards se sont transformées en processus fastidieux et sujets aux erreurs qui ont consommé des jours d'efforts d'ingénierie. Lorsque nous avons atteint 100 millions d'incorporations vectorielles, la latence des requêtes est passée à plus d'une seconde, ce qui était bien au-delà de ce que nos clients pouvaient tolérer. Après le passage à Milvus, le sharding manuel nous a semblé revenir à l'âge de pierre. Il n'est pas agréable de jongler avec les serveurs de stockage comme s'il s'agissait d'artefacts fragiles. Aucune entreprise ne devrait avoir à subir cela".</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Un défi commun aux entreprises d'IA<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>L'expérience d'Alex n'est pas unique aux utilisateurs de pgvector. Que vous utilisiez pgvector, Qdrant, Weaviate ou toute autre base de données vectorielle reposant sur le sharding manuel, les problèmes de mise à l'échelle restent les mêmes. Ce qui commence comme une solution gérable se transforme rapidement en une dette technique au fur et à mesure que les volumes de données augmentent.</p>
<p>Pour les startups d'aujourd'hui, l'<strong>évolutivité n'est pas facultative, elle est essentielle</strong>. C'est particulièrement vrai pour les produits d'IA alimentés par de grands modèles de langage (LLM) et des bases de données vectorielles, où le passage d'une adoption précoce à une croissance exponentielle peut se faire du jour au lendemain. L'adéquation entre le produit et le marché déclenche souvent une forte croissance du nombre d'utilisateurs, un afflux massif de données et une montée en flèche des demandes de requêtes. Mais si l'infrastructure de la base de données ne peut pas suivre, la lenteur des requêtes et l'inefficacité opérationnelle peuvent freiner l'élan et entraver la réussite de l'entreprise.</p>
<p>Une décision technique à court terme peut conduire à un goulot d'étranglement à long terme, obligeant les équipes d'ingénieurs à s'occuper en permanence des problèmes de performance urgents, des pannes de base de données et des défaillances du système au lieu de se concentrer sur l'innovation. Le pire des scénarios ? Une réarchitecture coûteuse et chronophage de la base de données, précisément au moment où l'entreprise devrait passer à l'échelle supérieure.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Le sharding n'est-il pas une solution naturelle à l'évolutivité ?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>L'évolutivité peut être abordée de différentes manières. L'approche la plus simple, la <strong>montée en charge</strong>, consiste à augmenter les ressources d'une seule machine en ajoutant plus de CPU, de mémoire ou de stockage pour faire face à l'augmentation des volumes de données. Bien que simple, cette méthode présente des limites évidentes. Dans un environnement Kubernetes, par exemple, les pods de grande taille sont inefficaces, et le fait de s'appuyer sur un seul nœud augmente le risque de défaillance, ce qui peut entraîner des temps d'arrêt importants.</p>
<p>Lorsque le Scaling Up n'est plus viable, les entreprises se tournent naturellement vers le <strong>Scaling Out</strong>, en distribuant les données sur plusieurs serveurs. À première vue, le <strong>sharding</strong> semble être une solution simple : diviser une base de données en bases de données plus petites et indépendantes pour augmenter la capacité et permettre plusieurs nœuds primaires accessibles en écriture.</p>
<p>Cependant, bien que conceptuellement simple, le sharding devient rapidement un défi complexe dans la pratique. La plupart des applications sont initialement conçues pour fonctionner avec une seule base de données unifiée. Dès lors qu'une base de données vectorielle est divisée en plusieurs unités, chaque partie de l'application qui interagit avec les données doit être modifiée ou entièrement réécrite, ce qui entraîne un surcoût de développement important. La conception d'une stratégie de partage efficace devient cruciale, tout comme la mise en œuvre d'une logique de routage pour s'assurer que les données sont dirigées vers le bon groupe de données. La gestion des transactions atomiques sur plusieurs serveurs nécessite souvent une restructuration des applications afin d'éviter les opérations croisées. En outre, les scénarios de défaillance doivent être gérés avec élégance afin d'éviter les perturbations lorsque certains serveurs deviennent indisponibles.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Pourquoi le sharding manuel devient un fardeau<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p>&quot;<em>À l'origine, nous avions estimé que la mise en œuvre du sharding manuel pour notre base de données pgvector prendrait environ six mois à deux ingénieurs&quot;,</em> se souvient Alex <em>, &quot;mais nous n'avions pas réalisé que ces ingénieurs seraient</em> <strong><em>toujours</em></strong> <em>nécessaires. Chaque modification de schéma, opération de rééquilibrage des données ou décision de mise à l'échelle nécessitait leur expertise spécialisée. Nous nous engagions essentiellement dans une 'équipe de sharding' permanente juste pour faire fonctionner notre base de données&quot;.</em></p>
<p>Les défis concrets posés par les bases de données vectorielles partagées sont notamment les suivants</p>
<ol>
<li><p><strong>Déséquilibre de la distribution des données (points chauds</strong>) : Dans les cas d'utilisation multi-locataires, la distribution des données peut aller de centaines à des milliards de vecteurs par locataire. Ce déséquilibre crée des points névralgiques dans lesquels certains ensembles sont surchargés alors que d'autres restent inactifs.</p></li>
<li><p><strong>Le mal de tête du resharding</strong>: Il est pratiquement impossible de choisir le bon nombre d'unités de stockage. Un nombre insuffisant entraîne des opérations de resharding fréquentes et coûteuses. Un nombre trop élevé crée une surcharge inutile de métadonnées, ce qui accroît la complexité et réduit les performances.</p></li>
<li><p><strong>Complexité des changements de schéma</strong>: De nombreuses bases de données vectorielles mettent en œuvre le sharding en gérant plusieurs bases de données sous-jacentes. La synchronisation des modifications de schéma entre les différentes bases de données est donc lourde et sujette aux erreurs, ce qui ralentit les cycles de développement.</p></li>
<li><p><strong>Gaspillage de ressources</strong>: Dans les bases de données couplées stockage-informatique, vous devez allouer méticuleusement des ressources à chaque nœud tout en anticipant la croissance future. En règle générale, lorsque l'utilisation des ressources atteint 60 à 70 %, vous devez commencer à planifier le redécoupage.</p></li>
</ol>
<p>En d'autres termes, la <strong>gestion manuelle des shards est néfaste pour votre entreprise</strong>. Plutôt que d'enfermer votre équipe d'ingénieurs dans une gestion constante des shards, envisagez d'investir dans une base de données vectorielle conçue pour évoluer automatiquement, sans la charge opérationnelle.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Comment Milvus résout le problème de l'évolutivité<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreux développeurs, qu'il s'agisse de startups ou d'entreprises, ont reconnu l'importance des frais généraux associés au partage manuel des bases de données. Milvus adopte une approche fondamentalement différente, permettant une mise à l'échelle transparente de millions à des milliards de vecteurs sans la complexité.</p>
<h3 id="Automated-Scaling-Without-the-Engineering-Tax" class="common-anchor-header">Évolution automatisée sans taxe d'ingénierie</h3><p>Milvus exploite Kubernetes et une architecture de stockage et de calcul désagrégée pour prendre en charge une expansion transparente. Cette conception permet</p>
<ul>
<li><p>Une mise à l'échelle rapide en réponse à l'évolution de la demande</p></li>
<li><p>L'équilibrage automatique de la charge sur tous les nœuds disponibles</p></li>
<li><p>Une allocation des ressources indépendante, vous permettant d'ajuster le calcul, la mémoire et le stockage séparément.</p></li>
<li><p>Des performances élevées et constantes, même pendant les périodes de croissance rapide.</p></li>
</ul>
<h3 id="How-Milvus-Scales-The-Technical-Foundation" class="common-anchor-header">Comment Milvus évolue : Les fondements techniques</h3><p>Milvus atteint ses capacités de mise à l'échelle grâce à deux innovations clés :</p>
<p><strong>L'architecture basée sur les segments :</strong> Milvus organise les données en &quot;segments&quot;, les plus petites unités de gestion des données :</p>
<ul>
<li><p>Les segments croissants résident sur les StreamNodes, ce qui optimise la fraîcheur des données pour les requêtes en temps réel</p></li>
<li><p>Les segments scellés sont gérés par les QueryNodes, qui utilisent des index puissants pour accélérer la recherche.</p></li>
<li><p>Ces segments sont répartis uniformément entre les nœuds afin d'optimiser le traitement parallèle.</p></li>
</ul>
<p><strong>Routage à deux niveaux</strong>: À la différence des bases de données traditionnelles, où chaque segment est hébergé sur une seule machine, Milvus distribue les données d'un segment de manière dynamique sur plusieurs nœuds :</p>
<ul>
<li><p>Chaque groupe peut stocker plus d'un milliard de points de données.</p></li>
<li><p>Les segments à l'intérieur de chaque nuage sont automatiquement équilibrés entre les machines.</p></li>
<li><p>L'extension des collections est aussi simple que l'augmentation du nombre de tiroirs.</p></li>
<li><p>La prochaine version de Milvus 3.0 introduira le fractionnement dynamique des tessons, ce qui éliminera même cette étape manuelle minimale.</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Traitement des requêtes à l'échelle</h3><p>Lors de l'exécution d'une requête, Milvus suit un processus efficace :</p>
<ol>
<li><p>Le mandataire identifie les répertoires pertinents pour la collection demandée.</p></li>
<li><p>Le mandataire recueille des données auprès des StreamNodes et des QueryNodes.</p></li>
<li><p>Les StreamNodes traitent les données en temps réel tandis que les QueryNodes traitent les données historiques simultanément.</p></li>
<li><p>Les résultats sont agrégés et renvoyés à l'utilisateur.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Une expérience d'ingénierie différente<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>"<em>Lorsque l'évolutivité est intégrée à la base de données elle-même, tous ces maux de tête disparaissent",</em> déclare Alex en évoquant la transition de son équipe vers Milvus. <em>"Mes ingénieurs se consacrent à nouveau à l'élaboration de fonctionnalités appréciées par les clients, au lieu de s'occuper d'éléments de base de données.</em></p>
<p>Si vous êtes confronté au fardeau technique du sharding manuel, aux goulets d'étranglement des performances à grande échelle ou à la perspective décourageante des migrations de bases de données, il est temps de repenser votre approche. Consultez notre <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">page de documentation</a> pour en savoir plus sur l'architecture Milvus ou faites l'expérience directe d'une évolutivité sans effort avec Milvus entièrement géré sur <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Avec la bonne base de données vectorielle, votre innovation ne connaît pas de limites.</p>
