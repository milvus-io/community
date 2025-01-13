---
id: getting-started-with-milvus-cluster-and-k8s.md
title: Démarrer avec le cluster Milvus et K8s
author: Stephen Batifol
date: 2024-04-03T00:00:00.000Z
desc: >-
  Dans ce tutoriel, vous apprendrez les bases de la configuration de Milvus avec
  Helm, de la création d'une collection et de l'exécution de l'ingestion de
  données et des recherches de similarité.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Kubernetes
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-milvus-and-k8s.md'
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une base de données vectorielle distribuée qui vise à stocker, indexer et gérer des vecteurs d'intégration massifs. Sa capacité à indexer et à rechercher efficacement des trillions de vecteurs fait de Milvus un choix de premier ordre pour les charges de travail d'IA et d'apprentissage automatique.</p>
<p>Kubernetes (K8s), quant à lui, excelle dans la gestion et la mise à l'échelle des applications conteneurisées. Il offre des fonctionnalités telles que l'auto-scaling, l'auto-réparation et l'équilibrage de charge, qui sont cruciales pour maintenir une disponibilité et des performances élevées dans les environnements de production.</p>
<h2 id="Why-Use-Them-Together" class="common-anchor-header">Pourquoi les utiliser ensemble ?<button data-href="#Why-Use-Them-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>K8s peut automatiquement mettre à l'échelle les clusters Milvus en fonction de la charge de travail. Lorsque vos données augmentent ou que le nombre de requêtes s'accroît, K8s peut activer davantage d'instances Milvus pour gérer la charge, garantissant ainsi la réactivité de vos applications.</p>
<p>L'une des caractéristiques les plus remarquables de K8s est sa mise à l'échelle horizontale, qui facilite l'extension de votre cluster Milvus. K8s s'adapte sans effort à la croissance de votre ensemble de données, ce qui en fait une solution simple et efficace.</p>
<p>En outre, la capacité à traiter les requêtes s'étend également horizontalement avec K8s. Lorsque la charge de requêtes augmente, K8s peut déployer davantage d'instances Milvus pour traiter les requêtes de recherche par similarité accrues, ce qui garantit des réponses à faible latence même en cas de charges élevées.</p>
<h2 id="Prerequisites--Setting-Up-K8s" class="common-anchor-header">Conditions préalables et configuration de K8s<button data-href="#Prerequisites--Setting-Up-K8s" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><ul>
<li><p><strong>Docker</strong> - Assurez-vous que Docker est installé sur votre système.</p></li>
<li><p><strong>Kubernetes</strong> - Préparez un cluster Kubernetes. Vous pouvez utiliser <code translate="no">minikube</code> pour le développement local ou le service Kubernetes d'un fournisseur de cloud pour les environnements de production.</p></li>
<li><p><strong>Helm</strong> - Installez Helm, un gestionnaire de paquets pour Kubernetes, pour vous aider à gérer les applications Kubernetes, vous pouvez consulter notre documentation pour voir comment faire cela <a href="https://milvus.io/docs/install_cluster-helm.md">https://milvus.io/docs/install_cluster-helm.md</a>.</p></li>
<li><p><strong>Kubectl</strong> - Installez <code translate="no">kubectl</code>, un outil de ligne de commande pour interagir avec les clusters Kubernetes, pour déployer des applications, inspecter et gérer les ressources du cluster, et afficher les journaux.</p></li>
</ul>
<h3 id="Setting-Up-K8s" class="common-anchor-header">Configuration de K8s</h3><p>Après avoir installé tout ce qui est nécessaire pour faire fonctionner un cluster K8s, et si vous avez utilisé <code translate="no">minikube</code>, démarrez votre cluster avec :</p>
<pre><code translate="no">minikube start
<button class="copy-code-btn"></button></code></pre>
<p>Vérifiez l'état de votre cluster K8s avec :</p>
<pre><code translate="no">kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-Milvus-on-K8s" class="common-anchor-header">Déploiement de Milvus sur K8s</h3><p>Pour ce déploiement, nous avons opté pour Milvus en mode cluster afin de tirer parti de toutes ses capacités distribuées. Nous utiliserons Helm pour rationaliser le processus d'installation.</p>
<p><strong>1. Commande d'installation Helm</strong></p>
<pre><code translate="no">helm install my-milvus milvus/milvus --<span class="hljs-built_in">set</span> pulsar.enabled=<span class="hljs-literal">false</span> --<span class="hljs-built_in">set</span> kafka.enabled=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cette commande installe Milvus sur votre cluster K8s avec Kafka activé et Pulsar désactivé. Kafka sert de système de messagerie au sein de Milvus, gérant le flux de données entre les différents composants. La désactivation de Pulsar et l'activation de Kafka permettent d'adapter le déploiement à nos préférences et exigences spécifiques en matière de messagerie.</p>
<p><strong>2. Transfert de port</strong></p>
<p>Pour accéder à Milvus à partir de votre machine locale, créez une redirection de port : <code translate="no">kubectl port-forward svc/my-milvus 27017:19530</code>.</p>
<p>Cette commande fait correspondre le port <code translate="no">19530</code> du service Milvus <code translate="no">svc/my-milvus</code> au même port sur votre machine locale, ce qui vous permet de vous connecter à Milvus à l'aide d'outils locaux. Si vous ne précisez pas le port local (comme dans <code translate="no">:19530</code>), K8s attribuera un port disponible, ce qui le rendra dynamique. Veillez à noter le port local alloué si vous choisissez cette méthode.</p>
<p><strong>3. Vérification du déploiement :</strong></p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods 

