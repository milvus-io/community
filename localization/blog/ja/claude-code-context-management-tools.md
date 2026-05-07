---
id: claude-code-context-management-tools.md
title: クロードコードのコンテキスト管理に最適なオープンソースツール7選
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/claude_code_context_management_tools_16_9fdd81ad02.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: 長いクロード・コード・セッションはすぐにシグナルを失う。端末ノイズ、コード検索、ツール出力、メモリ、トークンの使用をトリミングする7つのツールを学ぶ。
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>クロード・コードに1Mトークンのコンテキスト・ウィンドウを与えても、時間の経過とともに悪い答えが返ってくる。問題はコンテキストのサイズだけではない。コンテキストの質です。</p>
<p>ターミナルログ、生のツール出力、繰り返されるファイル読み込み、冗長な応答、忘れ去られたプロジェクト履歴のすべてが注目のために競合すると、Claude Codeのセッションは劣化します。モデルがスレッドを失い、答えを修正するためにさらにターンを追加し、その余分なターンがさらにノイズを追加する。</p>
<p>これは<strong>コンテキストのデフォーカス</strong>です。モデルには情報を保持する十分なスペースがありますが、重要な情報は信号の少ないコンテキストの下に埋もれてしまいます。大きなウィンドウは、開発者がプロンプトに何が入るかを注意深く考えなくなるため、これを無視しやすくします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>プロンプト・キャッシングの図は、再利用された接頭辞が、どのようにしてターン間にわたって課金されたコンテキストを追加できるかを示している。</span> </span></p>
<p>プロンプトのキャッシュは繰り返しプレフィックスのコストを削減しますが、コンテキストウィンドウをガラクタの引き出しに変えるわけではありません。新しいトークンにはまだお金がかかるし、正しい情報を推論するモデルも必要だ。</p>
<p>この記事では、端末の出力、ツールの出力、コードベースのナビゲーション、ファイルの読み込み、モデルの冗長性、意味的なコード検索、クロスセッションメモリといった、異なるレイヤーからコンテキストのデフォーカスを攻撃する7つのオープンソースツールをレビューする。また、これらの考え方が<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a>設計、<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル類似検索</a>、milvusのような検索システムにどのようにマッピングされるかを説明する。</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">クロード・コードのコンテキスト・デフォーカスの原因は？<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>クロードコードコンテキストデフォーカスは通常、5つの失敗モードから起こります：多すぎる生の命令テキスト、ノイズの多いツール出力、繰り返されるコードベース探索、長いモデル応答、セッションやエージェント間のメモリギャップです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>クロードコードのコンテキストが失われる5つの原因：冗長な命令、乱雑なツール出力、繰り返されるコードベース検索、長い応答、メモリギャップ</span> </span></p>
<table>
<thead>
<tr><th>コンテキスト障害モード</th><th>クロードコードではどのように見えるか</th><th>役立つツールカテゴリー</th></tr>
</thead>
<tbody>
<tr><td>端末のログがうるさい</td><td><code translate="no">git</code>,<code translate="no">pytest</code>,<code translate="no">gh</code>, クラウドCLIはモデルが必要とする以上のテキストをダンプする。</td><td>CLI出力の圧縮</td></tr>
<tr><td>ツール出力がウィンドウに溢れる</td><td>テストログ、DOMダンプ、MCP出力は、巨大な生のブロックとしてチャットに入る。</td><td>ツール出力のサンドボックス化</td></tr>
<tr><td>コードベースのナビゲーションの繰り返し</td><td>クロードはディレクトリをリストアップし、grepし、ファイルを読み込み、毎セッション同じ探索を繰り返す。</td><td>コードグラフやセマンティック検索</td></tr>
<tr><td>ファイルの読み取りが広すぎる</td><td>シンボルや要約が1つだけ必要なのに、ファイル全体を読んでしまう。</td><td>漸進的なコード読み取り</td></tr>
<tr><td>クロードがしゃべりすぎる</td><td>回答そのものが、将来のターンのために不必要な文脈を追加する。</td><td>レスポンスの圧縮</td></tr>
<tr><td>記憶が持続しない</td><td>新しいセッションを始めるたびに、プロジェクトの決定を説明し直すことになる。</td><td>マークダウン優先のメモリ</td></tr>
</tbody>
</table>
<p>優れたコンテキスト管理スタックは、3つのことを行う必要があります：ジャンクを排除し、適切なプロジェクト知識をオンデマンドで取得し、セッションをまたいで耐久性のある決定を保持することです。</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">どのClaude Codeのコンテキストツールを最初に使うべきか？<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>ワークフローに最もノイズを発生させるレイヤーから始めよう。端末の出力が問題なら、RTKから始めましょう。もしClaudeが大きなリポジトリの中をさまよい続けるなら、claude-contextかcode-review-graphから始めましょう。毎日同じ決定を説明し直すのが本当に苦痛なら、memsearchから始めよう。</p>
<table>
<thead>
<tr><th>ツール</th><th>解決する主な問題</th><th>ベストフィット</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>一般的な開発者コマンドによるターミナル出力のノイズ。</td><td>クロードコード内で多くのCLIコマンドを実行する開発者。</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">コンテキストモード</a></td><td>大量の生のツール出力がメインの会話に入る。</td><td>Playwright、GitHub、ログ、MCPツールのヘビーユーザー。</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">コードレビューグラフ</a></td><td>大規模レポのコードベース探索。</td><td>レビュー、依存性分析、ブラスト半径の質問。</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">トークンの救世主</a></td><td>シンボルの要約で十分な場合に、ファイルを完全に読み込む。</td><td>大きなファイル、繰り返されるシンボル検索、インクリメンタルなコード読み取り。</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">穴居人</a></td><td>クロード自身の冗長な応答癖。</td><td>簡潔な出力と小さな将来のコンテキストを求めるユーザー。</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">クロード・コンテキスト</a></td><td>セッションごとにコードベースを再探索。</td><td>MCPによるセマンティックコード検索。</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>セッション、エージェント、モデルスイッチにまたがってプロジェクトの記憶を失う。</td><td>長期にわたるプロジェクトでは、永続的な決定や教訓が必要である。</td></tr>
</tbody>
</table>
<p>最初の5つのツールは、コンテキストに入るものや残るものを減らす。最後の2つは、有用なコンテキストを思い出しやすくする。</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTKはクロードが見る前に生のコマンド出力を圧縮する。<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK は、一般的な開発者コマンドのトークン使用量を減らすための CLI プロキシだ。GitHubの説明によると、一般的な開発者コマンドのLLMトークン消費を60-90%削減し、単一のRustバイナリとして出荷されます。</p>
<p>日常的なClaude Codeの使用では、<code translate="no">git status</code> 、<code translate="no">pytest</code> 、ディレクトリ一覧のようなコマンドは、コンテキスト・ウィンドウに完全な環境情報とステータスの説明をダンプすることが多い。モデルは通常、どのファイルが変更されたか、どのテストが失敗したか、PRがどこで止まっているか、ディレクトリにどのようなキーファイルが存在するか、といった小さな答えだけを必要とします。</p>
<p>RTKはシェルとClaudeの間に位置する。RTKはClaude Codeのフックを通してコマンドを書き換え、圧縮された出力を返すことができます。</p>
<p>生の<code translate="no">git status</code> 出力：</p>
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
<p>実際に重要なもの：</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">pytest</code> と同じ話です。生の出力は、パスケースと環境ノイズに満ちている：</p>
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
<p>圧縮すれば、信号は即座に得られる：</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTKは、コンテキストの肥大化がコード検索ではなくシェルコマンドから来る場合、最も簡単な出発点です。</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">コンテキストモードは、巨大なツールの出力をメインチャットの外でサンドボックス化する<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Modeは、ツールが返す生のブロック（テストログ、ブラウザのDOMスナップショット、GitHubのペイロード、MCPツールの出力、スクレイピングされたページ）のために構築されている。GitHubの説明では、AIコーディング・エージェントのためのコンテキスト・ウィンドウの最適化を強調し、ツールの出力を98%削減することを報告している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>サンドボックス化されたツール出力とコンテキスト最適化の位置づけを示すコンテキストモードGitHubリポジトリカード</span> </span></p>
<p>そのアプローチは、大きなツール出力をローカルのサンドボックスとインデックスに分離し、要約と検索ハンドルのみをクロード会話に渡すというものだ。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>サンドボックス実行、SQLiteまたはFTSインデックス、サマリー、検索結果を移動する大きなツール出力を示すコンテキストモードフロー</span> </span></p>
<p>コーディングエージェントは、DOM全体や通過したすべてのテスト行ではなく、失敗したノード、壊れたセレクタ、関連するスタックトレースを必要とすることが多いため、このフローは便利です。コンテキスト・モードは、メインの会話を支配しないようにしながら、完全な出力をローカルで利用可能な状態に保つ。</p>
<p>これは、本番の<a href="https://zilliz.com/blog/hybrid-search-with-milvus">ハイブリッド検索</a>システムがストレージと検索を分けているのと似ている。生データを耐久性のある場所に保管し、重要なスライスだけを取り出すのだ。</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graphは、クロードがナビゲートする前にコード構造をマッピングする。<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graphは別の問題に取り組んでいる：クロードは常に多くのテキストを必要としているのではなく、より良いマップを必要としているのだ。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>code-review-graphのロゴ画像は元記事で使用されています。</span> </span></p>
<p>大きなリポジトリでは、単純な質問が高価な探索の引き金になることがあります：</p>
<blockquote>
<p>このログインロジックを変更したら、どのファイルやテストが影響を受けるのか？</p>
</blockquote>
<p>コードグラフがなければ、クロードの典型的な動きはこうだ：</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph はコードベースの構造マップを事前に構築する。Tree-sitterを使って関数、クラス、インポート、呼び出し関係、継承、テストの依存関係を解析し、SQLiteにグラフを書き込む。</p>
<p>そのため、コードレビューやブラスト半径分析に役立つ。Claudeに依存関係グラフを何度も読み込んで再発見させる代わりに、最初に構造問い合わせをさせるのだ。</p>
<p>これは<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">セマンティック検索に</a>近いが、同一ではない。構造グラフは "何が何に依存しているか？"に答える。意味検索は、"この質問に概念的に関連するコードは何か？"に答える。実際のコード・アシスト・ワークフローでは、両方を必要とすることが多い。</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Saviorは完全なファイルの前にクロード・シンボルの要約を与える<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>Token Saviorの核となるアイデアはシンプルだ：デフォルトで完全なファイルを送らない。まずインデックスかシンボル・サマリーを送り、タスクがより詳細を必要とするときだけ拡張する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>東建救世主のGitHubリポジトリ・カードに、MCPサーバーの説明とプロジェクトの統計情報が表示されている。</span> </span></p>
<p>支払いのウェブフックがどこで処理されるかを尋ねる場合、モデルは多くの場合、関連するすべてのファイルのすべての行を必要としません。まず、ファイルやシンボルが関連するかどうかを知る必要がある。</p>
<p>トークン・セイバーはコードをレイヤーに分けて提供します：</p>
<table>
<thead>
<tr><th>レイヤー</th><th>クロードが受け取るもの</th><th>展開するとき</th></tr>
</thead>
<tbody>
<tr><td>概要</td><td>インデックス、シンボル名、短い説明。</td><td>デフォルトの最初の応答。</td></tr>
<tr><td>スニペット</td><td>関連するシンボルの周りの小さなコードセクション。</td><td>要約が関連しそうな場合。</td></tr>
<tr><td>完全なファイル</td><td>ファイルの完全な内容。</td><td>編集や深い推論が必要な場合のみ。</td></tr>
</tbody>
</table>
<p>これは開発者が実際にどのようにコードを読むかを反映している。スキャンして関連性を確認し、必要なときだけ完全なファイルを開く。また、<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAGアプリケーションで</a>使用される漸進的な検索パターンにも似ている：方向づけのために十分に広く検索し、生成の前にコンテキストを絞り込む。</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">CavemanはClaude自身のレスポンスの肥大化を抑える。<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>ほとんどのコンテキストツールは、モデルに入るものに焦点を当てている。CavemanはClaudeが出力するものを対象とする。</p>
<p>CavemanはClaude Codeのスキル／プラグインであり、フィラー、お世辞、ラッパー文、過剰説明、反復構造を取り除く。その目的は知識を取り除くことではなく、答えの密度を濃くすることだ。</p>
<p>穴居人なしで：</p>
<blockquote>
<p>Reactコンポーネントが再レンダリングしている理由は、おそらく...</p>
</blockquote>
<p>穴居人あり：</p>
<blockquote>
<p>レンダリングするたびに新しいオブジェクトを参照する。インラインオブジェクトprop = new ref = re-render.useMemoでラップする。</p>
</blockquote>
<p>クロード自身の答えが将来のコンテキストになるので、これは重要だ。すべての答えに長い説明が含まれていると、次のターンは必要以上のテキストから始まります。より短い答えは、現在のターンを改善するのと同じくらい、次のターンを改善することができる。</p>
<p><a href="https://zilliz.com/blog/context-engineering-for-ai-agents">AIエージェントのためのコンテキストエンジニアリングを考えて</a>いるチームにとって、Cavemanは出力ポリシーがコンテキストポリシーの一部であることを思い出させてくれる。</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-contextはMCPを通じてセマンティックコード検索を追加する。<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-contextは、繰り返されるコードベース探索の問題をセマンティック検索で解決する。リポジトリにインデックスを付け、ベクターデータベースにコードチャンクを格納し、<a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocolを通して</a>検索を公開する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Claude ContextのリポジトリはGitHubで公開されている 元記事のトレンド</span> </span></p>
<p>大きなコードベースでは、あなたは常にクロードに次のような質問をする：</p>
<blockquote>
<p>このコードのどの部分がこのバグに関係しているのかわかるようにしてください。</p>
</blockquote>
<p>検索レイヤーがない場合、Claudeのデフォルトのアプローチはしばしばこうなる：</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-contextは、その作業を検索レイヤーに移動する。claude-contextはリポジトリをチャンク化し、埋め込みを生成し、それらを<a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">milvusにバックアップされたコードインデックスに</a>格納し、モデルがブラインドでファイルを読み始める前に関連するコードチャンクを検索する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>コードベースのチャンキング、埋め込み、ベクトルデータベースとハイブリッド検索、関連コード検索、クロード・コンテキスト・インジェクションを示すクロード・コンテキスト・フロー</span> </span></p>
<p>ここからAIコーディングツールが検索システムのように見えてくる。チャンキング、埋め込み、メタデータ、語彙マッチング、ランキング、鮮度が必要だ。これらは、<a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">プロダクションRAG検索</a>、<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">ハイブリッド検索ルーティング</a>、<a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">埋め込みモデル選択の</a>背後にある同じ構成要素だ。</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch はセッションやエージェントにまたがって有用なメモリを保持する。<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearchは、何を忘れるかではなく、どのように重要なことを思い出すかという問題の反対側に取り組んでいる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>memsearchのロゴ画像は元記事より</span> </span></p>
<p>月曜日にクロードに言ったとしよう：</p>
<blockquote>
<p>失敗したイベントはデッドレターキューに入れる必要がある。</p>
</blockquote>
<p>水曜日、あなたは新しいセッションを開き、こう尋ねた：</p>
<blockquote>
<p>ウェブフック・レイヤーで他に何を最適化できますか？</p>
</blockquote>
<p>耐久性のあるメモリがないと、クロードは月曜日の決定をまるで何もなかったかのように扱う。もう一度説明してくれ。</p>
<p>memsearchは、メモリをローカルで人間が読めるMarkdownファイルとして保存し、milvusを再構築可能な検索インデックスとして使用する。このデザインは、エージェントが検索できるようにしながらも、人間が編集可能なメモリーを維持する。</p>
<p>検索時には、memsearchはプログレッシブ検索を使用します：最初に検索し、必要であれば拡張し、必要な時だけ元のトランスクリプトにドリルダウンします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>memsearchのプログレッシブな検索フローは、検索、展開、トランスクリプト、そしてメインの会話への要約されたリターンです。</span> </span></p>
<p>このMarkdownファーストのパターンは、セッション、モデル、エージェントをまたいで作業するチームにとって便利です。また、<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">長期的なAIエージェントのメモリ</a>、<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">共有されたマルチエージェントメモリ</a>、そして<a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">エージェントシステムにおけるコンテキストの腐敗を</a>防ぐという広範な問題とも自然に組み合わされます。</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">これらのツールはどのように連携するのか？<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>7つのツールは相互補完的であり、互換性はありません。レイヤーとして使用する。</p>
<table>
<thead>
<tr><th>レイヤー</th><th>これらのツールを使う</th><th>なぜ</th></tr>
</thead>
<tbody>
<tr><td>コマンドノイズの除去</td><td>RTK</td><td>クロードに到達する前に、大量の端末出力を圧縮する。</td></tr>
<tr><td>生のツール出力をサンドボックス化</td><td>コンテキストモード</td><td>大きなログ、DOM、ツールのペイロードをメインの会話の外に保つ。</td></tr>
<tr><td>マップコード構造</td><td>コードレビューグラフ</td><td>ファイルをブラインドで読むことなく、依存性とブラスト半径の質問に答える。</td></tr>
<tr><td>コードを徐々に読む</td><td>トークンの救世主</td><td>シンボルの要約から始め、必要に応じて拡張する。</td></tr>
<tr><td>クロードの答えを圧縮する</td><td>穴居人</td><td>モデル自身の出力が将来のコンテキストの肥大化を防ぐ。</td></tr>
<tr><td>関連するコードを取り出す</td><td>クロードコンテキスト</td><td>grepループを繰り返す代わりに、セマンティック検索とハイブリッドコード検索を使う。</td></tr>
<tr><td>耐久性のある決定を再利用する</td><td>memsearch</td><td>セッション、エージェント、モデルスイッチにまたがるプロジェクトの履歴を呼び出す。</td></tr>
</tbody>
</table>
<p>実用的なロールアウト順序は</p>
<ol>
<li><strong>明らかなノイズを最初に消す。</strong>シェル出力やツールのペイロードがコンテキストを支配している場合は、RTKやコンテキストモードを追加する。</li>
<li><strong>リポジトリのナビゲーションを修正しました。</strong>コード構造のための code-review-graph や、セマンティックなコード検索のための claude-context を追加する。</li>
<li><strong>残るものをコントロールする。</strong>Token SaviorとCavemanを使って、ファイルの読み込みとモデルの応答をコンパクトに保つ。</li>
<li><strong>耐久性のある知識を保存する。</strong>繰り返しの説明がボトルネックになる場合は、memsearchを使う。</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">連絡を取り合う<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li><a href="https://discord.com/invite/8uyFbECzPX">MilvusのDiscordコミュニティに</a>参加して、他の開発者に質問したり、コンテキスト管理パターンを比較したりしましょう。</li>
<li>コード、メモリ、またはRAGワークロードの検索レイヤーの設計を支援したい場合は、<a href="https://milvus.io/office-hours">Milvusオフィスアワー（無料）を予約してください</a>。</li>
<li>インフラストラクチャのセットアップを省きたい場合は、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（マネージドMilvus）が無料のティアを提供しています。</li>
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
    </button></h2><p><strong>有用なコンテキストを失うことなくClaude Codeトークンの使用量を減らすにはどうすればいいですか？</strong></p>
