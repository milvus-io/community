---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Haute disponibilité de la base de données Vector : comment construire un
  cluster de secours Milvus avec CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Apprenez à construire une base de données vectorielle à haute disponibilité
  avec Milvus CDC. Guide étape par étape de la réplication primaire-standby, du
  basculement et du DR de production.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Toute base de données de production a besoin d'un plan en cas de problème. Les bases de données relationnelles disposent depuis des décennies de l'expédition WAL, de la réplication binlog et du basculement automatisé. Mais les <a href="https://zilliz.com/learn/what-is-a-vector-database">bases de données vectorielles</a>, bien qu'elles soient devenues l'infrastructure de base des applications d'intelligence artificielle, sont encore en train de rattraper leur retard dans ce domaine. La plupart offrent au mieux une redondance au niveau du nœud. Si un cluster complet tombe en panne, vous devez restaurer à partir des sauvegardes et reconstruire les <a href="https://zilliz.com/learn/vector-index">index vectoriels</a> à partir de zéro - un processus qui peut prendre des heures et coûter des milliers de dollars en calcul, car la régénération des <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> par votre pipeline de ML n'est pas bon marché.</p>
<p><a href="https://milvus.io/">Milvus</a> adopte une approche différente. Il offre une haute disponibilité en couches : répliques au niveau des nœuds pour un basculement rapide au sein d'un cluster, réplication basée sur le CDC pour une protection au niveau du cluster et entre les régions, et sauvegarde pour une récupération du réseau de sécurité. Ce modèle en couches est une pratique courante dans les bases de données traditionnelles. Milvus est la première grande base de données vectorielle à l'appliquer aux charges de travail vectorielles.</p>
<p>Ce guide couvre deux aspects : les stratégies de haute disponibilité disponibles pour les bases de données vectorielles (afin que vous puissiez évaluer ce que signifie l'expression " prêt pour la production ") et un tutoriel pratique pour configurer la réplication primaire-standby de Milvus CDC à partir de zéro.</p>
<blockquote>
<p>Cet article est la <strong>première partie</strong> d'une série :</p>
<ul>
<li><strong>Partie 1</strong> (cet article) : Mise en place de la réplication primaire et de secours sur de nouveaux clusters</li>
<li><strong>Partie 2</strong>: Ajout de CDC à un cluster existant qui contient déjà des données, à l'aide de <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Partie 3</strong>: Gestion du basculement - promotion du standby lorsque le primaire tombe en panne</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Pourquoi la haute disponibilité est-elle plus importante pour les bases de données vectorielles ?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'une base de données SQL traditionnelle tombe en panne, vous perdez l'accès aux enregistrements structurés, mais les données elles-mêmes peuvent généralement être réimportées à partir de sources en amont. Lorsqu'une base de données vectorielle tombe en panne, la récupération est fondamentalement plus difficile.</p>
<p>Les bases de données vectorielles stockent des <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a>, c'est-à-dire des représentations numériques denses générées par des modèles de ML. Pour les reconstruire, il faut ré-exécuter l'ensemble du jeu de données à travers le pipeline d'intégration : charger les documents bruts, les découper, appeler un <a href="https://zilliz.com/ai-models">modèle d'intégration</a> et réindexer le tout. Pour un ensemble de données contenant des centaines de millions de vecteurs, cela peut prendre des jours et coûter des milliers de dollars en calcul GPU.</p>
<p>Pendant ce temps, les systèmes qui dépendent de la <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle</a> sont souvent dans le chemin critique :</p>
<ul>
<li>Les<strong>pipelines<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong> qui alimentent les chatbots et les recherches destinés aux clients - si la base de données vectorielles est en panne, la recherche s'arrête et l'IA renvoie des réponses génériques ou hallucinées.</li>
<li>Les<strong>moteurs de recommandation</strong> qui proposent des suggestions de produits ou de contenus en temps réel - les temps d'arrêt sont synonymes de revenus manqués.</li>
<li>Les systèmes de<strong>détection des fraudes et de surveillance des anomalies</strong> qui s'appuient sur la <a href="https://zilliz.com/glossary/similarity-search">recherche de similitudes</a> pour signaler les activités suspectes - une lacune dans la couverture crée une fenêtre de vulnérabilité.</li>
<li>Les<strong>systèmes d'agents autonomes</strong> qui utilisent des bases de données vectorielles pour la mémoire et la récupération d'outils - les agents échouent ou tournent en boucle sans leur base de connaissances.</li>
</ul>
<p>Si vous évaluez des bases de données vectorielles pour l'un de ces cas d'utilisation, la haute disponibilité n'est pas une fonctionnalité intéressante à vérifier ultérieurement. C'est l'une des premières choses que vous devez examiner.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">À quoi ressemble une haute disponibilité de niveau production pour une base de données vectorielle ?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Toutes les hautes disponibilités ne sont pas égales. Une base de données vectorielle qui ne gère que les défaillances de nœuds au sein d'un seul cluster n'est pas "hautement disponible" comme l'exige un système de production. Une véritable haute disponibilité doit couvrir trois niveaux :</p>
<table>
<thead>
<tr><th>Couche</th><th>Ce contre quoi elle protège</th><th>Fonctionnement</th><th>Temps de récupération</th><th>Perte de données</th></tr>
</thead>
<tbody>
<tr><td><strong>Niveau du nœud</strong> (multiréplique)</td><td>Crash d'un seul nœud, défaillance matérielle, OOM kill, défaillance de l'AZ</td><td>Copie des mêmes <a href="https://milvus.io/docs/glossary.md">segments de données</a> sur plusieurs nœuds ; les autres nœuds absorbent la charge.</td><td>Instantané</td><td>Zéro</td></tr>
<tr><td><strong>Au niveau du cluster</strong> (réplication CDC)</td><td>Le cluster entier tombe en panne - mauvais déploiement de K8s, suppression de l'espace de noms, corruption du stockage</td><td>Transmission de chaque écriture à un cluster de secours via le <a href="https://milvus.io/docs/four_layers.md">journal Write-Ahead</a>; le standby est toujours en retard de quelques secondes.</td><td>Minutes</td><td>Secondes</td></tr>
<tr><td><strong>Filet de sécurité</strong> (sauvegarde périodique)</td><td>Corruption catastrophique des données, ransomware, erreur humaine qui se propage à travers la réplication</td><td>Prend des instantanés périodiques et les stocke dans un endroit séparé.</td><td>Heures</td><td>Heures (depuis la dernière sauvegarde)</td></tr>
</tbody>
</table>
<p>Ces couches sont complémentaires et non alternatives. Un déploiement de production doit les superposer :</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replica</a> d'abord</strong> - gère les pannes les plus courantes (pannes de nœuds, pannes d'AZ) avec zéro temps d'arrêt et zéro perte de données.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> ensuite</strong> - protège contre les défaillances que la réplique multiple ne peut pas gérer : pannes à l'échelle du cluster, erreur humaine catastrophique. Le cluster de secours se trouve dans un domaine de défaillance différent.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">Sauvegardes périodiques</a> en permanence</strong> - votre filet de sécurité en dernier recours. Même le CDC ne peut pas vous sauver si des données corrompues sont répliquées sur le cluster de secours avant que vous ne vous en aperceviez.</li>
</ol>
<p>Lorsque vous évaluez des bases de données vectorielles, posez-vous la question suivante : laquelle de ces trois couches le produit prend-il réellement en charge ? La plupart des bases de données vectorielles actuelles ne proposent que la première. Milvus prend en charge les trois, le CDC étant une fonctionnalité intégrée - et non un module complémentaire tiers.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Qu'est-ce que Milvus CDC et comment fonctionne-t-il ?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<strong>CDC (Change Data Capture)</strong> est une fonction de réplication intégrée qui lit le <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a> du cluster primaire et transmet chaque entrée à un cluster de secours séparé. Le cluster en attente rejoue les entrées et se retrouve avec les mêmes données, généralement avec quelques secondes de retard.</p>
<p>Ce modèle est bien établi dans le monde des bases de données. MySQL dispose de la réplication binlog. PostgreSQL dispose de l'expédition WAL. MongoDB dispose d'une réplication basée sur l'oplog. Il s'agit de techniques éprouvées qui ont permis aux bases de données relationnelles et documentaires de fonctionner en production pendant des décennies. Milvus apporte la même approche aux charges de travail vectorielles - c'est la première grande <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a> à offrir une réplication basée sur WAL en tant que fonctionnalité intégrée.</p>
<p>Trois propriétés font de CDC une solution idéale pour la reprise après sinistre :</p>
<ul>
<li><strong>Synchronisation à faible latence.</strong> CDC diffuse les opérations au fur et à mesure qu'elles se produisent, et non par lots programmés. Dans des conditions normales, le système de secours n'a que quelques secondes de retard sur le système principal.</li>
<li><strong>Relecture ordonnée.</strong> Les opérations arrivent au système de secours dans le même ordre que celui dans lequel elles ont été écrites. Les données restent cohérentes sans réconciliation.</li>
<li><strong>Récupération des points de contrôle.</strong> Si le processus CDC se bloque ou si le réseau tombe en panne, il reprend là où il s'est arrêté. Aucune donnée n'est omise ou dupliquée.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Comment fonctionne l'architecture CDC ?</h3><p>Un déploiement CDC comporte trois éléments :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>Architecture CDC montrant le cluster source avec les nœuds de streaming et les nœuds CDC consommant le WAL, répliquant les données vers la couche Proxy du cluster cible, qui transmet les opérations DDL/DCL/DML aux nœuds de streaming et les ajoute au WAL.</span> </span></p>
<table>
<thead>
<tr><th>Composant</th><th>Rôle</th></tr>
</thead>
<tbody>
<tr><td><strong>Cluster primaire</strong></td><td>L'<a href="https://milvus.io/docs/architecture_overview.md">instance Milvus de</a> production. Toutes les lectures et écritures sont effectuées ici. Chaque écriture est enregistrée dans le WAL.</td></tr>
<tr><td><strong>Nœud CDC</strong></td><td>Un processus d'arrière-plan à côté du cluster primaire. Il lit les entrées WAL et les transmet au nœud de secours. Il s'exécute indépendamment du chemin de lecture/écriture - aucun impact sur les performances des requêtes ou des insertions.</td></tr>
<tr><td><strong>Cluster de secours</strong></td><td>Instance Milvus séparée qui reproduit les entrées WAL transférées. Elle contient les mêmes données que l'instance principale, avec quelques secondes de retard. Peut répondre à des requêtes en lecture mais n'accepte pas les écritures.</td></tr>
</tbody>
</table>
<p>Le flux : les écritures atteignent le primaire → le nœud CDC les copie sur le standby → le standby les rejoue. Rien d'autre ne parle au chemin d'écriture du standby. Si le serveur principal tombe en panne, le serveur de secours dispose déjà de la quasi-totalité des données et peut être promu.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Tutoriel : Configuration d'un cluster Milvus CDC en standby<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Le reste de cet article est une démonstration pratique. A la fin, vous aurez deux clusters Milvus en cours d'exécution avec une réplication en temps réel entre eux.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><p>Avant de commencer :</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 ou version ultérieure.</strong> Le CDC requiert cette version. Le dernier correctif 2.6.x est recommandé.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 ou version ultérieure.</strong> Ce guide utilise Operator pour la gestion des clusters sur Kubernetes.</li>
<li><strong>Un cluster Kubernetes en cours d'exécution</strong> avec <code translate="no">kubectl</code> et <code translate="no">helm</code> configurés.</li>
<li><strong>Python avec <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> pour l'étape de configuration de la réplication.</li>
</ul>
<p>Deux limitations dans la version actuelle :</p>
<table>
<thead>
<tr><th>Limitation</th><th>Détails</th></tr>
</thead>
<tbody>
<tr><td>Réplique CDC unique</td><td>Une réplique CDC par cluster. Le CDC distribué est prévu pour une prochaine version.</td></tr>
<tr><td>Pas de BulkInsert</td><td><a href="https://milvus.io/docs/import-data.md">BulkInsert</a> n'est pas pris en charge lorsque CDC est activé. Également prévu pour une prochaine version.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Etape 1 : Mise à niveau de l'opérateur Milvus</h3><p>Mettre à niveau l'opérateur Milvus vers la version 1.3.4 ou ultérieure :</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vérifier que le pod opérateur est en cours d'exécution :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Étape 2 : Déploiement du cluster primaire</h3><p>Créez un fichier YAML pour le cluster primaire (source). La section <code translate="no">cdc</code> sous <code translate="no">components</code> indique à l'opérateur de déployer un nœud CDC à côté du cluster :</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Le paramètre <code translate="no">msgStreamType: woodpecker</code> utilise le <a href="https://milvus.io/docs/four_layers.md">WAL Woodpecker</a> intégré de Milvus au lieu d'une file d'attente de messages externe comme Kafka ou Pulsar. Woodpecker est un journal write-ahead natif introduit dans Milvus 2.6 qui supprime le besoin d'une infrastructure de messagerie externe.</p>
<p>Appliquer la configuration :</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Attendre que tous les pods atteignent le statut Running. Confirmer que le pod CDC est en marche :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Etape 3 : Déployer le cluster de secours</h3><p>Le cluster de secours (cible) utilise la même version de Milvus mais n'inclut pas de composant CDC - il reçoit uniquement des données répliquées :</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Appliquer :</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vérifier que tous les pods fonctionnent :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Etape 4 : Configurer la relation de réplication</h3><p>Les deux clusters étant en cours d'exécution, configurez la topologie de réplication à l'aide de Python avec <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Définissez les détails de connexion du cluster et les noms des canaux physiques (pchannel) :</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Créez la configuration de réplication :</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Appliquer aux deux clusters :</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Une fois l'opération réussie, les modifications incrémentielles effectuées sur le cluster principal commencent à être répliquées automatiquement sur le cluster de secours.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Étape 5 : Vérifier que la réplication fonctionne</h3><ol>
<li>Connectez-vous au cluster primaire et <a href="https://milvus.io/docs/manage-collections.md">créez une collection</a>, <a href="https://milvus.io/docs/insert-update-delete.md">insérez quelques vecteurs</a> et <a href="https://milvus.io/docs/load-and-release.md">chargez-la</a>.</li>
<li>Lancez une recherche sur le serveur principal pour confirmer que les données y sont bien présentes.</li>
<li>Connectez-vous à l'ordinateur de secours et effectuez la même recherche.</li>
<li>Si l'ordinateur de secours renvoie les mêmes résultats, la réplication fonctionne.</li>
</ol>
<p>Le <a href="https://milvus.io/docs/quickstart.md">Quickstart Milvus</a> couvre la création, l'insertion et la recherche de collections si vous avez besoin d'une référence.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Exécution de CDC en production<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La mise en place de CDC est la partie la plus simple. Pour qu'il reste fiable au fil du temps, il faut prêter attention à quelques aspects opérationnels.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Surveiller le retard de réplication</h3><p>Le système de secours est toujours légèrement en retard par rapport au système principal, ce qui est inhérent à la réplication asynchrone. Dans des conditions normales de charge, le décalage est de quelques secondes. Mais les pics d'écriture, la congestion du réseau ou la pression sur les ressources du standby peuvent le faire augmenter.</p>
<p>Suivez le décalage en tant que mesure et alertez sur ce point. Un décalage qui augmente sans se résorber signifie généralement que le nœud CDC ne peut pas suivre le débit d'écriture. Vérifiez d'abord la bande passante du réseau entre les clusters, puis déterminez si le nœud en attente a besoin de plus de ressources.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Utiliser le standby pour la mise à l'échelle de la lecture</h3><p>Le standby n'est pas seulement une sauvegarde froide qui reste inactive jusqu'à ce qu'un désastre survienne. Il accepte les <a href="https://milvus.io/docs/single-vector-search.md">requêtes de recherche et d'interrogation</a> lorsque la réplication est active - seules les écritures sont bloquées. Cela ouvre la voie à des utilisations pratiques :</p>
<ul>
<li>Acheminer les charges de travail de <a href="https://zilliz.com/glossary/similarity-search">recherche</a> ou d'analyse de <a href="https://zilliz.com/glossary/similarity-search">similarité</a> par lots vers le serveur de secours.</li>
<li>Répartir le trafic de lecture pendant les heures de pointe afin de réduire la pression sur le serveur principal.</li>
<li>Exécuter des requêtes coûteuses (top-K volumineux, recherches filtrées sur de grandes collections) sans affecter la latence d'écriture de la production.</li>
</ul>
<p>Votre infrastructure de secours devient ainsi un atout en termes de performances. Le système de secours est rentabilisé même si rien n'est cassé.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Dimensionner correctement le standby</h3><p>Le standby reproduit chaque écriture du primaire, il a donc besoin de ressources de calcul et de mémoire similaires. Si vous lui acheminez également des lectures, tenez compte de cette charge supplémentaire. Les besoins en stockage sont identiques, car il contient les mêmes données.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Testez le basculement avant d'en avoir besoin</h3><p>N'attendez pas une panne réelle pour découvrir que votre processus de basculement ne fonctionne pas. Procédez à des exercices périodiques :</p>
<ol>
<li>Arrêtez les écritures sur le serveur principal</li>
<li>Attendez que le système de secours rattrape son retard (décalage → 0).</li>
<li>Promouvoir le standby</li>
<li>Vérifier que les requêtes renvoient les résultats attendus</li>
<li>Inverser le processus</li>
</ol>
<p>Mesurez la durée de chaque étape et documentez-la. L'objectif est de faire du basculement une procédure de routine avec un calendrier connu - et non une improvisation stressante à 3 heures du matin. La troisième partie de cette série couvre en détail le processus de basculement.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Vous ne voulez pas gérer le CDC vous-même ? Zilliz Cloud s'en charge<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>La mise en place et le fonctionnement de la réplication CDC de Milvus sont puissants, mais ils s'accompagnent d'une surcharge opérationnelle : vous devez gérer deux clusters, surveiller l'état de la réplication, gérer les runbooks de basculement et maintenir l'infrastructure dans toutes les régions. Pour les équipes qui veulent une HA de niveau production sans la charge opérationnelle, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) fournit cela dès le départ.</p>
<p><strong>Global Cluster</strong> est la fonctionnalité phare de Zilliz Cloud. Elle vous permet d'exécuter un déploiement Milvus couvrant plusieurs régions (Amérique du Nord, Europe, Asie-Pacifique, etc.) en tant que cluster logique unique. Sous le capot, il utilise la même technologie de réplication CDC/WAL décrite dans cet article, mais entièrement gérée :</p>
<table>
<thead>
<tr><th>Capacité</th><th>CDC autogéré (cet article)</th><th>Cluster mondial de Zilliz Cloud</th></tr>
</thead>
<tbody>
<tr><td><strong>Réplication</strong></td><td>Vous configurez et surveillez</td><td>Pipeline CDC automatisé et asynchrone</td></tr>
<tr><td><strong>Basculement</strong></td><td>Manuel d'exécution</td><td>Automatisé - pas de changement de code, pas de mise à jour des chaînes de connexion</td></tr>
<tr><td><strong>Auto-réparation</strong></td><td>Vous réapprovisionnez le cluster défaillant</td><td>Automatique : détecte l'état périmé, réinitialise et reconstruit un nouveau cluster secondaire.</td></tr>
<tr><td><strong>Transrégionale</strong></td><td>Vous déployez et gérez les deux clusters</td><td>Multirégion intégrée avec accès local en lecture</td></tr>
<tr><td><strong>RPO</strong></td><td>Secondes (en fonction de votre surveillance)</td><td>Secondes (non planifié) / Zéro (basculement planifié)</td></tr>
<tr><td><strong>RTO</strong></td><td>Minutes (dépend de votre runbook)</td><td>Minutes (automatisé)</td></tr>
</tbody>
</table>
<p>En plus de Global Cluster, le plan Business Critical inclut des fonctionnalités DR supplémentaires :</p>
<ul>
<li><strong>Récupération ponctuelle (PITR)</strong> - retour en arrière d'une collection à n'importe quel moment de la fenêtre de rétention, utile pour récupérer des suppressions accidentelles ou une corruption de données qui se réplique sur le standby.</li>
<li><strong>Sauvegarde interrégionale</strong> - réplication automatisée et continue des sauvegardes vers une région de destination. La restauration vers de nouveaux clusters ne prend que quelques minutes.</li>
<li><strong>Accord de niveau de service (SLA) de 99,99 %</strong> - soutenu par un déploiement multi-zones avec plusieurs réplicas.</li>
</ul>
<p>Si vous exécutez des recherches vectorielles en production et que le DR est une exigence, il vaut la peine d'évaluer Zilliz Cloud parallèlement à l'approche autogérée de Milvus. <a href="https://zilliz.com/contact-sales">Contactez l'équipe Zilliz</a> pour plus d'informations.</p>
<h2 id="Whats-Next" class="common-anchor-header">À suivre<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Cet article a couvert le paysage HA pour les bases de données vectorielles et a décrit la construction d'une paire primaire-standby à partir de zéro. Prochainement :</p>
<ul>
<li><strong>Partie 2</strong>: Ajout de CDC à un cluster Milvus existant qui contient déjà des données, en utilisant <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> pour ensemencer le standby avant d'activer la réplication.</li>
<li><strong>Partie 3</strong>: Gestion du basculement - promotion du standby, redirection du trafic et récupération du primaire d'origine.</li>
</ul>
<p>Restez à l'écoute.</p>
<hr>
<p>Si vous utilisez <a href="https://milvus.io/">Milvus</a> en production et que vous pensez à la reprise après sinistre, nous serions ravis de vous aider :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Slack Milvus</a> pour poser des questions, partager votre architecture HA et apprendre des autres équipes qui utilisent Milvus à grande échelle.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite de 20 minutes de Milvus Office Hours</a> pour découvrir votre configuration DR, qu'il s'agisse de la configuration CDC, de la planification du basculement ou du déploiement multirégional.</li>
<li>Si vous préférez ignorer la configuration de l'infrastructure et passer directement à une HA prête pour la production, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus géré) offre une haute disponibilité interrégionale grâce à sa fonction Global Cluster - aucune configuration manuelle du CDC n'est nécessaire.</li>
</ul>
<hr>
<p>Voici quelques questions qui se posent lorsque les équipes commencent à mettre en place la haute disponibilité des bases de données vectorielles :</p>
<p><strong>Q : Le CDC ralentit-il le cluster primaire ?</strong></p>
<p>Non. Le nœud CDC lit les journaux WAL de manière asynchrone, indépendamment du chemin de lecture/écriture. Il n'entre pas en concurrence avec les requêtes ou les insertions pour les ressources du cluster primaire. Vous ne constaterez pas de différence de performances lorsque le CDC est activé.</p>
<p><strong>Q : Le CDC peut-il répliquer des données qui existaient avant qu'il ne soit activé ?</strong></p>
<p>Non, CDC ne capture les changements qu'à partir du moment où il est activé. Pour apporter des données existantes dans le système de secours, utilisez <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> pour ensemencer le système de secours, puis activez le CDC pour la réplication continue. La partie 2 de cette série couvre ce flux de travail.</p>
<p><strong>Q : Ai-je toujours besoin de CDC si j'ai déjà activé la réplication multiple ?</strong></p>
<p>Ils protègent contre des modes de défaillance différents. <a href="https://milvus.io/docs/replica.md">Multi-replica</a> conserve des copies des mêmes <a href="https://milvus.io/docs/glossary.md">segments</a> entre les nœuds d'un même cluster - ce qui est très utile en cas de défaillance d'un nœud, mais inutile lorsque tout le cluster a disparu (mauvais déploiement, panne d'AZ, suppression d'un espace de noms). CDC conserve un cluster séparé dans un domaine de défaillance différent avec des données en temps quasi réel. Au-delà d'un environnement de développement, il faut les deux.</p>
<p><strong>Q : Comment Milvus CDC se compare-t-il à la réplication dans d'autres bases de données vectorielles ?</strong></p>
<p>La plupart des bases de données vectorielles actuelles offrent une redondance au niveau des nœuds (équivalente à la réplication multiple) mais ne disposent pas de réplication au niveau des clusters. Milvus est actuellement la seule base de données vectorielle majeure à intégrer une réplication CDC basée sur WAL - le même modèle éprouvé que les bases de données relationnelles telles que PostgreSQL et MySQL utilisent depuis des décennies. Si le basculement entre clusters ou entre régions est une exigence, il s'agit d'un facteur de différenciation important à évaluer.</p>
