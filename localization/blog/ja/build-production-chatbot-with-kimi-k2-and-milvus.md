---
id: build-production-chatbot-with-kimi-k2-and-milvus.md
title: Kimi K2とmilvusでプロダクショングレードのチャットボットを構築する
author: Lumina Wang
date: 2025-06-25T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_06_40_46_PM_a262e721ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, AI Agents, LLM, Kimi'
meta_keywords: 'Kimi K2, Milvus, AI agents, semantic search, tool calling'
meta_title: |
  Build a Production-Grade Chatbot with Kimi K2 and Milvus
desc: >-
  ファイル自動処理、セマンティック検索、インテリジェントなQ&amp;Aを実現するAIエージェントを、Kimi
  K2とMilvusがどのように開発したかをご紹介します。
origin: 'https://milvus.io/blog/build-production-chatbot-with-kimi-k2-and-milvus.md'
---
<p><a href="https://moonshotai.github.io/Kimi-K2/">キミK2が</a>最近話題になっているが、それには理由がある。Hugging Faceの共同設立者や他の業界リーダーたちは、多くの分野でGPT-4やClaudeなどのトップクラスのクローズドモデルと同等のパフォーマンスを発揮するオープンソースモデルとして賞賛している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/huggingface_leader_twitter_b96c9d3f21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>キミK2には、2つの画期的な利点がある：</strong></p>
<ul>
<li><p><strong>最先端のパフォーマンス</strong>：K2 は、AIME2025 などの主要ベンチマークでトップクラスの結果を達成し、ほとんどの次元で Grok-4 などのモデルを常に凌駕しています。</p></li>
<li><p><strong>堅牢なエージェント機能</strong>：K2は、単にツールを呼び出すだけでなく、いつツールを使用するか、タスクの途中でどのようにツールを切り替えるか、そしていつツールの使用を停止するかを知っています。これは、実世界での深刻なユースケースを切り開きます。</p></li>
</ul>
<p>ユーザーテストによれば、Kimi K2のコーディング能力はすでにClaude 4に匹敵し、そのコストは約20％である。さらに重要なのは、<strong>自律的なタスクプランニングとツール使用を</strong>サポートしていることだ。あなたが利用可能なツールを定義すると、K2がそれをいつ、どのように使うかを処理するため、微調整やオーケストレーションレイヤーは必要ない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Kimi_k2_performance_550ffd5c61.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>また、OpenAIとAnthropic互換のAPIをサポートしており、Claude Codeのようなこれらのエコシステム用に構築されたものを直接Kimi K2に統合することができる。Moonshot AIがエージェントワークロードをターゲットにしていることは明らかだ。</p>
<p>このチュートリアルでは、<strong>Kimi K2とmilvusを使って本番レベルのチャットボットを</strong>構築する方法を紹介する。このチャットボットは、ファイルのアップロード、インテリジェントなQ&amp;Aの実行、ベクトル検索によるデータ管理ができるようになり、手作業によるチャンキング、スクリプトの埋め込み、微調整の必要性がなくなります。</p>
<h2 id="What-We’ll-Build" class="common-anchor-header">何を作るか<button data-href="#What-We’ll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Kimi K2の推論機能とMilvusのベクトルデータベースのパフォーマンスを組み合わせることで、インテリジェントなチャットボットを構築します。このシステムは、エンジニアが実際に必要とする3つのコアワークフローを処理します：</p>
<ol>
<li><p><strong>自動ファイル処理とチャンキング</strong>- 様々な形式のドキュメントをアップロードし、システムがインテリジェントに検索可能なチャンクに分割します。</p></li>
<li><p><strong>セマンティック検索</strong>- キーワードのマッチングではなく、自然言語のクエリを使用して関連情報を検索します。</p></li>
<li><p><strong>インテリジェントな意思決定</strong>- アシスタントが文脈を理解し、各タスクに適したツールを自動的に選択します。</p></li>
</ol>
<p>システム全体は、たった2つの主要なクラスを中心に構築されているため、理解、変更、拡張が容易です：</p>
<ul>
<li><p><strong>VectorDatabaseクラス</strong>：これはデータ処理の主力です。Milvusベクターデータベースに関連するすべての処理-コレクションの接続、作成からファイルのチャンキング、類似検索の実行まで-を行います。</p></li>
<li><p><strong>SmartAssistantクラス</strong>：システムの頭脳と考えてください。ユーザーが何を求めているかを理解し、どのツールを使えば仕事ができるかを判断します。</p></li>
</ul>
<p>ユーザーが自然言語を使ってSmartAssistantとチャットする。アシスタントは、Kimi K2の推論能力を活用してリクエストを分解し、Milvusベクトル・データベースと対話するために7つの専門ツール機能を編成する。それは、あなたが何を求めているかに基づいて、どのデータベース操作を実行すべきかを正確に知っているスマートコーディネーターを持つようなものです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chatbot_architecture_ea73cac6ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Prerequisites-and-Setup" class="common-anchor-header">前提条件とセットアップ<button data-href="#Prerequisites-and-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>コードに飛び込む前に、以下の準備が整っていることを確認してください：</p>
<p><strong>システム要件</strong></p>
<ul>
<li><p>Python 3.8以上</p></li>
<li><p>Milvusサーバー（ポート19530のローカルインスタンスを使用します。）</p></li>
<li><p>ドキュメント処理用に4GB以上のRAM</p></li>
</ul>
<p><strong>必要なAPIキー</strong></p>
<ul>
<li><p><a href="https://platform.moonshot.cn/">Moonshot AIからの</a>Kimi APIキー</p></li>
<li><p>テキスト埋め込み用のOpenAI APIキー（text-embedding-3-smallモデルを使用します。）</p></li>
</ul>
<p><strong>クイックインストール</strong></p>
<pre><code translate="no">pip install pymilvus openai numpy
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvusをローカルで起動する：</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Using Docker (recommended)</span>
docker run -d --name milvus -p <span class="hljs-number">19530</span>:<span class="hljs-number">19530</span> milvusdb/milvus:latest

