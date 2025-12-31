---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: Milvus RBACの説明：役割ベースのアクセス制御でベクターデータベースを保護する
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  なぜRBACが重要なのか、MilvusのRBACがどのように機能するのか、アクセス制御をどのように設定するのか、最小権限アクセス、明確な役割分担、安全な本番運用をどのように可能にするのかを学びます。
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>データベースシステムを構築する際、エンジニアはインデックスタイプ、リコール、レイテンシ、スループット、スケーリングなどのパフォーマンスにほとんどの時間を費やします。しかし、システムが一人の開発者のラップトップの域を超えると、もう一つの問題が重要になってきます。つまり、アクセス制御である。</p>
<p>業界全体において、運用上のインシデントの多くは単純なパーミッションのミスに起因している。スクリプトが間違った環境に対して実行される。サービスアカウントが意図した以上のアクセス権を持っている。共有された管理者クレデンシャルがCIに入ってしまう。これらの問題は通常、非常に現実的な問題として表面化する：</p>
<ul>
<li><p>開発者が本番環境のコレクションを削除することは許されるのか？</p></li>
<li><p>なぜテストアカウントが本番環境のベクターデータを読めるのか？</p></li>
<li><p>なぜ複数のサービスが同じadminロールでログインしているのか？</p></li>
<li><p>分析ジョブは書き込み権限ゼロで読み取り専用アクセスできるのか？</p></li>
</ul>
<p><a href="https://milvus.io/">Milvusは</a> <a href="https://milvus.io/docs/rbac.md">ロールベースのアクセスコントロール(RBAC)</a>でこれらの課題に対処します。すべてのユーザにスーパー アドミニストレータの権限を与えたり、アプリケーション コードで制限を強制したりする代わりに、RBAC ではデータベース レイヤで正確な権限を定義できます。各ユーザーやサービスは、必要な機能だけを得ることができます。</p>
<p>この投稿では、MilvusにおけるRBACの仕組み、設定方法、本番環境で安全に適用する方法について説明します。</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Milvusを使用する際にアクセス制御が重要な理由<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>チームが小規模で、AIアプリケーションが限られたユーザー数しか対応していない場合、インフラストラクチャは通常シンプルになります。少数のエンジニアがシステムを管理し、Milvusは開発またはテストにのみ使用され、運用ワークフローは単純です。このような初期段階では、アクセス・コントロールに緊急性を感じることはほとんどない。なぜなら、リスク面が小さく、どんなミスも簡単に取り返せるからだ。</p>
<p>Milvusが本番稼動に移行し、ユーザー数、サービス数、オペレータ数が増加するにつれ、利用モデルは急速に変化する。よくあるシナリオは以下の通りである：</p>
<ul>
<li><p>複数の業務システムが同じMilvusインスタンスを共有する。</p></li>
<li><p>複数のチームが同じベクターコレクションにアクセス</p></li>
<li><p>テストデータ、ステージングデータ、本番データが単一のクラスタに共存する場合</p></li>
<li><p>読み取り専用クエリから書き込み、運用管理まで、異なるレベルのアクセスを必要とする役割の違い</p></li>
</ul>
<p>アクセス境界が明確に定義されていないと、このようなセットアップでは予測可能なリスクが生じます：</p>
<ul>
<li><p>テストワークフローが誤って本番環境のコレクションを削除する可能性がある</p></li>
<li><p>開発者が本番サービスで使用されるインデックスを意図せずに変更する可能性がある。</p></li>
<li><p><code translate="no">root</code> アカウントの広範な使用により、アクションの追跡や監査が不可能になる。</p></li>
<li><p>侵害されたアプリケーションがすべてのベクターデータに無制限にアクセスする可能性がある</p></li>
</ul>
<p>利用が拡大するにつれ、非公式な慣習や共有管理者アカウントに依存することはもはや持続不可能になる。一貫性のある、強制可能なアクセスモデルが不可欠となり、これこそがMilvus RBACが提供するものです。</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">MilvusのRBACとは？<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC(Role-Based Access Control)</a>とは、個々のユーザではなく<strong>ロールに基づいて</strong>アクセスを制御する権限モデルです。MilvusのRBACでは、ユーザやサービスがどのリソースに対してどのような操作を行うことができるかを正確に定義することができます。これは、システムが一人の開発者から完全な本番環境へと成長するにつれて、セキュリティを管理するための構造化されたスケーラブルな方法を提供します。</p>
<p>Milvus RBACは以下のコアコンポーネントを中心に構築されています：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>ユーザー ロール 特権</span> </span></p>
<ul>
<li><p><strong>リソース</strong>：アクセスされるエンティティ。Milvusでは、リソースには<strong>インスタンス</strong>、<strong>データベース</strong>、<strong>コレクションが</strong>含まれます。</p></li>
<li><p><strong>特権</strong>：例えば、コレクションの作成、データの挿入、エンティティの削除など。</p></li>
<li><p><strong>特権グループ</strong>：例えば、コレクションの作成、データの挿入、エンティティの削除など。</p></li>
<li><p><strong>役割</strong>：権限とそれが適用されるリソースの組み合わせ。ロールにより、<em>どのような</em>操作を<em>どこで</em>実行できるかが決定される。</p></li>
<li><p><strong>ユーザ(User</strong>): MilvusにおけるID。各ユーザは一意のIDを持ち、1つ以上のロールが割り当てられる。</p></li>
</ul>
<p>これらの構成要素は明確な階層を形成しています：</p>
<ol>
<li><p><strong>ユーザにはロールが割り当てられます。</strong></p></li>
<li><p><strong>ロールは権限を定義する。</strong></p></li>
<li><p><strong>権限は特定のリソースに適用される</strong></p></li>
</ol>
<p>Milvusの重要な設計原則は、<strong>権限をユーザーに直接割り当てない</strong>ことです。すべてのアクセスはロールを経由します。この間接性により、管理が簡素化され、設定ミスが減り、権限の変更が予測可能になります。</p>
<p>このモデルは、実際のデプロイメントにおいてきれいにスケールします。複数のユーザがロールを共有する場合、ロールの権限を更新すると、各ユーザを個別に変更することなく、すべてのユーザの権限が即座に更新されます。これは、最新のインフラストラクチャがアクセスを管理する方法に沿った単一制御ポイントです。</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">MilvusにおけるRBACの仕組み<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>クライアントがMilvusにリクエストを送信すると、システムは一連の権限付与ステップを通じてそのリクエストを評価します。各ステップは、操作の続行が許可される前に通過する必要があります：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>MilvusにおけるRBACの仕組み</span> </span></p>
<ol>
<li><p><strong>リクエストの認証：</strong>Milvusはまずユーザーの身元を確認します。認証に失敗した場合、リクエストは認証エラーとして拒否されます。</p></li>
<li><p><strong>役割の割り当てを確認します：</strong>認証後、Milvusはユーザに少なくとも1つのロールが割り当てられているかどうかをチェックします。ロールが見つからない場合、リクエストは permission denied エラーで拒否されます。</p></li>
<li><p><strong>必要な権限を確認します：</strong>Milvusは次に、ユーザのロールがターゲットリソース上で必要な権限を付与しているかどうかを評価します。権限のチェックに失敗した場合、リクエストはpermission deniedエラーで拒否されます。</p></li>
<li><p><strong>操作を実行します：</strong>すべてのチェックに合格した場合、Milvusは要求された操作を実行し、結果を返します。</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">MilvusにおけるRBACによるアクセス制御の設定方法<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1.前提条件</h3><p>RBACルールの評価と適用を行う前に、Milvusへのすべてのリクエストを特定のユーザIDに関連付けることができるように、ユーザ認証を有効にする必要があります。</p>
<p>ここでは2つの標準的なデプロイ方法を紹介します。</p>
<ul>
<li><strong>Docker Composeによるデプロイ</strong></li>
</ul>
<p>Docker Composeを使用してMilvusをデプロイする場合、<code translate="no">milvus.yaml</code> 設定ファイルを編集し、<code translate="no">common.security.authorizationEnabled</code> を<code translate="no">true</code> に設定することで認証を有効にします：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Helm Chartsを用いたデプロイ</strong></li>
</ul>
<p>Helm Chartsを使用してMilvusをデプロイする場合、<code translate="no">values.yaml</code> ファイルを編集し、<code translate="no">extraConfigFiles.user.yaml</code> の下に以下の設定を追加します：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2.初期化</h3><p>デフォルトでは、Milvusはシステム起動時に組み込みの<code translate="no">root</code> ユーザを作成します。このユーザのデフォルトパスワードは<code translate="no">Milvus</code> です。</p>
<p>セキュリティの初期段階として、<code translate="no">root</code> ユーザを使用して Milvus に接続し、デフォルトパスワードを直ちに変更してください。不正アクセスを防ぐため、複雑なパスワードを使用することを強く推奨する。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3.コアオペレーション</h3><p><strong>ユーザの作成</strong></p>
<p>日常的に使用する場合は、<code translate="no">root</code> アカウントを使用するのではなく、専用のユーザーを作成することを推奨します。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロールの作成</strong></p>
<p>Milvusは、完全な管理者権限を持つ組み込みの<code translate="no">admin</code> ロールを提供します。しかし、ほとんどの実運用シナリオでは、よりきめ細かいアクセス制御を実現するためにカスタムロールを作成することを推奨します。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>特権グループの作成</strong></p>
<p>特権グループは複数の特権の集まりです。権限管理を簡素化するために、関連する権限をグループ化してまとめて付与することができます。</p>
<p>milvusには以下の特権グループが組み込まれています：</p>
<ul>
<li><p><code translate="no">COLL_RO</code>,<code translate="no">COLL_RW</code> 、<code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>,<code translate="no">DB_RW</code> 、<code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code> <code translate="no">Cluster_RW</code> 、<code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>これらの組み込み権限グループを使用することで、権限設計の複雑さを大幅に軽減し、ロール間の一貫性を向上させることができます。</p>
<p>組み込み権限グループを直接使用するか、必要に応じてカスタム権限グループを作成することができます。</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロールへの特権または特権グループの付与</strong></p>
<p>ロールの作成後、そのロールに特権または特権グループを付与することができます。これらの権限の対象リソースは、インスタンス、データベース、または個々のコレクションなど、さまざまなレベルで指定できます。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ユーザへのロールの付与</strong></p>
<p>ユーザにロールが割り当てられると、そのユーザはリソースにアクセスし、それらのロールによって定義された操作を実行できます。必要なアクセス・スコープに応じて、1 人のユーザに 1 つまたは複数のロールを付与できます。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4.アクセスの検査と取り消し</h3><p><strong>ユーザに割り当てられたロールの検査</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロールに割り当てられた特権の検査</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ロールから権限を取り消す</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ユーザからロールを取り消す</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ユーザとロールの削除</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">例milvus搭載RAGシステムのアクセス制御設計<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus上に構築されたRAG（Retrieval-Augmented Generation）システムを考える。</p>
<p>このシステムでは、異なるコンポーネントとユーザが明確に責任を分担し、それぞれが異なるレベルのアクセスを必要とします。</p>
<table>
<thead>
<tr><th>アクター</th><th>責任</th><th>必要なアクセス</th></tr>
</thead>
<tbody>
<tr><td>プラットフォーム管理者</td><td>システムの運用と設定</td><td>インスタンスレベルの管理</td></tr>
<tr><td>ベクター取り込みサービス</td><td>ベクターデータの取り込みと更新</td><td>読み書きアクセス</td></tr>
<tr><td>検索サービス</td><td>ベクター検索</td><td>読み取り専用アクセス</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">クイックヒントプロダクションでアクセス制御を安全に運用する方法<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>長期間稼動するプロダクション・システムにおいてアクセス・コントロールが効果的かつ管理しやすい状態を維持するためには、以下の実用的なガイドラインに従ってください。</p>
<p><strong>1.デフォルトの</strong> <code translate="no">root</code> <strong>パスワードを</strong><strong>変更</strong> <strong>し、</strong> <code translate="no">root</code> <strong>アカウントの</strong> <strong>使用を制限する</strong>。</p>
<p>初期化直後にデフォルトの<code translate="no">root</code> パスワードを更新し、その使用を管理タスクのみに制限する。root アカウントを日常的な操作に使用したり、共有したりすることは避ける。代わりに、日常的なアクセス専用のユーザーとロールを作成して、リスクを軽減し、説明責任を向上させる。</p>
<p><strong>2.環境間でMilvusインスタンスを物理的に分離する。</strong></p>
<p>開発用、ステージング用、本番用のMilvusインスタンスを別々に配置する。物理的な分離は、論理的なアクセス制御のみよりも強力な安全境界を提供し、環境をまたいだミスのリスクを大幅に低減します。</p>
<p><strong>3.最小特権の原則に従う</strong></p>
<p>各役割に必要な権限のみを付与する：</p>
<ul>
<li><p><strong>開発環境:</strong>イテレーションとテストをサポートするために、パーミッションをより寛容にすることができる。</p></li>
<li><p><strong>本番環境:</strong>権限は必要なものに厳しく制限する。</p></li>
<li><p><strong>定期的な監査:</strong>既存のパーミッションを定期的に見直し、必要なパーミッションであることを確認する。</p></li>
</ul>
<p><strong>4.不要になったパーミッションは、積極的に取り消す。</strong></p>
<p>アクセス・コントロールは一度だけの設定ではなく、継続的なメンテナンスが必要である。ユーザー、サービス、または責任が変更された場合は、速やかに役割と権限を失効させる。これにより、未使用の権限が長期にわたって蓄積され、隠れたセキュリティリスクとなることを防ぐことができます。</p>
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
    </button></h2><p>Milvusにおけるアクセスコントロールの設定は、本質的に複雑なものではありませんが、本番環境においてシステムを安全かつ確実に運用するためには不可欠なものです。よく設計されたRBACモデルにより、以下のことが可能になります：</p>
<ul>
<li><p>偶発的または破壊的な操作を防止することによる<strong>リスクの低減</strong></p></li>
<li><p>ベクター・データへの最小権限アクセスを強制することによる<strong>セキュリティの向上</strong></p></li>
<li><p>責任の明確な分離による<strong>運用の標準化</strong></p></li>
<li><p>マルチテナントや大規模なデプロイメントの基礎を築き、<strong>安心して拡張できる</strong>。</p></li>
</ul>
<p>アクセス・コントロールは、オプションの機能でも、1回限りの作業でもありません。Milvusを長期にわたって安全に運用するための基礎となる部分です。</p>
<p>👉 Milvus導入のための<a href="https://milvus.io/docs/rbac.md">RBACによる</a>強固なセキュリティベースラインの構築を始めましょう。</p>
<p>Milvusの最新機能についてのご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
