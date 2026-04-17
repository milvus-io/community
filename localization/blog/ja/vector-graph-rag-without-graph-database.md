---
id: vector-graph-rag-without-graph-database.md
title: グラフデータベースなしでグラフRAGを構築した
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  オープンソースのベクトルグラフRAGはmilvusだけを使ってRAGにマルチホップ推論を追加する。87.8%Recall@5、クエリあたり2LLMコール、グラフデータベース不要。
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>グラフRAGにグラフデータベースは必要か？Milvusにエンティティ、リレーション、パッセージを入れる。グラフ探索の代わりに部分グラフ展開を使い、複数ラウンドのエージェントループの代わりに1回のLLM再ランクを使う。これが</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>ベクトルグラフRAGで</em></strong></a> <em>あり、我々が構築したものである。このアプローチは3つのマルチホップQAベンチマークで87.8%の平均Recall@5を達成し、MilvusインスタンスではHippoRAG 2を上回った。</em></p>
</blockquote>
<p>マルチホップ問題は、ほとんどのRAGパイプラインが最終的にぶつかる壁です。答えはコーパスの中にあるのですが、問題では決して名指しされないエンティティによって接続された複数のパッセージにまたがっているのです。一般的な解決策はグラフデータベースを追加することですが、これは1つのシステムではなく2つのシステムを実行することを意味します。</p>
<p>私たち自身、この壁にぶつかり続け、それを処理するためだけに2つのデータベースを稼働させたくありませんでした。そこで私たちは、最も広く採用されているオープンソースのベクトルデータベースである<a href="https://milvus.io/docs">Milvusのみを</a>使用して、<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGに</a>マルチホップ推論をもたらすPythonライブラリである<a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAGを</a>構築し、オープンソース化しました。これは、2つのデータベースの代わりに1つのデータベースで同じマルチホップ機能を提供します。</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">なぜマルチホップ質問は標準RAGを壊すのか<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>マルチホップ質問は、ベクトル検索が見ることができないエンティティ関係に依存するため、標準的なRAGを破壊します。質問と答えをつなぐブリッジエンティティは、多くの場合、質問自体にありません。</p>
<p>単純な質問は問題なく機能します。文書をチャンクし、埋め込み、最も近い一致を検索し、LLMに送ります。「Milvusはどのようなインデックスをサポートしていますか？"は1つのパッセージにあり、ベクトル検索はそれを見つける。</p>
<p>マルチホップの質問はそのパターンに当てはまらない。医療知識ベースにおける<em>"第一選択薬の糖尿病薬で注意すべき副作用は？"の</em>ような質問を考えてみよう。</p>
<p>これに答えるには2つの推論ステップが必要である。まず、システムはメトホルミンが糖尿病の第一選択薬であることを知らなければならない。そうして初めて、メトホルミンの副作用（腎機能モニタリング、消化管不快感、ビタミンB12欠乏症）を調べることができる。</p>
<p>「メトホルミン」は橋渡し役である。メトホルミン」は、質問と答えをつなぎますが、質問ではメトホルミンについて言及されていません。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/learn/vector-similarity-search">ベクターの類似検索は</a>そこで止まる。質問のような文章、糖尿病治療ガイドや薬の副作用リストは検索されますが、それらの文章を結びつけるエンティティ関係を追うことはできません。メトホルミンは糖尿病の第一選択薬である」というような事実は、単一のパッセージのテキストではなく、それらの関係の中にあるのです。</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">グラフ・データベースとエージェント型RAGが解決策でない理由<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>マルチホップRAGを解決する標準的な方法は、グラフデータベースと反復エージェントループである。どちらも機能する。どちらも、多くのチームが一つの機能に支払いたがる以上のコストがかかる。</p>
<p>まず、グラフデータベースのルートを取る。ドキュメントからトリプルを抽出し、グラフデータベースに格納し、エッジをトラバースしてマルチホップ接続を見つける。これは、<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベースと</a>並行して第二のシステムを稼働させ、CypherやGremlinを学習し、グラフとベクトルストアを同期させ続けることを意味する。</p>
<p>反復エージェントループは、もう一つのアプローチである。LLMはバッチを取得し、それを推論し、十分なコンテキストがあるかどうかを判断し、なければ再度取得する。<a href="https://arxiv.org/abs/2212.10509">IRCoT</a>(Trivedi et al., 2023)は、クエリごとに3-5回のLLM呼び出しを行う。エージェントがいつ停止するかを決定するため、エージェントのRAGは10を超える可能性がある。クエリーあたりのコストは予測不可能になり、エージェントが余分なラウンドを実行するたびにP99のレイテンシが急増する。</p>
<p>どちらも、スタックを再構築することなくマルチホップ推論をしたいチームには合わない。そこで私たちは別の方法を試した。</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">ベクターデータベース内のグラフ構造、ベクターグラフRAGとは？<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAGは</strong></a>オープンソースのPythonライブラリで、<a href="https://milvus.io/docs">milvusだけを使って</a> <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGに</a>マルチホップ推論をもたらします。3つのMilvusコレクションにまたがるID参照としてグラフ構造を保存する。トラバーサルは、グラフデータベースに対するCypherクエリの代わりに、Milvusのプライマリキールックアップのチェーンになります。1つのMilvusが両方の仕事をこなす。</p>
<p>ナレッジグラフのリレーションシップは単なるテキストである。トリプル<em>（メトホルミンは2型糖尿病の第一選択薬である</em>）は、グラフデータベースにおける有向エッジである。これは文章でもある：「メトホルミンは2型糖尿病の第一選択薬である。この文章をベクトルとして<a href="https://milvus.io/docs">milvusに</a>埋め込むことができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>マルチホップのクエリに答えるということは、クエリが言及しているもの（「糖尿病」のような）から言及していないもの（「メトホルミン」のような）までのつながりをたどることを意味する。それは、どのエンティティがどの関係を通じてどのエンティティに接続しているかというつながりをストレージが保持している場合にのみ機能する。プレーンテキストは検索可能だが、追跡可能ではない。</p>
<p>Milvusでは、つながりを保持するために、各エンティティと各関係に一意なIDを与え、IDによってお互いを参照する別々のコレクションに格納します。<strong>エンティティ</strong>（ノード）、<strong>リレーション</strong>（エッジ）、<strong>パッセージ</strong>（LLMが回答生成に必要とする原文）の合計3つのコレクションである。すべての行にベクトル埋め込みがあるため、3つのいずれかをセマンティック検索できる。</p>
<p><strong>エンティティは</strong>、重複排除されたエンティティを格納する。各エンティティは、一意のID、<a href="https://zilliz.com/glossary/semantic-search">意味検索の</a>ための<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込み</a>、参加する関係IDのリストを持つ。</p>
<table>
<thead>
<tr><th>ID</th><th>名前</th><th>埋め込み</th><th>リレーションID</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>メトホルミン</td><td>[0.12, ...]</td><td>[r01, r02, r03］</td></tr>
<tr><td>e02</td><td>2型糖尿病</td><td>[0.34, ...]</td><td>[R01, R04］</td></tr>
<tr><td>e03</td><td>腎機能</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>リレーションは</strong>知識トリプルを格納する。それぞれ、主語と目的語のエンティティID、出典のパッセージID、関係テキスト全文の埋め込みが記録されます。</p>
<table>
<thead>
<tr><th>ID</th><th>サブジェクトID</th><th>オブジェクトID</th><th>テキスト</th><th>埋め込み</th><th>パッセージID</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>メトホルミンは2型糖尿病の第一選択薬である</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>メトホルミン投与中の患者は腎機能をモニターすべきである</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Passagesは</strong>、そこから抽出されたエンティティと関係への参照とともに、元のドキュメントチャンクを格納する。</p>
<p>エンティティはその関係のIDを持ち、関係はその主語と目的語のエンティティのIDとソースのパッセージを持ち、パッセージはそこから抽出されたすべてのもののIDを持つ。このID参照のネットワークがグラフである。</p>
<p>トラバーサルはIDルックアップの連鎖にすぎない。エンティティe01をフェッチしてその<code translate="no">relation_ids</code> 、それらのIDで関係r01とr02をフェッチし、r01の<code translate="no">object_id</code> を読んでエンティティe02を発見し、それを続ける。各ホップは標準的なmilvus<a href="https://milvus.io/docs/get-and-scalar-query.md">プライマリ・キー・クエリー</a>である。Cypherは必要ない。</p>
<p>Milvusへの余計な往復が増えるのではないかと思うかもしれない。しかし、そんなことはない。サブグラフの展開にはIDベースのクエリーが2-3回、合計20-30msかかる。LLMコールは1-3秒かかり、IDルックアップはその次に見えなくなる。</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">ベクトルグラフRAGがマルチホップのクエリーに答える方法<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>検索フローは、<strong>シード検索→サブグラフ展開→LLM再ランク→アンサー生成という</strong>4つのステップで、マルチホップ・クエリーを地に足のついたアンサーへと導く。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>糖尿病の質問について説明する：<em>"第一選択薬の糖尿病薬で注意すべき副作用は？"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">ステップ1：シードの検索</h3><p>LLMは質問からキーエンティティを抽出します："糖尿病"、"副作用"、"第一選択薬"。Milvusのベクトル検索は、最も関連性の高いエンティティと関係を直接見つける。</p>
<p>しかし、メトホルミンはその中にない。質問には言及されていないので、ベクトル検索はそれを見つけることができない。</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">ステップ2：部分グラフの展開</h3><p>ベクトルグラフRAGが標準的なRAGと異なるのはここである。</p>
<p>システムはシードエンティティから1ホップ先のIDリファレンスを追跡する。シードエンティティのIDを取得し、それらのIDを含むすべての関係を見つけ、新しいエンティティIDをサブグラフに引き込む。デフォルト：1ホップ。</p>
<p><strong>ブリッジ・エンティティであるMetforminがサブグラフに入ります。</strong></p>
<p>"Diabetes "は関係を持っています：<em>「Metforminは、2型糖尿病の第一選択薬です。</em>このエッジをたどるとメトホルミンが入る。メトホルミンがサブグラフに入ると、メトホルミン自身の関係もついてくる：<em>"メトホルミン服用患者は腎機能をモニターすべきである"、"メトホルミンは胃腸の不快感を引き起こすかもしれない"、"メトホルミンの長期服用はビタミンB12の欠乏を引き起こすかもしれない"。</em></p>
<p>別々の通路にあった2つの事実が、グラフ展開の1ホップを通してつながった。問題が言及しなかったブリッジエンティティが発見可能になった。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">ステップ3：LLM再ランク</h3><p>拡張により、何十もの関係候補が残ります。ほとんどはノイズである。</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>システムはこれらの候補と元の質問をLLMに送ります。これは反復なしの1回の呼び出しである。</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>選択された関係は、糖尿病→メトホルミン→腎臓のモニタリング/胃腸の不快感/B12欠乏症という連鎖を完全にカバーする。</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">ステップ4：答えの生成</h3><p>システムは選択された関係の原文を検索し、LLMに送る。</p>
<p>LLMはトリミングされたトリプルではなく、全パッセージテキストから生成する。トリプルは圧縮された要約である。LLMが根拠のある答えを生成するために必要な文脈、注意点、詳細が欠けています。</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">ベクトルグラフRAGの動作を見る</h3><p>各ステップを視覚化するインタラクティブなフロントエンドも構築しました。左側のステップパネルをクリックすると、グラフがリアルタイムで更新されます：オレンジはシードノード、青は展開されたノード、緑は選択された関係です。検索フローが抽象的ではなく具体的になります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">1回の再ランクが複数の反復に勝る理由<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>我々のパイプラインは、クエリごとに2回のLLM呼び出しを行う。IRCoTやAgentic RAGのような反復システムは、検索、理由付け、再検索というループを行うため、3回から10回以上の呼び出しを行う。ベクトル検索とサブグラフ展開は、意味的類似性と構造的接続の両方を1回のパスでカバーし、LLMに1回の再ランクで終了するのに十分な候補を与えるので、我々はループをスキップする。</p>
<table>
<thead>
<tr><th>アプローチ</th><th>クエリごとのLLM呼び出し</th><th>レイテンシプロファイル</th><th>相対APIコスト</th></tr>
</thead>
<tbody>
<tr><td>ベクトルグラフRAG</td><td>2（再ランク＋生成）</td><td>固定、予測可能</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>可変</td><td>~2-3x</td></tr>
<tr><td>エージェント型RAG</td><td>5-10+</td><td>予測不可能</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>本番では、APIコストはおよそ60％削減され、レスポンスは2-3倍速く、レイテンシは予測可能です。エージェントが余分なラウンドを実行することを決定したときに、驚きのスパイクはありません。</p>
<h2 id="Benchmark-Results" class="common-anchor-header">ベンチマーク結果<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAGは、3つの標準的なマルチホップQAベンチマークで平均87.8%のRecall@5を達成し、Milvusと2つのLLMコールだけで、HippoRAG 2を含むテストした全てのメソッドに匹敵するか、それを上回った。</p>
<p>MuSiQue（2-4ホップ、最も難しい）、HotpotQA（2ホップ、最も広く使われている）、2WikiMultiHopQA（2ホップ、クロス・ドキュメント推論）で評価した。指標はRecall@5：検索された結果の上位5位に正しいサポート文章が表示されるかどうかである。</p>
<p>公正な比較のために、<a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG リポジトリから</a>全く同じ抽出済みトリプルを使用した。再抽出もカスタム前処理も行っていない。この比較では、検索アルゴリズム自体を分離しています。</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">ベクトルグラフRAGと</a>標準（ナイーブ）RAGの比較</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAGは平均Recall@5を73.4%から87.8%に引き上げ、19.6%ポイントの改善。</p>
<ul>
<li>MuSiQue：最大の改善（+31.4pp）。3-4ホップベンチマーク、最も難しいマルチホップ問題で、まさにサブグラフの拡張が最も大きな影響を与えるところです。</li>
<li>2WikiMultiHopQA：急激な向上（+27.7pp）。クロスドキュメントの推論で、これもサブグラフ拡張のスイートスポット。</li>
<li>HotpotQA: 改善幅は小さいが（+6.1pp）、標準的なRAGはこのデータセットですでに90.8%のスコア。上限は低い。</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">ベクトルグラフRAGと</a>最新手法（SOTA）の比較</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAGは、HippoRAG 2、IRCoT、NV-Embed-v2に対して87.8%という最高の平均スコアを獲得した。</p>
<p>ベンチマーク別</p>
<ul>
<li>HotpotQA：HippoRAG2と同点（ともに96.3）</li>
<li>2WikiMultiHopQA：3.7ポイント差でリード（94.1％対90.4）</li>
<li>MuSiQue（最も難しい）：1.7ポイント差（73.0％対74.7）</li>
</ul>
<p>Vector Graph RAGは、クエリーあたり2回のLLMコールのみ、グラフデータベースなし、ColBERTv2なしでこの数字を達成している。比較の中で最もシンプルなインフラで実行され、なおかつ最も高い平均値を取っている。</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">ベクトルグラフRAGと</a>他のグラフRAGアプローチとの比較<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>異なるグラフRAGアプローチは、異なる問題に対して最適化される。Vector Graph RAGは、予測可能なコストとシンプルなインフラストラクチャで、プロダクション・マルチホップQA用に構築されている。</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / エージェントRAG</th><th><strong>ベクトルグラフRAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>インフラ</strong></td><td>グラフDB＋ベクトルDB</td><td>ColBERTv2 + インメモリグラフ</td><td>ベクトルDB＋マルチラウンドエージェント</td><td><strong>milvusのみ</strong></td></tr>
<tr><td><strong>クエリあたりのLLMコール数</strong></td><td>変動</td><td>中程度</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>最適</strong></td><td>グローバルなコーパスの要約</td><td>きめ細かな学術検索</td><td>複雑でオープンエンドな検索</td><td><strong>プロダクションマルチホップQA</strong></td></tr>
<tr><td><strong>スケーリングの懸念</strong></td><td>高価なLLMインデックス作成</td><td>メモリ内のフルグラフ</td><td>予測不可能なレイテンシとコスト</td><td><strong>Milvusでスケーリング可能</strong></td></tr>
<tr><td><strong>セットアップの複雑さ</strong></td><td>高</td><td>中-高</td><td>中</td><td><strong>低 (pipインストール)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAGは</a>、階層的コミュニティクラスタリングを使って、"このコーパスの主なテーマは何か？"といったグローバルな要約の質問に答える。これはマルチホップQAとは異なる問題だ。&quot;</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a>(Gutierrez et al., 2025)は、ColBERTv2のトークンレベルのマッチングで、認知にヒントを得た検索を行う。完全なグラフをメモリにロードすることは、スケーラビリティを制限する。</p>
<p><a href="https://arxiv.org/abs/2212.10509">IRCoTの</a>ような反復的アプローチは、LLMコストと予測不可能なレイテンシとインフラの単純さをトレードする。</p>
<p>Vector Graph RAGは、プロダクション・マルチホップQA：グラフ・データベースを追加することなく、予測可能なコストとレイテンシーを求めるチームをターゲットにしています。</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Vector Graph RAGの使用時期と主な使用例<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAGは4種類のワークロード向けに構築されています：</p>
<table>
<thead>
<tr><th>シナリオ</th><th>適合する理由</th></tr>
</thead>
<tbody>
<tr><td><strong>知識密度の高いドキュメント</strong></td><td>相互参照を含む法律コード、薬剤-遺伝子-疾患チェーンを含む生物医学文献、会社-人-イベントリンクを含む財務報告書、API依存性グラフを含む技術文書</td></tr>
<tr><td><strong>2-4ホップの質問</strong></td><td>1ホップの質問は標準的なRAGでうまく機能します。5ホップ以上は反復的な方法が必要かもしれません。2-4ホップの範囲は、サブグラフ展開のスイートスポットです。</td></tr>
<tr><td><strong>シンプルなデプロイメント</strong></td><td>1つのデータベース、1つの<code translate="no">pip install</code> 、学習するグラフ・インフラなし</td></tr>
<tr><td><strong>コストとレイテンシに敏感</strong></td><td>クエリ毎に2回のLLMコール。毎日のクエリが数千回になると、その差は大きくなります。</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">ベクターグラフRAGを始める<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> 引数なしの場合、デフォルトは<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteに</a>なる。SQLiteのようにローカルの<code translate="no">.db</code> 。起動するサーバーも設定するものもない。</p>
<p><code translate="no">add_texts()</code> <code translate="no">query()</code> 、seed、expand、rerank、generateの4ステップの検索フローを実行する。</p>
<p>本番では、URIパラメータを1つ入れ替える。残りのコードは同じままである：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>PDF、ウェブページ、Wordファイルをインポートする：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>グラフRAGはグラフ・データベースを必要としない。Vector Graph RAGはグラフ構造を3つのMilvusコレクションにまたがるID参照として保存し、グラフのトラバーサルをプライマリキーのルックアップに変え、すべてのマルチホップクエリを固定2回のLLM呼び出しに抑える。</p>
<p>概要</p>
<ul>
<li>オープンソースのPythonライブラリ。Milvus単独でのマルチホップ推論。</li>
<li>IDでリンクされた3つのコレクション。エンティティ（ノード）、関係（エッジ）、パッセージ（ソーステキスト）。クエリが言及していないブリッジエンティティを発見するためにIDを追跡するサブグラフ展開。</li>
<li>クエリごとに2回のLLM呼び出し。1回の再ランク、1回の生成。反復なし。</li>
<li>MuSiQue、HotpotQA、2WikiMultiHopQAの平均Recall@5で87.8%、3つのうち2つでHippoRAG 2に匹敵、もしくは勝っている。</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">お試しあれ：</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a>コードはこちら。</li>
<li>完全なAPIと例の<a href="https://zilliztech.github.io/vector-graph-rag">ドキュメント</a></li>
<li><a href="https://slack.milvus.io/">Discordの</a> <a href="https://slack.milvus.io/">milvus</a> <a href="https://discord.com/invite/8uyFbECzPX">コミュニティに</a>参加して、質問やフィードバックを共有しましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワーを予約</a>し、あなたのユースケースについて説明しましょう<a href="https://milvus.io/office-hours">。</a></li>
<li>インフラストラクチャのセットアップを省略したい場合、<a href="https://cloud.zilliz.com/signup">Zilliz Cloudは</a>マネージドMilvusの無料ティアを提供しています。</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">よくある質問<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">ベクターデータベースだけでGraph RAGはできますか？</h3><p>はい。Vector Graph RAGは、ナレッジグラフ構造（エンティティ、関係、およびそれらの接続）をID相互参照によってリンクされた3つのMilvusコレクション内に保存します。グラフデータベースのエッジをトラバースする代わりに、Milvusの一次キー検索を連鎖させ、シードエンティティを中心としたサブグラフを展開する。これにより、グラフデータベースのインフラなしで、3つの標準的なマルチホップベンチマークで87.8%の平均Recall@5を達成した。</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Vector Graph RAGとMicrosoft GraphRAGの比較は？</h3><p>両者は異なる問題を解決する。Microsoft GraphRAGは、グローバルなコーパスの要約（「これらの文書全体の主要テーマは何か」）のために階層的コミュニティ・クラスタリングを使用する。Vector Graph RAGは、マルチホップ質問応答、つまり、文章中の特定の事実を連鎖させることに重点を置いている。Vector Graph RAGはMilvusと2回のLLMコールを必要とする。Microsoft GraphRAGはグラフデータベースを必要とし、高いインデックス作成コストがかかる。</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">マルチホップRAGはどのようなタイプの問題に有効ですか？</h3><p>マルチホップRAGは、特にキーとなるエンティティが質問に登場しないような、答えが複数のパッセージに散在する情報の接続に依存するような質問に役立ちます。例として、"糖尿病の第一選択薬にはどのような副作用がありますか? "があります。(ブリッジとしてメトホルミンを発見する必要がある）、法律や規制の文章での相互参照検索、技術文書での依存関係の連鎖のトレースなどです。標準的なRAGは、シングルファクトルックアップをうまく処理します。マルチホップRAGは、推論パスが2～4ステップの長さになる場合に付加価値を与えます。</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">ナレッジグラフのトリプルを手動で抽出する必要がありますか？</h3><p><code translate="no">add_texts()</code> と<code translate="no">add_documents()</code> は自動的にLLMを呼び出し、エンティティとリレーションシップを抽出し、ベクトル化し、milvusに保存します。組み込みの<code translate="no">DocumentImporter</code> を使用して、URL、PDF、DOCX ファイルからドキュメントをインポートできます。ベンチマークや移行のために、ライブラリはHippoRAGのような他のフレームワークから事前に抽出されたトリプルのインポートをサポートしています。</p>
