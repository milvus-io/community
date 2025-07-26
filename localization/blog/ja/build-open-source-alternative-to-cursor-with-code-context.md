---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: コードコンテクストでカーソルに代わるオープンソースを構築する
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context-オープンソースのMCP互換プラグインで、あらゆるAIコーディングエージェント、Claude CodeやGemini
  CLI、VSCodeのようなIDE、さらにはChromeのような環境にも強力なセマンティックコード検索をもたらします。
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">AIコーディング・ブームとその盲点<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>AIコーディング・ツールは至る所で見かけるが、流行にはそれなりの理由がある。<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code、Gemini CLIから</a>オープンソースのCursorに代わるものまで、これらのエージェントは関数を書いたり、コードの依存関係を説明したり、ファイル全体を1回のプロンプトでリファクタリングしたりすることができる。開発者たちは競ってこれらをワークフローに統合しようとしており、多くの点で、これらは誇大広告を実現している。</p>
<p><strong>しかし、<em>コードベースを理解</em>するとなると、ほとんどのAIツールは壁にぶつかる。</strong></p>
<p>Claude Codeに "このプロジェクトはどこでユーザー認証を扱っているか "を探すように頼むと、<code translate="no">grep -r &quot;auth&quot;</code>。コメント、変数名、ファイル名に渡って87の緩く関連したマッチを吐き出し、認証ロジックを持つが "auth "と呼ばれていない多くの関数を見逃している可能性が高い。Gemini CLIを試してみると、"login "や "password "のようなキーワードを探し、<code translate="no">verifyCredentials()</code> のような関数を完全に見逃してしまう。これらのツールは、コードを生成するのには優れているが、ナビゲートしたり、デバッグしたり、不慣れなシステムを探索したりするときには、バラバラになってしまう。コードベース全体をLLMに送信して、トークンと時間を燃やしながらコンテキストを確認しない限り、意味のある答えを出すのに苦労する。</p>
<p><em>これが、今日のAIツールの真のギャップである</em> <strong><em>コード・コンテキストだ。</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursorはそれに釘付けになったが、誰にでも使えるわけではない<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursorは</strong>この問題に正面から取り組んでいる。キーワード検索の代わりに、構文木、ベクトル埋め込み、コード認識検索を使ってコードベースのセマンティック・マップを構築する。メール検証ロジックはどこですか」と尋ねると、<code translate="no">isValidEmailFormat()</code> 。名前が一致したからではなく、そのコードが何を<em>する</em>のかを理解しているからです。</p>
<p>Cursorはパワフルだが、すべての人に適しているとは限らない。<strong><em>Cursorはクローズドソースで、クラウドホスティングで、サブスクリプションベースだ。</em></strong>そのため、機密性の高いコードを扱うチーム、セキュリティを重視する組織、インディーズ開発者、学生、オープンなシステムを好む人には手が届かない。</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">カーソルを自作できるとしたら？<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Cursorのコアテクノロジーはプロプライエタリなものではありません。<a href="https://milvus.io/">Milvusの</a>ようなベクトル・データベース、<a href="https://zilliz.com/ai-models">エンベッディング・モデル</a>、Tree-sitterによるシンタックス・パーサーなど、実績のあるオープンソースの基盤の上に構築されています。</p>
<p><em>そこで我々は考えた：</em> <strong><em>もし誰もが自分自身のCursorを構築できるとしたら？</em></strong>あなたのインフラで動く。サブスクリプション費用なし。完全にカスタマイズ可能。コードとデータを完全にコントロールできる。</p>
<p><a href="https://github.com/zilliztech/code-context"><strong>この</strong></a>プラグインは、Claude CodeやGemini CLI、VSCodeのようなIDE、さらにはGoogle Chromeのような環境など、あらゆるAIコーディングエージェントに強力なセマンティックコード検索をもたらします。また、Cursorのような独自のコーディングエージェントをゼロから構築し、コードベースのリアルタイムでインテリジェントなナビゲーションを実現するパワーも提供します。</p>
<p><strong><em>サブスクリプションなし。ブラックボックスもありません。コード・インテリジェンスだけを、あなたの言葉で。</em></strong></p>
<p>この記事の続きでは、Code Contextがどのように機能するのか、そして今日からどのように使い始めることができるのかを説明する。</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context：Cursorのインテリジェンスに代わるオープンソース<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Contextは</strong></a>オープンソースのMCP互換セマンティックコード検索エンジンです。カスタムAIコーディングアシスタントをゼロから構築する場合でも、Claude CodeやGemini CLIのようなAIコーディングエージェントにセマンティック認識を追加する場合でも、Code Contextはそれを可能にするエンジンです。</p>
<p>Code Contextはローカルで動作し、VS CodeやChromeブラウザなどのお気に入りのツールや環境と統合し、クラウド専用のクローズドソースプラットフォームに依存することなく、堅牢なコード理解を実現します。</p>
<p><strong>コア機能は以下の通りです：</strong></p>
<ul>
<li><p><strong>自然言語によるセマンティックコード検索：</strong>平易な英語を使用してコードを検索します。ユーザーログイン確認」や「支払い処理ロジック」などの概念を検索すると、Code Contextは関連する関数を特定します。</p></li>
<li><p><strong>多言語サポート：</strong>JavaScript、Python、Java、Goなど、15以上のプログラミング言語をシームレスに検索し、すべての言語で一貫した意味理解を実現します。</p></li>
<li><p><strong>ASTベースのコードチャンキング：</strong>AST解析により、コードは自動的に関数やクラスなどの論理的な単位に分割され、検索結果が完全で意味のあるものとなり、関数の途中で切断されることはありません。</p></li>
<li><p><strong>ライブ、インクリメンタルインデクシング：</strong>コードの変更はリアルタイムでインデックス化されます。ファイルを編集しても、検索インデックスは常に最新の状態に保たれるため、手作業による更新やインデックスの再作成は不要です。</p></li>
<li><p><strong>完全にローカルで安全なデプロイメント：</strong>すべてを独自のインフラストラクチャ上で実行できます。Code Contextは、Ollama経由のローカルモデルと<a href="https://milvus.io/">Milvus</a>経由のインデックスをサポートしているため、あなたのコードがあなたの環境を離れることはありません。</p></li>
<li><p><strong>ファーストクラスのIDE統合：</strong>VSCode 拡張機能により、エディタからコンテキストを切り替えることなく、即座に検索し、結果にジャンプすることができます。</p></li>
<li><p><strong>MCPプロトコルのサポート：</strong>Code ContextはMCPに対応しているため、AIコーディングアシスタントと簡単に統合でき、セマンティック検索をワークフローに直接取り込むことができます。</p></li>
<li><p><strong>ブラウザプラグインのサポート：</strong>GitHubのリポジトリをブラウザで直接検索できます。タブもコピーペーストも不要で、作業している場所ですぐにコンテキストを確認できます。</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Code Context の仕組み</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Contextは、コアとなるオーケストレーターと、埋め込み、解析、保存、検索に特化したコンポーネントを備えたモジュラーアーキテクチャを採用しています。</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">コアモジュールCode Contextコア</h3><p>Code Contextの中心は<strong>Code Context Core</strong>であり、コードの解析、埋め込み、保存、セマンティック検索を調整する：</p>
<ul>
<li><p><strong>テキスト処理モジュールは</strong>、言語を意識したAST解析のためにTree-sitterを使ってコードを分割し、解析します。</p></li>
<li><p><strong>埋め込みインターフェースは</strong>、プラグイン可能なバックエンド（現在はOpenAIとVoyageAI）をサポートし、コードチャンクを意味的な意味と文脈的な関係をキャプチャするベクトル埋め込みに変換します。</p></li>
<li><p><strong>ベクターデータベースインターフェイスは</strong>、これらの埋め込みをセルフホスティングの<a href="https://milvus.io/">Milvus</a>インスタンス（デフォルト）またはマネージドバージョンのMilvusである<a href="https://zilliz.com/cloud">Zilliz Cloudに</a>保存します。</p></li>
</ul>
<p>これらすべてがスケジュールに基づいてお客様のファイルシステムと同期されるため、手動で操作することなくインデックスを最新の状態に保つことができます。</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Code Contextコア上の拡張モジュール</h3><ul>
<li><p><strong>VSCodeエクステンション</strong>：IDEとのシームレスな統合により、エディタ内でのセマンティック検索や定義へのジャンプが高速に行えます。</p></li>
<li><p><strong>Chrome 拡張機能</strong>：GitHub リポジトリをブラウズしながら、タブを切り替えることなくインラインでセマンティックコード検索ができます。</p></li>
<li><p><strong>MCPサーバー</strong>：MCPプロトコルを介してCode Contextを任意のAIコーディングアシスタントに公開し、リアルタイムでコンテキストを認識した支援を可能にします。</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Code Contextを使い始める<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Contextは、すでに使用しているコーディングツールに接続することも、ゼロからカスタムAIコーディングアシスタントを構築することもできます。このセクションでは、両方のシナリオについて説明します：</p>
<ul>
<li><p>Code Contextを既存のツールと統合する方法</p></li>
<li><p>独自のAIコーディングアシスタントを構築する際に、スタンドアロンのセマンティックコード検索用にコアモジュールをセットアップする方法</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">MCPの統合</h3><p>Code Contextは<strong>モデルコンテキストプロトコル（MCP）を</strong>サポートし、Claude CodeのようなAIコーディングエージェントがセマンティックバックエンドとして使用できるようにします。</p>
<p>Claude Codeと統合する：</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一度設定すると、Claude Codeは必要に応じてセマンティックコード検索のために自動的にCode Contextを呼び出します。</p>
<p>他のツールや環境と統合するには、私たちの<a href="https://github.com/zilliztech/code-context"> GitHubレポで</a>より多くの例やアダプターをチェックしてください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Code Contextを使って独自のAIコーディングアシスタントを構築する</h3><p>Code Contextを使用してカスタムAIアシスタントを構築するには、セマンティックコード検索のコアモジュールをわずか3つのステップで設定します：</p>
<ol>
<li><p>埋め込みモデルを設定する</p></li>
<li><p>ベクターデータベースに接続する</p></li>
<li><p>プロジェクトのインデックスを作成し、検索を開始する</p></li>
</ol>
<p>以下は、<strong>OpenAI Embeddingsと</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>ベクトルデータベースを</strong>ベクトルバックエンドとして使用した例です：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">VSCodeエクステンション</h3><p>Code Contextは<strong>"Semantic Code Search "</strong>という名前のVSCodeエクステンションとして利用できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>インストールしたら</p>
<ul>
<li><p>APIキーの設定</p></li>
<li><p>プロジェクトのインデックスを作成する</p></li>
<li><p>平易な英語のクエリを使用（完全一致は必要ありません）</p></li>
<li><p>クリック・トゥ・ナビゲートで即座に結果にジャンプ</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これにより、セマンティック検索がコーディングワークフローのネイティブな一部となります。</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Chrome拡張機能（近日公開予定）</h3><p>近日公開予定の<strong>Chrome 拡張機能では</strong>、GitHub のウェブページに Code Context を導入し、公開リポジトリ内で直接セマンティックコード検索を実行できるようになります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>見知らぬコードベースでも、ローカルと同じディープな検索が可能になります。拡張機能は現在開発中で、近日リリース予定です。</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Code Contextを使う理由<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>基本的なセットアップですぐに使い始めることができますが、<strong>Code Contextが</strong>真に輝くのはプロフェッショナルで高性能な開発環境です。その高度な機能は、エンタープライズ規模のデプロイからカスタムAIツーリングまで、本格的なワークフローをサポートするように設計されています。</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">エンタープライズクラスのセキュリティを実現するプライベートデプロイメント</h3><p>Code Contextは、<strong>Ollama</strong>ローカルエンベッディングモデルと<strong>Milvusを</strong>セルフホストベクターデータベースとして使用した完全なオフラインデプロイメントをサポートします。これにより、完全にプライベートなコード検索パイプラインが可能になります。</p>
<p>このアーキテクチャは、金融、政府、防衛など、コンプライアンス要件が厳しく、コードの機密性が譲れない業界に最適です。</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">インテリジェントなファイル同期によるリアルタイムのインデックス作成</h3><p>コードインデックスを常に最新の状態に保つことは、時間がかかったり手作業であったりすることではありません。Code Contextには、<strong>Merkle Treeベースのファイル監視システムが</strong>搭載されており、変更を即座に検出し、リアルタイムで増分更新を実行します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>変更されたファイルのインデックスだけを再作成することで、大規模なリポジトリの更新時間を数分から数秒に短縮します。これにより、"更新 "をクリックすることなく、書いたばかりのコードがすでに検索可能であることが保証される。</p>
<p>ペースの速い開発環境では、このような即時性が重要です。</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">あなたと同じようにコードを理解するAST解析</h3><p>従来のコード検索ツールは、行数や文字数でテキストを分割し、論理的な単位を壊して混乱を招く結果を返すことがよくありました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Contextの方が優れています。実際のコード構造を理解するためにTree-sitter ASTパージングを利用します。完全な関数、クラス、インターフェイス、モジュールを識別し、クリーンで意味的に完全な結果を提供します。</p>
<p>JavaScript/TypeScript、Python、Java、C/C++、Go、Rustなどの主要なプログラミング言語をサポートしており、正確なチャンキングを行うための言語固有の戦略を持っています。サポートされていない言語については、ルールベースの構文解析にフォールバックし、クラッシュや空の結果のない優雅な処理を保証します。</p>
<p>これらの構造化されたコードユニットは、より正確なセマンティック検索のためのメタデータにもフィードされます。</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">オープンソースと設計による拡張性</h3><p>Code ContextはMITライセンスの下で完全にオープンソースです。すべてのコアモジュールはGitHubで公開されています。</p>
<p>私たちは、オープンなインフラストラクチャーこそが、パワフルで信頼できる開発者ツールを構築する鍵であると信じており、開発者が新しいモデル、言語、ユースケースのために拡張することを歓迎しています。</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">AIアシスタントのためのコンテキストウィンドウ問題の解決</h3><p>大規模言語モデル（LLM）には、コンテキスト・ウィンドウという厳しい限界があります。これはコードベース全体を見ることを制限し、補完、修正、提案の精度を低下させます。</p>
<p>Code Contextはそのギャップを埋めるのに役立ちます。そのセマンティックコード検索は、<em>適切な</em>コード部分を検索し、AIアシスタントに、推論するための焦点を絞った適切なコンテキストを与えます。モデルが実際に重要なものに「ズームイン」することで、AIが生成するアウトプットの質を向上させます。</p>
<p>Claude CodeやGemini CLIのような一般的なAIコーディングツールには、ネイティブのセマンティックコード検索がありません。Code Contextは、<strong>MCPを介して</strong>統合されることで、これらのツールに脳のアップグレードを与える。</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">開発者による開発者のためのビルド</h3><p>Code Contextはモジュール方式で再利用できるようにパッケージ化されており、各コンポーネントは独立した<strong>npm</strong>パッケージとして利用できます。各コンポーネントは独立した npm パッケージとして提供されます。プロジェクトに応じて、組み合わせたり、拡張したりすることができます。</p>
<ul>
<li><p>セマンティックなコード検索だけが必要ですか？利用する<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>AIエージェントにプラグインしたい？追加する<code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>独自のIDE/ブラウザツールを構築しますか？私たちのVSCodeとChrome拡張機能の例を見てください。</p></li>
</ul>
<p>コードコンテキストの応用例</p>
<ul>
<li><p>より良いLLM完了のために関連するスニペットをプルする、<strong>コンテキストを意識したオートコンプリートプラグイン</strong></p></li>
<li><p>修正案を改善するために周囲のコードを収集する<strong>インテリジェントなバグ検出器</strong></p></li>
<li><p>意味的に関連する場所を自動的に見つける<strong>安全なコード・リファクタリング・ツール</strong></p></li>
<li><p>意味的なコード関係からダイアグラムを構築する<strong>アーキテクチャビジュアライザ</strong></p></li>
<li><p>PRレビュー中に過去の実装を表示する、<strong>よりスマートなコードレビューアシスタント</strong></p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">私たちのコミュニティへようこそ<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Contextは</strong></a>単なるツールではなく、コードを真に理解するために<strong>AIとベクトルデータベースが</strong>どのように連携できるかを探求するためのプラットフォームです。AIによる開発が一般的になるにつれ、セマンティックなコード検索が基礎的な機能になると私たちは信じています。</p>
<p>あらゆる種類の貢献を歓迎する：</p>
<ul>
<li><p>新しい言語のサポート</p></li>
<li><p>新しい埋め込みモデルのバックエンド</p></li>
<li><p>革新的なAI支援ワークフロー</p></li>
<li><p>フィードバック、バグ報告、デザインのアイデア</p></li>
</ul>
<p>こちらで私たちを見つけてください：</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context on GitHub</a>|<a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npmパッケージ</strong></a>|<a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCodeマーケットプレイス</strong></a></p></li>
<li><p><a href="https://www.youtube.com/@MilvusVectorDatabase/featured">Discord｜LinkedIn｜X｜YouTube</a></p></li>
</ul>
<p>一緒に、透明でパワフルな、開発者ファーストの次世代AI開発ツールのインフラを構築しましょう。</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
