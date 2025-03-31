---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 ロードマップ - ご意見をお聞かせください。
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  2025年には、Milvus 2.6とMilvus
  3.0という2つのメジャーバージョンと、その他多くの技術的特徴を展開します。皆様のご意見、ご感想をお待ちしております。
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Milvusユーザーの皆様、ご協力者の皆様、こんにちは！</p>
<p><a href="https://milvus.io/docs/roadmap.md"><strong>Milvus 2025ロードマップを</strong></a>皆様と共有できることを嬉しく思います。この技術計画では、Milvusが皆様のベクトル検索ニーズに対してより強力なものとなるよう、主要な機能や改善点をハイライトしています。</p>
<p>しかし、これはほんの始まりに過ぎません！皆様からのフィードバックがMilvusを形作り、現実の課題に対応できるように進化させていきます。皆様のご意見をお聞かせいただき、ロードマップの改良にお役立てください。</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">現在の状況<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>過去1年間、多くの皆様がMilvusを使用して、モデル統合、全文検索、ハイブリッド検索など、Milvusの人気機能の多くを活用した印象的なRAGおよびエージェントアプリケーションを構築されているのを目の当たりにしてきました。皆様の実装は、現実世界のベクトル検索要件に対する貴重な洞察を与えてくれました。</p>
<p>AI技術の進化に伴い、基本的なベクトル検索から、インテリジェントエージェント、自律システム、具現化AIにまたがる複雑なマルチモーダルアプリケーションまで、お客様のユースケースはより高度になっています。このような技術的課題から、Milvusはロードマップを作成し、お客様のニーズに応えるべく開発を続けています。</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">2025年に2つのメジャーリリースMilvus 2.6とMilvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>2025年には2つのメジャーバージョンをリリースします：Milvus 2.6（CY25年中頃）とMilvus 3.0（2025年末）です。</p>
<p><strong>Milvus 2.6は</strong>、皆様からご要望の多かったコアアーキテクチャの改善に重点を置いています：</p>
<ul>
<li><p>より少ない依存関係でよりシンプルなデプロイメント（デプロイメントの頭痛の種にさようなら！）。</p></li>
<li><p>データ取り込みパイプラインの高速化</p></li>
<li><p>ストレージコストの削減（お客様の生産コストに関する懸念をお聞きしています。）</p></li>
<li><p>大規模なデータ操作（削除/変更）の処理向上</p></li>
<li><p>より効率的なスカラー検索と全文検索</p></li>
<li><p>最新のエンベッディングモデルのサポート</p></li>
</ul>
<p><strong>Milvus3.0は</strong>、ベクターデータレイクシステムを導入し、より大きなアーキテクチャの進化を遂げました：</p>
<ul>
<li><p>シームレスなAIサービス統合</p></li>
<li><p>次のレベルの検索機能</p></li>
<li><p>より堅牢なデータ管理</p></li>
<li><p>膨大なオフラインデータセットの取り扱い向上</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">私たちが計画している技術的な特徴 - ご意見をお聞かせください<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>以下は、Milvusに追加を予定している主な技術機能です。</p>
<table>
<thead>
<tr><th><strong>主要機能エリア</strong></th><th><strong>技術的特徴</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>AIによる非構造化データ処理</strong></td><td>- データイン/アウト：主要なモデルサービスとのネイティブ統合による生テキストの取り込み<br>- オリジナルデータの取り扱い：生データ処理のためのテキスト/URL参照サポート<br>- テンソルのサポート：ベクトルリストの実装（ColBERT/CoPali/Videoシナリオ用）<br>- 拡張データ型：DateTime、Map、要件に基づくGISサポート<br>- 反復検索：ユーザーのフィードバックによるクエリーベクトルの改良</td></tr>
<tr><td><strong>検索品質とパフォーマンスの向上</strong></td><td>- 高度なマッチング: フレーズマッチとマルチマッチ機能<br>- Analyzerのアップグレード：Analyzerの機能強化により、トークナイザーのサポートが拡張され、観測可能性が向上<br>- JSONの最適化：インデックスの改善によるフィルタリングの高速化<br>- 実行ソート：スカラーフィールドに基づく結果の順序付け<br>- 高度な再ランカー：モデルベースの再ランク付けとカスタムスコアリング関数<br>- 反復検索：ユーザーからのフィードバックによるクエリーベクトルの改良</td></tr>
<tr><td><strong>データ管理の柔軟性</strong></td><td>- スキーマ変更：フィールドの追加/削除、varchar長さの変更<br>- スカラー集計: count/distinct/min/max操作<br>- UDFのサポート：ユーザー定義関数のサポート<br>- データのバージョン管理：スナップショットベースのロールバックシステム<br>- データ・クラスタリング：コンフィギュレーションによるコロケーション<br>- データサンプリング：サンプリングデータに基づく高速結果取得</td></tr>
<tr><td><strong>アーキテクチャの改善</strong></td><td>- ストリームノード：インクリメンタルなデータ取り込みの簡素化<br>- MixCoord：統一されたコーディネーター・アーキテクチャ<br>- ログストアの独立性：パルサーのような外部依存を削減<br>- PK重複排除：グローバルな主キー重複排除</td></tr>
<tr><td><strong>コスト効率とアーキテクチャの改善</strong></td><td>- 階層ストレージ：ホット／コールド・データ分離によるストレージ・コストの削減<br>- データ消去ポリシー：ユーザーが独自のデータ消去ポリシーを定義可能<br>- 一括更新：フィールド固有の値の変更、ETLなどをサポート<br>- Large TopK: 巨大なデータセットを返す<br>- VTS GA：さまざまなデータソースに接続<br>- 高度な量子化：量子化技術に基づくメモリ消費とパフォーマンスの最適化<br>- リソースの弾力性：書き込み負荷、読み取り負荷、バックグラウンド・タスク負荷の変化に対応するため、リソースを動的に拡張します。</td></tr>
</tbody>
</table>
<p>このロードマップを実施するにあたり、以下の点についてご意見・ご感想をお寄せいただければ幸いです：</p>
<ol>
<li><p><strong>機能の優先順位：</strong>ロードマップの中で、あなたの仕事に最も影響を与える機能はどれですか？</p></li>
<li><p><strong>実装のアイデア：</strong>これらの機能に対して有効だと思われる具体的なアプローチがあれば教えてください。</p></li>
<li><p><strong>ユースケースの整合性：</strong>これらの計画されている機能は、現在および将来のユースケースとどのように整合していますか？</p></li>
<li><p><strong>パフォーマンスに関する考慮事項：</strong>あなたの特定のニーズに対して、私たちがフォーカスすべきパフォーマンス面があれば教えてください。</p></li>
</ol>
<p><strong>皆様の洞察は、Milvusをより良いものにするための一助となります。<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvusディスカッションフォーラム</a>または<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルにて</a>、お気軽にご意見をお聞かせください。</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Milvusへの貢献を歓迎します。<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>オープンソースプロジェクトとして、Milvusは常に皆様の貢献をお待ちしております：</p>
<ul>
<li><p><strong>フィードバックを共有しましょう：</strong> <a href="https://github.com/milvus-io/milvus/issues">GitHubのissue</a>ページから問題を報告したり、機能を提案してください<a href="https://github.com/milvus-io/milvus/issues">。</a></p></li>
<li><p><strong>コードへの貢献</strong>プルリクエストの提出 (<a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">コントリビューターガイドを</a>参照)</p></li>
<li><p><strong>情報を広める:</strong>Milvusの経験を共有し、<a href="https://github.com/milvus-io/milvus">GitHubリポジトリに投稿してください。</a></p></li>
</ul>
<p>Milvusの次の章を皆さんと一緒に作り上げていくことに興奮しています。あなたのコード、アイデア、フィードバックがこのプロジェクトを前進させます！</p>
<p>- Milvusチーム</p>
