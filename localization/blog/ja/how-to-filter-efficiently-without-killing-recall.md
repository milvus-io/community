---
id: how-to-filter-efficiently-without-killing-recall.md
title: 実世界でのベクトル検索：想起を犠牲にすることなく効率的にフィルタリングする方法
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: このブログでは、MilvusとZilliz Cloudに組み込まれた革新的な最適化とともに、ベクトル検索でよく使われるフィルタリング技術について説明します。
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>多くの人は、ベクトル検索を単にANN（近似最近傍）アルゴリズムを実装して終わりと考えている。しかし、本番でベクトル検索を実行するのであれば、真実はわかっているはずだ。</p>
<p>製品検索エンジンを作っているとしよう。ユーザーは、"<em>この写真に似た靴を紹介してください。</em>このクエリに対応するには、意味的類似性の検索結果にメタデータフィルターを適用する必要がある。ベクトル検索が返ってきた後にフィルタを適用するのと同じくらい単純に聞こえるだろうか？そうとも言えない。</p>
<p>フィルタリングの条件が高度に選択的な場合はどうなるでしょうか？十分な結果が返ってこないかもしれない。また、ベクトル検索の<strong>topK</strong>パラメータを単純に増やすと、同じ検索量を処理するために、すぐにパフォーマンスが低下し、より多くのリソースを消費する可能性がある。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>つまり、効率的なメタデータ・フィルタリングは非常に難しいのです。ベクター・データベースはグラフ・インデックスをスキャンし、メタデータ・フィルターを適用し、20ミリ秒という厳しいレイテンシ予算内で応答する必要がある。このようなクエリを1秒間に何千件も、破綻することなく処理するには、思慮深いエンジニアリングと慎重な最適化が必要です。</p>
<p>このブログでは、ベクトル検索で一般的なフィルタリング技術と、<a href="https://milvus.io/docs/overview.md">Milvus</a>ベクトルデータベースとそのフルマネージドクラウドサービス<a href="https://zilliz.com/cloud">（Zilliz Cloud</a>）に組み込まれた革新的な最適化について説明します。また、フルマネージドMilvusが1000ドルのクラウド予算で他のベクターデータベースよりどれだけ高いパフォーマンスを達成できるかを実証するベンチマークテストもご紹介します。</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">グラフインデックスの最適化<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースが大規模なデータセットを扱うには、効率的なインデックス作成方法が必要です。インデックスがない場合、データベースはクエリをデータセット内のすべてのベクトルと比較しなければならず（ブルートフォーススキャン）、データが大きくなるにつれて非常に遅くなります。</p>
<p><strong>Milvusは</strong>このパフォーマンス上の課題を解決するために様々なインデックスタイプをサポートしています。最も一般的なものはグラフベースのインデックスタイプです：HNSW（完全にメモリ内で実行）とDiskANN（メモリとSSDの両方を効率的に使用）です。これらのインデックスは、ベクトルをネットワーク構造に整理し、ベクトルの近傍がマップ上で接続されているため、全ベクトルのごく一部のみをチェックしながら、関連する結果に素早くナビゲートすることができる。Milvusのフルマネージドサービスである<strong>Zilliz Cloudは</strong>、独自の高度なベクトル検索エンジンであるCardinalを導入することで、これらのインデックスをさらに強化し、パフォーマンスをさらに向上させている。</p>
<p>しかし、フィルタリング要件（「100ドル未満の商品のみを表示する」など）を追加すると、新たな問題が浮上する。標準的なアプローチでは、<em>ビットセットを</em>作成します。つまり、どのベクターがフィルター基準を満たすかを示すリストです。検索中、システムはこのビットセットで有効であるとマークされたベクターだけを考慮します。このアプローチは論理的に見えますが、重大な問題を引き起こします。多くのベクトルがフィルタリングされると、グラフ・インデックスで注意深く構築されたパスが途切れてしまうのです。</p>
<p>下の図では、点AはB、C、Dに接続しているが、B、C、Dは互いに直接接続していない。もしフィルターが点Aを削除してしまうと（おそらくコストがかかりすぎる）、B、C、Dが検索に関連していたとしても、それらの間のパスは途切れてしまう。これは、検索中に到達できなくなる切断されたベクトルの「島」を作り、結果の質（リコール）を低下させる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>グラフ探索中のフィルタリングには2つの一般的なアプローチがある：前もってすべてのフィルタリングされた点を除外するか、すべてを含んでから後でフィルタを適用するかである。下図に示すように、どちらのアプローチも理想的ではない。フィルタリングされたポイントを完全にスキップすると、フィルタリングの比率が1に近づくにつれてリコールが崩壊する可能性がある（青線）。一方、メタデータに関係なくすべてのポイントを訪問すると、探索空間が肥大化し、パフォーマンスが著しく低下する（赤線）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>研究者たちは、リコールとパフォーマンスのバランスをとるためにいくつかのアプローチを提案している：</p>
<ol>
<li><strong>アルファ戦略：</strong>これは確率的アプローチを導入したもので、あるベクトルがフィルターにマッチしなくても、ある確率で検索中にそのベクトルを訪問する可能性がある。この確率（アルファ）はフィルタリングの比率（フィルタの厳しさ）に依存する。これにより、無関係なベクトルを訪問しすぎることなく、グラフの重要なつながりを維持することができる。</li>
</ol>
<ol start="2">
<li><strong>ACORN法[1]：</strong>標準的なHNSWでは、疎なグラフを作成し検索を高速化するために、インデックス構築時にエッジの刈り込みを行う。ACORN法は、より多くのエッジを保持し、接続性を強化するために、このプルーニングステップを意図的にスキップする。場合によっては、ACORNはさらに近似最近傍を集めて各ノードの近傍リストを拡張し、グラフをさらに強化する。さらに、ACORNの探索アルゴリズムは2歩先を見ており（つまり、近傍の近傍を探索する）、フィルタリングの比率が高い場合でも有効なパスを見つける可能性を高めている。</li>
</ol>
<ol start="3">
<li><strong>動的に選択された隣人：</strong>アルファ戦略を改良した手法。確率的なスキップではなく、探索中に適応的に次のノードを選択する。アルファ戦略よりも制御性が高い。</li>
</ol>
<p>Milvusでは、他の最適化手法と並行してアルファ戦略を実装した。例えば、極端に選択的なフィルタを検出した場合、動的に戦略を切り替える。例えば、約99%のデータがフィルタリング式にマッチしない場合、「include-all」戦略ではグラフのトラバーサルパスが大幅に長くなり、パフォーマンスの低下やデータの孤立した「島」を引き起こす。このような場合、Milvusは自動的にブルートフォーススキャンにフォールバックし、グラフインデックスを完全にバイパスして効率を高める。フルマネージドMilvus（Zilliz Cloud）を駆動するベクトル検索エンジンCardinalでは、クエリパフォーマンスを最適化するために、データ統計に基づいてインテリジェントに適応する「include-all」と「exclude-all」のトラバーサルメソッドの動的な組み合わせを実装することで、これをさらに推し進めた。</p>
<p>AWSのr7gd.4xlargeインスタンスを使用したCohere 1Mデータセット（ディメンション=768）の実験は、このアプローチの有効性を実証しています。下のグラフでは、青い線が私たちの動的組み合わせ戦略を表し、赤い線はグラフ内のすべてのフィルタリングされたポイントをトラバースするベースラインアプローチを示しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">メタデータを考慮したインデックス作成<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>もう一つの課題は、メタデータとベクトル埋め込みがどのように関係するかということです。ほとんどのアプリケーションでは、アイテムのメタデータプロパティ（例えば、商品の価格）は、ベクトルが実際に表すもの（意味的な意味や視覚的な特徴）との関連は最小限です。例えば、<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>90</mn><mi>dressanda</mi><mn>90</mn></mrow><annotation encoding="application/x-tex">ドレスと</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord"></span><span class="mord mathnormal">90</span><span class="mord">dressanda90</span></span></span></span>ベルトは同じ価格帯を共有していますが、全く異なる視覚的特徴を示しています。この断絶が、フィルタリングとベクトル検索を組み合わせることを本質的に非効率なものにしている。</p>
<p>この問題を解決するために、私たちは<strong>メタデータを意識したベクトルインデックスを</strong>開発しました。すべてのベクトルに対して1つのグラフを持つのではなく、異なるメタデータ値に対して特化した「サブグラフ」を構築します。例えば、データに "color "と "shape "のフィールドがある場合、これらのフィールドに対して別々のグラフ構造を作成します。</p>
<p>color = blue "のようなフィルタで検索すると、メインのグラフではなく、色に特化したサブグラフが使用される。サブグラフはすでにフィルタリング対象のメタデータを中心に構成されているため、この方がはるかに高速です。</p>
<p>下図では、メイン・グラフ・インデックスを<strong>ベース・グラフと</strong>呼び、特定のメタデータ・フィールドのために構築された特殊なグラフを<strong>カラム・グラフと</strong>呼ぶ。メモリ使用量を効率的に管理するため、各ポイントが持つことのできる接続数（アウトディグリー）を制限している。検索にメタデータ・フィルターが含まれていない場合、デフォルトはベース・グラフになる。フィルターが適用されると、適切なカラムグラフに切り替わり、スピードが大幅に向上する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">反復フィルタリング<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索ではなく、フィルタリング自体がボトルネックになることがある。これは特に、JSON条件や詳細な文字列比較のような複雑なフィルターで起こります。従来のアプローチ（最初にフィルター、次に検索）では、ベクトル検索を開始する前に、システムが何百万ものレコードに対してこれらの高価なフィルターを評価しなければならないため、非常に時間がかかります。</p>
<p>まずベクトル検索を行い、それから上位の結果をフィルタリングすればいいじゃないか」と思うかもしれません。フィルターが厳しく、ほとんどの結果を除外してしまうと、フィルター後の結果が少なすぎる（あるいはゼロ）ことになりかねないからです。</p>
<p>このジレンマを解決するために、MilvusとZilliz Cloudでは<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBaseに</a>ヒントを得て<strong>Iterative Filteringを</strong>開発しました。オール・オア・ナッシングのアプローチではなく、反復フィルタリングはバッチで動作します：</p>
<ol>
<li><p>最も近いベクトルマッチのバッチを取得</p></li>
<li><p>このバッチにフィルターを適用</p></li>
<li><p>フィルタリングされた結果が足りなければ、別のバッチを取得する。</p></li>
<li><p>必要な数の結果が得られるまで繰り返す</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このアプローチでは、十分な品質の結果を得ながら、高価なフィルター操作を実行する回数を劇的に減らすことができます。反復フィルタリングの有効化に関する詳細は、<a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">反復フィルタリングのdocページを</a>参照してください。</p>
<h2 id="External-Filtering" class="common-anchor-header">外部フィルタリング<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>実世界の多くのアプリケーションは、ベクトルデータベース内のベクトルと従来のデータベース内のメタデータというように、異なるシステム間でデータを分割しています。例えば、多くの組織では商品説明やユーザーレビューをMilvusのベクターとしてセマンティック検索のために保存し、在庫状況や価格などの構造化データはPostgreSQLやMongoDBのような従来のデータベースに保存しています。</p>
<p>この分離はアーキテクチャ的には理にかなっていますが、フィルタリング検索には課題が生じます。典型的なワークフローは次のようになる：</p>
<ul>
<li><p>リレーショナル・データベースに、フィルター条件（例えば「50ドル以下の在庫品」）に一致するレコードを問い合わせる。</p></li>
<li><p>一致するIDを取得し、Milvusに送り、ベクトル検索をフィルタリングする。</p></li>
<li><p>これらのIDに一致するベクトルに対してのみセマンティック検索を実行する。</p></li>
</ul>
<p>これは単純に聞こえますが、行数が数百万を超えるとボトルネックになります。大量のIDリストを転送することはネットワーク帯域幅を消費し、Milvusで大量のフィルター式を実行することはオーバーヘッドになります。</p>
<p>この問題に対処するため、Milvusでは検索イテレータAPIを使用し、従来のワークフローを逆転させた軽量なSDKレベルのソリューションである<strong>外部フィルタリングを</strong>導入しました。</p>
<ul>
<li><p>最初にベクトル検索を実行し、最もセマンティックに関連する候補のバッチを取得します。</p></li>
<li><p>クライアント側でカスタムフィルター関数を各バッチに適用します。</p></li>
<li><p>十分なフィルター結果が得られるまで、自動的にさらにバッチを取得します。</p></li>
</ul>
<p>このバッチ化された反復的アプローチは、ベクトル検索から最も有望な候補のみを扱うため、ネットワークトラフィックと処理オーバーヘッドの両方を大幅に削減します。</p>
<p>以下はpymilvusでの外部フィルタリングの使用例です：</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>セグメントレベルのイテレーターで動作する反復フィルタリングとは異なり、外部フィルタリングはグローバルなクエリーレベルで動作します。この設計により、メタデータの評価を最小化し、Milvus内での大規模なフィルタの実行を避けることができます。</p>
<h2 id="AutoIndex" class="common-anchor-header">自動インデックス<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索は常に精度と速度のトレードオフを伴います。より多くのベクトルをチェックすればするほど、結果は良くなりますが、クエリは遅くなります。フィルタを追加すると、このバランスをうまくとるのがさらに難しくなります。</p>
<p>Zilliz Cloudでは、このバランスを自動的に微調整するMLベースのオプティマイザ、<strong>AutoIndexを</strong>開発しました。複雑なパラメータを手動で設定する代わりに、AutoIndexは機械学習を使用して、特定のデータとクエリのパターンに最適な設定を決定します。</p>
<p>ZillizはMilvusの上に構築されているため、この仕組みを理解するためには、Milvusのアーキテクチャについて少し知っておく必要がある：クエリは複数のQueryNodeインスタンスに分散されます。各ノードはデータの一部（セグメント）を処理し、検索を実行し、結果がマージされます。</p>
<p>AutoIndexはこれらのセグメントの統計情報を分析し、インテリジェントな調整を行います。フィルタリング比率が低い場合は、インデックスのクエリ範囲を広げて想起率を高めます。フィルタリング率が高い場合は、クエリー範囲を狭め、可能性の低い候補に対して無駄な労力をかけないようにします。これらの決定は、各特定のフィルタリングシナリオに対して最も効果的な検索戦略を予測する統計モデルによって導かれます。</p>
<p>AutoIndexはインデックス作成パラメータにとどまりません。AutoIndexは、最適なフィルター評価戦略の選択も支援します。フィルター式を解析し、セグメントデータをサンプリングすることで、評価コストを見積もることができます。高い評価コストが検出されると、反復フィルタリングのような、より効率的な手法に自動的に切り替わります。この動的な調整により、各クエリに最適なストラテジーを常に使用できるようになります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">予算1,000ドルでのパフォーマンス<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>理論的な改善も重要ですが、多くの開発者にとって重要なのは実際のパフォーマンスです。私たちは、現実的な予算制約のもとで、これらの最適化が実際のアプリケーションのパフォーマンスにどのように反映されるかをテストしたいと考えました。</p>
<p>多くの企業がベクトル検索インフラに割り当てるであろう妥当な金額である、毎月1,000ドルの現実的な予算で、いくつかのベクトルデータベースソリューションをベンチマークしました。各ソリューションについて、この予算制約内で可能な限り高性能なインスタンス構成を選択しました。</p>
<p>テストに使用したのは</p>
<ul>
<li><p>100万個の768次元ベクトルを含むCohere 1Mデータセット</p></li>
<li><p>フィルタリングされた検索ワークロードとフィルタリングされていない検索ワークロードのミックス</p></li>
<li><p>一貫した比較のためのオープンソースのvdb-benchベンチマークツール</p></li>
</ul>
<p>競合ソリューション（「VDB A」、「VDB B」、「VDB C」と匿名化）はすべて予算内で最適に構成された。その結果、完全に管理されたMilvus（Zilliz Cloud）が、フィルタリングされたクエリとフィルタリングされていないクエリの両方で一貫して最高のスループットを達成した。同じ1000ドルの予算で、我々の最適化技術は競争力のあるリコールで最も高いパフォーマンスを提供します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>フィルタリングを使ったベクトル検索は、表面的には単純に見えるかもしれません。しかし、このブログで示したように、高いパフォーマンスと正確な結果の両方をスケールで達成するには、洗練されたエンジニアリング・ソリューションが必要です。MilvusとZilliz Cloudは、いくつかの革新的なアプローチによってこれらの課題に対処します：</p>
<ul>
<li><p><strong>グラフインデックス最適化</strong>：グラフ・インデックスの最適化：フィルタによって接続ノードが削除されても、類似したアイテム間のパスを維持し、結果の品質を低下させる「島」問題を防ぎます。</p></li>
<li><p><strong>メタデータを考慮したインデックス作成</strong>：一般的なフィルター条件に特化したパスを作成し、精度を犠牲にすることなくフィルター検索を大幅に高速化します。</p></li>
<li><p><strong>反復フィルタリング</strong>：結果をバッチ処理し、データセット全体ではなく、最も有望な候補のみに複雑なフィルターを適用します。</p></li>
<li><p><strong>オートインデックス</strong>：機械学習を利用して、データとクエリに基づいて検索パラメータを自動的に調整し、手動で設定することなく速度と精度のバランスを保ちます。</p></li>
<li><p><strong>外部フィルタリング</strong>：ベクトル検索と外部データベースを効率的に橋渡しし、結果の品質を維持しながらネットワークのボトルネックを解消します。</p></li>
</ul>
<p>MilvusとZilliz Cloudは、フィルタリング検索のパフォーマンスをさらに向上させる新機能で進化し続けています。<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Keyの</a>ような機能は、フィルタリングパターンに基づくより効率的なデータ編成を可能にし、高度なサブグラフルーティング技術は、パフォーマンスの限界をさらに押し広げます。</p>
<p>非構造化データの量と複雑さは指数関数的に増加し続け、あらゆる検索システムに新たな課題をもたらしています。私たちのチームは、より高速でスケーラブルなAI検索を実現するために、ベクトル・データベースで可能なことの限界を常に押し広げています。</p>
<p>フィルタリングされたベクトル検索でパフォーマンスがボトルネックになっているアプリケーションは、<a href="https://milvus.io/community">milvus.io/communityの</a>アクティブな開発者コミュニティにご参加ください。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