<span class="hljs-comment"># Or download and run the standalone version from milvus.io</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Import-Libraries-and-Basic-Configuration" class="common-anchor-header">ライブラリのインポートと基本設定<button data-href="#Import-Libraries-and-Basic-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>ここでは、pymilvusがMilvusベクトルデータベース操作のためのライブラリであり、openaiがKimiとOpenAIのAPIを呼び出すために使用される（Kimi K2のOpenAIとAnthropicとのAPI互換性の利点がここで明らかになる）。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> re
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Processing-VectorDatabase-Class" class="common-anchor-header">データ処理VectorDatabaseクラス<button data-href="#Data-Processing-VectorDatabase-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>これはシステム全体のデータ処理の中核であり、ベクトルデータベースとのすべてのやり取りを担当する。大きく2つのモジュールに分けられる：<strong>Milvusベクトルデータベース操作とファイル処理システムです。</strong></p>
<p>このクラスは純粋にデータ操作に特化し、インテリジェンスはSmartAssistantクラスに任せています。これにより、コードの保守性とテスト性が向上します。</p>
<h3 id="Milvus-Vector-Database-Operations" class="common-anchor-header">Milvusベクトルデータベース操作</h3><h4 id="Initialization-Method" class="common-anchor-header"><strong>初期化メソッド</strong></h4><p>ベクトル次元を1536に設定したtext-embedding-3-smallモデルを使用して、テキストベクトル化のためのOpenAIクライアントを作成します。</p>
<p>また、MilvusクライアントをNoneとして初期化し、必要に応じて接続を作成します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔧 Initializing vector database components...&quot;</span>)
    
    <span class="hljs-comment"># OpenAI client for generating text vectors</span>
    <span class="hljs-variable language_">self</span>.openai_client = OpenAI(api_key=openai_api_key)
    <span class="hljs-variable language_">self</span>.vector_dimension = <span class="hljs-number">1536</span>  <span class="hljs-comment"># Vector dimension for OpenAI text-embedding-3-small</span>
    
    <span class="hljs-comment"># Milvus client</span>
    <span class="hljs-variable language_">self</span>.milvus_client = <span class="hljs-literal">None</span>
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Vector database component initialization complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Text-Vectorization" class="common-anchor-header"><strong>テキストのベクトル化</strong></h4><p>OpenAIの埋め込みAPIを呼び出してテキストをベクトル化し、1536次元のベクトル配列を返します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_vector</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Convert text to vector&quot;&quot;&quot;</span>
    response = <span class="hljs-variable language_">self</span>.openai_client.embeddings.create(
        <span class="hljs-built_in">input</span>=[text],
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    )
    <span class="hljs-keyword">return</span> response.data[<span class="hljs-number">0</span>].embedding
