---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: milvusアップグレード後の検索速度低下のトラブルシューティング：WPSチームからの教訓
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  milvusを2.2から2.5にアップグレードした後、WPSチームは3-5倍の検索レイテンシ回帰に見舞われた。原因はmilvus-backupのリストアフラグがセグメントを断片化していたことです。
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>この投稿は、推薦システムでMilvusを使用しているKingsoft Office SoftwareのWPSエンジニアリングチームによって寄稿されました。Milvus 2.2.16から2.5.16へのアップグレード中に、検索遅延が3倍から5倍に増加しました。この記事は、彼らがどのように問題を調査し、解決したかを説明するもので、同じようなアップグレードを計画しているコミュニティの他の方々の参考になるかもしれません。</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Milvusをアップグレードした理由<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは生産性ソフトウェアを開発しているWPSエンジニアリングチームの一員であり、オンライン推薦システムのリアルタイム類似検索を支えるベクトル検索エンジンとしてMilvusを使用しています。私たちのプロダクションクラスタには、平均768次元の数千万のベクトルが保存されていました。データは16のQueryNodeによって処理され、各Podは16のCPUコアと48GBのメモリを上限として構成された。</p>
<p>Milvus 2.2.16の実行中に、すでにビジネスに影響を及ぼしていた深刻な安定性の問題に遭遇しました。クエリの同時実行性が高い場合、<code translate="no">planparserv2.HandleCompare</code> 、ヌルポインタ例外が発生し、Proxyコンポーネントがパニックに陥り、頻繁に再起動する可能性がありました。このバグは、高い同時実行シナリオで非常に簡単に発生し、当社のオンライン・レコメンデーション・サービスの可用性に直接影響しました。</p>
<p>以下は、実際に発生したProxyのエラーログとスタックトレースです：</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>スタックトレースからわかること</strong>パニックはProxyのクエリ前処理中に発生し、<code translate="no">queryTask.PreExecute</code> 。 コールパスは以下の通りです：</p>
<p><code translate="no">taskScheduler.processTask</code> →<code translate="no">queryTask.PreExecute</code> →<code translate="no">planparserv2.CreateRetrievePlan</code> → です。<code translate="no">planparserv2.HandleCompare</code></p>
<p><code translate="no">HandleCompare</code> がアドレス<code translate="no">0x8</code> の無効なメモリにアクセスしようとしたときにクラッシュが発生し、SIGSEGV がトリガーされて Proxy プロセスがクラッシュしました。</p>
<p><strong>この安定性リスクを完全に排除するため、クラスタをmilvus 2.2.16から2.5.16にアップグレードすることにしました。</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">アップグレード前のmilvus-backupによるデータのバックアップ<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>本番クラスタに触れる前に、公式の<a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>ツールを使ってすべてをバックアップしました。milvus-backupは同一クラスタ内、クラスタ間、milvusのバージョン間でのバックアップとリストアをサポートしています。</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">バージョンの互換性の確認</h3><p>milvus-backupにはバージョンを<a href="https://milvus.io/docs/milvus_backup_overview.md">またいだリストアの</a>ための2つのバージョンルールがあります：</p>
<ol>
<li><p><strong>対象クラスタが同じmilvusバージョンまたは新しいmilvusバージョンを実行していること。</strong>2.2からのバックアップは2.5にロードできますが、その逆はできません。</p></li>
<li><p><strong>ターゲットは少なくともMilvus 2.4でなければなりません。</strong>古いリストアターゲットはサポートされていません。</p></li>
</ol>
<p>私たちのパス（2.2.16からのバックアップ、2.5.16へのロード）は両方のルールを満たしていました。</p>
<table>
<thead>
<tr><th>Backup From ↓ ˶ Restore To ↓ ˶ Restore To ↓ ˶ Restore To ↓ ˶ Restore To</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Milvus バックアップの仕組み</h3><p>MilvusバックアップはMilvusインスタンス間のメタデータ、セグメント、データのバックアップとリストアを容易にします。バックアップとリストアプロセスを柔軟に操作するために、CLI、API、gRPCベースのGoモジュールなどのノースバウンドインターフェースを提供します。</p>
<p>Milvus Backupはバックアップを作成するために、ソースのMilvusインスタンスからコレクションのメタデータとセグメントを読み込みます。そして、ソースMilvusインスタンスのルートパスからコレクションデータをコピーし、バックアップのルートパスに保存します。</p>
<p>バックアップからリストアするために、Milvusバックアップはバックアップのコレクションメタデータとセグメント情報に基づいてターゲットMilvusインスタンスに新しいコレクションを作成します。そして、バックアップデータをバックアップルートパスからターゲットインスタンスのルートパスにコピーします。</p>
<h3 id="Running-the-Backup" class="common-anchor-header">バックアップの実行</h3><p>専用の設定ファイル、<code translate="no">configs/backup.yaml</code> を用意しました。主なフィールドを以下に示します：</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>このコマンドを実行します：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> <strong>ホット・バックアップに</strong>対応しているため、通常はオンライン・トラフィックにほとんど影響を与えません。リソースの競合を避けるため、オフピーク時に実行する方が安全です。</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">バックアップの検証</h3><p>バックアップが終了した後、バックアップが完了し使用可能であることを確認しました。主に、バックアップ内のコレクション数とセグメント数がソースクラスタ内のものと一致しているかどうかを確認しました。</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>一致したので、アップグレードに移りました。</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Helmチャートによるアップグレード<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>3つのメジャーバージョン（2.2 → 2.5）をジャンプし、数千万のベクターを使用するため、インプレースアップグレードはリスクが高すぎました。代わりに新しいクラスタを構築し、そこにデータを移行した。古いクラスタはロールバック用にオンラインに残しました。</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">新しいクラスタのデプロイ</h3><p>新しいMilvus 2.5.16クラスタをHelmでデプロイしました：</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">主な設定変更 (<code translate="no">values-v25.yaml</code>)</h3><p>パフォーマンス比較を公平にするため、新しいクラスタはできるだけ古いクラスタと同じにしました。今回のワークロードで重要ないくつかの設定のみを変更しました：</p>
<ul>
<li><p><strong>Mmapを無効に</strong>した (<code translate="no">mmap.enabled: false</code>)：推奨ワークロードはレイテンシに敏感です。Mmapが有効になっていると、必要なときにディスクからデータが読み込まれる可能性があり、ディスクI/Oの遅延が追加され、レイテンシが急増する可能性があります。Mmapをオフにすることで、データは完全にメモリ内に留まり、クエリのレイテンシはより安定します。</p></li>
<li><p><strong>QueryNode数：</strong>旧クラスタと同じ<strong>16の</strong>まま。</p></li>
<li><p><strong>リソース制限：</strong>各Podの<strong>CPUコアは</strong>旧クラスタと同じ<strong>16</strong>コアのままです。</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">メジャーバージョンアップのヒント</h3><ul>
<li><p><strong>その場でアップグレードするのではなく、新しいクラスタを構築します。</strong>メタデータの互換性リスクを回避し、クリーンなロールバックパスを維持できます。</p></li>
<li><p><strong>移行前にバックアップを確認してください。</strong>いったんデータが新バージョンのフォーマットになってしまうと、簡単には元に戻せません。</p></li>
<li><p><strong>カットオーバー中も両方のクラスタを稼動させておく。</strong>トラフィックを徐々にシフトさせ、完全な検証後にのみ旧クラスタを廃止する。</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Milvusバックアップ・リストアによるアップグレード後のデータ移行<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>バックアップを新しいクラスタにロードするために<code translate="no">milvus-backup restore</code> 。milvus-backupの用語では、"リストア "は "バックアップデータをターゲットクラスタにロードする "ことを意味します。ターゲットは同じmilvusバージョンまたは新しいmilvusバージョンを実行する必要があるため、リストアという名前にもかかわらず、リストアは常にデータを前方に移動します。</p>
<h3 id="Running-the-Restore" class="common-anchor-header">リストアの実行</h3><p>リストア設定ファイル、<code translate="no">configs/restore.yaml</code> は<strong>新しいクラスタと</strong>そのストレージ設定を指す必要があります。主なフィールドはこのようになっている：</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>次に実行しました：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> リストアされたデータが新しいクラスタのストレージに書き込まれるように、新しいクラスタのmilvusおよびMinIO接続情報が必要です。</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">リストア後のチェック</h3><p>リストアが完了した後、移行が正しいことを確認するために4つのことをチェックしました：</p>
<ul>
<li><p><strong>スキーマ。</strong>新しいクラスタのコレクションスキーマは、フィールド定義やベクトル次元を含め、古いものと完全に一致している必要がありました。</p></li>
<li><p><strong>総行数。</strong>旧クラスタと新クラスタのエンティティの総数を比較し、データが失われていないことを確認した。</p></li>
<li><p><strong>インデックスの状態。</strong>すべてのインデックスの構築が完了し、ステータスが<code translate="no">Finished</code> に設定されていることを確認した。</p></li>
<li><p><strong>クエリ結果。</strong>両方のクラスタで同じクエリを実行し、返されたIDと距離スコアを比較し、結果が一致していることを確認した。</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">漸進的なトラフィックシフトと驚きのレイテンシ<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>本番トラフィックを段階的に新しいクラスタに移行させた：</p>
<table>
<thead>
<tr><th>フェーズ</th><th>トラフィックシェア</th><th>期間</th><th>監視内容</th></tr>
</thead>
<tbody>
<tr><td>フェーズ1</td><td>5%</td><td>24時間</td><td>P99クエリのレイテンシー、エラー率、結果精度</td></tr>
<tr><td>フェーズ2</td><td>25%</td><td>48時間</td><td>P99/P95クエリの待ち時間、QPS、CPU使用率</td></tr>
<tr><td>フェーズ3</td><td>50%</td><td>48時間</td><td>エンドツーエンド・メトリクス、リソース使用量</td></tr>
<tr><td>フェーズ4</td><td>100%</td><td>モニタリングの継続</td><td>全体的なメトリクスの安定性</td></tr>
</tbody>
</table>
<p>即座にロールバックできるように、古いクラスタはずっと稼働させておいた。</p>
<p><strong>このロールアウト中に、新しいv2.5.16クラスタでの検索レイテンシが古いv2.2.16クラスタに比べて3～5倍高いという問題を発見した。</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">検索遅延の原因を探る<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">ステップ1：全体的なCPU使用率のチェック</h3><p>まずはコンポーネントごとのCPU使用率から、クラスタのリソース不足の有無を確認した。</p>
<table>
<thead>
<tr><th>コンポーネント</th><th>CPU使用率（コア）</th><th>分析</th></tr>
</thead>
<tbody>
<tr><td>クエリノード</td><td>10.1</td><td>リミットは16コアなので、使用率は約63%。完全に使用されていない</td></tr>
<tr><td>プロキシ</td><td>0.21</td><td>非常に低い</td></tr>
<tr><td>ミックスコード</td><td>0.11</td><td>非常に低い</td></tr>
<tr><td>データノード</td><td>0.14</td><td>非常に低い</td></tr>
<tr><td>インデックスノード</td><td>0.02</td><td>非常に低い</td></tr>
</tbody>
</table>
<p>これは、QueryNodeがまだ十分なCPUを使えることを示している。そのため、速度低下は<strong>全体的なCPU不足が原因では</strong>ありませんでした。</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">ステップ2：QueryNodeのバランスをチェックする</h3><p>総CPUは問題なさそうでしたが、個々のQueryNodeポッドには<strong>明らかなアンバランスが</strong>ありました：</p>
<table>
<thead>
<tr><th>QueryNodeポッド</th><th>CPU使用率（最終）</th><th>CPU使用率（最大）</th></tr>
</thead>
<tbody>
<tr><td>クエリノード・ポッド-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>クエリノードポッド-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>クエリノード・ポッド-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>クエリノード・ポッド-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>クエリノードポッド-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>クエリノードポッド-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>クエリノードポッド-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>クエリノードポッド-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>クエリノードポッド-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1はPod-8の5倍近いCPUを使用している。MilvusはすべてのQueryNodeにクエリを出し、最も遅いQueryNodeが終了するのを待つので、これは問題だ。少数の過負荷ポッドがすべての検索の足を引っ張っていたのだ。</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">ステップ3：セグメント分布の比較</h3><p>不均等な負荷は通常、不均等なデータ分布を示すため、新旧クラスタのセグメントレイアウトを比較しました。</p>
<p><strong>v2.2.16 セグメントレイアウト（合計 13 セグメント）</strong></p>
<table>
<thead>
<tr><th>行数範囲</th><th>セグメント数</th><th>状態</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>シール</td></tr>
<tr><td>533,630</td><td>1</td><td>封印</td></tr>
</tbody>
</table>
<p>古いクラスターはかなり均等だった。セグメント数は 13 で、そのほとんどが<strong>74 万行ほど</strong>でした。</p>
<p><strong>v2.5.16 セグメントレイアウト (合計 21 セグメント)</strong></p>
<table>
<thead>
<tr><th>行数範囲</th><th>セグメント数</th><th>状態</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>シールド</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>封印</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>封印</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>シール</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>封印</td></tr>
</tbody>
</table>
<p>新しいクラスターは大きく異なっていた。セグメントサイズはまちまちで、685k行のものもあれば、350k行のものもある。リストアによってデータがばらばらに分散された。</p>
<h3 id="Root-Cause" class="common-anchor-header">根本原因</h3><p>私たちは、この問題をオリジナルのリストアコマンドにまでさかのぼりました：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>この<code translate="no">--use_v2_restore</code> フラグは、複数のセグメントを1つのリストア・ジョブにまとめるセグメント・マージ・リストア・モードを有効にします。このモードは、小さなセグメントが多数ある場合にリストアを高速化するように設計されています。</p>
<p>しかし、今回のクロスバージョンリストア（2.2 → 2.5）では、v2ロジックはオリジナルのクラスタとは異なる方法でセグメントを再構築しました。一度ロードされると、一部のQueryNodeは他のQueryNodeよりも多くのデータで立ち往生した。</p>
<p>これは3つの点でパフォーマンスを低下させた：</p>
<ul>
<li><p><strong>ホットノード：</strong>ホットノード：より大きな、またはより多くのセグメントを持つQueryNodeは、より多くの仕事をしなければならなかった。</p></li>
<li><p><strong>最も遅いノードの効果：</strong>分散クエリの待ち時間は、最も遅いノードに依存します。</p></li>
<li><p><strong>マージオーバーヘッドの増加:</strong>セグメントが多くなると、結果をマージする際の作業も多くなります。</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">修正</h3><p><code translate="no">--use_v2_restore</code> を削除し、デフォルトのロジックに戻した：</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>まず新しいクラスタから不良データをクリーンアップし、それからデフォルトのリストアを実行した。セグメント分布はバランスに戻り、検索レイテンシは正常に戻り、問題は解消した。</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">次回の対策<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>このケースでは、<strong>セグメント分布の不均等という</strong>本当の問題を見つけるのに時間がかかりすぎました。この問題をより早く解決するには、次のようなことが必要でした。</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">セグメントモニタリングの改善</h3><p>Milvusは、標準的なGrafanaダッシュボードで、コレクションごとのセグメント数、行分布、サイズ分布を公開していません。私たちは<a href="https://github.com/zilliztech/attu">Attuと</a>etcdを手動で調べなければならず、時間がかかっていた。</p>
<p>追加するのに役立つでしょう：</p>
<ul>
<li><p>Grafana の<strong>セグメント分布ダッシュボード</strong>。各 QueryNode がロードしたセグメント数、行数、サイズを表示する。</p></li>
<li><p>ノード間のセグメント行数が閾値を超えて偏った場合にトリガーされる<strong>不均衡アラート</strong>。</p></li>
<li><p><strong>マイグレーション比較ビューにより</strong>、アップグレード後の新旧クラスタ間のセグメント分布を比較することができます。</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">標準的な移行チェックリストの使用</h3><p>私たちは行数をチェックし、問題ないと判断しました。それだけでは十分ではありませんでした。移行後の完全な検証には、以下の項目も含まれます：</p>
<ul>
<li><p><strong>スキーマの整合性。</strong>スキーマの整合性。</p></li>
<li><p><strong>セグメント数。</strong>セグメント数が大幅に変化していないか。</p></li>
<li><p><strong>セグメントのバランス。</strong>セグメント間の行数は適度に均等か。</p></li>
<li><p><strong>インデックスの状態。</strong>すべてのインデックスが<code translate="no">finished</code>?</p></li>
<li><p><strong>レイテンシベンチマーク。</strong>P50、P95、P99のクエリレイテンシは旧クラスタと同様か？</p></li>
<li><p><strong>ロードバランス。</strong>QueryNodeのCPU使用率はPodに均等に分散されているか？</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">自動チェックを追加する</h3><p>PyMilvusを使ってこの検証をスクリプト化することで、本番稼動前にアンバランスを検出することができます：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">既存のツールをよりうまく使う</h3><p>いくつかのツールはすでにセグメントレベルの診断をサポートしています：</p>
<ul>
<li><p><strong>Birdwatcher:</strong>Etcd メタデータを直接読み込んで、セグメントのレイアウトとチャネルの割り当てを表示できます。</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong>セグメント情報を視覚的に検査できる。</p></li>
<li><p><strong>Grafana + Prometheus:</strong>リアルタイムのクラスタモニタリングのためのカスタムダッシュボードを構築するために使用できます<strong>。</strong></p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Milvusコミュニティへの提案<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusにいくつかの変更を加えることで、このようなトラブルシューティングが容易になります：</p>
<ol>
<li><p><strong>パラメータの互換性をより明確に説明する</strong> <code translate="no">milvus-backup</code> ドキュメントでは、クロスバージョンリストア時の<code translate="no">--use_v2_restore</code> のようなオプションの動作と、それらがもたらす可能性のあるリスクを明確に説明する必要があります。</p></li>
<li><p><strong>リストア後のより良いチェックを追加する</strong> <code translate="no">restore</code> が終了した<strong>後</strong>、ツールが自動的にセグメント分布のサマリーを表示してくれると助かります。</p></li>
<li><p><strong>バランス関連メトリクスの公開Prometheus の</strong>メトリクスの中に、セグメントバランス情報を含めるべきです。</p></li>
<li><p><strong>クエリプラン解析のサポート</strong>MySQL<code translate="no">EXPLAIN</code> と<strong>同様に</strong>、Milvus は、クエリがどのように実行されるかを示し、パフォーマンス上の問題を見つけるのに役立つツールがあると便利です。</p></li>
</ol>
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
    </button></h2><p>まとめると</p>
