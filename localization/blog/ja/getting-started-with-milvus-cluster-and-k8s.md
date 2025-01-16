---
id: getting-started-with-milvus-cluster-and-k8s.md
title: MilvusクラスタとK8sを使い始める
author: Stephen Batifol
date: 2024-04-03T00:00:00.000Z
desc: このチュートリアルでは、HelmによるMilvusのセットアップ、コレクションの作成、データの取り込みと類似検索の実行の基本を学びます。
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Kubernetes
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-milvus-and-k8s.md'
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは分散型ベクトルデータベースであり、膨大な埋め込みベクトルの保存、インデックス付け、管理を目的としている。Milvusは、何兆ものベクトルを効率的にインデックス化し、検索することができるため、AIや機械学習のワークロードに最適な選択肢となっている。</p>
<p>一方、Kubernetes（K8s）はコンテナ化されたアプリケーションの管理とスケーリングに優れている。自動スケーリング、セルフヒーリング、ロードバランシングなどの機能を提供し、本番環境での高可用性とパフォーマンスの維持に欠かせない。</p>
<h2 id="Why-Use-Them-Together" class="common-anchor-header">なぜ併用するのか？<button data-href="#Why-Use-Them-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>K8sは、ワークロードに応じてmilvusクラスタを自動的にスケールすることができます。データの増加やクエリの増加に伴い、K8sはより多くのMilvusインスタンスをスピンアップして負荷に対応し、アプリケーションの応答性を確保します。</p>
<p>K8sの特筆すべき特徴の1つは、Milvusクラスタを簡単に拡張できる水平スケーリングです。データセットが大きくなっても、K8sはその増加に難なく対応し、わかりやすく効率的なソリューションを実現します。</p>
<p>さらに、K8sはクエリ処理能力も水平方向に拡張します。クエリの負荷が増加するにつれ、K8sは増加する類似検索クエリに対応するため、より多くのMilvusインスタンスをデプロイすることができ、高負荷下でも低レイテンシーのレスポンスを保証します。</p>
<h2 id="Prerequisites--Setting-Up-K8s" class="common-anchor-header">前提条件とK8sのセットアップ<button data-href="#Prerequisites--Setting-Up-K8s" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li><p><strong>Docker</strong>- Dockerがシステムにインストールされていること。</p></li>
<li><p><strong>Kubernetes</strong>- Kubernetesクラスタを用意してください。ローカル開発には<code translate="no">minikube</code> 、本番環境にはクラウドプロバイダのKubernetesサービスを利用できます。</p></li>
<li><p><strong>Helm</strong>- Kubernetesアプリケーションを管理するために、Kubernetes用のパッケージマネージャーであるHelmをインストールします。<a href="https://milvus.io/docs/install_cluster-helm.md">https://milvus.io/docs/install_cluster-helm.md</a>、その方法はドキュメントを参照してください。</p></li>
<li><p><strong>Kubectl</strong>- Kubernetesクラスタと対話するためのコマンドラインツールである<code translate="no">kubectl</code> 、アプリケーションのデプロイ、クラスタリソースの検査と管理、ログの表示を行うためにインストールします。</p></li>
</ul>
<h3 id="Setting-Up-K8s" class="common-anchor-header">K8sのセットアップ</h3><p>K8sクラスタの実行に必要なものをすべてインストールした後、<code translate="no">minikube</code> を使用した場合は、 でクラスタを開始します：</p>
<pre><code translate="no">minikube start
<button class="copy-code-btn"></button></code></pre>
<p>でK8sクラスタのステータスを確認します：</p>
<pre><code translate="no">kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-Milvus-on-K8s" class="common-anchor-header">K8sへのMilvusのデプロイ</h3><p>今回のデプロイでは、Milvusの分散機能をフルに活用するため、クラスタモードでのMilvusを選択します。インストールプロセスを効率化するためにHelmを使用します。</p>
<p><strong>1.Helmインストールコマンド</strong></p>
<pre><code translate="no">helm install my-milvus milvus/milvus --<span class="hljs-built_in">set</span> pulsar.enabled=<span class="hljs-literal">false</span> --<span class="hljs-built_in">set</span> kafka.enabled=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>このコマンドは、Kafkaを有効にし、Pulsarを無効にした状態で、K8sクラスタにMilvusをインストールします。KafkaはMilvus内のメッセージング・システムとして機能し、異なるコンポーネント間のデータ・ストリーミングを処理します。Pulsarを無効化し、Kafkaを有効化することで、デプロイメントを特定のメッセージング設定および要件に合わせることができます。</p>
<p><strong>2.ポート転送</strong></p>
<p>ローカル・マシンからMilvusにアクセスするには、ポート・フォワードを作成します：<code translate="no">kubectl port-forward svc/my-milvus 27017:19530</code> 。</p>
<p>このコマンドは、Milvusサービス<code translate="no">svc/my-milvus</code> のポート<code translate="no">19530</code> をローカルマシンの同じポートにマップし、ローカルツールを使用してMilvusに接続できるようにします。ローカルポートを未指定のままにしておくと(<code translate="no">:19530</code> のように)、K8s が利用可能なポートを割り当て、動的に使用できるようにします。この方法を選択した場合、割り当てられたローカルポートをメモしておいてください。</p>
<p><strong>3.デプロイの確認</strong></p>
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
<p>上の出力と同じようなポッドのリストが表示され、すべてRunning状態になっているはずです。これはMilvusクラスタが稼働していることを示しています。特に、<code translate="no">READY</code> 列の下にある 1/1 を探してください。これは、各 Pod が完全に準備できていて稼働していることを意味します。Running状態にないPodがある場合は、デプロイを成功させるためにさらに調査する必要があるかもしれません。</p>
<p>Milvusクラスタがデプロイされ、すべてのコンポーネントが動作していることが確認されたので、データの取り込みとインデックス作成に進む準備ができました。これには、Milvusインスタンスへの接続、コレクションの作成、検索および取得のためのベクトルの挿入が含まれます。</p>
<h2 id="Data-Ingestion-and-Indexing" class="common-anchor-header">データの取り込みとインデックス作成<button data-href="#Data-Ingestion-and-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusクラスタでデータの取り込みとインデックス作成を開始するために、pymilvus SDKを使用します。2つのインストールオプションがあります：</p>
<ul>
<li><p>基本SDK：<code translate="no">pip install pymilvus</code></p></li>
<li><p>Basic SDK: リッチテキスト埋め込みと高度なモデル用：<code translate="no">pip install pymilvus[model]</code></p></li>
</ul>
<p>クラスタにデータを挿入する時間には、<code translate="no">pymilvus</code> を使用します。<code translate="no">pip install pymilvus</code> を使用してSDKのみをインストールするか、リッチテキストの埋め込みを抽出したい場合は、<code translate="no">pip install pymilvus[model]</code> をインストールして<code translate="no">PyMilvus Models</code> を使用することもできます。</p>
<h3 id="Connecting-and-Creating-a-Collection" class="common-anchor-header">接続とコレクションの作成</h3><p>まず、Milvusインスタンスに先ほど転送したポートを使って接続します。URIがK8sによって割り当てられたローカルポートと一致していることを確認してください：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
        uri=<span class="hljs-string">&quot;http://127.0.0.1:52070&quot;</span>,
    )

