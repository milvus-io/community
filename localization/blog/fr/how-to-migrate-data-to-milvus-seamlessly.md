---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: >-
  Comment migrer vos données vers Milvus en toute transparence : Un guide
  complet
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Un guide complet sur la migration de vos données depuis Elasticsearch, FAISS
  et les anciennes versions de Milvus 1.x vers Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielles open-source robuste pour la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités</a> qui peut stocker, traiter et récupérer des milliards, voire des trillions de données vectorielles avec une latence minimale. Elle est également très évolutive, fiable, cloud-native et riche en fonctionnalités. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">La dernière version de Milvus</a> présente encore plus de fonctionnalités et d'améliorations intéressantes, notamment la <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">prise en charge des GPU</a> pour des performances 10 fois plus rapides et MMap pour une plus grande capacité de stockage sur une seule machine.</p>
<p>En septembre 2023, Milvus a obtenu près de 23 000 étoiles sur GitHub et compte des dizaines de milliers d'utilisateurs issus de divers secteurs d'activité et ayant des besoins variés. Il devient encore plus populaire à mesure que la technologie d'IA générative comme <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> devient plus répandue. Il s'agit d'un composant essentiel de plusieurs piles d'IA, en particulier le cadre de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">génération augmentée de recherche</a>, qui aborde le problème de l'hallucination des modèles de langage de grande taille.</p>
<p>Pour répondre à la demande croissante des nouveaux utilisateurs qui souhaitent migrer vers Milvus et des utilisateurs existants qui souhaitent passer aux dernières versions de Milvus, nous avons développé <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. Dans ce blog, nous allons explorer les fonctionnalités de Milvus Migration et vous guider dans la transition rapide de vos données vers Milvus à partir de Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> et <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> et au-delà.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, un puissant outil de migration de données<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> est un outil de migration de données écrit en Go. Il permet aux utilisateurs de déplacer leurs données en toute transparence depuis les anciennes versions de Milvus (1.x), FAISS et Elasticsearch 7.0 et au-delà vers les versions Milvus 2.x.</p>
<p>Le diagramme ci-dessous montre comment nous avons construit Milvus Migration et comment il fonctionne.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Comment Milvus Migration migre les données</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">De Milvus 1.x et FAISS vers Milvus 2.x</h4><p>La migration des données de Milvus 1.x et FAISS implique l'analyse du contenu des fichiers de données d'origine, leur transformation dans le format de stockage de données de Milvus 2.x et l'écriture des données à l'aide de <code translate="no">bulkInsert</code> du SDK Milvus. L'ensemble de ce processus est basé sur le flux, théoriquement limité uniquement par l'espace disque, et stocke les fichiers de données sur votre disque local, S3, OSS, GCP ou Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">D'Elasticsearch à Milvus 2.x</h4><p>Dans la migration de données Elasticsearch, la récupération des données est différente. Les données ne sont pas obtenues à partir de fichiers mais séquentiellement à l'aide de l'API de défilement d'Elasticsearch. Les données sont ensuite analysées et transformées dans le format de stockage Milvus 2.x, puis écrites à l'aide de <code translate="no">bulkInsert</code>. Outre la migration des vecteurs de type <code translate="no">dense_vector</code> stockés dans Elasticsearch, Milvus Migration prend également en charge la migration d'autres types de champs, notamment long, entier, court, booléen, mot-clé, texte et double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Ensemble de fonctionnalités de Milvus Migration</h3><p>Milvus Migration simplifie le processus de migration grâce à son ensemble de fonctionnalités robustes :</p>
<ul>
<li><p><strong>Sources de données prises en charge :</strong></p>
<ul>
<li><p>Milvus 1.x à Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 et au-delà vers Milvus 2.x</p></li>
<li><p>FAISS vers Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Modes d'interaction multiples :</strong></p>
<ul>
<li><p>Interface de ligne de commande (CLI) utilisant le cadre Cobra</p></li>
<li><p>Restful API avec une interface utilisateur Swagger intégrée</p></li>
<li><p>Intégration en tant que module Go dans d'autres outils</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Prise en charge de formats de fichiers polyvalents :</strong></p>
<ul>
<li><p>Fichiers locaux</p></li>
<li><p>Amazon S3</p></li>
<li><p>Service de stockage d'objets (OSS)</p></li>
<li><p>Plate-forme Google Cloud (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Intégration flexible d'Elasticsearch :</strong></p>
<ul>
<li><p>Migration des vecteurs de type <code translate="no">dense_vector</code> à partir d'Elasticsearch</p></li>
<li><p>Prise en charge de la migration d'autres types de champs tels que long, integer, short, boolean, keyword, text et double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Définitions des interfaces</h3><p>Milvus Migration fournit les interfaces clés suivantes :</p>
<ul>
<li><p><code translate="no">/start</code>: Lance un travail de migration (équivalent à une combinaison de vidage et de chargement, ne prend actuellement en charge que la migration ES).</p></li>
<li><p><code translate="no">/dump</code>: Lance une tâche de vidage (écrit les données source sur le support de stockage cible).</p></li>
<li><p><code translate="no">/load</code>: Lance une tâche de chargement (écrit les données du support de stockage cible dans Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Permet aux utilisateurs de visualiser les résultats de l'exécution du travail. (Pour plus de détails, reportez-vous au <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">fichier server.go du projet</a>).</p></li>
</ul>
<p>Ensuite, utilisons quelques données d'exemple pour explorer comment utiliser Milvus Migration dans cette section. Vous pouvez trouver ces exemples <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">ici</a> sur GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migration d'Elasticsearch vers Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Préparation des données Elasticsearch</li>
</ol>
<p>Pour <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">migrer des</a> données <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>, vous devez déjà configurer votre propre serveur Elasticsearch. Vous devez stocker les données vectorielles dans le champ <code translate="no">dense_vector</code> et les indexer avec d'autres champs. Les correspondances d'index sont indiquées ci-dessous.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Compilation et construction</li>
</ol>
<p>Tout d'abord, téléchargez le <a href="https://github.com/zilliztech/milvus-migration">code source</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">depuis GitHub</a>. Ensuite, exécutez les commandes suivantes pour le compiler.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Cette étape génère un fichier exécutable nommé <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurer <code translate="no">migration.yaml</code></li>
</ol>
<p>Avant de démarrer la migration, vous devez préparer un fichier de configuration nommé <code translate="no">migration.yaml</code> qui inclut des informations sur la source de données, la cible et d'autres paramètres pertinents. Voici un exemple de configuration :</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Pour une explication plus détaillée du fichier de configuration, reportez-vous à <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">cette page</a> sur GitHub.</p>
<ol start="4">
<li>Exécuter la tâche de migration</li>
</ol>
<p>Maintenant que vous avez configuré votre fichier <code translate="no">migration.yaml</code>, vous pouvez lancer la tâche de migration en exécutant la commande suivante :</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Observez la sortie du journal. Si vous voyez des journaux similaires à ceux qui suivent, cela signifie que la migration s'est déroulée avec succès.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Outre l'approche en ligne de commande, Milvus Migration prend également en charge la migration à l'aide de Restful API.</p>
<p>Pour utiliser Restful API, démarrez le serveur API à l'aide de la commande suivante :</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Une fois le service exécuté, vous pouvez lancer la migration en appelant l'API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque la migration est terminée, vous pouvez utiliser <a href="https://zilliz.com/attu">Attu</a>, un outil d'administration de bases de données vectorielles tout-en-un, pour afficher le nombre total de lignes migrées avec succès et effectuer d'autres opérations liées à la collecte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>L'interface Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migration de Milvus 1.x vers Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Préparation des données Milvus 1.x</li>
</ol>
<p>Pour vous aider à découvrir rapidement le processus de migration, nous avons placé 10 000 enregistrements de <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">données de test</a> Milvus 1.x dans le code source de Milvus Migration. Toutefois, dans la réalité, vous devez exporter votre propre fichier <code translate="no">meta.json</code> à partir de votre instance Milvus 1.x avant de lancer le processus de migration.</p>
<ul>
<li>Vous pouvez exporter les données à l'aide de la commande suivante.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Veillez à :</p>
<ul>
<li><p>Remplacer les caractères de remplacement par vos identifiants MySQL réels.</p></li>
<li><p>Arrêter le serveur Milvus 1.x ou interrompre l'écriture des données avant d'effectuer cette exportation.</p></li>
<li><p>Copier le dossier Milvus <code translate="no">tables</code> et le fichier <code translate="no">meta.json</code> dans le même répertoire.</p></li>
</ul>
<p><strong>Remarque :</strong> Si vous utilisez Milvus 2.x sur <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (le service entièrement géré de Milvus), vous pouvez démarrer la migration à l'aide de Cloud Console.</p>
<ol start="2">
<li>Compiler et construire</li>
</ol>
<p>Tout d'abord, téléchargez le <a href="https://github.com/zilliztech/milvus-migration">code source</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">depuis GitHub</a>. Ensuite, exécutez les commandes suivantes pour le compiler.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Cette étape génère un fichier exécutable nommé <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurer <code translate="no">migration.yaml</code></li>
</ol>
<p>Préparez un fichier de configuration <code translate="no">migration.yaml</code>, en spécifiant des détails sur la source, la cible et d'autres paramètres pertinents. Voici un exemple de configuration :</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Pour une explication plus détaillée du fichier de configuration, reportez-vous à <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">cette page</a> sur GitHub.</p>
<ol start="4">
<li>Exécuter le job de migration</li>
</ol>
<p>Vous devez exécuter les commandes <code translate="no">dump</code> et <code translate="no">load</code> séparément pour terminer la migration. Ces commandes convertissent les données et les importent dans Milvus 2.x.</p>
<p><strong>Remarque :</strong> Nous allons simplifier cette étape et permettre aux utilisateurs de terminer la migration à l'aide d'une seule commande prochainement. Restez à l'écoute.</p>
<p><strong>Commande Dump :</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Commande Load :</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Après la migration, la collection générée dans Milvus 2.x contiendra deux champs : <code translate="no">id</code> et <code translate="no">data</code>. Vous pouvez obtenir plus de détails en utilisant <a href="https://zilliz.com/attu">Attu</a>, un outil d'administration de base de données vectorielles tout-en-un.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migration de FAISS vers Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Préparer les données FAISS</li>
</ol>
<p>Pour migrer les données Elasticsearch, vous devez préparer vos propres données FAISS. Pour vous aider à découvrir rapidement le processus de migration, nous avons intégré des <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">données de test FAISS</a> dans le code source de Milvus Migration.</p>
<ol start="2">
<li>Compiler et construire</li>
</ol>
<p>Tout d'abord, téléchargez le <a href="https://github.com/zilliztech/milvus-migration">code source</a> de Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">sur GitHub</a>. Ensuite, exécutez les commandes suivantes pour le compiler.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Cette étape génère un fichier exécutable nommé <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurer <code translate="no">migration.yaml</code></li>
</ol>
<p>Préparez un fichier de configuration <code translate="no">migration.yaml</code> pour la migration FAISS, en spécifiant des détails sur la source, la cible et d'autres paramètres pertinents. Voici un exemple de configuration :</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Pour une explication plus détaillée du fichier de configuration, reportez-vous à <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">cette page</a> sur GitHub.</p>
<ol start="4">
<li>Exécuter la tâche de migration</li>
</ol>
<p>Comme la migration de Milvus 1.x vers Milvus 2.x, la migration FAISS nécessite l'exécution des commandes <code translate="no">dump</code> et <code translate="no">load</code>. Ces commandes convertissent les données et les importent dans Milvus 2.x.</p>
<p><strong>Remarque :</strong> Nous allons bientôt simplifier cette étape et permettre aux utilisateurs de terminer la migration à l'aide d'une seule commande. Restez à l'écoute.</p>
<p><strong>Commande Dump :</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Commande Load :</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez obtenir plus de détails en utilisant <a href="https://zilliz.com/attu">Attu</a>, un outil d'administration de base de données vectorielles tout-en-un.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Restez à l'écoute pour les futurs plans de migration<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>À l'avenir, nous prendrons en charge la migration à partir d'un plus grand nombre de sources de données et nous ajouterons d'autres fonctionnalités de migration, notamment :</p>
<ul>
<li><p>Prise en charge de la migration de Redis vers Milvus.</p></li>
<li><p>Prise en charge de la migration de MongoDB vers Milvus.</p></li>
<li><p>Prise en charge de la migration avec reprise.</p></li>
<li><p>Simplification des commandes de migration en fusionnant les processus de chargement et de vidage en un seul.</p></li>
<li><p>Prise en charge de la migration à partir d'autres sources de données courantes vers Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, la dernière version de Milvus, apporte de nouvelles fonctionnalités intéressantes et des améliorations de performances qui répondent aux besoins croissants de la gestion des données. La migration de vos données vers Milvus 2.x peut débloquer ces avantages, et le projet Milvus Migration rend le processus de migration rationalisé et facile. Essayez-le, vous ne serez pas déçu.</p>
<p><em><strong>Remarque :</strong> les informations contenues dans ce blog sont basées sur l'état des projets Milvus et <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> en septembre 2023. Consultez la <a href="https://milvus.io/docs">documentation</a> officielle <a href="https://milvus.io/docs">de Milvus</a> pour obtenir les informations et instructions les plus récentes.</em></p>
