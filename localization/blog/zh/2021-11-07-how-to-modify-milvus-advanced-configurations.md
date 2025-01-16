---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: 如何修改 Milvus 高级配置
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: 如何修改部署在 Kubernetes 上的 Milvus 的配置
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>宗玉芬，Zilliz 测试开发工程师，毕业于华中科技大学，获计算机技术硕士学位。她目前从事 Milvus 向量数据库的质量保证工作，包括但不限于接口集成测试、SDK 测试、Benchmark 测试等。于芬热衷于Milvus测试和开发中的问题解决，是混沌工程理论和故障演练实践的忠实粉丝。</em></p>
<h2 id="Background" class="common-anchor-header">背景介绍<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>在使用 Milvus 向量数据库时，需要修改默认配置以满足不同场景的需求。之前，有 Milvus 用户分享过《<a href="/blog/zh/2021-10-22-apply-configuration-changes-on-milvus-2.md">如何修改使用 Docker Compose 部署的 Milvus 的配置</a>》。而在本文中，我想与大家分享如何修改部署在 Kubernetes 上的 Milvus 的配置。</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">修改 Milvus 在 Kubernetes 上的配置<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>你可以根据想要修改的配置参数选择不同的修改方案。所有 Milvus 配置文件都存储在<strong>milvus/configs</strong> 下。在 Kubernetes 上安装 Milvus 时，本地会添加一个 Milvus Helm Chart 资源库。通过运行<code translate="no">helm show values milvus/milvus</code> ，你可以检查可直接用 Chart 修改的参数。对于可通过 Chart 修改的参数，可使用<code translate="no">--values</code> 或<code translate="no">--set</code> 传递参数。更多信息，请参阅<a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a>和<a href="https://helm.sh/docs/">Helm</a>。</p>
<p>如果您希望修改的参数不在列表中，可以按照以下说明操作。</p>
<p>在以下步骤中，要修改<strong>/milvus/configs/advanced/root_coord.yaml</strong>中的参数<code translate="no">rootcoord.dmlChannelNum</code> ，以作示范。Kubernetes 上 Milvus 的配置文件管理是通过 ConfigMap 资源对象实现的。要修改参数，应首先更新相应 Chart 版本的 ConfigMap 对象，然后修改相应 pod 的部署资源文件。</p>
<p>请注意，此方法仅适用于修改已部署的 Milvus 应用程序的参数。要在部署前修改<strong>/milvus/configs/advanced/*.yaml</strong>中的参数，需要重新开发 Milvus Helm Chart。</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">修改 ConfigMap YAML</h3><p>如下图所示，你在 Kubernetes 上运行的 Milvus 发行版对应一个与发行版同名的 ConfigMap 对象。ConfigMap 对象的<code translate="no">data</code> 部分只包括<strong>Milvus.yaml</strong> 中的配置。要更改<strong>root_coord.yaml</strong> 中的<code translate="no">rootcoord.dmlChannelNum</code> ，必须将<strong>root_coord.yaml</strong>中的参数添加到 ConfigMap YAML 中的<code translate="no">data</code> 部分，并更改特定参数。</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">修改部署 YAML</h3><p>存储在 ConfigMap 中的数据可以在 configMap 类型的卷中引用，然后由在 pod 中运行的容器化应用程序消耗。要将 pod 引向新的配置文件，必须修改需要加载<strong>root_coord.yaml</strong> 中配置的 pod 模板。具体来说，您需要在部署 YAML 的<code translate="no">spec.template.spec.containers.volumeMounts</code> 部分下添加挂载声明。</p>
<p>以 rootcoord pod 的部署 YAML 为例，在<code translate="no">.spec.volumes</code> 部分指定了名为<strong>milvus-config</strong>的<code translate="no">configMap</code> 类型卷。在<code translate="no">spec.template.spec.containers.volumeMounts</code> 部分，卷被声明为将 Milvus 发行版的 milvus<strong>.yaml</strong>挂载到<strong>/milvus/configs/milvus.yaml 上</strong>。同样，您只需专门为 rootcoord 容器添加一个 mount 声明，将<strong>root_coord.yaml</strong>挂载到<strong>/milvus/configs/advanced/root_coord.yaml</strong> 上，这样容器就能访问新的配置文件了。</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">验证结果</h3><p>kubelet 会在每次定期同步时检查挂载的 ConfigMap 是否是新的。当卷中消耗的 ConfigMap 更新时，投影的密钥也会自动更新。当新 pod 再次运行时，您可以验证 pod 中的修改是否成功。下面分享了检查参数<code translate="no">rootcoord.dmlChannelNum</code> 的命令。</p>
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
<p>以上就是在 Kubernetes 上部署的 Milvus 中修改高级配置的方法。Milvus 的未来版本将把所有配置整合到一个文件中，并支持通过 Helm 图表更新配置。但在此之前，我希望这篇文章能作为临时解决方案帮到你。</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">加入我们的开源社区：<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>在<a href="https://bit.ly/307b7jC">GitHub</a> 上查找或为 Milvus 做贡献。</p></li>
<li><p>通过<a href="https://bit.ly/3qiyTEk">论坛</a>与社区互动。</p></li>
<li><p>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上与我们联系。</p></li>
</ul>
