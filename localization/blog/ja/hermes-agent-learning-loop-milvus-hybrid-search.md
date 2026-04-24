---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: Milvus2.6ハイブリッド検索でHermesエージェントの学習ループを修正する方法
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  ヘルメス・エージェントの学習ループは使用中のスキルを書き込むが、FTS5検索は言い直されたクエリを見逃してしまう。milvus2.6のハイブリッド検索はクロスセッションのリコールを修正。
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>ヘルメス・エージェントは</strong></a> <strong>最近あちこちで見かけるようになった。</strong>Nous Researchによって構築されたHermesは、セルフホスト型のパーソナルAIエージェントで、自分のハードウェア上で動作し（5ドルのVPSでも動作する）、Telegramのような既存のチャットチャンネルを通じてあなたと会話する。</p>
<p>このループは、経験からスキルを作成し、使用中にそれらを改善し、再利用可能なパターンを見つけるために過去の会話を検索します<strong>。</strong>他のエージェントフレームワークでは、スキルはデプロイ前に手作業でコーディングされる。エルメスのSkillは使用することで成長し、繰り返されるワークフローはコード変更なしで再利用可能になる。</p>
<p><strong>Hermesの検索はキーワードのみです。</strong>正確な単語にはマッチしますが、ユーザーが求めている意味にはマッチしません。ユーザーが異なるセッションで異なる言葉を使っている場合、ループはそれらをつなげることができず、新しいスキルは書かれない。ドキュメントが数百しかないときは、ギャップは許容範囲内です。<strong>それ以上になると、ループは自分自身の履歴を見つけることができないため、学習をやめてしまう。</strong></p>
<p><strong>それを解決するのがMilvus 2.6だ。</strong>その<a href="https://milvus.io/docs/multi-vector-search.md">ハイブリッド検索は</a>、1つのクエリーで意味と正確なキーワードの両方をカバーするため、ループは最終的にセッションをまたいで言い換えられた情報を結びつけることができる。小さなクラウドサーバー（月額5ドルのVPSで動作）に収まるほど軽量だ。Milvusは検索レイヤーの後ろに位置するため、学習ループはそのまま維持される。エルメスが実行するスキルを選択し、milvusが何を取得するかを処理する。</p>
<p>一度検索がうまくいくと、学習ループは検索戦略そのものをスキルとして保存することができる。このようにして、エージェントの知識はセッションを越えて蓄積されるのです。</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">ヘルメス・エージェントのアーキテクチャ4層メモリがスキル学習ループを強化する仕組み<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>エルメスには4つのメモリ層があり、その中でもL4スキルが特徴的です。</strong></p>
<ul>
<li><strong>L1</strong>- セッションのコンテキスト（セッションが終了するとクリアされる</li>
<li><strong>L2</strong>- 永続化された事実：プロジェクトスタック、チーム規約、解決された意思決定</li>
<li><strong>L3</strong>- SQLite FTS5のキーワード検索。</li>
<li><strong>L4</strong>- ワークフローをMarkdownファイルとして保存。デプロイ前に開発者がコードでオーサリングするLangChainツールやAutoGPTプラグインとは異なり、L4スキルは自己記述です。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">エルメスのFTS5キーワード検索が学習ループを壊す理由<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>エルメスは、そもそもクロスセッションワークフローをトリガーするために検索が必要です。</strong>しかし、そのビルトインのL3レイヤーはSQLite FTS5を使用しており、これはリテラルトークンのみにマッチし、意味にはマッチしません。</p>
<p><strong>ユーザーがセッション間で同じ意図を異なるフレーズで表現すると、FTS5はマッチングをミスする。</strong>学習ループは起動しない。新しいスキルは書き込まれず、次にそのインテントが来たとき、ユーザーは手作業でのルーティングに戻ります。</p>
<p>例: ナレッジベースに "asyncio event loop, async task scheduling, non-blocking I/O" が保存されている。ユーザーは "Python concurrency "と検索する。FTS5は0件のヒットを返します - 文字通りの単語の重複はなく、FTS5はそれらが同じ質問であることを確認する方法がありません。</p>
<p>数百のドキュメント以下であれば、このギャップは許容範囲です。それ以上の場合、ドキュメントはある語彙を使い、ユーザーは別の語彙で質問する。<strong>検索不可能なコンテンツは知識ベースにないのと同じで、学習ループはそこから学ぶことができない。</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Milvus 2.6がハイブリッド検索と階層型ストレージで検索ギャップを修正する方法<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus2.6は、Milvusの障害点にフィットする2つのアップグレードをもたらす。</strong> <strong>ハイブリッド検索は</strong>、1回の呼び出しでセマンティック検索とキーワード検索の両方をカバーすることで、学習ループのブロックを解除する。<strong>階層型ストレージは</strong>、検索バックエンド全体をヘルメスが構築されたのと同じ月5ドルのVPSで実行できるほど小さく保ちます。</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">ハイブリッド検索が解決すること関連情報の検索</h3><p>milvus2.6は、1つのクエリでベクトル検索（セマンティック）と<a href="https://milvus.io/docs/full-text-search.md">BM25全文検索</a>（キーワード）の両方を実行し、<a href="https://milvus.io/docs/multi-vector-search.md">RRF（Reciprocal Rank Fusion</a>）で2つのランク付けされたリストをマージすることをサポートしています。</p>
<p>例えば、&quot;asyncioの原理は何ですか &quot;と尋ねると、ベクトル検索は意味的に関連するコンテンツをヒットさせる。<code translate="no">find_similar_task</code> 関数はどこで定義されているか」と質問すると、BM25はコード内の関数名と正確に一致する。特定のタイプのタスク内の関数が関係する質問に対しては、ハイブリッド検索は、手書きのルーティングロジックなしで、1回の呼び出しで正しい結果を返す。</p>
<p>エルメスにとって、これが学習ループのブロックを解除するものだ。2つ目のセッションがインテントを言い換えると、ベクトル検索がFTS5が見逃したセマンティックマッチをキャッチする。ループは解除され、新しいスキルが書き込まれる。</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">階層型ストレージが解決することコスト</h3><p>素朴なベクターデータベースはRAMに完全な埋め込みインデックスを必要とする。Milvus2.6では、アクセス頻度に基づいて階層間でエントリを移動させる3階層ストレージによって、それを回避している：</p>
<ul>
<li><strong>ホット</strong>- メモリ上</li>
<li><strong>ウォーム</strong>- SSD</li>
<li><strong>コールド</strong>- オブジェクトストレージ</li>
</ul>
<p>ホットなデータだけが常駐する。500ドキュメントの知識ベースは2GBのRAMに収まる。検索スタック全体は、インフラをアップグレードすることなく、エルメスがターゲットとする同じ月額5ドルのVPSで実行されます。</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">ヘルメス + Milvus: システムアーキテクチャ<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>ヘルメスは実行するスキルを選択する。Milvusは何を取得するかを処理する。</strong>2つのシステムは分離されたままであり、ヘルメスのインターフェースは変わらない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>フロー</strong></p>
<ol>
<li>ヘルメスはユーザーの意図を特定し、スキルにルーティングする。</li>
<li>スキルはターミナルツールを通じて検索スクリプトを呼び出す。</li>
<li>スクリプトはMilvusをヒットし、ハイブリッド検索を実行し、ソースのメタデータとともにランク付けされたチャンクを返す。</li>
<li>ヘルメスが回答を作成する。メモリがワークフローを記録する。</li>
<li>セッション間で同じパターンが繰り返されると、学習ループが新しいスキルを書き込む。</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">HermesとMilvus 2.6のインストール方法<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermesと</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standaloneを</strong></a><strong>インストールし</strong><strong>、denseフィールドとBM25フィールドを持つコレクションを作成する。</strong>これがLearning Loopが起動する前のフルセットアップです。</p>
<h3 id="Install-Hermes" class="common-anchor-header">Hermesをインストールする</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">hermes</code> を実行して、インタラクティブなinitウィザードに入る：</p>
<ul>
<li><strong>LLMプロバイダー</strong>- OpenAI、Anthropic、OpenRouter（OpenRouterには無料のモデルがあります。）</li>
<li><strong>チャンネル</strong>- このチュートリアルではFLarkボットを使用します。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Milvus 2.6スタンドアローンの実行</h3><p>シングルノードのスタンドアロンで十分です：</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">コレクションの作成</h3><p>スキーマの設計は、検索ができることを制限する。このスキーマは密なベクトルとBM25の疎なベクトルを並べて実行する：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">ハイブリッド検索スクリプト</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>密なリクエストは、候補プールを2倍広げるので、RRFはランク付けするのに十分です。</strong> <code translate="no">text-embedding-3-small</code> は、検索品質を保ったまま、最も安価なOpenAIのエンベッディングです。予算が許せば、<code translate="no">text-embedding-3-large</code> に入れ替えます。</p>
<p>環境と知識ベースの準備ができたので、次のセクションでは学習ループをテストする。</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">エルメスのスキル自動生成の実践<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>2つのセッションで学習ループを実際に使ってみる。</strong>最初のセッションでは、ユーザーがスクリプトに手で名前を付けている。2つ目では、新しいセッションがスクリプトに名前を付けずに同じ質問をします。エルメスはこのパターンを拾い、3つのスキルを書く。</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">セッション1：手でスクリプトを呼び出す</h3><p>LarkでHermesを開きます。スクリプトのパスと検索対象を指定する。Hermesはターミナルツールを起動し、スクリプトを実行し、ソースの帰属とともに答えを返す。<strong>スキルはまだ存在しません。これは単なるツールの呼び出しです。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">セッション2：スクリプトに名前を付けずに尋ねる</h3><p>会話をクリアします。新しく始める。台本やパスには触れずに、同じカテゴリーの質問をする。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">記憶が先に書き、スキルが後に続く</h3><p><strong>学習ループはワークフロー（スクリプト、引数、戻り形状）を記録し、答えを返す。</strong>メモリーはトレースを保持し、スキルはまだ存在しない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>まだスキルは存在しない。2つ目のセッションのマッチが、ループにパターンを保持する価値があることを伝える。</strong>これが実行されると、3つのスキルが書き込まれる：</p>
<table>
<thead>
<tr><th>スキル</th><th>役割</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>メモリー上でハイブリッド意味＋キーワード検索を実行し、答えを構成する</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>ドキュメントがナレッジベースに取り込まれたことを確認する</td></tr>
<tr><td><code translate="no">terminal</code></td><td>シェルコマンドの実行：スクリプト、環境設定、検査</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この時点から、<strong>ユーザーはスキルに名前をつけるのをやめる。</strong>ヘルメスは意図を推測し、スキルにルーティングし、メモリーから関連するチャンクを取り出し、答えを書く。プロンプトにスキルセレクタはありません。</p>
<p>ほとんどのRAG(retrieval-augmented generation)システムは保存とフェッチの問題を解決しますが、フェッチロジック自体はアプリケーションコードにハードコードされています。異なる方法や新しいシナリオで質問すると、検索は壊れてしまいます。エルメスはフェッチ・ストラテジーをスキルとして保存します。つまり<strong>、フェッチ・パスはあなたが読んだり、編集したり、バージョン管理したりできるドキュメントになるのです。</strong> <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> の行はセットアップ完了マーカーではありません。<strong>エージェントが動作パターンを長期記憶しているのです。</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">エルメス vs. OpenClaw：蓄積 vs. オーケストレーション<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes と OpenClaw は異なる問題に対応しています。</strong>ヘルメスは、セッションをまたいで記憶とスキルを蓄積する単一のエージェントのために作られています。OpenClawは、複雑なタスクを分割し、それぞれのピースを特化したエージェントに渡すために作られています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClawの強みはオーケストレーションだ。タスクのどれだけが自動的に行われるかを最適化する。エルメスの強みは蓄積である。セッションをまたいで記憶する単一のエージェントで、使い込むことでスキルが成長する。ヘルメスは長期的なコンテキストとドメイン経験を最適化する。</p>
<p><strong>2つのフレームワークはスタックする。</strong>Hermesは、<code translate="no">~/.openclaw</code> のメモリとスキルをHermesのメモリレイヤーに引き込むワンステップのマイグレーションパスを提供する。オーケストレーション・スタックはその上に、アキュムレーション・エージェントはその下に置くことができる。</p>
<p>OpenClaw側の分割については、<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClawとは？</a>Milvusブログの<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">オープンソースAIエージェント完全ガイドを</a>参照。</p>
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
    </button></h2><p>エルメスのラーニング・ループは、繰り返されるワークフローを再利用可能なスキルに変える。FTS5のキーワード検索ではできない。<a href="https://milvus.io/docs/multi-vector-search.md"><strong>Milvus2.6のハイブリッド検索は</strong></a>可能である：密なベクトルは意味を扱い、BM25は正確なキーワードを扱い、RRFは両方をマージし、<a href="https://milvus.io/docs/tiered-storage-overview.md">階層化されたストレージは</a>月額5ドルのVPSでスタック全体を維持する。</p>
