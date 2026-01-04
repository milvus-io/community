---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: Milvus2.6でフレーズマッチの精度が向上：フレーズレベルの全文検索精度を向上させる方法
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Milvus 2.6のPhrase
  Matchは、フレーズレベルの全文検索をスロープ付きでサポートし、より許容性の高いキーワードフィルタリングを可能にします。
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>非構造化データが爆発的に増え続け、AIモデルが賢くなり続ける中、ベクトル検索は多くのAIシステム-RAGパイプライン、AI検索、エージェント、レコメンデーション・エンジンなど-にとってデフォルトの検索レイヤーとなっている。ユーザーが入力した単語だけでなく、その背後にある意図など、意味を捉えることができるからだ。</p>
<p>しかし、これらのアプリケーションが本番稼動すると、チームはしばしば、意味理解が検索問題の一面に過ぎないことに気づく。多くのワークロードはまた、厳密なテキストルールに依存しています。例えば、正確な用語のマッチング、語順の保持、技術的、法的、または運用上の重要性を持つフレーズの識別などです。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.</a>6は、ベクトルデータベースに直接ネイティブな全文検索を導入することで、このような分岐を取り除きます。Milvusは、コアエンジンに組み込まれたトークンとポジションインデックスにより、正確なキーワードとフレーズレベルの制約を適用しながら、クエリの意味的意図を解釈することができます。その結果、意味と構造が別々のシステムに存在するのではなく、互いに補強し合う統合された検索パイプラインとなる。</p>
<p><a href="https://milvus.io/docs/phrase-match.md">フレーズマッチは</a>、このフルテキスト機能の重要な部分である。これは、ログパターン、エラーシグネチャ、製品名など、語順が意味を定義するあらゆるテキストを検出するために不可欠です。この投稿では、<a href="https://milvus.io/">Milvusにおける</a> <a href="https://milvus.io/docs/phrase-match.md">Phrase Matchの</a>仕組み、<code translate="no">slop</code> 、実世界のテキストに必要な柔軟性がどのように追加されるのか、そしてなぜこれらの機能により、単一のデータベース内でベクターとフルテキストのハイブリッド検索が可能になるだけでなく、実用的になるのかについて説明します。</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">フレーズマッチとは？<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase MatchはMilvusの全文検索クエリタイプの一つであり、<em>構造に</em>着目したクエリで<em>ある。</em>柔軟性がない場合、クエリは厳密に動作します。したがって、<strong>"robotics machine learning "の</strong>ようなクエリは、この3つの単語が連続したフレーズとして出現した場合にのみマッチする。</p>
<p>問題は、実際のテキストがこのようにきれいに動作することはほとんどないということだ。余計な形容詞が入り込んだり、ログがフィールドを並べ替えたり、商品名が修飾語になっていたり、人間の作者はクエリーエンジンを意識して書いたりはしない。厳密なフレーズマッチは簡単に壊れてしまう。単語が挿入されたり、言い換えられたり、用語が入れ替わったりすると、ミスマッチを引き起こす可能性がある。そして、多くのAIシステム、特に本番向けのシステムでは、関連するログ行やルールを引き起こすフレーズを見逃すことは許されない。</p>
<p>Milvus2.6はこの摩擦を<strong>スロップという</strong>シンプルなメカニズムで解決します。スロップとは、<em>クエリ</em>用語<em>間に許容されるゆとりの量を</em>定義するものである。フレーズをもろく柔軟性のないものとして扱う代わりに、スロップによって、1語余分に許容できるか、2語許容できるか、あるいはわずかな並び替えでもマッチとしてカウントするかどうかを決めることができます。これによって、フレーズ検索は合格・不合格の二者択一のテストから、コントロールされ、調整可能な検索ツールへと移行する。</p>
<p>なぜこれが重要なのかを知るために、おなじみのネットワークエラー<strong>"connection reset by peer "</strong>のすべてのバリエーションをログから検索することを想像してみてほしい。実際には、ログは次のようになるでしょう：</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>一見したところ、これらはすべて同じ根本的な事象を表している。しかし、一般的な検索方法では苦労します：</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25は構造と格闘している。</h3><p>BM25は、クエリをキーワードの袋として捉え、キーワードの出現順序を無視する。コネクション」と「ピア」がどこかに表示されている限り、BM25はドキュメントを上位にランク付けする可能性がある-たとえそのフレーズが逆であっても、実際に検索しているコンセプトと無関係であっても。</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">ベクトル検索は制約と格闘する。</h3><p>エンベッディングは意味や意味的関係を捉えることに優れていますが、"これらの単語はこの順序で現れなければならない "というようなルールを強制することはできません。意味的に関連するメッセージを検索しても、デバッグやコンプライアンスに必要な正確な構造パターンを見逃してしまうかもしれません。</p>
<p>フレーズ・マッチは、この2つのアプローチのギャップを埋める。<strong>スロップを</strong>使用することで、どの程度のばらつきを許容するかを正確に指定することができる：</p>
<ul>
<li><p><code translate="no">slop = 0</code> - 完全一致（すべての用語が連続し、順番に現れる必要があります。）</p></li>
<li><p><code translate="no">slop = 1</code> - 余分な単語を1つ許可する（挿入される単語が1つで、一般的な自然言語のバリエーションをカバーします。）</p></li>
<li><p><code translate="no">slop = 2</code> - 複数の単語の挿入を許可する（より説明的または冗長な表現に対応します。）</p></li>
<li><p><code translate="no">slop = 3</code> - 順序の入れ替えを許可する (実際のテキストで最も難しいケースである、順序が逆であったり緩やかであったりするフレーズをサポートする)</p></li>
</ul>
<p>採点アルゴリズムが「正しく」採点してくれることを期待するのではなく、アプリケーションが要求する構造的な許容範囲を明示的に宣言するのです。</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Milvusのフレーズマッチの仕組み<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>サーチエンジンライブラリを利用したMilvusのフレーズマッチは、位置情報を持つ転置インデックスの上に実装されています。用語が文書中に現れるかどうかだけをチェックするのではなく、用語が正しい順序で、制御可能な距離内に現れるかどうかを検証します。</p>
<p>下図はそのプロセスを示している：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.文書のトークン化（位置情報付き）</strong></p>
<p>Milvusに文書が挿入されると、テキストフィールドは<a href="https://milvus.io/docs/analyzer-overview.md">アナライザによって</a>処理され、<a href="https://milvus.io/docs/analyzer-overview.md">アナライザは</a>テキストをトークン（単語または用語）に分割し、文書内での各トークンの位置を記録する。例えば、<code translate="no">doc_1</code> は次のようにトークン化されます：<code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2.転置インデックスの作成</strong></p>
<p>次にMilvusは転置インデックスを作成する。転置インデックスでは、文書とその内容を対応付ける代わりに、各トークンをそれが出現する文書に対応付け、各文書内でのそのトークンのすべての位置を記録します。</p>
<p><strong>3.フレーズマッチング</strong></p>
<p>フレーズクエリが実行されると、Milvusはまず転置インデックスを用いて全てのクエリトークンを含む文書を特定する。次に、トークンの位置を比較することにより、各候補が正しい順序で、かつ、<code translate="no">slop</code> の許容距離内にあることを確認します。両方の条件を満たす文書のみがマッチとして返される。</p>
<p>下の図は、フレーズ一致がエンドツーエンドでどのように機能するかをまとめたものです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Milvusでフレーズ一致を有効にする方法<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>フレーズマッチは <strong><code translate="no">VARCHAR</code></strong>Milvusにおける文字列タイプです。これを使用するには、Milvusがテキスト分析を行い、フィールドの位置情報を保存するようにコレクションスキーマを設定する必要があります。これは、<code translate="no">enable_analyzer</code> と<code translate="no">enable_match</code> の2つのパラメータを有効にすることで行います。</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">enable_analyzerとenable_matchの設定</h3><p>特定のVARCHARフィールドのフレーズ・マッチを有効にするには、フィールド・スキーマを定義する際に両方のパラメータを<code translate="no">True</code> 。この2つのパラメータはMilvusに次のことを指示します：</p>
<ul>
<li><p>テキストを<strong>トークン化</strong>（<code translate="no">enable_analyzer</code> を使用）し</p></li>
<li><p><strong>位置オフセットによる転置インデックスの構築</strong>（<code translate="no">enable_match</code> 経由）。</p></li>
</ul>
<p>フレーズマッチはこの2つのステップに依存しており、アナライザーはテキストをトークンに分解し、マッチインデックスはそれらのトークンが出現する場所を保存することで、効率的なフレーズやスループベースのクエリを可能にします。</p>
<p>以下は、<code translate="no">text</code> フィールドでフレーズ一致を有効にするスキーマ設定の例です：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">フレーズ一致で検索：スロップが候補セットに与える影響<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>コレクション・スキーマでVARCHARフィールドのマッチを有効にすると、<code translate="no">PHRASE_MATCH</code> 式を使用してフレーズ・マッチを実行できます。</p>
<p>注：<code translate="no">PHRASE_MATCH</code> 式は大文字と小文字を区別しません。<code translate="no">PHRASE_MATCH</code> または<code translate="no">phrase_match</code> のいずれかを使用できます。</p>
<p>検索操作では、Phrase Matchは一般的にベクトル類似度ランキングの前に適用されます。これはまず、明示的なテキスト制約に基づいて文書をフィルタリングし、候補セットを絞り込みます。そして残った文書をベクトル埋め込みを使って再ランク付けする。</p>
<p>以下の例は、<code translate="no">slop</code> の値の違いがこのプロセスにどのような影響を与えるかを示しています。<code translate="no">slop</code> パラメータを調整することで、どの文書がフレーズフィルタを通過し、ベクトルランキングの段階に進むかを直接制御できます。</p>
<p>次の5つのエンティティを含む<code translate="no">tech_articles</code> という名前のコレクションがあるとします：</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>テキスト</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>機械学習が大規模データ分析の効率を高める</td></tr>
<tr><td>2</td><td>現代のAIの進歩には機械ベースのアプローチの学習が不可欠</td></tr>
<tr><td>3</td><td>計算負荷を最適化するディープラーニング・マシンアーキテクチャ</td></tr>
<tr><td>4</td><td>機械は、継続的な学習のためにモデルの性能を迅速に向上させる</td></tr>
<tr><td>5</td><td>高度な機械アルゴリズムの学習がAIの能力を拡張する</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>ここでは、"learning machine "という語句を含む文書に対して、若干の柔軟性を持たせてフィルタを適用する。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>マッチ結果</p>
<table>
<thead>
<tr><th>doc_id</th><th>テキスト</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>機械ベースのアプローチを学ぶことは、現代のAIの進歩に不可欠である</td></tr>
<tr><td>3</td><td>ディープラーニングマシンのアーキテクチャは計算負荷を最適化する</td></tr>
<tr><td>5</td><td>高度な機械アルゴリズムの学習がAIの能力を拡張する</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>この例では、"machine "と "learning "の間に最大2つの余分なトークン（または逆順の用語）が許容されることを意味する、2のスロープが許容されます。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>マッチ結果</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>テキスト</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">機械学習が大規模データ分析の効率を高める</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">ディープラーニングマシンのアーキテクチャが計算負荷を最適化</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>この例では、スロープを3にすることで、さらに柔軟性が増す。このフィルターでは、単語間のトークン位置を3つまで許容して、「機械学習」を検索する。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>一致した結果</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>テキスト</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">機械学習が大規模データ分析の効率を高める</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">現代のAIの進歩には機械ベースのアプローチの学習が不可欠</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">計算負荷を最適化するディープラーニング・マシンアーキテクチャ</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">高度な機械アルゴリズムの学習がAIの能力を拡張する</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">クイックヒントMilvusでフレーズマッチを有効にする前に知っておくべきこと<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Matchはフレーズレベルのフィルタリングをサポートしますが、有効にするにはクエリ時の設定だけではありません。本番環境で適用する前に、関連する考慮事項を知っておくと便利です。</p>
<ul>
<li><p>フィールドでPhrase Matchを有効にすると、逆インデックスが作成され、ストレージ使用量が増加します。正確なコストは、テキストの長さ、一意なトークンの数、アナライザーの設定などの要因に依存する。大きなテキストフィールドやカーディナリティの高いデータを扱う場合は、このオーバーヘッドを前もって考慮する必要があります。</p></li>
<li><p>アナライザーの構成も重要な設計上の選択です。いったんアナライザがコレクション・スキーマで定義されると、それを変更することはできません。後で別の分析器に切り替えるには、既存のコレクションを削除し、新しいスキーマで再作成する必要があります。このため、アナライザーの選択は実験的なものではなく、長期的な決定として扱う必要がある。</p></li>
<li><p>フレーズ一致の動作は、テキストがどのようにトークン化されるかと密接に関係している。コレクション全体にアナライザを適用する前に、<code translate="no">run_analyzer</code> メソッドを使用してトークン化の出力を検査し、期待するものと一致していることを確認することをお勧めします。このステップにより、微妙な不一致や予期しないクエリ結果を避けることができます。詳細については、<a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Analyzer Overviewを</a>参照してください。</p></li>
</ul>
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
    </button></h2><p>フレーズ一致は、単純なキーワード一致を超えるフレーズレベルと位置の制約を可能にする、コアな全文検索タイプです。トークンの順序と近接性に基づいて操作することで、用語が実際にテキストにどのように現れるかに基づいて文書をフィルタリングする、予測可能で正確な方法を提供します。</p>
<p>最新の検索システムでは、Phrase Matchはベクトルベースのランキングの前に適用されるのが一般的である。フレーズマッチは、まず候補集合を、必要なフレーズや構造を明示的に満たす文書に限定する。その後、ベクトル検索を使って、これらの結果を意味的関連性によってランク付けする。このパターンは、ログ解析、技術文書検索、RAGパイプラインなど、意味的類似性を考慮する前にテキスト的制約を強制しなければならないシナリオで特に効果的である。</p>
<p>Milvus 2.6で<code translate="no">slop</code> パラメータが導入されたことにより、Phrase Matchはフルテキストフィルタリングメカニズムとしての役割を維持しながら、自然言語のバリエーションに対してより寛容になりました。これにより、本番の検索ワークフローでフレーズレベルの制約を適用しやすくなりました。</p>
<p>👉<a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">デモ</a>スクリプトでお試しいただき、<a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6で</a>フレーズを意識した検索がどのようにお客様のスタックにフィットするかをご確認ください。</p>
<p>Milvusの最新機能についてのご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
