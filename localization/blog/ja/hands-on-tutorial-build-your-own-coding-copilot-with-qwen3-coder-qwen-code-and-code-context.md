---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: ハンズオンチュートリアル：Qwen3-Coder、Qwen Code、Code Contextを使って独自のコーディングコパイロットを構築する
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  Qwen3-Coder、Qwen Code CLI、Code
  Contextプラグインを使用して、独自のAIコーディングコパイロットを作成する方法を学びます。
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>AIコーディング・アシスタントの戦いは、急速にヒートアップしている。Anthropicの<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Claude Codeが</a>波に乗り、Googleの<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Gemini CLIが</a>ターミナルのワークフローを揺るがし、OpenAIのCodexがGitHub Copilotをパワーアップし、CursorがVS Codeユーザーを獲得し、そして<strong>今度はAlibaba CloudがQwen Codeで参入する。</strong></p>
<p>正直なところ、これは開発者にとって素晴らしいニュースだ。プレーヤーが増えるということは、より良いツール、革新的な機能、そして最も重要なことだが、高価なプロプライエタリ・ソリューションに<strong>代わるオープンソースの選択肢が</strong>増えるということだ。この最新のプレーヤーが何をもたらすのか、学んでみよう。</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">Qwen3-CoderとQwen Codeの紹介<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Alibaba Cloudは最近、<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coderを</strong></a>リリースした。<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3</strong></a>-Coderはオープンソースのエージェント型コーディングモデルで、複数のベンチマークで最先端の結果を達成している。また、Gemini CLIをベースにQwen3-Coder用に特化したパーサーを追加したオープンソースのAIコーディングCLIツールである<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Codeも</strong></a>発表した。</p>
<p>フラッグシップモデルである<strong>Qwen3-Coder-480B-A35B-Instructは</strong>、358のプログラミング言語のネイティブサポート、256Kトークンコンテキストウィンドウ（YaRN経由で1Mトークンまで拡張可能）、Claude Code、Cline、その他のコーディングアシスタントとのシームレスな統合といった、印象的な機能を提供する。</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">現代のAIコーディング・コパイロットの普遍的な盲点<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen3-Coderは強力だが、私はそのコーディング・アシスタントにもっと興味がある：<strong>Qwen Code</strong>だ。私が面白いと思ったのは、以下の点だ。革新的であるにもかかわらず、Qwen CodeはClaude CodeやGemini CLIと全く同じ制限を共有して<strong><em>いる</em></strong>。</p>
<p>例えば、Gemini CLIやQwen Codeに "このプロジェクトがユーザー認証を扱っている場所を探して "と頼んだとする。このツールは、"login "や "password "といった明らかなキーワードを探し始めるが、重要な<code translate="no">verifyCredentials()</code> 。コードベース全体をコンテキストとして与えてトークンを消費することをいとわないのでなければ（これは高価であり、時間もかかる）、これらのツールはすぐに壁にぶつかる。</p>
<p><strong><em>これが、今日のAIツールの真のギャップである、インテリジェントなコード・コンテキストの理解です。</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">セマンティックコード検索であらゆるコーディングコパイロットをスーパーチャージする<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code、Gemini CLI、Qwen Codeなど、どんなAIコーディングコパイロットでも、コードベースを本当に意味的に理解することができるとしたらどうだろう？高額なサブスクリプション料金を支払うことなく、コードとデータを完全にコントロールしながら、Cursorのような強力なものを自分のプロジェクト用に構築できるとしたらどうだろう？</p>
<p><a href="https://github.com/zilliztech/code-context"> <strong>Code Contextは、</strong></a>オープンソースのMCP互換プラグインで、あらゆるAIコーディングエージェントをコンテキストを認識する強力なツールに変える。これは、あなたのAIアシスタントに、あなたのコードベースで何年も働いてきた上級開発者の組織的記憶を与えるようなものです。Qwen Code、Claude Code、Gemini CLI、VSCodeでの作業、あるいはChromeでのコーディングのいずれを使用していても、<strong>Code Contextは</strong>あなたのワークフローにセマンティックコード検索をもたらします。</p>
<p>これがどのように機能するか見る準備はできていますか？<strong>Qwen3-Coder + Qwen Code + Code Contextを</strong>使用して、エンタープライズグレードのAIコーディングコパイロットを構築してみましょう。</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">ハンズオンチュートリアル独自のAIコーディングコパイロットを構築する<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>始める前に、以下を確認してください：</p>
<ul>
<li><p><strong>Node.js 20+が</strong>インストールされていること</p></li>
<li><p><strong>OpenAI APIキー</strong><a href="https://openai.com/index/openai-api/">(ここで入手</a>)</p></li>
<li><p>Qwen3-Coderにアクセスするための<strong>Alibaba Cloudアカウント</strong><a href="https://www.alibabacloud.com/en">(ここで入手</a>)</p></li>
<li><p>ベクターデータベース用の<strong>Zilliz Cloudアカウント</strong>（まだお持ちでない場合は、<a href="https://cloud.zilliz.com/login">こちらから</a>無料で<a href="https://cloud.zilliz.com/login">登録して</a>ください。）</p></li>
</ul>
<p><strong>注意事項1)</strong>このチュートリアルでは、Qwen3-Coderの商用版であるQwen3-Coder-Plusを使用します。もしオープンソースの方がよければ、代わりにqwen3-coder-480b-a35b-instructを使うことができる。2) Qwen3-Coder-Plus は優れたパフォーマンスと使いやすさを提供しますが、トークンの消費量が多くなります。企業の予算計画に必ず組み込んでください。</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">ステップ 1: 環境のセットアップ</h3><p>Node.jsのインストールを確認します：</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">ステップ2：Qwenコードのインストール</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>以下のようなバージョン番号が表示されたら、インストールが成功したことを意味します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">ステップ 3: Qwen Code の設定</h3><p>プロジェクトディレクトリに移動し、Qwen Code を初期化します。</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>すると、以下のようなページが表示されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>API 設定の要件</strong></p>
<ul>
<li><p>APIキー：<a href="https://modelstudio.console.alibabacloud.com/"> Alibaba Cloud Model Studioから</a>取得</p></li>
<li><p>ベースURL<code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>モデルの選択：</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (商用版、最も高機能)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (オープンソース版)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>設定後、<strong>Enterを押して</strong>次に進みます。</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">ステップ4：基本機能のテスト</h3><p>2つの実践的なテストでセットアップを検証してみましょう：</p>
<p><strong>テスト1：コードの理解</strong></p>
<p>プロンプト「このプロジェクトのアーキテクチャと主要コンポーネントを一文で要約してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plusは、このプロジェクトをMilvus上に構築された技術チュートリアルであり、RAGシステムや検索戦略などに焦点を当てたものであると説明し、要約に釘付けにした。</p>
<p><strong>テスト2：コード生成</strong></p>
<p>プロンプト"小さなテトリスゲームを作ってください"</p>
<p>Qwen3-coder-plusは、1分以内に、以下のコードを生成します：</p>
<ul>
<li><p>必要なライブラリを自動的にインストール</p></li>
<li><p>ゲームロジックの構造化</p></li>
<li><p>完全でプレイ可能な実装を作成</p></li>
<li><p>通常何時間もかけて研究するような複雑な処理をすべて行う</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これは、単なるコードの完成ではなく、アーキテクチャの意思決定と完全なソリューションの提供という、真の自律的開発を示しています。</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">ステップ5：ベクター・データベースのセットアップ</h3><p>このチュートリアルでは、ベクターデータベースとして<a href="https://zilliz.com/cloud">Zilliz Cloudを</a>使用します。</p>
<p><strong>Zillizクラスタを作成します：</strong></p>
<ol>
<li><p><a href="https://cloud.zilliz.com/"> Zilliz Cloudコンソールに</a>ログインします<a href="https://cloud.zilliz.com/"> 。</a></p></li>
<li><p>新しいクラスタを作成します。</p></li>
<li><p><strong>パブリックエンドポイントと</strong> <strong>トークンを</strong>コピーする</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">ステップ 6: コードコンテキスト統合の設定</h3><p><code translate="no">~/.qwen/settings.json</code> を作成する：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">ステップ 7: 拡張機能の有効化</h3><p>Qwen Code を再起動します：</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ctrl + T を</strong>押すと、MCP サーバー内に 3 つの新しいツールが表示されます：</p>
<ul>
<li><p><code translate="no">index-codebase</code>:リポジトリ理解のためのセマンティックインデックスを作成します。</p></li>
<li><p><code translate="no">search-code</code>:コードベース全体の自然言語コード検索</p></li>
<li><p><code translate="no">clear-index</code>:必要に応じてインデックスをリセット</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">ステップ8：完全な統合をテストする</h3><p>実際の例を挙げよう：ある大きなプロジェクトで、コード名を見直したところ、'より広いウィンドウ'はプロらしくない響きがあることがわかったので、変更することにしました。</p>
<p>プロンプト「プロフェッショナルな名前の変更が必要な、'より広いウィンドウ'に関連する関数をすべて見つけてください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>下図に示すように、qwen3-coder-plusはまず<code translate="no">index_codebase</code> ツールを呼び出し、プロジェクト全体のインデックスを作成した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、<code translate="no">index_codebase</code> ツールは、このプロジェクト内の539ファイルのインデックスを作成し、9,991チャンクに分割した。インデックスを作成した直後に、<code translate="no">search_code</code>ツールを呼び出してクエリを実行した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、修正が必要な該当ファイルが見つかったことを知らせてくれた。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最後に、Code Contextを使用して、関数、インポート、ドキュメントの命名など4つの問題を発見し、この小さな作業を完了するのに役立ちました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Contextが追加されたことで、<code translate="no">qwen3-coder-plus</code> 、よりスマートなコード検索とコーディング環境の理解が可能になりました。</p>
<h3 id="What-Youve-Built" class="common-anchor-header">構築したもの</h3><p>あなたは今、以下を組み合わせた完全なAIコーディング副操縦士を手に入れた：</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>：インテリジェントなコード生成と自律的な開発</p></li>
<li><p><strong>コードコンテキスト</strong>：既存のコードベースの意味的理解</p></li>
<li><p><strong>ユニバーサルな互換性</strong>：Claude Code、Gemini CLI、VSCodeなどで動作します。</p></li>
</ul>
<p>これは単に開発を高速化するだけでなく、レガシーの近代化、チーム間のコラボレーション、アーキテクチャの進化に対するまったく新しいアプローチを可能にします。</p>
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
    </button></h2><p>開発者として、私はClaude CodeからCursor、Gemini CLI、そしてQwen Codeまで、たくさんのAIコーディングツールを試してきた。それは、ゼロから関数を書くことではなく、複雑で厄介なレガシーコードをナビゲートし、物事がある特定の方法で行われた<em>理由を</em>突き止めることだ。</p>
