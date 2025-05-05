---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: Qwen 3とmilvusのハンズオン：最新のハイブリッド推論モデルでRAGを構築する
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Qwen 3モデルの主な機能を共有し、Qwen
  3とMilvusを組み合わせて、ローカルでコストを考慮した検索支援システム（RAG）を構築するプロセスをご案内します。
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>実用的なAIツールを常に求める開発者として、私はAlibaba Cloudの最新リリースである<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>モデルファミリーの話題を無視することはできなかった。このプロジェクトはわずか12時間で<strong>17,000以上のGitHubスターを</strong>獲得し、Hugging Faceでは1時間あたり<strong>23,000ダウンロードの</strong>ピークに達した。</p>
<p>では、今回は何が違うのか？一言で言えば、Qwen 3のモデルは、推論（ゆっくり、思慮深い回答）と非推論（速く、効率的な回答）の両方を単一のアーキテクチャで組み合わせ、多様なモデルオプション、強化されたトレーニングとパフォーマンスを含み、よりエンタープライズ対応の機能を提供します。</p>
<p>この投稿では、Qwen 3モデルの注目すべき主な機能を要約し、Qwen 3とMilvusをペアリングして、ローカルでコストを考慮した検索補強世代（RAG）システムを構築するプロセスを、ハンズオンコードとパフォーマンス対レイテンシを最適化するためのヒントとともにご案内します。</p>
<p>さっそく見てみよう。</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Qwen 3の魅力とは？<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen 3をテストし、掘り下げた結果、スペックシート上の数字が大きいだけではないことが明らかになった。より速く、よりスマートに、よりコントロールしやすく。以下が顕著な点である。</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1.ハイブリッド思考モード：必要なときは賢く、必要でないときは速く</h3><p>Qwen 3の最も革新的な機能の一つは、<strong>ハイブリッド推論アーキテクチャ</strong>です。これにより、タスクごとにモデルがどの程度 "考える "かを、きめ細かくコントロールできるようになりました。すべてのタスクに複雑な推論が必要なわけではありません。</p>
<ul>
<li><p>深い分析が必要な複雑な問題では、遅くても推論能力をフルに活用することができる。</p></li>
<li><p>日常的な単純なクエリーには、より高速で軽快なモードに切り替えることができます。</p></li>
<li><p>さらに、セッションで消費する計算量やトークンの上限を設定する<strong>「思考予算</strong>」を設定することもできる。</p></li>
</ul>
<p>これは単なるラボ機能ではない。インフラコストやユーザーレイテンシーを増大させることなく、高品質なレスポンスを提供するという、開発者が日々頭を悩ませるトレードオフに直接対処することができます。</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2.多彩なラインナップ：さまざまなニーズに対応するMoEと高密度モデル</h3><p>Qwen 3 は、さまざまな運用ニーズに対応するよう設計された、幅広いモデルを提供します：</p>
<ul>
<li><p><strong>つのMoE（Mixture of Experts）モデル</strong>：</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 総パラメーター数 2,350 億、クエリーあたりのアクティブ数 220 億</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 総パラメーター数300億、アクティブ数30億</p></li>
</ul></li>
<li><p><strong>6つの高密度モデル</strong>：0.6Bの軽快なものから32Bの膨大なパラメータまで。</p></li>
</ul>
<p><em>簡単な技術的背景密度が高いモデル（GPT-3やBERTなど）は、常に全パラメーターを発動するため、重くなるが、予測しやすくなることもある。</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>MoEモデルは、</em></a> <em>一度にネットワークの一部だけをアクティブにするため、規模が大きくなるほど効率が良くなる。</em></p>
<p>実際には、このように多彩なモデルをラインナップすることで、次のことが可能になります：</p>
<ul>
<li><p>高密度モデルは、（組み込み機器のような）タイトで予測可能なワークロードに使用します。</p></li>
<li><p>クラウド料金を無駄にすることなく、ヘビー級の機能が必要な場合は、MoEモデルを使用する。</p></li>
</ul>
<p>このようなラインアップがあれば、軽量でエッジレディなセットアップから強力なクラウドスケールの展開まで、単一のモデルタイプに縛られることなく、展開をカスタマイズすることができます。</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3.効率性と実世界での展開に注力</h3><p>Qwen 3は、モデルサイズの拡張のみに注力するのではなく、トレーニングの効率性とデプロイの実用性に重点を置いています：</p>
<ul>
<li><p>Qwen 2.5 の 2 倍となる<strong>36 兆トークンで学習</strong>。</p></li>
<li><p>Qwen 2.5の2倍と<strong>なる</strong>36兆トークンで学習<strong>。パラメータは235Bまで拡張さ</strong>れたが、MoE技術によりスマートに管理され、能力とリソース需要のバランスをとる。</p></li>
<li><p><strong>展開の最適化</strong>- 動的量子化（FP4からINT8へ）により、控えめなインフラで最大のQwen 3モデルを実行することができます。</p></li>
</ul>
<p>ここでの目標は明確で、不釣り合いなインフラ投資を必要とせずに、より強力なパフォーマンスを実現することです。</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4.真の統合のために構築：MCP サポートと多言語機能</h3><p>Qwen 3 は、単体のモデル性能だけでなく、統合を念頭に置いて設計されています：</p>
<ul>
<li><p><strong>MCP (Model Context Protocol)との互換性により</strong>、外部データベース、API、ツール とのシームレスな統合が可能になり、複雑なアプリケーションのエンジニアリングオーバーヘッ ドを削減します。</p></li>
<li><p><strong>Qwen-Agentは</strong>、ツール呼び出しとワークフローオーケストレーションを強化し、よりダイナミックで実用的なAIシステムの構築をサポートします。</p></li>
<li><p><strong>119の言語と方言にわたる多言語サポートにより</strong>、Qwen 3はグローバル市場や多言語市場をターゲットとするアプリケーションにとって強力な選択肢となります。</p></li>
</ul>
<p>これらの機能により、開発者は、モデル周りの大規模なカスタムエンジニアリングを必要とすることなく、プロダクショングレードのシステムを容易に構築することができます。</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 が DeepSearcher でサポートされました。<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>は、深い検索とレポート生成のためのオープンソースプロジェクトで、OpenAI の Deep Research に代わるローカルファーストのものとして設計されています。開発者は、プライベートまたはドメイン固有のデータソースから、高品質でコンテキストを意識した情報を検索するシステムを構築することができます。</p>
<p>DeepSearcherは現在、Qwen 3のハイブリッド推論アーキテクチャをサポートしており、開発者は推論を動的に切り替えることができます。</p>
<p>DeepSearcherは、Zillizのエンジニアによって開発された高性能ベクトルデータベース<a href="https://milvus.io"> Milvusと</a>統合され、ローカルデータに対する高速かつ正確な意味検索を提供します。モデルの柔軟性と組み合わせることで、開発者はシステムの動作、コスト、ユーザーエクスペリエンスをより自由にコントロールすることができます。</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">ハンズオンチュートリアルQwen 3とmilvusによるRAGシステムの構築<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ベクターデータベースを使用して RAG システムを構築することで、Qwen 3 モデルを実際に使用してみましょう。</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">環境を整える。</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>注：Alibaba CloudからAPI Keyを取得する必要があります。</p>
<h3 id="Data-Preparation" class="common-anchor-header">データの準備</h3><p>Milvusのドキュメントページを主な知識ベースとして使用します。</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">モデルのセットアップ</h3><p>DashScope の OpenAI 互換 API を使用して Qwen 3 にアクセスします：</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>テスト埋め込みを生成し、その寸法と最初のいくつかの要素を出力してみましょう：</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>出力</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Milvusコレクションの作成</h3><p>Milvusベクターデータベースを設定しましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>MilvusClientパラメータ設定について</p>
<ul>
<li><p>URIをローカルファイル(例:<code translate="no">./milvus.db</code>)に設定すると、自動的にMilvus Liteを使用してそのファイルにすべてのデータを保存するため、最も便利な方法です。</p></li>
<li><p>大規模なデータの場合は、DockerやKubernetes上に、より強力なMilvusサーバを設置することができます。この場合、サーバのURI（例：<code translate="no">http://localhost:19530</code> ）をURIとして使用します。</p></li>
<li><p>また、Milvusのマネージドサービスである<a href="https://zilliz.com/cloud">Zilliz Cloudを </a>利用する場合は、Zilliz CloudのPublic EndpointとAPIキーに対応するURIとtokenを調整してください。</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">コレクションにドキュメントを追加する</h3><p>テキストチャンクの埋め込みを作成し、Milvusに追加する：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>出力する：</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">RAGクエリシステムの構築</h3><p>さて、いよいよエキサイティングな部分です - 質問に答えるためにRAGシステムをセットアップしてみましょう。</p>
<p>Milvusに関する一般的な質問を指定してみましょう：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>この質問をコレクションで検索し、意味的に一致する上位3つの結果を取得します：</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>このクエリの検索結果を見てみましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">LLMを使ってRAGレスポンスを構築する</h3><p>検索されたドキュメントを文字列フォーマットに変換する：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>大規模言語モデルのシステム・プロンプトとユーザ・プロンプトを提供する：</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>最新のQwenモデルを使って、プロンプトに基づいたレスポンスを生成する：</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">推論モードと非推論モードの比較：実用的なテスト<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>数学の問題で2つの推論モードを比較するテストを行った：</p>
<p><strong>問題：</strong>AさんとBさんが同じ場所から走り出した。Aが先に出発し、時速5kmで2時間走る。Bは時速15kmで後に続く。Bが追いつくのに何時間かかりますか？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>推論モードを有効にした場合</strong></p>
<ul>
<li><p>処理時間：～74.83秒</p></li>
<li><p>深い分析、問題の解析、複数の解決パス</p></li>
<li><p>数式を含む高品質のマークダウン出力</p></li>
</ul>
<p>(下の画像は、読者の便宜のために、モデルのマークダウン回答を視覚化したスクリーンショットです)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>非推論モード：</strong></p>
<p>コードでは<code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>この問題に対する非推論モードの結果：</p>
<ul>
<li>処理時間：～74.83秒</li>
<li>深い分析，問題の解析，複数の解決パス</li>
<li>数式を含む高品質のマークダウン出力</li>
</ul>
<p>(下の画像は、読者の便宜のために、モデルのマークダウン回答の視覚化のスクリーンショットです)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Qwen 3は、GenAI開発の実世界のニーズにうまく合致する柔軟なモデルアーキテクチャを導入しています。様々なモデルサイズ（密なモデルとMoEモデルの両方を含む）、ハイブリッド推論モード、MCP統合、多言語サポートにより、開発者はユースケースに応じてパフォーマンス、レイテンシー、コストを調整するためのより多くのオプションを得ることができる。</p>
<p>Qwen 3は、規模だけを強調するのではなく、適応性を重視している。そのため、推論能力とコスト効率の高い運用の両方を必要とするRAGパイプライン、<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">AIエージェント</a>、プロダクション・アプリケーションの構築に実用的な選択肢となる。</p>
<p>高性能なオープンソースのベクトルデータベースである<a href="https://milvus.io"> Milvus の</a>ようなインフラと組み合わせることで、Qwen 3 の機能はさらに有用になり、高速なセマンティック検索やローカルデータシステムとのスムーズな統合が可能になります。これらを組み合わせることで、インテリジェントで応答性の高いGenAIアプリケーションをスケールアップするための強力な基盤を提供します。</p>
