---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: Milvusへの貢献の仕方：開発者のためのクイックスタート
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvusは</strong></a>、高次元のベクトルデータを管理するために設計されたオープンソースの<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a>です。インテリジェントな検索エンジン、推薦システム、または検索拡張世代<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）のような次世代AIソリューションを構築しているかどうかにかかわらず、Milvusはあなたの指先で使える強力なツールです。</p>
<p>しかし、Milvusを真に前進させるのは、その高度な技術だけではありません。オープンソースプロジェクトであるMilvusは、皆様のような開発者の方々の貢献により繁栄し、進化しています。コミュニティからのバグフィックス、機能追加、パフォーマンス向上のたびに、Milvusはより速く、よりスケーラブルで、より信頼性の高いものとなっています。</p>
<p>Milvusは、オープンソースに情熱を持っている方、勉強熱心な方、AIに永続的な影響を与えたいと考えている方にとって、貢献するのに最適な場所です。このガイドでは、開発環境のセットアップから最初のプルリクエストの提出までのプロセスを説明します。また、あなたが直面するかもしれない一般的な課題を強調し、それらを克服するための解決策を提供します。</p>
<p>飛び込む準備はできましたか？一緒にMilvusをより良いものにしていきましょう！</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Milvus開発環境のセットアップ<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>まず最初に、開発環境のセットアップを行います。Milvusをローカルマシンにインストールするか、Dockerを使用するか、どちらの方法も簡単ですが、すべてを稼働させるためにいくつかのサードパーティの依存関係をインストールする必要があります。</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">ローカルでMilvusをビルドする</h3><p>ゼロからビルドするのが好きなら、ローカルマシンでMilvusをビルドするのは簡単です。Milvusはすべての依存関係を<code translate="no">install_deps.sh</code> スクリプトにバンドルしているため、簡単に構築することができます。以下が簡単なセットアップです：</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Dockerを使ったMilvusの構築</h3><p>Dockerを使用する場合、ビルド済みのコンテナでコマンドを実行する方法と、開発用コンテナを立ち上げてより実践的なアプローチを行う方法の2つがあります。</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>プラットフォームに関する注意事項：</strong>Linuxであれば、コンパイルの問題はほとんどない。しかし、Macユーザー、特にM1チップを使用しているユーザーは、途中でいくつかのバンプに遭遇するかもしれない。最も一般的な問題を解決するためのガイドがあります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：OSの設定</em></p>
<p>セットアップガイドの詳細は、公式<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus開発ガイドを</a>ご覧ください。</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">よくある問題とその解決方法</h3><p>Milvus開発環境のセットアップが計画通りに進まないことがあります。ご心配なく、よくある問題とその解決方法を簡単にまとめました。</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew：サイドバンドパケット読み込み中の予期せぬ切断</h4><p>Homebrewを使用していて、このようなエラーが表示された場合：</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>対策：</strong> <code translate="no">http.postBuffer</code> のサイズを大きくする：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Homebrewをインストールした後に<code translate="no">Brew: command not found</code> 、Gitのユーザー設定を変更する必要があるかもしれません：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: 認証情報の取得エラー</h4><p>Dockerで作業していると、こんなエラーが出るかもしれません：</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修正してください：</strong><code translate="no">~/.docker/config.json</code> を開き、<code translate="no">credsStore</code> フィールドを削除してください。</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python：imp' という名前のモジュールがありません。</h4><p>Pythonがこのエラーを投げる場合、Python 3.12で<code translate="no">imp</code> モジュールが削除されたためです。古い依存関係ではまだこのモジュールが使われています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修正してください：</strong>Python 3.11 にダウングレードしてください：</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: 認識できない引数またはコマンドが見つからない</h4><p><strong>問題</strong> <code translate="no">Unrecognized arguments: --install-folder conan</code> が表示される場合、互換性のない Conan のバージョンを使っている可能性があります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修正</strong>Conan 1.61 にダウングレードする：</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>問題</strong> <code translate="no">Conan command not found</code> が表示される場合、Pythonの環境が正しくセットアップされていない可能性があります。</p>
<p><strong>修正:</strong>Python の bin ディレクトリを<code translate="no">PATH</code> に追加してください：</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM：宣言されていない識別子 'kSecFormatOpenSSL' の使用</h4><p>このエラーは通常、LLVMの依存関係が古いことを意味します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修正してください：</strong>LLVM 15を再インストールし、環境変数を更新してください：</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>プロのヒント</strong></p>
<ul>
<li><p>ツールのバージョンと依存関係を常にダブルチェックしてください。</p></li>
<li><p>それでもうまくいかない場合は、<a href="https://github.com/milvus-io/milvus/issues"> MilvusのGitHub Issuesページで</a>答えを見つけたり、助けを求めたりすることができます。</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">C++とGoの統合のためのVS Codeの設定</h3><p>VS CodeでC++とGoを連携させるのは、思ったより簡単です。適切な設定を行うことで、Milvusの開発プロセスを効率化することができます。<code translate="no">user.settings</code> ファイルに以下の設定を加えるだけです：</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>以下がこの設定です：</p>
<ul>
<li><p><strong>環境変数：</strong>環境変数:<code translate="no">PKG_CONFIG_PATH</code>,<code translate="no">LD_LIBRARY_PATH</code>,<code translate="no">RPATH</code> のパスを設定します。これらはビルドやテストの際にライブラリの場所を特定するために重要です。</p></li>
<li><p><strong>Goツールの統合：</strong>Goの言語サーバー（<code translate="no">gopls</code> ）を有効にし、<code translate="no">gofumpt</code> （フォーマット用）や<code translate="no">golangci-lint</code> （リンティング用）などのツールを設定します。</p></li>
<li><p><strong>テストのセットアップ：</strong> <code translate="no">testTags</code> を追加し、テスト実行のタイムアウトを 10 分に増やします。</p></li>
</ul>
<p>このセットアップを追加すると、C++ と Go のワークフローがシームレスに統合されます。常に環境を調整することなく、Milvusをビルドし、テストするのに最適です。</p>
<p><strong>プロからのアドバイス</strong></p>
<p>この設定を行った後、クイックテストビルドを実行し、すべてが動作することを確認してください。何かおかしいと感じたら、パスとVS CodeのGoエクステンションのバージョンを再確認してください。</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Milvusのデプロイ<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは<a href="https://milvus.io/docs/install-overview.md">3つのデプロイモード（Lite</a><strong>、Standalone</strong>、<strong>Distributed）を</strong>サポートしています<a href="https://milvus.io/docs/install-overview.md">。</a></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Liteは</strong></a>Pythonライブラリであり、Milvusの超軽量バージョンです。Pythonやノートブック環境でのラピッドプロトタイピングや小規模なローカル実験に最適です。</p></li>
<li><p><strong>Milvus Standaloneは</strong>Milvusのシングルノードデプロイメントオプションで、クライアントサーバーモデルを使用します。MilvusはMySQLに相当し、Milvus LiteはSQLiteに相当します。</p></li>
<li><p><strong>Milvus Distributedは</strong>Milvusの分散モードで、大規模なベクターデータベースシステムやベクターデータプラットフォームを構築する企業ユーザに最適です。</p></li>
</ul>
<p>これらの導入はすべて3つのコアコンポーネントに依存しています：</p>
<ul>
<li><p><strong>Milvus:</strong>ベクトルデータベースエンジン。</p></li>
<li><p><strong>Etcd：</strong>Milvusの内部メタデータを管理するメタデータエンジン。</p></li>
<li><p><strong>MinIO:</strong>データの永続性を保証するストレージエンジン。</p></li>
</ul>
<p>Milvusを<strong>Distributed</strong>モードで実行する場合、<strong>Pub</strong>/Subメカニズムによる分散メッセージ処理のための<strong>Pulsarも</strong>組み込まれ、高スループット環境でのスケーラビリティを実現している。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvusスタンドアロン</h3><p>スタンドアロン・モードは、シングル・インスタンスのセットアップ用に調整されており、テストや小規模アプリケーションに最適です。導入方法は以下の通り：</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (旧Milvus Cluster)</h3><p>より大きなデータセットと高いトラフィックに対して、Distributedモードは水平スケーラビリティを提供します。複数のMilvusインスタンスを1つのまとまったシステムに統合します。Kubernetes上で動作し、Milvusスタック全体を管理する<strong>Milvus Operatorを</strong>使用すると、デプロイが簡単になります。</p>
<p>ステップバイステップのガイダンスが必要ですか？<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvusインストールガイドを</a>ご覧ください。</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">エンドツーエンド(E2E)テストの実行<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのデプロイメントが稼働したら、E2Eテストによってその機能を簡単にテストできます。これらのテストはセットアップのあらゆる部分をカバーし、すべてが期待通りに動作することを確認します。テストの実行方法は次のとおりです：</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>詳細な手順とトラブルシューティングのヒントについては、<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus開発ガイドを</a>参照してください。</p>
<p><strong>プロからのアドバイス</strong></p>
<p>Milvusを初めてお使いになる場合は、Milvus Liteまたはスタンドアロンモードから始めて、Milvusの機能を実感してください。</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">コードの提出<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>おめでとうございます！すべての単体テストとE2Eテストをクリア（または必要に応じてデバッグと再コンパイル）しました。最初のビルドには時間がかかるかもしれませんが、今後のビルドはもっと速くなります。これで、Milvusに貢献する準備が整いました！</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">プルリクエスト(PR)を課題にリンクする</h3><p>MilvusへのPRは、関連するissueと紐付ける必要があります。ここではその方法を説明します：</p>
<ul>
<li><p><strong>既存の課題をチェックする</strong><a href="https://github.com/milvus-io/milvus/issues"> Milvusのissue trackerに</a>目を通し、あなたの変更に関連するissueが既に存在しないか確認してください。</p></li>
<li><p><strong>新しい課題を作成する：</strong>関連する課題が存在しない場合、新しい課題を作成し、あなたが解決しようとしている問題や追加しようとしている機能を説明してください。</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">コードを投稿する</h3><ol>
<li><p><strong>リポジトリをフォークする：</strong>GitHubアカウントに<a href="https://github.com/milvus-io/milvus"> Milvusリポジトリを</a>フォークしてください。</p></li>
<li><p><strong>ブランチを作成します：</strong>ローカルでフォークをクローンし、新しいブランチを作成します。</p></li>
<li><p><strong>Signed-off-by署名付きでコミットします：</strong>オープンソースライセンスに準拠するため、コミットに<code translate="no">Signed-off-by</code> 署名が含まれていることを確認します：</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>このステップでは、あなたの貢献がDeveloper Certificate of Origin (DCO) に沿っていることを証明します。</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>役立つリソース</strong></h4><p>詳細なステップとベストプラクティスについては、<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvusコントリビューションガイドを</a>ご覧ください。</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">貢献の機会<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの立ち上げと運用が完了しました！デプロイメントモードを検討し、テストを実行し、コードを掘り下げたことでしょう。<a href="https://github.com/milvus-io/milvus">Milvusに</a>貢献し、AIと<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データの</a>未来を形作るお手伝いをしましょう。</p>
<p>あなたのスキルに関わらず、Milvusコミュニティにはあなたの居場所があります！複雑な課題を解決するのが好きな開発者であれ、きれいなドキュメントやエンジニアリングブログを書くのが好きな技術ライターであれ、デプロイメントを改善したいKubernetes愛好家であれ、あなたが影響を与える方法があります。</p>
<p>以下の募集をご覧いただき、あなたにぴったりの仕事を見つけてください。すべての貢献はMilvusを前進させるのに役立ちます。あなたの次のプルリクエストが、次のイノベーションの波となるかもしれません。さあ、何を待っていますか？さあ、始めましょう！🚀</p>
<table>
<thead>
<tr><th>プロジェクト</th><th>対象</th><th>ガイドライン</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>,<a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>囲碁開発者</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>、<a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP開発者</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>、<a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>、<a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>他の言語に興味のある開発者</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">PyMilvusへの貢献</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Kubernetes愛好家</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">milvus-docs</a>、<a href="https://github.com/milvus-io/community">milvus-io/コミュニティ/ブログ</a></td><td>技術ライター</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">milvusドキュメントへの貢献</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>ウェブ開発者</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">最後に<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、<a href="https://milvus.io/docs/install-pymilvus.md">Python</a>（PyMilvus）、<a href="https://milvus.io/docs/install-java.md">Java</a>、<a href="https://milvus.io/docs/install-go.md">Go</a>、<a href="https://milvus.io/docs/install-node.md">Node.jsといった</a>様々なSDKを提供しており、簡単に開発を始めることができます。Milvusに貢献することはコードだけではありません-それは活気に満ちた革新的なコミュニティに参加することです。</p>
<p>Milvus開発者コミュニティへようこそ！私たちは、皆さんがどのようなものを創り上げるのか待ちきれません。</p>
<h2 id="Further-Reading" class="common-anchor-header">さらに読む<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">MilvusのAI開発者コミュニティに参加する</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースとは？</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. スタンドアロン vs. 分散：あなたに合ったモードは？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">MilvusでAIアプリを作る: チュートリアルとノートブック</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">GenAIアプリのためのトップパフォーマンスAIモデル｜Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAGとは？</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">ジェネレーティブAIリソースハブ｜Zilliz</a></p></li>
</ul>