<button class="copy-code-btn"></button></code></pre>
<h4 id="Database-Connection" class="common-anchor-header"><strong>データベース接続</strong></h4><p>ポート19530にあるローカルデータベースへのMilvusClient接続を作成し、統一された結果辞書フォーマットを返します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">connect_database</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Connect to Milvus vector database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-variable language_">self</span>.milvus_client = MilvusClient(
            uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>
        )
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Successfully connected to Milvus vector database&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Connection failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-Collection" class="common-anchor-header"><strong>コレクションの作成</strong></h4><ul>
<li><p><strong>重複チェック</strong>同じ名前のコレクションを作成しないようにします。</p></li>
<li><p><strong>構造の定義</strong>3つのフィールド: id (主キー)、text (テキスト)、vector (ベクトル)</p></li>
<li><p><strong>インデックスの作成</strong> <code translate="no">IVF_FLAT</code> アルゴリズムと余弦類似度を使用して検索効率を向上</p></li>
<li><p><strong>自動ID</strong>：システムが自動的に一意の識別子を生成</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_collection</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, description: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Create document collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Check if collection already exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client.has_collection(collection_name):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> already exists&quot;</span>}
        
        <span class="hljs-comment"># Define collection structure</span>
        schema = <span class="hljs-variable language_">self</span>.milvus_client.create_schema(
            auto_id=<span class="hljs-literal">True</span>,
            enable_dynamic_field=<span class="hljs-literal">False</span>,
            description=description
        )
        
        <span class="hljs-comment"># Add fields</span>
        schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.vector_dimension)
        
        <span class="hljs-comment"># Create index parameters</span>
        index_params = <span class="hljs-variable language_">self</span>.milvus_client.prepare_index_params()
        index_params.add_index(
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}
        )
        
        <span class="hljs-comment"># Create collection</span>
        <span class="hljs-variable language_">self</span>.milvus_client.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params
        )
        
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully created collection <span class="hljs-subst">{collection_name}</span>&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to create collection: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Add-Documents-to-Collection" class="common-anchor-header"><strong>ドキュメントをコレクションに追加</strong></h4><p>全文書のベクトル表現を生成し、Milvusが要求する辞書形式にアセンブルした後、バッチデータ挿入を行い、最後に挿入カウントとステータス情報を返す。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">add_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, documents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Add documents to collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Generate vectors for each document</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents...&quot;</span>)
        vectors = []
        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(doc)
            vectors.append(vector)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (doc, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(documents, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: doc,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data</span>
        result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully added <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(result[<span class="hljs-string">&quot;insert_count&quot;</span>]) <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;insert_count&quot;</span> <span class="hljs-keyword">in</span> result <span class="hljs-keyword">else</span> <span class="hljs-built_in">len</span>(documents)
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to add documents: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Search-Similar-Documents" class="common-anchor-header"><strong>類似文書の検索</strong></h4><p>ユーザーの質問を1536次元のベクトルに変換し、コサインを使用して意味的類似度を計算し、類似度の降順で最も関連性の高いドキュメントを返します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, query: <span class="hljs-built_in">str</span>, limit: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Search similar documents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Convert query text to vector</span>
        query_vector = <span class="hljs-variable language_">self</span>.generate_vector(query)
        
        <span class="hljs-comment"># Search parameters</span>
        search_params = {
            <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
            <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}
        }
        
        <span class="hljs-comment"># Execute search</span>
        results = <span class="hljs-variable language_">self</span>.milvus_client.search(
            collection_name=collection_name,
            data=[query_vector],
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            search_params=search_params,
            limit=limit,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )
        
        <span class="hljs-comment"># Organize search results</span>
        found_docs = []
        <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:  <span class="hljs-comment"># Take results from first query</span>
            found_docs.append({
                <span class="hljs-string">&quot;text&quot;</span>: result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>],
                <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{(<span class="hljs-number">1</span> - result[<span class="hljs-string">&#x27;distance&#x27;</span>]) * <span class="hljs-number">100</span>:<span class="hljs-number">.1</span>f}</span>%&quot;</span>
            })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(found_docs)}</span> relevant documents&quot;</span>,
            <span class="hljs-string">&quot;query&quot;</span>: query,
            <span class="hljs-string">&quot;results&quot;</span>: found_docs
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Search failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Query-Collections" class="common-anchor-header"><strong>コレクションを検索</strong></h4><p>コレクション名、ドキュメント数、説明情報を取得します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">list_all_collections</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Query all collections in database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Get all collection names</span>
        collections = <span class="hljs-variable language_">self</span>.milvus_client.list_collections()
        
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> collections:
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;No collections in database&quot;</span>,
                <span class="hljs-string">&quot;collections&quot;</span>: []
            }
        
        <span class="hljs-comment"># Get detailed information for each collection</span>
        collection_details = []
        <span class="hljs-keyword">for</span> collection_name <span class="hljs-keyword">in</span> collections:
            <span class="hljs-keyword">try</span>:
                <span class="hljs-comment"># Get collection statistics</span>
                stats = <span class="hljs-variable language_">self</span>.milvus_client.get_collection_stats(collection_name)
                doc_count = stats.get(<span class="hljs-string">&quot;row_count&quot;</span>, <span class="hljs-number">0</span>)
                
                <span class="hljs-comment"># Get collection description</span>
                desc_result = <span class="hljs-variable language_">self</span>.milvus_client.describe_collection(collection_name)
                description = desc_result.get(<span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;No description&quot;</span>)
                
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: doc_count,
                    <span class="hljs-string">&quot;description&quot;</span>: description
                })
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: <span class="hljs-string">&quot;Failed to retrieve&quot;</span>,
                    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">f&quot;Error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
                })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Database contains <span class="hljs-subst">{<span class="hljs-built_in">len</span>(collections)}</span> collections total&quot;</span>,
            <span class="hljs-string">&quot;total_collections&quot;</span>: <span class="hljs-built_in">len</span>(collections),
            <span class="hljs-string">&quot;collections&quot;</span>: collection_details
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to query collections: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="32-File-Processing-System" class="common-anchor-header"><strong>3.2 ファイル処理システム</strong></h3><h4 id="Intelligent-Text-Chunking" class="common-anchor-header"><strong>インテリジェントなテキストチャンキング</strong></h4><p><strong>チャンキング戦略：</strong></p>
<ul>
<li><p><strong>段落優先</strong>：段落の整合性を保つため、最初に二重改行で分割</p></li>
<li><p><strong>長い段落の処理</strong>：ピリオド、疑問符、感嘆符で長すぎる段落を分割</p></li>
<li><p><strong>サイズコントロール</strong>：各チャンクが制限を超えないようにする。チャンクの最大サイズは500文字、オーバーラップは50文字とし、分割の境界で重要な情報が失われないようにする。</p></li>
<li><p><strong>意味の保持</strong>：文の途中での分割を避ける</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Split long text into chunks&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Clean text</span>
    text = text.strip()
    
    <span class="hljs-comment"># Split by paragraphs</span>
    paragraphs = [p.strip() <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&#x27;\n\n&#x27;</span>) <span class="hljs-keyword">if</span> p.strip()]
    
    chunks = []
    current_chunk = <span class="hljs-string">&quot;&quot;</span>
    
    <span class="hljs-keyword">for</span> paragraph <span class="hljs-keyword">in</span> paragraphs:
        <span class="hljs-comment"># If current paragraph is too long, needs further splitting</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(paragraph) &gt; chunk_size:
            <span class="hljs-comment"># Save current chunk first</span>
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-comment"># Split long paragraph by sentences</span>
            sentences = re.split(<span class="hljs-string">r&#x27;[。！？.!?]&#x27;</span>, paragraph)
            temp_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-keyword">for</span> sentence <span class="hljs-keyword">in</span> sentences:
                sentence = sentence.strip()
                <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> sentence:
                    <span class="hljs-keyword">continue</span>
                
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(temp_chunk + sentence) &lt;= chunk_size:
                    temp_chunk += sentence + <span class="hljs-string">&quot;。&quot;</span>
                <span class="hljs-keyword">else</span>:
                    <span class="hljs-keyword">if</span> temp_chunk:
                        chunks.append(temp_chunk.strip())
                    temp_chunk = sentence + <span class="hljs-string">&quot;。&quot;</span>
            
            <span class="hljs-keyword">if</span> temp_chunk:
                chunks.append(temp_chunk.strip())
        
        <span class="hljs-comment"># If adding this paragraph won&#x27;t exceed limit</span>
        <span class="hljs-keyword">elif</span> <span class="hljs-built_in">len</span>(current_chunk + paragraph) &lt;= chunk_size:
            current_chunk += paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
        
        <span class="hljs-comment"># If it would exceed limit, save current chunk first, then start new one</span>
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
    
    <span class="hljs-comment"># Save last chunk</span>
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(current_chunk.strip())
    
    <span class="hljs-comment"># Add overlapping content to improve context coherence</span>
    <span class="hljs-keyword">if</span> overlap &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(chunks) &gt; <span class="hljs-number">1</span>:
        overlapped_chunks = []
        <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
            <span class="hljs-keyword">if</span> i == <span class="hljs-number">0</span>:
                overlapped_chunks.append(chunk)
            <span class="hljs-keyword">else</span>:
                <span class="hljs-comment"># Take part of previous chunk as overlap</span>
                prev_chunk = chunks[i-<span class="hljs-number">1</span>]
                overlap_text = prev_chunk[-overlap:] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(prev_chunk) &gt; overlap <span class="hljs-keyword">else</span> prev_chunk
                overlapped_chunk = overlap_text + <span class="hljs-string">&quot;\n&quot;</span> + chunk
                overlapped_chunks.append(overlapped_chunk)
        chunks = overlapped_chunks
    
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h4 id="File-Reading-and-Chunking" class="common-anchor-header"><strong>ファイルの読み込みとチャンキング</strong></h4><p>ユーザーのファイルアップロード（txt、md、py、その他のフォーマット）をサポートし、自動的に異なるエンコーディングフォーマットを試し、詳細なエラーフィードバックを提供します。</p>
<p><strong>メタデータの強化</strong>：source_fileはドキュメントソースを、chunk_indexはチャンクシーケンスインデックスを、total_chunksはチャンクの総数を記録し、整合性の追跡を容易にします。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">read_and_chunk_file</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Read local file and chunk into pieces&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if file exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(file_path):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;File does not exist: <span class="hljs-subst">{file_path}</span>&quot;</span>}
        
        <span class="hljs-comment"># Get file information</span>
        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)
        
        <span class="hljs-comment"># Choose reading method based on file extension</span>
        file_ext = os.path.splitext(file_path)[<span class="hljs-number">1</span>].lower()
        
        <span class="hljs-keyword">if</span> file_ext <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;.txt&#x27;</span>, <span class="hljs-string">&#x27;.md&#x27;</span>, <span class="hljs-string">&#x27;.py&#x27;</span>, <span class="hljs-string">&#x27;.js&#x27;</span>, <span class="hljs-string">&#x27;.html&#x27;</span>, <span class="hljs-string">&#x27;.css&#x27;</span>, <span class="hljs-string">&#x27;.json&#x27;</span>]:
            <span class="hljs-comment"># Text file, try multiple encodings</span>
            encodings = [<span class="hljs-string">&#x27;utf-8&#x27;</span>, <span class="hljs-string">&#x27;gbk&#x27;</span>, <span class="hljs-string">&#x27;gb2312&#x27;</span>, <span class="hljs-string">&#x27;latin-1&#x27;</span>]
            content = <span class="hljs-literal">None</span>
            used_encoding = <span class="hljs-literal">None</span>
            
            <span class="hljs-keyword">for</span> encoding <span class="hljs-keyword">in</span> encodings:
                <span class="hljs-keyword">try</span>:
                    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=encoding) <span class="hljs-keyword">as</span> f:
                        content = f.read()
                    used_encoding = encoding
                    <span class="hljs-keyword">break</span>
                <span class="hljs-keyword">except</span> UnicodeDecodeError:
                    <span class="hljs-keyword">continue</span>
            
            <span class="hljs-keyword">if</span> content <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
                <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Cannot read file, encoding format not supported&quot;</span>}
            
            <span class="hljs-comment"># Split text</span>
            chunks = <span class="hljs-variable language_">self</span>.split_text_into_chunks(content, chunk_size, overlap)
            
            <span class="hljs-comment"># Add metadata to each chunk</span>
            chunk_data = []
            <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
                chunk_data.append({
                    <span class="hljs-string">&quot;text&quot;</span>: chunk,
                    <span class="hljs-string">&quot;source_file&quot;</span>: file_name,
                    <span class="hljs-string">&quot;chunk_index&quot;</span>: i,
                    <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks)
                })
            
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully read and chunked file <span class="hljs-subst">{file_name}</span>&quot;</span>,
                <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks),
                <span class="hljs-string">&quot;chunks&quot;</span>: chunk_data
            }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to read file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Upload-File-to-Collection" class="common-anchor-header"><strong>コレクションへのファイルのアップロード</strong></h4><p>ユーザーがアップロードしたファイルをチャンクするために<code translate="no">read_and_chunk_file</code> を呼び出し、指定されたコレクションに保存するためのベクターを生成します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file_to_collection</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Upload file to specified collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># First read and chunk file</span>
        result = <span class="hljs-variable language_">self</span>.read_and_chunk_file(file_path, chunk_size, overlap)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> result[<span class="hljs-string">&quot;success&quot;</span>]:
            <span class="hljs-keyword">return</span> result
        
        chunk_data = result[<span class="hljs-string">&quot;chunks&quot;</span>]
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunk_data)}</span> text chunks...&quot;</span>)
        
        <span class="hljs-comment"># Generate vectors for each chunk</span>
        vectors = []
        texts = []
        <span class="hljs-keyword">for</span> chunk_info <span class="hljs-keyword">in</span> chunk_data:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(chunk_info[<span class="hljs-string">&quot;text&quot;</span>])
            vectors.append(vector)
            
            <span class="hljs-comment"># Create text with metadata</span>
            enriched_text = <span class="hljs-string">f&quot;[File: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;source_file&#x27;</span>]}</span> | Chunk: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;chunk_index&#x27;</span>]+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;total_chunks&#x27;</span>]}</span>]\n<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>
            texts.append(enriched_text)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (text, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(texts, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: text,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data into collection</span>
        insert_result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully uploaded file <span class="hljs-subst">{result[<span class="hljs-string">&#x27;file_name&#x27;</span>]}</span> to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;file_name&quot;</span>: result[<span class="hljs-string">&quot;file_name&quot;</span>],
            <span class="hljs-string">&quot;file_size&quot;</span>: result[<span class="hljs-string">&quot;file_size&quot;</span>],
            <span class="hljs-string">&quot;total_chunks&quot;</span>: result[<span class="hljs-string">&quot;total_chunks&quot;</span>],
            <span class="hljs-string">&quot;average_chunk_size&quot;</span>: result[<span class="hljs-string">&quot;average_chunk_size&quot;</span>],
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(data),
            <span class="hljs-string">&quot;collection_name&quot;</span>: collection_name
        }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to upload file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Intelligent-Decision-Making-SmartAssistant-Class" class="common-anchor-header">インテリジェントな意思決定：SmartAssistantクラス<button data-href="#Intelligent-Decision-Making-SmartAssistant-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>これはシステムの頭脳であり、インテリジェントな意思決定センターとも呼ばれる。単に定義済みのワークフローを実行するだけでなく、実際にユーザーの意図を理解し、どのツールをいつ使用するかについてインテリジェントな判断を下します。</p>
<p>ここでの設計哲学は、音声コマンドでデータベースを操作するのではなく、知識豊富なアシスタントと会話しているような自然言語インターフェースを作成することです。</p>
<h3 id="Initialization-and-Tool-Definition" class="common-anchor-header"><strong>初期化とツール定義</strong></h3><p>ツール定義の構造は、Kimi K2がネイティブでサポートするOpenAIの関数呼び出し形式に従っています。これは統合をシームレスにし、カスタム解析ロジックなしで複雑なツールのオーケストレーションを可能にします。</p>
<p>基本ツール(4)：</p>
<p><code translate="no">connect_database</code> - データベース接続管理 - コレクション作成 - ドキュメント一括追加 - コレクション管理<code translate="no">create_collection</code><code translate="no">add_documents</code><code translate="no">list_all_collections</code> </p>
<p>検索ツール (1)：</p>
<p><code translate="no">search_documents</code> - 指定コレクション内検索</p>
<p>ファイルツール (2)：</p>
<p><code translate="no">read_and_chunk_file</code> - ファイルのプレビューとチャンキング - ファイルのアップロード処理<code translate="no">upload_file_to_collection</code> </p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, kimi_api_key: <span class="hljs-built_in">str</span>, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Initialize intelligent assistant&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🚀 Starting intelligent assistant...&quot;</span>)
    
    <span class="hljs-comment"># Kimi client</span>
    <span class="hljs-variable language_">self</span>.kimi_client = OpenAI(
        api_key=kimi_api_key,
        base_url=<span class="hljs-string">&quot;https://api.moonshot.cn/v1&quot;</span>
    )
    
    <span class="hljs-comment"># Vector database</span>
    <span class="hljs-variable language_">self</span>.vector_db = VectorDatabase(openai_api_key)
    
    <span class="hljs-comment"># Define available tools</span>
    <span class="hljs-variable language_">self</span>.available_tools = [
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;connect_database&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Connect to vector database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;create_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Create new document collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;description&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection description&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;add_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Add documents to collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;documents&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;array&quot;</span>, <span class="hljs-string">&quot;items&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>}, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Document list&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;documents&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;search_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search similar documents&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;query&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search content&quot;</span>},
                        <span class="hljs-string">&quot;limit&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Number of results&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">5</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;query&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;list_all_collections&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Query information about all collections in database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Read local file and chunk into text blocks&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Upload local file to specified collection, automatically chunk and vectorize&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Target collection name&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>, <span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        }
    ]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Intelligent assistant startup complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="42-Tool-Mapping-and-Execution" class="common-anchor-header"><strong>4.2 ツールのマッピングと実行</strong></h3><p>すべてのツールは、_execute_toolを通じて統一的に実行される。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">_execute_tool</span>(<span class="hljs-params">self, tool_name: <span class="hljs-built_in">str</span>, args: <span class="hljs-built_in">dict</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute specific tool&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> tool_name == <span class="hljs-string">&quot;connect_database&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.connect_database()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;create_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.create_collection(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;add_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.add_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;search_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.search_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;list_all_collections&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.list_all_collections()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.read_and_chunk_file(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.upload_file_to_collection(**args)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Unknown tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="43-Core-Conversation-Engine" class="common-anchor-header"><strong>4.3 コア会話エンジン</strong></h3><p>ここでマジックが起こる。このメソッドはKimiの最新モデル：<a href="https://moonshotai.github.io/Kimi-K2/"> kimi-k2-0711-previewを</a>呼び出し、ユーザーの意図を分析し、必要なツールを自動的に選択して実行し、結果をKimiに返し、最終的にツールの結果に基づいて最終的な回答を生成します。</p>
<p>この機能が特に強力なのは、会話のループです。Kimi K2は複数のツールを連鎖的に呼び出すことができ、中間結果から学習し、発見したことに基づいて戦略を適応させます。これにより、従来のシステムでは複数の手動ステップが必要だった複雑なワークフローが可能になる。</p>
<p><strong>パラメータ設定：</strong></p>
<ul>
<li><p><code translate="no">temperature=0.3</code>:より低い温度で安定したツールコールを実現</p></li>
<li><p><code translate="no">tool_choice=&quot;auto&quot;</code>:ツール使用の可否をキミが自律的に判断</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">execute_command</span>(<span class="hljs-params">self, user_command: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute user command&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📝 User command: <span class="hljs-subst">{user_command}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># Prepare conversation messages</span>
    messages = [
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;&quot;&quot;You are an intelligent assistant that can help users manage vector databases and answer questions.

Intelligent Decision Principles:
1. Prioritize answer speed and quality, choose optimal response methods
2. For general knowledge questions, directly use your knowledge for quick responses
3. Only use database search in the following situations:
   - User explicitly requests searching database content
   - Questions involve user-uploaded specific documents or professional materials
   - Need to find specific, specialized information
4. You can handle file uploads, database management and other tasks
5. Always aim to provide the fastest, most accurate answers

Important Reminders:
- Before executing any database operations, please first call connect_database to connect to the database
- If encountering API limit errors, the system will automatically retry, please be patient

Remember: Don&#x27;t use tools just to use tools, but solve user problems in the optimal way.&quot;&quot;&quot;</span>
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: user_command
        }
    ]
    
    <span class="hljs-comment"># Start conversation and tool calling loop</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Call Kimi model - Add retry mechanism to handle API limits</span>
            max_retries = <span class="hljs-number">5</span>
            retry_delay = <span class="hljs-number">20</span>  <span class="hljs-comment"># seconds</span>
            
            <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(max_retries):
                <span class="hljs-keyword">try</span>:
                    response = <span class="hljs-variable language_">self</span>.kimi_client.chat.completions.create(
                        model=<span class="hljs-string">&quot;kimi-k2-0711-preview&quot;</span>, <span class="hljs-comment">#moonshot-v1-8k</span>
                        messages=messages,
                        temperature=<span class="hljs-number">0.3</span>,
                        tools=<span class="hljs-variable language_">self</span>.available_tools,
                        tool_choice=<span class="hljs-string">&quot;auto&quot;</span>
                    )
                    <span class="hljs-keyword">break</span>  <span class="hljs-comment"># Success, break out of retry loop</span>
                <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;rate_limit&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e).lower() <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;429&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e) <span class="hljs-keyword">and</span> attempt &lt; max_retries - <span class="hljs-number">1</span>:
                        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⏳ Kimi API limit, waiting <span class="hljs-subst">{retry_delay}</span> seconds before retry... (attempt <span class="hljs-subst">{attempt + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{max_retries}</span>)&quot;</span>)
                        time.sleep(retry_delay)
                        retry_delay *= <span class="hljs-number">1.5</span>  <span class="hljs-comment"># Moderately increase delay</span>
                        <span class="hljs-keyword">continue</span>
                    <span class="hljs-keyword">else</span>:
                        <span class="hljs-keyword">raise</span> e
            <span class="hljs-keyword">else</span>:
                <span class="hljs-keyword">raise</span> Exception(<span class="hljs-string">&quot;Failed to call Kimi API: exceeded maximum retry attempts&quot;</span>)
            
            choice = response.choices[<span class="hljs-number">0</span>]
            
            <span class="hljs-comment"># If need to call tools</span>
            <span class="hljs-keyword">if</span> choice.finish_reason == <span class="hljs-string">&quot;tool_calls&quot;</span>:
                messages.append(choice.message)
                
                <span class="hljs-comment"># Execute each tool call</span>
                <span class="hljs-keyword">for</span> tool_call <span class="hljs-keyword">in</span> choice.message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)
                    
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔧 Calling tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📋 Parameters: <span class="hljs-subst">{tool_args}</span>&quot;</span>)
                    
                    <span class="hljs-comment"># Execute tool</span>
                    result = <span class="hljs-variable language_">self</span>._execute_tool(tool_name, tool_args)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Result: <span class="hljs-subst">{result}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
                    
                    <span class="hljs-comment"># Add tool result to conversation</span>
                    messages.append({
                        <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;tool&quot;</span>,
                        <span class="hljs-string">&quot;tool_call_id&quot;</span>: tool_call.<span class="hljs-built_in">id</span>,
                        <span class="hljs-string">&quot;name&quot;</span>: tool_name,
                        <span class="hljs-string">&quot;content&quot;</span>: json.dumps(result)
                    })
            
            <span class="hljs-comment"># If task completed</span>
            <span class="hljs-keyword">else</span>:
                final_response = choice.message.content
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🎯 Task completed: <span class="hljs-subst">{final_response}</span>&quot;</span>)
                <span class="hljs-keyword">return</span> final_response
        
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            error_msg = <span class="hljs-string">f&quot;Execution error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;❌ <span class="hljs-subst">{error_msg}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> error_msg
<button class="copy-code-btn"></button></code></pre>
<h2 id="Main-Program-and-Usage-Demonstration" class="common-anchor-header">メインプログラムと使用デモ<button data-href="#Main-Program-and-Usage-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>このメインプログラムでは、インタラクティブな環境を設定する。本番環境で使用する場合は、ハードコードされたAPIキーを環境変数に置き換え、適切なロギングと監視を追加したい。</p>
<p>公式サイトから<code translate="no">KIMI_API_KEY</code> 、<code translate="no">OPENAI_API_KEY</code> 。</p>
<pre><code translate="no">python
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-string">&quot;&quot;&quot;Main program&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🌟 Kimi K2 Intelligent Vector Database Assistant&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># API key configuration</span>
    KIMI_API_KEY = <span class="hljs-string">&quot;sk-xxxxxxxxxxxxxxxx&quot;</span>
    OPENAI_API_KEY = <span class="hljs-string">&quot;sk-proj-xxxxxxxxxxxxxxxx&quot;</span>
    
    <span class="hljs-comment"># Create intelligent assistant</span>
    assistant = SmartAssistant(KIMI_API_KEY, OPENAI_API_KEY)
    
    <span class="hljs-comment"># Interactive mode</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎮 Interactive mode (enter &#x27;quit&#x27; to exit)&quot;</span>)
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            user_input = <span class="hljs-built_in">input</span>(<span class="hljs-string">&quot;\nPlease enter command: &quot;</span>).strip()
            <span class="hljs-keyword">if</span> user_input.lower() <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;quit&#x27;</span>, <span class="hljs-string">&#x27;exit&#x27;</span>]:
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;👋 Goodbye!&quot;</span>)
                <span class="hljs-keyword">break</span>
            
            <span class="hljs-keyword">if</span> user_input:
                assistant.execute_command(user_input)
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
        
        <span class="hljs-keyword">except</span> KeyboardInterrupt:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n👋 Goodbye!&quot;</span>)
            <span class="hljs-keyword">break</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    main()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage-Examples" class="common-anchor-header">使用例<button data-href="#Usage-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>これらの例では、エンジニアが本番環境で遭遇するような現実的なシナリオで、システムの機能をデモンストレーションしています。</p>
