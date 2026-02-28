---
id: >-
  how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
title: Google ADKとmilvusを使った長期記憶機能を持つAIエージェントの作り方
author: Min Yin
date: 2026-02-26T00:00:00.000Z
cover: assets.zilliz.com/cover_c543dbeab4.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: >-
  AI agent memory, long-term memory, ADK framework, Milvus vector database,
  semantic retrieval
meta_title: |
  Production AI Agents with Persistent Memory Using Google ADK and Milvus
desc: >-
  ADKとMilvusを使用して、実際の長期記憶を持つAIエージェントを構築します。メモリ設計、意味検索、ユーザー分離、生産可能なアーキテクチャをカバーします。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
---
<p>インテリジェント・エージェントを構築する際、最も難しい問題のひとつがメモリー管理である。</p>
<p>すべてのメモリが長持ちするわけではありません。あるデータは現在の会話にのみ必要であり、会話が終了したら消去されるべきです。他のデータは、ユーザー設定のように、会話をまたいで持続しなければなりません。これらが混在すると、一時的なデータが積み重なり、重要な情報が失われてしまう。</p>
<p>本当の問題はアーキテクチャにある。ほとんどのフレームワークでは、短期メモリと長期メモリの明確な分離が強制されておらず、開発者はそれを手作業で処理しなければならない。</p>
<p>グーグルが2025年にリリースしたオープンソースの<a href="https://google.github.io/adk-docs/">Agent Development Kit（ADK</a>）は、メモリ管理を第一級の関心事にすることで、フレームワークレベルでこれに取り組んでいる。短期的なセッション・メモリと長期的なメモリをデフォルトで分離している。</p>
<p>この記事では、この分離が実際にどのように機能するかを見ていこう。Milvusをベクタデータベースとして使用し、実際の長期メモリを持つ量産可能なエージェントをゼロから構築します。</p>
<h2 id="ADK’s-Core-Design-Principles" class="common-anchor-header">ADKのコア設計原則<button data-href="#ADK’s-Core-Design-Principles" class="anchor-icon" translate="no">
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
    </button></h2><p>ADKは、開発者の負担を軽減するために設計されています。フレームワークは、短期的なセッションデータと長期的なメモリを自動的に分離し、それぞれを適切に処理します。これは、4つのコアとなる設計の選択によって実現されます。</p>
<h3 id="Built-in-Interfaces-for-Short--and-Long-Term-Memory" class="common-anchor-header">短期および長期メモリ用の組み込みインタフェース</h3><p>すべての ADK エージェントには、メモリを管理するための 2 つの組み込みインタフェースが付属しています：</p>
<p><strong>SessionService (一時データ)</strong></p>
<ul>
<li><strong>保存するもの</strong>: 現在の会話内容とツール呼び出しからの中間結果</li>
<li><strong>クリアされるタイミング</strong>: セッション終了時に自動的にクリアされる</li>
<li><strong>保存場所</strong>：メモリ（最速）、データベース、クラウドサービス</li>
</ul>
<p><strong>MemoryService（長期記憶）</strong></p>
<ul>
<li><strong>保存されるもの</strong>：ユーザー設定や過去の記録など、記憶されるべき情報</li>
<li><strong>消去時期</strong>： 自動的には消去されない。手動で削除する必要がある。</li>
<li><strong>どこに保存されるか</strong>：ADKが定義するのはインターフェイスのみで、ストレージのバックエンドはユーザー次第（例えばmilvus）。</li>
</ul>
<h3 id="A-Three-Layer-Architecture" class="common-anchor-header">3層のアーキテクチャ</h3><p>ADKはシステムを3つのレイヤーに分け、それぞれに責任を持たせる：</p>
<ul>
<li><strong>エージェント層</strong>："ユーザーに応答する前に関連メモリを検索する "などのビジネスロジックが存在する。</li>
<li><strong>ランタイム・レイヤー</strong>：フレームワークによって管理され、セッションの作成と破棄、実行の各ステップの追跡を担当。</li>
<li><strong>サービスレイヤー</strong>：Milvusのようなベクターデータベースや大規模なモデルAPIのような外部システムと統合します。</li>
</ul>
<p>この構造により、ビジネスロジックはエージェント内に、ストレージは別の場所に格納されます。ビジネスロジックはエージェントにあり、ストレージは別の場所にあります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_2_6af7f3a395.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Everything-Is-Recorded-as-Events" class="common-anchor-header">すべてがイベントとして記録される</h3><p>エージェントが行うすべてのアクション（記憶呼び出しツールの呼び出し、モデルの起動、レスポンスの生成）は、<strong>イベントとして</strong>記録されます。</p>
<p>これには2つの実用的な利点があります。第一に、何か問題が発生したとき、開発者はインタラクション全体をステップごとに再生し、正確な障害ポイントを見つけることができます。第二に、監査とコンプライアンスのために、システムは各ユーザー・インタラクションの完全な実行トレースを提供する。</p>
<h3 id="Prefix-Based-Data-Scoping" class="common-anchor-header">プレフィックス・ベースのデータ・スコープ</h3><p>ADKは、単純なキー接頭辞を使用してデータの可視性を制御します：</p>
<ul>
<li><strong>temp:xxx</strong>- 現在のセッション内でのみ表示され、セッションが終了すると自動的に削除されます。</li>
<li><strong>user:xxx</strong>- 同一ユーザーの全セッションで共有され、永続的なユーザー設定が可能。</li>
<li><strong>app:xxx</strong>- 全ユーザでグローバルに共有され、製品ドキュメントのようなアプリケーション全体のナレッジに適しています。</li>
</ul>
<p>プレフィックスを使用することで、開発者は余分なアクセスロジックを記述することなくデータスコープを制御できます。フレームワークは可視性とライフタイムを自動的に処理します。</p>
<h2 id="Milvus-as-the-Memory-Backend-for-ADK" class="common-anchor-header">ADKのメモリバックエンドとしてのMilvus<button data-href="#Milvus-as-the-Memory-Backend-for-ADK" class="anchor-icon" translate="no">
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
    </button></h2><p>ADKでは、MemoryServiceは単なるインターフェースです。長期メモリがどのように使用されるかは定義されているが、どのように保存されるかは定義されていない。データベースの選択は開発者次第だ。では、どのようなデータベースがエージェントのメモリバックエンドとしてうまく機能するのでしょうか？</p>