NAME                                    READY   STATUS    RESTARTS   AGE
my-milvus-datacoord<span class="hljs-number">-595b</span>996bd4-zprpd    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-datanode-d9d555785<span class="hljs-number">-47</span>nkt      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-0</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">84</span>m
my-milvus-etcd<span class="hljs-number">-1</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-2</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexcoord<span class="hljs-number">-65b</span>c68968c<span class="hljs-number">-6</span>jg6q   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexnode<span class="hljs-number">-54586f</span>55d-z9vx4     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-minio<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-3</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-proxy<span class="hljs-number">-76b</span>b7d497f-sqwvd        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querycoord<span class="hljs-number">-6f</span>4c7b7598-b6twj   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querynode<span class="hljs-number">-677b</span>df485b-ktc6m    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-rootcoord<span class="hljs-number">-7498f</span>ddfd8-v5zw8    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
<button class="copy-code-btn"></button></code></pre>
<p>Vous devriez voir une liste de pods similaire à la sortie ci-dessus, tous dans l'état Running (en cours d'exécution). Cela indique que votre cluster Milvus est opérationnel. Plus précisément, recherchez le chiffre 1/1 sous la colonne <code translate="no">READY</code>, qui signifie que chaque module est entièrement prêt et en cours d'exécution. Si certains pods ne sont pas dans l'état Running, il se peut que vous deviez enquêter davantage pour garantir un déploiement réussi.</p>
<p>Une fois votre cluster Milvus déployé et tous les composants confirmés en cours d'exécution, vous êtes maintenant prêt à procéder à l'ingestion et à l'indexation des données. Cela implique la connexion à votre instance Milvus, la création de collections et l'insertion de vecteurs pour la recherche et l'extraction.</p>
<h2 id="Data-Ingestion-and-Indexing" class="common-anchor-header">Ingestion et indexation des données<button data-href="#Data-Ingestion-and-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour commencer à ingérer et à indexer des données dans notre cluster Milvus, nous allons utiliser le SDK pymilvus. Il existe deux options d'installation :</p>
<ul>
<li><p>SDK de base : <code translate="no">pip install pymilvus</code></p></li>
<li><p>Pour les embeddings de texte riche et les modèles avancés : <code translate="no">pip install pymilvus[model]</code></p></li>
</ul>
<p>Pour insérer des données dans notre cluster, nous utiliserons <code translate="no">pymilvus</code>, vous pouvez installer le SDK uniquement avec <code translate="no">pip install pymilvus</code> ou, si vous souhaitez extraire des incorporations de texte riche, vous pouvez également utiliser <code translate="no">PyMilvus Models</code> en installant <code translate="no">pip install pymilvus[model]</code>.</p>
<h3 id="Connecting-and-Creating-a-Collection" class="common-anchor-header">Connexion et création d'une collection :</h3><p>Tout d'abord, connectez-vous à votre instance Milvus en utilisant le port que vous avez transféré précédemment. Assurez-vous que l'URI correspond au port local attribué par K8s :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
        uri=<span class="hljs-string">&quot;http://127.0.0.1:52070&quot;</span>,
    )

