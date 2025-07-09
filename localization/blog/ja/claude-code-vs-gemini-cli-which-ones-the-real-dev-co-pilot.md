---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: Claude Code vs Gemini CLI：本当の副操縦士はどっち？
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: >-
  Gemini CLIとClaude
  Code、ターミナルワークフローを変革する2つのAIコーディングツールを比較。あなたの次のプロジェクトはどちらを使うべき？
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>IDEが肥大化している。コーディングアシスタントが古い。右クリックでリファクタリングするのが面倒くさい？CLIルネッサンスへようこそ。</p>
<p>AIコードアシスタントは、ギミックから実用的なツールへと進化しており、開発者たちは味方につけている。スタートアップのCursorを超え、<strong>Anthropicの</strong> <a href="https://www.anthropic.com/claude-code"><strong>Claude Codeは</strong></a>正確さと洗練さをもたらしている。Googleの<a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a>？高速で、無料で、コンテキストに飢えている。どちらも自然言語を新しいシェルスクリプトにすることを約束している。では<em>、</em>あなたの次のレポのリファクタリングはどれに任せればいいのだろうか？</p>
<p>私が見た限りでは、クロード・コードが早い段階でリードしていた。しかし、勝負はすぐに変わった。Gemini CLIがローンチされた後、開発者たちはGemini CLIに群がり、<strong>24時間以内に15.1kのGitHubスターを</strong>獲得した。現在のところ、<strong>55,000スターを</strong>数え、急上昇している。驚きだ！</p>
<p>多くの開発者がGemini CLIに興奮している理由を簡単に説明しよう：</p>
<ul>
<li><p><strong>Gemini CLIは、Apache 2.0のオープンソースであり、完全に無料である：</strong>Gemini CLIは、GoogleのトップレベルのGemini 2.0 Flashモデルに無料で接続します。個人のGoogleアカウントでログインするだけで、Gemini Code Assistにアクセスできます。プレビュー期間中は、1分あたり60リクエスト、1日あたり1,000リクエストまで、すべて無料でご利用いただけます。</p></li>
<li><p><strong>まさにマルチタスクの大国だ：</strong>プログラミング（最も得意とする分野）だけでなく、ファイル管理、コンテンツ生成、スクリプト制御、さらにはディープリサーチの機能まで扱える。</p></li>
<li><p><strong>軽量です：</strong>ターミナルスクリプトにシームレスに組み込むことも、スタンドアロンエージェントとして使用することもできます。</p></li>
<li><p><strong>コンテキストの長さが長い：</strong>100万トークンのコンテキスト（約75万語）を持つため、小規模プロジェクトのコードベース全体を1回で取り込むことができる。</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">開発者がIDEを捨ててAI搭載端末を選ぶ理由<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>なぜこのようなターミナルベースのツールに熱狂的なのだろうか？開発者であれば、おそらくこの痛みを感じたことがあるだろう：従来のIDEは素晴らしい機能を満載しているが、ワークフローの複雑さが勢いを削いでいる。一つの関数をリファクタリングしたい？コードを選択し、右クリックしてコンテキストメニューを表示し、「リファクタリング」に移動し、特定のリファクタリングタイプを選択し、ダイアログボックスでオプションを設定し、最後に変更を適用する必要がある。</p>
<p><strong>ターミナルAIツールは、すべての操作を自然言語コマンドに効率化することで、このワークフローを変えた。</strong>コマンド構文を覚える代わりに、「<em>この関数をリファクタリングして可読性を高めるのを手伝って</em>ください」と言うだけで、ツールがプロセス全体を処理するのを見ることができる。</p>
<p>これは単なる便利さではなく、考え方の根本的な転換なのだ。複雑な技術的操作が自然言語での会話になり、ツールの仕組みよりもビジネスロジックに集中できるようになるのだ。</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">クロードコードかGemini CLIか？副操縦士を賢く選ぼう<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeも非常に人気があり、使いやすく、以前は一世を風靡していたため、新しいGemini CLIと比べてどうなのでしょうか？この2つをどのように選択すべきでしょうか？これらのAIコーディングツールを詳しく見てみよう。</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1.コスト：無料 vs 有料</strong></h3><ul>
<li><p><strong>Gemini CLIは</strong>、どのGoogleアカウントでも完全に無料で利用でき、1日あたり1,000リクエスト、1分あたり60リクエストを提供し、課金の設定は必要ない。</p></li>
<li><p><strong>Claude Codeは</strong>、Anthropicのアクティブなサブスクリプションを必要とし、有料モデルに従っているが、商用プロジェクトにとって価値のあるエンタープライズレベルのセキュリティとサポートが含まれている。</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2.コンテキストウィンドウ：どれだけのコードを見ることができるか？</strong></h3><ul>
<li><p><strong>Gemini CLI:</strong>100万トークン（約75万語）</p></li>
<li><p><strong>クロードコード：</strong>約20万トークン（約15万語）</p></li>
</ul>
<p>より大きなコンテキストウィンドウは、応答生成時にモデルがより多くの入力内容を参照することを可能にする。また、マルチターンダイアログにおいて、会話の一貫性を維持するのに役立ち、会話全体をよりよくモデルに記憶させることができます。</p>
<p>基本的に、Gemini CLIは、小規模から中規模のプロジェクト全体を1回のセッションで分析することができ、大規模なコードベースやクロスファイルの関係を理解するのに理想的です。Claude Codeは、特定のファイルや関数にフォーカスしているときに効果的です。</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3.コード品質とスピードの比較</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>機能</strong></td><td><strong>Gemini CLI</strong></td><td><strong>クロードコード</strong></td><td><strong>備考</strong></td></tr>
<tr><td><strong>コーディング速度</strong></td><td>8.5/10</td><td>7.2/10</td><td>ジェミニの方がコード生成が速い</td></tr>
<tr><td><strong>コーディング品質</strong></td><td>7.8/10</td><td>9.1/10</td><td>クロードはより高品質なコードを生成する</td></tr>
<tr><td><strong>エラー処理</strong></td><td>7.5/10</td><td>8.8/10</td><td>クロードの方がエラー処理に優れている</td></tr>
<tr><td><strong>コンテキスト理解</strong></td><td>9.2/10</td><td>7.9/10</td><td>ジェミニの方がメモリが長い</td></tr>
<tr><td><strong>多言語サポート</strong></td><td>8.9/10</td><td>8.5/10</td><td>どちらも優れている</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLIは</strong>コードを高速に生成し、大きなコンテキストを理解することに優れているため、ラピッドプロトタイピングに最適である。</p></li>
<li><p><strong>Claude Codeは</strong>、正確さとエラー処理に優れており、コードの品質が重要な生産環境に向いている。</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4.プラットフォームのサポート：どこで実行できますか？</strong></h3><ul>
<li><p><strong>Gemini CLIは</strong>、初日からWindows、macOS、Linuxで同じように動作する。</p></li>
<li><p><strong>Claude Codeは</strong>、まずmacOS向けに最適化され、他のプラットフォームでも動作しますが、最高のエクスペリエンスはやはりMacです。</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5.認証とアクセス</strong></h3><p><strong>Claude Codeは</strong>、アクティブなAnthropicサブスクリプション（Pro、Max、Team、Enterprise）またはAWS Bedrock/Vertex AIを通じたAPIアクセスを必要とします。これは、使い始める前に課金を設定する必要があることを意味する。</p>
<p><strong>Gemini CLIは</strong>、個人のGoogleアカウント保有者向けに、1日あたり1,000リクエスト、フル機能のGemini 2.0 Flashモデルへの1分あたり60リクエストなど、寛大な無料プランを提供している。より高い制限または特定のモデルを必要とするユーザーは、APIキーを介してアップグレードすることができます。</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6.機能比較の概要</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>機能</strong></td><td><strong>クロードコード</strong></td><td><strong>ジェミニCLI</strong></td></tr>
<tr><td>コンテキストウィンドウの長さ</td><td>200Kトークン</td><td>1Mトークン</td></tr>
<tr><td>マルチモーダルサポート</td><td>制限あり</td><td>強力（画像、PDFなど）</td></tr>
<tr><td>コード理解</td><td>優秀</td><td>優秀</td></tr>
<tr><td>ツール統合</td><td>ベーシック</td><td>リッチ（MCPサーバー）</td></tr>
<tr><td>セキュリティ</td><td>エンタープライズグレード</td><td>スタンダード</td></tr>
<tr><td>無料リクエスト</td><td>制限あり</td><td>60/分、1000/日</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">いつClaude CodeとGemini CLIを選択するか？<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>さて、両ツールの主な機能を比較したところで、それぞれをどのような場合に選ぶべきかについて、私の考えを述べます：</p>
<p><strong>以下の場合はGemini CLIを選択してください：</strong></p>
<ul>
<li><p>費用対効果と迅速な実験が優先される場合</p></li>
<li><p>大規模なコンテキストウィンドウを必要とする大規模なプロジェクトに取り組んでいる場合</p></li>
<li><p>最先端のオープンソースツールが好きな場合</p></li>
<li><p>クロスプラットフォームの互換性が重要</p></li>
<li><p>強力なマルチモーダル機能を求めている</p></li>
</ul>
<p><strong>次のような場合は、クロードコードをお選びください：</strong></p>
<ul>
<li><p>高品質のコード生成が必要な場合</p></li>
<li><p>ミッションクリティカルな商用アプリケーションを構築する場合</p></li>
<li><p>エンタープライズレベルのサポートは譲れない</p></li>
<li><p>コード品質がコストに優先する</p></li>
<li><p>主にmacOSで作業している</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">クロードコードとGemini CLIの比較：セットアップとベストプラクティス<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>さて、これら2つのターミナルAIツールの機能を基本的に理解したところで、それらを使い始める方法とベストプラクティスについて詳しく見ていこう。</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">クロードコードのセットアップとベストプラクティス</h3><p><strong>インストール：</strong>Claude CodeにはnpmとNode.jsバージョン18以上が必要です。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>クロードコードのベストプラクティス</strong></p>
<ol>
<li><strong>アーキテクチャの理解から始めましょう：</strong>新しいプロジェクトに取り組むときは、Claude Code に自然言語を使って最初に全体の構造を理解する手助けをしてもらいましょう。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>具体的に、コンテキストを提供しましょう：</strong>コンテキストを提供すればするほど、Claude Codeの提案はより正確になります。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>デバッグや最適化に活用しましょう：</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>まとめ：</strong></p>
<ul>
<li><p>簡単なコードの説明から始めて、徐々に複雑なコード生成タスクに移行することで、漸進的な学習を利用する。</p></li>
<li><p>クロード・コードは以前の議論を覚えているので、会話の文脈を維持する。</p></li>
<li><p>問題を報告し、ツールの改善に役立てるために、<code translate="no">bug</code> コマンドを使ってフィードバックを提供する。</p></li>
<li><p>データ収集ポリシーを確認し、機密性の高いコードに注意することで、セキュリティを意識した状態を維持する。</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Gemini CLIのセットアップとベストプラクティス</h3><p><strong>インストール：</strong>Claude Codeと同様に、Gemini CLIにはnpmとNode.jsバージョン18以上が必要です。</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>個人アカウントをお持ちの場合は、Googleアカウントでログインしてください。それ以上の制限については、APIキーを設定してください：</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gemini CLIのベストプラクティス：</strong></p>
<ol>
<li><strong>アーキテクチャを理解することから始めましょう：</strong>Claude Codeのように、新しいプロジェクトに取り組む際には、Gemini CLIに自然言語を使って最初に全体の構造を理解する手助けをしてもらいましょう。Gemini CLIは、100万トークンのコンテキストウィンドウをサポートしており、大規模なコードベース分析に非常に効果的であることに注意してください。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>マルチモーダル機能を活用する：</strong>Gemini CLIが真に輝くのはここです。</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>ツールの統合を探る：</strong>Gemini CLIは、機能強化のために複数のツールやMCPサーバーと統合することができます。</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>まとめ</strong></p>
<ul>
<li><p>プロジェクト指向であること：Geminiを常にプロジェクトディレクトリから起動することで、より良いコンテキストを理解することができます。</p></li>
<li><p>テキストだけでなく、画像、ドキュメント、その他のメディアを入力として使用することで、マルチモーダル機能を最大限に活用する。</p></li>
<li><p>外部ツールとMCPサーバーを接続することで、ツールの統合を探求する。</p></li>
<li><p>内蔵のGoogle検索を使用して最新情報を検索し、検索機能を強化する。</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">AIコードは到着した時点で古い。Milvusで修正する方法。<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Claude CodeやGemini CLIのようなAIコーディングツールは強力だが、盲点がある</em><em>。</em></p>
<p><em>現実はどうだろう？ほとんどのモデルは、そのままでは時代遅れのパターンを生成する。数ヶ月前、時には数年前にトレーニングされたものだ。そのため、コードを素早く生成することはできても、それが</em> <strong><em>最新のAPI</em></strong><em>、フレームワーク、SDKのバージョンを</em><em>反映しているかどうかは保証できない。</em></p>
<p><strong>実際の例：</strong></p>
<p>Cursorにmilvusへの接続方法を尋ねると、このようになるかもしれない：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>このメソッドが非推奨になったことを除けば、問題なさそうだ。推奨されるアプローチは<code translate="no">MilvusClient</code> を使うことだが、ほとんどのアシスタントはまだそれを知らない。</p>
<p>あるいはOpenAI自身のAPIを使う。多くのツールは、2024年3月に非推奨となったメソッドである<code translate="no">openai.ChatCompletion</code> を使って、<code translate="no">gpt-3.5-turbo</code> を提案します。それはより遅く、よりコストがかかり、より悪い結果をもたらします。しかしLLMはそれを知らない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">解決策Milvus MCP + RAGによるリアルタイム・インテリジェンス</h3><p>これを解決するために、我々は2つの強力なアイデアを組み合わせた：</p>
<ul>
<li><p><strong>モデル・コンテキスト・プロトコル（MCP）</strong>：自然言語を通して生きたシステムと対話するためのエージェントツールの標準</p></li>
<li><p><strong>検索拡張生成（RAG）</strong>：最も新鮮で関連性の高いコンテンツをオンデマンドで取得します。</p></li>
</ul>
<p>これらを組み合わせることで、あなたのアシスタントをより賢く、最新のものにします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>その仕組みは次のとおりです：</strong></p>
<ol>
<li><p>ドキュメント、SDKリファレンス、APIガイドを前処理します。</p></li>
<li><p>オープンソースのベクトルデータベース<a href="https://milvus.io/"><strong>Milvusに</strong></a>ベクトル埋め込みとして保存します。</p></li>
<li><p>開発者が質問をすると（例えば、"Milvusに接続するにはどうすればよいですか？"）、システムは以下を行います：</p>
<ul>
<li><p><strong>セマンティック検索を</strong>実行</p></li>
<li><p>最も関連性の高いドキュメントと例を取得します。</p></li>
<li><p>それらをアシスタントのプロンプトコンテキストに挿入します。</p></li>
</ul></li>
</ol>
<ol start="4">
<li>結果：<strong>今現在何が正しいかを正確に</strong>反映したコード提案</li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">ライブコード、ライブドキュメント</h3><p><strong>MilvusのMCPサーバーを</strong>使えば、このフローをコーディング環境に直接差し込むことができます。アシスタントはより賢くなります。コードはより良くなります。開発者はフローを維持できる。</p>
<p>Cursorのエージェントモード、Context7、DeepWikiなどの他のセットアップと比較テストしました。その違いは？Milvus + MCPはプロジェクトを要約するだけでなく、プロジェクトと同期し続けます。</p>
<p>実際の動作をご覧ください：<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">あなたのバイブコーディングが古いコードを生成する理由とMilvus MCPでそれを修正する方法 </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">コーディングの未来はカンバセーショナル-そしてそれは今まさに起きている<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>端末のAI革命は始まったばかりだ。これらのツールが成熟するにつれて、開発ワークフローとの統合がさらに緊密になり、コード品質が向上し、MCP+RAGのようなアプローチによる通貨問題の解決策が見えてくるだろう。</p>
<p>品質でクロード・コードを選ぶにせよ、アクセシビリティとパワーでGemini CLIを選ぶにせよ、1つはっきりしていることは、<strong>自然言語プログラミングはここにとどまるという</strong>ことだ。問題は、これらのツールを採用するかどうかではなく、開発ワークフローに効果的に統合する方法だ。</p>
<p>私たちは、構文を覚えることからコードと会話をすることへの根本的なシフトを目の当たりにしている。<strong>コーディングの未来は会話型であり、それは今まさにあなたの端末で起きているのだ。</strong></p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Spring Bootとmilvusでプロダクション対応のAIアシスタントを構築する</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">Zilliz MCPサーバーベクターデータベースへの自然言語アクセス - Zilliz blog</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：ベクターデータベースの実世界ベンチマーク - Milvusブログ</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">あなたのVibeコーディングが古いコードを生成する理由とMilvus MCPでそれを修正する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">AIデータベースにSQLが不要な理由 </a></p></li>
</ul>
