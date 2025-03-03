---
id: how-to-get-started-with-milvus.md
title: Milvusの始め方
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusの始め方</span> </span></p>
<p><strong><em>最終更新 2025年1月</em></strong></p>
<p>大規模言語モデル<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>)の進化とデータ量の増加により、データベースのような大量の情報を保存するための柔軟でスケーラブルなインフラが必要とされています。しかし、<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">従来のデータベースは</a>、表形式や構造化されたデータを保存するように設計されており、高度なLLMや情報検索アルゴリズムの能力を活用するために一般的に有用な情報は、テキスト、画像、動画、音声などの<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化</a>データである。</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースは</a>、非構造化データ用に特別に設計されたデータベースシステムです。ベクトルデータベースでは、大量の非構造化データを保存できるだけでなく、<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索も</a>可能です。ベクターデータベースは、Inverted File Index (IVFFlat)やHierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>)といった高度なインデックス作成方法を持ち、高速で効率的なベクター検索や情報検索処理を行うことができます。</p>
<p><strong>Milvusは</strong>オープンソースのベクターデータベースであり、ベクターデータベースが提供できる有益な機能をすべて活用することができます。この投稿で取り上げる内容は以下の通りです：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Milvusの概要</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Milvusの導入オプション</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Milvus Liteの使用方法</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Milvusスタンドアロンで始める</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">フルマネージドMilvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvusとは？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvusは</strong> </a>オープンソースのベクトルデータベースであり、大量の非構造化データを保存し、高速かつ効率的なベクトル検索を行うことができます。Milvusは、推薦システム、パーソナライズされたチャットボット、異常検知、画像検索、自然言語処理、検索拡張世代<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（</a>RAG）など、多くの一般的なGenAIアプリケーションに非常に有用です。</p>
<p>Milvusをベクトルデータベースとして使用することで得られる利点はいくつかあります：</p>
<ul>
<li><p>Milvusには複数の導入オプションがあり、ユースケースや構築するアプリケーションの規模に応じて選択することができます。</p></li>
<li><p>Milvusは、FLAT、IVFFlat、HNSW、<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANNの</a>ようなインメモリオプション、メモリ効率のための量子化バリアント、大規模データセット用のオンディスク<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DANN</a>、メモリ効率の高い高速検索用のGPU_CAGRA、GPU_IVF_FLAT、GPU_IVF_PQのようなGPUに最適化されたインデックスなど、さまざまなデータとパフォーマンスのニーズに対応する多様なインデックス作成方法をサポートしています。</p></li>
<li><p>また、Milvusはハイブリッド検索も提供しており、ベクトル検索操作中に密な埋め込み、疎な埋め込み、メタデータフィルタリングを組み合わせて使用することができ、より正確な検索結果につながります。さらに、<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5では</a>、<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">全文検索と</a>ベクトル検索のハイブリッド検索に対応し、検索精度がさらに向上しました。</p></li>
<li><p>Milvusは<a href="https://zilliz.com/cloud">Zilliz Cloudを通じて</a>クラウド上で利用することができ、論理クラスタ、ストリーミングデータと履歴データの分離、階層型ストレージ、オートスケール、マルチテナントのホットコールド分離という4つの先進機能により、運用コストとベクトル検索速度を最適化することができます。</p></li>
</ul>
<p>Milvusをベクターデータベースとして使用する場合、3つの異なる導入オプションを選択することができ、それぞれに長所と利点があります。それぞれの長所と利点について次のセクションで説明します。</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvusの展開オプション<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを使い始めるにあたり、<strong>Milvus Lite、Milvus Standalone、Milvus Distributed、Zilliz Cloud（マネージドMilvus</strong>）の4つのデプロイオプションから選択することができる。各展開オプションは、データのサイズ、アプリケーションの目的、アプリケーションの規模など、ユースケースの様々なシナリオに合わせて設計されています。</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Liteは</strong></a>Milvusの軽量版であり、私たちにとって最も簡単に始めることができる方法です。次のセクションでは、Milvus Liteを実際に動かす方法を見ていく。その後、Milvusのコア機能のほとんどをベクターデータベースとして実行することができる。</p>
<p>Milvus Liteは、迅速なプロトタイピングや学習目的に最適で、複雑な設定なしにJupyterノートブックで実行できる。Milvusは、ベクターデータベースのストレージとして、最大100万個のベクター埋め込みを保存することができます。Milvus Liteは、その軽量な機能とストレージ容量から、プライベートドキュメントの検索エンジンやデバイス上でのオブジェクト検出など、エッジデバイスでの作業に最適なデプロイメントオプションです。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvusスタンドアロン</h3><p>Milvus Standaloneは、Dockerイメージにパックされたシングルマシンサーバのデプロイメントです。そのため、DockerにMilvusをインストールし、Dockerコンテナを起動するだけで利用を開始できる。また、Milvus Standaloneの詳細な実装については次のセクションで説明する。</p>
<p>Milvus Standaloneは、最大10Mのベクトル埋め込みを保存できるため、小規模から中規模のアプリケーションの構築とプロダクション化に最適です。さらに、Milvus Standaloneは、プライマリバックアップモードによる高可用性を提供し、プロダクション対応アプリケーションでの使用に高い信頼性をもたらします。</p>
<p>また、Milvus StandaloneとMilvus Liteは同じクライアントサイドAPIを共有しているため、例えばMilvus LiteでMilvusの機能を学習し、プロトタイピングを行った後にMilvus Standaloneを使用することも可能です。</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvusディストリビューテッド</h3><p>Milvus Distributedは、クラウドベースのアーキテクチャを活用したデプロイメントオプションであり、データの取り込みと取得が別々に処理されるため、拡張性が高く効率的なアプリケーションを実現することができます。</p>
<p>Milvus Distributedを実行するには、通常、コンテナを複数のマシンや環境で実行できるようにKubernetesクラスタを使用する必要がある。Kubernetesクラスタを適用することで、Milvus Distributedのスケーラビリティと柔軟性が確保され、需要やワークロードに応じて割り当てられたリソースをカスタマイズできる。これはまた、1つの部分に障害が発生しても、他の部分が引き継ぐことができ、システム全体が中断されないことを保証することを意味する。</p>
<p>Milvus Distributedは、最大数百億のベクトル埋め込みデータを扱うことができ、データが大きすぎて単一のサーバーマシンに保存できないようなユースケース向けに特別に設計されている。そのため、この導入オプションは、大規模なユーザーベースにサービスを提供するエンタープライズクライアントに最適です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：Milvusの各配備オプションのベクター埋め込みストレージ機能。</em></p>
<p>この記事では、Milvus LiteとMilvus Standaloneの両方の導入方法を紹介する。ただし、Milvus Distributedは設定が複雑です。一旦Milvus Distributedをセットアップすれば、コレクションの作成、データの取り込み、ベクトル検索の実行などのコードや論理的なプロセスは、クライアント側のAPIを共有しているため、Milvus LiteやMilvus Standaloneと同様である。</p>
<p>上記3つの導入オプションに加え、マネージドMilvus on<a href="https://zilliz.com/cloud">Zilliz Cloudも</a>手間をかけずにお試しいただけます。Zilliz Cloudについては後述します。</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Milvus Liteを始めるにあたって<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>PythonでMilvus Liteを導入するには、Pymilvusというライブラリをpipでインポートします。Pymilvusをインストールする前に、お使いの環境が以下の要件を満たしていることを確認してください：</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 and arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2およびx86_64)</p></li>
<li><p>Python 3.7以降</p></li>
</ul>
<p>これらの要件を満たした後、以下のコマンドでMilvus Liteとデモに必要な依存関係をインストールすることができる：</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>:このコマンドはMilvusのPython SDKである<code translate="no">pymilvus</code> ライブラリをインストールまたはアップグレードします。Milvus LiteはPyMilvusにバンドルされているため、この1行のコードだけでMilvus Liteをインストールすることができます。</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>:このコマンドは、Milvusにあらかじめ統合されている高度な機能と追加ツールを追加します。これには、Hugging Face Transformersのような機械学習モデル、Jina AIエンベッディングモデル、リランキングモデルなどが含まれます。</p></li>
</ul>
<p>以下はMilvus Liteを使った手順です：</p>
<ol>
<li><p>埋め込みモデルを使って、テキストデータを埋め込み表現に変換する。</p></li>
<li><p>Milvusデータベースにスキーマを作成し、テキストデータと埋め込み表現を格納する。</p></li>
<li><p>スキーマにデータを格納し、インデックスを作成する。</p></li>
<li><p>格納されたデータに対して簡単なベクトル検索を実行する。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：ベクトル検索のワークフロー</em></p>
<p>テキストデータをベクトル埋め込み表現に変換するために、SentenceTransformersの<a href="https://zilliz.com/ai-models">埋め込みモデル</a>'all-MiniLM-L6-v2'を使用する。この埋め込みモデルは、テキストを384次元のベクトル埋め込みに変換します。このモデルを読み込み、テキストデータを変換し、すべてをまとめてみましょう。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>次に、上記のデータをMilvusに格納するためのスキーマを作成します。上にあるように、データは3つのフィールドから構成されています：ID、ベクトル、テキストです。そこで、この3つのフィールドを持つスキーマを作成します。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Liteを使えば、上記で定義したスキーマに基づいて、特定のデータベース上にコレクションを作成し、コレクションにデータを挿入したり、インデックスを作成したりすることが、わずか数行のコードで簡単にできます。</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>上のコードでは、&quot;milvus_demo &quot;という名前のMilvusデータベース内に &quot;demo_collection &quot;というコレクションを作成しています。次に、作成した "demo_collection "にすべてのデータをインデックスします。</p>
<p>これでデータベース内にデータができたので、任意のクエリに対してベクトル検索を行うことができます。例えば、「<em>アラン・チューリングとは誰か</em>」というクエリがあるとしよう。以下のステップを実行することで、クエリに対する最も適切な答えを得ることができる：</p>
<ol>
<li><p>データベース内のデータを埋め込みに変換するのに使ったのと同じ埋め込みモデルを用いて、クエリをベクトル埋め込みに変換する。</p></li>
<li><p>コサイン類似度やユークリッド距離などのメトリックスを用いて、クエリの埋め込みとデータベース内の各エントリの埋め込みとの類似度を計算する。</p></li>
<li><p>最も類似したエントリを、クエリに対する適切な回答として取り出す。</p></li>
</ol>
<p>以下は、Milvusを使った上記のステップの実装です：</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>以上です！Milvusが提供する他の機能、例えば、データベースの管理、コレクションの挿入と削除、適切なインデックス作成方法の選択、メタデータフィルタリングやハイブリッド検索を用いたより高度なベクトル検索の実行などについては、<a href="https://milvus.io/docs/">Milvusのドキュメントを</a>ご参照ください。</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Milvus Standaloneを始めるにあたって<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standaloneは、すべてがDockerコンテナにまとめられているデプロイオプションです。そのため、Milvus Standaloneを始めるには、DockerにMilvusをインストールし、Dockerコンテナを起動する必要がある。</p>
<p>Milvus Standaloneをインストールする前に、ハードウェアとソフトウェアの両方が<a href="https://milvus.io/docs/prerequisite-docker.md">このページに</a>記載されている要件を満たしていることを確認してください。また、Dockerがインストールされていることを確認してください。Dockerのインストールについては、こちらの<a href="https://docs.docker.com/get-started/get-docker/">ページを</a>ご参照ください。</p>
<p>システムが要件を満たし、Dockerがインストールできたら、以下のコマンドでDockerにMilvusをインストールします：</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>上記のコードでは、Dockerコンテナも起動しており、起動すると以下のような出力が得られます：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：Dockerコンテナ起動成功後のメッセージ。</em></p>
<p>上記のインストール・スクリプト "standalone_embed.sh "を実行すると、ポート19530で "milvus "という名前のDockerコンテナが起動する。したがって、クライアントを起動する際にこのポートを指定することで、新しいデータベースを作成するだけでなく、milvusデータベースに関連するすべてのものにアクセスすることができる。</p>
<p>例えば、"milvus_demo "というデータベースを作成するとしよう。以下のようにすればよい：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>次に、<a href="https://milvus.io/docs/milvus-webui.md">Milvus Web UIに</a>アクセスすることで、新しく作成した "milvus_demo "というデータベースが本当にMilvusインスタンスに存在するかどうかを確認することができます。Milvus Web UIは、その名の通り、Milvusが提供するグラフィカルユーザインタフェースで、コンポーネントの統計やメトリクスの確認、データベース、コレクション、設定の一覧や詳細の確認などを行うことができます。Milvus Web UIは、上記のDockerコンテナを起動した後、http://127.0.0.1:9091/webui/。</p>
<p>上記リンクにアクセスすると、このようなランディングページが表示される：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Collections "タブの下に、"milvus_demo "データベースが正常に作成されていることがわかります。ご覧のように、このWeb UIで、コレクションのリスト、コンフィギュレーション、実行したクエリなど、他のことも確認できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これで、上記のMilvus Liteのセクションで見たのと全く同じようにすべてを実行することができる。milvus_demo "データベース内に "demo_collection "という3つのフィールドからなるコレクションを作成します。そして、このコレクションにデータを挿入する。</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>ベクトル検索を行うコードもMilvus Liteと同じだ：</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dockerを使う以外にも、<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a>（Linux用）や<a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a>（Windows用）を使ってMilvus Standaloneを使うこともできます。</p>
<p>Milvusインスタンスを使わなくなったら、以下のコマンドでMilvus Standaloneを停止することができる：</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Milvusのフルマネージド化<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを使い始める別の方法として、<a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ネイティブクラウドベースのインフラを利用する方法があります。</p>
<p>Zilliz Cloudは、お客様のAIアプリケーションをサポートするための専用環境とリソースを備えた専用クラスタを提供します。Milvus上に構築されたクラウドベースのデータベースであるため、ローカルインフラのセットアップや管理は不要です。また、Zilliz Cloudは、ベクトルストレージと計算の分離、S3のような一般的なオブジェクトストレージシステムへのデータバックアップ、ベクトル検索・取得操作を高速化するデータキャッシングなど、より高度な機能も提供している。</p>
<p>しかし、クラウドベースのサービスを検討する際に考慮しなければならないのは、運用コストである。ほとんどの場合、データの取り込みやベクトル検索のアクティビティがなく、クラスタがアイドル状態であっても支払いが必要だ。アプリケーションの運用コストとパフォーマンスをさらに最適化したいのであれば、Zilliz Cloud Serverlessは優れた選択肢となるだろう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：Zilliz Cloud Serverlessを利用する主なメリット。</em></p>
<p>Zilliz Cloud Serverlessは、AWS、Azure、GCPといった主要なクラウドプロバイダーで利用できる。従量課金、つまりクラスターを利用したときだけ料金を支払うといった特徴がある。</p>
<p>また、Zilliz Cloud Serverlessは、論理クラスタ、自動スケーリング、階層型ストレージ、ストリーミングデータと履歴データの分解、ホットコールドのデータ分離などの先進的なテクノロジーを実装している。これらの機能により、Zilliz Cloud ServerlessはインメモリMilvusと比較して、最大50倍のコスト削減と約10倍のベクトル検索処理の高速化を実現している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：階層型ストレージとホットコールド・データ分離の説明図。</em></p>
<p>Zilliz Cloud Serverlessを始めたい方は、<a href="https://zilliz.com/serverless">こちらのページを</a>ご覧ください。</p>
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
    </button></h2><p>Milvusは、非構造化データを管理し、最新のAIアプリケーションで高速かつ効率的なベクトル検索処理を実行するという課題を解決するために設計された、汎用的で強力なベクトルデータベースとして際立っている。迅速なプロトタイピングのためのMilvus Lite、小規模から中規模のアプリケーションのためのMilvus Standalone、エンタープライズレベルのスケーラビリティのためのMilvus Distributedといったデプロイメントオプションにより、どのようなプロジェクトの規模や複雑さにも柔軟に対応できる。</p>
<p>さらに、Zilliz Cloud Serverlessは、Milvusの機能をクラウドに拡張し、ローカルのインフラを不要にする費用対効果の高い従量課金モデルを提供します。Zilliz Cloud Serverlessは、階層型ストレージや自動スケーリングなどの高度な機能により、コストを最適化しながらベクトル検索業務の高速化を実現します。</p>
