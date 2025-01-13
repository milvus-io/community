---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: 類似検索アプリケーションを強化する文字列データの使い方
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: 文字列データを使用して、独自の類似検索アプリケーションの構築プロセスを合理化します。
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>カバー</span> </span></p>
<p>Milvus 2.1では、Milvusをより使いやすくするために、<a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">いくつかの重要なアップデートが行わ</a>れました。その一つが文字列データ型のサポートである。Milvusは現在、文字列、ベクトル、ブール値、整数、浮動小数点数などの<a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">データ型をサポートして</a>います。</p>
<p>この記事では文字列データ型のサポートについて紹介します。文字列データ型を使って何ができるのか、どのように使うのかを学んでください。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">文字列データで何ができるのか？</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Milvus2.1で文字列データを管理するには？</a><ul>
<li><a href="#Create-a-collection">コレクションの作成</a></li>
<li><a href="#Insert-data">データの挿入と削除</a></li>
<li><a href="#Build-an-index">インデックスの作成</a></li>
<li><a href="#Hybrid-search">ハイブリッド検索</a></li>
<li><a href="#String-expressions">文字列式</a></li>
</ul></li>
</ul>
<custom-h1>文字列データで何ができるのか？</custom-h1><p>文字列データ型のサポートは、ユーザーから最も期待されている機能の一つです。Milvusのベクトルデータベースを利用したアプリケーションの構築プロセスを効率化し、類似検索やベクトル検索を高速化します。</p>
<p>具体的には、Milvus 2.1は、様々な長さの文字列を格納するVARCHARデータ型をサポートしています。VARCHAR データ型のサポートにより、以下のことが可能になります：</p>
<ol>
<li>外部のリレーショナルデータベースを使用することなく、文字列データを直接管理することができます。</li>
</ol>
<p>VARCHARデータ型のサポートにより、milvusにデータを挿入する際に、文字列を他のデータ型に変換するステップを省略することができます。例えば、オンライン書店の書籍検索システムを開発しているとします。書籍データセットを作成し、書籍の名前で識別したいとします。Milvusが文字列データ型をサポートしていない以前のバージョンでは、Milvusにデータを挿入する前に、まずMySQLのようなリレーショナルデータベースの助けを借りて、文字列（書籍の名前）を書籍IDに変換する必要があるかもしれません。現在、文字列データ型がサポートされているので、単純に文字列フィールドを作成し、ID番号の代わりに書籍名を直接入力することができます。</p>
<p>この利便性は、検索やクエリーのプロセスでも発揮される。例えば、「<em>Hello milvus</em>」を愛読している顧客がいるとしよう。似たような本をシステム内で検索し、クライアントに推薦したいとします。Milvusの以前のバージョンでは、システムは本のIDだけを返すので、あなたはリレーショナルデータベースで対応する本の情報をチェックするために余分なステップを踏む必要がありました。しかし、Milvus 2.1では、すでに書籍名を含む文字列フィールドが作成されているため、書籍名を直接取得することができます。</p>
<p>一言で言えば、文字列データ型のサポートは、文字列データを管理するために他のツールに頼る手間を省き、開発プロセスを大幅に簡素化します。</p>
<ol start="2">
<li>属性フィルタリングによる<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">ハイブリッド検索と</a> <a href="https://milvus.io/docs/v2.1.x/query.md">ベクトル・クエリの</a>高速化。</li>
</ol>
<p>他のスカラーデータ型と同様に、VARCHARはハイブリッド検索やブール式によるベクトル検索で属性フィルタリングに使用することができます。特にmilvus 2.1では、<code translate="no">like</code> という演算子が追加され、前方一致を行うことができるようになりました。また、<code translate="no">==</code> 演算子を用いて完全一致を行うこともできる。</p>
<p>さらに、MARISA-trieベースの転置インデックスがサポートされ、ハイブリッド検索とクエリを高速化します。続けて読むと、文字列データで属性フィルタリングを実行するために知っておきたい文字列式の全てを知ることができる。</p>
<custom-h1>Milvus2.1で文字列データを管理するには？</custom-h1><p>さて、文字列データ型が非常に便利であることはわかりましたが、具体的にどのような場合にこのデータ型を使用してアプリケーションを構築する必要があるのでしょうか？以下では、Milvus 2.1におけるVARCHARデータの管理方法について理解を深めていただくために、文字列データを含むシナリオのコード例をいくつかご紹介します。</p>
<h2 id="Create-a-collection" class="common-anchor-header">コレクションの作成<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>前の例に従ってみましょう。<code translate="no">book_name</code> という主キーフィールドを持つブックコレクションを作成し、そこに文字列データを挿入します。この場合、以下の例に示すように、フィールドスキーマを設定するときにデータ型を<code translate="no">DataType.VARCHAR</code>。</p>
<p>VARCHARフィールドを作成する場合、パラメータ<code translate="no">max_length</code> （値は1～65,535の範囲）で最大文字数を指定する必要があることに注意してください。  この例では、最大長を200に設定しています。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">データの挿入<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>コレクションが作成されたので、データを挿入できます。以下の例では、ランダムに生成された2,000行の文字列データを挿入している。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">データの削除<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">book_0</code> と<code translate="no">book_1</code> という名前の2冊の本が、あなたのストアではもう入手できないので、データベースから関連情報を削除したいとします。この場合、以下の例に示すように、<code translate="no">in</code> という条件式を使用して、削除するエンティティをフィルタリングすることができます。</p>
<p>Milvusは主キーが明確に指定されたエンティティの削除にのみ対応していますので、以下のコードを実行する前に、<code translate="no">book_name</code> フィールドが主キーフィールドとして設定されていることを確認してください。</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">インデックスの構築<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.1はスカラーインデックスの構築をサポートしており、文字列フィールドのフィルタリングを大幅に高速化することができます。ベクターインデックスの構築とは異なり、スカラーインデックスを構築する前にパラメータを準備する必要はありません。Milvusは一時的に辞書ツリー(MARISA-trie)インデックスのみをサポートしているため、VARCHAR型フィールドのインデックスタイプはデフォルトでMARISA-trieとなります。</p>
<p>インデックス構築時にインデックス名を指定することができます。指定しない場合、<code translate="no">index_name</code> のデフォルト値は<code translate="no">&quot;_default_idx_&quot;</code> 。 以下の例ではインデックス名を<code translate="no">scalar_index</code> とした。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">ハイブリッド検索<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>ブーリアン式を指定することで、ベクトル類似検索の際に文字列フィールドをフィルタリングすることができます。</p>
<p>例えば、イントロがHello Milvusに最も似ている本を検索しているが、名前が'book_2'で始まる本だけを取得したい場合、以下の例に示すように、演算子<code translate="no">like</code>を使用して前方一致を行い、対象となる本を取得することができます。</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">文字列表現<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>新しく追加された演算子<code translate="no">like</code> 以外にも、Milvusの旧バージョンで既にサポートされている演算子を文字列フィールドのフィルタリングに使用することができます。以下はよく使用される<a href="https://milvus.io/docs/v2.1.x/boolean.md">文字列式の</a>例です。<code translate="no">A</code> は VARCHAR 型のフィールドを表します。以下の文字列式はすべてAND、OR、NOTなどの論理演算子を使って論理的に組み合わせることができることを覚えておいてください。</p>
<h3 id="Set-operations" class="common-anchor-header">セット操作</h3><p><code translate="no">in</code> と<code translate="no">not in</code> を使って、<code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code> のようなセット操作を実現することができます。</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">2つの文字列フィールドの比較</h3><p>関係演算子を使用して、2 つの文字列フィールドの値を比較することができます。このような関係演算子には、<code translate="no">==</code>,<code translate="no">!=</code>,<code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> があります。詳細については、<a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">関係演算</a>子を参照してください。</p>
<p>文字列フィールドは、他のデータ型のフィールドではなく、他の文字列フィールドとしか比較できないことに注意してください。例えば、VARCHAR型のフィールドをBoolean型やinteger型のフィールドと比較することはできません。</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">フィールドと定数値の比較</h3><p><code translate="no">==</code> または<code translate="no">!=</code> を使用して、フィールドの値が定数値と等しいかどうかを検証できます。</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">単一の範囲でフィールドをフィルタする</h3><p><code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> を使用して、<code translate="no">A &gt; &quot;str1&quot;</code> のような単一の範囲を持つ文字列フィールドをフィルタリングできます。</p>
<h3 id="Prefix-matching" class="common-anchor-header">接頭辞マッチング</h3><p>前述したように、Milvus 2.1では、<code translate="no">A like &quot;prefix%&quot;</code> のような接頭辞マッチングのための演算子<code translate="no">like</code> が追加されました。</p>
<h2 id="Whats-next" class="common-anchor-header">次のリリース<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介する一連のブログを用意しました。このブログシリーズの続きを読む</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクターデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
