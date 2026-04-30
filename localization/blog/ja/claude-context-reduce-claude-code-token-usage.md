---
id: claude-context-reduce-claude-code-token-usage.md
title: クロードコンテキスト：Milvusによるコード検索でClaudeコードトークンの使用量を削減
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  クロード・コードがgrepでトークンを消費？クロード・コンテキストがMilvusを利用したハイブリッド検索でトークン使用量を39.4%削減した方法をご覧ください。
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>大きなコンテキストウィンドウは、AIコーディングエージェントに無限の可能性を感じさせます。多くのクロード・コード・ユーザーにとって、高価な部分はモデル推論だけではありません。キーワードを検索し、ファイルを読み、また検索し、さらにファイルを読み、無関係なコンテキストのためにお金を払い続ける。</p>
<p>Claude Contextは、Claude Codeや他のAIコーディングエージェントに、関連するコードを見つけるためのより良い方法を提供する、オープンソースのコード検索MCPサーバーです。リポジトリをインデックス化し、検索可能なコードチャンクを<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースに</a>保存し、<a href="https://zilliz.com/blog/hybrid-search-with-milvus">ハイブリッド検索を</a>使用することで、エージェントはgrepの結果でプロンプトを溢れさせるのではなく、実際に必要なコードを取り込むことができます。</p>
<p>我々のベンチマークでは、Claude Contextは検索品質を維持しながら、トークンの消費を平均39.4%削減し、ツールの呼び出しを36.1%削減しました。この投稿では、なぜ grep スタイルの検索がコンテキストを無駄にするのか、Claude Context がフードの下でどのように動作するのか、実際のデバッグ作業におけるベースラインワークフローとの比較について説明する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub リポジトリのトレンドと 10,000 スター通過</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">なぜgrepスタイルのコード検索はAIコーディングエージェントのトークンを燃やすのか<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>AIコーディングエージェントは、タスクの周りのコードベース（関数の呼び出しパス、命名規則、関連するテスト、データモデル、過去の実装パターン）を理解している場合にのみ、有用なコードを書くことができる。大きなコンテキスト・ウィンドウは助けになるが、検索の問題を解決するわけではない。間違ったファイルがコンテキストに入ると、モデルはトークンを無駄にし、無関係なコードから推論する可能性があります。</p>
<p>コード検索は通常、2つのパターンに大別される：</p>
<table>
<thead>
<tr><th>検索パターン</th><th>どのように機能するか</th><th>どこで破綻するか</th></tr>
</thead>
<tbody>
<tr><td>Grepスタイルの検索</td><td>リテラル文字列を検索し、マッチするファイルや行範囲を読み込む。</td><td>意味的に関連するコードを見逃し、ノイジーなマッチを返し、しばしば検索と読み込みのサイクルを繰り返す必要がある。</td></tr>
<tr><td>RAGスタイルの検索</td><td>コードを事前に索引付けし、関連するチャンクをセマンティック検索、レキシカル検索、またはハイブリッド検索で取り出す。</td><td>チャンキング、埋め込み、インデックス作成、更新ロジックが必要で、ほとんどのコーディング・ツールは直接所有したくない。</td></tr>
</tbody>
</table>
<p>これは、開発者が<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAGアプリケーションの</a>設計で目にするのと同じ区別である。リテラルマッチは便利だが、意味が重要なときにそれで十分なことはほとんどない。たとえ正確な単語が一致しなくても、<code translate="no">compute_final_cost()</code> という名前の関数が<code translate="no">calculate_total_price()</code> に関するクエリに関連するかもしれない。そこで<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">セマンティック検索が</a>役に立つ。</p>
<p>あるデバッグ作業では、クロード・コードが正しい場所を見つける前に、何度もファイルを検索して読み込んだ。数分後、消費したコードのごく一部しか関連性がなかった。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>クロード・コードのグレップ・スタイルの検索は、無関係なファイルの読み込みに時間を費やしている</span> </span>。</p>
<p>エージェントは賢くても、コンテキスト検索のループはまだ高価で不正確な感じがします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>クロードコードのコンテキストとトークンの使い方に関する開発者のコメント</span> </span></p>
<p>Grepスタイルの検索は、3つの予測可能な方法で失敗する：</p>
<ul>
<li><strong>情報の過負荷：</strong>大規模なリポジトリでは多くのリテラルマッチが生成されるが、そのほとんどは現在のタスクには役に立たない。</li>
<li><strong>意味の盲点：</strong>grepは文字列にマッチするが、意図や動作、同等の実装パターンにはマッチしない。</li>
<li><strong>コンテキストの損失：</strong>行レベルのマッチには、周囲のクラス、依存関係、テスト、コールグラフが自動的に含まれない。</li>
</ul>
<p>より良いコード検索レイヤーは、キーワードの精度と意味的理解を組み合わせ、モデルがコードについて推論するのに十分な完全なチャンクを返す必要がある。</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">クロードコンテキストとは？<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Contextは、コード検索のためのオープンソースの<a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a>サーバーである。AIコーディングツールをMilvusに裏付けされたコードインデックスに接続することで、エージェントはリテラルテキスト検索だけに頼るのではなく、意味によってリポジトリを検索することができる。</p>
<p>目標は単純で、エージェントがコンテキストを要求したときに、コードチャンクの最小の有用なセットを返すことである。Claude Contextは、コードベースを解析し、埋め込みを生成し、<a href="https://zilliz.com/what-is-milvus">Milvusベクトル</a>データベースにチャンクを格納し、MCP互換ツールで検索を公開することでこれを実現します。</p>
<table>
<thead>
<tr><th>Grep問題</th><th>クロードコンテキストのアプローチ</th></tr>
</thead>
<tbody>
<tr><td>無関係なマッチが多すぎる</td><td>ベクトルの類似性とキーワードの関連性でコードチャンクをランク付けする。</td></tr>
<tr><td>意味理解なし</td><td><a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">エンベッディングモデルを</a>使用し、名前が異なっていても関連する実装がマッチするようにする。</td></tr>
<tr><td>周囲のコンテキストがない</td><td>モデルが動作を推論するのに十分な構造を持つ完全なコードチャンクを返します。</td></tr>
<tr><td>ファイル読み込みの繰り返し</td><td>まずインデックスを検索し、次に重要なファイルだけを読み込んだり編集したりする。</td></tr>
</tbody>
</table>
<p>クロードコンテキストはMCPを通して公開されるため、クロードコード、Gemini CLI、カーソルスタイルのMCPホスト、その他のMCP互換環境で動作することができます。同じコア検索レイヤーで複数のエージェントインターフェースをサポートすることができます。</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">クロードコンテキストの仕組み<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context には、再利用可能なコアモジュールと統合モジュールの 2 つのメインレイヤーがあります。コアは構文解析、チャンキング、インデックス作成、検索、インクリメンタルな同期を処理します。上位レイヤーは、MCPやエディタとの統合を通じてこれらの機能を公開します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>MCPインテグレーション、コアモジュール、エンベッディングプロバイダ、ベクターデータベースを示すClaude Contextアーキテクチャ</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">MCPはClaude Contextとコーディングエージェントをどのように接続するのですか？</h3><p>MCPはLLMホストと外部ツールの間のインターフェースを提供します。Claude ContextをMCPサーバーとして公開することで、検索レイヤーはどのIDEやコーディングアシスタントからも独立しています。エージェントは検索ツールを呼び出し、Claude Contextはコードインデックスを処理し、関連するチャンクを返します。</p>
<p>より広範なパターンを理解したい場合は、<a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvusガイドで</a>、MCPがAIツールをベクトルデータベース操作に接続する方法を紹介しています。</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">なぜMilvusをコード検索に使うのか？</h3><p>コード検索には、高速なベクトル検索、メタデータのフィルタリング、大規模なリポジトリを扱うための十分なスケールが必要です。Milvusは高性能なベクトル検索用に設計されており、高密度ベクトル、疎ベクトル、リランキングワークフローをサポートすることができます。検索を多用するエージェントシステムを構築するチームのために、<a href="https://milvus.io/docs/multi-vector-search.md">マルチベクトルハイブリッド検索の</a>ドキュメントと<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search APIは</a>、プロダクションシステムで使用されるのと同じ基本的な検索パターンを示しています。</p>
<p>Claude Context は Milvus のバックエンドとして Zilliz Cloud を使うことができます。同じアーキテクチャは、セルフマネージドMilvusデプロイメントにも適応できます。</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Claude Context はどのエンベッディングプロバイダに対応していますか？</h3><p>Claude Context は複数の埋め込みオプションをサポートしています：</p>
<table>
<thead>
<tr><th>プロバイダ</th><th>最適</th></tr>
</thead>
<tbody>
<tr><td>OpenAI エンベッディング</td><td>幅広いエコシステムをサポートする汎用のエンベッディングです。</td></tr>
<tr><td>Voyage AIエンベッディング</td><td>コード指向の検索、特に検索品質が重要な場合に。</td></tr>
<tr><td>Ollama</td><td>プライバシーに敏感な環境のためのローカル埋め込みワークフロー。</td></tr>
</tbody>
</table>
<p>関連するMilvusワークフローについては、<a href="https://milvus.io/docs/embeddings.md">Milvusエンベッディングの概要</a>、<a href="https://milvus.io/docs/embed-with-openai.md">OpenAIエンベッディングの統合</a>、<a href="https://milvus.io/docs/embed-with-voyage.md">Voyageエンベッディングの統合</a>、<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Milvusを使ったOllamaの</a>実行例をご覧ください。</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">なぜコアライブラリはTypeScriptで書かれているのですか？</h3><p>Claude ContextがTypeScriptで書かれているのは、コーディングエージェントの統合、エディタのプラグイン、MCPホストの多くがすでにTypeScriptを多用しているからです。検索コアをTypeScriptで記述することで、アプリケーションレイヤーのツールとの統合が容易になると同時に、クリーンなAPIを公開することができる。</p>
<p>コアモジュールはベクターデータベースとエンベッディングプロバイダを抽象化し、コンポーザブルな<code translate="no">Context</code> ：</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">クロードコンテキストがコードをチャンクし、インデックスを新鮮に保つ方法<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>チャンキングとインクリメンタルな更新は、コード検索システムが実際に使えるかどうかを決定する。チャンクが小さすぎると、モデルはコンテキストを失う。チャンクが大きすぎると、検索システムはノイズを返す。インデックス作成が遅すぎると、開発者はインデックスを使うのをやめてしまう。</p>
<p>Claude Contextは、ASTベースのチャンキング、フォールバックテキストスプリッター、Merkleツリーベースの変更検出でこれを処理する。</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">ASTベースのコードチャンキングはどのようにコンテキストを保持するのか？</h3><p>ASTチャンキングが主な戦略です。行数や文字数でファイルを分割する代わりに、Claude Context はコード構造を解析し、関数、クラス、メソッドなどの意味的な単位でチャンクします。</p>
<p>これにより、各チャンクには3つの有用なプロパティが与えられる：</p>
<table>
<thead>
<tr><th>プロパティ</th><th>重要な理由</th></tr>
</thead>
<tbody>
<tr><td>構文の完全性</td><td>関数やクラスが途中で分割されない。</td></tr>
<tr><td>論理的一貫性</td><td>関連するロジックがまとまっているため、検索されたチャンクはモデルにとって使いやすくなります。</td></tr>
<tr><td>多言語サポート</td><td>異なるツリーシッターパーサーで、JavaScript、Python、Java、Go、その他の言語を処理できます。</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>完全な構文単位とチャンキング結果を保持するASTベースのコードチャンキング</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">AST解析に失敗した場合はどうなりますか？</h3><p>AST 解析が処理できない言語やファイルに対しては、Claude Context は LangChain の<code translate="no">RecursiveCharacterTextSplitter</code> にフォールバックします。これは AST チャンキングよりも精度は落ちますが、サポートされていない入力でインデックス作成が失敗するのを防ぎます。</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Claude Contextはどのようにしてリポジトリ全体のインデックス付けを回避するのですか？</h3><p>変更のたびにリポジトリ全体のインデックスを再作成するのはコストがかかりすぎます。Claude ContextはMerkleツリーを使って、何が変更されたかを正確に検出します。</p>
<p>Merkle ツリーは、各ファイルにハッシュを割り当て、子ファイルから各ディレクトリのハッシュを導き出し、リポジトリ全体をルートハッシュにロールバックします。ルートハッシュに変更がなければ、Claude Contextはインデックス作成をスキップできます。ルートが変更された場合は、ツリーをたどって変更されたファイルを見つけ、それらのファイルのみを再度埋め込みます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>変更されていないファイルハッシュと変更されたファイルハッシュを比較する Merkle ツリーの変更検出</span> </span></p>
<p>同期は3つのステージで実行されます：</p>
<table>
<thead>
<tr><th>ステージ</th><th>何が起こるか</th><th>効率的な理由</th></tr>
</thead>
<tbody>
<tr><td>クイックチェック</td><td>現在のMerkleルートと最後のスナップショットを比較する。</td><td>何も変更がなければ、チェックはすぐに終わります。</td></tr>
<tr><td>正確な差分</td><td>ツリーを歩いて、追加、削除、および変更されたファイルを特定します。</td><td>変更されたパスだけが先に進みます。</td></tr>
<tr><td>インクリメンタル更新</td><td>変更されたファイルの埋め込みを再計算し、milvusを更新します。</td><td>完全な再構築を行わなくても、ベクターインデックスは新しい状態を維持します。</td></tr>
</tbody>
</table>
<p>ローカル同期の状態は<code translate="no">~/.context/merkle/</code> に保存されるため、Claude Context は再起動後にファイルハッシュテーブルとシリアライズされた Merkle ツリーを復元できる。</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Claude CodeがClaude Contextを使うとどうなるのか？<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>セットアップは、Claude Codeを起動する前の1つのコマンドです：</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>リポジトリのインデックスを作成した後、Claude Codeはコードベースのコンテキストが必要なときにClaude Contextを呼び出すことができます。以前は grep やファイル読み込みに時間を費やしていた同じバグ発見シナリオで、Claude Context は正確なファイルと行番号を完全な説明付きで発見しました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>クロード・コードが関連するバグの場所を見つけるクロード・コンテキストのデモ</span> </span></p>
<p>このツールはバグ探しだけにとどまりません。リファクタリング、重複コード検出、問題解決、テスト生成、エージェントが正確なリポジトリコンテキストを必要とするあらゆるタスクにも役立ちます。</p>
<p>同等のリコールにおいて、Claude Contextはトークンの消費を39.4%削減し、ツールの呼び出しを36.1%削減しました。ツールの呼び出しと無関係なファイルの読み込みがコーディングエージェントのワークフローのコストを支配することが多いため、これは重要です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Claude Contextがトークン使用量とツールコールをベースラインに対して削減したことを示すベンチマークチャート</span> </span></p>
<p>このプロジェクトは現在10,000以上のGitHubスターを獲得しており、リポジトリにはベンチマークの詳細とパッケージのリンクが含まれている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Claude ContextのGitHubスターが急速に増えている。</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Claude Context は実際のバグで grep と比べてどうなのか？<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>このベンチマークでは、実際のデバッグ作業において、純粋なテキスト検索とmilvusに支えられたコード検索を比較しています。違いはトークンが少ないだけではありません。Claude Contextはエージェントの検索パスを変更します：変更する必要がある実装の近くから検索を開始します。</p>
<table>
<thead>
<tr><th>ケース</th><th>ベースラインの動作</th><th>クロードコンテキストの動作</th><th>トークンの削減</th></tr>
</thead>
<tbody>
<tr><td>Django<code translate="no">YearLookup</code> バグ</td><td>間違った関連シンボルを検索し、登録ロジックを編集。</td><td><code translate="no">YearLookup</code> 最適化ロジックを直接発見。</td><td>トークンが 93% 減少</td></tr>
<tr><td>Xarray<code translate="no">swap_dims()</code> のバグ</td><td><code translate="no">swap_dims</code> に関する言及の周辺に散在するファイルを読んだ。</td><td>実装と関連テストをより直接的に発見。</td><td>トークンが 62% 減少</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">ケース 1: Django YearLookup のバグ</h3><p><strong>問題の説明：</strong>Django フレームワークでは、<code translate="no">YearLookup</code> クエリの最適化が、<code translate="no">__iso_year</code> フィルタリングを壊しています。<code translate="no">__iso_year</code> フィルタを使うと、<code translate="no">YearLookup</code> クラスは標準の BETWEEN 最適化を誤って適用します。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ベースライン (grep)：</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>テキスト検索で、<code translate="no">YearLookup</code> の最適化ロジックではなく、<code translate="no">ExtractIsoYear</code> の登録に焦点が当てられていました。</p>
<p><strong>クロード・コンテキスト：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>意味検索は<code translate="no">YearLookup</code> をコアコンセプトとして理解し、正しいクラスへ直行しました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Django YearLookup ベンチマークの表は、Claude Context を使って 93% 少ないトークンを示しています</span> </span>。</p>
<p><strong>結果：</strong>トークンが 93% 減りました。</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">ケース 2: Xarray の swap_dims バグ</h3><p><strong>問題の説明</strong>Xarray ライブラリの<code translate="no">.swap_dims()</code> メソッドが、元のオブジェクトを予期せず変異させ、不変性の期待に反する。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ベースライン（grep）：</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>ベースライン（grep）：ベースラインは、実際の実装パスを見つける前に、ディレクトリをナビゲートし、近くのコードを読むことに時間を費やした。</p>
<p><strong>クロード・コンテキスト：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>意味的検索により、関連する<code translate="no">swap_dims()</code> 実装と関連するコンテキストをより速く特定。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Xarrayのswap_dimsベンチマークテーブルでは、Claude Contextを使用することでトークンが62%減少している</span> </span>。</p>
<p><strong>結果：</strong>トークンが62%減少。</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Claude Contextを使い始める<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>この投稿にあるツールをそのまま試したい場合は、<a href="https://github.com/zilliztech/claude-context">Claude Context GitHubリポジトリと</a> <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCPパッケージから</a>始めよう。リポジトリにはセットアップ手順、ベンチマーク、TypeScriptのコアパッケージが含まれている。</p>
<p>検索レイヤーを理解したりカスタマイズしたい場合は、次のステップとしてこれらのリソースが役に立つ：</p>
<ul>
<li><a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタートで</a>ベクターデータベースの基本を学ぶ。</li>
<li><a href="https://milvus.io/docs/full-text-search.md">Milvusの全文検索と</a> <a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChainの全文検索のチュートリアルを見て</a>、BM25スタイルの検索と高密度なベクトルを組み合わせたい場合。</li>
<li>インフラストラクチャのオプションを比較する場合は、<a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">オープンソースのベクトル検索エンジンを</a>確認してください。</li>
<li>Claude Codeのワークフロー内で直接ベクトルデータベースを操作したい場合は、<a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin for Claude</a>Codeをお試しください。</li>
</ul>
<p>Milvusやコード検索アーキテクチャのヘルプについては、<a href="https://milvus.io/community/">Milvusコミュニティに</a>参加するか、<a href="https://milvus.io/office-hours">Milvusオフィスアワーを</a>予約してマンツーマンで指導を受けてください。インフラストラクチャのセットアップを省略したい場合は、<a href="https://cloud.zilliz.com/signup">Zilliz Cloudにサインアップ</a>するか、<a href="https://cloud.zilliz.com/login">Zilliz Cloudにサインインして</a>バックエンドとしてマネージドMilvusをご利用ください。</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">なぜClaude Codeはコーディングタスクで多くのトークンを使うのですか？</h3><p>Claude Code は、タスクが大規模なリポジトリで検索とファイル読み込みのループを繰り返す必要がある場合、多くのトークンを使用することができます。エージェントがキーワードで検索し、関連性のないファイルを読み、また検索する場合、たとえそのコードがタスクに有用でなくても、読み取るファイルごとにトークンが追加されます。</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">クロードコンテキストはどのようにしてクロードコードのトークン使用量を減らすのですか？</h3><p>Claude Contextは、エージェントがファイルを読み込む前に、Milvusにバックアップされたコードインデックスを検索することで、トークンの使用量を減らします。ハイブリッド検索で関連するコードチャンクを取得するため、Claude Code はより少ないファイルを検査し、実際に重要なコードにより多くのコンテキストウィンドウを費やすことができます。</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">クロードコンテキストはクロードコードだけのものですか？</h3><p>Claude ContextはMCPサーバーとして公開されているので、MCPをサポートするどのコーディングツールでも動作します。Claude Code はこの記事の主な例ですが、同じ検索レイヤーは他の MCP 互換 IDE やエージェントワークフローをサポートできます。</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Claude Contextを使うにはZilliz Cloudが必要ですか？</h3><p>Claude ContextはマネージドMilvusバックエンドとしてZilliz Cloudを使うことができます。同じ検索アーキテクチャはMilvusのコンセプトに基づいているため、セルフマネージドMilvusデプロイメントにも適応できます。</p>
