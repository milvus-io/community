---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: >-
  Comment déployer la base de données vectorielle Open-Source Milvus sur Amazon
  EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Un guide étape par étape sur le déploiement de la base de données vectorielle
  Milvus sur AWS à l'aide de services gérés tels que Amazon EKS, S3, MSK et ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Ce billet a été publié à l'origine sur le <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>site web d'AWS</em></a> et est traduit, édité et rediffusé ici avec l'autorisation de l'auteur.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Vue d'ensemble des embarquements vectoriels et des bases de données vectorielles<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>L'essor de l'<a href="https://zilliz.com/learn/generative-ai">IA générative (GenAI)</a>, en particulier des grands modèles de langage<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a>, a considérablement stimulé l'intérêt pour les <a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a>, les établissant comme un composant essentiel au sein de l'écosystème GenAI. En conséquence, les bases de données vectorielles sont de plus en plus <a href="https://milvus.io/use-cases">utilisées</a>.</p>
<p>Un <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">rapport IDC</a> prévoit que d'ici 2025, plus de 80 % des données commerciales seront non structurées et existeront dans des formats tels que le texte, les images, le son et les vidéos. La compréhension, le traitement, le stockage et l'interrogation de cette vaste quantité de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a> à grande échelle représentent un défi de taille. La pratique courante en GenAI et en apprentissage profond consiste à transformer les données non structurées en encastrements vectoriels, à les stocker et à les indexer dans une base de données vectorielle comme <a href="https://milvus.io/intro">Milvus</a> ou <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus entièrement géré) pour les recherches de <a href="https://zilliz.com/learn/vector-similarity-search">similarité vectorielle</a> ou de similarité sémantique.</p>
<p>Mais que sont exactement les <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vectoriels</a>? En termes simples, il s'agit de représentations numériques de nombres à virgule flottante dans un espace à haute dimension. La <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">distance entre deux vecteurs</a> indique leur pertinence : plus ils sont proches, plus ils sont pertinents l'un par rapport à l'autre, et vice versa. Cela signifie que des vecteurs similaires correspondent à des données originales similaires, ce qui diffère des recherches traditionnelles par mots clés ou exactes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Comment effectuer une recherche de similarité vectorielle</span> </span></p>
<p><em>Figure 1 : Comment effectuer une recherche de similarité vectorielle ?</em></p>
<p>La capacité de stocker, d'indexer et de rechercher des vecteurs intégrés est la fonctionnalité principale des bases de données vectorielles. Actuellement, les bases de données vectorielles courantes se répartissent en deux catégories. La première catégorie étend les produits de bases de données relationnelles existants, comme Amazon OpenSearch Service avec le plugin <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> et Amazon RDS pour <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> avec l'extension pgvector. La deuxième catégorie comprend des produits de bases de données vectorielles spécialisées, y compris des exemples bien connus comme Milvus, Zilliz Cloud (Milvus entièrement géré), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> et <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Les techniques d'intégration et les bases de données vectorielles ont de vastes applications dans divers <a href="https://zilliz.com/vector-database-use-cases">cas d'utilisation axés sur l'IA</a>, notamment la recherche de similitudes d'images, la déduplication et l'analyse de vidéos, le traitement du langage naturel, les systèmes de recommandation, la publicité ciblée, la recherche personnalisée, le service client intelligent et la détection des fraudes.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> est l'une des options open-source les plus populaires parmi les nombreuses bases de données vectorielles. Ce billet présente Milvus et explore la pratique du déploiement de Milvus sur AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Qu'est-ce que Milvus ?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> est une base de données vectorielles open-source extrêmement flexible, fiable et rapide. Elle alimente la recherche de similarités vectorielles et les applications d'IA et s'efforce de rendre les bases de données vectorielles accessibles à toutes les organisations. Milvus peut stocker, indexer et gérer plus d'un milliard d'encastrements vectoriels générés par des réseaux neuronaux profonds et d'autres modèles d'apprentissage automatique.</p>
<p>Milvus a été publié sous la <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">licence open-source Apache License 2.0</a> en octobre 2019. Il s'agit actuellement d'un projet diplômé de la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Au moment de la rédaction de ce blog, Milvus avait atteint plus de <a href="https://hub.docker.com/r/milvusdb/milvus">50 millions de</a> téléchargements <a href="https://hub.docker.com/r/milvusdb/milvus">Docker pull</a> et était utilisé par de <a href="https://milvus.io/">nombreux clients</a>, tels que NVIDIA, AT&amp;T, IBM, eBay, Shopee et Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Principales caractéristiques de Milvus</h3><p>En tant que base de données vectorielles native dans le nuage, Milvus présente les caractéristiques clés suivantes :</p>
<ul>
<li><p>Haute performance et recherche à la milliseconde sur des ensembles de données vectorielles à l'échelle du milliard.</p></li>
<li><p>Prise en charge et chaîne d'outils multilingues.</p></li>
<li><p>Évolutivité horizontale et grande fiabilité, même en cas d'interruption.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Recherche hybride</a>, obtenue en associant le filtrage scalaire à la recherche de similarité vectorielle.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Architecture de Milvus</h3><p>Milvus suit le principe de la séparation du flux de données et du flux de contrôle. Le système se décompose en quatre niveaux, comme le montre le diagramme :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture Milvus</span> </span></p>
<p><em>Figure 2 Architecture Milvus</em></p>
<ul>
<li><p><strong>Couche d'accès :</strong> La couche d'accès est composée d'un groupe de mandataires sans état et sert de couche frontale du système et de point final pour les utilisateurs.</p></li>
<li><p><strong>Service de coordination :</strong> Le service de coordination attribue des tâches aux nœuds de travail.</p></li>
<li><p><strong>Nœuds de travail :</strong> Les nœuds de travail sont des exécutants idiots qui suivent les instructions du service de coordination et exécutent les commandes DML/DDL déclenchées par l'utilisateur.</p></li>
<li><p><strong>Stockage :</strong> Le stockage est responsable de la persistance des données. Il comprend un méta stockage, un courtier de journaux et un stockage d'objets.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Options de déploiement de Milvus</h3><p>Milvus prend en charge trois modes d'exécution : <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone et Distributed</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> est une bibliothèque Python qui peut être importée dans des applications locales. En tant que version légère de Milvus, elle est idéale pour le prototypage rapide dans les blocs-notes Jupyter ou l'exécution sur des appareils intelligents avec des ressources limitées.</p></li>
<li><p><strong>Milvus Standalone est</strong>un déploiement de serveur sur une seule machine. Si vous avez une charge de travail de production mais préférez ne pas utiliser Kubernetes, l'exécution de Milvus Standalone sur une seule machine avec suffisamment de mémoire est une bonne option.</p></li>
<li><p><strong>Milvus Distributed</strong> peut être déployé sur des clusters Kubernetes. Il prend en charge des ensembles de données plus importants, une plus grande disponibilité et une meilleure évolutivité, et convient mieux aux environnements de production.</p></li>
</ul>
<p>Milvus est conçu dès le départ pour prendre en charge Kubernetes et peut être facilement déployé sur AWS. Nous pouvons utiliser Amazon Elastic Kubernetes Service (Amazon EKS) comme Kubernetes géré, Amazon S3 comme stockage d'objets, Amazon Managed Streaming for Apache Kafka (Amazon MSK) comme stockage de messages et Amazon Elastic Load Balancing (Amazon ELB) comme équilibreur de charge pour construire un cluster de base de données Milvus fiable et élastique.</p>
<p>Ensuite, nous fournirons des conseils étape par étape sur le déploiement d'un cluster Milvus à l'aide d'EKS et d'autres services.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Déploiement de Milvus sur AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><p>Nous utiliserons AWS CLI pour créer un cluster EKS et déployer une base de données Milvus. Les conditions suivantes sont requises :</p>
<ul>
<li><p>Un PC/Mac ou une instance Amazon EC2 avec<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> installé et configuré avec les autorisations appropriées. Les outils AWS CLI sont installés par défaut si vous utilisez Amazon Linux 2 ou Amazon Linux 2023.</p></li>
<li><p>Les<a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">outils EKS sont installés</a>, y compris Helm, Kubectl, eksctl, etc.</p></li>
<li><p>Un panier Amazon S3.</p></li>
<li><p>Une instance Amazon MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Éléments à prendre en compte lors de la création de MSK</h3><ul>
<li>La dernière version stable de Milvus (v2.3.13) dépend de la fonctionnalité <code translate="no">autoCreateTopics</code> de Kafka. Ainsi, lors de la création de MSK, nous devons utiliser une configuration personnalisée et modifier la propriété <code translate="no">auto.create.topics.enable</code> de la valeur par défaut <code translate="no">false</code> à <code translate="no">true</code>. En outre, pour augmenter le débit de messages de MSK, il est recommandé d'augmenter les valeurs de <code translate="no">message.max.bytes</code> et <code translate="no">replica.fetch.max.bytes</code>. Voir <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Configurations MSK personnalisées</a> pour plus de détails.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus ne prend pas en charge l'authentification IAM basée sur les rôles de MSK. Ainsi, lors de la création de MSK, activer l'option <code translate="no">SASL/SCRAM authentication</code> dans la configuration de sécurité et configurer <code translate="no">username</code> et <code translate="no">password</code> dans AWS Secrets Manager. Voir l'<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">authentification des identifiants de connexion avec AWS Secrets Manager</a> pour plus de détails.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Figure 3 : Paramètres de sécurité : activer l'authentification SASL SCRAM.png</span> </span></p>
<p><em>Figure 3 : Paramètres de sécurité : activer l'authentification SASL/SCRAM</em></p>
<ul>
<li>Nous devons activer l'accès au groupe de sécurité MSK à partir du groupe de sécurité ou de la plage d'adresses IP du cluster EKS.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Création d'un cluster EKS</h3><p>Il existe de nombreuses façons de créer un cluster EKS, notamment via la console, CloudFormation, eksctl, etc. Ce billet montrera comment créer un cluster EKS à l'aide d'eksctl.</p>
<p><code translate="no">eksctl</code> eksctl est un outil de ligne de commande simple pour créer et gérer des clusters Kubernetes sur Amazon EKS. Il fournit le moyen le plus rapide et le plus facile de créer un nouveau cluster avec des nœuds pour Amazon EKS. Voir le <a href="https://eksctl.io/">site web</a> d'eksctl pour plus d'informations.</p>
<ol>
<li>Tout d'abord, créez un fichier <code translate="no">eks_cluster.yaml</code> avec l'extrait de code suivant. Remplacez <code translate="no">cluster-name</code> par le nom de votre cluster, <code translate="no">region-code</code> par la région AWS où vous souhaitez créer le cluster et <code translate="no">private-subnet-idx</code> par vos sous-réseaux privés. Remarque : ce fichier de configuration crée un cluster EKS dans un VPC existant en spécifiant des sous-réseaux privés. Si vous souhaitez créer un nouveau VPC, supprimez la configuration du VPC et des sous-réseaux, et le site <code translate="no">eksctl</code> en créera automatiquement un nouveau.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Ensuite, exécutez la commande <code translate="no">eksctl</code> pour créer le cluster EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Cette commande créera les ressources suivantes :</p>
<ul>
<li><p>Un cluster EKS avec la version spécifiée.</p></li>
<li><p>Un groupe de nœuds gérés avec trois instances EC2 m6i.2xlarge.</p></li>
<li><p>Un <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">fournisseur d'identité IAM OIDC</a> et un ServiceAccount appelé <code translate="no">aws-load-balancer-controller</code>, que nous utiliserons plus tard lors de l'installation du <strong>contrôleur AWS Load Balancer</strong>.</p></li>
<li><p>Un espace de noms <code translate="no">milvus</code> et un ServiceAccount <code translate="no">milvus-s3-access-sa</code> dans cet espace de noms. Cet espace de noms sera utilisé ultérieurement lors de la configuration de S3 en tant que stockage d'objets pour Milvus.</p>
<p>Remarque : pour des raisons de simplicité, le site <code translate="no">milvus-s3-access-sa</code> bénéficie ici de toutes les autorisations d'accès à S3. Dans les déploiements en production, il est recommandé de suivre le principe du moindre privilège et de n'accorder l'accès qu'au seau S3 spécifique utilisé pour Milvus.</p></li>
<li><p>Multiple add-ons, où <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> sont des add-ons de base requis par EKS. <code translate="no">aws-ebs-csi-driver</code> est le pilote AWS EBS CSI qui permet aux clusters EKS de gérer le cycle de vie des volumes Amazon EBS.</p></li>
</ul>
<p>Il ne nous reste plus qu'à attendre la fin de la création du cluster.</p>
<p>Attendez la fin de la création du cluster. Au cours du processus de création du cluster, le fichier <code translate="no">kubeconfig</code> sera automatiquement créé ou mis à jour. Vous pouvez également le mettre à jour manuellement en exécutant la commande suivante. Veillez à remplacer <code translate="no">region-code</code> par la région AWS dans laquelle votre cluster est créé et <code translate="no">cluster-name</code> par le nom de votre cluster.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Une fois le cluster créé, vous pouvez afficher les nœuds en exécutant la commande suivante :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Créez une StorageClass <code translate="no">ebs-sc</code> configurée avec GP3 comme type de stockage et définissez-la comme StorageClass par défaut. Milvus utilise etcd comme méta stockage et a besoin de cette StorageClass pour créer et gérer les PVC.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, définissez la StorageClass d'origine <code translate="no">gp2</code> comme n'étant pas une classe par défaut :</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Installer le contrôleur AWS Load Balancer. Nous utiliserons ce contrôleur plus tard pour le service Milvus et Attu Ingress, donc installons-le au préalable.</li>
</ol>
<ul>
<li>Tout d'abord, ajoutez le repo <code translate="no">eks-charts</code> et mettez-le à jour.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Ensuite, installez le contrôleur AWS Load Balancer. Remplacez <code translate="no">cluster-name</code> par le nom de votre cluster. Le ServiceAccount nommé <code translate="no">aws-load-balancer-controller</code> a déjà été créé lorsque nous avons créé le cluster EKS dans les étapes précédentes.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Vérifiez que le contrôleur a été installé avec succès.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>La sortie doit ressembler à ceci :</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Déploiement d'un cluster Milvus</h3><p>Milvus prend en charge plusieurs méthodes de déploiement, telles que Operator et Helm. Operator est plus simple, mais Helm est plus direct et plus flexible. Dans cet exemple, nous utiliserons Helm pour déployer Milvus.</p>
<p>Lors du déploiement de Milvus avec Helm, vous pouvez personnaliser la configuration via le fichier <code translate="no">values.yaml</code>. Cliquez sur <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> pour afficher toutes les options. Par défaut, Milvus crée dans le cluster minio et pulsar en tant que stockage d'objets et stockage de messages, respectivement. Nous allons apporter quelques modifications à la configuration pour la rendre plus adaptée à la production.</p>
<ol>
<li>Tout d'abord, ajoutez le repo Milvus Helm et mettez-le à jour.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Créez un fichier <code translate="no">milvus_cluster.yaml</code> avec l'extrait de code suivant. Cet extrait de code personnalise la configuration de Milvus, par exemple en configurant Amazon S3 comme stockage d'objets et Amazon MSK comme file d'attente de messages. Nous fournirons des explications détaillées et des conseils de configuration ultérieurement.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>Le code contient six sections. Suivez les instructions suivantes pour modifier les configurations correspondantes.</p>
<p><strong>Section 1</strong>: Configurer S3 comme stockage d'objets. Le serviceAccount accorde à Milvus l'accès à S3 (dans ce cas, il s'agit de <code translate="no">milvus-s3-access-sa</code>, qui a été créé lorsque nous avons créé le cluster EKS). Veillez à remplacer <code translate="no">&lt;region-code&gt;</code> par la région AWS où se trouve votre cluster. Remplacez <code translate="no">&lt;bucket-name&gt;</code> par le nom de votre seau S3 et <code translate="no">&lt;root-path&gt;</code> par le préfixe du seau S3 (ce champ peut être laissé vide).</p>
<p><strong>Section 2</strong>: Configurer MSK comme stockage de messages. Remplacez <code translate="no">&lt;broker-list&gt;</code> par les adresses des points d'extrémité correspondant au type d'authentification SASL/SCRAM de MSK. Remplacez <code translate="no">&lt;username&gt;</code> et <code translate="no">&lt;password&gt;</code> par le nom d'utilisateur et le mot de passe du compte MSK. Vous pouvez obtenir l'adresse <code translate="no">&lt;broker-list&gt;</code> à partir des informations du client MSK, comme le montre l'image ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Figure 4 : Configurer MSK en tant que stockage de messages de Milvus.png</span> </span></p>
<p><em>Figure 4 : Configurer MSK en tant que stockage de messages de Milvus</em></p>
<p><strong>Section 3 :</strong> Exposer le service Milvus et permettre l'accès depuis l'extérieur du cluster. Le point d'extrémité Milvus utilise par défaut un service de type ClusterIP, qui n'est accessible qu'à l'intérieur du cluster EKS. Si nécessaire, vous pouvez le changer pour un service de type LoadBalancer afin de permettre l'accès depuis l'extérieur du cluster EKS. Le service de type LoadBalancer utilise Amazon NLB comme équilibreur de charge. Conformément aux meilleures pratiques en matière de sécurité, <code translate="no">aws-load-balancer-scheme</code> est configuré par défaut en mode interne, ce qui signifie que seul l'accès intranet à Milvus est autorisé. Cliquez pour <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">voir les instructions de configuration NLB</a>.</p>
<p><strong>Section 4 :</strong> Installer et configurer <a href="https://github.com/zilliztech/attu">Attu</a>, un outil d'administration milvus open-source. Il dispose d'une interface graphique intuitive qui vous permet d'interagir facilement avec Milvus. Nous activons Attu, configurons l'entrée à l'aide d'AWS ALB et la définissons sur le type <code translate="no">internet-facing</code> afin qu'Attu soit accessible via Internet. Cliquez sur <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">ce document</a> pour obtenir le guide de la configuration ALB.</p>
<p><strong>Section 5 :</strong> activer le déploiement HA des composants principaux de Milvus. Milvus contient plusieurs composants indépendants et découplés. Par exemple, le service de coordination agit en tant que couche de contrôle, gérant la coordination des composants Racine, Requête, Données et Index. Le proxy de la couche d'accès sert de point d'accès à la base de données. Par défaut, ces composants ne comportent qu'une seule réplique de pod. Le déploiement de plusieurs répliques de ces composants de service est particulièrement nécessaire pour améliorer la disponibilité de Milvus.</p>
<p><strong>Remarque :</strong> le déploiement multiréplique des composants Root, Query, Data et Index coordinator nécessite l'activation de l'option <code translate="no">activeStandby</code>.</p>
<p><strong>Section 6 :</strong> Ajustez l'allocation des ressources pour les composants Milvus afin de répondre aux exigences de vos charges de travail. Le site Web de Milvus propose également un <a href="https://milvus.io/tools/sizing/">outil de dimensionnement</a> qui génère des suggestions de configuration en fonction du volume de données, des dimensions des vecteurs, des types d'index, etc. Il peut également générer un fichier de configuration Helm en un seul clic. La configuration suivante est la suggestion donnée par l'outil pour 1 million de vecteurs de 1024 dimensions et un type d'index HNSW.</p>
<ol>
<li>Utilisez Helm pour créer Milvus (déployé dans l'espace de noms <code translate="no">milvus</code>). Remarque : vous pouvez remplacer <code translate="no">&lt;demo&gt;</code> par un nom personnalisé.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Exécutez la commande suivante pour vérifier l'état du déploiement.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>La sortie suivante montre que les composants Milvus sont tous DISPONIBLES et que les composants de coordination ont plusieurs répliques activées.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Accès et gestion de Milvus</h3><p>Jusqu'à présent, nous avons déployé avec succès la base de données vectorielle Milvus. Nous pouvons maintenant accéder à Milvus par le biais de points d'extrémité. Milvus expose des points finaux via les services Kubernetes. Attu expose les points d'extrémité via Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Accès aux points d'extrémité de Milvus</strong></h4><p>Exécutez la commande suivante pour obtenir les points de terminaison des services :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez voir plusieurs services. Milvus prend en charge deux ports, le port <code translate="no">19530</code> et le port <code translate="no">9091</code>:</p>
<ul>
<li>Le port <code translate="no">19530</code> est destiné à gRPC et à l'API RESTful. C'est le port par défaut lorsque vous vous connectez à un serveur Milvus avec différents SDK Milvus ou clients HTTP.</li>
<li>Le port <code translate="no">9091</code> est un port de gestion pour la collecte de métriques, le profilage pprof et les sondes de santé dans Kubernetes.</li>
</ul>
<p>Le service <code translate="no">demo-milvus</code> fournit un point d'accès à la base de données, qui est utilisé pour établir une connexion à partir des clients. Il utilise NLB comme équilibreur de charge. Vous pouvez obtenir le point d'extrémité du service à partir de la colonne <code translate="no">EXTERNAL-IP</code>.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Gestion de Milvus à l'aide d'Attu</strong></h4><p>Comme décrit précédemment, nous avons installé Attu pour gérer Milvus. Exécutez la commande suivante pour obtenir le point final :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez voir un Ingress appelé <code translate="no">demo-milvus-attu</code>, où la colonne <code translate="no">ADDRESS</code> est l'URL d'accès.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Ouvrez l'adresse Ingress dans un navigateur et voyez la page suivante. Cliquez sur <strong>Connecter</strong> pour vous connecter.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Figure 5 : Connectez-vous à votre compte Attu.png</span> </span></p>
<p><em>Figure 5 : Connexion à votre compte Attu</em></p>
<p>Après vous être connecté, vous pouvez gérer les bases de données Milvus via Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Figure 6 L'interface Attu.png</span> </span></p>
<p>Figure 6 : L'interface Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Test de la base de données vectorielle Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous allons utiliser le <a href="https://milvus.io/docs/example_code.md">code d'exemple</a> Milvus pour tester le bon fonctionnement de la base de données Milvus. Tout d'abord, téléchargez le code d'exemple <code translate="no">hello_milvus.py</code> à l'aide de la commande suivante :</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modifiez l'hôte dans le code d'exemple en point d'extrémité du service Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Exécutez le code :</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Si le système renvoie le résultat suivant, cela signifie que Milvus fonctionne normalement.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Cet article présente <a href="https://milvus.io/intro">Milvus</a>, l'une des bases de données vectorielles open-source les plus populaires, et fournit un guide sur le déploiement de Milvus sur AWS à l'aide de services gérés tels qu'Amazon EKS, S3, MSK et ELB pour obtenir une plus grande élasticité et une plus grande fiabilité.</p>
<p>En tant que composant central de divers systèmes GenAI, en particulier Retrieval Augmented Generation (RAG), Milvus prend en charge et s'intègre à une variété de modèles et de cadres GenAI courants, notamment Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex et LangChain. Commencez votre voyage d'innovation GenAI avec Milvus dès aujourd'hui !</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Guide de l'utilisateur d'Amazon EKS</a></li>
<li><a href="https://milvus.io/">Site Web officiel de Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Dépôt GitHub de Milvus</a></li>
<li><a href="https://eksctl.io/">Site Web officiel d'eksctl</a></li>
</ul>
