---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: Gemini Embedding 2はベクトル・データベースにおける多ベクトル探索を殺すのか？
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  グーグルのGemini Embedding
  2、テキスト、画像、動画、音声を1つのベクトルにマッピング。それはマルチベクトル検索を時代遅れにするのだろうか？いや、その理由がここにある。
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Googleは<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2を</a>リリースした。テキスト、画像、ビデオ、オーディオ、ドキュメントを単一のベクトル空間にマッピングする初のマルチモーダル埋め込みモデルである。</p>
<p>1回のAPIコールで、ビデオクリップ、製品写真、テキストの段落を埋め込むことができ、それらはすべて同じセマンティックな近傍に配置される。</p>
<p>このようなモデルができる前は、それぞれのモダリティをそれぞれの専門家モデルに通し、それぞれの出力を別々のベクトルカラムに保存しなければならなかった。<a href="https://milvus.io/docs/multi-vector-search.md">Milvusの</a>ようなベクトルデータベースのマルチベクトル列は、まさにそのようなシナリオのために構築された。</p>
<p>Gemini Embedding 2が複数のモダリティを同時にマッピングすることで、疑問が生じる。Gemini Embedding 2は、マルチベクター列をどの程度置き換えることができるのか、また、どこで不足するのか？この記事では、各アプローチがどこに適合し、どのように連携するのかを説明する。</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">CLIP/CLAPと比較した場合のGemini Embedding 2の違い<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>エンベッディングモデルは、非構造化データを密なベクトルに変換し、意味的に類似したアイテムがベクトル空間においてクラスタ化されるようにする。Gemini Embedding 2が他と異なる点は、別個のモデルやスティッチングパイプラインを使用することなく、モダリティを超えてネイティブにこれを行うことである。</p>
<p>これまで、マルチモーダル埋め込みは、対比学習で訓練されたデュアルエンコーダーモデルを意味していた：画像-テキスト用の<a href="https://openai.com/index/clip/">CLIP</a>、音声-テキスト用の<a href="https://arxiv.org/abs/2211.06687">CLAP</a>、それぞれが正確に2つのモダリティを扱う。3つすべてが必要な場合は、複数のモデルを実行し、それらの埋め込み空間を自分で調整した。</p>
<p>例えば、カバーアートを含むポッドキャストのインデックスを作成するには、画像用にCLIP、音声用にCLAP、トランスクリプト用にテキストエンコーダーを実行する必要があった。</p>
<p>一方、<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Googleの公式発表に</a>よると、Gemini Embedding 2がサポートしているのは以下の通りである：</p>
<ul>
<li>1リクエストあたり最大8,192トークンまでの<strong>テキスト</strong></li>
<li>1リクエストにつき6枚までの<strong>画像</strong>（PNG、JPEG）</li>
<li>最大120秒までの<strong>動画</strong>（MP4、MOV）</li>
<li><strong>音声</strong>最大80秒、ASR転写なしでネイティブに埋め込み可能</li>
<li><strong>文書</strong>PDF入力、最大6ページ</li>
</ul>
<p>単一のエンベッディングコールで<strong>入力</strong>画像とテキストを<strong>混在可能</strong></p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2とCLIP/CLAPの比較 マルチモーダルエンベッディングにおける1つのモデルと多数のモデルの比較</h3><table>
<thead>
<tr><th></th><th><strong>デュアルエンコーダ（CLIP、CLAP）</strong></th><th><strong>Geminiエンベッディング2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>モデルあたりのモダリティ</strong></td><td>2 (例：画像+テキスト)</td><td>5 (テキスト、画像、ビデオ、オーディオ、PDF)</td></tr>
<tr><td><strong>新しいモダリティの追加</strong></td><td>別のモデルを持ってきて、手動でスペースを整列</td><td>すでに含まれています - APIコール1回</td></tr>
<tr><td><strong>クロスモーダル入力</strong></td><td>別々のエンコーダー、別々の呼び出し</td><td>インターリーブ入力（例：1つのリクエストで画像＋テキスト）</td></tr>
<tr><td><strong>アーキテクチャ</strong></td><td>視覚エンコーダとテキストエンコーダを別々に、コントラスト損失によってアライメント</td><td>Geminiからマルチモーダル理解を継承した単一モデル</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Gemini Embedding 2の利点：パイプラインの簡素化<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>よくあるシナリオを考えてみよう: 短いビデオライブラリを対象としたセマンティック検索エンジンの構築である。各クリップには、ビジュアルフレーム、音声、字幕テキストがあり、これらはすべて同じコンテンツを説明している。</p>
<p><strong>Gemini Embedding 2を使う</strong>前は、3つの別々の埋め込みモデル（画像、音声、テキスト）、3つのベクトル列、そしてマルチウェイリコール、結果フュージョン、重複排除を行う検索パイプラインが必要でした。これは、構築と維持のための多くの可動部分だ。</p>
<p><strong>今</strong>、あなたはビデオのフレーム、オーディオ、字幕を1つのAPI呼び出しにフィードし、完全な意味画像をキャプチャする1つの統一されたベクトルを得ることができます。</p>
<p>当然ながら、マルチ・ベクトル・カラムは死んだと結論づけたくなる。しかし、その結論は "マルチモーダル統一表現 "と "多次元ベクトル検索 "を混同している。両者は異なる問題を解決するものであり、その違いを理解することは正しいアプローチを選ぶために重要なのだ。</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Milvusにおける多ベクトル検索とは？<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="http://milvus.io">Milvusにおける</a>マルチベクトル検索とは、同じアイテムを一度に複数のベクトルフィールドで検索し、その結果をリランキングによって組み合わせることを意味する。</p>
<p>核となる考え方は、1つのオブジェクトが複数の意味を持つことが多いということです。商品には<em>タイトルと</em>説明がある。ソーシャルメディアの投稿には<em>キャプションと</em>画像がある。それぞれの角度が異なる何かを伝えるので、それぞれが独自のベクトルフィールドを持つ。</p>
<p>Milvusはすべてのベクトルフィールドを個別に検索し、リランカーを使って候補セットをマージする。APIでは、各リクエストは異なるフィールドと検索設定にマッピングされ、hybrid_search()は結合された結果を返す。</p>
<p>これには2つの一般的なパターンがあります：</p>
<ul>
<li><strong>Sparse+Dense Vector Searchです。</strong>ユーザーが "red Nike Air Max size 10 "のようなクエリを入力する製品カタログがあるとする。密なベクトルは意味的な意図（"ランニングシューズ, 赤, Nike"）を捉えますが、正確なサイズを見逃します。<a href="https://milvus.io/docs/full-text-search.md">BM25や</a> <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3の</a>ようなモデルを介したスパースベクトルは、キーワードのマッチを的確に捉えます。なぜなら、自然言語とSKU、ファイル名、エラーコードのような特定の識別子が混在するクエリでは、どちらも単独では良い結果を返さないからです。</li>
<li><strong>マルチモーダルベクトル検索。</strong> ユーザーがドレスの写真をアップロードし、"このようなもので、色は青 "と入力したとします。画像埋め込みカラムで視覚的類似性を、テキスト埋め込みカラムで色拘束を同時に検索します。それぞれの列は独自のインデックスとモデル（画像は<a href="https://openai.com/index/clip/">CLIP</a>、説明はテキストエンコーダー）を持ち、結果はマージされる。</li>
</ul>
<p><a href="https://milvus.io/">Milvusは</a>両方のパターンをRRFRankerを介したネイティブな再ランク付けによる並列<a href="https://milvus.io/docs/multi-vector-search.md">ANN検索として</a>実行する。スキーマ定義、マルチインデックス設定、ビルトインBM25はすべて1つのシステムで処理される。</p>
<p>例えば、各アイテムがテキストの説明と画像を含む商品カタログを考えてみよう。そのデータに対して3つの検索を並行して実行することができる：</p>
<ul>
<li><strong>セマンティック・テキスト検索。</strong>セマンティックテキスト検索。<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>、<a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a>、または<a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>エンベッディングAPIなどのモデルによって生成された密なベクトルで、テキスト説明をクエリする。</li>
<li><strong>全文検索。</strong> <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>または<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a>や<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE の</a>ような疎な埋め込みモデルを使用して、テキスト記述を疎なベクトルでクエリします。</li>
<li><strong>クロスモーダル画像検索。</strong> <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIPの</a>ようなモデルから密なベクトルを使用して、テキストクエリを使用して、商品画像を検索します。</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Gemini Embedding 2では、多ベクトル検索はまだ重要ですか？<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2は、1回の呼び出しでより多くのモダリティを処理し、パイプラインを大幅に簡素化します。しかし、統一されたマルチモーダルエンベッディングは、マルチベクトル検索と同じではありません。言い換えれば、そう、マルチベクトル検索はまだ重要なのだ。</p>
<p>Gemini Embedding 2は、テキスト、画像、ビデオ、オーディオ、ドキュメントを1つの共有ベクトル空間にマッピングする。グーグルはこれを、マルチモーダルな意味検索、文書検索、レコメンデーション、つまり、すべてのモダリティが同じコンテンツを記述し、クロスモーダルな重複が高い場合に、単一のベクトルを実行可能にするシナリオの<a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">ために位置づけている</a>。</p>
<p><a href="https://milvus.io/docs/multi-vector-search.md">Milvusの</a>マルチベクトル検索は、別の問題を解決する。例えば、タイトル＋説明文、テキスト＋画像など、<strong>複数のベクトルフィールドを通して</strong>同じオブジェクトを検索し、検索時にそれらの信号を組み合わせる方法である。言い換えれば、単にすべてを1つの表現に圧縮するのではなく、同じアイテムの<strong>複数のセマンティックビューを</strong>保存し、クエリすることである。</p>
<p>しかし、実世界のデータが単一の埋め込みに収まることはほとんどない。生体認証システム、エージェントによるツール検索、そして複合的な意図を持つ電子商取引は、すべて全く異なる意味空間に存在するベクトルに依存している。統一された埋め込みが機能しなくなるのは、まさにそこなのです。</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">なぜ1つの埋め込みでは不十分なのか？マルチベクトル検索の実際</h3><p>Gemini Embedding 2は、すべてのモダリティが同じものを記述するケースを扱います。マルチベクトル検索は、それ以外のすべてを扱う。そして、"それ以外のすべて "は、ほとんどのプロダクション検索システムをカバーする。</p>
<p><strong>バイオメトリクス。</strong>一人のユーザーが顔、声紋、指紋、虹彩のベクトルを持つ。これらは完全に独立した生物学的特徴であり、意味的重複はゼロである。それぞれ独自の列、インデックス、類似度メトリックが必要です。</p>
<p><strong>エージェントツール。</strong>OpenClawのようなコーディングアシスタントは、ファイル名、CLIコマンド、コンフィグパラメータを正確にマッチングするための疎なBM25ベクトルと共に、会話履歴（「先週のデプロイの問題」）のための密な意味ベクトルを保存します。異なる検索ゴール、異なるベクトルタイプ、独立した検索パス、そして再ランク付け。</p>
<p><strong>意図が混在するEコマース。</strong>商品のプロモーションビデオと詳細画像は、統一されたGemini埋め込みとしてうまく機能する。しかし、ユーザーが "このようなドレス "<em>と</em>"同じ生地、Mサイズ "を求めている場合、視覚的類似性カラムと構造化属性カラムを別々のインデックスとハイブリッド検索レイヤーを使って検索する必要があります。</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Geminiエンベッディング2対マルチベクターカラムを使用する場合<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>シナリオ</strong></th><th><strong>何を使うか</strong></th><th><strong>なぜ</strong></th></tr>
</thead>
<tbody>
<tr><td>すべてのモダリティが同じコンテンツを記述する（ビデオフレーム+オーディオ+字幕）</td><td>ジェミニエンベッディング2の統一ベクトル</td><td>高い意味的重複は、1つのベクトルが全体像を捉えることを意味する - フュージョンは不要</td></tr>
<tr><td>意味的想起と同時にキーワード精度が必要（BM25 + dense）</td><td>hybrid_search()によるマルチベクトル列</td><td>スパースベクトルとデンスベクトルは1つのエンベッディングには収まらない異なる検索ゴールに貢献する</td></tr>
<tr><td>クロスモーダル検索が主なユースケース（テキストクエリ→画像結果）</td><td>ジェミニ埋め込み 2 統一ベクトル</td><td>単一の共有空間がクロスモーダル類似性をネイティブにする</td></tr>
<tr><td>ベクトルは基本的に異なる意味空間に存在（バイオメトリクス、構造化属性）</td><td>フィールドごとのインデックスを持つ複数のベクトル列</td><td>ベクトルフィールドごとに独立した類似度メトリックスとインデックスタイプ</td></tr>
<tr><td>パイプラインの簡素<em>化と</em>きめ細かな検索が必要</td><td>両方 - 統一されたGeminiベクトル + 同じコレクション内の追加のスパースまたは属性カラム</td><td>Geminiはマルチモーダルカラムを処理し、Milvusはその周りのハイブリッド検索レイヤーを処理する。</td></tr>
</tbody>
</table>
<p>これら2つのアプローチは互いに排他的なものではない。統一されたマルチモーダルカラムにGemini Embedding 2を使用し、同じ<a href="https://milvus.io/">Milvus</a>コレクション内の別のカラムに追加のスパースまたは属性固有のベクトルを格納することができます。</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">クイックスタートGemini Embedding 2 + Milvusのセットアップ<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>以下は動作デモである。実行中の<a href="https://milvus.io/docs/install-overview.md">MilvusまたはZilliz Cloudインスタンスと</a>GOOGLE_API_KEYが必要です。</p>
<h3 id="Setup" class="common-anchor-header">セットアップ</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">完全な例</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>画像と音声の埋め込みには、embed_image()とembed_audio()を同じように使用します - ベクトルは同じコレクションと同じベクトル空間に配置され、真のクロスモーダル検索を可能にします。</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2はMilvus/Zilliz Cloudでまもなく利用可能になる。<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvusは</a>、<a href="https://milvus.io/docs/embeddings.md">Embedding Function</a>機能を通じて、Gemini Embedding 2との深い統合を出荷している。本番稼動後は、エンベッディングAPIを手動で呼び出す必要がなくなります。Milvusは、(OpenAI、AWS Bedrock、Google Vertex AIなどをサポートする)モデルを自動起動し、挿入時の生データと検索時のクエリをベクトル化する。</p>
<p>つまり、Milvusのフルマルチベクトルツールキット（スパース-デンスハイブリッド検索、マルチインデックススキーマ、リランキング）を、きめ細かなコントロールが必要な場所で利用することができる。</p>
<p>試してみたいですか？<a href="https://milvus.io/docs/quickstart.md">Milvusのクイックスタートから始めて</a>、上記のデモを実行するか、BGE-M3での完全なマルチベクトルのセットアップについては、<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">ハイブリッド検索ガイドを</a>チェックしてください。ご質問は<a href="https://milvus.io/discord">Discord</a>または<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvusオフィスアワーまで</a>。</p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介：Milvus 2.6がベクトル化とセマンティック検索をどのように効率化するか - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">マルチベクターハイブリッド検索</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Milvus埋め込み関数ドキュメント</a></li>
</ul>
