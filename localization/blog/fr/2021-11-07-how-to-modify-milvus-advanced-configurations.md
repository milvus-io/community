---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Comment modifier les configurations avancées de Milvus ?
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Comment modifier la configuration de Milvus déployé sur Kubernetes ?
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, ingénieur en développement de tests chez Zilliz, est titulaire d'une maîtrise en technologie informatique de l'université des sciences et technologies de Huazhong. Elle s'occupe actuellement de l'assurance qualité de la base de données vectorielles Milvus, notamment des tests d'intégration des interfaces, des tests SDK, des tests d'évaluation des performances, etc. Yufen est une chercheuse de problèmes enthousiaste dans le cadre des essais et du développement de Milvus, et une grande fan de la théorie de l'ingénierie du chaos et de la pratique de l'exercice des fautes.</em></p>
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
    </button></h2><p>Lors de l'utilisation de la base de données vectorielle Milvus, vous devrez modifier la configuration par défaut pour répondre aux exigences de différents scénarios. Précédemment, un utilisateur de Milvus a partagé <a href="/blog/fr/2021-10-22-apply-configuration-changes-on-milvus-2.md">comment modifier la configuration de Milvus déployé à l'aide de Docker Compose</a>. Dans cet article, j'aimerais partager avec vous comment modifier la configuration de Milvus déployé sur Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Modifier la configuration de Milvus sur Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous pouvez choisir différents plans de modification en fonction des paramètres de configuration que vous souhaitez modifier. Tous les fichiers de configuration de Milvus sont stockés sous <strong>milvus/configs</strong>. Lors de l'installation de Milvus sur Kubernetes, un dépôt Milvus Helm Chart sera ajouté localement. En exécutant <code translate="no">helm show values milvus/milvus</code>, vous pouvez vérifier les paramètres qui peuvent être modifiés directement avec Chart. Pour les paramètres modifiables avec Chart, vous pouvez passer le paramètre à l'aide de <code translate="no">--values</code> ou <code translate="no">--set</code>. Pour plus d'informations, voir <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> et <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Si les paramètres que vous souhaitez modifier ne figurent pas dans la liste, vous pouvez suivre les instructions ci-dessous.</p>
<p>Dans les étapes suivantes, le paramètre <code translate="no">rootcoord.dmlChannelNum</code> dans <strong>/milvus/configs/advanced/root_coord.yaml</strong> sera modifié à des fins de démonstration. La gestion des fichiers de configuration de Milvus sur Kubernetes est mise en œuvre par le biais de l'objet de ressource ConfigMap. Pour modifier le paramètre, vous devez d'abord mettre à jour l'objet ConfigMap de la version Chart correspondante, puis modifier les fichiers de ressources de déploiement des pods correspondants.</p>
<p>Attention, cette méthode ne s'applique qu'à la modification des paramètres de l'application Milvus déployée. Pour modifier les paramètres dans <strong>/milvus/configs/advanced/*.yaml</strong> avant le déploiement, vous devrez redévelopper le Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Modifier le ConfigMap YAML</h3><p>Comme indiqué ci-dessous, votre version de Milvus exécutée sur Kubernetes correspond à un objet ConfigMap portant le même nom que la version. La section <code translate="no">data</code> de l'objet ConfigMap inclut uniquement les configurations dans <strong>milvus.yaml</strong>. Pour modifier le site <code translate="no">rootcoord.dmlChannelNum</code> dans <strong>root_coord.yaml</strong>, vous devez ajouter les paramètres de <strong>root_coord.yaml</strong> à la section <code translate="no">data</code> du ConfigMap YAML et modifier le paramètre spécifique.</p>
<pre><code translate="no">kind: ConfigMap
apiVersion: v1
metadata:
  name: milvus-chaos
  ...
