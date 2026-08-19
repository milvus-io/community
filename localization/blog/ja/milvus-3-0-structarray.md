---
id: milvus-3-0-structarray.md
title: '1つのエンティティ、複数のベクトル: Milvus 3.0 StructArrayによるエンティティレベルおよび要素レベルの検索'
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  1つのエンティティには、整列された複数のベクトルとメタデータフィールドを含めることができ、Milvusはデータを個別の行にフラット化することなく、エンティティ全体または個々の要素を検索できます。
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>ほとんどのベクターデータベースのスキーマは、単純な前提から始まります。つまり、1つのエンティティに1つの埋め込みという前提です。製品には1つのベクトルが対応し、ドキュメントにも同様に1つのベクトルが対応します。ユーザークエリは埋め込みベクトルに変換され、近似最近傍（ANN）検索によってこれらのベクトルと比較されます。このモデルは、RAG、セマンティック検索、レコメンデーションシステムなど、第一世代のベクター検索ユースケースで機能します。</p>
<p><strong>しかし、実際のAIデータがこの前提に適合することはほとんどありません。</strong>動画にはクリップ、ショット、キーフレームが含まれ、それぞれに独自の埋め込み、時間範囲、キャプション、シーンラベル、信頼度スコアがあります。製品には複数の画像や視野角が含まれる場合があります。長いドキュメントには、ドキュメント全体の単一の埋め込みよりも局所的な意味が重要なパッセージやセクションが含まれます。一般的な後期相互作用モデルは、さらに細かい粒度で同じ制限を露呈します。ColBERTはトークンごとに1つのベクトルを生成し、ColPaliは視覚パッチごとに1つのベクトルを生成します。</p>
<p>どの場合も、親エンティティはアプリケーションが保存、表示、保護、返却する単位であり続けます。しかし、関連性、フィルタリング、結果の説明は、多くの場合、そのエンティティ内の要素に依存します。</p>
<p><strong>新しいStructArray機能は、この形状に対するネイティブなデータモデルをMilvusに提供します。1つのエンティティに、スキーマ定義されたStruct要素の順序付き配列が含まれ、各要素はスカラーメタデータ、ベクター埋め込み、またはその両方を保持できます。</strong>Milvusは、同じ要素に属するフィールドをフィルタリングしたり、エンティティレベルで2つの埋め込みリストを比較したり、個々の要素を検索して一致するオフセットを返したりできます。</p>
<p>この記事では、動画検索の例を使用してデータモデルを説明し、スキーマ設計、フィルタリング、ベクター検索の粒度、EmbeddingListインデックス戦略、ハイブリッド結果のコラプス、この機能を実行可能にする物理レイアウトまでを順に追っていきます。</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">1つのベクトルと1つのフラット行モデルではもはや不十分な理由<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザーが動画カタログで「キッチンで野菜を切っている人物」を検索する場合を考えてみましょう。関連するシグナルは、動画全体の埋め込みではなく、8秒のクリップ1つに存在する可能性があります。<strong>すべてのクリップ、オブジェクト、アクションを単一のベクトルに圧縮すると、大まかなトピックは保持されるかもしれませんが、局所的な詳細が失われる可能性があります。</strong></p>
<p>同じ不一致は他のワークロードでも発生します：</p>
<ul>
<li>製品の関連性は、複数の画像や角度のうちの1つに由来する場合があります。</li>
<li>ドキュメントは、全体的な主題ではなく、1つのパッセージによって一致する場合があります。</li>
<li>エージェントのメモリには複数の観察結果が含まれる場合があり、そのうち現在のタスクに関係するのは1つだけの場合があります。</li>
<li>ColBERTまたはColPaliのレコードには、単一の高密度ベクトルではなく、可変長のトークンまたはパッチベクトルのリストが含まれます。</li>
</ul>
<p>1つの代替案は、すべてのクリップ、画像、パッセージを個別のデータベース行に分割することです。これにより局所検索が可能になりますが、各フラグメントが親エンティティから分離されます。親メタデータは行間で繰り返される可能性があり、エンティティレベルの検索には、フラグメント検索後のグループ化、重複排除、再ランキングが必要になります。</p>
<p>ネストされたストレージだけではクエリの問題は解決しません。JSONはオブジェクトを保存できますが、ベクターおよびスカラーインデックスのための事前定義されたサブフィールドスキーマをMilvusに提供しません。並列配列はキャプション、シーンラベル、信頼度値を保存できますが、アプリケーションがオフセットの整合性を維持する必要があります。データベースは、<code translate="no">scene_type[3]</code>と<code translate="no">label_confidence[3]</code>が同じクリップを記述していることを、その関係がデータモデルの一部でない限り安全に推論できません。</p>
<p>StructArrayはこの関係を直接エンコードします。親エンティティ内にローカル要素を保持しながら、整列されたサブフィールドをスキーマ検証、インデックス作成、フィルタリング、ベクター検索に公開します。</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">StructArrayとそのデータモデルとは？<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArrayは、構造体の配列とも呼ばれ、各エンティティにStruct要素の順序付きセットを格納します。StructArrayフィールドは、すべての要素が1つの事前定義されたStructスキーマに従う<code translate="no">Array</code>です。動画コレクションの場合、論理的な形状は次のようになります：</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>ここで：</p>
<ul>
<li><code translate="no">clips</code>は親のStructArrayフィールドです。</li>
<li><code translate="no">clip_embedding_list</code>、<code translate="no">clip_embedding</code>、<code translate="no">start_sec</code>、およびその他の属性はサブフィールドです。</li>
<li><code translate="no">clips[0]</code>は最初のクリップです。</li>
<li>オフセット<code translate="no">0</code>のすべてのサブフィールドは、その同じクリップに属します。</li>
<li>オフセット<code translate="no">3</code>のすべてのサブフィールドは、別のクリップに属します。</li>
</ul>
<p>2つのベクターサブフィールドは異なる検索モードを提供します。<code translate="no">clips[clip_embedding_list]</code>はエンティティレベルのEmbeddingList検索用に<code translate="no">MAX_SIM*</code>メトリックでインデックス作成され、<code translate="no">clips[clip_embedding]</code>は要素レベルの検索用に通常のベクターメトリックでインデックス作成されます。ベクターフィールドまたはベクターサブフィールドは1つのインデックスのみを受け入れるため、両方のモードが必要なコレクションは、2つのサブフィールドを個別に定義してインデックス作成する必要があります。</p>
<p>このモデルは3つの異なるクエリセマンティクスをサポートします。</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. EmbeddingList検索は親エンティティを返す<button data-href="#1-EmbeddingList-search-returns-parent-entities" class="anchor-icon" translate="no">
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
    </button></h3><p><code translate="no">clips[clip_embedding_list]</code>内のベクトルは、動画の1つの埋め込みリストを形成します。クエリも<code translate="no">EmbeddingList</code>です。Milvusは<code translate="no">MAX_SIM*</code>メトリックを使用してクエリリストを各保存済みリストと比較し、エンティティレベルの結果を返します。</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. <code translate="no">MATCH_*</code>ファミリーは親エンティティをフィルタリングする<button data-href="#2-The-MATCH-family-filters-parent-entities" class="anchor-icon" translate="no">
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
    </button></h3><p><code translate="no">MATCH_ANY</code>、<code translate="no">MATCH_ALL</code>、<code translate="no">MATCH_LEAST</code>、<code translate="no">MATCH_MOST</code>、<code translate="no">MATCH_EXACT</code>は、Struct要素に対して述語を評価し、それを満たす要素の数をカウントし、親エンティティがフィルターを通過するかどうかを決定します。</p>
