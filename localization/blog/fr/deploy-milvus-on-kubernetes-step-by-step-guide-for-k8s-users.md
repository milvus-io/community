---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Déploiement de Milvus sur Kubernetes : Un guide pas à pas pour les
  utilisateurs de Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Ce guide fournit une marche à suivre claire, étape par étape, pour configurer
  Milvus sur Kubernetes à l'aide de l'opérateur Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> est une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> open-source conçue pour stocker, indexer et rechercher des quantités massives de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a> par le biais de représentations vectorielles, ce qui la rend parfaite pour les applications axées sur l'IA, telles que la recherche de similitudes, la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a>, la génération augmentée de récupération<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>, les moteurs de recommandation et d'autres tâches d'apprentissage automatique.</p>
<p>Mais ce qui rend Milvus encore plus puissant, c'est son intégration transparente avec Kubernetes. Si vous êtes un aficionado de Kubernetes, vous savez que la plateforme est parfaite pour orchestrer des systèmes évolutifs et distribués. Milvus tire pleinement parti des capacités de Kubernetes, ce qui vous permet de déployer, de faire évoluer et de gérer facilement les clusters Milvus distribués. Ce guide fournit une description claire, étape par étape, de la configuration de Milvus sur Kubernetes à l'aide de l'opérateur Milvus.</p>
<h2 id="Prerequisites" class="common-anchor-header">Conditions préalables<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de commencer, assurez-vous de disposer des conditions préalables suivantes :</p>
<ul>
<li><p>Un cluster Kubernetes opérationnel. Si vous testez localement, <code translate="no">minikube</code> est un excellent choix.</p></li>
<li><p><code translate="no">kubectl</code> Un logiciel de gestion de la sécurité installé et configuré pour interagir avec votre cluster Kubernetes.</p></li>
<li><p>Familiarité avec les concepts de base de Kubernetes tels que les pods, les services et les déploiements.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Étape 1 : Installation de Minikube (pour les tests locaux)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez besoin de mettre en place un environnement Kubernetes local, <code translate="no">minikube</code> est l'outil qu'il vous faut. Les instructions d'installation officielles se trouvent sur la <a href="https://minikube.sigs.k8s.io/docs/start/">page de démarrage de Minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Installer Minikube</h3><p>Visitez la<a href="https://github.com/kubernetes/minikube/releases"> page des versions de minikube</a> et téléchargez la version appropriée pour votre système d'exploitation. Pour macOS/Linux, vous pouvez utiliser la commande suivante :</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Démarrez Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Interagir avec le cluster</h3><p>Maintenant, vous pouvez interagir avec vos clusters avec kubectl à l'intérieur de minikube. Si vous n'avez pas installé kubectl, Minikube téléchargera la version appropriée par défaut.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Sinon, vous pouvez créer un lien symbolique vers le binaire de minikube nommé <code translate="no">kubectl</code> pour une utilisation plus facile.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Étape 2 : Configuration de la classe de stockage (StorageClass)<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans Kubernetes, une <strong>StorageClass</strong> définit les types de stockage disponibles pour vos charges de travail, offrant une flexibilité dans la gestion de différentes configurations de stockage. Avant de poursuivre, vous devez vous assurer qu'une StorageClass par défaut est disponible dans votre cluster. Voici comment vérifier et configurer une classe de stockage si nécessaire.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Vérifier les classes de stockage installées</h3><p>Pour voir les StorageClass disponibles dans votre cluster Kubernetes, exécutez la commande suivante :</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>La liste des classes de stockage installées dans votre cluster s'affiche. Si une StorageClass par défaut est déjà configurée, elle sera marquée par <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Configurer une classe de stockage par défaut (si nécessaire)</h3><p>Si aucune StorageClass par défaut n'est configurée, vous pouvez en créer une en la définissant dans un fichier YAML. Utilisez l'exemple suivant pour créer une classe de stockage par défaut :</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Cette configuration YAML définit un site <code translate="no">StorageClass</code> appelé <code translate="no">default-storageclass</code> qui utilise le provisionneur <code translate="no">minikube-hostpath</code>, couramment utilisé dans les environnements de développement local.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Appliquer la StorageClass</h3><p>Une fois le fichier <code translate="no">default-storageclass.yaml</code> créé, appliquez-le à votre cluster à l'aide de la commande suivante :</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ceci configurera la StorageClass par défaut pour votre cluster, garantissant que vos besoins de stockage seront correctement gérés à l'avenir.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Étape 3 : Installation de Milvus à l'aide de Milvus Operator<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator simplifie le déploiement de Milvus sur Kubernetes, en gérant le déploiement, la mise à l'échelle et les mises à jour. Avant d'installer l'opérateur Milvus, vous devez installer le <strong>gestionnaire de</strong> certificats, qui fournit des certificats pour le serveur webhook utilisé par l'opérateur Milvus.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Installer le cert-manager</h3><p>Milvus Operator nécessite un <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> pour gérer les certificats pour une communication sécurisée. Veillez à installer <strong>cert-manager version 1.1.3</strong> ou ultérieure. Pour l'installer, exécutez la commande suivante :</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Après l'installation, vérifiez que les pods de cert-manager sont en cours d'exécution en exécutant :</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Installer l'opérateur Milvus</h3><p>Une fois que le cert-manager est opérationnel, vous pouvez installer l'opérateur Milvus. Exécutez la commande suivante pour le déployer à l'aide de <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez vérifier si le pod Milvus Operator est en cours d'exécution à l'aide de la commande suivante :</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Déployer le cluster Milvus</h3><p>Une fois que le pod Milvus Operator est en cours d'exécution, vous pouvez déployer un cluster Milvus avec l'opérateur. La commande suivante déploie un cluster Milvus avec ses composants et dépendances dans des pods séparés en utilisant les configurations par défaut :</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour personnaliser les paramètres Milvus, vous devrez remplacer le fichier YAML par votre propre fichier YAML de configuration. Outre la modification ou la création manuelle du fichier, vous pouvez utiliser l'outil de dimensionnement Milvus pour ajuster les configurations, puis télécharger le fichier YAML correspondant.</p>
<p>Pour personnaliser les paramètres de Milvus, vous devez remplacer le fichier YAML par défaut par votre propre configuration. Vous pouvez modifier ou créer ce fichier manuellement, en l'adaptant à vos besoins spécifiques.</p>
<p>Vous pouvez également utiliser l'<a href="https://milvus.io/tools/sizing"><strong>outil de dimensionnement Milvus</strong></a> pour une approche plus rationnelle. Cet outil vous permet d'ajuster divers paramètres, tels que l'allocation des ressources et les options de stockage, puis de télécharger le fichier YAML correspondant avec les configurations souhaitées. Cela garantit que votre déploiement Milvus est optimisé pour votre cas d'utilisation spécifique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure : Outil de dimensionnement de Milvus</p>
<p>Le déploiement peut prendre un certain temps. Vous pouvez vérifier l'état de votre cluster Milvus via la commande :</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois que votre cluster Milvus est prêt, tous les pods du cluster Milvus doivent être en cours d'exécution ou terminés :</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Étape 4 : Accès à votre cluster Milvus<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois votre cluster Milvus déployé, vous devez y accéder en transférant un port local vers le port de service Milvus. Suivez ces étapes pour récupérer le port de service et configurer le transfert de port.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Récupérer le port de service</strong></h4><p>Tout d'abord, identifiez le port de service à l'aide de la commande suivante. Remplacez <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> par le nom de votre pod proxy Milvus, qui commence généralement par <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cette commande renverra le numéro de port que votre service Milvus utilise.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Transférer le port</strong></h4><p>Pour accéder localement à votre cluster Milvus, transférez un port local vers le port du service à l'aide de la commande suivante. Remplacez <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> par le port local que vous souhaitez utiliser et <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> par le port de service récupéré à l'étape précédente :</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Cette commande permet à la redirection de port d'écouter toutes les adresses IP de la machine hôte. Si vous souhaitez que le service n'écoute que sur <code translate="no">localhost</code>, vous pouvez omettre l'option <code translate="no">--address 0.0.0.0</code>.</p>
<p>Une fois le transfert de port configuré, vous pouvez accéder à votre cluster Milvus via le port local spécifié pour d'autres opérations ou intégrations.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Étape 5 : Connexion à Milvus à l'aide du SDK Python<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Votre cluster Milvus étant opérationnel, vous pouvez maintenant interagir avec lui à l'aide de n'importe quel SDK Milvus. Dans cet exemple, nous utiliserons <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, le <strong>SDK Python</strong> de Milvus <strong>,</strong> pour nous connecter au cluster et effectuer des opérations de base.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Installer PyMilvus</h3><p>Pour interagir avec Milvus via Python, vous devez installer le paquet <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Se connecter à Milvus</h3><p>Voici un exemple de script Python qui se connecte à votre cluster Milvus et montre comment effectuer des opérations de base telles que la création d'une collection.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">Explication :</h4><ul>
<li><p>Connexion à Milvus : le script se connecte au serveur Milvus exécuté sur <code translate="no">localhost</code> à l'aide du port local défini à l'étape 4.</p></li>
<li><p>Créer une collection : Il vérifie si une collection nommée <code translate="no">example_collection</code> existe déjà, la supprime si c'est le cas, puis crée une nouvelle collection avec des vecteurs de 768 dimensions.</p></li>
</ul>
<p>Ce script établit une connexion avec le cluster Milvus et crée une collection, servant de point de départ à des opérations plus complexes telles que l'insertion de vecteurs et l'exécution de recherches de similarité.</p>
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
    </button></h2><p>Le déploiement de Milvus dans une configuration distribuée sur Kubernetes déverrouille de puissantes capacités de gestion de données vectorielles à grande échelle, permettant une évolutivité transparente et des applications performantes axées sur l'IA. En suivant ce guide, vous avez appris à configurer Milvus à l'aide de Milvus Operator, ce qui rend le processus rationalisé et efficace.</p>
<p>En continuant à explorer Milvus, envisagez de faire évoluer votre cluster pour répondre aux demandes croissantes ou de le déployer sur des plates-formes cloud telles qu'Amazon EKS, Google Cloud ou Microsoft Azure. Pour une gestion et une surveillance améliorées, des outils tels que <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> et <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> offrent une assistance précieuse pour maintenir la santé et les performances de vos déploiements.</p>
<p>Vous êtes maintenant prêt à exploiter tout le potentiel de Milvus sur Kubernetes : bon déploiement ! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Autres ressources<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Documentation Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed : Quel mode vous convient le mieux ? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">La recherche vectorielle au service de la performance : Milvus sur GPU avec NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Qu'est-ce que RAG ? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centre de ressources pour l'IA générative | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modèles d'IA les plus performants pour vos applications GenAI | Zilliz</a></p></li>
</ul>