<h3 id="What-an-Agent-Memory-System-Needs--and-How-Milvus-Delivers" class="common-anchor-header">エージェントの記憶システムに必要なもの-そしてmilvusの実現方法</h3><ul>
<li><strong>意味検索</strong></li>
</ul>
<p><strong>必要性</strong></p>
<p>ユーザが同じ質問を同じようにすることは稀です。「接続できない "と "接続タイムアウト "は同じ意味です。記憶システムはキーワードにマッチするだけでなく、意味を理解しなければならない。</p>
<p><strong>Milvusはそれをどのように満たすか</strong>：</p>
<p>MilvusはHNSWやDiskANNなど多くのベクトルインデックスをサポートしており、開発者はワークロードに合ったものを選択することができます。数千万のベクトルでも、クエリのレイテンシは10ミリ秒以下であり、エージェントの使用には十分な速度である。</p>
<ul>
<li><strong>ハイブリッドクエリー</strong></li>
</ul>
<p><strong>必要性</strong></p>
<p>記憶を呼び起こすには、セマンティック検索以上のものが必要です。システムは、user_idのような構造化フィールドでフィルタリングし、現在のユーザーのデータのみを返す必要がある。</p>
<p><strong>Milvusの対応方法</strong>：</p>
<p>Milvusはベクトル検索とスカラーフィルタリングを組み合わせたハイブリッドクエリをネイティブでサポートしている。例えば、同じクエリ内でuser_id = 'xxx'のようなフィルタを適用しながら、パフォーマンスや想起品質を損なうことなく、意味的に類似したレコードを検索することができます。</p>
<ul>
<li><strong>スケーラビリティ</strong></li>
</ul>
<p><strong>必要性</strong>：</p>
<p>ユーザー数や保存メモリが増加するにつれて、システムはスムーズにスケールしなければならない。突然の速度低下や障害が発生することなく、データが増加しても安定したパフォーマンスを維持する必要があります。</p>
<p><strong>Milvusはどのようにそれを満たすか</strong>：</p>
<p>Milvusは計算とストレージを分離したアーキテクチャを採用している。必要に応じてクエリーノードを追加することで、クエリー容量を水平方向に拡張することができる。1台のマシンで動作するスタンドアロン版でさえ、数千万のベクターを処理できるため、初期段階の導入に適している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_4_e1d89e6986.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>注：本記事の例では、ローカルでの開発およびテストのために、<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>または<a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standaloneを</a>使用しています。</p>
<h2 id="Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="common-anchor-header">Long-TermMemoryを搭載したMilvusエージェントの構築<button data-href="#Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>このセクションでは、簡単なテクニカルサポートエージェントを構築します。ユーザが質問をすると、エージェントは同じ作業を繰り返すのではなく、類似した過去のサポートチケットを検索して回答します。</p>
<p>この例は、実際のエージェントメモリシステムが扱わなければならない3つの一般的な問題を示しているので有用です。</p>
<ul>
<li><strong>セッションをまたいだ長期記憶</strong></li>
</ul>
<p>今日の質問は、数週間前に作成されたチケットに関連しているかもしれません。エージェントは、現在のセッション内だけでなく、会話をまたいで情報を記憶しなければなりません。これが、MemoryServiceを通して管理される長期メモリが必要とされる理由です。</p>
<ul>
<li><strong>ユーザの分離</strong></li>
</ul>
<p>各ユーザのサポート履歴は非公開でなければなりません。あるユーザのデータが他のユーザの結果に表示されることはありません。そのため、user_idのようなフィールドでフィルタリングを行う必要がありますが、Milvusはハイブリッドクエリでこれをサポートしています。</p>
<ul>
<li><strong>セマンティックマッチング</strong></li>
</ul>
<p>ユーザーは同じ問題を "接続できない "や "タイムアウト "など異なる方法で表現します。キーワードマッチングだけでは十分ではありません。エージェントには、ベクトル検索によって提供されるセマンティック検索が必要です。</p>
<h3 id="Environment-setup" class="common-anchor-header">環境セットアップ</h3><ul>
<li>Python 3.11+</li>
<li>DockerとDocker Compose</li>
<li>Gemini APIキー</li>
</ul>
<p>このセクションでは、プログラムが正しく実行できることを確認するための基本的なセットアップについて説明する。</p>
<pre><code translate="no">pip install google-adk pymilvus google-generativeai  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;  
ADK + Milvus + Gemini Long-term Memory Agent  
Demonstrates how to implement a cross-session memory recall system  
&quot;&quot;&quot;</span>  
<span class="hljs-keyword">import</span> os  
<span class="hljs-keyword">import</span> asyncio  
<span class="hljs-keyword">import</span> time  
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType, utility  
<span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai  
<span class="hljs-keyword">from</span> google.adk.agents <span class="hljs-keyword">import</span> Agent  
<span class="hljs-keyword">from</span> google.adk.tools <span class="hljs-keyword">import</span> FunctionTool  
<span class="hljs-keyword">from</span> google.adk.runners <span class="hljs-keyword">import</span> Runner  
<span class="hljs-keyword">from</span> google.adk.sessions <span class="hljs-keyword">import</span> InMemorySessionService  
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-Milvus-Standalone-Docker" class="common-anchor-header">ステップ1: Milvus Standaloneのデプロイ(Docker)</h3><p><strong>(1) 配備用ファイルをダウンロードする。</strong></p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml  
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Milvusサービスを起動する。</strong></p>
<pre><code translate="no">docker-compose up -d  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_1_0ab7f330eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Model-and-Connection-Configuration" class="common-anchor-header">ステップ2 モデルと接続の設定</h3><p>Gemini APIとMilvusの接続設定を行う。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Configuration ====================  </span>
<span class="hljs-comment"># 1. Gemini API configuration  </span>
GOOGLE_API_KEY = os.getenv(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)  
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> GOOGLE_API_KEY:  
   <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Please set the GOOGLE_API_KEY environment variable&quot;</span>)  
