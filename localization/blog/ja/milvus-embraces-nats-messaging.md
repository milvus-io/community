---
id: milvus-embraces-nats-messaging.md
title: データ通信の最適化：Milvus、NATSメッセージングを採用
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: NATSとMilvusの統合について、その機能、セットアップ、移行プロセス、パフォーマンステストの結果を紹介。
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>データ処理という複雑なタペストリーにおいて、シームレスなコミュニケーションは業務を結びつける糸である。<a href="https://zilliz.com/cloud">オープンソースのベクターデータベースの</a>先駆者である<a href="https://zilliz.com/what-is-milvus">Milvusは</a>、その最新機能で変革の旅に出ました：NATSメッセージングの統合です。この包括的なブログポストでは、この統合の複雑さを解き明かし、そのコア機能、セットアッププロセス、移行のメリット、そして前身であるRocksMQとの違いを探ります。</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Milvusにおけるメッセージキューの役割を理解する<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのクラウドネイティブアーキテクチャにおいて、メッセージキュー（Log Broker）は極めて重要な役割を担っている。これは、永続的なデータストリーム、同期、イベント通知、システム復旧時のデータ整合性を保証するバックボーンです。従来、Milvusスタンドアロン・モードでは、特にPulsarやKafkaと比較した場合、RocksMQが最も分かりやすい選択肢でしたが、膨大なデータや複雑なシナリオでは、その限界が明らかになりました。</p>
<p>Milvus 2.3では、シングル・ノードMQ実装であるNATSが導入され、データ・ストリームの管理方法が再定義されました。NATSは従来のものとは異なり、Milvusユーザをパフォーマンスの制約から解放し、大容量のデータをシームレスに処理できるようにします。</p>
<h2 id="What-is-NATS" class="common-anchor-header">NATSとは？<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATSはGoで実装された分散システム接続技術です。システム間のRequest-ReplyやPublish-Subscribeのような様々な通信モードをサポートし、JetStreamによるデータの永続性を提供し、組み込みのRAFTによる分散機能を提供します。NATSの詳細については<a href="https://nats.io/">NATS公式サイトを</a>参照してください。</p>
<p>Milvus2.3スタンドアロンモードでは、NATS、JetStream、PubSubはMilvusに堅牢なMQ機能を提供します。</p>
<h2 id="Enabling-NATS" class="common-anchor-header">NATSの有効化<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3では、<code translate="no">mq.type</code> という新しいコントロールオプションが用意されており、使用するMQのタイプを指定することができます。NATSを有効にするには、<code translate="no">mq.type=natsmq</code> を設定します。Milvusインスタンスを起動した後、以下のようなログが表示されれば、メッセージキューとしてNATSを有効にしたことになります。</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">MilvusのNATSの設定<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>NATSのカスタマイズオプションには、リスニングポート、JetStreamストレージディレクトリ、最大ペイロードサイズ、および初期化タイムアウトの指定が含まれます。これらの設定を微調整することで、最適なパフォーマンスと信頼性を確保することができます。</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>注意してください：</strong></p>
<ul>
<li><p>NATSサーバーのリスニングには、<code translate="no">server.port</code> を指定する必要があります。ポートが競合すると、Milvusは起動できません。<code translate="no">server.port=-1</code> をランダムにポートを選択するように設定してください。</p></li>
<li><p><code translate="no">storeDir</code> JetStreamストレージのディレクトリを指定します。Milvusの読み書きスループットを向上させるため、高性能なソリッドステートドライブ(SSD)にディレクトリを保存することを推奨します。</p></li>
<li><p><code translate="no">maxFileStore</code> JetStreamストレージサイズの上限を設定します。この上限を超えると、それ以降のデータ書き込みができなくなります。</p></li>
<li><p><code translate="no">maxPayload</code> 個々のメッセージサイズを制限します。書き込み拒否を避けるため、5MB以上にしておく必要があります。</p></li>
<li><p><code translate="no">initializeTimeout</code>NATSサーバーの起動タイムアウトを制御します。</p></li>
<li><p><code translate="no">monitor</code> NATSの独立ログを設定します。</p></li>
<li><p><code translate="no">retention</code> NATSメッセージの保持メカニズムを制御します。</p></li>
</ul>
<p>詳細は<a href="https://docs.nats.io/running-a-nats-service/configuration">NATSの公式ドキュメントを</a>参照してください。</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">RocksMQからNATSへの移行<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>RocksMQからNATSへの移行は、書き込み操作の停止、データのフラッシュ、設定の変更、milvusのログによる移行の検証といったステップを含むシームレスなプロセスです。</p>
<ol>
<li><p>移行を開始する前に、milvusで全ての書き込み操作を停止します。</p></li>
<li><p>Milvusで<code translate="no">FlushALL</code> 操作を実行し、その完了を待ちます。このステップにより、保留中のデータがすべてフラッシュされ、システムがシャットダウンできる状態になります。</p></li>
<li><p>Milvus設定ファイルを変更し、<code translate="no">mq.type=natsmq</code> を設定し、<code translate="no">natsmq</code> セクションの関連オプションを調整します。</p></li>
<li><p>Milvus 2.3 を起動する。</p></li>
<li><p><code translate="no">rocksmq.path</code> ディレクトリに保存されているオリジナルデータをバックアップし、クリーンアップする。(オプション)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: パフォーマンス対決<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pub/Sub パフォーマンステスト</h3><ul>
<li><p><strong>テスト・プラットフォーム</strong>M1 Proチップ / メモリ：16GB</p></li>
<li><p><strong>テストシナリオ</strong>トピックへのランダムなデータパケットのサブスクライブとパブリッシュを、最後にパブリッシュされた結果を受信するまで繰り返す。</p></li>
<li><p><strong>結果</strong></p>
<ul>
<li><p>小さいデータパケット（64kb未満）では、RocksMQがメモリ、CPU、応答速度でNATSを上回る。</p></li>
<li><p>より大きなデータパケット（64kb以上）では、NATSがRocksMQを凌駕し、レスポンスタイムがはるかに速い。</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>テストタイプ</th><th>MQ</th><th>演算回数</th><th>opあたりのコスト</th><th>メモリコスト</th><th>CPU総時間</th><th>ストレージコスト</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4.29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>ロックMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 パブ/サブ</td><td>NATS</td><td>50</td><td>2.248722593 S/OP</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 パブ/サブ</td><td>ロックMQ</td><td>50</td><td>2.554614279 S/OP</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 S/OP</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>ロックMQ</td><td>50</td><td>3.253778195 S/OP</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 パブ/サブ</td><td>NATS</td><td>50</td><td>2.629391004 S/OP</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 パブ/サブ</td><td>ロックMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>表 1: Pub/Sub パフォーマンステスト結果</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus統合テスト</h3><p><strong>データサイズ:</strong>100M</p>
<p><strong>結果</strong>1億のベクトルデータセットを用いた広範なテストにおいて、NATSはベクトル検索とクエリのレイテンシが低いことを示した。</p>
<table>
<thead>
<tr><th>指標</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>平均ベクトル検索レイテンシ</td><td>23.55</td><td>20.17</td></tr>
<tr><td>ベクトル検索リクエスト/秒（RPS）</td><td>2.95</td><td>3.07</td></tr>
<tr><td>平均クエリ待ち時間</td><td>7.2</td><td>6.74</td></tr>
<tr><td>クエリーリクエスト/秒（RPS）</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>表2: 100MデータセットによるMilvus統合テスト結果</p>
<p><strong>データセット: &lt;100M</strong></p>
<p><strong>結果</strong>100M未満のデータセットでは、NATSとRocksMQは同程度のパフォーマンスを示している。</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">結論NATSメッセージングによるMilvusの強化<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusにNATSが統合されたことで、データ処理は大きく前進した。リアルタイム分析、機械学習アプリケーション、あるいはデータ集約的なベンチャーであろうと、NATSは効率性、信頼性、スピードでプロジェクトを強化します。データ環境が進化する中、MilvusにNATSのような堅牢なメッセージングシステムがあれば、シームレスで信頼性が高く、パフォーマンスの高いデータ通信が可能になります。</p>
