---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: ベクターデータベースに話しかける：自然言語によるmilvusの管理
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Serverは、MCPを通じてMilvusとClaude
  CodeやCursorなどのAIコーディングアシスタントを直接接続します。Milvusを自然言語で管理することができます。
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>AIアシスタントに<em>「ベクターデータベースの全てのコレクションを表示</em>」や<em>「このテキストに似たドキュメントを検索</em>」と伝えるだけで、実際に動作してくれたらと思ったことはありませんか？</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Serverは</strong></a>、モデルコンテキストプロトコル(MCP)を介して、MilvusベクトルデータベースをClaude DesktopやCursor IDEのようなAIコーディングアシスタントに直接接続することで、これを可能にします。<code translate="no">pymilvus</code> 、コードを書く代わりに、自然言語による会話を通じてMilvus全体を管理することができます。</p>
<ul>
<li><p>Milvus MCPサーバーなし：pymilvus SDKを使用したPythonスクリプトによるベクトル検索</p></li>
<li><p>Milvus MCP Serverあり："Find documents similar to this text in my collection."（私のコレクションからこのテキストに似た文書を検索する</p></li>
</ul>
<p>👉<strong>GitHubリポジトリ:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>そして、もしあなたが<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(マネージドMilvus)を使っているのであれば、私たちはあなたもカバーしています。このブログの最後に、Zilliz Cloudとシームレスに動作するマネージドオプション、<strong>Zilliz MCP Serverも</strong>ご紹介します。それでは、さっそく見ていきましょう。</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Milvus MCP Serverで得られるもの<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Serverは、AIアシスタントに以下の機能を提供します：</p>
<ul>
<li><p>ベクターコレクションの<strong>リストと探索</strong></p></li>
<li><p>意味的類似性を用いた<strong>ベクトルの検索</strong></p></li>
<li><p>カスタムスキーマによる<strong>新しいコレクションの作成</strong></p></li>
<li><p>ベクトルデータの<strong>挿入と管理</strong></p></li>
<li><p>コードを書かずに<strong>複雑なクエリを実行</strong></p></li>
<li><p>その他</p></li>
</ul>
<p>まるでデータベースの専門家と会話しているかのような自然な会話。機能の全リストは<a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">こちらのレポを</a>ご覧ください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">クイックスタートガイド<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p><strong>必須</strong></p>
<ul>
<li><p>Python 3.10以上</p></li>
<li><p>実行中のMilvusインスタンス（ローカルまたはリモート）</p></li>
<li><p><a href="https://github.com/astral-sh/uv">uvパッケージマネージャ</a>（推奨）</p></li>
</ul>
<p><strong>サポートされているAIアプリケーション</strong></p>
<ul>
<li><p>クロードデスクトップ</p></li>
<li><p>カーソルIDE</p></li>
<li><p>MCP互換アプリケーション</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">使用する技術スタック</h3><p>このチュートリアルでは、以下の技術スタックを使用します：</p>
<ul>
<li><p><strong>言語ランタイム：</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>パッケージマネージャ</strong>UV</p></li>
<li><p><strong>IDE：</strong>カーソル</p></li>
<li><p><strong>MCP サーバ:</strong>mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong>Claude 3.7</p></li>
<li><p><strong>ベクターデータベース：</strong>Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">ステップ1: 依存関係のインストール</h3><p>まず、uvパッケージマネージャをインストールします：</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>または</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>インストールの確認</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">ステップ2：Milvusのセットアップ</h3><p><a href="https://milvus.io/">Milvusは</a>、<a href="https://zilliz.com/">Zillizによって</a>作成されたAIワークロードのためのオープンソースのベクトルデータベースネイティブです。数百万から数十億のベクトルレコードを扱えるように設計されており、GitHubで36,000以上のスターを獲得している。この基盤の上に、ZillizはMilvusのフルマネージドサービス<a href="https://zilliz.com/cloud">であるZilliz Cloudも</a>提供しています<a href="https://zilliz.com/cloud">。</a>Milvusはクラウドネイティブアーキテクチャで、使いやすさ、コスト効率、セキュリティのために設計されています。</p>
<p>Milvusの導入要件については、<a href="https://milvus.io/docs/prerequisite-docker.md">docサイトのこちらのガイドを</a>ご覧ください。</p>
<p><strong>最小要件</strong></p>
<ul>
<li><p><strong>ソフトウェア</strong>Docker、Docker Compose</p></li>
<li><p><strong>RAM:</strong>16GB以上</p></li>
<li><p><strong>ディスク:</strong>100GB 以上</p></li>
</ul>
<p>デプロイ用YAMLファイルをダウンロードする：</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvusを起動します：</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusインスタンスが<code translate="no">http://localhost:19530</code> 。</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">ステップ3: MCPサーバのインストール</h3><p>MCPサーバをクローンしてテストします：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Cursorにサーバを登録する前に、依存関係をインストールし、ローカルで検証することをお勧めします：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>サーバーが正常に起動したら、AIツールの設定は完了です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">ステップ4：AIアシスタントの設定</h3><p><strong>オプション A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header"><code translate="no">[claude.ai/download](http://claude.ai/download)</code> からClaude Desktopをインストールします。</h4></li>
<li><p>設定ファイルを開きます：</p></li>
</ol>
<ul>
<li>macOS<code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>設定ファイルを開きます：<code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>この設定を追加します：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>クロードデスクトップを再起動する</li>
</ol>
<p><strong>オプション B: カーソル IDE</strong></p>
<ol>
<li><p>カーソル設定を開く → 機能 → MCP</p></li>
<li><p>新しいグローバルMCPサーバーを追加する (<code translate="no">.cursor/mcp.json</code> が作成されます)</p></li>
<li><p>この設定を追加します：</p></li>
</ol>
<p>注意: 実際のファイル構造に合わせてパスを調整してください。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>パラメータ</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> はuv実行ファイルへのパスです。</li>
<li><code translate="no">--directory</code> クローンされたプロジェクトのパス</li>
<li><code translate="no">--milvus-uri</code> はMilvusサーバのエンドポイントです。</li>
</ul>
<ol start="4">
<li>カーソルを再起動するか、ウィンドウをリロードします。</li>
</ol>
<p><code translate="no">uv</code> P<strong>ro tip:</strong>macOS/Linuxでは<code translate="no">which uv</code> 、Windowsでは<code translate="no">where uv</code> 。</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">ステップ 5: 実際に操作してみる</h3><p>設定が完了したら、以下の自然言語コマンドを試してみてください：</p>
<ul>
<li><p><strong>データベースを調べる：</strong>"Milvusデータベースにどんなコレクションがありますか？"</p></li>
<li><p><strong>新しいコレクションを作成する：</strong>"タイトル(文字列)、コンテンツ(文字列)、埋め込み用の768次元ベクトルフィールドを持つ'articles'というコレクションを作成する"</p></li>
<li><p><strong>類似コンテンツを検索する：</strong>"私の記事コレクションの中で、'機械学習アプリケーション'に最も似ている5つの記事を見つける"</p></li>
<li><p><strong>データを挿入する：</strong>"AI Trends 2024 "というタイトルと "Artificial intelligence continues to evolve... "というコンテンツを持つ新しい記事を記事コレクションに追加する"</p></li>
</ul>
<p><strong>以前は30分以上のコーディングが必要だったものが、今では数秒の会話で済むようになった。</strong></p>
<p>定型文を書いたり、APIを学んだりすることなく、Milvusをリアルタイムでコントロールし、自然言語でアクセスすることができます。</p>
<h2 id="Troubleshooting" class="common-anchor-header">トラブルシューティング<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>MCPツールが表示されない場合、AIアプリケーションを完全に再起動し、<code translate="no">which uv</code> でUVパスを確認し、<code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code> でサーバーを手動でテストしてください。</p>
<p>接続エラーについては、Milvusが起動していることを<code translate="no">docker ps | grep milvus</code> で確認し、<code translate="no">localhost</code> の代わりに<code translate="no">127.0.0.1</code> を使用してみて、ポート 19530 がアクセス可能であることを確認してください。</p>
<p>認証の問題が発生した場合、Milvusが認証を必要とする場合は環境変数<code translate="no">MILVUS_TOKEN</code> を設定し、試行する操作のパーミッションを確認してください。</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">管理された代替手段Zilliz MCPサーバ<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>オープンソースの<strong>Milvus MCP Serverは</strong>、ローカルまたはセルフホストでMilvusを導入するための素晴らしいソリューションです。しかし、Milvusのクリエイターによって構築されたエンタープライズグレードのフルマネージドサービスで<a href="https://zilliz.com/cloud">あるZilliz Cloudを</a>使用しているのであれば、<a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Serverという</strong></a>代替手段があります。</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloudは</a>、スケーラブルでパフォーマンスが高く、セキュアなクラウドネイティブベクターデータベースを提供することで、Milvusインスタンスを管理するためのオーバーヘッドを排除します。<strong>Zilliz MCP Serverは</strong>Zilliz Cloudと直接統合し、その機能をMCP互換ツールとして公開します。つまり、Claude、Cursor、または他のMCP対応環境のAIアシスタントが、自然言語を使用してZilliz Cloudワークスペースを照会、管理、オーケストレーションできるようになります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>定型的なコードは必要ありません。タブを切り替える必要もありません。手動でRESTやSDKコールを書くこともありません。リクエストを言うだけで、あとはアシスタントにお任せください。</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Zilliz MCPサーバーを始める</h3><p>ZillizのMCPサーバーを使えば、自然言語で簡単にベクターインフラを構築することができます：</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloudにサインアップする</strong></a>。</p></li>
<li><p>GitHub<a href="http://github.com/zilliztech/zilliz-mcp-server">リポジトリから<strong>Zilliz MCP Serverをインストール</strong> </a>します。</p></li>
<li><p><strong>MCP対応アシスタント</strong>（Claude、Cursorなど）をZilliz Cloudインスタンスに接続するように<strong>設定</strong>する。</p></li>
</ol>
<p>これで、プロダクショングレードのインフラを備えたパワフルなベクター検索に、わかりやすい英語でアクセスできるようになります。</p>
<h2 id="Wrapping-Up" class="common-anchor-header">まとめ<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>以上、Milvusを自然言語対応の<em>ベクターデータベースに</em>する方法をご紹介しました。もうSDKのドキュメントを読み漁ったり、コレクションや検索を実行するために定型文を書いたりする必要はありません。</p>
<p>Milvusをローカルで動かしていても、Zillizクラウドを使っていても、MCPサーバーはAIアシスタントにプロのようにベクターデータを管理するツールボックスを提供します。やりたいことを入力するだけで、あとはClaudeやCursorにお任せください。</p>
<p>AI開発ツールを起動し、「どんなコレクションがありますか？ベクタークエリーを手で書くことに戻りたいとは思わなくなるはずだ。</p>
<ul>
<li><p>ローカルのセットアップ？オープンソースの<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCPサーバーを</a>ご利用ください。</p></li>
<li><p>マネージドサービスをご希望ですか？Zilliz Cloudにサインアップし、<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP Serverを</a>ご利用ください。</p></li>
</ul>
<p>ツールは揃った。あとはAIにタイピングを任せましょう。</p>
