---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: ベクターデータベース、ベクター検索ライブラリ、ベクター検索プラグインの比較
author: Frank Liu
date: 2023-11-9
desc: この記事では、ベクターデータベース、ベクター検索プラグイン、ベクター検索ライブラリを比較しながら、ベクター検索の複雑な領域を探求し続ける。
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ベクターデータベース101へようこそ！</p>
<p><a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPTや</a>その他の大規模言語モデル(LLM)の急増は、<a href="https://zilliz.com/what-is-milvus">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ような特殊なベクターデータベースや<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISSの</a>ようなライブラリ、従来のデータベースに統合されたベクター検索プラグインを特徴とするベクター検索テクノロジーの成長を牽引してきました。</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">前回のシリーズ記事では</a>、ベクターデータベースの基礎について掘り下げました。この記事では、ベクターデータベース、ベクター検索プラグイン、ベクター検索ライブラリを比較しながら、ベクター検索の複雑な領域を探求し続けます。</p>
<h2 id="What-is-vector-search" class="common-anchor-header">ベクトル検索とは？<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索は</a>、ベクトル類似性検索とも呼ばれ、高密度なベクトルデータの膨大なコレクションの中から、与えられたクエリベクトルと最も類似している、または意味的に関連している上位k個の結果を検索するテクニックです。類似検索を行う前に、ニューラルネットワークを活用して、テキスト、画像、動画、音声などの<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データを</a>埋め込みベクトルと呼ばれる高次元の数値ベクトルに変換する。埋め込みベクトルを生成した後、ベクトル検索エンジンは、入力されたクエリーベクトルとベクトルストア内のベクトルとの空間的距離を比較する。空間距離が近ければ近いほど、両者は類似していることになる。</p>
<p>PythonのNumPyのような機械学習ライブラリ、FAISSのようなベクトル検索ライブラリ、従来のデータベース上に構築されたベクトル検索プラグイン、MilvusやZilliz Cloudのような特殊なベクトルデータベースなど、複数のベクトル検索技術が市場に出回っている。</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">ベクターデータベースとベクター検索ライブラリの比較<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">特殊化されたベクターデータベースだけが</a>類似検索のスタックではない。ベクトルデータベースが登場する以前は、FAISS、ScaNN、HNSWなど多くのベクトル検索ライブラリがベクトル検索に使われていました。</p>
<p>ベクトル検索ライブラリは、高性能なプロトタイプのベクトル検索システムを素早く構築するのに役立ちます。FAISSを例にとると、FAISSはオープンソースで、効率的な類似性検索と高密度ベクトルクラスタリングのためにMeta社によって開発された。FAISSはあらゆるサイズのベクトルコレクションを扱うことができ、メモリに完全にロードできないようなものでも扱うことができる。さらに、FAISSは評価とパラメータチューニングのためのツールを提供する。C++で書かれているにもかかわらず、FAISSはPython/NumPyインターフェースを提供する。</p>
<p>しかし、ベクトル検索ライブラリは、マネージド・ソリューションというよりは、単なる軽量ANNライブラリであり、機能も限られている。データセットが小さく限定的であれば、これらのライブラリは非構造化データ処理には十分であり、本番稼動しているシステムでも十分である。しかし、データセットのサイズが大きくなり、より多くのユーザーが参加するようになると、スケールの問題を解決するのはますます難しくなる。さらに、これらのデータベースはインデックスデータの変更を許さず、データのインポート中にクエリを実行することもできない。</p>
<p>対照的に、ベクトル・データベースは、非構造化データの保存と検索にとってより最適なソリューションである。ベクターデータベースは、数百万から数十億のベクターを保存し、同時にリアルタイムの応答を提供することができます。</p>
<p>さらに、Milvusのようなベクトルデータベースは、構造化／半構造化データに対して、クラウドナティビティ、マルチテナンシー、スケーラビリティなど、より使いやすい機能を備えている。これらの特徴は、このチュートリアルをより深く掘り下げるにつれて明らかになっていくだろう。</p>
<p>ベクターデータベースは本格的なサービスであるのに対し、ANNライブラリーは開発中のアプリケーションに統合されることを前提としている。この意味で、ANNライブラリは、ベクトル・データベースがApache Luceneの上に構築されているのと同じように、その上に構築されている多くのコンポーネントの一つである。</p>
<p>この抽象化がなぜ重要なのか、その一例を示すために、ベクトル・データベースに新しい非構造化データ要素を挿入してみましょう。これはmilvusではとても簡単です：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>たった3行のコードです。FAISSやScaNNのようなライブラリでは、残念ながら、特定のチェックポイントでインデックス全体を手動で再作成することなく、これを簡単に行う方法はありません。仮にそれができたとしても、ベクター検索ライブラリは、ベクターデータベースの最も重要な機能であるスケーラビリティとマルチテナンシーを欠いている。</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">ベクターデータベースと従来のデータベース用ベクター検索プラグインの比較<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクター検索ライブラリとベクターデータベースの違いがわかったところで、ベクターデータベースと<strong>ベクター検索プラグインの</strong>違いを見てみよう。</p>
<p>従来のリレーショナルデータベースや、Clickhouse や<a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch の</a>ような検索システムには、ベクトル検索プラグインが組み込まれているものが増えてきている。例えば、Elasticsearch 8.0には、restful APIエンドポイント経由で呼び出せるベクトル挿入とANN検索機能が含まれている。ベクトル検索プラグインの問題は昼夜の別なく明らかだろう。<strong>これらのソリューションはエンベッディング管理とベクトル検索に対してフルスタックのアプローチを取っていない</strong>。代わりに、これらのプラグインは既存のアーキテクチャの上に拡張することを意図しているため、制限があり最適化されていない。従来のデータベースの上で非構造化データ・アプリケーションを開発することは、リチウム電池と電気モーターをガソリン車のフレーム内に収めようとするようなもので、あまり良いアイデアとは言えない！</p>
<p>その理由を説明するために、ベクターデータベースが実装すべき機能のリスト（最初のセクション）に戻ってみよう。ベクター検索プラグインには、チューナビリティとユーザーフレンドリーなAPI/SDKという2つの機能が欠けている。引き続き Elasticsearch の ANN エンジンを例にして説明します。他のベクトル検索プラグインも非常に似たような動作をしているので、これ以上詳しくは説明しません。Elasticsearch は<code translate="no">dense_vector</code> データフィールド型によるベクトルの保存をサポートしており、<code translate="no">knnsearch endpoint</code> を使ったクエリが可能です：</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Elasticsearch の ANN プラグインは1つのインデックスアルゴリズムのみをサポートしています：HNSW として知られている Hierarchical Navigable Small Worlds です（マルチバースの普及に関しては、この作成者はマーベルよりも先を行っていたと思いたいです）。その上、L2/ユークリッド距離だけが距離メトリックとしてサポートされている。しかし、本格的なベクトルデータベースであるMilvusと比較してみよう。<code translate="no">pymilvus</code> を使う：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch と Milvus</a>はどちらもインデックスの作成、埋め込みベクトルの挿入、最近傍探索を行うメソッドを持っていますが、Milvus の方がより直感的なベクトル検索 API を持っており（ユーザー向けの API が優れている）、より幅広いベクトルインデックス＋距離メトリックをサポートしている（チューナビリティが優れている）ことはこれらの例から明らかです。Milvusはまた、将来的にはより多くのベクトルインデックスをサポートし、SQLライクなステートメントによるクエリーを可能にし、チューナビリティとユーザビリティの両方をさらに向上させる予定である。</p>
<p>私たちは今、かなりの量のコンテンツを吹っ飛ばした。Milvusがベクトル検索プラグインよりも優れているのは、Milvusがベクトルデータベースとしてゼロから構築されたため、より豊富な機能と非構造化データに適したアーキテクチャを実現しているからである。</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">様々なベクター検索テクノロジーから選ぶには？<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>すべてのベクターデータベースが同じように作られているわけではなく、それぞれが特定のアプリケーションに対応するユニークな特徴を持っています。ベクター検索ライブラリやプラグインはユーザーフレンドリーで、何百万ものベクターを扱う小規模なプロダクション環境を扱うのに理想的です。データサイズが小さく、基本的なベクター検索機能が必要なだけであれば、これらのテクノロジーで十分です。</p>
<p>しかし、何億ものベクターを扱い、リアルタイムのレスポンスが要求されるデータインテンシブなビジネスには、専用のベクターデータベースが最適です。例えば、Milvusは何十億ものベクトルを楽々と管理し、電光石火のクエリー速度と豊富な機能を提供します。さらに、Zillizのようなフルマネージドソリューションは、運用上の課題から解放され、コアビジネス活動に専念できるため、さらに有利です。</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">ベクターデータベース101コースをもう一度ご覧ください。<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">非構造化データ入門</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースとは？</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">ベクターデータベース、ベクター検索ライブラリ、ベクター検索プラグインの比較</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Milvus入門</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvusクイックスタート</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">ベクトル類似検索入門</a></li>
<li><a href="https://zilliz.com/blog/vector-index">ベクターインデックスの基礎と反転ファイルインデックス</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">スカラー量子化と積量子化</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">階層的航行可能小世界(HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">近似最近傍探索（ANNOY）</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">プロジェクトに適したベクトルインデックスの選択</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANNとVamanaアルゴリズム</a></li>
</ol>