<p>これが、<strong>Qwen3-Coder + Qwen Code + Code Context</strong>のセットアップが非常に魅力的な理由です。フル機能の実装を生成できるパワフルなコーディング<em>モデルと、</em>プロジェクトの履歴、構造、命名規則を実際に理解するセマンティック検索レイヤー。</p>
<p>ベクトル検索とMCPプラグインエコシステムがあれば、プロンプトウィンドウにランダムなファイルを貼り付けたり、正しいコンテキストを見つけようとしてレポジトリをスクロールしたりする必要はもうありません。平易な言葉で尋ねるだけで、関連するファイルや関数、決定事項を見つけてくれる。まるで、すべてを記憶している上級開発者のようだ。</p>
<p>はっきり言って、このアプローチは単に速いだけではないのだ。AIが単なるコーディング・ヘルパーではなく、アーキテクチャー・アシスタントであり、プロジェクト全体の状況を把握するチームメイトであるという、新しい種類の開発ワークフローへの一歩なのだ。</p>
<p><em>とはいえ...公正な警告だ：Qwen3-Coder-Plusは素晴らしいが、トークンを大量に消費する。このプロトタイプを作るだけで2000万トークンを消費した。だから今、正式にクレジットが不足しているんだ😅。</em></p>
<p>__</p>