client.<span class="hljs-title function_">create_collection</span>(collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>, dimension=<span class="hljs-number">5</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Le paramètre <code translate="no">dimension=5</code> définit la taille du vecteur pour cette collection, essentielle pour les capacités de recherche vectorielle.</p>
<h3 id="Insert-Data" class="common-anchor-header">Insérer des données</h3><p>Voici comment insérer un premier ensemble de données, où chaque vecteur représente un élément et où le champ de couleur ajoute un attribut descriptif :</p>
<pre><code translate="no">data=[
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3580376395471989</span>, -<span class="hljs-number">0.6023495712049978</span>, <span class="hljs-number">0.18414012509913835</span>, -<span class="hljs-number">0.26286205330961354</span>, <span class="hljs-number">0.9029438446296592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_8682&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.19886812562848388</span>, <span class="hljs-number">0.06023560599112088</span>, <span class="hljs-number">0.6976963061752597</span>, <span class="hljs-number">0.2614474506242501</span>, <span class="hljs-number">0.838729485096104</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_7025&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.43742130801983836</span>, -<span class="hljs-number">0.5597502546264526</span>, <span class="hljs-number">0.6457887650909682</span>, <span class="hljs-number">0.7894058910881185</span>, <span class="hljs-number">0.20785793220625592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;orange_6781&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3172005263489739</span>, <span class="hljs-number">0.9719044792798428</span>, -<span class="hljs-number">0.36981146090600725</span>, -<span class="hljs-number">0.4860894583077995</span>, <span class="hljs-number">0.95791889146345</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_9298&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.4452349528804562</span>, -<span class="hljs-number">0.8757026943054742</span>, <span class="hljs-number">0.8220779437047674</span>, <span class="hljs-number">0.46406290649483184</span>, <span class="hljs-number">0.30337481143159106</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_4794&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">5</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.985825131989184</span>, -<span class="hljs-number">0.8144651566660419</span>, <span class="hljs-number">0.6299267002202009</span>, <span class="hljs-number">0.1206906911183383</span>, -<span class="hljs-number">0.1446277761879955</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;yellow_4222&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">6</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.8371977790571115</span>, -<span class="hljs-number">0.015764369584852833</span>, -<span class="hljs-number">0.31062937026679327</span>, -<span class="hljs-number">0.562666951622192</span>, -<span class="hljs-number">0.8984947637863987</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_9392&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">7</span>, <span class="hljs-string">&quot;vector&quot;</span>: [-<span class="hljs-number">0.33445148015177995</span>, -<span class="hljs-number">0.2567135004164067</span>, <span class="hljs-number">0.8987539745369246</span>, <span class="hljs-number">0.9402995886420709</span>, <span class="hljs-number">0.5378064918413052</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;grey_8510&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">8</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.39524717779832685</span>, <span class="hljs-number">0.4000257286739164</span>, -<span class="hljs-number">0.5890507376891594</span>, -<span class="hljs-number">0.8650502298996872</span>, -<span class="hljs-number">0.6140360785406336</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;white_9381&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">9</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.5718280481994695</span>, <span class="hljs-number">0.24070317428066512</span>, -<span class="hljs-number">0.3737913482606834</span>, -<span class="hljs-number">0.06726932177492717</span>, -<span class="hljs-number">0.6980531615588608</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;purple_4976&quot;</span>}
]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>Le code fourni suppose que vous avez créé une collection à l'aide de la procédure d'installation rapide. Comme le montre le code ci-dessus,</p>
<p>Les données à insérer sont organisées en une liste de dictionnaires, où chaque dictionnaire représente un enregistrement de données, appelé entité.</p>
<p>Chaque dictionnaire contient un champ non défini par le schéma, nommé couleur.</p>
<p>Chaque dictionnaire contient les clés correspondant aux champs prédéfinis et dynamiques.</p>
<h3 id="Insert-Even-More-Data" class="common-anchor-header">Insérer encore plus de données</h3><pre><code translate="no">colors = [<span class="hljs-string">&quot;green&quot;</span>, <span class="hljs-string">&quot;blue&quot;</span>, <span class="hljs-string">&quot;yellow&quot;</span>, <span class="hljs-string">&quot;red&quot;</span>, <span class="hljs-string">&quot;black&quot;</span>, <span class="hljs-string">&quot;white&quot;</span>, <span class="hljs-string">&quot;purple&quot;</span>, <span class="hljs-string">&quot;pink&quot;</span>, <span class="hljs-string">&quot;orange&quot;</span>, <span class="hljs-string">&quot;brown&quot;</span>, <span class="hljs-string">&quot;grey&quot;</span>]
data = [ {
    <span class="hljs-string">&quot;id&quot;</span>: i, 
    <span class="hljs-string">&quot;vector&quot;</span>: [ random.uniform(-<span class="hljs-number">1</span>, <span class="hljs-number">1</span>) <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>) ], 
    <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{random.choice(colors)}</span>_<span class="hljs-subst">{<span class="hljs-built_in">str</span>(random.randint(<span class="hljs-number">1000</span>, <span class="hljs-number">9999</span>))}</span>&quot;</span> 
} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1000</span>) ]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data[<span class="hljs-number">10</span>:]
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Similarity-Search" class="common-anchor-header">Recherche de similitude<button data-href="#Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir rempli la collection, vous pouvez effectuer une recherche de similarité pour trouver des vecteurs proches d'un vecteur d'interrogation. La valeur de la variable query_vectors est une liste contenant une sous-liste de valeurs flottantes. La sous-liste représente un encastrement vectoriel à 5 dimensions.</p>
<pre><code translate="no">query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

