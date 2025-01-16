---
id: deep-dive-1-milvus-architecture-overview.md
title: >-
  Construction d'une base de données vectorielle pour une recherche de
  similarité évolutive
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  Le premier d'une série de blogs visant à examiner de plus près le processus de
  réflexion et les principes de conception qui sous-tendent la construction de
  la base de données vectorielles open-source la plus populaire.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par Xiaofan Luan et traduit par Angela Ni et Claire Yu.</p>
</blockquote>
<p>Selon les <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">statistiques</a>, environ 80 à 90 % des données mondiales ne sont pas structurées. Alimentée par la croissance rapide de l'Internet, une explosion des données non structurées est attendue dans les années à venir. Par conséquent, les entreprises ont un besoin urgent d'une base de données puissante qui puisse les aider à mieux gérer et comprendre ce type de données. Cependant, développer une base de données est toujours plus facile à dire qu'à faire. Cet article vise à partager le processus de réflexion et les principes de conception de Milvus, une base de données vectorielles open-source et cloud-native pour la recherche de similarités évolutive. Cet article explique également l'architecture de Milvus en détail.</p>
<p>Aller à :</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Les données non structurées nécessitent une pile logicielle de base complète</a><ul>
<li><a href="#Vectors-and-scalars">Vecteurs et scalaires</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Du moteur de recherche vectoriel à la base de données vectorielle</a></li>
<li><a href="#A-cloud-native-first-approach">Une première approche "cloud-native</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Les principes de conception de Milvus 2.0</a><ul>
<li><a href="#Log-as-data">Le journal en tant que données</a></li>
<li><a href="#Duality-of-table-and-log">Dualité de la table et du journal</a></li>
<li><a href="#Log-persistency">Persistance du journal</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Construction d'une base de données vectorielle pour une recherche de similarité évolutive</a><ul>
<li><a href="#Standalone-and-cluster">Autonome et en grappe</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Un squelette de l'architecture Milvus</a></li>
<li><a href="#Data-Model">Modèle de données</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Les données non structurées nécessitent une pile logicielle de base complète<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la croissance et l'évolution de l'internet, les données non structurées sont devenues de plus en plus courantes, notamment les courriels, les articles, les données de capteurs IoT, les photos Facebook, les structures de protéines et bien d'autres choses encore. Pour que les ordinateurs puissent comprendre et traiter les données non structurées, celles-ci sont converties en vecteurs à l'aide de <a href="https://zilliz.com/learn/embedding-generation">techniques d'intégration</a>.</p>
<p>Milvus stocke et indexe ces vecteurs et analyse la corrélation entre deux vecteurs en calculant leur distance de similarité. Si les deux vecteurs d'intégration sont très similaires, cela signifie que les sources de données d'origine le sont également.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>Le flux de travail du traitement des données non structurées</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vecteurs et scalaires</h3><p>Un scalaire est une quantité qui n'est décrite que par une seule mesure - la magnitude. Un scalaire peut être représenté par un nombre. Par exemple, une voiture roule à une vitesse de 80 km/h. Ici, la vitesse (80 km/h) est égale à la vitesse du véhicule. La vitesse (80 km/h) est un scalaire. Un vecteur, quant à lui, est une quantité décrite par au moins deux mesures : la magnitude et la direction. Si une voiture se déplace vers l'ouest à la vitesse de 80 km/h, la vitesse (80 km/h vers l'ouest) est un vecteur. L'image ci-dessous est un exemple de scalaires et de vecteurs courants.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Scalaires et vecteurs</span> </span></p>
<p>Comme la plupart des données importantes ont plus d'un attribut, nous pouvons mieux comprendre ces données si nous les convertissons en vecteurs. Une façon courante de manipuler les données vectorielles consiste à calculer la distance entre les vecteurs à l'aide de <a href="https://milvus.io/docs/v2.0.x/metric.md">mesures</a> telles que la distance euclidienne, le produit intérieur, la distance de Tanimoto, la distance de Hamming, etc. Plus la distance est faible, plus les vecteurs sont similaires. Pour interroger efficacement un ensemble massif de données vectorielles, nous pouvons organiser les données vectorielles en créant des index. Une fois l'ensemble de données indexé, les requêtes peuvent être acheminées vers les grappes, ou sous-ensembles de données, qui sont les plus susceptibles de contenir des vecteurs similaires à une requête d'entrée.</p>
<p>Pour en savoir plus sur les index, voir <a href="https://milvus.io/docs/v2.0.x/index.md">Index vectoriel</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Du moteur de recherche vectoriel à la base de données vectorielle</h3><p>Dès le départ, Milvus 2.0 a été conçu pour servir non seulement de moteur de recherche, mais surtout de puissante base de données vectorielles.</p>
<p>Pour vous aider à comprendre la différence, nous pouvons faire une analogie entre <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> et <a href="https://www.mysql.com/">MySQL</a>, ou <a href="https://lucene.apache.org/">Lucene</a> et <a href="https://www.elastic.co/">Elasticsearch</a>.</p>
<p>Tout comme MySQL et Elasticsearch, Milvus est également construit sur des bibliothèques open-source telles que <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, qui se concentrent sur la fourniture de fonctionnalités de recherche et la garantie des performances de recherche. Cependant, il serait injuste de réduire Milvus à une simple couche au-dessus de Faiss, car il stocke, récupère et analyse les vecteurs et, comme pour toute autre base de données, fournit également une interface standard pour les opérations CRUD. En outre, Milvus peut se targuer d'offrir les fonctionnalités suivantes</p>
<ul>
<li>le partage et le partitionnement</li>
<li>la réplication</li>
<li>Reprise après sinistre</li>
<li>Équilibrage de la charge</li>
<li>Analyseur ou optimiseur de requêtes</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Base de données vectorielle</span> </span></p>
<p>Pour mieux comprendre ce qu'est une base de données vectorielle, lisez le blog <a href="https://zilliz.com/learn/what-is-vector-database">ici.</a></p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Une première approche "cloud-native</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Une approche "cloud-native</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">Du "rien partagé" au "stockage partagé", puis au "quelque chose partagé".</h4><p>Les bases de données traditionnelles adoptaient une architecture "sans partage" dans laquelle les nœuds des systèmes distribués étaient indépendants mais connectés par un réseau. Aucune mémoire ni aucun espace de stockage n'est partagé entre les nœuds. Cependant, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> a révolutionné le secteur en introduisant une architecture de "stockage partagé" dans laquelle le calcul (traitement des requêtes) est séparé du stockage (stockage de la base de données). Avec une architecture de stockage partagé, les bases de données peuvent bénéficier d'une plus grande disponibilité, d'une plus grande évolutivité et d'une réduction de la duplication des données. Inspirées par Snowflake, de nombreuses entreprises ont commencé à exploiter l'infrastructure en nuage pour la persistance des données tout en utilisant le stockage local pour la mise en cache. Ce type d'architecture de base de données est appelé "shared something" (quelque chose de partagé) et est devenu l'architecture la plus courante dans la plupart des applications aujourd'hui.</p>
<p>Outre l'architecture "shared something", Milvus prend en charge une mise à l'échelle flexible de chaque composant en utilisant Kubernetes pour gérer son moteur d'exécution et en séparant les services de lecture, d'écriture et autres avec des microservices.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Base de données en tant que service (DBaaS)</h4><p>La base de données en tant que service est une tendance brûlante, car de nombreux utilisateurs ne s'intéressent pas seulement aux fonctionnalités habituelles des bases de données, mais aspirent également à des services plus variés. Cela signifie qu'en plus des opérations CRUD traditionnelles, notre base de données doit enrichir le type de services qu'elle peut fournir, tels que la gestion de base de données, le transport de données, le chargement, la visualisation, etc.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Synergie avec l'écosystème open-source au sens large</h4><p>Une autre tendance dans le développement des bases de données consiste à tirer parti de la synergie entre la base de données et d'autres infrastructures natives du cloud. Dans le cas de Milvus, il s'appuie sur certains systèmes open-source. Par exemple, Milvus utilise <a href="https://etcd.io/">etcd</a> pour stocker les métadonnées. Il adopte également la file d'attente de messages, un type de communication asynchrone de service à service utilisé dans l'architecture microservices, qui peut aider à exporter des données incrémentielles.</p>
<p>À l'avenir, nous espérons construire Milvus au-dessus d'infrastructures d'IA telles que <a href="https://spark.apache.org/">Spark</a> ou <a href="https://www.tensorflow.org/">Tensorflow</a>, et intégrer Milvus avec des moteurs de streaming afin de mieux prendre en charge le traitement unifié des flux et des lots pour répondre aux différents besoins des utilisateurs de Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Les principes de conception de Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>En tant que base de données vectorielle cloud-native de nouvelle génération, Milvus 2.0 s'articule autour des trois principes suivants.</p>
<h3 id="Log-as-data" class="common-anchor-header">Le journal en tant que données</h3><p>Le journal d'une base de données enregistre en série toutes les modifications apportées aux données. Comme le montre la figure ci-dessous, de gauche à droite se trouvent les &quot;anciennes données&quot; et les &quot;nouvelles données&quot;. Les journaux sont classés par ordre chronologique. Milvus dispose d'un mécanisme de temporisation global qui attribue un horodatage unique et auto-incrémentiel.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>Journaux</span> </span></p>
<p>Dans Milvus 2.0, le courtier en journaux sert de colonne vertébrale au système : toutes les opérations d'insertion et de mise à jour de données doivent passer par le courtier en journaux, et les nœuds de travail exécutent les opérations CRUD en s'abonnant aux journaux et en les consommant.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualité de la table et du journal</h3><p>La table et le journal sont tous deux des données, et ils ne sont que deux formes différentes. Les tables sont des données délimitées, tandis que les journaux sont non délimités. Les journaux peuvent être convertis en tables. Dans le cas de Milvus, les journaux sont agrégés à l'aide d'une fenêtre de traitement de TimeTick. En fonction de la séquence des journaux, plusieurs journaux sont regroupés dans un petit fichier appelé instantané de journal. Ces instantanés sont ensuite combinés pour former un segment, qui peut être utilisé individuellement pour l'équilibrage de la charge.</p>
<h3 id="Log-persistency" class="common-anchor-header">Persistance des journaux</h3><p>La persistance des journaux est l'un des problèmes délicats auxquels sont confrontées de nombreuses bases de données. Le stockage des journaux dans un système distribué dépend généralement des algorithmes de réplication.</p>
<p>Contrairement à des bases de données telles que <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a> et <a href="https://en.pingcap.com/">TiDB</a>, Milvus adopte une approche novatrice et introduit un système de publication et d'abonnement (pub/sub) pour le stockage et la persistance des journaux. Un système pub/sub est analogue à la file d'attente de messages dans <a href="https://kafka.apache.org/">Kafka</a> ou <a href="https://pulsar.apache.org/">Pulsar</a>. Tous les nœuds du système peuvent consommer les journaux. Dans Milvus, ce type de système est appelé "log broker". Grâce au courtier de journaux, les journaux sont découplés du serveur, ce qui garantit que Milvus est lui-même sans état et mieux placé pour récupérer rapidement en cas de défaillance du système.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Courtier en journaux</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Construction d'une base de données vectorielle pour une recherche de similarité évolutive<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Construit au-dessus des bibliothèques de recherche vectorielle les plus populaires, notamment Faiss, ANNOY et HNSW, Milvus a été conçu pour la recherche de similarités sur des ensembles de données vectorielles denses contenant des millions, des milliards, voire des trillions de vecteurs.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Autonome et en grappe</h3><p>Milvus offre deux modes de déploiement : autonome ou en grappe. Dans Milvus standalone, comme tous les nœuds sont déployés ensemble, nous pouvons considérer Milvus comme un seul processus. Actuellement, Milvus autonome repose sur MinIO et etcd pour la persistance des données et le stockage des métadonnées. Dans les prochaines versions, nous espérons éliminer ces deux dépendances tierces pour garantir la simplicité du système Milvus. Le cluster Milvus comprend huit composants microservices et trois dépendances tierces : MinIO, etcd et Pulsar. Pulsar sert de courtier en journaux et fournit des services de publication/souscription de journaux.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Autonome et cluster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Un squelette de base de l'architecture Milvus</h3><p>Milvus sépare le flux de données du flux de contrôle et est divisé en quatre couches indépendantes en termes d'évolutivité et de reprise après sinistre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture Milvus</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Couche d'accès</h4><p>La couche d'accès agit comme le visage du système, exposant l'extrémité de la connexion du client au monde extérieur. Elle est chargée de traiter les connexions des clients, d'effectuer des vérifications statiques, des contrôles dynamiques de base pour les demandes des utilisateurs, de transmettre les demandes et de rassembler et renvoyer les résultats au client. Le proxy lui-même est sans état et fournit des adresses d'accès et des services unifiés au monde extérieur par le biais de composants d'équilibrage de charge (Nginx, Kubernetess Ingress, NodePort et LVS). Milvus utilise une architecture de traitement massivement parallèle (MPP), dans laquelle les proxys renvoient les résultats collectés à partir des nœuds de travail après agrégation globale et post-traitement.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Service de coordination</h4><p>Le service de coordination est le cerveau du système, responsable de la gestion des nœuds de la topologie de la grappe, de l'équilibrage de la charge, de la génération des horodatages, de la déclaration des données et de la gestion des données. Pour une explication détaillée de la fonction de chaque service coordinateur, consultez la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">documentation technique de Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Nœuds de travail</h4><p>Le nœud de travailleur, ou nœud d'exécution, agit comme les membres du système, exécutant les instructions émises par le service coordinateur et les commandes de langage de manipulation de données (DML) lancées par le proxy. Un nœud de travailleur dans Milvus est similaire à un nœud de données dans <a href="https://hadoop.apache.org/">Hadoop</a> ou à un serveur de région dans HBase. Chaque type de nœud de travailleur correspond à un service de coordination. Pour une explication détaillée de la fonction de chaque nœud de travailleur, consultez la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">documentation technique de Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Stockage</h4><p>Le stockage est la pierre angulaire de Milvus, responsable de la persistance des données. La couche de stockage est divisée en trois parties :</p>
<ul>
<li><strong>Le méta-magasin :</strong> Responsable du stockage des instantanés de métadonnées telles que le schéma de collecte, l'état des nœuds, les points de contrôle de la consommation de messages, etc. Milvus s'appuie sur etcd pour ces fonctions et Etcd assume également la responsabilité de l'enregistrement des services et des contrôles de santé.</li>
<li><strong>Courtier en journaux :</strong> Un système pub/sub qui prend en charge la lecture et est responsable de la persistance des données en continu, de l'exécution fiable des requêtes asynchrones, des notifications d'événements et du retour des résultats des requêtes. Lorsque les nœuds effectuent une récupération en cas d'arrêt, le courtier de journaux garantit l'intégrité des données incrémentielles par le biais de la lecture du courtier de journaux. Le cluster Milvus utilise Pulsar comme courtier de journalisation, tandis que le mode autonome utilise RocksDB. Les services de stockage en continu tels que Kafka et Pravega peuvent également être utilisés comme courtiers en journaux.</li>
<li><strong>Stockage d'objets :</strong> Stocke les fichiers d'instantanés des journaux, les fichiers d'index scalaire/vectoriel et les résultats intermédiaires du traitement des requêtes. Milvus prend en charge <a href="https://aws.amazon.com/s3/">AWS S3</a> et <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>, ainsi que <a href="https://min.io/">MinIO</a>, un service de stockage d'objets léger et open-source. En raison de la latence d'accès élevée et de la facturation par requête des services de stockage d'objets, Milvus prendra bientôt en charge les pools de cache basés sur la mémoire/SSD et la séparation des données chaudes/froides afin d'améliorer les performances et de réduire les coûts.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Modèle de données</h3><p>Le modèle de données organise les données dans une base de données. Dans Milvus, toutes les données sont organisées par collection, par tesson, par partition, par segment et par entité.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Modèle de données 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Collection</h4><p>Une collection dans Milvus peut être comparée à une table dans un système de stockage relationnel. La collection est la plus grande unité de données dans Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Tesson</h4><p>Pour tirer pleinement parti de la puissance de calcul parallèle des clusters lors de l'écriture des données, les collections dans Milvus doivent répartir les opérations d'écriture des données sur différents nœuds. Par défaut, une collection unique contient deux shards. En fonction du volume de votre jeu de données, vous pouvez avoir plus de tiroirs dans une collection. Milvus utilise une méthode de hachage par clé maîtresse pour le partage.</p>
<h4 id="Partition" class="common-anchor-header">Partition</h4><p>Il existe également plusieurs partitions dans un shard. Dans Milvus, une partition fait référence à un ensemble de données portant la même étiquette dans une collection. Les méthodes de partitionnement courantes comprennent le partitionnement par date, par sexe, par âge de l'utilisateur, etc. La création de partitions peut être bénéfique pour le processus d'interrogation, car des données considérables peuvent être filtrées par étiquette de partition.</p>
<p>En comparaison, le sharding est davantage axé sur les capacités de mise à l'échelle lors de l'écriture des données, tandis que le partitionnement est davantage axé sur l'amélioration des performances du système lors de la lecture des données.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Modèle de données 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segments</h4><p>Au sein de chaque partition, il existe plusieurs petits segments. Un segment est la plus petite unité de planification du système dans Milvus. Il existe deux types de segments : les segments croissants et les segments scellés. Les segments croissants sont souscrits par les nœuds de requête. L'utilisateur de Milvus continue d'écrire des données dans des segments croissants. Lorsque la taille d'un segment croissant atteint une limite supérieure (512 Mo par défaut), le système n'autorise pas l'écriture de données supplémentaires dans ce segment croissant, d'où la fermeture de ce segment. Les index sont construits sur des segments scellés.</p>
<p>Pour accéder aux données en temps réel, le système lit les données à la fois dans les segments croissants et dans les segments scellés.</p>
<h4 id="Entity" class="common-anchor-header">Entités</h4><p>Chaque segment contient un grand nombre d'entités. Une entité dans Milvus est équivalente à une ligne dans une base de données traditionnelle. Chaque entité possède un champ de clé primaire unique, qui peut également être généré automatiquement. Les entités doivent également contenir un horodatage (ts) et un champ vectoriel - le cœur de Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale</a> de Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
