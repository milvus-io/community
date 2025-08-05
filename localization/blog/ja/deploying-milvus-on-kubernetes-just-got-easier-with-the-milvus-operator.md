---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: KubernetesへのMilvusのデプロイがMilvus Operatorで簡単になりました。
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: Milvus OperatorはKubernetesネイティブの管理ツールで、Milvusベクターデータベースのデプロイのライフサイクル全体を自動化します。
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
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
<p>Milvusクラスタのセットアップは、爆弾の信管を外すような感覚ではないはずだ。何十ものYAMLファイル、複雑な依存関係管理、夜中の2時に何かが壊れて47の設定ファイルのどれが原因なのかわからなくなったときの沈んだ気分などだ。</p>
<p>Milvusをデプロイする従来のアプローチでは、メタデータ・ストレージのetcd、メッセージ・キューイングのPulsar、オブジェクト・ストレージのMinIO、そしてMilvusの各種コンポーネントなど、複数のサービスをオーケストレーションする必要がある。各サービスには、慎重な設定、適切な起動順序、継続的なメンテナンスが必要です。これを複数の環境やクラスタに拡張すると、運用の複雑さに圧倒されてしまいます。</p>
<p>ここで<a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operatorが</strong></a>ゲームを根本的に変えます。インフラストラクチャを手動で管理する代わりに、お客様は何をしたいかを記述し、Operatorはどのようにしたいかを処理します。</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Milvus Operatorとは？<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operatorは</strong></a>、Kubernetesネイティブの管理ツールであり、Milvusベクターデータベースのデプロイの完全なライフサイクルを自動化します。Kubernetes Operatorパターンに基づいて構築されており、Milvusの本番運用に関する長年の運用知識をカプセル化し、クラスタと共に動作するソフトウェアに体系化しています。</p>
<p>眠らず、タイプミスをせず、設定の細部まで完璧に記憶しているMilvusのエキスパート管理者がいると考えてください。Operatorはクラスタの健全性を継続的に監視し、スケーリングの決定を自動的に処理し、ダウンタイムなしでアップグレードを管理し、どんな人間のオペレータよりも早く障害から回復します。</p>
<p>その中核として、Operatorは4つの重要な機能を提供します。</p>
<ul>
<li><p><strong>自動デプロイメント</strong>：マニフェスト1つで、完全に機能するmilvusクラスタをセットアップします。</p></li>
<li><p><strong>ライフサイクル管理</strong>：定義された安全な順序で、アップグレード、水平スケーリング、リソースの撤収を自動化します。</p></li>
<li><p><strong>ビルトイン監視とヘルスチェック</strong>：Milvusコンポーネントと、etcd、Pulsar、MinIOを含む関連依存関係の状態を継続的に監視します。</p></li>
<li><p><strong>デフォルトの運用ベストプラクティス</strong>：プラットフォームの深い知識を必要とせずに信頼性を確保するKubernetesネイティブのパターンを適用します。</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Kubernetes Operatorパターンの理解</h3><p>Milvus Operatorの利点を探る前に、まずその基盤である<strong>Kubernetes Operatorパターンを</strong>理解しましょう。</p>
<p>Kubernetes Operatorパターンは、基本的なKubernetes機能以上を必要とする複雑なアプリケーションの管理を支援します。Operatorには3つの主要な部分があります：</p>
<ul>
<li><p><strong>カスタムリソース定義では</strong>、Kubernetesスタイルの設定ファイルを使用してアプリケーションを記述します。</p></li>
<li><p><strong>Controllerは</strong>これらの設定を監視し、クラスタに必要な変更を行います。</p></li>
<li><p><strong>状態管理は</strong>、クラスタが要求したものと一致していることを確認し、相違があれば修正します。</p></li>
</ul>
<p>つまり、Milvusデプロイメントを使い慣れた方法で記述することができ、Podの作成、ネットワークの設定、ライフサイクルの管理などの詳細な作業はすべてOperatorが行います。</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Milvus Operatorの仕組み<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operatorは、データベース管理をはるかにシンプルにする、わかりやすいプロセスに従います。Milvus Operatorの中核となる運用モデルを分解してみましょう：</p>
<ol>
<li><p><strong>カスタムリソース（CR）：</strong>カスタムリソース（CR）: ユーザーはCR（例: kind:<code translate="no">Milvus</code> ）を使用してMilvusデプロイメントを定義します。このファイルには、クラスタモード、イメージバージョン、リソース要件、依存関係などの設定が含まれます。</p></li>
<li><p><strong>コントローラロジック：</strong>Operatorのコントローラは、新規または更新されたCRを監視します。変更を検出すると、必要なコンポーネント（Milvusサービスおよびetcd、Pulsar、MinIOなどの依存関係）の作成をオーケストレーションします。</p></li>
<li><p><strong>自動化されたライフサイクル管理：</strong>バージョンの更新やストレージの変更などの変更が発生すると、Operatorはローリング・アップデートを実行し、クラスタを中断することなくコンポーネントを再構成します。</p></li>
<li><p><strong>自己修復：</strong>コントローラは各コンポーネントの健全性を継続的にチェックします。何かがクラッシュすると、自動的にポッドを置き換えたり、サービスの状態をリストアしたりして、稼働時間を確保します。</p></li>
</ol>
<p>このアプローチは、初期設定だけでなく継続的な管理を提供するため、従来のYAMLやHelmデプロイメントよりもはるかに強力です。</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">なぜHelmやYAMLではなくMilvus Operatorを使うのか？<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusをデプロイする際には、手動のYAMLファイル、Helmチャート、Milvus Operatorのいずれかを選択することができます。それぞれに適した方法がありますが、Operatorは継続的な運用に大きなメリットをもたらします。</p>
<h3 id="Operation-Automation" class="common-anchor-header">運用の自動化</h3><p>従来の方法では、ルーチン作業には手作業が必要でした。スケーリングは、複数の設定ファイルを更新し、変更を調整することを意味します。アップグレードには、サービスの中断を避けるための慎重な計画が必要です。Operator は、これらのタスクを自動的に処理します。スケーリングがいつ必要かを検出し、変更を安全に実行できます。アップグレードは、Operatorが適切な順序と必要に応じてロールバック機能を使用して実行する、単純な構成更新になります。</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">より優れた状態の可視性</h3><p>YAMLファイルはKubernetesに必要なことを伝えますが、システムの現在の状態を表示することはできません。Helmは構成管理を支援しますが、アプリケーションの実行時の状態を監視しません。Operatorはクラスタ全体を継続的に監視します。リソースの問題やレスポンスの遅さなどの問題を検出し、深刻な問題になる前に対処することができます。このプロアクティブな監視により、信頼性が大幅に向上します。</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">より容易な長期管理</h3><p>YAMLファイルで複数の環境を管理することは、多くの設定ファイルを同期しておくことを意味します。Helmテンプレートを使用しても、複雑な操作にはかなりの手動調整が必要です。</p>
<p>Operatorはmilvusの管理知識をコードにカプセル化します。つまり、チームはすべてのコンポーネントのエキスパートになることなく、効果的にクラスタを管理することができます。運用インターフェースは、インフラストラクチャがスケールしても一貫したままです。</p>
<p>Operatorを使用することは、Milvus管理により自動化されたアプローチを選択することを意味します。ベクターデータベースがアプリケーションにとってより重要になるにつれて、手作業を減らすと同時に、組み込まれた専門知識によって信頼性を向上させることができます。</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">Milvusオペレーションのアーキテクチャ</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図は、Kubernetesクラスタ内でのMilvus Operatorのデプロイ構造を明確に示しています：</p>
<ul>
<li><p>左（青い領域）：コントローラやMilvus-CRDを含むOperatorのコアコンポーネント。</p></li>
<li><p>右（緑のエリア）：Proxy、Coordinator、Nodeなど、Milvusクラスタのさまざまなコンポーネント。</p></li>
<li><p>中央（矢印 - "作成/管理"）：オペレータがどのようにMilvusクラスタを管理するかを示す操作の流れ。</p></li>
<li><p>下部 (オレンジ色の領域)：etcdやMinIO/S3/MQなどの依存サービス。</p></li>
</ul>
<p>明確な色のブロックと方向矢印を持つこの視覚的な構造は、異なるコンポーネント間の相互作用とデータの流れを効果的に明確にします。</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Milvus Operatorを使い始める<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルでは、Operatorを使用してMilvusをデプロイする方法を説明します。このガイドではこれらのバージョンを使用します。</p>
<ul>
<li><p><strong>オペレーティングシステム</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) 前提条件</h3><p>Kubernetesクラスタには、少なくとも1つのStorageClassが設定されている必要があります。利用可能なものを確認できます：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>この例では、2つのオプションがあります：</p>
<ul>
<li><p><code translate="no">local</code> (デフォルト) - ローカルディスクを使用</p></li>
<li><p><code translate="no">nfs-sc</code>- (デフォルト) - ローカルディスクを使用します。</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Milvus Operatorのインストール</h3><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a>または<a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectlで</a>Operatorをインストールできます。ここではkubectlを使用します。</p>
<p>Operatorのデプロイメントマニフェストをダウンロードします：</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>イメージアドレスを置き換えます（オプション）：</p>
<p><strong>オプション：別のイメージレジストリを使用する</strong>DockerHubにアクセスできない場合、または独自のレジストリを好む場合：</p>
<p><em>注: ここで提供するイメージリポジトリアドレスは、テスト用です。必要に応じて実際のリポジトリアドレスに置き換えてください。</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Operatorをインストールします：</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>インストール後、以下のような出力が表示されるはずです：</p>
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
<p>Milvus Operator のデプロイとポッドリソースを確認します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Milvusクラスタのデプロイ</h3><p>Milvus Operator podが起動したら、以下の手順でMilvusクラスタをデプロイします。</p>
<p>Milvusクラスタ配備マニフェストをダウンロードします：</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>デフォルトの設定は最小です：</p>
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
<p><strong>実際のデプロイでは、カスタマイズする必要があります：</strong></p>
<ul>
<li><p>カスタムクラスタ名<code translate="no">milvus-release-v25</code></p></li>
<li><p>カスタムイメージ: (別のオンラインイメージまたはローカルのオフラインイメージを使用する場合)<code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>カスタム・ストレージクラス名：複数のストレージクラスがある環境では、MinIOやetcdのような永続コンポーネントのStorageClassを指定する必要があるかもしれません。この例では、<code translate="no">nfs-sc</code> 。</p></li>
<li><p>カスタムリソース：MilvusコンポーネントのCPUとメモリの制限を設定します。デフォルトでは制限が設定されていないため、Kubernetesノードに負荷がかかる可能性があります。</p></li>
<li><p>関連リソースの自動削除：デフォルトでは、Milvusクラスタが削除されても、関連リソースは保持されます。</p></li>
</ul>
<p>その他のパラメータ設定については、以下を参照してください：</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Milvusカスタム・リソース定義</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">パルサーの値</a></p></li>
</ul>
<p>変更後のマニフェストは次のとおりです：</p>
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
<p>Milvusクラスタをデプロイします：</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Milvusクラスタのステータスの確認</h4><p>Milvus Operatorは、Milvusコンポーネント（プロキシ、コーディネータ、ノードなど）をデプロイする前に、まずetcd、Zookeeper、Pulsar、MinIOなど、Milvusのミドルウェア依存関係を設定します。</p>
<p>デプロイを参照してください：</p>
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
<p>特別な注意</p>
<p>Milvus Operatorは、<code translate="no">standalone</code> 、<code translate="no">querynode-1</code> 、レプリカが0のデプロイメントを作成します。</p>
<p>これは意図的なものです。Milvus Operatorリポジトリに問題を提出したところ、公式の回答は次のとおりです：</p>
<ul>
<li><p>a.a. 配置は期待どおりに動作します。a.配置は期待どおりに動作します。スタンドアロンバージョンは、サービスを中断することなくクラスタからスタンドアロン配置にシームレスに移行できるように保持されます。</p></li>
<li><p>b.<code translate="no">querynode-0</code> と<code translate="no">querynode-1</code> の両方があると、ローリングアップグレード時に便利です。最終的には、どちらか一方だけがアクティブになります。</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">すべてのPodが正しく動作していることを確認する</h4><p>Milvusクラスタの準備ができたら、すべてのPodが期待通りに動作していることを確認します：</p>
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
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">StorageClassの検証</h4><p>カスタムStorageClass (<code translate="no">nfs-sc</code>) と指定したストレージ容量が正しく適用されていることを確認します：</p>
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
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Milvusリソース制限の検証</h4><p>たとえば、<code translate="no">mixcoord</code> コンポーネントのリソース制限が正しく適用されていることを確認するには、以下を実行します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">カスタムイメージの検証</h4><p>正しいカスタムイメージが使用されていることを確認します：</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) 外部からのクラスタへのアクセス</h3><p>よくある質問ですが、Kubernetesクラスタの外部からMilvusサービスにアクセスするにはどうすればよいでしょうか？</p>
<p>デフォルトでは、OperatorによってデプロイされたMilvusサービスは<code translate="no">ClusterIP</code> 、クラスタ内でのみアクセス可能です。外部に公開するには、外部アクセスメソッドを定義する必要があります。このガイドでは、NodePortを使用する最も簡単な方法を選択します。</p>
<p>外部アクセス用のサービス・マニフェストを作成して編集します：</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>以下の内容を含めます：</p>
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
<li>外部サービス・マニフェストを適用します：</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>外部サービスのステータスを確認する：</li>
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
<li>Milvus WebUIへのアクセス</li>
</ol>
<p>Milvusは、直感的なインターフェイスで観測性を高める組み込みのGUI、Milvus WebUIを提供します。Milvusコンポーネントとその依存関係のメトリクスを監視したり、データベースやコレクションの詳細情報を確認したり、コンフィギュレーションの詳細を確認したりすることができます。詳細については、<a href="https://milvus.io/docs/milvus-webui.md">Milvus WebUIの公式ドキュメントを</a>参照してください。</p>
<p>デプロイ後、ブラウザで以下のURLを開きます（<code translate="no">&lt;any_k8s_node_IP&gt;</code> は任意のKubernetesノードのIPアドレスに置き換えてください）：</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>これでWebUIインターフェースが起動します。</p>
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
    </button></h2><p><strong>Milvus Operatorは</strong>単なるデプロイツールではなく、ベクターデータベースインフラの卓越した運用のための戦略的投資です。ルーチンタスクを自動化し、ベストプラクティスをKubernetes環境に組み込むことで、チームは最も重要なこと、つまりAI駆動型アプリケーションの構築と改善に集中することができます。</p>
<p>Operatorベースの管理を採用するには、ワークフローやチームプロセスの変更など、事前の取り組みが必要です。しかし、大規模な運用を行う組織、またはそれを計画している組織にとって、長期的な利益は大きい。信頼性の向上、運用オーバーヘッドの削減、より迅速で一貫性のある展開サイクルなどだ。</p>
<p>AIが現代のビジネスオペレーションの中核となるにつれ、堅牢でスケーラブルなベクターデータベースインフラストラクチャの必要性は高まるばかりです。Milvus Operatorは、ワークロードに合わせて拡張し、特定のニーズに適応する、成熟した自動化優先のアプローチを提供することで、その進化をサポートします。</p>
<p>チームが運用の複雑さに直面している場合、成長を予測している場合、または単に手作業によるインフラ管理を削減したい場合、Milvus Operatorを早期に採用することで、将来の技術的負債を回避し、システム全体の回復力を向上させることができます。</p>
<p>インフラの未来は、インテリジェントで、自動化され、開発者に優しいものです。<strong>Milvus Operatorは、データベースレイヤーにその未来をもたらします。</strong></p>
<hr>