<table>
<thead>
<tr><th>ステージ</th><th>ツール/方法</th><th>キーポイント</th></tr>
</thead>
<tbody>
<tr><td>バックアップ</td><td>milvus-バックアップ作成</td><td>ホットバックアップに対応していますが、バックアップのチェックは入念に行う必要があります。</td></tr>
<tr><td>アップグレード</td><td>Helmを使用して新しいクラスタを構築する</td><td>I/Oジッタを減らすためにMmapを無効にし、リソースの設定は古いクラスタと同じにします。</td></tr>
<tr><td>マイグレーション</td><td>milvus-バックアップのリストア</td><td>use_v2_restoreには注意してください。クロスバージョンリストアでは、明確に理解していない限りデフォルト以外のロジックを使用しないでください。</td></tr>
<tr><td>グレイロールアウト</td><td>段階的なトラフィック移動</td><td>段階的にトラフィックを移動させる：5%→25%→50%→100%と段階的にトラフィックを移動させ、古いクラスタをロールバックできる状態にしておく。</td></tr>
<tr><td>トラブルシューティング</td><td>Grafana + セグメント分析</td><td>CPUとメモリだけを見てはいけない。セグメントバランスとデータ分散もチェック</td></tr>
<tr><td>修正</td><td>悪いデータを削除し、再度リストアする</td><td>間違ったフラグを削除し、デフォルトのロジックでリストアすると、パフォーマンスは正常に戻る</td></tr>
</tbody>
</table>
<p>データを移行する際に重要なのは、データが存在し正確であるかどうかだけではありません。<strong>データがどのように</strong> <strong>分散されて</strong>いるかにも注意を払う必要があります。</p>
<p>セグメント数とセグメントサイズは、Milvusがクエリ作業をノード間でどれだけ均等に分散させるかを決定します。セグメントのバランスが悪いと、少数のノードがほとんどの作業を行うことになり、すべての検索がその代償を払うことになります。クロスバージョンのアップグレードでは、リストアプロセスが元のクラスタとは異なるセグメントを再構築する可能性があるため、余計なリスクが伴います。<code translate="no">--use_v2_restore</code> のようなフラグは、行数だけではわからない方法でデータを断片化する可能性がある。</p>
<p>したがって、クロスバージョン移行における最も安全なアプローチは、そうしなければならない特別な理由がない限り、デフォルトのリストア設定に固執することです。また、モニタリングはCPUやメモリだけでなく、基礎となるデータレイアウト、特にセグメント分布やバランスについての洞察も必要です。</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Milvusチームからのコメント<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>この経験をMilvusコミュニティと共有してくれたWPSエンジニアリングチームに感謝したい。このような記事は、実際のプロダクションでの教訓をとらえ、同じような問題に直面している他の人々にとって有益であるため、貴重なものです。</p>
<p>もしあなたのチームに技術的な教訓、トラブルシューティングの話、または共有する価値のある実践的な経験があれば、ぜひお聞かせください。私たちの<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>参加して、ぜひご連絡ください。</p>
<p>また、同じコミュニティチャンネルは、Milvusエンジニアや他のユーザーとつながる良い場所です。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを通して</a>、バックアップやリストア、クロスバージョンアップグレード、クエリパフォーマンスに関する1対1のセッションを予約することも可能です。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
