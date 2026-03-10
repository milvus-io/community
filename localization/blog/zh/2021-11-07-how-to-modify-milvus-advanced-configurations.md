---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: How to Modify Milvus Advanced Configurations
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: How to modify the configuration of Milvus deployed on Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, a Zilliz Test Development Engineer, graduated from Huazhong University of Science and Technology with a master’s degree in computer technology. She is currently engaged in the quality assurance of Milvus vector database, including but not limited to interface integration testing, SDK testing, Benchmark testing, etc. Yufen is an enthusiastic problem-shooter in the test and development of Milvus, and a huge fan of chaos engineering theory and fault drill practice.</em></p>
<h2 id="Background" class="common-anchor-header">Background<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>While using Milvus vector database, you will need to modify the default configuration to satisfy the requirements of different scenarios. Previously, a Milvus user shared on <a href="/blog/zh/2021-10-22-apply-configuration-changes-on-milvus-2.md">How to Modify the Configuration of Milvus Deployed Using Docker Compose</a>. And in this article, I would like to share with you on how to modify the configuration of Milvus deployed on Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Modify configuration of Milvus on Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>You may choose different modification plans according to the configuration parameters you wish to modify. All Milvus configuration files are stored under <strong>milvus/configs</strong>. While installing Milvus on Kubernetes, a Milvus Helm Chart repository will be added locally. By running <code translate="no">helm show values milvus/milvus</code>, you can check the parameters that can be modified directly with Chart. For the modifiable parameters with Chart, you can pass the parameter using <code translate="no">--values</code> or <code translate="no">--set</code>. For more information, see <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> and <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>If the parameters you expect to modify are not on the list, you can follow the instruction below.</p>
<p>In the following steps, the parameter <code translate="no">rootcoord.dmlChannelNum</code> in <strong>/milvus/configs/advanced/root_coord.yaml</strong> is to be modified for demonstration purposes. Configuration file management of Milvus on Kubernetes is implemented through ConfigMap resource object. To change the parameter, you should first update the ConfigMap object of corresponding Chart release, and then modify the deployment resource files of corresponding pods.</p>
<p>Beware that this method only applies to parameter modification on deployed Milvus application. To modify the parameters in <strong>/milvus/configs/advanced/*.yaml</strong> before deployment, you will need to re-develop the Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Modify ConfigMap YAML</h3><p>As shown below, your Milvus release running on Kubernetes corresponds to a ConfigMap object with the same name of the release. The <code translate="no">data</code> section of the ConfigMap object only includes configurations in <strong>milvus.yaml</strong>. To change the <code translate="no">rootcoord.dmlChannelNum</code> in <strong>root_coord.yaml</strong>, you must add the parameters in <strong>root_coord.yaml</strong> to the <code translate="no">data</code> section in the ConfigMap YAML and change the specific parameter.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Modify Deployment YAML</h3><p>The data stored in a ConfigMap can be referenced in a volume of type configMap and then consumed by containerized applications running in a pod. To direct the pods to the new configuration files, you must modify the pod templates that need to load the configurations in <strong>root_coord.yaml</strong>. Specifically, you need to add a mount declaration under the <code translate="no">spec.template.spec.containers.volumeMounts</code> section in deployment YAML.</p>
<p>Taking the deployment YAML of rootcoord pod as an example, a <code translate="no">configMap</code> type volume named <strong>milvus-config</strong> is specified in <code translate="no">.spec.volumes</code> section. And, in <code translate="no">spec.template.spec.containers.volumeMounts</code> section, the volume is declared to mount <strong>milvus.yaml</strong> of your Milvus release on <strong>/milvus/configs/milvus.yaml</strong>. Similarly, you only need to add a mount declaration specifically for rootcoord container to mount the <strong>root_coord.yaml</strong> on <strong>/milvus/configs/advanced/root_coord.yaml</strong>, and thus the container can access the new configuration file.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Verify the result</h3><p>The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync. When the ConfigMap consumed in the volume is updated, projected keys are automatically updated as well. When the new pod is running again, you can verify if the modification is successful in the pod. Commands to check the parameter <code translate="no">rootcoord.dmlChannelNum</code> are shared below.</p>
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
<p>Above is the method to modify the advanced configurations in Milvus deployed on Kubernetes. Future release of Milvus will integrate all configurations in one file, and will support updating configuration via helm chart. But before that, I hope this article can help you as a temporary solution.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Engage with our open-source community:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Find or contribute to Milvus on <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Interact with the community via <a href="https://bit.ly/3qiyTEk">Forum</a>.</p></li>
<li><p>Connect with us on <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
