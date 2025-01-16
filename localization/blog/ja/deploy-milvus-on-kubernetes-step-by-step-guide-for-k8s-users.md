---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: KubernetesでMilvusをデプロイする：Kubernetesユーザーのためのステップバイステップガイド
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  このガイドでは、Milvus
  Operatorを使用してKubernetes上でMilvusをセットアップするための明確でステップバイステップのウォークスルーを提供します。
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvusは</strong></a>、ベクトル表現を通じて大量の<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データを</a>保存、インデックス化、検索するために設計されたオープンソースの<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a>であり、類似検索、<a href="https://zilliz.com/glossary/semantic-search">意味検索</a>、検索拡張世代<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG）</a>、レコメンデーションエンジン、その他の機械学習タスクなどのAI駆動型アプリケーションに最適である。</p>
<p>しかし、Milvusをさらに強力にしているのは、Kubernetesとのシームレスな統合だ。Kubernetesに詳しい方なら、このプラットフォームがスケーラブルな分散システムのオーケストレーションに最適であることを知っているだろう。MilvusはKubernetesの機能を最大限に活用し、分散Milvusクラスタを容易にデプロイ、スケール、管理することができます。本ガイドでは、Milvus Operatorを使用してKubernetes上でMilvusをセットアップするための明確なステップバイステップのウォークスルーを提供します。</p>
<h2 id="Prerequisites" class="common-anchor-header">前提条件<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>始める前に、以下の前提条件が整っていることを確認してください：</p>
<ul>
<li><p>Kubernetesクラスタが稼働していること。ローカルでテストする場合は、<code translate="no">minikube</code> 。</p></li>
<li><p><code translate="no">kubectl</code> インストールされ、Kubernetesクラスタとやり取りできるように設定されていること。</p></li>
<li><p>ポッド、サービス、デプロイメントなどの基本的なKubernetesの概念に精通していること。</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">ステップ1：Minikubeのインストール（ローカルテストの場合）<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>ローカルのKubernetes環境をセットアップする必要がある場合は、<code translate="no">minikube</code> 。正式なインストール手順は<a href="https://minikube.sigs.k8s.io/docs/start/">minikube getting started</a>ページにある。</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1.Minikubeのインストール</h3><p><a href="https://github.com/kubernetes/minikube/releases"> minikubeのリリースページに</a>アクセスし、お使いのオペレーティングシステムに適したバージョンをダウンロードします。macOS/Linuxの場合は、以下のコマンドを使用できる：</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2.Minikubeを起動する</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3.クラスタとの対話</h3><p>これで、minikube内のkubectlを使ってクラスタと対話できるようになります。kubectlをインストールしていない場合、minikubeはデフォルトで適切なバージョンをダウンロードします。</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>または、<code translate="no">kubectl</code> というminikubeのバイナリへのシンボリックリンクを作成すると、簡単に使用できます。</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">ステップ2: StorageClassの設定<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>Kubernetesでは、<strong>StorageClassが</strong>ワークロードで利用可能なストレージのタイプを定義し、異なるストレージ構成を柔軟に管理できるようにします。先に進む前に、デフォルトのStorageClassがクラスタで利用可能であることを確認する必要があります。ここでは、確認方法と、必要に応じて設定する方法を説明します。</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1.インストールされているStorageClassの確認</h3><p>Kubernetesクラスタで利用可能なStorageClassを確認するには、以下のコマンドを実行する：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>クラスタにインストールされているストレージクラスの一覧が表示されます。デフォルトのStorageClassがすでに構成されている場合は、<code translate="no">(default)</code> でマークされます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2.デフォルトのStorageClassを設定する（必要な場合）</h3><p>デフォルトのStorageClassが設定されていない場合は、YAMLファイルで定義することで作成できます。以下の例を使用して、デフォルトのStorageClassを作成します：</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>この YAML 構成は、<code translate="no">minikube-hostpath</code> プロビジョナを使用する<code translate="no">default-storageclass</code> という<code translate="no">StorageClass</code> を定義します。</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3.StorageClass の適用</h3><p><code translate="no">default-storageclass.yaml</code> ファイルを作成したら、以下のコマンドを使用してクラスタに適用します：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>これにより、クラスタのデフォルトStorageClassが設定され、今後ストレージのニーズが適切に管理されるようになります。</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">ステップ3: Milvus Operatorを使用したMilvusのインストール<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operatorは、Kubernetes上でのMilvusのデプロイ、スケーリング、アップデートの管理を簡素化します。Milvus Operatorをインストールする前に、Milvus Operatorが使用するWebhookサーバー用の証明書を提供する<strong>cert-managerを</strong>インストールする必要があります。</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1.cert-manager のインストール</h3><p>Milvus Operatorでは、安全な通信のための証明書を管理するために<a href="https://cert-manager.io/docs/installation/supported-releases/">cert-managerが</a>必要です。必ず<strong>cert-managerバージョン1.1.3</strong>以降をインストールしてください。インストールするには、以下のコマンドを実行してください：</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>インストール後、cert-manager ポッドが実行されていることを確認してください：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2.Milvus Operatorのインストール</h3><p>cert-managerが起動したら、Milvus Operatorをインストールします。以下のコマンドを実行し、<code translate="no">kubectl</code> を使用してデプロイします：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Operatorポッドが稼働しているかどうかは、以下のコマンドで確認できる：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3.Milvusクラスタのデプロイ</h3><p>Milvus Operatorポッドが起動したら、Milvusクラスタをデプロイします。次のコマンドは、デフォルトの設定を使用して、コンポーネントと依存関係を別々のポッドに入れたMilvusクラスタをデプロイします：</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusの設定をカスタマイズするには、YAMLファイルを独自の設定YAMLファイルに置き換える必要があります。ファイルを手動で編集または作成するだけでなく、Milvus Sizing Toolを使用して設定を調整し、対応するYAMLファイルをダウンロードすることもできます。</p>
<p>Milvusの設定をカスタマイズするには、デフォルトのYAMLファイルを独自の設定で置き換える必要があります。このファイルを手動で編集または作成し、特定の要件に合わせることができます。</p>
<p>また、<a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Toolを</strong></a>使用して、より合理的なアプローチを行うこともできます。このツールを使用すると、リソースの割り当てやストレージのオプションなど、さまざまな設定を調整し、希望する設定の対応するYAMLファイルをダウンロードすることができます。これにより、Milvusの導入が特定のユースケースに最適化されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：Milvusサイジングツール</p>
<p>デプロイの完了には時間がかかる場合があります。Milvusクラスタのステータスはコマンドで確認できます：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusクラスタの準備が整うと、Milvusクラスタ内のすべてのポッドが実行中または完了するはずです：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">ステップ4: Milvusクラスタへのアクセス<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusクラスタがデプロイされたら、ローカルポートをMilvusサービスポートに転送してアクセスする必要があります。以下の手順に従って、サービスポートを取得し、ポート転送を設定します。</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1.サービスポートの取得</strong></h4><p>まず、以下のコマンドでサービスポートを特定します。<code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> を Milvus プロキシポッドの名前に置き換えてください。通常は<code translate="no">my-release-milvus-proxy-</code> で始まります：</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>このコマンドはMilvusサービスが使用しているポート番号を返します。</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2.ポートを転送する</strong></h4><p>ローカルでMilvusクラスタにアクセスするには、以下のコマンドを使用してローカルポートをサービスポートに転送します。<code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> を使用するローカルポートに、<code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> を前のステップで取得したサービスポートに置き換えてください：</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>このコマンドにより、ホスト・マシンのすべてのIPアドレスをリッスンするポート転送が可能になります。サービスが<code translate="no">localhost</code> だけをリッスンする必要がある場合は、<code translate="no">--address 0.0.0.0</code> オプションを省略できます。</p>
<p>ポートフォワーディングが設定されると、指定したローカルポート経由でMilvusクラスタにアクセスし、操作や統合を行うことができます。</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">ステップ5: Python SDKを使用したMilvusへの接続<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusクラスターを起動し、実行することで、任意のMilvus SDKを使用してMilvusと対話することができます。この例では、Milvusの<strong>Python SDKで</strong>ある<a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvusを</a>使用してクラスタに接続し、基本的な操作を実行します。</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1.PyMilvusのインストール</h3><p>Python経由でMilvusとやりとりするには、<code translate="no">pymilvus</code> パッケージをインストールする必要があります：</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2.Milvusへの接続</h3><p>以下は、Milvusクラスタに接続し、コレクションの作成などの基本的な操作を実行するPythonスクリプトのサンプルです。</p>
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
<h4 id="Explanation" class="common-anchor-header">説明します：</h4><ul>
<li><p>Milvusへの接続: スクリプトは、ステップ4で設定したローカルポートを使用して、<code translate="no">localhost</code> で実行されているMilvusサーバに接続します。</p></li>
<li><p>コレクションを作成します：このスクリプトは、<code translate="no">example_collection</code> という名前のコレクションがすでに存在するかどうかをチェックし、存在する場合はそれを削除してから、768次元のベクトルを持つ新しいコレクションを作成します。</p></li>
</ul>
<p>このスクリプトは、Milvusクラスタへの接続を確立してコレクションを作成し、ベクトルの挿入や類似検索の実行など、より複雑な操作の出発点として機能します。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Kubernetes上の分散セットアップにMilvusをデプロイすることで、大規模なベクトルデータを管理するための強力な機能が解放され、シームレスなスケーラビリティと高性能なAI駆動型アプリケーションが可能になります。このガイドに従って、Milvus Operatorを使用してMilvusをセットアップする方法を学び、プロセスを合理的かつ効率的にしました。</p>
<p>Milvusの探求を続けながら、需要の増大に合わせてクラスタを拡張したり、Amazon EKS、Google Cloud、Microsoft Azureなどのクラウドプラットフォームに展開したりすることを検討してください。管理と監視を強化するために、<a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>、<a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a>、<a href="https://github.com/zilliztech/attu"><strong>Attuなどの</strong></a>ツールは、デプロイの健全性とパフォーマンスを維持するための貴重なサポートを提供します。</p>
<p>これでMilvus on Kubernetesの潜在能力をフルに活用する準備が整いました！🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">その他のリソース<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Milvusドキュメント</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed：あなたに合ったモードは？ </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">ベクトルサーチのスーパーチャージング：NVIDIA RAPIDS cuVSとGPU上のMilvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGとは？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">ジェネレーティブAIリソースハブ｜Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">あなたのGenAIアプリのためのトップパフォーマンスAIモデル｜Zilliz</a></p></li>
</ul>
