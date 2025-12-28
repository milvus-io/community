---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Milvus 2.5.xからMilvus 2.6.xへの安全なアップグレード方法
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/Milvus_2_5_x_to_Milvus_2_6_x_cd2a5397fc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: Milvus 2.6でのアーキテクチャの変更や主要な機能を含む新機能をご紹介し、Milvus 2.5からのローリングアップグレードの方法をご紹介します。
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6が</strong></a>リリースされてしばらく経つが、プロジェクトにとって確かな前進であることが証明された。このリリースは、洗練されたアーキテクチャ、より強力なリアルタイムパフォーマンス、より少ないリソース消費、そして本番環境におけるよりスマートなスケーリング動作をもたらします。これらの改善点の多くは、ユーザーからのフィードバックによって直接形作られたものであり、2.6.xを早期に導入したユーザーからは、重いワークロードや動的なワークロードの下で、検索が著しく高速になり、システムのパフォーマンスがより予測しやすくなったという報告がすでに寄せられています。</p>
<p>Milvus 2.5.xを運用し、2.6.xへの移行を検討しているチームにとって、本ガイドは出発点となるものです。アーキテクチャの違いを分解し、Milvus 2.6で導入された主要な機能に焦点を当て、運用の中断を最小限に抑えるよう設計された、実践的でステップバイステップのアップグレードパスを提供します。</p>
<p>リアルタイムパイプライン、マルチモーダル検索、ハイブリッド検索、大規模なベクトル操作などのワークロードをお持ちの場合、このブログは、2.6がお客様のニーズに合致しているかどうかを評価し、続行することを決定した場合、データの整合性とサービスの可用性を維持しながら、自信を持ってアップグレードするのに役立ちます。</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Milvus 2.5からMilvus 2.6へのアーキテクチャの変更点<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>アップグレードワークフローそのものに入る前に、まずMilvus 2.6でMilvusアーキテクチャがどのように変更されるのかを理解しましょう。</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5のアーキテクチャ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.5 アーキテクチャ</span> </span></p>
<p>Milvus 2.5では、ストリーミングワークフローとバッチワークフローが複数のワーカーノードで絡み合っていました：</p>
<ul>
<li><p><strong>QueryNodeは</strong>履歴<em>クエリと</em>インクリメンタル（ストリーミング）クエリの両方を処理した。</p></li>
<li><p><strong>DataNodeは</strong>、<em>インジェスト・タイム・フラッシングと</em>履歴データのバックグラウンド・コンパクションの両方を処理した。</p></li>
</ul>
<p>このようにバッチとリアルタイムのロジックが混在していたため、バッチのワークロードを独立してスケールすることが困難だった。また、ストリーミングの状態が複数のコンポーネントに散らばっていたため、同期の遅延が発生し、障害復旧が複雑になり、運用が複雑になっていました。</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6アーキテクチャ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.6のアーキテクチャ</span> </span></p>
<p>Milvus 2.6では、メッセージキューの消費、増分セグメントの書き込み、増分クエリの提供、WALベースのリカバリの管理など、すべてのリアルタイムデータを処理する専用の<strong>StreamingNodeが</strong>導入されました。ストリーミングが分離されたことで、残りのコンポーネントはよりすっきりとした、よりフォーカスされた役割を担うようになりました：</p>
<ul>
<li><p><strong>QueryNode は</strong>履歴セグメントに対する<em>バッチクエリのみを</em>処理します。</p></li>
<li><p><strong>DataNodeは</strong>、コンパクションやインデックス構築などの履歴データ<em>タスクのみを</em>処理します。</p></li>
</ul>
<p>StreamingNodeは、Milvus 2.5ではDataNode、QueryNode、そしてProxyに分かれていたストリーミング関連のタスクをすべて吸収し、役割を明確にし、クロスロールの状態共有を減らします。</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.xとMilvus 2.6.xの比較：コンポーネントごとの比較</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>変更点</strong></th></tr>
</thead>
<tbody>
<tr><td>コーディネーターサービス</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (または MixCoord)</td><td style="text-align:center">ミックスコード</td><td style="text-align:center">メタデータ管理とタスクスケジューリングが単一のMixCoordに統合され、コーディネーションロジックが簡素化され、分散の複雑さが軽減されました。</td></tr>
<tr><td>アクセスレイヤー</td><td style="text-align:center">プロキシ</td><td style="text-align:center">プロキシ</td><td style="text-align:center">書き込みリクエストはStreaming Nodeを通してのみルーティングされ、データを取り込む。</td></tr>
<tr><td>ワーカーノード</td><td style="text-align:center">-</td><td style="text-align:center">ストリーミング・ノード</td><td style="text-align:center">増分データの取り込み - 増分データのクエリ - オブジェクトストレージへの増分データの永続化 - ストリームベースの書き込み - WALに基づく障害回復を含む、すべての増分（成長セグメント）ロジックを担当する専用のストリーミング処理ノード。</td></tr>
<tr><td></td><td style="text-align:center">クエリーノード</td><td style="text-align:center">クエリーノード</td><td style="text-align:center">過去のデータに対するクエリのみを処理するバッチ処理ノード。</td></tr>
<tr><td></td><td style="text-align:center">データノード</td><td style="text-align:center">データノード</td><td style="text-align:center">コンパクションやインデックス構築を含む、履歴データのみを扱うバッチ処理ノード。</td></tr>
<tr><td></td><td style="text-align:center">インデックス・ノード</td><td style="text-align:center">-</td><td style="text-align:center">インデックスノードはデータノードに統合され、役割定義と展開トポロジーが簡素化される。</td></tr>
</tbody>
</table>
<p>つまり、Milvus 2.6では、ストリーミングとバッチのワークロードに明確な線引きがなされ、2.5で見られたようなコンポーネントをまたいだもつれがなくなり、よりスケーラブルで保守性の高いアーキテクチャが実現されています。</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6機能ハイライト<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>アップグレードのワークフローに入る前に、Milvus 2.6が何をもたらすかを簡単にご紹介します。<strong>本リリースでは、インフラコストの削減、検索パフォーマンスの向上、大規模でダイナミックなAIワークロードのスケーリングを容易にすることに重点を置いています。</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">コストと効率の改善</h3><ul>
<li><p><strong>プライマリ・インデックスの</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>量子化</strong>- ベクトル・インデックスを元のサイズの<strong>1/32に</strong>圧縮する新しい1ビット量子化手法。SQ8リランキングと組み合わせることで、メモリ使用量を約28%削減し、QPSを4倍向上。</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25最適化</strong></a><strong>全文検索</strong>- スパースな用語重みベクトルによるネイティブBM25スコアリング。キーワード検索はElasticsearchと比較して<strong>3～4倍</strong>（データセットによっては最大<strong>7倍</strong>）<strong>高速に</strong>実行され、インデックスサイズは元のテキストデータの3分の1程度に抑えられます。</p></li>
<li><p><strong>JSONシュレッディングによるJSONパスインデックス</strong>- ネストされたJSONの構造化フィルタリングが劇的に高速化し、より予測しやすくなりました。事前にインデックス化されたJSONパスにより、フィルターのレイテンシーが<strong>140 msから1.5 msに</strong>短縮され（P99：<strong>480 msから10 ms</strong>）、ハイブリッドベクター検索＋メタデータフィルタリングの応答性が大幅に向上しました。</p></li>
<li><p><strong>拡張されたデータ型サポート</strong>- Int8ベクトル型、<a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">ジオメトリフィールド</a>（POINT / LINESTRING / POLYGON）、Array-of-Structsを追加。これらの拡張は、地理空間ワークロード、より豊富なメタデータモデリング、よりクリーンなスキーマをサポートします。</p></li>
<li><p><strong>部分更新の Upsert</strong>- 1 回の主キー呼び出しでエンティティの挿入や更新ができるようになりました。部分更新では、提供されたフィールドのみが変更されるため、書き込みの増幅が減少し、メタデータや埋め込みを頻繁に更新するパイプラインが簡素化されます。</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">検索と取得の強化</h3><ul>
<li><p><strong>テキスト処理と多言語サポートの向上：</strong>新しいLinderaとICUトークナイザーにより、日本語、韓国語、<a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">多言語の</a>テキスト処理が改善されました。Jieba はカスタム辞書をサポートします。<code translate="no">run_analyzer</code> はトークン化の動作のデバッグを支援し、多言語アナライザは一貫したクロスランゲージ検索を保証します。</p></li>
<li><p><strong>高精度テキストマッチング:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">フレーズマッチは</a>、設定可能なスロープを持つ順序付きフレーズクエリを強制します。新しい<a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a>インデックスは、VARCHARフィールドとJSONパスの両方で部分文字列と<code translate="no">LIKE</code> クエリを高速化し、高速な部分テキストとファジーマッチングを可能にします。</p></li>
<li><p><strong>時間を考慮した再ランキングとメタデータを考慮した再ランキング：</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Decay Rankers</a>(exponential, linear, Gaussian)はタイムスタンプを使ってスコアを調整し、<a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Boost Rankersは</a>メタデータドリブンのルールを適用して結果を昇格または降格させます。どちらも、基礎となるデータを変更することなく、検索動作を微調整するのに役立ちます。</p></li>
<li><p><strong>簡素化されたモデル統合と自動ベクトル化：</strong>OpenAI、Hugging Face、その他のエンベッディングプロバイダとの統合により、Milvusは挿入やクエリ操作の際にテキストを自動的にベクトル化します。一般的なユースケースにおいて、手作業による埋め込みパイプラインはもう必要ありません。</p></li>
<li><p><strong>スカラーフィールドのオンラインスキーマ更新：</strong>ダウンタイムやリロードなしで既存のコレクションに新しいスカラーフィールドを追加し、メタデータ要件の増加に伴うスキーマの進化を簡素化します。</p></li>
<li><p><strong>MinHashによる重複検出：</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a>+ LSHにより、高価な厳密比較を行うことなく、大規模なデータセット全体で効率的に重複を検出できます。</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">アーキテクチャとスケーラビリティのアップグレード</h3><ul>
<li><p><strong>ホット/コールドデータ管理のための</strong><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>階層型ストレージ：</strong></a>遅延ロードと部分ロードをサポートし、コレクションをローカルに完全にロードする必要性を排除。リソース使用量を最大50%削減し、大規模データセットのロード時間を短縮。</p></li>
<li><p><strong>リアルタイム・ストリーミング・サービス：</strong>Kafka/Pulsarと統合された専用のストリーミング・ノードを追加し、継続的なインジェストを実現。即時のインデックス作成とクエリ可用性を可能にし、書き込みスループットを向上させ、リアルタイムで変化の速いワークロードの障害回復を高速化します。</p></li>
<li><p><strong>拡張性と安定性の強化：</strong>Milvusは、大規模なマルチテナント環境向けに100,000以上のコレクションをサポートするようになりました。<a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a>（ゼロディスクWAL）、<a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a>（IOPS/メモリの削減）、<a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Mergeといった</a>インフラストラクチャーのアップグレードにより、クラスタの安定性が向上し、高負荷時でも予測可能なスケーリングが可能になりました。</p></li>
</ul>
<p>Milvus 2.6機能の完全なリストについては、<a href="https://milvus.io/docs/release_notes.md">Milvusリリースノートを</a>ご覧ください。</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Milvus 2.5.xからMilvus 2.6.xへのアップグレード方法<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5クラスタからMilvus 2.6へのアップグレードは、アップグレード中も可能な限りシステムを利用可能な状態に保つため、以下の順序で行ってください。</p>
<p><strong>1.ストリーミングノードを最初に起動する</strong></p>
<p>Streaming Nodeを先に起動する。新しい<strong>Delegator</strong>(Query Nodeの中でストリーミングデータの処理を担当するコンポーネント)をMilvus 2.6 Streaming Nodeに移動する必要があります。</p>
<p><strong>2.MixCoordのアップグレード</strong></p>
<p>コーディネータコンポーネントを<strong>MixCoordに</strong>アップグレードする。このステップでは、MixCoordは分散システム内のクロスバージョン互換性を処理するために、Worker Nodeのバージョンを検出する必要があります。</p>
<p><strong>3.クエリーノードのアップグレード</strong></p>
<p>Query Nodeのアップグレードには通常時間がかかります。この段階では、Milvus 2.5データノードとインデックスノードはフラッシュやインデックス構築などの処理を継続することができ、クエリノードのアップグレード中にクエリサイドのプレッシャーを軽減することができます。</p>
<p><strong>4.データノードのアップグレード</strong></p>
<p>Milvus 2.5 データノードがオフラインになると、Flush 操作は利用できなくなり、すべてのノードが Milvus 2.6 に完全にアップグレードされるまで、Growing Segment のデータは蓄積され続ける可能性があります。</p>
<p><strong>5.プロキシのアップグレード</strong></p>
<p>ProxyをMilvus 2.6にアップグレードした後、すべてのクラスタコンポーネントが2.6にアップグレードされるまで、そのProxyに対する書き込み操作は利用できません。</p>
<p><strong>6.インデックスノードの削除</strong></p>
<p>他のすべてのコンポーネントがアップグレードされたら、スタンドアロンのIndex Nodeを安全に取り外すことができます。</p>
<p><strong>注意事項</strong></p>
<ul>
<li><p>DataNodeのアップグレードが完了してからProxyのアップグレードが完了するまで、フラッシュ操作は利用できません。</p></li>
<li><p>最初のProxyがアップグレードされてからすべてのProxyノードがアップグレードされるまでの間、一部の書き込み操作は利用できません。</p></li>
<li><p><strong>Milvus2.5.xから2.6.6へ直接アップグレードする場合、DDLフレームワークの変更により、アップグレード中はDDL(Data Definition Language)オペレーションが利用できません。</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Milvus Operatorを使用したMilvus 2.6へのアップグレード方法<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operatorは</a>オープンソースのKubernetesオペレータであり、対象のKubernetesクラスタ上にMilvusサービススタック全体をデプロイ、管理、アップグレードするためのスケーラブルで可用性の高い方法を提供します。オペレータが管理するMilvusサービススタックには以下が含まれます：</p>
<ul>
<li><p>Milvusのコアコンポーネント</p></li>
<li><p>etcd、Pulsar、MinIOなどの必要な依存関係</p></li>
</ul>
<p>Milvus Operatorは、標準のKubernetes Operatorパターンに従います。バージョン、トポロジー、構成など、Milvusクラスタの望ましい状態を記述するMilvusカスタムリソース（CR）を導入します。</p>
<p>コントローラはクラスタを継続的に監視し、CRで定義された望ましい状態と実際の状態を照合します。Milvusバージョンのアップグレードなどの変更が行われると、オペレータは制御された反復可能な方法でそれらを自動的に適用し、自動アップグレードと継続的なライフサイクル管理を可能にします。</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Milvusカスタムリソース(CR)の例</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Milvus OperatorによるMilvus 2.5から2.6へのローリングアップグレード</h3><p>Milvus Operatorは、クラスタモードで<strong>Milvus 2.5から2.6へのローリングアップグレードを</strong>ビルトインサポートしています。</p>
<p><strong>1.アップグレードシナリオの検出</strong></p>
<p>アップグレード中、Milvus Operatorはクラスタ仕様から対象のMilvusバージョンを決定します。これは次のいずれかによって行われます：</p>
<ul>
<li><p><code translate="no">spec.components.image</code> で定義されたイメージタグを検査する。</p></li>
<li><p>で指定された明示的なバージョンを読み取ります。<code translate="no">spec.components.version</code></p></li>
</ul>
<p><code translate="no">status.currentImage</code> <code translate="no">status.currentVersion</code>現在のバージョンが2.5で、希望するバージョンが2.6の場合、オペレータはアップグレードを2.5→2.6のアップグレードシナリオとして識別します。</p>
<p><strong>2.ローリングアップグレードの実行順序</strong></p>
<p>2.5から2.6へのアップグレードが検出され、アップグレードモードがローリングアップグレード(<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>)に設定されている場合、Milvus Operatorは、Milvus 2.6のアーキテクチャに沿った事前定義された順序で自動的にアップグレードを実行します：</p>
<p>ストリーミング・ノードの起動 → MixCoordのアップグレード → クエリ・ノードのアップグレード → データ・ノードのアップグレード → プロキシのアップグレード → インデックス・ノードの削除</p>
<p><strong>3.コーディネータの自動統合</strong></p>
<p>Milvus 2.6は複数のコーディネータコンポーネントを単一のMixCoordに置き換えます。Milvus Operatorは、このアーキテクチャの移行を自動的に処理します。</p>
<p><code translate="no">spec.components.mixCoord</code> が設定されると、オペレータは MixCoord を起動し、準備が整うまで待ちます。MixCoordが完全に稼動すると、オペレータはレガシーコーディネータコンポーネント（RootCoord、QueryCoord、DataCoord）を潔くシャットダウンし、手動で操作することなく移行を完了します。</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Milvus 2.5から2.6へのアップグレード手順</h3><p>1.Milvus Operatorを最新バージョンにアップグレードする(本ガイドでは、執筆時の最新リリースである<strong>バージョン1.3.</strong>3を使用する)</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.コーディネータコンポーネントをマージする</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.クラスタがMilvus 2.5.16以降を実行していることを確認します。</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.Milvusをバージョン2.6にアップグレードする。</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Helmを使用したMilvus 2.6へのアップグレード方法<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Helmを使用してMilvusをデプロイする場合、すべてのKubernetes<code translate="no">Deployment</code> リソースは実行順序を保証されることなく並行して更新されます。その結果、Helmはコンポーネント間のローリングアップグレードシーケンスを厳密に制御できません。そのため、本番環境ではMilvus Operatorの使用を強く推奨します。</p>
<p>Milvusは以下の手順でHelmを使用して2.5から2.6にアップグレードすることができます。</p>
<p>システム要件</p>
<ul>
<li><p><strong>Helmバージョン:</strong>≥ 3.14.0</p></li>
<li><p><strong>Kubernetesバージョン:</strong>≥ 1.20.0</p></li>
</ul>
<p>1.Milvus Helmチャートを最新バージョンにアップグレードする。本ガイドでは、執筆時点の最新である<strong>チャートバージョン5.0.7を</strong>使用する。</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.クラスタに複数のコーディネータコンポーネントがデプロイされている場合は、まずMilvusをバージョン2.5.16以降にアップグレードし、MixCoordを有効にします。</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.Milvusをバージョン2.6にアップグレードする。</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Milvus 2.6のアップグレードと運用に関するFAQ<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus HelmとMilvus Operator、どちらを使用すればよいですか？</h3><p>本番環境ではMilvus Operatorを強く推奨します。</p>
<p>詳細はオフィシャルガイド:<a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a>をご参照ください<a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">。</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: メッセージキュー(MQ)はどのように選択すればよいですか?</h3><p>推奨するMQは、導入形態や運用要件によって異なります：</p>
<p><strong>1.スタンドアロンモード：</strong>スタンドアロンモード：コストを重視する場合はRocksMQをお勧めします。</p>
<p><strong>2.クラスタ・モード</strong></p>
<ul>
<li><p><strong>Pulsarは</strong>マルチ・テナントをサポートし、大規模なクラスタがインフラを共有することを可能にし、強力な水平スケーラビリティを提供します。</p></li>
<li><p><strong>Kafkaは</strong>より成熟したエコシステムを持っており、ほとんどの主要クラウド・プラットフォームでマネージドSaaSを利用することができます。</p></li>
</ul>
<p><strong>3.Woodpecker (Milvus 2.6で導入)：</strong>Woodpeckerは外部メッセージキューの必要性をなくし、コストと運用の複雑さを軽減する。</p>
<ul>
<li><p>現在、軽量で運用が容易な組み込み型のWoodpeckerモードのみがサポートされています。</p></li>
<li><p>Milvus 2.6のスタンドアロン環境ではWoodpeckerを推奨します。</p></li>
<li><p>本番クラスタ環境では、Woodpeckerクラスタモードが利用可能になり次第、そちらを使用することをお勧めします。</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">Q3: アップグレード中にメッセージキューを切り替えることはできますか？</h3><p>アップグレード中にメッセージキューを切り替えることは現在サポートされていません。今後のリリースでは、Pulsar、Kafka、Woodpecker、RocksMQ間の切り替えをサポートする管理APIを導入する予定です。</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4: Milvus 2.6用にレート制限設定を更新する必要はありますか？</h3><p>既存のレート制限設定は有効で、新しいStreaming Nodeにも適用されます。変更は必要ありません。</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5: コーディネーターのマージ後、モニタリングロールやコンフィグレーションは変更されますか？</h3><ul>
<li><p>監視ロールは変更されません(<code translate="no">RootCoord</code>,<code translate="no">QueryCoord</code>,<code translate="no">DataCoord</code>)。</p></li>
<li><p>既存の設定オプションは以前と同様に機能します。</p></li>
<li><p>新しい設定オプション<code translate="no">mixCoord.enableActiveStandby</code> が導入され、明示的に設定されていない場合は<code translate="no">rootcoord.enableActiveStandby</code> にフォールバックします。</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: StreamingNodeの推奨リソース設定を教えてください。</h3><ul>
<li><p>軽いリアルタイム・インジェストや、時折のライト＆クエリ作業負荷の場合は、CPUコア2個、メモリ8GBといった小規模な構成で十分です。</p></li>
<li><p>ヘビーなリアルタイムインジェストや継続的なライト＆クエリワークロードの場合は、Query Nodeと同等のリソースを割り当てることをお勧めします。</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7: Docker Composeを使用したスタンドアロンデプロイのアップグレード方法を教えてください。</h3><p>Docker Composeベースのスタンドアロンデプロイの場合、<code translate="no">docker-compose.yaml</code> のMilvusイメージタグを更新するだけです。</p>
<p>詳細は公式ガイド<a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a>をご参照ください。</p>
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
    </button></h2><p>Milvus 2.6では、アーキテクチャと運用の両面で大きな改善がなされました。StreamingNode の導入によるストリーミング処理とバッチ処理の分離、コーディネー タの MixCoord への統合、ワーカーの役割の簡素化により、Milvus 2.6 は、大規模なベクタ ワークロードに対して、より安定でスケーラブルかつ運用しやすい基盤を提供します。</p>