res = client.search(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,     <span class="hljs-comment"># target collection</span>
    data=query_vectors,                <span class="hljs-comment"># query vectors</span>
    <span class="hljs-built_in">limit</span>=3,                           <span class="hljs-comment"># number of returned entities</span>
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>Cette requête recherche les 3 vecteurs les plus similaires à notre vecteur d'interrogation, démontrant ainsi les puissantes capacités de recherche de Milvus.</p>
<h2 id="Uninstall-Milvus-from-K8s" class="common-anchor-header">Désinstaller Milvus de K8s<button data-href="#Uninstall-Milvus-from-K8s" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que vous avez terminé ce tutoriel, n'hésitez pas à désinstaller Milvus de votre cluster K8s à l'aide de la commande suivante :<code translate="no">helm uninstall my-milvus</code>.</p>
<p>Cette commande supprimera tous les composants Milvus déployés dans la version <code translate="no">my-milvus</code>, libérant ainsi les ressources du cluster.</p>
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
    </button></h2><ul>
<li><p>Le déploiement de Milvus sur un cluster Kubernetes met en évidence l'évolutivité et la flexibilité des bases de données vectorielles dans le traitement des charges de travail d'IA et d'apprentissage automatique. Grâce à ce tutoriel, vous avez appris les bases de la configuration de Milvus avec Helm, de la création d'une collection et de l'exécution de l'ingestion de données et des recherches de similarité.</p></li>
<li><p>L'installation de Milvus sur un cluster Kubernetes avec Helm devrait être simple. Pour aller plus loin dans la mise à l'échelle des clusters Milvus pour des ensembles de données plus importants ou des charges de travail plus intensives, notre documentation offre des conseils détaillés <a href="https://milvus.io/docs/scaleout.md">https://milvus.io/docs/scaleout.md.</a></p></li>
</ul>
<p>N'hésitez pas à consulter le code sur <a href="https://github.com/stephen37/K8s-tutorial-milvus">Github</a>, à tester <a href="https://github.com/milvus-io/milvus">Milvus</a>, à expérimenter différentes configurations et différents cas d'utilisation, et à partager vos expériences avec la communauté en rejoignant notre <a href="https://discord.gg/FG6hMJStWu">Discord</a>.</p>
