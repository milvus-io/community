---
id: claude-code-context-management-tools.md
title: |
  Claudeのコードコンテキスト管理に最適なオープンソースツール7選
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Long Claude
  Codeのセッションでは、信号がすぐに途切れてしまいます。ターミナルのノイズ低減、コードの復元、ツールの出力、メモリ、トークンの使用量を最適化するための7つのツールを学びましょう。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Claude Code に 100 万トークンのコンテキストウィンドウを指定しても、時間の経過とともに回答の質が低下することがあります。問題はコンテキストのサイズだけではありません。コンテキストの質にも原因があります。</p>
<p>ターミナルのログ、ツールの生の出力、繰り返されるファイル読み込み、冗長な応答、そして忘れ去られたプロジェクトの履歴などが、すべてモデルの注意を奪い合うと、Claude Codeのセッションの品質は低下します。長時間実行されるエージェントのワークフローでは、そのノイズがループ化してしまいます。モデルが話の筋を見失い、回答を修正するためにターン数を増やせば、その分、さらにノイズが増えてしまうのです。</p>
<p>これが「<strong>コンテキストの焦点喪失</strong>」です。モデルには情報を保持する十分な容量があるものの、重要な情報が信号の弱いコンテキストの下に埋もれてしまっているのです。ウィンドウが大きくなると、開発者がプロンプトに何を入力するかを慎重に考えなくなるため、この問題を無視しやすくなってしまいます。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>再利用されたプレフィックスが、ターン間で課金対象となるコンテキストを依然として増加させる仕組みを示すプロンプトキャッシュの図</span>
  
 </span></p>
<p>プロンプトキャッシュは、プレフィックスの繰り返しによるコストを削減できますが、コンテキストウィンドウを「ガラクタ入れ」に変えるわけではありません。新しいトークンには依然としてコストがかかり、モデルが正しい情報に基づいて推論を行う必要があります。</p>
<p>本記事では、コンテキストの焦点喪失に、ターミナル出力、ツール出力、コードベースのナビゲーション、ファイル読み取り、モデルの冗長性、意味的コード検索、セッション間メモリという異なるレイヤーから取り組む7つのオープンソースツールを紹介する。また、これらのアイデアが、<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベースの</a>設計、<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル類似度検索</a>、およびMilvusのような検索システムにどのように対応するかも解説する。</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Claude Codeのコンテキストの焦点喪失の原因とは？<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeのコンテキストの焦点喪失は、通常、5つの失敗モードに起因します。それは、生の指示テキストが多すぎる、ノイズの多いツール出力、コードベースの探索の繰り返し、モデルの応答が長すぎる、およびセッションやエージェント間の記憶の断絶です。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Claude Codeのコンテキスト喪失の5つの原因：冗長な指示、乱雑なツール出力、繰り返されるコードベースの探索、長い応答、および記憶の断絶</span>
  
 </span></p>
