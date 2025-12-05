---
id: data-in-and-data-out-in-milvus-2-6.md
title: エンベッディング機能のご紹介：Milvus2.6がベクトル化とセマンティック検索をいかに効率化するか
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Milvus2.6では、データイン、データアウトにより、エンベッディング処理とベクトル検索を簡素化しました。エンベッディングとリランキングを自動的に処理します。
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>ベクター検索アプリケーションを構築したことがある方なら、そのワークフローはすでによくご存知でしょう。データを保存する前に、まず埋め込みモデルを使ってベクトルに変換し、クリーニングと整形を行い、最後にベクトルデータベースに取り込まなければなりません。入力データを埋め込み、類似検索を実行し、得られたIDを元の文書やレコードにマッピングする。それはうまくいくのですが、前処理スクリプト、埋め込みパイプライン、グルーコードが分散して絡み合い、メンテナンスが必要になります。</p>
<p>高性能なオープンソース・ベクターデータベースである<a href="https://milvus.io/">Milvusは</a>、そのすべてを簡素化するための大きな一歩を踏み出しました。<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus2.</a>6は、OpenAI、AWS Bedrock、Google Vertex AI、Hugging Faceなどの主要なモデルプロバイダーに直接接続する組み込みのエンベッディング機能である<strong>Data-in, Data-out機能（</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>エンベッディング機能としても</strong></a> <strong>知られて</strong>います<strong>）を</strong>導入しています。独自のエンベッディングインフラストラクチャを管理する代わりに、Milvusがこれらのモデルを呼び出すことができます。また、Milvusが自動的に書き込みとクエリ時のベクトル化を処理する間、生のテキスト（そして近いうちに他のデータタイプも）を使って挿入とクエリを行うことができる。</p>
<p>この記事では、Data-in, Data-outがどのように機能するのか、プロバイダーや埋め込み関数の設定方法、そしてベクター検索のワークフローをエンド・ツー・エンドで効率化するためにどのように使用できるのかについて詳しく見ていきます。</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">データイン、データアウトとは？<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.6のData-in, Data-outは、Milvusの内部でデータ変換とエンベッディング生成を処理するためのフレームワークである新しいFunctionモジュール上に構築されています。(このモジュールにより、Milvusは生の入力データを受け取り、埋め込みプロバイダを直接呼び出し、結果のベクトルをコレクションに自動的に書き込むことができます<a href="https://github.com/milvus-io/milvus/issues/35856">。</a></p>
<p><strong>Function</strong>モジュールは、エンベッディング生成をネイティブなデータベース機能に変えます。Milvusは、エンベッディングパイプライン、バックグラウンドワーカー、リランカーサービスを個別に実行する代わりに、設定されたプロバイダーにリクエストを送り、エンベッディングを取得し、データと一緒に保存します。これにより、エンベッディングインフラストラクチャを管理するためのオーバーヘッドがなくなります。</p>
<p>Data-in、Data-outは、Milvusのワークフローに3つの大きな改善をもたらします：</p>
<ul>
<li><p><strong>生データの直接挿入</strong>- 未処理のテキスト、画像、その他のデータタイプをMilvusに直接挿入できるようになりました。事前にベクトルに変換する必要はありません。</p></li>
<li><p><strong>Milvusで</strong>エンベッディングモデルを設定すると、エンベッディングプロセス全体が自動的に管理されます。Milvusは、OpenAI、AWS Bedrock、Google Vertex AI、Cohere、Hugging Faceなどの様々なモデルプロバイダとシームレスに統合されています。</p></li>
<li><p><strong>生入力でのクエリ</strong>- 生テキストやその他のコンテンツベースのクエリを使用してセマンティック検索を実行できるようになりました。Milvusは、同じ設定されたモデルを使用して、オンザフライで埋め込みを生成し、類似検索を実行し、関連する結果を返します。</p></li>
</ul>
<p>つまり、Milvusは自動的にデータを埋め込み、オプションで再ランクします。ベクトル化は組み込みのデータベース機能となり、外部の埋め込みサービスやカスタムの前処理ロジックは不要となります。</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">データイン、データアウトの仕組み<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>下図はData-in, Data-outがMilvus内部でどのように動作するかを示しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>データイン、データアウトのワークフローは主に6つのステップに分けられます：</p>
<ol>
<li><p><strong>データの入力</strong>- ユーザーはテキスト、画像、その他のコンテンツタイプなどの生データを、外部での前処理を行うことなくMilvusに直接入力します。</p></li>
<li><p><strong>エンベッディングの生成</strong>- 関数モジュールは、サードパーティAPIを通じて設定されたエンベッディングモデルを自動的に呼び出し、生の入力をリアルタイムでベクトルエンベッディングに変換します。</p></li>
<li><p><strong>エンベッディングの保存</strong>- Milvusは生成されたエンベッディングをコレクション内の指定されたベクトルフィールドに書き込みます。</p></li>
<li><p><strong>クエリの送信</strong>- 入力段階と同様に、ユーザはMilvusに生テキストまたはコンテンツベースのクエリを発行します。</p></li>
<li><p><strong>セマンティック検索</strong>- Milvusは同じ設定されたモデルを使用してクエリを埋め込み、保存されたベクトルに対して類似検索を実行し、最も近いセマンティックマッチを決定します。</p></li>
<li><p><strong>結果を返す</strong>- Milvusは最も類似した上位k件の結果を、元のデータにマッピングしてアプリケーションに直接返します。</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">データイン、データアウトの設定方法<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li><p><strong>Milvus 2.6の</strong>最新バージョンをインストールする。</p></li>
<li><p>サポートされているプロバイダー（OpenAI、AWS Bedrock、Cohereなど）からエンベッディングAPIキーを準備する。この例では、埋め込みプロバイダとして<strong>Cohere を</strong>使用します。</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header"><code translate="no">milvus.yaml</code> 設定の変更</h3><p><strong>Docker Composeで</strong>milvusを実行している場合、<code translate="no">milvus.yaml</code> ファイルを変更してFunctionモジュールを有効にする必要があります。公式ドキュメントを参照してください：<a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Docker Composeを使用したMilvusの設定</a>(他のデプロイ方法に関する説明はこちら)。</p>
<p>設定ファイルで、<code translate="no">credential</code> と<code translate="no">function</code> のセクションを探します。</p>
<p>そして、<code translate="no">apikey1.apikey</code> と<code translate="no">providers.cohere</code> のフィールドを更新してください。</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>これらの変更を行ったら、Milvusを再起動して更新された設定を適用します。</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">データイン、データアウト機能の使用方法<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1.コレクションのスキーマの定義</h3><p>埋め込み機能を有効にするには、<strong>コレクションのスキーマに</strong>少なくとも3つのフィールドが含まれている必要があります：</p>
<ul>
<li><p><strong>主キーフィールド (</strong><code translate="no">id</code> ) - コレクション内の各エンティティを一意に識別します。</p></li>
<li><p><strong>スカラーフィールド (</strong><code translate="no">document</code> ) - 元の生データを格納する。</p></li>
<li><p><strong>Vector フィールド (</strong><code translate="no">dense</code> ) - 生成されたベクトル埋め込みを格納する。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2.埋め込み関数の定義</h3><p>次に、スキーマに<strong>埋め込み関数を</strong>定義する。</p>
<ul>
<li><p><code translate="no">name</code> - 関数の一意な識別子。</p></li>
<li><p><code translate="no">function_type</code> - テキスト埋め込みには<code translate="no">FunctionType.TEXTEMBEDDING</code> 。milvusは<code translate="no">FunctionType.BM25</code> や<code translate="no">FunctionType.RERANK</code> などの他の関数タイプもサポートしています。詳細は「<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文検索と</a> <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">ディケイランカーの概要</a>」を参照。</p></li>
<li><p><code translate="no">input_field_names</code> - 生データ(<code translate="no">document</code>)の入力フィールドを定義します。</p></li>
<li><p><code translate="no">output_field_names</code> - ベクトル埋め込みが格納される出力フィールドを定義します (<code translate="no">dense</code>)。</p></li>
<li><p><code translate="no">params</code> - 埋め込み関数の設定パラメータ。<code translate="no">provider</code> と<code translate="no">model_name</code> の値は、<code translate="no">milvus.yaml</code> 設定ファイルの対応するエントリと一致する必要があります。</p></li>
</ul>
<p><strong>注意：</strong>各関数は、異なる変換ロジックを区別し、競合を防ぐために、一意の<code translate="no">name</code> と<code translate="no">output_field_names</code> を持つ必要があります。</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3.インデックスの設定</h3><p>フィールドと関数を定義したら、コレクションのインデックスを作成します。簡単のため、ここでは例としてAUTOINDEXタイプを使用する。</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4.コレクションの作成</h3><p>定義されたスキーマとインデックスを使用して、新しいコレクションを作成します。この例では、Demo という名前のコレクションを作成します。</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5.データの挿入</h3><p>Milvusに直接生データを挿入することができます - 埋め込みを手動で生成する必要はありません。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6.ベクトル検索の実行</h3><p>データを挿入した後、生のテキストクエリを使って直接検索を実行することができます。Milvusは自動的にクエリを埋め込みに変換し、保存されているベクトルとの類似性検索を行い、上位のマッチを返します。</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>ベクトル検索の詳細については<a href="https://milvus.io/docs/single-vector-search.md">基本的なベクトル検索と </a> <a href="https://milvus.io/docs/get-and-scalar-query.md">クエリAPI</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6を使い始める<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.6は、データイン、データアウトにより、ベクトル検索をよりシンプルなものにしました。Milvusにエンベッディングとリランキング機能を直接統合することで、外部の前処理を管理したり、エンベッディングサービスを別途維持する必要がなくなります。</p>
<p>試す準備はできましたか？今すぐ<a href="https://milvus.io/docs">Milvus</a>2.6をインストールし、Data-in, Data-outの威力を体験してください。</p>
<p>ご質問や機能の詳細については、Discordチャンネルにご参加ください。私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーで</a>20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールでの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusのMinHash LSH: LLMトレーニングデータの重複と戦う秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusはKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">実世界でのベクトル検索：リコール率を下げずに効率的にフィルタリングする方法 </a></p></li>
</ul>
