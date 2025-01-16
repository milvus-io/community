---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: オープンソースのMilvusベクターデータベースをAmazon EKSにデプロイする方法
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Amazon
  EKS、S3、MSK、ELBなどのマネージドサービスを使用してAWS上にMilvusベクトルデータベースをデプロイするためのステップバイステップガイドです。
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>この投稿は元々<a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWSの</em></a>ウェブサイトに掲載されたもので、許可を得て翻訳・編集し、ここに再掲載している。</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">ベクトル埋め込みとベクトルデータベースの概要<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/generative-ai">ジェネレーティブAI（GenAI）</a>、特に大規模言語モデル<a href="https://zilliz.com/glossary/large-language-models-(llms)">（LLM</a>）の台頭は、<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースへの</a>関心を著しく高め、GenAIのエコシステムにおいて不可欠なコンポーネントとして確立しました。その結果、ベクターデータベースはますます多くの<a href="https://milvus.io/use-cases">ユースケースで</a>採用されるようになっている。</p>
<p><a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDCのレポートでは</a>、2025年までにビジネスデータの80％以上が非構造化データになり、テキスト、画像、音声、動画などの形式で存在すると予測しています。この膨大な<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データを</a>大規模に理解し、処理し、保存し、照会することは、重要な課題である。GenAIやディープラーニングにおける一般的な手法は、非構造化データをベクトル埋め込みに変換し、<a href="https://milvus.io/intro">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a>（フルマネージドMilvus）のようなベクトルデータベースに保存、インデックス化し、<a href="https://zilliz.com/learn/vector-similarity-search">ベクトルの類似</a>性や意味的類似性を検索することだ。</p>
<p>しかし、<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みとは</a>一体何なのだろうか？簡単に言えば、高次元空間における浮動小数点数の数値表現である。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">2つのベクトル間の距離は</a>その関連性を示し、近ければ近いほど関連性が高く、逆もまた然りです。これは、類似したベクトルは類似した元のデータに対応することを意味し、従来のキーワード検索や完全一致検索とは異なります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>ベクトル類似検索の実行方法</span> </span></p>
<p><em>図1：ベクトル類似検索の実行方法</em></p>
<p>ベクトル埋め込みデータを格納し、インデックスを付け、検索する機能は、ベクトルデータベースの中核をなす機能です。現在、主流のベクトルデータベースは2つのカテゴリに分類されます。最初のカテゴリーは、Amazon OpenSearch Serviceの<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a>プラグインやAmazon RDS for<a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQLの</a>pgvector拡張など、既存のリレーショナルデータベース製品を拡張したものです。2つ目のカテゴリーは、Milvus、Zilliz Cloud（フルマネージドMilvus）、<a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>、<a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>、<a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a>、<a href="https://zilliz.com/blog/milvus-vs-chroma">Chromaの</a>ような有名な例を含む、特化したベクトルデータベース製品で構成される。</p>
<p>埋め込み技術とベクトルデータベースは、画像類似検索、ビデオ重複排除と分析、自然言語処理、推薦システム、ターゲット広告、パーソナライズされた検索、インテリジェントな顧客サービス、詐欺検出など、様々な<a href="https://zilliz.com/vector-database-use-cases">AI主導のユースケースに</a>幅広く応用されています。</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvusは</a>、数あるベクトルデータベースの中でも最も人気のあるオープンソースの選択肢の1つである。この投稿ではMilvusを紹介し、AWS EKS上でのMilvusのデプロイの実践を探る。</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvusとは？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvusは</a>柔軟性、信頼性が高く、高速なクラウドネイティブのオープンソースベクターデータベースです。ベクトル類似検索とAIアプリケーションを強力にサポートし、あらゆる組織がベクトルデータベースにアクセスできるように努めています。Milvusは、ディープニューラルネットワークやその他の機械学習（ML）モデルによって生成された10億以上のベクトル埋め込みを保存、インデックス付け、管理することができます。</p>
<p>Milvusは2019年10月に<a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">オープンソースのApache License 2.0の</a>下でリリースされた。現在、<a href="https://lfaidata.foundation/">LF AI &amp; Data Foundationの</a>卒業プロジェクトとなっている。このブログを書いている時点で、Milvusは<a href="https://hub.docker.com/r/milvusdb/milvus">5000万以上のDocker Pull</a>ダウンロードに達しており、NVIDIA、AT&amp;T、IBM、eBay、Shopee、Walmartなど<a href="https://milvus.io/">多くの顧客に</a>利用されている。</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvusの主な特徴</h3><p>クラウドネイティブなベクターデータベースとして、Milvusは以下の主な特徴を誇っている：</p>
<ul>
<li><p>億スケールのベクトルデータセットをミリ秒単位で検索する高いパフォーマンス。</p></li>
<li><p>多言語サポートとツールチェーン</p></li>
<li><p>水平スケーラビリティと障害発生時の高い信頼性</p></li>
<li><p>スカラーフィルタリングとベクトル類似検索を組み合わせた<a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">ハイブリッド検索</a>。</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvusのアーキテクチャ</h3><p>Milvusは、データフローと制御フローを分離するという原則に従っている。システムは図のように4つのレベルに分かれている：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvusアーキテクチャ</span> </span></p>
<p><em>図2 Milvusアーキテクチャ</em></p>
<ul>
<li><p><strong>アクセス層：</strong>アクセスレイヤーはステートレスプロキシ群で構成され、システムのフロントレイヤーとして、またユーザーに対するエンドポイントとして機能する。</p></li>
<li><p><strong>コーディネータサービス：</strong>コーディネータサービスは、ワーカーノードにタスクを割り当てる。</p></li>
<li><p><strong>ワーカーノード：</strong>ワーカーノードは、コーディネータサービスからの指示に従い、ユーザートリガーのDML/DDLコマンドを実行するダムエグゼキュータです。</p></li>
<li><p><strong>ストレージ：</strong>ストレージはデータの永続化を担当する。メタストレージ、ログブローカー、オブジェクトストレージから構成される。</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvusの展開オプション</h3><p>Milvusは3つの実行モードをサポートしています：<a href="https://milvus.io/docs/install-overview.md">Milvus Lite、スタンドアロン、分散</a>です。</p>
<ul>
<li><p><strong>Milvus Liteは</strong>ローカルアプリケーションにインポート可能なPythonライブラリです。Milvusの軽量版として、Jupyter Notebookでの迅速なプロトタイピングや、リソースの限られたスマートデバイスでの実行に最適です。</p></li>
<li><p><strong>Milvus Standaloneは</strong>シングルマシンサーバーデプロイメントです。実運用ワークロードがあるがKubernetesを使用したくない場合、十分なメモリを持つシングルマシン上でMilvus Standaloneを実行することは良い選択肢です。</p></li>
<li><p><strong>Milvus Distributedは</strong>Kubernetesクラスタ上にデプロイすることができる。より大きなデータセット、より高い可用性、スケーラビリティをサポートし、本番環境により適しています。</p></li>
</ul>
<p>Milvusは最初からKubernetesをサポートするように設計されており、AWS上で簡単にデプロイできる。マネージドKubernetesとしてAmazon Elastic Kubernetes Service (Amazon EKS)を、オブジェクトストレージとしてAmazon S3を、メッセージストレージとしてAmazon Managed Streaming for Apache Kafka (Amazon MSK)を、ロードバランサーとしてAmazon Elastic Load Balancing (Amazon ELB)を使用することで、信頼性と弾力性のあるMilvusデータベースクラスタを構築することができます。</p>
<p>次に、EKSやその他のサービスを利用したMilvusクラスタのデプロイについて、ステップバイステップで説明します。</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">AWS EKS上でのMilvusのデプロイ<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>AWS CLIを使用してEKSクラスタを作成し、Milvusデータベースをデプロイします。以下の前提条件が必要です：</p>
<ul>
<li><p><a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLIが</a>インストールされ、適切な権限で設定されたPC/MacまたはAmazon EC2インスタンス。Amazon Linux 2またはAmazon Linux 2023を使用している場合、AWS CLIツールはデフォルトでインストールされています。</p></li>
<li><p>Helm、Kubectl、eksctlなどの<a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">EKSツールがインストールされている</a>こと。</p></li>
<li><p>Amazon S3バケット。</p></li>
<li><p>Amazon MSKインスタンス。</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">MSKを作成する際の考慮事項</h3><ul>
<li>Milvusの最新安定版（v2.3.13）はKafkaの<code translate="no">autoCreateTopics</code> 機能に依存しています。そのため、MSKを作成する際には、カスタム設定を使用し、<code translate="no">auto.create.topics.enable</code> プロパティをデフォルトの<code translate="no">false</code> から<code translate="no">true</code> に変更する必要があります。また、MSKのメッセージスループットを向上させるためには、<code translate="no">message.max.bytes</code> と<code translate="no">replica.fetch.max.bytes</code> の値を大きくすることが推奨されます。詳細については、<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">カスタムMSK設定を</a>参照してください。</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>milvusはMSKのIAMロールベース認証をサポートしていません。そのため、MSKを作成する際は、セキュリティ設定で<code translate="no">SASL/SCRAM authentication</code> オプションを有効にし、AWS Secrets Managerで<code translate="no">username</code> 、<code translate="no">password</code> 。詳しくは、<a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">AWS Secrets Manager によるサインイン認証</a>を参照。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>図 3 セキュリティ設定 SASL SCRAM 認証を有効にする.png</span> </span></p>
<p><em>図 3: セキュリティ設定: SASL/SCRAM 認証を有効にする</em></p>
<ul>
<li>EKSクラスタのセキュリティグループまたはIPアドレス範囲からMSKセキュリティグループへのアクセスを有効にする必要があります。</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">EKSクラスタの作成</h3><p>コンソール、CloudFormation、eksctlなど、EKSクラスタを作成する方法はたくさんあります。この記事では、eksctlを使用してEKSクラスタを作成する方法を紹介します。</p>
<p><code translate="no">eksctl</code> は、Amazon EKS上でKubernetesクラスタを作成・管理するためのシンプルなコマンドラインツールです。Amazon EKS用のノードを持つ新しいクラスタを作成するための最速かつ最も簡単な方法を提供します。詳細はeksctlの<a href="https://eksctl.io/">ウェブサイトを</a>参照してください。</p>
<ol>
<li>まず、以下のコード・スニペットで<code translate="no">eks_cluster.yaml</code> ファイルを作成します。<code translate="no">cluster-name</code> をクラスタ名に置き換え、<code translate="no">region-code</code> をクラスタを作成する AWS リージョンに置き換え、<code translate="no">private-subnet-idx</code> をプライベートサブネットに置き換えてください。 注：この設定ファイルは、プライベートサブネットを指定して既存の VPC に EKS クラスタを作成します。新しいVPCを作成する場合は、VPCとサブネットの構成を削除すると、<code translate="no">eksctl</code> 。</li>
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
<li>次に、<code translate="no">eksctl</code> コマンドを実行して EKS クラスターを作成します。</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>このコマンドにより、以下のリソースが作成されます：</p>
<ul>
<li><p>指定したバージョンのEKSクラスター。</p></li>
<li><p>3台のm6i.2xlarge EC2インスタンスを持つ管理ノードグループ。</p></li>
<li><p><a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC IDプロバイダーと</a>、後で<strong>AWSロードバランサーコントローラーを</strong>インストールするときに使用する<code translate="no">aws-load-balancer-controller</code> というServiceAccount。</p></li>
<li><p>名前空間<code translate="no">milvus</code> と、この名前空間内の ServiceAccount<code translate="no">milvus-s3-access-sa</code> 。この名前空間は、後でMilvusのオブジェクトストレージとしてS3を設定する際に使用します。</p>
<p>注意: ここでは簡単のため、<code translate="no">milvus-s3-access-sa</code> に S3 のフルアクセス権限を付与しています。本番環境では、最小特権の原則に従い、Milvusに使用する特定のS3バケットのみにアクセス権を付与することをお勧めします。</p></li>
<li><p><code translate="no">vpc-cni</code>,<code translate="no">coredns</code>,<code translate="no">kube-proxy</code> はEKSに必要なコアアドオンです。<code translate="no">aws-ebs-csi-driver</code> はEKSクラスタがAmazon EBSボリュームのライフサイクルを管理するためのAWS EBS CSIドライバです。</p></li>
</ul>
<p>あとは、クラスタの作成が完了するのを待つだけです。</p>
<p>クラスタの作成が完了するまで待ちます。クラスタ作成プロセス中に、<code translate="no">kubeconfig</code> ファイルが自動的に作成または更新されます。以下のコマンドを実行して手動で更新することもできます。<code translate="no">region-code</code> 」をクラスタが作成されるAWSリージョンに、「<code translate="no">cluster-name</code> 」をクラスタ名に置き換えてください。</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>クラスタが作成されたら、以下のコマンドを実行してノードを表示できます：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>ストレージタイプとしてGP3を設定した<code translate="no">ebs-sc</code> StorageClassを作成し、デフォルトのStorageClassとして設定します。Milvusはメタストレージとしてetcdを使用し、PVCの作成と管理にこのStorageClassが必要です。</li>
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
<p>その後、元の<code translate="no">gp2</code> StorageClassをnon-defaultに設定する：</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>AWS Load Balancer Controllerをインストールする。このコントローラは後でMilvus ServiceとAttu Ingressで使うので、事前にインストールしておこう。</li>
</ol>
<ul>
<li>まず、<code translate="no">eks-charts</code> のレポを追加し、アップデートする。</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>次に、AWS Load Balancer Controllerをインストールします。<code translate="no">cluster-name</code> はクラスタ名に置き換えてください。<code translate="no">aws-load-balancer-controller</code> という名前の ServiceAccount は、前のステップで EKS クラスタを作成したときに既に作成されている。</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>コントローラーが正常にインストールされたか確認する。</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>出力は以下のようになるはずです：</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Milvusクラスタのデプロイ</h3><p>MilvusはOperatorやHelmなど複数のデプロイ方法をサポートしています。Operatorはよりシンプルですが、Helmはより直接的で柔軟です。この例ではHelmを使用してMilvusをデプロイします。</p>
<p>Helmを使ってMilvusをデプロイする場合、<code translate="no">values.yaml</code> ファイルを使って設定をカスタマイズすることができます。<a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yamlを</a>クリックするとすべてのオプションが表示されます。デフォルトでは、Milvusはクラスタ内のminioとpulsarをそれぞれオブジェクトストレージとメッセージストレージとして作成します。これを本番環境に適したものにするため、いくつかの設定変更を行います。</p>
<ol>
<li>まず、Milvus Helmレポを追加し、更新します。</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>以下のコード・スニペットで<code translate="no">milvus_cluster.yaml</code> 。このコードスニペットは、オブジェクトストレージとしてAmazon S3、メッセージキューとしてAmazon MSKを設定するなど、Milvusの設定をカスタマイズします。詳細な説明とコンフィギュレーションガイダンスは後ほど提供します。</li>
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
<p>このコードには6つのセクションがあります。以下の指示に従って、対応する設定を変更してください。</p>
<p><strong>セクション1</strong>：オブジェクトストレージとしてS3を設定する。serviceAccountはMilvusにS3へのアクセスを許可します（この場合、<code translate="no">milvus-s3-access-sa</code> 、EKSクラスタ作成時に作成したものです）。<code translate="no">&lt;region-code&gt;</code> はクラスタが配置されている AWS リージョンに置き換えてください。<code translate="no">&lt;bucket-name&gt;</code> をS3バケットの名前に、<code translate="no">&lt;root-path&gt;</code> をS3バケットのプレフィックスに置き換えてください（このフィールドは空のままでも構いません）。</p>
<p><strong>セクション2</strong>：MSKをメッセージストレージとして構成する。<code translate="no">&lt;broker-list&gt;</code> を、MSKのSASL/SCRAM認証タイプに対応するエンドポイントアドレスに置き換える。<code translate="no">&lt;username&gt;</code> と<code translate="no">&lt;password&gt;</code> を MSK アカウントのユーザー名とパスワードに置き換える。<code translate="no">&lt;broker-list&gt;</code> は、下図のように MSK クライアント情報から取得できる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>図4 MilvusのメッセージストレージとしてMSKを設定する.png</span> </span></p>
<p><em>図4: MSKをMilvusのメッセージストレージとして設定する。</em></p>
<p><strong>セクション3:</strong>Milvusサービスを公開し、クラスタ外部からのアクセスを可能にする。MilvusエンドポイントはデフォルトでClusterIPタイプのサービスを使用しており、EKSクラスタ内でのみアクセス可能です。必要に応じて、LoadBalancerタイプに変更してEKSクラスタ外部からのアクセスを許可することができます。ロードバランサータイプのサービスは、ロードバランサとしてAmazon NLBを使用します。セキュリティのベストプラクティスに従い、<code translate="no">aws-load-balancer-scheme</code> はデフォルトで内部モードとして設定されており、Milvusへのイントラネットアクセスのみが許可されます。<a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">NLBの設定手順を見るには</a>クリックしてください。</p>
<p><strong>セクション4:</strong>オープンソースのmilvus管理ツールである<a href="https://github.com/zilliztech/attu">Attuを</a>インストールし、設定します。直感的なGUIでmilvusと簡単に対話することができます。Attuを有効にし、AWS ALBを使用してイングレスを構成し、Attuがインターネット経由でアクセスできるように<code translate="no">internet-facing</code> タイプに設定します。ALB設定のガイドは<a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">こちらのドキュメントを</a>クリックしてください。</p>
<p><strong>セクション5:</strong>Milvus Core ComponentsのHAデプロイを有効にする。Milvusには複数の独立したコンポーネントが含まれています。例えば、コーディネータサービスは制御層として機能し、ルート、クエリ、データ、インデックスの各コンポーネントの調整を行います。アクセス層のProxyはデータベースアクセスのエンドポイントとして機能します。これらのコンポーネントのデフォルトは1つのポッド・レプリカのみです。Milvusの可用性を向上させるためには、これらのサービスコンポーネントの複数のレプリカをデプロイすることが特に必要です。</p>
<p><strong>注意:</strong>Root、Query、Data、およびIndexコーディネータコンポーネントのマルチレプリカデプロイメントには、<code translate="no">activeStandby</code> オプションを有効にする必要があります。</p>
<p><strong>セクション6:</strong>Milvusコンポーネントのリソース割り当てを調整し、ワークロードの要件を満たす。Milvusのウェブサイトでは、データ量、ベクトルサイズ、インデックスタイプなどに基づいて構成案を生成する<a href="https://milvus.io/tools/sizing/">サイジングツールも</a>提供しています。また、ワンクリックでHelm設定ファイルを生成することもできます。以下の構成は、100万個の1024次元ベクトルとHNSWインデックスタイプに対するツールによる提案です。</p>
<ol>
<li>Helmを使用してMilvus（名前空間<code translate="no">milvus</code> に配置）を作成します。注:<code translate="no">&lt;demo&gt;</code> はカスタム名で置き換えることができます。</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>以下のコマンドを実行し、デプロイ状況を確認します。</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>以下の出力は、MilvusコンポーネントがすべてAVAILABLEであり、コーディネーションコンポーネントで複数のレプリカが有効になっていることを示しています。</p>
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
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Milvusへのアクセスと管理</h3><p>ここまでで、Milvusベクトルデータベースのデプロイは成功しました。次に、エンドポイントを通してMilvusにアクセスする。MilvusはKubernetesサービス経由でエンドポイントを公開している。AttuはKubernetes Ingress経由でエンドポイントを公開する。</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Milvusエンドポイントへのアクセス</strong></h4><p>以下のコマンドを実行して、サービスのエンドポイントを取得します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>いくつかのサービスを見ることができる。Milvusは2つのポート、ポート<code translate="no">19530</code> とポート<code translate="no">9091</code> をサポートしています：</p>
<ul>
<li>ポート<code translate="no">19530</code> は gRPC および RESTful API 用です。異なるMilvus SDKやHTTPクライアントでMilvusサーバに接続する場合のデフォルトポートです。</li>
<li>ポート<code translate="no">9091</code> はKubernetes内のメトリクス収集、pprofプロファイリング、ヘルスプローブ用の管理ポートです。</li>
</ul>
<p><code translate="no">demo-milvus</code> サービスはデータベースアクセスエンドポイントを提供し、クライアントからの接続を確立するために使用される。サービスのロードバランサーとしてNLBを使用します。サービスのエンドポイントは、<code translate="no">EXTERNAL-IP</code> 列から取得できます。</p>
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
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Attuを使用したMilvusの管理</strong></h4><p>前述の通り、Milvusを管理するためにAttuをインストールしました。以下のコマンドを実行してエンドポイントを取得します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">demo-milvus-attu</code> というIngressが表示されます。<code translate="no">ADDRESS</code> の列がアクセスURLです。</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Ingressのアドレスをブラウザで開くと、以下のページが表示されます。<strong>Connect</strong>をクリックしてログインします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>図 5 Attu アカウントへのログイン.png</span> </span></p>
<p><em>図 5: Attu アカウントへのログイン</em></p>
<p>ログイン後、Attu を通して Milvus データベースを管理することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>図 6 Attu インターフェース.png</span> </span></p>
<p>図 6: Attu インターフェース</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Milvusベクトルデータベースのテスト<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの<a href="https://milvus.io/docs/example_code.md">サンプルコードを使って</a>Milvusデータベースが正しく動作しているかテストします。まず、<code translate="no">hello_milvus.py</code> サンプルコードを以下のコマンドでダウンロードする：</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>サンプルコードのホストをMilvusサービスのエンドポイントに変更する。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>コードを実行してください：</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>システムが以下の結果を返した場合、Milvusが正常に動作していることを示す。</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>この記事では、最も人気のあるオープンソースのベクトルデータベースの1つである<a href="https://milvus.io/intro">Milvusを</a>紹介し、より高い弾力性と信頼性を実現するためにAmazon EKS、S3、MSK、ELBなどのマネージドサービスを使用してAWS上でMilvusをデプロイするためのガイドを提供します。</p>
<p>様々なGenAIシステム、特にRAG（Retrieval Augmented Generation）のコアコンポーネントとして、MilvusはAmazon Sagemaker、PyTorch、HuggingFace、LlamaIndex、LangChainを含む様々な主流のGenAIモデルやフレームワークをサポートし、統合しています。今すぐMilvusでGenAIイノベーションの旅を始めましょう！</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Amazon EKSユーザーガイド</a></li>
<li><a href="https://milvus.io/">Milvus公式ウェブサイト</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHubリポジトリ</a></li>
<li><a href="https://eksctl.io/">eksctl 公式ウェブサイト</a></li>
</ul>
