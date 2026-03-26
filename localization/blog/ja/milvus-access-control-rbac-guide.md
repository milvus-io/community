---
id: milvus-access-control-rbac-guide.md
title: Milvus アクセスコントロールガイド：本番用RBACの設定方法
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Milvus RBACを本番環境で設定するためのステップバイステップのガイド -
  ユーザー、ロール、特権グループ、コレクションレベルのアクセス、および完全なRAGシステムの例。
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>あるQAエンジニアが、ステージング環境だと思ってクリーンアップスクリプトを実行した。ただし、接続文字列は本番環境を指している。数秒後、コアとなるベクターコレクションが消えていました。機能データは失われ、<a href="https://zilliz.com/glossary/similarity-search">類似検索は</a>空の結果を返し、サービスは全体的に低下していました。事後調査の結果、いつもと同じ根本原因が見つかりました。全員が<code translate="no">root</code> 、アクセス境界がなく、テストアカウントが本番データを落とすのを止められなかったのです。</p>
<p>これは一過性のものではない。<a href="https://milvus.io/">Milvus</a>、そして一般的な<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクターデータベースを</a>構築しているチームは、<a href="https://zilliz.com/learn/vector-index">インデックスパフォーマンス</a>、スループット、データスケールに焦点を当て、アクセスコントロールは後回しにする傾向がある。しかし、"後で "というのはたいていインシデントという形でやってくる。Milvusがプロトタイプから本番の<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGパイプライン</a>、レコメンデーションエンジン、<a href="https://zilliz.com/learn/what-is-vector-search">リアルタイムベクター</a>検索のバックボーンに移行するにつれ、誰がMilvusクラスタにアクセスできるのか、そしてその人たちに一体何が許されるのか、という疑問は避けられなくなります。</p>
<p>Milvusにはこの疑問に答えるためのRBACシステムが組み込まれています。本ガイドでは、RBACとは何か、MilvusはどのようにRBACを実装しているのか、本番環境を安全に保つためのアクセス制御モデルの設計方法について、コード例とRAGシステムの完全なウォークスルーを交えて説明します。</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">RBAC（ロールベースアクセスコントロール）とは？<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>RBAC（Role-Based Access Control：ロールベース・アクセス・コントロール</strong>）は、パーミッションが個々のユーザーに直接割り当てられないセキュリティ・モデルです。その代わりに、パーミッションはロールにグループ化され、ユーザーには1つまたは複数のロールが割り当てられます。ユーザーの実効アクセスは、割り当てられたロールのすべてのパーミッションの合計です。RBACは、PostgreSQL、MySQL、MongoDB、そしてほとんどのクラウド・サービスで採用されている、プロダクション・データベース・システムにおける標準的なアクセス制御モデルである。</p>
<p>RBACは基本的なスケーリングの問題を解決します。何十人ものユーザーやサービスがある場合、ユーザーごとのパーミッションの管理は維持できなくなります。RBACを使えば、ロールを一度定義し（例えば「コレクションXの読み取り専用」など）、それを10個のサービスに割り当て、要件が変更されたときに一箇所で更新することができます。</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">MilvusはどのようにRBACを実装しているのか？<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBACは4つのコンセプトに基づいて構築されています：</p>
<table>
<thead>
<tr><th>コンセプト</th><th>コンセプト</th><th>例</th></tr>
</thead>
<tbody>
<tr><td><strong>リソース</strong></td><td>アクセスされるもの</td><td><a href="https://milvus.io/docs/architecture_overview.md">Milvusインスタンス</a>、<a href="https://milvus.io/docs/manage-databases.md">データベース</a>、または特定のコレクション</td></tr>
<tr><td><strong>特権/特権グループ</strong></td><td>実行されるアクション</td><td><code translate="no">Search</code> <code translate="no">Insert</code>, , または のようなグループ (コレクションは読み取り専用)<code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>役割</strong></td><td>リソースにスコープされた特権の名前付きセット</td><td><code translate="no">role_read_only</code>:<code translate="no">default</code> データベースのすべてのコレクションを検索およびクエリできます。</td></tr>
<tr><td><strong>ユーザ</strong></td><td>Milvusアカウント（人間またはサービス）。</td><td><code translate="no">rag_writer</code>インジェストパイプラインで使用されるサービスアカウント</td></tr>
</tbody>
</table>
<p>アクセス権がユーザに直接割り当てられることはありません。ユーザはロールを取得し、ロールは権限を含み、権限はリソースにスコープされる。これは、ほとんどのプロダクションデータベースシステムで使用されている<a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBACモデルと</a>同じです。10人のユーザが同じロールを共有する場合、ロールを一度更新すれば、その変更はすべてのユーザに適用されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>MilvusのRBACモデルは、ユーザがロールに割り当てられ、ロールにリソースに適用される権限と権限グループが含まれることを示しています。</span> </span></p>
<p>Milvusにリクエストが届くと、3つのチェックが行われます：</p>
<ol>
<li><strong>認証</strong>- このユーザは正しい認証情報を持つ有効なユーザか？</li>
<li><strong>役割チェック</strong>- このユーザには少なくとも一つの役割が割り当てられているか?</li>
<li><strong>権限のチェック</strong>- 要求されたリソース上で要求されたアクションを許可するユーザのロールがあるか?</li>
</ol>
<p>いずれかのチェックに失敗した場合、リクエストは拒否されます。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>milvusの認証と認可の流れ：クライアントリクエストは認証、ロールチェック、特権チェックを通過します。</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Milvusで認証を有効にする方法<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>デフォルトでは、Milvusは認証を無効にした状態で動作します。まずは認証を有効にします。</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p><code translate="no">milvus.yaml</code> を編集し、<code translate="no">authorizationEnabled</code> を<code translate="no">true</code> に設定する：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helmチャート</h3><p><code translate="no">values.yaml</code> を編集し、<code translate="no">extraConfigFiles</code> に設定を追加する：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>上に<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operatorを</a>デプロイする場合、同じ設定をMilvus CRの<code translate="no">spec.config</code> 。</p>
<p>認証が有効になり、Milvusが再起動すると、すべての接続で認証情報を提供する必要があります。Milvusはパスワード<code translate="no">Milvus</code> でデフォルトの<code translate="no">root</code> ユーザを作成しますが、すぐに変更してください。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">ユーザ、ロール、権限の設定方法<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>認証を有効にした場合の典型的な設定ワークフローを以下に示します。</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">ステップ1: ユーザの作成</h3><p>サービスやチームメンバーには、<code translate="no">root</code> を使用させないでください。ユーザーまたはサービスごとに専用のアカウントを作成します。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">ステップ 2: ロールの作成</h3><p>Milvusには組み込みの<code translate="no">admin</code> ロールがありますが、実際には実際のアクセスパターンに合わせたカスタムロールが必要です。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">ステップ3: 特権グループの作成</h3><p>特権グループは、複数の特権を1つの名前にまとめ、規模に応じたアクセス管理を容易にします。Milvusは9つの組み込み特権グループを提供しています：</p>
<table>
<thead>
<tr><th>組み込みグループ</th><th>スコープ</th><th>許可内容</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>コレクション</td><td>読み取り専用操作（クエリ、検索など）</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>コレクション</td><td>読み書き操作</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>コレクション</td><td>完全なコレクション管理</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>データベース</td><td>読み取り専用データベース操作</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>データベース</td><td>データベースの読み書き</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>データベース</td><td>完全なデータベース管理</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>クラスタ</td><td>読み取り専用クラスタ操作</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>クラスタ</td><td>読み書き可能なクラスタ操作</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>クラスタ</td><td>完全なクラスタ管理</td></tr>
</tbody>
</table>
<p>組み込みの権限グループが適合しない場合は、カスタム権限グループを作成することもできます：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">ステップ4: ロールに権限を付与する</h3><p>特定のリソースをスコープとして、個々の権限または権限グループをロールに付与します。<code translate="no">collection_name</code> および<code translate="no">db_name</code> パラメータがスコープを制御します。すべてには<code translate="no">*</code> を使用してください。</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">ステップ5：ユーザにロールを割り当てる</h3><p>ユーザは複数のロールを持つことができます。有効な権限は、割り当てられたすべてのロールの合計です。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">アクセスの監査と取り消し<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>どのようなアクセスが存在するかを知ることは、アクセスを許可することと同じくらい重要です。以前のチームメンバー、引退したサービス、あるいは単発のデバッグ・セッションなど、古くなったパーミッションは静かに蓄積され、攻撃対象領域を広げる。</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">現在のパーミッションの確認</h3><p>ユーザーの割り当てられたロールを表示する：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>ロールに付与された権限を表示します：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">ロールから権限を取り消す</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">ユーザからロールの割り当てを解除する</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">ユーザまたはロールの削除</h3><p>ユーザを削除する前にすべてのロールの割り当てを削除し、ロールを削除する前にすべての権限を取り消してください：</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">例プロダクションRAGシステムのRBACを設計する方法<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>抽象的な概念は、具体的な例でより早く理解できる。Milvus上に構築された3つの異なるサービスを持つ<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>システムを考えてみましょう：</p>
<table>
<thead>
<tr><th>サービス</th><th>責任</th><th>必要なアクセス</th></tr>
</thead>
<tbody>
<tr><td><strong>プラットフォーム管理者</strong></td><td>Milvusクラスタの管理 - コレクションの作成、健全性の監視、アップグレードの処理</td><td>クラスタ全体の管理</td></tr>
<tr><td><strong>インジェストサービス</strong></td><td>ドキュメントから<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みを</a>生成し、コレクションに書き込む</td><td>コレクションの読み書き</td></tr>
<tr><td><strong>検索サービス</strong></td><td>エンドユーザからの<a href="https://zilliz.com/learn/what-is-vector-search">ベクトル検索</a>クエリを処理</td><td>コレクションは読み取り専用</td></tr>
</tbody>
</table>
<p>これが<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvusを</a>使った完全なセットアップです：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>各サービスは必要なアクセスを正確に取得します。検索サービスは誤ってデータを削除することはできません。インジェストサービスはクラスタの設定を変更できません。また、検索サービスの認証情報が漏れた場合、攻撃者は<a href="https://zilliz.com/glossary/vector-embeddings">埋め込みベクターを</a>読むことはできますが、書き込んだり、削除したり、管理者に昇格したりすることはできません。</p>
<p>複数のMilvusデプロイメントにまたがるアクセスを管理するチームのために、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（マネージドMilvus）は、ユーザー、ロール、権限を管理するためのウェブコンソールを備えたビルトインRBACを提供する。環境間でセットアップスクリプトを維持するよりも、UIを通じてアクセスを管理したい場合に便利です。</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">本番環境におけるアクセス・コントロールのベスト・プラクティス<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>上記のセットアップ手順は仕組みです。ここでは、アクセス・コントロールを長期にわたって効果的に維持するための設計原則を紹介する。</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">ルート・アカウントのロック・ダウン</h3><p>何よりもまず、デフォルトのパスワード（<code translate="no">root</code> ）を変更する。本番環境では、rootアカウントは緊急時にのみ使用し、シークレットマネージャーに保存する。</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">完全に環境を分ける</h3><p>開発用、ステージング用、本番用で異なる<a href="https://milvus.io/docs/architecture_overview.md">milvusインスタンスを</a>使用する。RBACのみによる環境分離は脆弱であり、接続文字列の設定ミス一つで開発サービスが本番環境にデータを書き込んでしまう。物理的な分離（異なるクラスタ、異なるクレデンシャル）は、このクラスのインシデントを完全に排除します。</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">最小特権の適用</h3><p>各ユーザーとサービスには、その仕事をするために必要な最小限のアクセス権しか与えない。狭い範囲から始め、特定の文書化された必要性があるときだけ広げる。開発環境ではもっと緩和してもよいが、本番環境でのアクセスは厳格にし、定期的に見直すべきである。</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">古くなったアクセスのクリーンアップ</h3><p>誰かがチームを去ったり、サービスが廃止されたりしたら、すぐにその人のロールを失効させ、アカウントを削除しましょう。有効なパーミッションを持つ未使用のアカウントは、不正アクセスの最も一般的なベクトルである。</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">特定のコレクションに権限を与える</h3><p>ロールが本当にすべてのコレクションへのアクセスを必要としない限り、<code translate="no">collection_name='*'</code> 。マルチテナントのセットアップや複数のデータパイプラインを持つシステムでは、各ロールを操作する<a href="https://milvus.io/docs/manage-collections.md">コレクションのみに</a>スコープします。これにより、認証情報が漏洩した場合の爆発範囲を限定することができます。</p>
<hr>
<p><a href="https://milvus.io/">Milvusを</a>実運用に導入し、アクセスコントロール、セキュリティ、マルチテナント設計に取り組んでいる場合、ぜひお手伝いさせてください：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、Milvusを大規模に運用している他のエンジニアと実際のデプロイメントプラクティスについて議論しましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（20分）の無料セッションを予約</a>し、ロール構造、コレクションレベルのスコープ、マルチ環境セキュリティなど、あなたのRBAC設計について説明します。</li>
<li>インフラストラクチャのセットアップを省略し、UIでアクセス制御を管理したい場合、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（マネージドMilvus）には、WebコンソールによるビルトインRBACが含まれており、さらに<a href="https://zilliz.com/cloud-security">暗号化</a>、ネットワーク分離、SOC 2コンプライアンスがすぐに利用できます。</li>
</ul>
<hr>
<p>Milvusでアクセスコントロールの設定を始める際に出てくるいくつかの質問：</p>
<p><strong>Q: ユーザーをすべてのコレクションではなく、特定のコレクションのみに制限することはできますか？</strong></p>
<p>はい。以下のように <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>を呼び出す場合、<code translate="no">*</code> ではなく、<code translate="no">collection_name</code> を特定のコレクションに設定します。ユーザのロールはそのコレクションにのみアクセスできます。コレクションごとに関数を1回呼び出すことで、複数のコレクションで同じロールに権限を与えることができます。</p>
<p><strong>Q: Milvusにおける権限と権限グループの違いは何ですか?</strong></p>
<p>特権は、<code translate="no">Search</code> 、<code translate="no">Insert</code> 、<code translate="no">DropCollection</code> のような単一のアクションです。<a href="https://milvus.io/docs/privilege_group.md">特権</a>グループは、複数の特権を1つの名前で束ねたものです。例えば、<code translate="no">COLL_RO</code> には、すべての読み取り専用コレクション操作が含まれます。特権グループを付与することは、各特権を個別に付与することと機能的には同じですが、管理は容易です。</p>
<p><strong>Q: 認証を有効にすると、Milvusクエリのパフォーマンスに影響はありますか?</strong></p>
<p>オーバーヘッドはごくわずかです。Milvusはリクエストごとに認証情報を検証し、ロールパーミッションをチェックしますが、これはインメモリルックアップであり、ミリ秒ではなくマイクロ秒が追加されます。<a href="https://milvus.io/docs/single-vector-search.md">検索や</a> <a href="https://milvus.io/docs/insert-update-delete.md">挿入の</a>レイテンシに測定可能な影響はありません。</p>
<p><strong>Q: Milvus RBACをマルチテナントで使用できますか？</strong></p>
<p>はい。テナントごとに個別のロールを作成し、各ロールの権限をそのテナントのコレクションにスコープし、対応するロールを各テナントのサービスアカウントに割り当てます。これにより、Milvusインスタンスを個別に用意することなく、コレクションレベルの分離が可能になります。より大規模なマルチテナンシーについては、<a href="https://milvus.io/docs/multi_tenancy.md">Milvusマルチテナンシーガイドを</a>ご参照ください。</p>
