---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: 如何修改 Milvus 進階設定
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: 如何修改部署在 Kubernetes 上的 Milvus 設定
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>宗玉芬，Zilliz測試開發工程師，畢業於華中科技大學計算機技術碩士。目前從事Milvus向量資料庫的品質保證工作，包括但不限於介面整合測試、SDK測試、Benchmark測試等。余芬熱衷於Milvus的測試和開發中的問題解決，也是混沌工程理論和故障演練實踐的忠實粉絲。</em></p>
<h2 id="Background" class="common-anchor-header">技術背景<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>在使用Milvus向量資料庫時，需要修改預設配置以滿足不同場景的需求。之前，有一位 Milvus 用戶分享了<a href="/blog/zh-hant/2021-10-22-apply-configuration-changes-on-milvus-2.md">如何修改使用 Docker Compose 部署的 Milvus 的配置</a>。而在這篇文章中，我想和大家分享如何修改部署在 Kubernetes 上的 Milvus 的配置。</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">在 Kubernetes 上修改 Milvus 的配置<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>您可以根據想要修改的配置參數，選擇不同的修改方案。所有的 Milvus 配置文件都儲存在<strong>milvus/configs</strong> 下。在 Kubernetes 上安裝 Milvus 時，本機會新增一個 Milvus Helm Chart 儲存庫。透過執行<code translate="no">helm show values milvus/milvus</code> ，您可以直接使用 Chart 檢查可修改的參數。對於可使用 Chart 修改的參數，您可以使用<code translate="no">--values</code> 或<code translate="no">--set</code> 傳遞參數。如需更多資訊，請參閱<a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a>和<a href="https://helm.sh/docs/">Helm</a>。</p>
<p>如果您期望修改的參數不在清單上，您可以按照下面的指示進行修改。</p>
<p>在以下步驟中，為了示範目的，要修改<strong>/milvus/configs/advanced/root_coord.yaml</strong>中的參數<code translate="no">rootcoord.dmlChannelNum</code> 。Kubernetes 上 Milvus 的組態檔案管理是透過 ConfigMap 資源物件來實作。若要變更參數，必須先更新相對應 Chart 版本的 ConfigMap 物件，然後再修改相對應 Pod 的部署資源檔案。</p>
<p>請注意，此方法僅適用於已部署的 Milvus 應用程式的參數修改。若要在部署前修改<strong>/milvus/configs/advanced/*.yaml</strong>中的參數，您需要重新開發 Milvus Helm Chart。</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">修改 ConfigMap YAML</h3><p>如下圖所示，您在 Kubernetes 上執行的 Milvus 版本對應於與版本同名的 ConfigMap 物件。ConfigMap 物件的<code translate="no">data</code> 部分僅包含<strong>milvus.yaml</strong> 中的配置。若要變更<strong>root_coord.yaml</strong> 中的<code translate="no">rootcoord.dmlChannelNum</code> ，您必須將<strong>root_coord.yaml</strong>中的參數新增至 ConfigMap YAML 中的<code translate="no">data</code> 區段，並變更特定參數。</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">修改部署 YAML</h3><p>儲存於 ConfigMap 的資料可以在 configMap 類型的卷中被引用，然後由在 Pod 中執行的容器化應用程式消耗。要將 pod 引導到新的組態檔案，您必須修改需要載入<strong>root_coord.yaml</strong> 中組態的 pod 模版。具體來說，您需要在部署 YAML 的<code translate="no">spec.template.spec.containers.volumeMounts</code> 區段下新增一個 mount 宣告。</p>
<p>以 rootcoord pod 的部署 YAML 為例，在<code translate="no">.spec.volumes</code> 部分指定了一個<code translate="no">configMap</code> 類型的 volume，名為<strong>milvus-config</strong>。此外，在<code translate="no">spec.template.spec.containers.volumeMounts</code> 段落中，該磁碟區被宣告要將您的 Milvus 版本的 milvus<strong>.yaml 掛載</strong>到<strong>/milvus/configs/milvus.yaml</strong>。同樣地，您只需要特別為 rootcoord 容器新增一個掛載宣告，將<strong>root_coord.yaml 掛載</strong>到<strong>/milvus/configs/advanced/root_coord.yaml</strong> 上，這樣容器就可以存取新的組態檔案。</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">驗證結果</h3><p>kubelet 會在每次定期同步時檢查掛載的 ConfigMap 是否新鮮。當卷中消耗的 ConfigMap 更新時，投影的金鑰也會自動更新。當新的 Pod 再次執行時，您可以在 Pod 中驗證修改是否成功。檢查參數的指令<code translate="no">rootcoord.dmlChannelNum</code> 分享如下。</p>
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
<p>以上是修改部署在 Kubernetes 上的 Milvus 進階配置的方法。未來的 Milvus 版本會將所有配置整合在一個檔案中，並支援透過 helm chart 更新配置。但在此之前，我希望這篇文章可以幫助您作為臨時的解決方案。</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">參與我們的開源碼社群：<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>在<a href="https://bit.ly/307b7jC">GitHub</a> 上尋找或貢獻 Milvus。</p></li>
<li><p>透過<a href="https://bit.ly/3qiyTEk">論壇</a>與社群互動。</p></li>
<li><p>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上與我們連線。</p></li>
</ul>