<p>たとえば：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>両方のスカラー条件が同じクリップオフセットで真である必要があります。Milvusは、あるクリップのキッチンラベルと別のクリップの高信頼度値を組み合わせることはありません。</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. 要素レベルの検索は一致する要素オフセットを返す<button data-href="#3-Element-level-search-returns-the-matching-element-offset" class="anchor-icon" translate="no">
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
    </button></h3><p>通常のクエリベクトルは、<code translate="no">clips[clip_embedding]</code>内のすべてのベクトルを独立して検索できます。各ヒットは、親エンティティと一致するStruct要素のゼロベースのオフセットを識別します。<code translate="no">element_filter</code>を使用すると、そのベクター検索に参加する要素を制限できます。</p>
<p>これらの操作には共通の前提があります。Milvusは、どのベクター値とスカラー値が同じ要素に属し、どの要素が同じエンティティに属するかを把握しているということです。</p>
<p>StructArrayは汎用の任意ネストシステムではありません。現在のモデルは、サポートされているスカラーおよびベクターサブフィールドを持つStruct要素の1つの<code translate="no">Array</code>です。この境界により、サブフィールドのインデックス作成と要素を認識した実行が実現可能になります。</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">スキーマ、インデックス、挿入パスの構築<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>次の簡略化されたPyMilvusの例では、1つのトップレベルベクトルとクリップ用のStructArrayを持つ動画コレクションを作成します。同じコレクションで両方の検索モードを実演できるように、個別のクリップベクターサブフィールドを使用しています。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>ベクターサブフィールドは検索前にインデックス作成する必要があります。メトリックファミリーが検索モードを決定するため、各ベクターサブフィールドには独自のインデックスが設定されます：</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>スカラーインデックスはオプションですが、大規模なフィルターで頻繁に使用されるサブフィールドには、互換性のあるスカラーインデックスを使用する必要があります。たとえば、<code translate="no">clips[scene_type]</code>は転置インデックスを使用でき、<code translate="no">clips[label_confidence]</code>などの数値サブフィールドは数値フィルタリングに適したインデックスを使用できます。</p>
<p>データは自然なエンティティ形状で挿入します。クリップオブジェクトの配列を持つ1つの動画行です。例をコンパクトに保つため、同じクリップベクトルを両方のベクターサブフィールドに書き込みます。</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>API境界では、<code translate="no">clips</code>は構造化オブジェクトの配列のままです。Milvus内部では、各サブフィールドは独自のインデックス、フィルター、出力動作に必要な型付きパスに従います。この区別は挿入時には透過的ですが、その後のすべての処理の基本となります。</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">同一要素フィルタリングが構造と並列配列の違いを生む<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>フィルタリングの主な利点は、ネストされたフィールドの構文が短くなることではありません。スカラーサブフィールド間の正しい相関関係を維持できることです。</p>
<p>アプリケーションが、ラベル信頼度が<code translate="no">0.8</code>を超えるキッチンのクリップを含む動画を必要としているとします。動画に何らかのキッチンのクリップと何らかの高信頼度のクリップが含まれているだけでは不十分で、同じクリップが両方の条件を満たす必要があります。</p>
<p>StructArrayの<code translate="no">MATCH_*</code>ファミリーはこれを直接表現します：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvusは各要素オフセットで述語を評価し、演算子の数量詞を適用して親エンティティが通過するかどうかを決定します：</p>
<ul>
<li><code translate="no">MATCH_ANY</code>：少なくとも1つの要素が一致します。</li>
<li><code translate="no">MATCH_ALL</code>：すべての要素が一致します。</li>
<li><code translate="no">MATCH_LEAST</code>：少なくとも<code translate="no">threshold</code>個の要素が一致します。</li>
<li><code translate="no">MATCH_MOST</code>：最大で<code translate="no">threshold</code>個の要素が一致します。</li>
<li><code translate="no">MATCH_EXACT</code>：ちょうど<code translate="no">threshold</code>個の要素が一致します。</li>
</ul>
<p>同じデータが2つの独立した配列として保存されている場合、次の式はその相関関係を維持しません：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>2つの値は異なるオフセットで発生する可能性があります。これは無関係な属性では有効かもしれませんが、両方の条件が同じクリップ、製品画像、またはドキュメントのパッセージを記述している場合は正しくありません。</p>
<p>StructArrayは、要素の同一性をアプリケーションが強制する必要のある規約ではなく、データベース述語の一部にします。</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">2つのベクター検索の粒度、2つの結果の同一性<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>エンティティが複数のベクトルを格納すると、ANN検索が始まる前に、検索はモデリング上の問いに答える必要があります：</p>
<p><strong>ベクトルは親エンティティの1つの表現として一緒にスコアリングされるべきでしょうか、それとも各要素ベクトルが独立して競合するべきでしょうか？</strong></p>
<p>StructArrayは両方のモデルをサポートしますが、これらは異なるクエリ形状、メトリックファミリー、ベクターサブフィールド、結果の同一性を使用します。</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">EmbeddingList検索：クエリベクトルのリストがエンティティを見つける<button data-href="#EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="anchor-icon" translate="no">
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
    </button></h3><p><code translate="no">EmbeddingList</code>クエリには複数のベクトルが含まれます。クエリ動画は複数のクリップに分割される場合があります。製品クエリには複数の参照画像が含まれる場合があります。ColBERTクエリにはクエリトークンごとに1つのベクトルが含まれます。</p>
