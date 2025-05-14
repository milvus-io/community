---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: ベンチマークは嘘をつく - ベクターDBは真のテストに値する
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  VDBBenchでベクターデータベースのパフォーマンスギャップを明らかにしましょう。私たちのツールは実際の運用シナリオでテストを行い、予期せぬダウンタイムなしにAIアプリケーションがスムーズに動作することを保証します。
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">ベンチマークに基づいて選んだベクトル・データベースは、本番で失敗するかもしれない<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>AIアプリケーションのために<a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクターデータベースを</a>選択するとき、従来のベンチマークは、空いているコースでスポーツカーを試運転し、ラッシュアワーの渋滞でエンストするようなものです。不快な真実？ほとんどのベンチマークは、本番環境では決して存在しない人工的な条件下でのパフォーマンスしか評価していないのです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ほとんどのベンチマークは、すべてのデータが取り込まれ、インデックスが完全に構築された<strong>後に</strong>ベクターデータベースをテストする。しかし、本番環境ではデータの流れが止まることはない。インデックスを再構築するために何時間もシステムを一時停止することはない。</p>
<p>私たちはこの断絶を目の当たりにしてきました。例えば、Elasticsearchはミリ秒レベルのクエリスピードを誇るかもしれませんが、その裏側ではインデックスの最適化だけで<strong>20時間以上かかって</strong>います。これは、特に継続的な更新と即座の応答が求められるAIワークロードでは、本番システムには許されないダウンタイムです。</p>
<p>Milvusでは、企業顧客と無数の概念実証（PoC）評価を実施した後、厄介なパターンを発見した。それは、<strong>管理されたラボ環境では優れているベクターデータベースが、実際の運用負荷では苦戦することが多いという</strong>ことだ。この致命的なギャップは、インフラエンジニアをいらだたせるだけでなく、このような誤解を招く性能約束に基づいて構築されたAIイニシアチブ全体を頓挫させる可能性があります。</p>
<p>これが、私たちが<a href="https://github.com/zilliztech/VectorDBBench">VDBBenchを</a>構築した理由です。<a href="https://github.com/zilliztech/VectorDBBench">VDBBenchは</a>、本番環境をシミュレートするためにゼロから設計されたオープンソースのベンチマークです。シナリオを選別する合成テストとは異なり、VDBBenchは実際の運用ワークロードと同様に、継続的なインジェスト、厳格なフィルタリング条件、多様なシナリオを通してデータベースをプッシュします。私たちのミッションはシンプルです。ベクターデータベースが実際の環境下でどのようなパフォーマンスを発揮するかを示すツールをエンジニアに提供することで、信頼できる数値に基づいてインフラストラクチャの意思決定を行えるようにすることです。</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">ベンチマークと現実のギャップ<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のベンチマークアプローチには3つの重大な欠陥があり、その結果、実運用の意思決定には実質的に無意味なものとなっています：</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1.古いデータ</h3><p>多くのベンチマークは、いまだにSIFTや<a href="https://zilliz.com/glossary/glove"> GloVeの</a>ような時代遅れのデータセットに依存しており、AIモデルによって生成される今日の複雑で高次元のベクトル埋め込みとは似ても似つかない。考えてみてほしい：SIFTは128次元のベクトルを含みますが、OpenAIの埋め込みモデルによる一般的な埋め込みは768次元から3072次元です。</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2.虚栄の指標</h3><p>多くのベンチマークは、平均レイテンシやピークQPSにのみ焦点を当てますが、これは歪んだイメージを作り出します。これらの理想化された指標は、実際のユーザーが本番環境で経験する異常値や矛盾を捉えることができません。例えば、QPSの数値が印象的であっても、その数値が無制限の計算リソースを必要とし、組織を破綻させるようなものであれば、意味がありません。</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3.単純化しすぎたシナリオ</h3><p>ほとんどのベンチマークは、基本的で静的なワークロード、つまりベクトル検索の "Hello World "だけをテストしている。例えば、データセット全体が取り込まれ、インデックスが作成された後にのみ検索リクエストを発行し、新しいデータが流れ込んでくる間にユーザーが検索を行うというダイナミックな現実を無視している。この単純化された設計は、並行クエリー、フィルター検索、継続的なデータ取り込みなど、実際のプロダクション・システムを定義する複雑なパターンを見落としている。</p>
<p>このような欠陥を認識した私たちは、AIシステムが実際にどのように動作するかに基づいた、<strong>ベンチマークの哲学の根本的な転換が</strong>業界には必要であると考えました。それが<a href="https://github.com/zilliztech/VectorDBBench">VDBBenchを</a>開発した理由です。</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">ラボからプロダクションへ：VDBBenchがギャップを埋める方法<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBenchは単に時代遅れのベンチマーク哲学を反復するだけではありません。<strong>ベンチマークは実際の生産動作を予測してこそ価値があるの</strong>です。</p>
<p>VDBBenchは、データの信頼性、ワークロードパターン、パフォーマンス測定という3つの重要な側面において、実世界の状況を忠実に再現するように設計されています。</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">データセットの近代化</h3><p>vectorDBのベンチマークに使用するデータセットを全面的に見直しました。SIFTやGloVeのような従来のテストセットの代わりに、VDBBenchは、今日のAIアプリケーションに力を与える最先端の埋め込みモデルから生成されたベクトルを使用します。</p>
<p>特にRAG(Retrieval-Augmented Generation)のようなユースケースの関連性を確保するために、現実の企業やドメイン固有のシナリオを反映したコーパスを選択しました。これらのコーパスは、汎用の知識ベースから、生物医学的な質問応答や大規模なウェブ検索のような垂直アプリケーションまで多岐にわたる。</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>コーパス</strong></td><td><strong>埋め込みモデル</strong></td><td><strong>サイズ</strong></td><td><strong>サイズ</strong></td></tr>
<tr><td>ウィキペディア</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>バイオASQ</td><td>コヒーレV3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>オープンAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>ウデバーブルーム-1b1</td><td>1536</td><td>1m / 10m / 138m</td></tr>
</tbody>
</table>
<p>表VDBBenchで使用されているデータセット</p>
<p>VDBBenchはカスタムデータセットもサポートしており、特定のワークロードに対して特定のエンベッディングモデルから生成された独自のデータでベンチマークを行うことができます。結局のところ、あなた自身のプロダクションデータほど優れたデータセットはないのです。</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">プロダクションにフォーカスしたメトリクス設計</h3><p><strong>VDBBenchは、ラボの結果だけでなく、実際のパフォーマンスを反映するメトリクスを優先しています。</strong>負荷時の信頼性、テールレイテンシ、持続的スループット、そして精度です。</p>
<ul>
<li><p><strong>実際のユーザー・エクスペリエンスを測定するP95/P99レイテンシー</strong>：平均/中央値レイテンシは、実際のユーザーをイライラさせる異常値を覆い隠します。そのため、VDBBenchはP95/P99のようなテールレイテンシーに焦点を当て、クエリの95%または99%が実際に達成するパフォーマンスを明らかにします。</p></li>
<li><p><strong>負荷下での持続可能なスループット：</strong>5秒間良好なパフォーマンスを発揮するシステムは、本番では役に立ちません。VDBBench は徐々に同時実行数を増やし、データベースの持続可能な最大クエリ/秒 (<code translate="no">max_qps</code>)を求めます。これは、システムが長期的にどの程度持ちこたえられるかを示すものです。</p></li>
<li><p><strong>パフォーマンスとバランスの取れたリコール：</strong>正確さのないスピードは意味がありません。VDBBenchの全てのパフォーマンス数値はリコールと対になっているため、スループットと引き換えにどの程度の関連性があるのかを正確に知ることができます。これにより、内部トレードオフが大きく異なるシステム間で、公平で同程度の比較が可能になります。</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">現実を反映したテスト手法</h3><p>VDBBenchの設計における重要な革新は、<strong>シリアルテストとコンカレントテストの分離</strong>です。例えば、レイテンシ・メトリクスは以下のように分けられます：</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> 一度に1つのリクエストしか処理されないような最小負荷下でのシステム性能を測定します。これはレイテンシの<em>最良のシナリオを</em>表す。</p></li>
<li><p><code translate="no">conc_latency_p99</code> 複数のリクエストが同時に到着するような、<em>現実的な高混雑条件下での</em>シ ステム動作を測定する。</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">つのベンチマークフェーズ</h3><p>VDBBench はテストを2つの重要なフェーズに分けます：</p>
<ol>
<li><strong>シリアルテスト</strong></li>
</ol>
<p>これは1,000クエリーのシングルプロセス実行です。このフェーズでは、理想的なパフォーマンスと精度のベースラインを確立し、<code translate="no">serial_latency_p99</code> とリコールの両方を報告します。</p>
<ol start="2">
<li><strong>同時実行テスト</strong></li>
</ol>
<p>このフェーズでは、負荷が持続する本番環境をシミュレートします。</p>
<ul>
<li><p><strong>現実的なクライアントシミュレーション</strong>：各テストプロセスは、独自の接続とクエリーセットで独立して動作します。これにより、結果を歪める可能性のある共有状態（キャッシュなど）の干渉を回避します。</p></li>
<li><p><strong>同期開始</strong>：すべてのプロセスが同時に開始されるため、測定された QPS が主張された同時実行レベルを正確に反映します。</p></li>
</ul>
<p>これらの注意深く構造化された方法によって、VDBBenchが報告する<code translate="no">max_qps</code> と<code translate="no">conc_latency_p99</code> の値は<strong>正確であり、生産に関連するもの</strong>であることが保証され、生産キャパシティプランニングとシステム設計に有意義な洞察を提供します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：Milvus-16c64g-standaloneのQPSとレイテンシ（同時実行レベルを変化させた場合）（Cohere 1Mテスト）。このテストでは、Milvusは初期状態では利用率が低く、</em> <strong><em>同時実行レベル</em></strong><em>20までは、同時実行を増やすとシステム利用率が向上し、QPSが高くなります。</em> <strong><em>同時実行数が20を</em></strong><em>超えると、システムは全負荷に達し、それ以上同時実行数を増やしてもスループットは改善されず、待ち行列の遅延により待ち時間が増加する。</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">静的データの検索を超えて：実際のプロダクション・シナリオ<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちの知る限り、VDBBenchは静的収集、フィルタリング、ストリーミングのケースを含む、プロダクションクリティカルなシナリオの全領域にわたってベクターデータベースをテストする唯一のベンチマークツールです。</p>
<h3 id="Static-Collection" class="common-anchor-header">スタティック・コレクション</h3><p>VDBBenchは、テストを急ぐ他のベンチマークとは異なり、まず各データベースがインデックスを完全に最適化していることを確認します。これにより、全体像を把握することができます：</p>
<ul>
<li><p>データ取り込み時間</p></li>
<li><p>インデックス作成時間（最適化されたインデックスの作成にかかる時間。）</p></li>
<li><p>完全に最適化されたインデックスにおける、シリアルおよびコンカレント条件下での検索パフォーマンス</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">フィルタリング</h3><p>実運用におけるベクトル検索は、単独で行われることはほとんどない。実際のアプリケーションでは、ベクトルの類似性とメタデータのフィルタリングが組み合わされています（「この写真に似ているが100ドル以下の靴を探す」）。このフィルタリングされたベクトル検索は、ユニークな課題を生み出します：</p>
<ul>
<li><p><strong>フィルターの複雑さ</strong>：より多くのスカラー列と論理条件により、計算要求が増加する。</p></li>
<li><p><strong>フィルターの選択性</strong>：<a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">VDBBenchの実運用</a>経験から、これが隠れたパフォーマンスキラーであることが明らかになっています。</p></li>
</ul>
<p>VDBBenchは、様々な選択性レベル（50%から99.9%）のフィルタ性能を系統的に評価し、データベースがこの重要な生産パターンをどのように処理するかの包括的なプロファイルを提供します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：フィルタの選択レベルの違いによるMilvusとOpenSearchのQPSとRecall（Cohere 1Mテスト）。X軸はフィルタリングされたデータの割合を表しています。示されているように、Milvusはすべてのフィルター選択性レベルにわたって一貫して高いリコールを維持しているのに対し、OpenSearchは不安定なパフォーマンスを示しており、異なるフィルター条件下でリコールが大きく変動しています。</em></p>
<h3 id="Streaming" class="common-anchor-header">ストリーミング</h3><p>本番システムでは、静的なデータを享受できることは稀である。検索が実行されている間、新しい情報が絶えず流れ込んできます。</p>
<p>VDBBenchのユニークなストリーミング・テスト・ケースでは、検索と挿入のパフォーマンスを測定します：</p>
<ol>
<li><p><strong>データ量の増加による影響</strong>：データ量の増加による影響：データサイズの増加に伴う検索パフォーマンスのスケール</p></li>
<li><p><strong>書き込み負荷の影響</strong>：書き込みがシステムのCPUやメモリリソースを消費するため、同時書き込みが検索のレイテンシやスループットにどのような影響を与えるか。</p></li>
</ol>
<p>ストリーミングシナリオは、ベクターデータベースにとって包括的なストレステストとなる。しかし、そのための<em>公正な</em>ベンチマークを構築することは容易ではありません。1つのシステムがどのように動作するかを説明するだけでは不十分で、異なるデータベース間で<strong>同等の比較を</strong>可能にする一貫した評価モデルが必要です。</p>
<p>VDBBenchは、実際の導入で企業を支援してきた経験から、構造化された反復可能なアプローチを構築しました。VDBBenchを使用することで</p>
<ul>
<li><p>VDBBenchでは、目標とする本番ワークロードを反映した<strong>固定挿入率を定義</strong>します。</p></li>
<li><p>VDBBenchは、すべてのシステムに<strong>同一の負荷圧力を</strong>適用し、パフォーマンス結果を直接比較できるようにします。</p></li>
</ul>
<p>例えば、Cohere 10M データセットと 500 行/秒のインジェスト・ターゲットを使用します：</p>
<ul>
<li><p>VDBBenchは5つの並列プロデューサ・プロセスをスピンアップし、各プロデューサは毎秒100行をインサートします。</p></li>
<li><p>10%のデータがインジェストされるごとに、VDBBenchはシリアルとコンカレントの両方の条件下で検索テストのラウンドをトリガーします。</p></li>
<li><p>レイテンシ、QPS、リコールなどの指標は、各ステージの後に記録される。</p></li>
</ul>
<p>この管理された方法論は、各システムのパフォーマンスが時間とともにどのように変化し、実際の運用ストレス下でどのように変化するかを明らかにします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：Cohere 10M Streaming Test (500 rows/s Ingestion Rate) における Pinecone と Elasticsearch の QPS と Recall。Pineconeはより高いQPSとリコール率を維持し、100%のデータを挿入した後にQPSが大幅に向上しました。</em></p>
<p>しかし、これで終わりではありません。VDBBench はオプションの最適化ステップをサポートすることで、インデックス最適化前後のストリーミング検索のパフォーマンスを比較することができます。また、各ステージに費やされた実際の時間を追跡し、レポートすることで、本番に近い条件下でのシステム効率と動作に関するより深い洞察を提供します。</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：最適化後の Cohere 10M ストリーミングテストにおける Pinecone と Elasticsearch の QPS と Recall (500 rows/s Ingestion Rate)</em></p>
<p>図に示すように、インデックス最適化後のQPSではElasticSearchがPineconeを上回りました。奇跡か？そうではありません。X軸に実際の経過時間を反映させると、ElasticSearchがこのパフォーマンスに到達するまでにかなり時間がかかっていることがわかります。そして本番環境では、この遅れが問題になります。この比較により、ピークスループットとタイムトゥサーブのトレードオフが明らかになりました。</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">自信を持ってベクターデータベースをお選びください<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>ベンチマークの結果と実世界のパフォーマンスとのギャップは、推測ゲームであってはなりません。VDBBenchは、継続的なデータ取り込み、メタデータフィルタリング、ストリーミングワークロードなど、現実的な実運用に近い条件下でベクターデータベースを評価する方法を提供します。</p>
<p>ベクターデータベースを実運用に導入しようと考えているのであれば、理想化されたラボテスト以上のパフォーマンスを理解する価値があります。VDBBenchはオープンソースで透過的であり、意味のあるリンゴ同士の比較をサポートするように設計されています。</p>
<p>今すぐご自身のワークロードでVDBBenchをお試しいただき、異なるシステムが実際にどのように機能するかをご確認<a href="https://github.com/zilliztech/VectorDBBench">ください。https://github.com/zilliztech/VectorDBBench。</a></p>
<p>ご質問や結果を共有したいですか？<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>で会話に参加するか、<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> で私たちのコミュニティと接続してください。ご意見をお聞かせください。</p>