<p>このようなアーキテクチャの変更により、特に Milvus 2.5 からのアップグレードは、より順番を重視するようになりました。アップグレードが成功するかどうかは、コンポーネントの依存関係と一時的な可用性の制約を尊重できるかどうかにかかっています。Milvus Operatorは、アップグレードの順序を自動化し、運用リスクを低減するため、本番環境では推奨されるアプローチです。</p>
<p>Milvus 2.6は、強化された検索機能、より豊富なデータタイプ、階層化されたストレージ、改善されたメッセージキューオプションにより、リアルタイムの取り込み、高いクエリパフォーマンス、スケールでの効率的な運用を必要とする最新のAIアプリケーションをサポートするのに十分なポジションにあります。</p>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Milvus 2.6に関するその他のリソース<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6リリースノート</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 ウェビナーの記録：より速い検索、より低いコスト、よりスマートなスケーリング</a></p></li>
<li><p>Milvus 2.6フィーチャーブログ</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介：Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">コールドデータへの支払い停止：Milvus階層型ストレージのオンデマンドホットコールドデータローディングによる80%のコスト削減</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">MilvusにおけるAISAQの導入: 10億スケールのベクトル検索がメモリ上で3,200倍安くなりました。</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">MilvusにおけるNVIDIA CAGRAの最適化: より高速なインデックス作成とより安価なクエリを実現するGPUとCPUのハイブリッドアプローチ</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Milvus Ngramインデックスを導入：エージェントワークロードのためのキーワードマッチングとLIKEクエリの高速化</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6におけるジオメトリフィールドとRTREEによる地理空間フィルタリングとベクトル検索の統合</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界でのベクトル検索：想起を犠牲にすることなく効率的にフィルタリングする方法</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく-ベクターDBは真のテストに値する</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusのためにKafka/PulsarをWoodpeckerに置き換えた。</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH：LLMトレーニングデータの重複と戦う秘密兵器</a></p></li>
</ul></li>
</ul>
