---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: ナイーブRAGを超える：クエリルーティングとハイブリッド検索でよりスマートなシステムを構築する
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_new_565494b6a6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: 最新のRAGシステムがどのようにクエリルーティング、ハイブリッド検索、ステージごとの評価を使用し、より良い回答をより低コストで提供するかを学びます。
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>パイプラインは、検索が必要かどうかにかかわらず、すべてのクエリに対して文書を検索します。コード、自然言語、財務報告書に対して同じ類似検索を実行する。そして、結果が悪いとき、どのステージが壊れたのかを見分ける方法がない。</p>
<p>これらは素朴なRAGの症状であり、どのクエリも同じように扱う固定されたパイプラインである。最新のRAGシステムは違う。適切なハンドラーにクエリをルーティングし、複数の検索方法を組み合わせ、各ステージを独立して評価する。</p>
<p>この記事では、よりスマートなRAGシステムを構築するための4つのノードアーキテクチャを説明し、個別のインデックスを維持することなく<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">ハイブリッド検索を</a>実装する方法を説明し、問題をより速くデバッグできるように各パイプラインステージを評価する方法を示す。</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">ロング・コンテキストがRAGの代わりにならない理由<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>128K以上のトークンウィンドウをサポートするようになった現在、「プロンプトにすべてを入れる」というのはよくある提案だ。これは、2つの理由から、本番では通用しない。</p>
<p><strong>コストは、クエリではなく、ナレッジベースとともにスケールする。</strong>すべてのリクエストはモデルを通して知識ベースをすべて送信します。10万トークンのコーパスの場合、答えが1段落を必要とするか10段落を必要とするかに関係なく、リクエストごとに10万トークンの入力になります。毎月の推論コストはコーパスのサイズに比例して増加する。</p>
<p><strong>注意力は文脈の長さとともに低下する。</strong>モデルは長い文脈に埋もれた関連情報に集中するのに苦労する。途中を見失う」効果に関する研究（Liu et al.コンテキストウィンドウを大きくしても、この問題は解決されない-注意の質はウィンドウサイズに追いついていない。</p>
<p>RAGは、生成前に関連する文章のみを検索することで、この2つの問題を回避している。問題はRAGが必要かどうかではなく、実際に機能するRAGをどのように構築するかである。</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">従来のRAGの何が問題なのか？<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のRAGは固定されたパイプラインに従っている：クエリを埋め込む、<a href="https://zilliz.com/learn/what-is-vector-search">ベクトル類似検索を</a>実行する、トップKの結果を取る、答えを生成する。どのクエリも同じ経路をたどります。</p>
<p>これは2つの問題を引き起こす：</p>
<ol>
<li><p><strong>些細なクエリに対する無駄な計算。</strong>"2＋2は何ですか？"は検索する必要はないが、システムはとにかくそれを実行する。</p></li>
<li><p><strong>複雑なクエリに対する検索のもろさ。</strong>曖昧な言い回し、同義語、混在言語のクエリは、純粋なベクトル類似性を打ち負かすことが多い。検索が関連文書を見逃すと、フォールバックがないため、生成品質が低下する。</p></li>
</ol>
<p>解決策：検索の前に意思決定を加える。最新のRAGシステムは、毎回同じパイプラインをやみくもに実行するのではなく、検索<em>するかどうか</em>、<em>何を</em>検索するか、<em>どのように</em>検索するかを決定する。</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">最新のRAGシステムの仕組み4ノード・アーキテクチャ<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最新のRAGシステムは、固定パイプラインの代わりに、各クエリを4つの決定ノードにルーティングします。各ノードは現在のクエリをどのように処理するかについて1つの質問に答える。</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">ノード1：クエリルーティング - このクエリは検索が必要か？</h3><p>クエリルーティングはパイプラインの最初の決定である。入力されたクエリを分類し、適切なパスに送ります：</p>
<table>
<thead>
<tr><th>クエリタイプ</th><th>例</th><th>アクション</th></tr>
</thead>
<tbody>
<tr><td>常識/一般知識</td><td>"2＋2は何ですか？"</td><td>LLM-スキップ検索で直接回答</td></tr>
<tr><td>知識ベースの質問</td><td>"モデルXのスペックは？"</td><td>検索パイプラインへのルート</td></tr>
<tr><td>リアルタイム情報</td><td>「今週末のパリの天気</td><td>外部APIを呼び出す</td></tr>
</tbody>
</table>
<p>前もってルーティングすることで、必要のないクエリに対する不必要な検索を避けることができる。単純なクエリや一般的なクエリが多いシステムでは、これだけで計算コストを大幅に削減することができる。</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">ノード2：クエリ書き換え-システムは何を検索すべきか？</h3><p>ユーザーのクエリは漠然としていることが多い。LightOnのQ3レポートの主な数字」のような質問は、検索クエリにうまく変換されません。</p>
<p>クエリ書き換えは、元の質問を構造化された検索条件に変換します：</p>
<ul>
<li><strong>時間範囲：</strong>2025年7月1日～9月30日（第3四半期）</li>
<li><strong>ドキュメントのタイプ</strong>財務報告書</li>
<li><strong>エンティティ</strong>ライトオン、財務部</li>
</ul>
<p>このステップは、ユーザーの質問方法と検索システムが文書にインデックスを付ける方法のギャップを埋めるものです。より良いクエリーは、無関係な結果を少なくする。</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">ノード3：検索戦略の選択 - システムはどのように検索すべきか？</h3><p>異なるコンテンツタイプには、異なる検索戦略が必要である。単一の方法ですべてをカバーすることはできない：</p>
<table>
<thead>
<tr><th>コンテンツタイプ</th><th>最適な検索方法</th><th>なぜ</th></tr>
</thead>
<tbody>
<tr><td>コード（変数名、関数シグネチャ）</td><td>レキシカル検索<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">（BM25）</a></td><td>厳密なキーワードマッチは構造化トークンに有効</td></tr>
<tr><td>自然言語（ドキュメント、記事）</td><td>意味検索（密なベクトル）</td><td>同義語、言い換え、意図を扱う</td></tr>
<tr><td>マルチモーダル（チャート、ダイアグラム、ドローイング）</td><td>マルチモーダル検索</td><td>テキスト抽出が見逃す視覚的構造を捕捉</td></tr>
</tbody>
</table>
<p>ドキュメントはインデックス作成時にメタデータでタグ付けされる。クエリ時には、これらのタグが、どの文書を検索するか、どの検索方法を使うかの指針となる。</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">ノード4：最小コンテキストの生成 - モデルが必要とするコンテキストの量は？</h3><p>検索と<a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">再ランク付けの</a>後、システムは文書全体ではなく、最も関連性の高い文章だけをモデルに送る。</p>
<p>これは想像以上に重要である。文書全体を読み込む場合と比較して、関連性の高い文章のみをモデルに送信することで、トークンの使用量を90%以上削減することができます。トークン数が少なければ、キャッシングが有効な場合でも、レスポンスが速くなり、コストも削減できます。</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">ハイブリッド検索がエンタープライズRAGに重要な理由<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>実際には、検索戦略の選択（ノード3）は、ほとんどのチームが行き詰まるところです。単一の検索手法ですべての企業文書の種類をカバーできるわけではありません。</p>
<p>キーワード検索で十分だと主張する人もいる-結局のところ、Claude Codeのgrepベースのコード検索はうまく機能している。しかし、コードは高度に構造化されており、一貫した命名規則がある。エンタープライズ・ドキュメントは別の話だ。</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">エンタープライズ・ドキュメントは雑然としている</h3><p><strong>同義語と多様な言い回し。</strong>「メモリ使用量を最適化する」と「メモリフットプリントを削減する」は同じ意味だが、異なる言葉を使っている。キーワード検索は一方にマッチし、もう一方を見逃す。多言語環境-単語のセグメンテーションがある中国語、スクリプトが混在する日本語、複合語があるドイツ語-では、問題は倍増する。</p>
<p><strong>視覚的構造は重要である。</strong>エンジニアリングの図面はレイアウトに依存する。財務報告書は表に依存する。医療画像は空間的関係に依存する。OCRはテキストを抽出するが、構造を失う。テキストのみの検索では、これらの文書を確実に扱うことはできない。</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">ハイブリッド検索の実装方法</h3><p>ハイブリッド検索は、複数の検索方法-通常は<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">キーワードマッチングのためのBM25と意味検索のための密なベクトル</a>-を組み合わせ<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">、</a>どちらの方法も単独では扱えないものをカバーする。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>従来のアプローチでは、BM25とベクトル検索の2つの別々のシステムを実行していた。それぞれのクエリは両方にヒットし、結果は後でマージされる。これは機能するが、実際のオーバーヘッドを伴う：</p>
<table>
<thead>
<tr><th></th><th>従来の（別々のシステム）</th><th>ユニファイド（単一コレクション）</th></tr>
</thead>
<tbody>
<tr><td>ストレージ</td><td>2つの別々のインデックス</td><td>1つのコレクション、両方のベクトルタイプ</td></tr>
<tr><td>データ同期</td><td>2つのシステムを同期させる必要がある</td><td>単一の書き込みパス</td></tr>
<tr><td>クエリーパス</td><td>2つのクエリ＋結果のマージ</td><td>1回のAPIコールで自動フュージョン</td></tr>
<tr><td>チューニング</td><td>システム間でマージウェイトを調整</td><td>1つのクエリで密/疎の重みを変更</td></tr>
<tr><td>操作の複雑さ</td><td>高い</td><td>低い</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a>2.6では、同じコレクション内で密なベクトル（セマンティック検索用）と疎なベクトル（BM25スタイルのキーワード検索用）の両方をサポートしています。1回のAPI呼び出しで、ベクトルタイプ間の重みを変更することで検索動作を調整しながら、融合された結果を返します。別々のインデックス、同期の問題、マージの待ち時間はありません。</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">RAGパイプラインをステージごとに評価する方法<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>最終的な答えだけをチェックするだけでは十分ではありません。RAGは多段階のパイプラインであり、どの段階でも失敗は下流に伝播する。回答品質だけを測定しても、問題がルーティングにあるのか、書き換えにあるのか、検索にあるのか、リランキングにあるのか、あるいは生成にあるのかがわかりません。</p>
<p>ユーザーが「不正確な結果」を報告した場合、その根本的な原因はどこにある可能性があります。ルーティングでは検索をスキップすべきではない場合、クエリの書き換えでは重要なエンティティを削除する場合、検索では関連文書を見逃す場合、リランキングでは良い結果が埋もれてしまう場合、モデルでは検索されたコンテキストを完全に無視する場合などが考えられます。</p>
<p>各ステージを独自のメトリクスで評価する：</p>
<table>
<thead>
<tr><th>ステージ</th><th>メトリクス</th><th>何をキャッチするか</th></tr>
</thead>
<tbody>
<tr><td>ルーティング</td><td>F1スコア</td><td>高い偽陰性率 = 検索が必要なクエリがスキップされる</td></tr>
<tr><td>クエリ書き換え</td><td>エンティティ抽出精度、同義語カバー率</td><td>クエリの書き換えにより、重要な用語が削除されるか、意図が変更される</td></tr>
<tr><td>検索</td><td>リコール@K、NDCG@10</td><td>関連文書が検索されないか、順位が低すぎる</td></tr>
<tr><td>再ランク付け</td><td>精度@3</td><td>上位の結果は実際には関連性がない</td></tr>
<tr><td>生成</td><td>忠実性、回答の完全性</td><td>モデルは検索されたコンテキストを無視するか、部分的な回答を与える</td></tr>
</tbody>
</table>
<p><strong>レイヤーモニタリングを設定する。</strong>オフラインテストセットを使用して、各ステージのベースライン指標範囲を定義する。本番環境では、いずれかのステージがベースラインを下回ったときにアラートをトリガーする。これにより、リグレッションを早期に発見し、推測ではなく特定のステージにトレースできる。</p>
<h2 id="What-to-Build-First" class="common-anchor-header">何を最初に構築するか<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>実際のRAGデプロイメントでは、3つの優先事項が際立っている：</p>
<ol>
<li><p><strong>早期にルーティングを追加する。</strong>多くのクエリは検索を全く必要としない。それらを前もってフィルタリングすることで、負荷を軽減し、最小限のエンジニアリング労力でレスポンスタイムを改善する。</p></li>
<li><p><strong>統一されたハイブリッド検索を使用する。</strong>BM25とベクトル検索システムを別々に維持することは、ストレージコストを倍増させ、同期を複雑にし、マージレイテンシーを増加させる。Milvus2.6のような統一されたシステムでは、密なベクトルと疎なベクトルが同じコレクションに存在するため、このような問題は発生しません。</p></li>
<li><p><strong>各ステージを独立して評価する。</strong>エンド・ツー・エンドの回答品質だけでは有用なシグナルとはならない。ステージごとのメトリクス（ルーティングではF1、検索ではRecall@KとNDCG）により、デバッグを高速化し、あるステージを壊して別のステージをチューニングすることを避けることができます。</p></li>
</ol>
<p>最新のRAGシステムの本当の価値は、検索だけではありません。ルーティングとユニファイド・ハイブリッド・サーチから始めることで、スケーラブルな基盤を手に入れることができる。</p>
<hr>
<p>RAGシステムを構築またはアップグレードしていて、検索品質の問題に直面しているなら、ぜひお手伝いさせてください：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、質問したり、アーキテクチャを共有したり、同じような問題に取り組んでいる他の開発者から学んだりしましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（20分無料）をご予約</a>いただき、ルーティング設計、ハイブリッド検索セットアップ、マルチステージ評価など、お客様のユースケースをご説明いたします。</li>
<li>インフラストラクチャのセットアップを省きたい場合は、Milvusのマネージドサービスである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudを</a>ご利用ください。</li>
</ul>
<hr>
<p>チームがよりスマートなRAGシステムを構築し始めると、よく出てくる質問がいくつかある：</p>
<p><strong>Q: モデルが128K以上のコンテキスト・ウィンドウをサポートするようになった今でも、RAGは必要ですか？</strong></p>
<p>はい。長いコンテキスト・ウィンドウは、1つの大きな文書を処理する必要があるときに役立ちますが、知識ベースのクエリの検索を置き換えるものではありません。すべてのリクエストでコーパス全体を送信すると、コストは線形に上昇し、モデルは長いコンテキストでは関連する情報に集中できなくなる。RAGは、関連するものだけを検索し、コストと待ち時間を予測可能な状態に保ちます。</p>
<p><strong>Q: BM25とベクトル検索を2つの別々のシステムで実行せずに組み合わせるにはどうすればよいですか？</strong></p>
<p>同じコレクションで密なベクトルと疎なベクトルの両方をサポートするベクトルデータベースを使用してください。Milvus2.6はドキュメント毎に両方のベクトルタイプを保存し、一つのクエリから融合された結果を返します。重みパラメータを変更することで、キーワードマッチとセマンティックマッチのバランスを調整することができます。</p>
<p><strong>Q: 既存のRAGパイプラインを改善するために最初に追加すべきものは何ですか？</strong></p>
<p>クエリ・ルーティングです。最も影響が大きく、最も労力がかからない改善です。ほとんどのプロダクション・システムでは、常識的な質問、簡単な計算、一般的な知識など、検索を全く必要としないクエリがかなりの割合を占めています。これらを直接LLMにルーティングすることで、不必要な検索コールを削減し、レスポンスタイムを即座に改善することができます。</p>
<p><strong>Q: RAGパイプラインのどの段階が悪い結果を引き起こしているか、どのように判断すればよいですか？</strong></p>
<p>各ステージを個別に評価します。ルーティング精度にはF1スコア、検索品質にはRecall@KとNDCG@10、リランキングにはPrecision@3、生成には忠実度メトリクスを使用します。オフラインのテストデータからベースラインを設定し、本番で各ステージをモニターする。回答品質が低下した場合、推測するのではなく、低下した特定のステージを突き止めることができる。</p>