<table>
<thead>
<tr><th>コンテキストの失敗モード</th><th>Claude Codeにおける具体的な症状</th><th>役立つツールのカテゴリ</th></tr>
</thead>
<tbody>
<tr><td>ターミナルログがノイズが多い</td><td><code translate="no">git</code>、<code translate="no">pytest</code> 、<code translate="no">gh</code> 、およびクラウドCLIは、モデルが必要とする量以上のテキストを出力します。</td><td>CLI出力の圧縮</td></tr>
<tr><td>ツールの出力がウィンドウを埋め尽くす</td><td>テストログ、DOMダンプ、MCPの出力が、巨大な生のブロックとしてチャットに表示される。</td><td>ツール出力のサンドボックス化</td></tr>
<tr><td>コードベースのナビゲーションが繰り返される</td><td>Claudeはディレクトリを列挙し、grepを実行し、ファイルを読み込み、セッションごとに同じ探索を繰り返す。</td><td>コードグラフまたは意味的検索</td></tr>
<tr><td>ファイルの読み込み範囲が広すぎる</td><td>モデルは、1つのシンボルや要約だけで済むにもかかわらず、ファイル全体を読み込んでしまう。</td><td>段階的なコード読み取り</td></tr>
<tr><td>Claudeの話しすぎ</td><td>回答自体が、その後のやり取りに不要な文脈を追加してしまう。</td><td>応答の圧縮</td></tr>
<tr><td>記憶が保持されない</td><td>新しいセッションを始めるたびに、プロジェクトの決定事項を改めて説明することになる。</td><td>「マークダウン優先」の記憶</td></tr>
</tbody>
</table>
<p>優れたコンテキスト管理スタックには、3つの役割が求められます。不要な情報を排除し、必要に応じて適切なプロジェクト知識を取り出し、セッションをまたいで決定内容を永続的に保持することです。</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">どのClaude Codeコンテキストツールを最初に使うべきか？<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>ワークフローの中で最もノイズを生み出しているレイヤーから始めましょう。ターミナルの出力が問題なら、RTKから始めます。Claudeが巨大なリポジトリ内をさまよってしまうなら、claude-contextやcode-review-graphから始めます。毎日同じ決定事項を説明し直さなければならないことが本当の悩みなら、memsearchから始めましょう。</p>
<table>
<thead>
<tr><th>ツール</th><th>解決する主な問題</th><th>最適な組み合わせ</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>一般的な開発者向けコマンドによるノイズの多いターミナル出力。</td><td>Claude Code内で多くのCLIコマンドを実行する開発者。</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">コンテキストモード</a></td><td>メインの会話に大量の生のツール出力が流入する。</td><td>Playwright、GitHub、ログ、またはMCPツールを多用するユーザー。</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>大規模なリポジトリにおけるコードベースの盲目的な探索。</td><td>レビュー、依存関係分析、および影響範囲に関する質問。</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>シンボルの要約で事足りる場面でもファイル全体を読み込んでしまう。</td><td>大容量ファイル、シンボルの繰り返し検索、およびコードの増分読み込み。</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Claude自身の冗長な応答癖。</td><td>簡潔な出力と、将来的なコンテキストの縮小を望むユーザー。</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>セッションごとにコードベースを再探索すること。</td><td>MCPによる意味論的なコード検索。</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>セッション、エージェント、モデルの切り替えをまたいでプロジェクトの記憶が失われる。</td><td>持続的な意思決定と教訓を含む、長期にわたるプロジェクト。</td></tr>
</tbody>
</table>
<p>最初の5つのツールは、コンテキストに入ったり残ったりする情報を削減します。最後の2つは、有用なコンテキストをより簡単に呼び出せるようにします。</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTKは、Claudeがコマンドの出力を認識する前に、生のコマンド出力を圧縮します<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTKは、一般的な開発者向けコマンドのトークン使用量を削減するためのCLIプロキシです。GitHubの説明によると、一般的な開発コマンドにおけるLLMのトークン消費量を60～90%削減し、単一のRustバイナリとして提供されています。</p>
<p>日常的なClaude Codeの使用において、<code translate="no">git status</code> 、<code translate="no">pytest</code> 、ディレクトリ一覧表示などのコマンドは、しばしば完全な環境情報やステータス説明をコンテキストウィンドウに書き出します。モデルが必要とするのは通常、どのファイルが変更されたか、どのテストが失敗したか、プルリクエストがどこで滞っているか、あるいはディレクトリ内にどのような重要なファイルが存在するかといった、より簡潔な回答だけです。</p>
<p>RTKはシェルとClaudeの間に位置します。Claude Codeのフックを通じてコマンドを書き換え、圧縮された出力を返すことが可能です。</p>
<p><code translate="no">git status</code> の生の出力：</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>実際に重要な情報：</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">pytest</code> でも状況は同じです。生の出力には、成功したケースや環境ノイズが大量に含まれています：</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>圧縮されると、メッセージは一目で理解できます：</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>コンテキストの肥大化がコードの取得ではなくシェルコマンドに起因している場合、RTKは最も手軽な出発点となります。</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">コンテキストモードは、メインチャットの外で巨大なツール出力をサンドボックス化します<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Modeは、ツールが返す生のデータブロック（テストログ、ブラウザのDOMスナップショット、GitHubのペイロード、MCPツールの出力、スクレイピングされたページなど）を処理するために設計されています。GitHubの説明文では、AIコーディングエージェント向けのコンテキストウィンドウの最適化が強調されており、ツール出力が98%削減されたと報告されています。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>サンドボックス化されたツール出力とコンテキスト最適化の位置付けを示す、Context ModeのGitHubリポジトリカード</span>
  
 </span></p>
<p>そのアプローチは、大規模なツール出力をローカルのサンドボックスとインデックスに隔離し、要約と検索ハンドルのみをClaudeの会話に渡すというものです。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Context Modeのフロー：大規模なツール出力が、サンドボックス実行、SQLiteまたはFTSインデックス、要約、検索結果を経て処理される様子</span>
  
 </span></p>
