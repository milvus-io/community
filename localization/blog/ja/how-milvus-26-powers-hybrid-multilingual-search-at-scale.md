---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Milvus 2.6が多言語全文検索をスケールアップする方法
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: Milvus 2.6では、テキスト分析パイプラインが全面的に刷新され、全文検索のための包括的な多言語サポートが導入されました。
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>現代のAIアプリケーションはますます複雑になっている。ある問題に対して、ただ一つの検索方法を投げかけて終わりというわけにはいかない。</p>
<p>テキストや画像の意味を理解するための<strong>ベクトル検索</strong>、価格やカテゴリー、場所によって結果を絞り込むための<strong>メタデータフィルタリング</strong>、そして "Nike Air Max "のような直接的なクエリのための<strong>キーワード検索が</strong>必要だ。それぞれの方法は問題の異なる部分を解決するものであり、現実のシステムにはそれらすべてが連携する必要がある。</p>
<p>検索の未来は、ベクトルとキーワードのどちらかを選ぶことではない。ベクトル、キーワード、フィルタリング、そして他の検索タイプをすべて1つの場所で組み合わせることなのだ。だからこそ、私たちは1年前にMilvus 2.5をリリースし、Milvusに<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">ハイブリッド検索を</a>組み込み始めたのです。</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">しかし、フルテキスト検索は異なる働きをする<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターネイティブシステムに全文検索を導入するのは簡単ではありません。全文検索には独自の課題がある。</p>
<p>ベクトル検索がテキストの<em>意味的な</em>意味を捉え、高次元ベクトルに変換するのに対し、全文検索は<strong>言語の構造を</strong>理解することに依存する。つまり、単語がどのように形成され、どこで始まり、どこで終わるのか、そして単語同士がどのように関連しているのか、ということだ。例えば、ユーザーが英語で「ランニングシューズ」と検索すると、テキストはいくつかの処理ステップを経る：</p>
<p><em>空白で分割→小文字に→ストップワードを除去→&quot;running &quot;を &quot;run &quot;にステム。</em></p>
<p>これを正しく処理するには、分割、ステミング、フィルタリングなどを処理する、堅牢な<strong>言語解析</strong>器が必要です。</p>
<p>Milvus2.5で<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25全文検索を</a>導入した際、カスタマイズ可能なアナライザーを搭載しました。トークナイザー、トークン・フィルター、文字フィルターを使用してパイプラインを定義し、テキストをインデックス作成と検索に備えることができます。</p>
<p>英語の場合、この設定は比較的簡単だった。しかし、多言語を扱うとなると、事態はより複雑になる。</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">多言語全文検索の課題<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>多言語フルテキスト検索には、さまざまな課題がある：</p>
<ul>
<li><p><strong>複雑な言語は特別な扱いが必要です</strong>：中国語、日本語、韓国語などの言語では、単語と単語の間にスペースを使いません。これらの言語では、文字を意味のある単語に分割するための高度なトークナイザーが必要です。このようなツールは、単一言語ではうまく機能しても、複数の複雑な言語を同時にサポートすることはほとんどありません。</p></li>
<li><p><strong>似たような言語でも衝突することがある</strong>：英語とフランス語はどちらも単語を区切るのに空白を使うかもしれないが、ステミングやレマタイゼーションといった言語固有の処理を適用すると、一方の言語のルールが他方の言語のルールを妨害する可能性がある。英語のクエリの精度を向上させるものが、フランス語のクエリを歪めるかもしれません。</p></li>
</ul>
<p>要するに、<strong>言語が異なれば、異なる解析ツールが必要になる</strong>のです。英語のアナライザーで中国語のテキストを処理しようとすると、分割するスペースがなく、英語のステミングルールは中国語の文字を破損する可能性があります。</p>
<p>要するに多言語データセットを単一のトークナイザーとアナライザーに依存すると、すべての言語で一貫性のある高品質のトークン化を行うことはほぼ不可能になります。そしてそれは、検索パフォーマンスの低下に直結します。</p>
<p>Milvus 2.5で全文検索を採用し始めたチームから、同じようなフィードバックを聞くようになりました：</p>
<p><em>"英語での検索には最適ですが、多言語のカスタマーサポートチケットについてはどうでしょうか？""ベクトル検索とBM25検索の両方が使えるのは嬉しいが、我々のデータセットには中国語、日本語、英語のコンテンツが含まれている。""すべての言語で同じ検索精度を得ることができますか？"</em></p>
<p>これらの質問は、私たちがすでに実際に見てきたことを裏付けるものだった。意味的類似性は言語間でうまく機能しますが、正確なテキスト検索には各言語の構造を深く理解する必要があります。</p>
<p>そのため、<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6では</a>、包括的な多言語サポートを備えた、完全にオーバーホールされたテキスト分析パイプラインを導入しました。この新システムでは、各言語に適した解析ツールが自動的に適用されるため、手作業による設定や品質の低下を招くことなく、多言語データセットに対して正確でスケーラブルな全文検索が可能になります。</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">どのようにMilvus 2.6は、堅牢な多言語全文検索を可能にするか？<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>広範な研究と開発の結果、様々な多言語シナリオに対応する一連の機能を構築しました。それぞれのアプローチは、独自の方法で言語依存の問題を解決します。</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1.多言語アナライザー：コントロールによる精度</h3><p><a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Multi-Language Analyzerを</strong></a>使用すると、すべての言語を同じ分析パイプラインに強制的に通すのではなく、同じコレクション内で言語ごとに異なるテキスト処理ルールを定義できます。</p>
<p>言語固有のアナライザを設定し、挿入時に各文書にその言語のタグを付けます<strong>。</strong>BM25検索を実行する際、クエリ処理に使用する言語アナライザを指定します。これにより、インデックスされたコンテンツと検索クエリの両方が、それぞれの言語に最適なルールで処理されます。</p>
<p><strong>最適な用途</strong>コンテンツの言語を理解し、検索精度を最大限に高めたいアプリケーション。多国籍ナレッジベース、ローカライズされた製品カタログ、地域固有のコンテンツ管理システムなどが考えられます。</p>
<p><strong>要件</strong>各文書の言語メタデータを提供する必要があります。現在、BM25検索オペレーションでのみ利用可能。</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2.言語識別子トーケナイザー：自動言語検出</h3><p>すべてのコンテンツに手作業でタグ付けすることは、必ずしも現実的ではありません。<a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a>は、自動言語検出をテキスト分析パイプラインに直接取り込みます。</p>
<p><strong>その仕組みは次のとおりです：</strong>このインテリジェントなトークナイザーは、入力されたテキストを分析し、高度な検出アルゴリズムを使用して言語を検出し、適切な言語固有の処理ルールを自動的に適用します。サポートしたい言語ごとに1つ、さらにデフォルトのフォールバックアナライザを加えた複数のアナライザ定義で設定します。</p>
<p>検出エンジンは、高速処理の<code translate="no">whatlang</code> と高精度の<code translate="no">lingua</code> の2種類をサポートしています。システムは、選択した検出器に応じて、71～75の言語をサポートします。インデックス作成と検索の両方において、トークナイザーは検出された言語に基づいて適切なアナライザーを自動的に選択し、検出が不確かな場合はデフォルト設定にフォールバックします。</p>
<p><strong>次のような場合に最適です：</strong>予測不可能な言語の混在が発生するダイナミックな環境、ユーザー生成コンテンツ・プラットフォーム、手動での言語タグ付けが不可能なアプリケーション。</p>
<p><strong>トレードオフ：</strong>自動検出は処理待ち時間を増やし、非常に短いテキストや言語が混在するコンテンツでは苦労するかもしれません。しかし、ほとんどの実世界のアプリケーションでは、利便性がこれらの制限を大幅に上回ります。</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3.ICUトークナイザー：ユニバーサル・ファウンデーション</h3><p>最初の2つの選択肢がやり過ぎのように感じられるなら、もっとシンプルなものがあります。Milvus 2.6に<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU (International Components for Unicode)トークナイザーを</a>新たに統合しました。ICUの歴史は古く、多くの言語やスクリプトのテキスト処理を行う、成熟した広く使われているライブラリ群です。ICUの素晴らしいところは、複雑な言語から単純な言語まで一度に扱えることです。</p>
<p>ICUトークナイザーは、正直なところ、デフォルトの選択肢として最適です。単語の分割にUnicode標準のルールを使用しているため、独自の特殊なトークナイザを持たない数十の言語でも信頼できます。複数の言語でうまく動作する強力で汎用的なものが必要な場合は、ICUがその役割を果たします。</p>
<p><strong>制限</strong>ICUは単一のアナライザーで動作するため、すべての言語が同じフィルターを共有することになります。ステミングやレマタイゼーションのような言語固有の処理を行いたい場合は、ICUを使用してください。先ほどお話ししたような矛盾にぶつかります。</p>
<p><strong>ICUが本当に優れている点</strong>ICUは、多言語または言語識別セットアップのデフォルトアナライザーとして動作するように構築されています。基本的には、明示的に設定されていない言語を処理するための、インテリジェントなセーフティネットです。</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">動作を見る：ハンズオンデモ<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>理論はもう十分だ！ここでは、<strong>pymilvusの</strong>新しい多言語機能を使って、多言語検索コレクションを構築する方法を説明します。</p>
<p>再利用可能なアナライザーの設定を定義することから始め、<strong>2つの完全な例を通して</strong>説明します：</p>
<ul>
<li><p><strong>多言語アナライザーの</strong>使用</p></li>
<li><p><strong>言語識別トーケナイザーの</strong>使用</p></li>
</ul>
<p>👉 完全なデモコードについては、<a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">こちらのGitHubページを</a>ご覧ください。</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">ステップ1: Milvusクライアントのセットアップ</h3><p><em>まず、Milvusに接続し、コレクション名を設定し、既存のコレクションをクリーンアップして新しく始めます。</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">ステップ2: 複数言語のアナライザを定義する</h3><p>次に、言語固有の設定を持つ<code translate="no">analyzers</code> ディクショナリを定義します。これらは、後で示す両方の多言語検索方法で使用される。</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">オプションA：多言語アナライザの使用</h3><p>この方法は、<strong>各文書の言語を前もって知っている</strong>場合に最適である。データ挿入時に、その情報を専用の<code translate="no">language</code> フィールドに渡します。</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">多言語アナライザでコレクションを作成する</h4><p><code translate="no">language</code> フィールドの値に応じて、<code translate="no">&quot;text&quot;</code> フィールドが異なるアナライザを使用するコレクションを作成します。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">多言語データの挿入とコレクションのロード</h4><p>英語と日本語の文書を挿入します。<code translate="no">language</code> フィールドはmilvusにどのアナライザを使用するかを伝えます。</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">全文検索の実行</h4><p>検索するには、クエリの言語に基づいて、どのアナライザを使用するかを指定します。</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">結果</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">オプションB: 言語識別トーケナイザーの使用</h3><p>この方法では、手動による言語処理が不要になります。<strong>Language Identifier Tokenizerは</strong>、各文書の言語を自動的に検出し、適切なアナライザを適用します。<code translate="no">language</code> フィールドを指定する必要はありません。</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">言語識別トーケナイザでコレクションを作成する</h4><p>ここでは、<code translate="no">&quot;text&quot;</code> フィールドが自動言語検出を使用して正しいアナライザを選択するコレクションを作成します。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">データの挿入とコレクションのロード</h4><p>異なる言語のテキストを挿入します。Milvusは自動的に正しいアナライザーを検出し、適用します。</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">全文検索</h4><p>検索時に<strong>分析器を指定する必要はありません</strong>。トークナイザーが自動的に検索言語を検出し、適切なロジックを適用します。</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">検索結果</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Milvus2.6は、ベクトル検索とキーワード検索を組み合わせた<strong>ハイブリッド検索を</strong>より強力で利用しやすくするための大きな一歩を踏み出しました。強化された多言語サポートにより、どの言語を使用しているかに関わらず、<em>ユーザーの意味や</em> <em>発言を</em>理解するアプリを構築することができます。</p>
<p>しかし、これはアップデートの一部に過ぎません。Milvus 2.6では、検索をより速く、よりスマートに、より簡単にする他の機能もいくつか追加されました：</p>
<ul>
<li><p><strong>より良いクエリマッチング</strong>-<code translate="no">phrase_match</code> と<code translate="no">multi_match</code> を使用して、より正確な検索を行います。</p></li>
<li><p><strong>JSONフィルタリングの高速化</strong>- JSONフィールドのための新しい専用インデックスのおかげです。</p></li>
<li><p><strong>スカラーベースのソート</strong>- 任意の数値フィールドで結果をソートします。</p></li>
<li><p><strong>高度な再順位付け</strong>- モデルまたはカスタムスコアリングロジックを使用して結果を再順位付けします。</p></li>
</ul>
<p>Milvus2.6の詳細が知りたいですか？最新の投稿をご覧ください：<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus2.6のご紹介: 10億スケールでの手頃な価格のベクトル検索</strong></a><strong>.</strong></p>
<p>ご質問がある場合、またはどの機能についてのディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。</p>