genai.configure(api_key=GOOGLE_API_KEY)  
<span class="hljs-comment"># 2. Milvus connection configuration  </span>
MILVUS_HOST = os.getenv(<span class="hljs-string">&quot;MILVUS_HOST&quot;</span>, <span class="hljs-string">&quot;localhost&quot;</span>)  
MILVUS_PORT = os.getenv(<span class="hljs-string">&quot;MILVUS_PORT&quot;</span>, <span class="hljs-string">&quot;19530&quot;</span>)  
<span class="hljs-comment"># 3. Model selection (best combination within the free tier limits)  </span>
LLM_MODEL = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>  <span class="hljs-comment"># LLM model: 1000 RPD  </span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;models/text-embedding-004&quot;</span>  <span class="hljs-comment"># Embedding model: 1000 RPD  </span>
EMBEDDING_DIM = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension  </span>
<span class="hljs-comment"># 4. Application configuration  </span>
APP_NAME = <span class="hljs-string">&quot;tech_support&quot;</span>  
USER_ID = <span class="hljs-string">&quot;user_123&quot;</span>  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Using model configuration:&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  LLM: <span class="hljs-subst">{LLM_MODEL}</span>&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Embedding: <span class="hljs-subst">{EMBEDDING_MODEL}</span> (dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>)&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Milvus-Database-Initialization" class="common-anchor-header">ステップ3 Milvusデータベースの初期化</h3><p>ベクトルデータベースコレクションを作成する(リレーショナルデータベースのテーブルに似ている)</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Initialize Milvus ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">init_milvus</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus connection and collection&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Step 1: Establish connection  </span>
   Try:  
       connections.connect(  
           alias=<span class="hljs-string">&quot;default&quot;</span>,  
           host=MILVUS_HOST,  
           port=MILVUS_PORT  
       )  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Connected to Milvus: <span class="hljs-subst">{MILVUS_HOST}</span>:<span class="hljs-subst">{MILVUS_PORT}</span>&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✗ Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Hint: make sure Milvus is running&quot;</span>)  
       Raise  
   <span class="hljs-comment"># Step 2: Define data schema  </span>
   fields = [  
       FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;session_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;question&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;solution&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">5000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),  
       FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)  
   ]  
   schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Tech support memory&quot;</span>)  
   collection_name = <span class="hljs-string">&quot;support_memory&quot;</span>  
   <span class="hljs-comment"># Step 3: Create or load the collection  </span>
   <span class="hljs-keyword">if</span> utility.has_collection(collection_name):  
       memory_collection = Collection(name=collection_name)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; already exists&quot;</span>)  
   Else:  
       memory_collection = Collection(name=collection_name, schema=schema)  
   <span class="hljs-comment"># Step 4: Create vector index  </span>
   index_params = {  
       <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,  
       <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
   }  
   memory_collection.create_index(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, index_params=index_params)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Created collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; and index&quot;</span>)  
   <span class="hljs-keyword">return</span> memory_collection  