<p>このフローが有用なのは、コーディングエージェントが、DOM全体やすべてのテスト通過行ではなく、失敗したノード、破損したセレクタ、または関連するスタックトレースを必要とすることが多いためです。Context Modeは、完全な出力をローカルで利用可能な状態に保ちつつ、それがメインの会話の主導権を握ることを防ぎます。</p>
<p>これは、実稼働中の<a href="https://zilliz.com/blog/hybrid-search-with-milvus">ハイブリッド検索</a>システムが保存と検索を分離している仕組みに似ています。生データを耐久性のある場所に保存しておき、必要な部分のみを取り出すのです。</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graphは、Claudeがコード構造を探索する前にその構造をマッピングします<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graphは別の問題に対処しています。Claudeには必ずしもより多くのテキストが必要なのではなく、より優れたマップが必要なのです。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>元の記事で使用された code-review-graph のロゴ画像</span>
  
 </span></p>
<p>大規模なリポジトリでは、単純な質問がコストのかかる探索を引き起こす可能性があります：</p>
<blockquote>
<p>このログインロジックを変更した後、どのファイルやテストに影響が出るでしょうか？</p>
</blockquote>
<p>コードグラフがなければ、Claudeの典型的な動作は次のようになります：</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graphは、コードベースの構造マップを事前に構築します。Tree-sitterを使用して関数、クラス、インポート、呼び出し関係、継承、テストの依存関係を解析し、そのグラフをSQLiteに書き込みます。</p>
<p>これにより、コードレビューや影響範囲の分析に役立ちます。Claudeに繰り返し読み込みを行わせて依存関係グラフを再発見させる代わりに、まず構造をクエリさせることができます。</p>
<p>これは<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">セマンティック検索</a>と類似していますが、同一ではありません。構造グラフは「何が何に依存しているか？」という問いに答え、セマンティック検索は「この質問と概念的に関連するコードは何か？」という問いに答えます。実際のコードアシスタントのワークフローでは、多くの場合、その両方が求められます。</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Saviorは、ファイル全体を送る前にClaudeにシンボル要約を提供します<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Saviorの核心となる考え方は単純です。デフォルトではファイル全体を送信せず、まずインデックスやシンボル要約を送信し、タスクでより詳細な情報が必要になった場合にのみ展開するというものです。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Token SaviorのGitHubリポジトリカード。MCPサーバーの説明とプロジェクト統計が表示されています</span>
  
 </span></p>
<p>支払いウェブフックがどこで処理されているかを尋ねた場合、モデルは通常、関連するすべてのファイルのすべての行を必要としません。まず、そのファイルやシンボルが関連しているかどうかを知る必要があります。</p>
<p>Token Saviorはコードを階層的に提供します：</p>
<table>
<thead>
<tr><th>レイヤー</th><th>Claudeが受け取る内容</th><th>展開されると</th></tr>
</thead>
<tbody>
<tr><td>概要</td><td>インデックス、シンボル名、および簡単な説明。</td><td>デフォルトの最初の応答。</td></tr>
<tr><td>スニペット</td><td>関連するシンボルを中心とした、より小規模なコードセクション。</td><td>要約が関連性が高いと思われる場合。</td></tr>
<tr><td>ファイル全体</td><td>ファイルの内容全体。</td><td>編集や詳細な推論が必要な場合にのみ表示されます。</td></tr>
</tbody>
</table>
<p>これは、開発者が実際にコードを読む方法と一致しています。まずざっと目を通し、関連性を確認してから、必要な場合にのみファイル全体を開きます。また、<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAGアプリケーションで使用される</a>「段階的な情報取得」のパターンにも似ています。つまり、全体像を把握するために広範囲に情報を取得し、生成前にコンテキストを絞り込むというものです。</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">CavemanはClaude自身の応答の肥大化を軽減します<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>ほとんどのコンテキストツールは、モデルに入力される内容に焦点を当てています。Cavemanは、Claudeが出力する内容に焦点を当てています。</p>
<p>Cavemanは、Claude Code用のスキル／プラグインであり、無駄な言葉、挨拶、前置きとなる文、過剰な説明、反復的な構造を取り除きます。その目的は知識を削除することではなく、回答をより凝縮させることにあります。</p>
<p>Cavemanを使用しない場合：</p>
<blockquote>
<p>Reactコンポーネントが再レンダリングされる理由は、おそらく……</p>
</blockquote>
<p>Caveman使用時：</p>
<blockquote>
<p>レンダリングのたびに新しいオブジェクト参照が生成されるためです。インラインのオブジェクトプロパティ = 新しい参照 = 再レンダリング。useMemoでラップしてください。</p>
</blockquote>
<p>これが重要なのは、Claude自身の回答が将来のコンテキストとなるからです。すべての回答に長い説明が含まれていると、次のターンが必要以上に多くのテキストから始まってしまいます。回答を短くすることは、現在のターンを改善するのと同じくらい、次のターンを改善することにもつながります。</p>
<p><a href="https://zilliz.com/blog/context-engineering-for-ai-agents">AIエージェントのコンテキストエンジニアリング</a>を検討しているチームにとって、Cavemanは「出力ポリシーがコンテキストポリシーの一部である」ことを再認識させるものです。</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-contextはMCPを通じてセマンティックなコード検索を追加します<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-contextは、セマンティック検索を用いてコードベースの重複探索問題を解決します。リポジトリをインデックス化し、コードの断片をベクトルデータベースに格納し、<a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>を通じて検索機能を提供します。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>GitHubに公開されているClaude Contextリポジトリ（原文記事のトレンド欄に掲載</span> </span>）<span class="img-wrapper">
  
 </span></p>
