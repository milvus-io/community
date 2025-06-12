---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: >-
  Nous avons remplacé Kafka/Pulsar par un pic pour Milvus - voici ce qui s'est
  passé
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Nous avons construit Woodpecker, un système WAL natif, pour remplacer Kafka et
  Pulsar dans Milvus afin de réduire la complexité opérationnelle et les coûts.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR :</strong> Nous avons construit Woodpecker, un système WAL (Write-Ahead Logging) en nuage, pour remplacer Kafka et Pulsar dans Milvus 2.6. Le résultat ? Des opérations simplifiées, de meilleures performances et des coûts réduits pour notre base de données vectorielle Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">Le point de départ : Quand les files d'attente de messages ne conviennent plus<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous aimions et utilisions Kafka et Pulsar. Ils ont fonctionné jusqu'à ce qu'ils ne fonctionnent plus. Au fur et à mesure de l'évolution de Milvus, la principale base de données vectorielle open-source, nous avons constaté que ces puissantes files d'attente de messages ne répondaient plus à nos exigences en matière d'évolutivité. Nous avons donc pris une décision audacieuse : nous avons réécrit l'épine dorsale du streaming dans Milvus 2.6 et mis en œuvre notre propre WAL - <strong>Woodpecker</strong>.</p>
<p>Permettez-moi de vous accompagner tout au long de notre parcours et de vous expliquer pourquoi nous avons opéré ce changement, qui peut sembler contre-intuitif à première vue.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Cloud-Native dès le premier jour<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une base de données vectorielle cloud-native depuis sa création. Nous nous appuyons sur Kubernetes pour une mise à l'échelle élastique et une reprise rapide en cas de défaillance, ainsi que sur des solutions de stockage d'objets comme Amazon S3 et MinIO pour la persistance des données.</p>
<p>Cette approche "cloud-first" offre d'énormes avantages, mais elle présente aussi quelques défis :</p>
<ul>
<li><p>Les services de stockage d'objets dans le nuage tels que S3 offrent une capacité pratiquement illimitée de traitement des débits et de disponibilité, mais avec des temps de latence dépassant souvent 100 ms.</p></li>
<li><p>Les modèles de tarification de ces services (basés sur les schémas et la fréquence d'accès) peuvent ajouter des coûts inattendus aux opérations de base de données en temps réel.</p></li>
<li><p>L'équilibre entre les caractéristiques "cloud-native" et les exigences de la recherche vectorielle en temps réel pose d'importants défis architecturaux.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">L'architecture du journal partagé : Notre base<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreux systèmes de recherche vectorielle se limitent au traitement par lots, car la mise en place d'un système en continu dans un environnement "cloud-native" présente des défis encore plus importants. En revanche, Milvus donne la priorité à la fraîcheur des données en temps réel et met en œuvre une architecture de journaux partagés, que l'on peut comparer à un disque dur pour un système de fichiers.</p>
<p>Cette architecture de journal partagé constitue une base essentielle qui sépare les protocoles de consensus de la fonctionnalité principale de la base de données. En adoptant cette approche, Milvus élimine la nécessité de gérer directement des protocoles de consensus complexes, ce qui nous permet de nous concentrer sur la fourniture de capacités de recherche vectorielle exceptionnelles.</p>
<p>Nous ne sommes pas les seuls à adopter ce modèle architectural : des bases de données telles que AWS Aurora, Azure Socrates et Neon s'appuient toutes sur une conception similaire. <strong>Cependant, une lacune importante subsiste dans l'écosystème open-source : malgré les avantages évidents de cette approche, la communauté manque d'une implémentation distribuée WAL (write-ahead log) à faible latence, évolutive et rentable.</strong></p>
<p>Les solutions existantes comme Bookie se sont révélées inadaptées à nos besoins en raison de la lourdeur de leur conception client et de l'absence de SDK prêts à la production pour Golang et C++. Cette lacune technologique nous a conduits à notre approche initiale avec les files de messages.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Notre solution initiale : Les files de messages en tant que WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour combler cette lacune, notre approche initiale utilisait des files de messages (Kafka/Pulsar) comme journal d'écriture (WAL). L'architecture fonctionnait comme suit :</p>
<ul>
<li><p>Toutes les mises à jour entrantes en temps réel passent par la file d'attente de messages.</p></li>
<li><p>Les rédacteurs reçoivent une confirmation immédiate une fois qu'elle est acceptée par la file de messages.</p></li>
<li><p>QueryNode et DataNode traitent ces données de manière asynchrone, ce qui garantit un débit d'écriture élevé tout en préservant la fraîcheur des données</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Vue d'ensemble de l'architecture Milvus 2.0</p>
<p>Ce système fournit effectivement une confirmation d'écriture immédiate tout en permettant un traitement asynchrone des données, ce qui était essentiel pour maintenir l'équilibre entre le débit et la fraîcheur des données que les utilisateurs de Milvus attendent.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Pourquoi nous avions besoin de quelque chose de différent pour WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec Milvus 2.6, nous avons décidé d'abandonner progressivement les files d'attente de messages externes au profit de Woodpecker, notre implémentation WAL native dans le nuage. Cette décision n'a pas été prise à la légère. Après tout, nous avons utilisé avec succès Kafka et Pulsar pendant des années.</p>
<p>Le problème n'était pas lié à ces technologies elles-mêmes, qui sont toutes deux d'excellents systèmes dotés de puissantes capacités. Le problème venait plutôt de la complexité et de la surcharge croissantes que ces systèmes externes introduisaient au fur et à mesure de l'évolution de Milvus. Au fur et à mesure que nos besoins devenaient plus spécialisés, l'écart entre les files d'attente de messages à usage général et les besoins de notre base de données vectorielle continuait à se creuser.</p>
<p>Trois facteurs spécifiques ont finalement motivé notre décision de construire un système de remplacement :</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Complexité opérationnelle</h3><p>Les dépendances externes comme Kafka ou Pulsar exigent des machines dédiées avec plusieurs nœuds et une gestion minutieuse des ressources. Cela crée plusieurs défis :</p>
<ul>
<li>Complexité opérationnelle accrue</li>
</ul>
<ul>
<li>Courbes d'apprentissage plus raides pour les administrateurs système</li>
</ul>
<ul>
<li>Risques accrus d'erreurs de configuration et de failles de sécurité</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Contraintes architecturales</h3><p>Les files d'attente de messages comme Kafka ont des limites inhérentes au nombre de sujets pris en charge. Nous avons développé VShard comme solution de contournement pour le partage des sujets entre les composants, mais cette solution, tout en répondant efficacement aux besoins de mise à l'échelle, a introduit une complexité architecturale significative.</p>
<p>Ces dépendances externes ont rendu plus difficile l'implémentation de fonctionnalités critiques, telles que le ramassage des logs, et ont augmenté les frictions d'intégration avec d'autres modules du système. Au fil du temps, l'inadéquation architecturale entre les files de messages à usage général et les exigences spécifiques et performantes d'une base de données vectorielle est devenue de plus en plus évidente, ce qui nous a incités à réévaluer nos choix de conception.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Inefficacité des ressources</h3><p>Assurer une haute disponibilité avec des systèmes tels que Kafka et Pulsar exige généralement ce qui suit</p>
<ul>
<li><p>un déploiement distribué sur plusieurs nœuds</p></li>
<li><p>une allocation de ressources substantielle, même pour les petites charges de travail</p></li>
<li><p>Le stockage de signaux éphémères (comme le Timetick de Milvus), qui n'ont pas besoin d'être conservés à long terme.</p></li>
</ul>
<p>Toutefois, ces systèmes manquent de souplesse pour contourner la persistance de ces signaux transitoires, ce qui entraîne des opérations d'E/S et une utilisation du stockage inutiles. Cela entraîne une surcharge disproportionnée des ressources et une augmentation des coûts, en particulier dans les environnements à petite échelle ou à ressources limitées.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Présentation de Woodpecker - un moteur WAL hautes performances natif pour le cloud<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans Milvus 2.6, nous avons remplacé Kafka/Pulsar par <strong>Woodpecker</strong>, un système WAL natif conçu à cet effet. Conçu pour le stockage d'objets, Woodpecker simplifie les opérations tout en augmentant les performances et l'évolutivité.</p>
<p>Woodpecker a été conçu dès le départ pour maximiser le potentiel du stockage natif dans le nuage, avec un objectif précis : devenir la solution WAL la plus performante, optimisée pour les environnements dans le nuage, tout en offrant les fonctionnalités de base nécessaires à un journal d'écriture en avance (append-only write-ahead log).</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">L'architecture zéro disque de Woodpecker</h3><p>L'innovation principale de Woodpecker est son <strong>architecture Zero-Disk</strong>:</p>
<ul>
<li><p>Toutes les données du journal sont stockées dans un système de stockage d'objets dans le nuage (comme Amazon S3, Google Cloud Storage ou Alibaba OS).</p></li>
<li><p>Les métadonnées sont gérées par des magasins de clés-valeurs distribués comme etcd.</p></li>
<li><p>Pas de dépendance à l'égard des disques locaux pour les opérations principales</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure :  Vue d'ensemble de l'architecture de Woodpecker</p>
<p>Cette approche réduit considérablement les frais généraux d'exploitation tout en maximisant la durabilité et l'efficacité du cloud. En éliminant les dépendances des disques locaux, Woodpecker s'aligne parfaitement sur les principes "cloud-native" et réduit considérablement la charge opérationnelle des administrateurs système.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Repères de performance : Dépasser les attentes</h3><p>Nous avons effectué des tests complets pour évaluer les performances de Woodpecker dans une configuration à un seul nœud, un seul client et un seul flux de logs. Les résultats ont été impressionnants par rapport à Kafka et Pulsar :</p>
<table>
<thead>
<tr><th><strong>Système</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Débit</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Temps de latence</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Pour situer le contexte, nous avons mesuré les limites de débit théoriques de différents backends de stockage sur notre machine de test :</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 Mo/s</p></li>
<li><p><strong>Système de fichiers local</strong>: 600-750 Mo/s</p></li>
<li><p><strong>Amazon S3 (instance EC2 unique)</strong>: jusqu'à 1,1 Go/s</p></li>
</ul>
<p>Fait remarquable, Woodpecker a constamment atteint 60 à 80 % du débit maximal possible pour chaque backend, ce qui représente un niveau d'efficacité exceptionnel pour un middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Principales informations sur les performances</h4><ol>
<li><p><strong>Mode système de fichiers local</strong>: Woodpecker a atteint 450 Mo/s, soit 3,5 fois plus vite que Kafka et 4,2 fois plus vite que Pulsar, avec une latence ultra-faible de seulement 1,8 ms, ce qui en fait l'outil idéal pour les déploiements haute performance à un seul nœud.</p></li>
<li><p><strong>Mode de stockage dans le nuage (S3)</strong>: En écrivant directement sur S3, Woodpecker a atteint 750 Mo/s (environ 68 % de la limite théorique de S3), soit 5,8 fois plus que Kafka et 7 fois plus que Pulsar. Bien que la latence soit plus élevée (166 ms), cette configuration offre un débit exceptionnel pour les charges de travail par lots.</p></li>
<li><p><strong>Mode de stockage d'objets (MinIO)</strong>: Même avec MinIO, Woodpecker a atteint 71 Mo/s, soit environ 65 % de la capacité de MinIO. Ces performances sont comparables à celles de Kafka et de Pulsar, mais avec des besoins en ressources nettement inférieurs.</p></li>
</ol>
<p>Woodpecker est particulièrement optimisé pour les écritures simultanées de gros volumes, pour lesquelles le maintien de l'ordre est essentiel. Et ces résultats ne reflètent que les premières étapes du développement - les optimisations en cours dans la fusion des E/S, la mise en mémoire tampon intelligente et l'extraction préalable devraient permettre de pousser les performances encore plus près des limites théoriques.</p>
<h3 id="Design-Goals" class="common-anchor-header">Objectifs de conception</h3><p>Woodpecker répond aux exigences évolutives des charges de travail de recherche vectorielle en temps réel par le biais de ces exigences techniques clés :</p>
<ul>
<li><p>ingestion de données à haut débit avec persistance durable à travers la zone de disponibilité</p></li>
<li><p>Des lectures de queue à faible latence pour les abonnements en temps réel et des lectures de rattrapage à haut débit pour la reprise sur panne.</p></li>
<li><p>Supports de stockage enfichables, y compris le stockage d'objets dans le nuage et les systèmes de fichiers avec prise en charge du protocole NFS</p></li>
<li><p>Options de déploiement flexibles, prenant en charge à la fois les configurations autonomes légères et les clusters à grande échelle pour les déploiements Milvus multi-tenant.</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Composants de l'architecture</h3><p>Un déploiement standard de Woodpecker comprend les composants suivants.</p>
<ul>
<li><p><strong>Client</strong> - Couche d'interface pour l'émission de demandes de lecture et d'écriture</p></li>
<li><p><strong>LogStore</strong> - gère la mise en mémoire tampon d'écriture à grande vitesse, les téléchargements asynchrones vers le stockage et le compactage des journaux.</p></li>
<li><p><strong>Backend de stockage</strong> - Prend en charge les services de stockage évolutifs et peu coûteux tels que S3, GCS et les systèmes de fichiers tels que EFS.</p></li>
<li><p><strong>ETCD</strong> - Stocke les métadonnées et coordonne l'état des journaux sur les nœuds distribués.</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Des déploiements flexibles pour répondre à vos besoins spécifiques</h3><p>Woodpecker propose deux modes de déploiement pour répondre à vos besoins spécifiques :</p>
<p><strong>Mode MemoryBuffer - Léger et sans maintenance</strong></p>
<p>Le mode MemoryBuffer offre une option de déploiement simple et légère dans laquelle Woodpecker met temporairement en mémoire tampon les écritures entrantes et les évacue périodiquement vers un service de stockage d'objets dans le nuage. Les métadonnées sont gérées à l'aide de etcd pour assurer la cohérence et la coordination. Ce mode convient mieux aux charges de travail lourdes en lots dans les déploiements à petite échelle ou les environnements de production qui privilégient la simplicité à la performance, en particulier lorsqu'une faible latence d'écriture n'est pas critique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1 : Le mode memoryBuffer Le mode memoryBuffer</em></p>
<p><strong>Mode QuorumBuffer - Optimisé pour les déploiements à faible latence et à haute durabilité</strong></p>
<p>Le mode QuorumBuffer est conçu pour les charges de travail de lecture/écriture sensibles à la latence et à haute fréquence, qui nécessitent à la fois une réactivité en temps réel et une forte tolérance aux pannes. Dans ce mode, Woodpecker fonctionne comme un tampon d'écriture à grande vitesse avec des écritures quorum à trois répliques, assurant une forte cohérence et une haute disponibilité.</p>
<p>Une écriture est considérée comme réussie lorsqu'elle est répliquée sur au moins deux des trois nœuds, généralement dans un délai de quelques millisecondes, après quoi les données sont évacuées de manière asynchrone vers le stockage d'objets dans le nuage pour une durabilité à long terme. Cette architecture minimise l'état sur le nœud, élimine le besoin de gros volumes de disques locaux et évite les réparations anti-entropie complexes souvent nécessaires dans les systèmes traditionnels basés sur le quorum.</p>
<p>Il en résulte une couche WAL rationalisée et robuste, idéale pour les environnements de production critiques où la cohérence, la disponibilité et la restauration rapide sont essentielles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Le mode QuorumBuffer</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService : Conçu pour les flux de données en temps réel<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Au-delà de Woodpecker, Milvus 2.6 introduit le <strong>StreamingService, un</strong>composant spécialisé conçu pour la gestion des journaux, l'ingestion des journaux et l'abonnement aux données en continu.</p>
<p>Pour comprendre le fonctionnement de notre nouvelle architecture, il est important de clarifier la relation entre ces deux composants :</p>
<ul>
<li><p><strong>Woodpecker</strong> est la couche de stockage qui gère la persistance réelle des journaux en avance sur l'écriture, offrant durabilité et fiabilité.</p></li>
<li><p><strong>StreamingService</strong> est la couche de service qui gère les opérations de journalisation et fournit des capacités de flux de données en temps réel.</p></li>
</ul>
<p>Ensemble, ils remplacent complètement les files d'attente de messages externes. Woodpecker fournit la base de stockage durable, tandis que StreamingService fournit la fonctionnalité de haut niveau avec laquelle les applications interagissent directement. Cette séparation des préoccupations permet à chaque composant d'être optimisé pour son rôle spécifique tout en fonctionnant de manière transparente en tant que système intégré.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Ajout du service de streaming à Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Service de diffusion en continu ajouté à l'architecture de Milvus 2.6</p>
<p>Le service de diffusion en continu est composé de trois éléments principaux :</p>
<p><strong>Coordinateur de diffusion en continu</strong></p>
<ul>
<li><p>Découvre les nœuds de diffusion en continu disponibles en surveillant les sessions ETCD de Milvus.</p></li>
<li><p>Gère l'état des WAL et collecte les mesures d'équilibrage de charge par le biais du ManagerService.</p></li>
</ul>
<p><strong>Client de diffusion en continu</strong></p>
<ul>
<li><p>Interroge le service d'affectation pour déterminer la répartition des segments WAL entre les nœuds de diffusion en continu.</p></li>
<li><p>Effectue des opérations de lecture/écriture via le HandlerService sur le nœud de diffusion approprié.</p></li>
</ul>
<p><strong>Nœud de diffusion en continu</strong></p>
<ul>
<li><p>Gère les opérations WAL proprement dites et fournit des capacités de publication et d'abonnement pour la diffusion de données en temps réel.</p></li>
<li><p>Inclut le <strong>service ManagerService</strong> pour l'administration du WAL et l'établissement de rapports sur les performances</p></li>
<li><p>Comprend le <strong>HandlerService</strong> qui met en œuvre des mécanismes efficaces de publication et d'abonnement pour les entrées WAL.</p></li>
</ul>
<p>Cette architecture en couches permet à Milvus de maintenir une séparation claire entre la fonctionnalité de diffusion en continu (abonnement, traitement en temps réel) et les mécanismes de stockage proprement dits. Woodpecker gère le "comment" du stockage des journaux, tandis que StreamingService gère le "quoi" et le "quand" des opérations sur les journaux.</p>
<p>En conséquence, le StreamingService améliore considérablement les capacités en temps réel de Milvus en introduisant la prise en charge native des abonnements, ce qui élimine le besoin de files d'attente de messages externes. Il réduit la consommation de mémoire en consolidant les caches précédemment dupliqués dans les chemins d'interrogation et de données, diminue la latence pour les lectures fortement cohérentes en supprimant les délais de synchronisation asynchrones, et améliore à la fois l'évolutivité et la vitesse de récupération dans l'ensemble du système.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Conclusion - Streaming sur une architecture à disque zéro<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>La gestion de l'état est difficile. Les systèmes avec état sacrifient souvent l'élasticité et l'évolutivité. La réponse de plus en plus acceptée dans la conception cloud-native est de découpler l'état de l'informatique, ce qui permet à chacun d'évoluer indépendamment.</p>
<p>Plutôt que de réinventer la roue, nous déléguons la complexité du stockage durable et évolutif aux équipes d'ingénieurs de classe mondiale qui travaillent sur des services tels que AWS S3, Google Cloud Storage et MinIO. Parmi ces services, S3 se distingue par sa capacité pratiquement illimitée, sa durabilité de onze neuf (99,999999999 %), sa disponibilité de 99,99 % et ses performances de lecture/écriture à haut débit.</p>
<p>Cependant, même les architectures "zéro disque" présentent des inconvénients. Les magasins d'objets sont toujours confrontés à une latence d'écriture élevée et à l'inefficacité des petits fichiers - des limites qui restent non résolues dans de nombreuses charges de travail en temps réel.</p>
<p>Pour les bases de données vectorielles, en particulier celles qui prennent en charge les charges de travail critiques de type RAG, agents d'intelligence artificielle et recherche à faible latence, l'accès en temps réel et les écritures rapides ne sont pas négociables. C'est pourquoi nous avons réarchitecturé Milvus autour de Woodpecker et du service de streaming. Ce changement simplifie l'ensemble du système (soyons réalistes, personne ne souhaite maintenir une pile Pulsar complète dans une base de données vectorielle), garantit des données plus fraîches, améliore la rentabilité et accélère la reprise sur panne.</p>
<p>Nous pensons que Woodpecker est plus qu'un simple composant Milvus : il peut servir de base à d'autres systèmes " cloud-native ". Au fur et à mesure de l'évolution de l'infrastructure en nuage, des innovations telles que S3 Express pourraient nous rapprocher de l'idéal : la durabilité inter-zones avec une latence d'écriture de l'ordre de la milliseconde.</p>
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
    </button></h2><p>Milvus 2.6 est disponible dès maintenant. Outre Woodpecker, elle introduit des dizaines de nouvelles fonctionnalités et d'optimisations des performances, telles que le stockage hiérarchisé, la méthode de quantification RabbitQ, la recherche en texte intégral améliorée et la multilocation, répondant directement aux défis les plus urgents de la recherche vectorielle aujourd'hui : une mise à l'échelle efficace tout en gardant les coûts sous contrôle.</p>
<p>Prêt à découvrir tout ce qu'offre Milvus ? Plongez dans nos<a href="https://milvus.io/docs/release_notes.md"> notes de version</a>, parcourez la<a href="https://milvus.io/docs"> documentation complète</a> ou consultez nos<a href="https://milvus.io/blog"> blogs sur les fonctionnalités</a>.</p>
<p>Vous pouvez également rejoindre notre <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord</a> ou déposer un problème sur<a href="https://github.com/milvus-io/milvus"> GitHub</a> - nous sommes là pour vous aider à tirer le meilleur parti de Milvus 2.6.</p>