<span class="hljs-comment"># Run initialization  </span>
memory_collection = init_milvus()  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Memory-Operation-Functions" class="common-anchor-header">ステップ4 メモリ操作関数</h3><p>エージェント用のツールとして、記憶と検索のロジックをカプセル化します。</p>
<p>(1) ストアメモリ機能</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Memory Operation Functions ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">store_memory</span>(<span class="hljs-params">question: <span class="hljs-built_in">str</span>, solution: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Store a solution record into the memory store  
   Args:  
       question: the user&#x27;s question  
       solution: the solution  
   Returns:  
       str: result message  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] store_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - question: <span class="hljs-subst">{question[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - solution: <span class="hljs-subst">{solution[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-comment"># Use global USER_ID (in production, this should come from ToolContext)  </span>
       user_id = USER_ID  
       session_id = <span class="hljs-string">f&quot;session_<span class="hljs-subst">{<span class="hljs-built_in">int</span>(time.time())}</span>&quot;</span>  
       <span class="hljs-comment"># Key step 1: convert the question into a 768-dimensional vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=question,  
           task_type=<span class="hljs-string">&quot;retrieval_document&quot;</span>,  <span class="hljs-comment"># specify document indexing task  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: insert into Milvus  </span>
       memory_collection.insert([{  
           <span class="hljs-string">&quot;user_id&quot;</span>: user_id,  
           <span class="hljs-string">&quot;session_id&quot;</span>: session_id,  
           <span class="hljs-string">&quot;question&quot;</span>: question,  
           <span class="hljs-string">&quot;solution&quot;</span>: solution,  
           <span class="hljs-string">&quot;embedding&quot;</span>: embedding,  
           <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-built_in">int</span>(time.time())  
       }])  
       <span class="hljs-comment"># Key step 3: flush to disk (ensure data persistence)  </span>
       memory_collection.flush()  
       result = <span class="hljs-string">&quot;✓ Successfully stored in memory&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> result  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;✗ Storage failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(2) メモリ検索機能</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_memory</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Retrieve relevant historical cases from the memory store  
   Args:  
       query: query question  
       top_k: number of most similar results to return  
   Returns:  
       str: retrieval result  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] recall_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - query: <span class="hljs-subst">{query}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - top_k: <span class="hljs-subst">{top_k}</span>&quot;</span>)  
       user_id = USER_ID  
       <span class="hljs-comment"># Key step 1: convert the query into a vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=query,  
           task_type=<span class="hljs-string">&quot;retrieval_query&quot;</span>,  <span class="hljs-comment"># specify query task (different from indexing)  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       query_embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: load the collection into memory (required for the first query)  </span>
       memory_collection.load()  
       <span class="hljs-comment"># Key step 3: hybrid search (vector similarity + scalar filtering)  </span>
       results = memory_collection.search(  
           data=[query_embedding],  
           anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,  
           param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},  
           limit=top_k,  
           expr=<span class="hljs-string">f&#x27;user_id == &quot;<span class="hljs-subst">{user_id}</span>&quot;&#x27;</span>,  <span class="hljs-comment"># 🔑 key to user isolation  </span>
           output_fields=[<span class="hljs-string">&quot;question&quot;</span>, <span class="hljs-string">&quot;solution&quot;</span>, <span class="hljs-string">&quot;timestamp&quot;</span>]  
       )  
       <span class="hljs-comment"># Key step 4: format results  </span>
       <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results[<span class="hljs-number">0</span>]:  
           result = <span class="hljs-string">&quot;No relevant historical cases found&quot;</span>  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
           <span class="hljs-keyword">return</span> result  
       result_text = <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> relevant cases:\\n\\n&quot;</span>  
       <span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results[<span class="hljs-number">0</span>]):  
           result_text += <span class="hljs-string">f&quot;Case <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> (similarity: <span class="hljs-subst">{hit.score:<span class="hljs-number">.2</span>f}</span>):\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;question&#x27;</span>)}</span>\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Solution: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;solution&#x27;</span>)}</span>\\n\\n&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> cases&quot;</span>)  
       <span class="hljs-keyword">return</span> result_text  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;Retrieval failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(3) ADK ツールとして登録</p>