<p>ターミナル出力、生のツールペイロード、繰り返されるコードの読み取りなど、最もノイズの多い入力を圧縮することから始めます。それから claude-context や code-review-graph のような検索ツールを追加して、Claude がリポジトリをゼロから探索する代わりに関連するコードを引き出せるようにします。</p>
<p><strong>大きなリポジトリには claude-context と code-review-graph のどちらを使うべきですか？</strong></p>
<p>意味的なコード検索が必要なとき、特に正確なファイル名やシンボル名がわからないときは claude-context を使ってください。code-review-graphは、呼び出しの関係、インポート、テストの依存関係、レビューの爆発半径など、構造的な答えが必要なときに使います。</p>
<p><strong>クロードコードでは、メモリとコード検索は違うのですか？</strong></p>
<p>はい。コード検索は関連するプロジェクトファイルやシンボルを見つけます。メモリー検索は、耐久性のある決定、ユーザー設定、デバッグ履歴、セッションをまたいだレッスンを呼び出します。memsearch はメモリーに焦点を当て、claude-context はコード検索に焦点を当てます。</p>
<p><strong>これらのツールは、プロンプト・キャッシングや大きなコンテキスト・ウィンドウの代わりになるのでしょうか？</strong></p>
<p>いいえ。プロンプト・キャッシングや大きなコンテキスト・ウィンドウは、容量やコストの面では役立ちますが、どの情報が注目に値するかを決めるものではありません。コンテキスト管理ツールは、最初にモデルに入る情報の質と密度を向上させる。</p>