data:
  milvus.yaml: &gt;
    ......
  root_coord.yaml: |
    rootcoord:
      dmlChannelNum: 128
      maxPartitionNum: 4096
      minSegmentSizeToEnableIndex: 1024
      <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
      timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Modifier le YAML de déploiement</h3><p>Les données stockées dans un ConfigMap peuvent être référencées dans un volume de type configMap puis consommées par des applications conteneurisées s'exécutant dans un pod. Pour diriger les pods vers les nouveaux fichiers de configuration, vous devez modifier les modèles de pods qui ont besoin de charger les configurations dans <strong>root_coord.yaml</strong>. Plus précisément, vous devez ajouter une déclaration mount sous la section <code translate="no">spec.template.spec.containers.volumeMounts</code> dans le YAML de déploiement.</p>
<p>En prenant le YAML de déploiement du pod rootcoord comme exemple, un volume de type <code translate="no">configMap</code> nommé <strong>milvus-config</strong> est spécifié dans la section <code translate="no">.spec.volumes</code>. Et, dans la section <code translate="no">spec.template.spec.containers.volumeMounts</code>, le volume est déclaré pour monter <strong>milvus.yaml</strong> de votre version de Milvus sur <strong>/milvus/configs/milvus.yaml</strong>. De même, il suffit d'ajouter une déclaration de montage spécifique au conteneur rootcoord pour monter le <strong>fichier root_coord.yaml</strong> sur <strong>/milvus/configs/advanced/root_coord.yaml</strong>, et le conteneur peut ainsi accéder au nouveau fichier de configuration.</p>
<pre><code translate="no" class="language-yaml">spec:
  replicas: 1
  selector:
    ......
  template:
    metadata:
      ...
    spec:
      volumes:
        - name: milvus-config
          configMap:
            name: milvus-chaos
            defaultMode: 420
      containers:
        - name: rootcoord
          image: <span class="hljs-string">&#x27;milvusdb/milvus-dev:master-20210906-86afde4&#x27;</span>
          args:
            ...
          ports:
            ...
          resources: {}
          volumeMounts:
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/milvus.yaml
              subPath: milvus.yaml
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/advanced/`root_coord.yaml
              subPath: root_coord.yaml
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: IfNotPresent
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verify-the-result" class="common-anchor-header">Vérifier le résultat</h3><p>Le kubelet vérifie si la ConfigMap montée est fraîche à chaque synchronisation périodique. Lorsque la ConfigMap consommée dans le volume est mise à jour, les clés projetées sont automatiquement mises à jour également. Lorsque le nouveau pod fonctionne à nouveau, vous pouvez vérifier si la modification a été effectuée avec succès dans le pod. Les commandes pour vérifier le paramètre <code translate="no">rootcoord.dmlChannelNum</code> sont partagées ci-dessous.</p>
<pre><code translate="no" class="language-bash">$ kctl <span class="hljs-built_in">exec</span> -ti milvus-chaos-rootcoord-6f56794f5b-xp2zs -- sh
<span class="hljs-comment"># cd configs/advanced</span>
<span class="hljs-comment"># pwd</span>
/milvus/configs/advanced
<span class="hljs-comment"># ls</span>
channel.yaml  common.yaml  data_coord.yaml  data_node.yaml  etcd.yaml  proxy.yaml  query_node.yaml  root_coord.yaml
<span class="hljs-comment"># cat root_coord.yaml</span>
rootcoord:
  dmlChannelNum: 128
  maxPartitionNum: 4096
  minSegmentSizeToEnableIndex: 1024
  <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
  timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<span class="hljs-comment"># exit</span>
<button class="copy-code-btn"></button></code></pre>
<p>La méthode ci-dessus permet de modifier les configurations avancées dans Milvus déployé sur Kubernetes. La prochaine version de Milvus intégrera toutes les configurations dans un seul fichier et prendra en charge la mise à jour de la configuration via le diagramme helm. Mais avant cela, j'espère que cet article pourra vous aider en tant que solution temporaire.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Participez à notre communauté open-source :<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Trouvez ou contribuez à Milvus sur <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Interagissez avec la communauté via le <a href="https://bit.ly/3qiyTEk">Forum</a>.</p></li>
<li><p>Connectez-vous avec nous sur <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
