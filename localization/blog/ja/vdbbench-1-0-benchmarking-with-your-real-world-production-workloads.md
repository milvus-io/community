---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: VDBBench 1.0を発表：オープンソースのベクターデータベースベンチマーキングを実運用ワークロードで実現
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  VDBBench
  1.0は、実世界のデータ、ストリーミング・インジェスト、および並行ワークロードを使用してベクトル・データベースをベンチマークするためのオープンソース・ツールです。
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>ほとんどのベクトルデータベースベンチマークは、静的データと構築済みのインデックスでテストします。しかし、本番システムはそのようには動作しません。ユーザがクエリを実行する間、データは連続的に流れ、フィルタはインデックスを断片化し、パフォーマンス特性は同時読み書き負荷の下で劇的に変化します。</p>
<p>今日、私たちは<a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0を</strong></a>リリースします。このベンチマークは、ストリーミングデータの取り込み、様々な選択性を持つメタデータのフィルタリング、実際のシステムのボトルネックを明らかにする同時作業負荷など、現実的な運用条件下でベクターデータベースをテストするために一から設計されたオープンソースベンチマークです。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0をダウンロード →</strong></a><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>リーダーボードを表示 →</strong></a><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0をダウンロード</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">現在のベンチマークが誤解を招く理由<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>正直言って、この業界には奇妙な現象があります。誰もが「ベンチマークはゲームではない」と口にしますが、多くの人がまさにそのような行動に参加しています。ベクターデータベース市場が2023年に爆発的に成長して以来、私たちは「ベンチマークは美しく」ても本番では「惨敗」し、エンジニアリング時間を浪費し、プロジェクトの信頼性を損なうシステムの例を数多く見てきました。</p>
<p>我々はこの断絶を目の当たりにしてきた。例えば、Elasticsearchはミリ秒レベルのクエリー速度を誇りますが、裏ではインデックスの最適化だけで20時間以上かかることもあります。このようなダウンタイムを許容できる本番システムがあるでしょうか？</p>
<p>この問題は、3つの根本的な欠陥に起因しています：</p>
<ul>
<li><p><strong>時代遅れのデータセット：</strong>多くのベンチマークはいまだにSIFT（128次元）のようなレガシーデータセットに依存しているが、最新のエンベッディングは768～3,072次元に及ぶ。128次元のベクトルと1024次元以上のベクトルでは、システムの性能特性が根本的に異なります。</p></li>
<li><p><strong>虚栄心の指標：</strong>ベンチマークは平均レイテンシやピークQPSに注目するため、歪んだイメージを作り出します。平均レイテンシが10msでP99レイテンシが2秒のシステムは、ひどいユーザー体験を生み出します。30秒間で測定されるピーク・スループットは、持続的なパフォーマンスについて何も教えてくれません。</p></li>
<li><p><strong>単純化しすぎたシナリオ：</strong>ほとんどのベンチマークは、基本的な「データの書き込み、インデックスの構築、クエリー」のワークフローをテストします。実際の運用では、クエリを提供しながらの継続的なデータ取り込み、インデックスを断片化する複雑なメタデータのフィルタリング、リソースを奪い合う同時並行的な読み取り/書き込み操作が行われます。</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">VDBBench 1.0の新機能<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBenchは、時代遅れのベンチマーク哲学を反復するだけではありません。ベンチマークは実際の運用動作を予測する場合にのみ価値がある、という信念のもと、第一原理からコンセプトを再構築しています。</p>
<p>VDBBenchは、<strong>データの信憑性、ワークロードパターン、パフォーマンス測定手法という</strong>3つの重要な側面において、実世界の状況を忠実に再現するように設計されています。</p>
<p>どのような新機能が追加されたのか、詳しく見てみましょう。</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 本番環境に関連したビジュアライゼーションでダッシュボードを再設計</strong></h3><p>ほとんどのベンチマークは、生のデータ出力のみに焦点を当てていますが、重要なのは、エンジニアがこれらの結果をどのように解釈し、行動するかです。私たちは、わかりやすさとインタラクティブ性を優先してUIを再設計し、システム間のパフォーマンス・ギャップを発見し、インフラストラクチャの意思決定を迅速に行えるようにしました。</p>
<p>新しいダッシュボードは、パフォーマンス数値だけでなく、それらの間の関係も視覚化します。たとえば、異なるフィルター選択性レベル下でQPSがどのように低下するか、ストリーミング・インジェスト中にリコールがどのように変動するか、レイテンシ分布がシステムの安定性特性をどのように明らかにするかなどです。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus、Zilliz Cloud、Elastic Cloud、Qdrant Cloud、Pinecone、OpenSearchを</strong>含む主要なベクターデータベースプラットフォームを最新の設定と推奨設定で再テストし、すべてのベンチマークデータが現在の機能を反映していることを確認しました。すべてのテスト結果は<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboardで</a>ご覧いただけます。</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ タグフィルタリング：隠れたパフォーマンスキラー</h3><p>実際のクエリは、単独で行われることはほとんどありません。アプリケーションはベクトルの類似性とメタデータのフィルタリングを組み合わせています（「この写真に似ているが100ドル以下の靴を探す」）。このフィルタリングされたベクトル検索は、ほとんどのベンチマークが完全に無視しているユニークな課題を生み出します。</p>
<p>フィルタリングされた検索は、2つの重要な領域で複雑さをもたらします：</p>
<ul>
<li><p><strong>フィルターの複雑さ</strong>：より多くのスカラーフィールドと複雑な論理条件により、計算負荷が増加し、不十分なリコールとグラフインデックスの断片化を引き起こす可能性がある。</p></li>
<li><p><strong>フィルターの選択性</strong>：これは、私たちが実運用で繰り返し検証してきた「隠れたパフォーマンス・キラー」です。フィルタリング条件が高度に選択的になると（99％以上のデータをフィルタリングする）、クエリ速度は桁違いに変動し、インデックス構造が疎な結果セットに苦戦するため、リコールは不安定になります。</p></li>
</ul>
<p>VDBBenchは、様々なフィルタリング選択性レベル（50%から99.9%）を系統的にテストし、この重要なプロダクションパターンにおける包括的なパフォーマンスプロファイルを提供します。その結果、従来のベンチマークでは決して現れないような劇的なパフォーマンスの崖が明らかになることがよくあります。</p>
<p><strong>例</strong>Cohere 1Mテストでは、Milvusはすべてのフィルタ選択性レベルにおいて一貫して高いリコールを維持しましたが、OpenSearchは異なるフィルタリング条件下でリコールが大きく変動する不安定なパフォーマンスを示しました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：図: MilvusとOpenSearchのフィルター選択性の違いによるQPSとリコール(Cohere 1Mテスト)。</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 ストリーミングリード/ライト：静的インデックステストを超える</h3><p>本番システムでは、静的なデータを享受できることはほとんどありません。検索が実行されている間、新しい情報が絶えず流れ込んできます。このようなシナリオでは、多くの素晴らしいデータベースが、連続的な書き込みを処理しながら検索パフォーマンスを維持するという二重のプレッシャーで崩壊してしまいます。</p>
<p>VDBBenchのストリーミング・シナリオは実際の並列処理をシミュレートし、開発者が高同時実行環境におけるシステムの安定性、特にデータ書き込みがクエリ性能にどのような影響を与えるか、またデータ量の増加に伴って性能がどのように変化するかを理解するのに役立ちます。</p>
<p>異なるシステム間での公平な比較を保証するため、VDBBenchは構造化されたアプローチを採用しています：</p>
<ul>
<li><p>目標とする本番ワークロードを反映した制御された書き込みレートを設定する（例えば、500行/秒を5つの並列プロセスに分散）。</p></li>
<li><p>データ取り込みの10%ごとに検索オペレーションをトリガーし、シリアルモードとコンカレントモードを交互に繰り返す。</p></li>
<li><p>包括的なメトリクスを記録：レイテンシ分布（P99を含む）、持続QPS、リコール精度</p></li>
<li><p>データ量とシステムストレスの増加に伴うパフォーマンスの経時変化を追跡</p></li>
</ul>
<p>この制御された段階的な負荷テストにより、従来のベンチマークではほとんど把握できなかった、継続的なデータ取り込みにおけるシステムの安定性と精度の維持が明らかになります。</p>
<p><strong>例</strong>Cohere 10M ストリーミングテストでは、Pinecone は Elasticsearch と比較して、書き込みサイクル全体を通してより高い QPS とリコールを維持しました。特筆すべきは、Pineconeのパフォーマンスがインジェスト完了後に大幅に向上し、持続的な負荷の下でも高い安定性を示したことです。一方、Elasticsearchはアクティブなインジェストフェーズにおいて、より不安定な挙動を示しました。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：Cohere 10M Streaming Test (500 rows/s Ingestion Rate) における Pinecone と Elasticsearch の QPS と Recall。</p>
<p>VDBBench はオプションの最適化ステップをサポートすることで、インデックス最適化の前後でストリーミング検索のパフォーマンスを比較することができます。また、各ステージに費やされた実際の時間を追跡しレポートすることで、本番環境に近い状態でのシステム効率と動作についてより深い洞察を提供します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：最適化後の Cohere 10M ストリーミングテストにおける Pinecone と Elasticsearch の QPS と Recall (500 rows/s Ingestion Rate)</em></p>
<p>テストで示されたように、インデックス最適化後の QPS では Elasticsearch が Pinecone を上回りました。しかし、x軸に実際の経過時間を反映させると、Elasticsearchがそのパフォーマンスに達するまでにかなり時間がかかっていることがわかります。本番環境では、この遅延が重要になります。この比較により、ピークスループットとタイムトゥサーブのトレードオフが明らかになりました。</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">ᔬ 現在のAIワークロードを反映した最新のデータセット</h3><p>ベクターデータベースのベンチマークに使用するデータセットを全面的に見直しました。VDBBenchは、SIFTやGloVeのようなレガシーなテストセットの代わりに、OpenAIやCohereのような今日のAIアプリケーションを支える最先端の埋め込みモデルから生成されたベクトルを使用しています。</p>
<p>特にRAG(Retrieval-Augmented Generation)のようなユースケースとの関連性を確保するために、現実の企業やドメイン固有のシナリオを反映したコーパスを選択しました：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>コーパス</strong></td><td><strong>埋め込みモデル</strong></td><td><strong>サイズ</strong></td><td><strong>サイズ</strong></td><td><strong>ユースケース</strong></td></tr>
<tr><td>ウィキペディア</td><td>コヒーレV2</td><td>768</td><td>1M / 10M</td><td>一般知識ベース</td></tr>
<tr><td>バイオASQ</td><td>コヒーレV3</td><td>1024</td><td>1M / 10M</td><td>ドメイン固有（バイオメディカル）</td></tr>
<tr><td>C4</td><td>オープンAI</td><td>1536</td><td>500K / 5M</td><td>ウェブスケールのテキスト処理</td></tr>
<tr><td>MSMarco V2</td><td>ウデバーブルーム-1b1</td><td>1536</td><td>1m / 10m / 138m</td><td>大規模検索</td></tr>
</tbody>
</table>
<p>これらのデータセットは、今日の大量かつ高次元のベクトルデータをよりよくシミュレートしており、最新のAIワークロードにマッチした条件下で、ストレージ効率、クエリ性能、検索精度の現実的なテストが可能です。</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ 業界に特化したテストのためのカスタムデータセットのサポート</h3><p>すべてのビジネスはユニークです。金融業界ではトランザクションの埋め込みに重点を置いたテストが必要かもしれませんし、ソーシャルプラットフォームではユーザーの行動ベクトルに重点を置いたテストが必要かもしれません。VDBBenchでは、特定のワークロードのために特定のエンベッディングモデルから生成された独自のデータでベンチマークを行うことができます。</p>
<p>以下をカスタマイズできます：</p>
<ul>
<li><p>ベクトルの次元とデータタイプ</p></li>
<li><p>メタデータスキーマとフィルタリングパターン</p></li>
<li><p>データ量と取り込みパターン</p></li>
<li><p>本番トラフィックにマッチしたクエリ分布</p></li>
</ul>
<p>結局のところ、どのデータセットも貴社自身のプロダクションデータ以上に優れたストーリーを語ることはできません。</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">どのようにVDBBenchはプロダクションで実際に重要なものを測定するか<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">プロダクションにフォーカスしたメトリクス設計</h3><p>VDBBenchはラボの結果だけでなく、実際のパフォーマンスを反映するメトリクスを優先します。<strong>負荷時の信頼性、テールレイテンシ特性、持続的なスループット、精度の維持など</strong>、実稼働環境で実際に重要なことを中心にベンチマークを再設計しました。</p>
<ul>
<li><p><strong>実際のユーザー・エクスペリエンスのためのP95/P99レイテンシー</strong>：平均/中央値レイテンシは、実際のユーザーをイライラさせる異常値を覆い隠し、根本的なシステムの不安定性を示す可能性があります。VDBBenchはP95/P99のようなテール・レイテンシーに焦点を当て、クエリの95%または99%が実際に達成するパフォーマンスを明らかにします。これは、SLAプランニングやワーストケースのユーザー・エクスペリエンスを理解する上で極めて重要です。</p></li>
<li><p><strong>負荷下での持続可能なスループット</strong>：5秒間良好なパフォーマンスを発揮するシステムは、本番では役に立ちません。VDBBench は徐々に同時実行数を増加させ、データベースの持続可能な最大クエリ数/秒 (<code translate="no">max_qps</code>)を求めます。この方法論は、システムが長期的にどの程度持ちこたえられるかを明らかにし、現実的なキャパシティプランニングに役立ちます。</p></li>
<li><p><strong>パフォーマンスとバランスの取れたリコール</strong>：正確さのないスピードは意味がありません。VDBBenchの各パフォーマンス数値は、リコール測定値とペアになっているため、スループットと引き換えにどの程度の関連性があるのかを正確に知ることができます。これにより、内部トレードオフが大きく異なるシステム間で、公平で同程度の比較が可能になります。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">現実を反映したテスト手法</h3><p>VDBBenchの設計における重要な革新は、シリアルテストとコンカレントテストの分離です。これは、異なるタイプの負荷の下でシステムがどのように動作するかを把握し、異なるユースケースにとって重要なパフォーマンス特性を明らかにするのに役立ちます。</p>
<p><strong>レイテンシ測定の分離：</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 一度に1つのリクエストしか処理されないような最小限の負荷の下でシステム性能を測定します。これは待ち時間の最良のシナリオを表し、ベースラインのシステム能力を特定するのに役立ちます。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 現実的な高同時処理条件下でのシステム動作：複数のリクエストが同時に到着し、システムリソースを奪い合うような条件下でのシステム動作を測定します。</p></li>
</ul>
<p><strong>二相ベンチマークの構造</strong></p>
<ol>
<li><p><strong>シリアルテスト</strong>：1,000のクエリーをシングルプロセスで実行し、ベースラインの性能と精度を確立し、<code translate="no">serial_latency_p99</code> とリコールの両方を報告する。このフェーズは、理論的な性能の上限を特定するのに役立つ。</p></li>
<li><p><strong>同時実行テスト</strong>：いくつかの重要な技術革新により、持続的な負荷がかかる本番環境をシミュレートします：</p>
<ul>
<li><p><strong>現実的なクライアント・シミュレーション</strong>：現実的なクライアントシミュレーション：各テストプロセスは、独自の接続とクエリーセットで独立して動作し、結果を歪める可能性のある共有状態の干渉を回避します。</p></li>
<li><p><strong>同期開始</strong>：すべてのプロセスが同時に開始されるため、測定されたQPSはクレームされた同時実行レベルを正確に反映します。</p></li>
<li><p><strong>独立したクエリーセット</strong>：実稼働クエリの多様性を反映しない非現実的なキャッシュヒット率を防止</p></li>
</ul></li>
</ol>
<p>これらの注意深く構造化されたメソッドにより、VDBBenchが報告する<code translate="no">max_qps</code> と<code translate="no">conc_latency_p99</code> の値は、正確で実運用に関連するものであり、実運用キャパシティプランニングとシステム設計に有意義な洞察を提供します。</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">VDBBench 1.0の概要<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0は</strong>、生産に関連したベンチマークへの基本的な転換を意味します。VDBBench 1.0は、連続的なデータ書き込み、様々な選択性を持つメタデータフィルタリング、同時アクセスパターン下でのストリーミング負荷をカバーすることで、現在利用可能な中で最も実際の本番環境に近いものを提供します。</p>
<p>ベンチマークの結果と現実の性能のギャップは、推測ゲームであってはなりません。ベクターデータベースを本番環境に導入する予定があるのであれば、理想化されたラボテスト以上のパフォーマンスを理解する価値があります。VDBBenchはオープンソースで、透明性が高く、意味のあるリンゴ同士の比較をサポートするように設計されています。</p>
<p>プロダクションバリューにつながらない印象的な数字に振り回されないでください。<strong>VDBBench 1.0を使用して、実際のワークロードを反映した条件下で、あなたのビジネスにとって重要なシナリオを、あなたのデータでテストしてください。</strong>ベクターデータベースの評価において、誤解を招くようなベンチマークの時代は終わりを告げました。</p>
<p><strong>ご自身のワークロードでVDBBenchをお試し</strong><a href="https://github.com/zilliztech/VectorDBBench"> ください: https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>主要なベクトルデータベースのテスト結果を見る：</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a></p>
<p>ご質問や結果を共有したいですか？<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>で会話に参加するか、<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a> で私たちのコミュニティと接続してください。</p>