<p>各エンティティについて、Milvusはクエリリストをエンティティの保存済み埋め込みリストと比較します。MaxSimスタイルのスコアリングでは、各クエリベクトルがエンティティリスト内の最良の一致を選択し、Milvusはこれらの最良一致スコアを集約してエンティティスコアを算出します。最終的なヒットは、特定のStruct要素ではなく、親エンティティを表します。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>この検索は次の問いに答えます：<strong>このクエリクリップのセットに対して、どの動画が全体的に最良の一致でしょうか？</strong></p>
<p>これは、動画間検索、複数画像の製品検索、ColBERTおよびColPaliスタイルの検索、クエリと保存済みエンティティの両方が複数のベクトルで表現されるその他のケースに適しています。</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">要素レベルの検索：1つのクエリベクトルがエンティティ内のクリップを見つける<button data-href="#Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="anchor-icon" translate="no">
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
    </button></h3><p>要素レベルの検索では、通常のクエリベクトルを使用します。<code translate="no">clips[clip_embedding]</code>内のすべてのベクトルが、独立した候補としてANN検索に参加します。各ヒットは、親エンティティと一致する要素のオフセットを識別します。</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>選択したクリップのみを検索するには、スカラー条件が同じクリップに適用される<code translate="no">element_filter</code>をアタッチします：</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>このフィルターは、最初にキッチンのクリップを選択してから、別の高信頼度クリップを検索するものではありません。両方の述語とベクター候補は同じStruct要素を参照します。</p>