<p>大規模なコードベースでは、次のような質問をClaudeに絶えず投げかけています：</p>
<blockquote>
<p>「このバグに関連している可能性のあるコードの箇所を特定するのを手伝ってください。」</p>
</blockquote>
<p>検索レイヤーがない場合、Claudeのデフォルトのアプローチは多くの場合次のようなものです：</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-contextは、その処理を検索レイヤーに移行させます。リポジトリをチャンクに分割し、埋め込みを生成して<a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">Milvusを基盤とするコードインデックス</a>に格納し、モデルがやみくもにファイルを読み込む前に、関連するコードチャンクを検索します。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>claude-contextのフロー図：コードベースのチャンク化、埋め込みベクトル、ベクトルデータベースとハイブリッド検索、関連コードの検索、およびClaudeへのコンテキスト注入</span>
  
 </span></p>
<p>ここで、AIコーディングツールは検索システムのような様相を帯びてきます。チャンク化、埋め込み、メタデータ、語彙マッチング、ランキング、そして最新性が求められます。これらは、<a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">本番環境におけるRAG検索</a>、<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">ハイブリッド検索ルーティング</a>、<a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">および埋め込みモデル選択の</a>背後にある構成要素と同じものです。</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearchは、セッションやエージェントをまたいで有用な記憶を保持します<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearchは、この問題の反対側、つまり「何を忘れるか」ではなく、「重要な情報をどのように呼び出すか」という課題に取り組んでいます。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>memsearchのロゴ画像（原文記事より</span> </span>）<span class="img-wrapper">
  
 </span></p>
<p>月曜日にClaudeに次のように指示したと想像してみてください：</p>
<blockquote>
<p>「当社のWebhookは失敗時に再試行できません。失敗したイベントはデッドレターキューに入れる必要があります。」</p>
</blockquote>
<p>水曜日に、新しいセッションを開いて次のように尋ねます：</p>
<blockquote>
<p>「Webhookレイヤーで他に最適化できる点はありますか？」</p>
</blockquote>
<p>永続的なメモリがないため、Claudeは月曜日の決定をまるでなかったことのように扱います。そこで、あなたは改めて説明します。</p>
<p>memsearchは、メモリをローカルの、人間が読めるMarkdownファイルとして保存し、再構築可能な検索インデックスとしてMilvusを使用します。この設計により、人間がメモリを編集できる状態を維持しつつ、エージェントによる検索も可能にしています。</p>
<p>検索時、memsearchは「プログレッシブ・リコール」を採用しています。まず検索を行い、必要に応じて展開し、必要な場合にのみ元のトランスクリプトまで掘り下げていきます。</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>memsearchのプログレッシブ検索フロー：検索、展開、トランスクリプト、要約を経てメインの会話に戻る</span>
  
 </span></p>