client.<span class="hljs-title function_">create_collection</span>(collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>, dimension=<span class="hljs-number">5</span>)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">dimension=5</code> パラメータは、このコレクションのベクターサイズを定義します。これは、ベクター検索機能に不可欠です。</p>
<h3 id="Insert-Data" class="common-anchor-header">データの挿入</h3><p>各ベクターがアイテムを表し、カラーフィールドが説明属性を追加します：</p>
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
<p>提供されるコードは、クイックセットアップの方法でコレクションを作成したと仮定します。上のコードに示すように</p>
<p>挿入するデータはディクショナリのリストに編成され、各ディクショナリはデータ・レコードを表し、エンティ ティと呼ばれます。</p>
<p>各ディクショナリには、color という名前の非スキーマ定義フィールドが含まれます。</p>
<p>各ディクショナリには、定義済みフィールドとダイナミック・フィールドの両方に対応するキーが含まれています。</p>
<h3 id="Insert-Even-More-Data" class="common-anchor-header">さらに多くのデータを挿入する</h3><pre><code translate="no">colors = [<span class="hljs-string">&quot;green&quot;</span>, <span class="hljs-string">&quot;blue&quot;</span>, <span class="hljs-string">&quot;yellow&quot;</span>, <span class="hljs-string">&quot;red&quot;</span>, <span class="hljs-string">&quot;black&quot;</span>, <span class="hljs-string">&quot;white&quot;</span>, <span class="hljs-string">&quot;purple&quot;</span>, <span class="hljs-string">&quot;pink&quot;</span>, <span class="hljs-string">&quot;orange&quot;</span>, <span class="hljs-string">&quot;brown&quot;</span>, <span class="hljs-string">&quot;grey&quot;</span>]
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
<h2 id="Similarity-Search" class="common-anchor-header">類似検索<button data-href="#Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>コレクションに入力した後、類似性検索を実行して、クエリ・ベクタに近いベクトルを見つけることができます。query_vectors 変数の値は、float のサブリストを含むリストです。このサブリストは、5次元のベクトル埋め込みを表します。</p>
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
<p>このクエリでは、クエリベクトルに最も近い上位3つのベクトルを検索し、Milvusの強力な検索機能を示しています。</p>
<h2 id="Uninstall-Milvus-from-K8s" class="common-anchor-header">K8sからMilvusをアンインストールする。<button data-href="#Uninstall-Milvus-from-K8s" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルが終わったら、<code translate="no">helm uninstall my-milvus</code> でK8sクラスタからMilvusをアンインストールしてください。</p>
<p>このコマンドを実行すると、<code translate="no">my-milvus</code> リリースでデプロイされたすべてのMilvusコンポーネントが削除され、クラスタリソースが解放されます。</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
<li><p>KubernetesクラスタにMilvusをデプロイすることで、AIや機械学習のワークロードを処理するためのベクトルデータベースのスケーラビリティと柔軟性が示されます。このチュートリアルを通じて、Helmを使用したMilvusのセットアップ、コレクションの作成、データの取り込みと類似検索の実行の基本を学びました。</p></li>
<li><p>Helmを使ったKubernetesクラスタへのMilvusのインストールは簡単なはずです。より大きなデータセットやより集中的なワークロードのためにMilvusクラスタをスケーリングするために、私たちのドキュメントは詳細なガイダンスを提供しています<a href="https://milvus.io/docs/scaleout.md">https://milvus.io/docs/scaleout.md</a>。</p></li>
</ul>
<p><a href="https://github.com/stephen37/K8s-tutorial-milvus">Githubで</a>コードをチェックアウトし、<a href="https://github.com/milvus-io/milvus">Milvusを</a>チェックアウトし、様々な構成やユースケースを試し、私たちの<a href="https://discord.gg/FG6hMJStWu">Discordに</a>参加してコミュニティと経験を共有してください。</p>
