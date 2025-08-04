---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: >-
  Le déploiement de Milvus sur Kubernetes devient plus facile avec l'opérateur
  Milvus
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator est un outil de gestion natif de Kubernetes qui automatise le
  cycle de vie complet des déploiements de bases de données vectorielles Milvus.
cover: >-
  https://assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>La mise en place d'un cluster Milvus prêt pour la production ne devrait pas ressembler au désamorçage d'une bombe. Pourtant, quiconque a configuré manuellement des déploiements Kubernetes pour des bases de données vectorielles connaît l'exercice : des dizaines de fichiers YAML, une gestion complexe des dépendances et ce sentiment d'impuissance lorsque quelque chose tombe en panne à 2 heures du matin et que vous ne savez pas lequel des 47 fichiers de configuration est le coupable.</p>
<p>L'approche traditionnelle du déploiement de Milvus implique l'orchestration de plusieurs services - ECD pour le stockage des métadonnées, Pulsar pour la mise en file d'attente des messages, MinIO pour le stockage des objets et les divers composants Milvus eux-mêmes. Chaque service nécessite une configuration minutieuse, une séquence de démarrage appropriée et une maintenance continue. Si l'on étend ces opérations à plusieurs environnements ou clusters, la complexité opérationnelle devient insurmontable.</p>
<p>C'est là que <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> change fondamentalement la donne. Au lieu de gérer l'infrastructure manuellement, vous décrivez ce que vous voulez et l'opérateur s'occupe du comment.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Qu'est-ce que l'Opérateur Milvus ?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> est un outil de gestion natif de Kubernetes qui automatise le cycle de vie complet des déploiements de bases de données vectorielles Milvus. Construit sur le modèle Kubernetes Operator, il encapsule des années de connaissances opérationnelles sur l'exécution de Milvus en production et codifie cette expertise dans un logiciel qui s'exécute aux côtés de votre cluster.</p>
<p>Cela revient à disposer d'un administrateur Milvus expert qui ne dort jamais, ne fait jamais de fautes de frappe et se souvient parfaitement de tous les détails de la configuration. L'Opérateur surveille en permanence l'état de santé de votre cluster, gère automatiquement les décisions de mise à l'échelle, gère les mises à niveau sans interruption de service et récupère les pannes plus rapidement qu'un opérateur humain ne pourrait le faire.</p>
<p>À la base, l'opérateur offre quatre fonctionnalités essentielles.</p>
<ul>
<li><p><strong>Déploiement automatisé</strong>: Configurez un cluster Milvus entièrement fonctionnel à l'aide d'un seul manifeste.</p></li>
<li><p><strong>Gestion du cycle de vie</strong>: Automatisez les mises à niveau, la mise à l'échelle horizontale et le démontage des ressources dans un ordre défini et sûr.</p></li>
<li><p><strong>Surveillance et contrôles de santé intégrés</strong>: Surveillez en permanence l'état des composants Milvus et de leurs dépendances, notamment etcd, Pulsar et MinIO.</p></li>
<li><p><strong>Meilleures pratiques opérationnelles par défaut</strong>: Appliquez des modèles natifs de Kubernetes qui garantissent la fiabilité sans nécessiter de connaissances approfondies de la plateforme.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Comprendre le modèle d'opérateur Kubernetes</h3><p>Avant d'explorer les avantages de l'Opérateur Milvus, commençons par comprendre la base sur laquelle il est construit : le <strong>modèle de l'Opérateur Kubernetes</strong>.</p>
<p>Le modèle Kubernetes Operator permet de gérer des applications complexes qui nécessitent plus que des fonctionnalités Kubernetes de base. Un opérateur se compose de trois parties principales :</p>
<ul>
<li><p>Les<strong>définitions de ressources personnalisées</strong> vous permettent de décrire votre application à l'aide de fichiers de configuration de type Kubernetes.</p></li>
<li><p><strong>Un contrôleur</strong> surveille ces configurations et apporte les modifications nécessaires à votre cluster.</p></li>
<li><p>La<strong>gestion de l'état</strong> garantit que votre cluster correspond à ce que vous avez demandé et corrige les différences.</p></li>
</ul>
<p>Cela signifie que vous pouvez décrire votre déploiement Milvus d'une manière familière et que l'opérateur prend en charge toutes les tâches détaillées de création de pods, de mise en réseau et de gestion du cycle de vie...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Fonctionnement de l'opérateur Milvus<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>L'Opérateur Milvus suit un processus simple qui simplifie considérablement la gestion de la base de données. Décortiquons le modèle opérationnel de base de l'Opérateur Milvus :</p>
<ol>
<li><p><strong>Ressource personnalisée (CR) :</strong> Les utilisateurs définissent un déploiement Milvus à l'aide d'un CR (par exemple, kind : <code translate="no">Milvus</code>). Ce fichier comprend des configurations telles que le mode de cluster, la version de l'image, les besoins en ressources et les dépendances.</p></li>
<li><p><strong>Logique du contrôleur :</strong> Le contrôleur de l'opérateur surveille les CR nouveaux ou mis à jour. Dès qu'il détecte un changement, il orchestre la création des composants nécessaires, à savoir les services Milvus et les dépendances telles que etcd, Pulsar et MinIO.</p></li>
<li><p><strong>Gestion automatisée du cycle de vie :</strong> Lorsque des changements surviennent, comme la mise à jour de la version ou la modification du stockage, l'opérateur effectue des mises à jour en continu ou reconfigure les composants sans perturber le cluster.</p></li>
<li><p><strong>Auto-réparation :</strong> Le contrôleur vérifie en permanence l'état de santé de chaque composant. En cas de panne, il remplace automatiquement le pod ou restaure l'état du service pour garantir le temps de fonctionnement.</p></li>
</ol>
<p>Cette approche est beaucoup plus puissante que les déploiements YAML ou Helm traditionnels, car elle permet une gestion continue au lieu d'une simple configuration initiale.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Pourquoi utiliser Milvus Operator plutôt que Helm ou YAML ?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors du déploiement de Milvus, vous pouvez choisir entre des fichiers YAML manuels, des diagrammes Helm ou l'Opérateur Milvus. Chacun a sa place, mais l'Opérateur offre des avantages significatifs pour les opérations en cours.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Automatisation des opérations</h3><p>Les méthodes traditionnelles nécessitent un travail manuel pour les tâches de routine. La mise à l'échelle implique la mise à jour de plusieurs fichiers de configuration et la coordination des changements. Les mises à niveau nécessitent une planification minutieuse pour éviter les interruptions de service. L'opérateur gère ces tâches automatiquement. Il peut détecter quand une mise à l'échelle est nécessaire et effectuer les changements en toute sécurité. Les mises à niveau deviennent de simples mises à jour de configuration que l'opérateur exécute avec un séquençage approprié et des capacités de retour en arrière si nécessaire.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Meilleure visibilité de l'état</h3><p>Les fichiers YAML indiquent à Kubernetes ce que vous voulez, mais ils ne vous montrent pas l'état actuel de votre système. Helm aide à la gestion de la configuration, mais ne surveille pas l'état d'exécution de votre application. L'opérateur surveille en permanence l'ensemble de votre cluster. Il peut détecter des problèmes tels que des problèmes de ressources ou des réponses lentes et prendre des mesures avant qu'ils ne deviennent des problèmes graves. Cette surveillance proactive améliore considérablement la fiabilité.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Une gestion à long terme plus facile</h3><p>La gestion d'environnements multiples avec des fichiers YAML implique la synchronisation de nombreux fichiers de configuration. Même avec les modèles Helm, les opérations complexes nécessitent toujours une coordination manuelle importante.</p>
<p>L'Opérateur encapsule les connaissances de gestion de Milvus dans son code. Cela signifie que les équipes peuvent gérer efficacement les clusters sans devenir des experts de chaque composant. L'interface opérationnelle reste cohérente au fur et à mesure que votre infrastructure évolue.</p>
<p>Utiliser l'Opérateur, c'est choisir une approche plus automatisée de la gestion de Milvus. Il réduit le travail manuel tout en améliorant la fiabilité grâce à l'expertise intégrée - des avantages précieux à mesure que les bases de données vectorielles deviennent de plus en plus critiques pour les applications.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">L'architecture de Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le diagramme décrit clairement la structure de déploiement de Milvus Operator au sein d'un cluster Kubernetes :</p>
<ul>
<li><p>À gauche (zone bleue) : Composants principaux de l'opérateur, y compris le contrôleur et le Milvus-CRD.</p></li>
<li><p>À droite (zone verte) : Divers composants du cluster Milvus, tels que le proxy, le coordinateur et le nœud.</p></li>
<li><p>Au centre (flèches - "créer/gérer") : Le flux d'opérations montrant comment l'opérateur gère le cluster Milvus.</p></li>
<li><p>Bas (zone orange) : Services dépendants tels que etcd et MinIO/S3/MQ.</p></li>
</ul>
<p>Cette structure visuelle, avec des blocs de couleur distincts et des flèches directionnelles, clarifie efficacement les interactions et le flux de données entre les différents composants.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Démarrage avec Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce guide vous montre comment déployer Milvus à l'aide de l'Opérateur. Nous utiliserons ces versions dans ce guide.</p>
<ul>
<li><p><strong>Système d'exploitation</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Conditions préalables</h3><p>Votre cluster Kubernetes a besoin d'au moins une StorageClass configurée. Vous pouvez vérifier ce qui est disponible :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Dans notre exemple, nous avons deux options :</p>
<ul>
<li><p><code translate="no">local</code> (par défaut) - utilise les disques locaux</p></li>
<li><p><code translate="no">nfs-sc</code>- utilise le stockage NFS (parfait pour les tests, mais à éviter en production)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Installation de l'opérateur Milvus</h3><p>Vous pouvez installer l'Opérateur avec <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> ou <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Nous utiliserons kubectl car il est plus simple.</p>
<p>Téléchargez le manifeste de déploiement de l'Opérateur :</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Remplacer l'adresse de l'image (optionnel) :</p>
<p><strong>Facultatif : Utilisez un registre d'images différent</strong> Si vous ne pouvez pas accéder à DockerHub ou préférez votre propre registre :</p>
<p><em>Remarque : L'adresse du dépôt d'images fournie ici est à des fins de test. Remplacez-la par votre adresse de dépôt réelle si nécessaire.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Installez Milvus Operator :</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Après l'installation, vous devriez obtenir un résultat similaire à celui-ci :</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Vérifier le déploiement de Milvus Operator et les ressources du pod :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Déploiement du cluster Milvus</h3><p>Une fois que le pod Milvus Operator est en cours d'exécution, vous pouvez déployer le cluster Milvus en suivant les étapes suivantes.</p>
<p>Téléchargez le manifeste de déploiement du cluster Milvus :</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>La configuration par défaut est minimale :</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pour un déploiement réel, vous devrez la personnaliser :</strong></p>
<ul>
<li><p>Nom de cluster personnalisé : <code translate="no">milvus-release-v25</code></p></li>
<li><p>Image personnalisée : (pour utiliser une image en ligne différente ou une image locale hors ligne) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Nom de la classe de stockage personnalisée : Dans les environnements avec plusieurs classes de stockage, vous pouvez avoir besoin de spécifier la classe de stockage pour les composants persistants comme MinIO et etcd. Dans cet exemple, <code translate="no">nfs-sc</code> est utilisé.</p></li>
<li><p>Ressources personnalisées : Définissez les limites de CPU et de mémoire pour les composants Milvus. Par défaut, aucune limite n'est définie, ce qui pourrait surcharger vos nœuds Kubernetes.</p></li>
<li><p>Suppression automatique des ressources connexes : Par défaut, lorsque le cluster Milvus est supprimé, les ressources associées sont conservées.</p></li>
</ul>
<p>Pour la configuration de paramètres supplémentaires, voir :</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Définition des ressources personnalisées Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Valeurs Pulsar</a></p></li>
</ul>
<p>Le manifeste modifié est le suivant :</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Déployer le cluster Milvus :</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Vérification de l'état du cluster Milvus</h4><p>Milvus Operator configure d'abord les dépendances middleware pour Milvus, telles que etcd, Zookeeper, Pulsar et MinIO, avant de déployer les composants Milvus (par exemple, le proxy, le coordinateur et les nœuds).</p>
<p>Voir les déploiements :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>Note spéciale :</p>
<p>Vous remarquerez peut-être que l'opérateur Milvus crée un déploiement <code translate="no">standalone</code> et <code translate="no">querynode-1</code> avec 0 réplique.</p>
<p>C'est intentionnel. Nous avons soumis un problème au référentiel de l'Opérateur Milvus, la réponse officielle est la suivante :</p>
<ul>
<li><p>a. Les déploiements fonctionnent comme prévu. La version autonome est conservée pour permettre des transitions transparentes d'un cluster à un déploiement autonome sans interruption de service.</p></li>
<li><p>b. Il est utile d'avoir à la fois <code translate="no">querynode-0</code> et <code translate="no">querynode-1</code> pendant les mises à jour. Au final, un seul d'entre eux sera actif.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Vérification du bon fonctionnement de tous les Pods</h4><p>Une fois que votre cluster Milvus est prêt, vérifiez que tous les pods fonctionnent comme prévu :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Vérification de la classe de stockage</h4><p>Assurez-vous que votre StorageClass personnalisée (<code translate="no">nfs-sc</code>) et les capacités de stockage spécifiées ont été correctement appliquées :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Vérification des limites de ressources Milvus</h4><p>Par exemple, pour vérifier que les limites de ressources pour le composant <code translate="no">mixcoord</code> ont été appliquées correctement, exécutez :</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Vérification de l'image personnalisée</h4><p>Confirmez que l'image personnalisée correcte est utilisée :</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Accès à votre cluster depuis l'extérieur</h3><p>Une question fréquente est la suivante : comment accéder aux services Milvus depuis l'extérieur de votre cluster Kubernetes ?</p>
<p>Par défaut, le service Milvus déployé par l'opérateur est de type <code translate="no">ClusterIP</code>, ce qui signifie qu'il est uniquement accessible au sein du cluster. Pour l'exposer à l'extérieur, vous devez définir une méthode d'accès externe. Ce guide opte pour l'approche la plus simple : l'utilisation d'un NodePort.</p>
<p>Créez et modifiez le manifeste du service pour l'accès externe :</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Incluez le contenu suivant :</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>Appliquer le manifeste de service externe :</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Vérifier l'état du service externe :</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Accès à l'interface Web de Milvus</li>
</ol>
<p>Milvus fournit une interface graphique intégrée, la Milvus WebUI, qui améliore l'observabilité grâce à une interface intuitive. Il permet de surveiller les mesures des composants Milvus et de leurs dépendances, d'examiner des informations détaillées sur les bases de données et les collections, et d'inspecter les détails complets de la configuration. Pour plus de détails, reportez-vous à la <a href="https://milvus.io/docs/milvus-webui.md">documentation officielle de Milvus WebUI</a>.</p>
<p>Après le déploiement, ouvrez l'URL suivante dans votre navigateur (remplacez <code translate="no">&lt;any_k8s_node_IP&gt;</code> par l'adresse IP de n'importe quel nœud Kubernetes) :</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Cela lancera l'interface WebUI.</p>
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
    </button></h2><p>L'<strong>opérateur Milvus</strong> est plus qu'un outil de déploiement : c'est un investissement stratégique dans l'excellence opérationnelle pour l'infrastructure de base de données vectorielle. En automatisant les tâches de routine et en intégrant les meilleures pratiques dans votre environnement Kubernetes, il libère les équipes pour qu'elles se concentrent sur ce qui compte le plus : la création et l'amélioration d'applications pilotées par l'IA.</p>
<p>L'adoption d'une gestion basée sur les opérateurs nécessite quelques efforts initiaux, notamment des changements dans les flux de travail et les processus d'équipe. Mais pour les organisations qui fonctionnent à l'échelle - ou qui prévoient de le faire - les gains à long terme sont significatifs : fiabilité accrue, réduction des frais généraux opérationnels et cycles de déploiement plus rapides et plus cohérents.</p>
<p>L'IA devenant un élément essentiel des opérations commerciales modernes, le besoin d'une infrastructure de base de données vectorielle robuste et évolutive ne fait que croître. L'opérateur Milvus prend en charge cette évolution en proposant une approche mature, axée sur l'automatisation, qui évolue avec votre charge de travail et s'adapte à vos besoins spécifiques.</p>
<p>Si votre équipe est confrontée à une complexité opérationnelle, anticipe la croissance ou souhaite simplement réduire la gestion manuelle de l'infrastructure, l'adoption précoce de Milvus Operator peut contribuer à éviter la dette technique future et à améliorer la résilience globale du système.</p>
<p>L'avenir de l'infrastructure est intelligent, automatisé et convivial pour les développeurs. <strong>Milvus Operator apporte cet avenir à votre couche de base de données, dès aujourd'hui.</strong></p>
<hr>