<p>この「Markdownファースト」のパターンは、複数のセッション、モデル、エージェントをまたがって作業するチームにとって有用です。また、<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">AIエージェントの長期記憶</a>、<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">共有マルチエージェント記憶</a>、<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">さらにはエージェントシステムにおけるコンテキストの劣化</a>を防ぐというより広範な課題とも自然に連携します。</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">これらのツールはどのように連携するのでしょうか？<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>これら7つのツールは相互に補完し合うものであり、互いに置き換え可能なものではありません。それらを層として活用してください。</p>
<table>
<thead>
<tr><th>レイヤー</th><th>これらのツールの活用方法</th><th>理由</th></tr>
</thead>
<tbody>
<tr><td>コマンドノイズを除去する</td><td>RTK</td><td>Claudeに送信される前に、大量のターミナル出力を圧縮します。</td></tr>
<tr><td>サンドボックスへのツール生出力の出力</td><td>コンテキストモード</td><td>大規模なログ、DOM、およびツールのペイロードをメインの会話の外に保持する。</td></tr>
<tr><td>コード構造のマッピング</td><td>code-review-graph</td><td>ファイルを盲目的に読み込むことなく、依存関係や影響範囲に関する質問に回答します。</td></tr>
<tr><td>コードを段階的に読み込む</td><td>トークン・セイバー</td><td>シンボルの要約から始め、必要に応じてのみ展開する。</td></tr>
<tr><td>Claudeの回答を圧縮する</td><td>Caveman</td><td>モデル自身の出力が将来のコンテキストを肥大化させないようにする。</td></tr>
<tr><td>関連するコードを取得する</td><td>claude-context</td><td>繰り返しのgrepループの代わりに、セマンティック検索およびハイブリッドコード検索を使用する。</td></tr>
<tr><td>持続可能な決定を再利用する</td><td>memsearch</td><td>セッション、エージェント、モデルの切り替えをまたいでプロジェクトの履歴を呼び出す。</td></tr>
</tbody>
</table>
<p>実用的な導入順序は以下の通りです：</p>
<ol>
<li><strong>まず明らかなノイズを除去する。</strong>コンテキストがシェル出力やツールのペイロードで占められている場合は、RTKまたはコンテキストモードを追加する。</li>
<li><strong>リポジトリのナビゲーションを改善する。</strong>構造把握には code-review-graph を、意味的なコード検索には claude-context を追加する。</li>
<li><strong>残す内容を制御します。</strong>Token SaviorやCavemanを使用して、ファイルの読み込みやモデルの応答をコンパクトに保ちます。</li>
<li><strong>永続的な知識を保持する。</strong>繰り返しの説明がボトルネックになった場合は、memsearchを使用する。</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">連絡を取り合いましょう<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li><a href="https://discord.com/invite/8uyFbECzPX">MilvusのDiscordコミュニティ</a>に参加して、質問をしたり、他の開発者とコンテキスト管理のパターンを比較したりしましょう。</li>
<li>コード、メモリ、または RAG ワークロード向けの検索レイヤーの設計についてサポートが必要な場合は、<a href="https://milvus.io/office-hours">無料の Milvus Office Hours セッションを予約してください</a>。</li>
<li>インフラのセットアップを省略したい場合は、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（マネージド版 Milvus）の無料プランを利用して、すぐに始められます。</li>
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
    </button></h2><p><strong>有用なコンテキストを失わずに、Claude Codeのトークン使用量を削減するにはどうすればよいですか？</strong></p>
<p>まず、ノイズの多い入力（ターミナル出力、生のツールペイロード、繰り返されるコードの読み取りなど）を圧縮することから始めましょう。次に、claude-context や code-review-graph などの検索ツールを追加し、Claude がリポジトリを一から探索するのではなく、関連するコードを直接取得できるようにします。</p>
<p><strong>大規模なリポジトリでは、claude-contextとcode-review-graphのどちらを使うべきですか？</strong></p>
<p>セマンティックなコード検索が必要な場合、特に正確なファイル名やシンボル名が分からない場合は、claude-contextを使用してください。呼び出し関係、インポート、テストの依存関係、レビューの波及範囲などの構造的な回答が必要な場合は、code-review-graphを使用してください。</p>
<p><strong>Claude Codeにおける「メモリ検索」と「コード検索」は異なりますか？</strong></p>
<p>はい。コード検索は、関連するプロジェクトファイルやシンボルを見つけ出します。記憶検索は、永続的な決定、ユーザー設定、デバッグ履歴、およびセッションをまたぐ教訓などを呼び出します。memsearchは記憶に焦点を当てており、claude-contextはコード検索に焦点を当てています。</p>
<p><strong>これらのツールは、プロンプトのキャッシュやより大きなコンテキストウィンドウに取って代わるものですか？</strong></p>
<p>いいえ。プロンプトのキャッシュや大きなコンテキストウィンドウは、処理能力やコストの面で役立ちますが、どの情報が注目に値するかを決定するものではありません。コンテキスト管理ツールは、そもそもモデルに入力される情報の質と密度を向上させます。<span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