<pre><code translate="no"><span class="hljs-comment"># Usage  </span>
<span class="hljs-comment"># Wrap functions with FunctionTool  </span>
store_memory_tool = FunctionTool(func=store_memory)  
recall_memory_tool = FunctionTool(func=recall_memory)  
memory_tools = [store_memory_tool, recall_memory_tool]  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Agent-Definition" class="common-anchor-header">ステップ 5 エージェント定義</h3><p>コアアイデア：エージェントの動作ロジックを定義する。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Create Agent ====================  </span>
support_agent = Agent(  
   model=LLM_MODEL,  
   name=<span class="hljs-string">&quot;support_agent&quot;</span>,  
   description=<span class="hljs-string">&quot;Technical support expert agent that can remember and recall historical cases&quot;</span>,  
   <span class="hljs-comment"># Key: the instruction defines the agent’s behavior  </span>
   instruction=<span class="hljs-string">&quot;&quot;&quot;  
You are a technical support expert. Strictly follow the process below:  
&lt;b&gt;When the user asks a technical question:&lt;/b&gt;  
1. Immediately call the recall_memory tool to search for historical cases  
  - Parameter query: use the user’s question text directly  
  - Do not ask for any additional information; call the tool directly  
2. Answer based on the retrieval result:  
  - If relevant cases are found: explain that similar historical cases were found and answer by referencing their solutions  
  - If no cases are found: explain that this is a new issue and answer based on your own knowledge  
3. After answering, ask: “Did this solution resolve your issue?”  
&lt;b&gt;When the user confirms the issue is resolved:&lt;/b&gt;  
- Immediately call the store_memory tool to save this Q&amp;A  
- Parameter question: the user’s original question  
- Parameter solution: the complete solution you provided  
&lt;b&gt;Important rules:&lt;/b&gt;  
- You must call a tool before answering  
- Do not ask for user_id or any other parameters  
- Only store memory when you see confirmation phrases such as “resolved”, “it works”, or “thanks”  
&quot;&quot;&quot;</span>,  
   tools=memory_tools  
)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Main-Program-and-Execution-Flow" class="common-anchor-header">ステップ 6 メインプログラムと実行フロー</h3><p>セッションをまたいだメモリ検索の完全なプロセスを示します。</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Main Program ====================  </span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Demonstrate cross-session memory recall&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Create Session service and Runner  </span>
   session_service = InMemorySessionService()  
   runner = Runner(  
       agent=support_agent,  
       app_name=APP_NAME,  
       session_service=session_service  
   )  
   <span class="hljs-comment"># ========== First round: build memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;First conversation: user asks a question and the solution is stored&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session1 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_001&quot;</span>  
   )  
   <span class="hljs-comment"># User asks the first question  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: What should I do if Milvus connection times out?&quot;</span>)  
   content1 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;What should I do if Milvus connection times out?&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content1  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># User confirms the issue is resolved  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: The issue is resolved, thanks!&quot;</span>)  
   content2 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;The issue is resolved, thanks!&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content2  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># ========== Second round: recall memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Second conversation: new session with memory recall&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session2 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_002&quot;</span>  
   )  
   <span class="hljs-comment"># User asks a similar question in a new session  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: Milvus can&#x27;t connect&quot;</span>)  
   content3 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;Milvus can&#x27;t connect&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session2.<span class="hljs-built_in">id</span>](http://session2.<span class="hljs-built_in">id</span>),  
       new_message=content3  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)

  