<p>グループ化されていないレスポンスは次のようになります：</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>複数のクリップが一致する可能性があるため、同じエンティティが複数回出現することがあります。これは、アプリケーションがどの動画またはドキュメントが関連するかだけでなく、どのクリップまたはパッセージが一致を生み出したかを表示する必要がある場合に役立ちます。</p>
<table>
<thead>
<tr><th>側面</th><th>EmbeddingList検索</th><th>要素レベルの検索</th></tr>
</thead>
<tbody>
<tr><td>クエリ入力</td><td><code translate="no">EmbeddingList</code>内の1つ以上のクエリベクトル</td><td>1つの通常のクエリベクトル</td></tr>
<tr><td>対象の例</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>メトリックファミリー</td><td><code translate="no">MAX_SIM*</code></td><td><code translate="no">COSINE</code>、<code translate="no">IP</code>、<code translate="no">L2</code>などの通常のメトリック</td></tr>
<tr><td>ANN候補単位</td><td>親エンティティの埋め込みリスト</td><td>各Struct要素ベクトル</td></tr>
<tr><td>結果の同一性</td><td>親エンティティ</td><td>親エンティティと要素オフセット</td></tr>
<tr><td>典型的なユースケース</td><td>マルチベクタークエリをマルチベクターエンティティと一致させる</td><td>最も関連性の高いクリップ、画像、パッセージ、パッチ、またはファクトを見つける</td></tr>
</tbody>
</table>
<p>1つのコレクションで両方のモードをサポートするには、個別のベクターサブフィールドを定義してインデックス作成します。クエリ形状、メトリックファミリー、対象インデックスが一致している必要があります。</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">EmbeddingListインデックスは品質とコストの選択<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>エンティティごとに1つの埋め込みがある場合、ANNインデックスはクエリベクトルに近いエンティティを見つけます。EmbeddingList検索は、関連性が2つのベクトルリスト間のペアごとの相互作用に依存するため、よりコストがかかります。</p>
<p>すべてのエンティティ内のすべてのベクトルに対して正確なMaxSimを計算すると、最もクリーンな参照ランキングが得られますが、フルスキャンは通常、オンライン検索にはコストがかかりすぎます。そのためMilvusは2段階モデルを使用します：</p>
<ol>
<li>近似戦略が候補の親エンティティを取得します。</li>
<li><code translate="no">emb_list_rerank</code>が有効な場合、Milvusはこれらの候補に対してMaxSimを再計算して最終的なランキングを生成します。</li>
</ol>
<p>より多くの第1段階の候補を取得すると、真の上位結果が再ランカーに到達する可能性が一般的に高まりますが、レイテンシと計算量も増加します。3つの戦略は、主にこの候補セットの生成方法が異なります。</p>
<table>
<thead>
<tr><th>戦略</th><th>第1段階の候補表現</th><th>適しているケース</th><th>主なトレードオフ</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>各埋め込みリスト内のすべてのベクトルをインデックス作成します。クエリベクトルは独立してANNを実行し、一致はMaxSim再ランキングの前に親エンティティに集約されます。</td><td>品質が最優先で、リストが短いまたは中程度で、個々のベクトルが識別力を持つ場合。</td><td>インデックスサイズと第1段階の検索作業は、リストの長さとクエリベクトルの数に応じて増加します。</td></tr>
<tr><td>MUVERA</td><td>ランダム射影を使用して各埋め込みリストを1つの固定次元ベクトルにエンコードし、通常のANNを実行します。</td><td>TokenANNが重すぎる場合、またはトレーニングパイプラインなしでの圧縮が望ましい場合。</td><td>エンコードは情報を失います。より強い射影設定は、エンコードされた次元とANNコストを増加させます。</td></tr>
<tr><td>LEMUR</td><td>埋め込みリストを固定次元の親エンティティベクトルにマッピングするモデルをトレーニングします。</td><td>埋め込みの識別力が低い、リストが大きい、またはワークロードがビジュアルまたはマルチモーダルである場合。</td><td>トレーニングが必要で、コーパスの分布やドキュメントの長さの偏りに敏感な場合があります。</td></tr>
</tbody>
</table>
<p>すべてのワークロードに最適な単一の戦略はありません。対象データとクエリ分布から始めましょう：</p>
<ul>
<li>データセットサイズが許せば、品質優先のベースラインとしてTokenANNを使用します。</li>
<li>リストの長さが増加するにつれてTokenANNのインデックスまたは候補検索がコスト高になる場合、またはトレーニングパイプラインを避けたい場合は、MUVERAを試します。</li>
<li>埋め込み空間がノイズが多い、または識別力が弱い場合、またはワークロードがビジュアルまたはマルチモーダルである場合は、LEMURを評価します。</li>
<li>レイテンシとインデックスサイズとともに、再現率またはnDCGを測定します。短いテキストで機能する戦略でも、ロングテールのドキュメント長や数千のビジュアルパッチでは異なる動作をする可能性があります。</li>
</ul>
<p>StructArrayは1つの問題に対処します。単一のエンティティ内で整列された、フィルタリング可能な、ベクターを持つ要素を表現する方法です。EmbeddingList戦略は別の問題に対処します。特定のモデルとコーパスに対して許容可能なコストでMaxSimを近似する方法です。</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">ハイブリッド検索が結果の同一性を明確にする<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>本番環境の検索が単一のベクターパスに従うことはほとんどありません。動画リクエストは、トップレベルの動画埋め込み、1つ以上のクリップレベルの埋め込み、キャプションや文字起こしのシグナル、再ランカーを組み合わせる場合があります。</p>
<p>要素レベルの候補がこのパイプラインに入ると、エンジンは最終候補を何で識別するかを決定する必要があります。</p>
<table>
<thead>
<tr><th>ハイブリッドリクエストの構成</th><th>最終候補のスコープ</th><th>結果の同一性</th></tr>
</thead>
<tbody>
<tr><td>すべてのサブ検索が要素レベルで、同じStructArrayの下のベクターサブフィールドを対象とする</td><td>要素レベル</td><td>主キーとStructArrayフィールドと要素オフセット</td></tr>
<tr><td>トップレベルのベクターフィールドが含まれる</td><td>エンティティレベル</td><td>主キー</td></tr>
<tr><td>EmbeddingListリクエストが含まれる</td><td>エンティティレベル</td><td>主キー</td></tr>
<tr><td>要素レベルのリクエストが異なるStructArrayフィールドを対象とする</td><td>エンティティレベル</td><td>主キー</td></tr>
</tbody>
</table>
<p>最初の構成は要素の同一性を維持します。オフセット<code translate="no">3</code>が、特定の親StructArrayの下のすべてのサブ検索で同じStruct要素を参照するためです。これは、複数の要素レベルのシグナルを融合した後に最も関連性の高いクリップまたはパッセージを返したいアプリケーションに適しています。</p>
<p>他の構成では、候補の粒度または要素の名前空間が混在します。そのため、要素ヒットは最終的な再ランキングの前にエンティティレベルのスコアにコラプスする必要があります。Milvusはいくつかのコラプス戦略をサポートします：</p>
<table>
<thead>
<tr><th>コラプス戦略</th><th>返された要素ヒットからのエンティティスコア</th><th>重要な条件</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>最良の要素スコア</td><td>サポートされている通常のベクターメトリックで動作</td></tr>
<tr><td><code translate="no">sum</code></td><td>返されたすべての要素スコアの合計</td><td><code translate="no">IP</code>や<code translate="no">COSINE</code>などの正の相関メトリックで使用</td></tr>
<tr><td><code translate="no">avg</code></td><td>返された要素スコアの平均</td><td>サポートされている通常のベクターメトリックで動作</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>返された要素スコアの最良<code translate="no">K</code>個の合計</td><td>正の<code translate="no">topk</code>が必要。<code translate="no">IP</code>または<code translate="no">COSINE</code>で使用</td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>返された要素スコアの最良<code translate="no">K</code>個の平均</td><td>正の<code translate="no">topk</code>が必要</td></tr>
</tbody>
</table>
<p>コラプスは、そのANNサブ検索によって返された要素ヒットに対してのみ動作し、検索後にエンティティ内のすべての要素をスキャンするわけではありません。したがって、リクエストの<code translate="no">limit</code>が、コラプス関数で使用できる要素ヒットを制御します。</p>
<p>この選択は、単なる出力フォーマットではなく、検索セマンティクスを形成します。アプリケーションがクリップやパッセージを表示する場合、融合を通じてオフセットを維持することが自然です。動画、製品、またはドキュメントを表示する場合は、エンティティレベルのコラプスが自然です。シグナルが異なる粒度で動作する場合、システムには明示的な要素からエンティティへのスコアリングルールが必要です。</p>
<p>StructArrayは、この同一性とコラプスの問題を、アドホックな後処理から検索実行モデルに移します。</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">MilvusがStructArrayをブロブとして扱わずに実行する仕組み<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザー向けのモデルは<code translate="no">ARRAY&lt;STRUCT&gt;</code>です。しかし、値全体を単一の不透明なブロブとして保存すると、サブフィールドのインデックス、フィルター、選択的な出力が非効率になります。</p>
<p>Milvusは、論理的な親、物理的な子カラムの設計を使用します。</p>
<p>スキーマ層では、<code translate="no">clips</code>が論理的な親フィールドです。Structスキーマ、最大容量、NULL許容性などのプロパティを定義します。そのサブフィールドは、<code translate="no">clips[clip_embedding_list]</code>、<code translate="no">clips[clip_embedding]</code>、<code translate="no">clips[scene_type]</code>、<code translate="no">clips[label_confidence]</code>などのパスに正規化されます。</p>
<p>スカラーサブフィールドはエンティティごとにスカラー配列のストレージパスに従い、ベクターサブフィールドはベクター配列のパスに従います。各サブフィールドは、そのタイプに適したデータパスを使用できます。メタデータにはスカラーフィルタリングとスカラーインデックス、埋め込みにはベクターインデックスとANN検索です。</p>
<p>取り込み時に、ProxyはネストされたStructリストを型付きの子カラムに展開します。実行中、Milvusは各物理要素とその親エンティティの関係を維持します。概念的には、この関係は次のようになります：</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>要素レベルの検索が物理要素IDを返すと、Milvusはそれを親エンティティと要素オフセットにマッピングします。<code translate="no">element_filter</code>が要素レベルのビットマップを生成すると、エンジンはそれを親エンティティの可視性、削除、その他のフィルターと整列させます。</p>
<p>結果を返すとき、Milvusは論理スキーマと共有オフセットを使用して、アプリケーションが挿入したStructArray形状を再構築します。システムは型付きの子カラム上で実行できますが、ユーザーは自然なネストされたオブジェクトの読み書きを継続できます。この物理レイアウトにより、StructArrayは型付きJSON以上のものになります。ネストされた関係がインデックスと実行モデルに参加します。</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">StructArrayが適しているケースと適していないケース<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArrayは、以下のすべてが当てはまる場合に最適です：</p>
<ul>
<li>アプリケーションに、動画、製品、ドキュメント、ビジュアルページ、メモリレコードなどの意味のある親エンティティがある。</li>
<li>各親に、順序付きの可変長のローカル要素セットが含まれている。</li>
<li>それらの要素に独自のスカラーメタデータ、ベクトル、またはその両方が必要である。</li>
<li>検索またはフィルタリングが、同じ要素オフセットのサブフィールド間の関係を維持する必要がある。</li>
<li>アプリケーションにエンティティレベルのマルチベクター検索、要素レベルのヒット、またはその両方が必要である。</li>
</ul>
<p>StructArrayがすべてのコレクションで自動的に優れているわけではありません。短いドキュメントや単純なクエリは、単一の高密度埋め込みで十分に対応できる場合があります。マルチベクターインデックスはストレージと検索のコストを追加するため、追加の表現は、検索品質の向上またはより有用な結果の粒度によってその価値を証明する必要があります。</p>
<p>現在のスキーマと実行の境界も重要です：</p>
<ul>
<li><code translate="no">Struct</code>は、<code translate="no">Array</code>の要素タイプとしてサポートされており、トップレベルのコレクションフィールドとしてはサポートされていません。</li>
<li>1つのStructArray内のすべての要素は、1つの事前定義されたスキーマを共有します。</li>
<li><code translate="no">max_capacity</code>は必須で、エンティティごとの要素数を制限します。</li>
<li>ネストされた<code translate="no">Struct</code>、<code translate="no">Array</code>、<code translate="no">ArrayOfStruct</code>、<code translate="no">JSON</code>サブフィールドはStructArray内ではサポートされていません。</li>
<li>ベクターサブフィールドは1つのインデックスを受け入れます。両方が必要な場合は、EmbeddingListと要素レベルの検索に個別のベクターサブフィールドを使用します。</li>
<li>ベクターサブフィールドは検索前にインデックス作成する必要があります。フィルターで頻繁に使用されるスカラーサブフィールドは、適切にインデックス作成する必要があります。</li>
<li>サブフィールドスキーマはStructArrayフィールドの作成後に固定されるため、本番展開前に要素属性を計画してください。</li>
</ul>
<p>これらの制約により、モデルはドキュメントデータベースの任意のネストよりも狭くなりますが、要素の同一性を推論し、各サブフィールドをインデックス作成し、2つの検索粒度で実行するための十分な構造をMilvusに提供します。</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArrayはエンティティを失わずにローカルな証拠を第一級のものとして維持する<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArrayは、フラットなスキーマでは表現が難しい検索オブジェクトをMilvusに提供します。それは、順序付きの構造化要素セットを持つ親エンティティです。これらの要素間の関係は、ストレージにのみ存在するのではなく、フィルタリング、インデックス作成、検索に参加します。</p>
<p>各要素は独自のメタデータと埋め込みを保持します。要素は、同じ要素のスカラー述語を満たしたり、エンティティレベルのEmbeddingList検索に一緒に参加したり、要素レベルの検索で独立して競合したりできます。同時に、それらはメタデータ、権限、アプリケーションの同一性がコンテキストを提供する親エンティティに接続されたままです。</p>
<p>ビデオクリップ、製品画像、ドキュメントのパッセージ、ビジュアルパッチ、メモリフラグメントについて、ローカルな証拠は、それが属するエンティティを失うことなく検索およびフィルタリングできます。残りの設計上の選択は明示的です。検索の粒度を選択し、各ベクターサブフィールドに一致するメトリックとインデックスを設定し、ハイブリッド結果が要素オフセットを維持するかエンティティにコラプスするかを決定します。</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Milvus 3.0でStructArrayを試す<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArrayはMilvus 3.0で利用可能です。<a href="https://milvus.io/docs/array-of-structs.md">StructArrayの概要</a>から始めてください。エンティティレベルのマルチベクター検索を評価している場合は、<a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">EmbeddingList戦略ガイド</a>をお読みください。結果の粒度とコラプス動作については、<a href="https://milvus.io/docs/hybrid-search-with-structarray.md">StructArrayを使用したハイブリッド検索</a>を参照してください。</p>
<p>リリース全体の文脈については、<a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0ローンチブログ</a>、<a href="https://milvus.io/docs/release_notes.md">リリースノート</a>、<a href="https://github.com/milvus-io/milvus">milvus-io/milvusリポジトリ</a>を参照してください。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a>も、マネージドデプロイメント向けにStructArrayとEmbeddingList検索をサポートしています。サービス固有の制限については、<a href="https://docs.zilliz.com/docs/use-array-of-structs">Zilliz CloudのStructArrayガイド</a>を確認してください。Zilliz Cloudでは、StructArrayのスカラー演算子は現在、On-Demandクラスター向けにドキュメント化されています。</p>
<p>チームとスキーマや検索設計について議論するには、<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discordコミュニティ</a>に参加するか、<a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>セッションを予約してください。</p>
