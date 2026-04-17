---
id: milvus-boost-ranker-business-aware-vector-search.md
title: Milvus Boost Rankerを使ったビジネス・アウェア・ベクトル検索方法
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Milvus Boost Rankerを使用すると、ベクトル類似度の上にビジネスルールを重ねることができます -
  公式ドキュメントを後押しし、古くなったコンテンツを降格させ、多様性を追加します。
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>ベクトル検索は、埋め込み類似度によって結果をランク付けする - ベクトルが近ければ近いほど、結果は高くなる。モデルベースのリランカー（BGE、Voyage、Cohere）を追加して、順序付けを改善するシステムもある。しかし、どちらのアプローチも、<strong>ビジネス・コンテキストは意味的な関連性と同じくらい、場合によってはそれ以上に重要で</strong>あるという、生産における基本的な要件を扱っていない。</p>
<p>eコマースサイトは、公式ストアから在庫のある商品を最初に表示する必要がある。コンテンツプラットフォームは、最近の発表をピン留めしたい。企業のナレッジベースでは、権威あるドキュメントを上位に表示する必要がある。ランキングがベクトル距離だけに頼っている場合、これらのルールは無視される。結果は適切かもしれないが、適切ではない。</p>
<p><a href="https://milvus.io/intro">Milvus</a>2.6で導入された<strong><a href="https://milvus.io/docs/reranking.md">Boost Rankerは</a></strong>これを解決します。インデックスの再構築もモデルの変更も必要ありません。この記事では、Boost Rankerの仕組み、使用するタイミング、コードによる実装方法について説明します。</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Boost Rankerとは？<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Rankerは、Milvus 2.6.2に搭載された軽量なルールベースのリランカー機能で</strong>、スカラーメタデータフィールドを使用して<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索</a>結果を調整します。外部のLLMやエンベッディングサービスを呼び出すモデルベースのリランカーとは異なり、Boost RankerはMilvusの中でシンプルなフィルタリングとウェイトのルールを使って動作します。外部依存がなく、レイテンシーオーバーヘッドも最小です。</p>
<p>設定には<a href="https://milvus.io/docs/manage-functions.md">Function APIを</a>使用します。ベクトル検索が候補のセットを返した後、Boost Rankerは3つのオペレーションを適用します：</p>
<ol>
<li><strong>フィルター：</strong>特定の条件（例えば、<code translate="no">is_official == true</code> ）に一致する結果を特定する。</li>
<li><strong>Boost:</strong>スコアに設定された重みを掛ける。</li>
<li><strong>シャッフル：</strong>オプションで小さなランダム係数（0～1）を追加して多様性を導入する。</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">その仕組み</h3><p>Boost RankerはMilvusの内部で後処理として実行されます：</p>
<ol>
<li><strong>ベクトル検索</strong>- 各セグメントからID、類似度スコア、メタデータとともに候補が返される。</li>
<li><strong>ルールの適用</strong>- システムは一致するレコードをフィルタリングし、設定された重みとオプション<code translate="no">random_score</code> を使用してスコアを調整します。</li>
<li><strong>マージとソート</strong>- すべての候補が結合され、更新されたスコアによって再ソートされ、最終的な Top-K の結果が生成される。</li>
</ol>
<p>Boost Rankerは、全データセットではなく、すでに検索された候補に対してのみ動作するため、追加的な計算コストはごくわずかです。</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Boost Rankerはいつ使うべきか？<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">重要な結果のブースト</h3><p>最も一般的な使用例：セマンティック検索にシンプルなビジネスルールを重ねる。</p>
<ul>
<li><strong>Eコマース：</strong>旗艦店、公式セラー、有料プロモーションの商品をブーストする。最近の売上やクリック率が高い商品を上位に表示する。</li>
<li><strong>コンテンツプラットフォーム：</strong> <code translate="no">publish_time</code> フィールドを使って最近公開されたコンテンツを優先的に表示したり、認証済みアカウントの投稿を上位に表示する。</li>
<li><strong>エンタープライズ検索：</strong> <code translate="no">doctype == &quot;policy&quot;</code> または<code translate="no">is_canonical == true</code> のドキュメントをより優先的に表示。</li>
</ul>
<p>すべてフィルター＋重みで設定可能。埋め込みモデルの変更も、インデックスの再構築も不要。</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">削除せずに順位を下げる</h3><p>Boost Rankerは、特定の検索結果のランキングを下げることもできます。</p>
<ul>
<li><strong>在庫の少ない商品：</strong> <code translate="no">stock &lt; 10</code> の場合、そのウェイトを少し下げます。まだ見つけられるが、上位を独占することはない。</li>
<li><strong>センシティブコンテンツ：</strong>完全に削除するのではなく、フラグを立てたコンテンツのウェイトを下げる。厳しい検閲をせずに、露出を制限する。</li>
<li><strong>古くなったドキュメント：</strong> <code translate="no">year &lt; 2020</code> のドキュメントは、新しいコンテンツが最初に表示されるように、順位を下げます。</li>
</ul>
<p>ユーザーは、スクロールしたり、より正確に検索したりすることで、降格された結果を見つけることができるが、より関連性の高いコンテンツに押しつぶされることはない。</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">制御されたランダム性で多様性を加える</h3><p>多くの結果が似たようなスコアを持っている場合、Top-Kはクエリ間で同じように見えることがあります。Boost Rankerの<code translate="no">random_score</code> パラメーターは、わずかな変化をもたらします：</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: 再現性のために全体的なランダム性をコントロールする</li>
<li><code translate="no">field</code>: 通常は主キー<code translate="no">id</code> 、同じレコードが毎回同じランダム値を取得するようにする。</li>
</ul>
<p>これは、<strong>レコメンデーションの多様化</strong>（同じ項目が常に最初に表示されるのを防ぐ）や<strong>探索</strong>（固定のビジネス重みと小さなランダムな摂動を組み合わせる）に便利です。</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Boost Rankerと他のランカーを組み合わせる</h3><p>Boost RankerはFunction APIで<code translate="no">params.reranker = &quot;boost&quot;</code> 。組み合わせについて知っておくべきことが2つある：</p>
<ul>
<li><strong>制限：</strong>ハイブリッド（マルチベクトル）検索では、Boost Rankerをトップレベルのランカーにすることはできない。しかし、個々の<code translate="no">AnnSearchRequest</code> の内部で使用し、マージする前に結果を調整することは可能です。</li>
<li><strong>よくある組み合わせ</strong><ul>
<li><strong>RRF + Boost:</strong>RRFを使ってマルチモーダルな結果をマージし、Boostを適用してメタデータベースの微調整を行う。</li>
<li><strong>モデルランカー＋Boost：</strong>セマンティック品質にはモデルベースのランカーを使用し、ビジネスルールにはBoostを使用する。</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Boost ランカーの設定方法<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost RankerはFunction APIで設定します。より複雑なロジックの場合は、<code translate="no">FunctionScore</code> と組み合わせて複数のルールをまとめて適用します。</p>
<h3 id="Required-Fields" class="common-anchor-header">必須フィールド</h3><p><code translate="no">Function</code> ：</p>
<ul>
<li><code translate="no">name</code>任意のカスタム名</li>
<li><code translate="no">input_field_names</code>空リストでなければなりません。<code translate="no">[]</code></li>
<li><code translate="no">function_type</code>に設定する。<code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>でなければならない。<code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">キーパラメーター</h3><p><strong><code translate="no">params.weight</code> (必須)</strong></p>
<p>マッチしたレコードのスコアに適用される乗数。設定方法はメトリックによって異なります：</p>
<table>
<thead>
<tr><th>メトリックの種類</th><th>結果を高める</th><th>結果を下げる</th></tr>
</thead>
<tbody>
<tr><td>高い方が良い (COSINE、IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>低い方が良い（L2/ユークリッド）</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (オプション)</strong></p>
<p>どのレコードのスコアが調整されるかを選択する条件：</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>一致するレコードのみが影響を受ける。それ以外は元のスコアのまま。</p>
<p><strong><code translate="no">params.random_score</code> (オプション)</strong></p>
<p>多様性のために0と1の間のランダムな値を追加します。詳細は上記のランダム性のセクションを参照。</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">単一ルールと複数ルール</h3><p><strong>単一ルール</strong>- ビジネス上の制約が1つの場合（例えば、公式ドキュメントをブーストする）、ランカーを直接<code translate="no">search(..., ranker=ranker)</code> に渡します。</p>
<p><strong>複数のルール</strong>- 複数の制約（在庫のある商品を優先する + 低評価の商品を降格させる + ランダム性を追加する）が必要な場合、複数の<code translate="no">Function</code> オブジェクトを作成し、それらを<code translate="no">FunctionScore</code> と組み合わせます：</p>
<ul>
<li><code translate="no">boost_mode</code>各ルールが元のスコア（<code translate="no">multiply</code> または<code translate="no">add</code> ）とどのように組み合わされるか。</li>
<li><code translate="no">function_mode</code>複数のルールが互いにどのように組み合わされるか (<code translate="no">multiply</code> または<code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">ハンズオン：公式文書の優先順位付け<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>具体的な例として、文書検索システムで公式文書を上位に表示する方法を説明しましょう。</p>
<h3 id="Schema" class="common-anchor-header">スキーマ</h3><p>これらのフィールドを持つ<code translate="no">milvus_collection</code> というコレクション：</p>
<table>
<thead>
<tr><th>フィールド</th><th>タイプ</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>主キー</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>ドキュメントテキスト</td></tr>
<tr><td><code translate="no">embedding</code></td><td>浮動ベクトル (3072)</td><td>意味ベクトル</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>起源：&quot;公式&quot;、&quot;コミュニティ&quot;、&quot;チケット&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>論理値</td><td><code translate="no">True</code> もし<code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p><code translate="no">source</code> と<code translate="no">is_official</code> フィールドは、Boost Rankerがランキングを調整するために使用するメタデータです。</p>
<h3 id="Setup-Code" class="common-anchor-header">設定コード</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">結果の比較Boost Rankerの有無</h3><p>まず、Boost Rankerなしでベースライン検索を実行します。そして、Boost Rankerを<code translate="no">filter: is_official == true</code> と<code translate="no">weight: 1.2</code> 、追加して比較します。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">結果</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>主な変更点: ドキュメント<code translate="no">id=2</code> (公式) のスコアが1.2倍されたため、4位から2位に急上昇しました。コミュニティへの投稿やチケットの記録が削除されたわけではありません。これがBoost Rankerのポイントである。セマンティック検索を基礎とし、その上にビジネスルールを重ねる。</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Rankerは</a>、エンベッディングに触れることなく、またインデックスを再構築することなく、ベクトル検索結果にビジネスロジックを注入する方法を提供します。公式コンテンツをブーストし、古くなった結果を降格させ、制御された多様性を追加する -<a href="https://milvus.io/docs/manage-functions.md">Milvus Function APIで</a>フィルタとウェイトを設定するだけです。</p>
<p>RAGパイプライン、レコメンデーションシステム、エンタープライズ検索など、Boost Rankerは、意味的に類似したものと、ユーザーにとって実際に有用なものとのギャップを埋めるのに役立ちます。</p>
<p>検索ランキングに取り組んでいる方、ユースケースについて議論したい方：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、検索システムを開発している他の開発者とつながりましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（20分）の無料セッションを予約して</a>、あなたのランキングロジックについてチームと話し合いましょう。</li>
<li>インフラのセットアップを省きたい場合は、Milvusのマネージドサービスである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudの</a>無料ティアをご利用ください。</li>
</ul>
<hr>
<p>チームがBoost Rankerを使い始めると出てくる質問がいくつかあります：</p>
<p><strong>Boost Rankerは、CohereやBGEのようなモデルベースのリランカーを置き換えることができるのか？</strong>これらは異なる問題を解決します。モデルベースのリランカーは、セマンティック・クオリティによって結果を再スコアします。Boost Rankerは、ビジネスルールによってスコアを調整します - "どの関連文書が最初に表示されるべきか "を決定します。セマンティックな関連性のためにモデルランカーを使い、その上にビジネスロジックのためにBoost Rankerを使うのです。</p>
<p><strong>Boost Rankerはレイテンシーを大幅に増加させますか？</strong>いいえ、完全なデータセットではなく、すでに検索された候補セット（通常、ベクトル検索によるTop-K）を操作します。演算は単純なフィルタリングと乗算なので、オーバーヘッドはベクトル検索そのものに比べればごくわずかです。</p>
<p><strong>重みの値はどのように設定すればよいのでしょうか？</strong>小さな調整から始めてください。COSINEの類似度（高ければ高いほど良い）では、通常1.1～1.3の重みで十分です。実際のデータでテストしてみてください。低い類似度でブーストされた結果が優勢になり始めたら、ウェイトを下げてください。</p>
<p><strong>複数のBoost Rankerルールを組み合わせることはできますか？</strong>はい。複数の<code translate="no">Function</code> オブジェクトを作成し、<code translate="no">FunctionScore</code> を使って組み合わせてください。<code translate="no">boost_mode</code> （各ルールが元のスコアとどのように結合するか）と<code translate="no">function_mode</code> （ルール同士がどのように結合するか）を使って、ルールがどのように相互作用するかをコントロールします。<code translate="no">multiply</code> と<code translate="no">add</code> をサポートしています。</p>