<h3 id="Upload-file-example" class="common-anchor-header">ファイルのアップロード例</h3><p>この例は、システムが複雑なワークフローを自律的に処理する様子を示しています。ユーザーのリクエストをKimi K2がどのように分解し、必要なステップを正しい順序で実行しているかに注目してください。</p>
<pre><code translate="no">User Input: Upload ./The Adventures of Sherlock Holmes.txt to the database
<button class="copy-code-btn"></button></code></pre>
<p>ここで注目すべき点は、ツールのコールチェーンから、Kimi K2がコマンドを解析し、最初にデータベースに接続し（connect_database関数）、次にファイルをコレクションにアップロードする（upload_file_to_collection関数）ことを知っていることです。</p>
<p>エラーに遭遇した場合、Kimi K2はエラーメッセージに基づき、まずコレクションを作成し(create_collection)、次にファイルをコレクションにアップロードする(upload_file_to_collection)べきであることを認識し、速やかに修正することも知っています。この自律的なエラー回復は、従来のスクリプトによるアプローチに対する重要な利点です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_1_a4c0b2a006.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>システムは自動的に処理します：</p>
<ol>
<li><p>データベース接続</p></li>
<li><p>コレクションの作成（必要な場合）</p></li>
<li><p>ファイルの読み取りとチャンキング</p></li>
<li><p>ベクトル生成</p></li>
<li><p>データ挿入</p></li>
<li><p>ステータス報告</p></li>
</ol>
<h3 id="Question-answer-example" class="common-anchor-header">質問と回答の例</h3><p>このセクションでは、ツールを使用するタイミングと既存の知識に頼るタイミングを決定するシステムのインテリジェンスを示します。</p>
<pre><code translate="no">User Input: List five advantages of the Milvus vector database
<button class="copy-code-btn"></button></code></pre>
<p>画像から、Kimi K2が関数を呼び出すことなくユーザーの質問に直接答えていることがわかります。これはシステムが効率的であることを示しています。トレーニングデータから答えられる質問に対しては、不必要なデータベース操作を行いません。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_2_c912f3273b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> many stories are included <span class="hljs-keyword">in</span> the book <span class="hljs-string">&quot;Sherlock Holmes&quot;</span> that I uploaded? <span class="hljs-title class_">Summarize</span> each story <span class="hljs-keyword">in</span> one sentence.
<button class="copy-code-btn"></button></code></pre>
<p>このクエリでは、Kimiはアップロードされたドキュメントのコンテンツを検索する必要があることを正しく認識しています。システムは</p>
<ol>
<li><p>文書固有の情報が必要であることを認識</p></li>
<li><p>search_documents関数を呼び出す。</p></li>
<li><p>検索されたコンテンツを分析</p></li>
<li><p>実際にアップロードされたコンテンツに基づいた包括的な回答を提供します。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_3_7517b69889.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_4_96ea51a798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Database-Management-Example" class="common-anchor-header">データベース管理の例</h3><p>管理タスクは、コンテンツクエリと同様にスムーズに処理されます。</p>
<pre><code translate="no"><span class="hljs-built_in">list</span> <span class="hljs-built_in">all</span> the collections
<button class="copy-code-btn"></button></code></pre>
<p>Kimi K2は、この質問に正しく答えるために適切なツールを利用し、管理作業とコンテンツ操作の両方を理解していることを示しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_5_457a4d5db0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>システムは以下を含む包括的な情報を提供します：</p>
<ul>
<li><p>コレクション名</p></li>
<li><p>ドキュメント数</p></li>
<li><p>説明</p></li>
<li><p>データベース全体の統計</p></li>
</ul>
<h2 id="The-Dawn-of-Production-AI-Agents" class="common-anchor-header">プロダクションAIエージェントの幕開け<button data-href="#The-Dawn-of-Production-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Kimi K</strong>2と<strong>Milvusを</strong>接続することで、従来のチャットボットや基本的なセマンティック検索を超えることができました。私たちが構築したのは、複雑な指示を解釈し、ツールベースのワークフローに分解し、最小限のオーバーヘッドでファイル処理、セマンティック検索、インテリジェントQ&amp;Aのようなエンドツーエンドのタスクを実行できる本物のプロダクションエージェントです。</p>
<p>このアーキテクチャは、AI開発におけるより広範なシフトを反映しており、推論、メモリ、アクションが連動して動作する、孤立したモデルからコンポーザブル・システムへと移行している。Kimi K2のようなLLMは柔軟な推論を提供し、milvusのようなベクトル・データベースは長期的で構造化された記憶を提供する。</p>
<p>開発者にとっての問題は、もはやこれらのコンポーネントが一緒に機能<em>するかどうかではなく</em>、<em>どれだけ</em>ドメイン間で一般化できるか、データに合わせて拡張できるか、複雑化するユーザーニーズに対応できるか、である。</p>
<p><strong><em>LLM（推論）＋ベクターDB（知識）＋ツール（行動）＝本物のAIエージェント。</em></strong></p>
<p>我々が構築したこのシステムはほんの一例に過ぎないが、この原則は広く当てはまる。LLMが改良を続け、ツールのエコシステムが成熟するにつれ、Milvusは、単にデータを取得するだけでなく、データを推論できるインテリジェントなシステムを提供する、プロダクションAIスタックの中核的存在であり続けることができる。</p>
