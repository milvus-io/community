---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: Milvus 2.5のご紹介：全文検索、より強力なメタデータフィルタリング、ユーザビリティの向上！
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">概要<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの最新バージョン2.5では、レキシカル検索やキーワード検索とも呼ばれる<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文検索という</a>強力な新機能が追加されました。全文検索とは、Googleで検索するのと同じように、特定の単語やフレーズを検索して文書を見つけることができる機能です。これは、単に正確な単語と一致させるのではなく、検索の背後にある意味を理解する、当社の既存のセマンティック検索機能を補完するものです。</p>
<p>文書の類似性には業界標準のBM25メトリックを使用しており、我々の実装はスパースベクトルに基づいているため、より効率的な保存と検索が可能です。スパースベクトルとは、ほとんどの値がゼロであるテキストを表現する方法であり、保存や処理を非常に効率的に行うことができる。このアプローチは、ベクトルを検索の中核とするmilvusの製品哲学によく適合している。</p>
<p>さらに、我々の実装の特筆すべき点は、ユーザーが最初にテキストをスパースベクトルに手動で変換するのではなく、テキストを<em>直接</em>挿入してクエリできることです。これにより、Milvusは非構造化データの完全処理に一歩近づいた。</p>
<p>しかし、これは始まりに過ぎない。2.5のリリースに伴い、<a href="https://milvus.io/docs/roadmap.md">Milvusの製品ロードマップを</a>更新しました。Milvusの今後の製品リリースでは、Milvusの機能を4つの主要な方向性で進化させることに焦点を当てます：</p>
<ul>
<li>非構造化データ処理の合理化；</li>
<li>検索の質と効率の向上</li>
<li>より容易なデータ管理</li>
<li>アルゴリズムと設計の進歩によるコスト削減</li>
</ul>
<p>私たちの目標は、AI時代に情報を効率的に保存し、効率的に検索できるデータインフラを構築することです。</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">スパースBM25による全文検索<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>セマンティック検索は通常、文脈認識や意図理解に優れているが、ユーザーが特定の固有名詞やシリアル番号、完全に一致するフレーズを検索する必要がある場合、キーワードマッチングによる全文検索の方がより正確な結果を得られることが多い。</p>
<p>例で説明しよう：</p>
<ul>
<li>セマンティック検索は、"再生可能エネルギーソリューションに関する文書を探す "といった場合に優れています。</li>
<li><em>テスラ・モデル3 2024に</em>言及した文書を探す &quot;場合は全文検索の方が優れている。</li>
</ul>
<p>以前のバージョン(Milvus 2.4)では、ユーザーは検索する前に自分のマシンで別のツール(PyMilvusのBM25EmbeddingFunctionモジュール)を使ってテキストを前処理する必要がありました。 このアプローチにはいくつかの制限がありました。増大するデータセットをうまく扱えない、余分なセットアップステップが必要、プロセス全体が必要以上に複雑になる、などです。技術的には、1台のマシンでしか動作しないこと、BM25のスコアリングに使用される語彙やその他のコーパスの統計は、コーパスが変更されると更新できないこと、クライアント側でテキストをベクトルに変換するのは、テキストを直接扱うより直感的でないこと、などが主な制限でした。</p>
<p>Milvus2.5はすべてを簡素化します。テキストを直接扱うことができます：</p>
<ul>
<li>元のテキスト文書をそのまま保存</li>
<li>自然言語クエリを使った検索</li>
<li>結果を読みやすい形で返す</li>
</ul>
<p>Milvusは、複雑なベクトル変換をすべて自動で行い、テキストデータの取り扱いをより簡単にします。これは私たちが "Doc in, Doc out "と呼んでいるアプローチで、お客様は読みやすいテキストで作業し、残りは私たちが処理します。</p>
<h3 id="Techical-Implementation" class="common-anchor-header">技術的な実装</h3><p>Milvus 2.5では、組み込みのSparse-BM25実装により、以下のような全文検索機能が追加されました：</p>
<ul>
<li><strong>tantivyで構築されたトークナイザー</strong>：Milvusはtantivyエコシステムと統合されました。</li>
<li><strong>生文書の取り込みと検索機能</strong>：テキストデータの直接取り込みとクエリのサポート</li>
<li><strong>BM25関連性スコアリング</strong>：スパースベクトルに基づいて実装されたBM25スコアリングの内部化</li>
</ul>
<p>私たちは、発達したtantivyエコシステムと連携することを選択し、milvusテキストトークナイザをtantivy上に構築しました。将来的には、Milvusはより多くのトークナイザーをサポートし、ユーザーが検索品質をより理解できるようにトークン化プロセスを公開する予定である。また、全文検索のパフォーマンスをさらに最適化するために、ディープラーニングベースのトークナイザーやステマーストラテジーを探求していきます。以下は、トークナイザーの使用と設定のためのサンプルコードです：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>コレクションスキーマでトークナイザーを設定した後、ユーザーは add_function メソッドで bm25 関数にテキストを登録できます。これはMilvusサーバ内部で実行されます。追加、削除、変更、クエリなどの後続のデータフローは、ベクトル表現ではなく、生のテキスト文字列を操作することで完了します。新APIによるテキスト取り込みと全文検索の方法については以下のコード例を参照：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Sparse-BM25と</strong>呼ばれる、クエリとドキュメントをスパースベクトルとして表現するBM25関連性スコアリングの実装を採用しました。これにより、以下のようなスパースベクトルに基づく多くの最適化が可能になる：</p>
<p>Milvusは最先端の<strong>Sparse-BM25実装により</strong>、ベクトルデータベースアーキテクチャに全文検索を統合したハイブリッド検索機能を実現している。Sparse-BM25は、用語頻度を従来の転置インデックスではなくスパースベクトルとして表現することで、<strong>グラフインデックス</strong>、<strong>積量子化（PQ）</strong>、<strong>スカラー量子化（SQ</strong>）などの高度な最適化を可能にします。これらの最適化により、メモリ使用量を最小化し、検索性能を高速化する。転置インデックスアプローチと同様に、Milvusは生テキストを入力とし、内部でスパースベクトルを生成することをサポートしている。これにより、どのようなトークナイザでも動作し、ダイナミックに変化するコーパスに示されるどのような単語でも把握することができる。</p>
<p>さらに、ヒューリスティックに基づく刈り込みにより、低バリューのスパースベクトルを破棄することで、精度を落とすことなく効率をさらに向上させている。スパースベクトルを用いた従来のアプローチとは異なり、BM25のスコアリング精度ではなく、コーパスの成長に適応することができる。</p>
<ol>
<li>スパースベクトル上にグラフインデックスを構築することで、長いテキストを含むクエリでは転置インデックスよりも優れたパフォーマンスを発揮する；</li>
<li>ベクトル量子化やヒューリスティックに基づく刈り込みなど、検索品質にわずかな影響しか与えずに検索を高速化する近似技術の活用；</li>
<li>セマンティック検索と全文検索を実行するためのインターフェースとデータモデルを統一し、ユーザーエクスペリエンスを向上させる。</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>まとめると、Milvus 2.5は、全文検索を導入することで、セマンティック検索だけでなく検索機能を拡張し、ユーザーが高品質なAIアプリケーションを容易に構築できるようにした。これらは、Sparse-BM25検索の空間における初期ステップに過ぎず、今後、さらなる最適化手段が試されることが予想される。</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">テキストマッチ検索フィルター<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.5でリリースされた2つ目のテキスト検索機能は、特定の文字列を含むエントリーに検索をフィルタリングできる<strong>テキストマッチ</strong>である。この機能もトークン化に基づいて構築されており、<code translate="no">enable_match=True</code> で有効化される。</p>
<p>Text Matchでは、クエリーテキストの処理は、トークン化後のORのロジックに基づいていることは注目に値する。例えば、以下の例では、'vector' または 'database' のいずれかを含むすべての文書（'text' フィールドを使用）が結果として返されます。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>もし、'vector' と 'database' の両方をマッチさせる必要がある場合は、2つのテキストマッチを別々に記述し、ANDでオーバーレイする必要があります。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">スカラーフィルタリング性能の大幅な向上<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>スカラーフィルタリングの性能に重点を置いているのは、ベクトル検索とメタデータフィルタリングを組み合わせることで、様々なシナリオにおいてクエリの性能と精度を大幅に向上させることができるという発見に由来しています。これらのシナリオは、自律走行におけるコーナーケースの識別のような画像検索アプリケーションから、企業知識ベースにおける複雑なRAGシナリオまで多岐にわたる。このように、大規模なデータ・アプリケーション・シナリオに実装することは、企業ユーザーにとって非常に適している。</p>
<p>実際には、フィルタリングしているデータ量、データの編成方法、検索方法など、多くの要因がパフォーマンスに影響します。Milvus 2.5では、このような問題に対処するために、3つの新しいタイプのインデックス、BitMapインデックス、Array Invertedインデックス、Varcharテキストフィールドをトークン化した後のInvertedインデックスを導入しました。これらの新しいインデックスは、実際のユースケースにおいてパフォーマンスを大幅に向上させることができます。</p>
<p>具体的には</p>
<ol>
<li><strong>BitMap インデックスは</strong>、タグフィルタリング（一般的な演算子には in、array_contains などがある）を高速化するために使用でき、フィールドカテゴリデータ（データのカーディナリティ）が少ないシナリオに適している。その原理は、あるデータ行があるカラムに特定の値を持つかどうかを判断し、「はい」を1、「いいえ」を0として、BitMapリストを保持します。下図は、ある顧客のビジネス・シナリオに基づいて行ったパフォーマンス・テストの比較である。このシナリオでは、データ量は5億、データカテゴリーは20、異なる値は異なる分布割合（1％、5％、10％、50％）を持ち、異なるフィルタリング量の下でのパフォーマンスも異なります。50％のフィルタリングでは、BitMap Indexによって6.8倍の性能向上を達成できる。カーディナリティが大きくなると、BitMap Indexと比較して、Inverted Indexの方がバランスの取れた性能を示すことは注目に値する。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Matchは</strong>、テキストフィールドがトークン化された後のInverted Indexに基づいている。その性能は、2.4で提供したWildcard Match（つまり、like + %）関数をはるかに上回る。社内のテスト結果によると、Text Matchの利点は非常に明確で、特にコンカレントクエリーシナリオでは、最大400倍のQPS向上を達成することができます。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>JSONデータ処理に関しては、2.5.x以降のバージョンで、ユーザー指定のキーに対する転置インデックスの構築と、すべてのキーに対するデフォルトの位置情報の記録を導入し、構文解析を高速化する予定です。この両分野により、JSONとDynamic Fieldのクエリパフォーマンスが大幅に向上すると期待しています。今後のリリースノートやテクニカルブログでより多くの情報をご紹介する予定ですので、ご期待ください！</p>
<h2 id="New-Management-Interface" class="common-anchor-header">新しい管理インターフェース<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>データベースの管理にコンピューターサイエンスの学位は必要ありませんが、データベース管理者には強力なツールが必要です。そのため、<strong>クラスタ管理WebUIを</strong>導入しました。これは、クラスタのアドレスからポート9091/webuiでアクセスできる新しいWebベースのインターフェイスです。この監視ツールは以下を提供します：</p>
<ul>
<li>クラスタ全体のメトリクスを表示するリアルタイム監視ダッシュボード</li>
<li>ノードごとの詳細なメモリおよびパフォーマンス分析</li>
<li>セグメント情報とスロークエリのトラッキング</li>
<li>システムの健全性インジケータとノードのステータス</li>
<li>複雑なシステム問題のための使いやすいトラブルシューティングツール</li>
</ul>
<p>このインターフェースはまだベータ版ですが、データベース管理者からのユーザーフィードバックに基づいて積極的に開発を進めています。今後のアップデートでは、AIによる診断、よりインタラクティブな管理機能、クラスタ観測機能の強化を予定しています。</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">ドキュメンテーションと開発者エクスペリエンス<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusをより利用しやすくするために、<strong>ドキュメントと</strong> <strong>SDK/API</strong>エクスペリエンスを全面的に刷新しました。改善点は以下の通りです：</p>
<ul>
<li>基本的な概念から高度な概念への明確な進行を伴う再構築されたドキュメントシステム</li>
<li>実用的な実装を紹介するインタラクティブなチュートリアルと実例</li>
<li>実用的なコードサンプルを含む包括的なAPIリファレンス</li>
<li>一般的な操作を簡素化した、より使いやすいSDKデザイン</li>
<li>複雑な概念を理解しやすくする図解ガイド</li>
<li>AIを活用したドキュメントアシスタント（ASK AI）による迅速な回答</li>
</ul>
<p>アップデートされたSDK/APIは、より直感的なインターフェイスとドキュメントとのより良い統合を通じて、開発者のエクスペリエンスを向上させることに重点を置いています。私たちは、2.5.xシリーズで作業する際に、これらの改善に気づいていただけると信じています。</p>
<p>しかしながら、ドキュメントとSDKの開発は継続的なプロセスであることを私たちは知っています。私たちは、コミュニティからのフィードバックに基づいて、コンテンツ構造とSDK設計の両方を最適化し続けます。私たちのDiscordチャンネルに参加して、あなたの提案を共有し、さらなる改善にご協力ください。</p>
<h2 id="Summary" class="common-anchor-header"><strong>概要</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.5には13の新機能といくつかのシステムレベルの最適化が含まれており、これはMilvusだけでなくオープンソースコミュニティによって貢献されたものです。本記事ではそのうちのいくつかにしか触れていませんが、詳細については<a href="https://milvus.io/docs/release_notes.md">リリースノートや</a> <a href="https://milvus.io/docs">公式ドキュメントを</a>ご覧ください！</p>
