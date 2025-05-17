---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: Milvus 2.6プレビュー：Elasticsearch よりも4倍高速で、リコールも損なわずにメモリを72%削減
author: Ken Zhang
date: 2025-05-16T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: ベクターデータベースのパフォーマンスと効率性を再定義する、次期Milvus 2.6の革新的な機能を独占初公開。
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>今週は、ベクトルデータベース技術の限界を押し広げるMilvusのエキサイティングなイノベーションの数々をご紹介します：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界でのベクトル検索：想起を犠牲にすることなく効率的にフィルタリングする方法 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクターDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusのためにKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH：LLMトレーニングデータの重複と戦う秘密兵器 </a></p></li>
</ul>
<p>さて、Milvus Weekシリーズを締めくくるにあたり、Milvus 2.6（現在開発中の2025年製品ロードマップの重要なマイルストーン）で何が実現されるのか、そしてこれらの改良がAIを活用した検索をどのように変革するのか、その一端をご紹介したいと思います。このリリースでは、<strong>コスト効率の最適化</strong>、<strong>高度な検索機能</strong>、100億ベクトル規模を超えるベクトル検索を推進する<strong>新アーキテクチャという</strong>3つの重要な側面において、これらすべてのイノベーションとそれ以上のものが結集されます。</p>
<p>Milvus 2.6が今年6月にリリースされる際に期待される主な改善点を、最も即効性のあるもの、すなわちメモリ使用量とコストの劇的な削減と超高速パフォーマンスから見ていこう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">コスト削減：パフォーマンスを向上させながらメモリ使用量を削減<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>高価なメモリに依存することは、ベクトル検索を数十億レコードまで拡張する上で最大の障害の一つである。Milvus 2.6では、パフォーマンスを向上させながらインフラコストを劇的に削減する、いくつかの重要な最適化が導入されます。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1ビット量子化：4倍のQPSとリコールロスなしで72%のメモリ削減</h3><p>メモリ消費は長い間、大規模ベクトル・データベースのアキレス腱でした。ベクトル量子化は新しいものではありませんが、既存のアプローチのほとんどは、メモリ節約のために検索品質を犠牲にしすぎています。Milvus 2.6では、<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQの1ビット量子化を</a>本番環境に導入することで、この課題に正面から取り組みます。</p>
<p>我々の実装が特別なのは、我々が構築している調整可能なRefine最適化機能である。RaBitQ量子化とSQ4/SQ6/SQ8 Refineオプションを持つ一次インデックスを実装することで、メモリ使用量と検索品質（～95%リコール）の最適なバランスを達成しました。</p>
<p>予備的なベンチマークでは有望な結果が得られている：</p>
<table>
<thead>
<tr><th><strong>パフォーマンス</strong> <strong>指標</strong></th><th><strong>従来のIVF_FLAT</strong></th><th><strong>RaBitQ（1ビット）のみ</strong></th><th><strong>RaBitQ (1ビット) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>メモリフットプリント</td><td>100%（ベースライン）</td><td>3%（97%削減）</td><td>28% (72%削減)</td></tr>
<tr><td>リコール品質</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>クエリスループット (QPS)</td><td>236</td><td>648（2.7倍高速）</td><td>946（4倍高速）</td></tr>
</tbody>
</table>
<p><em>表AWSのm6id.2xlargeでテストされた768次元の1MベクトルによるVectorDBBenchの評価</em></p>
<p>ここでの真のブレークスルーは、メモリ削減だけでなく、精度を損なうことなく4倍のスループット向上を同時に実現したことです。つまり、75％少ないサーバーで同じワークロードを処理したり、既存のインフラで4倍のトラフィックを処理できるようになるのです。</p>
<p>Milvus on<a href="https://zilliz.com/cloud"> Zilliz Cloudを</a>フルマネージドでご利用の企業ユーザー様には、お客様のワークロード特性や精度要件に基づいてRaBitQパラメータを動的に調整する自動設定プロファイルを開発中です。</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Elasticsearchより400%高速な全文検索</h3><p>ベクトルデータベースにおける<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文検索</a>機能は、ハイブリッド検索システムの構築に不可欠なものとなっています。<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus2.5で</a>BM25を導入して以来、スケールでの性能向上の要望とともに、熱烈なフィードバックをいただいてきました。</p>
<p>Milvus 2.6では、BM25の大幅な性能向上を実現します。BEIRデータセットのテストでは、Elasticsearchと同等の想起率で3-4倍高いスループットを示しています。一部のワークロードでは、最大7倍のQPS向上が見られます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：MilvusとElasticsearchのスループット比較 JSON Path Index：複雑なフィルタリングのレイテンシーを99%削減</p>
<p>最新のAIアプリケーションでは、ベクトルの類似性だけに依存することはほとんどなく、ほとんどの場合、ベクトル検索とメタデータのフィルタリングが組み合わされています。これらのフィルタリング条件がより複雑になるにつれて（特にネストされたJSONオブジェクトの場合）、クエリのパフォーマンスは急速に悪化する可能性があります。</p>
<p>Milvus2.6では、JSONフィールド内の特定のパス($meta.<code translate="no">user_info.location</code> など)に対してインデックスを作成できる、ネストしたJSONパスに対するターゲットインデックスメカニズムを導入します。Milvusはオブジェクト全体をスキャンする代わりに、事前に作成されたインデックスから値を直接検索します。</p>
<p>100M以上のレコードを使用した評価では、JSON Path Indexはフィルタの待ち時間を<strong>140ms</strong>（P99：480ms）からわずか<strong>1.5ms</strong>（P99：10ms）に短縮しました。</p>
<p>この機能は、特に以下のような用途に役立ちます：</p>
<ul>
<li><p>複雑なユーザー属性フィルタリングを行うレコメンデーションシステム</p></li>
<li><p>様々なラベルで文書をフィルタリングするRAGアプリケーション</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">次世代検索：基本的なベクトル類似性からプロダクション・グレードの検索へ<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索だけでは、最新のAIアプリケーションには不十分です。ユーザは、従来の情報検索の精度とベクトル埋め込みによる意味理解を組み合わせたものを求めています。Milvus 2.6では、このギャップを埋めるいくつかの高度な検索機能が導入されます。</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">多言語アナライザーによる全文検索の向上</h3><p>Milvus 2.6では、多言語に対応し、完全に刷新されたテキスト解析パイプラインが導入されます：</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> アナライザー/トークン化コンフィギュレーションのオブザーバビリティのための構文サポート</p></li>
<li><p>日本語や韓国語などのアジア言語用のLinderaトークナイザー</p></li>
<li><p>包括的な多言語サポートのためのICUトークナイザー</p></li>
<li><p>言語固有のトークン化ルールを定義するためのきめ細かな言語設定</p></li>
<li><p>カスタム辞書の統合をサポートするJiebaの強化</p></li>
<li><p>より正確なテキスト処理のためのフィルター・オプションの拡張</p></li>
</ul>
<p>グローバルなアプリケーションでは、言語ごとに特化したインデックス作成や複雑な回避策なしに、より優れた多言語検索が可能になります。</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">フレーズマッチ：語順の意味的ニュアンスを捉える</h3><p>語順は、キーワード検索では見逃されがちな重要な意味の区別を伝えます。機械学習技術 &quot;と &quot;学習機械技術 &quot;を比較してみてください。</p>
<p>Milvus 2.6では、<strong>フレーズマッチが</strong>追加され、全文検索や文字列の完全一致よりも、語順や近さをより自由にコントロールできるようになります：</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">slop</code> パラメータにより、単語の近接度を柔軟に制御することができます。-0 の場合、完全な連続一致が要求されますが、それ以上の値の場合、言い回しの細かなバリエーションが可能になります。</p>
<p>この機能は特に次のような場合に役立ちます：</p>
<ul>
<li><p>正確な言い回しが法的な意味を持つ法律文書検索</p></li>
<li><p>用語の順序が異なる概念を区別する技術コンテンツ検索</p></li>
<li><p>特定の技術フレーズを正確にマッチさせる必要がある特許データベース</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">時間を考慮したディケイ機能：新鮮なコンテンツを自動的に優先</h3><p>情報価値は時間とともに減少することが多い。しかし、従来の検索アルゴリズムは、タイムスタンプに関係なく、すべてのコンテンツを平等に扱っていました。</p>
<p>Milvus2.6では、時間を考慮したランキングのための<strong>Decay Functionを</strong>導入し、ドキュメントの古さに基づいて関連性のスコアを自動的に調整します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>設定できるようになります：</p>
<ul>
<li><p><strong>関数の種類</strong>関数タイプ：指数関数（急速減衰）、ガウス関数（緩やか減衰）、線形関数（一定減衰）</p></li>
<li><p><strong>減衰率</strong>：時間の経過とともに関連性が減少する速さ</p></li>
<li><p><strong>原点</strong>：時間差を測定するための基準タイムスタンプ</p></li>
</ul>
<p>この時間差による再ランキングは、最新かつ文脈に関連した結果が最初に表示されることを保証し、ニュース推薦システム、eコマース・プラットフォーム、ソーシャルメディア・フィードにとって極めて重要である。</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">データイン、データアウト：生テキストからベクトル検索までワンステップで</h3><p>ベクトルデータベースにおける開発者の最大の悩みの一つは、生データとベクトル埋め込みとの間の断絶でした。Milvus 2.6は、サードパーティのエンベッディングモデルをデータパイプラインに直接統合する新しい<strong>関数</strong>インターフェイスにより、このワークフローを劇的に簡素化します。これにより、1回の呼び出しでベクトル検索パイプラインを合理化することができます。</p>
<p>エンベッディングを事前に計算する代わりに、以下のことができるようになります：</p>
<ol>
<li><p><strong>生データを直接挿入する</strong>：テキスト、画像、その他のコンテンツをMilvusに送信する。</p></li>
<li><p><strong>ベクトル化のための埋め込みプロバイダーの設定</strong>：Milvusは、OpenAI、AWS Bedrock、Google Vertex AI、Hugging Faceのような埋め込みモデルサービスに接続することができます。</p></li>
<li><p><strong>自然言語によるクエリ</strong>：ベクトル埋め込みではなく、テキストクエリを使った検索。</p></li>
</ol>
<p>これにより、Milvusが内部でベクトル生成を処理する、合理化された "データイン、データアウト "エクスペリエンスが実現され、アプリケーションコードがより簡単になります。</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">アーキテクチャの進化：数千億ベクトルへのスケーリング<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>優れたデータベースは、単に優れた機能を持つだけでなく、それらの機能を実運用でテストされたスケールで提供する必要があります。</p>
<p>Milvus 2.6では、数千億ベクターへのコスト効率の良いスケーリングを可能にする基本的なアーキテクチャの変更が導入されます。そのハイライトは、アクセスパターンに基づいてデータの配置をインテリジェントに管理し、ホットデータを高性能なメモリ/SSDに自動的に移動させる一方で、コールドデータをより経済的なオブジェクトストレージに配置する、新しいホット/コールド階層型ストレージアーキテクチャです。このアプローチにより、最も重要なクエリ・パフォーマンスを維持しながら、コストを劇的に削減することができます。</p>
<p>さらに、新しい<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">ストリーミング・ノードにより</a>、KafkaやPulsarのようなストリーミング・プラットフォームや新しく作成された<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpeckerと</a>直接統合することで、リアルタイムのベクトル処理が可能になり、バッチ遅延なしに新しいデータを即座に検索できるようになります。</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Milvus 2.6にご期待ください。<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6は現在活発に開発が進められており、今年6月にリリースされる予定です。これらの画期的なパフォーマンスの最適化、高度な検索機能、そしてスケーラブルなAIアプリケーションを低コストで構築するための新しいアーキテクチャをお届けできることを楽しみにしています。</p>
<p>また、今後の機能に関するご意見もお待ちしております。何が最もエキサイティングですか？あなたのアプリケーションに最も影響を与える機能はどれですか？<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルで</a>会話に参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubで</a>進捗をフォローしてください。</p>
<p>Milvus 2.6のリリースをいち早く知りたいですか？<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a>または<a href="https://twitter.com/milvusio"> Xで</a>最新情報をフォローしてください。</p>
