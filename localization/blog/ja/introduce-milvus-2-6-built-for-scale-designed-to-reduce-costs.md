---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 'Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索'
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Milvus
  2.6がリリースされました。このリリースでは、今日のベクターサーチにおける最も差し迫った課題である、コストを抑えながら効率的にスケーリングするという課題に直接対応する数多くの機能が導入されています。
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>AIを活用した検索が実験的プロジェクトからミッションクリティカルなインフラへと進化するにつれ、<a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクターデータベースへの</a>要求も強まっている。組織は、インフラコストを管理し、リアルタイムのデータ取り込みをサポートし、基本的な<a href="https://zilliz.com/learn/vector-similarity-search">類似検索を</a>超える高度な検索を提供しながら、何十億ものベクトルを処理する必要があります。このような進化する課題に取り組むため、私たちはMilvusの開発と改良に取り組んできました。コミュニティからの反響は非常に心強く、貴重なフィードバックが私たちの方向性を形作るのに役立っています。</p>
<p>数ヶ月に及ぶ集中的な開発の末、<strong>Milvus 2.6をリリースする</strong>ことができました。このリリースは、今日のベクター検索における最も差し迫った課題である、<strong><em>コストを抑えながら効率的にスケーリング</em></strong>するという課題に直接取り組んでいます。</p>
<p>Milvus2.6では、<strong>コスト削減、高度な検索機能、大規模化に向けたアーキテクチャの改善という</strong>3つの重要な領域において、画期的なイノベーションを実現しました。その結果が物語っています：</p>
<ul>
<li><p>RaBitQ 1ビット量子化による<strong>72%のメモリ削減と</strong>4倍の高速クエリ</p></li>
<li><p>インテリジェントな階層型ストレージによる<strong>50%のコスト削減</strong></p></li>
<li><p>強化されたBM25実装により、Elasticsearchより<strong>4倍高速な全文検索を</strong>実現</p></li>
<li><p>新しく導入されたパスインデックスによりJSONフィルタリングが<strong>100倍高速化</strong></p></li>
<li><p>新しいゼロディスクアーキテクチャにより、<strong>検索の鮮度を経済的に実現</strong></p></li>
<li><p>新しい "data in and data out "エクスペリエンスで<strong>組み込みワークフローを合理化</strong></p></li>
<li><p>将来性のあるマルチテナントのために、<strong>1つのクラスタで最大100Kのコレクションが可能</strong></p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">コスト削減のための革新：ベクトル検索を手頃な価格に<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>メモリ消費は、ベクトル検索を数十億レコードまで拡張する際の最大の課題の一つです。Milvus 2.6では、パフォーマンスを向上させながら、インフラコストを大幅に削減するいくつかの重要な最適化が導入されています。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1ビット量子化：4倍のパフォーマンスで72%のメモリ削減</h3><p>従来の量子化手法では、メモリの節約と引き換えに検索品質を犠牲にせざるを得ませんでした。Milvus2.6は、<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1ビット量子</a>化とインテリジェントな洗練メカニズムを組み合わせることで、これを変えます。</p>
<p>新しいIVF_RABITQインデックスは、1ビット量子化によりメインインデックスを元のサイズの1/32に圧縮します。オプションのSQ8絞り込みと併用することで、このアプローチは元のメモリフットプリントの1/4で高い検索品質(95%の想起率)を維持する。</p>
<p>我々の予備的ベンチマークでは、有望な結果が得られている：</p>
<table>
<thead>
<tr><th><strong>パフォーマンス指標</strong></th><th><strong>従来のIVF_FLAT</strong></th><th><strong>RaBitQ（1ビット）のみ</strong></th><th><strong>RaBitQ (1ビット) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>メモリフットプリント</td><td>100%（ベースライン）</td><td>3%（97%削減）</td><td>28% (72%削減)</td></tr>
<tr><td>リコール</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>検索スループット（QPS）</td><td>236</td><td>648（2.7倍高速）</td><td>946（4倍高速）</td></tr>
</tbody>
</table>
<p><em>表AWSのm6id.2xlargeでテストされた768次元の1MベクトルによるVectorDBBenchの評価</em></p>
<p>ここでの真のブレークスルーは、72％のメモリ削減だけではなく、同時に4倍のスループット向上を実現したことだ。つまり、75％少ないサーバーで同じワークロードを処理したり、既存のインフラで4倍のトラフィックを処理したりすることができるのです。</p>
<p>Milvus on<a href="https://zilliz.com/cloud"> Zilliz Cloudを</a>フルマネージドで利用する企業ユーザーに対しては、RaBitQパラメータを特定のワークロード特性と精度要件に基づいて動的に調整する自動化戦略を開発中です。Zilliz Cloudの全てのCUタイプにおいて、より高い費用対効果を享受することができます。</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">ホット-コールド階層型ストレージ：インテリジェントなデータ配置による50%のコスト削減</h3><p>実際のベクトル検索ワークロードには、アクセスパターンが大きく異なるデータが含まれます。頻繁にアクセスされるデータには即座の可用性が必要ですが、アーカイブデータは、劇的に低いストレージコストと引き換えに、多少高いレイテンシも許容できます。</p>
<p>Milvus 2.6では、アクセスパターンに基づいてデータを自動的に分類し、適切なストレージ階層に配置する階層型ストレージアーキテクチャを導入しています：</p>
<ul>
<li><p><strong>インテリジェントなデータ分類</strong>：Milvusはアクセスパターンに基づいて、ホットデータ（頻繁にアクセスされるデータ）とコールドデータ（ほとんどアクセスされないデータ）を自動的に識別します。</p></li>
<li><p><strong>最適化されたストレージ配置</strong>：ホットデータは高性能なメモリ/SSDに残し、コールドデータはより経済的なオブジェクトストレージに移動します。</p></li>
<li><p><strong>ダイナミックなデータ移動</strong>：使用パターンが変わると、データは自動的に階層間を移動します。</p></li>
<li><p><strong>透過的な検索</strong>：クエリがコールドデータに触れると、オンデマンドで自動的にロードされる</p></li>
</ul>
<p>その結果、アクティブデータのクエリパフォーマンスを維持しながら、ストレージコストを最大50%削減することができます。</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">その他のコスト最適化</h3><p>milvus2.6では、HNSWインデックスのInt8ベクトルサポート、IOPSとメモリ要件を削減する最適化された構造のStorage v2フォーマット、APT/YUMパッケージマネージャを介した直接インストールがより簡単になりました。</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">高度な検索機能：基本的なベクトル類似度を超えて<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>最新のAIアプリケーションでは、ベクトル検索だけでは十分ではありません。ユーザは、従来の情報検索の精度とベクトル埋め込みによる意味理解の組み合わせを要求しています。Milvus 2.6では、このギャップを埋める高度な検索機能スイートを導入しました。</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">ターボチャージBM25: Elasticsearchより400%高速な全文検索</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文検索は</a>、ベクターデータベースにおけるハイブリッド検索システムの構築に不可欠となっています。Milvus 2.6では、バージョン2.5から導入されたBM25の実装をベースに、全文検索の大幅な性能向上が図られています。例えば、このリリースでは、<code translate="no">drop_ratio_search</code> や<code translate="no">dim_max_score_ratio</code> のような新しいパラメータが導入され、精度と速度のチューニングが強化され、よりきめ細かい検索制御が可能になりました。</p>
<p>業界標準のBEIRデータセットに対する我々のベンチマークによると、Milvus 2.6はElasticsearchと同等の想起率で3-4倍高いスループットを達成している。特定のワークロードでは、7倍のQPSを達成しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSONパスインデックス：100倍高速なフィルタリング</h3><p>Milvusは長い間JSONデータタイプをサポートしてきましたが、インデックスがサポートされていないため、JSONフィールドのフィルタリングは遅いものでした。Milvus 2.6では、JSONパスインデックスをサポートし、パフォーマンスを大幅に向上させました。</p>
<p>各レコードがネストされたメタデータを含むユーザープロファイルデータベースを考えてみましょう：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>サンフランシスコのみをスコープとした "AIに興味のあるユーザー "というセマンティック検索の場合、MilvusはレコードごとにJSONオブジェクト全体をパースして評価していたため、クエリが非常に高価で低速になっていました。</p>
<p>Milvusでは、JSONフィールド内の特定のパスにインデックスを作成し、検索を高速化することができます：</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>100M以上のレコードを対象としたパフォーマンステストでは、JSON Path Indexにより、フィルタのレイテンシが<strong>140ms</strong>(P99: 480ms)からわずか<strong>1.5ms</strong>(P99: 10ms)に短縮されました。</p>
<p>この機能は、特に以下のような用途に有効です：</p>
<ul>
<li><p>複雑なユーザー属性フィルタリングを行うレコメンデーションシステム</p></li>
<li><p>メタデータによってドキュメントをフィルタリングするRAGアプリケーション</p></li>
<li><p>データのセグメンテーションが重要なマルチテナントシステム</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">強化されたテキスト処理と時間を考慮した検索</h3><p>Milvus2.6では、日本語と韓国語のためのLinderaトークナイザー、包括的な多言語サポートのためのICUトークナイザー、カスタム辞書統合のための強化されたJiebaなど、洗練された言語処理を含む、完全に刷新されたテキスト分析パイプラインが導入されています。</p>
<p><strong>Phrase Match Intelligenceは</strong>、語順の意味的ニュアンスを捉え、「機械学習技術」と「学習機械技術」を区別します：</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>時間を考慮した減衰関数は</strong>、設定可能な減衰率と関数タイプ（指数関数、ガウス関数、線形関数）により、文書の古さに基づいて関連性スコアを調整することで、新鮮なコンテンツを自動的に優先します。</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">合理化された検索：データイン、データアウト・エクスペリエンス</h3><p>生データとベクトル埋め込みデータとの間の断絶は、ベクトルデータベースを使用する開発者にとってのもう一つのペインポイントです。Milvusのインデックス作成とベクトル検索にデータが到達する前に、多くの場合、生テキスト、画像、音声をベクトル表現に変換する外部モデルを使用した前処理が行われます。検索後、結果IDを元のコンテンツにマッピングするなどの追加的な下流処理も必要です。</p>
<p>Milvus 2.6は、サードパーティのエンベッディングモデルを検索パイプラインに直接統合する新しい<strong>関数</strong>インターフェイスにより、これらのエンベッディングワークフローを簡素化します。エンベッディングを事前に計算する代わりに、以下のことができるようになりました：</p>
<ol>
<li><p><strong>生のデータを直接挿入する</strong>：テキスト、画像、その他のコンテンツをMilvusに送信します。</p></li>
<li><p><strong>エンベッディングプロバイダの設定</strong>：OpenAI、AWS Bedrock、Google Vertex AI、Hugging FaceなどのエンベッディングAPIサービスに接続します。</p></li>
<li><p><strong>自然言語によるクエリ</strong>：生のテキストクエリを直接使用して検索</p></li>
</ol>
<p>これにより、Milvusがベクター変換を効率化し、「データイン、データアウト」を実現します。</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">アーキテクチャの進化数百億ベクトルへのスケーリング<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6は、数百億ベクトルへのコスト効率の良いスケーリングを可能にする基本的なアーキテクチャの革新を導入しています。</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">KafkaとPulsarを新しいWoodpecker WALに置き換える</h3><p>これまでのMilvusでは、Write-Ahead Log（WAL）システムとしてKafkaやPulsarのような外部メッセージキューに依存していました。これらのシステムは当初はうまく機能していたものの、運用の複雑さとリソースのオーバーヘッドが大きな問題となっていました。</p>
<p>Milvus 2.6では、画期的なゼロディスク設計によりこれらの外部依存を排除した、専用に構築されたクラウドネイティブなWALシステムである<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpeckerを</strong></a>導入します：</p>
<ul>
<li><p><strong>全てをオブジェクトストレージに</strong>全てのログデータはS3、Google Cloud Storage、MinIOのようなオブジェクトストレージに永続化されます。</p></li>
<li><p><strong>分散メタデータ</strong>：メタデータはetcdキーバリューストアで管理される。</p></li>
<li><p><strong>ローカルディスクへの依存なし</strong>：分散ローカル永続状態に伴う複雑なアーキテクチャと運用オーバーヘッドを排除するための選択。</p></li>
</ul>
<p>Woodpeckerのパフォーマンスを比較する包括的なベンチマークを実行しました：</p>
<table>
<thead>
<tr><th><strong>システム</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WPローカル</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>スループット</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>待ち時間</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1.8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpeckerは、各ストレージ・バックエンドの理論上の最大スループットの60～80%に一貫して到達しており、ローカル・ファイルシステム・モードではKafkaより3.5倍高速の450MB/s、S3モードではKafkaより5.8倍高速の750MB/sを達成しています。</p>
<p>Woodpeckerの詳細については、こちらのブログをご覧ください：<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kafka/PulsarをMilvusのWoodpeckerに置き換えました</a>。</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">検索の鮮度を経済的に実現</h3><p>ミッション・クリティカルな検索では通常、新しく取り込まれたデータが即座に検索可能である必要があります。Milvus 2.6では、メッセージキューの依存関係を置き換えることで、新しい更新の処理を根本的に改善し、より低いリソース・オーバーヘッドで検索の鮮度を提供します。新しいアーキテクチャでは、クエリノードやデータノードといったMilvusの他のコンポーネントと密接に連携して動作する専用コンポーネント、<strong>ストリーミングノードが</strong>追加されました。Streaming Nodeは、軽量でクラウドネイティブなWrite-Ahead Log (WAL)システムであるWoodpeckerの上に構築されています。</p>
<p>この新しいコンポーネントは以下を可能にします：</p>
<ul>
<li><p><strong>優れた互換性</strong>：新しいWoodpecker WALの両方で動作し、Kafka、Pulsar、その他のストリーミング・プラットフォームと下位互換性があります。</p></li>
<li><p><strong>インクリメンタルなインデックス作成</strong>：バッチ遅延なしに、新しいデータが即座に検索可能になります。</p></li>
<li><p><strong>継続的なクエリー提供</strong>：高スループット・インジェストと低レイテンシ・クエリの同時実行</p></li>
</ul>
<p>ストリーミングをバッチ処理から切り離すことで、Milvusは大量のデータを取り込む際にも安定したパフォーマンスと検索の鮮度を維持することができます。水平スケーラビリティを念頭に設計されており、データスループットに応じてノードの容量を動的に拡張します。</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">マルチテナント機能の強化：クラスタあたり10万コレクションまで拡張可能</h3><p>エンタープライズの展開では、テナントレベルの分離が必要になることがよくあります。Milvus 2.6では、クラスタあたり最大<strong>100,000コレクションまで</strong>拡張できるようになり、マルチテナントのサポートが劇的に向上しました。これは、多数のテナントにサービスを提供するモノリシックな大規模クラスタを運用する組織にとって極めて重要な改善です。</p>
<p>この改善は、メタデータ管理、リソース割り当て、クエリプランニングに関する数多くのエンジニアリングの最適化によって可能となりました。Milvusユーザーは、数万のコレクションを使用しても安定したパフォーマンスを享受できるようになりました。</p>
<h3 id="Other-Improvements" class="common-anchor-header">その他の改善点</h3><p>Milvus 2.6では、CDC + BulkInsertによる地域間のデータレプリケーションの簡素化、Coord Mergeによる大規模展開におけるクラスタ調整の改善など、アーキテクチャの強化が行われています。</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6を始めるにあたって<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6は、Zillizのエンジニアと素晴らしいコミュニティの貢献者によって共同開発された数多くの新機能とパフォーマンスの最適化を含む大規模なエンジニアリングの取り組みです。ここでは主要な機能を取り上げましたが、まだまだ発見があります。このリリースで提供されるすべてのものを探求するために、私たちの包括的な<a href="https://milvus.io/docs/release_notes.md">リリースノートに</a>飛び込むことを強くお勧めします！</p>
<p>完全なドキュメント、マイグレーションガイド、チュートリアルは<a href="https://milvus.io/"> Milvus</a>ウェブサイトでご覧いただけます。ご質問やコミュニティサポートについては、<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>ご参加いただくか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題をご投稿ください。</p>