<p>そして、階層化されたストレージは、スタック全体を月々5ドルのVPSに保存します。重要な点は、一度検索がうまくいくと、エージェントはより良い答えを保存するだけでなく、より良い検索戦略をスキルとして保存することです。フェッチパスは、バージョンアップ可能なドキュメントとなり、使うごとに改善されます。これが、ドメインの専門知識を蓄積するエージェントと、セッションごとに新しく始めるエージェントを分けるものです。他のエージェントがこの問題をどのように扱うか（あるいは扱えないか）の比較については、<a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code の Memory System Explained</a>を参照してください。</p>
<h2 id="Get-Started" class="common-anchor-header">始める<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>この記事のツールを試してみてください：</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent on GitHub</a>- 上記で使用したインストールスクリプト、プロバイダ設定、チャンネル設定。</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a>- ナレッジベースバックエンド用のシングルノードDockerデプロイ。</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvusハイブリッド検索チュートリアル</a>- この投稿のスクリプトに一致する完全な密度+ BM25 + RRFの例。</li>
</ul>
<p><strong>Hermes + Milvusハイブリッド検索について質問がありますか？</strong></p>
<ul>
<li><a href="https://discord.gg/milvus">MilvusのDiscordに</a>参加して、ハイブリッド検索、階層型ストレージ、またはSkill-routingパターンについて質問してください。</li>
<li><a href="https://milvus.io/community#office-hours">Milvusオフィスアワーを予約して</a>、Milvusチームと一緒にエージェントとナレッジベースのセットアップを行いましょう。</li>
</ul>
<p><strong>セルフホストをスキップしたいですか？</strong></p>
<ul>
<li>Zilliz Cloudに<a href="https://cloud.zilliz.com/signup">サインアップ</a>または<a href="https://cloud.zilliz.com/login">サインイン</a>- ハイブリッド検索と階層型ストレージを備えたマネージドMilvusをすぐにご利用いただけます。新しいワークメールアカウントには<strong>100ドルの無料クレジットを</strong>差し上げます。</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">さらに読む<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6リリースノート</a>-階層型ストレージ、ハイブリッド検索、スキーマの変更</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a>- Milvusネイティブエージェントのための運用ツール。</li>
<li><a href="https://zilliz.com/blog">RAGスタイルのナレッジマネジメントがエージェントに向かない理由</a>- エージェントに特化したメモリ設計のケース</li>
<li><a href="https://zilliz.com/blog">Claude Codeのメモリシステムは予想以上に原始的</a>- 他のエージェントのメモリスタックに関する比較記事</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">よくある質問<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">エルメスエージェントのスキル学習ループは実際にどのように機能するのですか？</h3><p>エルメスは、実行したすべてのワークフロー（呼び出されたスクリプト、渡された引数、返された形）をメモリトレースとして記録します。2つ以上のセッションで同じパターンが現れると、学習ループが起動し、再利用可能なスキル、つまり繰り返し可能な手順としてワークフローをキャプチャしたMarkdownファイルを書き込みます。その時点から、エルメスはユーザーが名前を付けなくても、意図だけでスキルにルーティングします。重要な依存関係は検索です。ループは以前のセッションのトレースを見つけることができた場合にのみ起動します。そのため、キーワードのみの検索は規模が大きくなるとボトルネックになります。</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">エージェント・メモリに対するハイブリッド検索とベクター・オンリー検索の違いは何ですか？</h3><p>ベクトル・オンリー検索は意味をうまく処理しますが、完全一致を見逃します。開発者がConnectionResetErrorのようなエラー文字列やfind_similar_taskのような関数名を貼り付けた場合、純粋なベクトル検索は意味的には関連するが間違った結果を返すかもしれない。ハイブリッド検索は、密なベクトル（セマンティック）とBM25（キーワード）を組み合わせ、Reciprocal Rank Fusionで2つの結果セットをマージします。エージェントメモリでは、漠然とした意図（"Python concurrency"）から正確なシンボルまで様々なクエリがありますが、ハイブリッド検索はアプリケーションレイヤーでルーティングロジックを使用することなく、1回の呼び出しで両端をカバーします。</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Milvusのハイブリッド検索をHermes以外のAIエージェントで使うことはできますか？</h3><p>エージェントは検索スクリプトを呼び出し、スクリプトはMilvusに問い合わせ、結果はソースメタデータと共にランク付けされたチャンクとして返されます。ツール呼び出しやシェル実行をサポートするエージェントフレームワークであれば、同じアプローチを使用することができます。Milvus側はエージェントに依存しないので、どのエージェントがそれを呼び出しているかは知らないし、気にしない。</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Milvus + Hermesのセットアップ費用は月いくらですか？</h3><p>シングルノードのMilvus 2.6スタンドアロンで、2コア/4GBのVPS、階層型ストレージを使用した場合、<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>約5</mn><mi>/</mi><mn>月</mn></mrow></semantics></math></span></span>です<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">。</mi><mi>OpenAI</mi><mi>text-embedding-3-smallcosts5/month</mi></mrow><annotation encoding="application/x-tex">.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">smallcosts</span><span class="mord mathnormal" style="margin-right:0.01968em;">0</span></span></span></span>.02/1Mトークン - 個人的な知識ベースとしては月数セント<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">。</span></span></span></span>LLM推論が総コストを支配し、検索スタックではなく、使用量に応じてスケールする。</p>
