---
id: Whats-Inside-Milvus-1.0.md
title: Milvus1.0の中身は？
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: Milvus v1.0がリリースされました。Milvus v1.0の主な機能とともに、Milvusの基礎についてご紹介します。
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Milvus1.0の中身とは？</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvusは、100万、10億、あるいは1兆もの巨大なベクトルデータセットを管理するために設計されたオープンソースのベクトルデータベースです。Milvusは、新薬の発見、コンピューター・ビジョン、自律走行、レコメンデーション・エンジン、チャットボットなど、幅広い応用が可能です。</p>
<p>2021年3月、Milvusを開発するZilliz社は、プラットフォーム初の長期サポートバージョンであるMilvus v1.0をリリースした。数ヶ月に及ぶ広範なテストの後、世界で最も人気のあるベクターデータベースの安定した量産可能なバージョンは、プライムタイムの準備が整いました。このブログでは、Milvusの基礎知識とv1.0の主な機能についてご紹介します。</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Milvusのディストリビューション</h3><p>Milvusには、CPUのみのディストリビューションとGPU対応のディストリビューションがあります。前者はインデックス構築と検索をCPUのみに依存し、後者はMilvusをさらに高速化するCPUとGPUのハイブリッド検索とインデックス構築を可能にする。例えば、ハイブリッドディストリビューションを使用すると、CPUを検索に、GPUをインデックス構築に使用することができ、クエリの効率をさらに向上させることができる。</p>
<p>どちらのMilvusディストリビューションもDockerで利用可能です。DockerからMilvusをコンパイルするか（オペレーティングシステムがサポートしている場合）、Linux上でソースコードからMilvusをコンパイルすることができます（他のオペレーティングシステムはサポートしていません）。</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">ベクトルの埋め込み</h3><p>Milvusではベクターはエンティティとして格納されます。各エンティティは1つのベクトルIDフィールドと1つのベクトルフィールドを持ちます。Milvus v1.0は整数ベクトルIDのみをサポートしています。Milvusでコレクションを作成する際、ベクターIDは自動生成または手動で定義することができます。Milvusは自動生成されたベクターIDが一意であることを保証しますが、手動で定義されたIDはMilvus内で重複する可能性があります。手動でIDを定義する場合、すべてのIDが一意であることを確認する責任はユーザーにあります。</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">パーティション</h3><p>Milvusはコレクション内にパーティションを作成することができます。データが定期的に挿入され、過去のデータが重要でない場合（ストリーミングデータなど）、パーティションを使用することでベクトルの類似性検索を高速化することができます。1つのコレクションは最大4,096のパーティションを持つことができます。特定のパーティション内でベクトル検索を指定すると、検索が絞り込まれ、特に1兆個以上のベクトルを含むコレクションでは、クエリ時間が大幅に短縮される可能性があります。</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">インデックスアルゴリズムの最適化</h3><p>Milvusは、Faiss、NMSLIB、Annoyなど、広く採用されている複数のインデックスライブラリの上に構築されています。Milvusは、これらのインデックスライブラリの基本的なラッパー以上のものです。以下は、基礎となるライブラリに加えられた主な機能強化の一部である：</p>
<ul>
<li>Elkan k-meansアルゴリズムを使用したIVFインデックス性能の最適化。</li>
<li>FLAT検索の最適化。</li>
<li>IVF_SQ8Hハイブリッドインデックスのサポート。データの精度を犠牲にすることなく、インデックスファイルのサイズを最大75%削減することができます。IVF_SQ8HはIVF_SQ8をベースに構築されており、同一のリコール率でありながら、クエリー速度が大幅に高速化されている。IVF_SQ8HはGPUの並列処理能力とCPU/GPUコプロセッシングの相乗効果の可能性を活用するためにMilvusのために特別に設計されました。</li>
<li>動的命令セットの互換性</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">検索、インデックス構築、その他のMilvus最適化</h3><p>Milvusでは、検索およびインデックス構築のパフォーマンスを向上させるため、以下の最適化が行われています。</p>
<ul>
<li>検索性能は、クエリー数(nq)がCPUスレッド数より少ない場合に最適化される。</li>
<li>Milvusは同じtopKと検索パラメータを持つクライアントからの検索リクエストを結合する。</li>
<li>インデックス構築は検索要求が来ると中断される。</li>
<li>Milvusは開始時に自動的にコレクションをメモリにプリロードする。</li>
<li>ベクトル類似検索の高速化のために複数のGPUデバイスを割り当てることができる。</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">距離メトリクス</h3><p>Milvusはベクトル類似検索のために構築されたベクトルデータベースです。このプラットフォームは、MLOpsやプロダクションレベルのAIアプリケーションを念頭に構築されています。Milvusは、ユークリッド距離（L2）、内積（IP）、ジャカード距離、谷本、ハミング距離、上部構造、下部構造など、類似度を計算するための幅広い距離メトリクスをサポートしています。最後の2つのメトリックスは、分子検索やAIによる新薬探索で一般的に使用されている。</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">ロギング</h3><p>milvusはログローテーションをサポートしている。システム設定ファイルのmilvus.yamlでは、1つのログファイルのサイズ、ログファイルの数、標準出力へのログ出力を設定できる。</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">分散ソリューション</h3><p>MilvusのシャーディングミドルウェアであるMishardsは、Milvusの分散ソリューションです。1つの書き込みノードと無制限の読み取りノードを持つMishardsは、サーバクラスタの計算能力を解き放ちます。リクエスト転送、リード/ライト分割、動的/水平スケーリングなどの機能を備えています。</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">モニタリング</h3><p>Milvusは、オープンソースのシステム監視およびアラートツールキットであるPrometheusと互換性があります。MilvusはPrometheusのPushgatewayのサポートを追加し、Prometheusによる短時間のバッチメトリクスの取得を可能にします。監視・アラートシステムは以下のように動作します：</p>
<ul>
<li>MilvusサーバーはカスタマイズされたメトリクスデータをPushgatewayにプッシュします。</li>
<li>Pushgatewayは、エフェメラルなメトリクス・データがPrometheusに安全に送信されるようにします。</li>
<li>PrometheusはPushgatewayからデータを取得し続けます。</li>
<li>Alertmanagerを使用して、さまざまな指標のアラートしきい値を設定し、電子メールまたはメッセージでアラートを送信します。</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">メタデータ管理</h3><p>Milvusはデフォルトでメタデータ管理にSQLiteを使用します。SQLiteはMilvusに実装されており、設定は不要です。本番環境では、メタデータ管理にMySQLを使用することをお勧めします。</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">オープンソースコミュニティ</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを検索したり、Milvusに貢献することができます。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>私たちとつながりましょう。</li>
</ul>