<span class="hljs-comment"># Program entry point  </span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:  
   Try:  
       asyncio.run(main())  
   <span class="hljs-keyword">except</span> KeyboardInterrupt:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n\\nProgram exited&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n\\nProgram error: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-keyword">import</span> traceback  
       traceback.print_exc()  
   Finally:  
       Try:  
           connections.disconnect(alias=<span class="hljs-string">&quot;default&quot;</span>)  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n✓ Disconnected from Milvus&quot;</span>)  
       Except:  
           <span class="hljs-keyword">pass</span>  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Run-and-Test" class="common-anchor-header">ステップ 7 実行とテスト</h3><p><strong>(1) 環境変数の設定</strong></p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-gemini-api-key&quot;</span>  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">python milvus_agent.py  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Expected-Output" class="common-anchor-header">期待される出力</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_5_0c5a37fe32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_3_cf3a60bd51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>出力はメモリシステムが実際にどのように動作するかを示している。</p>
<p>最初の会話では、ユーザがMilvus接続のタイムアウトをどのように扱うかを尋ねている。エージェントは解決策を示す。ユーザが問題が解決したことを確認した後、エージェントはこの質問と回答をメモリに保存します。</p>
<p>2番目の会話では、新しいセッションが始まります。ユーザは、異なる単語で同じ質問をします：「Milvusは接続できません。エージェントは自動的にメモリから同様のケースを検索し、同じ解決策を与える。</p>
<p>手作業は必要ない。エージェントは、過去のケースをいつ検索し、新しいケースをいつ保存するかを決定し、3つの重要な能力を示す：クロスセッションメモリー、セマンティックマッチング、ユーザーアイソレーション。</p>
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
    </button></h2><p>ADKは、SessionServiceとMemoryServiceを使って、フレームワークレベルで短期コンテキストと長期記憶を分離する。<a href="https://milvus.io/">milvusは</a>、ベクトルベースの検索を通して、意味検索とユーザーレベルのフィルタリングを扱う。</p>
<p>フレームワークを選択する際には、ゴールが重要になる。強力な状態の分離、監査可能性、運用の安定性が必要であれば、ADKの方が適している。プロトタイピングや実験であれば、LangChain（LLMベースのアプリケーションやエージェントを素早く構築するための人気のPythonフレームワーク）の方が柔軟性があります。</p>
<p>エージェントのメモリで重要なのはデータベースです。セマンティックメモリは、どのフレームワークを使っても、ベクターデータベースに依存します。Milvusはオープンソースであり、ローカルで動作し、1台のマシンで数十億のベクトルを扱うことができ、ハイブリッドベクトル、スカラー、全文検索をサポートしている。これらの特徴は、初期のテストと本番使用の両方をカバーしている。</p>
<p>この記事が、エージェント・メモリの設計について理解を深め、プロジェクトに適したツールを選択する一助となれば幸いである。</p>
<p>より大きなコンテキスト・ウィンドウだけでなく、実際のメモリを必要とするAIエージェントを構築しているのであれば、どのように取り組んでいるのかぜひお聞かせください。</p>
<p>ADK、エージェントのメモリ設計、またはMilvusをメモリバックエンドとして使用することについて質問がありますか？<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加いただくか、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーの</a>20分セッションをご予約ください。</p>
