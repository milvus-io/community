---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: RedditでのANN検索のためのベクトルデータベースの選択
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: この投稿では、Redditチームが最適なベクターデータベースを選択するために使用したプロセスと、Milvusを選んだ理由について説明する。
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>この投稿はRedditのスタッフ・ソフトウェア・エンジニアであるChris Fournieによって書かれ、元々は</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Redditに</a><em>掲載されたもの</em>である。</p>
<p>2024年、Redditチームは近似最近傍（ANN）ベクトル検索を実行するために様々なソリューションを使用した。Googleの<a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI Vector Searchや</a>、いくつかの大きなデータセットに<a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">Apache SolrのANNベクトル検索を</a>使用する実験から、小さなデータセット（縦方向にスケーリングされたサイドカーでホストされている）にはFacebookの<a href="https://github.com/facebookresearch/faiss">FAISSライブラリまで</a>。Redditでは、費用対効果が高く、希望する検索機能を備え、Redditサイズのデータに拡張できる、幅広くサポートされたANNベクトル検索ソリューションを求めるチームが増えていた。このニーズに応えるため、2025年、私たちはRedditチームにとって理想的なベクトルデータベースを探しました。</p>
<p>この投稿では、現在のRedditのニーズに最適なベクトルデータベースを選択するために使用したプロセスを説明します。全体として最適なベクターデータベースや、あらゆる状況において最も必要な機能要件と非機能要件のセットを説明するものではありません。Redditとそのエンジニアリング文化が、ベクターデータベースを選択する際に何を重視し、何を優先したかを説明しています。この投稿は、独自の要件収集と評価のインスピレーションになるかもしれませんが、組織にはそれぞれ独自の文化、価値観、ニーズがあります。</p>
<h2 id="Evaluation-process" class="common-anchor-header">評価プロセス<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>全体的な選定ステップは次のとおりです：</p>
<p>1.チームからコンテキストを収集する</p>
<p>2.ソリューションを定性的に評価</p>
<p>3.上位候補を定量的に評価</p>
<p>4.最終選考</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1.チームからコンテキストを収集</h3><p>ANNベクトル検索に興味を持つチームから、3つのコンテキストを収集した：</p>
<ul>
<li><p>機能要件（例：ベクトル検索と語彙検索のハイブリッド？範囲検索クエリ？ベクトル以外の属性によるフィルタリング？）</p></li>
<li><p>非機能要件（例：1Bベクトルをサポートできるか？ P99レイテンシ＜100msを達成できるか？）</p></li>
<li><p>ベクターデータベースはすでにチームが興味を持っていた</p></li>
</ul>
<p>チームに要件をヒアリングするのは簡単なことではない。多くのチームは、自分たちが現在どのように問題を解決しているかという観点から自分たちのニーズを説明します。</p>
<p>例えば、あるチームはすでにFAISSをANNベクトル検索に使用しており、新しいソリューションは検索呼び出し1回につき10Kの結果を効率的に返さなければならないと述べていた。さらに議論してみると、10Kの結果の理由は、ポストホックフィルタリングを行う必要があるからであり、FAISSはクエリ時にANN結果をフィルタリングする機能を提供していない。彼らの実際の問題は、フィルタリングが必要であるということであり、効率的なフィルタリングを提供するソリューションがあればそれで十分であり、10Kの結果を返すことは、単にリコールを向上させるために必要な回避策であった。彼らの理想は、最近傍を見つける前にコレクション全体を事前にフィルタリングすることである。</p>
<p>チームがすでに使用している、あるいは興味を持っているベクターデータベースを尋ねることも貴重だった。少なくとも1つのチームが現在のソリューションに肯定的な見解を持っていれば、ベクトルデータベースが全社で共有できる有用なソリューションになり得るというサインだ。あるソリューションに対して否定的な意見しかないチームは、選択肢に含めるべきではない。チームが興味を持っているソリューションを受け入れることは、チームがプロセスに加わっていると感じ、評価すべき有力候補の初期リストを形成するのに役立ったことを確認する方法でもあった。</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2.ソリューションを定性的に評価</h3><p>チームが興味を持ったソリューションのリストから始めて、どのANNベクトル検索ソリューションが我々のニーズに最も適しているかを定性的に評価するために、我々は以下のことを行った：</p>
<ul>
<li><p>各ソリューションを調査し、各要件をどの程度満たしているかを、その要件の重み付けされた重要度に対して採点した。</p></li>
<li><p>定性的な基準と議論に基づいてソリューションを削除</p></li>
<li><p>定量的にテストする上位N個のソリューションを選択</p></li>
</ul>
<p>ANNベクトル検索ソリューションのスタートリストには以下のものが含まれていた：</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>オープンサーチ</p></li>
<li><p>Pgvector (既にRDBMSとしてPostgresを使っている)</p></li>
<li><p>Redis (KVストアとキャッシュとして使用済み)</p></li>
<li><p>Cassandra (すでに非ANN検索に使用)</p></li>
<li><p>Solr（すでに字句検索に使用し、ベクトル検索も実験済み）</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI（ANNベクトル検索に使用済み）</p></li>
</ul>
<p>次に、各チームから挙げられたすべての機能要件と非機能要件に加え、私たちのエンジニアリングの価値と目標を表すいくつかの制約を取り、スプレッドシートにそれらの行を作成し、それらがどの程度重要であるかを量りました（1から3まで。）</p>
<p>比較するソリューションごとに、各システムがどの程度その要件を満たしているかを（0から3の尺度で）評価した（下表）。この方法での採点はやや主観的であったため、1つのシステムを選び、その採点例を根拠とともに文書で示し、レビュアーにそれらの例を参照させた。また、各得点値の付け方について、次のような指針を示した：</p>
<ul>
<li><p>0: サポートなし/要件サポートの証拠なし</p></li>
<li><p>1: 基本的または不十分な要件サポート</p></li>
<li><p>2: 要件が合理的にサポートされている</p></li>
<li><p>3: 類似のソリューションを凌駕する強固な要件サポート</p></li>
</ul>
<p>次に、ソリューションの要件スコアとその要件の重要度の積の合計を取ることで、各ソリューションの総合スコアを作成した（例えば、Qdrantは重要度2の再ランク付け／スコア結合に3点を獲得したため、3 x 2 = 6となり、これをすべての行について繰り返し、合計する）。最後に、ソリューションのランク付けや議論、そしてどの要件が最も重要であるかの基準として使用できる総合的なスコアが得られます（スコアは最終的な決定に使用されるのではなく、議論のツールとして使用されることに注意してください）。</p>
<p><strong><em>編集部注：</em></strong> <em>このレビューはMilvus 2.4に基づいています。その後、Milvus 2.5、</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6が</em></a> <em>リリース</em><em>され、Milvus 3.0が目前に迫っているため、いくつかの数値は古くなっているかもしれません。それでも、この比較は依然として強力な洞察を提供し、非常に有用であることに変わりはない。</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>カテゴリー</strong></td><td><strong>重要度</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>カサンドラ</strong></td><td><strong>Weviate</strong></td><td><strong>ソラー</strong></td><td><strong>バーテックスAI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>検索タイプ</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">ハイブリッド検索</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>キーワード検索</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>近似NN探索</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>範囲検索</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>再ランキング／得点の組み合わせ</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>インデックス作成方法</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>複数のインデックス方式をサポート</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>量子化</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>ロカリティ・センシティブ・ハッシング（LSH）</td><td>1</td><td>0</td><td>0Note:<a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 がサポートしています。 </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>データ</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>float以外のベクトル型</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>ベクトル上のメタデータ属性（複数の属性、大きなレコードサイズなどをサポート）</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>メタデータのフィルタリングオプション（メタデータでフィルタリング可能、事前/事後フィルタリングあり）</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>メタデータ属性のデータ型（堅牢なスキーマ、bool、int、string、json、arrayなど）</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>メタデータ属性の制限（レンジクエリ、例：10 &lt; x &lt; 15）</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>属性による結果の多様性（例：各サブレディットからの回答結果がN件以下であること）</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>スケール</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>数億ベクトル指数</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>億ベクトル指数</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>少なくとも2kのサポートベクトル</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>2k以上のサポートベクトル</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 レイテンシ 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 レイテンシ &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99.9% 可用性検索</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99.99%の可用性 インデックス/ストレージ</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>ストレージ運用</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>AWSでホスティング可能</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>マルチ・リージョン</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>ゼロダウンタイムアップグレード</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>マルチクラウド</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>API/ライブラリ</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>図書館へ行く</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Javaライブラリ</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>パイソン</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>その他の言語（C++、Rubyなど）</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>ランタイムオペレーション</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>プロメテウスのメトリクス</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>DB の基本操作</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>アップサート</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Kubernetes オペレーター</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>結果のページネーション</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>IDによるルックアップの埋め込み</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>エンベッディングを候補IDと候補スコアで返す</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ユーザー提供ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>大規模なバッチ検索が可能</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>バックアップ/スナップショット：データベース全体のバックアップを作成する機能をサポートしています。</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>効率的な大規模インデックスのサポート（コールドストレージとホットストレージの区別）</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>サポート/コミュニティ</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ベンダーの中立性</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>堅牢なAPIサポート</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ベンダーサポート</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>コミュニティ速度</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>生産ユーザーベース</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>コミュニティ感</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Githubスター</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>構成</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>秘密の取り扱い</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>ソース</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>オープンソース</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>言語</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>リリース</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>上流試験</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>文書の入手可能性</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>コスト</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>費用対効果</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>パフォーマンス</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>CPU、メモリ、ディスクのリソース使用率のチューニングをサポート</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>マルチノード（ポッド）シャーディング</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>待ち時間とスループットのバランスをとるためにシステムをチューニングする能力がある。</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ユーザー定義パーティショニング（書き込み）</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>マルチテナント</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>パーティショニング</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>レプリケーション</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>冗長性</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>自動フェイルオーバー</td><td>3</td><td>2</td><td>0 注：<a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6がサポートしています。 </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ロードバランシング</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>GPUサポート</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>クドラント</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>カサンドラ</strong></td><td><strong>Weviate</strong></td><td><strong>ソル</strong></td><td><strong>バーテックスAI</strong></td></tr>
<tr><td><strong>ソリューション全体のスコア</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>私たちは、さまざまなシステムの総合スコアと要件スコアについて議論し、要件の重要性を適切に重み付けしたかどうか、また、要件の中には、中核的な制約と考えるべきほど重要なものがあるかどうかを理解しようと努めました。そのような要件の 1 つとして、ソリューションがオープンソースであるかどうかが挙げられた。オープンソースソフトウェアへの貢献と使用は、Redditのエンジニアリング文化の重要な部分です。そのため、ホスティングのみのソリューション（Vertex AI、Pinecone）は検討対象から外しました。</p>
<p>ディスカッションの中で、いくつかの重要な要件が私たちにとって非常に重要であることがわかりました：</p>
<ul>
<li><p>スケールと信頼性：100M以上、あるいは1B以上のベクターでソリューションを実行している他社の証拠を見たかった。</p></li>
<li><p>コミュニティ：私たちは、急速に成熟しつつあるこの分野で、勢いのある健全なコミュニティを持つソリューションを求めていました。</p></li>
<li><p>より多くのユースケース（日付、ブーリアンなどによるフィルタリング）を可能にする、表現力豊かなメタデータ・タイプとフィルタリング。</p></li>
<li><p>HNSWやDiskANNだけでなく、複数のインデックスタイプをサポートすることで、多くのユニークなユースケースのパフォーマンスを向上させる。</p></li>
</ul>
<p>ディスカッションの結果、主要な要件を絞り込み、定量的にテストすることにしました：</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa</p></li>
<li><p>Weviate</p></li>
</ol>
<p>残念ながら、このような決定には時間とリソースが必要です。予算を考慮し、QdrantとMilvusをテストし、VespaとWeviateのテストはストレッチゴールとして残すことにしました。</p>
<p>QdrantとMilvusの比較は、2つの異なるアーキテクチャの興味深いテストでもありました：</p>
<ul>
<li><p><strong>Qdrant：</strong>Qdrant：すべてのANNベクトルデータベース操作を実行する同種のノードタイプ</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">異種ノードタイプ</a>（Milvus; 一つはクエリ、もう一つはインデックス作成、もう一つはデータインジェスト、プロキシなど。）</p></li>
</ul>
<p>どれがセットアップが簡単だったか？どれが実行しやすかったか？そして、私たちが気にかけているユースケースやスケールに対して、どれが最も良いパフォーマンスなのか？このような疑問に答えながら、ソリューションを定量的に比較した。</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3.トップ候補を定量的に評価</h3><p>私たちは、各ソリューションのスケーラビリティをよりよく理解し、その過程で、各ソリューションのセットアップ、設定、保守、運用がどのようなものかを体験したいと考えました。これを行うために、3つの異なるユースケースのドキュメントとクエリベクトルの3つのデータセットを収集し、Kubernetes内で同様のリソースで各ソリューションをセットアップし、各ソリューションにドキュメントをロードし、<a href="https://k6.io/">GrafanaのK6を</a>使用して同一のクエリロードを送信しました。</p>
<p>私たちは、スループット、各ソリューションの限界点、スループットとレイテンシの関係、負荷がかかった状態でノードを失った場合の反応（エラー率、レイテンシへの影響など）をテストしました。特に興味深かったのは、<strong>レイテンシに対するフィルタリングの効果</strong>だった。また、ドキュメントに記載されている機能（アップサート、削除、IDによる取得、ユーザー管理など）が説明どおりに機能するかどうかを検証し、それらのAPIの人間工学を体験するための単純なYES/NOテストも行った。</p>
<p><strong>テストはMilvus v2.4とQdrant v1.12で行いました。</strong>時間的制約のため、全てのタイプのインデックス設定を網羅的にチューニング、テストしたわけではありません。同様の設定を各ソリューションで使用し、高いANNリコールにバイアスをかけ、テストはHNSWインデックスのパフォーマンスに焦点を当てました。同様の CPU とメモリリソースが各ソリューションに与えられた。</p>
<p>我々の実験では、2つのソリューションの間にいくつかの興味深い違いを発見した。以下の実験では、各ソリューションは、HNSW、M=16、efConstruction=100で、それぞれ384次元の約340MのRedditポストベクトルを持つ。</p>
<p>ある実験では、同じクエリスループット（同時にインジェストを行わず100QPS）の場合、フィルタリングを追加することで、MilvusのレイテンシがQdrantよりも影響を受けることがわかりました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>フィルタリングによるポストクエリのレイテンシ</p>
<p>もう一つ、MilvusよりもQdrantの方が、インジェストとクエリ負荷の相互作用が大きいことがわかりました（スループット一定で下図）。Milvusはインジェストとクエリのトラフィックを別々のノードで行っているのに対し、Qdrantはインジェストとクエリのトラフィックを同じノードで行っています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>インジェスト時のクエリレイテンシ@100 QPSの投稿</p>
<p>属性による結果の多様性（例えば、レスポンスで各サブレディットからN件以下の結果を得る）をテストしたところ、同じスループットでMilvusはQdrantよりもレイテンシが悪いことがわかりました（100 QPSの場合）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>結果の多様性とポストクエリの待ち時間</p>
<p>さらに、データの複製を増やした場合（複製係数RFを1から2に増やした場合）、各ソリューションがどの程度効果的にスケールするかを確認しました。RF=1の場合、QdrantはMilvusよりも高いスループットで満足のいくレイテンシーを得ることができました（テストがエラーなく完了しなかったため、高いQPSは表示されていません）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrantは様々なスループットでRF=1のレイテンシを実現</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusは様々なスループットでRF=1のレイテンシを実現。</p>
<p>レプリケーション係数を増加させると、Qdrantのp99レイテンシは改善されたが、MilvusはQdrantよりも高いスループットを維持し、レイテンシも許容範囲内であった（Qdrant 400 QPSはレイテンシが高くエラーが発生したためテストが完了しなかったため表示されていない）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusは様々なスループットでRF=2のレイテンシを記録。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrantはスループットを変えながらRF=2のレイテンシを記録</p>
<p>時間的制約のため、我々のデータセットにおけるソリューション間の ANN リコールを比較するのに十分な時間がなかったが、一般に利用可能なデータセットで<a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a>から提供されたソリューションの ANN リコール測定値を考慮した。</p>
<h3 id="4-Final-selection" class="common-anchor-header">4.最終選択</h3><p><strong>性能面では</strong>、あまりチューニングせず、HNSWのみを使用した場合、Qdrantの方がMilvusよりも多くのテストでレイテンシが優れているように見えた。しかし、Milvusはレプリケーションを増やせば増やすほどスケールし、マルチノード型のアーキテクチャのため、インジェストとクエリ負荷の分離が優れているように見えました。</p>
<p><strong>運用面では、</strong>Milvusのアーキテクチャの複雑さ（複数のノードタイプ、Kafkaのような外部ライトアヘッドログとetcdのようなメタデータストアへの依存）にもかかわらず、どちらのソリューションもQdrantよりデバッグや修正が容易でした。Milvusはまた、コレクションのレプリケーション係数を増加させる際に自動的にリバランスを行います。一方、オープンソースのQdrantでは、レプリケーション係数を増加させるために手動でシャードを作成または削除する必要があります（この機能は、私たち自身で構築するか、オープンソースでないバージョンを使用する必要がありました）。</p>
<p>MilvusはQdrantよりも "Reddit型 "の技術であり、我々の他の技術スタックとの共通点が多い。Milvusは、私たちが好むバックエンドプログラミング言語であるGolangで書かれているため、Rustで書かれているQdrantよりも貢献しやすい。MilvusはQdrantに比べ、オープンソースの割にプロジェクトの速度が速く、私たちの主要な要件を満たしていました。</p>
<p>最終的には、どちらのソリューションも私たちの要求のほとんどを満たしており、場合によってはQdrantの方がパフォーマンスが優れていることもありましたが、私たちはMilvusの方がより拡張でき、より快適に運用でき、Qdrantよりも私たちの組織にマッチしていると感じました。VespaとWeaviateをテストする時間がもっとあれば良かったのですが、組織への適合性（VespaはJavaベース）やアーキテクチャ（WeaviateはQdrantと同じシングルノードタイプ）の観点から、これらの製品も選ばれたのかもしれません。</p>
<h2 id="Key-takeaways" class="common-anchor-header">キーポイント<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>与えられた要件に挑戦し、既存のソリューションのバイアスを取り除く。</p></li>
<li><p>候補となるソリューションに点数をつけ、それをすべてとしてではなく、必須要件の議論に役立てる。</p></li>
<li><p>ソリューションを定量的に評価するが、その過程で、そのソリューションで作業することがどのようなものかをメモする。</p></li>
<li><p>単にソリューションの性能が最高だからではなく、メンテナンス、コスト、使いやすさ、パフォーマンスの観点から、組織内で最もフィットするソリューションを選ぶ。</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">謝辞<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>この評価作業は、Ben Kochie、Charles Njoroge、Amit Kumar、そして私が行った。また、アニー・ヤン、コンラッド・ライヒ、サブリナ・コング、アンドリュー・ジョンソンなど、この作業に貢献してくれた他の人々にも感謝する。</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">編集者コメント<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusをベクトル検索ワークロードに採用していただいただけでなく、このような詳細かつ公正な評価を公表するために時間を割いていただいたRedditエンジニアリングチームに心から感謝したい。実際のエンジニアリングチームがどのようにデータベースを比較しているのか、このようなレベルの透明性を見ることは稀であり、彼らの記事は、成長するベクトルデータベースの状況を理解しようとしているMilvusコミュニティ（およびそれ以外）の誰にとっても役に立つだろう。</p>
<p>クリスが投稿で述べたように、単一の "ベスト "ベクターデータベースは存在しない。重要なのは、システムがあなたの作業負荷、制約、運用哲学に合っているかどうかだ。Redditの比較はその現実をよく反映している。Milvusはすべてのカテゴリーでトップではないが、異なるデータモデルやパフォーマンス目標間のトレードオフを考えれば、それは完全に予想されることだ。</p>
<p>ひとつ明確にしておきたいことがある：Redditの評価では、当時の安定リリースであった<strong>Milvus 2.</strong>4を使用している。LSHやいくつかのインデックスの最適化など、いくつかの機能は2.4ではまだ存在していなかったか、成熟していなかったため、いくつかのスコアは当然その古いベースラインを反映しています。それ以来、Milvus 2.5、そして<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6を</strong></a>リリースし、パフォーマンス、効率性、柔軟性の面で全く異なるシステムとなっている。コミュニティーの反応は強く、すでに多くのチームがアップグレードを行いました。</p>
<p><strong>Milvus 2.6の新機能を簡単にご紹介します：</strong></p>
<ul>
<li><p>RaBitQ 1ビット量子化により、<strong>メモリ使用量を最大72%削減</strong>し、<strong>クエリを4倍高速化</strong>。</p></li>
<li><p>インテリジェント階層型ストレージによる<strong>50％のコスト削減</strong></p></li>
<li><p>Elasticsearchと比較して<strong>4倍高速なBM25全文検索</strong></p></li>
<li><p>新しいパスインデックスによる<strong>100倍高速なJSONフィルタリング</strong></p></li>
<li><p>より新鮮な検索をより低コストで実現する新しいゼロディスクアーキテクチャ</p></li>
<li><p>パイプラインを組み込むための、よりシンプルな「データイン、データアウト」ワークフロー</p></li>
<li><p>大規模なマルチテナント環境に対応するための<strong>100K以上のコレクションの</strong>サポート</p></li>
</ul>
<p>詳細がお知りになりたい方は、こちらをご覧ください：</p>
<ul>
<li><p>ブログ<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6リリースノート： </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：ベクターデータベースの実世界ベンチマーク - Milvusブログ</a></p></li>
</ul>
<p>機能についてのご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discord チャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHub</a> に課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
