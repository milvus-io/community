---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: コンテキストの過負荷を超えて：Parlant × MilvusはLLMエージェントの行動をどのように制御し、明確化するか？
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Parlant ×
  Milvusが、アライメント・モデリングとベクトル・インテリジェンスを用いて、LLMエージェントの挙動を制御可能、説明可能、生産可能なものにする方法をご覧ください。
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>200のビジネスルール、50のツール、30のデモを含むタスクをこなすように言われ、それをこなすのに1時間しかないと想像してみてほしい。そんなことは不可能だ。しかし、私たちはしばしば、大規模な言語モデルを「エージェント」化し、指示を過負荷にすることで、まさにそのようなことを期待します。</p>
<p>実際には、このアプローチはすぐに破綻する。LangChainやLlamaIndexのような従来のエージェントフレームワークは、すべてのルールやツールをモデルのコンテキストに一度に注入するため、ルールの衝突、コンテキストの過負荷、本番での予測不可能な動作につながります。</p>
<p>この問題に対処するために、<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlantという</strong></a>オープンソースのエージェントフレームワークが最近GitHubで人気を集めている。Parlantは、アライメント・モデリングと呼ばれる新しいアプローチを導入し、スーパーバイジング・メカニズムと条件遷移によって、エージェントの振る舞いをより制御しやすく、説明しやすくしています。</p>
<p>オープンソースのベクトルデータベースである<a href="https://milvus.io/"><strong>Milvusと</strong></a>組み合わせることで、Parlantはさらに高性能になる。Milvusはセマンティックインテリジェンスを追加し、エージェントがリアルタイムで最も関連性の高いルールとコンテキストを動的に取得することを可能にします。</p>
<p>この投稿では、Parlantがどのように機能するのか、そしてMilvusと統合することでどのようにプロダクショングレードを実現するのかを探ります。</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">従来のエージェントフレームワークが崩壊する理由<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>伝統的なエージェントフレームワークは、何百ものルール、何十ものツール、そして一握りのデモ、これらすべてを1つの、詰め込み過ぎのプロンプトに詰め込むというような、大きなことをするのが好きです。デモや小さなサンドボックステストでは素晴らしく見えるかもしれませんが、本番環境に投入すると、すぐに亀裂が入り始めます。</p>
<ul>
<li><p><strong>相反するルールが混沌をもたらす：</strong>2つ以上のルールが同時に適用される場合、これらのフレームワークには、どちらが勝つかを決める方法が組み込まれていない。どちらかを選ぶこともある。両方をブレンドすることもある。時には、まったく予測不可能なことをすることもある。</p></li>
<li><p><strong>エッジケースはギャップを露呈する：</strong>ユーザーの発言すべてを予測することはできない。そして、モデルが学習データ外のことに遭遇すると、一般的な、非妥協的な答えがデフォルトになります。</p></li>
<li><p><strong>デバッグは苦痛と費用がかかります：</strong>エージェントが誤動作したとき、どのルールが問題を引き起こしたかを特定することはほとんど不可能です。すべてが1つの巨大なシステムプロンプトの中にあるため、それを修正する唯一の方法は、プロンプトを書き換えて、ゼロからすべてを再テストすることです。</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Parlantとその仕組み<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant はオープンソースの LLM エージェント用アライメントエンジンです。エージェントの意思決定プロセスを構造化されたルールベースでモデル化することで、エージェントが様々なシナリオでどのように振る舞うかを正確に制御することができます。</p>
<p>従来のエージェントフレームワークに見られる問題に対処するために、Parlantは新しい強力なアプローチを導入しています：<strong>アライメントモデリング</strong>です。その中核となる考え方は、ルールの定義とルールの実行を分離することであり、LLM のコンテキストには常に最も関連性の高いルールだけが注入されるようにします。</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">粒度の細かいガイドラインアライメント・モデリングの中核</h3><p>Parlantのアライメント・モデルの中核にあるのは、「<strong>粒度の細かいガイドライン</strong>」というコンセプトです。ルールでいっぱいの巨大なシステムプロンプトを書く代わりに、小さなモジュール式のガイドラインを定義します。</p>
<p>各ガイドラインは3つの部分で構成されます：</p>
<ul>
<li><p><strong>条件</strong>- どのような場合にそのルールが適用されるかを自然言語で記述します。Parlantはこの条件を意味ベクトルに変換し、ユーザーの入力と照合して関連性があるかどうかを判断します。</p></li>
<li><p><strong>アクション</strong>- 条件が満たされたときにエージェントがどのように応答すべきかを定義する明確な指示。このアクションは、トリガーされたときだけLLMのコンテキストに注入されます。</p></li>
<li><p><strong>ツール</strong>- 特定のルールに結びついた外部関数やAPI。これらは、ガイドラインがアクティブなときだけエージェントに公開され、ツールの使用を制御し、コンテキストを認識します。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>ユーザがエージェントと対話するたびに、Parlantは最も関連性の高い3～5個のガイドラインを見つけるために、軽量なマッチングステップを実行します。これらのルールのみがモデルのコンテキストに注入され、プロンプトを簡潔かつ集中的に保つと同時に、エージェントが一貫して正しいルールに従うことを保証します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">正確性と一貫性のための監督メカニズム</h3><p>正確性と一貫性をさらに維持するために、Parlantは品質管理の第二層として機能する<strong>監督メカニズムを</strong>導入しています。このプロセスは3つのステップで展開されます：</p>
<p><strong>1.応答候補の生成</strong>- エージェントは、マッチしたガイドラインと現在の会話コンテキストに基づいて、最初の応答を作成します。</p>
<p><strong>2.コンプライアンスチェック</strong>- レスポンスがアクティブなガイドラインと比較され、すべての指示が正しく守られていることが確認されます。</p>
<p><strong>3.</strong>3.<strong>修正または確認</strong>- 問題が見つかった場合、システムは出力を修正します。</p>
<p>この監督メカニズムにより、エージェントはルールを理解するだけでなく、返信前に実際にルールを守ることが保証され、信頼性と制御性の両方が向上する。</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">制御と安全のための条件付き遷移</h3><p>従来のエージェントフレームワークでは、利用可能なすべてのツールが常にLLMに公開されている。この "テーブル上のすべて "というアプローチは、しばしば過負荷のプロンプトや意図しないツールの呼び出しにつながります。Parlant は、<strong>条件付き遷移によって</strong>これを解決します。ステートマシンの仕組みと同様に、特定の条件が満たされたときにのみ、アクションやツールがトリガーされます。各ツールは対応するガイドラインと緊密に結びついており、そのガイドラインの条件が有効化されたときにのみ利用可能になります。</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>このメカニズムにより、ツールの起動は条件遷移となり、トリガー条件が満たされたときにのみ、ツールは「非アクティブ」から「アクティブ」に移行する。このように実行を構造化することで、Parlantはすべてのアクションが意図的かつ文脈的に行われるようにし、効率とシステムの安全性の両方を向上させながら誤用を防止します。</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">MilvusがParlantを動かす仕組み<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlantのガイドラインマッチングプロセスのボンネットを覗いてみると、1つの核となる技術的課題が明らかになる。それは、数百、あるいは数千の選択肢の中から、最も関連性の高い3～5個のルールを数ミリ秒で見つけるにはどうすればよいか、ということだ。そこで登場するのがベクター・データベースである。セマンティック検索がこれを可能にする。</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">MilvusはどのようにParlantのガイドラインマッチングプロセスをサポートしているのか？</h3><p>ガイドラインのマッチングは、意味的類似性によって機能します。各ガイドラインの「条件」フィールドはベクトル埋め込みに変換され、単なるテキストではなく、その意味を捉えます。ユーザーがメッセージを送信すると、Parlantはそのメッセージのセマンティクスを、保存されているすべてのガイドライン埋め込みと比較し、最も関連性の高いものを見つけます。</p>
<p>以下は、そのプロセスの流れです：</p>
<p><strong>1.クエリをエンコードする</strong>- ユーザーのメッセージと最近の会話履歴をクエリベクトルに変換します。</p>
<p><strong>2.類似性の検索</strong>- システムがガイドラインベクターストア内で類似性検索を行い、最も近い一致を見つける。</p>
<p><strong>3.トップKの結果を取得</strong>- 意味的に最も関連性の高い上位3～5つのガイドラインが返されます。</p>
<p><strong>4.コンテキストへの挿入</strong>- これらの一致したガイドラインは、LLMのコンテキストに動的に挿入され、モデルが正しいルールに従って行動できるようになります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このワークフローを可能にするために、ベクトルデータベースは、高性能な近似最近傍（ANN）検索、柔軟なメタデータフィルタリング、リアルタイムのベクトル更新という3つの重要な機能を提供する必要があります。オープンソースのクラウドネイティブなベクトルデータベースである<a href="https://milvus.io/"><strong>Milvusは</strong></a>、この3つの領域すべてにおいてプロダクショングレードのパフォーマンスを提供します。</p>
<p>Milvusが実際のシナリオでどのように機能するかを理解するために、金融サービスエージェントを例に見てみよう。</p>
<p>システムが、口座照会、資金移動、資産管理商品の相談などの業務をカバーする800の業務ガイドラインを定義しているとする。この場合、Milvusはすべてのガイドラインデータの保存・検索レイヤーとして機能する。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>さて、ユーザーが「母の口座に10万人民元を送金したい」と言った場合、実行時のフローは次のようになる：</p>
<p><strong>1.クエリーをレクタライズする</strong>- ユーザー入力を768次元のベクトルに変換する。</p>
<p><strong>2.</strong>2.<strong>ハイブリッド検索</strong>- Milvusのベクトル類似度検索とメタデータのフィルタリング（例：<code translate="no">business_domain=&quot;transfer&quot;</code> ）を実行する。</p>
<p><strong>3.結果ランキング</strong>- 類似性スコアと<strong>優先度</strong>値を組み合わせて、ガイドライン候補をランク付けする。</p>
<p><strong>4.コンテキストインジェクション</strong>- トップ3にマッチしたガイドラインの<code translate="no">action_text</code> を Parlant エージェントのコンテキストにインジェクションします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この構成では、Milvusは、ガイドラインライブラリが10万エントリにスケールした場合でも、P99レイテンシを15ミリ秒未満に抑えています。これに比べ、従来のリレーショナルデータベースを使用したキーワードマッチングでは、通常200ミリ秒以上のレイテンシが発生し、マッチング精度も大幅に低下します。</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Milvusが長期記憶とパーソナライゼーションを可能にする理由</h3><p>Milvusはガイドラインマッチング以上のことを行います。エージェントが長期的な記憶とパーソナライズされた応答を必要とするシナリオでは、Milvusはユーザーの過去のやり取りをベクトル埋め込みとして保存し検索するメモリレイヤーとして機能し、エージェントが以前に議論された内容を記憶するのに役立ちます。</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>同じユーザーが戻ってきたとき、エージェントはMilvusから最も関連性の高い過去のやりとりを取得し、よりつながりのある、人間のような体験を生成するためにそれらを使用することができます。例えば、ユーザーが先週投資ファンドについて質問した場合、エージェントはその文脈を思い出し、積極的に応答することができる：「おかえりなさい！"おかえりなさい！前回お話したファンドについてまだご質問はありますか？"</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">milvus搭載エージェントシステムのパフォーマンスを最適化する方法</h3><p>Milvusを利用したエージェントシステムを本番環境に導入する場合、パフォーマンスチューニングが重要になります。低レイテンシと高スループットを実現するためには、いくつかの重要なパラメータに注意を払う必要があります：</p>
<p><strong>1.適切なインデックスタイプの選択</strong></p>
<p>適切なインデックス構造を選択することが重要です。例えば、HNSW (Hierarchical Navigable Small World)は、精度が重要な金融やヘルスケアのような高リコールシナリオに最適です。IVF_FLATは、電子商取引の推奨のような大規模なアプリケーションに適しており、高速なパフォーマンスとメモリ使用量の削減と引き換えに、多少低いリコールが許容されます。</p>
<p><strong>2.シャーディング戦略</strong></p>
<p>保存されたガイドラインの数が100万エントリを超える場合、ビジネスドメインやユースケースごとにデータを<strong>分割</strong>するために<strong>パーティションを</strong>使用することをお勧めします。パーティショニングは、クエリごとの検索スペースを減らし、検索速度を向上させ、データセットが大きくなっても待ち時間を安定させます。</p>
<p><strong>3.キャッシュ構成</strong></p>
<p>標準的な顧客クエリやトラフィックの多いワークフローなど、頻繁にアクセスされるガイドラインについては、Milvusのクエリ結果キャッシュを使用することができます。これにより、システムは以前の結果を再利用することができ、繰り返し検索する際の待ち時間を5ミリ秒以下に短縮することができます。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">ハンズオンデモParlantとMilvus LiteでスマートなQ&amp;Aシステムを構築する方法<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Liteは</a>Milvusの軽量版で、アプリケーションに簡単に組み込むことができるPythonライブラリです。Jupyter Notebooksのような環境で素早くプロトタイプを作成したり、コンピューティングリソースが限られたエッジデバイスやスマートデバイスで実行するのに理想的です。その小さなフットプリントにもかかわらず、Milvus Liteは他のMilvusデプロイメントと同じAPIをサポートしています。つまり、Milvus Lite用に書いたクライアントサイドのコードは、後からMilvusやZilliz Cloudのフルインスタンスにシームレスに接続することができます。</p>
<p>このデモでは、Milvus LiteとParlantを連携させ、最小限のセットアップでコンテキストに応じた回答を高速に提供するインテリジェントなQ&amp;Aシステムの構築方法をご紹介します。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>1.Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.Parlant ドキュメント: https://parlant.io/docs</p>
<p>3.python3.10以上</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">ステップ1：依存関係のインストール</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">ステップ2：環境変数の設定</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">ステップ 3: コアコードの実装</h3><ul>
<li>カスタムOpenAIエンベッダーの作成</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>ナレッジベースの初期化</li>
</ul>
<p>1.kb_articlesというMilvusコレクションを作成する。</p>
<p>2.サンプルデータ（返金ポリシー、交換ポリシー、配送時間など）を挿入する。</p>
<p>3.検索を高速化するためにHNSWインデックスを構築する。</p>
<ul>
<li>ベクトル検索ツールの構築</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>パーラントエージェントの設定</li>
</ul>
<p><strong>ガイドライン1：</strong>事実またはポリシーに関連する質問については、エージェントは最初にベクトル検索を実行する必要があります。</p>
<p><strong>ガイドライン 2：</strong>証拠が見つかった場合、エージェントは構造化されたテンプレート（要約＋要点＋ソース）を使って返答しなければならない。</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>完全なコードを書く</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">ステップ4：コードを実行する</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>プレイグラウンドにアクセスしてください：</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>これで、Parlantとmilvusを使ってインテリジェントなQ&amp;Aシステムを構築することに成功しました。</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">ParlantとLangChain/LlamaIndexの比較：両者の違いと連携<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>LangChainや</strong> <strong>LlamaIndexの</strong>ような既存のエージェントフレームワークと比較して、Parlantはどのように違うのでしょうか？</p>
<p>LangChainやLlamaIndexは汎用的なフレームワークです。幅広いコンポーネントや統合機能を提供しており、迅速なプロトタイピングや研究実験に最適です。しかし、本番環境でのデプロイとなると、エージェントの一貫性と信頼性を保つために、ルール管理、コンプライアンスチェック、信頼性メカニズムなど、開発者自身が余分なレイヤーを構築する必要があります。</p>
<p>Parlant は、組み込みのガイドライン管理、自己批判メカニズム、説明可能性ツールを提供し、開発者がエージェントの動作、応答、理由を管理するのを支援します。このため、Parlant は、金融、ヘルスケア、法律サービスなど、正確性と説明責任が重要な、顧客と接する重要なユースケースに特に適しています。</p>
<p>実際、これらのフレームワークは連携することができます：</p>
<ul>
<li><p>複雑なデータ処理パイプラインや検索ワークフローを構築するにはLangChainを使用します。</p></li>
<li><p>最終的なインタラクションレイヤの管理にはParlantを使用し、出力がビジネスルールに従い、解釈可能であることを保証します。</p></li>
<li><p>Milvusをベクターデータベースの基盤として使用し、システム全体でリアルタイムの意味検索、記憶、知識検索を実現する。</p></li>
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
    </button></h2><p>LLM エージェントが実験から本番へと移行するにつれ、もはや重要な問題は、何ができるかということではなく、いかに確実かつ安全にそれを実行できるかということである。Parlantはその信頼性のための構造と制御を提供し、Milvusはすべてを高速に保ち、コンテキストを認識するスケーラブルなベクトルインフラストラクチャを提供する。</p>
<p>この2つを組み合わせることで、開発者は、単に能力があるだけでなく、信頼でき、説明可能で、生産可能なAIエージェントを構築することができます。</p>
<p>🚀<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> GitHubでParlantを</a>チェックし、<a href="https://milvus.io"> Milvusと</a>統合して、独自のインテリジェントなルール駆動エージェントシステムを構築してください。</p>
<p>質問がある、またはどの機能についても深く知りたいですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
