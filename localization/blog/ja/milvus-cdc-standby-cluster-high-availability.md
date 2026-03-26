---
id: milvus-cdc-standby-cluster-high-availability.md
title: ベクターデータベースの高可用性：CDCでmilvusスタンバイクラスタを構築する方法
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Milvus
  CDCで高可用性ベクターデータベースを構築する方法をご紹介します。プライマリ-スタンバイレプリケーション、フェイルオーバー、本番DRのステップバイステップガイド。
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>すべてのプロダクション・データベースには、物事がうまくいかなくなったときのための計画が必要だ。リレーショナル・データベースには、WALシッピング、ビンログ・レプリケーション、自動フェイルオーバーが何十年も前から備わっている。しかし、<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクトル・データベースは</a>、AIアプリケーションの中核インフラになりつつあるにもかかわらず、この面ではまだ追いついていない。ほとんどがノードレベルの冗長性を提供するのがせいぜいだ。クラスタ全体がダウンした場合、バックアップからリストアし、<a href="https://zilliz.com/learn/vector-index">ベクターインデックスを</a>ゼロから再構築することになる。MLパイプラインを通じて<a href="https://zilliz.com/glossary/vector-embeddings">エンベッディングを</a>再生成するのは安くはないため、このプロセスには数時間かかり、数千の計算コストがかかる。</p>
<p><a href="https://milvus.io/">Milvusは</a>異なるアプローチを取る。クラスタ内の高速フェイルオーバーのためのノードレベルレプリカ、クラスタレベルとクロスリージョンの保護のためのCDCベースのレプリケーション、そしてセーフティネットリカバリーのためのバックアップです。このレイヤーモデルは従来のデータベースでは標準的な手法であり、Milvusはこれをベクターワークロードに導入した最初の主要なベクターデータベースです。</p>
<p>本ガイドでは、ベクターデータベースで利用可能な高可用性戦略（"production-ready "が実際に何を意味するのか評価できるように）と、Milvus CDCのプライマリ-スタンバイレプリケーションをゼロからセットアップするための実践的なチュートリアルの2つを取り上げます。</p>
<blockquote>
<p>これはシリーズの<strong>第1部</strong>です：</p>
<ul>
<li><strong>パート1</strong>（本記事）：新しいクラスタでのプライマリ/スタンバイ・レプリケーションの設定</li>
<li><strong>パート2</strong>:<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backupを</a>使用して、すでにデータがある既存のクラスタにCDCを追加する</li>
<li><strong>パート3</strong>: フェイルオーバーの管理 - プライマリ停止時のスタンバイの昇格</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">なぜベクターデータベースでは高可用性が重要なのか？<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のSQLデータベースがダウンした場合、構造化されたレコードへのアクセスは失われますが、データ自体は通常、上流のソースから再インポートすることができます。ベクターデータベースがダウンした場合、復旧は根本的に難しくなります。</p>
<p>ベクトル・データベースは、MLモデルによって生成された高密度の数値表現である<a href="https://zilliz.com/glossary/vector-embeddings">エンベッディングを</a>保存している。<a href="https://zilliz.com/ai-models">エンベッディングデータベースを</a>再構築するということは、エンベッディングパイプラインを通してデータセット全体を再実行することを意味する。何億ものベクトルを持つデータセットでは、これには何日もかかり、GPU計算で何千ドルもかかる。</p>
<p>一方、<a href="https://zilliz.com/learn/what-is-vector-search">ベクトル検索に</a>依存するシステムは、しばしばクリティカルパスに入っている：</p>
<ul>
<li>顧客に対応するチャットボットや検索を支える<strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>パイプライン</strong>- ベクトル・データベースがダウンすると、検索は停止し、AIは一般的な回答や幻覚のような回答を返す。</li>
<li>商品やコンテンツの提案をリアルタイムで提供する<strong>レコメンデーション・エンジン</strong>- ダウンタイムは収益を逃すことを意味する。</li>
<li><a href="https://zilliz.com/glossary/similarity-search">類似性検索に</a>依存する<strong>不正検知や異常監視</strong>システムは、疑わしいアクティビティにフラグを立てる。</li>
<li>記憶とツールの検索にベクター・ストアを使用する<strong>自律エージェント・システム</strong>- エージェントは知識ベースがないと失敗したりループしたりする。</li>
</ul>
<p>これらのユースケースのためにベクターデータベースを評価するのであれば、高可用性は後で確認するための機能ではありません。高可用性は、最初に確認すべき機能の一つです。</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">ベクターデータベースにおけるプロダクショングレードの高可用性とは？<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>すべての高可用性が同じではありません。単一のクラスタ内のノード障害にしか対応できないベクターデータベースは、プロダクションシステムが必要とするような「高可用性」ではありません。本当のHAは3つのレイヤーをカバーする必要がある：</p>
<table>
<thead>
<tr><th>レイヤー</th><th>何から守るか</th><th>どのように機能するか</th><th>復旧時間</th><th>データ損失</th></tr>
</thead>
<tbody>
<tr><td><strong>ノードレベル</strong>（マルチレプリカ）</td><td>単一ノードのクラッシュ、ハードウェア障害、OOMキル、AZ障害</td><td>同じ<a href="https://milvus.io/docs/glossary.md">データセグメントを</a>複数のノードにコピーし、他のノードが負荷を吸収</td><td>インスタント</td><td>ゼロ</td></tr>
<tr><td><strong>クラスタレベル</strong>（CDCレプリケーション）</td><td>クラスタ全体がダウン - K8sのロールアウト不良、ネームスペースの削除、ストレージの破損</td><td>すべての書き込みを<a href="https://milvus.io/docs/four_layers.md">ライトアヘッドログ</a>経由でスタンバイクラスタにストリーム；スタンバイは常に数秒遅れ</td><td>分</td><td>秒</td></tr>
<tr><td><strong>セーフティネット</strong>（定期バックアップ）</td><td>致命的なデータ破損、ランサムウェア、レプリケーションを通じて伝播する人的エラー</td><td>定期的にスナップショットを取得し、別の場所に保存</td><td>時間</td><td>時間（最後のバックアップから）</td></tr>
</tbody>
</table>
<p>これらのレイヤーは補完的なものであり、代替ではありません。本番環境では、これらを積み重ねる必要がある：</p>
<ol>
<li><strong>まず<a href="https://milvus.io/docs/replica.md">マルチレプリカ</a></strong>- 最も一般的な障害（ノードのクラッシュ、AZの障害）に対応し、ダウンタイムとデータロスをゼロにします。</li>
<li><strong>次に<a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a></strong>- マルチレプリカでは対応できない障害（クラスタ全体の停止、致命的なヒューマンエラー）から保護します。スタンバイクラスタは別の障害領域にあります。</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">定期的なバックアップは</a>常に</strong>- 最後のセーフティネットです。CDCであっても、破損したデータをキャッチする前にスタンバイにレプリケートしてしまえば、あなたを救うことはできません。</li>
</ol>
<p>ベクターデータベースを評価する際には、この3つのレイヤーのうち、その製品が実際にどのレイヤーをサポートしているのか？今日、ほとんどのベクターデータベースは最初のものしか提供していない。Milvusはこの3つすべてをサポートしており、CDCはサードパーティのアドオンではなく、ビルトイン機能として提供されています。</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Milvus CDCとは？<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong>は組み込みのレプリケーション機能で、プライマリクラスタの<a href="https://milvus.io/docs/four_layers.md">WAL (Write-Ahead Log)</a>を読み込み、各エントリを別のスタンバイクラスタにストリームします。スタンバイはエントリーをレプリケートし、通常数秒遅れで同じデータを取得します。</p>
<p>このパターンはデータベースの世界では確立されている。MySQLにはbinlogレプリケーションがある。PostgreSQLにはWALシッピングがある。MongoDBにはoplogベースのレプリケーションがある。これらは何十年もの間、リレーショナル・データベースやドキュメント・データベースを本番稼動させてきた実績のある技術だ。Milvusは、同じアプローチをベクターワークロードにもたらす。Milvusは、WALベースのレプリケーションをビルトイン機能として提供する最初のメジャーな<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクターデータベース</a>である。</p>
<p>CDCがディザスタリカバリに適している理由は3つある：</p>
<ul>
<li><strong>低レイテンシー同期。</strong>CDCは、スケジュールされたバッチではなく、オペレーションが発生した時点でストリーミングを行う。通常、スタンバイはプライマリから数秒遅れている。</li>
<li><strong>順序付けられた再生。</strong>操作は、書き込まれたのと同じ順序でスタンバイに到着する。リコンシリエーションを行わなくても、データは一貫性を保ちます。</li>
<li><strong>チェックポイント・リカバリ。</strong>CDCプロセスがクラッシュしたり、ネットワークがダウンした場合でも、中断したところから再開します。データがスキップされたり、複製されたりすることはありません。</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">CDCアーキテクチャの仕組み</h3><p>CDCの展開には3つのコンポーネントがあります：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>ストリーミング・ノードとCDCノードがWALを消費し、データをターゲット・クラスタのプロキシ・レイヤにレプリケートします。プロキシ・レイヤはDDL/DCL/DMLオペレーションをストリーミング・ノードに転送し、WALに追加します。</span> </span></p>
<table>
<thead>
<tr><th>コンポーネント</th><th>役割</th></tr>
</thead>
<tbody>
<tr><td><strong>プライマリクラスタ</strong></td><td>本番<a href="https://milvus.io/docs/architecture_overview.md">Milvusインスタンス</a>。すべてのリードとライトはここに送られます。すべての書き込みはWALに記録される。</td></tr>
<tr><td><strong>CDCノード</strong></td><td>プライマリと並ぶバックグラウンドプロセス。WALエントリを読み込み、スタンバイに転送する。読み取り/書き込みパスから独立して実行されるため、クエリやインサートのパフォーマンスには影響しない。</td></tr>
<tr><td><strong>スタンバイクラスタ</strong></td><td>転送されたWALエントリを再生する別のMilvusインスタンス。プライマリと同じデータを数秒遅れで保持します。リードクエリを提供できるが、ライトは受け付けない。</td></tr>
</tbody>
</table>
<p>流れ: 書き込みがプライマリにヒット → CDCノードがスタンバイにコピー → スタンバイが複製。スタンバイの書き込みパスには他には何も話しかけない。プライマリがダウンした場合、スタンバイはすでにほぼすべてのデータを持っており、昇格させることができる。</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">チュートリアルMilvus CDCスタンバイクラスタのセットアップ<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事の残りは実践的なチュートリアルです。最終的には、2つのMilvusクラスタが稼働し、それらのクラスタ間でリアルタイムレプリケーションが行われるようになります。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>始める前に</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a>v2.6.6以降。</strong>CDCはこのバージョンを必要とします。最新の2.6.xパッチを推奨します。</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a>v1.3.4以降。</strong>本ガイドでは、Kubernetes上のクラスタ管理にOperatorを使用します。</li>
<li><code translate="no">kubectl</code> 、<code translate="no">helm</code> が設定された<strong>稼働中のKubernetesクラスタ</strong>。</li>
<li>レプリケーション設定ステップに<strong> <a href="https://milvus.io/docs/install-pymilvus.md">pymilvusを</a>使用したPython</strong>。</li>
</ul>
<p>現在のリリースには2つの制限があります：</p>
<table>
<thead>
<tr><th>制限事項</th><th>詳細</th></tr>
</thead>
<tbody>
<tr><td>単一のCDCレプリカ</td><td>クラスタあたり1つのCDCレプリカ。分散CDCは将来のリリースで計画されています。</td></tr>
<tr><td>BulkInsertなし</td><td>CDCが有効な場合、<a href="https://milvus.io/docs/import-data.md">BulkInsertは</a>サポートされません。こちらも将来のリリースを予定しています。</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">ステップ1: Milvus Operatorのアップグレード</h3><p>Milvus Operatorをv1.3.4以降にアップグレードします：</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Operator podが動作していることを確認します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">ステップ2: プライマリクラスタのデプロイ</h3><p>プライマリ(ソース)クラスタ用のYAMLファイルを作成します。<code translate="no">components</code> の下の<code translate="no">cdc</code> セクションは、クラスタと一緒にCDCノードをデプロイするようにOperatorに指示します：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">msgStreamType: woodpecker</code> 、KafkaやPulsarのような外部メッセージキューではなく、Milvusの組み込み<a href="https://milvus.io/docs/four_layers.md">Woodpecker WALを</a>使用します。WoodpeckerはMilvus 2.6で導入されたクラウドネイティブなライトアヘッドログで、外部メッセージングインフラストラクチャの必要性を取り除きます。</p>
<p>設定を適用する：</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>すべてのポッドがRunningステータスになるのを待つ。CDCポッドが起動していることを確認します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">ステップ3: スタンバイクラスタのデプロイ</h3><p>スタンバイ(ターゲット)クラスタは同じMilvusバージョンを使用しますが、CDCコンポーネントは含まれません：</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>適用します：</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>すべてのポッドが実行されていることを確認します：</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">ステップ4: レプリケーション関係の構成</h3><p>両方のクラスタが実行されている状態で、<a href="https://milvus.io/docs/install-pymilvus.md">pymilvusを</a>使用してPythonを使用してレプリケーション・トポロジを構成します。</p>
<p>クラスタ接続の詳細と物理チャネル（pchannel）名を定義します：</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>レプリケーション構成を構築します：</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>両方のクラスタに適用します：</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>これが成功すると、プライマリ上のインクリメンタルな変更がスタンバイに自動的にレプリケートされ始めます。</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">ステップ5: レプリケーションの動作確認</h3><ol>
<li>プライマリに接続し、<a href="https://milvus.io/docs/manage-collections.md">コレクションを作成し</a>、<a href="https://milvus.io/docs/insert-update-delete.md">いくつかのベクターを挿入</a>し、<a href="https://milvus.io/docs/load-and-release.md">ロード</a>します。</li>
<li>プライマリで検索を実行し、データがそこにあることを確認する。</li>
<li>スタンバイに接続し、同じ検索を実行します。</li>
<li>スタンバイが同じ結果を返せば、レプリケーションは機能しています。</li>
</ol>
<p><a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタートでは</a>、コレクションの作成、挿入、検索について説明しています。</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">本番環境でのCDCの実行<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CDCのセットアップは簡単です。CDCの信頼性を長期間維持するには、いくつかの運用領域に注意を払う必要があります。</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">レプリケーションの遅延の監視</h3><p>スタンバイは常にプライマリより若干遅れている。これは非同期レプリケーション特有のものだ。通常の負荷であれば、遅延は数秒である。しかし、書き込みが急増したり、ネットワークが混雑したり、スタンバイのリソースが圧迫されたりすると、ラグが大きくなることがあります。</p>
<p>ラグを指標として追跡し、アラートを出す。ラグが回復せずに大きくなるのは、通常、CDCノードが書き込みスループットに追いついていないことを意味します。まずクラスタ間のネットワーク帯域幅を確認し、スタンバイがより多くのリソースを必要とするかどうかを検討します。</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">スタンバイをリード・スケーリングに使用する</h3><p>スタンバイは、災害が発生するまでアイドル状態で待機しているだけのコールドバックアップではありません。レプリケーションがアクティブな間は<a href="https://milvus.io/docs/single-vector-search.md">検索やクエリのリクエストを</a>受け付け、書き込みだけがブロックされる。これにより、実用的な用途が広がる：</p>
<ul>
<li>バッチ<a href="https://zilliz.com/glossary/similarity-search">類似検索や</a>分析ワークロードをスタンバイにルーティングする。</li>
<li>ピーク時の読み取りトラフィックを分割し、プライマリへの負担を軽減する。</li>
<li>本番の書き込みレイテンシに影響を与えることなく、高価なクエリ（大規模なトップK、大規模なコレクションをフィルタリングした検索）を実行できます。</li>
</ul>
<p>これにより、DRインフラストラクチャがパフォーマンス資産に変わります。スタンバイは、何も故障していないときでも稼げます。</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">スタンバイの適切なサイズ</h3><p>スタンバイはプライマリからの書き込みをすべて複製するため、同様の計算リソースとメモリ・リソースが必要になります。読み込みもスタンバイにルーティングするのであれば、その追加負荷も考慮してください。ストレージの要件も同じです。</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">必要になる前にフェイルオーバーをテストする</h3><p>フェイルオーバー・プロセスが機能しないことを知るために、実際の障害を待つ必要はありません。定期的にドリルを実行する：</p>
<ol>
<li>プライマリへの書き込みを停止する</li>
<li>スタンバイが追いつくのを待つ（ラグ → 0）</li>
<li>スタンバイをプロモートする</li>
<li>クエリが期待通りの結果を返すことを確認する</li>
<li>逆プロセス</li>
</ol>
<p>各ステップにかかる時間を測定し、文書化する。目標は、フェイルオーバーをタイミングがわかっている日常的な手順にすることです。このシリーズのパート3では、フェイルオーバー・プロセスについて詳しく説明する。</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">CDCを自分で管理したくない？Zilliz Cloudにお任せください<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusのCDCレプリケーションのセットアップと運用は強力ですが、運用にはオーバーヘッドが伴います。2つのクラスタを管理し、レプリケーションの健全性を監視し、フェイルオーバーのランブックを処理し、リージョン間でインフラを維持する必要があります。運用の負担なしにプロダクショングレードのHAを求めるチームには、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（マネージドMilvus）がすぐに提供してくれる。</p>
<p><strong>グローバルクラスタは</strong>Zilliz Cloudの主要機能である。北米、ヨーロッパ、アジアパシフィックなど、複数の地域にまたがるMilvusデプロイメントを単一の論理クラスタとして運用することができる。ボンネットの下では、この記事で説明したのと同じCDC/WALレプリケーション・テクノロジーを使用しているが、完全に管理されている：</p>
<table>
<thead>
<tr><th>機能</th><th>セルフマネージドCDC（この記事）</th><th>Zillizクラウド・グローバル・クラスター</th></tr>
</thead>
<tbody>
<tr><td><strong>レプリケーション</strong></td><td>構成と監視</td><td>自動化された非同期CDCパイプライン</td></tr>
<tr><td><strong>フェイルオーバー</strong></td><td>手動ランブック</td><td>自動化 - コード変更なし、接続文字列更新なし</td></tr>
<tr><td><strong>セルフヒーリング</strong></td><td>障害が発生したクラスタを再プロビジョニング</td><td>自動: 古い状態を検出してリセットし、新しいセカンダリとして再構築する</td></tr>
<tr><td><strong>クロスリージョン</strong></td><td>両方のクラスタをデプロイして管理</td><td>ローカル・リード・アクセスによるマルチ・リージョンを内蔵</td></tr>
<tr><td><strong>RPO</strong></td><td>秒（監視状況による）</td><td>秒（計画外）/ゼロ（計画的な切り替え）</td></tr>
<tr><td><strong>RTO</strong></td><td>分（ランブックによる）</td><td>分（自動化）</td></tr>
</tbody>
</table>
<p>グローバル・クラスタ以外にも、ビジネス・クリティカル・プランにはDR機能が追加されています：</p>
<ul>
<li><strong>ポイント・イン・タイム・リカバリ(PITR)</strong>-保持ウィンドウ内の任意の時点にコレクションをロールバックします。スタンバイにレプリケートされた不慮の削除やデータ破損からの復旧に便利です。</li>
<li><strong>クロスリージョンバックアップ</strong>- デスティネーションリージョンへの自動化された継続的なバックアップレプリケーション。新しいクラスタへのリストアは数分で完了します。</li>
<li><strong>99.99%のアップタイムSLA</strong>- 複数のレプリカによるマルチAZデプロイメントに支えられています。</li>
</ul>
<p>本番環境でベクトル検索を運用しており、DRが必須要件である場合、Milvusのセルフマネージド・アプローチとともにZilliz Cloudを評価する価値がある。詳細は<a href="https://zilliz.com/contact-sales">Zillizチームまでお問い合わせください</a>。</p>
<h2 id="Whats-Next" class="common-anchor-header">次の記事<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>本記事では、ベクターデータベースのHA環境について説明し、プライマリとスタンバイのペアをゼロから構築する方法を説明した。次回は</p>
<ul>
<li><strong>パート2</strong>: 既存のMilvusクラスタにCDCを追加し、レプリケーションを有効にする前に<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backupを</a>使用してスタンバイをシードする。</li>
<li><strong>パート 3</strong>: フェイルオーバーの管理 - スタンバイの昇格、トラフィックのリダイレクト、元のプライマリのリカバリ</li>
</ul>
<p>ご期待ください。</p>
<hr>
<p>本番環境で<a href="https://milvus.io/">Milvusを</a>運用し、ディザスタリカバリについてお考えでしたら、ぜひお手伝いさせてください：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、質問したり、HAアーキテクチャを共有したり、Milvusを大規模に運用している他のチームから学んだりしましょう。</li>
<li>CDCの設定、フェイルオーバーの計画、マルチリージョンの展開など、DRのセットアップについて説明する<a href="https://milvus.io/office-hours">20分間のMilvusオフィスアワー（無料）をご予約</a>ください。</li>
<li>インフラストラクチャのセットアップをスキップして、すぐに本番環境での高可用性を実現したい場合は、Milvusが管理する<a href="https://cloud.zilliz.com/signup">Zilliz Cloudの</a>グローバルクラスタ機能をご利用ください。</li>
</ul>
<hr>
<p>ベクター・データベースの高可用性をセットアップし始めると、いくつかの疑問が出てきます：</p>
<p><strong>Q: CDCはプライマリクラスターの速度を落としますか？</strong></p>
<p>CDC NodeはWALログを非同期で読み込みます。CDCノードは、プライマリ上のリソースのためにクエリやインサートと競合することはありません。CDCを有効にしてもパフォーマンスに違いはありません。</p>
<p><strong>Q: CDCを有効にする前に存在したデータをレプリケートできますか？</strong></p>
<p>いいえ - CDCは有効化された時点からの変更のみをキャプチャします。既存のデータをスタンバイに取り込むには、まず<a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backupを</a>使用してスタンバイをシードし、次にCDCを有効にして継続的なレプリケーションを行います。このシリーズのパート2では、このワークフローについて説明します。</p>
<p><strong>Q: すでにマルチレプリカを有効にしている場合でもCDCは必要ですか?</strong></p>
<p>CDCとマルチレプリカは異なる障害モードから保護します。<a href="https://milvus.io/docs/replica.md">Multi-replicaは</a>1つのクラスタ内のノード間で同じ<a href="https://milvus.io/docs/glossary.md">セグメントの</a>コピーを保持します。ノードの障害には最適ですが、クラスタ全体がなくなってしまった場合（デプロイの失敗、AZの停止、ネームスペースの削除）には役に立ちません。CDCは、ほぼリアルタイムのデータを持つ別の障害領域に別のクラスタを保持する。開発環境以上のものには、両方が必要です。</p>
<p><strong>Q: Milvus CDCは他のベクターデータベースのレプリケーションと比較してどうですか？</strong></p>
<p>現在、ほとんどのベクターデータベースはノードレベルの冗長性（マルチレプリカに相当）は提供していますが、クラスタレベルのレプリケーションは提供していません。PostgreSQLやMySQLのようなリレーショナルデータベースが何十年も使ってきたのと同じパターンです。クロスクラスタやクロスリージョンのフェイルオーバーが要件である場合、これは評価すべき重要な差別化要因となる。</p>
