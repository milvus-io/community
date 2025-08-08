---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: GPT-ossとo4-miniの比較：エッジ・レディ、オンパー・パフォーマンス - 信頼性が高く、驚異的ではない
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: OpenAIは、gpt-oss-120bとgpt-oss-20bという2つの推論モデルをオープンソース化し、スポットライトを浴びた。
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>AIの世界が熱くなっている。わずか数週間の間に、AnthropicはClaude 4.1 Opusを発表し、DeepMindはGenie 3ワールド・シミュレーターで皆を驚かせた。そして今、OpenAIは2つの推論モデル、<a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120bと</a> <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20bを</a>オープンソース化し、スポットライトを浴びた。</p>
<p>ローンチ後、これらのモデルは瞬時にHugging Faceのトレンド1位に躍り出たが、それには理由がある。これは、OpenAIが実際に生産可能なオープンウェイトモデルをリリースした2019年以来初めてのことである。何年もAPIのみのアクセスを推進してきたOpenAIは、ベンチマークと開発者のワークフローの両方を支配してきたDeepSeek、MetaのLLaMA、Qwenのようなオープンソースのリーダーからの圧力に明らかに応えている。</p>
<p>この投稿では、GPT-ossの特徴、DeepSeek R1やQwen 3などの主要なオープン・モデルとの比較、そして開発者が関心を持つべき理由を探ります。また、GPT-ossと最も人気のあるオープンソースのベクターデータベースであるMilvusを使用した推論可能なRAGシステムの構築についても説明します。</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">GPT-ossの特徴と気になる理由<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-ossは、単なるウェイトドロップではありません。GPT-ossは、開発者にとって重要な5つの主要分野で成果を上げています：</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: エッジデプロイメントのために構築されている</h3><p>GPT-ossには、戦略的なサイズの2つのバリエーションがあります：</p>
<ul>
<li><p>GPT-oss-120b: 合計117B、トークンあたり5.1Bアクティブ</p></li>
<li><p>gpt-oss-20b：合計21B、トークンあたり3.6Bアクティブ</p></li>
</ul>
<p>MoE(Mixture-of-Experts)アーキテクチャを使用することで、推論中はパラメータのサブセットのみがアクティブになる。このため、どちらのモデルもそのサイズに比べて軽量に実行できる：</p>
<ul>
<li><p>gpt-oss-120bは80GBのGPU (H100)1つで動作します。</p></li>
<li><p>gpt-oss-20bは16GBのVRAMに収まるため、ハイエンドのラップトップやエッジデバイスで動作します。</p></li>
</ul>
<p>OpenAIのテストによると、gpt-oss-20bは推論のための最速のOpenAIモデルであり、低レイテンシの展開やオフラインの推論エージェントに最適です。</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2：強力なベンチマーク性能</h3><p>OpenAIの評価によると</p>
<ul>
<li><p><strong>gpt-oss-120bは</strong>推論、ツールの使用、コンペティションコーディング（Codeforces、MMLU、TauBench）においてo4-miniとほぼ同等のパフォーマンスです。</p></li>
<li><p><strong>gpt-oss-20bは</strong>o3-miniと競合し、数学とヘルスケアの推論では上回っています。</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3：コスト効率の良いトレーニング</h3><p>OpenAIは、o3-miniやo4-miniと同等のパフォーマンスでありながら、トレーニングコストは劇的に低いとしています：</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>：210万H100時間 → ～1000万ドル</p></li>
<li><p><strong>gpt-oss-20b</strong>：21万H100時間 → ～100万ドル</p></li>
</ul>
<p>GPT-4のようなモデルの背後にある数億ドルの予算と比較してください。GPT-ossは、効率的なスケーリングとアーキテクチャの選択により、大規模なカーボンフットプリントを出さずに競争力のあるパフォーマンスを実現できることを証明しています。</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4：真のオープンソースの自由</h3><p>GPT-ossはApache 2.0ライセンスを使用しています：</p>
<ul>
<li><p>商用利用可</p></li>
<li><p>完全な改変と再配布の権利</p></li>
<li><p>使用制限やコピーレフト条項なし</p></li>
</ul>
<p>これは本当にオープンソースであり、研究専用のリリースではありません。ドメインに特化した使用のために微調整し、完全なコントロールのもとで実運用にデプロイし、それを中心に商用製品を構築することができます。主な機能には、設定可能な推論の深さ（低/中/高）、思考の連鎖の完全な可視性、構造化された出力をサポートするネイティブのツール呼び出しが含まれます。</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: GPT-5プレビューの可能性</h3><p>OpenAIはすべてを公開していませんが、アーキテクチャの詳細から、<strong>GPT-5の</strong>方向性をプレビューする可能性があります：</p>
<ul>
<li><p>入力ごとに4人のエキスパートを持つMoEを使用</p></li>
<li><p>密な注意と局所的な疎な注意を交互に繰り返す（GPT-3パターン）</p></li>
<li><p>より多くの注意ヘッドが特徴</p></li>
<li><p>興味深いことに、GPT-2のバイアス・ユニットがカムバックしている</p></li>
</ul>
<p>GPT-ossは、次に何が起こるかについてのシグナルに注目しているのであれば、これまでで最も明確な公開ヒントになるかもしれない。</p>
<h3 id="Core-Specifications" class="common-anchor-header">コアスペック</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>モデル</strong></td><td><strong>総パラム数</strong></td><td><strong>アクティブパラム数</strong></td><td><strong>エキスパート</strong></td><td><strong>コンテキスト長</strong></td><td><strong>VRAM 要求</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>どちらのモデルもo200k_harmonyトークナイザーを使用し、128,000トークンのコンテキスト長（およそ96,000～100,000語）をサポートしている。</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-ossと他の推論モデルの比較<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-ossがOpenAIの内部モデルやオープンソースのトップクラスの競合モデルとどのように比較しているか紹介します：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>モデル</strong></td><td><strong>パラメータ（アクティブ）</strong></td><td><strong>メモリ</strong></td><td><strong>強み</strong></td></tr>
<tr><td><strong>GPT-oss-120B</strong></td><td>117B（アクティブ5.1B）</td><td>80GB</td><td>シングルGPU、オープン推論</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B（3.6Bアクティブ）</td><td>16GB</td><td>エッジ展開、高速推論</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B（～37Bアクティブ）</td><td>分散型</td><td>ベンチマークリーダー、実証済みのパフォーマンス</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>専有</td><td>APIのみ</td><td>強力な推論（クローズド）</td></tr>
<tr><td><strong>o3-ミニ（API）</strong></td><td>プロプライエタリ</td><td>APIのみ</td><td>軽量推論（クローズド）</td></tr>
</tbody>
</table>
<p>様々なベンチマークモデルに基づくと、以下のようになりました：</p>
<ul>
<li><p><strong>GPT-ossとOpenAIの独自モデルの比較：</strong>gpt-oss-120bは、競技数学（AIME）、コーディング（Codeforces）、ツール使用（TauBench）でo4-miniに匹敵します。20bモデルは、はるかに小さいにもかかわらず、o3-miniと同様のパフォーマンスを示しています。</p></li>
<li><p><strong>GPT-ossとDeepSeek R1の比較：</strong>純粋な性能ではDeepSeek R1が優位ですが、分散インフラが必要です。GPT-ossはよりシンプルなデプロイを提供し、120bモデルでは分散セットアップが不要です。</p></li>
</ul>
<p>要約すると、GPT-ossは、パフォーマンス、オープンアクセス、およびデプロイ可能性の最高の組み合わせを提供します。純粋なパフォーマンスではDeepSeek R1が勝っていますが、GPT-ossはほとんどの開発者にとって最適なバランスを保っています。</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">ハンズオンGPT-oss + Milvusでの構築<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss が何をもたらすかを見てきたところで、いよいよ実際に使ってみましょう。</p>
<p>以下のセクションでは、gpt-oss-20b と Milvus を使って推論可能な RAG システムを構築するハンズオンチュートリアルを行います。</p>
<h3 id="Environment-Setup" class="common-anchor-header">環境セットアップ</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">データセットの準備</h3><p>Milvusのドキュメントをナレッジベースとして使用します：</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">モデルのセットアップ</h3><p><a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouterを通して</a>GPT-ossにアクセスします（またはローカルで実行します）。<a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouterは</strong></a>、開発者が単一の統一されたAPIを通じて複数のAIモデル（GPT-4、Claude、Mistralなど）にアクセスし、切り替えることを可能にするプラットフォームです。モデルを比較したり、異なるAIプロバイダーと連携するアプリを構築したりするのに便利だ。GPT-ossシリーズがOpenRouterで利用可能になりました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Milvusベクトルデータベースの設定について</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>MilvusClientのパラメータ設定について：</p>
<ul>
<li><p>URIをローカルファイル（例：<code translate="no">./milvus.db</code> ）に設定すると、自動的にMilvus Liteを使用してそのファイルにすべてのデータを保存するため、最も便利な方法です。</p></li>
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
<p>出力します：</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAGクエリパイプライン</h3><p>それでは、エキサイティングな部分である、質問に答えるためにRAGシステムをセットアップしてみましょう。</p>
<p>Milvusに関する一般的な質問を指定してみましょう：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>コレクションでこの質問を検索し、意味的に一致する上位3つの結果を取得します：</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>このクエリの検索結果を見てみましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">GPT-ossを使ってRAGレスポンスを構築する</h3><p>検索されたドキュメントを文字列フォーマットに変換する：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>大きな言語モデルに対してシステムプロンプトとユーザープロンプトを提供する：</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>最新のgpt-ossモデルを使用して、プロンプトに基づいたレスポンスを生成する：</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">GPT-ossの最終的な感想<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-ossは、オープンソースはもう無視できないというOpenAIの静かな告白である。それはDeepSeek R1やQwen 3や他の多くのモデルを吹き飛ばすものではありませんが、それらにないものをもたらします：OpenAIのトレーニングパイプラインは、あなたが実際に検査し、ローカルで実行できるモデルに適用されます。</p>
<p><strong>パフォーマンスは？堅実です。驚異的ではないが、信頼できる。</strong>20Bのモデルがコンシューマー向けハードウェア、あるいはLM Studioでモバイルで動作することは、開発者にとって実際に重要な実用的な利点だ。これは、"すごい、これですべてが変わる "というよりも、"これだけで動く "という感じだ。そして正直なところ、それでいいのだ。</p>
<p><strong>しかし、足りないのは多言語サポートだ。</strong>英語以外で作業している場合、奇妙な言い回しやスペルの問題、一般的な混乱にぶつかるだろう。このモデルは明らかに英語優先のレンズでトレーニングされている。グローバルなカバレッジが重要なら、多言語データセットで微調整する必要があるだろう。</p>
<p>しかし、最も興味深いのはそのタイミングだ。OpenAIのXでのティーザーは、"LIVESTREAM "の中に "5 "を入れたもので、仕組まれたもののように感じられる。GPT-ossはメインではないかもしれないが、GPT-5で何が起こるかのプレビューかもしれない。同じ素材、違うスケール。待ちましょう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>本当の勝利は、質の高い選択肢が増えることだ。</strong>競争はイノベーションを促進し、OpenAIがオープンソース開発に再参入することは、誰にとってもメリットがある。GPT-ossをあなたの特定の要件と照らし合わせてテストしてください。しかし、ブランド認知度ではなく、あなたのユースケースで実際に機能するものに基づいて選択してください。</p>
