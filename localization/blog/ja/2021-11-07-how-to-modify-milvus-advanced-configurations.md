---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Milvus詳細設定の変更方法
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Kubernetes上にデプロイされたMilvusの設定を変更する方法
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Zillizテスト開発エンジニアのYufen Zongは、華中科技大学のコンピュータ技術修士号を取得。現在、Milvusベクトルデータベースの品質保証に従事しており、インターフェース統合テスト、SDKテスト、ベンチマークテストなどを含むが、これらに限定されない。Milvusのテストと開発における熱心な問題解決者であり、カオス工学の理論とフォールトドリルの実践の大ファンである。</em></p>
<h2 id="Background" class="common-anchor-header">経歴<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusベクトルデータベースを使用する際、様々なシナリオの要件を満たすためにデフォルトの設定を変更する必要があります。以前、あるMilvusユーザが、<a href="/blog/ja/2021-10-22-apply-configuration-changes-on-milvus-2.md">Docker Composeを使ってデプロイされたMilvusの設定を変更する</a>方法を紹介しました。今回は、Kubernetes上にデプロイされたMilvusの設定を変更する方法についてご紹介します。</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Kubernetes上のMilvusの設定を変更する<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>変更したい設定パラメータに応じて、様々な変更プランを選択することができます。Milvusの設定ファイルはすべて<strong>milvus/configs</strong>配下に格納されています。KubernetesにMilvusをインストールすると、ローカルにMilvus Helm Chartリポジトリが追加されます。<code translate="no">helm show values milvus/milvus</code> を実行することで、Chartで直接変更可能なパラメータを確認することができます。Chartで変更可能なパラメータについては、<code translate="no">--values</code> または<code translate="no">--set</code> を使用してパラメータを渡すことができます。詳しくは、<a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chartと</a> <a href="https://helm.sh/docs/">Helmを</a>参照してください。</p>
<p>変更したいパラメータがリストにない場合は、以下の手順に従ってください。</p>
<p>以下の手順では、<strong>/milvus/configs/advanced/root_coord.yaml</strong>のパラメータ<code translate="no">rootcoord.dmlChannelNum</code> をデモ用に変更します。Kubernetes上でのMilvusの設定ファイル管理は、ConfigMapリソースオブジェクトを通して実装されている。パラメータを変更するには、まず対応するChartリリースのConfigMapオブジェクトを更新し、次に対応するPodのデプロイリソースファイルを修正する必要があります。</p>
<p>この方法は、デプロイされたmilvusアプリケーションのパラメータ変更にのみ適用されますのでご注意ください。デプロイ前に<strong>/milvus/configs/advanced/*.yaml</strong>のパラメータを変更するには、Milvus Helm Chart を再度開発する必要があります。</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">ConfigMap YAMLの変更</h3><p>以下のように、Kubernetes上で動作するMilvusリリースは、リリースと同じ名前のConfigMapオブジェクトに対応しています。ConfigMapオブジェクトの<code translate="no">data</code> セクションには、<strong>milvus.yamlの</strong>設定のみが含まれます。<strong>root_coord.yamlの</strong> <code translate="no">rootcoord.dmlChannelNum</code> を変更するには、<strong>root_coord.yamlの</strong>パラメータをConfigMap YAMLの<code translate="no">data</code> セクションに追加し、特定のパラメータを変更する必要があります。</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">デプロイメント YAML の変更</h3><p>ConfigMap に格納されたデータは、configMap タイプのボリュームで参照することができ、その後、ポッドで実行されているコンテナ化されたアプリケーションによって消費されます。新しい設定ファイルにポッドを誘導するには、<strong>root_coord.yaml</strong> 内の設定をロードする必要があるポッド・テンプレートを修正する必要があります。具体的には、デプロイメント YAML の<code translate="no">spec.template.spec.containers.volumeMounts</code> セクションの下にマウント宣言を追加する必要があります。</p>
<p>rootcoord podのデプロイメントYAMLを例にとると、<code translate="no">.spec.volumes</code> セクションに<strong>milvus-configという</strong> <code translate="no">configMap</code> タイプのボリュームが指定されています。また、<code translate="no">spec.template.spec.containers.volumeMounts</code> セクションでは、milvusリリースの<strong>milvus.yamlを</strong> <strong>/milvus/configigs/milvus.yamlに</strong>マウントすることが宣言されています。同様に、rootcoordコンテナ専用のマウント宣言を追加して、<strong>/milvus/configigs/advanced/root_coord.yamlに</strong> <strong>root_coord.yamlを</strong>マウントするだけで、コンテナは新しい設定ファイルにアクセスできるようになる。</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">結果の確認</h3><p>kubeletは、定期的な同期ごとに、マウントされたConfigMapが新しいかどうかをチェックします。ボリュームで消費される ConfigMap が更新されると、投影されたキーも自動的に更新されます。新しいポッドが再び実行されると、ポッドで修正が成功したかどうかを確認できます。パラメータ<code translate="no">rootcoord.dmlChannelNum</code> を確認するためのコマンドを以下に示します。</p>
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
<p>以上がKubernetes上にデプロイされたMilvusの高度な設定を変更する方法である。Milvusの将来のリリースでは、すべての設定が1つのファイルに統合され、helm chartによる設定の更新がサポートされる予定だ。しかしその前に、この記事が一時的な解決策としてお役に立てれば幸いです。</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">私たちのオープンソースコミュニティに参加してください：<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p><a href="https://bit.ly/307b7jC">GitHubで</a>Milvusを見つけたり、Milvusに貢献する。</p></li>
<li><p><a href="https://bit.ly/3qiyTEk">フォーラムで</a>コミュニティと交流する。</p></li>
<li><p><a href="https://bit.ly/3ob7kd8">Twitterで</a>つながる。</p></li>
</ul>
